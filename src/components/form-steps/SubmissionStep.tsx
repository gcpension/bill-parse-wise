import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Copy,
  Loader2,
  FileText,
  Globe,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubmissionStepProps {
  category: string;
  customerType: string;
  data: any;
  onSubmit: () => void;
}

export const SubmissionStep = ({ category, customerType, data, onSubmit }: SubmissionStepProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [submissionProgress, setSubmissionProgress] = useState(0);
  const { toast } = useToast();

  const generateReferenceNumber = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `${category.toUpperCase()}-${customerType.toUpperCase()}-${timestamp}-${random}`.toUpperCase();
  };

  const handleSubmit = async () => {
    if (!canSubmit()) return;

    setIsSubmitting(true);
    setSubmissionProgress(10);

    try {
      // Generate reference number
      const refNum = generateReferenceNumber();
      setReferenceNumber(refNum);
      setSubmissionProgress(30);

      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmissionProgress(50);

      // Simulate data saving
      await new Promise(resolve => setTimeout(resolve, 500));
      setSubmissionProgress(70);

      // Send webhook if URL provided
      if (webhookUrl) {
        try {
          const jsonData = generateJsonData(refNum);
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'no-cors',
            body: JSON.stringify(jsonData)
          });
          setSubmissionProgress(90);
        } catch (error) {
          console.warn('Webhook failed:', error);
        }
      }

      setSubmissionProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsSubmitted(true);
      
      toast({
        title: "הטופס נשלח בהצלחה!",
        description: `מספר אסמכתה: ${refNum}`,
      });

      // Call parent submit handler
      onSubmit();

    } catch (error) {
      toast({
        title: "שגיאה בשליחת הטופס",
        description: "אנא נסו שוב או פנו לתמיכה",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = () => {
    return data.termsAccepted && 
           data.understandingDeclaration && 
           data.signatureComplete;
  };

  const generateJsonData = (refNum: string) => {
    const baseData = {
      referenceNumber: refNum,
      category,
      customerType,
      submissionDate: new Date().toISOString(),
      consent: data.termsAccepted,
      poaExpiry: data.poaExpiry,
      signatureMethod: data.signatureMethod
    };

    if (customerType === 'private') {
      return {
        ...baseData,
        fullName: `${data.firstName} ${data.lastName}`,
        idNumber: data.idNumber,
        mobile: data.mobile,
        email: data.email,
        birthDate: data.birthDate,
        address: [data.street, data.city, data.zipCode].filter(Boolean).join(', '),
        currentProvider: data.currentProvider || data.currentSupplier,
        targetProvider: data.targetProvider || data.targetSupplier,
        ...(category === 'cellular' && { lines: data.lines?.filter((l: string) => l.trim()) }),
        ...(category === 'electricity' && { 
          contractNumber: data.contractNumber,
          meterNumber: data.meterNumber,
          siteAddress: data.siteAddress 
        }),
        ...(category === 'tv' && { subscriberNumber: data.subscriberNumber }),
        ...(category === 'internet' && { 
          infraProvider: data.infraProvider,
          serviceProvider: data.serviceProvider,
          identifier: data.identifier 
        })
      };
    } else {
      return {
        ...baseData,
        companyName: data.companyName,
        regNumber: data.companyId,
        registeredAddress: data.registeredAddress,
        signatoryName: data.signatoryName,
        signatoryId: data.signatoryId,
        signatoryTitle: data.signatoryTitle,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        currentProvider: data.currentProvider || data.currentSupplier,
        targetProvider: data.targetProvider || data.targetSupplier,
        ...(category === 'cellular' && { 
          msisdnList: data.lines?.filter((l: string) => l.trim()) 
        }),
        ...(category === 'electricity' && { 
          points: data.contractNumbers?.map((c: any) => ({
            contractNumber: c.contractNumber,
            meterNumber: c.meterNumber,
            siteAddress: c.siteAddress
          }))
        })
      };
    }
  };

  const copyReferenceNumber = () => {
    if (referenceNumber) {
      navigator.clipboard.writeText(referenceNumber);
      toast({
        title: "הועתק ללוח",
        description: "מספר האסמכתה הועתק ללוח העריכה"
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-green-800">הטופס נשלח בהצלחה!</h2>
          <p className="text-muted-foreground">
            הבקשה שלכם נקלטה במערכת ותטופל בהקדם
          </p>
        </div>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-green-800">מספר אסמכתה</Label>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-lg font-mono bg-white px-3 py-2 rounded border text-green-700">
                  {referenceNumber}
                </code>
                <Button variant="outline" size="sm" onClick={copyReferenceNumber}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-green-700 space-y-1">
              <p>• שמרו את מספר האסמכתה למעקב</p>
              <p>• תקבלו הודעת אישור לאימייל תוך 24 שעות</p>
              <p>• המעבר יבוצע תוך 7-30 ימי עבודה</p>
            </div>
          </div>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            חזרה לעמוד הבית
          </Button>
          <Button disabled>
            <Download className="ml-2 h-4 w-4" />
            הורד PDF (בפיתוח)
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Send className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">שליחה סופית</h2>
        </div>
        <p className="text-muted-foreground">
          אישור פרטים אחרון לפני השליחה
        </p>
      </div>

      {/* Submission Progress */}
      {isSubmitting && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="font-medium">מעבד את הבקשה...</span>
            </div>
            <Progress value={submissionProgress} className="w-full" />
            <div className="text-sm text-muted-foreground">
              {submissionProgress < 30 && "יוצר מספר אסמכתה..."}
              {submissionProgress >= 30 && submissionProgress < 50 && "מייצר PDF..."}
              {submissionProgress >= 50 && submissionProgress < 70 && "שומר נתונים..."}
              {submissionProgress >= 70 && submissionProgress < 90 && "שולח webhook..."}
              {submissionProgress >= 90 && "משלים תהליך..."}
            </div>
          </div>
        </Card>
      )}

      {/* Pre-submission Checklist */}
      {!isSubmitting && (
        <>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">בדיקה אחרונה</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {data.termsAccepted ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm">קריאת התנאים ואישור</span>
              </div>
              
              <div className="flex items-center gap-3">
                {data.understandingDeclaration ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm">הצהרת הבנה</span>
              </div>
              
              <div className="flex items-center gap-3">
                {data.signatureComplete ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm">חתימה דיגיטלית</span>
              </div>
            </div>
          </Card>

          {/* Webhook Configuration */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">הגדרות אינטגרציה (רשות)</h3>
            </div>
            <div className="space-y-3">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                type="url"
                placeholder="https://example.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                אם יש לכם מערכת אוטומציה, הכניסו את כתובת ה-Webhook לקבלת הנתונים בזמן אמת
              </p>
            </div>
          </Card>

          {/* Expected Timeline */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <div className="font-medium mb-2">לוח זמנים צפוי:</div>
                <div className="space-y-1">
                  <div>• אישור קבלה: תוך 24 שעות</div>
                  <div>• בדיקת נתונים: 2-5 ימי עבודה</div>
                  <div>• ביצוע המעבר: 7-30 ימי עבודה</div>
                  <div>• הודעת השלמה: עם סיום התהליך</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <Card className="p-6">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">מוכנים לשלוח?</h3>
                <p className="text-muted-foreground">
                  לחיצה על "שלח בקשה" תגרום להגשת הטופס באופן סופי
                </p>
              </div>
              
              <Button 
                size="lg" 
                onClick={handleSubmit}
                disabled={!canSubmit() || isSubmitting}
                className="px-8 py-4 text-lg"
              >
                {isSubmitting ? (
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                ) : (
                  <Send className="ml-2 h-5 w-5" />
                )}
                SUBMIT TO GOOGLE SHEETS
              </Button>
              
              {!canSubmit() && (
                <p className="text-sm text-red-600">
                  יש להשלים את כל השדות הנדרשים לפני השליחה
                </p>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};