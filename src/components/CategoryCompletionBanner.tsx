import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X, ChevronLeft, Sparkles, Wallet, TrendingUp, ArrowLeft, CheckCircle2, Zap, TrendingDown, Star, Rocket, Calendar, DollarSign, Award } from 'lucide-react';
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
          {/* Enhanced Backdrop with animated gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-lg z-50"
            onClick={onClose}
          >
            {/* Animated background orbs */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br ${category.gradient} rounded-full blur-3xl`}
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className={`absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br ${category.gradient} rounded-full blur-3xl`}
            />
          </motion.div>

          {/* Enhanced Banner */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ 
                type: "spring", 
                duration: 0.6,
                bounce: 0.4 
              }}
              className="pointer-events-auto w-full max-w-lg"
            >
              <Card className="relative overflow-hidden shadow-2xl rounded-3xl border-0 bg-white/95 backdrop-blur-xl">
                {/* Animated gradient background */}
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-40`}
                  style={{
                    backgroundSize: '200% 200%'
                  }}
                />
                
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-2 h-2 ${category.lightColor} rounded-full opacity-30`}
                      animate={{
                        y: [0, -100],
                        x: [0, Math.random() * 40 - 20],
                        opacity: [0, 0.6, 0],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                      style={{
                        left: `${10 + i * 15}%`,
                        bottom: 0,
                      }}
                    />
                  ))}
                </div>
                {/* Enhanced Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-5 left-5 z-10 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all hover:shadow-xl hover:scale-110 border border-gray-200/50"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </Button>

                <div className="relative p-8">
                  {/* Enhanced Header with Animation */}
                  <div className="mb-8">
                    <div className="flex items-start gap-5 mb-6">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          type: "spring", 
                          duration: 0.8,
                          bounce: 0.5 
                        }}
                        className="relative group"
                      >
                        <motion.div
                          animate={{
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className={`relative w-20 h-20 rounded-3xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-2xl`}
                        >
                          <span className="text-4xl relative z-10">{category.icon}</span>
                          {/* Glow effect */}
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${category.gradient} blur-2xl`}
                          />
                        </motion.div>
                      </motion.div>
                      
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="text-3xl font-black text-gray-900 tracking-tight font-rubik">
                            {category.name}
                          </h2>
                          <Badge className={`${category.lightColor} ${category.accentColor} border-0 font-semibold`}>
                            מומלץ
                          </Badge>
                        </div>
                        <p className="text-base text-gray-600 font-medium font-inter leading-relaxed">
                          הזינו את התשלום החודשי שלכם<br/>
                          <span className="text-sm text-gray-500">ונראה כמה תוכלו לחסוך</span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Decorative separator */}
                    <div className="relative h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent">
                      <motion.div
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className={`absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent ${category.accentColor}`}
                      />
                    </div>
                  </div>

                  {/* Enhanced Amount Display */}
                  <div className="mb-7">
                    <div className="flex items-center justify-between mb-5">
                      <label className="text-sm font-bold text-gray-700 font-rubik flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        סכום חודשי נוכחי
                      </label>
                      {hasAmount && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", bounce: 0.5 }}
                        >
                          <Badge className="bg-green-100 text-green-700 border-0 font-semibold">
                            <TrendingDown className="w-3 h-3 ml-1" />
                            חיסכון אפשרי
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Enhanced Amount Badge */}
                    <div className="flex justify-center mb-6">
                      <motion.div
                        animate={{ 
                          scale: hasAmount ? [1, 1.05, 1] : 1,
                          y: hasAmount ? [0, -2, 0] : 0
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="relative"
                      >
                        {hasAmount && (
                          <>
                            <motion.div
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.3, 0.6, 0.3],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${category.gradient} blur-3xl`}
                            />
                            {/* Sparkle effects */}
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                animate={{
                                  scale: [0, 1, 0],
                                  opacity: [0, 1, 0],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: i * 0.6,
                                }}
                                className="absolute"
                                style={{
                                  top: `${20 + i * 30}%`,
                                  right: i % 2 === 0 ? '-10px' : 'auto',
                                  left: i % 2 === 1 ? '-10px' : 'auto',
                                }}
                              >
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                              </motion.div>
                            ))}
                          </>
                        )}
                        <div className={cn(
                          "relative px-12 py-6 rounded-[2rem] transition-all duration-500",
                          hasAmount 
                            ? `bg-gradient-to-br ${category.gradient} shadow-2xl border-2 border-white/20` 
                            : "bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 shadow-lg"
                        )}>
                          <div className="flex items-baseline justify-center gap-3">
                            <motion.span
                              key={amount}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className={cn(
                                "text-5xl font-black tracking-tight font-inter transition-colors",
                                hasAmount ? "text-white drop-shadow-lg" : "text-gray-400"
                              )}
                            >
                              {amount.toFixed(0)}
                            </motion.span>
                            <span className={cn(
                              "text-3xl font-bold transition-colors",
                              hasAmount ? "text-white/90" : "text-gray-400"
                            )}>
                              ₪
                            </span>
                          </div>
                          {hasAmount && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-center mt-2"
                            >
                              <span className="text-xs font-semibold text-white/80 font-inter">
                                לחודש
                              </span>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Enhanced Slider */}
                    <div className="space-y-4 px-2">
                      <Slider
                        value={[amount]}
                        onValueChange={(values) => onAmountChange(values[0].toString())}
                        max={800}
                        step={10}
                        className={cn(
                          "[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-3 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-xl [&_[role=slider]]:transition-all [&_[role=slider]]:hover:scale-125",
                          hasAmount && `[&_[role=slider]]:bg-gradient-to-br [&_[role=slider]]:${category.gradient}`
                        )}
                      />
                      
                      <div className="flex justify-between items-center text-xs font-semibold text-gray-500 font-inter">
                        <span className="flex items-center gap-1">
                          <span className="text-gray-400">₪</span>0
                        </span>
                        <motion.span
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                          className={cn(
                            "font-bold transition-colors",
                            hasAmount ? category.accentColor : "text-purple-600"
                          )}
                        >
                          {hasAmount ? "👍 מצוין" : "👈 החליקו"}
                        </motion.span>
                        <span className="flex items-center gap-1">
                          <span className="text-gray-400">₪</span>800+
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Quick Presets */}
                  <div className="grid grid-cols-4 gap-3 mb-7">
                    {[100, 200, 350, 500].map((preset, index) => (
                      <motion.div
                        key={preset}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          variant={amount === preset ? "default" : "outline"}
                          size="sm"
                          onClick={() => onAmountChange(preset.toString())}
                          className={cn(
                            "h-12 rounded-2xl font-bold text-sm font-inter transition-all duration-300 relative overflow-hidden group",
                            amount === preset 
                              ? `bg-gradient-to-br ${category.gradient} text-white border-0 shadow-xl scale-105` 
                              : "hover:border-gray-400 hover:scale-105 border-2 bg-white hover:shadow-lg"
                          )}
                        >
                          {amount === preset && (
                            <motion.div
                              layoutId="activePreset"
                              className="absolute inset-0 bg-white/20"
                              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                            />
                          )}
                          <span className="relative z-10">₪{preset}</span>
                          {amount === preset && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1"
                            >
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Enhanced Savings & Actions */}
                  <AnimatePresence mode="wait">
                    {hasAmount ? (
                      <motion.div
                        key="savings"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                        className="space-y-6 pt-6"
                      >
                        {/* Spectacular Savings Card */}
                        <div className="relative overflow-hidden">
                          {/* Animated background */}
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.2, 0.3, 0.2],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className={`absolute inset-0 bg-gradient-to-br ${category.gradient} blur-3xl`}
                          />
                          
                          <div className={`relative bg-gradient-to-br ${category.gradient} rounded-3xl p-8 shadow-2xl overflow-hidden`}>
                            {/* Shine effect */}
                            <motion.div
                              animate={{
                                x: ['-100%', '200%'],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatDelay: 1,
                                ease: "easeInOut"
                              }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                            />
                            
                            <div className="relative z-10">
                              {/* Header with icons */}
                              <div className="flex items-center justify-center gap-3 mb-5">
                                <motion.div
                                  animate={{
                                    rotate: [0, 10, -10, 0],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                  }}
                                >
                                  <Award className="w-6 h-6 text-white" />
                                </motion.div>
                                <span className="text-base font-bold text-white font-rubik">
                                  החיסכון הצפוי שלכם
                                </span>
                                <motion.div
                                  animate={{
                                    rotate: [0, -10, 10, 0],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                  }}
                                >
                                  <Sparkles className="w-6 h-6 text-white" />
                                </motion.div>
                              </div>
                              
                              {/* Main savings amount */}
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ 
                                  type: "spring",
                                  bounce: 0.6,
                                  delay: 0.2 
                                }}
                                className="text-center mb-6"
                              >
                                <div className="text-sm text-white/80 mb-2 font-semibold font-inter uppercase tracking-wider">
                                  שנתי
                                </div>
                                <motion.div
                                  animate={{
                                    scale: [1, 1.05, 1],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                  }}
                                  className="text-6xl font-black text-white tracking-tight font-inter drop-shadow-2xl mb-1"
                                >
                                  ₪{savings.yearlyGain.toLocaleString()}
                                </motion.div>
                                <div className="text-sm text-white/70 font-medium font-inter">
                                  זה כמו לקבל <span className="font-bold text-white">{Math.round(savings.yearlyGain / 1000)}K</span> מתנה!
                                </div>
                              </motion.div>
                              
                              {/* Breakdown grid */}
                              <div className="grid grid-cols-2 gap-3">
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 }}
                                  className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-white/90" />
                                    <span className="text-xs font-semibold text-white/80 font-inter">חודשי</span>
                                  </div>
                                  <div className="text-2xl font-black text-white font-inter">
                                    ₪{savings.monthlyGain}
                                  </div>
                                </motion.div>
                                
                                <motion.div
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.4 }}
                                  className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <TrendingDown className="w-4 h-4 text-white/90" />
                                    <span className="text-xs font-semibold text-white/80 font-inter">רבעוני</span>
                                  </div>
                                  <div className="text-2xl font-black text-white font-inter">
                                    ₪{savings.quarterlyGain.toLocaleString()}
                                  </div>
                                </motion.div>
                              </div>
                              
                              {/* Pro tip */}
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                              >
                                <div className="flex items-start gap-2 text-white/90">
                                  <Star className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                  <p className="text-xs font-medium font-inter leading-relaxed">
                                    חיסכון של <span className="font-bold">30%</span> זה הממוצע - יש מקרים בהם אפשר לחסוך עוד יותר!
                                  </p>
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Action Buttons */}
                        <div className="space-y-3">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              onClick={onProceedToPlans}
                              size="lg"
                              className={cn(
                                "w-full h-14 rounded-2xl font-bold text-lg shadow-2xl transition-all font-rubik relative overflow-hidden group",
                                `bg-gradient-to-r ${category.gradient}`
                              )}
                            >
                              <motion.div
                                className="absolute inset-0 bg-white/20"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: '100%' }}
                                transition={{ duration: 0.5 }}
                              />
                              <span className="relative z-10 flex items-center gap-2">
                                <Rocket className="w-5 h-5" />
                                בואו נתחיל לחסוך!
                                <ArrowLeft className="w-5 h-5" />
                              </span>
                            </Button>
                          </motion.div>
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              onClick={onCheckAnother}
                              variant="outline"
                              size="lg"
                              className="w-full h-12 rounded-2xl font-semibold transition-all font-inter border-2 hover:border-gray-400 bg-white hover:bg-gray-50"
                            >
                              <span className="flex items-center gap-2">
                                <ChevronLeft className="w-4 h-4" />
                                בדקו סקטור נוסף
                              </span>
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center py-10 pt-6"
                      >
                        <motion.div
                          animate={{
                            y: [0, -5, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="relative inline-block mb-4"
                        >
                          <div className={`inline-flex w-20 h-20 rounded-3xl bg-gradient-to-br ${category.gradient} items-center justify-center shadow-2xl`}>
                            <Wallet className="w-10 h-10 text-white" />
                          </div>
                          <motion.div
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${category.gradient} blur-xl`}
                          />
                        </motion.div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-2 font-rubik">
                          מוכנים לראות את החיסכון?
                        </h3>
                        <p className="text-sm font-medium text-gray-600 font-inter max-w-xs mx-auto leading-relaxed">
                          החליקו את הסליידר או לחצו על אחת האופציות<br/>
                          כדי לראות כמה תוכלו לחסוך
                        </p>
                        
                        <motion.div
                          animate={{
                            y: [0, 5, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                          className="mt-4"
                        >
                          <span className="text-2xl">👆</span>
                        </motion.div>
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
