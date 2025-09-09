import { TrendingUp, Calculator, DollarSign, Target, Sparkles, ArrowUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

interface CategorySavings {
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  currentAmount: number;
  newAmount: number;
  monthlySavings: number;
  currentProvider: string;
  newProvider: string;
}

interface SavingsComparisonHeaderProps {
  categorySavings: CategorySavings[];
}

const categoryLabels = {
  electricity: 'חשמל',
  cellular: 'סלולר',
  internet: 'אינטרנט',
  tv: 'טלוויזיה'
};

const categoryColors = {
  electricity: 'from-amber-500 to-orange-500',
  cellular: 'from-blue-500 to-purple-500',
  internet: 'from-green-500 to-teal-500',
  tv: 'from-pink-500 to-rose-500'
};

export const SavingsComparisonHeader = ({ categorySavings }: SavingsComparisonHeaderProps) => {
  const totalCurrentMonthly = categorySavings.reduce((sum, cat) => sum + cat.currentAmount, 0);
  const totalNewMonthly = categorySavings.reduce((sum, cat) => sum + cat.newAmount, 0);
  const totalMonthlySavings = categorySavings.reduce((sum, cat) => sum + cat.monthlySavings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;

  const animatedCurrentMonthly = useAnimatedCounter({ end: totalCurrentMonthly, duration: 2000 });
  const animatedNewMonthly = useAnimatedCounter({ end: totalNewMonthly, duration: 2000 });
  const animatedMonthlySavings = useAnimatedCounter({ end: totalMonthlySavings, duration: 2500 });
  const animatedAnnualSavings = useAnimatedCounter({ end: totalAnnualSavings, duration: 3000 });

  const savingsPercentage = totalCurrentMonthly > 0 ? Math.round((totalMonthlySavings / totalCurrentMonthly) * 100) : 0;

  return (
    <div className="mb-12 space-y-8">
      {/* Main Comparison Section */}
      <Card className="bg-gradient-to-br from-primary/5 via-background to-success/5 border-primary/20 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-success/3" />
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-primary-glow to-success" />
        
        <CardContent className="p-8 lg:p-12 relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-primary via-primary-glow to-success bg-clip-text text-transparent">
                השוואת החיסכון שלך
              </h2>
              <Sparkles className="h-8 w-8 text-success animate-pulse delay-500" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              כך תיראה ההוצאה החודשית והשנתית שלך לפני ואחרי המעבר
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Current State */}
            <div className="group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/5 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500" />
                <div className="relative bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-3xl p-8 border border-muted/30 hover:border-muted/50 transition-all duration-500">
                  <div className="text-center space-y-4">
                    <Calculator className="h-12 w-12 text-muted-foreground mx-auto" />
                    <h3 className="text-xl font-bold text-muted-foreground">המצב הנוכחי</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-4xl font-black text-muted-foreground">
                          ₪{animatedCurrentMonthly.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground/70">לחודש</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-muted-foreground">
                          ₪{(animatedCurrentMonthly * 12).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground/70">לשנה</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow/Savings Indicator */}
            <div className="flex items-center justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-success/5 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-success to-success/80 rounded-full flex flex-col items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <ArrowUp className="h-6 w-6 mb-1" />
                  <span className="text-xs font-bold">-{savingsPercentage}%</span>
                </div>
              </div>
            </div>

            {/* New State */}
            <div className="group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-success/5 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500" />
                <div className="relative bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-3xl p-8 border border-success/30 hover:border-success/50 transition-all duration-500">
                  <div className="text-center space-y-4">
                    <Target className="h-12 w-12 text-success mx-auto animate-pulse" />
                    <h3 className="text-xl font-bold text-success">המצב החדש</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-4xl font-black text-success">
                          ₪{animatedNewMonthly.toLocaleString()}
                        </p>
                        <p className="text-sm text-success/70">לחודש</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-success">
                          ₪{(animatedNewMonthly * 12).toLocaleString()}
                        </p>
                        <p className="text-sm text-success/70">לשנה</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Highlight */}
          <div className="bg-gradient-to-r from-success/10 via-success/5 to-primary/10 rounded-3xl p-8 border border-success/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
              <div className="space-y-2">
                <DollarSign className="h-8 w-8 text-success mx-auto" />
                <p className="text-sm text-muted-foreground">חיסכון חודשי</p>
                <p className="text-5xl font-black bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
                  ₪{animatedMonthlySavings.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <TrendingUp className="h-8 w-8 text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">חיסכון שנתי</p>
                <p className="text-5xl font-black bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  ₪{animatedAnnualSavings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categorySavings.map((category, index) => (
          <div key={category.category} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <Card className="bg-white/60 dark:bg-card/60 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <Badge 
                    variant="outline" 
                    className={`bg-gradient-to-r ${categoryColors[category.category]} text-white border-0 font-bold px-3 py-1`}
                  >
                    {categoryLabels[category.category]}
                  </Badge>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">מ-{category.currentProvider}</p>
                    <p className="text-xs text-muted-foreground">ל-{category.newProvider}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">נוכחי:</span>
                      <span className="font-semibold">₪{category.currentAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">חדש:</span>
                      <span className="font-semibold text-success">₪{category.newAmount}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span>חיסכון:</span>
                        <span className="text-success">₪{category.monthlySavings}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};