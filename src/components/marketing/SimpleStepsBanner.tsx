import { Brain, FileCheck, Sparkles, ArrowLeft } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const SimpleStepsBanner = () => {
  const { isVisible, elementRef } = useScrollAnimation(0.2);

  return (
    <div 
      ref={elementRef}
      className={`max-w-2xl mx-auto mb-12 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="bg-white rounded-2xl shadow-md border-2 border-border p-6">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <h3 className="text-foreground font-bold text-xl font-heebo">איך זה עובד?</h3>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-3 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <h4 className="font-bold text-blue-700 text-sm mb-1 font-heebo">הזנת נתונים</h4>
              <p className="text-xs text-blue-600 font-assistant">30 שניות בלבד</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl mx-auto mb-3 flex items-center justify-center">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              <h4 className="font-bold text-purple-700 text-sm mb-1 font-heebo">ניתוח חכם</h4>
              <p className="text-xs text-purple-600 font-assistant">מוצא הצעות מותאמות</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl mx-auto mb-3 flex items-center justify-center">
              <FileCheck className="w-8 h-8 text-green-600" />
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <h4 className="font-bold text-green-700 text-sm mb-1 font-heebo">מעבר מלא</h4>
              <p className="text-xs text-green-600 font-assistant">חינמי לחלוטין</p>
            </div>
          </div>
        </div>

        {/* Bottom Summary */}
        <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="font-bold text-orange-700 text-lg font-heebo">₪2,400</p>
                <p className="text-xs text-orange-600 font-assistant">חיסכון שנתי ממוצע</p>
              </div>
              <ArrowLeft className="w-5 h-5 text-orange-500" />
              <div className="text-center">
                <p className="font-bold text-orange-700 text-lg font-heebo">35%</p>
                <p className="text-xs text-orange-600 font-assistant">הנחה ממוצעת</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleStepsBanner;
