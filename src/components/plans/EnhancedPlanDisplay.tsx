import { ManualPlan } from "@/data/manual-plans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, CheckCircle, Plus, Minus, ExternalLink, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedPlanDisplayProps {
  plan: ManualPlan;
  viewMode: 'grid' | 'list';
  isFavorite: boolean;
  isViewed: boolean;
  isInComparison: boolean;
  canAddToComparison: boolean;
  onToggleFavorite: () => void;
  onToggleComparison: () => void;
  onSelect: () => void;
}

export const EnhancedPlanDisplay = ({
  plan,
  viewMode,
  isFavorite,
  isViewed,
  isInComparison,
  canAddToComparison,
  onToggleFavorite,
  onToggleComparison,
  onSelect
}: EnhancedPlanDisplayProps) => {
  if (viewMode === 'list') {
    return (
      <Card className={cn(
        "transition-all duration-300 hover:shadow-xl border-2",
        isInComparison && "ring-2 ring-primary",
        isViewed && "bg-blue-50/30"
      )}>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Company & Plan Info */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl font-bold font-heebo">{plan.company}</CardTitle>
                {isViewed && (
                  <Badge variant="outline" className="gap-1">
                    <Eye className="w-3 h-3" />
                    נצפה
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground font-assistant">{plan.planName}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {plan.features.slice(0, 3).map((feature, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    <CheckCircle className="w-3 h-3 ml-1" />
                    {feature}
                  </Badge>
                ))}
                {plan.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{plan.features.length - 3} נוספות
                  </Badge>
                )}
              </div>
            </div>

            {/* Price & Actions */}
            <div className="flex items-center gap-4">
              {plan.regularPrice > 0 && (
                <div className="text-left">
                  <div className="text-3xl font-bold text-primary font-heebo">
                    ₪{plan.regularPrice}
                  </div>
                  <div className="text-sm text-muted-foreground font-assistant">לחודש</div>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleFavorite}
                  className={cn(isFavorite && "text-yellow-500")}
                >
                  <Star className={cn("w-5 h-5", isFavorite && "fill-yellow-500")} />
                </Button>
                
                <Button
                  variant={isInComparison ? "default" : "outline"}
                  size="icon"
                  onClick={onToggleComparison}
                  disabled={!canAddToComparison && !isInComparison}
                >
                  {isInComparison ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </Button>
                
                <Button onClick={onSelect} size="icon">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 relative overflow-hidden",
      isInComparison && "ring-2 ring-primary",
      isViewed && "bg-blue-50/30"
    )}>
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFavorite}
          className={cn(
            "h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:scale-110 transition-transform",
            isFavorite && "text-yellow-500"
          )}
        >
          <Star className={cn("w-4 h-4", isFavorite && "fill-yellow-500")} />
        </Button>
        
        {isViewed && (
          <Badge className="bg-blue-500 text-white shadow-md">
            <Eye className="w-3 h-3 ml-1" />
            נצפה
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold font-heebo">{plan.company}</CardTitle>
        <p className="text-sm text-muted-foreground font-assistant">{plan.planName}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {plan.regularPrice > 0 && (
          <div className="text-center py-3 bg-primary/5 rounded-lg">
            <div className="text-3xl font-bold text-primary font-heebo">
              ₪{plan.regularPrice}
            </div>
            <div className="text-sm text-muted-foreground font-assistant">לחודש</div>
          </div>
        )}

        <div className="space-y-2">
          {plan.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="font-assistant">{feature}</span>
            </div>
          ))}
          {plan.features.length > 3 && (
            <Badge variant="outline" className="text-xs w-full justify-center">
              +{plan.features.length - 3} תכונות נוספות
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant={isInComparison ? "default" : "outline"}
            size="sm"
            onClick={onToggleComparison}
            disabled={!canAddToComparison && !isInComparison}
            className="flex-1 font-heebo"
          >
            {isInComparison ? <Minus className="w-4 h-4 ml-1" /> : <Plus className="w-4 h-4 ml-1" />}
            {isInComparison ? 'הסר' : 'השווה'}
          </Button>
          
          <Button onClick={onSelect} size="sm" className="flex-1 font-heebo">
            בחר מסלול
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
