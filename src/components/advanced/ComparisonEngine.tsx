import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Search, 
  Filter, 
  Star, 
  TrendingUp, 
  Zap,
  Smartphone,
  Wifi,
  Tv
} from 'lucide-react';
// Mock data for demo purposes
const mockPlansData = {
  electricity: [],
  cellular: [],
  internet: [],
  tv: []
};

export const ComparisonEngine = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    maxPrice: 1000,
    minRating: 0,
    contractLength: 24,
    features: [],
    includePromotions: true
  });
  const [sortBy, setSortBy] = useState<SortOption>({ field: 'price', direction: 'asc' });
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);

  useEffect(() => {
    // Demo implementation - in real app would connect to comprehensive plans data
    const demoPlans = [
      { name: 'חבילת בסיס', provider: 'פלאפון', price: 50, rating: 4.2, description: 'חבילה בסיסית עם הכל' },
      { name: 'חבילת פרימיום', provider: 'סלקום', price: 80, rating: 4.5, description: 'חבילה מתקדמת' }
    ];
    setFilteredPlans(demoPlans);
  }, [searchTerm, filters, sortBy]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      maxPrice: 1000,
      minRating: 0,
      contractLength: 24,
      features: [],
      includePromotions: true
    });
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            מנוע השוואה מתקדם
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="חפש ספק, חבילה או תכונה..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label>קטגורה</Label>
              <select 
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value as any)}
              >
                <option value="">כל הקטגוריות</option>
                <option value="electricity">חשמל</option>
                <option value="cellular">סלולר</option>
                <option value="internet">אינטרנט</option>
                <option value="tv">טלוויזיה</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <Label>מחיר מקסימלי: ₪{filters.maxPrice}</Label>
              <Slider
                value={[filters.maxPrice]}
                onValueChange={([value]) => handleFilterChange('maxPrice', value)}
                max={1000}
                min={0}
                step={50}
                className="w-full"
              />
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <Label>דירוג מינימלי: {filters.minRating} כוכבים</Label>
              <Slider
                value={[filters.minRating]}
                onValueChange={([value]) => handleFilterChange('minRating', value)}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Promotions Toggle */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Switch
                checked={filters.includePromotions}
                onCheckedChange={(checked) => handleFilterChange('includePromotions', checked)}
              />
              <Label>כולל מבצעים</Label>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-4">
            <Label>מיון לפי:</Label>
            <select
              className="px-3 py-2 border border-input bg-background rounded-md"
              value={`${sortBy.field}-${sortBy.direction}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortBy({ field: field as any, direction: direction as any });
              }}
            >
              <option value="price-asc">מחיר (נמוך לגבוה)</option>
              <option value="price-desc">מחיר (גבוה לנמוך)</option>
              <option value="rating-desc">דירוג (גבוה לנמוך)</option>
              <option value="savings-desc">חיסכון (גבוה לנמוך)</option>
            </select>
            
            <Button variant="outline" onClick={clearFilters}>
              נקה מסננים
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          נמצאו {filteredPlans.length} תוצאות
        </h3>
        <Badge variant="outline" className="text-primary border-primary">
          עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')}
        </Badge>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.slice(0, 12).map((plan, index) => {
          const savings = plan.originalPrice ? plan.originalPrice - plan.price : 0;
          const savingsPercent = plan.originalPrice ? Math.round((savings / plan.originalPrice) * 100) : 0;
          
          return (
            <Card key={`${plan.provider}-${plan.name}-${index}`} className="shadow-card hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-lg">{plan.name}</h4>
                    <p className="text-sm text-muted-foreground">{plan.provider}</p>
                  </div>
                  {plan.recommended && (
                    <Badge className="bg-primary text-primary-foreground">
                      מומלץ
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ₪{plan.price}
                    </span>
                    {savings > 0 && (
                      <Badge variant="outline" className="text-success border-success">
                        חסוך {savingsPercent}%
                      </Badge>
                    )}
                  </div>

                  {plan.originalPrice && savings > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <span className="line-through">₪{plan.originalPrice}</span>
                      <span className="text-success font-medium mr-2">
                        חיסכון ₪{savings}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(plan.rating || 4.0) 
                            ? 'text-warning fill-current' 
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground mr-2">
                      ({plan.rating || 4.0})
                    </span>
                  </div>

                  {plan.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {plan.description}
                    </p>
                  )}
                </div>

                <Button className="w-full mt-4" size="sm">
                  <TrendingUp className="ml-2 h-4 w-4" />
                  השווה ובחר
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPlans.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground text-lg mb-4">
              לא נמצאו תוצאות התואמות לחיפוש שלך
            </p>
            <Button onClick={clearFilters}>
              נקה מסננים ונסה שוב
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};