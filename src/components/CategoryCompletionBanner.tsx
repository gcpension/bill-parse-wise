import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { X, ChevronLeft, Sparkles, Wallet, TrendingUp, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { cn } from '@/lib/utils';

interface CategoryCompletionBannerProps {
  isVisible: boolean;
  selectedCategory: string;
  currentAmount: string;
  onAmountChange: (amount: string) => void;
  onCheckAnother: () => void;
  onProceedToPlans: () => void;
  onClose: () => void;
}

// Animated Savings Component
const AnimatedSavings = ({ amount }: { amount: number }) => {
  const displayAmount = useAnimatedCounter({ end: amount, duration: 1000 });
  
  return (
    <div className="text-4xl font-black text-primary-foreground">
      ₪{Math.round(displayAmount).toLocaleString()}
    </div>
  );
};

export const CategoryCompletionBanner = ({
  isVisible,
  selectedCategory,
  currentAmount,
  onAmountChange,
  onCheckAnother,
  onProceedToPlans,
  onClose
}: CategoryCompletionBannerProps) => {
  const categoryData: Record<string, { name: string; icon: string; gradient: string; bgGradient: string }> = {
    electricity: { 
      name: 'חשמל', 
      icon: '⚡', 
      gradient: 'from-amber-400 via-orange-400 to-orange-500',
      bgGradient: 'from-amber-50/50 via-orange-50/30 to-transparent'
    },
    cellular: { 
      name: 'סלולר', 
      icon: '📱', 
      gradient: 'from-blue-400 via-cyan-400 to-cyan-500',
      bgGradient: 'from-blue-50/50 via-cyan-50/30 to-transparent'
    },
    internet: { 
      name: 'אינטרנט', 
      icon: '🌐', 
      gradient: 'from-violet-400 via-purple-400 to-purple-500',
      bgGradient: 'from-violet-50/50 via-purple-50/30 to-transparent'
    },
    tv: { 
      name: 'טלוויזיה', 
      icon: '📺', 
      gradient: 'from-rose-400 via-pink-400 to-pink-500',
      bgGradient: 'from-rose-50/50 via-pink-50/30 to-transparent'
    }
  };

  const category = categoryData[selectedCategory] || { 
    name: '', 
    icon: '💡', 
    gradient: 'from-gray-400 to-gray-500',
    bgGradient: 'from-gray-50/50 to-transparent'
  };
  const amount = parseFloat(currentAmount) || 0;
  const hasAmount = amount > 0;
  
  // חישוב חיסכון מתקדם
  const calculateSavings = () => {
    const savingsRate = 0.3; // 30% חיסכון ממוצע
    const monthlyGain = Math.round(amount * savingsRate);
    const quarterlyGain = monthlyGain * 3;
    const yearlyGain = monthlyGain * 12;
    const twoYearGain = yearlyGain * 2;
    
    return { monthlyGain, quarterlyGain, yearlyGain, twoYearGain };
  };
  
  const savings = calculateSavings();

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Compact Banner */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="pointer-events-auto w-full max-w-md"
            >
              <Card className="relative overflow-hidden shadow-2xl rounded-3xl">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-3 left-3 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                >
                  <X className="w-4 h-4" />
                </Button>

                <div className="relative p-6">
                  {/* Compact Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-2xl">{category.icon}</span>
                    </motion.div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-foreground mb-1">{category.name}</h2>
                      <p className="text-sm text-muted-foreground">כמה אתם משלמים כרגע?</p>
                    </div>
                  </div>

                  {/* Compact Amount Display */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground font-medium">סכום חודשי</span>
                      <motion.div
                        animate={{ scale: hasAmount ? [1, 1.05, 1] : 1 }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                          "px-5 py-2 rounded-2xl transition-all duration-300",
                          hasAmount 
                            ? `bg-gradient-to-br ${category.gradient} shadow-lg` 
                            : "bg-muted"
                        )}
                      >
                        <span className={cn(
                          "text-2xl font-black",
                          hasAmount ? "text-white" : "text-foreground"
                        )}>
                          ₪{amount.toFixed(0)}
                        </span>
                      </motion.div>
                    </div>
                    
                    {/* Slider */}
                    <Slider
                      value={[amount]}
                      onValueChange={(values) => onAmountChange(values[0].toString())}
                      max={800}
                      step={10}
                      className="mb-2 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-3 [&_[role=slider]]:shadow-lg"
                    />
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₪0</span>
                      <span>₪800</span>
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="flex gap-2 mb-5">
                    {[100, 200, 350, 500].map((preset) => (
                      <Button
                        key={preset}
                        variant={amount === preset ? "default" : "outline"}
                        size="sm"
                        onClick={() => onAmountChange(preset.toString())}
                        className={cn(
                          "flex-1 h-9 rounded-xl font-bold transition-all",
                          amount === preset && "shadow-md scale-105"
                        )}
                      >
                        ₪{preset}
                      </Button>
                    ))}
                  </div>

                  {/* Compact Savings & Actions */}
                  <AnimatePresence mode="wait">
                    {hasAmount ? (
                      <motion.div
                        key="savings"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        {/* Compact Savings Display */}
                        <div className={`bg-gradient-to-br ${category.gradient} rounded-2xl p-4 text-center`}>
                          <Sparkles className="w-6 h-6 text-white mx-auto mb-2" />
                          <div className="text-xs text-white/80 mb-1">חיסכון שנתי משוער</div>
                          <div className="text-3xl font-black text-white mb-1">
                            ₪{savings.yearlyGain.toLocaleString()}
                          </div>
                          <div className="flex items-center justify-center gap-2 text-white/90 text-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span>₪{savings.monthlyGain} לחודש</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <Button
                            onClick={onProceedToPlans}
                            size="lg"
                            className="w-full h-12 rounded-2xl font-bold"
                          >
                            בואו נתחיל לחסוך
                            <ArrowLeft className="w-5 h-5 mr-2" />
                          </Button>
                          <Button
                            onClick={onCheckAnother}
                            variant="outline"
                            size="default"
                            className="w-full rounded-2xl"
                          >
                            בדקו סקטור נוסף
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-6"
                      >
                        <Wallet className="w-10 h-10 mx-auto mb-2 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">
                          גררו את הסליידר לחישוב החיסכון
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
