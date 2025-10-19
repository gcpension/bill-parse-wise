import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlanRecord } from "@/hooks/useAllPlans";
import { 
  CheckCircle2, ArrowRight, TrendingDown, Zap, Calendar, 
  DollarSign, Award, X, FileText
} from "lucide-react";
import { useAllPlans } from "@/hooks/useAllPlans";

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
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-5">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute left-3 top-3 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="space-y-2 pr-8">
            <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
              {plan.service}
            </Badge>
            <h2 className="text-xl font-bold leading-tight">{plan.plan}</h2>
            <p className="text-primary-foreground/90 text-sm">{plan.company}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Pricing Section */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">מחיר חודשי</span>
                </div>
                <div className="text-3xl font-bold text-primary">₪{currentPrice}</div>
              </div>
              {plan.yearlyPrice && (
                <div className="text-left">
                  <div className="text-xs text-muted-foreground mb-1">מחיר שנתי</div>
                  <div className="text-lg font-bold">₪{plan.yearlyPrice}</div>
                </div>
              )}
            </div>
            
            {savingsVsAvg > 0 && (
              <div className="flex items-center gap-2 pt-3 border-t border-primary/10">
                <TrendingDown className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-700 dark:text-green-400">
                    חיסכון של ₪{Math.round(savingsVsAvg)} לחודש
                  </div>
                  <div className="text-xs text-muted-foreground">
                    לעומת ממוצע השוק (₪{Math.round(avgPrice)})
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-300">
                  -{savingsPercent}%
                </Badge>
              </div>
            )}
          </div>

          {/* Technical Details */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              פרטים טכניים
            </h3>
            
            <div className="grid gap-2">
              {plan.commitment && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">זמן התחייבות</span>
                  </div>
                  <span className="font-bold text-sm">{plan.commitment}</span>
                </div>
              )}
              
              {plan.sla && (
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">ציון שירות (SLA)</span>
                  </div>
                  <span className="font-bold text-sm">{plan.sla}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">מיקום בשוק</span>
                </div>
                <Badge variant="outline" className="font-bold">
                  {valueMetrics.marketPosition}
                </Badge>
              </div>
            </div>
          </div>

          {/* Transfer Benefits */}
          {plan.transferBenefits && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">🎁</span>
                <div>
                  <h3 className="font-bold text-sm text-amber-800 dark:text-amber-200 mb-1">הטבת מעבר</h3>
                  <p className="text-sm text-amber-900/80 dark:text-amber-100/80 leading-relaxed">
                    {plan.transferBenefits}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Annual Savings Highlight */}
          {savingsVsAvg > 0 && (
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">חיסכון שנתי משוער</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ₪{Math.round(savingsVsAvg * 12)}
                  </div>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
            </div>
          )}

          {/* CTA Button */}
          <Button
            onClick={() => {
              onSelectForSwitch(plan);
              onClose();
            }}
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg font-bold"
          >
            עברו למסלול
            <ArrowRight className="mr-2 h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
