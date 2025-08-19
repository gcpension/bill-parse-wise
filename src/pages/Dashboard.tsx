import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingDown, 
  TrendingUp, 
  Calendar, 
  Lightbulb,
  Upload,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  ExpenseCategory, 
  ParsedExpense, 
  MonthlyStats, 
  SavingRecommendation 
} from '@/types';
import { EXPENSE_CATEGORIES } from '@/lib/categories';
import { formatCurrency, getChangeColor, getChangeIcon } from '@/lib/utils';

// Mock data for demo purposes
const mockExpenses: ParsedExpense[] = [
  {
    id: '1',
    category: EXPENSE_CATEGORIES[0], // electricity
    amount: 320,
    currency: '₪',
    description: 'חשמל - חודש מרץ',
    fileName: 'electricity_march.pdf',
    confidence: 0.92
  },
  {
    id: '2',
    category: EXPENSE_CATEGORIES[1], // internet
    amount: 89,
    currency: '₪',
    description: 'אינטרנט בזק',
    fileName: 'bezeq_internet.jpg',
    confidence: 0.88
  }
];

const mockMonthlyStats: MonthlyStats[] = EXPENSE_CATEGORIES.map((cat, index) => ({
  category: cat,
  currentMonth: [320, 89, 65, 180, 95, 120][index] || 0,
  previousMonth: [290, 92, 70, 175, 88, 125][index] || 0,
  change: [30, -3, -5, 5, 7, -5][index] || 0,
  changePercent: [10.3, -3.3, -7.1, 2.9, 8.0, -4.0][index] || 0,
}));

const mockRecommendations: SavingRecommendation[] = [
  {
    id: '1',
    category: EXPENSE_CATEGORIES[0],
    title: 'החלפת נורות ל-LED',
    description: 'החלפת נורות רגילות בנורות LED יכולה לחסוך עד 80% מצריכת החשמל לתאורה',
    monthlySavings: 45,
    annualSavings: 540,
    difficulty: 'easy',
    priority: 1
  },
  {
    id: '2',
    category: EXPENSE_CATEGORIES[1],
    title: 'שינוי תוכנית אינטרנט',
    description: 'מעבר לתוכנית אינטרנט מהירה יותר ויותר חסכונית',
    monthlySavings: 25,
    annualSavings: 300,
    difficulty: 'medium',
    priority: 2
  }
];

export const Dashboard = () => {
  const [expenses] = useState<ParsedExpense[]>(mockExpenses);
  const [monthlyStats] = useState<MonthlyStats[]>(mockMonthlyStats);
  const [recommendations] = useState<SavingRecommendation[]>(mockRecommendations);
  const { toast } = useToast();

  const totalCurrentMonth = monthlyStats.reduce((sum, stat) => sum + stat.currentMonth, 0);
  const totalPreviousMonth = monthlyStats.reduce((sum, stat) => sum + stat.previousMonth, 0);
  const totalChange = totalCurrentMonth - totalPreviousMonth;
  const totalChangePercent = totalPreviousMonth > 0 ? (totalChange / totalPreviousMonth) * 100 : 0;

  const totalMonthlySavings = recommendations.reduce((sum, rec) => sum + rec.monthlySavings, 0);
  const totalAnnualSavings = recommendations.reduce((sum, rec) => sum + rec.annualSavings, 0);

  const chartData = monthlyStats.map(stat => ({
    name: stat.category.nameHebrew,
    current: stat.currentMonth,
    previous: stat.previousMonth,
    color: stat.category.color
  }));

  const pieData = monthlyStats
    .filter(stat => stat.currentMonth > 0)
    .map(stat => ({
      name: stat.category.nameHebrew,
      value: stat.currentMonth,
      color: stat.category.color
    }));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'hard': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">דשבורד חיסכון</h1>
          <p className="text-muted-foreground">
            סקירת עלויות והמלצות חיסכון עבור החודש הנוכחי
          </p>
        </div>
        
        {expenses.length === 0 && (
          <Link to="/upload">
            <Button>
              <Upload className="ml-2 h-4 w-4" />
              העלה חשבונית ראשונה
            </Button>
          </Link>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סה״כ החודש</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCurrentMonth)}</div>
            <div className={`flex items-center text-xs ${getChangeColor(totalChange)}`}>
              <span className="ml-1">{getChangeIcon(totalChange)}</span>
              {Math.abs(totalChangePercent).toFixed(1)}% מהחודש הקודם
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">חיסכון חודשי</CardTitle>
            <TrendingDown className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(totalMonthlySavings)}
            </div>
            <p className="text-xs text-muted-foreground">
              פוטנציאל חיסכון על בסיס ההמלצות
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">חיסכון שנתי</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(totalAnnualSavings)}
            </div>
            <p className="text-xs text-muted-foreground">
              {(totalMonthlySavings * 12).toLocaleString('he-IL')} ₪ בשנה
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">המלצות פעילות</CardTitle>
            <Lightbulb className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recommendations.length}</div>
            <p className="text-xs text-muted-foreground">
              המלצות זמינות ליישום
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Data */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
          <TabsTrigger value="categories">לפי קטגוריות</TabsTrigger>
          <TabsTrigger value="recommendations">המלצות</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>השוואה חודשית</CardTitle>
                <CardDescription>
                  השוואת עלויות בין החודש הנוכחי לקודם
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(Number(value)), '']}
                      labelFormatter={(label) => label}
                    />
                    <Bar dataKey="current" fill="hsl(var(--primary))" name="החודש" />
                    <Bar dataKey="previous" fill="hsl(var(--muted))" name="חודש קודם" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>חלוקת עלויות</CardTitle>
                <CardDescription>
                  התפלגות העלויות לפי קטגוריות
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'עלות']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4">
            {monthlyStats.map((stat) => (
              <Card key={stat.category.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: stat.category.color }}
                      />
                      <span>{stat.category.nameHebrew}</span>
                    </CardTitle>
                    <Badge variant="outline">
                      {formatCurrency(stat.currentMonth)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>החודש הקודם: {formatCurrency(stat.previousMonth)}</span>
                      <span className={getChangeColor(stat.change)}>
                        {getChangeIcon(stat.change)} {Math.abs(stat.changePercent).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={stat.previousMonth > 0 ? (stat.currentMonth / stat.previousMonth) * 100 : 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: rec.category.color }}
                      />
                      <span>{rec.title}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Badge className={getDifficultyColor(rec.difficulty)}>
                        {rec.difficulty === 'easy' ? 'קל' : rec.difficulty === 'medium' ? 'בינוני' : 'קשה'}
                      </Badge>
                      <Badge variant="outline">
                        {formatCurrency(rec.monthlySavings)}/חודש
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <div className="font-medium">חיסכון שנתי: {formatCurrency(rec.annualSavings)}</div>
                    </div>
                    <Button size="sm">
                      <Eye className="ml-2 h-4 w-4" />
                      צפה בפרטים
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {recommendations.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">אין המלצות זמינות</h3>
                  <p className="text-muted-foreground text-center">
                    העלה חשבוניות נוספות כדי לקבל המלצות מותאמות אישית לחיסכון
                  </p>
                  <Link to="/upload">
                    <Button className="mt-4">
                      <Upload className="ml-2 h-4 w-4" />
                      העלה חשבוניות
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};