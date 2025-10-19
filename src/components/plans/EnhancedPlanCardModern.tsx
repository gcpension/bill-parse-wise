import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  TrendingDown, 
  Sparkles,
  Star,
  Award,
  Zap,
  Wifi,
  Smartphone,
  Tv,
  Phone,
  Calendar,
  Shield,
  Eye,
  EyeOff,
  ArrowLeft,
  Crown,
  Info,
  Users,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PlanRecord } from "@/hooks/useAllPlans";

interface EnhancedPlanCardModernProps {
  plan: PlanRecord;
  isRecommended?: boolean;
  savings?: number;
  onSelect: (plan: PlanRecord) => void;
  onShowDetails?: (plan: PlanRecord) => void;
  rank?: number;
  className?: string;
  companyLogo?: string;
  style?: React.CSSProperties;
}

const EnhancedPlanCardModern = ({
  plan,
  isRecommended = false,
  savings = 0,
  onSelect,
  onShowDetails,
  rank,
  className,
  companyLogo,
  style
}: EnhancedPlanCardModernProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const getCategoryIcon = (service: string) => {
    if (service.includes('חשמל')) return Zap;
    if (service.includes('אינטרנט')) return Wifi;
    if (service.includes('סלולר')) return Smartphone;
    if (service.includes('טלוויזיה') || service.includes('טריפל')) return Tv;
    return Phone;
  };

  const getCategoryColor = (service: string) => {
    if (service.includes('חשמל')) return 'from-yellow-400 to-yellow-600';
    if (service.includes('אינטרנט')) return 'from-blue-400 to-cyan-600';
    if (service.includes('סלולר')) return 'from-green-400 to-emerald-600';
    if (service.includes('טלוויזיה') || service.includes('טריפל')) return 'from-purple-400 to-pink-600';
    return 'from-gray-400 to-gray-600';
  };

  const getRankBadge = () => {
    if (rank === 1) return { text: "המומלץ ביותר", color: "bg-gradient-to-r from-yellow-500 to-amber-600", icon: Crown };
    if (rank === 2) return { text: "מומלץ מאוד", color: "bg-gradient-to-r from-gray-400 to-gray-600", icon: Award };
    if (rank === 3) return { text: "בחירה טובה", color: "bg-gradient-to-r from-orange-400 to-orange-600", icon: Star };
    return null;
  };

  const CategoryIcon = getCategoryIcon(plan.service);
  const rankBadge = getRankBadge();

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-500 hover:shadow-2xl border-border/40",
        "bg-gradient-to-br from-card/95 to-muted/20 backdrop-blur-sm",
        isRecommended && "ring-2 ring-green-500/40 shadow-xl shadow-green-500/10",
        showDetails && "scale-105 z-10",
        className
      )}
      style={style}
    >
      {/* Animated Background Gradient */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-r pointer-events-none",
        getCategoryColor(plan.service)
      )} />

      {/* Top Badges Row */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
        {isRecommended && (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-sm text-[10px] px-1.5 py-0">
            <Sparkles className="w-2.5 h-2.5 ml-0.5" />
            מומלץ
          </Badge>
        )}
        {rankBadge && (
          <Badge className={`${rankBadge.color} text-white border-0 shadow-sm text-[10px] px-1.5 py-0`}>
            <rankBadge.icon className="w-2.5 h-2.5 ml-0.5" />
            {rankBadge.text}
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2 pt-8">
        <div className="flex items-start gap-2 mb-2">
          {/* Category Icon with Gradient */}
          <div className={cn(
            "p-1.5 rounded-lg bg-gradient-to-r text-white shadow-md shrink-0",
            getCategoryColor(plan.service)
          )}>
            <CategoryIcon className="w-3.5 h-3.5" />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Company Logo or Name */}
            {companyLogo ? (
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-6 h-6 bg-background rounded shadow-sm flex items-center justify-center p-0.5 border">
                  <img src={companyLogo} alt={plan.company} className="max-w-full max-h-full object-contain" />
                </div>
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {plan.company}
                </h3>
              </div>
            ) : (
              <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-0.5">
                {plan.company}
              </h3>
            )}
            
            {/* Plan Name */}
            <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">
              {plan.plan}
            </p>
          </div>
        </div>

        {/* Service Type Badge */}
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="border-border/60 text-muted-foreground font-normal text-[10px] px-1.5 py-0">
            {plan.service}
          </Badge>
          {plan.transferBenefits && (
            <Badge variant="outline" className="border-primary/30 text-primary font-normal text-[10px] px-1.5 py-0">
              🎁 מעבר
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-2">
        {/* Price Section - Enhanced */}
        <div className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 rounded-lg p-2.5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary">₪{plan.monthlyPrice}</span>
                <span className="text-xs text-muted-foreground">/חודש</span>
              </div>
              {savings > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-bold text-green-700">
                    חיסכון ₪{savings.toFixed(0)}
                  </span>
                </div>
              )}
            </div>
            {savings > 0 && (
              <div className="text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-md">
                  <div className="text-center">
                    <div className="text-sm font-bold leading-none">₪{(savings * 12).toFixed(0)}</div>
                    <div className="text-[8px] leading-none mt-0.5">בשנה</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transfer Benefits - If Exists */}
        {plan.transferBenefits && (
          <div className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-200/50 rounded-lg p-2">
            <div className="flex items-start gap-1.5">
              <span className="text-sm shrink-0">🎁</span>
              <p className="text-[10px] text-amber-800/90 leading-snug line-clamp-2">
                {plan.transferBenefits}
              </p>
            </div>
          </div>
        )}

        {/* Key Information Grid */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="bg-muted/30 rounded p-1.5 border border-border/30">
            <div className="flex items-center gap-1 mb-0.5">
              <Calendar className="w-2.5 h-2.5 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground">התחייבות</span>
            </div>
            <p className="text-xs font-bold text-foreground">12 חודשים</p>
          </div>
          
          <div className="bg-muted/30 rounded p-1.5 border border-border/30">
            <div className="flex items-center gap-1 mb-0.5">
              <Shield className="w-2.5 h-2.5 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground">אמינות</span>
            </div>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "w-2.5 h-2.5",
                    i < 4 ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"
                  )} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Additional Details - Expandable */}
        {showDetails && (
          <div className="space-y-2 animate-fade-in pt-1.5 border-t border-border/50">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-green-600">99%</div>
                <div className="text-[9px] text-muted-foreground leading-tight">זמינות</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-blue-600">24/7</div>
                <div className="text-[9px] text-muted-foreground leading-tight">תמיכה</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-purple-600">4.8</div>
                <div className="text-[9px] text-muted-foreground leading-tight">דירוג</div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-muted/20 rounded p-2 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>10,000+ לקוחות</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>מעבר: 3-5 ימים</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-1.5 pt-1.5">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onSelect(plan);
            }}
            size="sm"
            className={cn(
              "w-full font-bold text-xs h-8 shadow-md hover:shadow-lg transition-all duration-300 relative z-10",
              isRecommended 
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white" 
                : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground"
            )}
          >
            {isRecommended ? (
              <>
                <CheckCircle2 className="ml-1.5 h-3.5 w-3.5" />
                עברו למסלול
              </>
            ) : (
              <>
                <ArrowLeft className="ml-1.5 h-3.5 w-3.5" />
                בחרו מסלול
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (onShowDetails) {
                onShowDetails(plan);
              } else {
                setShowDetails(!showDetails);
              }
            }}
            className="w-full font-medium text-[10px] h-6 hover:bg-muted/50 transition-colors relative z-10"
          >
            {showDetails ? (
              <>
                <EyeOff className="ml-1 h-3 w-3" />
                הסתר
              </>
            ) : (
              <>
                <Eye className="ml-1 h-3 w-3" />
                פרטים
              </>
            )}
          </Button>
        </div>
      </CardContent>

      {/* Bottom Glow Effect */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Card>
  );
};

export default EnhancedPlanCardModern;
