import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Award, TrendingUp, CheckCircle } from 'lucide-react';
import { Provider, Plan } from '@/data/providers';
import { formatCurrency } from '@/lib/utils';

interface ProviderCardProps {
  provider: Provider;
  categoryIcon: React.ComponentType<any>;
  onSelectPlan: (provider: Provider, plan: Plan) => void;
  currentAmount?: number;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  categoryIcon: CategoryIcon,
  onSelectPlan,
  currentAmount = 0
}) => {
  const bestPlan = provider.plans.reduce((best, current) => 
    current.price < best.price ? current : best
  );

  const calculateSavings = (planPrice: number) => {
    if (provider.category === 'electricity') {
      const monthlyCurrentCost = currentAmount;
      const monthlyNewCost = planPrice * 850; // Average monthly kWh
      return monthlyCurrentCost - monthlyNewCost;
    }
    return currentAmount - planPrice;
  };

  const savings = calculateSavings(bestPlan.price);
  const savingsPercentage = currentAmount > 0 ? ((savings / currentAmount) * 100) : 0;

  return (
    <Card className="h-full shadow-elegant hover:shadow-2xl transition-all duration-300 group overflow-hidden border-0">
      {/* Header with gradient background */}
      <CardHeader className="bg-gradient-to-br from-primary/5 via-primary-glow/5 to-primary/10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
        
        <CardTitle className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="p-3 bg-gradient-to-br from-primary to-primary-glow rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
              <CategoryIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{provider.name}</h3>
              <p className="text-sm text-muted-foreground font-normal mt-1">
                {provider.description}
              </p>
            </div>
          </div>
          
          <div className="text-left">
            <div className="flex items-center space-x-1 rtl:space-x-reverse mb-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-semibold">{provider.rating}</span>
            </div>
            <p className="text-xs text-muted-foreground">מאז {provider.established}</p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Best Deal Highlight */}
        <div className="bg-gradient-to-r from-success/10 to-success/5 rounded-xl p-4 border border-success/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Award className="h-5 w-5 text-success" />
              <span className="font-semibold text-success">המחיר הטוב ביותר</span>
            </div>
            {savings > 0 && (
              <Badge className="bg-success text-success-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                חיסכון {savingsPercentage.toFixed(1)}%
              </Badge>
            )}
          </div>
          
          <div className="text-center">
            <p className="text-3xl font-bold text-success mb-1">
              {formatCurrency(provider.category === 'electricity' ? bestPlan.price * 850 : bestPlan.price)}
            </p>
            <p className="text-sm text-success/80">{bestPlan.name}</p>
            {savings > 0 && (
              <p className="text-xs text-success mt-2">
                חיסכון של {formatCurrency(savings)} בחודש
              </p>
            )}
          </div>
        </div>

        {/* Key Features */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-primary" />
            תכונות מרכזיות
          </h4>
          <div className="space-y-2">
            {bestPlan.features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <span>{feature}</span>
              </div>
            ))}
            {bestPlan.features.length > 4 && (
              <p className="text-xs text-primary font-medium">
                +{bestPlan.features.length - 4} תכונות נוספות
              </p>
            )}
          </div>
        </div>

        {/* Plans Count */}
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{provider.plans.length}</span> חבילות זמינות
          </p>
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => onSelectPlan(provider, bestPlan)}
          className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <Award className="h-4 w-4 ml-2" />
          בחר את החבילה הטובה ביותר
        </Button>
      </CardContent>
    </Card>
  );
};