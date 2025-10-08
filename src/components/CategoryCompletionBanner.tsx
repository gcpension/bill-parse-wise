import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, ArrowLeft, PiggyBank, ChevronLeft, Info } from 'lucide-react';
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
          {/* Backdrop with gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-lg z-50"
            onClick={onClose}
          />

          {/* Minimalist Modern Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="pointer-events-auto w-full max-w-xl"
            >
              <Card className="relative bg-background/95 backdrop-blur-2xl border-0 shadow-2xl overflow-hidden">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute left-3 top-3 h-10 w-10 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground z-20 backdrop-blur-sm"
                >
                  <X className="w-5 h-5" />
                </Button>

                {/* Gradient Top Bar */}
                <div className={`h-1.5 bg-gradient-to-r ${category.gradient}`} />

                {/* Main Content */}
                <div className="p-10">
                  {/* Header Section */}
                  <div className="flex items-center gap-4 mb-8">
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 12 }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-3xl">{category.icon}</span>
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-bold text-foreground mb-1">
                        {category.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        כמה אתה משלם היום?
                      </p>
                    </div>
                  </div>

                  {/* Amount Input */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6"
                  >
                    <div className="relative">
                      <Input
                        type="number"
                        value={currentAmount}
                        onChange={(e) => onAmountChange(e.target.value)}
                        placeholder="הכנס סכום..."
                        className="h-16 text-2xl font-bold pr-12 text-right border-2 border-border focus:border-primary rounded-2xl bg-muted/30 transition-all duration-300 placeholder:text-muted-foreground/40"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <span className="text-2xl font-bold text-muted-foreground">₪</span>
                      </div>
                    </div>

                    {/* Quick amounts */}
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {[80, 120, 180, 250, 350, 500].map((preset, idx) => (
                        <motion.div
                          key={preset}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + idx * 0.05 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAmountChange(preset.toString())}
                            className="whitespace-nowrap rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all font-semibold"
                          >
                            {preset}₪
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Dynamic Savings Display */}
                  <AnimatePresence mode="wait">
                    {hasAmount && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                      >
                        {/* Main Savings Card */}
                        <div className={`relative rounded-3xl bg-gradient-to-br ${category.gradient} p-6 mb-6 overflow-hidden`}>
                          <div className="absolute inset-0 bg-black/10" />
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                          
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                  <PiggyBank className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <div className="text-white/80 text-xs font-medium">החיסכון שלך</div>
                                  <div className="text-white text-sm font-bold">לפי תקופות</div>
                                </div>
                              </div>
                              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                <Info className="w-4 h-4 text-white" />
                              </div>
                            </div>

                            {/* Savings Timeline */}
                            <div className="grid grid-cols-2 gap-3">
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                              >
                                <div className="text-white/70 text-xs mb-1 font-medium">חודש ראשון</div>
                                <div className="text-white text-2xl font-bold">₪{savings.monthlyGain}</div>
                              </motion.div>

                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                              >
                                <div className="text-white/70 text-xs mb-1 font-medium">רבעון</div>
                                <div className="text-white text-2xl font-bold">₪{savings.quarterlyGain}</div>
                              </motion.div>

                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                                className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20"
                              >
                                <div className="text-white/70 text-xs mb-1 font-medium">שנה</div>
                                <div className="text-white text-2xl font-bold">₪{savings.yearlyGain}</div>
                              </motion.div>

                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className="bg-white/25 backdrop-blur-md rounded-2xl p-4 border-2 border-white/30 shadow-lg"
                              >
                                <div className="text-white/90 text-xs mb-1 font-bold">שנתיים!</div>
                                <div className="text-white text-2xl font-bold">₪{savings.twoYearGain}</div>
                              </motion.div>
                            </div>

                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.9 }}
                              className="mt-4 text-center text-white/60 text-xs font-medium bg-white/10 backdrop-blur-sm rounded-lg py-2 px-3"
                            >
                              💡 חיסכון מבוסס על ממוצע שוק של 30%
                            </motion.div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1 }}
                          className="space-y-3"
                        >
                          <Button
                            onClick={onProceedToPlans}
                            size="lg"
                            className="w-full h-14 text-lg font-bold rounded-2xl bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                          >
                            <span className="flex items-center justify-center gap-2">
                              בואו נתחיל לחסוך
                              <ChevronLeft className="w-5 h-5" />
                            </span>
                          </Button>

                          <Button
                            onClick={onCheckAnother}
                            variant="ghost"
                            size="lg"
                            className="w-full h-12 text-base font-semibold rounded-2xl hover:bg-muted"
                          >
                            בדוק סקטור נוסף
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Empty State */}
                  {!hasAmount && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <PiggyBank className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground text-sm">
                        הזן סכום כדי לראות את פוטנציאל החיסכון שלך
                      </p>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
