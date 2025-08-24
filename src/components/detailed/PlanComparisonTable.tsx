import { useState } from 'react';
import { Check, X, Star, Crown, ArrowRight, Phone, Globe, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { DigitalSignature } from '@/components/DigitalSignature';

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  features: string[];
  data?: string;
  minutes?: string;
  sms?: string;
  recommended?: boolean;
  discount?: number;
  provider: string;
  rating: number;
  description: string;
  savings: number;
}

interface PlanComparisonTableProps {
  category: 'electricity' | 'cellular' | 'internet';
  categoryName: string;
  currentProvider: string;
  currentAmount: number;
  plans: Plan[];
  onPlanSelect?: (plan: Plan) => void;
}

const categoryIcons = {
  electricity: Zap,
  cellular: Phone,
  internet: Globe
};

const categoryColors = {
  electricity: {
    gradient: 'from-golden-yellow to-sunset-orange',
    accent: 'text-golden-yellow',
    bg: 'bg-golden-yellow/10'
  },
  cellular: {
    gradient: 'from-electric-blue to-royal-purple',
    accent: 'text-electric-blue',
    bg: 'bg-electric-blue/10'
  },
  internet: {
    gradient: 'from-vibrant-green to-success-glow',
    accent: 'text-vibrant-green',
    bg: 'bg-vibrant-green/10'
  }
};

export const PlanComparisonTable = ({
  category,
  categoryName,
  currentProvider,
  currentAmount,
  plans,
  onPlanSelect
}: PlanComparisonTableProps) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showSignature, setShowSignature] = useState(false);

  const Icon = categoryIcons[category];
  const colors = categoryColors[category];

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowSignature(true);
    onPlanSelect?.(plan);
  };

  const bestPlan = plans.find(plan => plan.recommended) || plans[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Icon className={`h-8 w-8 ${colors.accent}`} />
          <h2 className="text-3xl font-bold">השוואת מסלולי {categoryName}</h2>
          <Icon className={`h-8 w-8 ${colors.accent}`} />
        </div>
        <p className="text-muted-foreground text-lg">
          בחר את המסלול המתאים לך ותתחיל לחסוך כבר החודש
        </p>
      </div>

      {/* Current Plan Card */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-destructive">המסלול הנוכחי שלך</CardTitle>
              <p className="text-muted-foreground">{currentProvider}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-destructive">
                ₪{currentAmount.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">לחודש</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Recommended Plans */}
      <div className="grid gap-6">
        {plans.slice(0, 4).map((plan) => (
          <Card 
            key={plan.id} 
            className={`group relative overflow-hidden transition-all duration-300 hover:shadow-elegant border-l-4 ${
              plan.recommended 
                ? `border-success shadow-colorful ${colors.bg}` 
                : 'border-border hover:border-primary/50'
            }`}
          >
            {/* Best deal ribbon */}
            {plan.recommended && (
              <div className={`absolute top-0 right-0 bg-gradient-to-r ${colors.gradient} text-white px-4 py-1 text-sm font-bold`}>
                <Crown className="inline h-4 w-4 mr-1" />
                מסלול מומלץ
              </div>
            )}

            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <Icon className={`h-6 w-6 ${colors.accent}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{plan.provider}</CardTitle>
                      <p className="text-muted-foreground">{plan.name}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < plan.rating ? 'text-golden-yellow fill-current' : 'text-muted-foreground'
                          }`} 
                        />
                      ))}
                      <span className="text-sm text-muted-foreground">({plan.rating})</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                  {/* Plan Details */}
                  {category === 'cellular' && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-accent/30 rounded-lg">
                        <div className="font-semibold">{plan.data || 'ללא הגבלה'}</div>
                        <div className="text-xs text-muted-foreground">נתונים</div>
                      </div>
                      <div className="text-center p-3 bg-accent/30 rounded-lg">
                        <div className="font-semibold">{plan.minutes || 'ללא הגבלה'}</div>
                        <div className="text-xs text-muted-foreground">דקות</div>
                      </div>
                      <div className="text-center p-3 bg-accent/30 rounded-lg">
                        <div className="font-semibold">{plan.sms || 'ללא הגבלה'}</div>
                        <div className="text-xs text-muted-foreground">SMS</div>
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <div className="space-y-2">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-success" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > 4 && (
                      <div className="text-sm text-muted-foreground">
                        +{plan.features.length - 4} תכונות נוספות
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Section */}
                <div className="text-left space-y-4 min-w-48">
                  <div className="text-center">
                    {plan.originalPrice && plan.originalPrice > plan.price && (
                      <div className="text-lg text-muted-foreground line-through">
                        ₪{plan.originalPrice.toLocaleString()}
                      </div>
                    )}
                    <div className={`text-4xl font-black ${plan.recommended ? 'text-success' : 'text-foreground'}`}>
                      ₪{plan.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">לחודש</div>
                    
                    {plan.discount && (
                      <Badge className="mt-2 bg-destructive text-white">
                        חיסכון {plan.discount}%
                      </Badge>
                    )}
                  </div>

                  {/* Savings Display */}
                  <div className="text-center p-4 bg-success/10 rounded-xl border border-success/20">
                    <div className="text-success font-bold text-lg">
                      חיסכון: {formatCurrency(currentAmount - plan.price)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      בחודש • {formatCurrency((currentAmount - plan.price) * 12)} בשנה
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className={`w-full bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white shadow-lg`}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    <ArrowRight className="ml-2 h-4 w-4" />
                    בחר מסלול זה
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Digital Signature Modal */}
      {showSignature && selectedPlan && (
        <DigitalSignature
          category={category}
          currentProvider={currentProvider}
          newProvider={selectedPlan.provider}
          newPlan={selectedPlan.name}
          monthlySavings={currentAmount - selectedPlan.price}
          open={showSignature}
          onOpenChange={setShowSignature}
        />
      )}
    </div>
  );
};