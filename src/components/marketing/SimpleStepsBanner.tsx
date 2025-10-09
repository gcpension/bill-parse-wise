import { Brain, FileCheck, Users, Shield, Zap, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const SimpleStepsBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl animate-fade-in">
      <div className="bg-gradient-to-l from-purple-600 via-indigo-600 to-blue-600 rounded-2xl shadow-2xl border-2 border-white/20 backdrop-blur-sm">
        <div className="relative px-4 py-3">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-white/20 text-white"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Content in single row */}
          <div className="flex items-center justify-center gap-6 text-white pr-8">
            {/* Title */}
            <div className="flex items-center gap-2 shrink-0">
              <Brain className="w-5 h-5" />
              <span className="font-bold text-sm">3 שלבים פשוטים לחיסכון גדול:</span>
            </div>

            {/* Steps - Horizontal */}
            <div className="flex items-center gap-4">
              {/* Step 1 */}
              <div className="flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </div>
                <span className="text-xs font-medium whitespace-nowrap">הזנת נתונים</span>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shrink-0">
                  <Brain className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium whitespace-nowrap">ניתוח מתקדם</span>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shrink-0">
                  <FileCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium whitespace-nowrap">מעבר מלא</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="flex items-center gap-3 border-r border-white/30 pr-4">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold whitespace-nowrap">50K+</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold whitespace-nowrap">חינם</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold whitespace-nowrap">35%↓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleStepsBanner;