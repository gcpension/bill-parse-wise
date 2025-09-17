import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ManualPlan } from "@/data/manual-plans";
import { 
  Building2, 
  Check, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Award, 
  Flame, 
  Sparkles,
  Wifi,
  Phone,
  Clock,
  Shield,
  HeartHandshake,
  Zap,
  Eye,
  EyeOff,
  ArrowRight,
  Crown,
  CheckCircle,
  Users,
  Gauge,
  Calendar,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractivePlanCardProps {
  plan: ManualPlan;
  isCompared?: boolean;
  onCompareToggle?: (plan: ManualPlan) => void;
  canCompare?: boolean;
  showSavings?: boolean;
  estimatedSavings?: number;
  rank?: number;
  className?: string;
  onSelect?: (plan: ManualPlan) => void;
  isRecommended?: boolean;
  popularityScore?: number;
}

const InteractivePlanCard = ({
  plan,
  isCompared = false,
  onCompareToggle,
  canCompare = true,
  showSavings = false,
  estimatedSavings,
  rank,
  className = "",
  onSelect,
  isRecommended = false,
  popularityScore = 0
}: InteractivePlanCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getRankBadge = () => {
    if (rank === 1) return { text: "הכי מומלץ", color: "bg-gradient-to-r from-yellow-400 to-yellow-500", icon: Crown };
    if (rank === 2) return { text: "מומלץ מאוד", color: "bg-gradient-to-r from-gray-400 to-gray-500", icon: Award };
    if (rank === 3) return { text: "בחירה טובה", color: "bg-gradient-to-r from-orange-400 to-orange-500", icon: Star };
    return null;
  };

  const getCategoryColor = () => {
    switch (plan.category) {
      case 'electricity': return 'from-yellow-400 to-yellow-500';
      case 'mobile': return 'from-purple-400 to-purple-500';
      case 'internet': return 'from-cyan-400 to-cyan-500';
      case 'tv': return 'from-orange-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getCategoryIcon = () => {
    switch (plan.category) {
      case 'electricity': return Zap;
      case 'mobile': return Phone;
      case 'internet': return Wifi;
      case 'tv': return Building2;
      default: return Building2;
    }
  };

  const rankBadge = getRankBadge();
  const CategoryIcon = getCategoryIcon();

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-500 hover:shadow-2xl cursor-pointer border-0",
        "bg-gradient-to-br from-card/90 to-accent/5 backdrop-blur-xl",
        isRecommended && "ring-2 ring-primary/30 shadow-lg shadow-primary/20",
        showDetails && "scale-105 z-10",
        className
      )}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Background Glow Effect */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-500",
        `bg-gradient-to-r ${getCategoryColor()}`
      )} />

      {/* Floating Badges */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        {isRecommended && (
          <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0 shadow-lg animate-pulse">
            <Sparkles className="w-3 h-3 mr-1" />
            מומלץ AI
          </Badge>
        )}
        {rankBadge && (
          <Badge className={`${rankBadge.color} text-white border-0 shadow-lg`}>
            <rankBadge.icon className="w-3 h-3 mr-1" />
            {rankBadge.text}
          </Badge>
        )}
        {popularityScore > 70 && (
          <Badge className="bg-gradient-to-r from-red-400 to-red-500 text-white border-0 shadow-lg">
            <Flame className="w-3 h-3 mr-1" />
            פופולרי
          </Badge>
        )}
      </div>

      {/* Compare Checkbox */}
      {canCompare && onCompareToggle && (
        <div className="absolute top-4 left-4 z-10">
          <div 
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:scale-110 transition-transform duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onCompareToggle(plan);
            }}
          >
            <Checkbox 
              checked={isCompared}
              className="w-5 h-5"
            />
          </div>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Company & Plan Name */}
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(
                "p-2 rounded-xl bg-gradient-to-r text-white shadow-md",
                getCategoryColor()
              )}>
                <CategoryIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {plan.company}
                </h3>
                <p className="text-sm text-muted-foreground">{plan.planName}</p>
              </div>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "w-4 h-4",
                      i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    )} 
                  />
                ))}
                <span className="text-sm font-medium text-foreground ml-1">4.2</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm">{Math.floor(Math.random() * 200) + 50} ביקורות</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Price Section */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-primary">₪{plan.regularPrice}</span>
                <span className="text-muted-foreground">/חודש</span>
              </div>
              {showSavings && estimatedSavings && (
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 font-bold">חיסכון ₪{estimatedSavings}</span>
                </div>
              )}
            </div>
            {popularityScore > 0 && (
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {popularityScore}%
                </div>
                <span className="text-xs text-muted-foreground">פופולריות</span>
              </div>
            )}
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-2 mb-4">
          {plan.features.slice(0, showDetails ? undefined : 3).map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-foreground">{feature}</span>
            </div>
          ))}
          {!showDetails && plan.features.length > 3 && (
            <button 
              className="flex items-center gap-1 text-primary text-sm font-medium hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(true);
              }}
            >
              <Eye className="w-4 h-4" />
              ועוד {plan.features.length - 3} תכונות
            </button>
          )}
        </div>

        {/* Contract Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>התחייבות: 12 חודשים</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            <span>אמין</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold transition-all duration-300 hover:scale-105 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(plan);
            }}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
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

        {/* Trust Indicators */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-border/50 animate-fade-in">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-lg font-bold text-green-600">99%</div>
                <div className="text-xs text-muted-foreground">זמינות</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-blue-600">4.8</div>
                <div className="text-xs text-muted-foreground">שירות</div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-purple-600">24/7</div>
                <div className="text-xs text-muted-foreground">תמיכה</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-lg" />
      </div>
    </Card>
  );
};

export default InteractivePlanCard;