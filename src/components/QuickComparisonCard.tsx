import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, TrendingDown, Star } from 'lucide-react';
import { ManualPlan } from '@/data/manual-plans';
import { cn } from '@/lib/utils';

interface QuickComparisonCardProps {
  plans: ManualPlan[];
  topPlanId: string;
  onSelectPlan: (plan: ManualPlan) => void;
  expectedSavings?: { monthly: number; annual: number }[];
}

export const QuickComparisonCard = ({ 
  plans, 
  topPlanId, 
  onSelectPlan,
  expectedSavings = []
}: QuickComparisonCardProps) => {
  if (plans.length === 0) return null;

  const topThree = plans.slice(0, 3);

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <h4 className="text-lg font-bold font-heebo mb-4">השוואה מהירה - 3 המסלולים המובילים</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topThree.map((plan, idx) => {
            const isTop = plan.id === topPlanId;
            const savings = expectedSavings[idx];
            
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative border-2 rounded-lg p-4 transition-all duration-200",
                  isTop 
                    ? "border-primary bg-primary/5 shadow-lg" 
                    : "border-border hover:border-primary/50"
                )}
              >
                {isTop && (
                  <Badge className="absolute -top-2 right-4 bg-gradient-to-r from-primary to-primary-glow">
                    <Star className="w-3 h-3 ml-1 fill-current" />
                    מומלץ ביותר
                  </Badge>
                )}
                
                <div className="mt-2 space-y-3">
                  <div>
                    <div className="font-bold font-heebo text-lg">{plan.company}</div>
                    <div className="text-sm text-muted-foreground font-assistant line-clamp-1">
                      {plan.planName}
                    </div>
                  </div>

                  {plan.regularPrice > 0 && (
                    <div className="text-center py-2">
                      <div className="text-2xl font-bold font-heebo text-primary">
                        ₪{plan.regularPrice}
                      </div>
                      <div className="text-xs text-muted-foreground">לחודש</div>
                    </div>
                  )}

                  {savings && savings.monthly > 0 && (
                    <div className="bg-green-50 dark:bg-green-950/20 rounded p-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-green-700 dark:text-green-400 text-sm font-bold">
                        <TrendingDown className="w-4 h-4" />
                        חיסכון: ₪{savings.monthly}/חודש
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    {plan.features.slice(0, 3).map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-1 text-xs font-assistant">
                        <Check className="w-3 h-3 shrink-0 mt-0.5 text-primary" />
                        <span className="line-clamp-1">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    variant={isTop ? "default" : "outline"}
                    onClick={() => onSelectPlan(plan)}
                    className="w-full font-heebo"
                  >
                    {isTop ? 'בחר מסלול זה' : 'פרטים נוספים'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
