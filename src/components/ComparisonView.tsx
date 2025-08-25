import { ArrowRight, TrendingDown, TrendingUp, Sparkles, Zap, Target } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

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
    <Card className="bg-gradient-to-br from-background/50 via-background/80 to-background/50 backdrop-blur-xl border-primary/20 shadow-2xl overflow-hidden relative">
      {/* Magical background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-tr from-success/20 to-transparent rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-primary-glow/10 to-transparent rounded-full blur-lg animate-bounce"></div>
      </div>

      {/* Elegant Header */}
      <div className="relative p-6 text-center border-b border-primary/10 bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Zap className="h-6 w-6 text-primary animate-pulse" />
          <h3 className="text-2xl font-black bg-gradient-to-r from-primary via-primary-glow to-success bg-clip-text text-transparent">
            השוואה חכמה ומדויקת
          </h3>
          <Zap className="h-6 w-6 text-primary animate-pulse delay-500" />
        </div>
        <p className="text-muted-foreground">המצב הנוכחי לעומת הפתרון המומלץ</p>
      </div>

      <CardContent className="p-8 relative z-10">
        {/* Enhanced Card Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Current Provider Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-500 blur-sm"></div>
            <Card className="relative bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm rounded-3xl border-destructive/30 shadow-xl group-hover:shadow-2xl transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-destructive/20 to-destructive/10 rounded-2xl shadow-lg">
                    <TrendingDown className="h-8 w-8 text-destructive" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-destructive">המצב הנוכחי</h4>
                    <p className="text-sm text-muted-foreground font-medium">{currentProvider}</p>
                  </div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-2xl border border-destructive/20">
                  <p className="text-sm text-destructive/70 mb-2 font-medium">תשלום חודשי נוכחי</p>
                  <div className="text-4xl font-black text-destructive mb-1">
                    ₪{currentAmount.toLocaleString()}
                  </div>
                  <p className="text-xs text-destructive/60">לחודש</p>
                </div>
                
                <div className="mt-4 text-center p-3 bg-destructive/5 rounded-xl">
                  <p className="text-sm text-destructive/80 font-medium">💸 יקר מהנדרש</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Provider Card */}
          {recommendedPlan && (
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-success/5 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-500 blur-sm"></div>
              <Card className="relative bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm rounded-3xl border-success/30 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-success/20 to-success/10 rounded-2xl shadow-lg">
                      <TrendingUp className="h-8 w-8 text-success" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-success">הפתרון החכם</h4>
                      <p className="text-sm text-muted-foreground font-medium">{recommendedPlan.providerName}</p>
                    </div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-success/10 to-success/5 rounded-2xl border border-success/20">
                    <p className="text-sm text-success/70 mb-2 font-medium">תשלום חודשי חדש</p>
                    <div className="text-4xl font-black text-success mb-1">
                      ₪{recommendedPlan.price.toLocaleString()}
                    </div>
                    <p className="text-xs text-success/60">לחודש</p>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-success/20 to-success/10 text-success text-sm font-bold rounded-2xl border border-success/20">
                      {recommendedPlan.name}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Enhanced Savings Display */}
        <div className="mt-10 text-center">
          <div className="relative inline-block group">
            {/* Magical glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-glow to-success rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 scale-110 animate-pulse"></div>
            
            <Card className="relative bg-gradient-to-r from-primary via-primary-glow to-success text-white rounded-3xl shadow-2xl border-0 group-hover:scale-105 transition-transform duration-500">
              <CardContent className="px-12 py-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Sparkles className="h-6 w-6 animate-bounce" />
                  <span className="text-lg font-bold">החיסכון החודשי שלך</span>
                  <Sparkles className="h-6 w-6 animate-bounce delay-300" />
                </div>
                <div className="text-5xl font-black mb-2">₪{monthlySavings.toLocaleString()}</div>
                <div className="text-lg opacity-90 font-medium">כל חודש בשנה הקרובה</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Annual Savings Celebration */}
        <Card className="mt-8 bg-gradient-to-br from-primary/10 via-primary-glow/5 to-success/10 border-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
          <CardContent className="p-8 relative z-10">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Target className="h-8 w-8 text-primary animate-pulse" />
                <h4 className="text-2xl font-black bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                  מזל טוב! חיסכון שנתי מדהים
                </h4>
                <Target className="h-8 w-8 text-primary animate-pulse delay-500" />
              </div>
              
              <div className="text-6xl font-black text-primary animate-pulse">
                {formatCurrency(annualSavings)}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-primary/20">
                  <p className="text-lg font-bold text-primary">
                    🎉 זה כמו לקבל {Math.round(annualSavings / monthlySavings)} חודשים בחינם!
                  </p>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-success/20">
                  <p className="text-lg font-bold text-success">
                    💰 חיסכון של {formatCurrency(annualSavings * 5)} ב-5 שנים!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};