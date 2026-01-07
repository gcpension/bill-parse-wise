import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft, Sparkles, Check, Clock, Shield, Gift, Building2, Wifi, Smartphone, Tv, Zap, Signal, Database, Monitor, Users, Package, Star, TrendingUp, Crown, Gem, Award, Info, Heart, Scale, TrendingDown, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { PlanRecord } from '@/hooks/useAllPlans';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePlanPreferences } from '@/hooks/usePlanPreferences';
import { calculateValueScore, getDealQualityColor, getDealQualityLabel } from '@/lib/planValueCalculator';

interface Plan3DCarouselProps {
  plans: PlanRecord[];
  currentMonthlyBill: number;
  onViewDetails?: (plan: PlanRecord) => void;
  onSelectPlan: (plan: PlanRecord) => void;
  companyLogos: Record<string, string>;
}

// Get service category icon
const getServiceIcon = (service: string) => {
  const serviceLower = service.toLowerCase();
  if (serviceLower.includes('סלולר')) return Smartphone;
  if (serviceLower.includes('אינטרנט')) return Wifi;
  if (serviceLower.includes('טלוויזיה')) return Tv;
  if (serviceLower.includes('חשמל')) return Zap;
  if (serviceLower.includes('טריפל')) return Package;
  return Smartphone;
};

// Get feature chips for a plan
const getFeatureChips = (plan: PlanRecord): string[] => {
  const chips: string[] = [];
  const planText = `${plan.plan} ${plan.commitment || ''}`.toLowerCase();
  
  if (planText.includes('5g')) chips.push('5G');
  if (planText.includes('ללא הגבלה') || planText.includes('אינסופי')) chips.push('ללא הגבלה');
  if (planText.includes('סיבים') || planText.includes('fiber')) chips.push('סיבים');
  if (planText.includes('ללא התחייבות') || planText.includes('בלי התחייבות')) chips.push('ללא התחייבות');
  
  return chips.slice(0, 3);
};

// 3D Carousel for each company
const Company3DCarousel: React.FC<{
  company: string;
  plans: PlanRecord[];
  allPlans: PlanRecord[];
  currentMonthlyBill: number;
  onSelectPlan: (plan: PlanRecord) => void;
  onViewDetails?: (plan: PlanRecord) => void;
  logo?: string;
  toggleFavorite: (company: string, plan: string) => void;
  isFavorite: (company: string, plan: string) => boolean;
  toggleCompare: (company: string, plan: string) => boolean;
  isInCompare: (company: string, plan: string) => boolean;
}> = ({ company, plans, allPlans, currentMonthlyBill, onSelectPlan, onViewDetails, logo, toggleFavorite, isFavorite, toggleCompare, isInCompare }) => {
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

  const getCardStyle = (index: number, isMobile: boolean) => {
    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);
    
    const xMultiplier = isMobile ? 140 : 280;
    const xMultiplier2 = isMobile ? 100 : 220;
    const xMultiplier3 = isMobile ? 80 : 180;
    
    if (absDiff === 0) {
      return { x: 0, scale: 1, zIndex: 30, opacity: 1, rotateY: 0 };
    } else if (absDiff === 1) {
      return { x: diff * xMultiplier, scale: isMobile ? 0.75 : 0.85, zIndex: 20, opacity: isMobile ? 0.5 : 0.7, rotateY: diff * -15 };
    } else if (absDiff === 2) {
      return { x: diff * xMultiplier2, scale: isMobile ? 0.6 : 0.7, zIndex: 10, opacity: isMobile ? 0.2 : 0.4, rotateY: diff * -20 };
    } else {
      return { x: diff * xMultiplier3, scale: isMobile ? 0.5 : 0.6, zIndex: 0, opacity: 0, rotateY: diff * -25 };
    }
  };

  const recommendedCount = plans.filter(p => 
    currentMonthlyBill > 0 && p.monthlyPrice && p.monthlyPrice < currentMonthlyBill
  ).length;

  const [isMobile, setIsMobile] = useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Company color themes
  const getCompanyTheme = (companyName: string) => {
    const themes = [
      { headerBg: 'bg-gradient-to-l from-slate-800 via-slate-700 to-slate-600', accent: 'bg-blue-500', accentLight: 'bg-blue-50', accentText: 'text-blue-600', border: 'border-blue-200', cardBg: 'bg-gradient-to-br from-blue-50/50 to-white', priceBg: 'bg-blue-50', dot: 'bg-blue-500' },
      { headerBg: 'bg-gradient-to-l from-violet-800 via-purple-700 to-violet-600', accent: 'bg-purple-500', accentLight: 'bg-purple-50', accentText: 'text-purple-600', border: 'border-purple-200', cardBg: 'bg-gradient-to-br from-purple-50/50 to-white', priceBg: 'bg-purple-50', dot: 'bg-purple-500' },
      { headerBg: 'bg-gradient-to-l from-teal-800 via-teal-700 to-emerald-600', accent: 'bg-teal-500', accentLight: 'bg-teal-50', accentText: 'text-teal-600', border: 'border-teal-200', cardBg: 'bg-gradient-to-br from-teal-50/50 to-white', priceBg: 'bg-teal-50', dot: 'bg-teal-500' },
      { headerBg: 'bg-gradient-to-l from-amber-800 via-orange-700 to-amber-600', accent: 'bg-orange-500', accentLight: 'bg-orange-50', accentText: 'text-orange-600', border: 'border-orange-200', cardBg: 'bg-gradient-to-br from-orange-50/50 to-white', priceBg: 'bg-orange-50', dot: 'bg-orange-500' },
      { headerBg: 'bg-gradient-to-l from-rose-800 via-pink-700 to-rose-600', accent: 'bg-rose-500', accentLight: 'bg-rose-50', accentText: 'text-rose-600', border: 'border-rose-200', cardBg: 'bg-gradient-to-br from-rose-50/50 to-white', priceBg: 'bg-rose-50', dot: 'bg-rose-500' },
      { headerBg: 'bg-gradient-to-l from-cyan-800 via-sky-700 to-cyan-600', accent: 'bg-cyan-500', accentLight: 'bg-cyan-50', accentText: 'text-cyan-600', border: 'border-cyan-200', cardBg: 'bg-gradient-to-br from-cyan-50/50 to-white', priceBg: 'bg-cyan-50', dot: 'bg-cyan-500' },
      { headerBg: 'bg-gradient-to-l from-indigo-800 via-indigo-700 to-blue-600', accent: 'bg-indigo-500', accentLight: 'bg-indigo-50', accentText: 'text-indigo-600', border: 'border-indigo-200', cardBg: 'bg-gradient-to-br from-indigo-50/50 to-white', priceBg: 'bg-indigo-50', dot: 'bg-indigo-500' },
    ];
    const hash = companyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return themes[hash % themes.length];
  };

  const theme = getCompanyTheme(company);

  return (
    <div className="mb-12 md:mb-20 last:mb-0">
      {/* Company Header */}
      <div className="mx-3 md:mx-6 mb-6 md:mb-8">
        <div className="flex items-center gap-4 md:gap-5 p-4 md:p-5 rounded-xl bg-card border border-border shadow-sm">
          <div className={cn("w-14 h-14 md:w-16 md:h-16 rounded-xl flex-shrink-0 flex items-center justify-center p-2.5 md:p-3 bg-gradient-to-br shadow-md", theme.headerBg)}>
            {logo ? (
              <img src={logo} alt={company} className="max-w-full max-h-full object-contain brightness-0 invert" />
            ) : (
              <Building2 className="w-7 h-7 md:w-8 md:h-8 text-white" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-1 truncate">{company}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", theme.accentLight, theme.accentText)}>
                {plans.length} מסלולים
              </span>
              {recommendedCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                  <Sparkles className="w-3 h-3" />
                  {recommendedCount} חוסכים
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3D Carousel Container */}
      <div className="relative h-[480px] md:h-[580px] flex items-center justify-center" style={{ perspective: '1200px' }}>
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute right-1 md:right-4 z-40 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center transition-all hover:bg-muted hover:scale-110 touch-manipulation active:scale-95"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute left-1 md:left-4 z-40 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card/90 backdrop-blur-sm border border-border shadow-lg flex items-center justify-center transition-all hover:bg-muted hover:scale-110 touch-manipulation active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
        </button>

        {/* Cards */}
        <div className="relative w-full h-full flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {plans.map((plan, index) => {
              const style = getCardStyle(index, isMobile);
              const valueScore = calculateValueScore(plan, allPlans);
              const savings = currentMonthlyBill > 0 && plan.monthlyPrice && plan.monthlyPrice < currentMonthlyBill
                ? currentMonthlyBill - plan.monthlyPrice
                : 0;
              const isRecommended = savings > 0;
              const isCenter = index === activeIndex;
              const ServiceIcon = getServiceIcon(plan.service);
              const featureChips = getFeatureChips(plan);
              const planIsFavorite = isFavorite(plan.company, plan.plan);
              const planIsInCompare = isInCompare(plan.company, plan.plan);

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
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  onClick={() => !isCenter && setActiveIndex(index)}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={handleDrag}
                >
                  <div
                    className={cn(
                      "w-[280px] md:w-[340px] rounded-2xl overflow-hidden transition-all duration-300",
                      isCenter 
                        ? `shadow-2xl border-2 ${theme.border}` 
                        : "shadow-lg border border-border/50",
                      isCenter ? theme.cardBg : "bg-card",
                      isRecommended && isCenter && "ring-2 ring-emerald-500/50",
                      planIsInCompare && "ring-2 ring-primary"
                    )}
                  >
                    {/* Top accent bar */}
                    <div className={cn("h-1.5", theme.accent)} />
                    
                    {/* Deal Quality Badge */}
                    {valueScore.dealQuality === 'excellent' && (
                      <div className="bg-green-600 text-white py-1.5 md:py-2 px-3 md:px-4">
                        <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-semibold">
                          🔥 עסקה מעולה
                        </div>
                      </div>
                    )}
                    
                    {/* Savings Badge */}
                    {isRecommended && valueScore.dealQuality !== 'excellent' && (
                      <div className="bg-emerald-600 text-white py-1.5 md:py-2 px-3 md:px-4">
                        <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-semibold">
                          <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span>חיסכון ₪{savings.toFixed(0)}/חודש</span>
                        </div>
                      </div>
                    )}

                    <div className="p-3 md:p-4 relative">
                      {/* Favorite & Compare Buttons */}
                      <div className="absolute top-2 left-2 flex gap-1 z-10">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(plan.company, plan.plan); }}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                            planIsFavorite ? "bg-red-100 text-red-500" : "bg-white/80 text-gray-400 hover:text-red-500"
                          )}
                        >
                          <Heart className={cn("w-4 h-4", planIsFavorite && "fill-current")} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleCompare(plan.company, plan.plan); }}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                            planIsInCompare ? "bg-primary/20 text-primary" : "bg-white/80 text-gray-400 hover:text-primary"
                          )}
                        >
                          <Scale className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Company Name & Service Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {logo && (
                            <img src={logo} alt={company} className="w-5 h-5 object-contain" />
                          )}
                          <span className="text-xs font-bold text-foreground">{company}</span>
                        </div>
                        <span className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium", theme.accentLight, theme.accentText)}>
                          <ServiceIcon className="w-2.5 h-2.5" />
                          {plan.service}
                        </span>
                      </div>

                      {/* Deal Quality Badge */}
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={cn("text-[10px]", getDealQualityColor(valueScore.dealQuality))}>
                          {getDealQualityLabel(valueScore.dealQuality)}
                        </Badge>
                        {valueScore.bestFor.length > 0 && (
                          <span className="text-[9px] text-muted-foreground">
                            מומלץ ל{valueScore.bestFor[0]}
                          </span>
                        )}
                      </div>

                      {/* Plan Name */}
                      <h3 className="text-sm md:text-base font-bold text-foreground mb-2 line-clamp-2 min-h-[36px] md:min-h-[40px]">
                        {plan.plan}
                      </h3>

                      {/* Feature Chips */}
                      {featureChips.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {featureChips.map(chip => (
                            <Badge key={chip} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                              {chip}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Price */}
                      <div className={cn("rounded-xl p-2.5 md:p-3 mb-3 text-center", theme.priceBg)}>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className={cn("text-2xl md:text-3xl font-bold", theme.accentText)}>
                            {plan.monthlyPrice}
                          </span>
                          <span className="text-sm md:text-base text-muted-foreground">₪/חודש</span>
                        </div>
                        
                        {/* Price comparison */}
                        {valueScore.percentFromAverage !== 0 && (
                          <div className={`text-xs flex items-center justify-center gap-1 mt-1 ${
                            valueScore.percentFromAverage > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <TrendingDown className={`h-3 w-3 ${valueScore.percentFromAverage < 0 ? 'rotate-180' : ''}`} />
                            {Math.abs(valueScore.percentFromAverage)}% {valueScore.percentFromAverage > 0 ? 'זול מהממוצע' : 'יקר מהממוצע'}
                          </div>
                        )}
                      </div>

                      {/* Value Score - Only when center */}
                      {isCenter && (
                        <div className="mb-3 p-2.5 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">ציון ערך</span>
                            <span className="font-bold">{valueScore.total}/100</span>
                          </div>
                          <Progress value={valueScore.total} className="h-2" />
                        </div>
                      )}

                      {/* Why Choose - Only when center */}
                      {isCenter && valueScore.whyChoose.length > 0 && (
                        <div className="mb-3 p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                          <p className="text-[10px] font-medium text-emerald-800 mb-1.5">💡 למה לבחור?</p>
                          <ul className="space-y-1">
                            {valueScore.whyChoose.slice(0, 2).map((reason, i) => (
                              <li key={i} className="text-[11px] flex items-start gap-1.5 text-emerald-700">
                                <Check className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Commitment info */}
                      {isCenter && plan.commitment && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                          <Clock className="w-3 h-3" />
                          <span>{plan.commitment}</span>
                        </div>
                      )}

                      {/* CTA Buttons */}
                      {isCenter && (
                        <div className="space-y-2">
                          {/* View Details Button */}
                          {onViewDetails && (
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewDetails(plan);
                              }}
                              className="w-full h-9 font-medium rounded-xl text-sm bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100"
                            >
                              <Eye className="ml-2 h-4 w-4" />
                              צפה בפרטים מלאים
                            </Button>
                          )}
                          
                          {/* Select Plan Button */}
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPlan(plan);
                            }}
                            className={cn(
                              "w-full h-10 md:h-11 font-semibold rounded-xl transition-all text-sm touch-manipulation",
                              isRecommended
                                ? "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white"
                                : "bg-foreground hover:bg-foreground/90 active:bg-foreground/80 text-background"
                            )}
                          >
                            {isRecommended ? 'בחרו וחסכו!' : 'בחירת מסלול'}
                            <ArrowLeft className="mr-2 h-4 w-4" />
                          </Button>
                        </div>
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
      <div className="flex justify-center items-center gap-1.5 md:gap-2 mt-4 md:mt-6">
        {plans.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "transition-all rounded-full touch-manipulation",
              idx === activeIndex
                ? `w-6 md:w-8 h-2 ${theme.dot}`
                : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            style={{ minWidth: '8px', minHeight: '8px' }}
          />
        ))}
      </div>
    </div>
  );
};

const Plan3DCarousel: React.FC<Plan3DCarouselProps> = ({
  plans,
  currentMonthlyBill,
  onViewDetails,
  onSelectPlan,
  companyLogos
}) => {
  // Plan preferences (favorites, compare)
  const {
    toggleFavorite,
    isFavorite,
    toggleCompare,
    isInCompare,
  } = usePlanPreferences();

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
    <div className="w-full py-8 space-y-4">
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
            allPlans={plans}
            currentMonthlyBill={currentMonthlyBill}
            onSelectPlan={onSelectPlan}
            onViewDetails={onViewDetails}
            logo={companyLogos[company]}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            toggleCompare={toggleCompare}
            isInCompare={isInCompare}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default Plan3DCarousel;
