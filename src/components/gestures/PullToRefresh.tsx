import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePullToRefresh } from '@/hooks/useGestures';
import { RefreshCw, ArrowDown } from 'lucide-react';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ children, onRefresh }) => {
  const { containerRef, pullProgress, isRefreshing, isPulling } = usePullToRefresh(onRefresh);

  return (
    <div ref={containerRef} className="relative">
      {/* Pull indicator */}
      <AnimatePresence>
        {(isPulling || isRefreshing) && pullProgress > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ 
              opacity: 1, 
              y: Math.min(pullProgress * 80, 60)
            }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed top-0 left-0 right-0 flex justify-center z-50 pointer-events-none"
          >
            <div 
              className="flex flex-col items-center gap-2 bg-card/90 backdrop-blur-lg rounded-full px-6 py-3 shadow-xl border border-border/50"
              style={{
                transform: `scale(${0.8 + pullProgress * 0.2})`,
              }}
            >
              {isRefreshing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <RefreshCw className="w-6 h-6 text-primary" />
                </motion.div>
              ) : (
                <motion.div
                  animate={{ 
                    rotate: pullProgress * 180,
                    scale: pullProgress > 0.8 ? 1.2 : 1
                  }}
                >
                  <ArrowDown 
                    className={`w-6 h-6 transition-colors ${
                      pullProgress > 0.8 ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                </motion.div>
              )}
              <span className="text-xs font-medium text-muted-foreground">
                {isRefreshing 
                  ? 'מרענן...' 
                  : pullProgress > 0.8 
                    ? 'שחרר לרענון' 
                    : 'משוך למטה לרענון'
                }
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      {isPulling && !isRefreshing && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary z-50"
          style={{
            scaleX: pullProgress,
            transformOrigin: 'left',
          }}
        />
      )}

      {children}
    </div>
  );
};

export default PullToRefresh;
