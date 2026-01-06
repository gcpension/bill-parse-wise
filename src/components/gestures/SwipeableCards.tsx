import React from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipeableCardsProps<T> {
  items: T[];
  renderCard: (item: T, index: number, isActive: boolean) => React.ReactNode;
  activeIndex: number;
  onIndexChange: (index: number) => void;
  showIndicators?: boolean;
  showArrows?: boolean;
}

function SwipeableCards<T>({ 
  items, 
  renderCard, 
  activeIndex, 
  onIndexChange,
  showIndicators = true,
  showArrows = true
}: SwipeableCardsProps<T>) {
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    
    if (info.offset.x > swipeThreshold && activeIndex > 0) {
      onIndexChange(activeIndex - 1);
    } else if (info.offset.x < -swipeThreshold && activeIndex < items.length - 1) {
      onIndexChange(activeIndex + 1);
    }
  };

  const goToPrev = () => {
    if (activeIndex > 0) {
      onIndexChange(activeIndex - 1);
    }
  };

  const goToNext = () => {
    if (activeIndex < items.length - 1) {
      onIndexChange(activeIndex + 1);
    }
  };

  return (
    <div className="relative w-full">
      {/* Navigation arrows */}
      {showArrows && (
        <>
          <button
            onClick={goToPrev}
            disabled={activeIndex === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-background hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            disabled={activeIndex === items.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-background hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Cards container */}
      <div className="overflow-hidden px-8">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="flex cursor-grab active:cursor-grabbing"
          animate={{
            x: -activeIndex * 100 + '%',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-full px-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: index === activeIndex ? 1 : 0.5,
                  scale: index === activeIndex ? 1 : 0.9,
                }}
                transition={{ duration: 0.3 }}
              >
                {renderCard(item, index, index === activeIndex)}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Dot indicators */}
      {showIndicators && items.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => onIndexChange(index)}
              className={`transition-all duration-300 rounded-full ${
                index === activeIndex 
                  ? 'w-6 h-2 bg-primary' 
                  : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`עבור לכרטיס ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Swipe hint - shown on first interaction */}
      <div className="flex justify-center mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ChevronLeft className="w-3 h-3" />
          החלק להחלפה
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}

export default SwipeableCards;
