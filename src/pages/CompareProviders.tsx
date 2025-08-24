import { useState, useMemo } from 'react';
import { Search, Filter, RefreshCw, Zap, Smartphone, Wifi } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { ProviderComparisonCard } from '@/components/modern/ProviderComparisonCard';
import { getProvidersByCategory } from '@/data/providers';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DigitalSignature } from '@/components/DigitalSignature';

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
  electricity: 'השווה בין ספקי החשמל בישראל וחסוך עד 30% מהחשבון',
  cellular: 'מצא את החבילה הסלולרית המתאימה לך מבין כל הספקים',
  internet: 'גלה את חבילות האינטרנט הטובות ביותר במחירים הזולים ביותר'
};

export const CompareProviders = () => {
  const [selectedCategory, setSelectedCategory] = useState<'electricity' | 'cellular' | 'internet'>('electricity');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'name'>('price');
  const [filterBy, setFilterBy] = useState<'all' | 'recommended' | 'promotion'>('all');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showContactDialog, setShowContactDialog] = useState<any>(null);
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

  const handleSwitchProvider = (provider: any, plan: any) => {
    setSelectedPlan({ provider, plan });
    setShowSignature(true);
  };

  const handleContact = (provider: any) => {
    setShowContactDialog(provider);
  };

  const handleRefresh = () => {
    toast({
      title: "מעדכן נתונים... 🔄",
      description: "הנתונים עודכנו לאחרונה בינואר 2024",
    });
  };

  const Icon = categoryIcons[selectedCategory];

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Icon className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              השוואת ספקים
            </h1>
            <Icon className="h-10 w-10 text-primary animate-pulse delay-500" />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            השווה בין כל הספקים בשוק הישראלי ומצא את החבילה המושלמת עבורך
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gradient-to-r from-accent/50 to-accent/30">
            {Object.entries(categoryNames).map(([key, name]) => {
              const TabIcon = categoryIcons[key as keyof typeof categoryIcons];
              return (
                <TabsTrigger 
                  key={key} 
                  value={key} 
                  className="flex items-center space-x-2 rtl:space-x-reverse py-4 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <TabIcon className="h-5 w-5" />
                  <span className="text-base font-semibold">{name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Category Description */}
          <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-xl">
            <p className="text-lg text-primary font-medium">
              {categoryDescriptions[selectedCategory]}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 p-6 bg-gradient-to-r from-accent/20 to-accent/10 rounded-xl border">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={`חפש ספק ${categoryNames[selectedCategory]}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-12 h-12 text-lg"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">מיין לפי מחיר</SelectItem>
                  <SelectItem value="rating">מיין לפי דירוג</SelectItem>
                  <SelectItem value="name">מיין לפי שם</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הספקים</SelectItem>
                  <SelectItem value="recommended">מומלץ</SelectItem>
                  <SelectItem value="promotion">מבצעים</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="lg" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {providers.length} ספקים נמצאו
              </Badge>
              <div className="text-sm text-muted-foreground">
                נתונים מעודכנים לינואר 2024
              </div>
            </div>
            
            <div className="flex gap-2">
              {filterBy === 'recommended' && (
                <Badge className="bg-success text-white">
                  מציג רק ספקים מומלצים
                </Badge>
              )}
              {filterBy === 'promotion' && (
                <Badge className="bg-destructive text-white">
                  מציג רק מבצעים
                </Badge>
              )}
            </div>
          </div>

          {/* Providers Grid */}
          <TabsContent value={selectedCategory} className="space-y-8">
            {providers.length === 0 ? (
              <div className="text-center p-12">
                <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">לא נמצאו תוצאות</h3>
                <p className="text-muted-foreground">נסה לשנות את הפילטרים או את מילות החיפוש</p>
              </div>
            ) : (
              <div className="space-y-8">
                {providers.map((provider, index) => (
                  <ProviderComparisonCard
                    key={provider.id}
                    provider={provider}
                    selectedCategory={selectedCategory}
                    index={index}
                    onSwitchProvider={handleSwitchProvider}
                    onContact={handleContact}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Contact Dialog */}
        {showContactDialog && (
          <Dialog open={!!showContactDialog} onOpenChange={() => setShowContactDialog(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>צור קשר עם {showContactDialog.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">טלפון</label>
                    <div className="text-lg font-semibold">{showContactDialog.customerService}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">אתר</label>
                    <div className="text-lg font-semibold">{showContactDialog.website}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    className="flex-1"
                    onClick={() => window.open(`tel:${showContactDialog.customerService}`, '_blank')}
                  >
                    התקשר עכשיו
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.open(`https://${showContactDialog.website}`, '_blank')}
                  >
                    בקר באתר
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Digital Signature */}
        {showSignature && selectedPlan && (
          <DigitalSignature
            category={selectedCategory}
            currentProvider="הספק הנוכחי"
            newProvider={selectedPlan.provider.name}
            newPlan={selectedPlan.plan.name}
            monthlySavings={selectedPlan.plan.originalPrice ? selectedPlan.plan.originalPrice - selectedPlan.plan.price : 0}
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