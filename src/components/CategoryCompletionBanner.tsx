import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, ArrowLeft, TrendingUp, ChevronLeft, Sparkles, Zap, TrendingDown } from 'lucide-react';
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

          {/* Compact Banner */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="pointer-events-auto w-full max-w-md"
            >
              <Card className="p-6 bg-card border-border shadow-2xl overflow-hidden">
                {/* Header with Image */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    <img 
                      src={happyCustomer} 
                      alt="customer" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-border"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
                          <span className="text-lg">{category.icon}</span>
                        </div>
                        <h2 className="text-lg font-bold text-foreground">{category.name}</h2>
                      </div>
                      <p className="text-xs text-muted-foreground">כמה אתה משלם היום?</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 -mt-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Input - New Style */}
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-lg" />
                  <Input
                    type="number"
                    value={currentAmount}
                    onChange={(e) => onAmountChange(e.target.value)}
                    placeholder="0"
                    className="relative h-14 text-2xl font-bold pr-12 text-right bg-transparent border-2 border-primary/20 focus:border-primary/40 rounded-lg"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <span className="text-xl font-bold text-primary">₪</span>
                  </div>
                </div>

                {/* Quick amounts */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[80, 120, 180, 250, 350, 500].map((preset) => (
                    <Button
                      key={preset}
                      variant="outline"
                      size="sm"
                      onClick={() => onAmountChange(preset.toString())}
                      className="text-xs"
                    >
                      {preset}₪
                    </Button>
                  ))}
                </div>

                {/* Savings Display - Interactive & Sales Style */}
                <AnimatePresence mode="wait">
                  {hasAmount ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {/* Main Highlight */}
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative bg-gradient-to-br from-primary via-primary to-accent p-5 rounded-xl mb-3 overflow-hidden group"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="relative">
                          <div className="flex items-center gap-2 mb-2">
                            <motion.div
                              animate={{ 
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.2, 1.2, 1]
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity,
                                repeatDelay: 3
                              }}
                            >
                              <Zap className="w-5 h-5 text-primary-foreground" />
                            </motion.div>
                            <p className="text-sm font-bold text-primary-foreground">תחסוך בשנתיים הקרובות</p>
                          </div>
                          <AnimatedSavings amount={savings.twoYearGain} />
                          <motion.p 
                            className="text-xs text-primary-foreground/80 mt-1"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            זה הזמן להתחיל לחסוך!
                          </motion.p>
                        </div>
                      </motion.div>

                      {/* Breakdown */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <motion.div 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          whileHover={{ scale: 1.05, borderColor: 'hsl(var(--primary))' }}
                          className="bg-background border border-border rounded-lg p-3 cursor-pointer"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <motion.div
                              animate={{ y: [0, -3, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <TrendingDown className="w-3 h-3 text-primary" />
                            </motion.div>
                            <span className="text-xs text-muted-foreground">חיסכון חודשי</span>
                          </div>
                          <div className="text-xl font-bold text-foreground">
                            ₪{useAnimatedCounter({ end: savings.monthlyGain, duration: 800 }).toFixed(0)}
                          </div>
                        </motion.div>

                        <motion.div 
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          whileHover={{ scale: 1.05, borderColor: 'hsl(var(--primary))' }}
                          className="bg-background border border-border rounded-lg p-3 cursor-pointer"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles className="w-3 h-3 text-primary" />
                            </motion.div>
                            <span className="text-xs text-muted-foreground">חיסכון שנתי</span>
                          </div>
                          <div className="text-xl font-bold text-foreground">
                            ₪{useAnimatedCounter({ end: savings.yearlyGain, duration: 1000 }).toFixed(0)}
                          </div>
                        </motion.div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={onProceedToPlans}
                          size="lg"
                          className="w-full"
                        >
                          בואו נתחיל לחסוך
                          <ChevronLeft className="w-4 h-4 mr-2" />
                        </Button>
                        <Button
                          onClick={onCheckAnother}
                          variant="outline"
                          size="sm"
                        >
                          בדוק סקטור נוסף
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-4"
                    >
                      <p className="text-sm text-muted-foreground">
                        הזן סכום לחישוב החיסכון
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
