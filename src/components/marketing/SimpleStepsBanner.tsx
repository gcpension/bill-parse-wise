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
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-2xl opacity-30"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full blur-2xl opacity-30"></div>
        
        <div className="relative">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full shadow-md mb-2">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-bold text-sm font-heebo">איך זה עובד?</h3>
            </div>
            <p className="text-muted-foreground text-xs font-assistant">3 שלבים פשוטים</p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            {/* Step 1 */}
            <div className="group text-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">1</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 transition-all duration-300 group-hover:bg-blue-100">
                <h4 className="font-bold text-blue-700 text-sm mb-1 font-heebo">הזנת נתונים</h4>
                <p className="text-xs text-blue-600 font-assistant">לוקח 30 שניות</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group text-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mx-auto flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">2</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 transition-all duration-300 group-hover:bg-purple-100">
                <h4 className="font-bold text-purple-700 text-sm mb-1 font-heebo">ניתוח חכם</h4>
                <p className="text-xs text-purple-600 font-assistant">מוצא הצעות מותאמות</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group text-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mx-auto flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                  <FileCheck className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">3</div>
              </div>
              <div className="bg-green-50 rounded-xl p-3 transition-all duration-300 group-hover:bg-green-100">
                <h4 className="font-bold text-green-700 text-sm mb-1 font-heebo">מעבר מלא</h4>
                <p className="text-xs text-green-600 font-assistant">חינמי לחלוטין</p>
              </div>
            </div>
          </div>

          {/* Bottom Summary - Enhanced */}
          <div className="relative">
            <div className="bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 rounded-2xl p-4 border-2 border-orange-200 shadow-md">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-orange-700 text-base font-heebo leading-tight">
                    חיסכון של ₪2,400 בשנה
                  </p>
                  <p className="text-xs text-orange-600 font-assistant">
                    הנחה ממוצעת של 35%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleStepsBanner;
