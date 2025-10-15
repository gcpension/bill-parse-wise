import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X, Wallet, ArrowLeft, Calendar, TrendingUp, Sparkles, Award, Zap } from 'lucide-react';
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
  const displayAmount = useAnimatedCounter({ end: amount, duration: 1200 });
  
  return (
    <span className="font-light">
      {Math.round(displayAmount).toLocaleString()}
    </span>
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
  const categoryData: Record<string, { 
    name: string; 
    icon: string; 
    gradient: string; 
    bgGradient: string;
    accentColor: string;
    lightColor: string;
  }> = {
    electricity: { 
      name: 'חשמל', 
      icon: '⚡', 
      gradient: 'from-yellow-400 via-amber-500 to-orange-600',
      bgGradient: 'from-yellow-50/80 via-amber-50/60 to-orange-50/40',
      accentColor: 'text-yellow-600',
      lightColor: 'bg-yellow-50'
    },
    cellular: { 
      name: 'סלולר', 
      icon: '📱', 
      gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
      bgGradient: 'from-cyan-50/80 via-blue-50/60 to-indigo-50/40',
      accentColor: 'text-blue-600',
      lightColor: 'bg-blue-50'
    },
    internet: { 
      name: 'אינטרנט', 
      icon: '🌐', 
      gradient: 'from-purple-400 via-violet-500 to-purple-600',
      bgGradient: 'from-purple-50/80 via-violet-50/60 to-purple-50/40',
      accentColor: 'text-purple-600',
      lightColor: 'bg-purple-50'
    },
    tv: { 
      name: 'טלוויזיה', 
      icon: '📺', 
      gradient: 'from-pink-400 via-rose-500 to-red-600',
      bgGradient: 'from-pink-50/80 via-rose-50/60 to-red-50/40',
      accentColor: 'text-rose-600',
      lightColor: 'bg-rose-50'
    }
  };

  const category = categoryData[selectedCategory] || { 
    name: '', 
    icon: '💡', 
    gradient: 'from-gray-400 to-gray-500',
    bgGradient: 'from-gray-50/50 to-transparent',
    accentColor: 'text-gray-600',
    lightColor: 'bg-gray-50'
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
          {/* Simple Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Compact Banner */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto w-full max-w-sm"
            >
              <Card className="relative overflow-hidden shadow-lg rounded-2xl border bg-white">
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-3 left-3 z-10 h-8 w-8 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>

                <div className="p-4">
                  {/* Compact Header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-sm`}>
                        <span className="text-xl">{category.icon}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h2 className="text-lg font-light text-gray-900 font-heebo mb-0.5">
                          {category.name}
                        </h2>
                        <p className="text-xs text-gray-500 font-heebo font-light">
                          הזינו את התשלום החודשי שלכם
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Simple Amount Display */}
                  <div className="mb-4">
                    <div className="flex justify-center mb-3">
                      <div className={cn(
                        "px-6 py-2 rounded-xl transition-all duration-300",
                        hasAmount 
                          ? `bg-gradient-to-br ${category.gradient} shadow-sm` 
                          : "bg-gray-50 border border-gray-200"
                      )}>
                        <div className="flex items-baseline justify-center gap-1.5">
                          <span className={cn(
                            "text-2xl font-light font-heebo",
                            hasAmount ? "text-white" : "text-gray-400"
                          )}>
                            {amount.toFixed(0)}
                          </span>
                          <span className={cn(
                            "text-lg font-light",
                            hasAmount ? "text-white/90" : "text-gray-400"
                          )}>
                            ₪
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Simple Slider */}
                    <div className="space-y-2">
                      <Slider
                        value={[amount]}
                        onValueChange={(values) => onAmountChange(values[0].toString())}
                        max={800}
                        step={10}
                      />
                      
                      <div className="flex justify-between text-xs text-gray-500 font-heebo">
                        <span>₪0</span>
                        <span className="text-gray-600 font-normal">בחרו סכום</span>
                        <span>₪800+</span>
                      </div>
                    </div>
                  </div>

                  {/* Simple Presets */}
                  <div className="grid grid-cols-4 gap-1.5 mb-4">
                    {[100, 200, 350, 500].map((preset) => (
                      <Button
                        key={preset}
                        variant={amount === preset ? "default" : "outline"}
                        size="sm"
                        onClick={() => onAmountChange(preset.toString())}
                        className={cn(
                          "h-8 rounded-lg font-normal text-xs font-heebo",
                          amount === preset && "shadow-sm"
                        )}
                      >
                        ₪{preset}
                      </Button>
                    ))}
                  </div>

                  {/* Enhanced Savings Display */}
                  <AnimatePresence mode="wait">
                    {hasAmount ? (
                      <motion.div
                        key="savings"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3"
                      >
                        {/* Main Annual Savings Card - Compact */}
                        <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 p-5 shadow-sm">
                          {/* Gradient Accent Bar */}
                          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.gradient}`}></div>
                          
                          {/* Decorative Background Elements */}
                          <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${category.gradient} opacity-5 rounded-full blur-xl`}></div>
                          <div className={`absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br ${category.gradient} opacity-5 rounded-full blur-xl`}></div>
                          
                          <div className="relative space-y-3">
                            {/* Header with Icon */}
                            <div className="flex items-center justify-center gap-2">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-sm`}>
                                <Calendar className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm font-light text-gray-600 font-heebo">
                                החיסכון השנתי שלכם
                              </span>
                            </div>
                            
                            {/* Main Amount - Compact */}
                            <div className="text-center space-y-1.5">
                              <div className="text-4xl font-light text-gray-900 font-heebo tracking-tight">
                                <span className="text-2xl align-super">₪</span>
                                <AnimatedSavings amount={savings.yearlyGain} />
                              </div>
                              
                              {/* Monthly Breakdown */}
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${category.lightColor}`}>
                                <TrendingUp className={`w-3.5 h-3.5 ${category.accentColor}`} />
                                <span className={`text-xs font-normal font-heebo ${category.accentColor}`}>
                                  ₪{savings.monthlyGain.toLocaleString()} חיסכון חודשי
                                </span>
                              </div>
                            </div>

                            {/* Long-term Projection */}
                            <div className="pt-3 border-t border-gray-100">
                              <div className="text-center space-y-0.5">
                                <div className="text-xs font-light text-gray-500 font-heebo">
                                  תחזית לשנתיים
                                </div>
                                <div className="text-xl font-normal text-gray-700 font-heebo">
                                  ₪{savings.twoYearGain.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Benefits Grid - Compact */}
                        <div className="grid grid-cols-3 gap-1.5">
                          <div className="bg-white border border-gray-100 rounded-lg p-2 text-center hover:border-gray-200 transition-colors">
                            <Sparkles className={`w-4 h-4 mx-auto mb-0.5 ${category.accentColor}`} />
                            <div className="text-xs font-light text-gray-600 font-heebo">חיסכון אמיתי</div>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-lg p-2 text-center hover:border-gray-200 transition-colors">
                            <Zap className={`w-4 h-4 mx-auto mb-0.5 ${category.accentColor}`} />
                            <div className="text-xs font-light text-gray-600 font-heebo">מיידי</div>
                          </div>
                          <div className="bg-white border border-gray-100 rounded-lg p-2 text-center hover:border-gray-200 transition-colors">
                            <Award className={`w-4 h-4 mx-auto mb-0.5 ${category.accentColor}`} />
                            <div className="text-xs font-light text-gray-600 font-heebo">מומלץ</div>
                          </div>
                        </div>

                        {/* Action Buttons - Compact */}
                        <div className="space-y-1.5 pt-1">
                          <Button
                            onClick={onProceedToPlans}
                            size="lg"
                            className="w-full h-10 rounded-xl font-normal font-heebo shadow-sm text-sm"
                          >
                            התחילו לחסוך עכשיו
                            <ArrowLeft className="w-4 h-4 mr-1.5" />
                          </Button>
                          
                          <Button
                            onClick={onCheckAnother}
                            variant="outline"
                            size="lg"
                            className="w-full h-9 rounded-xl font-light font-heebo border-gray-200 hover:bg-gray-50 text-sm"
                          >
                            בדקו סקטור נוסף
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-6"
                      >
                        <div className={`inline-flex w-16 h-16 rounded-xl bg-gradient-to-br ${category.gradient} items-center justify-center mb-3 shadow-sm`}>
                          <Wallet className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-sm text-gray-500 font-heebo font-light">
                          בחרו סכום לצפייה בחיסכון הצפוי
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
