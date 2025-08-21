import { ArrowRight, DollarSign, Lightbulb } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ComparisonViewProps {
  currentProvider: string;
  currentAmount: number;
  recommendedPlan: any;
  monthlySavings: number;
  annualSavings: number;
}

export const ComparisonView = ({ 
  currentProvider, 
  currentAmount, 
  recommendedPlan, 
  monthlySavings,
  annualSavings 
}: ComparisonViewProps) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-slate-100 border shadow-2xl">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-200/30 via-primary/10 to-green-200/30 rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full translate-y-32 -translate-x-32 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative p-8 text-center bg-gradient-to-r from-slate-800/5 to-slate-600/5 backdrop-blur border-b">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
          השוואת עלויות חכמה
        </h3>
        <p className="text-slate-600 text-lg">המצב הנוכחי מול ההמלצה החדשה שלך</p>
        
        {/* Animated Separator */}
        <div className="flex items-center justify-center mt-6 space-x-6 rtl:space-x-reverse">
          <div className="h-1 bg-gradient-to-r from-transparent via-red-300 to-red-400 rounded-full flex-1 max-w-32"></div>
          <div className="relative p-3 bg-gradient-to-r from-orange-400 to-green-400 rounded-full shadow-xl animate-bounce">
            <ArrowRight className="h-6 w-6 text-white" />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-green-400 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="h-1 bg-gradient-to-r from-green-400 via-green-300 to-transparent rounded-full flex-1 max-w-32"></div>
        </div>
      </div>

      <div className="relative grid lg:grid-cols-2">
        {/* Current Provider - Red Card */}
        <div className="relative group p-8 bg-gradient-to-br from-red-50 via-rose-50 to-red-100/80 border-r border-slate-200/60">
          {/* Background Animations */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-red-400/20 to-transparent rounded-full -translate-y-20 translate-x-20 group-hover:scale-125 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-rose-400/15 to-transparent rounded-full translate-y-16 -translate-x-16 group-hover:scale-110 transition-transform duration-700"></div>
          
          {/* Warning Badge */}
          <div className="absolute top-6 right-6">
            <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
              ⚠️ יקר מדי
            </div>
          </div>

          <div className="relative space-y-8">
            {/* Icon Section */}
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-fit">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-rose-600 rounded-3xl blur-xl scale-125 opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative p-6 bg-gradient-to-br from-red-400 to-rose-600 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                  <DollarSign className="h-12 w-12 text-white" />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-red-700">המצב הנוכחי</h4>
              <p className="text-red-600 text-sm">💸 יקר מדי - צריך שיפור!</p>
            </div>

            {/* Provider Details */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-red-200/50 shadow-lg">
              <div className="text-center space-y-3">
                <p className="text-sm text-red-600 font-medium">הספק הנוכחי שלך</p>
                <h5 className="text-xl font-bold text-red-800">{currentProvider}</h5>
                <div className="text-xs text-red-500 bg-red-100 px-3 py-1 rounded-full inline-block">
                  זמן לשדרוג! 🔄
                </div>
              </div>
            </div>

            {/* Current Price Display */}
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-red-200/50 shadow-lg">
              <p className="text-sm text-red-600 font-medium mb-3">התשלום החודשי הנוכחי</p>
              <div className="relative">
                <div className="text-6xl font-black text-red-600 group-hover:scale-110 transition-transform duration-500">
                  ₪{currentAmount.toLocaleString()}
                </div>
                <div className="text-red-500 font-medium mt-2 text-lg">לחודש</div>
                
                {/* Expensive indicator */}
                <div className="absolute -top-4 -left-4 text-3xl animate-bounce">💸</div>
                <div className="absolute -bottom-2 -right-2 text-2xl animate-pulse">😰</div>
              </div>
              <div className="mt-4 text-red-600 text-sm font-medium bg-red-100/50 rounded-lg py-2 px-4">
                זה הרבה כסף! בואו נחפש פתרון...
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Provider - Green Card */}
        {recommendedPlan && (
          <div className="relative group p-8 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100/80">
            {/* Background Animations */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full -translate-y-20 -translate-x-20 group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-green-400/15 to-transparent rounded-full translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-700"></div>
            
            {/* Success Badge */}
            <div className="absolute top-6 left-6">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                ⭐ החיסכון שלך!
              </div>
            </div>

            <div className="relative space-y-8">
              {/* Icon Section */}
              <div className="text-center space-y-4">
                <div className="relative mx-auto w-fit">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-600 rounded-3xl blur-xl scale-125 opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                  <div className="relative p-6 bg-gradient-to-br from-emerald-400 to-green-600 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                    <Lightbulb className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-emerald-700">הפתרון החכם</h4>
                <p className="text-emerald-600 text-sm">💡 חיסכון מקסימלי מיד!</p>
              </div>

              {/* Provider Details */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 shadow-lg">
                <div className="text-center space-y-3">
                  <p className="text-sm text-emerald-600 font-medium">הספק המומלץ החדש</p>
                  <h5 className="text-xl font-bold text-emerald-800">{recommendedPlan.providerName}</h5>
                  <div className="space-y-2">
                    <div className="text-xs text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full inline-block">
                      {recommendedPlan.name}
                    </div>
                    <div className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full inline-block">
                      מבחירת המומחים 🏆
                    </div>
                  </div>
                </div>
              </div>

              {/* New Price Display */}
              <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-emerald-200/50 shadow-lg">
                <p className="text-sm text-emerald-600 font-medium mb-3">התשלום החודשי החדש</p>
                <div className="relative">
                  <div className="text-6xl font-black text-emerald-600 group-hover:scale-110 transition-transform duration-500">
                    ₪{recommendedPlan.price.toLocaleString()}
                  </div>
                  <div className="text-emerald-500 font-medium mt-2 text-lg">לחודש</div>
                  
                  {/* Success indicators */}
                  <div className="absolute -top-4 -right-4 text-3xl animate-bounce">💚</div>
                  <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse">🎉</div>
                </div>
                <div className="mt-4 text-emerald-600 text-sm font-medium bg-emerald-100/50 rounded-lg py-2 px-4">
                  המחיר הטוב ביותר עבורך!
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Floating Savings Circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-glow to-success rounded-full animate-ping opacity-30 scale-125"></div>
            <div className="relative bg-gradient-to-r from-primary via-primary-glow to-success text-white rounded-full p-6 shadow-2xl border-4 border-white animate-pulse">
              <div className="text-center">
                <div className="text-xs font-bold">💰 חיסכון</div>
                <div className="text-xl font-black">₪{monthlySavings.toLocaleString()}</div>
                <div className="text-xs">בחודש</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Summary */}
      <div className="relative p-8 bg-gradient-to-r from-success/10 via-primary/5 to-success/10 border-t border-slate-200/50">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
            <div className="text-4xl animate-bounce">🎊</div>
            <h4 className="text-2xl font-bold text-success">
              מזל טוב! תחסוך {formatCurrency(monthlySavings)} בחודש!
            </h4>
            <div className="text-4xl animate-bounce delay-300">🎉</div>
          </div>
          <div className="flex items-center justify-center space-x-8 rtl:space-x-reverse text-sm">
            <div className="text-center">
              <p className="font-bold text-lg text-primary">₪{annualSavings.toLocaleString()}</p>
              <p className="text-muted-foreground">חיסכון שנתי</p>
            </div>
            <div className="text-4xl">💎</div>
            <div className="text-center">
              <p className="font-bold text-lg text-purple-600">{Math.round(annualSavings / 1000)}</p>
              <p className="text-muted-foreground">משכורות נוספות</p>
            </div>
          </div>
          <p className="text-slate-600 font-medium bg-white/60 rounded-full py-2 px-6 inline-block">
            זה כמו לקבל בונוס של {formatCurrency(annualSavings)} בשנה! 🚀
          </p>
        </div>
      </div>
    </div>
  );
};