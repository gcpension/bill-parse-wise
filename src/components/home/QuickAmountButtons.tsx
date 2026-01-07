import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Clock, Sparkles } from 'lucide-react';
import { getQuickAmountSuggestions, getLastAmount } from '@/hooks/useUserPreferences';

interface QuickAmountButtonsProps {
  category: string;
  currentAmount: number;
  onSelectAmount: (amount: number) => void;
  className?: string;
}

const QuickAmountButtons: React.FC<QuickAmountButtonsProps> = ({
  category,
  currentAmount,
  onSelectAmount,
  className,
}) => {
  const suggestions = getQuickAmountSuggestions(category);
  const lastAmount = getLastAmount(category);

  // Combine last amount with suggestions if it exists and isn't already in suggestions
  const allAmounts = lastAmount && !suggestions.includes(lastAmount)
    ? [lastAmount, ...suggestions.slice(0, 4)]
    : suggestions;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Last used amount - if exists */}
      {lastAmount && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectAmount(lastAmount)}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl",
            "text-sm font-medium transition-all duration-200",
            "border-2 border-dashed",
            currentAmount === lastAmount
              ? "bg-primary/10 border-primary text-primary"
              : "bg-muted/50 border-muted-foreground/30 text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
          )}
        >
          <Clock className="w-4 h-4" />
          <span>הסכום האחרון: ₪{lastAmount}</span>
        </motion.button>
      )}

      {/* Quick amount buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {allAmounts.map((amount, index) => {
          const isSelected = currentAmount === amount;
          const isLast = amount === lastAmount;
          
          return (
            <motion.button
              key={amount}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectAmount(amount)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                "flex items-center gap-1.5",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {isLast && !isSelected && <Clock className="w-3 h-3" />}
              ₪{amount}
            </motion.button>
          );
        })}
      </div>

      {/* Tip */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1"
      >
        <Sparkles className="w-3 h-3" />
        בחרו סכום או הזינו ידנית
      </motion.p>
    </div>
  );
};

export default QuickAmountButtons;
