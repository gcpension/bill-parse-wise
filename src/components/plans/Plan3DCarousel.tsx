import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft, Sparkles, Check, Clock, Shield, Gift, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlanRecord } from '@/hooks/useAllPlans';

interface Plan3DCarouselProps {
  plans: PlanRecord[];
  currentMonthlyBill: number;
  onSelectPlan: (plan: PlanRecord) => void;
  companyLogos: Record<string, string>;
}

// 3D Carousel for each company
const Company3DCarousel: React.FC<{
  company: string;
  plans: PlanRecord[];
  currentMonthlyBill: number;
  onSelectPlan: (plan: PlanRecord) => void;
  logo?: string;
}> = ({ company, plans, currentMonthlyBill, onSelectPlan, logo }) => {
  const [activeIndex, setActiveIndex] = useState(Math.floor(plans.length / 2));

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + plans.length) % plans.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % plans.length);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 50) {
      if (info.offset.x > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  };

  const parseFeatures = (plan: PlanRecord): string[] => {
    const features: string[] = [];
    if (plan.transferBenefits) {
      const parts = plan.transferBenefits.split(/[,،;•]/);
      features.push(...parts.slice(0, 3).map(p => p.trim()).filter(Boolean));
    }
    return features;
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);
    
    if (absDiff === 0) {
      return {
        x: 0,
        scale: 1,
        zIndex: 30,
        opacity: 1,
        rotateY: 0,
      };
    } else if (absDiff === 1) {
      return {
        x: diff * 280,
        scale: 0.85,
        zIndex: 20,
        opacity: 0.7,
        rotateY: diff * -15,
      };
    } else if (absDiff === 2) {
      return {
        x: diff * 220,
        scale: 0.7,
        zIndex: 10,
        opacity: 0.4,
        rotateY: diff * -20,
      };
    } else {
      return {
        x: diff * 180,
        scale: 0.6,
        zIndex: 0,
        opacity: 0,
        rotateY: diff * -25,
      };
    }
  };

  const recommendedCount = plans.filter(p => 
    currentMonthlyBill > 0 && p.monthlyPrice && p.monthlyPrice < currentMonthlyBill
  ).length;

  return (
    <div className="mb-16 last:mb-0">
      {/* Company Header */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {logo ? (
          <div className="w-12 h-12 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center p-2">
            <img src={logo} alt={company} className="max-w-full max-h-full object-contain" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center">
            <Building2 className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">{company}</h2>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="text-sm text-muted-foreground">{plans.length} מסלולים</span>
            {recommendedCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                {recommendedCount} חוסכים
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3D Carousel Container */}
      <div className="relative h-[420px] flex items-center justify-center" style={{ perspective: '1200px' }}>
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute right-4 z-40 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center transition-all hover:bg-muted hover:scale-110"
        >
          <ChevronRight className="w-6 h-6 text-foreground" />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute left-4 z-40 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center transition-all hover:bg-muted hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>

        {/* Cards */}
        <div className="relative w-full h-full flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {plans.map((plan, index) => {
              const style = getCardStyle(index);
              const savings = currentMonthlyBill > 0 && plan.monthlyPrice && plan.monthlyPrice < currentMonthlyBill
                ? currentMonthlyBill - plan.monthlyPrice
                : 0;
              const isRecommended = savings > 0;
              const isCenter = index === activeIndex;
              const features = parseFeatures(plan);

              return (
                <motion.div
                  key={`${plan.company}-${plan.plan}-${index}`}
                  className="absolute cursor-pointer"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{
                    x: style.x,
                    scale: style.scale,
                    rotateY: style.rotateY,
                    opacity: style.opacity,
                    zIndex: style.zIndex,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                  onClick={() => !isCenter && setActiveIndex(index)}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={handleDrag}
                >
                  <div
                    className={cn(
                      "w-[300px] rounded-2xl border bg-card overflow-hidden transition-shadow duration-300",
                      isCenter 
                        ? "shadow-2xl border-foreground/20" 
                        : "shadow-lg border-border",
                      isRecommended && isCenter && "ring-2 ring-emerald-500/50"
                    )}
                  >
                    {/* Savings Badge */}
                    {isRecommended && (
                      <div className="bg-emerald-600 text-white py-2 px-4">
                        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                          <Sparkles className="w-4 h-4" />
                          <span>חיסכון ₪{savings.toFixed(0)}/חודש</span>
                        </div>
                      </div>
                    )}

                    <div className="p-5">
                      {/* Service Type */}
                      <div className="mb-3">
                        <span className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
                          {plan.service}
                        </span>
                      </div>

                      {/* Plan Name */}
                      <h3 className="text-lg font-bold text-foreground mb-4 line-clamp-2 min-h-[48px]">
                        {plan.plan}
                      </h3>

                      {/* Price */}
                      <div className="bg-muted/50 rounded-xl p-4 mb-4 text-center">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-3xl font-bold text-foreground">{plan.monthlyPrice}</span>
                          <span className="text-lg text-muted-foreground">₪/חודש</span>
                        </div>
                        {plan.yearlyPrice && (
                          <div className="text-xs text-muted-foreground mt-1">
                            ₪{plan.yearlyPrice.toLocaleString()} לשנה
                          </div>
                        )}
                      </div>

                      {/* Features - Only show when center */}
                      {isCenter && (
                        <div className="space-y-2 mb-4">
                          {features.length > 0 ? (
                            features.map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-foreground/80">{feature}</span>
                              </div>
                            ))
                          ) : plan.transferBenefits ? (
                            <div className="flex items-start gap-2">
                              <Gift className="w-4 h-4 text-foreground/60 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground/80 line-clamp-2">{plan.transferBenefits}</span>
                            </div>
                          ) : null}

                          {plan.commitment && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{plan.commitment}</span>
                            </div>
                          )}

                          {plan.sla && (
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">שירות: {plan.sla}</span>
                            </div>
                          )}
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
                            "w-full h-11 font-semibold rounded-xl transition-all",
                            isRecommended
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-foreground hover:bg-foreground/90 text-background"
                          )}
                        >
                          בחירת מסלול
                          <ArrowLeft className="mr-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {plans.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "transition-all rounded-full",
              idx === activeIndex
                ? "w-8 h-2 bg-foreground"
                : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
          />
        ))}
      </div>
    </div>
  );
};

const Plan3DCarousel: React.FC<Plan3DCarouselProps> = ({
  plans,
  currentMonthlyBill,
  onSelectPlan,
  companyLogos
}) => {
  // Group plans by company
  const plansByCompany = useMemo(() => {
    const grouped = new Map<string, PlanRecord[]>();
    plans.forEach(plan => {
      const existing = grouped.get(plan.company) || [];
      grouped.set(plan.company, [...existing, plan]);
    });
    return grouped;
  }, [plans]);

  if (plans.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        לא נמצאו מסלולים
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      {Array.from(plansByCompany.entries()).map(([company, companyPlans], index) => (
        <motion.div
          key={company}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15 }}
        >
          <Company3DCarousel
            company={company}
            plans={companyPlans}
            currentMonthlyBill={currentMonthlyBill}
            onSelectPlan={onSelectPlan}
            logo={companyLogos[company]}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default Plan3DCarousel;
