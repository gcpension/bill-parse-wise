import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PlanRecord } from "@/hooks/useAllPlans";
import { 
  CheckCircle2,
  Info,
  Smartphone,
  Wifi,
  Tv,
  Zap,
  Globe,
  Signal,
  Router,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { parseTechnicalSpecs, calculateMarketPosition, getSuitabilityTags } from "@/lib/planParser";

interface InteractivePlanCardProps {
  plan: PlanRecord;
  isInComparison?: boolean;
  onToggleComparison?: () => void;
  onSelect?: () => void;
  isRecommended?: boolean;
  showCompareCheckbox?: boolean;
  showSelectButton?: boolean;
  rank?: number;
  allPlansInCategory?: PlanRecord[];
}

const InteractivePlanCard = ({
  plan,
  isInComparison = false,
  onToggleComparison,
  onSelect,
  isRecommended = false,
  showCompareCheckbox = false,
  showSelectButton = true,
  rank,
  allPlansInCategory = []
}: InteractivePlanCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  // Parse technical specifications
  const specs = parseTechnicalSpecs(plan.transferBenefits, plan.service);
  
  // Calculate market position
  const marketPosition = allPlansInCategory.length > 0 && plan.monthlyPrice
    ? calculateMarketPosition(plan.monthlyPrice, allPlansInCategory)
    : null;
  
  // Get suitability tags
  const suitabilityTags = getSuitabilityTags(
    specs, 
    plan.service, 
    marketPosition || { position: 'סטנדרטי', percentageDiff: 0, savings: 0 }
  );

  const getServiceIcon = () => {
    switch (plan.service) {
      case 'סלולר':
      case 'cellular':
        return <Smartphone className="h-5 w-5" />;
      case 'אינטרנט':
      case 'internet':
        return <Wifi className="h-5 w-5" />;
      case 'טלוויזיה':
      case 'tv':
        return <Tv className="h-5 w-5" />;
      case 'חשמל':
      case 'electricity':
        return <Zap className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer",
        "bg-gradient-to-br from-card/90 to-accent/5",
        isRecommended && "ring-2 ring-primary/30 shadow-lg shadow-primary/20",
        showDetails && "scale-105 z-10"
      )}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Compare Checkbox */}
      {showCompareCheckbox && onToggleComparison && (
        <div className="absolute top-4 left-4 z-10">
          <div 
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:scale-110 transition-transform duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onToggleComparison();
            }}
          >
            <Checkbox 
              checked={isInComparison}
              className="w-5 h-5"
            />
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
              {getServiceIcon()}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{plan.company}</p>
              <h3 className="font-semibold text-lg leading-tight">{plan.plan}</h3>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {isRecommended && (
            <Badge variant="default" className="bg-gradient-to-r from-primary to-primary/80">
              מומלץ
            </Badge>
          )}
          {rank && rank <= 3 && (
            <Badge variant="secondary">
              מקום #{rank}
            </Badge>
          )}
          {marketPosition && marketPosition.position === 'זול' && (
            <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
              חסכוני
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Technical Specs */}
        <div className="space-y-3 mb-4">
          {/* Cellular specs */}
          {(plan.service === 'סלולר' || plan.service === 'cellular') && (
            <div className="grid grid-cols-2 gap-2">
              {specs.dataVolume && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{specs.dataVolume}</span>
                </div>
              )}
              {specs.calls && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                  <Info className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{specs.calls}</span>
                </div>
              )}
              {specs.network && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                  <Signal className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{specs.network}</span>
                </div>
              )}
              {specs.internationalMinutes && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{specs.internationalMinutes} לחו"ל</span>
                </div>
              )}
            </div>
          )}

          {/* Internet specs */}
          {(plan.service === 'אינטרנט' || plan.service === 'internet') && (
            <div className="grid grid-cols-2 gap-2">
              {specs.speed && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                  <Wifi className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{specs.speed}</span>
                </div>
              )}
              {specs.technology && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                  <Signal className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{specs.technology}</span>
                </div>
              )}
              {specs.router && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                  <Router className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">נתב {specs.router}</span>
                </div>
              )}
            </div>
          )}

          {/* TV specs */}
          {(plan.service === 'טלוויזיה' || plan.service === 'tv') && (
            <div className="grid grid-cols-2 gap-2">
              {specs.channels && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                  <Tv className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{specs.channels}</span>
                </div>
              )}
              {specs.sports && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">ערוצי ספורט</span>
                </div>
              )}
              {specs.kids && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">ערוצי ילדים</span>
                </div>
              )}
              {specs.quality && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                  <Info className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{specs.quality}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Price and savings */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              ₪{plan.monthlyPrice || 0}
            </span>
            <span className="text-muted-foreground">/חודש</span>
          </div>
          {marketPosition && marketPosition.savings > 0 && (
            <p className="text-sm text-green-600 font-medium">
              חיסכון של ₪{marketPosition.savings} מהממוצע
            </p>
          )}
        </div>

        {/* Suitability tags */}
        {suitabilityTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {suitabilityTags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        {showSelectButton && onSelect && (
          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 font-bold transition-all duration-300 hover:scale-105 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              בחר מסלול זה
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="px-3 hover:bg-accent/50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractivePlanCard;
