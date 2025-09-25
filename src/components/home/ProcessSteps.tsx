import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import minimalistSelectionIcon from '@/assets/minimalist-selection-icon.png';
import minimalistAnalysisIcon from '@/assets/minimalist-analysis-icon.png';
import minimalistCompletionIcon from '@/assets/minimalist-completion-icon.png';

export const ProcessSteps = () => {
  const { isVisible, elementRef } = useScrollAnimation();

  const steps = [
    {
      number: '1',
      title: 'בחירה וקלט',
      description: 'בוחרים קטגוריה, מזינים ספק נוכחי וסכום חודשי',
      icon: minimalistSelectionIcon,
      color: 'bg-purple-500'
    },
    {
      number: '2', 
      title: 'ניתוח והשוואה',
      description: 'המערכת מנתחת ומשווה את כל הספקים הזמינים',
      icon: minimalistAnalysisIcon,
      color: 'bg-blue-500'
    },
    {
      number: '3',
      title: 'השלמה וחיסכון',
      description: 'מקבלים המלצות וביצוע המעבר הטוב ביותר',
      icon: minimalistCompletionIcon,
      color: 'bg-green-500'
    }
  ];

  return (
    <section className="py-20 bg-white relative">
      <div 
        ref={elementRef}
        className={`container mx-auto px-4 lg:px-6 max-w-6xl transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heebo font-medium text-royal-purple mb-6">
            איך זה עובד?
          </h2>
          <p className="text-xl text-purple-600 font-assistant max-w-3xl mx-auto">
            שלושה שלבים פשוטים לחיסכון משמעותי על חשבונות הבית
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className="text-center group"
              style={{ 
                animationDelay: `${0.3 + index * 0.2}s` 
              }}
            >
              {/* Step icon */}
              <div className="relative mb-6 flex justify-center">
                <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-3`}>
                  <img 
                    src={step.icon} 
                    alt={step.title}
                    className="w-10 h-10 object-contain filter brightness-0 invert"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100">
                  <span className="text-sm font-bold text-purple-600">{step.number}</span>
                </div>
              </div>
              
              {/* Step content */}
              <h3 className="text-xl font-bold text-gray-800 mb-3 font-heebo group-hover:text-purple-600 transition-colors">
                {step.title}
              </h3>
              <p className="text-gray-600 font-assistant leading-relaxed">
                {step.description}
              </p>
              
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-200 to-transparent transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};