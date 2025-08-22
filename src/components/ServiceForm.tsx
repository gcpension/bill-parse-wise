import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, FileText, Upload, PenTool } from "lucide-react";
import { PersonalDetailsStep } from "@/components/form-steps/PersonalDetailsStep";
import { DocumentsStep } from "@/components/form-steps/DocumentsStep";
import { AuthorizationStep } from "@/components/form-steps/AuthorizationStep";
import { VerificationStep } from "@/components/form-steps/VerificationStep";
import { SignatureStep } from "@/components/form-steps/SignatureStep";
import { ReviewStep } from "@/components/form-steps/ReviewStep";
import { SubmissionStep } from "@/components/form-steps/SubmissionStep";
import { useToast } from "@/hooks/use-toast";

interface ServiceFormProps {
  category: string;
  customerType: string;
  onBack: () => void;
}

const FORM_STEPS = [
  { id: 1, title: "פרטים אישיים", icon: FileText },
  { id: 2, title: "מסמכים", icon: Upload },
  { id: 3, title: "הרשאות", icon: FileText },
  { id: 4, title: "אימות", icon: FileText },
  { id: 5, title: "חתימה", icon: PenTool },
  { id: 6, title: "סקירה", icon: FileText },
  { id: 7, title: "שליחה", icon: ArrowRight }
];

export const ServiceForm = ({ category, customerType, onBack }: ServiceFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      ...formData
    }
  });

  const updateFormData = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const canProceedToNextStep = () => {
    // Basic validation - can be enhanced per step
    return true;
  };

  const handleNextStep = () => {
    if (currentStep < FORM_STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Here we would generate PDF, send webhook, etc.
      toast({
        title: "הטופס נשלח בהצלחה",
        description: "תקבלו הודעה למייל עם מספר האסמכתה",
      });
      
      // Reset form and go back
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשליחת הטופס",
        variant: "destructive"
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetailsStep 
            category={category}
            customerType={customerType}
            data={formData}
            onUpdate={updateFormData}
          />
        );
      case 2:
        return (
          <DocumentsStep
            category={category}
            customerType={customerType}
            data={formData}
            onUpdate={updateFormData}
          />
        );
      case 3:
        return (
          <AuthorizationStep
            category={category}
            customerType={customerType}
            data={formData}
            onUpdate={updateFormData}
          />
        );
      case 4:
        return (
          <VerificationStep
            category={category}
            customerType={customerType}
            data={formData}
            onUpdate={updateFormData}
          />
        );
      case 5:
        return (
          <SignatureStep
            category={category}
            customerType={customerType}
            data={formData}
            onUpdate={updateFormData}
          />
        );
      case 6:
        return (
          <ReviewStep
            category={category}
            customerType={customerType}
            data={formData}
            onUpdate={updateFormData}
          />
        );
      case 7:
        return (
          <SubmissionStep
            category={category}
            customerType={customerType}
            data={formData}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const progress = (currentStep / FORM_STEPS.length) * 100;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            חזרה
          </Button>
          <Badge variant="secondary">
            שלב {currentStep} מתוך {FORM_STEPS.length}
          </Badge>
        </div>
        
        <Progress value={progress} className="mb-4" />
        
        {/* Steps Navigation */}
        <div className="flex justify-between items-center overflow-x-auto pb-2">
          {FORM_STEPS.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const IconComponent = step.icon;
            
            return (
              <div key={step.id} className="flex flex-col items-center min-w-0 flex-1">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors
                  ${isActive ? 'bg-primary text-primary-foreground' : 
                    isCompleted ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}
                `}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className={`text-xs text-center font-medium ${
                  isActive ? 'text-primary' : 
                  isCompleted ? 'text-green-600' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Step Content */}
      <Card className="p-6 mb-6">
        {renderStepContent()}
      </Card>

      {/* Navigation Buttons */}
      {currentStep < 7 && (
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            הקודם
          </Button>
          
          <Button 
            onClick={handleNextStep}
            disabled={!canProceedToNextStep()}
          >
            הבא
            <ArrowRight className="mr-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};