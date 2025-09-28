import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, Save } from 'lucide-react';
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
    // Basic validation based on current step
    switch (currentStep) {
      case 0:
        return formData.action_type && formData.sector && formData.customer_type;
      case 1:
        return formData.full_name && formData.national_id_or_corp && 
               formData.email && formData.phone && formData.current_provider;
      case 2:
        return formData.poa && formData.privacy_tos && formData.fees_ack && formData.esign_ok;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Here we would send the form data to the backend
      // For now, just show success message
      toast({
        title: 'הבקשה נשלחה בהצלחה',
        description: 'תקבל עדכונים בSMS ובדוא"ל',
      });
      
      // Clear the draft
      localStorage.removeItem(STORAGE_KEY);
      
      // Reset form
      setFormData({});
      setCurrentStep(0);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'שגיאה בשליחה',
        description: 'אנא נסה שוב מאוחר יותר',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const StepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 p-4 animate-fade-in" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Header with Auto-Detection Info */}
        <div className="text-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-purple-100">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent font-heebo mb-2">
              בקשת שירות חכמה
            </h1>
            {formData.selected_plan_name && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 animate-scale-in">
                <p className="text-lg font-semibold text-blue-800 font-assistant">
                  מסלול נבחר: {formData.selected_plan_name}
                </p>
                <p className="text-sm text-blue-600">
                  חברה: {formData.target_provider} | סקטור: {formData.sector === 'cellular' ? 'סלולר' : formData.sector}
                </p>
              </div>
            )}
          </div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <CardTitle className="text-2xl font-bold text-center font-heebo mb-4">
                {formData.action_type === 'switch' ? 'מעבר ספק' : 'בקשת שירות'}
              </CardTitle>
              
              {/* Enhanced Progress Bar */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      {currentStep + 1}
                    </div>
                    שלב {currentStep + 1} מתוך {steps.length}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="relative">
                  <Progress value={progress} className="w-full h-3 bg-white/20" />
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-300" 
                       style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-center text-sm bg-white/20 px-4 py-2 rounded-lg">
                  {steps[currentStep].title}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="animate-fade-in">
              <StepComponent
                formData={formData}
                updateFormData={updateFormData}
              />
            </div>

            {/* Enhanced Navigation */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={saveDraft}
                  className="font-assistant hover-scale bg-white border-purple-200 hover:bg-purple-50 hover:border-purple-400 transition-all duration-300"
                >
                  <Save className="w-4 h-4 ml-2" />
                  שמור טיוטה
                </Button>
              </div>

              <div className="flex gap-3">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="font-assistant hover-scale bg-white border-gray-300 hover:bg-gray-50 transition-all duration-300"
                  >
                    <ChevronLeft className="w-4 h-4 ml-2" />
                    הקודם
                  </Button>
                )}

                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className={cn(
                      "font-assistant hover-scale transition-all duration-300",
                      canProceed() 
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg" 
                        : "bg-gray-400"
                    )}
                  >
                    הבא
                    <ChevronRight className="w-4 h-4 mr-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed() || isLoading}
                    className={cn(
                      "font-assistant hover-scale transition-all duration-300",
                      canProceed() && !isLoading
                        ? "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg" 
                        : "bg-gray-400"
                    )}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                        שולח...
                      </>
                    ) : (
                      'שלח בקשה'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}