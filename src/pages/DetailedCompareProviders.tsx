import { useState, useMemo } from 'react';
import { Search, Filter, RefreshCw, Zap, Smartphone, Wifi, Star, Crown, ArrowRight, Phone, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { getProvidersByCategory } from '@/data/providers';
import { useToast } from '@/hooks/use-toast';
import { DigitalSignature } from '@/components/DigitalSignature';
import { formatCurrency } from '@/lib/utils';

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

const categoryDescriptions = {
  electricity: 'השווה בין ספקי החשמל בישראל וחסוך עד 30% מהחשבון החודשי',
  cellular: 'מצא את החבילה הסלולרית המתאימה לך מבין כל הספקים המובילים',
  internet: 'גלה את חבילות האינטרנט הטובות ביותר במחירים הזולים ביותר'
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

export const DetailedCompareProviders = () => {
  const [selectedCategory, setSelectedCategory] = useState<'electricity' | 'cellular' | 'internet'>('cellular');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'name' | 'savings'>('savings');
  const [filterBy, setFilterBy] = useState<'all' | 'recommended' | 'promotion' | 'premium'>('all');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showSignature, setShowSignature] = useState(false);

  const { toast } = useToast();

  const providers = useMemo(() => {
    let filtered = getProvidersByCategory(selectedCategory);
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (filterBy === 'recommended') {
      filtered = filtered.filter(provider => 
        provider.plans.some(plan => plan.recommended)
      );
    } else if (filterBy === 'promotion') {
      filtered = filtered.filter(provider => 
        provider.plans.some(plan => plan.discount)
      );
    } else if (filterBy === 'premium') {
      filtered = filtered.filter(provider => provider.rating >= 4.5);
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          const minPriceA = Math.min(...a.plans.map(p => p.price));
          const minPriceB = Math.min(...b.plans.map(p => p.price));
          return minPriceA - minPriceB;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name, 'he');
        case 'savings':
          const savingsA = Math.max(...a.plans.map(p => (p.originalPrice || p.price) - p.price));
          const savingsB = Math.max(...b.plans.map(p => (p.originalPrice || p.price) - p.price));
          return savingsB - savingsA;
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [selectedCategory, searchTerm, sortBy, filterBy]);

  const handleSwitchProvider = (provider: any, plan: any) => {
    setSelectedPlan({ provider, plan });
    setShowSignature(true);
  };

  const handleRefresh = () => {
    toast({
      title: "מעדכן נתונים... 🔄",
      description: "הנתונים עודכנו לאחרונה בינואר 2024",
    });
  };

  const Icon = categoryIcons[selectedCategory];
  const colors = categoryColors[selectedCategory];

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <Icon className={`h-12 w-12 ${colors.accent} animate-pulse`} />
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              השוואה מקצועית
            </h1>
            <Icon className={`h-12 w-12 ${colors.accent} animate-pulse delay-500`} />
          </div>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
            השוואה מפורטת בין כל הספקים בשוק הישראלי עם כל הפרטים שאתה צריך
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gradient-to-r from-accent/50 to-accent/30">
            {Object.entries(categoryNames).map(([key, name]) => {
              const TabIcon = categoryIcons[key as keyof typeof categoryIcons];
              const tabColors = categoryColors[key as keyof typeof categoryColors];
              return (
                <TabsTrigger 
                  key={key} 
                  value={key} 
                  className="flex items-center space-x-2 rtl:space-x-reverse py-6 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <TabIcon className="h-6 w-6" />
                  <span className="text-lg font-bold">{name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Category Description */}
          <div className={`text-center p-8 bg-gradient-to-r ${colors.gradient} rounded-2xl text-white shadow-elegant`}>
            <p className="text-xl font-semibold">
              {categoryDescriptions[selectedCategory]}
            </p>
          </div>

          {/* Advanced Filters */}
          <div className="grid lg:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-accent/20 to-accent/10 rounded-xl border shadow-card">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <Input
                  placeholder={`חפש ספק ${categoryNames[selectedCategory]}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-12 h-14 text-lg bg-white shadow-inner"
                />
              </div>
            </div>
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="h-14 text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="savings">מיין לפי חיסכון</SelectItem>
                <SelectItem value="price">מיין לפי מחיר</SelectItem>
                <SelectItem value="rating">מיין לפי דירוג</SelectItem>
                <SelectItem value="name">מיין לפי שם</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
              <SelectTrigger className="h-14 text-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הספקים</SelectItem>
                <SelectItem value="recommended">מומלץ</SelectItem>
                <SelectItem value="promotion">מבצעים</SelectItem>
                <SelectItem value="premium">ספקים מובילים</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between p-6 bg-accent/30 rounded-xl shadow-card">
            <div className="flex items-center gap-6">
              <Badge variant="secondary" className="text-xl px-6 py-3 font-bold">
                {providers.length} ספקים נמצאו
              </Badge>
              <div className="text-muted-foreground">
                נתונים מעודכנים לינואר 2024 • מחירים כוללים מע"ם
              </div>
            </div>
            
            <div className="flex gap-3">
              {filterBy === 'recommended' && (
                <Badge className="bg-success text-white text-sm px-4 py-2">
                  <Crown className="mr-1 h-4 w-4" />
                  מציג רק ספקים מומלצים
                </Badge>
              )}
              {filterBy === 'promotion' && (
                <Badge className="bg-destructive text-white text-sm px-4 py-2">
                  מציג רק מבצעים
                </Badge>
              )}
              <Button variant="outline" size="lg" onClick={handleRefresh}>
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Providers Grid */}
          <TabsContent value={selectedCategory} className="space-y-8">
            {providers.length === 0 ? (
              <div className="text-center p-16">
                <Filter className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">לא נמצאו תוצאות</h3>
                <p className="text-muted-foreground text-lg">נסה לשנות את הפילטרים או את מילות החיפוש</p>
              </div>
            ) : (
              <div className="space-y-8">
                {providers.map((provider, index) => {
                  const bestPlan = provider.plans.reduce((best: any, plan: any) => 
                    !best || plan.price < best.price ? plan : best, null);
                  const premiumPlan = provider.plans.find((plan: any) => plan.recommended) || bestPlan;
                  
                  return (
                    <Card 
                      key={provider.id}
                      className="group relative overflow-hidden shadow-elegant hover:shadow-glow transition-all duration-500 border-l-4 border-primary/50"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Provider Header */}
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-xl ${colors.bg} border border-primary/20`}>
                              <Icon className={`h-8 w-8 ${colors.accent}`} />
                            </div>
                            <div>
                              <CardTitle className="text-2xl font-bold mb-2">{provider.name}</CardTitle>
                              <p className="text-muted-foreground text-lg mb-3">{provider.description}</p>
                              
                              {/* Rating */}
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-5 w-5 ${
                                        i < provider.rating ? 'text-golden-yellow fill-current' : 'text-muted-foreground'
                                      }`} 
                                    />
                                  ))}
                                </div>
                                <span className="font-semibold text-lg">({provider.rating})</span>
                                <Badge className="mr-2 bg-success/10 text-success border-success/20">
                                  {provider.customerService}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Best Price Display */}
                          <div className="text-left space-y-2">
                            <div className="text-sm text-muted-foreground">מחיר מהיום</div>
                            <div className="text-4xl font-black text-success">
                              ₪{bestPlan.price.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">לחודש</div>
                            {bestPlan.originalPrice && bestPlan.originalPrice > bestPlan.price && (
                              <div className="text-destructive text-lg line-through">
                                ₪{bestPlan.originalPrice.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        {/* Plans Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                          {provider.plans.slice(0, 3).map((plan: any) => (
                            <div
                              key={plan.id}
                              className={`relative p-6 rounded-xl border transition-all duration-300 hover:shadow-md cursor-pointer ${
                                plan.recommended 
                                  ? `${colors.bg} border-primary shadow-colorful` 
                                  : 'border-border hover:border-primary/50 bg-card'
                              }`}
                              onClick={() => handleSwitchProvider(provider, plan)}
                            >
                              {/* Plan Badge */}
                              {plan.recommended && (
                                <div className={`absolute -top-3 right-4 bg-gradient-to-r ${colors.gradient} text-white px-3 py-1 text-sm font-bold rounded-full`}>
                                  <Crown className="inline h-4 w-4 mr-1" />
                                  מומלץ
                                </div>
                              )}

                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-bold text-lg">{plan.name}</h4>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black">₪{plan.price}</span>
                                    <span className="text-muted-foreground">לחודש</span>
                                  </div>
                                  {plan.originalPrice && plan.originalPrice > plan.price && (
                                    <div className="text-destructive line-through">
                                      ₪{plan.originalPrice}
                                    </div>
                                  )}
                                </div>

                                {/* Plan Details for Cellular */}
                                {selectedCategory === 'cellular' && (
                                  <div className="grid grid-cols-1 gap-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>נתונים:</span>
                                      <span className="font-semibold">{plan.data || 'ללא הגבלה'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>דקות:</span>
                                      <span className="font-semibold">{plan.minutes || 'ללא הגבלה'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>SMS:</span>
                                      <span className="font-semibold">{plan.sms || 'ללא הגבלה'}</span>
                                    </div>
                                  </div>
                                )}

                                {/* Features */}
                                <div className="space-y-2">
                                  {plan.features?.slice(0, 3).map((feature: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                      <div className="w-2 h-2 bg-success rounded-full"></div>
                                      <span>{feature}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Action */}
                                <Button 
                                  className={`w-full bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSwitchProvider(provider, plan);
                                  }}
                                >
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                  בחר מסלול
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Contact Info */}
                        <div className="flex items-center justify-between p-4 bg-accent/20 rounded-xl">
                          <div className="flex items-center gap-4">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <span className="font-semibold">{provider.customerService}</span>
                            <Globe className="h-5 w-5 text-muted-foreground" />
                            <span className="font-semibold">{provider.website}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => window.open(`tel:${provider.customerService}`)}>
                              התקשר
                            </Button>
                            <Button variant="outline" onClick={() => window.open(`https://${provider.website}`)}>
                              בקר באתר
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Digital Signature */}
        {showSignature && selectedPlan && (
          <DigitalSignature
            category={selectedCategory}
            currentProvider="הספק הנוכחי"
            newProvider={selectedPlan.provider.name}
            newPlan={selectedPlan.plan.name}
            monthlySavings={selectedPlan.plan.originalPrice ? selectedPlan.plan.originalPrice - selectedPlan.plan.price : 50}
            open={showSignature}
            onOpenChange={(open) => {
              setShowSignature(open);
              if (!open) setSelectedPlan(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
};