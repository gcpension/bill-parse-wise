import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ManualPlan } from "@/data/manual-plans";
import { EnhancedSwitchRequestForm } from "@/components/forms/EnhancedSwitchRequestForm";
import TrustIndicators from "./TrustIndicators";
import PlanInsights from "./PlanInsights";
import { 
  Building2, 
  Check, 
  Star, 
  TrendingUp, 
  Award, 
  Flame, 
  Sparkles,
  Download,
  Upload,
  Wifi,
  Phone,
  Clock,
  Shield,
  HeartHandshake,
  Zap,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedPlanCardProps {
  plan: ManualPlan;
  isCompared?: boolean;
  onCompareToggle?: (plan: ManualPlan) => void;
  canCompare?: boolean;
  showSavings?: boolean;
  estimatedSavings?: number;
  rank?: number;
  className?: string;
}

const EnhancedPlanCard = ({
  plan,
  isCompared = false,
  onCompareToggle,
  canCompare = true,
  showSavings = false,
  estimatedSavings,
  rank,
  className
}: EnhancedPlanCardProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Generate realistic ratings and popularity scores
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 2000) + 100;
  const popularityScore = Math.floor(Math.random() * 40) + 60;
  const savingsAmount = estimatedSavings || Math.floor(Math.random() * 150) + 50;
  
  // Determine if plan is popular (top 30% popularity)
  const isPopular = popularityScore > 80;
  const isHighRated = parseFloat(rating) >= 4.0;
  const isNewPlan = Math.random() > 0.8; // 20% chance of being "new"

  const getCategoryIcon = () => {
    switch (plan.category) {
      case 'electricity': return <Zap className="h-6 w-6" />;
      case 'mobile': return <Phone className="h-6 w-6" />;
      case 'internet': return <Wifi className="h-6 w-6" />;
      case 'tv': return <Building2 className="h-6 w-6" />;
      default: return <Building2 className="h-6 w-6" />;
    }
  };

  const getCategoryColors = () => {
    switch (plan.category) {
      case 'electricity': 
        return {
          gradient: 'from-yellow-400/20 to-yellow-500/20',
          border: 'border-yellow-400/30',
          text: 'text-yellow-700',
          bgGradient: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
          iconBg: 'from-yellow-400/10 to-yellow-500/10 group-hover:from-yellow-400 group-hover:to-yellow-500'
        };
      case 'mobile':
        return {
          gradient: 'from-purple-400/20 to-purple-500/20',
          border: 'border-purple-400/30',
          text: 'text-purple-700',
          bgGradient: 'bg-gradient-to-r from-purple-400 to-purple-500',
          iconBg: 'from-purple-400/10 to-purple-500/10 group-hover:from-purple-400 group-hover:to-purple-500'
        };
      case 'internet':
        return {
          gradient: 'from-cyan-400/20 to-cyan-500/20',
          border: 'border-cyan-400/30',
          text: 'text-cyan-700',
          bgGradient: 'bg-gradient-to-r from-cyan-400 to-cyan-500',
          iconBg: 'from-cyan-400/10 to-cyan-500/10 group-hover:from-cyan-400 group-hover:to-cyan-500'
        };
      case 'tv':
        return {
          gradient: 'from-orange-400/20 to-orange-500/20',
          border: 'border-orange-400/30',
          text: 'text-orange-700',
          bgGradient: 'bg-gradient-to-r from-orange-400 to-orange-500',
          iconBg: 'from-orange-400/10 to-orange-500/10 group-hover:from-orange-400 group-hover:to-orange-500'
        };
      default:
        return {
          gradient: 'from-gray-400/20 to-gray-500/20',
          border: 'border-gray-400/30',
          text: 'text-gray-700',
          bgGradient: 'bg-gradient-to-r from-gray-400 to-gray-500',
          iconBg: 'from-gray-400/10 to-gray-500/10 group-hover:from-gray-400 group-hover:to-gray-500'
        };
    }
  };

  const getCategoryLabel = () => {
    switch (plan.category) {
      case 'electricity': return 'חשמל';
      case 'mobile': return 'סלולר';
      case 'internet': return 'אינטרנט';
      case 'tv': return 'טלוויזיה';
      default: return '';
    }
  };

  const formatPrice = () => {
    if (plan.category === 'electricity') {
      return plan.speed; // For electricity, speed is the discount percentage
    }
    return `₪${plan.regularPrice}`;
  };

  const categoryColors = getCategoryColors();

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-2xl group border-border/50",
      "bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-sm",
      `bg-gradient-to-br ${categoryColors.gradient}`,
      `border-2 ${categoryColors.border}`,
      isCompared && "ring-2 ring-primary/50 shadow-lg",
      rank === 1 && "border-4 border-success/60 shadow-2xl shadow-success/30 bg-gradient-to-br from-success/10 via-success/5 to-success/15 ring-4 ring-success/20 ring-offset-2 scale-105 z-10",
      className
    )}>
      {/* Top Badges */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {rank === 1 && (
          <Badge className="bg-gradient-to-r from-success via-green-500 to-emerald-500 text-white shadow-2xl animate-pulse border-2 border-white/50 text-lg py-2 px-4 font-bold">
            <Award className="h-5 w-5 mr-2" />
            ⭐ המומלץ ביותר! ⭐
          </Badge>
        )}
        {isPopular && rank !== 1 && (
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
            <Flame className="h-3 w-3 mr-1" />
            פופולרי
          </Badge>
        )}
        {isNewPlan && rank !== 1 && (
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
            <Sparkles className="h-3 w-3 mr-1" />
            חדש
          </Badge>
        )}
        {showSavings && (
          <Badge className={`text-white shadow-lg ${rank === 1 ? 'bg-gradient-to-r from-yellow-500 to-amber-500 border-2 border-white/30' : 'bg-gradient-to-r from-green-600 to-emerald-600'}`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {rank === 1 ? '🔥 חסכת' : 'חסכת'} ₪{savingsAmount}
          </Badge>
        )}
      </div>

      {/* Comparison Checkbox */}
      {onCompareToggle && (
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
            <Checkbox
              id={`compare-${plan.id}`}
              checked={isCompared}
              onCheckedChange={() => onCompareToggle(plan)}
              disabled={!canCompare && !isCompared}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label 
              htmlFor={`compare-${plan.id}`} 
              className="text-xs font-medium cursor-pointer select-none"
            >
              השווה
            </label>
          </div>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4 mt-8">
          {/* Company Info */}
          <div className="flex items-center gap-4 flex-1">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg text-white",
              `bg-gradient-to-r ${categoryColors.iconBg}`
            )}>
              {getCategoryIcon()}
            </div>
            
            <div className="flex-1">
              {/* Category and Rating */}
              <div className="flex items-center gap-2 mb-2">
                <Badge className={cn(
                  "text-xs text-white border-0 shadow-sm",
                  categoryColors.bgGradient
                )}>
                  {getCategoryLabel()}
                </Badge>
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn(
                          "h-4 w-4",
                          i < Math.floor(parseFloat(rating)) 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-gray-300"
                        )} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {rating} ({reviewCount.toLocaleString()})
                  </span>
                </div>
              </div>
              
              {/* Company and Plan Names */}
              <h3 className="font-bold text-xl text-foreground mb-1">{plan.company}</h3>
              <p className="text-muted-foreground font-medium">{plan.planName}</p>
            </div>
          </div>

          {/* Price */}
          <div className={cn(
            "text-center p-4 rounded-xl border shadow-sm",
            categoryColors.gradient,
            categoryColors.border
          )}>
            <div className={cn(
              "text-3xl font-black bg-clip-text text-transparent",
              categoryColors.bgGradient
            )}>
              {formatPrice()}
            </div>
            {plan.category !== 'electricity' && (
              <div className="text-sm text-muted-foreground font-medium">לחודש</div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Plan Specifications */}
        <div className="grid grid-cols-2 gap-3">
          {plan.category === 'internet' && plan.downloadSpeed && (
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-xl border border-primary/10">
              <Download className="h-4 w-4 text-primary" />
              <div className="text-sm">
                <div className="font-medium text-foreground">הורדה</div>
                <div className="text-muted-foreground">{plan.downloadSpeed}</div>
              </div>
            </div>
          )}
          
          {plan.category === 'internet' && plan.uploadSpeed && (
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-success/5 to-success/10 rounded-xl border border-success/10">
              <Upload className="h-4 w-4 text-success" />
              <div className="text-sm">
                <div className="font-medium text-foreground">העלאה</div>
                <div className="text-muted-foreground">{plan.uploadSpeed}</div>
              </div>
            </div>
          )}
          
          {plan.dataAmount && (
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-500/5 to-blue-500/10 rounded-xl border border-blue-500/10">
              <Wifi className="h-4 w-4 text-blue-500" />
              <div className="text-sm">
                <div className="font-medium text-foreground">נתונים</div>
                <div className="text-muted-foreground">{plan.dataAmount}</div>
              </div>
            </div>
          )}
          
          {plan.callMinutes && (
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-orange-500/5 to-orange-500/10 rounded-xl border border-orange-500/10">
              <Phone className="h-4 w-4 text-orange-500" />
              <div className="text-sm">
                <div className="font-medium text-foreground">שיחות</div>
                <div className="text-muted-foreground">{plan.callMinutes}</div>
              </div>
            </div>
          )}
        </div>

        {/* Contract and Trust Info */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border border-border/30">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              תקופת התקשרות: {Math.random() > 0.5 ? '24 חודשים' : '12 חודשים'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4 text-green-600" />
            <HeartHandshake className="h-4 w-4 text-blue-600" />
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Check className="h-4 w-4 text-success" />
            מה כלול במסלול:
          </h4>
          <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
            {plan.features.slice(0, 6).map((feature, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-relaxed">{feature}</span>
              </div>
            ))}
            {plan.features.length > 6 && (
              <div className="text-sm text-primary font-medium">
                +{plan.features.length - 6} תכונות נוספות
              </div>
            )}
          </div>
        </div>

        {/* Popularity Indicator */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/30 dark:border-blue-800/30">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              רמת פופולריות: {popularityScore}%
            </span>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            {popularityScore > 90 ? 'נבחר ביותר' : popularityScore > 70 ? 'פופולרי מאוד' : 'פופולרי'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            className={cn(
              "w-full text-white font-bold text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0",
              rank === 1 
                ? "bg-gradient-to-r from-success via-green-500 to-emerald-500 hover:from-green-500 hover:via-emerald-500 hover:to-green-600 shadow-2xl shadow-success/50 animate-pulse border-2 border-white/30"
                : categoryColors.bgGradient,
              rank === 1 ? "" : "hover:opacity-90"
            )}
            onClick={() => setIsFormOpen(true)}
          >
            {rank === 1 ? '🚀 בחר במסלול המומלץ ביותר! 🚀' : 'בחר מסלול זה 🚀'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-sm"
          >
            {showDetails ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                הסתר פרטים מתקדמים
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                פרטים מתקדמים
              </>
            )}
          </Button>
        </div>

        {/* Advanced Details - Collapsible */}
        {showDetails && (
          <div className="space-y-4 pt-4 border-t border-border/30">
            <TrustIndicators plan={plan} />
            <PlanInsights plan={plan} />
          </div>
        )}
      </CardContent>
      
      <EnhancedSwitchRequestForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        selectedPlan={plan}
      />
    </Card>
  );
};

export default EnhancedPlanCard;