import { useState } from 'react';
import { Check, X, Star, Crown, ArrowRight, Phone, Globe, Zap, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  detailedDescription?: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'name' | 'savings'>('price');
  const [filterBy, setFilterBy] = useState<'all' | 'recommended' | 'promotion' | 'premium'>('all');

  const Icon = categoryIcons[category];
  const colors = categoryColors[category];

  // Filtering, sorting, and grouping by provider
  const processedPlans = plans
    .filter((p) =>
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((p) =>
      filterBy === 'all' ? true :
      filterBy === 'recommended' ? !!p.recommended :
      filterBy === 'promotion' ? typeof p.discount === 'number' :
      filterBy === 'premium' ? p.rating >= 4.5 : true
    )
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
        default:
          return 0;
      }
    });

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
            <div className="text-right">
              <div className="text-3xl font-black text-destructive">
                ₪{currentAmount.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">לחודש</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Controls */}
      <div className="grid lg:grid-cols-4 gap-4 p-4 bg-accent/20 rounded-xl border shadow-card animate-fade-in">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={`חפש ספק או מסלול...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-12 h-12"
            />
          </div>
        </div>
        <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="מיון" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">מיין לפי מחיר</SelectItem>
            <SelectItem value="rating">מיין לפי דירוג</SelectItem>
            <SelectItem value="name">מיין לפי שם</SelectItem>
            <SelectItem value="savings">מיין לפי חיסכון</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterBy} onValueChange={(v: any) => setFilterBy(v)}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="פילטר" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל המסלולים</SelectItem>
            <SelectItem value="recommended">מומלץ</SelectItem>
            <SelectItem value="promotion">מבצעים</SelectItem>
            <SelectItem value="premium">ספקים מובילים</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
        <Badge variant="secondary" className="text-base px-4 py-2 font-bold">
          {providersList.length} חברות • {processedPlans.length} מסלולים
        </Badge>
        {filterBy !== 'all' && (
          <Badge className="bg-success text-white">
            מסננים פעילים
          </Badge>
        )}
      </div>

      {/* Providers and all plans */}
      <div className="space-y-8">
        {providersList.map((prov) => (
          <Card key={prov.provider} className="group relative overflow-hidden shadow-elegant hover:shadow-glow transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">{prov.provider}</CardTitle>
                  <p className="text-muted-foreground">{prov.description}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < prov.rating ? 'text-golden-yellow fill-current' : 'text-muted-foreground'}`} />
                    ))}
                    <span className="text-sm text-muted-foreground">({prov.rating})</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {prov.plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative p-4 rounded-lg border transition-all hover:shadow-md ${
                      plan.recommended ? `${colors.bg} border-primary shadow-colorful` : 'border-border hover:border-primary/50 bg-card'
                    }`}
                  >
                    {plan.recommended && (
                      <div className={`absolute -top-2 right-3 bg-gradient-to-r ${colors.gradient} text-white px-2 py-1 text-xs font-bold rounded-full`}>
                        <Crown className="inline h-3 w-3 mr-1" /> מומלץ
                      </div>
                    )}

                    <div className="space-y-2">
                      <div>
                        <h4 className="font-bold text-base">{plan.name}</h4>
                        {plan.detailedDescription && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{plan.detailedDescription}</p>
                        )}
                      </div>

                      {category === 'cellular' && (
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center p-2 bg-accent/30 rounded">
                            <div className="font-semibold text-sm">{plan.data || 'ללא הגבלה'}</div>
                            <div className="text-xs text-muted-foreground">נתונים</div>
                          </div>
                          <div className="text-center p-2 bg-accent/30 rounded">
                            <div className="font-semibold text-sm">{plan.minutes || 'ללא הגבלה'}</div>
                            <div className="text-xs text-muted-foreground">דקות</div>
                          </div>
                          <div className="text-center p-2 bg-accent/30 rounded">
                            <div className="font-semibold text-sm">{plan.sms || 'ללא הגבלה'}</div>
                            <div className="text-xs text-muted-foreground">SMS</div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        {plan.features?.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <Check className="h-3 w-3 text-success" />
                            <span className="line-clamp-1">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          {plan.originalPrice && plan.originalPrice > plan.price && (
                            <div className="text-xs text-muted-foreground line-through">
                              ₪{plan.originalPrice.toLocaleString()}
                            </div>
                          )}
                          {typeof plan.discount === 'number' && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r ${colors.gradient} text-white text-xs font-bold`}>
                              <Star className="h-3 w-3" />
                              -{plan.discount}%
                            </div>
                          )}
                        </div>
                        
                        <div className={`text-2xl font-black ${plan.recommended ? 'text-success' : 'text-foreground'}`}>
                          ₪{plan.price.toLocaleString()}
                          <span className="text-xs text-muted-foreground font-normal mr-1">לחודש</span>
                        </div>
                        
                        {currentAmount - plan.price > 0 && (
                          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-success to-success-glow text-white text-sm font-bold shadow-md`}>
                            <ArrowRight className="h-3 w-3 rotate-180" />
                            חיסכון {formatCurrency(currentAmount - plan.price)} לחודש
                          </div>
                        )}
                      </div>

                      <Button 
                        className={`w-full bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white shadow-lg text-sm h-9`}
                        onClick={() => handleSelectPlan(plan)}
                      >
                        <ArrowRight className="ml-2 h-3 w-3" />
                        בחר מסלול
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
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