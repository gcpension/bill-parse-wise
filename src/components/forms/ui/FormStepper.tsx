import { motion } from "framer-motion";
import { Check, User, FileText, PenTool, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface FormStepperProps {
  currentStep: number;
  steps?: Step[];
  categoryColor?: string;
}

const defaultSteps: Step[] = [
  { id: 1, label: "פרטים אישיים", icon: User },
  { id: 2, label: "פרטי שירות", icon: FileText },
  { id: 3, label: "חתימה", icon: PenTool },
  { id: 4, label: "סיום", icon: PartyPopper },
];

export const FormStepper = ({ 
  currentStep, 
  steps = defaultSteps,
  categoryColor = "from-primary to-primary/80"
}: FormStepperProps) => {
  return (
    <div className="w-full py-4 px-2 md:px-0" dir="rtl">
      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Progress Line Background */}
        <div className="absolute top-6 right-6 left-6 h-1 bg-muted rounded-full" />
        
        {/* Active Progress Line */}
        <motion.div 
          className={cn("absolute top-6 right-6 h-1 rounded-full bg-gradient-to-l", categoryColor)}
          initial={{ width: "0%" }}
          animate={{ 
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <motion.div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isCompleted && "bg-gradient-to-br border-transparent text-white shadow-lg",
                  isCompleted && categoryColor,
                  isActive && "bg-white border-primary shadow-lg shadow-primary/20",
                  !isCompleted && !isActive && "bg-muted border-muted-foreground/20"
                )}
                initial={{ scale: 1 }}
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive && "text-primary",
                    !isActive && "text-muted-foreground"
                  )} />
                )}
              </motion.div>
              
              <motion.span 
                className={cn(
                  "mt-2 text-sm font-medium text-center",
                  isActive && "text-primary",
                  isCompleted && "text-foreground",
                  !isActive && !isCompleted && "text-muted-foreground"
                )}
                animate={{ fontWeight: isActive ? 600 : 400 }}
              >
                {step.label}
              </motion.span>
            </div>
          );
        })}
      </div>

      {/* Mobile Stepper - Compact */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-foreground">
            {steps.find(s => s.id === currentStep)?.label}
          </span>
          <span className="text-sm text-muted-foreground">
            {currentStep} / {steps.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className={cn("h-full rounded-full bg-gradient-to-l", categoryColor)}
            initial={{ width: "0%" }}
            animate={{ 
              width: `${(currentStep / steps.length) * 100}%` 
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Step Dots */}
        <div className="flex justify-between mt-2 px-1">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            
            return (
              <motion.div
                key={step.id}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  isCompleted && "bg-primary",
                  isActive && "bg-primary scale-150",
                  !isCompleted && !isActive && "bg-muted-foreground/30"
                )}
                animate={{ scale: isActive ? 1.5 : 1 }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FormStepper;
