// Import statements
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Search, Filter, SortAsc, Phone, Globe, Zap, Wifi, Smartphone, TrendingDown, Sparkles, Clock, Shield, Award, Lightbulb } from 'lucide-react';
import { DigitalSignature } from '@/components/DigitalSignature';
import { getEnhancedPlansByCategory, getProviderByPlan, type EnhancedPlan, type EnhancedProvider } from '@/data/comprehensive-plans';

// Using enhanced plan interface from comprehensive data
type Plan = EnhancedPlan & {
  provider: string;
  rating: number;
  description: string;
  savings?: number;
};

interface PlanComparisonTableProps {
  category: 'electricity' | 'cellular' | 'internet';
  categoryName: string;
  currentProvider: string;
  currentAmount: number;
  plans: Plan[];
  onPlanSelect?: (plan: Plan) => void;
}

export const PlanComparisonTable = ({
  category,
  categoryName,
  currentProvider,
  currentAmount,
  plans: originalPlans,
  onPlanSelect
}: PlanComparisonTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'name' | 'savings' | 'popularity'>('savings');
  const [filterBy, setFilterBy] = useState<'all' | 'recommended' | 'promotions' | 'popular'>('all');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showSignature, setShowSignature] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('all');

  // Get enhanced plans from our comprehensive data
  const enhancedPlans = useMemo(() => {
    const categoryPlans = getEnhancedPlansByCategory(category);
    if (categoryPlans.length === 0) return originalPlans;
    
    return categoryPlans.map(plan => {
      const provider = getProviderByPlan(plan.id);
      const savings = plan.originalPrice ? plan.originalPrice - plan.price : 0;
      return {
        ...plan,
        provider: provider?.name || 'Unknown',
        rating: provider?.rating || 4.0,
        description: provider?.description || '',
        savings
      } as Plan;
    });
  }, [category, originalPlans]);

  const plans = enhancedPlans;

  const categoryColors = {
    electricity: { primary: 'hsl(48, 96%, 53%)', accent: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    cellular: { primary: 'hsl(142, 76%, 36%)', accent: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    internet: { primary: 'hsl(217, 91%, 60%)', accent: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }
  };

  const colors = categoryColors[category as keyof typeof categoryColors] || categoryColors.electricity;

  const categoryIcons = {
    electricity: Zap,
    cellular: Smartphone,
    internet: Wifi
  };

  const Icon = categoryIcons[category as keyof typeof categoryIcons] || Zap;

  // Get unique providers for filter
  const providers = useMemo(() => {
    const uniqueProviders = Array.from(new Set(plans.map(plan => plan.provider)));
    return uniqueProviders.sort();
  }, [plans]);

  // Process and filter plans
  const processedPlans = useMemo(() => {
    return plans
      .filter(plan => {
        const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            plan.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (plan.features || []).some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesFilter = filterBy === 'all' || 
                            (filterBy === 'recommended' && plan.recommended) ||
                            (filterBy === 'promotions' && plan.isPromotion) ||
                            (filterBy === 'popular' && (plan.popularityScore || 0) > 80);
        
        const matchesProvider = selectedProvider === 'all' || plan.provider === selectedProvider;
        
        return matchesSearch && matchesFilter && matchesProvider;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price':
            return a.price - b.price;
          case 'rating':
            return b.rating - a.rating;
          case 'name':
            return a.name.localeCompare(b.name, 'he');
          case 'savings':
            const savA = (a.originalPrice ? a.originalPrice - a.price : a.savings || 0);
            const savB = (b.originalPrice ? b.originalPrice - b.price : b.savings || 0);
            return savB - savA;
          case 'popularity':
            return (b.popularityScore || 0) - (a.popularityScore || 0);
          default:
            return 0;
        }
      });
  }, [plans, searchTerm, sortBy, filterBy, selectedProvider]);

  const groupedProviders = processedPlans.reduce((acc: Record<string, { provider: string; rating: number; description: string; plans: Plan[] }>, plan) => {
    if (!acc[plan.provider]) {
      acc[plan.provider] = { provider: plan.provider, rating: plan.rating, description: plan.description, plans: [] };
    }
    acc[plan.provider].plans.push(plan);
    return acc;
  }, {});

  const providersList = Object.values(groupedProviders);

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
            <div className="text-left">
              <p className="text-2xl font-bold text-destructive">
                ₪{currentAmount.toLocaleString('he-IL')}
              </p>
              <p className="text-sm text-muted-foreground">לחודש</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Enhanced Search and Filter Controls */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="חפש מסלולים, ספקים או תכונות..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger>
                <Globe className="h-4 w-4 ml-2" />
                <SelectValue placeholder="בחר ספק" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הספקים</SelectItem>
                {providers.map((provider) => (
                  <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger>
                <SortAsc className="h-4 w-4 ml-2" />
                <SelectValue placeholder="מיין לפי" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="savings">חיסכון גבוה</SelectItem>
                <SelectItem value="price">מחיר נמוך</SelectItem>
                <SelectItem value="rating">דירוג גבוה</SelectItem>
                <SelectItem value="popularity">פופולריות</SelectItem>
                <SelectItem value="name">שם</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
              <SelectTrigger>
                <Filter className="h-4 w-4 ml-2" />
                <SelectValue placeholder="סנן לפי" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">הכל</SelectItem>
                <SelectItem value="recommended">מומלצים</SelectItem>
                <SelectItem value="promotions">מבצעים</SelectItem>
                <SelectItem value="popular">פופולריים</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground text-center">
            נמצאו {processedPlans.length} מסלולים מתוך {plans.length}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Provider Groups */}
      <div className="space-y-6">
        {providersList.map((providerGroup) => (
          <Card key={providerGroup.provider} className="mb-6 overflow-hidden">
            <CardHeader className={`${colors.bg} ${colors.border} border-b`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Globe className={`h-5 w-5 ${colors.accent}`} />
                    <CardTitle className={`text-xl ${colors.accent}`}>
                      {providerGroup.provider}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(providerGroup.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground mr-2">
                      {providerGroup.rating}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className={colors.accent}>
                  {providerGroup.plans.length} מסלולים
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{providerGroup.description}</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {providerGroup.plans.map((plan) => {
                  const savings = plan.originalPrice ? plan.originalPrice - plan.price : plan.savings || 0;
                  const savingsPercentage = plan.originalPrice 
                    ? ((plan.originalPrice - plan.price) / plan.originalPrice) * 100 
                    : 0;

                  return (
                    <Card 
                      key={plan.id} 
                      className={`relative transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer group ${
                        plan.recommended ? 'ring-2 ring-primary shadow-lg bg-gradient-to-br from-primary/5 to-primary/10' : ''
                      }`}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      {plan.recommended && (
                        <div className="absolute -top-3 right-4 z-10">
                          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                            <Award className="h-3 w-3 ml-1" />
                            מומלץ ביותר
                          </Badge>
                        </div>
                      )}
                      
                      {plan.popularityScore && plan.popularityScore > 85 && (
                        <div className="absolute -top-3 left-4 z-10">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            <Lightbulb className="h-3 w-3 ml-1" />
                            פופולרי
                          </Badge>
                        </div>
                      )}
                      
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Plan header */}
                          <div className="text-center border-b pb-3">
                            <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{plan.name}</h4>
                            
                            {/* Price section */}
                            <div className="space-y-1">
                              {plan.originalPrice && (
                                <p className="text-sm text-muted-foreground line-through">
                                  {category === 'electricity' 
                                    ? `${(plan.originalPrice * 850).toLocaleString('he-IL')} ${plan.currency}` 
                                    : `${plan.originalPrice.toLocaleString('he-IL')} ${plan.currency}`
                                  }
                                </p>
                              )}
                              <p className="text-2xl font-black text-primary">
                                {category === 'electricity' 
                                  ? `${(plan.price * 850).toLocaleString('he-IL')} ${plan.currency}` 
                                  : `${plan.price.toLocaleString('he-IL')} ${plan.currency}`
                                }
                              </p>
                              <p className="text-xs text-muted-foreground">לחודש</p>
                            </div>
                          </div>

                          {/* Enhanced savings display with modern design */}
                          {savings > 0 && (
                            <div className="relative">
                              <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border border-emerald-200/50 rounded-xl p-4 text-center shadow-sm transform transition-all group-hover:shadow-md group-hover:-translate-y-1">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full">
                                    <TrendingDown className="h-3.5 w-3.5 text-white" />
                                  </div>
                                  <span className="text-sm font-semibold text-emerald-700">חיסכון חודשי</span>
                                </div>
                                <div className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent">
                                  {category === 'electricity' 
                                    ? `₪${(savings * 850).toLocaleString('he-IL')}` 
                                    : `₪${savings.toLocaleString('he-IL')}`
                                  }
                                </div>
                                <div className="text-xs opacity-90 font-medium">
                                  {savingsPercentage.toFixed(1)}% פחות מהנוכחי
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Enhanced features with better spacing */}
                          <div className="space-y-2">
                            {/* Key features */}
                            <div className="space-y-2">
                              {plan.features.slice(0, 4).map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <div className={`h-2 w-2 rounded-full ${colors.accent.replace('text-', 'bg-')}`} />
                                  <span className="text-gray-700">{feature}</span>
                                </div>
                              ))}
                            </div>
                            
                            {/* Additional info */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs text-muted-foreground">
                              {plan.contractLength && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{plan.contractLength}</span>
                                </div>
                              )}
                              {plan.popularityScore && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  <span>{plan.popularityScore}% פופולרי</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Enhanced select button */}
                          <Button 
                            className={`w-full font-semibold transition-all ${
                              plan.recommended 
                                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg' 
                                : ''
                            }`}
                            variant={plan.recommended ? "default" : "outline"}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectPlan(plan);
                            }}
                          >
                            {plan.recommended ? '🚀 בחר את המומלץ' : 'בחר מסלול זה'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Digital Signature Modal */}
      {selectedPlan && (
        <DigitalSignature
          category={category}
          currentProvider={currentProvider}
          newProvider={selectedPlan.provider}
          newPlan={selectedPlan.name}
          monthlySavings={selectedPlan.originalPrice ? selectedPlan.originalPrice - selectedPlan.price : selectedPlan.savings || 0}
          open={showSignature}
          onOpenChange={setShowSignature}
          hideTrigger={true}
        />
      )}
    </div>
  );
};