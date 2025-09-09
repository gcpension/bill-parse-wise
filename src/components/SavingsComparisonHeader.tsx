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
    <div className="mb-8 space-y-6">
      {/* Compact Main Comparison Section */}
      <Card className="bg-gradient-to-br from-primary/5 via-background to-success/5 border-primary/20 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-success/3" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary-glow to-success" />
        
        <CardContent className="p-6 relative z-10">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-black bg-gradient-to-r from-primary via-primary-glow to-success bg-clip-text text-transparent mb-2">
              השוואת החיסכון שלך
            </h2>
            <p className="text-sm text-muted-foreground">
              כך תיראה ההוצאה החודשית והשנתית שלך לפני ואחרי המעבר
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Current State */}
            <div className="group">
              <div className="relative bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-2xl p-4 border border-muted/30 hover:border-muted/50 transition-all duration-300">
                <div className="text-center space-y-2">
                  <Calculator className="h-8 w-8 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-bold text-muted-foreground">המצב הנוכחי</h3>
                  
                  <div className="space-y-1">
                    <div>
                      <p className="text-2xl font-black text-muted-foreground">
                        ₪{animatedCurrentMonthly.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground/70">לחודש</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-muted-foreground">
                        ₪{(animatedCurrentMonthly * 12).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground/70">לשנה</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow/Savings Indicator */}
            <div className="flex items-center justify-center">
              <div className="relative group">
                <div className="w-16 h-16 bg-gradient-to-br from-success to-success/80 rounded-full flex flex-col items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <ArrowUp className="h-4 w-4 mb-1" />
                  <span className="text-xs font-bold">-{savingsPercentage}%</span>
                </div>
              </div>
            </div>

            {/* New State */}
            <div className="group">
              <div className="relative bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-2xl p-4 border border-success/30 hover:border-success/50 transition-all duration-300">
                <div className="text-center space-y-2">
                  <Target className="h-8 w-8 text-success mx-auto animate-pulse" />
                  <h3 className="text-lg font-bold text-success">המצב החדש</h3>
                  
                  <div className="space-y-1">
                    <div>
                      <p className="text-2xl font-black text-success">
                        ₪{animatedNewMonthly.toLocaleString()}
                      </p>
                      <p className="text-xs text-success/70">לחודש</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-success">
                        ₪{(animatedNewMonthly * 12).toLocaleString()}
                      </p>
                      <p className="text-xs text-success/70">לשנה</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Savings Highlight */}
          <div className="bg-gradient-to-r from-success/10 via-success/5 to-primary/10 rounded-2xl p-4 border border-success/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <DollarSign className="h-6 w-6 text-success mx-auto" />
                <p className="text-xs text-muted-foreground">חיסכון חודשי</p>
                <p className="text-3xl font-black bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent">
                  ₪{animatedMonthlySavings.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <TrendingUp className="h-6 w-6 text-primary mx-auto" />
                <p className="text-xs text-muted-foreground">חיסכון שנתי</p>
                <p className="text-3xl font-black bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  ₪{animatedAnnualSavings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compact Category Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categorySavings.map((category, index) => (
          <div key={category.category} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <Card className="bg-white/60 dark:bg-card/60 backdrop-blur-sm border border-border/50 hover:shadow-md transition-all duration-300">
              <CardContent className="p-3">
                <div className="text-center space-y-2">
                  <Badge 
                    variant="outline" 
                    className={`bg-gradient-to-r ${categoryColors[category.category]} text-white border-0 font-bold px-2 py-1 text-xs`}
                  >
                    {categoryLabels[category.category]}
                  </Badge>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">נוכחי:</span>
                      <span className="font-semibold">₪{category.currentAmount}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">חדש:</span>
                      <span className="font-semibold text-success">₪{category.newAmount}</span>
                    </div>
                    <div className="border-t pt-1">
                      <div className="flex justify-between text-xs font-bold">
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