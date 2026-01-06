import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeNavigation } from '@/hooks/useGestures';
import { ChevronRight } from 'lucide-react';

interface SwipeNavigationWrapperProps {
  children: React.ReactNode;
}

const SwipeNavigationWrapper: React.FC<SwipeNavigationWrapperProps> = ({ children }) => {
  const { containerRef, swipeProgress, isSwipingBack } = useSwipeNavigation();

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Swipe back indicator */}
      <AnimatePresence>
        {isSwipingBack && swipeProgress > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ 
              opacity: swipeProgress, 
              x: swipeProgress * 30 - 20,
              scale: 0.8 + swipeProgress * 0.4
            }}
            exit={{ opacity: 0, x: -50 }}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            <div 
              className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30"
              style={{
                boxShadow: `0 0 ${20 * swipeProgress}px hsl(var(--primary) / 0.3)`
              }}
            >
              <ChevronRight 
                className="w-6 h-6 text-primary" 
                style={{ 
                  transform: `rotate(${180 * swipeProgress}deg)`,
                  opacity: 0.5 + swipeProgress * 0.5
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edge indicator line */}
      <div 
        className="fixed right-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-primary/30 to-transparent opacity-0 transition-opacity duration-200 pointer-events-none z-40"
        style={{ opacity: isSwipingBack ? swipeProgress * 0.5 : 0 }}
      />

      {/* Page content with transform */}
      <motion.div
        animate={{
          x: isSwipingBack ? swipeProgress * 50 : 0,
          scale: isSwipingBack ? 1 - swipeProgress * 0.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SwipeNavigationWrapper;
