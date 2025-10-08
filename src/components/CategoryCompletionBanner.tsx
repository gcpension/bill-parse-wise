import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, ArrowLeft, Sparkles, TrendingUp, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const categoryData: Record<string, { name: string; emoji: string }> = {
    electricity: { name: 'חשמל', emoji: '⚡' },
    cellular: { name: 'סלולר', emoji: '📱' },
    internet: { name: 'אינטרנט', emoji: '🌐' },
    tv: { name: 'טלוויזיה', emoji: '📺' }
  };

  const category = categoryData[selectedCategory] || { name: '', emoji: '💡' };
  const amount = parseFloat(currentAmount) || 0;
  const estimatedSavings = Math.round(amount * 0.25);
  const yearlySavings = estimatedSavings * 12;
  const hasAmount = amount > 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Compact Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto w-full max-w-md"
            >
              <Card className="bg-card/95 backdrop-blur-xl border border-border shadow-xl overflow-hidden">
                {/* Compact Header */}
                <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute left-3 top-3 h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  <div className="text-center pt-2">
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                      className="text-5xl mb-2"
                    >
                      {category.emoji}
                    </motion.div>
                    <h2 className="text-xl font-bold text-foreground mb-1">
                      {category.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">הזן סכום חודשי</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-4 space-y-4">
                  {/* Amount Input */}
                  <div className="space-y-3">
                    <div className="relative group">
                      <Input
                        type="number"
                        value={currentAmount}
                        onChange={(e) => onAmountChange(e.target.value)}
                        placeholder="0"
                        className="text-center text-3xl font-bold h-16 border-2 focus:border-primary transition-all duration-200 rounded-lg bg-background/50"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground group-focus-within:text-primary transition-colors">
                        ₪
                      </span>
                      {hasAmount && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Quick Select */}
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {[50, 100, 150, 200, 300, 500].map(quickAmount => (
                        <Button
                          key={quickAmount}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onAmountChange(quickAmount.toString())}
                          className="h-8 px-3 text-xs font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 hover:scale-105"
                        >
                          ₪{quickAmount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Savings Display */}
                  <AnimatePresence mode="wait">
                    {hasAmount && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20 rounded-lg p-4">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                              חיסכון צפוי
                            </span>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                              ₪{estimatedSavings}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              ₪{yearlySavings} לשנה
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions */}
                  <div className="space-y-2 pt-2">
                    <Button
                      onClick={onProceedToPlans}
                      className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      disabled={!hasAmount}
                    >
                      <span className="flex items-center justify-center gap-2">
                        המשך למסלולים
                        <ArrowLeft className="w-4 h-4" />
                      </span>
                    </Button>

                    <Button
                      onClick={onCheckAnother}
                      variant="ghost"
                      className="w-full h-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!hasAmount}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        בדוק עוד סקטור
                      </span>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
