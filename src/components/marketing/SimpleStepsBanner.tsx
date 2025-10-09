import { Brain, FileCheck, ArrowLeft, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const SimpleStepsBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between gap-6">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-400 hover:text-gray-600 shrink-0"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Steps - Horizontal */}
          <div className="flex items-center gap-3 flex-1 justify-center">
            {/* Step 1 */}
            <div className="flex items-center gap-2 bg-orange-50 rounded-xl px-4 py-2 border border-orange-200">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
                1
              </div>
              <span className="text-gray-700 text-sm font-semibold whitespace-nowrap">הזנה</span>
            </div>

            <ArrowLeft className="w-5 h-5 text-gray-300" />

            {/* Step 2 */}
            <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-2 border border-blue-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700 text-sm font-semibold whitespace-nowrap">ניתוח</span>
            </div>

            <ArrowLeft className="w-5 h-5 text-gray-300" />

            {/* Step 3 */}
            <div className="flex items-center gap-2 bg-green-50 rounded-xl px-4 py-2 border border-green-200">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shrink-0">
                <FileCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-700 text-sm font-semibold whitespace-nowrap">מעבר</span>
            </div>
          </div>

          {/* Message */}
          <div className="text-left shrink-0">
            <p className="text-sm font-bold text-gray-800">חיסכון עד 35%</p>
            <p className="text-xs text-gray-500">פשוט, מהיר וחינמי</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleStepsBanner;