import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ManualPlan } from "@/data/manual-plans";
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
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanComparisonProps {
  comparedPlans: ManualPlan[];
  onRemovePlan: (planId: string) => void;
  onClearAll: () => void;
  className?: string;
  onPlanSelect?: (plan: ManualPlan) => void;
}

const PlanComparison = ({ 
  comparedPlans, 
  onRemovePlan, 
  onClearAll, 
  className,
  onPlanSelect 
}: PlanComparisonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-primary font-heebo text-center">
                      השוואת המסלולים שלכם
                    </DialogTitle>
                    <p className="text-center text-muted-foreground font-assistant mt-2">
                      כל המידע שאתם צריכים כדי לבחור את המסלול הטוב ביותר
                    </p>
                  </DialogHeader>
                  
                  {/* Comparison Cards */}
                  <div className="mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {comparedPlans.map((plan, index) => (
                        <Card key={plan.id} className={cn(
                          "relative transition-all duration-500 hover:shadow-xl border-2",
                          index === bestPlanIndex 
                            ? "ring-4 ring-green-400/30 bg-green-50/50 border-green-300" 
                            : "border-border hover:border-primary/30"
                        )}>
                          {index === bestPlanIndex && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                              <Badge className="bg-green-500 text-white px-4 py-2 shadow-lg">
                                <Crown className="h-4 w-4 ml-2" />
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
                            </div>
                            <h3 className="text-2xl font-bold text-foreground font-heebo">
                              {plan.company}
                            </h3>
                            <p className="text-muted-foreground font-assistant text-sm">{plan.planName}</p>
                          </CardHeader>

                          <CardContent className="space-y-6">
                            {/* Price - Main Focus */}
                            <div className="text-center bg-primary/5 rounded-2xl p-6 border border-primary/10">
                              <div className="text-4xl font-bold text-primary font-heebo mb-2">
                                ₪{plan.regularPrice}
                              </div>
                              <div className="text-sm text-muted-foreground font-assistant">לחודש</div>
                              {index === bestPlanIndex && (
                                <div className="mt-3 text-sm text-green-600 font-medium font-assistant flex items-center justify-center gap-1">
                                  <TrendingUp className="h-4 w-4" />
                                  המחיר הטוב ביותר!
                                </div>
                              )}
                            </div>

                            {/* Key Features - Simplified */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-foreground font-heebo">תכונות עיקריות:</h4>
                              <div className="space-y-2">
                                {plan.features.slice(0, 3).map((feature, idx) => (
                                  <div key={idx} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground font-assistant">{feature}</span>
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
                                index === bestPlanIndex 
                                  ? "bg-green-600 hover:bg-green-700 hover:scale-105" 
                                  : "bg-primary hover:bg-primary/90 hover:scale-105"
                              )}
                            >
                              {index === bestPlanIndex ? "בחר מסלול מומלץ" : "בחר מסלול זה"}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Quick Summary */}
                    <div className="mt-8 bg-muted/30 rounded-2xl p-6 border border-border">
                      <h4 className="text-xl font-bold text-foreground mb-6 font-heebo text-center">
                        סיכום השוואה
                      </h4>
                      <div className="grid md:grid-cols-3 gap-6">
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
                      </div>
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