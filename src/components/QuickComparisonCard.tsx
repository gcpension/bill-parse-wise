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
    <Card className="p-8 border border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/50">
          <div className="p-2 rounded-lg bg-primary/10">
            <Star className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-2xl font-heading font-semibold text-foreground">השוואה מהירה</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {topThree.map((plan, idx) => {
            const isTop = plan.id === topPlanId;
            const savings = expectedSavings[idx];
            
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative p-6 rounded-xl border transition-all hover:shadow-lg group",
                  isTop 
                    ? "border-primary/50 bg-primary/5 shadow-md" 
                    : "border-border/50 bg-card/80 hover:border-primary/30"
                )}
              >
                {isTop && (
                  <Badge className="absolute -top-3 right-4 bg-primary text-primary-foreground shadow-md px-3 py-1">
                    המומלץ ביותר
                  </Badge>
                )}
                
                <div className="space-y-4 mt-2">
                  <div>
                    <h4 className="font-heading font-semibold text-xl text-foreground mb-1">{plan.company}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">{plan.planName}</p>
                  </div>

                  {plan.regularPrice > 0 && (
                    <div className="pt-4 border-t border-border/50">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-heading font-bold text-primary">₪{plan.regularPrice}</span>
                        <span className="text-sm font-normal text-muted-foreground">/חודש</span>
                      </div>
                    </div>
                  )}

                  {savings && savings.monthly > 0 && (
                    <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 border border-green-200/50 dark:border-green-800/50">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-sm font-semibold">חיסכון ₪{savings.monthly}/חודש</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {plan.features.slice(0, 3).map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                        <span className="line-clamp-2">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    variant={isTop ? "default" : "outline"}
                    onClick={() => onSelectPlan(plan)}
                    className="w-full font-heading"
                  >
                    {isTop ? 'בחר תוכנית זו' : 'פרטים נוספים'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
