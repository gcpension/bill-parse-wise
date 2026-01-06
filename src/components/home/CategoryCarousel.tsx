import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { CheckCircle, ChevronLeft, ChevronRight, Zap, Wifi, Smartphone, Tv } from 'lucide-react';
import { cn } from '@/lib/utils';
import electricityFamily from '@/assets/electricity-family.jpg';
import cellularFamily from '@/assets/cellular-family.jpg';
import internetFamily from '@/assets/internet-family.jpg';
import tvFamily from '@/assets/tv-family.jpg';

interface CategoryData {
  name: string;
  icon: typeof Zap;
  image: string;
  providers: string[];
  color: string;
  gradient: string;
}

interface CategoryCarouselProps {
  selectedCategories: Record<string, { selected: boolean; amount: string }>;
  onCategorySelect: (category: string) => void;
}

const categoryData: Record<string, CategoryData> = {
  electricity: {
    name: 'חשמל',
    icon: Zap,
    image: electricityFamily,
    providers: ['חברת חשמל', 'פז אנרגיה', 'אלקטרה פאוור', 'דור אלון אנרגיה', 'סלקום אנרגיה'],
    color: 'from-yellow-400 to-orange-500',
    gradient: 'from-amber-500/90 via-orange-500/70 to-yellow-500/50'
  },
  cellular: {
    name: 'סלולר',
    icon: Smartphone,
    image: cellularFamily,
    providers: ['פלאפון', 'סלקום', 'פרטנר', 'הוט מובייל', '019 מובייל'],
    color: 'from-cyan-400 to-blue-500',
    gradient: 'from-blue-500/90 via-cyan-500/70 to-sky-500/50'
  },
  internet: {
    name: 'אינטרנט',
    icon: Wifi,
    image: internetFamily,
    providers: ['בזק', 'הוט', 'פרטנר', 'סלקום', 'אורנג'],
    color: 'from-purple-400 to-violet-500',
    gradient: 'from-violet-500/90 via-purple-500/70 to-fuchsia-500/50'
  },
  tv: {
    name: 'טלוויזיה',
    icon: Tv,
    image: tvFamily,
    providers: ['יס', 'הוט', 'סלקום TV', 'פרטנר TV', 'נטפליקס'],
    color: 'from-pink-400 to-rose-500',
    gradient: 'from-rose-500/90 via-pink-500/70 to-red-500/50'
  }
};

const categories = Object.keys(categoryData);

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  selectedCategories,
  onCategorySelect
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  
  const CARD_WIDTH = 280;
  const CARD_GAP = 16;
  const DRAG_THRESHOLD = 50;

  // Handle swipe/drag
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    if (Math.abs(info.offset.x) > DRAG_THRESHOLD) {
      if (info.offset.x > 0 && currentIndex > 0) {
        // Swipe right - go to previous
        setCurrentIndex(prev => prev - 1);
      } else if (info.offset.x < 0 && currentIndex < categories.length - 1) {
        // Swipe left - go to next
        setCurrentIndex(prev => prev + 1);
      }
    }
  };

  const goToNext = () => {
    if (currentIndex < categories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Calculate selected count
  const selectedCount = Object.values(selectedCategories).filter(c => c.selected).length;

  return (
    <div className="relative py-8">
      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mb-6">
        {categories.map((category, index) => {
          const isSelected = selectedCategories[category]?.selected;
          const isCurrent = index === currentIndex;
          
          return (
            <button
              key={category}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                isCurrent 
                  ? "w-8 bg-primary" 
                  : isSelected 
                    ? "w-4 bg-primary/60" 
                    : "w-2 bg-gray-200 hover:bg-gray-300"
              )}
            />
          );
        })}
      </div>

      {/* Selected Counter Badge */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {selectedCount} קטגוריות נבחרו
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carousel Container */}
      <div 
        ref={containerRef}
        className="relative overflow-visible px-4 md:px-8"
      >
        {/* Navigation Arrows - Desktop */}
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className={cn(
            "hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20",
            "w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg",
            "items-center justify-center transition-all duration-200",
            "hover:bg-white hover:scale-110 hover:shadow-xl",
            "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          )}
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
        
        <button
          onClick={goToNext}
          disabled={currentIndex === categories.length - 1}
          className={cn(
            "hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20",
            "w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg",
            "items-center justify-center transition-all duration-200",
            "hover:bg-white hover:scale-110 hover:shadow-xl",
            "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          )}
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Cards */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          animate={{ x: -currentIndex * (CARD_WIDTH + CARD_GAP) }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex gap-4 cursor-grab active:cursor-grabbing"
          style={{ x }}
        >
          {categories.map((category, index) => {
            const data = categoryData[category];
            const Icon = data.icon;
            const isSelected = selectedCategories[category]?.selected;
            const isCurrent = index === currentIndex;
            const distance = Math.abs(index - currentIndex);
            
            return (
              <motion.div
                key={category}
                className="flex-shrink-0"
                style={{ width: CARD_WIDTH }}
                animate={{
                  scale: isCurrent ? 1 : 0.9 - distance * 0.05,
                  opacity: isCurrent ? 1 : 0.6 - distance * 0.1,
                  rotateY: isCurrent ? 0 : (index < currentIndex ? 15 : -15),
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div
                  onClick={() => !isDragging && onCategorySelect(category)}
                  className={cn(
                    "relative h-80 rounded-3xl overflow-hidden cursor-pointer",
                    "transition-all duration-300",
                    isSelected && "ring-4 ring-primary ring-offset-2 ring-offset-white",
                    isCurrent && "shadow-2xl"
                  )}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={data.image}
                      alt={data.name}
                      className="w-full h-full object-cover"
                    />
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-t",
                      data.gradient
                    )} />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Top */}
                    <div className="flex justify-between items-start">
                      <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                        <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                      </div>
                      
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            className="bg-white text-primary rounded-full p-2 shadow-lg"
                          >
                            <CheckCircle className="w-6 h-6" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Bottom */}
                    <div>
                      <motion.h3 
                        className="text-3xl font-bold text-white mb-2 font-heebo"
                        animate={{ scale: isCurrent ? 1 : 0.95 }}
                      >
                        {data.name}
                      </motion.h3>
                      
                      <p className="text-white/80 text-sm mb-4">
                        {data.providers.length} ספקים זמינים
                      </p>
                      
                      {/* Selection Button */}
                      <motion.div
                        className={cn(
                          "inline-flex items-center gap-2 px-5 py-2.5 rounded-full",
                          "backdrop-blur-md transition-all duration-300",
                          isSelected 
                            ? "bg-white text-gray-900 shadow-lg" 
                            : "bg-white/20 text-white hover:bg-white/30"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="font-medium">
                          {isSelected ? 'נבחר ✓' : 'לחץ לבחירה'}
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Shine Effect */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-shimmer" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Swipe Hint for Mobile */}
      <div className="md:hidden mt-4 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm text-gray-500 flex items-center justify-center gap-2"
        >
          <ChevronRight className="w-4 h-4" />
          החליקו לצפייה בקטגוריות נוספות
          <ChevronLeft className="w-4 h-4" />
        </motion.p>
      </div>
    </div>
  );
};

export default CategoryCarousel;
