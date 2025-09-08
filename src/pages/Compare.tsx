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
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/lib/errorHandler';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DigitalSignature } from '@/components/DigitalSignature';
import { Layout } from '@/components/Layout';

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
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showContactDialog, setShowContactDialog] = useState<any>(null);

  const { toast } = useToast();

  const providers = useMemo(() => {
    let filtered = getProvidersByCategory(selectedCategory);
    
    if (searchTerm) {
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterBy === 'recommended') {
      filtered = filtered.filter(provider => 
        provider.plans.some(plan => plan.recommended)
      );
    } else if (filterBy === 'promotion') {
      filtered = filtered.filter(provider => 
        provider.plans.some(plan => plan.discount)
      );
    }
    
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

  const handleSwitchProvider = (provider: any, plan: any) => {
    setSelectedPlan({ provider, plan });
    toast({
      title: "בחירה מעולה!",
      description: `נבחר ${plan.name} מ${provider.name}. מומלץ ליצור קשר עם הספק לסיום התהליך.`,
    });
  };

  const handleShowDetails = (provider: any) => {
    toast({
      title: "פרטים נוספים",
      description: `מציג פרטים נוספים על ${provider.name}`,
    });
  };

  const handleContact = (provider: any) => {
    setShowContactDialog(provider);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/8 via-background to-accent/12 animate-fade-in">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-24 w-64 h-64 gradient-primary rounded-full blur-3xl opacity-15 animate-float" />
        <div className="absolute top-96 right-32 w-40 h-40 gradient-electric rounded-full blur-2xl opacity-20 animate-bounce-gentle" />
      </div>

      <Layout>
        <div className="space-y-10 animate-fade-in relative z-10">
          <div className="space-y-6 text-center py-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-electric-blue bg-clip-text text-transparent">
              השוואת ספקים
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              השווה בין כל הספקים בשוק הישראלי ומצא את החבילה המתאימה לך
            </p>
          </div>

          <Tabs value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
            <TabsList className="grid w-full grid-cols-3 h-auto p-2 max-w-4xl mx-auto">
              {Object.entries(categoryNames).map(([key, name]) => {
                const Icon = categoryIcons[key as keyof typeof categoryIcons];
                return (
                  <TabsTrigger key={key} value={key} className="flex items-center space-x-2 rtl:space-x-reverse py-4">
                    <Icon className="h-6 w-6" />
                    <span className="text-lg">{name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-6 bg-accent/40 p-6 rounded-2xl max-w-6xl mx-auto">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="חפש ספק..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-12 h-12"
                  />
                </div>
              </div>
              
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-60 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">מיין לפי מחיר</SelectItem>
                  <SelectItem value="rating">מיין לפי דירוג</SelectItem>
                  <SelectItem value="name">מיין לפי שם</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                <SelectTrigger className="w-60 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הספקים</SelectItem>
                  <SelectItem value="recommended">מומלץ</SelectItem>
                  <SelectItem value="promotion">מבצעים</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value={selectedCategory} className="space-y-8">
              <div className="grid gap-8 max-w-6xl mx-auto">
                {providers.map((provider, index) => {
                  const bestPlan = getBestPlan(provider);
                  const lowestPrice = getLowestPrice(provider);
                  
                  return (
                    <Card key={provider.id} className="group relative overflow-hidden shadow-elegant hover:shadow-glow transition-all duration-700">
                      <CardHeader className="p-8">
                        <div className="flex items-start justify-between">
                          <div className="space-y-4 flex-1">
                            <h3 className="text-3xl font-bold">{provider.name}</h3>
                            <div className="flex gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(provider.rating) ? 'text-amber-500 fill-current' : 'text-gray-300'}`} />
                                ))}
                                <span>({provider.rating})</span>
                              </div>
                            </div>
                            <p className="text-muted-foreground">{provider.description}</p>
                          </div>
                          <div className="text-left ml-8">
                            <div className="text-sm text-muted-foreground">החל מ-</div>
                            <div className="text-4xl font-bold text-primary">{formatCurrency(lowestPrice)}</div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-8">
                        <div className="flex gap-3">
                          <Button onClick={() => handleSwitchProvider(provider, bestPlan)} className="flex-1">
                            עבור לספק זה
                          </Button>
                          <Button variant="outline" onClick={() => handleContact(provider)}>
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

          <Dialog open={!!showContactDialog} onOpenChange={() => setShowContactDialog(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>צור קשר עם {showContactDialog?.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{showContactDialog?.customerService}</span>
                </div>
                <Button onClick={() => setShowContactDialog(null)} className="w-full">
                  סגור
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Layout>
    </div>
  );
};