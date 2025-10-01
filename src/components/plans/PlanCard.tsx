import { ManualPlan } from "@/data/manual-plans";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, Check, Heart, TrendingDown, Zap, Crown } from "lucide-react";
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
  comparisonDisabled = false,
  savingsAmount
}: PlanCardProps) => {
  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-500 hover:shadow-2xl border-2 cursor-pointer",
      "hover:scale-[1.03] hover:-translate-y-1",
      isComparing ? "border-primary shadow-xl scale-[1.02] ring-2 ring-primary/20" : "border-border hover:border-primary/50",
      isViewed && "bg-muted/30",
      "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/0 before:to-primary/5 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100"
    )}
    onClick={onSelect}
    >
      {/* Animated Corner Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-[100%] transition-all duration-500 group-hover:w-32 group-hover:h-32" />
      
      {/* Best Price Badge */}
      {isBestPrice && (
        <div className="absolute top-3 left-3 z-10 animate-scale-in">
          <Badge className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-orange-500 text-white font-assistant shadow-lg border-0">
            <Crown className="w-3 h-3 ml-1" />
            מחיר מעולה
          </Badge>
        </div>
      )}

      {/* Status Badges */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 rounded-full transition-all duration-300 shadow-lg",
            isFavorite 
              ? "bg-gradient-to-br from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 scale-110" 
              : "bg-background/90 hover:bg-background backdrop-blur-sm hover:scale-110"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
        >
          <Star className={cn(
            "h-4 w-4 transition-all duration-300",
            isFavorite && "fill-current animate-pulse"
          )} />
        </Button>
        
        {isViewed && (
          <Badge variant="outline" className="bg-background/90 backdrop-blur-sm font-assistant border-primary/30 animate-fade-in">
            <Eye className="w-3 h-3 ml-1" />
            נצפה
          </Badge>
        )}
      </div>

      <CardHeader className="relative space-y-4 pb-4 pt-16">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-xl truncate font-heebo group-hover:text-primary transition-colors">{plan.company}</h3>
            </div>
            <p className="text-base text-muted-foreground font-assistant line-clamp-2 group-hover:text-foreground transition-colors">
              {plan.planName}
            </p>
          </div>
        </div>

        {/* Price Section with Animation */}
        {plan.regularPrice > 0 && (
          <div className="flex items-baseline gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 group-hover:border-primary/40 transition-all">
            <span className="text-4xl font-bold font-heebo text-primary">₪{plan.regularPrice}</span>
            <span className="text-sm text-muted-foreground font-assistant">לחודש</span>
            {savingsAmount && savingsAmount > 0 && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-assistant animate-fade-in">
                <TrendingDown className="w-3 h-3 ml-1" />
                חסוך ₪{savingsAmount}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Features List with Animation */}
        {plan.features && plan.features.length > 0 && (
          <div className="space-y-2">
            {plan.features.slice(0, 4).map((feature, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-2 text-sm p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-muted-foreground font-assistant line-clamp-2">{feature}</span>
              </div>
            ))}
            {plan.features.length > 4 && (
              <p className="text-sm text-primary font-assistant font-semibold px-2">
                +{plan.features.length - 4} תכונות נוספות
              </p>
            )}
          </div>
        )}

        {/* Action Buttons with Enhanced Design */}
        <div className="flex gap-2 pt-4">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="flex-1 font-heebo h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all"
            variant="default"
          >
            בחר מסלול
          </Button>
          {onToggleCompare && (
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare();
              }}
              disabled={comparisonDisabled && !isComparing}
              className={cn(
                "font-heebo h-11 transition-all",
                isComparing && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {isComparing ? 'הסר' : 'השווה'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
