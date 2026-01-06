import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  X, ArrowLeft, TrendingUp, 
  Zap, Wifi, Smartphone, Tv,
  Plus, Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  bgGradient: string;
  emoji: string;
}> = {
  electricity: { 
    name: 'חשמל', 
    icon: Zap, 
    gradient: 'from-amber-400 to-orange-500',
    bgGradient: 'from-amber-50 to-orange-50',
    emoji: '⚡'
  },
  cellular: { 
    name: 'סלולר', 
    icon: Smartphone, 
    gradient: 'from-blue-400 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    emoji: '📱'
  },
  internet: { 
    name: 'אינטרנט', 
    icon: Wifi, 
    gradient: 'from-violet-400 to-purple-500',
    bgGradient: 'from-violet-50 to-purple-50',
    emoji: '🌐'
  },
  tv: { 
    name: 'טלוויזיה', 
    icon: Tv, 
    gradient: 'from-rose-400 to-pink-500',
    bgGradient: 'from-rose-50 to-pink-50',
    emoji: '📺'
  }
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
  const config = categoryConfig[selectedCategory] || categoryConfig.electricity;
  const amount = parseFloat(currentAmount) || 0;
  const hasAmount = amount > 0;

  // Calculate savings
  const savingsRate = 0.3;
  const monthlySavings = Math.round(amount * savingsRate);
  const yearlySavings = monthlySavings * 12;

  // Preset amounts - compact list
  const presets = [100, 150, 200, 300, 400, 500];

  const incrementAmount = () => onAmountChange(Math.min(amount + 50, 1000).toString());
  const decrementAmount = () => onAmountChange(Math.max(amount - 50, 0).toString());

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Bottom Sheet Modal - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden rounded-t-3xl bg-white shadow-2xl"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Compact Header */}
            <div className={cn(
              "flex items-center justify-between px-4 py-3 bg-gradient-to-r",
              config.gradient
            )}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{config.emoji}</span>
                <div className="text-white">
                  <h2 className="text-base font-bold font-heebo">{config.name}</h2>
                  <p className="text-white/80 text-xs">כמה משלמים היום?</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 py-4 space-y-4">
              {/* Amount Spinner - Compact */}
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={decrementAmount}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 active:bg-gray-200"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>

                <div className="text-center min-w-[100px]">
                  <motion.div
                    key={amount}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                      "text-4xl font-bold font-heebo tabular-nums",
                      hasAmount ? "text-gray-900" : "text-gray-300"
                    )}
                  >
                    ₪{amount}
                  </motion.div>
                  <p className="text-xs text-gray-500">לחודש</p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={incrementAmount}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 active:bg-gray-200"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Quick Presets - Grid for Mobile */}
              <div className="grid grid-cols-6 gap-1.5">
                {presets.map((preset) => (
                  <motion.button
                    key={preset}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAmountChange(preset.toString())}
                    className={cn(
                      "py-2 rounded-lg text-xs font-medium transition-all",
                      amount === preset
                        ? `bg-gradient-to-r ${config.gradient} text-white shadow-sm`
                        : "bg-gray-100 text-gray-600 active:bg-gray-200"
                    )}
                  >
                    {preset}
                  </motion.button>
                ))}
              </div>

              {/* Savings Display - Compact */}
              <AnimatePresence mode="wait">
                {hasAmount && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn("rounded-xl p-3 bg-gradient-to-br border", config.bgGradient, "border-gray-100")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center shadow-sm">
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">חיסכון שנתי</p>
                          <p className="text-lg font-bold text-gray-900">₪{yearlySavings.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="text-left">
                        <p className="text-xs text-gray-500">₪{monthlySavings}/חודש</p>
                        <p className="text-xs text-gray-400">~30% חיסכון</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions - Compact */}
              <div className="flex gap-2 pb-2">
                <Button
                  onClick={onCheckAnother}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-10 rounded-xl text-sm"
                >
                  + קטגוריה
                </Button>
                
                <Button
                  onClick={onProceedToPlans}
                  disabled={!hasAmount}
                  size="sm"
                  className={cn(
                    "flex-[2] h-10 rounded-xl text-sm",
                    "bg-gradient-to-r shadow-md",
                    config.gradient
                  )}
                >
                  המשך לתוצאות
                  <ArrowLeft className="w-4 h-4 mr-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EnhancedAmountInput;
