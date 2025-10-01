import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X, Grid3x3, List, Sparkles, TrendingUp, TrendingDown, Filter, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'price-asc' | 'price-desc' | 'name' | 'features';
  onSortChange: (sort: 'price-asc' | 'price-desc' | 'name' | 'features') => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  resultsCount: number;
}

export const PlanFilters = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  showFilters,
  onToggleFilters,
  resultsCount
}: PlanFiltersProps) => {
  const sortOptions = [
    { value: 'price-asc', label: 'מחיר: מהנמוך לגבוה', icon: TrendingUp, color: 'text-green-600' },
    { value: 'price-desc', label: 'מחיר: מהגבוה לנמוך', icon: TrendingDown, color: 'text-red-600' },
    { value: 'name', label: 'שם המסלול', icon: Filter, color: 'text-blue-600' },
    { value: 'features', label: 'מספר תכונות', icon: Sparkles, color: 'text-purple-600' },
  ];

  const currentSort = sortOptions.find(opt => opt.value === sortBy);

  return (
    <div className="space-y-5">
      {/* Enhanced Main Controls */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-white to-accent/5 shadow-lg hover:shadow-xl transition-all duration-500">
        <CardContent className="p-5">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Enhanced Search */}
            <div className="flex-1 relative group">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Search className="w-5 h-5 text-primary group-focus-within:scale-110 transition-transform duration-300" />
              </div>
              <Input
                type="text"
                placeholder="חיפוש לפי שם חברה, מסלול או תכונות..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pr-12 pl-10 h-12 border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-300 rounded-xl font-assistant text-base"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-all duration-300 rounded-full"
                  onClick={() => onSearchChange('')}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {/* Enhanced Sort */}
            <div className="relative">
              <Select value={sortBy} onValueChange={(value) => onSortChange(value as any)}>
                <SelectTrigger className="w-[240px] h-12 border-2 border-border hover:border-primary/50 focus:border-primary transition-all duration-300 rounded-xl font-assistant">
                  <div className="flex items-center gap-2">
                    {currentSort && (
                      <currentSort.icon className={cn("w-4 h-4", currentSort.color)} />
                    )}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className={cn("w-4 h-4", option.color)} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Enhanced Filters Toggle */}
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={onToggleFilters}
              className={cn(
                "font-heebo h-12 px-6 rounded-xl transition-all duration-300 hover:scale-105",
                showFilters && "bg-gradient-to-r from-primary to-accent shadow-lg"
              )}
            >
              <SlidersHorizontal className="w-5 h-5 ml-2" />
              סינון מתקדם
              {showFilters && <Sparkles className="w-4 h-4 mr-2 animate-pulse" />}
            </Button>
            
            {/* Enhanced View Mode */}
            <div className="flex border-2 border-border rounded-xl overflow-hidden shadow-md">
              <Button
                variant={viewMode === 'grid' ? "default" : "ghost"}
                size="icon"
                onClick={() => onViewModeChange('grid')}
                className={cn(
                  "rounded-none h-12 w-12 transition-all duration-300",
                  viewMode === 'grid' && "bg-gradient-to-r from-primary to-accent"
                )}
              >
                <Grid3x3 className="w-5 h-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "ghost"}
                size="icon"
                onClick={() => onViewModeChange('list')}
                className={cn(
                  "rounded-none h-12 w-12 transition-all duration-300",
                  viewMode === 'list' && "bg-gradient-to-r from-primary to-accent"
                )}
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Advanced Filters */}
      {showFilters && (
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-white to-accent/5 shadow-xl animate-fade-in overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
          
          <CardContent className="pt-8 pb-6 px-6 space-y-6 relative z-10">
            {/* Price Range Filter */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Label className="font-heebo text-lg font-bold text-foreground">טווח מחירים</Label>
                    <p className="text-xs text-muted-foreground font-assistant">בחר את טווח המחירים המתאים לך</p>
                  </div>
                </div>
                
                {/* Price Range Display */}
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-base border-0">
                    ₪{priceRange[0]}
                  </Badge>
                  <span className="text-muted-foreground">-</span>
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-base border-0">
                    ₪{priceRange[1]}
                  </Badge>
                </div>
              </div>
              
              {/* Enhanced Slider */}
              <div className="relative px-2">
                <Slider
                  value={priceRange}
                  onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                  max={maxPrice}
                  min={0}
                  step={10}
                  className="mb-3"
                />
                
                {/* Price Markers */}
                <div className="flex justify-between text-sm font-assistant">
                  <span className="text-muted-foreground">₪0</span>
                  <span className="text-muted-foreground">₪{Math.round(maxPrice / 2)}</span>
                  <span className="text-muted-foreground">₪{maxPrice}</span>
                </div>
              </div>
              
              {/* Quick Price Presets */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPriceRangeChange([0, 100])}
                  className="rounded-full hover:bg-primary/10 hover:border-primary transition-all duration-300"
                >
                  עד ₪100
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPriceRangeChange([100, 200])}
                  className="rounded-full hover:bg-primary/10 hover:border-primary transition-all duration-300"
                >
                  ₪100-200
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPriceRangeChange([200, 300])}
                  className="rounded-full hover:bg-primary/10 hover:border-primary transition-all duration-300"
                >
                  ₪200-300
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPriceRangeChange([0, maxPrice])}
                  className="rounded-full hover:bg-accent/10 hover:border-accent transition-all duration-300"
                >
                  <Sparkles className="w-3 h-3 ml-1" />
                  הכל
                </Button>
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-4 border-t border-border/50">
              <Button
                variant="ghost"
                onClick={() => {
                  onPriceRangeChange([0, maxPrice]);
                  onSearchChange('');
                }}
                className="w-full h-10 rounded-xl hover:bg-muted transition-all duration-300"
              >
                <X className="w-4 h-4 ml-2" />
                איפוס כל הפילטרים
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full px-4 py-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground font-heebo">{resultsCount}</span>
            <span className="text-sm text-muted-foreground font-assistant">מסלולים נמצאו</span>
          </div>
          
          {searchQuery && (
            <Badge variant="outline" className="px-3 py-1">
              חיפוש: "{searchQuery}"
            </Badge>
          )}
        </div>
        
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange('')}
            className="h-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
          >
            <X className="w-4 h-4 ml-1" />
            נקה חיפוש
          </Button>
        )}
      </div>
    </div>
  );
};
