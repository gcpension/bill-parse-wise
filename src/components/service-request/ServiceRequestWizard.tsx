import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Save, CheckCircle } from 'lucide-react';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Import steps
import GeneralChoicesStep from './steps/GeneralChoicesStep';
import BasicDataStep from './steps/BasicDataStep';
import DeclarationsStep from './steps/DeclarationsStep';
import ProviderSpecificStep from './steps/ProviderSpecificStep';

const STORAGE_KEY = 'service_request_draft';

const steps = [
  { title: 'בחירות כלליות', component: GeneralChoicesStep },
  { title: 'נתונים בסיסיים', component: BasicDataStep },
  { title: 'הצהרות', component: DeclarationsStep },
  { title: 'פרטים ספציפיים', component: ProviderSpecificStep },
];

interface ServiceRequestWizardProps {
  onComplete?: () => void;
}

export default function ServiceRequestWizard({ onComplete }: ServiceRequestWizardProps) {
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
        
        // Set to step 1 (Basic Data) since step 0 is pre-filled
        setCurrentStep(1);
        
        // Clear the stored plan data after loading
        localStorage.removeItem('selectedPlanForSwitch');
      } catch (error) {
        console.error('Error loading selected plan:', error);
      }
    }
  }, []);

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
    // Enhanced validation based on current step
    switch (currentStep) {
      case 0: // General Choices
        if (!formData.action_type || !formData.sector || !formData.customer_type) {
          return false;
        }
        // Business customer additional validation
        if (formData.customer_type === 'business') {
          return !!(formData.company_name && formData.corp_registration_number && 
                   formData.signer_name && formData.signer_title);
        }
        return true;
        
      case 1: // Basic Data
        const basicRequired = formData.full_name && formData.national_id_or_corp && 
                             formData.email && formData.phone && formData.current_provider &&
                             formData.service_address?.street && formData.service_address?.number && 
                             formData.service_address?.city && formData.preferred_language;
        
        // Additional validation for switch action
        if (formData.action_type === 'switch') {
          return basicRequired && formData.target_provider;
        }
        return basicRequired;
        
      case 2: // Declarations
        return !!(formData.poa && formData.privacy_tos && formData.fees_ack && formData.esign_ok);
        
      case 3: // Provider Specific
        return true; // This step is informational/optional
        
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

  const StepComponent = currentStep < steps.length ? steps[currentStep].component : null;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-6 relative overflow-hidden" dir="rtl">
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Progress Header */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-card/95 backdrop-blur-xl rounded-3xl shadow-lg border-2 border-border/50 p-8 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent">
                בקשת שירות
              </h1>
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold text-primary">
                  {currentStep + 1}
                </div>
                <div className="text-sm text-muted-foreground">
                  / {steps.length}
                </div>
              </div>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="relative">
              <div className="flex justify-between mb-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center group cursor-pointer">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-500 relative overflow-hidden",
                      index <= currentStep 
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 scale-110" 
                        : "bg-muted text-muted-foreground scale-100",
                      index === currentStep && "ring-4 ring-primary/20 animate-pulse"
                    )}>
                      {index < currentStep ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                      {index <= currentStep && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 animate-shimmer" />
                      )}
                    </div>
                    <span className={cn(
                      "text-xs mt-3 text-center max-w-24 leading-tight transition-all duration-300",
                      index <= currentStep ? "text-foreground font-bold scale-105" : "text-muted-foreground scale-100"
                    )}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-l from-primary via-primary/90 to-primary/70 transition-all duration-700 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-card/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-border/50 overflow-hidden animate-fade-in hover:shadow-3xl transition-all duration-500">
          <div className="p-8 lg:p-12 relative">
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/10 to-transparent rounded-tr-full" />
            {currentStep >= steps.length ? (
              // Completion Step
              <div className="text-center space-y-8 py-16 relative">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/50 animate-scale-in">
                    <CheckCircle className="w-16 h-16 text-white" strokeWidth={3} />
                  </div>
                  <div className="absolute inset-0 bg-green-400 rounded-3xl blur-2xl opacity-40 animate-pulse" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-l from-green-600 to-green-500 bg-clip-text text-transparent animate-fade-in">
                  הבקשה נשלחה בהצלחה!
                </h2>
                <p className="text-muted-foreground text-lg max-w-md mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  תקבל SMS עם קישור לחתימה דיגיטלית ועדכונים על הסטטוס
                </p>
                 <div className="pt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                   <Button 
                     onClick={() => {
                       if (onComplete) {
                         onComplete();
                       } else {
                         window.location.href = '/';
                       }
                     }} 
                     size="lg"
                     className="bg-gradient-to-l from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-12 py-6 rounded-2xl shadow-xl shadow-primary/30 text-lg font-bold hover:scale-105 transition-all duration-300"
                   >
                     {onComplete ? 'סגור' : 'חזור לדף הבית'}
                   </Button>
                 </div>
              </div>
            ) : (
              <div className="space-y-8 relative z-10">
                <div className="mb-8 animate-fade-in">
                  <h2 className="text-3xl font-bold bg-gradient-to-l from-foreground to-foreground/80 bg-clip-text text-transparent mb-3">
                    {steps[currentStep].title}
                  </h2>
                  <div className="h-1.5 w-24 bg-gradient-to-l from-primary to-primary/70 rounded-full shadow-lg shadow-primary/30"></div>
                </div>
                
                <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <StepComponent
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                </div>
              </div>
            )}

            {/* Clean Navigation */}
            {currentStep < steps.length && (
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={saveDraft}
                  className="border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg font-light text-sm"
                >
                  <Save className="w-4 h-4 ml-2" />
                  שמור טיוטה
                </Button>

                <div className="flex gap-3">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="border-gray-200 hover:bg-gray-50 px-6 py-2 rounded-lg font-normal"
                    >
                      <ChevronLeft className="w-4 h-4 ml-2" />
                      הקודם
                    </Button>
                  )}

                  {currentStep < steps.length - 1 ? (
                    <Button
                      onClick={nextStep}
                      disabled={!canProceed()}
                      size="lg"
                      className={cn(
                        "px-8 py-2 rounded-lg font-normal transition-all duration-300",
                        canProceed() 
                          ? "bg-gray-900 hover:bg-gray-800 text-white shadow-sm" 
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      הבא
                      <ChevronRight className="w-4 h-4 mr-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canProceed() || isLoading}
                      size="lg"
                      className={cn(
                        "px-8 py-2 rounded-lg font-normal transition-all duration-300",
                        canProceed() && !isLoading
                          ? "bg-green-600 hover:bg-green-700 text-white shadow-sm" 
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ml-2"></div>
                          שולח...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <CheckCircle className="w-4 h-4 ml-2" />
                          שלח בקשה
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
