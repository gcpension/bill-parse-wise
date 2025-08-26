import { useState, useRef } from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { PenTool, RotateCcw, CheckCircle, FileSignature } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { googleSheetsService } from '@/lib/googleSheets';

export const DigitalSignatureStep = () => {
  const { state, updateSignature, submitRequest } = useWizard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');
  const signatureRef = useRef<SignatureCanvas>(null);
  const { toast } = useToast();

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setSignatureData('');
      updateSignature({ signature: '' });
    }
  };

  const saveSignature = () => {
    if (signatureRef.current) {
      const signature = signatureRef.current.toDataURL();
      setSignatureData(signature);
      updateSignature({ 
        signature,
        timestamp: new Date().toISOString(),
        ipAddress: 'pending', // Will be filled by server
        powerOfAttorneyAgreed: true
      });
    }
  };

  const handleSubmit = async () => {
    if (!signatureData) {
      toast({
        title: "חתימה נדרשת",
        description: "אנא חתום בתיבת החתימה לפני השליחה",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const requestId = await submitRequest();
      
      toast({
        title: "הבקשה נשלחה בהצלחה! ✅",
        description: `מספר בקשה: #${requestId}. נחזור אליך תוך 48 שעות.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "שגיאה בשליחת הבקשה",
        description: "אנא נסה שוב או פנה לתמיכה",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const personalDetails = state.personalDetails;
  const currentService = state.currentService;
  const newService = state.newService;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            סיכום הבקשה
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">פרטי המבקש</h4>
              <div className="text-sm space-y-1">
                <div><strong>שם:</strong> {personalDetails.firstName} {personalDetails.lastName}</div>
                <div><strong>ת.ז.:</strong> {personalDetails.idNumber}</div>
                <div><strong>אימייל:</strong> {personalDetails.email}</div>
                <div><strong>טלפון:</strong> {personalDetails.phone}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">פרטי המעבר</h4>
              <div className="text-sm space-y-1">
                <div><strong>מ:</strong> {currentService.providerName} ({currentService.currentPlan})</div>
                <div><strong>אל:</strong> {newService.newProvider} ({newService.newPlan})</div>
                <div><strong>מועד מעבר:</strong> {
                  newService.switchDate === 'immediate' ? 'מיידי' :
                  newService.switchDate === 'end_of_billing' ? 'סוף מחזור חיוב' :
                  newService.switchDate === 'end_of_commitment' ? 'סוף התחייבות' :
                  newService.customSwitchDate || 'לא צוין'
                }</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Digital Signature */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            חתימה דיגיטלית
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <FileSignature className="h-4 w-4" />
            <AlertDescription>
              <strong>ייפוי כוח דיגיטלי:</strong> על ידי החתימה אתה מעניק ייפוי כוח לבצע את המעבר בשמך
            </AlertDescription>
          </Alert>

          {/* Signature Canvas */}
          <div className="space-y-4">
            <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="text-center text-sm text-muted-foreground mb-4">
                חתום כאן באמצעות העכבר או המגע
              </div>
              <div className="bg-white border rounded-lg overflow-hidden">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    width: 600,
                    height: 200,
                    className: 'signature-canvas w-full'
                  }}
                  onEnd={saveSignature}
                  backgroundColor="white"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={clearSignature}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                נקה חתימה
              </Button>
              
              {signatureData && (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">חתימה נשמרה</span>
                </div>
              )}
            </div>
          </div>

          {/* Legal Text */}
          <div className="bg-muted/30 p-4 rounded-lg text-sm leading-relaxed">
            <p className="font-medium mb-2">הצהרת החתימה:</p>
            <p>
              אני הח"מ, <strong>{personalDetails.firstName} {personalDetails.lastName}</strong>, 
              ת.ז. <strong>{personalDetails.idNumber}</strong>, מעניק בזאת ייפוי כוח 
              לחברת השוואת הספקים לפעול בשמי לביצוע מעבר מ-{currentService.providerName} 
              ל-{newService.newProvider}. אני מאשר כי קראתי והבנתי את כל התנאים והוראות, 
              ומסכים לכל האמור לעיל.
            </p>
            <div className="mt-4 text-xs text-muted-foreground">
              תאריך וזמן חתימה: {new Date().toLocaleString('he-IL')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="text-center">
        <Button
          onClick={handleSubmit}
          disabled={!signatureData || isSubmitting}
          size="lg"
          className="w-full md:w-auto px-12 py-4 text-lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Submitting to Google Sheets...
            </>
          ) : (
            <>
              <CheckCircle className="ml-2 h-5 w-5" />
              SUBMIT TO GOOGLE SHEETS
            </>
          )}
        </Button>
      </div>

      {/* Security Footer */}
      <div className="text-center text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="h-4 w-4 text-success" />
          <span className="font-medium">מאובטח ומוצפן</span>
        </div>
        <div>
          החתימה הדיגיטלית חוקית ומאובטחת • כל הנתונים מוצפנים ב-256bit SSL • 
          זכות ביטול תוך 7 ימים
        </div>
      </div>
    </div>
  );
};