import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Send, 
  Loader2,
  ExternalLink,
  RefreshCw,
  Settings
} from 'lucide-react';
import { GoogleSheetsSetup } from './GoogleSheetsSetup';
import TestDataSubmission from './TestDataSubmission';
import { googleSheetsService } from '@/lib/googleSheets';
import { toast } from 'sonner';

const IntegrationTestPage: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = () => {
    setConnectionStatus('checking');
    const url = googleSheetsService.getWebhookUrl();
    setWebhookUrl(url);
    
    if (url && googleSheetsService.isValidZapierWebhook(url)) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('disconnected');
    }
  };

  const runComprehensiveTest = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    const tests = [
      {
        name: 'בדיקת חיבור Webhook',
        test: async () => {
          const url = googleSheetsService.getWebhookUrl();
          if (!url) throw new Error('לא הוגדר webhook URL');
          if (!googleSheetsService.isValidZapierWebhook(url)) {
            throw new Error('כתובת webhook לא תקינה');
          }
          return 'חיבור webhook תקין';
        }
      },
      {
        name: 'שליחת נתוני בדיקה בסיסיים',
        test: async () => {
          const success = await googleSheetsService.submitToGoogleSheets({
            name: 'בדיקה אוטומטית',
            phone: '050-1234567',
            email: 'test@example.com',
            serviceType: 'סלולר',
            plan: 'מסלול בדיקה'
          });
          if (!success) throw new Error('שליחת נתונים נכשלה');
          return 'נתונים נשלחו בהצלחה';
        }
      },
      {
        name: 'בדיקת נתונים עם תווים מיוחדים',
        test: async () => {
          const success = await googleSheetsService.submitToGoogleSheets({
            name: 'משה כהן-לוי',
            phone: '052-9876543',
            email: 'test+special@example.co.il',
            serviceType: 'אינטרנט + טלוויזיה',
            plan: 'מסלול "פרימיום" 500Mbps'
          });
          if (!success) throw new Error('שליחת נתונים עם תווים מיוחדים נכשלה');
          return 'נתונים עם תווים מיוחדים נשלחו בהצלחה';
        }
      }
    ];

    const results = [];
    
    for (const test of tests) {
      try {
        const result = await test.test();
        results.push({
          name: test.name,
          status: 'success',
          message: result,
          timestamp: new Date().toLocaleString('he-IL')
        });
        toast.success(`✅ ${test.name} עבר בהצלחה`);
      } catch (error) {
        results.push({
          name: test.name,
          status: 'error',
          message: error instanceof Error ? error.message : 'שגיאה לא ידועה',
          timestamp: new Date().toLocaleString('he-IL')
        });
        toast.error(`❌ ${test.name} נכשל`);
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setTestResults(results);
    setIsRunningTests(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checking':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'connected':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">בדיקת חיבור Zapier ו-Google Sheets</h1>
        <p className="text-muted-foreground">
          דף זה מאפשר לך לבדוק ולוודא שהחיבור ל-Zapier ו-Google Sheets עובד תקין
        </p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(connectionStatus)}
              סטטוס חיבור
            </div>
            <Button variant="outline" size="sm" onClick={checkConnection}>
              <RefreshCw className="w-4 h-4 ml-1" />
              רענן
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Badge className={getStatusColor(connectionStatus)}>
              {connectionStatus === 'checking' && 'בודק חיבור...'}
              {connectionStatus === 'connected' && 'מחובר בהצלחה'}
              {connectionStatus === 'disconnected' && 'לא מחובר'}
            </Badge>
            
            {webhookUrl && (
              <div className="space-y-2">
                <p className="text-sm font-medium">כתובת Webhook נוכחית:</p>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <code className="text-xs break-all">{webhookUrl}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(webhookUrl, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Setup Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            הגדרת חיבור
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GoogleSheetsSetup />
        </CardContent>
      </Card>

      {/* Comprehensive Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            בדיקה מקיפה
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              בדיקה זו תשלח מספר נתוני בדיקה ל-webhook שלך כדי לוודא שהכל עובד תקין
            </AlertDescription>
          </Alert>

          <Button 
            onClick={runComprehensiveTest}
            disabled={isRunningTests || connectionStatus !== 'connected'}
            className="w-full"
          >
            {isRunningTests ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                מריץ בדיקות...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 ml-2" />
                הרץ בדיקה מקיפה
              </>
            )}
          </Button>

          {testResults.length > 0 && (
            <div className="space-y-3 mt-4">
              <Separator />
              <h3 className="font-medium">תוצאות בדיקה:</h3>
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {result.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1 space-y-1">
                    <div className="font-medium">{result.name}</div>
                    <div className={`text-sm ${result.status === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                      {result.message}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {result.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Test */}
      <Card>
        <CardHeader>
          <CardTitle>בדיקה פרטנית</CardTitle>
        </CardHeader>
        <CardContent>
          <TestDataSubmission />
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>הוראות לבדיקה</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              <strong>איך לבדוק שהחיבור עובד:</strong>
            </AlertDescription>
          </Alert>
          
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>וודא שיש לך Zap פעיל ב-Zapier עם webhook trigger</li>
            <li>הכנס את כתובת ה-webhook בהגדרות למעלה</li>
            <li>הרץ את הבדיקה המקיפה</li>
            <li>בדוק ב-Zapier History שה-webhook התקבל</li>
            <li>בדוק ב-Google Sheets שהנתונים הגיעו</li>
          </ol>

          <Alert>
            <AlertDescription>
              <strong>אם הבדיקה נכשלת:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>בדוק שכתובת ה-webhook נכונה</li>
                <li>וודא שה-Zap ב-Zapier מופעל (ON)</li>
                <li>בדוק שיש לך גישה לגיליון ה-Google Sheets</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationTestPage;