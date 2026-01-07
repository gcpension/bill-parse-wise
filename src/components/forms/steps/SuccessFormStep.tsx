import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PartyPopper, Copy, Check, Clock, Phone, Mail, Home, FileDown, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SuccessFormStepProps {
  referenceNumber: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  selectedPlan: {
    company: string;
    planName: string;
    price: number;
  };
  onClose: () => void;
  categoryColor?: {
    primary: string;
    light: string;
    text: string;
    border: string;
    bg: string;
  };
}

// Confetti component
const Confetti = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 20,
            rotate: Math.random() * 720 - 360,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export const SuccessFormStep = ({
  referenceNumber,
  personalInfo,
  selectedPlan,
  onClose,
  categoryColor = {
    primary: "from-primary to-primary/80",
    light: "from-primary/5 to-primary/10",
    text: "text-primary",
    border: "border-primary/20",
    bg: "bg-primary/5"
  }
}: SuccessFormStepProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referenceNumber);
      setCopied(true);
      toast({
        title: "הועתק!",
        description: "מספר האסמכתה הועתק ללוח",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "שגיאה",
        description: "לא ניתן להעתיק",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'בקשת מעבר ספק',
      text: `בקשה מס' ${referenceNumber} נשלחה בהצלחה!`,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopy();
    }
  };

  const timeline = [
    { step: 1, title: 'קבלת הבקשה', description: 'הבקשה התקבלה במערכת', status: 'completed' },
    { step: 2, title: 'בדיקה ואימות', description: 'אימות פרטים מול הספקים', status: 'pending', time: '1-2 ימי עסקים' },
    { step: 3, title: 'ביצוע המעבר', description: 'העברה לספק החדש', status: 'pending', time: '3-5 ימי עסקים' },
    { step: 4, title: 'אישור סיום', description: 'הודעה על השלמת המעבר', status: 'pending', time: '5-7 ימי עסקים' },
  ];

  return (
    <>
      {showConfetti && <Confetti />}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Success Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className={cn(
              "w-20 h-20 mx-auto rounded-full flex items-center justify-center",
              "bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-200"
            )}
          >
            <PartyPopper className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              הבקשה נשלחה בהצלחה! 🎉
            </h2>
            <p className="text-muted-foreground mt-2">
              נשלח אליך אישור למייל {personalInfo.email}
            </p>
          </motion.div>
        </div>

        {/* Reference Number Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">מספר אסמכתה</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl md:text-3xl font-mono font-bold text-primary tracking-wider">
                    {referenceNumber}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="h-10 w-10"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  שמרו את המספר למעקב אחר הבקשה
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Plan Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">המסלול החדש שלך</p>
                  <p className="font-semibold text-lg">{selectedPlan.company} - {selectedPlan.planName}</p>
                </div>
                <Badge className={cn("text-lg px-4 py-1", categoryColor.bg, categoryColor.text)}>
                  ₪{selectedPlan.price}/חודש
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                מה עכשיו?
              </h3>
              
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                        item.status === 'completed' 
                          ? "bg-green-500 text-white" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        {item.status === 'completed' ? <Check className="w-4 h-4" /> : item.step}
                      </div>
                      {index < timeline.length - 1 && (
                        <div className={cn(
                          "w-0.5 h-full min-h-[40px]",
                          item.status === 'completed' ? "bg-green-500" : "bg-muted"
                        )} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className={cn(
                        "font-medium",
                        item.status === 'completed' ? "text-green-600" : "text-foreground"
                      )}>
                        {item.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      {item.time && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {item.time}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">צריכים עזרה?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>1-800-XXX-XXX</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>support@easyswitch.co.il</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex-1 h-12"
          >
            <Share2 className="w-4 h-4 ml-2" />
            שתף
          </Button>
          <Button
            variant="outline"
            onClick={() => {/* Download PDF logic */}}
            className="flex-1 h-12"
          >
            <FileDown className="w-4 h-4 ml-2" />
            הורד אישור
          </Button>
          <Button
            onClick={() => navigate('/')}
            className={cn(
              "flex-1 h-12",
              "bg-gradient-to-r",
              categoryColor.primary
            )}
          >
            <Home className="w-4 h-4 ml-2" />
            חזרה לדף הבית
          </Button>
        </motion.div>
      </motion.div>
    </>
  );
};

export default SuccessFormStep;
