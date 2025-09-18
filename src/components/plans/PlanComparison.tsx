import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ManualPlan } from "@/data/manual-plans";
import { RecommendationEngine, RecommendationContext } from "@/lib/recommendationEngine";
import { 
  Scale, 
  X, 
  Zap, 
  Wifi, 
  Smartphone, 
  Tv, 
  Building2,
  TrendingUp,
  Crown,
  CheckCircle,
  BarChart3,
  Plus,
  Star,
  AlertTriangle,
  ThumbsUp,
  Target,
  Calculator,
  Users,
  Home,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanComparisonProps {
  comparedPlans: ManualPlan[];
  onRemovePlan: (planId: string) => void;
  onClearAll: () => void;
  className?: string;
  onPlanSelect?: (plan: ManualPlan) => void;
  userContext?: {
    currentAmount?: number;
    currentProvider?: string;
    familySize?: number;
    budget?: number;
    usage?: 'light' | 'medium' | 'heavy';
    priorities?: string[];
    homeType?: 'apartment' | 'house' | 'office';
  };
}

const PlanComparison = ({ 
  comparedPlans, 
  onRemovePlan, 
  onClearAll, 
  className,
  onPlanSelect,
  userContext 
}: PlanComparisonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(true);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electricity': return <Zap className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'internet': return <Wifi className="h-4 w-4" />;
      case 'tv': return <Tv className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'electricity': return 'חשמל';
      case 'mobile': return 'סלולר';
      case 'internet': return 'אינטרנט';
      case 'tv': return 'טלוויזיה';
      default: return '';
    }
  };

  const getBestPlanIndex = () => {
    if (comparedPlans.length === 0) return -1;
    let bestIndex = 0;
    let bestPrice = comparedPlans[0].regularPrice;
    
    comparedPlans.forEach((plan, index) => {
      if (plan.regularPrice < bestPrice) {
        bestPrice = plan.regularPrice;
        bestIndex = index;
      }
    });
    
    return bestIndex;
  };

  // Generate AI recommendations if user context is available
  const recommendations = userContext && comparedPlans.length > 0 ? 
    RecommendationEngine.generateRecommendations(comparedPlans, {
      category: comparedPlans[0].category as 'electricity' | 'cellular' | 'internet' | 'tv',
      currentProvider: userContext.currentProvider || 'ספק נוכחי',
      currentAmount: userContext.currentAmount || 200,
      familySize: userContext.familySize || 3,
      usage: userContext.usage || 'medium',
      budget: userContext.budget || userContext.currentAmount || 200,
      priorities: userContext.priorities || ['חיסכון', 'אמינות'],
      homeType: userContext.homeType || 'apartment'
    }) : [];

  const getRecommendedPlan = () => {
    if (recommendations.length > 0) {
      return recommendations[0]; // Highest scored plan
    }
    return null;
  };

  if (comparedPlans.length === 0) {
    return null;
  }

  const bestPlanIndex = getBestPlanIndex();

  return (
    <div className={cn("fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50", className)}>
      <Card className="bg-white/95 backdrop-blur-md shadow-2xl border border-primary/20 rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground font-heebo">השוואת מסלולים</p>
                <p className="text-sm text-muted-foreground font-assistant">
                  {comparedPlans.length} מתוך 3 מסלולים
                </p>
              </div>
            </div>

            {/* Plans Preview Cards */}
            <div className="flex items-center gap-2">
              {comparedPlans.map((plan, index) => (
                <div key={plan.id} className="relative group">
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300",
                    index === bestPlanIndex 
                      ? "bg-green-50 border-green-200 ring-2 ring-green-300/50" 
                      : "bg-card hover:bg-accent border-border"
                  )}>
                    {index === bestPlanIndex && <Crown className="h-4 w-4 text-yellow-500" />}
                    {getCategoryIcon(plan.category)}
                    <div className="text-center">
                      <div className="text-xs font-medium font-assistant">{plan.company}</div>
                      <div className="text-xs text-primary font-bold font-heebo">₪{plan.regularPrice}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemovePlan(plan.id)}
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full bg-destructive/10 hover:bg-destructive/20 border border-destructive/20"
                  >
                    <X className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))}
              
              {/* Add More Plans Indicator */}
              {comparedPlans.length < 3 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border border-dashed border-muted-foreground/30 rounded-xl">
                  <Plus className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-assistant">
                    הוסף עוד {3 - comparedPlans.length}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClearAll}
                className="text-destructive border-destructive/30 hover:bg-destructive/10 font-assistant"
              >
                נקה הכל
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 font-heebo font-medium shadow-lg">
                    <BarChart3 className="h-4 w-4 ml-2" />
                    השווה מסלולים
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-primary font-heebo text-center">
                      השוואה מתקדמת וחכמה
                    </DialogTitle>
                    <p className="text-center text-muted-foreground font-assistant mt-2">
                      ניתוח מותאם אישית על בסיס הצרכים שלכם
                    </p>
                  </DialogHeader>

                  {/* AI Recommendations Section */}
                  {recommendations.length > 0 && showRecommendations && (
                    <div className="mt-6 mb-8">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500 rounded-xl">
                              <Lightbulb className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-blue-900 font-heebo">
                              המלצה חכמה מותאמת אישית
                            </h3>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowRecommendations(false)}
                            className="text-blue-600 hover:bg-blue-100"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {getRecommendedPlan() && (
                          <div className="bg-white/80 rounded-xl p-4 border border-blue-300">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Crown className="w-5 h-5 text-yellow-500" />
                                <span className="font-bold text-blue-900 font-heebo">
                                  מסלול מומלץ: {getRecommendedPlan()!.plan.company} - {(getRecommendedPlan()!.plan as any).planName || (getRecommendedPlan()!.plan as any).name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-bold text-blue-900 font-heebo">
                                  {getRecommendedPlan()!.score.toFixed(0)}/100
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-green-700 mb-2 font-heebo flex items-center gap-1">
                                  <ThumbsUp className="w-4 h-4" />
                                  למה זה מתאים לכם:
                                </h4>
                                <ul className="space-y-1">
                                  {getRecommendedPlan()!.matchReasons.slice(0, 3).map((reason, idx) => (
                                    <li key={idx} className="text-sm text-green-600 font-assistant flex items-start gap-1">
                                      <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                      {reason}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              {getRecommendedPlan()!.warnings.length > 0 && (
                                <div>
                                  <h4 className="font-semibold text-amber-700 mb-2 font-heebo flex items-center gap-1">
                                    <AlertTriangle className="w-4 h-4" />
                                    נקודות לתשומת לב:
                                  </h4>
                                  <ul className="space-y-1">
                                    {getRecommendedPlan()!.warnings.slice(0, 2).map((warning, idx) => (
                                      <li key={idx} className="text-sm text-amber-600 font-assistant flex items-start gap-1">
                                        <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                        {warning}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {userContext?.currentAmount && (
                              <div className="mt-4 bg-green-50 rounded-lg p-3 border border-green-200">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-green-700 font-assistant">חיסכון חודשי צפוי:</span>
                                  <span className="font-bold text-green-700 font-heebo">
                                    ₪{getRecommendedPlan()!.savings.monthlySavings.toLocaleString()} 
                                    ({getRecommendedPlan()!.savings.percentageSaving.toFixed(1)}%)
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Comparison Table */}
                  <div className="mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {comparedPlans.map((plan, index) => {
                        const recommendation = recommendations.find(r => (r.plan as any).id === (plan as any).id);
                        const isCheapest = index === getBestPlanIndex();
                        const isRecommended = getRecommendedPlan() && (getRecommendedPlan()!.plan as any).id === (plan as any).id;
                        
                        return (
                          <Card key={plan.id} className={cn(
                            "relative transition-all duration-500 hover:shadow-xl border-2",
                            isRecommended && "ring-4 ring-blue-400/40 bg-blue-50/30 border-blue-300",
                            isCheapest && !isRecommended && "ring-4 ring-green-400/30 bg-green-50/30 border-green-300",
                            !isCheapest && !isRecommended && "border-border hover:border-primary/30"
                          )}>
                            {isRecommended && (
                              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                <Badge className="bg-blue-500 text-white px-4 py-2 shadow-lg">
                                  <Crown className="h-4 w-4 ml-2" />
                                  מומלץ עבורכם
                                </Badge>
                              </div>
                            )}
                            {isCheapest && !isRecommended && (
                              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                <Badge className="bg-green-500 text-white px-4 py-2 shadow-lg">
                                  <TrendingUp className="h-4 w-4 ml-2" />
                                  הכי חסכוני
                                </Badge>
                              </div>
                            )}
                            
                            <CardHeader className="text-center pb-4">
                              <div className="flex items-center justify-center gap-2 mb-3">
                                {getCategoryIcon(plan.category)}
                                <Badge variant="outline" className="text-xs font-assistant">
                                  {getCategoryLabel(plan.category)}
                                </Badge>
                                {recommendation && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-bold text-yellow-600 font-heebo">
                                      {recommendation.score.toFixed(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <h3 className="text-2xl font-bold text-foreground font-heebo">
                                {plan.company}
                              </h3>
                              <p className="text-muted-foreground font-assistant text-sm">{plan.planName}</p>
                            </CardHeader>

                            <CardContent className="space-y-6">
                              {/* Price & Savings */}
                              <div className={cn(
                                "text-center rounded-2xl p-6 border",
                                isRecommended && "bg-blue-50 border-blue-200",
                                isCheapest && !isRecommended && "bg-green-50 border-green-200",
                                !isCheapest && !isRecommended && "bg-primary/5 border-primary/10"
                              )}>
                                <div className={cn(
                                  "text-4xl font-bold font-heebo mb-2",
                                  isRecommended && "text-blue-600",
                                  isCheapest && !isRecommended && "text-green-600",
                                  !isCheapest && !isRecommended && "text-primary"
                                )}>
                                  ₪{plan.regularPrice}
                                </div>
                                <div className="text-sm text-muted-foreground font-assistant">לחודש</div>
                                
                                {recommendation && userContext?.currentAmount && (
                                  <div className="mt-3 space-y-2">
                                    <div className="text-sm text-green-600 font-medium font-assistant flex items-center justify-center gap-1">
                                      <Calculator className="h-4 w-4" />
                                      חיסכון: ₪{recommendation.savings.monthlySavings.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-assistant">
                                      ({recommendation.savings.percentageSaving.toFixed(1)}% חיסכון)
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* AI Analysis */}
                              {recommendation && (
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-foreground font-heebo text-sm">ניתוח חכם:</h4>
                                  
                                  {recommendation.matchReasons.length > 0 && (
                                    <div className="bg-green-50/50 rounded-lg p-3 border border-green-100">
                                      <div className="text-xs font-medium text-green-700 mb-1 font-heebo">ישבויות:</div>
                                      {recommendation.matchReasons.slice(0, 2).map((reason, idx) => (
                                        <div key={idx} className="text-xs text-green-600 font-assistant flex items-start gap-1 mb-1">
                                          <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                          {reason}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {recommendation.warnings.length > 0 && (
                                    <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-100">
                                      <div className="text-xs font-medium text-amber-700 mb-1 font-heebo">שימו לב:</div>
                                      {recommendation.warnings.slice(0, 2).map((warning, idx) => (
                                        <div key={idx} className="text-xs text-amber-600 font-assistant flex items-start gap-1 mb-1">
                                          <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                          {warning}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Key Features */}
                              <div className="space-y-3">
                                <h4 className="font-semibold text-foreground font-heebo text-sm">תכונות עיקריות:</h4>
                                <div className="space-y-2">
                                  {plan.features.slice(0, 3).map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm">
                                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                      <span className="text-muted-foreground font-assistant text-xs leading-relaxed">{feature}</span>
                                    </div>
                                  ))}
                                  {plan.features.length > 3 && (
                                    <div className="text-xs text-muted-foreground text-center py-2 bg-muted/50 rounded-lg font-assistant">
                                      +{plan.features.length - 3} תכונות נוספות
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Action Button */}
                              <Button
                                onClick={() => {
                                  onPlanSelect?.(plan);
                                  setIsDialogOpen(false);
                                }}
                                className={cn(
                                  "w-full font-heebo h-12 text-lg font-semibold shadow-lg transition-all duration-300",
                                  isRecommended && "bg-blue-600 hover:bg-blue-700 hover:scale-105",
                                  isCheapest && !isRecommended && "bg-green-600 hover:bg-green-700 hover:scale-105",
                                  !isCheapest && !isRecommended && "bg-primary hover:bg-primary/90 hover:scale-105"
                                )}
                              >
                                {isRecommended ? "בחר מסלול מומלץ" : 
                                 isCheapest ? "בחר המחיר הטוב ביותר" : "בחר מסלול זה"}
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {/* Advanced Summary */}
                    <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary/10">
                      <h4 className="text-xl font-bold text-foreground mb-6 font-heebo text-center">
                        סיכום מתקדם
                      </h4>
                      <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center bg-green-50 rounded-xl p-4 border border-green-200">
                          <div className="text-sm text-green-700 font-assistant mb-1">המחיר הטוב ביותר</div>
                          <div className="text-2xl font-bold text-green-600 font-heebo">
                            ₪{Math.min(...comparedPlans.map(p => p.regularPrice))}
                          </div>
                          <div className="text-xs text-green-600 font-assistant">לחודש</div>
                        </div>
                        <div className="text-center bg-red-50 rounded-xl p-4 border border-red-200">
                          <div className="text-sm text-red-700 font-assistant mb-1">המחיר הגבוה ביותר</div>
                          <div className="text-2xl font-bold text-red-600 font-heebo">
                            ₪{Math.max(...comparedPlans.map(p => p.regularPrice))}
                          </div>
                          <div className="text-xs text-red-600 font-assistant">לחודש</div>
                        </div>
                        <div className="text-center bg-primary/5 rounded-xl p-4 border border-primary/20">
                          <div className="text-sm text-primary font-assistant mb-1">חיסכון פוטנציאלי</div>
                          <div className="text-2xl font-bold text-primary font-heebo">
                            ₪{Math.max(...comparedPlans.map(p => p.regularPrice)) - Math.min(...comparedPlans.map(p => p.regularPrice))}
                          </div>
                          <div className="text-xs text-primary font-assistant">לחודש</div>
                        </div>
                        {userContext?.currentAmount && (
                          <div className="text-center bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <div className="text-sm text-blue-700 font-assistant mb-1">חיסכון מהמצב הנוכחי</div>
                            <div className="text-2xl font-bold text-blue-600 font-heebo">
                              ₪{Math.max(0, userContext.currentAmount - Math.min(...comparedPlans.map(p => p.regularPrice)))}
                            </div>
                            <div className="text-xs text-blue-600 font-assistant">לחודש</div>
                          </div>
                        )}
                      </div>
                      
                      {userContext && (
                        <div className="mt-6 bg-muted/20 rounded-xl p-4">
                          <h5 className="font-semibold text-center mb-3 font-heebo">פרטי ההשוואה שלכם:</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                              <Users className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                              <div className="font-assistant text-muted-foreground">בני משפחה: {userContext.familySize || 3}</div>
                            </div>
                            <div className="text-center">
                              <Target className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                              <div className="font-assistant text-muted-foreground">תקציב: ₪{userContext.budget || 200}</div>
                            </div>
                            <div className="text-center">
                              <BarChart3 className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                              <div className="font-assistant text-muted-foreground">שימוש: {userContext.usage || 'בינוני'}</div>
                            </div>
                            <div className="text-center">
                              <Home className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                              <div className="font-assistant text-muted-foreground">סוג דירה: {userContext.homeType || 'דירה'}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanComparison;