import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft, Sparkles, Check, Clock, Shield, Gift, Building2, Wifi, Smartphone, Tv, Zap, Signal, Database, Monitor, Users, Package, Star, TrendingUp, Crown, Gem, Award, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlanRecord } from '@/hooks/useAllPlans';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Plan3DCarouselProps {
  plans: PlanRecord[];
  currentMonthlyBill: number;
  onSelectPlan: (plan: PlanRecord) => void;
  companyLogos: Record<string, string>;
}

// Plan tier system to explain price differences
type PlanTier = 'basic' | 'standard' | 'premium' | 'ultimate';

const getPlanTier = (plan: PlanRecord): { tier: PlanTier; label: string; icon: typeof Star; color: string; bgColor: string; description: string } => {
  const price = plan.monthlyPrice || 0;
  const planLower = (plan.plan + ' ' + (plan.transferBenefits || '')).toLowerCase();
  const service = plan.service.toLowerCase();
  
  // Determine tier based on price and features
  let tier: PlanTier = 'basic';
  
  if (service.includes('טריפל')) {
    if (price > 300) tier = 'ultimate';
    else if (price > 200) tier = 'premium';
    else if (price > 150) tier = 'standard';
    else tier = 'basic';
  } else if (service.includes('סלולר')) {
    if (price > 60 || planLower.includes('ללא הגבלה')) tier = 'ultimate';
    else if (price > 40 || planLower.includes('500') || planLower.includes('1000')) tier = 'premium';
    else if (price > 25) tier = 'standard';
    else tier = 'basic';
  } else if (service.includes('אינטרנט')) {
    if (price > 140 || planLower.includes('1 גיגה') || planLower.includes('1000')) tier = 'ultimate';
    else if (price > 100 || planLower.includes('500')) tier = 'premium';
    else if (price > 70) tier = 'standard';
    else tier = 'basic';
  } else if (service.includes('טלוויזיה')) {
    if (price > 170 || planLower.includes('netflix') || planLower.includes('hbo')) tier = 'ultimate';
    else if (price > 130 || planLower.includes('4k')) tier = 'premium';
    else if (price > 90) tier = 'standard';
    else tier = 'basic';
  }
  
  const tierConfig = {
    basic: { 
      label: 'בסיסי', 
      icon: Star, 
      color: 'text-slate-600', 
      bgColor: 'bg-slate-100',
      description: 'מתאים לשימוש קל • מחיר נמוך • הכי חסכוני'
    },
    standard: { 
      label: 'סטנדרט', 
      icon: TrendingUp, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100',
      description: 'איזון בין מחיר לביצועים • מתאים לרוב המשתמשים'
    },
    premium: { 
      label: 'פרימיום', 
      icon: Crown, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-100',
      description: 'ביצועים גבוהים • תוכן עשיר • הטבות נוספות'
    },
    ultimate: { 
      label: 'אולטימטיבי', 
      icon: Gem, 
      color: 'text-amber-600', 
      bgColor: 'bg-amber-100',
      description: 'הכל כלול • ללא הגבלות • חוויה מקסימלית'
    },
  };
  
  return { tier, ...tierConfig[tier] };
};

// Enhanced plan details extraction
const parsePlanDetails = (plan: PlanRecord) => {
  const details: { icon: typeof Wifi; label: string; value: string; highlight?: boolean }[] = [];
  const planLower = (plan.plan + ' ' + (plan.transferBenefits || '')).toLowerCase();
  const service = plan.service.toLowerCase();
  
  // Internet speed detection - more comprehensive
  if (service.includes('אינטרנט') || service.includes('טריפל')) {
    if (planLower.includes('1 גיגה') || planLower.includes('1000') || planLower.includes('1gbps')) {
      details.push({ icon: Wifi, label: 'מהירות', value: '1Gbps', highlight: true });
    } else if (planLower.includes('500')) {
      details.push({ icon: Wifi, label: 'מהירות', value: '500Mbps', highlight: true });
    } else if (planLower.includes('200')) {
      details.push({ icon: Wifi, label: 'מהירות', value: '200Mbps' });
    } else if (planLower.includes('100')) {
      details.push({ icon: Wifi, label: 'מהירות', value: '100Mbps' });
    } else if (planLower.includes('סיבים') || planLower.includes('fiber')) {
      details.push({ icon: Wifi, label: 'חיבור', value: 'סיבים אופטיים', highlight: true });
    }
  }
  
  // Cellular data detection - enhanced
  if (service.includes('סלולר') || service.includes('טריפל')) {
    if (planLower.includes('ללא הגבלה') || planLower.includes('אנלימיטד') || planLower.includes('unlimited')) {
      details.push({ icon: Database, label: 'גלישה', value: '∞ ללא הגבלה', highlight: true });
    } else if (planLower.includes('1000gb') || planLower.includes('1000 ג')) {
      details.push({ icon: Database, label: 'גלישה', value: '1000GB', highlight: true });
    } else if (planLower.includes('500gb') || planLower.includes('500 ג')) {
      details.push({ icon: Database, label: 'גלישה', value: '500GB', highlight: true });
    } else if (planLower.includes('400gb') || planLower.includes('400 ג')) {
      details.push({ icon: Database, label: 'גלישה', value: '400GB' });
    } else if (planLower.includes('300gb') || planLower.includes('300 ג')) {
      details.push({ icon: Database, label: 'גלישה', value: '300GB' });
    } else if (planLower.includes('200gb') || planLower.includes('200 ג')) {
      details.push({ icon: Database, label: 'גלישה', value: '200GB' });
    } else if (planLower.includes('150gb') || planLower.includes('150 ג')) {
      details.push({ icon: Database, label: 'גלישה', value: '150GB' });
    } else if (planLower.includes('100gb') || planLower.includes('100 ג')) {
      details.push({ icon: Database, label: 'גלישה', value: '100GB' });
    } else if (planLower.includes('50gb') || planLower.includes('50 ג')) {
      details.push({ icon: Database, label: 'גלישה', value: '50GB' });
    } else {
      const dataMatch = planLower.match(/(\d+)\s*(gb|ג'יגה|גיגה|ג\'יגה)/i);
      if (dataMatch) {
        details.push({ icon: Database, label: 'גלישה', value: `${dataMatch[1]}GB` });
      }
    }
  }
  
  // TV channels detection - enhanced
  if (service.includes('טלוויזיה') || service.includes('טריפל')) {
    const channelsMatch = planLower.match(/(\d+)\s*(ערוצ|channel)/i);
    if (channelsMatch) {
      const channels = parseInt(channelsMatch[1]);
      details.push({ 
        icon: Tv, 
        label: 'ערוצים', 
        value: `${channels} ערוצים`,
        highlight: channels > 100
      });
    } else if (planLower.includes('כל הערוצים')) {
      details.push({ icon: Tv, label: 'ערוצים', value: 'כל הערוצים', highlight: true });
    }
    
    // Streaming services
    const streaming: string[] = [];
    if (planLower.includes('netflix')) streaming.push('Netflix');
    if (planLower.includes('hbo')) streaming.push('HBO');
    if (planLower.includes('disney')) streaming.push('Disney+');
    if (streaming.length > 0) {
      details.push({ icon: Monitor, label: 'סטרימינג', value: streaming.join('+'), highlight: true });
    }
    
    // 4K
    if (planLower.includes('4k')) {
      details.push({ icon: Monitor, label: 'איכות', value: '4K Ultra HD', highlight: true });
    }
  }
  
  // Triple bundle - cellular lines
  if (service.includes('טריפל')) {
    const linesMatch = planLower.match(/(\d+)\s*(קו|line|מכשיר)/i);
    if (linesMatch) {
      details.push({ icon: Users, label: 'קווי סלולר', value: `${linesMatch[1]} קווים` });
    }
  }
  
  // 5G support
  if (planLower.includes('5g')) {
    details.push({ icon: Signal, label: 'רשת', value: 'דור 5 (5G)', highlight: true });
  }
  
  return details;
};

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

  const getCardStyle = (index: number, isMobile: boolean) => {
    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);
    
    // Mobile-friendly spacing
    const xMultiplier = isMobile ? 140 : 280;
    const xMultiplier2 = isMobile ? 100 : 220;
    const xMultiplier3 = isMobile ? 80 : 180;
    
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
        x: diff * xMultiplier,
        scale: isMobile ? 0.75 : 0.85,
        zIndex: 20,
        opacity: isMobile ? 0.5 : 0.7,
        rotateY: diff * -15,
      };
    } else if (absDiff === 2) {
      return {
        x: diff * xMultiplier2,
        scale: isMobile ? 0.6 : 0.7,
        zIndex: 10,
        opacity: isMobile ? 0.2 : 0.4,
        rotateY: diff * -20,
      };
    } else {
      return {
        x: diff * xMultiplier3,
        scale: isMobile ? 0.5 : 0.6,
        zIndex: 0,
        opacity: 0,
        rotateY: diff * -25,
      };
    }
  };

  const recommendedCount = plans.filter(p => 
    currentMonthlyBill > 0 && p.monthlyPrice && p.monthlyPrice < currentMonthlyBill
  ).length;

  // Detect mobile
  const [isMobile, setIsMobile] = useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get company color theme based on company name
  const getCompanyTheme = (companyName: string) => {
    const themes = [
      { 
        headerBg: 'bg-gradient-to-l from-slate-800 via-slate-700 to-slate-600',
        accent: 'bg-blue-500',
        accentLight: 'bg-blue-50',
        accentText: 'text-blue-600',
        border: 'border-blue-200',
        cardBg: 'bg-gradient-to-br from-blue-50/50 to-white',
        priceBg: 'bg-blue-50',
        dot: 'bg-blue-500'
      },
      { 
        headerBg: 'bg-gradient-to-l from-violet-800 via-purple-700 to-violet-600',
        accent: 'bg-purple-500',
        accentLight: 'bg-purple-50',
        accentText: 'text-purple-600',
        border: 'border-purple-200',
        cardBg: 'bg-gradient-to-br from-purple-50/50 to-white',
        priceBg: 'bg-purple-50',
        dot: 'bg-purple-500'
      },
      { 
        headerBg: 'bg-gradient-to-l from-teal-800 via-teal-700 to-emerald-600',
        accent: 'bg-teal-500',
        accentLight: 'bg-teal-50',
        accentText: 'text-teal-600',
        border: 'border-teal-200',
        cardBg: 'bg-gradient-to-br from-teal-50/50 to-white',
        priceBg: 'bg-teal-50',
        dot: 'bg-teal-500'
      },
      { 
        headerBg: 'bg-gradient-to-l from-amber-800 via-orange-700 to-amber-600',
        accent: 'bg-orange-500',
        accentLight: 'bg-orange-50',
        accentText: 'text-orange-600',
        border: 'border-orange-200',
        cardBg: 'bg-gradient-to-br from-orange-50/50 to-white',
        priceBg: 'bg-orange-50',
        dot: 'bg-orange-500'
      },
      { 
        headerBg: 'bg-gradient-to-l from-rose-800 via-pink-700 to-rose-600',
        accent: 'bg-rose-500',
        accentLight: 'bg-rose-50',
        accentText: 'text-rose-600',
        border: 'border-rose-200',
        cardBg: 'bg-gradient-to-br from-rose-50/50 to-white',
        priceBg: 'bg-rose-50',
        dot: 'bg-rose-500'
      },
      { 
        headerBg: 'bg-gradient-to-l from-cyan-800 via-sky-700 to-cyan-600',
        accent: 'bg-cyan-500',
        accentLight: 'bg-cyan-50',
        accentText: 'text-cyan-600',
        border: 'border-cyan-200',
        cardBg: 'bg-gradient-to-br from-cyan-50/50 to-white',
        priceBg: 'bg-cyan-50',
        dot: 'bg-cyan-500'
      },
      { 
        headerBg: 'bg-gradient-to-l from-indigo-800 via-indigo-700 to-blue-600',
        accent: 'bg-indigo-500',
        accentLight: 'bg-indigo-50',
        accentText: 'text-indigo-600',
        border: 'border-indigo-200',
        cardBg: 'bg-gradient-to-br from-indigo-50/50 to-white',
        priceBg: 'bg-indigo-50',
        dot: 'bg-indigo-500'
      },
    ];
    const hash = companyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return themes[hash % themes.length];
  };

  const theme = getCompanyTheme(company);

  return (
    <div className="mb-12 md:mb-20 last:mb-0">
      {/* Company Header - Clean professional design */}
      <div className="mx-3 md:mx-6 mb-6 md:mb-8">
        <div className="flex items-center gap-4 md:gap-5 p-4 md:p-5 rounded-xl bg-card border border-border shadow-sm">
          {/* Logo */}
          <div className={cn(
            "w-14 h-14 md:w-16 md:h-16 rounded-xl flex-shrink-0",
            "flex items-center justify-center p-2.5 md:p-3",
            "bg-gradient-to-br",
            theme.headerBg,
            "shadow-md"
          )}>
            {logo ? (
              <img src={logo} alt={company} className="max-w-full max-h-full object-contain brightness-0 invert" />
            ) : (
              <Building2 className="w-7 h-7 md:w-8 md:h-8 text-white" />
            )}
          </div>

          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-1 truncate">
              {company}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                theme.accentLight,
                theme.accentText
              )}>
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

      {/* 3D Carousel Container - Mobile optimized */}
      <div className="relative h-[420px] md:h-[540px] flex items-center justify-center" style={{ perspective: '1200px' }}>
        {/* Navigation Buttons - Mobile adjusted */}
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
              const savings = currentMonthlyBill > 0 && plan.monthlyPrice && plan.monthlyPrice < currentMonthlyBill
                ? currentMonthlyBill - plan.monthlyPrice
                : 0;
              const isRecommended = savings > 0;
              const isCenter = index === activeIndex;
              const features = parseFeatures(plan);
              const planDetails = parsePlanDetails(plan);
              const ServiceIcon = getServiceIcon(plan.service);

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
                      "w-[280px] md:w-[320px] rounded-2xl overflow-hidden transition-all duration-300",
                      isCenter 
                        ? `shadow-2xl border-2 ${theme.border}` 
                        : "shadow-lg border border-border/50",
                      isCenter ? theme.cardBg : "bg-card",
                      isRecommended && isCenter && "ring-2 ring-emerald-500/50"
                    )}
                  >
                    {/* Top accent bar */}
                    <div className={cn("h-1.5", theme.accent)} />
                    
                    {/* Savings Badge */}
                    {isRecommended && (
                      <div className="bg-emerald-600 text-white py-1.5 md:py-2 px-3 md:px-4">
                        <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-semibold">
                          <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span>חיסכון ₪{savings.toFixed(0)}/חודש</span>
                        </div>
                      </div>
                    )}

                    <div className="p-3 md:p-4">
                      {/* Tier Badge with Info - explains price differences */}
                      {(() => {
                        const tierInfo = getPlanTier(plan);
                        const TierIcon = tierInfo.icon;
                        return (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center justify-between mb-2">
                                  <span className={cn(
                                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-semibold",
                                    tierInfo.bgColor,
                                    tierInfo.color
                                  )}>
                                    <TierIcon className="w-3 h-3" />
                                    {tierInfo.label}
                                    <Info className="w-2.5 h-2.5 opacity-60" />
                                  </span>
                                  <span className={cn(
                                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-medium",
                                    theme.accentLight,
                                    theme.accentText
                                  )}>
                                    <ServiceIcon className="w-2.5 h-2.5" />
                                    {plan.service}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-[200px] text-center">
                                <p className="text-xs font-medium mb-1">למה המחיר הזה?</p>
                                <p className="text-[10px] text-muted-foreground">{tierInfo.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })()}

                      {/* Plan Name */}
                      <h3 className="text-sm md:text-base font-bold text-foreground mb-2 line-clamp-2 min-h-[36px] md:min-h-[40px]">
                        {plan.plan}
                      </h3>

                      {/* Plan Details Grid - Enhanced with highlights */}
                      {planDetails.length > 0 && (
                        <div className={cn(
                          "grid gap-1.5 mb-3 p-2.5 rounded-xl border",
                          isCenter ? "bg-gradient-to-br from-muted/60 to-muted/30 border-border" : "bg-muted/30 border-transparent",
                          planDetails.length > 2 ? "grid-cols-2" : "grid-cols-1"
                        )}>
                          {planDetails.slice(0, isCenter ? 6 : 2).map((detail, idx) => {
                            const DetailIcon = detail.icon;
                            return (
                              <div key={idx} className={cn(
                                "flex items-center gap-1.5 p-1 rounded-md transition-colors",
                                detail.highlight && "bg-primary/5"
                              )}>
                                <div className={cn(
                                  "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0",
                                  detail.highlight ? theme.accent + " text-white" : theme.accentLight
                                )}>
                                  <DetailIcon className={cn(
                                    "w-3.5 h-3.5",
                                    detail.highlight ? "text-white" : theme.accentText
                                  )} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[8px] text-muted-foreground leading-tight uppercase tracking-wide">{detail.label}</span>
                                  <span className={cn(
                                    "text-[11px] md:text-xs font-bold truncate",
                                    detail.highlight ? "text-foreground" : "text-foreground/80"
                                  )}>{detail.value}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Price - with company color */}
                      <div className={cn(
                        "rounded-xl p-2.5 md:p-3 mb-2.5 text-center relative overflow-hidden",
                        theme.priceBg
                      )}>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className={cn("text-xl md:text-2xl font-bold", theme.accentText)}>
                            {plan.monthlyPrice}
                          </span>
                          <span className="text-sm md:text-base text-muted-foreground">₪/חודש</span>
                        </div>
                        {plan.yearlyPrice && (
                          <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                            ₪{plan.yearlyPrice.toLocaleString()} לשנה
                          </div>
                        )}
                      </div>

                      {/* Features - Only show when center - Mobile optimized */}
                      {isCenter && features.length > 0 && (
                        <div className="space-y-1 mb-2.5">
                          {features.slice(0, isMobile ? 2 : 3).map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-1.5">
                              <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <span className="text-[11px] md:text-xs text-foreground/80 line-clamp-1">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Commitment & SLA row */}
                      {isCenter && (plan.commitment || plan.sla) && (
                        <div className="flex flex-wrap items-center gap-2 mb-2.5 text-[10px] md:text-xs text-muted-foreground">
                          {plan.commitment && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{plan.commitment}</span>
                            </div>
                          )}
                          {plan.sla && (
                            <div className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              <span>שירות: {plan.sla}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* CTA Button - Mobile optimized */}
                      {isCenter && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPlan(plan);
                          }}
                          className={cn(
                            "w-full h-9 md:h-10 font-semibold rounded-xl transition-all text-xs md:text-sm touch-manipulation",
                            isRecommended
                              ? "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white"
                              : "bg-foreground hover:bg-foreground/90 active:bg-foreground/80 text-background"
                          )}
                        >
                          בחירת מסלול
                          <ArrowLeft className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
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

      {/* Dots Indicator - with company color */}
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
