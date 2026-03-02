import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  X, ArrowLeft, TrendingUp, 
  Zap, Wifi, Smartphone, Tv, Package,
  Plus, Minus, Sparkles, Star, CheckCircle2, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CompanySelector from './CompanySelector';
import { getLastAmount, getQuickAmountSuggestions } from '@/hooks/useUserPreferences';

interface EnhancedAmountInputProps {
  isVisible: boolean;
  selectedCategory: string;
  currentAmount: string;
  onAmountChange: (amount: string) => void;
  onCheckAnother: () => void;
  onProceedToPlans: () => void;
  onClose: () => void;
  selectedProvider?: string;
  onProviderChange?: (provider: string) => void;
}

const categoryConfig: Record<string, { 
  name: string; 
  icon: typeof Zap; 
  gradient: string;
  bgGradient: string;
  accentColor: string;
  emoji: string;
  description: string;
}> = {
  triple: {
    name: 'טריפל',
    icon: Package,
    gradient: 'from-purple-500 via-indigo-500 to-violet-600',
    bgGradient: 'from-purple-50 via-indigo-50 to-violet-50',
    accentColor: 'text-purple-600',
    emoji: '📦',
    description: 'טלוויזיה + אינטרנט + סלולר'
  },
  electricity: { 
    name: 'חשמל', 
    icon: Zap, 
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    bgGradient: 'from-amber-50 via-orange-50 to-red-50',
    accentColor: 'text-amber-600',
    emoji: '⚡',
    description: 'השוואת ספקי חשמל'
  },
  cellular: { 
    name: 'סלולר', 
    icon: Smartphone, 
    gradient: 'from-blue-400 via-cyan-500 to-teal-500',
    bgGradient: 'from-blue-50 via-cyan-50 to-teal-50',
    accentColor: 'text-blue-600',
    emoji: '📱',
    description: 'חבילות סלולר מכל החברות'
  },
  internet: { 
    name: 'אינטרנט', 
    icon: Wifi, 
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-500',
    bgGradient: 'from-violet-50 via-purple-50 to-fuchsia-50',
    accentColor: 'text-violet-600',
    emoji: '🌐',
    description: 'חיבורי סיבים ואינטרנט'
  },
  tv: { 
    name: 'טלוויזיה', 
    icon: Tv, 
    gradient: 'from-rose-400 via-pink-500 to-red-500',
    bgGradient: 'from-rose-50 via-pink-50 to-red-50',
    accentColor: 'text-rose-600',
    emoji: '📺',
    description: 'ערוצי טלוויזיה וסטרימינג'
  }
};

// Progress steps
const getProgressStep = (hasProvider: boolean, hasAmount: boolean) => {
  if (!hasProvider) return 1;
  if (!hasAmount) return 2;
  return 3;
};

const EnhancedAmountInput: React.FC<EnhancedAmountInputProps> = ({
  isVisible,
  selectedCategory,
  currentAmount,
  onAmountChange,
  onCheckAnother,
  onProceedToPlans,
  onClose,
  selectedProvider = '',
  onProviderChange,
}) => {
  const config = categoryConfig[selectedCategory] || categoryConfig.electricity;
  const Icon = config.icon;
  const amount = parseFloat(currentAmount) || 0;
  const hasAmount = amount > 0;
  const [showShimmer, setShowShimmer] = useState(false);

  // Calculate savings
  const savingsRate = selectedCategory === 'triple' ? 0.35 : 0.3;
  const monthlySavings = Math.round(amount * savingsRate);
  const yearlySavings = monthlySavings * 12;

  // Progress
  const currentStep = getProgressStep(!!selectedProvider, hasAmount);
  const totalSteps = 3;

  // Get smart presets
  const lastAmount = getLastAmount(selectedCategory);
  const defaultPresets = getQuickAmountSuggestions(selectedCategory);
  const presets = lastAmount && !defaultPresets.includes(lastAmount)
    ? [lastAmount, ...defaultPresets.slice(0, 5)]
    : defaultPresets;

  // Auto-fill last amount on mount
  useEffect(() => {
    if (isVisible && !currentAmount && lastAmount) {
      const timer = setTimeout(() => {
        onAmountChange(lastAmount.toString());
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, selectedCategory]);

  // Shimmer effect when savings update
  useEffect(() => {
    if (hasAmount) {
      setShowShimmer(true);
      const timer = setTimeout(() => setShowShimmer(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [yearlySavings]);

  const incrementAmount = () => onAmountChange(Math.min(amount + 50, 1500).toString());
  const decrementAmount = () => onAmountChange(Math.max(amount - 50, 0).toString());

  const handleSliderChange = (value: number[]) => {
    onAmountChange(value[0].toString());
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal - Bottom Sheet */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350, mass: 0.8 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-y-auto rounded-t-[2rem] bg-background shadow-2xl"
          >
            {/* Decorative top gradient line */}
            <div className={cn("h-1 w-full bg-gradient-to-r", config.gradient)} />
            
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <motion.div 
                className="w-12 h-1.5 rounded-full bg-muted-foreground/30"
                whileHover={{ scale: 1.1 }}
              />
            </div>

            {/* Progress Indicator */}
            <div className="px-6 pt-2 pb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-assistant">
                  שלב {currentStep} מתוך {totalSteps}
                </span>
                <span className="text-xs text-muted-foreground font-assistant">
                  {currentStep === 1 ? 'בחירת ספק' : currentStep === 2 ? 'הזנת סכום' : 'צפייה בתוצאות'}
                </span>
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      "h-1.5 rounded-full flex-1 transition-all duration-500",
                      i < currentStep
                        ? `bg-gradient-to-r ${config.gradient}`
                        : "bg-muted"
                    )}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    style={{ transformOrigin: 'right' }}
                  />
                ))}
              </div>
            </div>

            {/* Header */}
            <div className={cn(
              "relative mx-4 rounded-2xl overflow-hidden mb-4",
              "bg-gradient-to-br shadow-lg",
              config.gradient
            )}>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full blur-xl" />
              </div>
              
              <div className="relative px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ rotate: -10, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                    className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg"
                  >
                    <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                  </motion.div>
                  
                  <div className="text-white">
                    <motion.h2 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xl font-bold font-heebo"
                    >
                      {config.name}
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-white/80 text-sm font-assistant"
                    >
                      {config.description}
                    </motion.p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-6 space-y-5">
              {/* Company Selector */}
              {onProviderChange && (
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <p className="text-muted-foreground text-sm font-assistant text-center">מי הספק הנוכחי שלכם?</p>
                  <CompanySelector
                    category={selectedCategory}
                    selectedCompany={selectedProvider}
                    onSelect={onProviderChange}
                  />
                </motion.div>
              )}

              {/* Amount Input Section */}
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-muted-foreground text-sm mb-3 font-assistant">כמה אתם משלמים היום?</p>
                
                {/* Amount Spinner */}
                <div className="flex items-center justify-center gap-6">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={decrementAmount}
                    className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors shadow-sm"
                  >
                    <Minus className="w-6 h-6" />
                  </motion.button>

                  <motion.div 
                    className="min-w-[140px] py-3"
                    key={amount}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <div className={cn(
                      "text-5xl font-bold font-heebo tabular-nums",
                      hasAmount ? "text-foreground" : "text-muted-foreground/40"
                    )}>
                      <span className="text-3xl">₪</span>{amount}
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">לחודש</p>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={incrementAmount}
                    className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors shadow-sm"
                  >
                    <Plus className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Slider */}
                <div className="mt-4 px-2">
                  <Slider
                    value={[amount]}
                    min={0}
                    max={1500}
                    step={10}
                    onValueChange={handleSliderChange}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-1.5 text-xs text-muted-foreground font-assistant">
                    <span>₪1,500</span>
                    <span>₪0</span>
                  </div>
                </div>
              </motion.div>

              {/* Quick Presets */}
              <div className="flex flex-wrap justify-center gap-2">
                {presets.map((preset, index) => {
                  const isLast = preset === lastAmount;
                  return (
                    <motion.button
                      key={preset}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + index * 0.04 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onAmountChange(preset.toString())}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
                        amount === preset
                          ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                          : isLast
                            ? "bg-primary/10 text-primary border-2 border-dashed border-primary/30"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {isLast && amount !== preset && <Clock className="w-3 h-3" />}
                      ₪{preset}
                    </motion.button>
                  );
                })}
              </div>

              {/* Savings Display - with shimmer */}
              <AnimatePresence mode="wait">
                {hasAmount && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className={cn(
                      "relative overflow-hidden rounded-2xl p-4",
                      "bg-gradient-to-br border shadow-xl",
                      config.bgGradient,
                      "border-border/50"
                    )}
                  >
                    {/* Shimmer overlay */}
                    <AnimatePresence>
                      {showShimmer && (
                        <motion.div
                          initial={{ x: '100%' }}
                          animate={{ x: '-100%' }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1, ease: 'easeInOut' }}
                          className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-transparent z-10 pointer-events-none"
                        />
                      )}
                    </AnimatePresence>

                    {/* Mini confetti particles */}
                    {showShimmer && (
                      <>
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={`confetti-${i}`}
                            initial={{ 
                              opacity: 1, 
                              y: 0, 
                              x: 0,
                              scale: 1 
                            }}
                            animate={{ 
                              opacity: 0, 
                              y: -40 - Math.random() * 30,
                              x: (Math.random() - 0.5) * 80,
                              scale: 0,
                              rotate: Math.random() * 360
                            }}
                            transition={{ duration: 0.8 + Math.random() * 0.4, delay: i * 0.05 }}
                            className="absolute z-20 pointer-events-none"
                            style={{ 
                              top: '50%', 
                              left: `${20 + i * 12}%`,
                              width: 6,
                              height: 6,
                              borderRadius: i % 2 === 0 ? '50%' : '2px',
                              backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7', '#3B82F6', '#F59E0B'][i]
                            }}
                          />
                        ))}
                      </>
                    )}

                    <Sparkles className="absolute top-3 left-3 w-4 h-4 text-amber-400 opacity-60" />
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-emerald-400 to-emerald-600"
                        >
                          <TrendingUp className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                          <p className="text-xs text-muted-foreground font-assistant">חיסכון שנתי משוער</p>
                          <motion.p 
                            key={yearlySavings}
                            initial={{ scale: 1.3 }}
                            animate={{ scale: 1 }}
                            className="text-2xl font-bold text-foreground font-heebo"
                          >
                            ₪{yearlySavings.toLocaleString()}
                          </motion.p>
                        </div>
                      </div>
                      
                      <div className="text-left space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Star className="w-3 h-3 text-amber-500" />
                          <span className="text-xs">₪{monthlySavings}/חודש</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span className="text-xs font-medium text-emerald-600">
                            ~{Math.round(savingsRate * 100)}% חיסכון
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={onCheckAnother}
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl text-base font-medium border-2 hover:bg-muted/50"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  עוד קטגוריה
                </Button>
                
                <motion.div 
                  className="flex-[2]"
                  animate={hasAmount ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <Button
                    onClick={onProceedToPlans}
                    disabled={!hasAmount}
                    className={cn(
                      "w-full h-14 rounded-2xl text-base font-medium",
                      "bg-gradient-to-r shadow-lg hover:shadow-xl transition-all",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      config.gradient
                    )}
                  >
                    <span>צפייה בתוצאות</span>
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EnhancedAmountInput;
