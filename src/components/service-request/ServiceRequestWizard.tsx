import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { useToast } from '@/hooks/use-toast';

// Import steps
import GeneralChoicesStep from './steps/GeneralChoicesStep';
import BasicDataStep from './steps/BasicDataStep';
import DeclarationsStep from './steps/DeclarationsStep';
import SectorSpecificStep from './steps/SectorSpecificStep';

const STORAGE_KEY = 'service_request_draft';

const steps = [
  { title: 'בחירות כלליות', component: GeneralChoicesStep },
  { title: 'נתונים בסיסיים', component: BasicDataStep },
  { title: 'הצהרות', component: DeclarationsStep },
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
        setFormData(prev => ({
          ...prev,
          action_type: 'switch',
          target_provider: planData.company,
          // Map category from plan to our categories
          sector: planData.category === 'mobile' ? 'cellular' : planData.category
        }));
        
        toast({
          title: 'מסלול נבחר',
          description: `מסלול ${planData.planName} מ${planData.company} נטען לטופס`,
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
    <div className="min-h-screen bg-background p-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl font-bold text-center font-heebo">
              בקשת שירות
            </CardTitle>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>שלב {currentStep + 1} מתוך {steps.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-center text-sm text-muted-foreground">
                {steps[currentStep].title}
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <StepComponent
              formData={formData}
              updateFormData={updateFormData}
            />

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={saveDraft}
                  className="font-assistant"
                >
                  <Save className="w-4 h-4 ml-2" />
                  שמור טיוטה
                </Button>
              </div>

              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="font-assistant"
                  >
                    <ChevronLeft className="w-4 h-4 ml-2" />
                    הקודם
                  </Button>
                )}

                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="font-assistant"
                  >
                    הבא
                    <ChevronRight className="w-4 h-4 mr-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed() || isLoading}
                    className="font-assistant"
                  >
                    {isLoading ? 'שולח...' : 'שלח בקשה'}
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