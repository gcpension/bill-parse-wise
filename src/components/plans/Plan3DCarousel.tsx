import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft, Sparkles, Calendar, Check, Star, Shield, Clock, Gift, Zap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlanRecord } from '@/hooks/useAllPlans';

interface Plan3DCarouselProps {
  plans: PlanRecord[];
  currentMonthlyBill: number;
  onSelectPlan: (plan: PlanRecord) => void;
  companyLogos: Record<string, string>;
}

// Company section carousel component
const CompanyCarousel: React.FC<{
  company: string;
  plans: PlanRecord[];
  currentMonthlyBill: number;
  onSelectPlan: (plan: PlanRecord) => void;
  logo?: string;
}> = ({ company, plans, currentMonthlyBill, onSelectPlan, logo }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, plans.length - 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const recommendedCount = plans.filter(p => 
    currentMonthlyBill > 0 && p.monthlyPrice && p.monthlyPrice < currentMonthlyBill
  ).length;

  const parseFeatures = (plan: PlanRecord): string[] => {
    const features: string[] = [];
    if (plan.transferBenefits) {
      const parts = plan.transferBenefits.split(/[,،;•]/);
      features.push(...parts.slice(0, 4).map(p => p.trim()).filter(Boolean));
    }
    return features;
  };

  return (
    <div className="mb-12 last:mb-0">
      {/* Company Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          {logo ? (
            <div className="w-14 h-14 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center p-2">
              <img src={logo} alt={company} className="max-w-full max-h-full object-contain" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-xl bg-muted border border-border flex items-center justify-center">
              <Building2 className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-foreground">{company}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-muted-foreground">{plans.length} מסלולים</span>
              {recommendedCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                  <Star className="w-3 h-3" />
                  {recommendedCount} מומלצים
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        {plans.length > 3 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className={cn(
                "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                activeIndex === 0 
                  ? "border-border/50 text-muted-foreground/50 cursor-not-allowed"
                  : "border-border bg-card text-foreground hover:bg-muted shadow-sm"
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={activeIndex >= plans.length - 3}
              className={cn(
                "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                activeIndex >= plans.length - 3
                  ? "border-border/50 text-muted-foreground/50 cursor-not-allowed"
                  : "border-border bg-card text-foreground hover:bg-muted shadow-sm"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Plans Horizontal Scroll */}
      <div className="relative overflow-hidden">
        <motion.div
          ref={scrollRef}
          className="flex gap-5"
          animate={{ x: activeIndex * -340 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {plans.map((plan, index) => {
            const savings = currentMonthlyBill > 0 && plan.monthlyPrice && plan.monthlyPrice < currentMonthlyBill
              ? currentMonthlyBill - plan.monthlyPrice
              : 0;
            const isRecommended = savings > 0;
            const isBestValue = index === 0;
            const features = parseFeatures(plan);

            return (
              <motion.div
                key={`${plan.company}-${plan.plan}-${index}`}
                className="flex-shrink-0 w-[320px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={cn(
                  "h-full rounded-2xl border bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                  isRecommended 
                    ? "border-emerald-200 ring-1 ring-emerald-100" 
                    : "border-border hover:border-foreground/20"
                )}>
                  {/* Top Ribbon */}
                  {isRecommended && (
                    <div className="bg-gradient-to-l from-emerald-500 to-emerald-600 text-white py-2 px-4">
                      <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                        <Sparkles className="w-4 h-4" />
                        <span>חסכו ₪{savings.toFixed(0)} לחודש</span>
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-4">
                      {isBestValue && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-semibold">
                          <Zap className="w-3 h-3" />
                          הזול ביותר
                        </span>
                      )}
                      <span className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs">
                        {plan.service}
                      </span>
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-lg font-bold text-foreground mb-4 line-clamp-2 min-h-[56px] leading-snug">
                      {plan.plan}
                    </h3>

                    {/* Price Card */}
                    <div className="bg-muted/50 rounded-xl p-4 mb-5 text-center">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-foreground">{plan.monthlyPrice}</span>
                        <div className="text-right">
                          <span className="text-lg text-muted-foreground">₪</span>
                          <div className="text-xs text-muted-foreground -mt-1">לחודש</div>
                        </div>
                      </div>
                      {plan.yearlyPrice && (
                        <div className="text-xs text-muted-foreground mt-2">
                          ₪{plan.yearlyPrice.toLocaleString()} לשנה
                        </div>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-5">
                      {features.length > 0 ? (
                        features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-foreground" />
                            </div>
                            <span className="text-sm text-foreground/80 leading-relaxed">{feature}</span>
                          </div>
                        ))
                      ) : plan.transferBenefits ? (
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-foreground/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Gift className="w-3 h-3 text-foreground" />
                          </div>
                          <span className="text-sm text-foreground/80 leading-relaxed line-clamp-2">{plan.transferBenefits}</span>
                        </div>
                      ) : null}

                      {plan.commitment && (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                          </div>
                          <span className="text-sm text-muted-foreground">{plan.commitment}</span>
                        </div>
                      )}

                      {plan.sla && (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <Shield className="w-3 h-3 text-muted-foreground" />
                          </div>
                          <span className="text-sm text-muted-foreground">ציון שירות: {plan.sla}</span>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={() => onSelectPlan(plan)}
                      className={cn(
                        "w-full h-12 font-semibold rounded-xl text-base transition-all",
                        isRecommended
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-foreground hover:bg-foreground/90 text-background"
                      )}
                    >
                      בחירת מסלול
                      <ArrowLeft className="mr-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      {plans.length > 3 && (
        <div className="flex justify-center items-center gap-1.5 mt-5">
          {Array.from({ length: Math.ceil(plans.length / 3) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx * 3)}
              className={cn(
                "transition-all rounded-full",
                Math.floor(activeIndex / 3) === idx
                  ? "w-6 h-2 bg-foreground"
                  : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      )}
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
    <div className="w-full py-6">
      {Array.from(plansByCompany.entries()).map(([company, companyPlans], index) => (
        <motion.div
          key={company}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <CompanyCarousel
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
