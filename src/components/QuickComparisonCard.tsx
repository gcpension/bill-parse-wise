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
    <Card className="glass-effect border-2 border-slate-200 shadow-2xl overflow-hidden">
      <CardContent className="p-10">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-purple-600">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900">השוואה מהירה</h3>
          </div>
        
          <div className="grid md:grid-cols-3 gap-8">
            {topThree.map((plan, idx) => {
              const isTop = plan.id === topPlanId;
              const savings = expectedSavings[idx];
              
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative p-8 rounded-2xl border-2 transition-all duration-300 hover-lift",
                    isTop 
                      ? "border-primary bg-gradient-to-br from-primary/5 to-purple-500/5 shadow-xl" 
                      : "border-slate-200 bg-white hover:border-primary/40"
                  )}
                >
                  {isTop && (
                    <div className="absolute -top-4 right-6">
                      <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg px-4 py-1.5 text-sm font-bold">
                        ⭐ המומלץ ביותר
                      </Badge>
                    </div>
                  )}
                  
                  <div className="space-y-6 mt-2">
                    <div>
                      <h4 className="text-2xl font-bold text-slate-900 mb-2">{plan.company}</h4>
                      <p className="text-slate-600 line-clamp-2 text-sm">{plan.planName}</p>
                    </div>

                    {plan.regularPrice > 0 && (
                      <div className="pt-6 border-t-2 border-slate-100">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            ₪{plan.regularPrice}
                          </span>
                          <span className="text-slate-500">/חודש</span>
                        </div>
                      </div>
                    )}

                    {savings && savings.monthly > 0 && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                        <div className="flex items-center gap-2 text-green-700 font-bold">
                          <TrendingDown className="w-5 h-5" />
                          <span>חיסכון ₪{savings.monthly}/חודש</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {plan.features.slice(0, 3).map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                          <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      size="lg"
                      variant={isTop ? "default" : "outline"}
                      onClick={() => onSelectPlan(plan)}
                      className={cn(
                        "w-full rounded-xl font-bold text-base h-12",
                        isTop && "bg-gradient-to-r from-primary to-purple-600 hover:scale-105 transition-transform shadow-lg"
                      )}
                    >
                      {isTop ? 'בחר תוכנית זו ✓' : 'פרטים נוספים'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
