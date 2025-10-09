import { Brain, FileCheck, ArrowLeft } from 'lucide-react';

const SimpleStepsBanner = () => {
  return (
    <div className="bg-gradient-to-l from-purple-600 via-indigo-600 to-purple-600 rounded-2xl shadow-lg p-4 mb-8">
      <div className="flex items-center justify-between gap-4">
        {/* Right side - Steps */}
        <div className="flex items-center gap-3">
          {/* Step 1 */}
          <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2 backdrop-blur-sm">
            <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
              1
            </div>
            <span className="text-white text-sm font-semibold whitespace-nowrap">הזנה</span>
          </div>

          <ArrowLeft className="w-4 h-4 text-white/60" />

          {/* Step 2 */}
          <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2 backdrop-blur-sm">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm font-semibold whitespace-nowrap">ניתוח</span>
          </div>

          <ArrowLeft className="w-4 h-4 text-white/60" />

          {/* Step 3 */}
          <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2 backdrop-blur-sm">
            <div className="w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shrink-0">
              <FileCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm font-semibold whitespace-nowrap">מעבר</span>
          </div>
        </div>

        {/* Left side - Message */}
        <div className="text-white">
          <p className="text-lg font-bold">פשוט, מהיר וחינמי</p>
          <p className="text-sm text-white/80">חסכו עד 35% מהחשבונות שלכם</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleStepsBanner;