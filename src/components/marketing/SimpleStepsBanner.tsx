import { Brain, FileCheck, Sparkles } from 'lucide-react';

const SimpleStepsBanner = () => {
  return (
    <div className="mb-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-l from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-gray-800 font-bold text-lg">איך התהליך עובד?</h3>
          </div>
        </div>

        {/* Content - 3 columns */}
        <div className="grid grid-cols-3 gap-6 p-8">
          {/* Step 1 */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-lg">
              1
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-base mb-2">הזנת נתונים</h4>
              <p className="text-sm text-gray-600 leading-relaxed">הזינו את סכום החשבון הנוכחי שלכם בקלות ובמהירות</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-base mb-2">ניתוח חכם</h4>
              <p className="text-sm text-gray-600 leading-relaxed">המערכת בודקת את כל הספקים ומוצאת את הזול ביותר עבורכם</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-base mb-2">מעבר מלא</h4>
              <p className="text-sm text-gray-600 leading-relaxed">אנחנו מסדרים עבורכם את כל המעבר והניתוק מהספק הישן</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-l from-slate-50 to-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 font-semibold">חינמי לחלוטין</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700 font-semibold">חיסכון ממוצע של 35%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 font-semibold">50,000+ משתמשים מרוצים</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleStepsBanner;