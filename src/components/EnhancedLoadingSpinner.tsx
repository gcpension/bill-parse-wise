import { useState, useEffect } from 'react';
import { Loader2, Zap, TrendingDown, BarChart3, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface EnhancedLoadingSpinnerProps {
  stage?: 'analyzing' | 'comparing' | 'calculating' | 'completed';
  progress?: number;
  message?: string;
  showSteps?: boolean;
}

const loadingStages = [
  {
    key: 'analyzing',
    icon: Zap,
    title: 'מנתח נתונים',
    description: 'סורק את החשבונית ומזהה פרטים',
    color: 'text-primary'
  },
  {
    key: 'comparing',
    icon: BarChart3,
    title: 'משווה מחירים',
    description: 'בודק את כל הספקים בשוק',
    color: 'text-primary-glow'
  },
  {
    key: 'calculating',
    icon: TrendingDown,
    title: 'מחשב חיסכון',
    description: 'מוצא את החבילה הכי משתלמת',
    color: 'text-success'
  },
  {
    key: 'completed',
    icon: CheckCircle2,
    title: 'הושלם!',
    description: 'התוצאות מוכנות',
    color: 'text-success'
  }
];

const loadingMessages = [
  'מנתח את החשבונית שלך...',
  'משווה בין עשרות ספקים...',
  'מחפש את החבילה הטובה ביותר...',
  'מחשב את החיסכון האפשרי...',
  'כמעט סיימנו...'
];

export const EnhancedLoadingSpinner = ({ 
  stage = 'analyzing', 
  progress = 0, 
  message,
  showSteps = true 
}: EnhancedLoadingSpinnerProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Rotate through messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Animate progress
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const currentStageIndex = loadingStages.findIndex(s => s.key === stage);
  const displayMessage = message || loadingMessages[currentMessageIndex];

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      {/* Main Loading Animation */}
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 animate-spin">
          <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full"></div>
        </div>
        
        {/* Inner pulsing circle */}
        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center animate-pulse">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        
        {/* Floating particles */}
        <div className="absolute -inset-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full animate-ping"
              style={{
                left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 40}px`,
                top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 40}px`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md space-y-2">
        <Progress value={animatedProgress} className="h-2" />
        <div className="text-center text-sm text-muted-foreground">
          {Math.round(animatedProgress)}% הושלם
        </div>
      </div>

      {/* Current Message */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold animate-fade-in">
          {displayMessage}
        </h3>
        <p className="text-sm text-muted-foreground">
          זה לוקח רק כמה שניות...
        </p>
      </div>

      {/* Steps Progress (if enabled) */}
      {showSteps && (
        <div className="w-full max-w-md space-y-3">
          <div className="text-center text-sm font-medium text-muted-foreground mb-4">
            תהליך הניתוח
          </div>
          {loadingStages.map((stageItem, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const isPending = index > currentStageIndex;
            
            const Icon = stageItem.icon;
            
            return (
              <div
                key={stageItem.key}
                className={`flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-success/10 border border-success/20' 
                    : isCurrent 
                    ? 'bg-primary/10 border border-primary/20 animate-pulse' 
                    : 'bg-muted/30'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  isCompleted 
                    ? 'bg-success text-success-foreground' 
                    : isCurrent 
                    ? 'bg-primary text-primary-foreground animate-bounce' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1">
                  <div className={`font-medium ${
                    isCompleted 
                      ? 'text-success' 
                      : isCurrent 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  }`}>
                    {stageItem.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stageItem.description}
                  </div>
                </div>
                
                {isCompleted && (
                  <CheckCircle2 className="h-5 w-5 text-success animate-scale-in" />
                )}
                
                {isCurrent && (
                  <div className="h-5 w-5">
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tips */}
      <div className="text-center space-y-2 max-w-md">
        <div className="text-xs text-muted-foreground bg-accent/50 rounded-lg p-3">
          <strong>💡 הידעת?</strong> הלקוחות שלנו חוסכים בממוצע ₪2,400 בשנה!
        </div>
      </div>
    </div>
  );
};