import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullIndicatorProps {
  progress: number; // 0 to 1
  isRefreshing: boolean;
  threshold?: number;
}

const PullIndicator: React.FC<PullIndicatorProps> = ({
  progress,
  isRefreshing,
  threshold = 0.8,
}) => {
  const isReady = progress >= threshold;
  
  if (progress <= 0 && !isRefreshing) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-safe"
    >
      <motion.div
        animate={{
          y: Math.min(progress * 60, 60),
          scale: isReady ? 1.1 : 0.8 + progress * 0.2,
        }}
        className={cn(
          "flex items-center justify-center",
          "w-12 h-12 rounded-full",
          "bg-background shadow-lg border border-border",
          "transition-colors duration-200",
          isReady && "bg-primary text-primary-foreground border-primary"
        )}
      >
        {isRefreshing ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            animate={{ rotate: isReady ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PullIndicator;
