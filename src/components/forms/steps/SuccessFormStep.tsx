import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  PartyPopper, Copy, Check, Clock, Phone, Mail, Home, FileDown, 
  Share2, MessageCircle, Calendar, QrCode, Sparkles 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

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

// Enhanced Confetti with more particles and variety
const Confetti = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#82E0AA', '#F1948A'];
  const shapes = ['square', 'circle', 'triangle'];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 80 }).map((_, i) => {
        const shape = shapes[i % shapes.length];
        return (
          <motion.div
            key={i}
            className={cn(
              "absolute",
              shape === 'square' && "w-3 h-3 rounded-sm",
              shape === 'circle' && "w-2 h-2 rounded-full",
              shape === 'triangle' && "w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent"
            )}
            style={{
              backgroundColor: shape !== 'triangle' ? colors[i % colors.length] : 'transparent',
              borderBottomColor: shape === 'triangle' ? colors[i % colors.length] : undefined,
              left: `${Math.random() * 100}%`,
              top: -20,
            }}
            initial={{ y: -20, rotate: 0, opacity: 1 }}
            animate={{
              y: window.innerHeight + 20,
              rotate: Math.random() * 1080 - 540,
              opacity: [1, 1, 1, 0],
              x: [0, (Math.random() - 0.5) * 100],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              delay: Math.random() * 1.5,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
};

// Animated Checkmark
const AnimatedCheckmark = ({ categoryColor }: { categoryColor: { primary: string } }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      className="relative w-24 h-24 mx-auto"
    >
      {/* Outer glow */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-br opacity-30 blur-xl",
          categoryColor.primary
        )}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Main circle */}
      <motion.div
        className={cn(
          "relative w-full h-full rounded-full flex items-center justify-center",
          "bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-200"
        )}
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {/* Checkmark */}
        <motion.svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
        </motion.svg>
      </motion.div>

      {/* Sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{
            duration: 1.5,
            delay: 0.8 + i * 0.15,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </motion.div>
      ))}
    </motion.div>
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
  const { trigger: haptic } = useHapticFeedback();
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    haptic('success');
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [haptic]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referenceNumber);
      setCopied(true);
      haptic('selection');
      toast({
        title: "הועתק! ✓",
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
      text: `בקשה מס' ${referenceNumber} נשלחה בהצלחה!\n\nמסלול: ${selectedPlan.company} - ${selectedPlan.planName}\nמחיר: ₪${selectedPlan.price}/חודש`,
    };
    
    haptic('selection');
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

  const handleWhatsAppShare = () => {
    haptic('selection');
    const message = encodeURIComponent(
      `✅ הגשתי בקשה למעבר ספק!\n\n` +
      `📋 מספר אסמכתה: ${referenceNumber}\n` +
      `🏢 ספק חדש: ${selectedPlan.company}\n` +
      `💰 מחיר: ₪${selectedPlan.price}/חודש`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleAddToCalendar = () => {
    haptic('selection');
    // Calculate estimated switch date (7 business days from now)
    const switchDate = new Date();
    switchDate.setDate(switchDate.getDate() + 10);
    
    const startDate = switchDate.toISOString().replace(/-|:|\.\d{3}/g, '');
    const endDate = switchDate.toISOString().replace(/-|:|\.\d{3}/g, '');
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`מעבר לספק ${selectedPlan.company}`)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(`מספר אסמכתה: ${referenceNumber}\nמסלול: ${selectedPlan.planName}`)}`;
    
    window.open(calendarUrl, '_blank');
    
    toast({
      title: "נפתח הקלנדר",
      description: "הוסף תזכורת ליומן שלך",
    });
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
        className="space-y-5"
      >
        {/* Success Header with Animated Checkmark */}
        <div className="text-center space-y-4">
          <AnimatedCheckmark categoryColor={categoryColor} />
          
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

        {/* Reference Number Card with QR Option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className={cn("border-2 overflow-hidden", categoryColor.border, categoryColor.bg)}>
            <CardContent className="p-5">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">מספר אסמכתה</p>
                <div className="flex items-center justify-center gap-3">
                  <motion.span 
                    className={cn("text-2xl md:text-3xl font-mono font-bold tracking-wider", categoryColor.text)}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.6 }}
                  >
                    {referenceNumber}
                  </motion.span>
                  <div className="flex gap-1">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowQR(!showQR)}
                      className={cn("h-10 w-10", showQR && categoryColor.bg)}
                    >
                      <QrCode className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                
                {/* Simple QR Representation */}
                {showQR && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-3"
                  >
                    <div className="inline-flex flex-col items-center gap-2 p-4 bg-white rounded-xl border">
                      <div className="w-24 h-24 bg-gray-900 rounded-lg flex items-center justify-center">
                        <div className="text-white text-xs text-center p-2">
                          QR Code<br/>
                          {referenceNumber}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">סרוק למעקב</p>
                    </div>
                  </motion.div>
                )}
                
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
            <CardContent className="p-5">
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

        {/* Quick Actions - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="grid grid-cols-3 gap-2"
        >
          <Button
            variant="outline"
            onClick={handleWhatsAppShare}
            className="h-16 flex-col gap-1 rounded-2xl border-2 hover:bg-green-50 hover:border-green-200"
          >
            <MessageCircle className="w-5 h-5 text-green-600" />
            <span className="text-xs">WhatsApp</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleAddToCalendar}
            className="h-16 flex-col gap-1 rounded-2xl border-2 hover:bg-blue-50 hover:border-blue-200"
          >
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-xs">קלנדר</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => toast({ title: "בקרוב", description: "הורדת PDF תהיה זמינה בקרוב" })}
            className="h-16 flex-col gap-1 rounded-2xl border-2 hover:bg-purple-50 hover:border-purple-200"
          >
            <FileDown className="w-5 h-5 text-purple-600" />
            <span className="text-xs">הורד PDF</span>
          </Button>
        </motion.div>

        {/* Timeline - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
                <Clock className={cn("w-5 h-5", categoryColor.text)} />
                מה עכשיו?
              </h3>
              
              <div className="space-y-3">
                {timeline.map((item, index) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <motion.div 
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium",
                          item.status === 'completed' 
                            ? "bg-green-500 text-white" 
                            : "bg-muted text-muted-foreground"
                        )}
                        initial={item.status === 'completed' ? { scale: 0 } : {}}
                        animate={item.status === 'completed' ? { scale: 1 } : {}}
                        transition={{ delay: 0.8 }}
                      >
                        {item.status === 'completed' ? <Check className="w-4 h-4" /> : item.step}
                      </motion.div>
                      {index < timeline.length - 1 && (
                        <div className={cn(
                          "w-0.5 h-8",
                          item.status === 'completed' ? "bg-green-500" : "bg-muted"
                        )} />
                      )}
                    </div>
                    <div className="pb-2">
                      <p className={cn(
                        "font-medium text-sm",
                        item.status === 'completed' ? "text-green-600" : "text-foreground"
                      )}>
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
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
            <CardContent className="p-5">
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

        {/* Main Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            onClick={() => navigate('/')}
            className={cn(
              "w-full h-14 text-lg font-bold rounded-2xl shadow-lg",
              "bg-gradient-to-r",
              categoryColor.primary,
              "hover:opacity-90 hover:shadow-xl active:scale-[0.98]"
            )}
          >
            <Home className="w-5 h-5 ml-2" />
            חזרה לדף הבית
          </Button>
        </motion.div>
      </motion.div>
    </>
  );
};

export default SuccessFormStep;
