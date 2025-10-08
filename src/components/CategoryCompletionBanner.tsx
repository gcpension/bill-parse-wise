import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { X, ChevronLeft, Sparkles, Zap, TrendingDown, Calendar, Wallet, TrendingUp, DollarSign, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import happyCustomer from '@/assets/happy-customer.jpg';
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

          {/* Clean Banner */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="pointer-events-auto w-full max-w-md"
            >
              <Card className="p-6 bg-card border-border shadow-2xl overflow-hidden rounded-2xl">
                {/* Header with Image */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    <img 
                      src={happyCustomer} 
                      alt="customer" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-border shadow-md"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-sm`}>
                          <span className="text-lg">{category.icon}</span>
                        </div>
                        <h2 className="text-lg font-bold text-foreground">{category.name}</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">כמה אתה משלם היום?</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Interactive Slider with Visual Feedback */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground font-medium">סכום נוכחי</span>
                    <motion.div 
                      className="relative"
                      animate={{ scale: hasAmount ? [1, 1.1, 1] : 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Glow effect behind amount */}
                      <motion.div
                        className={`absolute inset-0 rounded-2xl blur-xl ${hasAmount ? 'bg-primary/30' : 'bg-muted/30'}`}
                        animate={{ 
                          scale: hasAmount ? [1, 1.2, 1] : 1,
                          opacity: hasAmount ? [0.5, 0.8, 0.5] : 0.3
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <div className="relative flex items-baseline gap-2 bg-gradient-to-br from-primary to-primary/80 px-6 py-3 rounded-2xl shadow-lg">
                        <span className="text-3xl font-black text-primary-foreground">₪{amount.toFixed(0)}</span>
                        <Wallet className="w-6 h-6 text-primary-foreground/80" />
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Custom Styled Slider */}
                  <div className="relative mb-4">
                    {/* Progress bar background */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-3 bg-gradient-to-r from-muted via-primary/20 to-primary/40 rounded-full" />
                    
                    <Slider
                      value={[amount]}
                      onValueChange={(values) => onAmountChange(values[0].toString())}
                      max={800}
                      step={10}
                      className="relative z-10 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-4 [&_[role=slider]]:border-primary-foreground [&_[role=slider]]:shadow-xl"
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground font-medium">
                    <span>₪0</span>
                    <span className="text-primary font-bold">גרור לבחירת סכום</span>
                    <span>₪800</span>
                  </div>
                </div>

                {/* Quick Presets with animations */}
                <div className="flex gap-2 mb-6">
                  {[100, 200, 350, 500].map((preset, index) => (
                    <motion.div
                      key={preset}
                      className="flex-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        variant={amount === preset ? "default" : "outline"}
                        size="sm"
                        onClick={() => onAmountChange(preset.toString())}
                        className={cn(
                          "w-full h-10 rounded-xl font-bold transition-all",
                          amount === preset && "shadow-lg shadow-primary/50 scale-105"
                        )}
                      >
                        ₪{preset}
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {/* Balanced Layout with Large Circle */}
                <AnimatePresence mode="wait">
                  {hasAmount ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex gap-4 items-center"
                    >
                      {/* Large Circular Progress */}
                      <motion.div 
                        className="relative w-36 h-36 flex-shrink-0"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.7, type: "spring" }}
                      >
                        {/* Subtle glow */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-xl" />
                        
                        {/* Main circle SVG */}
                        <svg className="relative w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          {/* Background circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="7"
                            className="text-muted/20"
                          />
                          
                          {/* Animated progress circle */}
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="7"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 42}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                            animate={{ strokeDashoffset: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                          
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="hsl(var(--primary))" />
                              <stop offset="100%" stopColor="hsl(var(--accent))" />
                            </linearGradient>
                          </defs>
                        </svg>
                        
                        {/* Center content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: "spring" }}
                          >
                            <Sparkles className="w-6 h-6 text-primary mb-1" />
                            <div className="text-xs text-muted-foreground">חיסכון שנתי</div>
                            <div className="text-2xl font-black text-primary">
                              ₪{savings.yearlyGain.toLocaleString()}
                            </div>
                            <div className="flex items-center justify-center gap-1 mt-1">
                              <TrendingUp className="w-3 h-3 text-green-500" />
                              <span className="text-xs font-bold text-green-600">30%</span>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Stats Cards */}
                      <div className="flex-1 space-y-2">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-gradient-to-l from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl p-3 border border-blue-200 dark:border-blue-800"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-blue-700 dark:text-blue-400">חיסכון חודשי</div>
                              <div className="text-xl font-black text-blue-600">₪{savings.monthlyGain}</div>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          className="bg-gradient-to-l from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-3 border border-purple-200 dark:border-purple-800"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                              <Zap className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-purple-700 dark:text-purple-400">החזר השקעה</div>
                              <div className="text-xl font-black text-purple-600">2 חודשים</div>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Actions */}
                      <motion.div 
                        className="flex flex-col gap-2 pt-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Button
                          onClick={onProceedToPlans}
                          size="lg"
                          className="w-full rounded-xl"
                        >
                          בואו נתחיל לחסוך
                          <ChevronLeft className="w-5 h-5 mr-2" />
                        </Button>
                        <Button
                          onClick={onCheckAnother}
                          variant="outline"
                          size="default"
                          className="rounded-xl"
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
                      className="text-center py-8"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Wallet className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                      </motion.div>
                      <p className="text-sm text-muted-foreground">
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
