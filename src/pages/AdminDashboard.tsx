import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
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
  ArrowRight,
  Download,
  FileSpreadsheet,
  Pen,
  LogOut
} from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { createHebrewPDF } from '@/lib/pdfUtils';

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
  selected_plan_features: any;
  national_id_or_corp: string;
  company_name: string | null;
  poa: boolean | null;
  privacy_tos: boolean | null;
  fees_ack: boolean | null;
  esign_ok: boolean | null;
  signature_status: string | null;
  signature_data: string | null;
  current_meter_number: string | null;
  current_account_number: string | null;
  current_customer_number: string | null;
  current_phone_number: string | null;
  current_sim_number: string | null;
  current_line_number: string | null;
  current_subscriber_number: string | null;
  current_decoder_number: string | null;
  additional_notes: string | null;
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
  const [showSignaturePreview, setShowSignaturePreview] = useState(false);
  const [previewSignature, setPreviewSignature] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, signOut } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin-login');
  };

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

  // Export to Excel with Hebrew support
  const exportToExcel = () => {
    const excelData = filteredRequests.map(req => ({
      'מספר אסמכתא': req.reference_number || '-',
      'שם מלא': req.full_name,
      'תעודת זהות / ח.פ': req.national_id_or_corp,
      'טלפון': req.phone,
      'אימייל': req.email,
      'סקטור': sectorLabels[req.sector] || req.sector,
      'סוג לקוח': req.customer_type === 'private' ? 'פרטי' : 'עסקי',
      'סוג פעולה': req.action_type === 'switch' ? 'מעבר ספק' : req.action_type,
      'ספק נוכחי': req.current_provider || '-',
      'ספק יעד': req.target_provider || '-',
      'סטטוס': statusLabels[req.status] || req.status,
      'כתובת - עיר': req.service_address?.city || '-',
      'כתובת - רחוב': req.service_address?.street || '-',
      'כתובת - מספר': req.service_address?.number || '-',
      'שם חברה': req.company_name || '-',
      'תכנית נבחרה': req.selected_plan_name || '-',
      'מחיר תכנית': req.selected_plan_price || '-',
      'ייפוי כוח': req.poa ? 'כן' : 'לא',
      'אישור תנאים': req.privacy_tos ? 'כן' : 'לא',
      'אישור עמלות': req.fees_ack ? 'כן' : 'לא',
      'חתימה דיגיטלית': req.esign_ok ? 'כן' : 'לא',
      'סטטוס חתימה': req.signature_status || '-',
      'הערות': req.additional_notes || '-',
      'תאריך יצירה': format(new Date(req.created_at), 'dd/MM/yyyy HH:mm', { locale: he }),
      'תאריך עדכון': format(new Date(req.updated_at), 'dd/MM/yyyy HH:mm', { locale: he }),
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Set RTL and column widths
    ws['!cols'] = Object.keys(excelData[0] || {}).map(() => ({ wch: 20 }));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'בקשות שירות');
    
    // Generate filename with date
    const fileName = `בקשות_שירות_${format(new Date(), 'dd-MM-yyyy')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast({
      title: 'הקובץ הורד בהצלחה',
      description: `${fileName}`,
    });
  };

  // Generate comprehensive PDF with all details and signature
  const generateFullPDF = async (request: ServiceRequest) => {
    const title = `ייפוי כוח ובקשת מעבר ספק - ${request.reference_number || 'טיוטה'}`;
    
    const content: string[] = [
      '=== ייפוי כוח ===',
      '',
      'אני החתום/ה מטה, נותן/ת בזאת ייפוי כוח לחברת "השוואת מחירים" לפעול בשמי ולטפל במעבר ספק כמפורט להלן.',
      '',
      '=== פרטי הלקוח ===',
      '',
      `שם מלא: ${request.full_name}`,
      `תעודת זהות / ח.פ: ${request.national_id_or_corp}`,
      `טלפון: ${request.phone}`,
      `דוא"ל: ${request.email}`,
      request.company_name ? `שם חברה: ${request.company_name}` : '',
      `סוג לקוח: ${request.customer_type === 'private' ? 'פרטי' : 'עסקי'}`,
      '',
      '=== כתובת שירות ===',
      '',
      request.service_address?.street ? `רחוב: ${request.service_address.street} ${request.service_address.number || ''}` : '',
      request.service_address?.city ? `עיר: ${request.service_address.city}` : '',
      request.service_address?.zip ? `מיקוד: ${request.service_address.zip}` : '',
      '',
      '=== פרטי המעבר ===',
      '',
      `סקטור: ${sectorLabels[request.sector] || request.sector}`,
      `סוג פעולה: ${request.action_type === 'switch' ? 'מעבר ספק' : request.action_type}`,
      request.current_provider ? `ספק נוכחי: ${request.current_provider}` : '',
      request.target_provider ? `ספק יעד: ${request.target_provider}` : '',
      request.current_account_number ? `מספר חשבון נוכחי: ${request.current_account_number}` : '',
      request.current_customer_number ? `מספר לקוח נוכחי: ${request.current_customer_number}` : '',
      request.current_meter_number ? `מספר מונה: ${request.current_meter_number}` : '',
      request.current_phone_number ? `מספר טלפון נוכחי: ${request.current_phone_number}` : '',
      request.current_sim_number ? `מספר SIM: ${request.current_sim_number}` : '',
      '',
      '=== תכנית שנבחרה ===',
      '',
      request.selected_plan_name ? `שם התכנית: ${request.selected_plan_name}` : 'לא נבחרה תכנית ספציפית',
      request.selected_plan_price ? `מחיר: ₪${request.selected_plan_price} לחודש` : '',
      '',
      '=== הצהרות והסכמות ===',
      '',
      `✓ אישור ייפוי כוח: ${request.poa ? 'כן' : 'לא'}`,
      `✓ אישור תנאי שימוש ופרטיות: ${request.privacy_tos ? 'כן' : 'לא'}`,
      `✓ אישור עמלות ודמי ביטול: ${request.fees_ack ? 'כן' : 'לא'}`,
      `✓ הסכמה לחתימה דיגיטלית: ${request.esign_ok ? 'כן' : 'לא'}`,
      '',
      '=== תנאים והגבלות ===',
      '',
      '1. אני מאשר/ת כי הפרטים המופיעים במסמך זה הם נכונים ומדויקים.',
      '2. אני מסכים/ה כי החברה תפעל בשמי מול הספקים הרלוונטיים.',
      '3. אני מבין/ה כי תהליך המעבר עשוי לקחת עד 10 ימי עסקים.',
      '4. ידוע לי כי יתכנו דמי ביטול מהספק הנוכחי.',
      '5. אני מאשר/ת קבלת עדכונים בנוגע לתהליך המעבר.',
      '',
      request.additional_notes ? `=== הערות נוספות ===\n\n${request.additional_notes}` : '',
      '',
      '=== פרטי הבקשה ===',
      '',
      `מספר אסמכתא: ${request.reference_number || 'טרם הוקצה'}`,
      `סטטוס: ${statusLabels[request.status] || request.status}`,
      `תאריך הגשה: ${format(new Date(request.created_at), 'dd/MM/yyyy HH:mm', { locale: he })}`,
      '',
      '=== חתימה ===',
      '',
      request.signature_data ? '✓ המסמך נחתם דיגיטלית' : '⏳ ממתין לחתימה',
      request.signature_status === 'signed' ? `תאריך חתימה: ${format(new Date(request.updated_at), 'dd/MM/yyyy HH:mm', { locale: he })}` : '',
      '',
      '________________________________',
      `חתימת הלקוח: ${request.full_name}`,
      '',
    ].filter(line => line !== '');

    const pdf = await createHebrewPDF(title, content);
    
    // Add signature image if exists
    if (request.signature_data) {
      const pageHeight = pdf.internal.pageSize.height;
      try {
        pdf.addImage(request.signature_data, 'PNG', 100, pageHeight - 60, 50, 25);
      } catch (error) {
        console.log('Could not add signature image');
      }
    }
    
    const fileName = `בקשה_${request.reference_number || request.id}_${format(new Date(), 'dd-MM-yyyy')}.pdf`;
    pdf.save(fileName);
    
    toast({
      title: 'PDF הורד בהצלחה',
      description: fileName,
    });
  };

  // View signature
  const viewSignature = (signatureData: string) => {
    setPreviewSignature(signatureData);
    setShowSignaturePreview(true);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">דשבורד ניהול</h1>
              <p className="text-muted-foreground text-sm">
                {user?.email && <span>מחובר: {user.email}</span>}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={exportToExcel}
                disabled={filteredRequests.length === 0}
              >
                <FileSpreadsheet className="h-4 w-4" />
                ייצוא Excel
              </Button>
              <Link to="/">
                <Button variant="outline" className="gap-2">
                  <ArrowRight className="h-4 w-4" />
                  חזרה לאתר
                </Button>
              </Link>
              <Button 
                variant="destructive" 
                className="gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                יציאה
              </Button>
            </div>
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
                      <TableHead className="text-right">סקטור</TableHead>
                      <TableHead className="text-right">מסלול נבחר</TableHead>
                      <TableHead className="text-right">סטטוס</TableHead>
                      <TableHead className="text-right">חתימה</TableHead>
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
                        <TableCell>
                          <Badge variant="outline">
                            {sectorLabels[request.sector] || request.sector}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.selected_plan_name ? (
                            <div className="text-sm">
                              <span className="font-medium">{request.selected_plan_name}</span>
                              {request.selected_plan_price && (
                                <span className="text-muted-foreground mr-1">
                                  (₪{request.selected_plan_price})
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[request.status] || statusColors.pending}>
                            {statusLabels[request.status] || request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={request.signature_status === 'signed' ? 'default' : 'secondary'}>
                            {request.signature_status === 'signed' ? 'נחתם' : 'ממתין'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(request.created_at), 'dd/MM/yyyy', { locale: he })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                              title="צפייה"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {request.signature_data && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => viewSignature(request.signature_data!)}
                                title="צפה בחתימה"
                              >
                                <Pen className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => generateFullPDF(request)}
                              title="הורד PDF"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
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
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              פרטי בקשה - {selectedRequest?.reference_number}
            </DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                {selectedRequest.signature_data && (
                  <Button 
                    onClick={() => viewSignature(selectedRequest.signature_data!)}
                    className="gap-2"
                  >
                    <Pen className="h-4 w-4" />
                    צפה בחתימה
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={() => generateFullPDF(selectedRequest)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  הורד PDF מלא
                </Button>
              </div>

              {/* Status */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">סטטוס:</span>
                  <Badge className={statusColors[selectedRequest.status]}>
                    {statusLabels[selectedRequest.status] || selectedRequest.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">חתימה:</span>
                  <Badge variant={selectedRequest.signature_status === 'signed' ? 'default' : 'secondary'}>
                    {selectedRequest.signature_status === 'signed' ? 'נחתם' : 'ממתין לחתימה'}
                  </Badge>
                </div>
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
                  {selectedRequest.current_account_number && (
                    <div>
                      <span className="text-muted-foreground">מספר חשבון:</span>
                      <p className="font-medium">{selectedRequest.current_account_number}</p>
                    </div>
                  )}
                  {selectedRequest.current_customer_number && (
                    <div>
                      <span className="text-muted-foreground">מספר לקוח:</span>
                      <p className="font-medium">{selectedRequest.current_customer_number}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              {selectedRequest.service_address && (
                <div className="space-y-3">
                  <h3 className="font-semibold border-b pb-2">כתובת שירות</h3>
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
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground">שם תכנית:</span>
                        <p className="font-medium">{selectedRequest.selected_plan_name}</p>
                      </div>
                      {selectedRequest.selected_plan_price && (
                        <div>
                          <span className="text-muted-foreground">מחיר:</span>
                          <p className="font-medium">₪{selectedRequest.selected_plan_price} לחודש</p>
                        </div>
                      )}
                    </div>
                    {selectedRequest.selected_plan_features && selectedRequest.selected_plan_features.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">תכונות התכנית:</span>
                        <ul className="mt-1 space-y-1">
                          {selectedRequest.selected_plan_features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Consents */}
              <div className="space-y-3">
                <h3 className="font-semibold border-b pb-2">הסכמות והצהרות</h3>
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
                  <Badge variant={selectedRequest.esign_ok ? "default" : "secondary"}>
                    {selectedRequest.esign_ok ? <CheckCircle className="h-3 w-3 ml-1" /> : <XCircle className="h-3 w-3 ml-1" />}
                    חתימה דיגיטלית
                  </Badge>
                </div>
              </div>

              {/* Additional Notes */}
              {selectedRequest.additional_notes && (
                <div className="space-y-3">
                  <h3 className="font-semibold border-b pb-2">הערות נוספות</h3>
                  <p className="text-sm whitespace-pre-wrap">{selectedRequest.additional_notes}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="text-xs text-muted-foreground border-t pt-4">
                <p>נוצר: {format(new Date(selectedRequest.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: he })}</p>
                <p>עודכן: {format(new Date(selectedRequest.updated_at), 'dd/MM/yyyy HH:mm:ss', { locale: he })}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Signature Preview Dialog */}
      <Dialog open={showSignaturePreview} onOpenChange={setShowSignaturePreview}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pen className="h-5 w-5" />
              צפייה בחתימה
            </DialogTitle>
          </DialogHeader>
          
          {previewSignature && (
            <div className="space-y-4">
              <div className="border-2 rounded-lg p-4 bg-white">
                <img 
                  src={previewSignature} 
                  alt="חתימת הלקוח" 
                  className="max-w-full h-auto mx-auto"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                חתימה דיגיטלית שהתקבלה מהלקוח
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
