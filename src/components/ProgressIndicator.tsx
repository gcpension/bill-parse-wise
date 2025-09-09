import { CheckCircle, Circle, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Step {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'current' | 'completed' | 'error';
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: string;
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
}

export const ProgressIndicator = ({ 
  steps, 
  currentStep, 
  className,
  variant = 'default' 
}: ProgressIndicatorProps) => {
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  if (variant === 'minimal') {
    return (
      <div className={cn("flex justify-center items-center gap-2", className)}>
        <span className="text-sm text-muted-foreground">
          שלב {currentIndex + 1} מתוך {steps.length}
        </span>
        <div className="flex gap-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-1 rounded-full transition-all duration-300",
                index <= currentIndex ? "bg-primary" : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center justify-center gap-3", className)}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                  step.status === 'completed' && "bg-success text-white",
                  step.status === 'current' && "bg-primary text-white animate-pulse",
                  step.status === 'pending' && "bg-muted text-muted-foreground",
                  step.status === 'error' && "bg-destructive text-white"
                )}
              >
                {step.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : step.status === 'current' ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  step.status === 'current' && "text-primary",
                  step.status === 'completed' && "text-success",
                  step.status === 'pending' && "text-muted-foreground",
                  step.status === 'error' && "text-destructive"
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
        <span>התקדמות</span>
        <span>{currentIndex + 1} / {steps.length}</span>
      </div>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-4 right-4 left-4 h-0.5 bg-muted" />
        <div 
          className="absolute top-4 right-4 h-0.5 bg-primary transition-all duration-500 ease-out"
          style={{ 
            width: `calc(${(currentIndex / (steps.length - 1)) * 100}% - 1rem)` 
          }}
        />
        
        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 border-2 bg-background",
                  step.status === 'completed' && "border-success bg-success text-white",
                  step.status === 'current' && "border-primary bg-primary text-white shadow-lg animate-pulse",
                  step.status === 'pending' && "border-muted text-muted-foreground",
                  step.status === 'error' && "border-destructive bg-destructive text-white"
                )}
              >
                {step.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : step.status === 'current' ? (
                  <Clock className="w-4 h-4" />
                ) : step.status === 'error' ? (
                  '!'
                ) : (
                  index + 1
                )}
              </div>
              
              <div className="mt-2 text-center max-w-24">
                <div
                  className={cn(
                    "text-xs font-medium transition-colors duration-300",
                    step.status === 'current' && "text-primary",
                    step.status === 'completed' && "text-success",
                    step.status === 'pending' && "text-muted-foreground",
                    step.status === 'error' && "text-destructive"
                  )}
                >
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};