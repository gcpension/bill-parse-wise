import { ManualPlan } from "@/data/manual-plans";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, Check, Heart, TrendingDown, Zap } from "lucide-react";
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
      "h-full transition-all hover:shadow-lg",
      isComparing && "ring-2 ring-foreground",
      isViewed && "bg-muted/30"
    )}>
      <CardHeader className="space-y-4 pb-4">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg truncate font-heebo">{plan.company}</h3>
              {isBestPrice && (
                <Badge variant="secondary" className="gap-1 shrink-0">
                  <TrendingDown className="w-3 h-3" />
                  מחיר מעולה
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-assistant line-clamp-2">
              {plan.planName}
            </p>
          </div>
          
          {/* Action Icons */}
          <div className="flex gap-1 shrink-0">
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleFavorite}
                className="h-8 w-8"
              >
                <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
              </Button>
            )}
            {isViewed && (
              <div className="h-8 w-8 flex items-center justify-center">
                <Eye className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Price Section */}
        {plan.regularPrice > 0 && (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-heebo">₪{plan.regularPrice}</span>
            <span className="text-sm text-muted-foreground font-assistant">לחודש</span>
            {savingsAmount && savingsAmount > 0 && (
              <Badge variant="outline" className="gap-1">
                <TrendingDown className="w-3 h-3" />
                חסוך ₪{savingsAmount}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Features List */}
        {plan.features && plan.features.length > 0 && (
          <div className="space-y-2">
            {plan.features.slice(0, 4).map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground font-assistant line-clamp-2">{feature}</span>
              </div>
            ))}
            {plan.features.length > 4 && (
              <p className="text-sm text-muted-foreground font-assistant">
                +{plan.features.length - 4} תכונות נוספות
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={onSelect} 
            className="flex-1 font-heebo"
            variant="default"
          >
            בחר מסלול
          </Button>
          {onToggleCompare && (
            <Button
              variant="outline"
              onClick={onToggleCompare}
              disabled={comparisonDisabled && !isComparing}
              className="font-heebo"
            >
              {isComparing ? 'הסר' : 'השווה'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
