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

  const animatedCurrentMonthly = useAnimatedCounter({ end: totalCurrentMonthly, duration: 1500 });
  const animatedNewMonthly = useAnimatedCounter({ end: totalNewMonthly, duration: 1500 });
  const animatedMonthlySavings = useAnimatedCounter({ end: totalMonthlySavings, duration: 2000 });
  const animatedAnnualSavings = useAnimatedCounter({ end: totalAnnualSavings, duration: 2000 });

  const savingsPercentage = totalCurrentMonthly > 0 ? Math.round((totalMonthlySavings / totalCurrentMonthly) * 100) : 0;

  return (
    <div className="mb-6 space-y-4">
      {/* Ultra Compact Main Comparison */}
      <Card className="bg-gradient-to-r from-primary/5 to-success/5 border-primary/20">
        <CardContent className="p-4">
          <div className="text-center mb-3">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent mb-1">
              השוואת החיסכון שלך
            </h2>
            <p className="text-xs text-muted-foreground">לפני ואחרי המעבר</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            {/* Current State */}
            <div className="bg-muted/30 rounded-xl p-3 text-center">
              <Calculator className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">נוכחי</h3>
              <p className="text-lg font-bold text-muted-foreground">₪{animatedCurrentMonthly.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground/70">לחודש</p>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center text-white text-xs font-bold">
                -{savingsPercentage}%
              </div>
            </div>

            {/* New State */}
            <div className="bg-success/10 rounded-xl p-3 text-center border border-success/20">
              <Target className="h-5 w-5 text-success mx-auto mb-1" />
              <h3 className="text-sm font-semibold text-success mb-1">חדש</h3>
              <p className="text-lg font-bold text-success">₪{animatedNewMonthly.toLocaleString()}</p>
              <p className="text-xs text-success/70">לחודש</p>
            </div>
          </div>

          {/* Compact Savings Display */}
          <div className="grid grid-cols-2 gap-2 bg-gradient-to-r from-success/5 to-primary/5 rounded-lg p-3 border border-success/10">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">חיסכון חודשי</p>
              <p className="text-2xl font-black text-success">₪{animatedMonthlySavings.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">חיסכון שנתי</p>
              <p className="text-2xl font-black text-primary">₪{animatedAnnualSavings.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ultra Compact Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {categorySavings.map((category, index) => (
          <Card key={category.category} className="bg-card/60 border-border/30">
            <CardContent className="p-2">
              <div className="text-center space-y-1">
                <Badge 
                  variant="outline" 
                  className={`bg-gradient-to-r ${categoryColors[category.category]} text-white border-0 text-xs px-2 py-0.5`}
                >
                  {categoryLabels[category.category]}
                </Badge>
                
                <div className="space-y-0.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">נוכחי:</span>
                    <span className="font-medium">₪{category.currentAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">חדש:</span>
                    <span className="font-medium text-success">₪{category.newAmount}</span>
                  </div>
                  <div className="border-t pt-0.5">
                    <div className="flex justify-between font-bold">
                      <span>חיסכון:</span>
                      <span className="text-success">₪{category.monthlySavings}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};