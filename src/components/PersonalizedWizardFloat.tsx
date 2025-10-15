import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, ChevronDown, ChevronUp, Smartphone, Wifi, Zap, Tv, Users, DollarSign, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface WizardData {
  service?: 'cellular' | 'internet' | 'electricity' | 'tv';
  lines?: number;
  budget?: number;
}

export const PersonalizedWizardFloat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [step, setStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({});
  const navigate = useNavigate();

  const handleServiceSelect = (service: WizardData['service']) => {
    setWizardData({ ...wizardData, service });
    setStep(2);
  };

  const handleLinesSelect = (lines: number) => {
    setWizardData({ ...wizardData, lines });
    setStep(3);
  };

  const handleBudgetSelect = (budget: number) => {
    setWizardData({ ...wizardData, budget });
    // Navigate to results with filters
    navigate(`/all-plans?service=${wizardData.service}&budget=${budget}`);
    setIsOpen(false);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const services = [
    { id: 'cellular' as const, icon: Smartphone, label: 'סלולר', color: 'from-blue-50 to-blue-100' },
    { id: 'internet' as const, icon: Wifi, label: 'אינטרנט', color: 'from-purple-50 to-purple-100' },
    { id: 'electricity' as const, icon: Zap, label: 'חשמל', color: 'from-yellow-50 to-yellow-100' },
    { id: 'tv' as const, icon: Tv, label: 'טלוויזיה', color: 'from-green-50 to-green-100' },
  ];

  const linesOptions = [1, 2, 3, 4, 5, 6];
  const budgetOptions = [50, 100, 150, 200, 300, 500];

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
                      {/* Progress Indicator */}
                      <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3].map((s) => (
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

                      {/* Step 2: Lines Selection */}
                      {step === 2 && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-bold text-center mb-4 font-['Rubik']">
                            כמה קווים יש לכם?
                          </h3>
                          <div className="grid grid-cols-3 gap-3">
                            {linesOptions.map((lines) => (
                              <button
                                key={lines}
                                onClick={() => handleLinesSelect(lines)}
                                className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-all duration-200 hover:scale-105 bg-white"
                              >
                                <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                                <div className="text-2xl font-bold text-gray-800 font-['Rubik']">
                                  {lines}
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

                      <div className="mt-4 text-xs text-gray-500 text-center font-['Rubik']">
                        מופעל על ידי AI • מענה מיידי
                      </div>
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
