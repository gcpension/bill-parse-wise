import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Smartphone, 
  Wifi, 
  Search, 
  Filter,
  Star,
  Phone,
  Globe,
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  Award,
  Shield
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { allProviders, getProvidersByCategory } from '@/data/providers';

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

export const Compare = () => {
  const [selectedCategory, setSelectedCategory] = useState<'electricity' | 'cellular' | 'internet'>('electricity');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'name'>('price');
  const [filterBy, setFilterBy] = useState<'all' | 'recommended' | 'promotion'>('all');

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
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [selectedCategory, searchTerm, sortBy, filterBy]);

  const getLowestPrice = (provider: any) => {
    return Math.min(...provider.plans.map((plan: any) => plan.price));
  };

  const getBestPlan = (provider: any) => {
    return provider.plans.find((plan: any) => plan.recommended) || provider.plans[0];
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight gradient-primary bg-clip-text text-transparent">
          השוואת ספקים
        </h1>
        <p className="text-muted-foreground text-lg">
          השווה בין כל הספקים בשוק הישראלי ומצא את החבילה המתאימה לך
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          {Object.entries(categoryNames).map(([key, name]) => {
            const Icon = categoryIcons[key as keyof typeof categoryIcons];
            return (
              <TabsTrigger key={key} value={key} className="flex items-center space-x-2 rtl:space-x-reverse py-3">
                <Icon className="h-5 w-5" />
                <span className="text-base">{name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 bg-accent/30 p-4 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="חפש ספק..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
          
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">מיין לפי מחיר</SelectItem>
              <SelectItem value="rating">מיין לפי דירוג</SelectItem>
              <SelectItem value="name">מיין לפי שם</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הספקים</SelectItem>
              <SelectItem value="recommended">מומלץ</SelectItem>
              <SelectItem value="promotion">מבצעים</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            נמצאו {providers.length} ספקי {categoryNames[selectedCategory]}
          </p>
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <span>עודכן לאחרונה: ינואר 2024</span>
          </div>
        </div>

        {/* Providers Grid */}
        <TabsContent value={selectedCategory} className="space-y-6">
          <div className="grid gap-6">
            {providers.map((provider, index) => {
              const bestPlan = getBestPlan(provider);
              const lowestPrice = getLowestPrice(provider);
              
              return (
                <Card 
                  key={provider.id} 
                  className="group relative overflow-hidden shadow-card hover:shadow-elegant transition-all duration-500 animate-slide-up border-l-4 border-l-primary/20 hover:border-l-primary"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="relative">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary-glow transition-all duration-300">
                              {provider.name}
                            </h3>
                            <div className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-primary-glow group-hover:w-full transition-all duration-500" />
                          </div>
                          {bestPlan.recommended && (
                            <Badge className="bg-gradient-to-r from-success to-green-500 text-white shadow-md animate-pulse border-0">
                              <Award className="ml-1 h-3 w-3" />
                              מומלץ ביותר
                            </Badge>
                          )}
                          {bestPlan.discount && (
                            <Badge className="bg-gradient-to-r from-destructive to-red-500 text-white shadow-md border-0">
                              <TrendingDown className="ml-1 h-3 w-3" />
                              מבצע חם
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center space-x-1 rtl:space-x-reverse bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 transition-colors duration-200 ${
                                  i < Math.floor(provider.rating) 
                                    ? 'text-amber-500 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                            <span className="font-semibold text-amber-700 dark:text-amber-300">({provider.rating})</span>
                          </div>
                          
                          <div className="flex items-center space-x-1 rtl:space-x-reverse bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                            <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-blue-700 dark:text-blue-300 font-medium">{provider.customerService}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1 rtl:space-x-reverse bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-200 dark:border-green-800">
                            <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="text-green-700 dark:text-green-300 font-medium text-xs">{provider.website}</span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed">
                          {provider.description}
                        </p>
                      </div>
                      
                      <div className="text-left relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10 p-2">
                          <div className="text-sm text-muted-foreground font-medium">החל מ-</div>
                          <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent group-hover:from-green-600 group-hover:to-green-400 transition-all duration-300">
                            {formatCurrency(lowestPrice)}
                            <span className="text-base font-normal text-muted-foreground">
                              /{selectedCategory === 'electricity' ? 'קוט"ש' : 'חודש'}
                            </span>
                          </div>
                          {bestPlan.originalPrice && bestPlan.originalPrice > bestPlan.price && (
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <div className="text-sm text-muted-foreground line-through">
                                {formatCurrency(bestPlan.originalPrice)}
                              </div>
                              <Badge variant="destructive" className="text-xs">
                                חסכון {Math.round(((bestPlan.originalPrice - bestPlan.price) / bestPlan.originalPrice) * 100)}%
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6 relative z-10">
                    {/* Plans */}
                    <div className="space-y-4 relative z-10">
                      <h4 className="font-semibold text-lg flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary-glow rounded-full" />
                        <span>חבילות זמינות</span>
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {provider.plans.slice(0, 2).map((plan, planIndex) => (
                          <div 
                            key={plan.id} 
                            className={`relative overflow-hidden p-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                              plan.recommended 
                                ? 'border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-primary-glow/10 shadow-lg hover:shadow-primary/20' 
                                : 'border-border bg-gradient-to-br from-accent/30 to-accent/10 hover:border-primary/50'
                            }`}
                            style={{ animationDelay: `${(index * 0.1) + (planIndex * 0.05)}s` }}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h5 className="font-semibold">{plan.name}</h5>
                                {plan.discount && (
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    הנחה {plan.discount.amount}%
                                  </Badge>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-primary">
                                  {formatCurrency(plan.price)}
                                </div>
                                {plan.originalPrice && (
                                  <div className="text-sm text-muted-foreground line-through">
                                    {formatCurrency(plan.originalPrice)}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <ul className="space-y-1 text-sm">
                              {plan.features.slice(0, 3).map((feature, i) => (
                                <li key={i} className="flex items-center space-x-2 rtl:space-x-reverse">
                                  <CheckCircle2 className="h-3 w-3 text-success" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                              {plan.features.length > 3 && (
                                <li className="text-muted-foreground">
                                  +{plan.features.length - 3} תכונות נוספות
                                </li>
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gradient-to-r from-transparent via-border to-transparent relative z-10">
                      <Button className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-lg hover:shadow-primary/30 transform hover:scale-105 transition-all duration-300">
                        <ArrowRight className="ml-2 h-4 w-4" />
                        עבור לספק זה
                      </Button>
                      <Button variant="outline" className="flex-1 border-2 hover:border-primary hover:bg-primary/5 transform hover:scale-105 transition-all duration-300">
                        <Shield className="ml-2 h-4 w-4" />
                        פרטים נוספים
                      </Button>
                      <Button variant="outline" className="border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transform hover:scale-105 transition-all duration-300">
                        <Phone className="ml-2 h-4 w-4" />
                        צור קשר
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Tips Section */}
      <Card className="shadow-card bg-gradient-to-br from-primary/5 to-primary-glow/5">
        <CardHeader>
          <CardTitle>טיפים להשוואה חכמה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">בדוק תנאים נסתרים</h4>
                  <p className="text-sm text-muted-foreground">
                    שים לב לעמלות חבויות, תקופות מחויבות ותנאי ביטול.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">השווה מחירים שנתיים</h4>
                  <p className="text-sm text-muted-foreground">
                    מבצעים לתקופה מוגבלת עלולים להתייקר לאחר מכן.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold">בדוק ביקורות לקוחות</h4>
                  <p className="text-sm text-muted-foreground">
                    דירוג גבוה בשירות הלקוחות חשוב לא פחות ממחיר זול.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Shield className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold">שמור על הגמישות</h4>
                  <p className="text-sm text-muted-foreground">
                    העדף חבילות ללא מחויבות לתקופה ארוכה.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};