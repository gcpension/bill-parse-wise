import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { googleSheetsService } from '@/lib/googleSheets';
import { toast } from 'sonner';

const DemoWebhookSetup: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [isSetup, setIsSetup] = useState(false);

  useEffect(() => {
    // Generate a demo webhook URL for testing
    const demoWebhookUrl = `https://webhook.site/${generateUniqueId()}`;
    setWebhookUrl(demoWebhookUrl);
    
    // Set it in the service
    googleSheetsService.setWebhookUrl(demoWebhookUrl);
    setIsSetup(true);
    
    toast.success('הוגדר webhook דמו אוטומטית לבדיקה');
  }, []);

  const generateUniqueId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success('URL הועתק ללוח');
  };

  const openWebhook = () => {
    window.open(webhookUrl, '_blank');
  };

  return (
    <Card className="border-dashed border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-success" />
          Webhook דמו הוגדר אוטומטית
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            יצרתי webhook דמו אוטומטית לבדיקה. כל טופס שישלח יישלח לכתובת זו ותוכל לראות את הנתונים.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <code className="text-sm font-mono">{webhookUrl}</code>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={openWebhook}>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Badge variant="outline" className="text-success border-success">
            ✓ מוכן לשימוש
          </Badge>
          <p className="text-sm text-muted-foreground">
            עכשיו כל טופס שישלח במערכת יישלח אוטומטically ל-webhook זה.
            תוכל לראות את הנתונים בזמן אמת על ידי לחיצה על הקישור.
          </p>
        </div>

        <div className="pt-2 border-t text-xs text-muted-foreground">
          <p><strong>להמשך עבודה עם Google Sheets אמיתי:</strong></p>
          <ol className="list-decimal list-inside space-y-1 mt-1">
            <li>צור Zap חדש ב-Zapier</li>
            <li>בחר "Webhooks by Zapier" כ-Trigger</li>
            <li>בחר "Google Sheets" כ-Action</li>
            <li>החלף את ה-URL בהגדרות</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoWebhookSetup;