import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  PenTool, 
  CheckCircle2, 
  FileText, 
  Shield, 
  Clock,
  Download,
  Send,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { createHebrewPDF } from '@/lib/pdfUtils';

interface DigitalSignatureProps {
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  currentProvider: string;
  newProvider: string;
  newPlan: string;
  monthlySavings: number;
  // Optional controlled dialog props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // Hide internal trigger button when controlling from outside  
  hideTrigger?: boolean;
}

const categoryNames = {
  electricity: 'חשמל',
  cellular: 'סלולר', 
  internet: 'אינטרנט',
  tv: 'טלוויזיה וסטרימינג'
};

const categoryIcons = {
  electricity: '⚡',
  cellular: '📱',
  internet: '🌐',
  tv: '📺'
};

export const DigitalSignature = ({
  category,
  currentProvider,
  newProvider,
  newPlan,
  monthlySavings,
  open,
  onOpenChange,
  hideTrigger
}: DigitalSignatureProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [signature, setSignature] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    address: '',
    phone: '',
    email: '',
    accountNumber: '',
    agreeToTerms: false,
    agreeToTransfer: false,
    agreeToDataProcessing: false,
    digitalSignature: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const { toast } = useToast();

  // Controlled/uncontrolled dialog handling
  const isControlled = typeof open === 'boolean';
  const dialogOpen = isControlled ? (open as boolean) : isOpen;
  const handleOpenChange = (value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setIsOpen(value);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDigitalSign = async () => {
    if (!formData.fullName || !formData.idNumber || !signature) {
      toast({
        title: "שגיאה",
        description: "נא למלא את כל השדות הנדרשים כולל החתימה הדיגיטלית",
        variant: "destructive"
      });
      return;
    }

    if (!formData.agreeToTerms || !formData.agreeToTransfer || !formData.agreeToDataProcessing) {
      toast({
        title: "שגיאה", 
        description: "נא לאשר את כל התנאים הנדרשים",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate digital signing process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create digital document
      const digitalDocument = generateDigitalDocument();
      
      // Save to user's local storage for future reference
      const documentId = `switch-${category}-${Date.now()}`;
      localStorage.setItem(documentId, JSON.stringify({
        ...formData,
        signature,
        category,
        currentProvider,
        newProvider,
        newPlan,
        monthlySavings,
        timestamp: new Date().toISOString(),
        documentId
      }));

      // Auto-download the signed document with Hebrew support
      const title = `מסמך חתום - מעבר ספק ${categoryNames[category]}`;
      const content = digitalDocument.split('\n');
      
      const pdf = await createHebrewPDF(title, content);
      pdf.save(`signed-document-${categoryNames[category]}-${formData.fullName}-${Date.now()}.pdf`);

      setIsCompleted(true);
      
      toast({
        title: "החתימה הדיגיטלית הושלמה!",
        description: `המסמך נחתם בהצלחה ונשמר. תחסוך ${formatCurrency(monthlySavings)} בחודש!`,
        variant: "default"
      });
      
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בתהליך החתימה. נסה שוב מאוחר יותר.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateDigitalDocument = () => {
    const now = new Date();
    return `מסמך מעבר ספק ${categoryNames[category]} - חתום דיגיטלית
=================================================

פרטי הלקוח:
שם מלא: ${formData.fullName}
תעודת זהות: ${formData.idNumber}
כתובת: ${formData.address}
טלפון: ${formData.phone}
אימייל: ${formData.email}
מספר חשבון: ${formData.accountNumber}

פרטי המעבר:
מספק נוכחי: ${currentProvider}
לספק חדש: ${newProvider}
חבילה חדשה: ${newPlan}
חיסכון חודשי צפוי: ${formatCurrency(monthlySavings)}

החתימה הדיגיטלית: "${signature}"

אישורים:
✓ אני מסכים לתנאי השירות
✓ אני מאשר את המעבר לספק החדש
✓ אני מסכים לעיבוד הנתונים האישיים

תאריך ושעת החתימה: ${now.toLocaleDateString('he-IL')} ${now.toLocaleTimeString('he-IL')}
מזהה מסמך: switch-${category}-${now.getTime()}

מסמך זה נחתם דיגיטלית באמצעות מערכת החתימה הדיגיטלית המאובטחת.
החתימה הדיגיטלית שווה ערך לחתימה פיזית לפי חוק החתימה האלקטרונית, התשס"א-2001.

---
נוצר אוטומטית על ידי מערכת השוואת ספקים
${now.toISOString()}`;
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.idNumber && formData.address;
      case 2:
        return formData.phone && formData.email && formData.accountNumber;
      case 3:
        return formData.agreeToTerms && formData.agreeToTransfer && formData.agreeToDataProcessing;
      case 4:
        return signature.length >= 3;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-6xl">{categoryIcons[category]}</div>
              <h3 className="text-2xl font-bold">פרטים אישיים</h3>
              <p className="text-muted-foreground">נתחיל בפרטים הבסיסיים שלך</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">שם מלא *</Label>
                <Input
                  id="fullName"
                  placeholder="הזן שם מלא"
                  value={formData.fullName}
                  onChange={(e) => updateFormData('fullName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="idNumber">תעודת זהות *</Label>
                <Input
                  id="idNumber"
                  placeholder="הזן מספר תעודת זהות"
                  value={formData.idNumber}
                  onChange={(e) => updateFormData('idNumber', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">כתובת מלאה *</Label>
                <Input
                  id="address"
                  placeholder="הזן כתובת מלאה"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-6xl">📞</div>
              <h3 className="text-2xl font-bold">פרטי התקשרות</h3>
              <p className="text-muted-foreground">כיצד נוכל להתקשר אליך</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">מספר טלפון *</Label>
                <Input
                  id="phone"
                  placeholder="הזן מספר טלפון"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">כתובת אימייל *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="הזן כתובת אימייל"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountNumber">מספר חשבון לקוח נוכחי *</Label>
                <Input
                  id="accountNumber"
                  placeholder="הזן מספר חשבון אצל הספק הנוכחי"
                  value={formData.accountNumber}
                  onChange={(e) => updateFormData('accountNumber', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-6xl">📄</div>
              <h3 className="text-2xl font-bold">אישורים ותנאים</h3>
              <p className="text-muted-foreground">נא לקרוא ולאשר את התנאים</p>
            </div>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                על ידי המשך התהליך, אתה מאשר את כל הפרטים ומסכים לתנאים המפורטים להלן.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => updateFormData('agreeToTerms', checked)}
                />
                <Label htmlFor="agreeToTerms" className="text-sm leading-6">
                  אני מסכים לתנאי השירות ומצהיר כי קראתי והבנתי אותם. המעבר יבוצע בהתאם למדיניות החברה.
                </Label>
              </div>
              
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Checkbox
                  id="agreeToTransfer"
                  checked={formData.agreeToTransfer}
                  onCheckedChange={(checked) => updateFormData('agreeToTransfer', checked)}
                />
                <Label htmlFor="agreeToTransfer" className="text-sm leading-6">
                  אני מאשר את המעבר מ{currentProvider} ל{newProvider} ומבין שהתהליך עלול להימשך עד 30 יום.
                </Label>
              </div>
              
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Checkbox
                  id="agreeToDataProcessing"
                  checked={formData.agreeToDataProcessing}
                  onCheckedChange={(checked) => updateFormData('agreeToDataProcessing', checked)}
                />
                <Label htmlFor="agreeToDataProcessing" className="text-sm leading-6">
                  אני מסכים לעיבוד הנתונים האישיים שלי למטרת ביצוע המעבר ומתן השירות.
                </Label>
              </div>
            </div>
            
            <Card className="bg-success/5 border-success/20">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="text-4xl">💰</div>
                  <div>
                    <h4 className="font-semibold text-success">החיסכون הצפוי שלך</h4>
                    <p className="text-2xl font-bold text-success">{formatCurrency(monthlySavings)} בחודש</p>
                    <p className="text-sm text-muted-foreground">
                      חיסכון שנתי: {formatCurrency(monthlySavings * 12)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-6xl">✍️</div>
              <h3 className="text-2xl font-bold">חתימה דיגיטלית</h3>
              <p className="text-muted-foreground">החתם דיגיטלית על המסמך</p>
            </div>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Shield className="h-5 w-5" />
                  <span>חתימה דיגיטלית מאובטחת</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  החתימה הדיגיטלית שווה ערך לחתימה פיזית לפי החוק הישראלי
                </p>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signature">החתימה הדיגיטלית שלך *</Label>
                    <Textarea
                      id="signature"
                      placeholder='כתוב את שמך המלא כאן, לדוגמה: "יוסי כהן"'
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      className="text-lg font-serif"
                      rows={3}
                    />
                  </div>
                  
                  {signature && (
                    <div className="p-4 bg-white border-2 border-dashed border-primary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">תצוגה מקדימה של החתימה:</p>
                      <div className="text-2xl font-serif italic text-primary">
                        {signature}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                על ידי החתימה הדיגיטלית, אתה מאשר את כל הפרטים שהוזנו ומסכים לביצוע המעבר.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <div className="text-8xl">🎉</div>
              <h3 className="text-3xl font-bold text-success">המסמך נחתם בהצלחה!</h3>
              <p className="text-lg text-muted-foreground">
                המעבר ל{newProvider} יתחיל בקרוב
              </p>
            </div>
            
            <Card className="bg-success/5 border-success/20">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold">סיכום המעבר</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">מספק</p>
                      <p className="font-medium">{currentProvider}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">לספק</p>
                      <p className="font-medium">{newProvider}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">חבילה חדשה</p>
                      <p className="font-medium">{newPlan}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">חיסכון חודשי</p>
                      <p className="font-bold text-success">{formatCurrency(monthlySavings)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex flex-col space-y-2">
              <Badge variant="outline" className="text-sm">
                <Clock className="h-3 w-3 ml-2" />
                המסמך נשמר ונשלח אוטומטית
              </Badge>
              <Badge variant="outline" className="text-sm">
                <FileText className="h-3 w-3 ml-2" />
                תקבל אישור במייל תוך 24 שעות
              </Badge>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
        {hideTrigger ? null : (
          <DialogTrigger asChild>
            <Button className="flex-1" size="lg">
              <CheckCircle2 className="ml-2 h-5 w-5" />
              מסמך נחתם ✓
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-success">
              המסמך נחתם בהצלחה!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="text-6xl">✅</div>
            <p>המעבר ל{newProvider} מתחיל בקרוב</p>
            <p className="text-sm text-muted-foreground">
              תקבל אישור במייל תוך 24 שעות
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {hideTrigger ? null : (
        <DialogTrigger asChild>
          <Button className="flex-1" size="lg">
            <PenTool className="ml-2 h-5 w-5" />
            חתימה דיגיטלית
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            מעבר ל{newProvider} - חתימה דיגיטלית
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step < currentStep
                    ? 'bg-success border-success text-white'
                    : step === currentStep
                    ? 'border-primary bg-primary text-white'
                    : 'border-muted bg-background text-muted-foreground'
                }`}
              >
                {step < currentStep ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step}</span>
                )}
              </div>
              <div className="w-16 text-center">
                {step < 5 && step < currentStep && (
                  <div className="h-0.5 bg-success mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1 || isProcessing}
          >
            קודם
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceedToNext()}
            >
              המשך
            </Button>
          ) : currentStep === 4 ? (
            <Button
              onClick={handleDigitalSign}
              disabled={!canProceedToNext() || isProcessing}
              className="bg-success hover:bg-success/90"
            >
              {isProcessing ? (
                <>
                  <Clock className="ml-2 h-4 w-4 animate-spin" />
                  חותם דיגיטלית...
                </>
              ) : (
                <>
                  <Send className="ml-2 h-4 w-4" />
                  חתום דיגיטלית
                </>
              )}
            </Button>
          ) : (
            <Button onClick={() => setIsOpen(false)}>
              סגור
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};