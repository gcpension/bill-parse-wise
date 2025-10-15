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
    { id: 'cellular' as const, icon: Smartphone, label: 'סלולר', color: 'from-blue-50 to-blue-100' },
    { id: 'internet' as const, icon: Wifi, label: 'אינטרנט', color: 'from-purple-50 to-purple-100' },
    { id: 'electricity' as const, icon: Zap, label: 'חשמל', color: 'from-yellow-50 to-yellow-100' },
    { id: 'tv' as const, icon: Tv, label: 'טלוויזיה', color: 'from-green-50 to-green-100' },
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
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="h-16 px-6 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 font-['Rubik'] font-bold"
            >
              <Sparkles className="ml-2 h-6 w-6" />
              אשף המלצות אישי
              <Badge className="mr-2 bg-white/20 text-white border-0">AI</Badge>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wizard Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-2xl border-2 border-purple-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-white font-['Rubik']">אשף ההמלצות</div>
                      <div className="text-xs text-white/80 font-['Rubik']">מותאם אישית עבורכם</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="h-8 w-8 text-white hover:bg-white/20"
                    >
                      {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8 text-white hover:bg-white/20"
                    >
                      <X className="h-4 w-4" />
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
                    <CardContent className="p-6">
                      {showResults ? (
                        // Results View
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div className="text-center mb-4">
                            <CheckCircle2 className="w-12 h-12 mx-auto text-green-600 mb-2" />
                            <h3 className="text-lg font-bold font-['Rubik']">
                              מצאנו עבורכם {recommendations.length} מסלולים מתאימים!
                            </h3>
                            <p className="text-sm text-muted-foreground font-['Rubik']">
                              המסלולים מסודרים לפי התאמה אישית
                            </p>
                          </div>

                          <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {recommendations.map((rec, idx) => {
                              const plan = manualPlans.find(p => p.id === rec.planId);
                              if (!plan) return null;

                              return (
                                <motion.div
                                  key={rec.planId}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className={cn(
                                    "p-4 rounded-lg border-2 transition-all hover:shadow-lg cursor-pointer",
                                    idx === 0 ? "border-purple-400 bg-purple-50" : "border-gray-200 bg-white"
                                  )}
                                  onClick={() => {
                                    navigate(`/all-plans?plan=${plan.id}`);
                                    setIsOpen(false);
                                  }}
                                >
                                  {idx === 0 && (
                                    <Badge className="mb-2 bg-purple-600 text-white">
                                      ההמלצה הטובה ביותר
                                    </Badge>
                                  )}
                                  
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <div className="font-bold text-gray-900 font-['Rubik']">
                                        {plan.company}
                                      </div>
                                      <div className="text-sm text-gray-600 font-['Rubik']">
                                        {plan.planName}
                                      </div>
                                    </div>
                                    <div className="text-left">
                                      <div className="text-2xl font-bold text-purple-600 font-['Rubik']">
                                        ₪{plan.regularPrice}
                                      </div>
                                      <div className="text-xs text-gray-500 font-['Rubik']">
                                        לחודש
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${rec.personalizedScore}%` }}
                                      />
                                    </div>
                                    <div className="text-sm font-bold text-purple-600 font-['Rubik']">
                                      {Math.round(rec.personalizedScore)}%
                                    </div>
                                  </div>

                                  <div className="space-y-1">
                                    {rec.reasonsForRecommendation.slice(0, 2).map((reason, i) => (
                                      <div key={i} className="text-xs text-gray-600 font-['Rubik']">
                                        • {reason}
                                      </div>
                                    ))}
                                  </div>

                                  {rec.expectedSavings.monthly > 0 && (
                                    <div className="mt-2 text-sm font-bold text-green-600 font-['Rubik']">
                                      💰 חיסכון: ₪{Math.round(rec.expectedSavings.monthly)} לחודש
                                    </div>
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={handleBack}
                              variant="outline"
                              className="flex-1 font-['Rubik']"
                            >
                              <ArrowRight className="ml-2 h-4 w-4" />
                              חזרה
                            </Button>
                            <Button
                              onClick={() => {
                                navigate(`/all-plans?service=${wizardData.service}`);
                                setIsOpen(false);
                              }}
                              className="flex-1 bg-purple-600 hover:bg-purple-700 font-['Rubik']"
                            >
                              ראה את כל המסלולים
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <>
                          {/* Progress Indicator */}
                          <div className="flex justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5, 6].map((s) => (
                              <div
                                key={s}
                                className={cn(
                                  "h-2 rounded-full transition-all duration-300",
                                  s === step ? "w-8 bg-purple-600" : "w-2 bg-gray-300",
                                  s < step && "bg-purple-400"
                                )}
                              />
                            ))}
                          </div>

                      {/* Step 1: Service Selection */}
                      {step === 1 && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-bold text-center mb-4 font-['Rubik']">
                            באיזה שירות אתם מעוניינים?
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            {services.map((service) => (
                              <button
                                key={service.id}
                                onClick={() => handleServiceSelect(service.id)}
                                className={cn(
                                  "p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-all duration-200 hover:scale-105 bg-gradient-to-br",
                                  service.color
                                )}
                              >
                                <service.icon className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                                <div className="text-sm font-semibold text-gray-800 font-['Rubik']">
                                  {service.label}
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                          {/* Step 2: Family Size */}
                          {step === 2 && (
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-4"
                            >
                              <h3 className="text-lg font-bold text-center mb-4 font-['Rubik']">
                                כמה נפשות במשפחה?
                              </h3>
                              <div className="grid grid-cols-3 gap-3">
                                {familyOptions.map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => handleFamilySelect(size)}
                                    className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-all duration-200 hover:scale-105 bg-white"
                                  >
                                    <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                                    <div className="text-2xl font-bold text-gray-800 font-['Rubik']">
                                      {size}
                                    </div>
                                  </button>
                                ))}
                              </div>
                              <Button
                                onClick={handleBack}
                                variant="ghost"
                                className="w-full mt-4 font-['Rubik']"
                              >
                                <ArrowRight className="ml-2 h-4 w-4" />
                                חזרה
                              </Button>
                            </motion.div>
                          )}

                          {/* Step 3: Budget Selection */}
                          {step === 3 && (
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-4"
                            >
                              <h3 className="text-lg font-bold text-center mb-4 font-['Rubik']">
                                מה התקציב החודשי שלכם?
                              </h3>
                              <div className="grid grid-cols-2 gap-3">
                                {budgetOptions.map((budget) => (
                                  <button
                                    key={budget}
                                    onClick={() => handleBudgetSelect(budget)}
                                    className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-all duration-200 hover:scale-105 bg-white"
                                  >
                                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
                                    <div className="text-xl font-bold text-gray-800 font-['Rubik']">
                                      ₪{budget}
                                    </div>
                                  </button>
                                ))}
                              </div>
                              <Button
                                onClick={handleBack}
                                variant="ghost"
                                className="w-full mt-4 font-['Rubik']"
                              >
                                <ArrowRight className="ml-2 h-4 w-4" />
                                חזרה
                              </Button>
                            </motion.div>
                          )}

                          {/* Step 4: Home Type */}
                          {step === 4 && (
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-4"
                            >
                              <h3 className="text-lg font-bold text-center mb-4 font-['Rubik']">
                                איפה אתם גרים?
                              </h3>
                              <div className="grid grid-cols-2 gap-3">
                                {homeTypes.map((type) => (
                                  <button
                                    key={type.id}
                                    onClick={() => handleHomeTypeSelect(type.id)}
                                    className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-all duration-200 hover:scale-105 bg-white"
                                  >
                                    <type.icon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                    <div className="text-sm font-semibold text-gray-800 font-['Rubik']">
                                      {type.label}
                                    </div>
                                  </button>
                                ))}
                              </div>
                              <Button
                                onClick={handleBack}
                                variant="ghost"
                                className="w-full mt-4 font-['Rubik']"
                              >
                                <ArrowRight className="ml-2 h-4 w-4" />
                                חזרה
                              </Button>
                            </motion.div>
                          )}

                          {/* Step 5: Priorities */}
                          {step === 5 && (
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-4"
                            >
                              <h3 className="text-lg font-bold text-center mb-4 font-['Rubik']">
                                מה הכי חשוב לכם?
                              </h3>
                              <div className="grid grid-cols-2 gap-3">
                                <button
                                  onClick={() => handlePrioritiesSelect({ price: 5, speed: 2, reliability: 3, customerService: 2 })}
                                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-all duration-200 hover:scale-105 bg-white"
                                >
                                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                  <div className="text-sm font-semibold text-gray-800 font-['Rubik']">
                                    מחיר
                                  </div>
                                </button>
                                <button
                                  onClick={() => handlePrioritiesSelect({ price: 2, speed: 5, reliability: 3, customerService: 2 })}
                                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-all duration-200 hover:scale-105 bg-white"
                                >
                                  <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                                  <div className="text-sm font-semibold text-gray-800 font-['Rubik']">
                                    מהירות
                                  </div>
                                </button>
                                <button
                                  onClick={() => handlePrioritiesSelect({ price: 2, speed: 3, reliability: 5, customerService: 2 })}
                                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-all duration-200 hover:scale-105 bg-white"
                                >
                                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                                  <div className="text-sm font-semibold text-gray-800 font-['Rubik']">
                                    אמינות
                                  </div>
                                </button>
                                <button
                                  onClick={() => handlePrioritiesSelect({ price: 3, speed: 3, reliability: 3, customerService: 3 })}
                                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-all duration-200 hover:scale-105 bg-white"
                                >
                                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                  <div className="text-sm font-semibold text-gray-800 font-['Rubik']">
                                    איזון
                                  </div>
                                </button>
                              </div>
                              <Button
                                onClick={handleBack}
                                variant="ghost"
                                className="w-full mt-4 font-['Rubik']"
                              >
                                <ArrowRight className="ml-2 h-4 w-4" />
                                חזרה
                              </Button>
                            </motion.div>
                          )}

                          {/* Step 6: Usage Level */}
                          {step === 6 && (
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-4"
                            >
                              <h3 className="text-lg font-bold text-center mb-4 font-['Rubik']">
                                מהי רמת השימוש שלכם?
                              </h3>
                              <div className="grid grid-cols-2 gap-3">
                                {usageLevels.map((level) => (
                                  <button
                                    key={level.id}
                                    onClick={() => handleUsageLevelSelect(level.id)}
                                    className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-all duration-200 hover:scale-105 bg-white"
                                  >
                                    <div className="text-3xl mb-2">{level.emoji}</div>
                                    <div className="text-sm font-semibold text-gray-800 font-['Rubik']">
                                      {level.label}
                                    </div>
                                  </button>
                                ))}
                              </div>
                              <Button
                                onClick={handleBack}
                                variant="ghost"
                                className="w-full mt-4 font-['Rubik']"
                              >
                                <ArrowRight className="ml-2 h-4 w-4" />
                                חזרה
                              </Button>
                            </motion.div>
                          )}

                          <div className="mt-4 text-xs text-gray-500 text-center font-['Rubik']">
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
