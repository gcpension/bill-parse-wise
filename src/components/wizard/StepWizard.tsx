import { useWizard } from '@/contexts/WizardContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { PersonalDetailsStep } from './steps/PersonalDetailsStep';
import { CurrentServiceStep } from './steps/CurrentServiceStep';
import { ServiceSelectionStep } from './steps/ServiceSelectionStep';
import { PaymentConsentStep } from './steps/PaymentConsentStep';
import { DigitalSignatureStep } from './steps/DigitalSignatureStep';
import { SuccessStep } from './steps/SuccessStep';

const steps = [
  { id: 1, title: 'פרטים אישיים', description: 'מידע זיהוי בסיסי' },
  { id: 2, title: 'שירות נוכחי', description: 'פרטי הספק הקיים' },
  { id: 3, title: 'בחירת שירות', description: 'ספק ומסלול חדש' },
  { id: 4, title: 'תשלום ואישורים', description: 'הסכמות והרשאות' },
  { id: 5, title: 'חתימה דיגיטלית', description: 'אישור סופי' },
];

export const StepWizard = () => {
  const { state, updateStep, canProceedToStep } = useWizard();
  const currentStep = state.step;
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  const handleNext = () => {
    if (canProceedToStep(currentStep + 1) && currentStep < steps.length) {
      updateStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      updateStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    if (state.isSubmitted) {
      return <SuccessStep />;
    }

    switch (currentStep) {
      case 1:
        return <PersonalDetailsStep />;
      case 2:
        return <CurrentServiceStep />;
      case 3:
        return <ServiceSelectionStep />;
      case 4:
        return <PaymentConsentStep />;
      case 5:
        return <DigitalSignatureStep />;
      default:
        return <PersonalDetailsStep />;
    }
  };

  if (state.isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <SuccessStep />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">מעבר ספק - תהליך מאובטח</CardTitle>
          <div className="space-y-4">
            <Progress value={progress} className="w-full h-3" />
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div 
                  key={step.id} 
                  className={`flex flex-col items-center space-y-2 ${
                    currentStep === step.id ? 'text-primary' : 
                    currentStep > step.id ? 'text-success' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    ${currentStep === step.id ? 'bg-primary text-primary-foreground' : 
                      currentStep > step.id ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}
                  `}>
                    {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : step.id}
                  </div>
                  <div className="text-center hidden md:block">
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-xs opacity-75">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Current Step Indicator */}
      <div className="text-center">
        <Badge variant="outline" className="text-base px-4 py-2">
          שלב {currentStep} מתוך {steps.length}: {steps[currentStep - 1]?.title}
        </Badge>
        <p className="text-muted-foreground mt-2">
          {steps[currentStep - 1]?.description}
        </p>
      </div>

      {/* Step Content */}
      <div className="animate-fade-in">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          קודם
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <div>שלב {currentStep} מתוך {steps.length}</div>
          <div className="text-xs mt-1">הנתונים נשמרים אוטומטית</div>
        </div>

        <Button
          onClick={handleNext}
          disabled={!canProceedToStep(currentStep + 1) || currentStep === steps.length}
          className="flex items-center gap-2"
        >
          הבא
          <ArrowLeft className="h-4 w-4 rotate-180" />
        </Button>
      </div>

      {/* Security Notice */}
      <div className="text-center text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle className="h-4 w-4 text-success" />
          <span className="font-medium">מאובטח ומוצפן</span>
        </div>
        <div>כל הנתונים מוצפנים ומוגנים לפי תקני GDPR • אפשרות ביטול תוך 7 ימים</div>
      </div>
    </div>
  );
};