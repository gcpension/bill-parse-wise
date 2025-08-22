import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  FileText, 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Zap,
  Smartphone,
  Wifi
} from 'lucide-react';
import { PersonalDetailsStep } from './form-steps/PersonalDetailsStep';
import { DocumentsStep } from './form-steps/DocumentsStep';
import { AuthorizationStep } from './form-steps/AuthorizationStep';
import { SignatureStep } from './form-steps/SignatureStep';
import { SubmissionStep } from './form-steps/SubmissionStep';
import { VerificationStep } from './form-steps/VerificationStep';
import { ReviewStep } from './form-steps/ReviewStep';
import { useToast } from '@/hooks/use-toast';

interface ProviderSwitchingFormProps {
  category: 'electricity' | 'cellular' | 'internet';
  customerType: 'private' | 'business';
  targetProvider?: any;
  onComplete: () => void;
  onCancel: () => void;
}

const FORM_STEPS = [
  { 
    id: 1, 
    title: 'פרטים אישיים', 
    icon: User,
    description: 'מילוי פרטים אישיים וכתובת'
  },
  { 
    id: 2, 
    title: 'מסמכים נדרשים', 
    icon: FileText,
    description: 'העלאת מסמכים ואישורים'
  },
  { 
    id: 3, 
    title: 'אישור והרשאה', 
    icon: Shield,
    description: 'מתן הרשאה לביצוע המעבר'
  },
  { 
    id: 4, 
    title: 'חתימה דיגיטלית', 
    icon: CheckCircle2,
    description: 'חתימה על המסמכים'
  },
  { 
    id: 5, 
    title: 'סקירה ואישור', 
    icon: FileText,
    description: 'סקירה סופית של הפרטים'
  },
  { 
    id: 6, 
    title: 'אימות זהות', 
    icon: Shield,
    description: 'אימות זהות טלפוני'
  },
  { 
    id: 7, 
    title: 'שליחה', 
    icon: CheckCircle2,
    description: 'שליחת הבקשה לספק'
  }
];

const categoryNames = {
  electricity: 'חשמל',
  cellular: 'סלולר', 
  internet: 'אינטרנט'
};

const categoryIcons = {
  electricity: Zap,
  cellular: Smartphone,
  internet: Wifi
};

export const ProviderSwitchingForm = ({ 
  category, 
  customerType, 
  targetProvider,
  onComplete, 
  onCancel 
}: ProviderSwitchingFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    category,
    customerType,
    targetProvider,
    personalDetails: {},
    documents: {},
    authorization: {},
    signature: null,
    verification: {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const Icon = categoryIcons[category];
  const progress = (currentStep / FORM_STEPS.length) * 100;

  const updateFormData = (stepData: any) => {
    setFormData(prev => ({
      ...prev,
      ...stepData
    }));
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
    setIsSubmitting(true);
    try {
      // כאן נשלח את הנתונים לשרת
      await new Promise(resolve => setTimeout(resolve, 2000)); // סימולציה
      
      toast({
        title: "הבקשה נשלחה בהצלחה!",
        description: "נציג הספק יצור איתך קשר תוך 24 שעות לאישור המעבר.",
      });
      
      onComplete();
    } catch (error) {
      toast({
        title: "שגיאה בשליחת הבקשה",
        description: "אנא נסה שוב או פנה לתמיכה.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formData.personalDetails && Object.keys(formData.personalDetails).length > 0;
      case 2:
        return formData.documents && Object.keys(formData.documents).length > 0;
      case 3:
        return formData.authorization?.agreed === true;
      case 4:
        return formData.signature !== null;
      case 5:
        return formData.reviewApproved === true;
      case 6:
        return formData.verification?.completed === true;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetailsStep
            category={category}
            customerType={customerType}
            data={formData.personalDetails}
            onUpdate={(data) => updateFormData({ personalDetails: data })}
          />
        );
      case 2:
        return (
          <DocumentsStep
            category={category}
            customerType={customerType}
            data={formData.documents}
            onUpdate={(data) => updateFormData({ documents: data })}
          />
        );
      case 3:
        return (
          <AuthorizationStep
            category={category}
            customerType={customerType}
            data={formData.authorization}
            onUpdate={(data) => updateFormData({ authorization: data })}
          />
        );
      case 4:
        return (
          <SignatureStep
            category={category}
            customerType={customerType}
            data={formData.signature}
            onUpdate={(data) => updateFormData({ signature: data })}
          />
        );
      case 5:
        return (
          <ReviewStep
            category={category}
            customerType={customerType}
            data={formData}
            onUpdate={(data) => updateFormData(data)}
          />
        );
      case 6:
        return (
          <VerificationStep
            category={category}
            customerType={customerType}
            data={formData.verification}
            onUpdate={(data) => updateFormData({ verification: data })}
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

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <Card className="shadow-elegant border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary-glow/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="p-3 bg-primary rounded-lg">
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">מעבר ספק {categoryNames[category]}</CardTitle>
                <p className="text-muted-foreground">
                  {targetProvider ? `מעבר ל${targetProvider.name}` : 'טופס מעבר ספק'}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onCancel}>
              ביטול
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">התקדמות</span>
              <span className="text-sm text-muted-foreground">
                שלב {currentStep} מתוך {FORM_STEPS.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            
            {/* Steps Indicator */}
            <div className="grid grid-cols-7 gap-2 mt-6">
              {FORM_STEPS.map((step) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="text-center">
                    <div 
                      className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-success text-success-foreground shadow-lg' 
                          : isActive 
                            ? 'bg-primary text-primary-foreground shadow-glow animate-pulse' 
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 hidden md:block">
                      {step.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="p-2 bg-primary/10 rounded-lg">
              {(() => {
                const StepIcon = FORM_STEPS[currentStep - 1].icon;
                return <StepIcon className="h-5 w-5 text-primary" />;
              })()}
            </div>
            <div>
              <CardTitle className="text-xl">
                {FORM_STEPS[currentStep - 1].title}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {FORM_STEPS[currentStep - 1].description}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePreviousStep}
          disabled={currentStep === 1}
          className="flex items-center space-x-2 rtl:space-x-reverse"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>הקודם</span>
        </Button>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {currentStep < FORM_STEPS.length ? (
            <Button
              onClick={handleNextStep}
              disabled={!canProceedToNextStep()}
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >
              <span>הבא</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceedToNextStep() || isSubmitting}
              className="flex items-center space-x-2 rtl:space-x-reverse bg-success hover:bg-success/90"
            >
              <span>{isSubmitting ? 'שולח...' : 'שלח בקשה'}</span>
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Help Section */}
      <Card className="bg-accent/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h4 className="font-semibold">זקוק לעזרה?</h4>
            <p className="text-sm text-muted-foreground">
              צוות התמיכה שלנו זמין לעזור לך בכל שלב של התהליך
            </p>
            <div className="flex justify-center space-x-4 rtl:space-x-reverse">
              <Button variant="outline" size="sm">
                <Shield className="ml-2 h-4 w-4" />
                צ'אט תמיכה
              </Button>
              <Button variant="outline" size="sm">
                טלפון: 03-1234567
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};