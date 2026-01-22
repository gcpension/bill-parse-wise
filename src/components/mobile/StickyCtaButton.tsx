import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, CheckCircle, Zap, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface StickyCtaButtonProps {
  isVisible: boolean;
  selectedCount: number;
  totalSavings?: number;
  onClick: () => void;
  variant?: 'start' | 'continue' | 'results';
}

const StickyCtaButton: React.FC<StickyCtaButtonProps> = ({
  isVisible,
  selectedCount,
  totalSavings = 0,
  onClick,
  variant = 'start'
}) => {
  const { trigger } = useHapticFeedback();

  const handleClick = () => {
    trigger('medium');
    onClick();
  };

  const getButtonText = () => {
    switch (variant) {
      case 'continue':
        return 'המשיכו לראות הצעות';
      case 'results':
        return 'צפו בתוצאות';
      default:
        return 'התחילו לחסוך עכשיו';
    }
  };

  const getButtonIcon = () => {
    switch (variant) {
      case 'continue':
        return <ArrowLeft className="w-5 h-5" />;
      case 'results':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          {/* Gradient fade above button */}
          <div className="absolute bottom-full left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          
          {/* Safe area padding container */}
          <div className="bg-background/95 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
            <div className="px-4 py-3 space-y-2">
              {/* Stats row when categories selected */}
              <AnimatePresence>
                {selectedCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10">
                        <CheckCircle className="w-3.5 h-3.5 text-primary" />
                        <span className="font-medium text-primary">{selectedCount} קטגוריות</span>
                      </div>
                    </div>
                    
                    {totalSavings > 0 && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1.5 text-emerald-600"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span className="font-bold">~₪{totalSavings.toLocaleString()}/שנה</span>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Main CTA Button - Touch optimized */}
              <motion.button
                onClick={handleClick}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative w-full h-14 rounded-2xl overflow-hidden",
                  "flex items-center justify-center gap-3",
                  "text-white font-bold text-lg",
                  "bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%]",
                  "shadow-lg shadow-primary/30",
                  "transition-all duration-300",
                  "active:shadow-xl",
                  "min-h-[56px]" // Ensure minimum touch target
                )}
              >
                {/* Animated gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary"
                  animate={{ x: ['0%', '-50%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  style={{ width: '200%' }}
                />
                
                {/* Button content */}
                <span className="relative z-10 flex items-center gap-2">
                  {getButtonIcon()}
                  <span>{getButtonText()}</span>
                </span>
                
                {/* Selected count badge */}
                <AnimatePresence>
                  {selectedCount > 0 && variant === 'start' && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white/25 text-sm font-bold"
                    >
                      {selectedCount}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {/* Pulse animation ring */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-white/30"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCtaButton;
