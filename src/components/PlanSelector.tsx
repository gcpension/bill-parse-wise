import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  Check, 
  X, 
  Info, 
  Zap, 
  Wifi, 
  Smartphone,
  Award,
  TrendingUp,
  ShieldCheck,
  Phone,
  Globe
} from 'lucide-react';
import { getProvidersByCategory, Provider, Plan } from '@/data/providers';
import { formatCurrency } from '@/lib/utils';

interface PlanSelectorProps {
  category: 'electricity' | 'cellular' | 'internet';
  onPlanSelect: (provider: Provider, plan: Plan) => void;
  currentAmount?: number;
  dense?: boolean;
  showHeader?: boolean;
}

const categoryIcons = {
  electricity: Zap,
  cellular: Smartphone,
  internet: Wifi
};

const categoryNames = {
  electricity: 'חשמל',
  cellular: 'סלולר',
  internet: 'אינטרנט'
};

export const PlanSelector: React.FC<PlanSelectorProps> = ({ 
  category, 
  onPlanSelect, 
  currentAmount = 0 
}) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'savings'>('savings');

  useEffect(() => {
    const providerData = getProvidersByCategory(category);
    setProviders(providerData);
  }, [category]);

  const CategoryIcon = categoryIcons[category];

  const sortedProviders = [...providers].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        const minPriceA = Math.min(...a.plans.map(p => p.price));
        const minPriceB = Math.min(...b.plans.map(p => p.price));
        return minPriceA - minPriceB;
      case 'rating':
        return b.rating - a.rating;
      case 'savings':
        const maxSavingsA = Math.max(...a.plans.map(p => currentAmount - p.price));
        const maxSavingsB = Math.max(...b.plans.map(p => currentAmount - p.price));
        return maxSavingsB - maxSavingsA;
      default:
        return 0;
    }
  });

  const calculateSavings = (planPrice: number) => {
    if (category === 'electricity') {
      const monthlyCurrentCost = currentAmount;
      const monthlyNewCost = planPrice * 850; // Average monthly kWh
      return monthlyCurrentCost - monthlyNewCost;
    }
    return currentAmount - planPrice;
  };

  const PlanDetailsModal = ({ provider, plan }: { provider: Provider; plan: Plan }) => {
    const savings = calculateSavings(plan.price);
    const savingsPercentage = currentAmount > 0 ? ((savings / currentAmount) * 100) : 0;

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Info className="h-4 w-4 ml-1" />
            פרטים מלאים
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3 rtl:space-x-reverse text-2xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CategoryIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span>{plan.name}</span>
                <p className="text-sm text-muted-foreground font-normal mt-1">
                  {provider.name} • מאז {provider.established}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Price and Savings */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4 text-center">
                  <h4 className="text-lg font-semibold mb-2">מחיר חודשי</h4>
                  <div className="space-y-1">
                    {plan.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatCurrency(category === 'electricity' ? plan.originalPrice * 850 : plan.originalPrice)}
                      </p>
                    )}
                    <p className="text-3xl font-bold text-primary">
                      {formatCurrency(category === 'electricity' ? plan.price * 850 : plan.price)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {category === 'electricity' ? 'לחודש (850 קוט"ש)' : 'לחודש'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {savings > 0 && (
                <Card className="border-success/20 bg-success/5">
                  <CardContent className="p-4 text-center">
                    <h4 className="text-lg font-semibold mb-2 text-success">חיסכון צפוי</h4>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-success">
                        {formatCurrency(savings)}
                      </p>
                      <p className="text-sm text-success">
                        לחודש • {savingsPercentage.toFixed(1)}% חיסכון
                      </p>
                      <p className="text-xs text-success/80">
                        {formatCurrency(savings * 12)} לשנה
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Plan Description */}
            <div>
              <h4 className="font-semibold mb-2">תיאור החבילה</h4>
              <p className="text-muted-foreground">{plan.detailedDescription}</p>
            </div>

            {/* Target Audience */}
            <div>
              <h4 className="font-semibold mb-2">מתאים עבור</h4>
              <Badge variant="secondary" className="text-sm">
                {plan.targetAudience}
              </Badge>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-semibold mb-3">מה כלול בחבילה?</h4>
              <div className="grid gap-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              {plan.limitations && plan.limitations.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium mb-2 text-orange-600">הגבלות:</h5>
                  <div className="grid gap-2">
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <X className="h-4 w-4 text-orange-500 flex-shrink-0" />
                        <span className="text-sm text-orange-700">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pros and Cons */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-3 text-success">יתרונות</h4>
                <div className="space-y-2">
                  {plan.pros.map((pro, index) => (
                    <div key={index} className="flex items-start space-x-2 rtl:space-x-reverse">
                      <TrendingUp className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-success-foreground">{pro}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-orange-600">שיקולים</h4>
                <div className="space-y-2">
                  {plan.cons.map((con, index) => (
                    <div key={index} className="flex items-start space-x-2 rtl:space-x-reverse">
                      <Info className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-orange-700">{con}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Provider Info */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">פרטי הספק</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>דירוג: {provider.rating}/5</span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>שירות לקוחות: {provider.customerService}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <ShieldCheck className="h-4 w-4 text-success" />
                    <span>פועל מאז: {provider.established}</span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Globe className="h-4 w-4 text-primary" />
                    <span>אתר: {provider.website}</span>
                  </div>
                </div>
              </div>
              {provider.specialOffers && (
                <div className="mt-3">
                  <h5 className="font-medium mb-2 text-primary">מבצעים מיוחדים:</h5>
                  <div className="flex flex-wrap gap-2">
                    {provider.specialOffers.map((offer, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {offer}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 rtl:space-x-reverse pt-4">
              <Button 
                onClick={() => onPlanSelect(provider, plan)}
                className="flex-1"
                size="lg"
              >
                <Award className="h-4 w-4 ml-2" />
                בחר חבילה זו
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse">
          <div className="p-3 bg-primary/10 rounded-xl">
            <CategoryIcon className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">בחירת חבילת {categoryNames[category]}</h2>
        </div>
        <p className="text-muted-foreground text-lg">
          השווה בין החבילות והספקים השונים ובחר את המתאים לך ביותר
        </p>
      </div>

      {/* Sort Options */}
      <div className="flex items-center justify-center">
        <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as any)} className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="savings">לפי חיסכון</TabsTrigger>
            <TabsTrigger value="price">לפי מחיר</TabsTrigger>
            <TabsTrigger value="rating">לפי דירוג</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Providers Grid */}
      <div className="grid gap-6">
        {sortedProviders.map((provider) => (
          <Card key={provider.id} className="shadow-elegant hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary-glow/5">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <CategoryIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{provider.name}</h3>
                    <p className="text-muted-foreground font-normal text-sm">
                      {provider.description}
                    </p>
                  </div>
                </CardTitle>
                
                <div className="text-left">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse mb-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{provider.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">מאז {provider.established}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Plans Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {provider.plans.map((plan) => {
                  const savings = calculateSavings(plan.price);
                  const savingsPercentage = currentAmount > 0 ? ((savings / currentAmount) * 100) : 0;
                  
                  return (
                    <div
                      key={plan.id}
                      className={`relative p-4 border-2 rounded-xl transition-all duration-300 hover:shadow-lg cursor-pointer ${
                        plan.recommended 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : 'border-border bg-background hover:border-primary/30'
                      }`}
                    >
                      {plan.recommended && (
                        <div className="absolute -top-2 -right-2">
                          <Badge className="bg-primary text-primary-foreground animate-pulse">
                            מומלץ ⭐
                          </Badge>
                        </div>
                      )}

                      <div className="space-y-3">
                        {/* Plan Name */}
                        <h4 className="font-semibold text-lg">{plan.name}</h4>

                        {/* Price */}
                        <div className="text-center">
                          {plan.originalPrice && (
                            <p className="text-sm text-muted-foreground line-through">
                              {formatCurrency(category === 'electricity' ? plan.originalPrice * 850 : plan.originalPrice)}
                            </p>
                          )}
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(category === 'electricity' ? plan.price * 850 : plan.price)}
                          </p>
                          <p className="text-xs text-muted-foreground">לחודש</p>
                        </div>

                        {/* Savings Display */}
                        {savings > 0 && (
                          <div className="text-center bg-success/10 rounded-lg p-2">
                            <p className="text-sm font-semibold text-success">
                              חיסכון: {formatCurrency(savings)}
                            </p>
                            <p className="text-xs text-success/80">
                              {savingsPercentage.toFixed(1)}% פחות מהנוכחי
                            </p>
                          </div>
                        )}

                        {/* Key Features (first 3) */}
                        <div className="space-y-1">
                          {plan.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                              <Check className="h-3 w-3 text-success flex-shrink-0" />
                              <span className="text-xs text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                          {plan.features.length > 3 && (
                            <p className="text-xs text-primary">+{plan.features.length - 3} יתרונות נוספים</p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <PlanDetailsModal provider={provider} plan={plan} />
                          <Button 
                            onClick={() => onPlanSelect(provider, plan)}
                            className="w-full"
                            variant={plan.recommended ? "default" : "outline"}
                          >
                            בחר חבילה זו
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {providers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">לא נמצאו ספקים עבור קטגוריה זו</p>
        </div>
      )}
    </div>
  );
};