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
      "bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 relative overflow-hidden",
      isSelected && "ring-2 ring-primary ring-offset-2",
      plan.recommended && "border-2 border-success"
    )}>
      {/* Recommended/Popular badges */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        {plan.recommended && (
          <Badge className="bg-success text-success-foreground">
            מומלץ
          </Badge>
        )}
        {plan.popular && (
          <Badge className="bg-warning text-warning-foreground">
            פופולרי
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

      <CardHeader className="pt-12 pb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={cn("p-2 rounded-lg", categoryInfo.bgColor)}>
              <Icon className="h-5 w-5 text-white" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight">{plan.name}</h3>
            <p className="text-sm text-muted-foreground">{plan.provider}</p>
          </div>
        </div>

        {/* Rating */}
        {plan.rating && (
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-4 w-4 fill-golden-yellow text-golden-yellow" />
            <span className="text-sm font-medium">{plan.rating}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price and Savings */}
        <div className="text-center py-4 bg-gray-50 rounded-xl">
          <div className="text-3xl font-bold text-primary">
            ₪{plan.price}
            <span className="text-lg font-normal text-muted-foreground">/חודש</span>
          </div>
          {plan.savings > 0 && (
            <div className="mt-2">
              <div className="text-success font-semibold">
                חיסכון: ₪{plan.savings.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                ({savingsPercentage}% פחות מהמסלול הנוכחי)
              </div>
            </div>
          )}
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
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          size="lg"
        >
          {isLoading ? 'מתחבר...' : 'התחבר'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
        >
          <ExternalLink className="ml-2 h-3 w-3" />
          עריכה
        </Button>
      </CardFooter>
    </Card>
  );
};