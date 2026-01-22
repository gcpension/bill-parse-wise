import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface TouchCardProps extends Omit<HTMLMotionProps<'div'>, 'onTap'> {
  children: React.ReactNode;
  className?: string;
  onTap?: () => void;
  isSelected?: boolean;
  hapticOnTap?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
}

const TouchCard: React.FC<TouchCardProps> = ({
  children,
  className,
  onTap,
  isSelected = false,
  hapticOnTap = true,
  variant = 'default',
  ...props
}) => {
  const { trigger } = useHapticFeedback();

  const handleTap = () => {
    if (hapticOnTap) {
      trigger(isSelected ? 'light' : 'medium');
    }
    onTap?.();
  };

  const variants = {
    default: cn(
      "bg-card border border-border/50",
      "shadow-sm hover:shadow-md"
    ),
    elevated: cn(
      "bg-card border border-border/30",
      "shadow-lg hover:shadow-xl"
    ),
    outlined: cn(
      "bg-transparent border-2",
      isSelected ? "border-primary" : "border-border"
    ),
    glass: cn(
      "bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl",
      "border border-white/50 dark:border-gray-800/50"
    ),
  };

  return (
    <motion.div
      onClick={handleTap}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        // Base styles
        "relative rounded-2xl overflow-hidden",
        "transition-all duration-200",
        "cursor-pointer select-none",
        
        // Touch target optimization
        "min-h-[48px]",
        
        // Selection state
        isSelected && [
          "ring-2 ring-primary ring-offset-2 ring-offset-background",
          "shadow-lg shadow-primary/20"
        ],
        
        // Variant styles
        variants[variant],
        
        // Custom styles
        className
      )}
      {...props}
    >
      {/* Selection overlay */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-primary/5 pointer-events-none"
        />
      )}
      
      {children}
    </motion.div>
  );
};

export default TouchCard;
