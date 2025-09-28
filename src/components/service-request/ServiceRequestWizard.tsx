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
      case 4: // Sector Specific
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
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <Card className="rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <CardContent className="p-8">
            {currentStep >= steps.length ? (
              // Completion Step
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  הבקשה נשלחה בהצלחה!
                </h2>
                <p className="text-gray-600 mb-6">
                  תקבל SMS עם קישור לחתימה דיגיטלית ועדכונים על הסטטוס
                </p>
                <Button 
                  onClick={() => window.location.href = '/'} 
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg"
                >
                  חזור לדף הבית
                </Button>
              </div>
            ) : (
              <div>
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
