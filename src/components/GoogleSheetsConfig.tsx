import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Check, X } from 'lucide-react';
import { googleSheetsService } from '@/lib/googleSheets';
import { toast } from 'sonner';

const GoogleSheetsConfig: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState(googleSheetsService.getWebhookUrl() || '');
  const [isConfigured, setIsConfigured] = useState(!!googleSheetsService.getWebhookUrl());

  const handleSaveConfig = () => {
    if (!webhookUrl.trim()) {
      toast.error('נא להזין URL של Webhook');
      return;
    }

    try {
      googleSheetsService.setWebhookUrl(webhookUrl.trim());
      setIsConfigured(true);
      toast.success('הגדרות Google Sheets נשמרו בהצלחה');
    } catch (error) {
      toast.error('שגיאה בשמירת ההגדרות');
    }
  };

  const handleRemoveConfig = () => {
    googleSheetsService.setWebhookUrl('');
    setWebhookUrl('');
    setIsConfigured(false);
    toast.success('הגדרות Google Sheets הוסרו');
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          הגדרות Google Sheets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            כדי לשלוח נתונים לגוגל שיטס, צריך ליצור Webhook URL באמצעות Google Apps Script או Zapier.
            הנתונים ישלחו לגיליון "לקוחות טפסים נכנסים".
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="webhookUrl">Webhook URL</Label>
          <Input
            id="webhookUrl"
            type="url"
            placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSaveConfig} className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            שמור הגדרות
          </Button>
          
          {isConfigured && (
            <Button variant="outline" onClick={handleRemoveConfig} className="flex items-center gap-2">
              <X className="w-4 h-4" />
              הסר הגדרות
            </Button>
          )}
        </div>

        {isConfigured && (
          <Alert>
            <Check className="w-4 h-4" />
            <AlertDescription>
              Google Sheets מוגדר ופעיל. נתונים ישלחו אוטומטית עם כל שליחת טופס.
            </AlertDescription>
          </Alert>
        )}

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">נתונים שישלחו:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• שם מלא</li>
            <li>• טלפון</li>
            <li>• אימייל</li>
            <li>• סוג שירות</li>
            <li>• מסלול</li>
            <li>• תאריך וזמן</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleSheetsConfig;