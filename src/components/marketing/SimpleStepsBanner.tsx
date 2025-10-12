import { Brain, FileCheck, Sparkles, TrendingUp } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const SimpleStepsBanner = () => {
  const { isVisible, elementRef } = useScrollAnimation(0.2);

  return (
    <div 
      ref={elementRef}
      className={`max-w-xl mx-auto mb-10 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-5 relative overflow-hidden">
        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-100 rounded-full blur-3xl opacity-40"></div>
        
        <div className="relative">
          {/* Compact Header */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-foreground font-bold text-lg font-heebo">איך זה עובד?</h3>
          </div>

          {/* Compact Steps */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* Step 1 */}
            <div className="group text-center">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl mx-auto mb-2 flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-md">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
              </div>
              <h4 className="font-bold text-blue-700 text-xs mb-1 font-heebo">הזנה</h4>
              <p className="text-[10px] text-blue-600 font-assistant leading-tight">30 שניות</p>
            </div>

            {/* Step 2 */}
            <div className="group text-center">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl mx-auto mb-2 flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-md">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
              </div>
              <h4 className="font-bold text-purple-700 text-xs mb-1 font-heebo">ניתוח</h4>
              <p className="text-[10px] text-purple-600 font-assistant leading-tight">AI חכם</p>
            </div>

            {/* Step 3 */}
            <div className="group text-center">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl mx-auto mb-2 flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-md">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
              </div>
              <h4 className="font-bold text-green-700 text-xs mb-1 font-heebo">מעבר</h4>
              <p className="text-[10px] text-green-600 font-assistant leading-tight">חינם 100%</p>
            </div>
          </div>

          {/* Compact Bottom Highlight */}
          <div className="bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 rounded-xl p-3 border border-orange-200">
            <div className="flex items-center justify-center gap-3">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div className="text-center">
                <p className="font-bold text-orange-700 text-base font-heebo leading-tight">חיסכון של ₪2,400 בשנה</p>
                <p className="text-[10px] text-orange-600 font-assistant">35% הנחה ממוצעת</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleStepsBanner;
