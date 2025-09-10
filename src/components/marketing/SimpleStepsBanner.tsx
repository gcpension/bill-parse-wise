import { CheckCircle, Users, Shield } from 'lucide-react';

const SimpleStepsBanner = () => {
  return (
    <div className="mb-8">
      <div className="relative max-w-3xl mx-auto">
        {/* Simple banner */}
        <div className="bg-gradient-to-r from-white via-blue-50/30 to-white dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-600 shadow-lg p-6">
          
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-3">
              <CheckCircle className="w-4 h-4" />
              איך זה עובד בפשטות
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
              3 שלבים פשוטים לחיסכון מקסימלי
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              מזינים נתונים → מקבלים ניתוח → עוברים לספק חדש
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/50 dark:to-orange-800/50 rounded-xl flex items-center justify-center mx-auto mb-2 border border-orange-200 dark:border-orange-700">
                <span className="text-orange-700 dark:text-orange-300 font-bold">1</span>
              </div>
              <h4 className="font-bold text-xs text-orange-700 dark:text-orange-300 mb-1">הזנת נתונים</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">קטגוריות וסכומים נוכחיים</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl flex items-center justify-center mx-auto mb-2 border border-blue-200 dark:border-blue-700">
                <span className="text-blue-700 dark:text-blue-300 font-bold">2</span>
              </div>
              <h4 className="font-bold text-xs text-blue-700 dark:text-blue-300 mb-1">ניתוח אוטומטי</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">השוואת אלפי תעריפים</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-xl flex items-center justify-center mx-auto mb-2 border border-green-200 dark:border-green-700">
                <span className="text-green-700 dark:text-green-300 font-bold">3</span>
              </div>
              <h4 className="font-bold text-xs text-green-700 dark:text-green-300 mb-1">מעבר חלק</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">אנחנו מטפלים בהכל</p>
            </div>
          </div>

          {/* Benefits */}
          <div className="flex justify-center gap-6 text-xs">
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <Users className="w-3 h-3" />
              <span>50K+ משפחות</span>
            </div>
            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Shield className="w-3 h-3" />
              <span>0₪ עמלות</span>
            </div>
            <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
              <CheckCircle className="w-3 h-3" />
              <span>35% חיסכון ממוצע</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleStepsBanner;