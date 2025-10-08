import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, ArrowLeft, TrendingUp, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import savingsBanner from '@/assets/savings-tech-illustration.png';

interface CategoryCompletionBannerProps {
  isVisible: boolean;
  selectedCategory: string;
  currentAmount: string;
  onAmountChange: (amount: string) => void;
  onCheckAnother: () => void;
  onProceedToPlans: () => void;
  onClose: () => void;
}

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
              <Card className="p-6 bg-card border-border shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{category.name}</h2>
                      <p className="text-xs text-muted-foreground">כמה אתה משלם היום?</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Input */}
                <div className="relative mb-3">
                  <Input
                    type="number"
                    value={currentAmount}
                    onChange={(e) => onAmountChange(e.target.value)}
                    placeholder="הכנס סכום..."
                    className="h-12 text-lg font-bold pr-10 text-right"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="text-lg font-bold text-muted-foreground">₪</span>
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

                {/* Savings Display */}
                <AnimatePresence mode="wait">
                  {hasAmount ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="bg-muted/50 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <p className="text-xs text-muted-foreground">חיסכון פוטנציאלי (30%)</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div>
                            <div className="text-xs text-muted-foreground">חודש</div>
                            <div className="text-lg font-bold">₪{savings.monthlyGain}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">שנה</div>
                            <div className="text-lg font-bold">₪{savings.yearlyGain}</div>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-primary font-bold">שנתיים!</span>
                            <span className="text-xl font-bold text-primary">₪{savings.twoYearGain}</span>
                          </div>
                        </div>
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
