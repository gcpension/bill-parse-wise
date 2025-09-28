import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, Save, CheckCircle } from 'lucide-react';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Import steps
import GeneralChoicesStep from './steps/GeneralChoicesStep';
import BasicDataStep from './steps/BasicDataStep';
import DeclarationsStep from './steps/DeclarationsStep';
import SectorSpecificStep from './steps/SectorSpecificStep';
import ProviderSpecificStep from './steps/ProviderSpecificStep';

const STORAGE_KEY = 'service_request_draft';

const steps = [
  { title: 'בחירות כלליות', component: GeneralChoicesStep },
  { title: 'נתונים בסיסיים', component: BasicDataStep },
  { title: 'הצהרות', component: DeclarationsStep },
  { title: 'פרטים ספציפיים לספק', component: ProviderSpecificStep },
  { title: 'פרטים ייעודיים', component: SectorSpecificStep },
];

export default function ServiceRequestWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<ServiceRequestFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load draft and selected plan from localStorage on mount
  useEffect(() => {
    // Load selected plan data
    const selectedPlan = localStorage.getItem('selectedPlanForSwitch');
    if (selectedPlan) {
      try {
        const planData = JSON.parse(selectedPlan);
        
        // Auto-detect action type and target provider
        const detectedSector = planData.category === 'mobile' ? 'cellular' : planData.category;
        const detectedProvider = planData.company;
        
        setFormData(prev => ({
          ...prev,
          action_type: 'switch', // Auto-detected as switch when coming from plan selection
          sector: detectedSector,
          target_provider: detectedProvider,
          // Auto-fill additional context from selected plan
          selected_plan_name: planData.planName,
          selected_plan_price: planData.price,
          selected_plan_features: planData.features
        }));
        
        toast({
          title: 'מסלול זוהה אוטומטית',
          description: `מעבר ל${planData.planName} מ${planData.company} בסקטור ${detectedSector === 'cellular' ? 'סלולר' : detectedSector}`,
        });
        
        // Clear the stored plan data after loading
        localStorage.removeItem('selectedPlanForSwitch');
      } catch (error) {
        console.error('Error loading selected plan:', error);
      }
    }

    // Load saved draft
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(prev => ({ ...prev, ...parsed.formData }));
        setCurrentStep(parsed.currentStep || 0);
        toast({
          title: 'טיוטה נטענה',
          description: 'המידע השמור שלך נטען בהצלחה',
        });
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [toast]);

  // Save draft to localStorage
  const saveDraft = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        formData,
        currentStep,
        timestamp: new Date().toISOString()
      }));
      toast({
        title: 'טיוטה נשמרה',
        description: 'המידע נשמר בהצלחה',
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: 'שגיאה בשמירה',
        description: 'לא ניתן לשמור את הטיוטה',
        variant: 'destructive',
      });
    }
  };

  const updateFormData = (data: Partial<ServiceRequestFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      saveDraft();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    console.log('Checking canProceed for step:', currentStep, 'formData:', formData);
    
    // Enhanced validation based on current step
    switch (currentStep) {
      case 0: // General Choices
        // Basic requirements
        const hasBasicChoices = !!(formData.action_type && formData.sector && formData.customer_type);
        console.log('Step 0 - hasBasicChoices:', hasBasicChoices);
        
        if (!hasBasicChoices) {
          return false;
        }
        
        // Business customer additional validation
        if (formData.customer_type === 'business') {
          const hasBusinessDetails = !!(formData.company_name && formData.corp_registration_number && 
                   formData.signer_name && formData.signer_title);
          console.log('Step 0 - Business hasBusinessDetails:', hasBusinessDetails);
          return hasBusinessDetails;
        }
        return true;
        
      case 1: // Basic Data
        const basicRequired = !!(formData.full_name && formData.national_id_or_corp && 
                             formData.email && formData.phone && formData.current_provider &&
                             formData.service_address?.street && formData.service_address?.number && 
                             formData.service_address?.city && formData.preferred_language);
        console.log('Step 1 - basicRequired:', basicRequired);
        
        // Additional validation for switch action
        if (formData.action_type === 'switch') {
          const hasTargetProvider = !!formData.target_provider;
          console.log('Step 1 - Switch action hasTargetProvider:', hasTargetProvider);
          return basicRequired && hasTargetProvider;
        }
        return basicRequired;
        
      case 2: // Declarations
        const hasDeclarations = !!(formData.poa && formData.privacy_tos && formData.fees_ack && formData.esign_ok);
        console.log('Step 2 - hasDeclarations:', hasDeclarations);
        return hasDeclarations;
        
      case 3: // Provider Specific
      case 4: // Sector Specific
        console.log('Step 3/4 - Always true');
        return true; // These steps are informational/optional
        
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Enhanced submission with better error handling
      console.log('Submitting form data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'הבקשה נשלחה בהצלחה! 🎉',
        description: 'תקבל SMS עם קישור לחתימה דיגיטלית ועדכונים על הסטטוס',
      });
      
      // Clear the draft
      localStorage.removeItem(STORAGE_KEY);
      
      // Show completion message and keep form data for reference
      setCurrentStep(steps.length); // Go to completion step
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'שגיאה בשליחת הבקשה',
        description: 'אנא בדוק את החיבור לאינטרנט ונסה שוב',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const StepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-primary-glow/5 to-accent/5 p-4 animate-fade-in" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Header with Auto-Detection Info */}
        <div className="text-center mb-8">
          <div className="glass-card rounded-3xl p-8 shadow-elegant border border-primary/10 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow animate-gradient-x"></div>
            </div>
            <div className="relative z-10">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent font-heebo mb-4 animate-shimmer-text">
                בקשת שירות חכמה
              </h1>
              <p className="text-lg text-muted-foreground font-assistant mb-6">
                מערכת מתקדמת למעבר ספקים ומתן שירותים
              </p>
              {formData.selected_plan_name && (
                <div className="mt-6 p-6 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-2xl border border-primary/20 animate-scale-in hover-scale">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-success rounded-full animate-pulse-glow"></div>
                    <p className="text-lg font-semibold text-primary font-assistant">
                      מסלול זוהה אוטומטית: {formData.selected_plan_name}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-6 text-sm text-primary/80">
                    <span>חברה: {formData.target_provider}</span>
                    <span>•</span>
                    <span>סקטור: {formData.sector === 'cellular' ? 'סלולר' : formData.sector}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Card className="shadow-elegant border-0 glass-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary via-primary-glow to-primary text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-glow/90"></div>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]"></div>
            </div>
            <div className="relative z-10">
              <CardTitle className="text-3xl font-bold text-center font-heebo mb-6">
                {formData.action_type === 'switch' ? '🔄 מעבר ספק' : '📋 בקשת שירות'}
              </CardTitle>
              
              {/* Enhanced Progress Bar */}
              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 animate-pulse-glow">
                      <span className="text-lg font-bold">{currentStep + 1}</span>
                    </div>
                    <span className="text-lg font-assistant">שלב {currentStep + 1} מתוך {steps.length}</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                    <span className="text-lg font-bold">{Math.round(progress)}%</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full h-4 bg-white/20 rounded-full backdrop-blur-sm border border-white/30"></div>
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-white/80 to-white/60 rounded-full transition-all duration-500 ease-out shadow-glow" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30 inline-block">
                    <p className="text-lg font-semibold font-heebo">{steps[currentStep].title}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-10">
            {currentStep >= steps.length ? (
              // Completion Step
              <div className="text-center space-y-8 py-12">
                <div className="w-24 h-24 bg-gradient-to-r from-success to-success-glow rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-gentle shadow-elegant">
                  <CheckCircle className="w-14 h-14 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-success to-success-glow bg-clip-text text-transparent font-heebo">
                  🎉 הבקשה נשלחה בהצלחה!
                </h2>
                <div className="max-w-lg mx-auto space-y-6">
                  <div className="p-4 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-xl border border-primary/20">
                    <p className="text-xl text-primary font-assistant">
                      מספר בקשה: <span className="font-bold font-heebo">SR-{Date.now()}</span>
                    </p>
                  </div>
                  <div className="glass-card border border-primary/20 rounded-2xl p-6">
                    <h3 className="font-bold text-primary font-heebo mb-4 text-lg">🚀 מה קורה הלאה?</h3>
                    <ul className="text-primary/80 font-assistant space-y-3 text-right">
                      <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                        <span className="text-2xl">📱</span>
                        <span>תקבל SMS עם קישור לחתימה דיגיטלית</span>
                      </li>
                      <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                        <span className="text-2xl">📧</span>
                        <span>אישור בדוא״ל עם פרטי הבקשה</span>
                      </li>
                      <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                        <span className="text-2xl">📞</span>
                        <span>נחזור אליך תוך 24 שעות</span>
                      </li>
                      <li className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                        <span className="text-2xl">✅</span>
                        <span>עדכונים שוטפים על התקדמות</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={() => window.location.href = '/'} 
                      className="font-assistant bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-white px-8 py-3 rounded-xl shadow-lg hover-scale"
                    >
                      🏠 חזור לדף הבית
                    </Button>
                    <Button 
                      onClick={() => {setCurrentStep(0); setFormData({});}} 
                      variant="outline"
                      className="font-assistant border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-xl hover-scale"
                    >
                      ➕ בקשה חדשה
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="mb-8 p-4 bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-xl border border-primary/10">
                  <div className="flex items-center justify-center gap-3 text-primary">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="font-assistant text-sm">מידע זה יישמר אוטומטית</span>
                  </div>
                </div>
                <StepComponent
                  formData={formData}
                  updateFormData={updateFormData}
                />
              </div>
            )}

            {/* Enhanced Navigation */}
            {currentStep < steps.length && (
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-primary/10">
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={saveDraft}
                    className="font-assistant hover-scale bg-white/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 px-6 py-3 rounded-xl"
                  >
                    <Save className="w-5 h-5 ml-2" />
                    💾 שמור טיוטה
                  </Button>
                </div>

                <div className="flex gap-4">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="font-assistant hover-scale bg-white/50 backdrop-blur-sm border-muted-foreground/20 hover:bg-muted hover:border-muted-foreground/40 transition-all duration-300 px-8 py-3 rounded-xl"
                    >
                      <ChevronLeft className="w-5 h-5 ml-2" />
                      ⬅️ הקודם
                    </Button>
                  )}

                  {currentStep < steps.length - 1 ? (
                    <Button
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className={cn(
                        "font-assistant hover-scale transition-all duration-300 px-8 py-3 rounded-xl",
                        canProceed() 
                          ? "bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 shadow-lg text-white" 
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      ➡️ הבא
                      <ChevronRight className="w-5 h-5 mr-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canProceed() || isLoading}
                      className={cn(
                        "font-assistant hover-scale transition-all duration-300 px-8 py-3 rounded-xl",
                        canProceed() && !isLoading
                          ? "bg-gradient-to-r from-success to-success-glow hover:from-success/90 hover:to-success-glow/90 shadow-lg text-white" 
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                          ⏳ שולח...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 ml-2" />
                          🚀 שלח בקשה
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}