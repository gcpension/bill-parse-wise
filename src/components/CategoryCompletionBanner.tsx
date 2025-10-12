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

          {/* Modern Banner */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="pointer-events-auto w-full max-w-lg"
            >
              <Card className="relative overflow-hidden border-0 shadow-2xl">
                {/* Animated Gradient Background */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} dark:opacity-20`}
                  animate={{ 
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
                />
                
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-4 left-4 z-10 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-md"
                >
                  <X className="w-4 h-4" />
                </Button>

                <div className="relative p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", duration: 0.8 }}
                      className={`inline-flex w-20 h-20 rounded-3xl bg-gradient-to-br ${category.gradient} items-center justify-center shadow-xl mb-4`}
                    >
                      <span className="text-4xl">{category.icon}</span>
                    </motion.div>
                    <motion.h2 
                      className="text-3xl font-black text-foreground mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {category.name}
                    </motion.h2>
                    <motion.p 
                      className="text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      כמה אתם משלמים כרגע?
                    </motion.p>
                  </div>

                  {/* Amount Display */}
                  <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="text-center mb-6">
                      <motion.div
                        animate={{ 
                          scale: hasAmount ? [1, 1.05, 1] : 1,
                        }}
                        transition={{ duration: 0.6 }}
                        className="inline-block"
                      >
                        <div className="relative">
                          {/* Glow effect */}
                          {hasAmount && (
                            <motion.div
                              className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${category.gradient} blur-2xl`}
                              animate={{ 
                                opacity: [0.3, 0.6, 0.3],
                                scale: [1, 1.1, 1]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                          <div className={cn(
                            "relative px-8 py-6 rounded-3xl border-2 transition-all duration-500",
                            hasAmount 
                              ? `bg-gradient-to-br ${category.gradient} border-transparent shadow-2xl` 
                              : "bg-card border-border shadow-lg"
                          )}>
                            <div className="flex items-center justify-center gap-3">
                              <Wallet className={cn(
                                "w-8 h-8 transition-colors",
                                hasAmount ? "text-white" : "text-muted-foreground"
                              )} />
                              <span className={cn(
                                "text-5xl font-black transition-colors",
                                hasAmount ? "text-white" : "text-foreground"
                              )}>
                                ₪{amount.toFixed(0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      <p className="text-sm text-muted-foreground mt-3">התשלום החודשי הנוכחי שלכם</p>
                    </div>
                    
                    {/* Modern Slider */}
                    <div className="space-y-4">
                      <Slider
                        value={[amount]}
                        onValueChange={(values) => onAmountChange(values[0].toString())}
                        max={800}
                        step={10}
                        className="[&_[role=slider]]:h-7 [&_[role=slider]]:w-7 [&_[role=slider]]:border-4 [&_[role=slider]]:border-background [&_[role=slider]]:shadow-xl [&_[role=slider]]:transition-transform [&_[role=slider]]:hover:scale-110"
                      />
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>₪0</span>
                        <span className="text-primary font-semibold">← גררו לבחירת סכום →</span>
                        <span>₪800</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Quick Presets */}
                  <motion.div 
                    className="grid grid-cols-4 gap-3 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {[100, 200, 350, 500].map((preset, index) => (
                      <motion.div
                        key={preset}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                      >
                        <Button
                          variant={amount === preset ? "default" : "outline"}
                          size="lg"
                          onClick={() => onAmountChange(preset.toString())}
                          className={cn(
                            "w-full h-14 rounded-2xl font-bold text-base transition-all duration-300",
                            amount === preset 
                              ? "shadow-lg scale-105 ring-2 ring-primary/50 ring-offset-2" 
                              : "hover:scale-105 hover:border-primary/50"
                          )}
                        >
                          ₪{preset}
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Savings Display & Actions */}
                  <AnimatePresence mode="wait">
                    {hasAmount ? (
                      <motion.div
                        key="savings"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-6"
                      >
                        {/* Savings Cards Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* Monthly Savings */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-4 border border-green-200 dark:border-green-800"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-xs font-medium text-muted-foreground">חודשי</span>
                            </div>
                            <div className="text-2xl font-black text-green-600 dark:text-green-400">
                              ₪{savings.monthlyGain}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">חיסכון לחודש</div>
                          </motion.div>

                          {/* Yearly Savings */}
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                            className={`bg-gradient-to-br ${category.gradient} rounded-2xl p-4 border-0 shadow-lg`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-xs font-medium text-white/80">שנתי</span>
                            </div>
                            <div className="text-2xl font-black text-white">
                              ₪{savings.yearlyGain.toLocaleString()}
                            </div>
                            <div className="text-xs text-white/80 mt-1">חיסכון לשנה</div>
                          </motion.div>
                        </div>

                        {/* Benefits List */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 }}
                          className="bg-muted/30 rounded-2xl p-4 space-y-2"
                        >
                          {[
                            { icon: CheckCircle2, text: 'ללא עמלות החלפה' },
                            { icon: Zap, text: 'תהליך מהיר ופשוט' },
                            { icon: CheckCircle2, text: 'שירות לקוחות מעולה' }
                          ].map((benefit, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1 + index * 0.1 }}
                              className="flex items-center gap-3"
                            >
                              <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center flex-shrink-0`}>
                                <benefit.icon className="w-3.5 h-3.5 text-white" />
                              </div>
                              <span className="text-sm font-medium text-foreground">{benefit.text}</span>
                            </motion.div>
                          ))}
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.2 }}
                          className="space-y-3"
                        >
                          <Button
                            onClick={onProceedToPlans}
                            size="lg"
                            className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                          >
                            בואו נתחיל לחסוך
                            <ArrowLeft className="w-5 h-5 mr-2" />
                          </Button>
                          <Button
                            onClick={onCheckAnother}
                            variant="outline"
                            size="lg"
                            className="w-full h-12 rounded-2xl font-medium hover:scale-105 transition-all duration-300"
                          >
                            בדקו סקטור נוסף
                          </Button>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12"
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className={`inline-flex w-24 h-24 rounded-3xl bg-gradient-to-br ${category.gradient} items-center justify-center mb-4 shadow-xl`}
                        >
                          <Wallet className="w-12 h-12 text-white" />
                        </motion.div>
                        <p className="text-muted-foreground font-medium">
                          בחרו סכום כדי לראות את החיסכון הפוטנציאלי
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
