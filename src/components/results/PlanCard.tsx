import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Star, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Plan {
  id: string;
  name: string;
  provider: string;
  price: number;
  rating?: number;
  category: string;
  currentAmount: number;
  savings: number;
  recommended?: boolean;
  popular?: boolean;
  features: string[];
  data?: string;
  minutes?: string;
  sms?: string;
}

interface PlanCardProps {
  plan: Plan;
  categoryConfig: any;
  selectedPlans: Set<string>;
  setSelectedPlans: (plans: Set<string>) => void;
  onConnect: (planId: string) => void;
  isLoading: boolean;
}

export const PlanCard = ({ 
  plan, 
  categoryConfig, 
  selectedPlans, 
  setSelectedPlans, 
  onConnect,
  isLoading 
}: PlanCardProps) => {
  const [showFullDetails, setShowFullDetails] = useState(false);
  
  const categoryInfo = categoryConfig[plan.category];
  const Icon = categoryInfo?.icon;
  const isSelected = selectedPlans.has(plan.id);
  
  const toggleSelection = () => {
    const newSelected = new Set(selectedPlans);
    if (isSelected) {
      newSelected.delete(plan.id);
    } else {
      newSelected.add(plan.id);
    }
    setSelectedPlans(newSelected);
  };

  const savingsPercentage = plan.currentAmount > 0 
    ? Math.round((plan.savings / plan.currentAmount) * 100) 
    : 0;

  return (
    <Card className={cn(
      "group relative bg-gradient-to-br from-background to-muted/30 rounded-3xl shadow-card hover:shadow-elegant transition-all duration-500 overflow-hidden border-0 hover:scale-[1.02]",
      isSelected && "ring-2 ring-primary ring-offset-2 shadow-glow",
      plan.recommended && "ring-2 ring-success shadow-colorful bg-gradient-to-br from-success/5 to-success-glow/5"
    )}>
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Enhanced Recommended/Popular badges */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        {plan.recommended && (
          <Badge className="gradient-success text-white shadow-glow animate-pulse">
            🏆 מומלץ
          </Badge>
        )}
        {plan.popular && (
          <Badge className="bg-gradient-to-r from-warning to-warning-glow text-white shadow-colorful">
            🔥 פופולרי
          </Badge>
        )}
      </div>

      {/* Selection checkbox */}
      <div className="absolute top-4 right-4 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={toggleSelection}
          className="h-5 w-5"
        />
      </div>

      <CardHeader className="relative pt-12 pb-6">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className={cn("relative p-3 rounded-2xl shadow-colorful group-hover:scale-110 transition-transform duration-300", categoryInfo.bgColor)}>
              <Icon className="h-6 w-6 text-white" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-bold text-xl leading-tight gradient-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              {plan.name}
            </h3>
            <p className="text-base text-muted-foreground font-medium mt-1">{plan.provider}</p>
          </div>
        </div>

        {/* Enhanced Rating */}
        {plan.rating && (
          <div className="flex items-center gap-2 mt-3 bg-primary/10 rounded-full px-3 py-1 w-fit">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(plan.rating || 0) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm font-bold">{plan.rating}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Enhanced Price and Savings */}
        <div className="relative text-center py-6 bg-gradient-to-br from-primary/5 to-primary-glow/5 rounded-2xl border border-primary/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="text-4xl font-black gradient-primary bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
              ₪{plan.price.toLocaleString()}
              <span className="text-xl font-medium text-muted-foreground">/חודש</span>
            </div>
            {plan.savings > 0 && (
              <div className="mt-4 bg-success/10 border border-success/20 rounded-xl p-3">
                <div className="text-success font-bold text-lg">
                  💰 חיסכון: ₪{plan.savings.toLocaleString()}
                </div>
                <div className="text-sm text-success/80 mt-1">
                  {savingsPercentage}% פחות • ₪{(plan.savings * 12).toLocaleString()} לשנה
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category-specific details */}
        {plan.category === 'cellular' && (
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center p-2 bg-indigo-50 rounded-lg">
              <div className="font-semibold text-indigo-700">{plan.data || 'ללא הגבלה'}</div>
              <div className="text-indigo-600">נתונים</div>
            </div>
            <div className="text-center p-2 bg-indigo-50 rounded-lg">
              <div className="font-semibold text-indigo-700">{plan.minutes || 'ללא הגבלה'}</div>
              <div className="text-indigo-600">דקות</div>
            </div>
            <div className="text-center p-2 bg-indigo-50 rounded-lg">
              <div className="font-semibold text-indigo-700">{plan.sms || 'ללא הגבלה'}</div>
              <div className="text-indigo-600">SMS</div>
            </div>
          </div>
        )}

        {/* Key Features */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">מה כלול:</h4>
          <div className="space-y-1">
            {plan.features.slice(0, showFullDetails ? undefined : 3).map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 bg-success rounded-full"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
          
          {plan.features.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullDetails(!showFullDetails)}
              className="text-xs p-0 h-auto font-normal"
            >
              {showFullDetails ? (
                <>פחות פרטים <ChevronUp className="mr-1 h-3 w-3" /></>
              ) : (
                <>פרטי מסלול מלאים <ChevronDown className="mr-1 h-3 w-3" /></>
              )}
            </Button>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4 flex flex-col gap-3">
        <Button 
          onClick={() => onConnect(plan.id)}
          disabled={isLoading}
          className="w-full gradient-primary text-white shadow-glow hover:shadow-elegant transition-all duration-500 relative overflow-hidden group/btn"
          size="lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
          <span className="relative z-10 font-bold">
            {isLoading ? '⏳ מתחבר...' : '🚀 התחבר'}
          </span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full text-sm border-2 hover:border-primary hover:bg-primary/5 transition-colors duration-300"
        >
          <ExternalLink className="ml-2 h-4 w-4" />
          פרטים נוספים
        </Button>
      </CardFooter>
    </Card>
  );
};