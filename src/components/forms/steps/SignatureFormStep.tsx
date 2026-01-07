import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignatureCanvas from "react-signature-canvas";
import { PenTool, RotateCcw, Check, Shield, AlertTriangle, FileCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface SignatureFormStepProps {
  personalInfo: {
    fullName: string;
    nationalId: string;
  };
  selectedPlan: {
    company: string;
    planName: string;
    price: number;
  };
  onSubmit: (signatureData: string) => Promise<void>;
  onBack: () => void;
  isSubmitting?: boolean;
  categoryColor?: {
    primary: string;
    light: string;
    text: string;
    border: string;
    bg: string;
  };
}

export const SignatureFormStep = ({
  personalInfo,
  selectedPlan,
  onSubmit,
  onBack,
  isSubmitting = false,
  categoryColor = {
    primary: "from-primary to-primary/80",
    light: "from-primary/5 to-primary/10",
    text: "text-primary",
    border: "border-primary/20",
    bg: "bg-primary/5"
  }
}: SignatureFormStepProps) => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const { toast } = useToast();
  
  const [hasSignature, setHasSignature] = useState(false);
  const [consents, setConsents] = useState({
    termsAccepted: false,
    feesAwareness: false,
    powerOfAttorney: false,
    privacyPolicy: false,
  });

  const handleClear = () => {
    sigCanvas.current?.clear();
    setHasSignature(false);
  };

  const handleSignatureEnd = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      setHasSignature(true);
    }
  };

  const allConsentsGiven = Object.values(consents).every(Boolean);
  const canSubmit = hasSignature && allConsentsGiven && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) {
      if (!hasSignature) {
        toast({
          title: "חתימה נדרשת",
          description: "יש לחתום בשדה החתימה לפני השליחה",
          variant: "destructive"
        });
        return;
      }
      if (!allConsentsGiven) {
        toast({
          title: "אישורים נדרשים",
          description: "יש לאשר את כל ההצהרות לפני השליחה",
          variant: "destructive"
        });
        return;
      }
      return;
    }

    const signatureData = sigCanvas.current?.toDataURL('image/png') || '';
    await onSubmit(signatureData);
  };

  const toggleConsent = (key: keyof typeof consents) => {
    setConsents(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const today = new Date().toLocaleDateString('he-IL');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Summary Card */}
      <Card className={cn("border-2", categoryColor.border, "bg-gradient-to-br", categoryColor.light)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileCheck className={cn("w-5 h-5", categoryColor.text)} />
            סיכום הבקשה
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">שם מלא:</span>
              <p className="font-medium">{personalInfo.fullName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">ת.ז.:</span>
              <p className="font-medium">{personalInfo.nationalId}</p>
            </div>
            <div>
              <span className="text-muted-foreground">ספק חדש:</span>
              <p className="font-medium">{selectedPlan.company}</p>
            </div>
            <div>
              <span className="text-muted-foreground">מסלול:</span>
              <p className="font-medium">{selectedPlan.planName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">מחיר:</span>
              <p className="font-medium text-lg">₪{selectedPlan.price}/חודש</p>
            </div>
            <div>
              <span className="text-muted-foreground">תאריך:</span>
              <p className="font-medium">{today}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Signature Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              "bg-gradient-to-br",
              categoryColor.primary,
              "text-white"
            )}>
              <PenTool className="w-5 h-5" />
            </div>
            חתימה דיגיטלית
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Signature Canvas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                חתמו כאן
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4 ml-1" />
                נקה
              </Button>
            </div>
            
            <div className={cn(
              "relative border-2 rounded-xl overflow-hidden bg-white",
              hasSignature ? "border-green-400" : "border-dashed border-muted-foreground/30"
            )}>
              <SignatureCanvas
                ref={sigCanvas}
                canvasProps={{
                  className: "w-full h-40 md:h-56 touch-none",
                  style: { 
                    touchAction: 'none',
                    width: '100%',
                    height: 'auto',
                    minHeight: '160px'
                  }
                }}
                onEnd={handleSignatureEnd}
                penColor="#1a1a1a"
                minWidth={1.5}
                maxWidth={3}
                velocityFilterWeight={0.7}
              />
              
              {/* Placeholder */}
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-muted-foreground text-sm">
                    חתמו כאן בעזרת העכבר או האצבע
                  </p>
                </div>
              )}
              
              {/* Success Indicator */}
              <AnimatePresence>
                {hasSignature && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-2 left-2"
                  >
                    <div className="bg-green-500 text-white p-1 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Legal Consents */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Shield className="w-4 h-4" />
              הצהרות ואישורים
            </div>
            
            <div className="space-y-3">
              {/* Power of Attorney */}
              <div 
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                  consents.powerOfAttorney ? "bg-green-50 border-green-200" : "border-muted hover:bg-muted/50"
                )}
                onClick={() => toggleConsent('powerOfAttorney')}
              >
                <Checkbox 
                  checked={consents.powerOfAttorney}
                  onCheckedChange={() => toggleConsent('powerOfAttorney')}
                  className="mt-0.5"
                />
                <div className="text-sm">
                  <span className="font-medium">ייפוי כוח</span>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    אני מאשר/ת בזאת ייפוי כוח לביצוע פעולת מעבר ספק בשמי
                  </p>
                </div>
              </div>

              {/* Terms */}
              <div 
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                  consents.termsAccepted ? "bg-green-50 border-green-200" : "border-muted hover:bg-muted/50"
                )}
                onClick={() => toggleConsent('termsAccepted')}
              >
                <Checkbox 
                  checked={consents.termsAccepted}
                  onCheckedChange={() => toggleConsent('termsAccepted')}
                  className="mt-0.5"
                />
                <div className="text-sm">
                  <span className="font-medium">תנאי שימוש</span>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    קראתי ואני מסכים/ה לתנאי השימוש ומדיניות הפרטיות
                  </p>
                </div>
              </div>

              {/* Fees Awareness */}
              <div 
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                  consents.feesAwareness ? "bg-green-50 border-green-200" : "border-muted hover:bg-muted/50"
                )}
                onClick={() => toggleConsent('feesAwareness')}
              >
                <Checkbox 
                  checked={consents.feesAwareness}
                  onCheckedChange={() => toggleConsent('feesAwareness')}
                  className="mt-0.5"
                />
                <div className="text-sm">
                  <span className="font-medium">דמי יציאה</span>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    אני מודע/ת שעשויים להיות דמי יציאה מהספק הנוכחי
                  </p>
                </div>
              </div>

              {/* Privacy */}
              <div 
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                  consents.privacyPolicy ? "bg-green-50 border-green-200" : "border-muted hover:bg-muted/50"
                )}
                onClick={() => toggleConsent('privacyPolicy')}
              >
                <Checkbox 
                  checked={consents.privacyPolicy}
                  onCheckedChange={() => toggleConsent('privacyPolicy')}
                />
                <div className="text-sm">
                  <span className="font-medium">מדיניות פרטיות</span>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    אני מסכים/ה לעיבוד המידע האישי שלי לצורך ביצוע הבקשה
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">שימו לב</p>
              <p className="text-amber-700">
                לאחר שליחת הטופס, הבקשה תעבור לטיפול ולא ניתן יהיה לבטלה ללא יצירת קשר עם שירות הלקוחות.
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col-reverse md:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
              className="h-12 md:h-14 flex-1"
            >
              חזרה
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={cn(
                "h-12 md:h-14 flex-1 text-lg font-medium",
                "bg-gradient-to-r",
                categoryColor.primary,
                "hover:opacity-90 transition-opacity",
                "disabled:opacity-50"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  שולח...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 ml-2" />
                  שליחת הבקשה
                </>
              )}
            </Button>
          </div>

          {/* Security Footer */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
            <Shield className="w-3 h-3" />
            <span>מאובטח ב-SSL 256-bit</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SignatureFormStep;
