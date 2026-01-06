import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, TrendingDown, Rocket, Award, Sparkles, Zap, Wifi, Smartphone, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PlanRecord } from '@/hooks/useAllPlans';

interface Plan3DCarouselProps {
  plans: PlanRecord[];
  currentMonthlyBill: number;
  onSelectPlan: (plan: PlanRecord) => void;
  companyLogos: Record<string, string>;
}

const getCategoryIcon = (service: string) => {
  if (service === 'סלולר') return Smartphone;
  if (service.includes('אינטרנט')) return Wifi;
  if (service.includes('טלוויזיה')) return Tv;
  if (service === 'חשמל') return Zap;
  return Sparkles;
};

const Plan3DCarousel: React.FC<Plan3DCarouselProps> = ({
  plans,
  currentMonthlyBill,
  onSelectPlan,
  companyLogos
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);

  // Get visible plans (5 at a time for the 3D effect)
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

  // Auto-rotate (optional - can be enabled)
  // useEffect(() => {
  //   const interval = setInterval(handleNext, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  if (plans.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500">
        לא נמצאו מסלולים
      </div>
    );
  }

  const visiblePlans = getVisiblePlans();
  const activePlan = plans[activeIndex];
  const savings = currentMonthlyBill > 0 && activePlan?.monthlyPrice && activePlan.monthlyPrice < currentMonthlyBill
    ? currentMonthlyBill - activePlan.monthlyPrice
    : 0;
  const isRecommended = savings > 0;

  return (
    <div 
      ref={containerRef}
      className="relative w-full py-8 select-none focus:outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 hover:scale-110 transition-all duration-200"
        aria-label="הקודם"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 hover:scale-110 transition-all duration-200"
        aria-label="הבא"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* 3D Carousel Container */}
      <motion.div
        className="relative h-[480px] flex items-center justify-center perspective-1000"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x: dragX }}
      >
        <AnimatePresence mode="popLayout">
          {visiblePlans.map(({ plan, position, originalIndex }) => {
            const isCenter = position === 0;
            const planSavings = currentMonthlyBill > 0 && plan.monthlyPrice && plan.monthlyPrice < currentMonthlyBill
              ? currentMonthlyBill - plan.monthlyPrice
              : 0;
            const isPlanRecommended = planSavings > 0;
            const logo = companyLogos[plan.company];
            const CategoryIcon = getCategoryIcon(plan.service);

            // Calculate 3D transform values
            const absPosition = Math.abs(position);
            const scale = isCenter ? 1 : 0.75 - absPosition * 0.08;
            const translateX = position * (isCenter ? 0 : 160);
            const translateZ = isCenter ? 0 : -100 - absPosition * 50;
            const rotateY = position * 8;
            const opacity = isCenter ? 1 : 0.7 - absPosition * 0.15;
            const zIndex = 10 - absPosition;

            return (
              <motion.div
                key={`${plan.company}-${plan.plan}-${originalIndex}`}
                className="absolute cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity,
                  scale,
                  x: translateX,
                  z: translateZ,
                  rotateY: `${rotateY}deg`,
                  zIndex,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                onClick={() => {
                  if (isCenter) {
                    onSelectPlan(plan);
                  } else {
                    setActiveIndex(originalIndex);
                  }
                }}
                whileHover={isCenter ? { scale: 1.02 } : {}}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <div
                  className={cn(
                    "w-[320px] rounded-2xl overflow-hidden transition-all duration-300",
                    isCenter 
                      ? "shadow-2xl shadow-slate-300/50" 
                      : "shadow-lg shadow-slate-200/50",
                    isPlanRecommended && isCenter
                      ? "bg-gradient-to-b from-emerald-50 via-white to-emerald-50 border-2 border-emerald-200"
                      : "bg-white border border-slate-200"
                  )}
                >
                  {/* Card Header */}
                  <div className={cn(
                    "relative p-5 pb-4",
                    isCenter ? "bg-gradient-to-b from-slate-50 to-white" : "bg-white"
                  )}>
                    {/* Badges */}
                    {isCenter && (
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {isPlanRecommended && (
                          <Badge className="bg-emerald-500 text-white font-semibold shadow-lg px-3 py-1">
                            <Star className="w-3.5 h-3.5 ml-1.5 fill-white" />
                            מומלץ
                          </Badge>
                        )}
                        {originalIndex === 0 && (
                          <Badge className="bg-amber-500 text-white font-semibold shadow-lg px-3 py-1">
                            <Award className="w-3.5 h-3.5 ml-1.5" />
                            הזול ביותר
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Company Logo & Name */}
                    <div className="flex items-center gap-3 mb-4">
                      {logo ? (
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center p-2 border border-slate-100">
                          <img src={logo} alt={plan.company} className="max-w-full max-h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                          <CategoryIcon className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-slate-800 text-lg">{plan.company}</h3>
                        <span className="text-xs text-slate-400">{plan.service}</span>
                      </div>
                    </div>

                    {/* Plan Name */}
                    <h4 className={cn(
                      "font-medium line-clamp-2 min-h-[48px] leading-relaxed",
                      isCenter ? "text-slate-700 text-base" : "text-slate-500 text-sm"
                    )}>
                      {plan.plan}
                    </h4>
                  </div>

                  {/* Price Section */}
                  <div className={cn(
                    "px-5 py-6 text-center",
                    isCenter && isPlanRecommended 
                      ? "bg-gradient-to-b from-emerald-50/50 to-emerald-100/30" 
                      : "bg-slate-50/50"
                  )}>
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className={cn(
                        "font-bold tracking-tight",
                        isCenter ? "text-5xl text-slate-900" : "text-3xl text-slate-600"
                      )}>
                        {plan.monthlyPrice}
                      </span>
                      <span className={cn(
                        "font-medium",
                        isCenter ? "text-xl text-slate-400" : "text-base text-slate-400"
                      )}>₪</span>
                      <span className="text-sm text-slate-400 mr-1">/חודש</span>
                    </div>

                    {isCenter && isPlanRecommended && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-200"
                      >
                        <TrendingDown className="w-4 h-4" />
                        <span className="font-semibold">חסכו ₪{planSavings.toFixed(0)}/חודש</span>
                      </motion.div>
                    )}

                    {isCenter && plan.yearlyPrice && (
                      <p className="text-xs text-slate-400 mt-2">
                        ₪{plan.yearlyPrice.toLocaleString()} לשנה
                      </p>
                    )}
                  </div>

                  {/* Benefits & CTA */}
                  {isCenter && (
                    <div className="px-5 pb-5 space-y-4">
                      {plan.transferBenefits && (
                        <div className="p-3 bg-violet-50 border border-violet-100 rounded-xl">
                          <div className="flex items-center gap-2 text-sm text-violet-700">
                            <span className="text-lg">🎁</span>
                            <span className="font-medium">{plan.transferBenefits}</span>
                          </div>
                        </div>
                      )}

                      {plan.commitment && (
                        <div className="text-xs text-slate-500 text-center">
                          התחייבות: {plan.commitment}
                        </div>
                      )}

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPlan(plan);
                        }}
                        className={cn(
                          "w-full h-12 font-semibold text-base transition-all duration-300 shadow-lg",
                          isPlanRecommended
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                            : "bg-slate-800 hover:bg-slate-900 text-white shadow-slate-200"
                        )}
                      >
                        <Rocket className="ml-2 h-5 w-5" />
                        {isPlanRecommended ? "עברו למסלול הזה" : "בחרו מסלול זה"}
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Dots Navigation */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {plans.slice(0, Math.min(plans.length, 10)).map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "transition-all duration-300 rounded-full",
              activeIndex === index
                ? "w-8 h-2 bg-slate-800"
                : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
            )}
            aria-label={`עבור למסלול ${index + 1}`}
          />
        ))}
        {plans.length > 10 && (
          <span className="text-xs text-slate-400 mr-2">
            +{plans.length - 10} נוספים
          </span>
        )}
      </div>

      {/* Counter */}
      <div className="text-center mt-4">
        <span className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700">{activeIndex + 1}</span>
          {' '}מתוך{' '}
          <span className="font-semibold text-slate-700">{plans.length}</span>
          {' '}מסלולים
        </span>
      </div>
    </div>
  );
};

export default Plan3DCarousel;
