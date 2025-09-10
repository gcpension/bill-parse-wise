import { CheckCircle, Users, Shield, Zap, Brain, FileCheck } from 'lucide-react';

const SimpleStepsBanner = () => {
  return (
    <div className="mb-8">
      <div className="relative max-w-4xl mx-auto">
        {/* Enhanced detailed banner */}
        <div className="bg-gradient-to-r from-white via-blue-50/30 to-white dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-600 shadow-lg p-6">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
              <Brain className="w-4 h-4" />
              מה בדיוק המערכת שלנו עושה עבורכם?
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              פלטפורמה חכמה שחוסכת לכם זמן, כסף ועצבים
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              במקום לבזבז שעות על השוואת מחירים, שיחות לספקים ומילוי טפסים מסובכים - המערכת שלנו עושה הכל אוטומטיטי
            </p>
          </div>

          {/* Detailed Steps */}
          <div className="space-y-4 mb-6">
            
            {/* Step 1 */}
            <div className="grid grid-cols-1 md:grid-cols-[60px,1fr] gap-4 items-start p-4 bg-orange-50/50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-800/30">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-xl flex items-center justify-center border border-orange-200 dark:border-orange-700">
                <span className="text-orange-700 dark:text-orange-300 font-bold text-lg">1</span>
              </div>
              <div>
                <h4 className="font-bold text-base text-orange-700 dark:text-orange-300 mb-2">הזנת נתונים פשוטה וחכמה</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
                  אתם בוחרים קטגוריות (חשמל, סלולר, אינטרנט, טלוויזיה) ומזינים את הסכומים החודשיים הנוכחיים. 
                  אפשר גם להעלות חשבונית והמערכת תחלץ את הנתונים אוטומטית.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">✓ זיהוי אוטומטי של חשבוניות</span>
                  <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">✓ בדיקת תקינות הנתונים</span>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="grid grid-cols-1 md:grid-cols-[60px,1fr] gap-4 items-start p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl flex items-center justify-center border border-blue-200 dark:border-blue-700">
                <Brain className="w-6 h-6 text-blue-700 dark:text-blue-300" />
              </div>
              <div>
                <h4 className="font-bold text-base text-blue-700 dark:text-blue-300 mb-2">ניתוח חכם של כל השוק הישראלי</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
                  האלגוריתם שלנו סורק בזמן אמת את כל הספקים בישראל, משווה מבצעים זמניים, בודק קנסות יציאה, 
                  ומחשב את החיסכון האמיתי שלכם - כולל עמלות נסתרות שהספקים לא מספרים עליהן.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">✓ השוואת 50+ ספקים</span>
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">✓ זיהוי עמלות נסתרות</span>
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">✓ בדיקת קנסות יציאה</span>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="grid grid-cols-1 md:grid-cols-[60px,1fr] gap-4 items-start p-4 bg-green-50/50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800/30">
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-xl flex items-center justify-center border border-green-200 dark:border-green-700">
                <FileCheck className="w-6 h-6 text-green-700 dark:text-green-300" />
              </div>
              <div>
                <h4 className="font-bold text-base text-green-700 dark:text-green-300 mb-2">מעבר מלא ללא כאב ראש</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
                  רק חתימה דיגיטלית אחת ואנחנו עושים הכל עבורכם: מתקשרים לספק החדש, מבצעים את ההרשמה, 
                  מנתקים מהספק הישן, ומטפלים בכל הניירת. אתם מקבלים עדכונים בזמן אמת על התקדמות התהליך.
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">✓ חתימה דיגיטלית מאובטחת</span>
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">✓ ניתוק אוטומטי מספק ישן</span>
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">✓ מעקב סטטוס בזמן אמת</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Benefits */}
          <div className="flex justify-center gap-6 text-xs p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <Users className="w-4 h-4" />
              <span className="font-medium">50K+ משפחות חסכו</span>
            </div>
            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Shield className="w-4 h-4" />
              <span className="font-medium">0₪ עמלות וחינם לחלוטין</span>
            </div>
            <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
              <Zap className="w-4 h-4" />
              <span className="font-medium">35% חיסכון ממוצע בשנה</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleStepsBanner;