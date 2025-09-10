import { CheckCircle, Users, Shield, Zap, Brain, FileCheck } from 'lucide-react';

const SimpleStepsBanner = () => {
  return (
    <div className="mb-6">
      <div className="relative max-w-3xl mx-auto">
        {/* Compact elegant banner */}
        <div className="bg-gradient-to-br from-white/95 via-slate-50/90 to-white/95 dark:from-slate-800/95 dark:via-slate-700/90 dark:to-slate-800/95 backdrop-blur-md rounded-3xl border border-slate-200/60 dark:border-slate-600/50 shadow-2xl p-6 hover:shadow-3xl transition-all duration-500">
          
          {/* Compact Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100/80 to-indigo-100/80 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-display font-semibold mb-3 shadow-sm">
              <Brain className="w-3.5 h-3.5" />
              המערכת החכמה שלנו
            </div>
            <h3 className="text-lg font-display font-bold bg-gradient-to-l from-slate-800 via-blue-700 to-indigo-700 dark:from-slate-100 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent mb-2">
              פלטפורמה מתקדמת שעושה הכל עבורכם
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed font-body">
              טכנולוגיית AI מתקדמת + מומחים אנושיים = חיסכון מקסימלי בזמן מינימלי
            </p>
          </div>

          {/* Compact Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            
            {/* Step 1 */}
            <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-orange-50/70 to-amber-50/70 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl border border-orange-200/40 dark:border-orange-700/30 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div className="flex-1">
                <h4 className="font-display font-bold text-sm text-orange-700 dark:text-orange-300 mb-1">הזנה חכמה</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight font-body">
                  זיהוי אוטומטי של חשבוניות
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50/70 to-indigo-50/70 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/40 dark:border-blue-700/30 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-display font-bold text-sm text-blue-700 dark:text-blue-300 mb-1">ניתוח AI</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight font-body">
                  השוואה של 50+ ספקים
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50/70 to-emerald-50/70 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/40 dark:border-green-700/30 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-sm">
                <FileCheck className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-display font-bold text-sm text-green-700 dark:text-green-300 mb-1">מעבר אוטומטי</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight font-body">
                  אנחנו עושים הכל עבורכם
                </p>
              </div>
            </div>
          </div>

          {/* Compact Bottom Benefits */}
          <div className="flex justify-center gap-4 text-xs p-3 bg-gradient-to-r from-slate-50/70 via-white/50 to-slate-50/70 dark:from-slate-800/50 dark:via-slate-700/50 dark:to-slate-800/50 rounded-xl border border-slate-200/30 dark:border-slate-600/30">
            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
              <Users className="w-3.5 h-3.5" />
              <span className="font-display font-semibold">50K+ חסכו</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Shield className="w-3.5 h-3.5" />
              <span className="font-display font-semibold">חינם לחלוטין</span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
              <Zap className="w-3.5 h-3.5" />
              <span className="font-display font-semibold">35% חיסכון</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleStepsBanner;