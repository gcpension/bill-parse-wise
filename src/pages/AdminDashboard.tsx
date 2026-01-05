import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  RefreshCw, 
  Eye, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ServiceRequest {
  id: string;
  reference_number: string | null;
  full_name: string;
  email: string;
  phone: string;
  sector: string;
  customer_type: string;
  action_type: string;
  status: string;
  current_provider: string | null;
  target_provider: string | null;
  service_address: any;
  created_at: string;
  updated_at: string;
  selected_plan_name: string | null;
  selected_plan_price: number | null;
  national_id_or_corp: string;
  company_name: string | null;
  poa: boolean | null;
  privacy_tos: boolean | null;
  fees_ack: boolean | null;
}

const statusColors: Record<string, string> = {
  awaiting_signature: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  pending: 'bg-blue-100 text-blue-800 border-blue-200',
  in_progress: 'bg-purple-100 text-purple-800 border-purple-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  closed: 'bg-gray-100 text-gray-800 border-gray-200',
};

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
  tv: 'טלוויזיה',
  electricity: 'חשמל',
  general: 'כללי',
};

export default function AdminDashboard() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching requests:', error);
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(req => 
    req.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.phone?.includes(searchTerm) ||
    req.reference_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'awaiting_signature' || r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">דשבורד ניהול</h1>
              <p className="text-muted-foreground text-sm">צפייה בכל בקשות השירות</p>
            </div>
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <ArrowRight className="h-4 w-4" />
                חזרה לאתר
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
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
                <div className="p-3 rounded-full bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">ממתינות</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-100">
                  <AlertCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                  <p className="text-sm text-muted-foreground">בטיפול</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-sm text-muted-foreground">הושלמו</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                בקשות שירות
              </CardTitle>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="חיפוש..." 
                    className="pr-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={fetchRequests}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">טוען נתונים...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-2 text-muted-foreground">
                  {searchTerm ? 'לא נמצאו תוצאות' : 'אין בקשות במערכת'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">מספר אסמכתא</TableHead>
                      <TableHead className="text-right">שם מלא</TableHead>
                      <TableHead className="text-right">טלפון</TableHead>
                      <TableHead className="text-right">אימייל</TableHead>
                      <TableHead className="text-right">סקטור</TableHead>
                      <TableHead className="text-right">סטטוס</TableHead>
                      <TableHead className="text-right">תאריך</TableHead>
                      <TableHead className="text-right">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-mono text-sm">
                          {request.reference_number || '-'}
                        </TableCell>
                        <TableCell className="font-medium">
                          {request.full_name}
                        </TableCell>
                        <TableCell dir="ltr" className="text-right">
                          {request.phone}
                        </TableCell>
                        <TableCell dir="ltr" className="text-right text-sm">
                          {request.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {sectorLabels[request.sector] || request.sector}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[request.status] || statusColors.pending}>
                            {statusLabels[request.status] || request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(request.created_at), 'dd/MM/yyyy HH:mm', { locale: he })}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              פרטי בקשה - {selectedRequest?.reference_number}
            </DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">סטטוס:</span>
                <Badge className={statusColors[selectedRequest.status]}>
                  {statusLabels[selectedRequest.status] || selectedRequest.status}
                </Badge>
              </div>

              {/* Personal Details */}
              <div className="space-y-3">
                <h3 className="font-semibold border-b pb-2">פרטים אישיים</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">שם מלא:</span>
                    <p className="font-medium">{selectedRequest.full_name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ת.ז / ח.פ:</span>
                    <p className="font-medium">{selectedRequest.national_id_or_corp}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">טלפון:</span>
                    <p className="font-medium" dir="ltr">{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">אימייל:</span>
                    <p className="font-medium" dir="ltr">{selectedRequest.email}</p>
                  </div>
                  {selectedRequest.company_name && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">שם חברה:</span>
                      <p className="font-medium">{selectedRequest.company_name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-3">
                <h3 className="font-semibold border-b pb-2">פרטי שירות</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">סקטור:</span>
                    <p className="font-medium">{sectorLabels[selectedRequest.sector] || selectedRequest.sector}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">סוג לקוח:</span>
                    <p className="font-medium">{selectedRequest.customer_type === 'private' ? 'פרטי' : 'עסקי'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">סוג פעולה:</span>
                    <p className="font-medium">{selectedRequest.action_type === 'switch' ? 'מעבר ספק' : selectedRequest.action_type}</p>
                  </div>
                  {selectedRequest.current_provider && (
                    <div>
                      <span className="text-muted-foreground">ספק נוכחי:</span>
                      <p className="font-medium">{selectedRequest.current_provider}</p>
                    </div>
                  )}
                  {selectedRequest.target_provider && (
                    <div>
                      <span className="text-muted-foreground">ספק יעד:</span>
                      <p className="font-medium">{selectedRequest.target_provider}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              {selectedRequest.service_address && (
                <div className="space-y-3">
                  <h3 className="font-semibold border-b pb-2">כתובת</h3>
                  <p className="text-sm">
                    {selectedRequest.service_address.street} {selectedRequest.service_address.number}, {selectedRequest.service_address.city}
                    {selectedRequest.service_address.zip && ` (${selectedRequest.service_address.zip})`}
                  </p>
                </div>
              )}

              {/* Plan */}
              {selectedRequest.selected_plan_name && (
                <div className="space-y-3">
                  <h3 className="font-semibold border-b pb-2">תכנית שנבחרה</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">שם תכנית:</span>
                      <p className="font-medium">{selectedRequest.selected_plan_name}</p>
                    </div>
                    {selectedRequest.selected_plan_price && (
                      <div>
                        <span className="text-muted-foreground">מחיר:</span>
                        <p className="font-medium">₪{selectedRequest.selected_plan_price}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Consents */}
              <div className="space-y-3">
                <h3 className="font-semibold border-b pb-2">הסכמות</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={selectedRequest.poa ? "default" : "secondary"}>
                    {selectedRequest.poa ? <CheckCircle className="h-3 w-3 ml-1" /> : <XCircle className="h-3 w-3 ml-1" />}
                    ייפוי כוח
                  </Badge>
                  <Badge variant={selectedRequest.privacy_tos ? "default" : "secondary"}>
                    {selectedRequest.privacy_tos ? <CheckCircle className="h-3 w-3 ml-1" /> : <XCircle className="h-3 w-3 ml-1" />}
                    תנאי שימוש
                  </Badge>
                  <Badge variant={selectedRequest.fees_ack ? "default" : "secondary"}>
                    {selectedRequest.fees_ack ? <CheckCircle className="h-3 w-3 ml-1" /> : <XCircle className="h-3 w-3 ml-1" />}
                    אישור עמלות
                  </Badge>
                </div>
              </div>

              {/* Timestamps */}
              <div className="text-xs text-muted-foreground border-t pt-4">
                <p>נוצר: {format(new Date(selectedRequest.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: he })}</p>
                <p>עודכן: {format(new Date(selectedRequest.updated_at), 'dd/MM/yyyy HH:mm:ss', { locale: he })}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
