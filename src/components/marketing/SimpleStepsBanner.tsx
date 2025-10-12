import { useState } from 'react';
import { Brain, FileCheck, Sparkles, Zap, ArrowLeft, TrendingUp } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const SimpleStepsBanner = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const { isVisible, elementRef } = useScrollAnimation(0.2);

  const steps = [
    {
      id: 1,
      icon: Sparkles,
      title: 'הזנת נתונים',
      subtitle: '30 שניות',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      iconBg: 'bg-blue-500'
    },
    {
      id: 2,
      icon: Brain,
      title: 'ניתוח AI',
      subtitle: 'חכם ומהיר',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      iconBg: 'bg-purple-500'
    },
    {
      id: 3,
      icon: FileCheck,
      title: 'בחירת תוכנית',
      subtitle: 'השוואה פשוטה',
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      iconBg: 'bg-orange-500'
    },
    {
      id: 4,
      icon: Zap,
      title: 'מעבר מהיר',
      subtitle: '100% חינם',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      iconBg: 'bg-green-500'
    }
  ];

  return (
    <div 
      ref={elementRef}
      className={`max-w-4xl mx-auto mb-10 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-5 py-2 rounded-full shadow-lg mb-2">
          <Sparkles className="w-4 h-4" />
          <span className="font-bold text-sm font-heebo">איך זה עובד?</span>
        </div>
        <p className="text-muted-foreground text-sm font-assistant">4 שלבים פשוטים לחיסכון משמעותי</p>
      </div>

      {/* Steps Container */}
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 via-purple-300 via-orange-300 to-green-300 rounded-full hidden md:block"></div>
        <div className="absolute top-8 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-orange-500 to-green-500 rounded-full hidden md:block transition-all duration-1000 animate-pulse" 
          style={{ width: hoveredStep ? `${(hoveredStep / 4) * 100}%` : '0%' }}></div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isHovered = hoveredStep === step.id;
            
            return (
              <div
                key={step.id}
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
                className={`transition-all duration-500 ${
                  isHovered ? 'transform -translate-y-2' : ''
                }`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  animation: isVisible ? `fadeInUp 0.6s ease-out ${index * 150}ms both` : 'none'
                }}
              >
                <div className={`
                  relative bg-white rounded-2xl p-4 shadow-md hover:shadow-2xl
                  transition-all duration-500 border-2
                  ${isHovered ? 'border-transparent shadow-xl' : 'border-gray-200'}
                `}>
                  {/* Gradient Overlay on Hover */}
                  <div className={`
                    absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} 
                    transition-opacity duration-500 -z-10
                    ${isHovered ? 'opacity-10' : 'opacity-0'}
                  `}></div>

                  {/* Step Number Badge */}
                  <div className={`
                    absolute -top-2 -right-2 w-7 h-7 rounded-full
                    flex items-center justify-center font-bold text-xs text-white
                    shadow-lg transition-all duration-500 ${step.iconBg}
                    ${isHovered ? 'scale-110' : 'scale-100'}
                  `}>
                    {step.id}
                  </div>

                  {/* Icon */}
                  <div className={`
                    w-16 h-16 mx-auto mb-3 rounded-2xl
                    flex items-center justify-center
                    bg-gradient-to-br ${step.color} shadow-lg
                    transition-all duration-500
                    ${isHovered ? 'scale-110 rotate-3' : 'scale-100 rotate-0'}
                  `}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h4 className={`font-bold text-sm mb-1 font-heebo ${step.textColor}`}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-muted-foreground font-assistant">
                      {step.subtitle}
                    </p>
                  </div>

                  {/* Hover Arrow */}
                  {isHovered && index < 3 && (
                    <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 hidden md:block">
                      <ArrowLeft className="w-5 h-5 text-gray-400 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Highlight Card */}
      <div className="mt-6 bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 rounded-2xl p-4 border-2 border-orange-200 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-300 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-300 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-orange-700 text-lg font-heebo leading-tight">
              חיסכון ממוצע של ₪2,400 בשנה
            </p>
            <p className="text-xs text-orange-600 font-assistant">
              35% הנחה • אלפי לקוחות מרוצים
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleStepsBanner;
