import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, ChevronDown, ChevronUp, Smartphone, Wifi, Zap, Tv, Users, DollarSign, ArrowRight, ArrowLeft, Home, Building2, GraduationCap, Briefcase, TrendingUp, Gauge, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { manualPlans } from '@/data/manual-plans';
import { PersonalizedRecommendationEngine, type UserProfile } from '@/lib/personalizedRecommendations';

interface WizardData {
  service?: 'cellular' | 'internet' | 'electricity' | 'tv';
  familySize?: number;
  budget?: number;
  homeType?: 'apartment' | 'house' | 'student' | 'business';
  priorities?: {
    price: number;
    speed: number;
    reliability: number;
    customerService: number;
  };
  usageLevel?: 'light' | 'medium' | 'heavy' | 'extreme';
}

export const PersonalizedWizardFloat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [step, setStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Generate recommendations with advanced AI when we have all data
  const aiAnalysis = useMemo(() => {
    if (!wizardData.service || !wizardData.familySize || !wizardData.budget) {
      return null;
    }

    const userProfile: UserProfile = {
      familySize: wizardData.familySize,
      homeType: wizardData.homeType || 'apartment',
      monthlyBudget: wizardData.budget,
      currentMonthlySpend: wizardData.budget,
      currentProvider: '',
      priceFlexibility: 'flexible',
      usageLevel: wizardData.usageLevel || 'medium',
      usageHours: 'mixed',
      workFromHome: false,
      streamingHeavy: false,
      gamingHeavy: false,
      priorities: {
        price: wizardData.priorities?.price || 3,
        reliability: wizardData.priorities?.reliability || 3,
        speed: wizardData.priorities?.speed || 3,
        customerService: wizardData.priorities?.customerService || 3,
        flexibility: 3,
        features: 3,
        brandTrust: 3,
        innovation: 3,
      },
      contractFlexibility: 'doesnt_matter',
      technologyPreference: 'doesnt_matter',
      supportImportance: 'important',
    };

    const categoryMap: Record<string, string> = {
      'cellular': 'mobile',
      'internet': 'internet',
      'electricity': 'electricity',
      'tv': 'tv',
    };

    const category = categoryMap[wizardData.service] || wizardData.service;
    
    // Filter plans by category
    const filteredPlans = manualPlans.filter(plan => {
      const planCategory = plan.category;
      return planCategory === category || 
             (wizardData.service === 'cellular' && planCategory === 'mobile') ||
             (wizardData.service === 'internet' && planCategory === 'internet') ||
             (wizardData.service === 'electricity' && planCategory === 'electricity') ||
             (wizardData.service === 'tv' && planCategory === 'tv');
    });
    
    console.log(`📊 Wizard filtering: service=${wizardData.service}, category=${category}, found ${filteredPlans.length} plans`);
    
    // Use advanced AI analysis
    const analysis = PersonalizedRecommendationEngine.analyzeWithAdvancedAI(
      filteredPlans,
      userProfile,
      category
    );

    return {
      recommendations: analysis.recommendations.slice(0, 5),
      aiInsights: analysis.aiInsights,
      marketAnalysis: analysis.marketAnalysis,
      personalizedTips: analysis.personalizedTips
    };
  }, [wizardData]);

  const recommendations = aiAnalysis?.recommendations || [];

  const handleServiceSelect = (service: WizardData['service']) => {
    setWizardData({ ...wizardData, service });
    setStep(2);
  };

  const handleFamilySelect = (familySize: number) => {
    setWizardData({ ...wizardData, familySize });
    setStep(3);
  };

  const handleBudgetSelect = (budget: number) => {
    setWizardData({ ...wizardData, budget });
    setStep(4);
  };

  const handleHomeTypeSelect = (homeType: WizardData['homeType']) => {
    setWizardData({ ...wizardData, homeType });
    setStep(5);
  };

  const handlePrioritiesSelect = (priorities: WizardData['priorities']) => {
    setWizardData({ ...wizardData, priorities });
    setStep(6);
  };

  const handleUsageLevelSelect = (usageLevel: WizardData['usageLevel']) => {
    setWizardData({ ...wizardData, usageLevel });
    setShowResults(true);
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
      return;
    }
    if (step > 1) setStep(step - 1);
  };

  const handleReset = () => {
    setWizardData({});
    setStep(1);
    setShowResults(false);
  };

  const services = [
    { 
      id: 'cellular' as const, 
      icon: Smartphone, 
      label: 'סלולר', 
      description: 'מסלולי סלולר ונייד',
      color: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    { 
      id: 'internet' as const, 
      icon: Wifi, 
      label: 'אינטרנט', 
      description: 'חבילות אינטרנט ביתי',
      color: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100'
    },
    { 
      id: 'electricity' as const, 
      icon: Zap, 
      label: 'חשמל', 
      description: 'ספקי חשמל ותעריפים',
      color: 'from-amber-500 to-amber-600',
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50 hover:bg-amber-100'
    },
    { 
      id: 'tv' as const, 
      icon: Tv, 
      label: 'טלוויזיה', 
      description: 'חבילות טלוויזיה ושידורים',
      color: 'from-emerald-500 to-emerald-600',
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100'
    },
  ];

  const familyOptions = [1, 2, 3, 4, 5, 6];
  const budgetOptions = [50, 100, 150, 200, 300, 500];
  const homeTypes = [
    { id: 'apartment' as const, icon: Building2, label: 'דירה' },
    { id: 'house' as const, icon: Home, label: 'בית' },
    { id: 'student' as const, icon: GraduationCap, label: 'דירת סטודנט' },
    { id: 'business' as const, icon: Briefcase, label: 'עסק' },
  ];
  const usageLevels = [
    { id: 'light' as const, label: 'קל', emoji: '📱' },
    { id: 'medium' as const, label: 'בינוני', emoji: '💻' },
    { id: 'heavy' as const, label: 'כבד', emoji: '🎮' },
    { id: 'extreme' as const, label: 'אינטנסיבי', emoji: '🚀' },
  ];

  return (
    <>
      {/* Floating Button - Responsive Position */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -20 }}
            whileHover={{ scale: 1.05 }}
            className="fixed bottom-4 left-4 md:top-24 md:bottom-auto md:left-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="group relative h-12 md:h-14 px-4 md:px-6 rounded-2xl bg-gradient-to-r from-primary via-purple-600 to-primary hover:from-primary/90 hover:via-purple-700 hover:to-primary/90 text-white shadow-xl hover:shadow-primary/40 transition-all duration-500 font-heebo font-normal overflow-hidden border border-white/20 touch-manipulation"
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {/* Pulsing glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-primary/30 blur-xl"
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="ml-2 h-5 w-5 relative z-10" />
              </motion.div>
              
              <span className="relative z-10 text-xs md:text-sm hidden sm:inline">אשף ההמלצות החכם</span>
              <span className="relative z-10 text-xs sm:hidden">אשף AI</span>
              
              <Badge className="mr-2 bg-white/30 text-white border-0 backdrop-blur-sm relative z-10 shadow-lg text-[10px] px-2 py-0.5 hidden md:inline-flex">
                AI Pro
              </Badge>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wizard Window - Full screen on mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: -50, x: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0, x: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-4 md:inset-auto md:top-24 md:left-6 z-50 md:w-[440px] md:max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-2xl border-2 border-primary/30 overflow-hidden backdrop-blur-sm bg-background/95 hover:shadow-primary/20 transition-shadow duration-300 h-full md:h-auto flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary via-purple-600 to-primary p-5 relative overflow-hidden">
                {/* Animated background particles */}
                <div className="absolute inset-0 opacity-20">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full"
                      style={{ left: `${20 + i * 30}%`, top: '50%' }}
                      animate={{ 
                        y: [-10, 10, -10],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{ 
                        duration: 2 + i * 0.5, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sparkles className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <div className="font-normal text-white font-heebo text-lg">אשף ההמלצות</div>
                      <div className="text-xs text-white/90 font-heebo flex items-center gap-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-2 h-2 bg-green-400 rounded-full"
                        />
                        מותאם אישית עבורכם
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="h-9 w-9 text-white hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110"
                    >
                      <motion.div
                        animate={{ rotate: isMinimized ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {isMinimized ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </motion.div>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="h-9 w-9 text-white hover:bg-white/20 hover:bg-red-500/30 rounded-lg transition-all duration-200 hover:scale-110"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Wizard Content */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <CardContent className="p-4 md:p-6 bg-gradient-to-b from-background to-muted/20 flex-1 overflow-y-auto">
                      {showResults ? (
                        // Results View
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4 }}
                          className="space-y-4"
                        >
                          {/* Header */}
                          <div className="text-center mb-4">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                            >
                              <div className="relative inline-block mb-3">
                                <CheckCircle2 className="w-14 h-14 mx-auto text-green-600" />
                                <motion.div
                                  className="absolute inset-0 rounded-full bg-green-500/20"
                                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                              </div>
                            </motion.div>
                            <h3 className="text-lg font-normal font-heebo bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-1">
                              {recommendations.length > 0 
                                ? `מצאנו ${recommendations.length} מסלולים מתאימים!`
                                : 'לא נמצאו מסלולים מתאימים'
                              }
                            </h3>
                            <p className="text-xs text-muted-foreground font-heebo">
                              {services.find(s => s.id === wizardData.service)?.label} • {wizardData.familySize} נפשות • עד ₪{wizardData.budget}/חודש
                            </p>
                          </div>

                          {recommendations.length === 0 ? (
                            <div className="text-center py-8">
                              <div className="text-muted-foreground font-heebo mb-4">
                                לא נמצאו מסלולים התואמים את ההעדפות שלכם.
                              </div>
                              <Button onClick={handleReset} variant="outline">
                                נסו שוב עם העדפות אחרות
                              </Button>
                            </div>
                          ) : (
                            <>
                              {/* Market Analysis Summary */}
                              {aiAnalysis?.marketAnalysis && (
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                  <div className="bg-muted/50 rounded-lg p-2 text-center">
                                    <div className="text-sm font-bold text-foreground">₪{aiAnalysis.marketAnalysis.avgPrice}</div>
                                    <div className="text-[10px] text-muted-foreground">ממוצע</div>
                                  </div>
                                  <div className="bg-emerald-50 rounded-lg p-2 text-center">
                                    <div className="text-sm font-bold text-emerald-600">₪{aiAnalysis.marketAnalysis.priceRange.min}</div>
                                    <div className="text-[10px] text-emerald-700">נמוך</div>
                                  </div>
                                  <div className="bg-purple-50 rounded-lg p-2 text-center">
                                    <div className="text-sm font-bold text-purple-600">₪{aiAnalysis.marketAnalysis.priceRange.max}</div>
                                    <div className="text-[10px] text-purple-700">גבוה</div>
                                  </div>
                                </div>
                              )}

                              {/* AI Insights */}
                              {aiAnalysis?.aiInsights && aiAnalysis.aiInsights.length > 0 && (
                                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3 mb-3 text-right">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="w-3 h-3 text-purple-600" />
                                    <span className="text-xs font-medium text-purple-700 font-heebo">תובנות AI</span>
                                  </div>
                                  <div className="text-[11px] text-purple-700 font-heebo font-light leading-relaxed">
                                    {aiAnalysis.aiInsights[0]}
                                  </div>
                                </div>
                              )}

                              {/* Plans List */}
                              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                                {recommendations.slice(0, 5).map((rec, idx) => {
                                  const plan = manualPlans.find(p => p.id === rec.planId);
                                  if (!plan) return null;

                                  const serviceIcon = wizardData.service === 'cellular' ? Smartphone :
                                                     wizardData.service === 'internet' ? Wifi :
                                                     wizardData.service === 'electricity' ? Zap : Tv;

                                  return (
                                    <motion.div
                                      key={rec.planId}
                                      initial={{ opacity: 0, x: -30 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      whileHover={{ scale: 1.01, y: -2 }}
                                      transition={{ delay: idx * 0.08, type: "spring", stiffness: 200 }}
                                      className={cn(
                                        "group relative p-4 rounded-xl border-2 transition-all cursor-pointer",
                                        idx === 0 
                                          ? "border-primary bg-gradient-to-br from-primary/5 to-purple-50 shadow-md" 
                                          : "border-border bg-card hover:border-primary/40"
                                      )}
                                      onClick={() => {
                                        navigate(`/all-plans?plan=${plan.id}`);
                                        setIsOpen(false);
                                      }}
                                    >
                                      {/* Best recommendation badge */}
                                      {idx === 0 && (
                                        <Badge className="absolute -top-2 right-3 bg-gradient-to-r from-primary to-purple-600 text-white text-[10px] px-2 py-0.5">
                                          <Sparkles className="w-2.5 h-2.5 ml-1" />
                                          מומלץ ביותר
                                        </Badge>
                                      )}
                                      
                                      {/* Header row */}
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                          <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center",
                                            idx === 0 ? "bg-primary/10" : "bg-muted"
                                          )}>
                                            {React.createElement(serviceIcon, { className: cn("w-4 h-4", idx === 0 ? "text-primary" : "text-muted-foreground") })}
                                          </div>
                                          <div>
                                            <div className="font-medium text-foreground font-heebo text-sm">
                                              {plan.company}
                                            </div>
                                            <div className="text-[11px] text-muted-foreground font-heebo line-clamp-1">
                                              {plan.planName}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="text-left">
                                          <div className="text-lg font-bold text-foreground font-heebo">
                                            ₪{plan.regularPrice}
                                          </div>
                                          <div className="text-[10px] text-muted-foreground">לחודש</div>
                                        </div>
                                      </div>

                                      {/* Plan details */}
                                      <div className="grid grid-cols-2 gap-2 mb-2 text-[10px]">
                                        {plan.speed && plan.speed !== 'לא רלוונטי' && (
                                          <div className="flex items-center gap-1 text-muted-foreground">
                                            <Gauge className="w-3 h-3" />
                                            <span>{plan.speed}</span>
                                          </div>
                                        )}
                                        {plan.downloadSpeed && (
                                          <div className="flex items-center gap-1 text-muted-foreground">
                                            <TrendingUp className="w-3 h-3" />
                                            <span>{plan.downloadSpeed}</span>
                                          </div>
                                        )}
                                        {plan.dataAmount && (
                                          <div className="flex items-center gap-1 text-muted-foreground">
                                            <Wifi className="w-3 h-3" />
                                            <span>{plan.dataAmount}</span>
                                          </div>
                                        )}
                                        {plan.introPrice > 0 && plan.introPrice < plan.regularPrice && (
                                          <div className="flex items-center gap-1 text-green-600">
                                            <DollarSign className="w-3 h-3" />
                                            <span>₪{plan.introPrice} ל-{plan.introMonths} חודשים</span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Features */}
                                      {plan.features.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-2">
                                          {plan.features.slice(0, 3).map((feature, i) => (
                                            <Badge key={i} variant="secondary" className="text-[9px] px-1.5 py-0 font-normal">
                                              {feature.length > 25 ? feature.substring(0, 25) + '...' : feature}
                                            </Badge>
                                          ))}
                                          {plan.features.length > 3 && (
                                            <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                                              +{plan.features.length - 3}
                                            </Badge>
                                          )}
                                        </div>
                                      )}

                                      {/* Match score and reasons */}
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                                          <motion.div 
                                            className="bg-gradient-to-r from-primary to-purple-600 h-1.5 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${rec.personalizedScore}%` }}
                                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                                          />
                                        </div>
                                        <span className="text-[10px] font-medium text-primary">{Math.round(rec.personalizedScore)}% התאמה</span>
                                      </div>

                                      {/* Top reason */}
                                      {rec.reasonsForRecommendation.length > 0 && (
                                        <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
                                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                                          <span className="line-clamp-1">{rec.reasonsForRecommendation[0]}</span>
                                        </div>
                                      )}

                                      {/* Savings indicator */}
                                      {rec.expectedSavings.monthly > 0 && (
                                        <div className="mt-2 flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded-md w-fit">
                                          <TrendingUp className="w-3 h-3" />
                                          חיסכון: ₪{Math.round(rec.expectedSavings.monthly)}/חודש
                                        </div>
                                      )}
                                    </motion.div>
                                  );
                                })}
                              </div>

                              {/* Personalized Tips */}
                              {aiAnalysis?.personalizedTips && aiAnalysis.personalizedTips.length > 0 && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                                  <div className="text-[11px] text-amber-800 font-heebo">
                                    💡 {aiAnalysis.personalizedTips[0]}
                                  </div>
                                </div>
                              )}

                              {/* Action buttons */}
                              <div className="flex gap-2 pt-3">
                                <Button
                                  onClick={handleReset}
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs"
                                >
                                  <ArrowRight className="ml-1 h-3 w-3" />
                                  התחל מחדש
                                </Button>
                                <Button
                                  onClick={() => {
                                    navigate(`/all-plans?service=${wizardData.service}`);
                                    setIsOpen(false);
                                  }}
                                  size="sm"
                                  className="flex-1 bg-gradient-to-r from-primary to-purple-600 text-xs"
                                >
                                  כל המסלולים
                                  <ArrowLeft className="mr-1 h-3 w-3" />
                                </Button>
                              </div>
                            </>
                          )}
                        </motion.div>
                      ) : (
                        <>
                          {/* Progress Indicator */}
                          <div className="flex justify-center gap-2 mb-8">
                            {[1, 2, 3, 4, 5, 6].map((s) => (
                              <motion.div
                                key={s}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: s * 0.05 }}
                                className="relative"
                              >
                                <div
                                  className={cn(
                                    "h-2.5 rounded-full transition-all duration-500 shadow-sm",
                                    s === step ? "w-12 bg-gradient-to-r from-primary to-purple-600" : "w-2.5",
                                    s < step ? "bg-primary/60" : "bg-muted",
                                  )}
                                />
                                {s === step && (
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-full"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                  />
                                )}
                              </motion.div>
                            ))}
                          </div>

                      {/* Step 1: Service Selection */}
                      {step === 1 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div className="text-center">
                            <motion.div
                              initial={{ y: -20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              <h3 className="text-2xl font-bold mb-2 font-['Rubik'] bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                                באיזה שירות תרצו לחסוך?
                              </h3>
                            </motion.div>
                            <motion.p
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="text-sm text-muted-foreground font-['Rubik']"
                            >
                              בחרו קטגוריה ונמצא לכם את המסלול המושלם
                            </motion.p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            {services.map((service, index) => (
                              <motion.button
                                key={service.id}
                                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                whileHover={{ scale: 1.05, y: -6 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ 
                                  delay: index * 0.1,
                                  type: "spring",
                                  stiffness: 200,
                                  damping: 15
                                }}
                                onClick={() => handleServiceSelect(service.id)}
                                className="group relative p-5 rounded-2xl border-2 border-border hover:border-primary transition-all duration-300 text-center overflow-hidden bg-card hover:shadow-xl"
                              >
                                {/* Animated gradient background */}
                                <div className={cn(
                                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-all duration-500",
                                  service.color.replace('to-', 'via-') + ' to-transparent'
                                )} 
                                style={{ 
                                  background: `linear-gradient(135deg, transparent 0%, ${
                                    service.id === 'cellular' ? 'rgba(59, 130, 246, 0.1)' :
                                    service.id === 'internet' ? 'rgba(168, 85, 247, 0.1)' :
                                    service.id === 'electricity' ? 'rgba(251, 191, 36, 0.1)' :
                                    'rgba(16, 185, 129, 0.1)'
                                  } 100%)`
                                }}
                                />
                                
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                
                                <div className="relative z-10 flex flex-col items-center gap-3">
                                  {/* Icon with glow effect */}
                                  <motion.div 
                                    className={cn(
                                      "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                                      service.color
                                    )}
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.6 }}
                                  >
                                    <service.icon className="w-7 h-7 text-white" />
                                  </motion.div>
                                  
                                  {/* Text */}
                                  <div>
                                    <div className="text-lg font-bold text-foreground font-['Rubik'] mb-0.5">
                                      {service.label}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-['Rubik'] leading-tight">
                                      {service.description}
                                    </div>
                                  </div>
                                  
                                  {/* Hover indicator */}
                                  <motion.div
                                    className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100"
                                    initial={{ y: 10 }}
                                    whileHover={{ y: 0 }}
                                  >
                                    <ArrowLeft className="w-5 h-5 text-primary" />
                                  </motion.div>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                          {/* Step 2: Family Size */}
                          {step === 2 && (
                            <motion.div
                              initial={{ opacity: 0, x: 50 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -50 }}
                              transition={{ type: "spring", stiffness: 200 }}
                              className="space-y-6"
                            >
                              <div className="text-center">
                                <h3 className="text-xl font-bold mb-2 font-['Rubik'] bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                  כמה נפשות במשפחה?
                                </h3>
                                <p className="text-sm text-muted-foreground font-['Rubik']">
                                  זה יעזור לנו להמליץ על מסלול מותאם
                                </p>
                              </div>
                              <div className="grid grid-cols-3 gap-3">
                                {familyOptions.map((size, idx) => (
                                  <motion.button
                                    key={size}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => handleFamilySelect(size)}
                                    className="group relative p-5 rounded-2xl border-2 border-border hover:border-primary transition-all duration-300 bg-card hover:shadow-lg overflow-hidden"
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <Users className="w-7 h-7 mx-auto mb-2 text-primary relative z-10 group-hover:scale-110 transition-transform" />
                                    <div className="text-3xl font-bold text-foreground font-['Rubik'] relative z-10">
                                      {size}
                                    </div>
                                  </motion.button>
                                ))}
                              </div>
                              <Button
                                onClick={handleBack}
                                variant="outline"
                                className="w-full mt-4 font-['Rubik'] hover:bg-muted"
                              >
                                <ArrowRight className="ml-2 h-4 w-4" />
                                חזרה
                              </Button>
                            </motion.div>
                          )}

                          {/* Step 3: Budget Selection */}
                          {step === 3 && (
                            <motion.div
                              initial={{ opacity: 0, x: 50 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -50 }}
                              transition={{ type: "spring", stiffness: 200 }}
                              className="space-y-6"
                            >
                              <div className="text-center">
                                <h3 className="text-xl font-bold mb-2 font-['Rubik'] bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                  מה התקציב החודשי שלכם?
                                </h3>
                                <p className="text-sm text-muted-foreground font-['Rubik']">
                                  נמצא לכם מסלולים בתחום המחיר המתאים
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                {budgetOptions.map((budget, idx) => (
                                  <motion.button
                                    key={budget}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => handleBudgetSelect(budget)}
                                    className="group relative p-5 rounded-2xl border-2 border-border hover:border-green-500 transition-all duration-300 bg-card hover:shadow-lg overflow-hidden"
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <DollarSign className="w-7 h-7 mx-auto mb-2 text-green-600 relative z-10 group-hover:scale-110 transition-transform" />
                                    <div className="text-2xl font-bold text-foreground font-['Rubik'] relative z-10">
                                      ₪{budget}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-['Rubik'] relative z-10 mt-1">
                                      לחודש
                                    </div>
                                  </motion.button>
                                ))}
                              </div>
                              <Button
                                onClick={handleBack}
                                variant="outline"
                                className="w-full mt-4 font-['Rubik'] hover:bg-muted"
                              >
                                <ArrowRight className="ml-2 h-4 w-4" />
                                חזרה
                              </Button>
                            </motion.div>
                          )}

                          {/* Step 4: Home Type */}
                          {step === 4 && (
                            <motion.div
                              initial={{ opacity: 0, x: 50 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -50 }}
                              transition={{ type: "spring", stiffness: 200 }}
                              className="space-y-6"
                            >
                              <div className="text-center">
                                <h3 className="text-xl font-bold mb-2 font-['Rubik'] bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                  איפה אתם גרים?
                                </h3>
                                <p className="text-sm text-muted-foreground font-['Rubik']">
                                  סוג הנכס משפיע על סוג השירות המתאים
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                {homeTypes.map((type, idx) => (
                                  <motion.button
                                    key={type.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05, y: -6 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ delay: idx * 0.08 }}
                                    onClick={() => handleHomeTypeSelect(type.id)}
                                    className="group relative p-6 rounded-2xl border-2 border-border hover:border-primary transition-all duration-300 bg-card hover:shadow-xl overflow-hidden"
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <type.icon className="w-10 h-10 mx-auto mb-3 text-primary relative z-10 group-hover:scale-110 transition-transform" />
                                    <div className="text-base font-bold text-foreground font-['Rubik'] relative z-10">
                                      {type.label}
                                    </div>
                                  </motion.button>
                                ))}
                              </div>
                              <Button
                                onClick={handleBack}
                                variant="outline"
                                className="w-full mt-4 font-['Rubik'] hover:bg-muted"
                              >
                                <ArrowRight className="ml-2 h-4 w-4" />
                                חזרה
                              </Button>
                            </motion.div>
                          )}

                          {/* Step 5: Priorities */}
                          {step === 5 && (
                            <motion.div
                              initial={{ opacity: 0, x: 50 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -50 }}
                              transition={{ type: "spring", stiffness: 200 }}
                              className="space-y-6"
                            >
                              <div className="text-center">
                                <h3 className="text-xl font-bold mb-2 font-['Rubik'] bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                  מה הכי חשוב לכם?
                                </h3>
                                <p className="text-sm text-muted-foreground font-['Rubik']">
                                  בחרו את העדיפות המרכזית שלכם
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <motion.button
                                  initial={{ opacity: 0, rotate: -10 }}
                                  animate={{ opacity: 1, rotate: 0 }}
                                  whileHover={{ scale: 1.05, y: -6 }}
                                  whileTap={{ scale: 0.95 }}
                                  transition={{ delay: 0 }}
                                  onClick={() => handlePrioritiesSelect({ price: 5, speed: 2, reliability: 3, customerService: 2 })}
                                  className="group relative p-6 rounded-2xl border-2 border-border hover:border-green-500 transition-all duration-300 bg-card hover:shadow-xl overflow-hidden"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  <DollarSign className="w-10 h-10 mx-auto mb-3 text-green-600 relative z-10 group-hover:scale-110 transition-transform" />
                                  <div className="text-base font-bold text-foreground font-['Rubik'] relative z-10">
                                    מחיר
                                  </div>
                                </motion.button>
                                <motion.button
                                  initial={{ opacity: 0, rotate: 10 }}
                                  animate={{ opacity: 1, rotate: 0 }}
                                  whileHover={{ scale: 1.05, y: -6 }}
                                  whileTap={{ scale: 0.95 }}
                                  transition={{ delay: 0.08 }}
                                  onClick={() => handlePrioritiesSelect({ price: 2, speed: 5, reliability: 3, customerService: 2 })}
                                  className="group relative p-6 rounded-2xl border-2 border-border hover:border-yellow-500 transition-all duration-300 bg-card hover:shadow-xl overflow-hidden"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-amber-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  <Zap className="w-10 h-10 mx-auto mb-3 text-yellow-600 relative z-10 group-hover:scale-110 transition-transform" />
                                  <div className="text-base font-bold text-foreground font-['Rubik'] relative z-10">
                                    מהירות
                                  </div>
                                </motion.button>
                                <motion.button
                                  initial={{ opacity: 0, rotate: -10 }}
                                  animate={{ opacity: 1, rotate: 0 }}
                                  whileHover={{ scale: 1.05, y: -6 }}
                                  whileTap={{ scale: 0.95 }}
                                  transition={{ delay: 0.16 }}
                                  onClick={() => handlePrioritiesSelect({ price: 2, speed: 3, reliability: 5, customerService: 2 })}
                                  className="group relative p-6 rounded-2xl border-2 border-border hover:border-blue-500 transition-all duration-300 bg-card hover:shadow-xl overflow-hidden"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-sky-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-blue-600 relative z-10 group-hover:scale-110 transition-transform" />
                                  <div className="text-base font-bold text-foreground font-['Rubik'] relative z-10">
                                    אמינות
                                  </div>
                                </motion.button>
                                <motion.button
                                  initial={{ opacity: 0, rotate: 10 }}
                                  animate={{ opacity: 1, rotate: 0 }}
                                  whileHover={{ scale: 1.05, y: -6 }}
                                  whileTap={{ scale: 0.95 }}
                                  transition={{ delay: 0.24 }}
                                  onClick={() => handlePrioritiesSelect({ price: 3, speed: 3, reliability: 3, customerService: 3 })}
                                  className="group relative p-6 rounded-2xl border-2 border-border hover:border-primary transition-all duration-300 bg-card hover:shadow-xl overflow-hidden"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  <TrendingUp className="w-10 h-10 mx-auto mb-3 text-primary relative z-10 group-hover:scale-110 transition-transform" />
                                  <div className="text-base font-bold text-foreground font-['Rubik'] relative z-10">
                                    איזון
                                  </div>
                                </motion.button>
                              </div>
                              <Button
                                onClick={handleBack}
                                variant="outline"
                                className="w-full mt-4 font-['Rubik'] hover:bg-muted"
                              >
                                <ArrowRight className="ml-2 h-4 w-4" />
                                חזרה
                              </Button>
                            </motion.div>
                          )}

                          {/* Step 6: Usage Level */}
                          {step === 6 && (
                            <motion.div
                              initial={{ opacity: 0, x: 50 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -50 }}
                              transition={{ type: "spring", stiffness: 200 }}
                              className="space-y-6"
                            >
                              <div className="text-center">
                                <h3 className="text-xl font-bold mb-2 font-['Rubik'] bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                  מהי רמת השימוש שלכם?
                                </h3>
                                <p className="text-sm text-muted-foreground font-['Rubik']">
                                  השאלה האחרונה! עוד רגע נראה תוצאות
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                {usageLevels.map((level, idx) => (
                                  <motion.button
                                    key={level.id}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => handleUsageLevelSelect(level.id)}
                                    className="group relative p-6 rounded-2xl border-2 border-border hover:border-primary transition-all duration-300 bg-card hover:shadow-xl overflow-hidden"
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <motion.div 
                                      className="text-4xl mb-3 relative z-10"
                                      whileHover={{ scale: 1.2, rotate: 10 }}
                                      transition={{ type: "spring", stiffness: 300 }}
                                    >
                                      {level.emoji}
                                    </motion.div>
                                    <div className="text-base font-bold text-foreground font-['Rubik'] relative z-10">
                                      {level.label}
                                    </div>
                                  </motion.button>
                                ))}
                              </div>
                              <Button
                                onClick={handleBack}
                                variant="outline"
                                className="w-full mt-4 font-['Rubik'] hover:bg-muted"
                              >
                                <ArrowRight className="ml-2 h-4 w-4" />
                                חזרה
                              </Button>
                            </motion.div>
                          )}

                          <div className="mt-6 text-xs text-muted-foreground text-center font-['Rubik'] flex items-center justify-center gap-2">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Sparkles className="w-3 h-3 text-primary" />
                            </motion.div>
                            מופעל על ידי AI • מענה מיידי
                          </div>
                        </>
                      )}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
