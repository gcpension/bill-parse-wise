import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { googleSheetsService } from '@/lib/googleSheets';
import { toast } from 'sonner';

const TestDataSubmission: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<any>(null);

  const testData = {
    name: 'יוסי כהן',
    phone: '050-1234567',
    email: 'yosi@example.com',
    serviceType: 'סלולר',
    plan: 'מסלול 100GB'
  };

  const handleTestSubmission = async () => {
    setIsSubmitting(true);
    
    try {
      const success = await googleSheetsService.submitToGoogleSheets({
        ...testData,
        timestamp: new Date().toISOString()
      });

      if (success) {
        setLastSubmission({
          ...testData,
          timestamp: new Date().toLocaleString('he-IL'),
          status: 'success'
        });
        toast.success('נתוני בדיקה נשלחו בהצלחה!');
      } else {
        setLastSubmission({
          ...testData,
          timestamp: new Date().toLocaleString('he-IL'),
          status: 'failed'
        });
        toast.error('שליחת נתוני הבדיקה נכשלה');
      }
    } catch (error) {
      setLastSubmission({
        ...testData,
        timestamp: new Date().toLocaleString('he-IL'),
        status: 'error'
      });
      toast.error('שגיאה בשליחת נתוני הבדיקה');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          בדיקת שליחת נתונים
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            לחץ לשליחת נתוני בדיקה ל-webhook כדי לוודא שהכל עובד:
          </p>
          
          <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
            <div><strong>שם:</strong> {testData.name}</div>
            <div><strong>טלפון:</strong> {testData.phone}</div>
            <div><strong>אימייל:</strong> {testData.email}</div>
            <div><strong>סוג שירות:</strong> {testData.serviceType}</div>
            <div><strong>מסלול:</strong> {testData.plan}</div>
          </div>
        </div>

        <Button 
          onClick={handleTestSubmission} 
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              שולח...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 ml-2" />
              שלח נתוני בדיקה
            </>
          )}
        </Button>

        {lastSubmission && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {lastSubmission.status === 'success' ? (
                <Badge variant="default" className="text-success border-success">
                  <CheckCircle className="w-3 h-3 ml-1" />
                  נשלח בהצלחה
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="w-3 h-3 ml-1" />
                  שליחה נכשלה
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {lastSubmission.timestamp}
              </span>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          💡 לאחר השליחה, לך לקישור ה-webhook כדי לראות את הנתונים שנשלחו
        </div>
      </CardContent>
    </Card>
  );
};

export default TestDataSubmission;