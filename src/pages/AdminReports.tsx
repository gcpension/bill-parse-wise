import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText,
  ArrowRight,
  RefreshCw,
  Calendar,
  PieChart
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { he } from 'date-fns/locale';
import { Link, Navigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

interface RequestStats {
  total: number;
  byStatus: Record<string, number>;
  bySector: Record<string, number>;
  byDay: { date: string; count: number }[];
  avgProcessingTime: number;
}

const statusLabels: Record<string, string> = {
  awaiting_signature: 'ממתין לחתימה',
  pending: 'ממתין לטיפול',
  in_progress: 'בטיפול',
  completed: 'הושלם',
  failed: 'נכשל',
  closed: 'סגור',
};

const sectorLabels: Record<string, string> = {
  cellular: 'סלולר',
  internet: 'אינטרנט',
  internet_isp: 'אינטרנט',
  tv: 'טלוויזיה',
  electricity: 'חשמל',
  general: 'כללי',
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

export default function AdminReports() {
  const { user, isAdmin, loading: authLoading } = useAdminAuth();
  const [stats, setStats] = useState<RequestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'all'>('month');

  useEffect(() => {
    if (user && isAdmin) {
      fetchStats();
    }
  }, [user, isAdmin, dateRange]);

  const fetchStats = async () => {
    setLoading(true);
    
    let query = supabase.from('service_requests').select('*');
    
    // Apply date filter
    if (dateRange === 'week') {
      query = query.gte('created_at', subDays(new Date(), 7).toISOString());
    } else if (dateRange === 'month') {
      query = query.gte('created_at', startOfMonth(new Date()).toISOString());
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
      return;
    }

    const requests = data || [];

    // Calculate stats
    const byStatus: Record<string, number> = {};
    const bySector: Record<string, number> = {};
    const byDayMap: Record<string, number> = {};
    let totalProcessingTime = 0;
    let completedCount = 0;

    requests.forEach((req) => {
      // Status counts
      byStatus[req.status] = (byStatus[req.status] || 0) + 1;
      
      // Sector counts
      const sector = req.sector === 'internet_isp' ? 'internet' : req.sector;
      bySector[sector] = (bySector[sector] || 0) + 1;
      
      // Daily counts
      const day = format(new Date(req.created_at), 'yyyy-MM-dd');
      byDayMap[day] = (byDayMap[day] || 0) + 1;

      // Processing time for completed requests
      if (req.status === 'completed') {
        const created = new Date(req.created_at).getTime();
        const updated = new Date(req.updated_at).getTime();
        totalProcessingTime += (updated - created) / (1000 * 60 * 60 * 24); // Days
        completedCount++;
      }
    });

    // Convert daily map to array with all days
    const startDate = dateRange === 'week' ? subDays(new Date(), 7) : 
                     dateRange === 'month' ? startOfMonth(new Date()) :
                     requests.length > 0 ? new Date(requests[0].created_at) : new Date();
    const endDate = new Date();
    
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    const byDay = allDays.map(date => ({
      date: format(date, 'dd/MM', { locale: he }),
      count: byDayMap[format(date, 'yyyy-MM-dd')] || 0
    }));

    setStats({
      total: requests.length,
      byStatus,
      bySector,
      byDay,
      avgProcessingTime: completedCount > 0 ? totalProcessingTime / completedCount : 0
    });
    
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  const statusChartData = stats ? Object.entries(stats.byStatus).map(([status, count]) => ({
    name: statusLabels[status] || status,
    value: count
  })) : [];

  const sectorChartData = stats ? Object.entries(stats.bySector).map(([sector, count]) => ({
    name: sectorLabels[sector] || sector,
    value: count
  })) : [];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">דוחות וסטטיסטיקות</h1>
              <p className="text-muted-foreground text-sm">ניתוח נתוני בקשות השירות</p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/admin">
                <Button variant="outline" className="gap-2">
                  <ArrowRight className="h-4 w-4" />
                  חזרה לדשבורד
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Date Range Selector */}
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">תקופה:</span>
          <div className="flex gap-2">
            {[
              { value: 'week', label: 'שבוע אחרון' },
              { value: 'month', label: 'חודש נוכחי' },
              { value: 'all', label: 'הכל' },
            ].map((option) => (
              <Button
                key={option.value}
                variant={dateRange === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateRange(option.value as any)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchStats}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : stats && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-100">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.total}</p>
                      <p className="text-sm text-muted-foreground">סה"כ בקשות</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-100">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.byStatus.completed || 0}</p>
                      <p className="text-sm text-muted-foreground">הושלמו</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-purple-100">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.byStatus.in_progress || 0}</p>
                      <p className="text-sm text-muted-foreground">בטיפול</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-amber-100">
                      <BarChart3 className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.avgProcessingTime.toFixed(1)}</p>
                      <p className="text-sm text-muted-foreground">ימים ממוצע לטיפול</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Daily Requests Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    בקשות לפי יום
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats.byDay}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          name="בקשות"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    התפלגות לפי סטטוס
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={statusChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {statusChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sector Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  התפלגות לפי סקטור
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sectorChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" fontSize={12} />
                      <YAxis type="category" dataKey="name" fontSize={12} width={80} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} name="בקשות" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Status Breakdown */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>פירוט מצב בקשות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(statusLabels).map(([status, label]) => (
                    <div key={status} className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">{stats.byStatus[status] || 0}</p>
                      <Badge variant="outline" className="mt-2">
                        {label}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
