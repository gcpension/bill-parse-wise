import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { googleSheetsService } from '@/lib/googleSheets';
import { ExternalLink, Save, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

export const GoogleSheetsSetup = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [currentWebhook, setCurrentWebhook] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const existing = googleSheetsService.getWebhookUrl();
    if (existing && !existing.includes('webhook.site')) {
      setCurrentWebhook(existing);
      setWebhookUrl(existing);
      setIsValid(googleSheetsService.isValidZapierWebhook(existing));
    }
  }, []);

  const handleSave = () => {
    if (!webhookUrl.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הכנס כתובת webhook",
        variant: "destructive",
      });
      return;
    }

    if (!googleSheetsService.isValidZapierWebhook(webhookUrl)) {
      toast({
        title: "כתובת לא תקינה",
        description: "אנא הכנס כתובת Zapier webhook תקינה",
        variant: "destructive",
      });
      return;
    }

    googleSheetsService.setWebhookUrl(webhookUrl);
    setCurrentWebhook(webhookUrl);
    setIsValid(true);
    
    toast({
      title: "נשמר בהצלחה! ✅",
      description: "הטפסים יישלחו כעת ל-Google Sheets",
    });
  };

  const handleRemove = () => {
    googleSheetsService.setWebhookUrl('');
    setCurrentWebhook(null);
    setWebhookUrl('');
    setIsValid(false);
    
    toast({
      title: "הוסר בהצלחה",
      description: "חיבור Google Sheets הוסר",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19Z"/>
          </svg>
          חיבור Google Sheets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentWebhook && isValid ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                מחובר
              </Badge>
            </div>
            
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Google Sheets מוגדר בהצלחה! כל הטפסים יישלחו אוטומטית לגיליון שלך.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(currentWebhook, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                פתח Webhook
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemove}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                הסר חיבור
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                כדי לשלוח נתונים ל-Google Sheets, צריך להגדיר Zapier webhook
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="webhook-url">כתובת Zapier Webhook</Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                dir="ltr"
              />
            </div>

            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              שמור והפעל
            </Button>

            <Alert>
              <AlertDescription className="text-sm">
                <strong>איך להגדיר:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>צור Zap חדש ב-Zapier</li>
                  <li>בחר "Webhooks by Zapier" כטריגר</li>
                  <li>העתק את כתובת ה-Webhook והדבק כאן</li>
                  <li>חבר את ה-Webhook ל-Google Sheets</li>
                </ol>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
};