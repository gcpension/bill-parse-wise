import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, ArrowLeft, Sparkles, TrendingUp, Check, Zap, Calendar } from 'lucide-react';
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Professional Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto w-full max-w-lg font-poppins"
            >
              <Card className="bg-card/98 backdrop-blur-2xl border-2 border-border/50 shadow-2xl overflow-hidden">
                {/* Premium Header */}
                <div className="relative bg-gradient-to-br from-primary/5 via-transparent to-accent/5 border-b border-border/50">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="absolute left-4 top-4 h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all z-10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  <div className="text-center px-6 py-8">
                    <motion.div 
                      initial={{ scale: 0.5, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-4 shadow-lg"
                    >
                      <span className="text-5xl">{category.emoji}</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
                        {category.name}
                      </h2>
                      <p className="text-sm text-muted-foreground font-medium">
                        בואו נחשב את החיסכון הפוטנציאלי שלך
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  {/* Amount Input Section */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <label className="text-sm font-semibold text-foreground mb-3 block">
                        התשלום החודשי הנוכחי שלך
                      </label>
                    </div>
                    
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                      <div className="relative">
                        <Input
                          type="number"
                          value={currentAmount}
                          onChange={(e) => onAmountChange(e.target.value)}
                          placeholder="0"
                          className="text-center text-4xl font-bold h-20 border-2 border-border focus:border-primary transition-all duration-300 rounded-xl bg-background shadow-sm"
                        />
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
                          ₪
                        </span>
                        {hasAmount && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="absolute right-6 top-1/2 -translate-y-1/2"
                          >
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shadow-sm">
                              <Check className="w-5 h-5 text-primary" />
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Quick Select Chips */}
                    <div className="flex flex-wrap gap-2 justify-center pt-2">
                      {[50, 100, 150, 200, 300, 500].map((quickAmount, idx) => (
                        <motion.div
                          key={quickAmount}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + idx * 0.05 }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onAmountChange(quickAmount.toString())}
                            className="h-9 px-4 text-sm font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 hover:scale-110 hover:shadow-md"
                          >
                            ₪{quickAmount}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Savings Projection */}
                  <AnimatePresence mode="wait">
                    {hasAmount && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="bg-gradient-to-br from-success/5 via-success/10 to-emerald-500/5 border-2 border-success/20 rounded-xl p-6 shadow-lg">
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                              <Zap className="w-4 h-4 text-success" />
                            </div>
                            <span className="text-base font-bold text-success">
                              פוטנציאל חיסכון
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center p-4 bg-background/50 rounded-lg border border-border/30">
                              <div className="text-xs text-muted-foreground mb-1 font-medium">חודשי</div>
                              <div className="text-3xl font-bold text-success">
                                ₪{estimatedSavings}
                              </div>
                            </div>
                            <div className="text-center p-4 bg-background/50 rounded-lg border border-border/30">
                              <div className="text-xs text-muted-foreground mb-1 font-medium">שנתי</div>
                              <div className="text-3xl font-bold text-success">
                                ₪{yearlySavings}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-background/30 rounded-lg py-2 px-3">
                            <Calendar className="w-3 h-3" />
                            <span>מבוסס על ממוצע חיסכון של 25%</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-3 pt-2"
                  >
                    <Button
                      onClick={onProceedToPlans}
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-lg rounded-xl"
                      disabled={!hasAmount}
                    >
                      <span className="flex items-center justify-center gap-2">
                        המשך למסלולים
                        <ArrowLeft className="w-5 h-5" />
                      </span>
                    </Button>

                    <Button
                      onClick={onCheckAnother}
                      variant="outline"
                      className="w-full h-11 border-2 text-foreground hover:bg-accent/50 hover:border-accent font-semibold transition-all duration-200 hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 rounded-xl"
                      disabled={!hasAmount}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        בדוק סקטור נוסף
                      </span>
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
