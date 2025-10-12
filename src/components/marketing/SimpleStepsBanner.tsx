import { useState } from 'react';
import { Brain, FileCheck, Sparkles, Zap, ChevronRight, TrendingUp, Shield, Clock } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Step {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  detail: string;
  color: string;
}

const steps: Step[] = [
  {
    id: 1,
    icon: Sparkles,
    title: 'הזנת נתונים',
    description: 'הזינו פרטי חשבון',
    detail: 'לוקח רק 30 שניות',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    icon: Brain,
    title: 'ניתוח חכם',
    description: 'המערכת מנתחת',
    detail: 'מוצאת הצעות מותאמות',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 3,
    icon: FileCheck,
    title: 'בחירת תוכנית',
    description: 'בחרו את התוכנית',
    detail: 'השוואה קלה ונוחה',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 4,
    icon: Zap,
    title: 'מעבר מהיר',
    description: 'אנחנו מסדרים',
    detail: 'חינמי לחלוטין',
    color: 'from-green-500 to-emerald-500'
  }
];

const SimpleStepsBanner = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { isVisible, elementRef } = useScrollAnimation(0.2);

  return (
    <div 
      ref={elementRef}
      className={`max-w-4xl mx-auto mb-12 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-foreground font-bold text-lg font-heebo">איך התהליך עובד?</h3>
        </div>
        <p className="text-muted-foreground font-assistant">4 צעדים פשוטים לחיסכון משמעותי</p>
      </div>

      {/* Interactive Steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = activeStep === index;
          
          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`group relative cursor-pointer transition-all duration-500 ${
                isActive ? 'scale-105' : 'hover:scale-102'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className={`
                relative bg-card border-2 rounded-2xl p-4 
                transition-all duration-500 shadow-sm hover:shadow-xl
                ${isActive ? 'border-primary shadow-lg' : 'border-border hover:border-primary/50'}
              `}>
                {/* Step number badge */}
                <div className={`
                  absolute -top-3 -right-3 w-8 h-8 rounded-full 
                  flex items-center justify-center font-bold text-sm
                  transition-all duration-500 shadow-md
                  ${isActive ? 'bg-gradient-to-br ' + step.color + ' text-white scale-110' : 'bg-muted text-muted-foreground'}
                `}>
                  {step.id}
                </div>

                {/* Icon */}
                <div className={`
                  w-12 h-12 rounded-xl mx-auto mb-3
                  flex items-center justify-center
                  transition-all duration-500
                  ${isActive ? 'bg-gradient-to-br ' + step.color : 'bg-primary/10'}
                `}>
                  <Icon className={`w-6 h-6 transition-colors duration-500 ${
                    isActive ? 'text-white' : 'text-primary'
                  }`} />
                </div>

                {/* Content */}
                <h4 className="font-semibold text-foreground text-sm mb-1 font-heebo text-center">
                  {step.title}
                </h4>
                <p className="text-xs text-muted-foreground font-assistant text-center mb-1">
                  {step.description}
                </p>
                <p className={`text-xs font-medium text-center transition-all duration-500 ${
                  isActive ? 'text-primary opacity-100' : 'opacity-0'
                }`}>
                  {step.detail}
                </p>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <ChevronRight className="w-4 h-4 text-primary animate-bounce" style={{ transform: 'rotate(90deg)' }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-6">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500 rounded-full"
          style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Bottom highlights */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-3 border border-border">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground text-sm font-heebo">מהיר</span>
          </div>
          <p className="text-xs text-muted-foreground font-assistant">30 שניות בלבד</p>
        </div>
        
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-3 border border-border">
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground text-sm font-heebo">חיסכון</span>
          </div>
          <p className="text-xs text-muted-foreground font-assistant">עד 35% בממוצע</p>
        </div>
        
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-3 border border-border">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground text-sm font-heebo">חינמי</span>
          </div>
          <p className="text-xs text-muted-foreground font-assistant">100% ללא עלות</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleStepsBanner;