import { useState } from "react";
import { Filter, X, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AllPlansFilterBarProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  providers: string[];
  selectedProviders: string[];
  onProviderToggle: (provider: string) => void;
  minValueScore: number;
  onMinValueScoreChange: (score: number) => void;
  greatDealsOnly: boolean;
  onGreatDealsOnlyChange: (val: boolean) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export const AllPlansFilterBar = ({
  priceRange,
  onPriceRangeChange,
  maxPrice,
  providers,
  selectedProviders,
  onProviderToggle,
  minValueScore,
  onMinValueScoreChange,
  greatDealsOnly,
  onGreatDealsOnlyChange,
  onClearFilters,
  activeFilterCount,
}: AllPlansFilterBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Toggle Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors touch-manipulation"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">סינון מתקדם</span>
          {activeFilterCount > 0 && (
            <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onClearFilters(); }}
              className="text-xs text-muted-foreground h-7"
            >
              <X className="w-3 h-3 ml-1" />
              נקה הכל
            </Button>
          )}
          <span className={cn("text-xs text-muted-foreground transition-transform", isExpanded && "rotate-180")}>▼</span>
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-100 space-y-5">
          {/* Price Range */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              טווח מחירים: ₪{priceRange[0]} - ₪{priceRange[1]}
            </Label>
            <Slider
              value={priceRange}
              onValueChange={(v) => onPriceRangeChange(v as [number, number])}
              min={0}
              max={maxPrice}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>₪0</span>
              <span>₪{maxPrice}</span>
            </div>
          </div>

          {/* Providers */}
          <div>
            <Label className="text-sm font-medium mb-2 block">ספקים</Label>
            <div className="flex flex-wrap gap-2">
              {providers.map(provider => (
                <label
                  key={provider}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-all touch-manipulation",
                    selectedProviders.includes(provider)
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  )}
                >
                  <Checkbox
                    checked={selectedProviders.includes(provider)}
                    onCheckedChange={() => onProviderToggle(provider)}
                    className="h-3.5 w-3.5"
                  />
                  {provider}
                </label>
              ))}
            </div>
          </div>

          {/* Min Value Score */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              ציון ערך מינימלי: {minValueScore}
            </Label>
            <Slider
              value={[minValueScore]}
              onValueChange={([v]) => onMinValueScoreChange(v)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Great Deals Toggle */}
          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">עסקאות מעולות בלבד</span>
            </div>
            <Switch
              checked={greatDealsOnly}
              onCheckedChange={onGreatDealsOnlyChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};
