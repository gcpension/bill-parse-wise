import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronLeft, ChevronRight, Zap, Wifi, Smartphone, Tv, Package, Sparkles } from 'lucide-react';
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
  gradient: string;
  badge?: string;
}

interface CategoryCarouselProps {
  selectedCategories: Record<string, { selected: boolean; amount: string }>;
  onCategorySelect: (category: string) => void;
}

const categoryData: Record<string, CategoryData> = {
  triple: {
    name: 'טריפל',
    icon: Package,
    image: tvFamily,
    providers: ['HOT', 'פרטנר', 'סלקום', 'YES + בזק', 'רמי לוי'],
    gradient: 'from-purple-600/90 via-indigo-500/70 to-violet-500/50',
    badge: 'חיסכון מקסימלי!'
  },
  electricity: {
    name: 'חשמל',
    icon: Zap,
    image: electricityFamily,
    providers: ['חברת חשמל', 'פז אנרגיה', 'אלקטרה פאוור', 'דור אלון אנרגיה', 'סלקום אנרגיה'],
    gradient: 'from-amber-500/90 via-orange-500/70 to-yellow-500/50'
  },
  cellular: {
    name: 'סלולר',
    icon: Smartphone,
    image: cellularFamily,
    providers: ['פלאפון', 'סלקום', 'פרטנר', 'הוט מובייל', '019 מובייל'],
    gradient: 'from-blue-500/90 via-cyan-500/70 to-sky-500/50'
  },
  internet: {
    name: 'אינטרנט',
    icon: Wifi,
    image: internetFamily,
    providers: ['בזק', 'הוט', 'פרטנר', 'סלקום', 'אורנג'],
    gradient: 'from-violet-500/90 via-purple-500/70 to-fuchsia-500/50'
  },
  tv: {
    name: 'טלוויזיה',
    icon: Tv,
    image: tvFamily,
    providers: ['יס', 'הוט', 'סלקום TV', 'פרטנר TV', 'נטפליקס'],
    gradient: 'from-rose-500/90 via-pink-500/70 to-red-500/50'
  }
};

const categories = Object.keys(categoryData);

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  selectedCategories,
  onCategorySelect
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const selectedCount = Object.values(selectedCategories).filter(c => c.selected).length;

  return (
    <div className="relative py-4" ref={containerRef}>
      {/* Header with Selected Count */}
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-foreground font-heebo">בחרו קטגוריות</h3>
          <AnimatePresence>
            {selectedCount > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-md"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {selectedCount} נבחרו
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Progress Dots */}
        <div className="flex items-center gap-2">
          {categories.map((category, index) => {
            const isSelected = selectedCategories[category]?.selected;
            const isCurrent = index === currentIndex;
            
            return (
              <button
                key={category}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  isCurrent 
                    ? "w-6 h-2 bg-primary" 
                    : isSelected 
                      ? "w-2 h-2 bg-primary/60" 
                      : "w-2 h-2 bg-muted-foreground/30"
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Mobile: Native Scroll Carousel - Enhanced Touch */}
      <div className="md:hidden">
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 pb-4 scroll-momentum"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {categories.map((category) => {
            const data = categoryData[category];
            const Icon = data.icon;
            const isSelected = selectedCategories[category]?.selected;
            
            return (
              <motion.div
                key={category}
                className="flex-shrink-0 snap-center"
                style={{ width: 'calc(85vw - 32px)', maxWidth: '300px' }}
                whileTap={{ scale: 0.97 }}
              >
                <div
                  onClick={() => onCategorySelect(category)}
                  className={cn(
                    "relative h-56 rounded-3xl overflow-hidden cursor-pointer touch-card",
                    "transition-all duration-300",
                    "active:scale-[0.98]",
                    isSelected && "ring-4 ring-primary ring-offset-2 ring-offset-background shadow-xl shadow-primary/20"
                  )}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={data.image}
                      alt={data.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className={cn("absolute inset-0 bg-gradient-to-t", data.gradient)} />
                  </div>

                  {/* Badge */}
                  {data.badge && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 shadow-lg">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs font-bold text-gray-800">{data.badge}</span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-between">
                    {/* Top Row */}
                    <div className="flex justify-between items-start">
                      <div className="p-3.5 rounded-2xl bg-white/25 backdrop-blur-sm shadow-lg">
                        <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                      </div>
                      
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            className="bg-white text-primary rounded-full p-2.5 shadow-lg"
                          >
                            <CheckCircle className="w-6 h-6" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Bottom Content */}
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2 font-heebo drop-shadow-lg">
                        {data.name}
                      </h3>
                      <p className="text-white/90 text-sm mb-4 font-assistant">
                        {data.providers.length} ספקים להשוואה
                      </p>
                      
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "inline-flex items-center gap-2 px-6 py-3 rounded-full text-base font-bold",
                          "transition-all duration-300 shadow-lg",
                          "min-h-[48px]", // Touch-friendly
                          isSelected 
                            ? "bg-white text-gray-900" 
                            : "bg-white/30 text-white backdrop-blur-sm active:bg-white/50"
                        )}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-primary" />
                            נבחר ✓
                          </>
                        ) : (
                          'הקש לבחירה'
                        )}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Desktop: Animated Carousel */}
      <div className="hidden md:block relative overflow-hidden px-4">
        {/* Navigation Arrows - Desktop */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className={cn(
            "flex absolute right-2 top-1/2 -translate-y-1/2 z-20",
            "w-10 h-10 rounded-full bg-background shadow-lg border border-border",
            "items-center justify-center transition-all",
            "hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
          )}
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToNext}
          disabled={currentIndex === categories.length - 1}
          className={cn(
            "flex absolute left-2 top-1/2 -translate-y-1/2 z-20",
            "w-10 h-10 rounded-full bg-background shadow-lg border border-border",
            "items-center justify-center transition-all",
            "hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
          )}
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </motion.button>

        {/* Cards Container */}
        <div className="flex gap-4 justify-center">
          {categories.map((category, index) => {
            const data = categoryData[category];
            const Icon = data.icon;
            const isSelected = selectedCategories[category]?.selected;
            const isCurrent = index === currentIndex;
            
            return (
              <motion.div
                key={category}
                className="flex-shrink-0"
                style={{ width: 200 }}
                animate={{
                  scale: isCurrent ? 1 : 0.88,
                  opacity: isCurrent ? 1 : 0.6,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <motion.div
                  whileHover={isCurrent ? { scale: 1.02 } : {}}
                  whileTap={isCurrent ? { scale: 0.98 } : {}}
                  onClick={() => onCategorySelect(category)}
                  className={cn(
                    "relative h-56 rounded-2xl overflow-hidden cursor-pointer",
                    "transition-all duration-300",
                    isSelected && "ring-3 ring-primary ring-offset-2 ring-offset-background",
                    isCurrent && "shadow-2xl"
                  )}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={data.image}
                      alt={data.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className={cn("absolute inset-0 bg-gradient-to-t", data.gradient)} />
                  </div>

                  {/* Badge */}
                  {data.badge && (
                    <div className="absolute top-2 right-2 z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/95 shadow-lg"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span className="text-[10px] font-bold text-gray-800">{data.badge}</span>
                      </motion.div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    {/* Top Row */}
                    <div className="flex justify-between items-start">
                      <div className="p-2.5 rounded-xl bg-white/25 backdrop-blur-sm">
                        <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                      </div>
                      
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            className="bg-white text-primary rounded-full p-1.5 shadow-lg"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Bottom Content */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 font-heebo drop-shadow-md">
                        {data.name}
                      </h3>
                      <p className="text-white/80 text-xs mb-3 font-assistant">
                        {data.providers.length} ספקים להשוואה
                      </p>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                          "transition-all duration-300 shadow-lg",
                          isSelected 
                            ? "bg-white text-gray-900" 
                            : "bg-white/25 text-white backdrop-blur-sm hover:bg-white/40"
                        )}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-primary" />
                            נבחר
                          </>
                        ) : (
                          'לחץ לבחירה'
                        )}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Swipe Hint - Mobile Only */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="md:hidden mt-3 flex justify-center"
      >
        <div className="flex items-center gap-2 text-muted-foreground text-xs bg-muted/50 px-4 py-2 rounded-full">
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium">גללו הצידה לעוד קטגוריות</span>
          <ChevronLeft className="w-4 h-4" />
        </div>
      </motion.div>
    </div>
  );
};

export default CategoryCarousel;
