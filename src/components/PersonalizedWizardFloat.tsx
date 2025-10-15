import { useState, useMemo } from 'react';
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

  // Generate recommendations when we have all data
  const recommendations = useMemo(() => {
    if (!wizardData.service || !wizardData.familySize || !wizardData.budget) {
      return [];
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

    const categoryMap: Record<string, 'electricity' | 'internet' | 'mobile' | 'tv'> = {
      'cellular': 'mobile',
      'internet': 'internet',
      'electricity': 'electricity',
      'tv': 'tv',
    };

    const category = categoryMap[wizardData.service];
    const filteredPlans = manualPlans.filter(plan => plan.category === category);
    
    const recs = PersonalizedRecommendationEngine.generatePersonalizedRecommendations(
      filteredPlans,
      userProfile,
      category
    );

    return recs.slice(0, 5); // Top 5 recommendations
  }, [wizardData]);

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
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="group relative h-16 px-8 rounded-full bg-gradient-to-r from-primary via-purple-600 to-primary hover:from-primary/90 hover:via-purple-700 hover:to-primary/90 text-white shadow-2xl hover:shadow-primary/50 transition-all duration-500 font-['Rubik'] font-bold overflow-hidden"
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="ml-2 h-6 w-6 relative z-10" />
              </motion.div>
              
              <span className="relative z-10">אשף המלצות אישי</span>
              
              <Badge className="mr-2 bg-white/30 text-white border-0 backdrop-blur-sm relative z-10 shadow-lg">
                AI
              </Badge>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wizard Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50, x: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0, x: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50, x: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[440px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-2xl border-2 border-primary/30 overflow-hidden backdrop-blur-sm bg-background/95 hover:shadow-primary/20 transition-shadow duration-300">
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
                      <div className="font-bold text-white font-['Rubik'] text-lg">אשף ההמלצות</div>
                      <div className="text-xs text-white/90 font-['Rubik'] flex items-center gap-1">
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
                    <CardContent className="p-6 bg-gradient-to-b from-background to-muted/20">
                      {showResults ? (
                        // Results View
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4 }}
                          className="space-y-4"
                        >
                          <div className="text-center mb-6">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                            >
                              <div className="relative inline-block mb-3">
                                <CheckCircle2 className="w-16 h-16 mx-auto text-green-600" />
                                <motion.div
                                  className="absolute inset-0 rounded-full bg-green-500/20"
                                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                              </div>
                            </motion.div>
                            <h3 className="text-xl font-bold font-['Rubik'] bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                              מצאנו עבורכם {recommendations.length} מסלולים מתאימים!
                            </h3>
                            <p className="text-sm text-muted-foreground font-['Rubik']">
                              המסלולים מסודרים לפי התאמה אישית מבוססת AI
                            </p>
                          </div>

                          <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {recommendations.map((rec, idx) => {
                              const plan = manualPlans.find(p => p.id === rec.planId);
                              if (!plan) return null;

                              return (
                                <motion.div
                                  key={rec.planId}
                                  initial={{ opacity: 0, x: -50, rotateY: -15 }}
                                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                                  whileHover={{ scale: 1.02, y: -4 }}
                                  transition={{ 
                                    delay: idx * 0.1,
                                    type: "spring",
                                    stiffness: 200
                                  }}
                                  className={cn(
                                    "group relative p-5 rounded-xl border-2 transition-all cursor-pointer overflow-hidden",
                                    idx === 0 
                                      ? "border-primary bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10 shadow-lg shadow-primary/20" 
                                      : "border-border bg-card hover:border-primary/40 hover:shadow-md"
                                  )}
                                  onClick={() => {
                                    navigate(`/all-plans?plan=${plan.id}`);
                                    setIsOpen(false);
                                  }}
                                >
                                  {/* Shine effect on hover */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                  
                                  {idx === 0 && (
                                    <motion.div
                                      initial={{ scale: 0, rotate: -180 }}
                                      animate={{ scale: 1, rotate: 0 }}
                                      transition={{ delay: 0.5, type: "spring" }}
                                    >
                                      <Badge className="mb-3 bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg relative">
                                        <Sparkles className="w-3 h-3 ml-1" />
                                        ההמלצה הטובה ביותר
                                      </Badge>
                                    </motion.div>
                                  )}
                                  
                                  <div className="flex justify-between items-start mb-3 relative z-10">
                                    <div className="flex-1">
                                      <div className="font-bold text-foreground font-['Rubik'] text-lg mb-1">
                                        {plan.company}
                                      </div>
                                      <div className="text-sm text-muted-foreground font-['Rubik'] line-clamp-1">
                                        {plan.planName}
                                      </div>
                                    </div>
                                    <motion.div 
                                      className="text-left bg-gradient-to-br from-primary/10 to-purple-100 px-3 py-2 rounded-lg"
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-['Rubik']">
                                        ₪{plan.regularPrice}
                                      </div>
                                      <div className="text-xs text-muted-foreground font-['Rubik']">
                                        לחודש
                                      </div>
                                    </motion.div>
                                  </div>

                                  <div className="flex items-center gap-3 mb-3 relative z-10">
                                    <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden shadow-inner">
                                      <motion.div 
                                        className="bg-gradient-to-r from-primary to-purple-600 h-2.5 rounded-full shadow-sm"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${rec.personalizedScore}%` }}
                                        transition={{ duration: 1, delay: idx * 0.1 + 0.3, ease: "easeOut" }}
                                      />
                                    </div>
                                    <Badge variant="secondary" className="font-bold text-primary font-['Rubik'] shadow-sm">
                                      {Math.round(rec.personalizedScore)}%
                                    </Badge>
                                  </div>

                                  <div className="space-y-1.5 relative z-10">
                                    {rec.reasonsForRecommendation.slice(0, 2).map((reason, i) => (
                                      <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 + 0.5 + i * 0.1 }}
                                        className="flex items-start gap-2 text-xs text-muted-foreground font-['Rubik']"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                                        <span>{reason}</span>
                                      </motion.div>
                                    ))}
                                  </div>

                                  {rec.expectedSavings.monthly > 0 && (
                                    <motion.div 
                                      className="mt-3 pt-3 border-t border-border relative z-10"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: idx * 0.1 + 0.7 }}
                                    >
                                      <div className="flex items-center gap-2 text-sm font-bold text-green-600 font-['Rubik'] bg-green-50 px-3 py-2 rounded-lg">
                                        <TrendingUp className="w-4 h-4" />
                                        חיסכון: ₪{Math.round(rec.expectedSavings.monthly)} לחודש
                                      </div>
                                    </motion.div>
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button
                              onClick={handleBack}
                              variant="outline"
                              className="flex-1 font-['Rubik'] hover:bg-muted transition-colors"
                            >
                              <ArrowRight className="ml-2 h-4 w-4" />
                              חזרה
                            </Button>
                            <Button
                              onClick={() => {
                                navigate(`/all-plans?service=${wizardData.service}`);
                                setIsOpen(false);
                              }}
                              className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 font-['Rubik'] shadow-lg hover:shadow-primary/50 transition-all"
                            >
                              ראה את כל המסלולים
                              <ArrowLeft className="mr-2 h-4 w-4" />
                            </Button>
                          </div>
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
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-6"
                        >
                          <div className="text-center">
                            <h3 className="text-2xl font-bold mb-2 font-['Rubik'] bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                              באיזה שירות אתם מעוניינים?
                            </h3>
                            <p className="text-sm text-muted-foreground font-['Rubik']">
                              בחרו את הקטגוריה שברצונכם לחסוך בה
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                            {services.map((service, index) => (
                              <motion.button
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleServiceSelect(service.id)}
                                className={cn(
                                  "group relative p-6 rounded-2xl border-2 border-border transition-all duration-300 text-right overflow-hidden",
                                  service.bgColor,
                                  "hover:border-purple-400 hover:shadow-xl"
                                )}
                              >
                                {/* Gradient overlay on hover */}
                                <div className={cn(
                                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300",
                                  service.color
                                )} />
                                
                                <div className="relative flex items-center gap-4">
                                  {/* Icon container */}
                                  <div className={cn(
                                    "w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl",
                                    service.color
                                  )}>
                                    <service.icon className="w-8 h-8 text-white" />
                                  </div>
                                  
                                  {/* Text content */}
                                  <div className="flex-1 text-right">
                                    <div className="text-xl font-bold text-foreground font-['Rubik'] mb-1 group-hover:text-purple-700 transition-colors">
                                      {service.label}
                                    </div>
                                    <div className="text-sm text-muted-foreground font-['Rubik']">
                                      {service.description}
                                    </div>
                                  </div>
                                  
                                  {/* Arrow indicator */}
                                  <ArrowLeft className={cn(
                                    "w-6 h-6 transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-[-4px]",
                                    service.iconColor
                                  )} />
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
