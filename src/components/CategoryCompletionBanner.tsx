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
              <Card className="relative overflow-hidden shadow-2xl rounded-3xl border-2 bg-card/95 backdrop-blur-sm">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-4 left-4 z-10 h-9 w-9 rounded-xl bg-background/90 hover:bg-background shadow-sm transition-all hover:shadow-md"
                >
                  <X className="w-4 h-4" />
                </Button>

                <div className="relative p-7">
                  {/* Professional Header */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", duration: 0.6 }}
                      className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-3xl">{category.icon}</span>
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.gradient} blur-xl opacity-50`} />
                    </motion.div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground mb-1 tracking-tight font-rubik">{category.name}</h2>
                      <p className="text-sm text-muted-foreground font-inter">הזינו את התשלום החודשי הנוכחי שלכם</p>
                    </div>
                  </div>

                  {/* Professional Amount Display */}
                  <div className="mb-6">
                    <label className="text-sm font-semibold text-muted-foreground mb-4 block font-inter">
                      סכום חודשי נוכחי
                    </label>
                    
                    {/* Amount Badge */}
                    <div className="flex justify-center mb-5">
                      <motion.div
                        animate={{ scale: hasAmount ? [1, 1.02, 1] : 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                      >
                        {hasAmount && (
                          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${category.gradient} blur-2xl opacity-30`} />
                        )}
                        <div className={cn(
                          "relative px-8 py-4 rounded-3xl transition-all duration-500 border-2",
                          hasAmount 
                            ? `bg-gradient-to-br ${category.gradient} border-transparent shadow-xl` 
                            : "bg-muted/50 border-border"
                        )}>
                          <div className="flex items-baseline justify-center gap-2">
                            <span className={cn(
                              "text-4xl font-black tracking-tight font-inter transition-colors",
                              hasAmount ? "text-white" : "text-foreground"
                            )}>
                              {amount.toFixed(0)}
                            </span>
                            <span className={cn(
                              "text-2xl font-bold transition-colors",
                              hasAmount ? "text-white/90" : "text-muted-foreground"
                            )}>
                              ₪
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Professional Slider */}
                    <div className="space-y-3">
                      <Slider
                        value={[amount]}
                        onValueChange={(values) => onAmountChange(values[0].toString())}
                        max={800}
                        step={10}
                        className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-2 [&_[role=slider]]:border-background [&_[role=slider]]:shadow-md [&_[role=slider]]:transition-all [&_[role=slider]]:hover:scale-110"
                      />
                      
                      <div className="flex justify-between text-xs font-medium text-muted-foreground font-inter">
                        <span>₪0</span>
                        <span className="text-primary">בחרו סכום</span>
                        <span>₪800+</span>
                      </div>
                    </div>
                  </div>

                  {/* Professional Presets */}
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {[100, 200, 350, 500].map((preset) => (
                      <Button
                        key={preset}
                        variant={amount === preset ? "default" : "outline"}
                        size="sm"
                        onClick={() => onAmountChange(preset.toString())}
                        className={cn(
                          "h-11 rounded-2xl font-bold text-sm font-inter transition-all duration-300",
                          amount === preset 
                            ? "shadow-lg scale-105" 
                            : "hover:border-primary/50 hover:scale-105"
                        )}
                      >
                        ₪{preset}
                      </Button>
                    ))}
                  </div>

                  {/* Professional Savings & Actions */}
                  <AnimatePresence mode="wait">
                    {hasAmount ? (
                      <motion.div
                        key="savings"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-5 pt-5 border-t border-border/50"
                      >
                        {/* Professional Savings Card */}
                        <div className="relative overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} blur-3xl opacity-20`} />
                          <div className={`relative bg-gradient-to-br ${category.gradient} rounded-3xl p-6 text-center shadow-xl`}>
                            <div className="flex items-center justify-center gap-2 mb-3">
                              <Sparkles className="w-5 h-5 text-white" />
                              <span className="text-sm font-semibold text-white/90 font-inter">חיסכון צפוי</span>
                            </div>
                            
                            <div className="space-y-3">
                              {/* Yearly */}
                              <div>
                                <div className="text-xs text-white/70 mb-1 font-inter">שנתי</div>
                                <div className="text-4xl font-black text-white tracking-tight font-inter">
                                  ₪{savings.yearlyGain.toLocaleString()}
                                </div>
                              </div>
                              
                              {/* Monthly */}
                              <div className="flex items-center justify-center gap-2 pt-3 border-t border-white/20">
                                <TrendingUp className="w-4 h-4 text-white/90" />
                                <span className="text-base font-bold text-white/90 font-inter">
                                  ₪{savings.monthlyGain} חיסכון חודשי
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Professional Action Buttons */}
                        <div className="space-y-3">
                          <Button
                            onClick={onProceedToPlans}
                            size="lg"
                            className="w-full h-13 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] font-inter"
                          >
                            התחילו לחסוך עכשיו
                            <ArrowLeft className="w-5 h-5 mr-2" />
                          </Button>
                          <Button
                            onClick={onCheckAnother}
                            variant="outline"
                            size="lg"
                            className="w-full h-11 rounded-2xl font-medium hover:scale-[1.02] transition-all font-inter"
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
                        className="text-center py-8 pt-5 border-t border-border/50"
                      >
                        <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} items-center justify-center mb-3 shadow-lg`}>
                          <Wallet className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground font-inter">
                          בחרו סכום לצפייה בחיסכון הצפוי
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
