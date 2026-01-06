import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft, Gift, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlanRecord } from '@/hooks/useAllPlans';

interface Plan3DCarouselProps {
  plans: PlanRecord[];
  currentMonthlyBill: number;
  onSelectPlan: (plan: PlanRecord) => void;
  companyLogos: Record<string, string>;
}

const Plan3DCarousel: React.FC<Plan3DCarouselProps> = ({
  plans,
  currentMonthlyBill,
  onSelectPlan,
  companyLogos
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleCount = 5;
  
  const getVisiblePlans = () => {
    const result: { plan: PlanRecord; position: number; originalIndex: number }[] = [];
    const halfVisible = Math.floor(visibleCount / 2);
    
    for (let i = -halfVisible; i <= halfVisible; i++) {
      let index = activeIndex + i;
      if (index < 0) index = plans.length + index;
      if (index >= plans.length) index = index - plans.length;
      
      if (plans[index]) {
        result.push({
          plan: plans[index],
          position: i,
          originalIndex: index
        });
      }
    }
    
    return result;
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % plans.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + plans.length) % plans.length);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      handlePrev();
    } else if (info.offset.x < -threshold) {
      handleNext();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handleNext();
    if (e.key === 'ArrowRight') handlePrev();
  };

  if (plans.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        לא נמצאו מסלולים
      </div>
    );
  }

  const visiblePlans = getVisiblePlans();

  return (
    <div 
      ref={containerRef}
      className="relative w-full py-10 select-none focus:outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Navigation */}
      <button
        onClick={handlePrev}
        className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:shadow-xl transition-all"
        aria-label="הקודם"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:shadow-xl transition-all"
        aria-label="הבא"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Carousel */}
      <motion.div
        className="relative h-[520px] flex items-center justify-center overflow-hidden"
        style={{ perspective: '1200px' }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence mode="popLayout">
          {visiblePlans.map(({ plan, position, originalIndex }) => {
            const isCenter = position === 0;
            const planSavings = currentMonthlyBill > 0 && plan.monthlyPrice && plan.monthlyPrice < currentMonthlyBill
              ? currentMonthlyBill - plan.monthlyPrice
              : 0;
            const isPlanRecommended = planSavings > 0;
            const logo = companyLogos[plan.company];

            const absPosition = Math.abs(position);
            const scale = isCenter ? 1 : 0.85 - absPosition * 0.05;
            const translateX = position * 160;
            const rotateY = position * 8;
            const opacity = 1;
            const zIndex = 10 - absPosition;
            const blur = isCenter ? 0 : absPosition * 1;

            return (
              <motion.div
                key={`${plan.company}-${plan.plan}-${originalIndex}`}
                className="absolute"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity,
                  scale,
                  x: translateX,
                  rotateY: `${rotateY}deg`,
                  zIndex,
                  filter: `blur(${blur}px)`,
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                onClick={() => {
                  if (!isCenter) {
                    setActiveIndex(originalIndex);
                  }
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  cursor: isCenter ? 'default' : 'pointer'
                }}
              >
                <div
                  className={cn(
                    "w-[340px] bg-white rounded-xl overflow-hidden transition-all duration-300",
                    isCenter 
                      ? "shadow-2xl ring-1 ring-slate-200" 
                      : "shadow-lg ring-1 ring-slate-100"
                  )}
                >
                  {/* Header */}
                  <div className={cn(
                    "p-5 border-b",
                    isCenter ? "border-slate-200 bg-slate-50/80" : "border-slate-100 bg-slate-50/50"
                  )}>
                    <div className="flex items-center gap-4">
                      {logo ? (
                        <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center p-2 border border-slate-200 shadow-sm">
                          <img src={logo} alt={plan.company} className="max-w-full max-h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                          <span className="text-xl font-bold text-slate-400">{plan.company.charAt(0)}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className={cn(
                          "font-bold truncate",
                          isCenter ? "text-slate-900 text-lg" : "text-slate-500 text-base"
                        )}>{plan.company}</h3>
                        <span className={cn(
                          "text-sm",
                          isCenter ? "text-slate-500" : "text-slate-400"
                        )}>{plan.service}</span>
                      </div>
                      {isCenter && isPlanRecommended && (
                        <div className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold">
                          מומלץ
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    {/* Plan Name */}
                    <p className={cn(
                      "line-clamp-2 min-h-[44px] mb-5",
                      isCenter ? "text-slate-700 text-sm font-medium" : "text-slate-400 text-sm"
                    )}>
                      {plan.plan}
                    </p>

                    {/* Price */}
                    <div className={cn(
                      "text-center py-6 rounded-lg mb-5",
                      isCenter ? "bg-slate-100/80" : "bg-slate-50"
                    )}>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className={cn(
                          "font-bold",
                          isCenter ? "text-5xl text-slate-900" : "text-4xl text-slate-400"
                        )}>
                          {plan.monthlyPrice}
                        </span>
                        <span className={cn(
                          isCenter ? "text-2xl text-slate-400" : "text-xl text-slate-300"
                        )}>₪</span>
                      </div>
                      <span className={cn(
                        "text-sm mt-1 block",
                        isCenter ? "text-slate-500" : "text-slate-400"
                      )}>לחודש</span>
                      
                      {isCenter && isPlanRecommended && (
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                          <span className="text-sm text-slate-600">חיסכון</span>
                          <span className="text-sm font-bold text-slate-900">₪{planSavings.toFixed(0)}/חודש</span>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    {isCenter && (
                      <div className="space-y-3 mb-5">
                        {plan.transferBenefits && (
                          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <Gift className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-600 leading-relaxed">{plan.transferBenefits}</span>
                          </div>
                        )}
                        {plan.commitment && (
                          <div className="flex items-center gap-3 text-sm text-slate-500 px-1">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span>{plan.commitment}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* CTA */}
                    {isCenter && (
                      <Button
                        onClick={() => onSelectPlan(plan)}
                        className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-base"
                      >
                        בחירת מסלול
                        <ArrowLeft className="mr-2 h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Progress Dots */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {plans.slice(0, Math.min(plans.length, 12)).map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "transition-all duration-300 rounded-full",
              activeIndex === index
                ? "w-8 h-2 bg-slate-900"
                : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
            )}
          />
        ))}
        {plans.length > 12 && (
          <span className="text-sm text-slate-400 mr-2">+{plans.length - 12}</span>
        )}
      </div>

      {/* Counter */}
      <p className="text-center text-sm text-slate-500 mt-4 font-medium">
        {activeIndex + 1} מתוך {plans.length}
      </p>
    </div>
  );
};

export default Plan3DCarousel;
