import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X, Grid3x3, List } from "lucide-react";
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
  return (
    <div className="space-y-4">
      {/* Main Controls */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="חיפוש לפי שם חברה, מסלול או תכונות..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10 font-assistant"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => onSearchChange('')}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {/* Sort */}
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as any)}>
          <SelectTrigger className="w-[200px] font-assistant">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">מחיר: מהנמוך לגבוה</SelectItem>
            <SelectItem value="price-desc">מחיר: מהגבוה לנמוך</SelectItem>
            <SelectItem value="name">שם המסלול</SelectItem>
            <SelectItem value="features">מספר תכונות</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Filters Toggle */}
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={onToggleFilters}
          className="font-heebo"
        >
          <SlidersHorizontal className="w-4 h-4 ml-2" />
          סינון
        </Button>
        
        {/* View Mode */}
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === 'grid' ? "default" : "ghost"}
            size="icon"
            onClick={() => onViewModeChange('grid')}
            className="rounded-l-none"
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? "default" : "ghost"}
            size="icon"
            onClick={() => onViewModeChange('list')}
            className="rounded-r-none"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div>
              <Label className="font-heebo mb-3 block">טווח מחירים</Label>
              <Slider
                value={priceRange}
                onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                max={maxPrice}
                min={0}
                step={10}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground font-assistant">
                <span>₪{priceRange[0]}</span>
                <span>₪{priceRange[1]}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-assistant">{resultsCount} מסלולים נמצאו</span>
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange('')}
            className="h-8"
          >
            נקה חיפוש
          </Button>
        )}
      </div>
    </div>
  );
};
