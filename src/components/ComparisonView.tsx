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
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 via-white to-slate-100 border shadow-md">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200/30 via-primary/10 to-green-200/30 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full translate-y-10 -translate-x-10 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative p-4 text-center bg-gradient-to-r from-slate-800/5 to-slate-600/5 backdrop-blur border-b">
        <h3 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1">
          השוואה חכמה
        </h3>
        <p className="text-slate-600 text-sm">המצב הנוכחי מול החדש</p>
        
        {/* Animated Separator */}
        <div className="flex items-center justify-center mt-3 space-x-4 rtl:space-x-reverse">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-red-300 to-red-400 rounded-full flex-1 max-w-16"></div>
          <div className="relative p-2 bg-gradient-to-r from-orange-400 to-green-400 rounded-full shadow-md">
            <ArrowRight className="h-3 w-3 text-white" />
          </div>
          <div className="h-0.5 bg-gradient-to-r from-green-400 via-green-300 to-transparent rounded-full flex-1 max-w-16"></div>
        </div>
      </div>

      <div className="relative grid lg:grid-cols-2">
        {/* Current Provider - Red Card */}
        <div className="relative group p-4 bg-gradient-to-br from-red-50 via-rose-50 to-red-100/80 border-r border-slate-200/60">
          {/* Background Animations */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-red-400/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
          
          {/* Warning Badge */}
          <div className="absolute top-2 right-2">
            <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              ⚠️ יקר
            </div>
          </div>

          <div className="relative space-y-4">
            {/* Icon Section */}
            <div className="text-center space-y-2">
              <div className="relative mx-auto w-fit">
                <div className="relative p-3 bg-gradient-to-br from-red-400 to-rose-600 rounded-xl shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-red-700">המצב הנוכחי</h4>
            </div>

            {/* Provider Details */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-red-200/50 shadow-sm">
              <div className="text-center space-y-1">
                <p className="text-xs text-red-600 font-medium">הספק הנוכחי</p>
                <h5 className="text-sm font-bold text-red-800">{currentProvider}</h5>
              </div>
            </div>

            {/* Current Price Display */}
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-red-200/50 shadow-sm">
              <p className="text-xs text-red-600 font-medium mb-2">תשלום חודשי נוכחי</p>
              <div className="relative">
                <div className="text-2xl font-black text-red-600">
                  ₪{currentAmount.toLocaleString()}
                </div>
                <div className="text-red-500 font-medium text-sm">לחודש</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Provider - Green Card */}
        {recommendedPlan && (
          <div className="relative group p-4 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100/80">
            {/* Background Animations */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full -translate-y-10 -translate-x-10"></div>
            
            {/* Success Badge */}
            <div className="absolute top-2 left-2">
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                ⭐ חיסכון
              </div>
            </div>

            <div className="relative space-y-4">
              {/* Icon Section */}
              <div className="text-center space-y-2">
                <div className="relative mx-auto w-fit">
                  <div className="relative p-3 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl shadow-lg">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-emerald-700">הפתרון החכם</h4>
              </div>

              {/* Provider Details */}
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-emerald-200/50 shadow-sm">
                <div className="text-center space-y-1">
                  <p className="text-xs text-emerald-600 font-medium">ספק מומלץ</p>
                  <h5 className="text-sm font-bold text-emerald-800">{recommendedPlan.providerName}</h5>
                  <div className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                    {recommendedPlan.name}
                  </div>
                </div>
              </div>

              {/* New Price Display */}
              <div className="text-center bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-emerald-200/50 shadow-sm">
                <p className="text-xs text-emerald-600 font-medium mb-2">תשלום חודשי חדש</p>
                <div className="relative">
                  <div className="text-2xl font-black text-emerald-600">
                    ₪{recommendedPlan.price.toLocaleString()}
                  </div>
                  <div className="text-emerald-500 font-medium text-sm">לחודש</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Floating Savings Circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative">
            <div className="relative bg-gradient-to-r from-primary via-primary-glow to-success text-white rounded-full p-3 shadow-lg border-2 border-white">
              <div className="text-center">
                <div className="text-xs font-bold">חיסכון</div>
                <div className="text-sm font-black">₪{monthlySavings.toLocaleString()}</div>
                <div className="text-xs">בחודש</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Summary */}
      <div className="relative p-3 bg-gradient-to-r from-success/10 via-primary/5 to-success/10 border-t border-slate-200/50">
        <div className="text-center space-y-2">
          <h4 className="text-sm font-bold text-success">
            מזל טוב! תחסוך {formatCurrency(monthlySavings)} בחודש!
          </h4>
          <div className="flex items-center justify-center space-x-6 rtl:space-x-reverse text-xs">
            <div className="text-center">
              <p className="font-bold text-sm text-primary">₪{annualSavings.toLocaleString()}</p>
              <p className="text-muted-foreground">חיסכון שנתי</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};