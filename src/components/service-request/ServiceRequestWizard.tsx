import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Save, CheckCircle, Copy } from 'lucide-react';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

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
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const { toast } = useToast();

  // Load draft and selected plan from localStorage on mount
  useEffect(() => {
    // Load selected plan data
    const selectedPlan = localStorage.getItem('selectedPlanForSwitch');
    if (selectedPlan) {
      try {
        const planData = JSON.parse(selectedPlan);
        
        // Map Hebrew service names to sector codes
        const sectorMapping: Record<string, string> = {
          'סלולר': 'cellular',
          'אינטרנט': 'internet_isp',
          'טלוויזיה': 'tv',
          'חשמל': 'electricity',
          'mobile': 'cellular',
          'internet': 'internet_isp',
          'television': 'tv',
          'electricity': 'electricity'
        };
        
        const detectedSector = sectorMapping[planData.category] || planData.category || 'cellular';
        const detectedProvider = planData.company;
        
        setFormData(prev => ({
          ...prev,
          action_type: 'switch',
          sector: detectedSector,
          target_provider: detectedProvider,
          selected_plan_name: planData.planName,
          selected_plan_price: planData.price,
          selected_plan_features: planData.features || []
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
      console.log('Submitting form data to edge function:', formData);
      
      // Prepare data for submission
      const submitData = {
        ...formData,
        sector: formData.sector || 'general',
        customer_type: formData.customer_type || 'private',
        service_address: formData.service_address || { street: '', number: '', city: '', zip: '' },
      };

      // Call edge function to create service request
      const { data: response, error } = await supabase.functions.invoke('create-service-request', {
        body: submitData
      });

      if (error) {
        console.error('Submission error:', error);
        throw new Error(error.message || 'Failed to submit');
      }

      if (!response?.success) {
        if (response?.error === 'duplicate_request') {
          toast({
            title: 'בקשה כפולה',
            description: `כבר קיימת בקשה פעילה. מספר אסמכתה: ${response.existing_reference}`,
            variant: 'destructive'
          });
          setReferenceNumber(response.existing_reference);
          setCurrentStep(steps.length);
          return;
        }
        throw new Error(response?.error || 'Unknown error');
      }

      // Success!
      setReferenceNumber(response.reference_number);
      
      toast({
        title: 'הבקשה נשלחה בהצלחה! 🎉',
        description: `מספר אסמכתה: ${response.reference_number}`,
      });
      
      // Clear the draft
      localStorage.removeItem(STORAGE_KEY);
      
      // Show completion message
      setCurrentStep(steps.length);
      
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: 'שגיאה בשליחת הבקשה',
        description: error.message || 'אנא בדוק את החיבור לאינטרנט ונסה שוב',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const StepComponent = currentStep < steps.length ? steps[currentStep].component : null;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="h-full font-heebo flex flex-col">
      {/* Compact Progress Header - Horizontal */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Steps - Horizontal Compact */}
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-normal transition-all duration-300",
                  index <= currentStep 
                    ? "bg-gray-900 text-white" 
                    : "bg-gray-100 text-gray-400"
                )}>
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className={cn(
                  "text-sm whitespace-nowrap transition-all duration-300",
                  index <= currentStep ? "text-gray-900 font-normal" : "text-gray-400 font-light"
                )}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <ChevronLeft className="w-4 h-4 text-gray-300" />
                )}
              </div>
            ))}
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              <span className="font-normal text-gray-900">{currentStep + 1}</span>
              <span className="mx-1">/</span>
              <span>{steps.length}</span>
            </div>
            <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gray-900 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable if needed */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {currentStep >= steps.length ? (
          // Completion Step
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-light text-gray-900">
              הבקשה נשלחה בהצלחה!
            </h2>
            
            {referenceNumber && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-sm mx-auto">
                <p className="text-sm text-gray-500 mb-2">מספר אסמכתה:</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-lg font-medium text-gray-900">{referenceNumber}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(referenceNumber);
                      toast({
                        title: 'הועתק!',
                        description: 'מספר האסמכתה הועתק ללוח'
                      });
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2">שמור מספר זה למעקב אחר הבקשה</p>
              </div>
            )}
            
            <p className="text-gray-600 font-light max-w-md mx-auto">
              תקבל עדכונים על הסטטוס במייל ובהודעת SMS
            </p>
            
            <div className="flex gap-3 justify-center pt-4">
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/track-request'}
                className="px-6 rounded-lg font-normal"
              >
                מעקב בקשה
              </Button>
              <Button 
                onClick={() => {
                  if (onComplete) {
                    onComplete();
                  } else {
                    window.location.href = '/';
                  }
                }} 
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 rounded-lg font-normal shadow-sm"
              >
                {onComplete ? 'סגור' : 'חזור לדף הבית'}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <StepComponent
              formData={formData}
              updateFormData={updateFormData}
            />
          </div>
        )}
      </div>

      {/* Footer Navigation - Fixed at bottom */}
      {currentStep < steps.length && (
        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-3">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={saveDraft}
              className="border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg font-light text-xs h-8"
            >
              <Save className="w-3.5 h-3.5 ml-1.5" />
              שמור טיוטה
            </Button>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="border-gray-200 hover:bg-gray-50 px-5 py-1.5 rounded-lg font-normal text-sm h-8"
                >
                  <ChevronLeft className="w-4 h-4 ml-1.5" />
                  הקודם
                </Button>
              )}

              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={cn(
                    "px-6 py-1.5 rounded-lg font-normal text-sm h-8 transition-all duration-300",
                    canProceed() 
                      ? "bg-gray-900 hover:bg-gray-800 text-white shadow-sm" 
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  הבא
                  <ChevronRight className="w-4 h-4 mr-1.5" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isLoading}
                  className={cn(
                    "px-6 py-1.5 rounded-lg font-normal text-sm h-8 transition-all duration-300",
                    canProceed() && !isLoading
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-sm" 
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent ml-1.5"></div>
                      שולח...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <CheckCircle className="w-4 h-4 ml-1.5" />
                      שלח בקשה
                    </span>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
