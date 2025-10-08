import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { X, ChevronLeft, Sparkles, Zap, TrendingDown, Calendar, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import happyCustomer from '@/assets/happy-customer.jpg';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

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
  const categoryData: Record<string, { name: string; icon: string; gradient: string }> = {
    electricity: { name: 'חשמל', icon: '⚡', gradient: 'from-amber-400 to-orange-500' },
    cellular: { name: 'סלולר', icon: '📱', gradient: 'from-blue-400 to-cyan-500' },
    internet: { name: 'אינטרנט', icon: '🌐', gradient: 'from-violet-400 to-purple-500' },
    tv: { name: 'טלוויזיה', icon: '📺', gradient: 'from-rose-400 to-pink-500' }
  };

  const category = categoryData[selectedCategory] || { name: '', icon: '💡', gradient: 'from-gray-400 to-gray-500' };
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
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Compact Circular Banner */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="pointer-events-auto w-full max-w-sm"
            >
              <Card className="p-5 bg-card border-border shadow-2xl overflow-hidden rounded-3xl">
                {/* Header with Image */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-start gap-3 flex-1">
                    <img 
                      src={happyCustomer} 
                      alt="customer" 
                      className="w-14 h-14 rounded-full object-cover border-2 border-border shadow-sm"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-sm`}>
                          <span className="text-base">{category.icon}</span>
                        </div>
                        <h2 className="text-base font-bold text-foreground">{category.name}</h2>
                      </div>
                      <p className="text-xs text-muted-foreground">כמה אתה משלם היום?</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-7 w-7 rounded-full -mt-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Slider Input */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs text-muted-foreground">גרור להגדרת סכום</span>
                    <motion.div 
                      className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full"
                      animate={{ scale: hasAmount ? [1, 1.05, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-xl font-black text-primary">₪{amount.toFixed(0)}</span>
                      <Wallet className="w-4 h-4 text-primary" />
                    </motion.div>
                  </div>
                  
                  <Slider
                    value={[amount]}
                    onValueChange={(values) => onAmountChange(values[0].toString())}
                    max={800}
                    step={10}
                    className="mb-2.5"
                  />
                  
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>₪0</span>
                    <span>₪800</span>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {[100, 200, 350, 500].map((preset) => (
                    <Button
                      key={preset}
                      variant={amount === preset ? "default" : "outline"}
                      size="sm"
                      onClick={() => onAmountChange(preset.toString())}
                      className="flex-1 text-xs h-8 rounded-full"
                    >
                      {preset}₪
                    </Button>
                  ))}
                </div>

                {/* Savings Timeline */}
                <AnimatePresence mode="wait">
                  {hasAmount ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="space-y-2"
                    >
                      {/* Timeline Items */}
                      {[
                        { period: 'חודש', amount: savings.monthlyGain, icon: Calendar, delay: 0 },
                        { period: '3 חודשים', amount: savings.quarterlyGain, icon: TrendingDown, delay: 0.1 },
                        { period: 'שנה', amount: savings.yearlyGain, icon: Sparkles, delay: 0.2 },
                        { period: 'שנתיים', amount: savings.twoYearGain, icon: Zap, delay: 0.3, highlight: true }
                      ].map((item, index) => {
                        const Icon = item.icon;
                        const progress = (item.amount / savings.twoYearGain) * 100;
                        
                        return (
                          <motion.div
                            key={item.period}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: item.delay }}
                            className={`relative ${item.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-2xl p-2.5 overflow-hidden`}
                          >
                            {/* Progress Bar Background */}
                            <motion.div
                              className={`absolute inset-0 rounded-2xl ${item.highlight ? 'bg-primary-foreground/20' : 'bg-primary/10'}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, delay: item.delay + 0.2 }}
                            />
                            
                            <div className="relative flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <motion.div
                                  animate={{ rotate: item.highlight ? [0, 360] : 0 }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className={`w-7 h-7 rounded-full flex items-center justify-center ${item.highlight ? 'bg-primary-foreground/20' : 'bg-primary/10'}`}
                                >
                                  <Icon className={`w-3.5 h-3.5 ${item.highlight ? 'text-primary-foreground' : 'text-primary'}`} />
                                </motion.div>
                                <div>
                                  <div className={`text-[10px] ${item.highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                                    חיסכון ב{item.period}
                                  </div>
                                  <div className={`text-base font-black ${item.highlight ? 'text-primary-foreground' : 'text-foreground'}`}>
                                    ₪{useAnimatedCounter({ end: item.amount, duration: 800, start: 0 }).toFixed(0)}
                                  </div>
                                </div>
                              </div>
                              {item.highlight && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.5, type: "spring" }}
                                  className="bg-primary-foreground text-primary px-2 py-0.5 rounded-full text-[10px] font-bold"
                                >
                                  מומלץ!
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}

                      {/* Actions */}
                      <motion.div 
                        className="flex flex-col gap-1.5 pt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Button
                          onClick={onProceedToPlans}
                          size="default"
                          className="w-full rounded-full h-10"
                        >
                          בואו נתחיל לחסוך
                          <ChevronLeft className="w-4 h-4 mr-2" />
                        </Button>
                        <Button
                          onClick={onCheckAnother}
                          variant="outline"
                          size="sm"
                          className="rounded-full h-8"
                        >
                          בדוק סקטור נוסף
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-6"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Wallet className="w-10 h-10 mx-auto mb-2 text-muted-foreground/50" />
                      </motion.div>
                      <p className="text-xs text-muted-foreground">
                        גרור את הסליידר לחישוב החיסכון
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
