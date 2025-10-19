import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { PlanRecord } from "@/hooks/useAllPlans";
import { 
  CheckCircle2, ArrowRight, TrendingDown, Target, Shield,
  Award, Sparkles, Calendar, Users, Clock, Info, Star, X
} from "lucide-react";
import { useAllPlans } from "@/hooks/useAllPlans";
import { cn } from "@/lib/utils";

interface PlanRecordDetailsSheetProps {
  plan: PlanRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForSwitch: (plan: PlanRecord) => void;
}

export function PlanRecordDetailsSheet({ plan, isOpen, onClose, onSelectForSwitch }: PlanRecordDetailsSheetProps) {
  const allPlans = useAllPlans();
  
  if (!plan) return null;

  // Calculate market comparison data
  const sameCategoryPlans = allPlans.filter(p => p.service === plan.service);
  const avgPrice = sameCategoryPlans.length > 0 
    ? sameCategoryPlans.reduce((sum, p) => sum + (p.monthlyPrice || 0), 0) / sameCategoryPlans.filter(p => p.monthlyPrice).length
    : plan.monthlyPrice || 0;
  
  const currentPrice = plan.monthlyPrice || 0;
  const savingsVsAvg = avgPrice - currentPrice;
  const savingsPercent = avgPrice > 0 ? Math.round((savingsVsAvg / avgPrice) * 100) : 0;
  
  // Plan score calculation
  const priceScore = Math.max(0, Math.min(100, 100 - ((currentPrice / avgPrice) * 100 - 100)));
  const overallScore = Math.round(priceScore);
  
  // Determine who this plan is for
  const getTargetAudience = () => {
    if (currentPrice < avgPrice * 0.8) return "משפחות המחפשות לחסוך";
    if (plan.transferBenefits) return "לקוחות חדשים";
    return "קהל רחב";
  };
  
  // Calculate value metrics
  const valueMetrics = {
    priceCompetitiveness: priceScore,
    valueForMoney: overallScore,
    marketPosition: currentPrice < avgPrice ? 'חסכוני' : currentPrice > avgPrice * 1.2 ? 'פרימיום' : 'סטנדרטי'
  };
  
  // Get user's reason for this plan
  const getMatchReason = () => {
    const reasons = [];
    
    if (savingsVsAvg > 100) {
      reasons.push({
        title: "חיסכון משמעותי",
        description: `המסלול זול ב-₪${Math.round(savingsVsAvg)} לחודש מהממוצע בקטגוריה זו`,
        score: Math.min(100, (savingsVsAvg / avgPrice) * 200)
      });
    }
    
    if (plan.transferBenefits) {
      reasons.push({
        title: "הטבת מעבר",
        description: plan.transferBenefits,
        score: 85
      });
    }
    
    if (currentPrice <= avgPrice) {
      reasons.push({
        title: "מחיר תחרותי",
        description: "אחד המסלולים הזולים בקטגוריה זו",
        score: priceScore
      });
    }
    
    return reasons.slice(0, 3);
  };
  
  const matchReasons = getMatchReason();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-2">
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-6 pb-20">
          <div className="absolute inset-0 bg-grid-white/10" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute left-4 top-4 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="relative space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
                {plan.service}
              </Badge>
              {plan.transferBenefits && (
                <Badge className="bg-amber-500 text-white border-0">
                  🎁 הטבה
                </Badge>
              )}
            </div>
            <h2 className="text-2xl font-bold">{plan.plan}</h2>
            <p className="text-primary-foreground/90 text-lg">{plan.company}</p>
          </div>
        </div>

        {/* Price Card - Overlapping */}
        <div className="relative -mt-16 px-6">
          <Card className="border-2 shadow-xl bg-card">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">מחיר</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">₪{currentPrice}</div>
                  <div className="text-xs text-muted-foreground">לחודש</div>
                </div>
                
                {savingsVsAvg > 0 && (
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingDown className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-muted-foreground">חיסכון</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">₪{Math.round(savingsVsAvg)}</div>
                    <div className="text-xs text-muted-foreground">בחודש</div>
                  </div>
                )}
                
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span className="text-xs text-muted-foreground">ציון</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{overallScore}</div>
                  <div className="text-xs text-muted-foreground">מתוך 100</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          {/* Why This Plan */}
          {matchReasons.length > 0 && (
            <div className="bg-gradient-to-br from-primary/5 via-primary/3 to-transparent rounded-xl p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-bold">למה המסלול הזה?</h3>
              </div>
              <div className="space-y-2">
                {matchReasons.map((reason, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">{reason.title}</div>
                      <div className="text-xs text-muted-foreground">{reason.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Analysis */}
          {savingsVsAvg > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-green-600" />
                  </div>
                  <h3 className="font-bold text-green-800 dark:text-green-200">חיסכון שנתי</h3>
                </div>
                <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-300 border-0">
                  -{savingsPercent}%
                </Badge>
              </div>
              <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-1">
                ₪{Math.round(savingsVsAvg * 12)}
              </div>
              <div className="text-sm text-green-700/70 dark:text-green-300/70">
                לעומת ממוצע השוק (₪{Math.round(avgPrice)})
              </div>
            </div>
          )}

          {/* Transfer Benefits */}
          {plan.transferBenefits && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🎁</span>
                <h3 className="font-bold text-amber-800 dark:text-amber-200">הטבת מעבר</h3>
              </div>
              <p className="text-sm text-amber-900/80 dark:text-amber-100/80 leading-relaxed">
                {plan.transferBenefits}
              </p>
            </div>
          )}

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 border">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">התחייבות</span>
              </div>
              <p className="font-bold text-sm">12 חודשים</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 border">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">זמן מעבר</span>
              </div>
              <p className="font-bold text-sm">3-5 ימים</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 border">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">מתאים ל</span>
              </div>
              <p className="font-bold text-sm">{getTargetAudience()}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 border">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">מיקום</span>
              </div>
              <p className="font-bold text-sm">{valueMetrics.marketPosition}</p>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">מוגן ע״י רשות התחרות</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-3.5 w-3.5",
                    i < 4 ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"
                  )} 
                />
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => {
              onSelectForSwitch(plan);
              onClose();
            }}
            size="lg"
            className="w-full bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/95 hover:to-primary shadow-lg text-base font-bold h-12"
          >
            <ArrowRight className="ml-2 h-5 w-5" />
            עברו למסלול - 
            {savingsVsAvg > 0 && ` חסכו ₪${Math.round(savingsVsAvg * 12)} בשנה`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
