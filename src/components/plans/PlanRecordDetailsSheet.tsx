import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlanRecord } from "@/hooks/useAllPlans";
import { 
  CheckCircle, Package, ArrowRight, Phone, 
  MessageSquare, Zap, X, TrendingDown, Target, CheckCircle2, Shield,
  Award, Sparkles, Calendar, Users, Clock, Info
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
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="left" 
        className="w-full sm:max-w-4xl overflow-y-auto p-0 bg-background"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm border-b">
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="font-normal">{plan.service}</Badge>
                  {plan.transferBenefits && (
                    <Badge className="bg-amber-500/10 text-amber-700 border-amber-200">
                      🎁 הטבת מעבר
                    </Badge>
                  )}
                </div>
                <h2 className="text-3xl font-bold mb-1">{plan.plan}</h2>
                <p className="text-lg text-muted-foreground">{plan.company}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Key Metrics */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-foreground">₪{currentPrice}</div>
                  <div className="text-xs text-muted-foreground">לחודש</div>
                </div>
              </div>
              
              {savingsVsAvg > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <TrendingDown className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-green-600">₪{Math.round(savingsVsAvg)}</div>
                    <div className="text-xs text-muted-foreground">חיסכון חודשי</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Award className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-foreground">{overallScore}/100</div>
                  <div className="text-xs text-muted-foreground">ציון כולל</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Why This Plan */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                למה המסלול הזה מתאים לכם?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {matchReasons.map((reason, index) => (
                  <div key={index} className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">{reason.title}</div>
                      <div className="text-sm text-muted-foreground">{reason.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingDown className="h-5 w-5" />
                ניתוח מחיר
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">מחיר חודשי</span>
                  <span className="text-2xl font-bold">₪{currentPrice}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">ממוצע שוק</span>
                  <span className="font-medium">₪{Math.round(avgPrice)}</span>
                </div>
                {savingsVsAvg > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-600">חיסכון לעומת ממוצע</span>
                      <span className="font-bold text-green-600">₪{Math.round(savingsVsAvg)}</span>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">חיסכון שנתי משוער</span>
                      </div>
                      <div className="text-2xl font-bold text-green-700">
                        ₪{Math.round(savingsVsAvg * 12)}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transfer Benefits */}
          {plan.transferBenefits && (
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50/50 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  🎁 הטבת מעבר
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{plan.transferBenefits}</p>
              </CardContent>
            </Card>
          )}

          {/* Key Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="h-5 w-5" />
                פרטים נוספים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>תקופת התחייבות</span>
                  </div>
                  <p className="font-medium">12 חודשים</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>זמן מעבר</span>
                  </div>
                  <p className="font-medium">3-5 ימי עסקים</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>מתאים ל</span>
                  </div>
                  <p className="font-medium">{getTargetAudience()}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>מיקום בשוק</span>
                  </div>
                  <p className="font-medium">{valueMetrics.marketPosition}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Card */}
          <Card className="border-primary bg-gradient-to-br from-primary/5 to-primary/10 sticky bottom-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg mb-1">מוכנים לעבור למסלול הזה?</h3>
                  <p className="text-sm text-muted-foreground">
                    {savingsVsAvg > 0 && `תחסכו ₪${Math.round(savingsVsAvg * 12)} בשנה`}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    onSelectForSwitch(plan);
                    onClose();
                  }}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                >
                  <ArrowRight className="ml-2 h-5 w-5" />
                  עברו עכשיו
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
