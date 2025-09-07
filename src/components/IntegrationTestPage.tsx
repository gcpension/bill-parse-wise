import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { googleSheetsService } from '@/lib/googleSheets';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ExternalLink, 
  TestTube,
  Webhook,
  Database,
  Send,
  Activity,
  Info,
  Globe,
  Settings
} from 'lucide-react';

const IntegrationTestPage = () => {
  const [zapierWebhookUrl, setZapierWebhookUrl] = useState('');
  const [additionalWebhookUrl, setAdditionalWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingZapier, setIsTestingZapier] = useState(false);
  const [isTestingAdditional, setIsTestingAdditional] = useState(false);
  const [zapierStatus, setZapierStatus] = useState<'idle' | 'connected' | 'error'>('idle');
  const [additionalStatus, setAdditionalStatus] = useState<'idle' | 'connected' | 'error'>('idle');

  useEffect(() => {
    const savedZapierUrl = googleSheetsService.getWebhookUrl();
    const savedAdditionalUrl = googleSheetsService.getAdditionalWebhookUrl();
    
    if (savedZapierUrl) {
      setZapierWebhookUrl(savedZapierUrl);
      setZapierStatus('connected');
    }
    
    if (savedAdditionalUrl) {
      setAdditionalWebhookUrl(savedAdditionalUrl);
      setAdditionalStatus('connected');
    }
  }, []);

  const handleSaveZapierWebhook = async () => {
    if (!zapierWebhookUrl.trim()) {
      toast.error("יש להזין כתובת Zapier webhook");
      return;
    }

    if (!googleSheetsService.isValidZapierWebhook(zapierWebhookUrl)) {
      toast.error("כתובת Webhook לא תקינה. יש להשתמש בכתובת מ-Zapier או Google Scripts");
      return;
    }

    try {
      googleSheetsService.setWebhookUrl(zapierWebhookUrl);
      setZapierStatus('connected');
      toast.success('Zapier webhook נשמר בהצלחה');
    } catch (error) {
      console.error('Error saving Zapier webhook:', error);
      toast.error('שגיאה בשמירת ה-webhook');
      setZapierStatus('error');
    }
  };

  const handleSaveAdditionalWebhook = async () => {
    if (!additionalWebhookUrl.trim()) {
      googleSheetsService.setAdditionalWebhookUrl('');
      setAdditionalWebhookUrl('');
      setAdditionalStatus('idle');
      toast.success('Additional webhook הוסר');
      return;
    }

    try {
      googleSheetsService.setAdditionalWebhookUrl(additionalWebhookUrl);
      setAdditionalStatus('connected');
      toast.success('Additional webhook נשמר בהצלחה');
    } catch (error) {
      console.error('Error saving additional webhook:', error);
      toast.error('שגיאה בשמירת ה-webhook');
      setAdditionalStatus('error');
    }
  };

  const testZapierConnection = async () => {
    if (!zapierWebhookUrl) {
      toast.error("יש להזין כתובת Zapier webhook לפני הבדיקה");
      return;
    }

    setIsTestingZapier(true);
    console.log("Testing Zapier webhook:", zapierWebhookUrl);

    try {
      const testData = {
        name: "בדיקת חיבור Zapier",
        phone: "050-1234567",
        email: "test@example.com",
        serviceType: "בדיקה",
        plan: "חבילת בדיקה",
        timestamp: new Date().toISOString(),
        test: true
      };

      const success = await googleSheetsService.submitToGoogleSheets(testData);
      
      if (success) {
        setZapierStatus('connected');
        toast.success("החיבור ל-Zapier עובד! בדקו את Task History ב-Zapier ואת Google Sheets.");
      } else {
        setZapierStatus('error');
        toast.error("החיבור ל-Zapier נכשל. בדקו את כתובת ה-webhook ואת הגדרות Zapier.");
      }
    } catch (error) {
      console.error("Error testing Zapier webhook:", error);
      setZapierStatus('error');
      toast.error("שגיאה בבדיקת החיבור ל-Zapier.");
    } finally {
      setIsTestingZapier(false);
    }
  };

  const testAdditionalConnection = async () => {
    if (!additionalWebhookUrl) {
      toast.error("יש להזין כתובת Additional webhook לפני הבדיקה");
      return;
    }

    setIsTestingAdditional(true);
    console.log("Testing Additional webhook:", additionalWebhookUrl);

    try {
      const response = await fetch(additionalWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          test: true,
          message: "בדיקת חיבור Additional webhook",
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin
        })
      });

      setAdditionalStatus('connected');
      toast.success("החיבור ל-Additional webhook נשלח! (בדקו את היעד לוודא קליטה)");
      
    } catch (error) {
      console.error("Error testing additional webhook:", error);
      setAdditionalStatus('error');
      toast.error("שגיאה בבדיקת החיבור ל-Additional webhook.");
    } finally {
      setIsTestingAdditional(false);
    }
  };

  const runComprehensiveTest = async () => {
    if (!zapierWebhookUrl && !additionalWebhookUrl) {
      toast.error("יש להגדיר לפחות webhook אחד לפני הרצת הבדיקה המקיפה");
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Running comprehensive analysis data test...");
      
      // Simulate analysis data from /analyze page
      const comprehensiveAnalysisData = {
        // Meta information
        flow: 'comprehensive_test',
        source_page: '/integration-test',
        triggered_from: window.location.origin,
        timestamp: new Date().toISOString(),
        active_categories: ['חשמל', 'אינטרנט', 'סלולר'],
        
        // Totals
        total_monthly_amount: 450,
        total_monthly_savings: 120,
        total_annual_savings: 1440,

        // Electricity
        electricity_active: true,
        electricity_current_provider: 'חברת חשמל',
        electricity_monthly_amount: 200,
        electricity_account_details: '123456789',
        electricity_recommended_plan_name: 'תוכנית חסכון בחשמל',
        electricity_recommended_price: 150,
        electricity_monthly_savings: 50,
        electricity_annual_savings: 600,

        // Internet
        internet_active: true,
        internet_current_provider: 'בזק',
        internet_monthly_amount: 150,
        internet_account_details: '987654321',
        internet_recommended_plan_name: 'אינטרנט מהיר 100',
        internet_recommended_price: 120,
        internet_monthly_savings: 30,
        internet_annual_savings: 360,

        // Cellular
        cellular_active: true,
        cellular_current_provider: 'פלאפון',
        cellular_monthly_amount: 100,
        cellular_account_details: '555444333',
        cellular_recommended_plan_name: 'חבילה ללא הגבלה',
        cellular_recommended_price: 60,
        cellular_monthly_savings: 40,
        cellular_annual_savings: 480,

        // TV - not active
        tv_active: false,

        // Test metadata
        test: true,
        test_type: 'comprehensive_analysis_simulation'
      };

      console.log("Sending comprehensive analysis test data:", comprehensiveAnalysisData);
      
      const success = await googleSheetsService.submitAnalysisData(comprehensiveAnalysisData);
      
      if (success) {
        toast.success("בדיקה מקיפה הושלמה בהצלחה! ✅ הנתונים נשלחו לכל ה-webhooks המוגדרים. בדקו את היעדים.");
        if (zapierWebhookUrl) setZapierStatus('connected');
        if (additionalWebhookUrl) setAdditionalStatus('connected');
      } else {
        toast.error("הבדיקה המקיפה נכשלה - אין webhooks מוגדרים או שהשליחה נכשלה");
      }
      
    } catch (error) {
      console.error("Comprehensive test failed:", error);
      toast.error("שגיאה בבדיקה המקיפה. עיינו ב-Console לפרטים נוספים.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: 'idle' | 'connected' | 'error') => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: 'idle' | 'connected' | 'error') => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: 'idle' | 'connected' | 'error') => {
    switch (status) {
      case 'connected': return 'מחובר';
      case 'error': return 'שגיאה';
      default: return 'לא מוגדר';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">בדיקת אינטגרציות - Webhooks</h1>
          <p className="text-muted-foreground text-lg">
            הגדירו ובדקו חיבורים לשליחת נתוני הטפסים ל-Google Sheets ו-webhooks נוספים
          </p>
        </div>

        {/* Instructions Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>הוראות:</strong> הזינו את כתובות ה-webhooks, שמרו אותן ובצעו בדיקת חיבור. לאחר מכן הריצו בדיקה מקיפה לוודא שהכל עובד.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Zapier/Google Sheets Webhook */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(zapierStatus)}`}></div>
                <Database className="h-6 w-6" />
                Google Sheets (Zapier)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(zapierStatus)}
                  <span className="font-medium">{getStatusText(zapierStatus)}</span>
                </div>
                {zapierWebhookUrl && (
                  <Badge variant="secondary" className="font-mono text-xs">
                    {zapierWebhookUrl.substring(0, 30)}...
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="zapier-webhook">כתובת Zapier Webhook</Label>
                <Input
                  id="zapier-webhook"
                  type="url"
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  value={zapierWebhookUrl}
                  onChange={(e) => setZapierWebhookUrl(e.target.value)}
                  className="font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSaveZapierWebhook}
                    variant="outline"
                    size="sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    שמור
                  </Button>
                  <Button 
                    onClick={testZapierConnection}
                    disabled={isTestingZapier || !zapierWebhookUrl}
                    size="sm"
                  >
                    {isTestingZapier && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    <TestTube className="h-4 w-4 mr-2" />
                    בדוק חיבור
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Webhook */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(additionalStatus)}`}></div>
                <Globe className="h-6 w-6" />
                Webhook נוסף (אופציונלי)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(additionalStatus)}
                  <span className="font-medium">{getStatusText(additionalStatus)}</span>
                </div>
                {additionalWebhookUrl && (
                  <Badge variant="secondary" className="font-mono text-xs">
                    {additionalWebhookUrl.substring(0, 30)}...
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="additional-webhook">כתובת Webhook נוסף</Label>
                <Input
                  id="additional-webhook"
                  type="url"
                  placeholder="https://your-webhook-url.com/endpoint"
                  value={additionalWebhookUrl}
                  onChange={(e) => setAdditionalWebhookUrl(e.target.value)}
                  className="font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSaveAdditionalWebhook}
                    variant="outline"
                    size="sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    שמור
                  </Button>
                  <Button 
                    onClick={testAdditionalConnection}
                    disabled={isTestingAdditional || !additionalWebhookUrl}
                    size="sm"
                  >
                    {isTestingAdditional && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    <TestTube className="h-4 w-4 mr-2" />
                    בדוק חיבור
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comprehensive Testing */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <TestTube className="h-6 w-6" />
              בדיקה מקיפה
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              בדיקה זו שולחת נתוני דוגמה מלאים כפי שיישלחו מעמוד הניתוח, כולל כל השדות והקטגוריות.
            </p>
            
            <Button 
              onClick={runComprehensiveTest}
              disabled={isLoading || (!zapierWebhookUrl && !additionalWebhookUrl)}
              size="lg"
              className="w-full"
            >
              {isLoading && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
              <Send className="h-5 w-5 mr-2" />
              הרץ בדיקה מקיפה
            </Button>
          </CardContent>
        </Card>

        {/* Instructions and Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <ExternalLink className="h-6 w-6" />
              הוראות ובדיקות
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">אחרי הרצת הבדיקות:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li><strong>Zapier:</strong> עברו ל-Zapier Task History ובדקו שהנתונים התקבלו</li>
                <li><strong>Google Sheets:</strong> בדקו שהנתונים נוספו לגיליון</li>
                <li><strong>Additional Webhook:</strong> בדקו ביעד שהגדרתם שהנתונים הגיעו</li>
                <li><strong>Console:</strong> בדקו ב-Developer Tools שאין שגיאות</li>
              </ul>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-semibold">עמודות בגיליון Google Sheets:</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>מטא נתונים:</strong> flow, source_page, timestamp, active_categories</p>
                <p><strong>חשמל:</strong> electricity_active, electricity_current_provider, electricity_monthly_amount, electricity_recommended_plan_name, electricity_monthly_savings</p>
                <p><strong>אינטרנט:</strong> internet_active, internet_current_provider, internet_monthly_amount, internet_recommended_plan_name, internet_monthly_savings</p>
                <p><strong>סלולר:</strong> cellular_active, cellular_current_provider, cellular_monthly_amount, cellular_recommended_plan_name, cellular_monthly_savings</p>
                <p><strong>טלוויזיה:</strong> tv_active, tv_current_provider, tv_monthly_amount, tv_recommended_plan_name, tv_monthly_savings</p>
                <p><strong>סיכומים:</strong> total_monthly_amount, total_monthly_savings, total_annual_savings</p>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://zapier.com/app/history', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Zapier History
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('/analyze', '_blank')}
              >
                בדוק בעמוד הניתוח
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntegrationTestPage;