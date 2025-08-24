import { useState } from 'react';
import { ArrowRight, TrendingUp, Award, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { DigitalSignature } from '@/components/DigitalSignature';

interface CategoryCardProps {
  category: 'electricity' | 'cellular' | 'internet';
  currentProvider: string;
  currentAmount: number;
  recommendedPlan: any;
  monthlySavings: number;
  annualSavings: number;
  allProviders: any[];
  icon: React.ElementType;
  name: string;
  index: number;
}

const categoryColors = {
  electricity: {
    gradient: 'from-yellow-500 to-orange-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400'
  },
  cellular: {
    gradient: 'from-blue-500 to-purple-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400'
  },
  internet: {
    gradient: 'from-green-500 to-teal-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400'
  }
};

export const CategoryCard = ({
  category,
  currentProvider,
  currentAmount,
  recommendedPlan,
  monthlySavings,
  annualSavings,
  allProviders,
  icon: Icon,
  name,
  index
}: CategoryCardProps) => {
  const [showPlans, setShowPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(recommendedPlan);
  const [showSignature, setShowSignature] = useState(false);

  const colors = categoryColors[category];
  const savingsPercentage = Math.round((monthlySavings / currentAmount) * 100);

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setShowPlans(false);
  };

  return (
    <Card 
      className={`group relative overflow-hidden shadow-card hover:shadow-elegant transition-all duration-500 animate-slide-up ${colors.border} border-l-4`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Animated background gradient */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
      
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${colors.bg} ${colors.border} border`}>
              <Icon className={`h-6 w-6 ${colors.icon}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold">{name}</h3>
              <p className="text-muted-foreground text-sm">{currentProvider}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-destructive">
              ₪{currentAmount.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">תשלום נוכחי</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Savings Comparison */}
        <div className="relative">
          <div className="absolute inset-0 gradient-card rounded-xl opacity-50"></div>
          <div className="relative p-6 rounded-xl border">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">מצב נוכחי</span>
                </div>
                <div className="text-2xl font-black text-destructive">
                  ₪{currentAmount.toLocaleString()}
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">מצב מומלץ</span>
                </div>
                <div className="text-2xl font-black text-success">
                  ₪{selectedPlan?.price.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Badge className={`bg-gradient-to-r ${colors.gradient} text-white px-4 py-2`}>
                חיסכון של {formatCurrency(monthlySavings)} בחודש ({savingsPercentage}%)
              </Badge>
            </div>
          </div>
        </div>

        {/* Recommended Plan Details */}
        {selectedPlan && (
          <div className={`p-4 rounded-xl ${colors.bg} ${colors.border} border`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold">{selectedPlan.providerName}</h4>
                <p className="text-sm text-muted-foreground">{selectedPlan.name}</p>
              </div>
              {selectedPlan.recommended && (
                <Badge className="bg-gradient-to-r from-success to-green-500 text-white">
                  <Award className="mr-1 h-3 w-3" />
                  מומלץ
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">חיסכון שנתי:</span>
                <div className="font-semibold text-success">{formatCurrency(annualSavings)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">דירוג ספק:</span>
                <div className="font-semibold">⭐ {selectedPlan.rating}/5</div>
              </div>
            </div>
          </div>
        )}

        {/* Alternative Plans */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => setShowPlans(!showPlans)}
            className="w-full justify-between"
          >
            <span>הצג חבילות נוספות ({allProviders.length})</span>
            {showPlans ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {showPlans && (
            <div className="space-y-3">
              {allProviders.slice(0, 3).map((provider) =>
                provider.plans.slice(0, 2).map((plan: any) => (
                  <div
                    key={plan.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedPlan?.id === plan.id 
                        ? `${colors.bg} ${colors.border} border-2` 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handlePlanSelect({ ...plan, providerName: provider.name, rating: provider.rating })}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-semibold">{provider.name}</h5>
                        <p className="text-sm text-muted-foreground">{plan.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">₪{plan.price}</div>
                        <div className="text-xs text-muted-foreground">לחודש</div>
                      </div>
                    </div>
                    {plan.features && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {plan.features.slice(0, 2).join(' • ')}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4 border-t">
          <Button 
            className={`bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white shadow-lg transform hover:scale-105 transition-all duration-300`}
            onClick={() => setShowSignature(true)}
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            עבור ל{selectedPlan?.providerName}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            חיסכון צפוי: {formatCurrency(monthlySavings)} בחודש • {formatCurrency(annualSavings)} בשנה
          </div>
        </div>
      </CardContent>

      {/* Digital Signature Modal */}
      {showSignature && (
        <DigitalSignature
          category={category}
          currentProvider={currentProvider}
          newProvider={selectedPlan?.providerName || ''}
          newPlan={selectedPlan?.name || ''}
          monthlySavings={monthlySavings}
          open={showSignature}
          onOpenChange={setShowSignature}
        />
      )}
    </Card>
  );
};