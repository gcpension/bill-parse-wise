import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignatureCanvas from "react-signature-canvas";
import { PenTool, RotateCcw, Check, Shield, AlertTriangle, FileCheck, Loader2, ChevronRight, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const [hasSignature, setHasSignature] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 150 });
  const [consents, setConsents] = useState({
    termsAccepted: false,
    feesAwareness: false,
    powerOfAttorney: false,
    privacyPolicy: false,
  });

  // Resize canvas to container
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasContainerRef.current) {
        const width = canvasContainerRef.current.offsetWidth - 4; // Account for border
        setCanvasSize({ width, height: Math.min(180, width * 0.5) });
      }
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

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
  const consentsCount = Object.values(consents).filter(Boolean).length;
  const totalConsents = Object.keys(consents).length;

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

  const consentItems = [
    {
      key: 'powerOfAttorney' as const,
      title: 'ייפוי כוח',
      description: 'אני מאשר/ת ייפוי כוח לביצוע מעבר ספק בשמי'
    },
    {
      key: 'termsAccepted' as const,
      title: 'תנאי שימוש',
      description: 'קראתי ואני מסכים/ה לתנאי השימוש'
    },
    {
      key: 'feesAwareness' as const,
      title: 'דמי יציאה',
      description: 'אני מודע/ת לדמי יציאה אפשריים מהספק הנוכחי'
    },
    {
      key: 'privacyPolicy' as const,
      title: 'מדיניות פרטיות',
      description: 'אני מסכים/ה לעיבוד המידע האישי שלי'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">חתימה ואישורים</span>
          <span className={cn("font-bold", categoryColor.text)}>
            {consentsCount + (hasSignature ? 1 : 0)}/{totalConsents + 1}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className={cn("h-full rounded-full bg-gradient-to-r", categoryColor.primary)}
            animate={{ width: `${((consentsCount + (hasSignature ? 1 : 0)) / (totalConsents + 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Summary Card */}
      <Card className={cn("border-2 overflow-hidden", categoryColor.border)}>
        <div className={cn("px-4 py-3", categoryColor.bg)}>
          <div className="flex items-center gap-2">
            <FileCheck className={cn("w-5 h-5", categoryColor.text)} />
            <span className={cn("font-bold", categoryColor.text)}>סיכום הבקשה</span>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground block text-xs">שם מלא</span>
              <span className="font-medium">{personalInfo.fullName}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">ת.ז.</span>
              <span className="font-medium">{personalInfo.nationalId}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">ספק חדש</span>
              <span className="font-medium">{selectedPlan.company}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">מחיר</span>
              <span className={cn("font-bold text-lg", categoryColor.text)}>₪{selectedPlan.price}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Signature Canvas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenTool className={cn("w-4 h-4", hasSignature ? "text-green-600" : "text-muted-foreground")} />
            <span className="text-sm font-medium">חתימה דיגיטלית</span>
            {hasSignature && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-green-100 rounded-full p-0.5"
              >
                <Check className="w-3 h-3 text-green-600" />
              </motion.div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground h-8"
          >
            <RotateCcw className="w-4 h-4 ml-1" />
            נקה
          </Button>
        </div>
        
        <div 
          ref={canvasContainerRef}
          className={cn(
            "relative rounded-2xl border-2 overflow-hidden bg-white",
            hasSignature ? "border-green-400" : "border-dashed border-muted-foreground/30"
          )}
        >
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              width: canvasSize.width,
              height: canvasSize.height,
              className: "touch-none",
              style: { 
                touchAction: 'none',
                width: '100%',
                height: `${canvasSize.height}px`
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
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <PenTool className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-muted-foreground/50 text-sm text-center">
                חתמו כאן באצבע או בעכבר
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Consents - Modern Style */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Shield className="w-4 h-4" />
          <span>הצהרות ואישורים</span>
        </div>
        
        <div className="space-y-2">
          {consentItems.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => toggleConsent(item.key)}
              className={cn(
                "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer",
                consents[item.key] 
                  ? "bg-green-50 border-green-200" 
                  : "border-muted-foreground/20 hover:bg-muted/50 active:bg-muted"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center transition-colors flex-shrink-0",
                consents[item.key] ? "bg-green-500" : "bg-muted"
              )}>
                {consents[item.key] && <Check className="w-4 h-4 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{item.title}</div>
                <div className="text-xs text-muted-foreground truncate">{item.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Warning Notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-amber-800">שימו לב</p>
          <p className="text-amber-700 text-xs mt-1">
            לאחר השליחה, לא ניתן יהיה לבטל ללא פנייה לשירות הלקוחות.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 h-14 text-lg rounded-2xl border-2"
        >
          <ChevronRight className="w-5 h-5 ml-2" />
          חזרה
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={cn(
            "flex-[2] h-14 text-lg font-bold rounded-2xl shadow-lg",
            "bg-gradient-to-r",
            canSubmit ? categoryColor.primary : "from-gray-400 to-gray-500",
            "hover:opacity-90 hover:shadow-xl active:scale-[0.98]",
            "disabled:opacity-70"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 ml-2 animate-spin" />
              שולח...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 ml-2" />
              שליחת הבקשה
            </>
          )}
        </Button>
      </div>

      {/* Security Footer */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
        <Shield className="w-3 h-3" />
        <span>מאובטח ב-SSL 256-bit</span>
        <span>•</span>
        <span>{today}</span>
      </div>
    </motion.div>
  );
};

export default SignatureFormStep;
