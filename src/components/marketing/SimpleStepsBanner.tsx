import { Brain, FileCheck, Sparkles, Zap } from 'lucide-react';

const SimpleStepsBanner = () => {
  return (
    <div className="max-w-md mx-auto mb-12">
      <div className="bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/20 rounded-2xl shadow-xl border border-purple-200 overflow-hidden backdrop-blur-sm">
        {/* Header with icon */}
        <div className="bg-gradient-to-l from-purple-500 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
            <h3 className="text-white font-bold text-xl font-heebo">איך התהליך עובד?</h3>
          </div>
        </div>

        {/* Content - Vertical Steps */}
        <div className="p-8 space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4 items-start group">
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-3">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-base mb-2 font-heebo">הזנת נתונים</h4>
              <p className="text-sm text-gray-600 leading-relaxed font-assistant">
                הזינו את סכום החשבון הנוכחי שלכם בקלות ובמהירות. זה לוקח רק 30 שניות!
              </p>
            </div>
          </div>

          {/* Connector Line */}
          <div className="h-8 w-0.5 bg-gradient-to-b from-orange-400 via-blue-400 to-green-400 mx-7"></div>

          {/* Step 2 */}
          <div className="flex gap-4 items-start group">
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-3">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-base mb-2 font-heebo">ניתוח חכם</h4>
              <p className="text-sm text-gray-600 leading-relaxed font-assistant">
                המערכת שלנו בודקת את כל הספקים בשוק ומוצאת עבורכם את ההצעה הזולה והמתאימה ביותר
              </p>
            </div>
          </div>

          {/* Connector Line */}
          <div className="h-8 w-0.5 bg-gradient-to-b from-blue-400 to-green-400 mx-7"></div>

          {/* Step 3 */}
          <div className="flex gap-4 items-start group">
            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-3">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-base mb-2 font-heebo">מעבר מלא</h4>
              <p className="text-sm text-gray-600 leading-relaxed font-assistant">
                אנחנו מסדרים עבורכם את כל המעבר לספק החדש, כולל הניתוק מהספק הישן. הכל בחינם!
              </p>
            </div>
          </div>
        </div>

        {/* Footer with highlights */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-5 border-t border-purple-100">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-800 font-semibold text-sm font-assistant flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-600" />
                חינמי לחלוטין - 0 ₪
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-gray-800 font-semibold text-sm font-assistant">
                חיסכון ממוצע של 35% בחשבונות
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-800 font-semibold text-sm font-assistant">
                למעלה מ-50,000 משתמשים מרוצים
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleStepsBanner;