import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, SlidersHorizontal, Grid3x3, List, Star, Eye, X, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvancedPlanSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'price-asc' | 'price-desc' | 'name' | 'features';
  onSortChange: (sort: 'price-asc' | 'price-desc' | 'name' | 'features') => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: () => void;
  resultsCount: number;
  favoritesCount: number;
  viewedCount: number;
}

export const AdvancedPlanSearch = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  showAdvancedFilters,
  onToggleAdvancedFilters,
  resultsCount,
  favoritesCount,
  viewedCount
}: AdvancedPlanSearchProps) => {
  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="חיפוש לפי שם, חברה או תכונות..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10 h-12 text-base font-assistant"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2"
              onClick={() => onSearchChange('')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as any)}>
            <SelectTrigger className="w-[180px] h-12 font-assistant">
              <SelectValue placeholder="מיון" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">מחיר: נמוך לגבוה</SelectItem>
              <SelectItem value="price-desc">מחיר: גבוה לנמוך</SelectItem>
              <SelectItem value="name">שם המסלול</SelectItem>
              <SelectItem value="features">כמות תכונות</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant={showAdvancedFilters ? "default" : "outline"}
            onClick={onToggleAdvancedFilters}
            className="h-12 font-heebo"
          >
            <SlidersHorizontal className="w-5 h-5 ml-2" />
            סינון מתקדם
          </Button>
          
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? "default" : "ghost"}
              size="icon"
              className="h-12 w-12 rounded-none"
              onClick={() => onViewModeChange('grid')}
            >
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "ghost"}
              size="icon"
              className="h-12 w-12 rounded-none"
              onClick={() => onViewModeChange('list')}
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <Card className="border-2 border-primary/20 animate-fade-in">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-bold font-heebo">טווח מחירים</Label>
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                  max={maxPrice}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground font-assistant">
                  <span>₪{priceRange[0]}</span>
                  <span>₪{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium font-assistant">
              {resultsCount} תוצאות
            </span>
          </div>
          {favoritesCount > 0 && (
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium font-assistant">
                {favoritesCount} מועדפים
              </span>
            </div>
          )}
          {viewedCount > 0 && (
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium font-assistant">
                {viewedCount} נצפו
              </span>
            </div>
          )}
        </div>
        
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange('')}
            className="font-assistant"
          >
            <X className="w-4 h-4 ml-1" />
            נקה חיפוש
          </Button>
        )}
      </div>
    </div>
  );
};
