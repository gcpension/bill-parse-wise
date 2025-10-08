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
            className="fixed inset-0 bg-background/80 backdrop-blur-xl z-50"
            onClick={onClose}
          />

          {/* Floating Cards Layout */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
            <div className="pointer-events-auto w-full max-w-5xl py-8">
              {/* Close Button - Floating */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex justify-start mb-4"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-12 w-12 rounded-full bg-card hover:bg-muted border border-border shadow-lg"
                >
                  <X className="w-5 h-5" />
                </Button>
              </motion.div>

              {/* Floating Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Category Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20, rotate: -2 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="md:col-span-1"
                >
                  <Card className="p-6 bg-card border-border shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}>
                        <span className="text-4xl">{category.icon}</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-1">
                          {category.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          הסקטור שבחרת
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Amount Input Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="md:col-span-2"
                >
                  <Card className="p-6 bg-card border-border shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                    <h3 className="text-lg font-bold text-foreground mb-4">כמה אתה משלם היום?</h3>
                    <div className="relative mb-4">
                      <Input
                        type="number"
                        value={currentAmount}
                        onChange={(e) => onAmountChange(e.target.value)}
                        placeholder="הכנס סכום..."
                        className="h-14 text-xl font-bold pr-12 text-right border-2 border-border focus:border-primary rounded-xl"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <span className="text-xl font-bold text-muted-foreground">₪</span>
                      </div>
                    </div>
                    
                    {/* Quick amounts */}
                    <div className="flex flex-wrap gap-2">
                      {[80, 120, 180, 250, 350, 500].map((preset, idx) => (
                        <motion.div
                          key={preset}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + idx * 0.05 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAmountChange(preset.toString())}
                            className="rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all font-semibold"
                          >
                            {preset}₪
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Savings Cards */}
              <AnimatePresence mode="wait">
                {hasAmount && (
                  <>
                    {/* Header Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: 0.5 }}
                      className="mb-4"
                    >
                      <Card className="p-6 bg-card border-border shadow-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-primary/10">
                              <TrendingUp className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-foreground">פוטנציאל החיסכון שלך</h3>
                              <p className="text-sm text-muted-foreground">מבוסס על ממוצע חיסכון של 30%</p>
                            </div>
                          </div>
                          <img
                            src={savingsBanner}
                            alt="savings"
                            className="w-20 h-20 object-contain"
                          />
                        </div>
                      </Card>
                    </motion.div>

                    {/* Savings Cards Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20, rotate: -1 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{ delay: 0.6, type: "spring" }}
                      >
                        <Card className="p-5 bg-card border-border shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                          <div className="text-xs text-muted-foreground mb-2 font-medium">חודש</div>
                          <div className="text-2xl font-bold text-foreground">₪{savings.monthlyGain}</div>
                        </Card>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20, rotate: 1 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{ delay: 0.7, type: "spring" }}
                      >
                        <Card className="p-5 bg-card border-border shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                          <div className="text-xs text-muted-foreground mb-2 font-medium">רבעון</div>
                          <div className="text-2xl font-bold text-foreground">₪{savings.quarterlyGain}</div>
                        </Card>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20, rotate: -1 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{ delay: 0.8, type: "spring" }}
                      >
                        <Card className="p-5 bg-card border-border shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                          <div className="text-xs text-muted-foreground mb-2 font-medium">שנה</div>
                          <div className="text-2xl font-bold text-foreground">₪{savings.yearlyGain}</div>
                        </Card>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20, rotate: 1 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        transition={{ delay: 0.9, type: "spring" }}
                      >
                        <Card className="p-5 bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
                          <div className="text-xs text-primary mb-2 font-bold flex items-center gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                            שנתיים!
                          </div>
                          <div className="text-2xl font-bold text-primary">₪{savings.twoYearGain}</div>
                        </Card>
                      </motion.div>
                    </div>

                    {/* Action Buttons Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      <Card className="p-6 bg-card border-border shadow-xl">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            onClick={onProceedToPlans}
                            size="lg"
                            className="flex-1 h-14 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                          >
                            <span className="flex items-center justify-center gap-2">
                              בואו נתחיל לחסוך
                              <ChevronLeft className="w-5 h-5" />
                            </span>
                          </Button>

                          <Button
                            onClick={onCheckAnother}
                            variant="outline"
                            size="lg"
                            className="flex-1 h-14 text-lg font-semibold rounded-xl"
                          >
                            בדוק סקטור נוסף
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Empty State */}
              {!hasAmount && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="p-12 bg-card border-border shadow-xl text-center">
                    <img
                      src={savingsBanner}
                      alt="savings"
                      className="w-32 h-32 mx-auto mb-6 object-contain opacity-60"
                    />
                    <p className="text-muted-foreground text-base font-medium">
                      הזן סכום כדי לראות את פוטנציאל החיסכון שלך
                    </p>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
