import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ManualPlan } from "@/data/manual-plans";
import { 
  CheckCircle, Package, ArrowRight, Download, Upload, Database, Phone, 
  MessageSquare, Zap, X, TrendingDown, BarChart3, Target, CheckCircle2, Shield
} from "lucide-react";
import { useAllPlans } from "@/hooks/useAllPlans";

interface PlanDetailsSheetProps {
  plan: ManualPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForSwitch: (plan: ManualPlan) => void;
}

export function PlanDetailsSheet({ plan, isOpen, onClose, onSelectForSwitch }: PlanDetailsSheetProps) {
  const allPlans = useAllPlans();
  
  if (!plan) return null;

  const hasIntroOffer = plan.introPrice && plan.introPrice < plan.regularPrice;
  const hasTechSpecs = plan.downloadSpeed || plan.uploadSpeed || plan.dataAmount || plan.speed || plan.callMinutes || plan.smsAmount;
  
  // Calculate market comparison data
  const sameCategoryPlans = allPlans.filter(p => p.service === plan.category);
  const avgPrice = sameCategoryPlans.length > 0 
    ? sameCategoryPlans.reduce((sum, p) => sum + (p.monthlyPrice || 0), 0) / sameCategoryPlans.filter(p => p.monthlyPrice).length
    : plan.regularPrice;
  
  const currentPrice = hasIntroOffer ? plan.introPrice! : plan.regularPrice;
  const savingsVsAvg = avgPrice - currentPrice;
  const savingsPercent = avgPrice > 0 ? Math.round((savingsVsAvg / avgPrice) * 100) : 0;
  
  // Plan score calculation
  const priceScore = Math.max(0, Math.min(100, 100 - ((currentPrice / avgPrice) * 100 - 100)));
  const featuresScore = Math.min(100, (plan.features.length / 10) * 100);
  const overallScore = Math.round((priceScore * 0.6 + featuresScore * 0.4));
  
  // Determine who this plan is for
  const getTargetAudience = () => {
    if (currentPrice < avgPrice * 0.8) return "משפחות המחפשות לחסוך";
    if (plan.features.length > 8) return "משתמשים מתקדמים";
    if (hasIntroOffer) return "לקוחות חדשים";
    return "קהל רחב";
  };
  
  // Calculate value metrics
  const valueMetrics = {
    priceCompetitiveness: priceScore,
    featureRichness: featuresScore,
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
    
    if (plan.features.length >= 8) {
      reasons.push({
        title: "עשיר בתכונות",
        description: `כולל ${plan.features.length} תכונות - יותר מרוב המסלולים`,
        score: Math.min(100, (plan.features.length / 12) * 100)
      });
    }
    
    if (hasIntroOffer) {
      const firstYearSavings = (plan.regularPrice - plan.introPrice!) * 12;
      reasons.push({
        title: "מבצע שכדאי לנצל",
        description: `חיסכון של ₪${firstYearSavings} בשנה הראשונה`,
        score: Math.min(100, ((plan.regularPrice - plan.introPrice!) / plan.regularPrice) * 150)
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
        side="right" 
        className="w-full sm:max-w-6xl overflow-y-auto p-0 bg-background"
      >
        {/* Modern Header */}
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="font-assistant">{plan.category}</Badge>
                  {hasIntroOffer && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 font-assistant">מבצע</Badge>
                  )}
                </div>
                <h2 className="text-3xl font-bold font-heebo mb-2">{plan.planName}</h2>
                <p className="text-muted-foreground font-assistant">{plan.company}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-lg"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Key Metrics Row */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold font-heebo text-primary">{overallScore}</span>
                </div>
                <span className="text-muted-foreground font-assistant">ציון כללי</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-primary" />
                <span className="font-assistant">
                  {savingsVsAvg > 0 ? `₪${Math.round(savingsVsAvg)} מתחת לממוצע` : 'מחיר סטנדרטי'}
                </span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                <span className="font-assistant">{plan.features.length} תכונות</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Why This Plan - Data Driven */}
              {matchReasons.length > 0 && (
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Target className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="font-heebo">למה המסלול הזה מתאים לך</CardTitle>
                        <CardDescription className="font-assistant">על סמך ניתוח השוק והצרכים שלך</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {matchReasons.map((reason, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-sm font-assistant">{reason.title}</span>
                          </div>
                          <span className="text-xs font-heebo text-muted-foreground">
                            התאמה: {Math.round(reason.score)}%
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground font-assistant pr-6">
                          {reason.description}
                        </p>
                        <Progress value={reason.score} className="h-1.5" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
              
              {/* Pricing Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heebo">ניתוח תמחור</CardTitle>
                  <CardDescription className="font-assistant">השוואה לממוצע השוק</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price Display */}
                  <div className="flex items-end gap-6">
                    <div>
                      <div className="text-sm text-muted-foreground font-assistant mb-1">
                        {hasIntroOffer ? 'מחיר בשנה הראשונה' : 'מחיר חודשי'}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold font-heebo">₪{currentPrice}</span>
                        <span className="text-muted-foreground font-assistant">/חודש</span>
                      </div>
                    </div>
                    
                    {hasIntroOffer && (
                      <>
                        <ArrowRight className="w-6 h-6 text-muted-foreground mb-4" />
                        <div>
                          <div className="text-sm text-muted-foreground font-assistant mb-1">מחיר רגיל</div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold font-heebo">₪{plan.regularPrice}</span>
                            <span className="text-muted-foreground font-assistant">/חודש</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <Separator />
                  
                  {/* Market Comparison */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-assistant text-muted-foreground">ממוצע בקטגוריה</span>
                      <span className="font-heebo font-semibold">₪{Math.round(avgPrice)}</span>
                    </div>
                    
                    <div className="relative">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${Math.min((currentPrice / avgPrice) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground font-assistant">
                        <span>₪0</span>
                        <span>₪{Math.round(avgPrice)}</span>
                      </div>
                    </div>
                    
                    {savingsVsAvg !== 0 && (
                      <div className={`text-center p-3 rounded-lg ${
                        savingsVsAvg > 0 
                          ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900' 
                          : 'bg-muted'
                      }`}>
                        <span className={`text-sm font-semibold font-assistant ${
                          savingsVsAvg > 0 ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'
                        }`}>
                          {savingsVsAvg > 0 
                            ? `חיסכון של ₪${Math.round(savingsVsAvg)} לחודש (${savingsPercent}% מהממוצע)`
                            : `יקר ב-₪${Math.abs(Math.round(savingsVsAvg))} מהממוצע`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Cost Projection */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground font-assistant mb-1">שנה</div>
                      <div className="font-bold font-heebo">₪{currentPrice * 12}</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground font-assistant mb-1">שנתיים</div>
                      <div className="font-bold font-heebo">₪{hasIntroOffer ? (plan.introPrice! * 12 + plan.regularPrice * 12) : (currentPrice * 24)}</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground font-assistant mb-1">3 שנים</div>
                      <div className="font-bold font-heebo">₪{hasIntroOffer ? (plan.introPrice! * 12 + plan.regularPrice * 24) : (currentPrice * 36)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heebo">מה כלול במסלול</CardTitle>
                  <CardDescription className="font-assistant">{plan.features.length} תכונות</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm font-assistant">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Technical Specs */}
              {hasTechSpecs && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-heebo">מפרט טכני</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {plan.downloadSpeed && (
                        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                          <Download className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-xs text-muted-foreground font-assistant">מהירות הורדה</div>
                            <div className="font-bold font-heebo">{plan.downloadSpeed}</div>
                          </div>
                        </div>
                      )}
                      
                      {plan.uploadSpeed && (
                        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                          <Upload className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-xs text-muted-foreground font-assistant">מהירות העלאה</div>
                            <div className="font-bold font-heebo">{plan.uploadSpeed}</div>
                          </div>
                        </div>
                      )}
                      
                      {plan.dataAmount && (
                        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                          <Database className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-xs text-muted-foreground font-assistant">נפח גלישה</div>
                            <div className="font-bold font-heebo">{plan.dataAmount}</div>
                          </div>
                        </div>
                      )}
                      
                      {plan.callMinutes && (
                        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                          <Phone className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-xs text-muted-foreground font-assistant">דקות שיחה</div>
                            <div className="font-bold font-heebo">{plan.callMinutes}</div>
                          </div>
                        </div>
                      )}
                      
                      {plan.smsAmount && (
                        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                          <MessageSquare className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-xs text-muted-foreground font-assistant">הודעות SMS</div>
                            <div className="font-bold font-heebo">{plan.smsAmount}</div>
                          </div>
                        </div>
                      )}
                      
                      {plan.speed && plan.category === 'electricity' && (
                        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                          <Zap className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-xs text-muted-foreground font-assistant">הנחה</div>
                            <div className="font-bold font-heebo">{plan.speed}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="space-y-4">
              {/* CTA Card */}
              <Card className="sticky top-24 border-2 border-primary">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold font-heebo">₪{currentPrice}</div>
                    <div className="text-sm text-muted-foreground font-assistant">
                      {hasIntroOffer ? 'לחודש בשנה הראשונה' : 'לחודש'}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => onSelectForSwitch(plan)}
                    className="w-full h-12 font-heebo text-lg"
                    size="lg"
                  >
                    עבור למסלול
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </Button>
                  
                  <div className="space-y-2 text-xs text-muted-foreground font-assistant">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>תהליך מהיר של 2-7 ימים</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>ללא עלויות החלפה</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>שמירה על המספר הקיים</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Key Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-heebo">מדדי איכות</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-assistant">תחרותיות מחיר</span>
                      <span className="font-heebo font-semibold">{Math.round(priceScore)}%</span>
                    </div>
                    <Progress value={priceScore} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-assistant">עושר תכונות</span>
                      <span className="font-heebo font-semibold">{Math.round(featuresScore)}%</span>
                    </div>
                    <Progress value={featuresScore} className="h-2" />
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold font-heebo text-primary mb-1">{overallScore}</div>
                    <div className="text-xs text-muted-foreground font-assistant">ציון כללי מתוך 100</div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Market Position */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-heebo">מיקום בשוק</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-assistant text-muted-foreground">קטגוריה</span>
                    <Badge variant="outline" className="font-assistant">{valueMetrics.marketPosition}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-assistant text-muted-foreground">ממוצע שוק</span>
                    <span className="font-heebo font-semibold">₪{Math.round(avgPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-assistant text-muted-foreground">מתאים ל</span>
                    <span className="font-heebo text-xs">{getTargetAudience()}</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Trust Indicators */}
              <Card className="bg-muted/30">
                <CardContent className="p-4 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="font-assistant">מוסדר ע"י משרד התקשורת</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="font-assistant">אפשרות ביטול בכל עת</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span className="font-assistant">נתונים מעודכנים לחודש זה</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
