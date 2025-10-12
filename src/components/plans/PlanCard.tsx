import { ManualPlan } from "@/data/manual-plans";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, Check, Heart, TrendingDown, Zap, Crown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  plan: ManualPlan;
  isFavorite?: boolean;
  isViewed?: boolean;
  isComparing?: boolean;
  isBestPrice?: boolean;
  onToggleFavorite?: () => void;
  onToggleCompare?: () => void;
  onSelect: () => void;
  onViewDetails?: () => void;
  comparisonDisabled?: boolean;
  savingsAmount?: number;
}

export const PlanCard = ({
  plan,
  isFavorite = false,
  isViewed = false,
  isComparing = false,
  isBestPrice = false,
  onToggleFavorite,
  onToggleCompare,
  onSelect,
  onViewDetails,
  comparisonDisabled = false,
  savingsAmount
}: PlanCardProps) => {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg border",
      "hover:scale-[1.01]",
      isComparing ? "border-primary shadow-md ring-1 ring-primary/20" : "border-border hover:border-primary/50",
      isViewed && "bg-muted/20"
    )}
    onClick={onSelect}
    >
      {/* Animated Corner Accent */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-[100%] transition-all duration-300 group-hover:w-16 group-hover:h-16" />
      
      {/* Best Price Badge */}
      {isBestPrice && (
        <div className="absolute top-2 left-2 z-10 animate-scale-in">
          <Badge className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-orange-500 text-white font-assistant text-xs shadow-md border-0 px-2 py-0.5">
            <Crown className="w-2.5 h-2.5 ml-0.5" />
            מעולה
          </Badge>
        </div>
      )}

      {/* Status Badges */}
      <div className="absolute top-2 right-2 z-10 flex gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7 rounded-full transition-all duration-300 shadow-md",
            isFavorite 
              ? "bg-gradient-to-br from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700" 
              : "bg-background/90 hover:bg-background backdrop-blur-sm"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
        >
          <Star className={cn(
            "h-3 w-3 transition-all duration-300",
            isFavorite && "fill-current"
          )} />
        </Button>
        
        {isViewed && (
          <Badge variant="outline" className="bg-background/90 backdrop-blur-sm font-assistant border-primary/30 text-xs px-1.5 py-0.5">
            <Eye className="w-2.5 h-2.5 ml-0.5" />
            נצפה
          </Badge>
        )}
      </div>

      <CardHeader className="relative space-y-2 pb-2 pt-10">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-base truncate font-heebo group-hover:text-primary transition-colors">{plan.company}</h3>
            </div>
            <p className="text-sm text-muted-foreground font-assistant line-clamp-1 group-hover:text-foreground transition-colors">
              {plan.planName}
            </p>
          </div>
        </div>

        {/* Price Section with Animation */}
        {plan.regularPrice > 0 && (
          <div className="flex items-baseline gap-2 p-2 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 group-hover:border-primary/40 transition-all">
            <span className="text-2xl font-bold font-heebo text-primary">₪{plan.regularPrice}</span>
            <span className="text-xs text-muted-foreground font-assistant">לחודש</span>
            {savingsAmount && savingsAmount > 0 && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-assistant text-xs px-1.5 py-0.5">
                <TrendingDown className="w-2.5 h-2.5 ml-0.5" />
                חסוך ₪{savingsAmount}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="relative space-y-2 pt-2 pb-3">
        {/* Features List with Animation */}
        {plan.features && plan.features.length > 0 && (
          <div className="space-y-1">
            {plan.features.slice(0, 3).map((feature, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-1.5 text-xs p-1.5 rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-green-600" />
                </div>
                <span className="text-muted-foreground font-assistant line-clamp-1">{feature}</span>
              </div>
            ))}
            {plan.features.length > 3 && (
              <p className="text-xs text-primary font-assistant font-semibold px-1.5">
                +{plan.features.length - 3} תכונות נוספות
              </p>
            )}
          </div>
        )}

        {/* Action Buttons with Enhanced Design */}
        <div className="space-y-1.5 pt-2">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="w-full font-heebo h-8 text-sm bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all"
            variant="default"
          >
            בחר מסלול
          </Button>
          <div className="flex gap-1.5">
            {onViewDetails && (
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
                className="flex-1 font-heebo h-7 text-xs transition-all"
              >
                <Info className="w-3 h-3 ml-1" />
                פרטים
              </Button>
            )}
            {onToggleCompare && (
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare();
                }}
                disabled={comparisonDisabled && !isComparing}
                className={cn(
                  "flex-1 font-heebo h-7 text-xs transition-all",
                  isComparing && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {isComparing ? 'הסר' : 'השווה'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
