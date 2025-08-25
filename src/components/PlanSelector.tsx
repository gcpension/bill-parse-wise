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
  currentAmount = 0,
  dense = false,
  showHeader = true
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
    <div className={dense ? "space-y-3" : "space-y-6"}>
      {/* Header */}
      {showHeader && (
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
      )}

      {/* Sort Options */}
      {showHeader && (
        <div className="flex items-center justify-center">
          <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as any)} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="savings">לפי חיסכון</TabsTrigger>
              <TabsTrigger value="price">לפי מחיר</TabsTrigger>
              <TabsTrigger value="rating">לפי דירוג</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Providers Grid */}
      <div className={`grid ${dense ? 'gap-4' : 'gap-8'} ${dense ? 'md:grid-cols-2 lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
        {sortedProviders.map((provider) => (
          <Card key={provider.id} className={`group relative ${dense ? 'shadow-card hover:shadow-elegant' : 'shadow-elegant hover:shadow-2xl'} transition-all duration-500 overflow-hidden border-0 hover:scale-[1.02] bg-gradient-to-br from-background to-muted/30`}>
            {!dense && (
              <CardHeader className="relative bg-gradient-to-br from-primary/10 via-primary-glow/5 to-transparent border-b border-primary/10">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
                <div className="relative flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="relative p-4 gradient-primary rounded-2xl shadow-colorful group-hover:scale-110 transition-transform duration-300">
                      <CategoryIcon className="h-7 w-7 text-white" />
                      <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                        {provider.name}
                      </h3>
                      <p className="text-muted-foreground font-medium text-base mt-1">
                        {provider.description}
                      </p>
                    </div>
                  </CardTitle>
                  
                  <div className="text-left space-y-2">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(provider.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="font-bold text-lg">{provider.rating}</span>
                    </div>
                    <div className="bg-primary/10 px-3 py-1 rounded-full">
                      <p className="text-xs font-semibold text-primary">מאז {provider.established}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
            )}

            <CardContent className={dense ? "p-4" : "p-8"}>
              {/* Plans Grid */}
              <div className={`grid ${dense ? 'md:grid-cols-4 lg:grid-cols-6 gap-3' : 'md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
                {provider.plans.map((plan) => {
                  const savings = calculateSavings(plan.price);
                  const savingsPercentage = currentAmount > 0 ? ((savings / currentAmount) * 100) : 0;
                  
                  return (
                    <div
                      key={plan.id}
                      className={`group relative ${dense ? 'p-3 min-h-[140px]' : 'p-6'} border-2 rounded-2xl transition-all duration-500 hover:shadow-elegant cursor-pointer overflow-hidden ${
                        plan.recommended 
                          ? 'border-primary bg-gradient-to-br from-primary/10 to-primary-glow/5 ring-2 ring-primary/30 shadow-card' 
                          : 'border-border bg-gradient-to-br from-background to-muted/20 hover:border-primary/50 hover:shadow-card hover:scale-[1.02]'
                      }`}
                    >
                      {/* Enhanced Background Pattern */}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Savings Badge */}
                      {savings > 0 && (
                        <div className="absolute -top-2 -left-2 z-10">
                          <Badge className="bg-gradient-to-r from-success to-success-glow text-white text-xs px-3 py-1 shadow-glow animate-pulse">
                            {dense ? `${formatCurrency(savings)}` : `💰 חיסכון ${formatCurrency(savings)}`}
                          </Badge>
                        </div>
                      )}
                      
                      {plan.recommended && (
                        <div className="absolute -top-2 -right-2 z-10">
                          <Badge className="gradient-primary text-white shadow-glow animate-bounce-gentle">
                            {dense ? '⭐' : '🏆 מומלץ'}
                          </Badge>
                        </div>
                      )}
                      
                      {dense && provider.name && (
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <CategoryIcon className="h-2.5 w-2.5 text-primary" />
                            <span className="text-xs font-semibold text-primary truncate max-w-[60px]">{provider.name}</span>
                          </div>
                          {plan.recommended && (
                            <Badge className="bg-primary text-primary-foreground text-[10px] px-1 py-0 h-4">
                              ⭐
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className={`relative z-10 ${dense ? "space-y-2 flex flex-col h-full" : "space-y-4"}`}>
                        {/* Plan Name */}
                        <h4 className={`font-bold ${dense ? 'text-sm leading-tight' : 'text-xl'} ${plan.recommended ? 'text-primary' : 'text-foreground'} group-hover:text-primary transition-colors duration-300`}>
                          {plan.name}
                        </h4>

                        {/* Price */}
                        <div className={`text-center ${dense ? 'flex-shrink-0' : ''} space-y-1`}>
                          {plan.originalPrice && !dense && (
                            <p className="text-base text-muted-foreground line-through opacity-75">
                              {formatCurrency(category === 'electricity' ? plan.originalPrice * 850 : plan.originalPrice)}
                            </p>
                          )}
                          <div className="relative">
                            <p className={`${dense ? 'text-lg' : 'text-3xl'} font-black gradient-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                              {formatCurrency(category === 'electricity' ? plan.price * 850 : plan.price)}
                            </p>
                            <p className={`${dense ? 'text-xs' : 'text-sm'} text-muted-foreground font-medium`}>לחודש</p>
                          </div>
                          
                          {/* Enhanced Savings Display */}
                          {savings > 0 && (
                            <div className={`${dense ? 'mt-1' : 'mt-2'} bg-success/10 border border-success/20 rounded-lg p-2`}>
                              <p className={`${dense ? 'text-xs' : 'text-sm'} font-bold text-success`}>
                                🎯 חיסכון: {formatCurrency(savings)}
                              </p>
                              <p className={`${dense ? 'text-[10px]' : 'text-xs'} text-success/80`}>
                                {savingsPercentage.toFixed(1)}% פחות • {formatCurrency(savings * 12)} לשנה
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Key Info in dense mode */}
                        {dense && (
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="text-[10px] text-muted-foreground space-y-0.5">
                              {plan.features.slice(0, 2).map((feature, idx) => (
                                <div key={idx} className="truncate" title={feature}>• {feature}</div>
                              ))}
                              {plan.features.length > 2 && (
                                <div className="text-primary font-medium">+{plan.features.length - 2} נוספים</div>
                              )}
                            </div>
                            
                            {/* Target audience */}
                            <div className="text-[9px] text-center bg-muted/50 rounded px-1 py-0.5 mt-1 truncate" title={plan.targetAudience}>
                              {plan.targetAudience}
                            </div>
                          </div>
                        )}

                        {/* Key Features */}
                        {!dense && (
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
                        )}

                        {/* Action Buttons */}
                        <div className={dense ? "space-y-1 mt-auto" : "space-y-2"}>
                          {!dense && <PlanDetailsModal provider={provider} plan={plan} />}
                          <Button 
                            onClick={() => onPlanSelect(provider, plan)}
                            className={`w-full ${dense ? 'text-[10px] h-6 px-1' : ''}`}
                            size={dense ? "sm" : "default"}
                            variant={plan.recommended ? "default" : "outline"}
                          >
                            {dense ? "בחר" : "בחר חבילה זו"}
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