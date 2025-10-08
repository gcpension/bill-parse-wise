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
          {/* Backdrop with tech gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-primary/20 via-background/95 to-accent/20 backdrop-blur-2xl z-50"
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
              <Card className="relative bg-gradient-to-br from-background via-background to-primary/5 backdrop-blur-3xl border border-primary/20 shadow-2xl overflow-hidden">
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute left-3 top-3 h-10 w-10 rounded-full bg-background/80 hover:bg-background border border-primary/20 text-muted-foreground hover:text-foreground z-20 backdrop-blur-sm shadow-lg"
                >
                  <X className="w-5 h-5" />
                </Button>

                {/* Tech gradient top bar with animation */}
                <div className="relative h-1.5 overflow-hidden">
                  <motion.div 
                    className={`h-full bg-gradient-to-r ${category.gradient}`}
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>

                {/* Main Content */}
                <div className="relative p-10 z-10">
                  {/* Header Section */}
                  <div className="flex items-center gap-4 mb-8">
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 12 }}
                      className="relative"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} rounded-2xl blur-xl opacity-60 animate-pulse`} />
                      <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-2xl border border-white/20`}>
                        <span className="text-3xl">{category.icon}</span>
                      </div>
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
                        className="h-16 text-2xl font-bold pr-12 text-right border-2 border-primary/30 focus:border-primary rounded-2xl bg-background/50 backdrop-blur-sm transition-all duration-300 placeholder:text-muted-foreground/40 shadow-lg focus:shadow-primary/20"
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
                            className="whitespace-nowrap rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all font-semibold border-primary/30 bg-background/50 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/20"
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
                        className="space-y-6"
                      >
                        {/* Tech Savings Header with Image */}
                        <div className="relative flex items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-background/50 to-accent/10 border border-primary/20 backdrop-blur-sm overflow-hidden">
                          {/* Animated background effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 animate-pulse" />
                          
                          <div className="flex-1 relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 rounded-lg bg-primary/20 backdrop-blur-sm">
                                <TrendingUp className="w-5 h-5 text-primary" />
                              </div>
                              <h3 className="text-xl font-bold text-foreground">פוטנציאל החיסכון שלך</h3>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium">מבוסס על ממוצע חיסכון של 30%</p>
                          </div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="relative"
                          >
                            <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse" />
                            <img
                              src={savingsBanner}
                              alt="savings illustration"
                              className="relative w-24 h-24 object-contain drop-shadow-2xl"
                            />
                          </motion.div>
                        </div>

                        {/* Clean Savings Grid */}
                        <div className="grid grid-cols-4 gap-3">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="relative group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all" />
                            <div className="relative bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                              <div className="text-xs text-muted-foreground mb-2 font-medium">חודש</div>
                              <div className="text-xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">₪{savings.monthlyGain}</div>
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="relative group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all" />
                            <div className="relative bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                              <div className="text-xs text-muted-foreground mb-2 font-medium">רבעון</div>
                              <div className="text-xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">₪{savings.quarterlyGain}</div>
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="relative group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all" />
                            <div className="relative bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                              <div className="text-xs text-muted-foreground mb-2 font-medium">שנה</div>
                              <div className="text-xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">₪{savings.yearlyGain}</div>
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="relative group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-xl opacity-60 group-hover:opacity-100 transition-all animate-pulse" />
                            <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 backdrop-blur-sm rounded-xl p-4 border-2 border-primary hover:border-accent transition-all hover:shadow-xl hover:shadow-primary/30">
                              <div className="text-xs text-primary mb-2 font-bold flex items-center gap-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                                שנתיים!
                              </div>
                              <div className="text-xl font-bold text-primary">₪{savings.twoYearGain}</div>
                            </div>
                          </motion.div>
                        </div>

                        {/* Action Buttons */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 }}
                          className="space-y-3 pt-2"
                        >
                          <Button
                            onClick={onProceedToPlans}
                            size="lg"
                            className="relative w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-[1.02] overflow-hidden group"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                            <span className="relative flex items-center justify-center gap-2">
                              בואו נתחיל לחסוך
                              <ChevronLeft className="w-5 h-5" />
                            </span>
                          </Button>

                          <Button
                            onClick={onCheckAnother}
                            variant="ghost"
                            size="lg"
                            className="w-full h-12 text-base font-semibold rounded-2xl hover:bg-primary/10 border border-primary/20 backdrop-blur-sm transition-all hover:border-primary/40"
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
                      <motion.img
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring" }}
                        src={savingsBanner}
                        alt="savings illustration"
                        className="w-32 h-32 mx-auto mb-6 object-contain opacity-60"
                      />
                      <p className="text-muted-foreground text-sm font-medium">
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
