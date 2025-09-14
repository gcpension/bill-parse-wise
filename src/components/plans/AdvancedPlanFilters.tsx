import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal, 
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  Zap,
  Wifi,
  Smartphone,
  Tv,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOptions {
  searchQuery: string;
  category: 'all' | 'selected' | 'electricity' | 'internet' | 'mobile' | 'tv';
  priceRange: [number, number];
  minRating: number;
  sortBy: 'price' | 'rating' | 'popularity' | 'savings';
  providers: string[];
  contractLength: string[];
  features: string[];
  showPopularOnly: boolean;
  showNewOnly: boolean;
}

interface AdvancedPlanFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableProviders: string[];
  availableFeatures: string[];
  className?: string;
}

const AdvancedPlanFilters = ({
  filters,
  onFiltersChange,
  availableProviders,
  availableFeatures,
  className
}: AdvancedPlanFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleProvider = (provider: string) => {
    const newProviders = filters.providers.includes(provider)
      ? filters.providers.filter(p => p !== provider)
      : [...filters.providers, provider];
    updateFilter('providers', newProviders);
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    updateFilter('features', newFeatures);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchQuery: '',
      category: 'all',
      priceRange: [0, 500],
      minRating: 0,
      sortBy: 'popularity',
      providers: [],
      contractLength: [],
      features: [],
      showPopularOnly: false,
      showNewOnly: false
    });
  };

  const activeFiltersCount = [
    filters.searchQuery ? 1 : 0,
    filters.category !== 'all' ? 1 : 0,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 500 ? 1 : 0,
    filters.minRating > 0 ? 1 : 0,
    filters.providers.length,
    filters.contractLength.length,
    filters.features.length,
    filters.showPopularOnly ? 1 : 0,
    filters.showNewOnly ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

  const categoryIcons = {
    electricity: Zap,
    internet: Wifi,
    mobile: Smartphone,
    tv: Tv
  };

  return (
    <Card className={cn("w-full bg-white/95 backdrop-blur-sm border-border/50 shadow-lg", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-xl">
              <Filter className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold">חיפוש וסינון מתקדם</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {activeFiltersCount} פילטרים פעילים
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                נקה הכל
              </Button>
            )}
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  {isExpanded ? 'פחות אפשרויות' : 'עוד אפשרויות'}
                  <ChevronDown className={cn("h-4 w-4 ml-2 transition-transform", isExpanded && "rotate-180")} />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search and Quick Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חפש לפי שם ספק או מסלול..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="pr-10 bg-white/80 border-border/60 focus:border-primary/50"
            />
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">מיון לפי</Label>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'popularity', label: 'פופולריות', icon: TrendingUp },
                { value: 'price', label: 'מחיר', icon: DollarSign },
                { value: 'rating', label: 'דירוג', icon: Star },
                { value: 'savings', label: 'חיסכון', icon: TrendingUp }
              ].map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant={filters.sortBy === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter('sortBy', value)}
                  className="h-8"
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">קטגוריה</Label>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filters.category === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('category', 'all')}
              className="h-9"
            >
              הכל
            </Button>
            {Object.entries(categoryIcons).map(([category, Icon]) => (
              <Button
                key={category}
                variant={filters.category === category ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilter('category', category)}
                className="h-9 flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {category === 'electricity' && 'חשמל'}
                {category === 'internet' && 'אינטרנט'}
                {category === 'mobile' && 'סלולר'}
                {category === 'tv' && 'טלוויזיה'}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex gap-3 flex-wrap">
          <Button
            variant={filters.showPopularOnly ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilter('showPopularOnly', !filters.showPopularOnly)}
            className="h-8"
          >
            <Star className="h-3 w-3 mr-1" />
            פופולריים בלבד
          </Button>
          <Button
            variant={filters.showNewOnly ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilter('showNewOnly', !filters.showNewOnly)}
            className="h-8"
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            חדש בשוק
          </Button>
        </div>

        {/* Advanced Filters - Collapsible */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-6 pt-4 border-t border-border/30">
            
            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                טווח מחירים: ₪{filters.priceRange[0]} - ₪{filters.priceRange[1]} לחודש
              </Label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter('priceRange', value)}
                max={500}
                min={0}
                step={10}
                className="w-full"
              />
            </div>

            {/* Minimum Rating */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                דירוג מינימלי: {filters.minRating > 0 ? `${filters.minRating} כוכבים` : 'ללא מגבלה'}
              </Label>
              <Slider
                value={[filters.minRating]}
                onValueChange={(value) => updateFilter('minRating', value[0])}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Providers */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">ספקים</Label>
              <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto">
                {availableProviders.map((provider) => (
                  <Button
                    key={provider}
                    variant={filters.providers.includes(provider) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleProvider(provider)}
                    className="h-8"
                  >
                    {provider}
                  </Button>
                ))}
              </div>
            </div>

            {/* Contract Length */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">תקופת התקשרות</Label>
              <div className="flex gap-2 flex-wrap">
                {['ללא התקשרות', '12 חודשים', '24 חודשים', '36 חודשים'].map((length) => (
                  <Button
                    key={length}
                    variant={filters.contractLength.includes(length) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const newLengths = filters.contractLength.includes(length)
                        ? filters.contractLength.filter(l => l !== length)
                        : [...filters.contractLength, length];
                      updateFilter('contractLength', newLengths);
                    }}
                    className="h-8 flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    {length}
                  </Button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">תכונות</Label>
              <div className="flex gap-2 flex-wrap max-h-32 overflow-y-auto">
                {availableFeatures.slice(0, 10).map((feature) => (
                  <Button
                    key={feature}
                    variant={filters.features.includes(feature) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFeature(feature)}
                    className="h-8 text-xs"
                  >
                    {feature}
                  </Button>
                ))}
              </div>
            </div>

          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default AdvancedPlanFilters;