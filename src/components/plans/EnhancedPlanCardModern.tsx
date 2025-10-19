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
        "bg-gradient-to-br from-card/95 to-muted/20 backdrop-blur-sm hover:scale-[1.02]",
        isRecommended && "ring-2 ring-green-500/40 shadow-xl shadow-green-500/10",
        showDetails && "scale-105 z-10",
        className
      )}
      style={style}
    >
      {/* Animated Background Gradient */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-r",
        getCategoryColor(plan.service)
      )} />

      {/* Top Badges Row */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
        {isRecommended && (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg animate-pulse-subtle">
            <Sparkles className="w-3 h-3 ml-1" />
            מומלץ במיוחד
          </Badge>
        )}
        {rankBadge && (
          <Badge className={`${rankBadge.color} text-white border-0 shadow-lg`}>
            <rankBadge.icon className="w-3 h-3 ml-1" />
            {rankBadge.text}
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3 pt-12">
        <div className="flex items-start gap-3 mb-3">
          {/* Category Icon with Gradient */}
          <div className={cn(
            "p-3 rounded-xl bg-gradient-to-r text-white shadow-lg shrink-0",
            getCategoryColor(plan.service)
          )}>
            <CategoryIcon className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Company Logo or Name */}
            {companyLogo ? (
              <div className="flex items-center gap-2 mb-1">
                <div className="w-10 h-10 bg-background rounded-lg shadow-sm flex items-center justify-center p-1.5 border">
                  <img src={companyLogo} alt={plan.company} className="max-w-full max-h-full object-contain" />
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {plan.company}
                </h3>
              </div>
            ) : (
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                {plan.company}
              </h3>
            )}
            
            {/* Plan Name */}
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {plan.plan}
            </p>
          </div>
        </div>

        {/* Service Type Badge */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-border/60 text-muted-foreground font-normal">
            {plan.service}
          </Badge>
          {plan.transferBenefits && (
            <Badge variant="outline" className="border-primary/30 text-primary font-normal">
              🎁 הטבת מעבר
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Price Section - Enhanced */}
        <div className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 rounded-2xl p-4 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">₪{plan.monthlyPrice}</span>
                <span className="text-sm text-muted-foreground">/חודש</span>
              </div>
              {savings > 0 && (
                <div className="flex items-center gap-1.5 mt-2">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-green-700">
                    חיסכון ₪{savings.toFixed(0)} בחודש
                  </span>
                </div>
              )}
            </div>
            {savings > 0 && (
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold leading-none">₪{(savings * 12).toFixed(0)}</div>
                    <div className="text-[9px] leading-none mt-0.5">בשנה</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transfer Benefits - If Exists */}
        {plan.transferBenefits && (
          <div className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 border border-amber-200/50 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <span className="text-lg shrink-0">🎁</span>
              <div>
                <h4 className="text-xs font-semibold text-amber-900 mb-0.5">הטבת מעבר מיוחדת</h4>
                <p className="text-xs text-amber-800/90 leading-relaxed">
                  {plan.transferBenefits}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Key Information Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/30 rounded-lg p-2.5 border border-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">התחייבות</span>
            </div>
            <p className="text-sm font-bold text-foreground">12 חודשים</p>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-2.5 border border-border/30">
            <div className="flex items-center gap-1.5 mb-1">
              <Shield className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">אמינות</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "w-3 h-3",
                    i < 4 ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"
                  )} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Additional Details - Expandable */}
        {showDetails && (
          <div className="space-y-3 animate-fade-in pt-2 border-t border-border/50">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="space-y-1">
                <div className="text-lg font-bold text-green-600">99%</div>
                <div className="text-[10px] text-muted-foreground leading-tight">זמינות שירות</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-blue-600">24/7</div>
                <div className="text-[10px] text-muted-foreground leading-tight">תמיכה</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-purple-600">4.8</div>
                <div className="text-[10px] text-muted-foreground leading-tight">דירוג לקוחות</div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-muted/20 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span>מעל 10,000 לקוחות מרוצים</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>זמן מעבר: 3-5 ימי עסקים</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button 
            onClick={() => onSelect(plan)}
            size="lg"
            className={cn(
              "w-full font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105",
              isRecommended 
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white" 
                : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground"
            )}
          >
            {isRecommended ? (
              <>
                <CheckCircle2 className="ml-2 h-5 w-5" />
                עברו למסלול המומלץ
              </>
            ) : (
              <>
                <ArrowLeft className="ml-2 h-5 w-5" />
                בחרו מסלול זה
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full font-medium text-sm hover:bg-muted/50 transition-colors"
          >
            {showDetails ? (
              <>
                <EyeOff className="ml-2 h-4 w-4" />
                הסתר פרטים
              </>
            ) : (
              <>
                <Eye className="ml-2 h-4 w-4" />
                הצג פרטים נוספים
              </>
            )}
          </Button>
        </div>
      </CardContent>

      {/* Bottom Glow Effect */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Card>
  );
};

export default EnhancedPlanCardModern;
