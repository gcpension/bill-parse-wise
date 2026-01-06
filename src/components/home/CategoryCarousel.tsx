import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { CheckCircle, ChevronLeft, ChevronRight, Zap, Wifi, Smartphone, Tv, Package } from 'lucide-react';
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
  const [isDragging, setIsDragging] = useState(false);
  
  // Responsive card dimensions
  const CARD_WIDTH_MOBILE = 160;
  const CARD_WIDTH_DESKTOP = 200;
  const CARD_GAP = 12;
  const DRAG_THRESHOLD = 40;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    if (Math.abs(info.offset.x) > DRAG_THRESHOLD) {
      if (info.offset.x > 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (info.offset.x < 0 && currentIndex < categories.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }
  };

  const selectedCount = Object.values(selectedCategories).filter(c => c.selected).length;

  return (
    <div className="relative py-4">
      {/* Header with Progress */}
      <div className="flex items-center justify-between mb-3 px-2">
        <h3 className="text-sm font-medium text-gray-600">בחרו קטגוריות לבדיקה</h3>
        <div className="flex items-center gap-1.5">
          {categories.map((category, index) => {
            const isSelected = selectedCategories[category]?.selected;
            const isCurrent = index === currentIndex;
            
            return (
              <button
                key={category}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  isCurrent 
                    ? "w-5 bg-primary" 
                    : isSelected 
                      ? "w-3 bg-primary/60" 
                      : "w-1.5 bg-gray-300"
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Selected Badge */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-1 left-2 z-20"
          >
            <div className="bg-primary text-primary-foreground px-2.5 py-1 rounded-full text-xs font-medium shadow-md flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {selectedCount} נבחרו
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carousel */}
      <div className="relative overflow-hidden">
        {/* Navigation - Desktop */}
        <button
          onClick={() => currentIndex > 0 && setCurrentIndex(prev => prev - 1)}
          disabled={currentIndex === 0}
          className={cn(
            "hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20",
            "w-8 h-8 rounded-full bg-white/90 shadow-md",
            "items-center justify-center transition-all",
            "hover:bg-white hover:scale-105",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}
        >
          <ChevronRight className="w-4 h-4 text-gray-700" />
        </button>
        
        <button
          onClick={() => currentIndex < categories.length - 1 && setCurrentIndex(prev => prev + 1)}
          disabled={currentIndex === categories.length - 1}
          className={cn(
            "hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20",
            "w-8 h-8 rounded-full bg-white/90 shadow-md",
            "items-center justify-center transition-all",
            "hover:bg-white hover:scale-105",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}
        >
          <ChevronLeft className="w-4 h-4 text-gray-700" />
        </button>

        {/* Cards Container - Fixed swipe for mobile */}
        <motion.div
          drag="x"
          dragConstraints={{ left: -((categories.length - 1) * (CARD_WIDTH_MOBILE + CARD_GAP)), right: 0 }}
          dragElastic={0.2}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          animate={{ 
            x: -currentIndex * (CARD_WIDTH_MOBILE + CARD_GAP) + (typeof window !== 'undefined' && window.innerWidth < 768 ? 16 : (window.innerWidth / 2 - CARD_WIDTH_MOBILE / 2 - 100))
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex gap-3 cursor-grab active:cursor-grabbing touch-pan-x"
          style={{ touchAction: 'pan-x' }}
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
                className="flex-shrink-0 w-40 md:w-[200px]"
                animate={{
                  scale: isCurrent ? 1 : 0.85,
                  opacity: isCurrent ? 1 : 0.5,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div
                  onClick={() => !isDragging && onCategorySelect(category)}
                  className={cn(
                    "relative h-44 md:h-52 rounded-2xl overflow-hidden cursor-pointer",
                    "transition-all duration-300",
                    isSelected && "ring-2 ring-primary ring-offset-2",
                    isCurrent && "shadow-xl"
                  )}
                >
                  {/* Background */}
                  <div className="absolute inset-0">
                    <img
                      src={data.image}
                      alt={data.name}
                      className="w-full h-full object-cover"
                    />
                    <div className={cn("absolute inset-0 bg-gradient-to-t", data.gradient)} />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 p-3 flex flex-col justify-between">
                    {/* Top */}
                    <div className="flex justify-between items-start">
                      <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                      
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="bg-white text-primary rounded-full p-1.5 shadow-md"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Bottom */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-0.5 font-heebo">
                        {data.name}
                      </h3>
                      <p className="text-white/70 text-xs mb-2">
                        {data.providers.length} ספקים
                      </p>
                      
                      <div className={cn(
                        "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium",
                        "backdrop-blur-sm transition-all",
                        isSelected 
                          ? "bg-white text-gray-900" 
                          : "bg-white/20 text-white"
                      )}>
                        {isSelected ? '✓ נבחר' : 'בחר'}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Swipe Hint - Mobile */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="md:hidden mt-2 text-center text-xs text-gray-400 flex items-center justify-center gap-1"
      >
        <ChevronRight className="w-3 h-3" />
        החליקו
        <ChevronLeft className="w-3 h-3" />
      </motion.p>
    </div>
  );
};

export default CategoryCarousel;
