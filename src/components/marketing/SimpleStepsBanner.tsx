import { Brain, FileCheck, ArrowLeft, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const SimpleStepsBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-4 z-50 w-72 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-l from-purple-600 to-indigo-600 px-4 py-3 relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-2 top-2 h-6 w-6 p-0 hover:bg-white/20 text-white"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-3 w-3" />
          </Button>
          <h3 className="text-white font-bold text-center text-sm">איך זה עובד?</h3>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Step 1 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-sm mb-1">הזנת נתונים</h4>
              <p className="text-xs text-gray-600 leading-relaxed">הזינו את סכום החשבון הנוכחי שלכם</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-sm mb-1">ניתוח חכם</h4>
              <p className="text-xs text-gray-600 leading-relaxed">המערכת בודקת את כל הספקים ומוצאת את הזול ביותר</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shrink-0">
              <FileCheck className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-sm mb-1">מעבר מלא</h4>
              <p className="text-xs text-gray-600 leading-relaxed">אנחנו מסדרים עבורכם את כל המעבר והניתוק</p>
            </div>
          </div>

          {/* Bottom badge */}
          <div className="pt-2 mt-2 border-t border-gray-200">
            <div className="bg-gradient-to-l from-purple-50 to-indigo-50 rounded-lg px-3 py-2 text-center">
              <p className="text-purple-700 font-bold text-sm">חינמי לחלוטין</p>
              <p className="text-purple-600 text-xs">חיסכון ממוצע של 35%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleStepsBanner;