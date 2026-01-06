import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, TrendingDown, Rocket, Award, Sparkles, Zap, Wifi, Smartphone, Tv, Check, Clock, Shield } from 'lucide-react';
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

const getCategoryGradient = (service: string) => {
  if (service === 'סלולר') return 'from-emerald-500 to-teal-600';
  if (service.includes('אינטרנט')) return 'from-blue-500 to-indigo-600';
  if (service.includes('טלוויזיה')) return 'from-rose-500 to-pink-600';
  if (service === 'חשמל') return 'from-amber-500 to-orange-600';
  return 'from-violet-500 to-purple-600';
};

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
      className="relative w-full py-12 select-none focus:outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:scale-105 transition-all duration-300 group"
        aria-label="הקודם"
      >
        <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:scale-105 transition-all duration-300 group"
        aria-label="הבא"
      >
        <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* 3D Carousel Container */}
      <motion.div
        className="relative h-[520px] flex items-center justify-center"
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
            const CategoryIcon = getCategoryIcon(plan.service);
            const gradient = getCategoryGradient(plan.service);

            const absPosition = Math.abs(position);
            const scale = isCenter ? 1 : 0.72 - absPosition * 0.06;
            const translateX = position * (isCenter ? 0 : 180);
            const rotateY = position * 12;
            const opacity = isCenter ? 1 : 0.6 - absPosition * 0.12;
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
                  rotateY: `${rotateY}deg`,
                  zIndex,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 26,
                }}
                onClick={() => {
                  if (isCenter) {
                    onSelectPlan(plan);
                  } else {
                    setActiveIndex(originalIndex);
                  }
                }}
                whileHover={isCenter ? { scale: 1.03, y: -8 } : { scale: scale + 0.02 }}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <div
                  className={cn(
                    "w-[340px] rounded-3xl overflow-hidden transition-all duration-500",
                    isCenter 
                      ? "shadow-2xl shadow-slate-400/30" 
                      : "shadow-xl shadow-slate-300/20",
                    isPlanRecommended && isCenter
                      ? "ring-2 ring-emerald-400 ring-offset-4 ring-offset-white"
                      : ""
                  )}
                >
                  {/* Gradient Header */}
                  <div className={cn(
                    "relative p-6 pb-8 bg-gradient-to-br",
                    isCenter ? gradient : "from-slate-100 to-slate-50"
                  )}>
                    {/* Decorative Elements */}
                    {isCenter && (
                      <>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
                      </>
                    )}
                    
                    {/* Top Badges */}
                    {isCenter && (
                      <div className="absolute top-4 left-4 flex gap-2">
                        {isPlanRecommended && (
                          <Badge className="bg-white/95 text-emerald-700 font-bold shadow-lg px-3 py-1.5 backdrop-blur-sm">
                            <Star className="w-3.5 h-3.5 ml-1.5 fill-emerald-500 text-emerald-500" />
                            מומלץ
                          </Badge>
                        )}
                        {originalIndex === 0 && (
                          <Badge className="bg-white/95 text-amber-700 font-bold shadow-lg px-3 py-1.5 backdrop-blur-sm">
                            <Award className="w-3.5 h-3.5 ml-1.5 text-amber-500" />
                            הזול ביותר
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Company Info */}
                    <div className="relative flex items-center gap-4">
                      {logo ? (
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center p-2.5 shadow-lg",
                          isCenter ? "bg-white" : "bg-white/80"
                        )}>
                          <img src={logo} alt={plan.company} className="max-w-full max-h-full object-contain" />
                        </div>
                      ) : (
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg",
                          isCenter ? "bg-white" : "bg-white/80"
                        )}>
                          <CategoryIcon className={cn(
                            "w-8 h-8",
                            isCenter ? "text-slate-700" : "text-slate-400"
                          )} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className={cn(
                          "font-bold text-xl truncate",
                          isCenter ? "text-white" : "text-slate-700"
                        )}>
                          {plan.company}
                        </h3>
                        <div className={cn(
                          "flex items-center gap-2 mt-1",
                          isCenter ? "text-white/80" : "text-slate-500"
                        )}>
                          <CategoryIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">{plan.service}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="bg-white p-6">
                    {/* Plan Name */}
                    <h4 className={cn(
                      "font-semibold line-clamp-2 min-h-[52px] leading-relaxed mb-4",
                      isCenter ? "text-slate-800 text-lg" : "text-slate-500 text-base"
                    )}>
                      {plan.plan}
                    </h4>

                    {/* Price Section */}
                    <div className={cn(
                      "rounded-2xl p-5 mb-5 text-center",
                      isCenter 
                        ? isPlanRecommended 
                          ? "bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100" 
                          : "bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-100"
                        : "bg-slate-50"
                    )}>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className={cn(
                          "font-extrabold tracking-tight",
                          isCenter ? "text-5xl text-slate-900" : "text-3xl text-slate-500"
                        )}>
                          {plan.monthlyPrice}
                        </span>
                        <span className={cn(
                          "font-bold",
                          isCenter ? "text-2xl text-slate-400" : "text-lg text-slate-400"
                        )}>₪</span>
                        <span className="text-sm text-slate-400 font-medium mr-1">/חודש</span>
                      </div>

                      {isCenter && isPlanRecommended && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg shadow-emerald-200/50 font-bold"
                        >
                          <TrendingDown className="w-5 h-5" />
                          <span>חסכו ₪{planSavings.toFixed(0)} בחודש</span>
                        </motion.div>
                      )}

                      {isCenter && plan.yearlyPrice && !isPlanRecommended && (
                        <p className="text-sm text-slate-400 mt-3 font-medium">
                          ₪{plan.yearlyPrice.toLocaleString()} לשנה
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    {isCenter && (
                      <div className="space-y-3 mb-5">
                        {plan.transferBenefits && (
                          <div className="flex items-start gap-3 p-3 bg-violet-50 rounded-xl border border-violet-100">
                            <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-violet-600 font-semibold mb-0.5">הטבת מעבר</p>
                              <p className="text-sm text-violet-800 font-medium leading-snug">{plan.transferBenefits}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-3">
                          {plan.commitment && (
                            <div className="flex-1 flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span className="text-xs text-slate-600 font-medium">{plan.commitment}</span>
                            </div>
                          )}
                          {plan.sla && (
                            <div className="flex-1 flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <Shield className="w-4 h-4 text-slate-400" />
                              <span className="text-xs text-slate-600 font-medium">שירות: {plan.sla}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* CTA Button */}
                    {isCenter && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPlan(plan);
                        }}
                        className={cn(
                          "w-full h-14 font-bold text-base transition-all duration-300 rounded-xl shadow-lg group",
                          isPlanRecommended
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-200/50"
                            : "bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-900 hover:to-slate-800 text-white shadow-slate-300/50"
                        )}
                      >
                        <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        {isPlanRecommended ? "עברו למסלול הזה" : "בחרו מסלול זה"}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Dots Navigation */}
      <div className="flex justify-center items-center gap-2 mt-8">
        {plans.slice(0, Math.min(plans.length, 12)).map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "transition-all duration-300 rounded-full",
              activeIndex === index
                ? "w-10 h-3 bg-gradient-to-r from-slate-700 to-slate-800 shadow-sm"
                : "w-3 h-3 bg-slate-200 hover:bg-slate-300"
            )}
            aria-label={`עבור למסלול ${index + 1}`}
          />
        ))}
        {plans.length > 12 && (
          <span className="text-sm text-slate-400 font-medium mr-3">
            +{plans.length - 12} נוספים
          </span>
        )}
      </div>

      {/* Counter */}
      <div className="text-center mt-5">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white rounded-full shadow-sm border border-slate-100">
          <span className="text-sm text-slate-500">
            מסלול
          </span>
          <span className="text-lg font-bold text-slate-800">{activeIndex + 1}</span>
          <span className="text-sm text-slate-400">מתוך</span>
          <span className="text-lg font-bold text-slate-800">{plans.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Plan3DCarousel;
