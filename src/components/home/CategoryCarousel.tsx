import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronLeft, Zap, Wifi, Smartphone, Tv, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryData {
  name: string;
  subtext?: string;
  icon: typeof Zap;
}

interface CategoryCarouselProps {
  selectedCategories: Record<string, { selected: boolean; amount: string }>;
  onCategorySelect: (category: string) => void;
}

const categoryData: Record<string, CategoryData> = {
  triple: {
    name: 'טריפל',
    subtext: 'חבילות משולבות',
    icon: Package,
  },
  electricity: {
    name: 'חשמל',
    subtext: 'ספקי אנרגיה',
    icon: Zap,
  },
  cellular: {
    name: 'סלולר',
    subtext: 'מסלולים ומכשירים',
    icon: Smartphone,
  },
  internet: {
    name: 'אינטרנט',
    subtext: 'חיבורים ומהירויות',
    icon: Wifi,
  },
  tv: {
    name: 'טלוויזיה',
    subtext: 'ערוצים ותוכן',
    icon: Tv,
  }
};

const categories = Object.keys(categoryData);

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  selectedCategories,
  onCategorySelect
}) => {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  
  const selectedCount = Object.values(selectedCategories).filter(c => c.selected).length;

  const handleStepClick = (category: string) => {
    setActiveStep(category);
    onCategorySelect(category);
  };

  return (
    <div className="relative py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-heebo">
          השוואת מחירים ב-30 שניות
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          <span className="text-primary font-semibold">הטבות והנחות בלעדיות</span>
          {' '}בשוק התקשורת והאנרגיה
        </p>
      </div>

      {/* Step Circles Container */}
      <div className="flex items-center justify-center gap-2 md:gap-4 flex-row-reverse">
        {categories.map((category, index) => {
          const data = categoryData[category];
          const isSelected = selectedCategories[category]?.selected;
          const isActive = activeStep === category;
          const isFirst = index === 0;
          
          return (
            <React.Fragment key={category}>
              {/* Arrow between steps */}
              {!isFirst && (
                <div className="text-muted-foreground/50 text-xl md:text-2xl font-light">
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              )}
              
              {/* Step Circle */}
              <motion.button
                onClick={() => handleStepClick(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative flex flex-col items-center justify-center",
                  "w-20 h-20 md:w-28 md:h-28 rounded-full",
                  "transition-all duration-300 cursor-pointer",
                  "bg-muted-foreground/70",
                  isActive && "ring-4 ring-primary ring-offset-2 ring-offset-background",
                  isSelected && !isActive && "ring-2 ring-primary/50 ring-offset-1 ring-offset-background"
                )}
              >
                {/* Selected checkmark */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 shadow-lg z-10"
                    >
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Circle Content */}
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <span className="text-white font-bold text-sm md:text-base leading-tight">
                    {data.name}
                  </span>
                  {data.subtext && (
                    <span className="text-white/80 text-[10px] md:text-xs mt-0.5 leading-tight hidden md:block">
                      {data.subtext}
                    </span>
                  )}
                </div>
              </motion.button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Selected Count Badge */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex justify-center mt-6"
          >
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20">
              <CheckCircle className="w-4 h-4" />
              <span className="font-semibold text-sm">
                {selectedCount} קטגוריות נבחרו
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint Text */}
      <div className="text-center mt-6">
        <p className="text-muted-foreground text-sm">
          לחצו על קטגוריה להתחלת ההשוואה
        </p>
      </div>
    </div>
  );
};

export default CategoryCarousel;
