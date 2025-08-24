import { ArrowRight, TrendingDown, TrendingUp, Sparkles } from 'lucide-react';
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
    <div className="relative overflow-hidden rounded-3xl shadow-elegant border-0">
      {/* Beautiful gradient background */}
      <div className="absolute inset-0 gradient-card opacity-90"></div>
      <div className="absolute inset-0">
        <div className="absolute top-6 right-8 w-24 h-24 bg-primary/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-8 left-6 w-16 h-16 bg-success/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-16 left-1/3 w-8 h-8 bg-primary-glow/20 rounded-full animate-bounce-gentle"></div>
      </div>

      {/* Elegant Header */}
      <div className="relative p-6 text-center border-b border-white/20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            השוואה חכמה
          </h3>
          <Sparkles className="h-5 w-5 text-primary animate-pulse delay-500" />
        </div>
        <p className="text-muted-foreground text-sm">המצב הנוכחי מול החדש</p>
      </div>

      <div className="relative p-6">
        {/* Modern Card Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Provider Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-destructive/10 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
            <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl p-6 border border-destructive/20 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-destructive/10 rounded-xl">
                  <TrendingDown className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h4 className="font-bold text-destructive">המצב הנוכחי</h4>
                  <p className="text-xs text-muted-foreground">{currentProvider}</p>
                </div>
              </div>
              
              <div className="text-center p-4 bg-destructive/5 rounded-xl">
                <p className="text-xs text-destructive/70 mb-1">תשלום חודשי</p>
                <div className="text-2xl font-black text-destructive">
                  ₪{currentAmount.toLocaleString()}
                </div>
                <p className="text-xs text-destructive/70">לחודש</p>
              </div>
            </div>
          </div>

          {/* Recommended Provider Card */}
          {recommendedPlan && (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-success/10 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
              <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl p-6 border border-success/20 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-success/10 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h4 className="font-bold text-success">הפתרון החכם</h4>
                    <p className="text-xs text-muted-foreground">{recommendedPlan.providerName}</p>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-success/5 rounded-xl">
                  <p className="text-xs text-success/70 mb-1">תשלום חודשי חדש</p>
                  <div className="text-2xl font-black text-success">
                    ₪{recommendedPlan.price.toLocaleString()}
                  </div>
                  <p className="text-xs text-success/70">לחודש</p>
                </div>
                
                <div className="mt-3 text-center">
                  <span className="inline-block px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                    {recommendedPlan.name}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Beautiful Savings Display */}
        <div className="mt-8 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 gradient-primary rounded-3xl transform scale-110 animate-pulse opacity-20"></div>
            <div className="relative gradient-primary text-white rounded-3xl px-8 py-6 shadow-glow">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">חיסכון חודשי</span>
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="text-3xl font-black">₪{monthlySavings.toLocaleString()}</div>
              <div className="text-sm opacity-90">כל חודש</div>
            </div>
          </div>
        </div>

        {/* Annual Savings */}
        <div className="mt-6 text-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <h4 className="text-lg font-bold text-primary mb-1">
            🎉 מזל טוב! חיסכון שנתי של {formatCurrency(annualSavings)}
          </h4>
          <p className="text-sm text-muted-foreground">זה כמו לקבל {Math.round(annualSavings / monthlySavings)} חודשים בחינם!</p>
        </div>
      </div>
    </div>
  );
};