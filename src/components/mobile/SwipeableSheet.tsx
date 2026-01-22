import React, { useEffect } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface SwipeableSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: ('min' | 'mid' | 'full')[];
  className?: string;
}

const snapHeights = {
  min: '30vh',
  mid: '60vh',
  full: '90vh',
};

const SwipeableSheet: React.FC<SwipeableSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = ['mid', 'full'],
  className,
}) => {
  const { trigger } = useHapticFeedback();
  const dragControls = useDragControls();
  const [currentSnap, setCurrentSnap] = React.useState<'min' | 'mid' | 'full'>('mid');

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    // Fast swipe down - close
    if (velocity > 500 || offset > 200) {
      trigger('light');
      onClose();
      return;
    }

    // Fast swipe up - expand to full
    if (velocity < -500) {
      trigger('light');
      setCurrentSnap('full');
      return;
    }

    // Snap based on position
    if (offset > 100 && currentSnap !== 'min' && snapPoints.includes('min')) {
      setCurrentSnap('min');
      trigger('light');
    } else if (offset < -100 && currentSnap !== 'full' && snapPoints.includes('full')) {
      setCurrentSnap('full');
      trigger('light');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ 
              y: 0,
              height: snapHeights[currentSnap],
            }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.1, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50",
              "bg-background rounded-t-3xl shadow-2xl",
              "flex flex-col overflow-hidden",
              "safe-area-bottom",
              className
            )}
          >
            {/* Drag Handle */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="flex-shrink-0 flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
            >
              <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Title */}
            {title && (
              <div className="flex-shrink-0 px-4 pb-3 border-b border-border">
                <h2 className="text-lg font-bold text-center">{title}</h2>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SwipeableSheet;
