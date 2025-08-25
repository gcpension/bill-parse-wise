import { useState } from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Shield, AlertTriangle, FileText, Upload } from 'lucide-react';
import { PaymentDetails, ConsentData } from '@/types/wizard';

export const PaymentConsentStep = () => {
  const { state, updatePayment, updateConsent } = useWizard();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const payment = state.payment;
  const consent = state.consent;

  const handlePaymentChange = (field: keyof PaymentDetails, value: any) => {
    updatePayment({ [field]: value });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleConsentChange = (field: keyof ConsentData, value: boolean) => {
    updateConsent({ [field]: value });
  };

  const handleFileUpload = (field: 'paymentProof', file: File | undefined) => {
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [field]: 'רק קבצי JPG, PNG או PDF מותרים' }));
        return;
      }
      
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, [field]: 'גודל הקובץ לא יכול לעלות על 5MB' }));
        return;
      }
    }
    
    handlePaymentChange(field, file);
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            פרטי אמצעי תשלום
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              פרטי התשלום מוצפנים ומאובטחים. הם נשמרים רק לצורך ביצוע המעבר.
            </AlertDescription>
          </Alert>

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">אמצעי תשלום מועדף *</Label>
            <Select 
              value={payment.paymentMethod || ''} 
              onValueChange={(value) => handlePaymentChange('paymentMethod', value)}
            >
              <SelectTrigger className={errors.paymentMethod ? 'border-destructive' : ''}>
                <SelectValue placeholder="בחר אמצעי תשלום" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit">כרטיס אשראי</SelectItem>
                <SelectItem value="direct_debit">הוראת קבע</SelectItem>
                <SelectItem value="bank_transfer">העברה בנקאית</SelectItem>
              </SelectContent>
            </Select>
            {errors.paymentMethod && (
              <p className="text-destructive text-sm">{errors.paymentMethod}</p>
            )}
          </div>

          {/* Payment Details Based on Method */}
          {payment.paymentMethod === 'credit' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="creditCardLast4">4 ספרות אחרונות של כרטיס האשראי</Label>
                <Input
                  id="creditCardLast4"
                  value={payment.creditCardLast4 || ''}
                  onChange={(e) => handlePaymentChange('creditCardLast4', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="XXXX"
                  maxLength={4}
                />
              </div>
            </div>
          )}

          {payment.paymentMethod === 'direct_debit' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankAccount">מספר חשבון בנק</Label>
                <Input
                  id="bankAccount"
                  value={payment.bankAccount || ''}
                  onChange={(e) => handlePaymentChange('bankAccount', e.target.value)}
                  placeholder="מספר חשבון (ללא מקפים)"
                />
              </div>
            </div>
          )}

          {/* Owner Confirmation */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Checkbox
              id="isOwner"
              checked={payment.isOwner || false}
              onCheckedChange={(checked) => handlePaymentChange('isOwner', checked)}
            />
            <Label htmlFor="isOwner" className="text-sm">
              אני מאשר שאני הבעלים של אמצעי התשלום או מורשה להשתמש בו
            </Label>
          </div>

          {/* Payment Proof Upload */}
          {payment.paymentMethod && (
            <div className="space-y-2">
              <Label htmlFor="paymentProof">
                אישור אמצעי תשלום (אופציונלי)
              </Label>
              <Input
                id="paymentProof"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload('paymentProof', e.target.files?.[0])}
                className={errors.paymentProof ? 'border-destructive' : ''}
              />
              {errors.paymentProof && (
                <p className="text-destructive text-sm">{errors.paymentProof}</p>
              )}
              {payment.paymentProof && (
                <p className="text-success text-sm">✓ קובץ הועלה בהצלחה</p>
              )}
              <p className="text-muted-foreground text-xs">
                צילום כרטיס אשראי (4 ספרות אחרונות) או אישור בנק
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legal Consents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            הצהרות משפטיות ואישורים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              אישורים נדרשים על פי חוק הגנת הפרטיות וחוק הגנת הצרכן
            </AlertDescription>
          </Alert>

          {/* All Consent Checkboxes */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <Checkbox
                id="powerOfAttorneyConsent"
                checked={consent.powerOfAttorneyConsent || false}
                onCheckedChange={(checked) => handleConsentChange('powerOfAttorneyConsent', !!checked)}
              />
              <Label htmlFor="powerOfAttorneyConsent" className="text-sm leading-relaxed">
                <span className="font-medium">ייפוי כוח דיגיטלי:</span> אני מסכים ומאשר לחברה לפעול בשמי מול הספקים הרלוונטיים לביצוע המעבר/ניתוק
              </Label>
            </div>

            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <Checkbox
                id="termsAndConditionsConsent"
                checked={consent.termsAndConditionsConsent || false}
                onCheckedChange={(checked) => handleConsentChange('termsAndConditionsConsent', !!checked)}
              />
              <Label htmlFor="termsAndConditionsConsent" className="text-sm leading-relaxed">
                <span className="font-medium">תנאי שירות:</span> קראתי והבנתי את תנאי השירות ותנאי המעבר
              </Label>
            </div>

            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <Checkbox
                id="exitFeesAwareness"
                checked={consent.exitFeesAwareness || false}
                onCheckedChange={(checked) => handleConsentChange('exitFeesAwareness', !!checked)}
              />
              <Label htmlFor="exitFeesAwareness" className="text-sm leading-relaxed">
                <span className="font-medium">מודעות לקנסות יציאה:</span> אני מבין שייתכן וקיימים קנסות/עמלות יציאה מהחברה הקיימת
              </Label>
            </div>

            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <Checkbox
                id="dataProcessingConsent"
                checked={consent.dataProcessingConsent || false}
                onCheckedChange={(checked) => handleConsentChange('dataProcessingConsent', !!checked)}
              />
              <Label htmlFor="dataProcessingConsent" className="text-sm leading-relaxed">
                <span className="font-medium">עיבוד נתונים אישיים:</span> אני מסכים למסירת נתונים אישיים לגוף שלישי לצורך המעבר (GDPR/חוק הגנת הפרטיות)
              </Label>
            </div>

            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <Checkbox
                id="gdprConsent"
                checked={consent.gdprConsent || false}
                onCheckedChange={(checked) => handleConsentChange('gdprConsent', !!checked)}
              />
              <Label htmlFor="gdprConsent" className="text-sm leading-relaxed">
                <span className="font-medium">הגנת פרטיות:</span> אני מסכים לעיבוד הנתונים האישיים שלי לפי מדיניות הפרטיות
              </Label>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Checkbox
                  id="finalConfirmation"
                  checked={consent.finalConfirmation || false}
                  onCheckedChange={(checked) => handleConsentChange('finalConfirmation', !!checked)}
                />
                <Label htmlFor="finalConfirmation" className="text-sm leading-relaxed font-medium">
                  הצהרה סופית: אני מצהיר כי המידע שסיפקתי נכון ומלא, ומאשר לחברה לפעול בשמי לביצוע המעבר/ניתוק.
                </Label>
              </div>
            </div>
          </div>

          {/* Cancellation Rights */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>זכות ביטול:</strong> יש לך זכות לבטל את ההסכמה תוך 7 ימים מהיום בו נשלחה הבקשה. 
              ביטול ניתן לעשות דרך הטלפון או האימייל שיישלחו אליך לאחר השליחה.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};