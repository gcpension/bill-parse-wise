import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Loader2,
  Home
} from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface RequestData {
  reference_number: string;
  full_name: string;
  phone: string;
  email: string;
  sector: string;
  status: string;
  signature_status: string | null;
  target_provider: string | null;
  selected_plan_name: string | null;
  selected_plan_price: number | null;
  service_address: any;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  awaiting_signature: { 
    label: 'ממתין לחתימה', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <Clock className="h-5 w-5" />
  },
  pending: { 
    label: 'ממתין לטיפול', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <Clock className="h-5 w-5" />
  },
  in_progress: { 
    label: 'בטיפול', 
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <AlertCircle className="h-5 w-5" />
  },
  completed: { 
    label: 'הושלם', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <CheckCircle className="h-5 w-5" />
  },
  failed: { 
    label: 'נכשל', 
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: <AlertCircle className="h-5 w-5" />
  },
  closed: { 
    label: 'סגור', 
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: <CheckCircle className="h-5 w-5" />
  },
};

const sectorLabels: Record<string, string> = {
  cellular: 'סלולר',
  internet: 'אינטרנט',
  internet_isp: 'אינטרנט',
  tv: 'טלוויזיה',
  electricity: 'חשמל',
  general: 'כללי',
};

export default function CustomerRequestStatus() {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestData, setRequestData] = useState<RequestData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRequestData(null);

    if (!referenceNumber.trim()) {
      setError('נא להזין מספר אסמכתה');
      return;
    }

    if (!phone.trim()) {
      setError('נא להזין מספר טלפון');
      return;
    }

    setLoading(true);

    try {
      const { data, error: fetchError } = await supabase
        .from('service_requests')
        .select('reference_number, full_name, phone, email, sector, status, signature_status, target_provider, selected_plan_name, selected_plan_price, service_address, created_at, updated_at')
        .eq('reference_number', referenceNumber.trim().toUpperCase())
        .eq('phone', phone.trim())
        .maybeSingle();

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        setError('אירעה שגיאה בחיפוש. נסה שנית.');
        return;
      }

      if (!data) {
        setError('לא נמצאה בקשה עם הפרטים שהוזנו. ודא שמספר האסמכתה ומספר הטלפון נכונים.');
        return;
      }

      setRequestData(data);
    } catch (err) {
      console.error('Search error:', err);
      setError('אירעה שגיאה. נסה שנית.');
    } finally {
      setLoading(false);
    }
  };

  const statusInfo = requestData ? statusConfig[requestData.status] || statusConfig.pending : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30" dir="rtl">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">מעקב בקשה</h1>
              <p className="text-muted-foreground text-sm">בדוק את סטטוס הבקשה שלך</p>
            </div>
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <Home className="h-4 w-4" />
                חזרה לאתר
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              חיפוש בקשה
            </CardTitle>
            <CardDescription>
              הזן את מספר האסמכתה ומספר הטלפון שהשתמשת בהגשת הבקשה
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reference">מספר אסמכתה</Label>
                  <Input
                    id="reference"
                    placeholder="לדוגמה: CEL-PRI-ABC123"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">מספר טלפון</Label>
                  <Input
                    id="phone"
                    placeholder="050-1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    dir="ltr"
                    className="text-right"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    מחפש...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 ml-2" />
                    חפש בקשה
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {requestData && statusInfo && (
          <Card className="animate-in fade-in duration-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    בקשה: {requestData.reference_number}
                  </CardTitle>
                  <CardDescription>
                    הוגשה ב-{format(new Date(requestData.created_at), 'dd בMMMM yyyy', { locale: he })}
                  </CardDescription>
                </div>
                <Badge className={`${statusInfo.color} px-4 py-2 text-sm gap-2`}>
                  {statusInfo.icon}
                  {statusInfo.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Progress */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium mb-4">התקדמות הבקשה</h3>
                <div className="flex items-center justify-between relative">
                  {/* Progress Line */}
                  <div className="absolute top-5 right-5 left-5 h-1 bg-muted-foreground/20">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ 
                        width: requestData.status === 'completed' ? '100%' : 
                               requestData.status === 'in_progress' ? '66%' : 
                               requestData.status === 'pending' ? '33%' : '10%'
                      }}
                    />
                  </div>
                  
                  {/* Steps */}
                  {[
                    { key: 'submitted', label: 'הוגשה' },
                    { key: 'pending', label: 'ממתין' },
                    { key: 'in_progress', label: 'בטיפול' },
                    { key: 'completed', label: 'הושלם' },
                  ].map((step, index) => {
                    const stepOrder = ['awaiting_signature', 'pending', 'in_progress', 'completed'];
                    const currentIndex = stepOrder.indexOf(requestData.status);
                    const isActive = index <= currentIndex || (index === 0);
                    
                    return (
                      <div key={step.key} className="flex flex-col items-center z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {isActive ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        <span className="text-xs mt-2 text-center">{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium border-b pb-2">פרטי הבקשה</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground">סקטור</p>
                        <p className="font-medium">{sectorLabels[requestData.sector] || requestData.sector}</p>
                      </div>
                    </div>
                    {requestData.target_provider && (
                      <div className="flex items-start gap-3">
                        <ArrowRight className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground">ספק יעד</p>
                          <p className="font-medium">{requestData.target_provider}</p>
                        </div>
                      </div>
                    )}
                    {requestData.selected_plan_name && (
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground">מסלול נבחר</p>
                          <p className="font-medium">
                            {requestData.selected_plan_name}
                            {requestData.selected_plan_price && (
                              <span className="text-muted-foreground mr-1">
                                (₪{requestData.selected_plan_price}/חודש)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium border-b pb-2">פרטי קשר</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground">טלפון</p>
                        <p className="font-medium" dir="ltr">{requestData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground">אימייל</p>
                        <p className="font-medium" dir="ltr">{requestData.email}</p>
                      </div>
                    </div>
                    {requestData.service_address?.city && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-muted-foreground">כתובת</p>
                          <p className="font-medium">
                            {requestData.service_address.street} {requestData.service_address.number}, {requestData.service_address.city}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Message */}
              <div className={`rounded-lg p-4 ${statusInfo.color}`}>
                <div className="flex items-start gap-3">
                  {statusInfo.icon}
                  <div>
                    <p className="font-medium">{statusInfo.label}</p>
                    <p className="text-sm opacity-80">
                      {requestData.status === 'awaiting_signature' && 'הבקשה ממתינה לחתימה דיגיטלית להשלמת התהליך.'}
                      {requestData.status === 'pending' && 'הבקשה התקבלה ומועברת לטיפול. נעדכן אותך בהקדם.'}
                      {requestData.status === 'in_progress' && 'הבקשה נמצאת בטיפול. הצוות שלנו עובד על המעבר.'}
                      {requestData.status === 'completed' && 'הבקשה הושלמה בהצלחה! תודה שבחרת בנו.'}
                      {requestData.status === 'failed' && 'נתקלנו בבעיה בעיבוד הבקשה. נציג יצור איתך קשר.'}
                      {requestData.status === 'closed' && 'הבקשה נסגרה.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Last Update */}
              <p className="text-xs text-muted-foreground text-center">
                עודכן לאחרונה: {format(new Date(requestData.updated_at), 'dd/MM/yyyy HH:mm', { locale: he })}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-medium">צריך עזרה?</h3>
              <p className="text-sm text-muted-foreground">
                לא מצאת את הבקשה שלך? יש לך שאלות? צור איתנו קשר
              </p>
              <div className="flex justify-center gap-4 mt-4">
                <Link to="/contact">
                  <Button variant="outline">
                    <Mail className="h-4 w-4 ml-2" />
                    צור קשר
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
