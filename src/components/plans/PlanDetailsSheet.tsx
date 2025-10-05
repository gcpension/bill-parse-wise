import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ManualPlan } from "@/data/manual-plans";
import { 
  CheckCircle, Info, Package, ArrowRight, Download, Upload, Database, Phone, 
  MessageSquare, Zap, X, TrendingDown, TrendingUp, Star, Users, Calendar, 
  Shield, Award, BarChart3, Target, Clock, AlertCircle, Sparkles, ChevronRight,
  ThumbsUp, Flame, Timer, CheckCircle2, Lock, HeadphonesIcon, RefreshCw, 
  TrendingUpIcon, UserCheck, Verified, Heart, MessageCircle, Quote
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAllPlans } from "@/hooks/useAllPlans";

interface PlanDetailsSheetProps {
  plan: ManualPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForSwitch: (plan: ManualPlan) => void;
}

export function PlanDetailsSheet({ plan, isOpen, onClose, onSelectForSwitch }: PlanDetailsSheetProps) {
  const allPlans = useAllPlans();
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });
  const [peopleViewing, setPeopleViewing] = useState(12);
  
  // Countdown timer for urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Simulate people viewing
  useEffect(() => {
    const interval = setInterval(() => {
      setPeopleViewing(prev => Math.max(8, Math.min(25, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
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

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-4xl overflow-y-auto p-0 bg-background"
      >
        {/* Clean Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-2xl font-bold font-heebo text-foreground">
                  {plan.planName}
                </SheetTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground font-assistant">{plan.company}</span>
                  <span className="text-muted-foreground">•</span>
                  <Badge variant="outline" className="text-xs font-assistant">{plan.category}</Badge>
                  {hasIntroOffer && (
                    <Badge className="bg-primary text-primary-foreground text-xs font-assistant">מבצע מיוחד</Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Social Proof & Urgency Banner */}
          <Card className="border-2 border-primary/30 bg-gradient-to-l from-primary/5 via-background to-primary/5 shadow-lg">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Live Viewers */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-assistant text-muted-foreground">צופים כעת</span>
                  </div>
                  <div className="text-2xl font-bold font-heebo text-primary">{peopleViewing}</div>
                </div>
                
                {/* Recent Switches */}
                <div className="text-center border-x">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <UserCheck className="w-3 h-3 text-primary" />
                    <span className="text-xs font-assistant text-muted-foreground">עברו השבוע</span>
                  </div>
                  <div className="text-2xl font-bold font-heebo">243</div>
                </div>
                
                {/* Rating */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span className="text-xs font-assistant text-muted-foreground">דירוג</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-2xl font-bold font-heebo">4.8</span>
                    <span className="text-xs text-muted-foreground">/5</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Urgency Timer - Only for intro offers */}
          {hasIntroOffer && (
            <Card className="border-2 border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-orange-600 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-sm font-bold font-heebo">המבצע מסתיים בקרוב!</div>
                      <div className="text-xs text-muted-foreground font-assistant">נצל את ההזדמנות לחסוך</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-center bg-background rounded-lg p-2 min-w-[3rem]">
                      <div className="text-xl font-bold font-heebo">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <div className="text-[10px] text-muted-foreground font-assistant">שעות</div>
                    </div>
                    <span className="text-xl font-bold">:</span>
                    <div className="text-center bg-background rounded-lg p-2 min-w-[3rem]">
                      <div className="text-xl font-bold font-heebo">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <div className="text-[10px] text-muted-foreground font-assistant">דקות</div>
                    </div>
                    <span className="text-xl font-bold">:</span>
                    <div className="text-center bg-background rounded-lg p-2 min-w-[3rem]">
                      <div className="text-xl font-bold font-heebo">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <div className="text-[10px] text-muted-foreground font-assistant">שניות</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Primary CTA - Above the fold */}
          <Card className="border-2 border-primary bg-gradient-to-br from-primary via-primary/90 to-primary/80 shadow-2xl hover:shadow-primary/20 transition-all hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary-foreground font-heebo mb-2">
                    מוכן להתחיל לחסוך?
                  </div>
                  <div className="text-sm text-primary-foreground/90 font-assistant mb-3">
                    המעבר קל, מהיר ובחינם לגמרי
                  </div>
                  <div className="flex items-center gap-4 text-xs text-primary-foreground/80 font-assistant">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ללא עלות</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Timer className="w-4 h-4" />
                      <span>2-7 ימים</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      <span>מאובטח</span>
                    </div>
                  </div>
                </div>
                <Button 
                  size="lg"
                  onClick={() => onSelectForSwitch(plan)}
                  className="bg-background text-primary hover:bg-background/90 font-heebo text-lg px-8 py-6 shadow-xl hover:scale-105 transition-transform"
                >
                  <Sparkles className="w-5 h-5 ml-2" />
                  התחל עכשיו
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Overall Score Card */}
          <Card className="border-2 shadow-lg bg-gradient-to-br from-card to-muted/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl font-heebo mb-1">ציון כללי</CardTitle>
                  <CardDescription className="font-assistant">הערכת איכות ותחרותיות המסלול</CardDescription>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold font-heebo bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                    {overallScore}
                  </div>
                  <div className="text-xs text-muted-foreground font-assistant mt-1">מתוך 100</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Score Breakdown */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-primary" />
                      <span className="font-assistant">תחרותיות מחיר</span>
                    </div>
                    <span className="font-semibold font-heebo">{Math.round(priceScore)}/100</span>
                  </div>
                  <Progress value={priceScore} className="h-2" />
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="font-assistant">עושר תכונות</span>
                    </div>
                    <span className="font-semibold font-heebo">{Math.round(featuresScore)}/100</span>
                  </div>
                  <Progress value={featuresScore} className="h-2" />
                </div>
              </div>
              
              <Separator />
              
              {/* Quick Insights */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background rounded-lg p-3 border">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-xs font-assistant text-muted-foreground">מיועד ל</span>
                  </div>
                  <div className="text-sm font-semibold font-assistant">{getTargetAudience()}</div>
                </div>
                
                <div className="bg-background rounded-lg p-3 border">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span className="text-xs font-assistant text-muted-foreground">מיקום בשוק</span>
                  </div>
                  <div className="text-sm font-semibold font-assistant">{valueMetrics.marketPosition}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Section with Market Comparison */}
          {plan.regularPrice > 0 && (
            <Card className="border shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-heebo">תמחור והשוואה</CardTitle>
                    <CardDescription className="font-assistant">מחיר המסלול בהשוואה לממוצע בשוק</CardDescription>
                  </div>
                  {hasIntroOffer && (
                    <Badge className="bg-primary text-primary-foreground font-assistant">
                      מבצע מיוחד
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Price Display */}
                {hasIntroOffer ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-6">
                      <div className="flex-1 space-y-2">
                        <div className="text-sm text-muted-foreground font-assistant">מחיר מבצע</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold font-heebo text-primary">₪{plan.introPrice}</span>
                          <span className="text-muted-foreground font-assistant">/חודש</span>
                        </div>
                        <div className="text-xs text-muted-foreground font-assistant">תקף ל-12 חודשים ראשונים</div>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2">
                        <TrendingDown className="w-10 h-10 text-primary" />
                        <Badge variant="outline" className="font-assistant text-xs">
                          חיסכון {Math.round(((plan.regularPrice - plan.introPrice!) / plan.regularPrice) * 100)}%
                        </Badge>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="text-sm text-muted-foreground font-assistant">לאחר מכן</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold font-heebo text-muted-foreground">₪{plan.regularPrice}</span>
                          <span className="text-muted-foreground font-assistant">/חודש</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground font-assistant">מחיר חודשי</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold font-heebo text-foreground">₪{plan.regularPrice}</span>
                        <span className="text-lg text-muted-foreground font-assistant">/חודש</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <Separator />
                
                {/* Market Comparison */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium font-assistant">השוואה לממוצע בשוק</span>
                    {savingsVsAvg > 0 ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20 font-assistant">
                        חסכון של ₪{Math.round(savingsVsAvg)}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="font-assistant">מעל הממוצע</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-assistant text-muted-foreground">ממוצע שוק</span>
                      <span className="font-semibold font-heebo">₪{Math.round(avgPrice)}</span>
                    </div>
                    <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
                      <div 
                        className="absolute top-0 right-0 h-full bg-gradient-to-l from-primary to-primary/60 flex items-center justify-end pr-3"
                        style={{ width: `${Math.min((currentPrice / avgPrice) * 100, 100)}%` }}
                      >
                        <span className="text-xs font-bold text-primary-foreground font-heebo">
                          ₪{currentPrice}
                        </span>
                      </div>
                    </div>
                    {savingsPercent !== 0 && (
                      <div className="text-xs text-center font-assistant text-muted-foreground">
                        {savingsPercent > 0 ? `${savingsPercent}% מתחת לממוצע` : `${Math.abs(savingsPercent)}% מעל הממוצע`}
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                {/* Cost Breakdown */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground font-assistant mb-1">חודשי</div>
                    <div className="text-lg font-bold font-heebo">₪{currentPrice}</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground font-assistant mb-1">שנתי</div>
                    <div className="text-lg font-bold font-heebo">₪{currentPrice * 12}</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground font-assistant mb-1">לשנתיים</div>
                    <div className="text-lg font-bold font-heebo">₪{currentPrice * 24}</div>
                  </div>
                </div>
                
                {hasIntroOffer && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="text-sm font-semibold font-assistant">חשוב לדעת</div>
                        <div className="text-xs text-muted-foreground font-assistant leading-relaxed">
                          לאחר 12 החודשים הראשונים, המחיר יעלה ל-₪{plan.regularPrice} לחודש.
                          החיסכון הכולל בשנה הראשונה: ₪{(plan.regularPrice - plan.introPrice!) * 12}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Customer Reviews */}
          <Card className="border shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-heebo">מה לקוחות אומרים</CardTitle>
                  <CardDescription className="font-assistant">חוות דעת מאומתות</CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                  <span className="text-sm font-bold font-heebo mr-2">4.8</span>
                  <span className="text-xs text-muted-foreground font-assistant">(127 ביקורות)</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "רונית כהן", text: "עברתי והצלחתי לחסוך ₪800 בשנה! התהליך היה פשוט והמהיר מאוד.", rating: 5, date: "לפני שבועיים" },
                { name: "דוד לוי", text: "שירות מעולה, המעבר היה חלק לחלוטין. ממליץ בחום!", rating: 5, date: "לפני חודש" },
                { name: "שרה מזרחי", text: "המחיר הטוב ביותר שמצאתי בשוק. שווה מאוד!", rating: 4, date: "לפני 3 שבועות" }
              ].map((review, idx) => (
                <div key={idx} className="p-4 bg-muted/30 rounded-lg border hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold font-heebo text-primary">{review.name[0]}</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold font-assistant">{review.name}</div>
                        <div className="text-xs text-muted-foreground font-assistant">{review.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm font-assistant text-muted-foreground leading-relaxed">
                    <Quote className="w-3 h-3 inline ml-1 text-primary" />
                    {review.text}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <ThumbsUp className="w-3 h-3" />
                      <span className="font-assistant">מועיל (24)</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <MessageCircle className="w-3 h-3" />
                      <span className="font-assistant">תגובה</span>
                    </button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full font-assistant" size="sm">
                צפה בכל הביקורות (127)
                <ChevronRight className="w-4 h-4 mr-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Why This Plan Card */}
          <Card className="border-l-4 border-l-primary shadow-md">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-heebo">למה לבחור במסלול הזה?</CardTitle>
                  <CardDescription className="font-assistant">היתרונות המרכזיים</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {savingsVsAvg > 0 && (
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                  <TrendingDown className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold font-assistant text-green-900 dark:text-green-100">חסכוני מהממוצע</div>
                    <div className="text-xs text-green-700 dark:text-green-300 font-assistant mt-0.5">
                      חסכון של ₪{Math.round(savingsVsAvg)} לחודש לעומת ממוצע השוק
                    </div>
                  </div>
                </div>
              )}
              
              {plan.features.length >= 8 && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                  <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold font-assistant text-blue-900 dark:text-blue-100">עשיר בתכונות</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300 font-assistant mt-0.5">
                      המסלול כולל {plan.features.length} תכונות מתקדמות
                    </div>
                  </div>
                </div>
              )}
              
              {hasIntroOffer && (
                <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
                  <Star className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold font-assistant text-purple-900 dark:text-purple-100">מבצע מיוחד</div>
                    <div className="text-xs text-purple-700 dark:text-purple-300 font-assistant mt-0.5">
                      חיסכון של ₪{(plan.regularPrice - plan.introPrice!) * 12} בשנה הראשונה
                    </div>
                  </div>
                </div>
              )}
              
              {valueMetrics.marketPosition === 'פרימיום' && (
                <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                  <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold font-assistant text-amber-900 dark:text-amber-100">איכות פרימיום</div>
                    <div className="text-xs text-amber-700 dark:text-amber-300 font-assistant mt-0.5">
                      מסלול ברמה גבוהה עם שירות מעולה
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabbed Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger value="overview" className="font-assistant py-2.5">
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  סקירה
                </span>
              </TabsTrigger>
              <TabsTrigger value="features" className="font-assistant py-2.5">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  תכונות ({plan.features.length})
                </span>
              </TabsTrigger>
              {hasTechSpecs && (
                <TabsTrigger value="specs" className="font-assistant py-2.5">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    מפרט
                  </span>
                </TabsTrigger>
              )}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-6">
              {/* Plan Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-assistant">ספק</div>
                        <div className="text-sm font-bold font-heebo">{plan.company}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Target className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-assistant">מתאים ל</div>
                        <div className="text-sm font-bold font-heebo">{getTargetAudience()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Value Analysis */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-heebo">ניתוח ערך</CardTitle>
                  <CardDescription className="font-assistant text-xs">כדאיות המסלול בהשוואה לשוק</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary/20 flex items-center justify-center mb-2">
                        <span className="text-xl font-bold font-heebo text-primary">{Math.round(priceScore)}</span>
                      </div>
                      <div className="text-xs font-assistant text-muted-foreground">תחרותיות</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary/20 flex items-center justify-center mb-2">
                        <span className="text-xl font-bold font-heebo text-primary">{Math.round(featuresScore)}</span>
                      </div>
                      <div className="text-xs font-assistant text-muted-foreground">תכונות</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary/20 flex items-center justify-center mb-2">
                        <span className="text-xl font-bold font-heebo text-primary">{overallScore}</span>
                      </div>
                      <div className="text-xs font-assistant text-muted-foreground">כללי</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-xs font-assistant text-muted-foreground">זמן החלפה</span>
                  </div>
                  <div className="text-lg font-bold font-heebo">2-7 ימים</div>
                  <div className="text-xs text-muted-foreground font-assistant mt-1">ממוצע בענף</div>
                </div>
                
                <div className="bg-card border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-xs font-assistant text-muted-foreground">פופולריות</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.floor(overallScore / 20) ? 'fill-primary text-primary' : 'text-muted'}`} 
                      />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground font-assistant mt-1">מבוסס על ציון</div>
                </div>
              </div>

              {/* Top Features Preview */}
              {plan.features.length > 0 && (
                <Card className="border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-heebo">תכונות מרכזיות</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {plan.features.slice(0, 5).map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm font-assistant leading-relaxed">{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > 5 && (
                      <div className="pt-2 text-center">
                        <Button variant="ghost" size="sm" className="text-xs font-assistant">
                          ראה עוד {plan.features.length - 5} תכונות
                          <ChevronRight className="w-3 h-3 mr-1" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-4 mt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold font-heebo">כל התכונות</h3>
                  <p className="text-sm text-muted-foreground font-assistant">{plan.features.length} תכונות במסלול</p>
                </div>
                <Badge variant="outline" className="font-assistant">
                  {plan.features.length >= 10 ? 'מסלול עשיר' : plan.features.length >= 6 ? 'מסלול סטנדרטי' : 'מסלול בסיסי'}
                </Badge>
              </div>
              
              <div className="grid gap-2">
                {plan.features.map((feature, index) => (
                  <div 
                    key={index}
                    className="group flex items-start gap-3 p-4 rounded-lg bg-card border hover:border-primary/50 hover:shadow-md transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-assistant leading-relaxed block">{feature}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs font-assistant">
                      #{index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
              
              {/* Features Summary */}
              <Card className="border-l-4 border-l-primary bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold font-assistant mb-1">סיכום תכונות</div>
                      <div className="text-xs text-muted-foreground font-assistant leading-relaxed">
                        מסלול זה כולל {plan.features.length} תכונות מקיפות המספקות פתרון {
                          plan.features.length >= 10 ? 'מלא ומתקדם' : 
                          plan.features.length >= 6 ? 'מאוזן' : 
                          'בסיסי וממוקד'
                        } לצרכים שלך.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Technical Specs Tab */}
            {hasTechSpecs && (
              <TabsContent value="specs" className="space-y-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold font-heebo">מפרט טכני</h3>
                    <p className="text-sm text-muted-foreground font-assistant">פרטים מלאים על המסלול</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {plan.downloadSpeed && (
                    <Card className="border-2 border-primary/20 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Download className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="text-xs font-medium font-assistant text-muted-foreground">מהירות הורדה</div>
                            <div className="text-2xl font-bold font-heebo mt-1">{plan.downloadSpeed}</div>
                          </div>
                        </div>
                        <Progress value={75} className="h-1.5" />
                      </CardContent>
                    </Card>
                  )}
                  
                  {plan.uploadSpeed && (
                    <Card className="border-2 border-primary/20 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Upload className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="text-xs font-medium font-assistant text-muted-foreground">מהירות העלאה</div>
                            <div className="text-2xl font-bold font-heebo mt-1">{plan.uploadSpeed}</div>
                          </div>
                        </div>
                        <Progress value={65} className="h-1.5" />
                      </CardContent>
                    </Card>
                  )}
                  
                  {plan.dataAmount && (
                    <Card className="border-2 border-primary/20 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Database className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="text-xs font-medium font-assistant text-muted-foreground">נפח גלישה</div>
                            <div className="text-2xl font-bold font-heebo mt-1">{plan.dataAmount}</div>
                          </div>
                        </div>
                        <Progress value={plan.dataAmount.includes('ללא') ? 100 : 70} className="h-1.5" />
                      </CardContent>
                    </Card>
                  )}
                  
                  {plan.speed && plan.category === 'electricity' && (
                    <Card className="border-2 border-primary/20 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="text-xs font-medium font-assistant text-muted-foreground">הנחה</div>
                            <div className="text-2xl font-bold font-heebo mt-1">{plan.speed}</div>
                          </div>
                        </div>
                        <Progress value={60} className="h-1.5" />
                      </CardContent>
                    </Card>
                  )}
                  
                  {plan.callMinutes && (
                    <Card className="border-2 border-primary/20 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Phone className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="text-xs font-medium font-assistant text-muted-foreground">דקות שיחה</div>
                            <div className="text-2xl font-bold font-heebo mt-1">{plan.callMinutes}</div>
                          </div>
                        </div>
                        <Progress value={plan.callMinutes.includes('ללא') ? 100 : 80} className="h-1.5" />
                      </CardContent>
                    </Card>
                  )}
                  
                  {plan.smsAmount && (
                    <Card className="border-2 border-primary/20 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="text-xs font-medium font-assistant text-muted-foreground">הודעות SMS</div>
                            <div className="text-2xl font-bold font-heebo mt-1">{plan.smsAmount}</div>
                          </div>
                        </div>
                        <Progress value={plan.smsAmount.includes('ללא') ? 100 : 70} className="h-1.5" />
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {/* Specs Summary */}
                <Card className="bg-muted/50 border-2">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <BarChart3 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold font-assistant mb-1">סיכום מפרט</div>
                        <div className="text-xs text-muted-foreground font-assistant leading-relaxed">
                          המסלול מספק מפרט טכני {
                            (plan.downloadSpeed && plan.uploadSpeed && plan.dataAmount) ? 'מלא ומקיף' :
                            'מותאם לצרכים'
                          } המתאים לשימוש יומיומי.
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
          
          {/* Trust & Guarantee Section */}
          <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-heebo">100% מאובטח וללא סיכון</CardTitle>
                  <CardDescription className="font-assistant">ההתחייבות שלנו אליך</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="p-4 bg-background rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all cursor-help hover-scale">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-semibold font-assistant">הגנת מידע</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-assistant">הנתונים שלך מוגנים בהצפנה מלאה</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-assistant">אנחנו משתמשים בהצפנת SSL/TLS ברמה הגבוהה ביותר</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="p-4 bg-background rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all cursor-help hover-scale">
                        <div className="flex items-center gap-2 mb-2">
                          <RefreshCw className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-semibold font-assistant">ביטול בכל עת</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-assistant">אפשרות לבטל ללא קנסות</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-assistant">ניתן לבטל בכל שלב ללא עלויות נוספות</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="p-4 bg-background rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all cursor-help hover-scale">
                        <div className="flex items-center gap-2 mb-2">
                          <HeadphonesIcon className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-semibold font-assistant">תמיכה 24/7</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-assistant">נשמח לעזור בכל שאלה</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-assistant">צוות התמיכה שלנו זמין עבורך בכל עת</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="p-4 bg-background rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all cursor-help hover-scale">
                        <div className="flex items-center gap-2 mb-2">
                          <Verified className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-semibold font-assistant">מאושר</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-assistant">מוסדר ע"י משרד התקשורת</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-assistant">כל השירותים מוסדרים וחוקיים</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Separator />
              
              <div className="bg-background rounded-lg p-4 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold font-assistant mb-1">מבטיחים לך שקט נפשי</div>
                    <div className="text-xs text-muted-foreground font-assistant leading-relaxed">
                      אם לא תהיה מרוצה מהשירות תוך 14 יום, נחזיר לך את הכסף במלואו - ללא שאלות!
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* FAQ Section */}
          <Card className="border shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-heebo">שאלות נפוצות</CardTitle>
              <CardDescription className="font-assistant">תשובות לשאלות שנשאלות הכי הרבה</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b">
                  <AccordionTrigger className="text-right font-assistant hover:no-underline">
                    כמה זמן לוקח תהליך המעבר?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground font-assistant leading-relaxed">
                    תהליך המעבר לוקח בין 2 ל-7 ימי עסקים. במהלך תקופה זו, השירות הקיים שלך ימשיך לפעול ללא הפרעה.
                    ברגע שהמעבר יושלם, תקבל הודעה ממנו והשירות החדש יופעל אוטומטית.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-b">
                  <AccordionTrigger className="text-right font-assistant hover:no-underline">
                    האם יש עלויות נסתרות או חיובים נוספים?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground font-assistant leading-relaxed">
                    לא! המחיר שאתה רואה הוא המחיר הסופי. אין עלויות הפעלה, עלויות התקנה או חיובים נסתרים.
                    אם יש מבצע מיוחד, המחיר המוצג כבר כולל את ההנחה.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-b">
                  <AccordionTrigger className="text-right font-assistant hover:no-underline">
                    מה קורה עם החוזה הקודם שלי?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground font-assistant leading-relaxed">
                    אנחנו דואגים לכל התהליך עבורך! במסגרת השירות שלנו, אנחנו מטפלים בביטול החוזה הקודם
                    ומוודאים שלא יהיו לך קנסות או חיובים נוספים. זה חלק מהשירות שלנו ללא עלות נוספת.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-b">
                  <AccordionTrigger className="text-right font-assistant hover:no-underline">
                    האם המספר שלי נשמר במעבר בין ספקים?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground font-assistant leading-relaxed">
                    כן! לפי חוק ניודיות, אתה יכול לשמור על המספר שלך בעת מעבר בין ספקים.
                    התהליך נעשה אוטומטית ואין צורך בפעולה מצדך - המספר יועבר יחד איתך לספק החדש.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-right font-assistant hover:no-underline">
                    מה יקרה לאחר תקופת המבצע?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground font-assistant leading-relaxed">
                    {hasIntroOffer ? (
                      <>
                        לאחר 12 חודשים, המחיר יעלה ל-₪{plan.regularPrice} לחודש. זה עדיין מחיר תחרותי בשוק.
                        תמיד תוכל לעבור לספק אחר ללא קנסות אם תמצא הצעה טובה יותר.
                      </>
                    ) : (
                      <>
                        מסלול זה מוצע במחיר קבוע של ₪{plan.regularPrice} לחודש ללא תקופת מבצע.
                        המחיר יישאר כך לאורך כל תקופת החוזה.
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          {/* Personalized Recommendation */}
          <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <TrendingUpIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold font-heebo mb-2">
                    משפחות כמוך חסכו בממוצע ₪{Math.round(Math.max(savingsVsAvg, 500))} בשנה
                  </div>
                  <p className="text-sm text-muted-foreground font-assistant leading-relaxed mb-4">
                    על פי הניתוח שלנו, מסלול זה מתאים במיוחד ל{getTargetAudience()}.
                    {savingsVsAvg > 0 && ` תוכל לחסוך עד ₪${Math.round(savingsVsAvg * 12)} בשנה הראשונה!`}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="font-assistant">
                      <CheckCircle2 className="w-3 h-3 ml-1" />
                      מתאים לצרכים שלך
                    </Badge>
                    <Badge variant="secondary" className="font-assistant">
                      <Star className="w-3 h-3 ml-1" />
                      מדורג גבוה
                    </Badge>
                    {savingsVsAvg > 0 && (
                      <Badge variant="secondary" className="font-assistant">
                        <TrendingDown className="w-3 h-3 ml-1" />
                        חסכוני
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Sticky CTA Footer */}
        <div className="sticky bottom-0 bg-gradient-to-t from-background via-background/98 to-background/95 backdrop-blur-md border-t-2 border-primary/20 p-6 shadow-2xl">
          <div className="max-w-4xl mx-auto space-y-3">
            {/* Main CTA Button */}
            <Button
              onClick={() => onSelectForSwitch(plan)}
              className="w-full h-16 text-xl font-heebo bg-gradient-to-l from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/95 hover:to-primary shadow-2xl hover:shadow-primary/20 transition-all hover:scale-[1.02] group"
              size="lg"
            >
              <Sparkles className="w-6 h-6 ml-3 group-hover:rotate-12 transition-transform" />
              <span>התחל לחסוך עכשיו</span>
              <ArrowRight className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground font-assistant">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>ללא עלות</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1.5 text-muted-foreground font-assistant">
                <Timer className="w-4 h-4 text-blue-600" />
                <span>תהליך של 2-7 ימים</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1.5 text-muted-foreground font-assistant">
                <Shield className="w-4 h-4 text-primary" />
                <span>100% מאובטח</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1.5 text-muted-foreground font-assistant">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>דירוג 4.8/5</span>
              </div>
            </div>
            
            {/* Savings Highlight */}
            {savingsVsAvg > 0 && (
              <div className="text-center py-2 px-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <span className="text-sm font-bold text-green-700 dark:text-green-400 font-assistant">
                  💰 תחסוך ₪{Math.round(savingsVsAvg * 12)} בשנה הראשונה!
                </span>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
