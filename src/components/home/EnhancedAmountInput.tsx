import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  X, Wallet, ArrowLeft, Calendar, TrendingUp, Sparkles, 
  Award, Zap, Wifi, Smartphone, Tv, ChevronUp, ChevronDown,
  Plus, Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

interface EnhancedAmountInputProps {
  isVisible: boolean;
  selectedCategory: string;
  currentAmount: string;
  onAmountChange: (amount: string) => void;
  onCheckAnother: () => void;
  onProceedToPlans: () => void;
  onClose: () => void;
}

const categoryConfig: Record<string, { 
  name: string; 
  icon: typeof Zap; 
  gradient: string;
  accentColor: string;
  emoji: string;
}> = {
  electricity: { 
    name: 'חשמל', 
    icon: Zap, 
    gradient: 'from-amber-400 via-orange-500 to-yellow-500',
    accentColor: 'text-amber-600',
    emoji: '⚡'
  },
  cellular: { 
    name: 'סלולר', 
    icon: Smartphone, 
    gradient: 'from-blue-400 via-cyan-500 to-sky-500',
    accentColor: 'text-blue-600',
    emoji: '📱'
  },
  internet: { 
    name: 'אינטרנט', 
    icon: Wifi, 
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-500',
    accentColor: 'text-purple-600',
    emoji: '🌐'
  },
  tv: { 
    name: 'טלוויזיה', 
    icon: Tv, 
    gradient: 'from-rose-400 via-pink-500 to-red-500',
    accentColor: 'text-rose-600',
    emoji: '📺'
  }
};

// Animated Counter Component
const AnimatedSavings = ({ amount }: { amount: number }) => {
  const displayAmount = useAnimatedCounter({ end: amount, duration: 800 });
  return <span>{Math.round(displayAmount).toLocaleString()}</span>;
};

const EnhancedAmountInput: React.FC<EnhancedAmountInputProps> = ({
  isVisible,
  selectedCategory,
  currentAmount,
  onAmountChange,
  onCheckAnother,
  onProceedToPlans,
  onClose
}) => {
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const config = categoryConfig[selectedCategory] || categoryConfig.electricity;
  const Icon = config.icon;
  const amount = parseFloat(currentAmount) || 0;
  const hasAmount = amount > 0;

  // Calculate savings
  const savingsRate = 0.3;
  const monthlySavings = Math.round(amount * savingsRate);
  const yearlySavings = monthlySavings * 12;

  // Preset amounts
  const presets = [100, 150, 200, 250, 300, 400, 500, 600];

  // Handle amount increment/decrement
  const incrementAmount = () => {
    const newAmount = Math.min(amount + 50, 1000);
    onAmountChange(newAmount.toString());
  };

  const decrementAmount = () => {
    const newAmount = Math.max(amount - 50, 0);
    onAmountChange(newAmount.toString());
  };

  // Wheel/touch handling for amount adjustment
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      incrementAmount();
    } else {
      decrementAmount();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50"
          >
            <Card className="overflow-hidden shadow-2xl border-0">
              {/* Header with Gradient */}
              <div className={cn(
                "relative px-6 py-5 bg-gradient-to-r",
                config.gradient
              )}>
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-3xl">{config.emoji}</span>
                  </div>
                  <div className="text-white">
                    <h2 className="text-xl font-bold font-heebo">{config.name}</h2>
                    <p className="text-white/80 text-sm">כמה אתם משלמים היום?</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 bg-white">
                {/* Amount Spinner */}
                <div 
                  className="relative flex items-center justify-center mb-6"
                  onWheel={handleWheel}
                >
                  {/* Decrement Button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={decrementAmount}
                    className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </motion.button>

                  {/* Amount Display */}
                  <motion.div
                    className="mx-8 text-center"
                    animate={{ scale: hasAmount ? 1 : 0.95 }}
                  >
                    <motion.div
                      key={amount}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className={cn(
                        "text-5xl font-bold font-heebo tabular-nums",
                        hasAmount ? "text-gray-900" : "text-gray-300"
                      )}
                    >
                      ₪{amount}
                    </motion.div>
                    <p className="text-sm text-gray-500 mt-1">לחודש</p>
                  </motion.div>

                  {/* Increment Button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={incrementAmount}
                    className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Preset Amounts - Horizontal Scroll */}
                <div className="mb-6 -mx-6 px-6">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {presets.map((preset) => (
                      <motion.button
                        key={preset}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onAmountChange(preset.toString())}
                        className={cn(
                          "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
                          amount === preset
                            ? `bg-gradient-to-r ${config.gradient} text-white shadow-md`
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        ₪{preset}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Savings Preview */}
                <AnimatePresence mode="wait">
                  {hasAmount ? (
                    <motion.div
                      key="savings"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6"
                    >
                      <div className={cn(
                        "rounded-2xl p-5 bg-gradient-to-br",
                        "from-gray-50 to-white border border-gray-100"
                      )}>
                        {/* Yearly Savings - Hero */}
                        <div className="text-center mb-4">
                          <p className="text-sm text-gray-500 mb-1">החיסכון השנתי שלכם</p>
                          <motion.div
                            className={cn(
                              "text-4xl font-bold",
                              config.accentColor
                            )}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', delay: 0.1 }}
                          >
                            ₪<AnimatedSavings amount={yearlySavings} />
                          </motion.div>
                        </div>

                        {/* Monthly Breakdown */}
                        <div className="flex items-center justify-center gap-6">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              "bg-gradient-to-br from-emerald-100 to-green-100"
                            )}>
                              <TrendingUp className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">לחודש</p>
                              <p className="font-semibold text-gray-900">₪{monthlySavings}</p>
                            </div>
                          </div>
                          
                          <div className="h-8 w-px bg-gray-200" />
                          
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              "bg-gradient-to-br from-blue-100 to-indigo-100"
                            )}>
                              <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">ל-2 שנים</p>
                              <p className="font-semibold text-gray-900">₪{(yearlySavings * 2).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-6 mb-6"
                    >
                      <div className={cn(
                        "inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-3",
                        "bg-gray-100"
                      )}>
                        <Wallet className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">
                        בחרו סכום לחישוב החיסכון
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={onCheckAnother}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl font-medium"
                  >
                    קטגוריה נוספת
                  </Button>
                  
                  <Button
                    onClick={onProceedToPlans}
                    disabled={!hasAmount}
                    className={cn(
                      "flex-1 h-12 rounded-xl font-medium",
                      "bg-gradient-to-r shadow-lg",
                      config.gradient,
                      "hover:opacity-90 transition-opacity"
                    )}
                  >
                    המשך לתוצאות
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EnhancedAmountInput;
