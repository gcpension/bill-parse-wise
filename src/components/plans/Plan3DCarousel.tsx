import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft, Sparkles, Calendar, Check } from 'lucide-react';
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

  // Parse features from plan description
  const parseFeatures = (plan: PlanRecord): string[] => {
    const features: string[] = [];
    if (plan.transferBenefits) {
      const parts = plan.transferBenefits.split(/[,،;]/);
      features.push(...parts.slice(0, 3).map(p => p.trim()).filter(Boolean));
    }
    return features;
  };

  if (plans.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
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
        className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-background shadow-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:shadow-xl transition-all"
        aria-label="הקודם"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-background shadow-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:shadow-xl transition-all"
        aria-label="הבא"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Carousel */}
      <motion.div
        className="relative h-[560px] flex items-center justify-center overflow-hidden"
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
            const features = parseFeatures(plan);

            const absPosition = Math.abs(position);
            const scale = isCenter ? 1 : 0.82 - absPosition * 0.04;
            const translateX = position * 170;
            const rotateY = position * 6;
            const opacity = 1;
            const zIndex = 10 - absPosition;
            const blur = isCenter ? 0 : absPosition * 1.5;

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
                    "w-[360px] bg-card rounded-2xl overflow-hidden transition-all duration-300 border",
                    isCenter 
                      ? "shadow-2xl border-border" 
                      : "shadow-md border-border/50"
                  )}
                >
                  {/* Top Badge */}
                  {isCenter && isPlanRecommended && (
                    <div className="bg-foreground text-background py-2 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-semibold">מומלץ עבורך • חיסכון של ₪{planSavings.toFixed(0)} לחודש</span>
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          {logo ? (
                            <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center p-1.5 border border-border">
                              <img src={logo} alt={plan.company} className="max-w-full max-h-full object-contain" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border">
                              <span className="text-lg font-bold text-muted-foreground">{plan.company.charAt(0)}</span>
                            </div>
                          )}
                          <div>
                            <h3 className={cn(
                              "font-bold",
                              isCenter ? "text-foreground text-lg" : "text-muted-foreground text-base"
                            )}>{plan.company}</h3>
                            <span className="text-xs text-muted-foreground">{plan.service}</span>
                          </div>
                        </div>
                        <p className={cn(
                          "text-sm line-clamp-2 mt-3",
                          isCenter ? "text-foreground/80" : "text-muted-foreground"
                        )}>
                          {plan.plan}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className={cn(
                    "mx-6 p-5 rounded-xl mb-4",
                    isCenter ? "bg-muted" : "bg-muted/50"
                  )}>
                    <div className="flex items-end justify-center gap-1">
                      <span className={cn(
                        "font-bold leading-none",
                        isCenter ? "text-5xl text-foreground" : "text-4xl text-muted-foreground"
                      )}>
                        {plan.monthlyPrice}
                      </span>
                      <div className="flex flex-col items-start mb-1">
                        <span className={cn(
                          "text-lg font-medium",
                          isCenter ? "text-muted-foreground" : "text-muted-foreground/70"
                        )}>₪</span>
                        <span className={cn(
                          "text-xs -mt-0.5",
                          isCenter ? "text-muted-foreground" : "text-muted-foreground/60"
                        )}>לחודש</span>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  {isCenter && (
                    <div className="px-6 pb-4">
                      <div className="space-y-2.5">
                        {features.length > 0 ? (
                          features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-foreground" />
                              </div>
                              <span className="text-sm text-foreground/80 leading-relaxed">{feature}</span>
                            </div>
                          ))
                        ) : plan.transferBenefits ? (
                          <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-foreground" />
                            </div>
                            <span className="text-sm text-foreground/80 leading-relaxed">{plan.transferBenefits}</span>
                          </div>
                        ) : null}
                        
                        {plan.commitment && (
                          <div className="flex items-center gap-3 pt-1">
                            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                            </div>
                            <span className="text-sm text-muted-foreground">{plan.commitment}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  {isCenter && (
                    <div className="px-6 pb-6 pt-2">
                      <Button
                        onClick={() => onSelectPlan(plan)}
                        className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background font-semibold rounded-xl text-base"
                      >
                        בחירת מסלול
                        <ArrowLeft className="mr-2 h-5 w-5" />
                      </Button>
                    </div>
                  )}

                  {/* Non-center minimal info */}
                  {!isCenter && (
                    <div className="px-6 pb-6">
                      <div className="h-12" />
                    </div>
                  )}
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
                ? "w-8 h-2 bg-foreground"
                : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
          />
        ))}
        {plans.length > 12 && (
          <span className="text-sm text-muted-foreground mr-2">+{plans.length - 12}</span>
        )}
      </div>

      {/* Counter */}
      <p className="text-center text-sm text-muted-foreground mt-4 font-medium">
        {activeIndex + 1} מתוך {plans.length}
      </p>
    </div>
  );
};

export default Plan3DCarousel;
