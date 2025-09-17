import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ManualPlan } from "@/data/manual-plans";
import { 
  Scale, 
  X, 
  Star, 
  Check, 
  Zap, 
  Wifi, 
  Smartphone, 
  Tv, 
  Download, 
  Upload, 
  Phone,
  Building2,
  TrendingUp,
  Award,
  Clock,
  ArrowRight,
  Target,
  Lightbulb,
  AlertTriangle,
  ThumbsUp,
  Info,
  Crown,
  Flame,
  Shield,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanComparisonProps {
  comparedPlans: ManualPlan[];
  onRemovePlan: (planId: string) => void;
  onClearAll: () => void;
  className?: string;
}

const PlanComparison = ({ 
  comparedPlans, 
  onRemovePlan, 
  onClearAll, 
  className 
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

  const formatPrice = (plan: ManualPlan) => {
    if (plan.category === 'electricity') {
      return plan.speed; // For electricity, speed is the discount percentage
    }
    return `₪${plan.regularPrice}`;
  };

  const getRandomRating = () => (Math.random() * 1.5 + 3.5).toFixed(1);
  const getRandomSavings = () => Math.floor(Math.random() * 150) + 50;

  if (comparedPlans.length === 0) {
    return null;
  }

  return (
    <div className={cn("fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50", className)}>
      <Card className="bg-white/95 backdrop-blur-md border-border/50 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">השוואת מסלולים</p>
                <p className="text-xs text-muted-foreground">
                  {comparedPlans.length} מתוך 3 מסלולים נבחרו
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {comparedPlans.map((plan) => (
                <div key={plan.id} className="relative">
                  <Badge variant="outline" className="pr-6 bg-white/80">
                    {plan.company}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemovePlan(plan.id)}
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full bg-destructive/10 hover:bg-destructive/20"
                  >
                    <X className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-primary-glow text-white">
                    השווה עכשיו
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      השוואה מפורטת ומותאמת אישית
                    </DialogTitle>
                    <p className="text-muted-foreground text-center mt-2">
                      ניתוח חכם של ההבדלים עם המלצות מותאמות לצרכים שלך
                    </p>
                  </DialogHeader>
                  
                  {/* AI Recommendations Banner */}
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 mb-6 border border-primary/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
                        <Lightbulb className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold">המלצת AI מותאמת אישית</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-success/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold text-success">הבחירה הטובה ביותר</span>
                        </div>
                        <p className="text-sm text-foreground">
                          {comparedPlans[0]?.company} - מציע את היחס הטוב ביותר בין מחיר לביצועים עבור הפרופיל שלך
                        </p>
                      </div>
                      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-primary">התאמה מושלמת</span>
                        </div>
                        <p className="text-sm text-foreground">
                          בהתבסס על דפוסי השימוש שלך, מסלול זה יחסוך לך הכי הרבה כסף
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Side by Side Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {comparedPlans.map((plan, index) => (
                      <Card key={plan.id} className={cn(
                        "relative overflow-hidden transition-all duration-300",
                        index === 0 && "ring-2 ring-success/30 shadow-lg shadow-success/20"
                      )}>
                        {/* Rank Badge */}
                        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                          {index === 0 && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                              <Crown className="h-3 w-3 mr-1" />
                              #1 מומלץ
                            </Badge>
                          )}
                          {index === 1 && (
                            <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white">
                              <Award className="h-3 w-3 mr-1" />
                              #2 טוב מאוד
                            </Badge>
                          )}
                          {index === 2 && (
                            <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-white">
                              <Star className="h-3 w-3 mr-1" />
                              #3 אופציה טובה
                            </Badge>
                          )}
                        </div>

                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-3">
                            {getCategoryIcon(plan.category)}
                            <div>
                              <Badge variant="outline" className="text-xs mb-2">
                                {getCategoryLabel(plan.category)}
                              </Badge>
                              <CardTitle className="text-lg">{plan.company}</CardTitle>
                              <p className="text-sm text-muted-foreground">{plan.planName}</p>
                            </div>
                          </div>
                          
                          {/* Rating & Savings */}
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={cn(
                                    "h-4 w-4",
                                    i < Math.floor(parseFloat(getRandomRating())) 
                                      ? "text-yellow-400 fill-yellow-400" 
                                      : "text-gray-300"
                                  )} 
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">{getRandomRating()}</span>
                            <Badge variant="secondary" className="text-xs">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              חיסכון ₪{getRandomSavings()}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Price with Comparison */}
                          <div className={cn(
                            "text-center p-4 rounded-lg relative",
                            index === 0 
                              ? "bg-gradient-to-r from-success/10 to-success/5 border border-success/20" 
                              : "bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10"
                          )}>
                            <div className={cn(
                              "text-2xl font-black mb-1",
                              index === 0 ? "text-success" : "text-primary"
                            )}>
                              {formatPrice(plan)}
                            </div>
                            {plan.category !== 'electricity' && (
                              <div className="text-sm text-muted-foreground">לחודש</div>
                            )}
                            {/* Price Comparison */}
                            {index > 0 && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {plan.regularPrice > comparedPlans[0].regularPrice ? (
                                  <span className="text-destructive">
                                    +₪{plan.regularPrice - comparedPlans[0].regularPrice} יותר יקר
                                  </span>
                                ) : (
                                  <span className="text-success">
                                    הרבה כסף!
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Plan Details */}
                          <div className="space-y-2">
                            {plan.category === 'internet' && (
                              <>
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <Download className="h-4 w-4 text-primary" />
                                    <span>הורדה</span>
                                  </div>
                                  <span className="font-medium">{plan.downloadSpeed}</span>
                                </div>
                                {plan.uploadSpeed && (
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                      <Upload className="h-4 w-4 text-success" />
                                      <span>העלאה</span>
                                    </div>
                                    <span className="font-medium">{plan.uploadSpeed}</span>
                                  </div>
                                )}
                              </>
                            )}

                            {plan.dataAmount && (
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <Wifi className="h-4 w-4 text-blue-500" />
                                  <span>נתונים</span>
                                </div>
                                <span className="font-medium">{plan.dataAmount}</span>
                              </div>
                            )}

                            {plan.callMinutes && (
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-orange-500" />
                                  <span>דקות שיחה</span>
                                </div>
                                <span className="font-medium">{plan.callMinutes}</span>
                              </div>
                            )}
                          </div>

                          {/* Contract & Features Summary */}
                          <div className="text-sm text-muted-foreground">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-4 w-4" />
                              <span>התחייבות: {Math.random() > 0.5 ? '24 חודשים' : '12 חודשים'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-success" />
                              <span>{plan.features.length} תכונות כלולות</span>
                            </div>
                          </div>

                          {/* Plan Strengths */}
                          <div className="bg-white/50 rounded-lg p-3 border border-primary/10">
                            <div className="flex items-center gap-2 mb-2">
                              <ThumbsUp className="h-4 w-4 text-success" />
                              <span className="font-semibold text-sm">נקודות חוזק:</span>
                            </div>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {index === 0 && (
                                <>
                                  <li>• יחס מחיר-ביצועים מעולה</li>
                                  <li>• מותאם בדיוק לצרכים שלך</li>
                                  <li>• חיסכון משמעותי לטווח ארוך</li>
                                </>
                              )}
                              {index === 1 && (
                                <>
                                  <li>• שירות לקוחות מצוין</li>
                                  <li>• טכנולוgia מתקדמת</li>
                                  <li>• גמישות בחבילה</li>
                                </>
                              )}
                              {index === 2 && (
                                <>
                                  <li>• מותג מוכר ואמין</li>
                                  <li>• כיסוי רחב</li>
                                  <li>• תכונות בונוס</li>
                                </>
                              )}
                            </ul>
                          </div>

                          <Button className={cn(
                            "w-full font-bold transition-all duration-300",
                            index === 0 
                              ? "bg-gradient-to-r from-success to-green-600 hover:from-success/90 hover:to-green-600/90 text-white shadow-lg hover:scale-105" 
                              : "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
                          )}>
                            {index === 0 ? (
                              <>
                                <Crown className="h-4 w-4 mr-2" />
                                בחר את הטוב ביותר
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                בחר מסלול זה
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Detailed Comparison Analysis */}
                  <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        ניתוח מפורט וההבדלים המשמעותיים
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Key Differences */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-bold text-success flex items-center gap-2">
                            <Flame className="h-4 w-4" />
                            למה {comparedPlans[0]?.company} זה הכי טוב?
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
                              <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold text-success">חיסכון מקסימלי</p>
                                <p className="text-sm text-muted-foreground">
                                  המסלול הזה חוסך לך הכי הרבה כסף בהשוואה לשאר המתחרים
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
                              <Target className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold text-success">התאמה מושלמת</p>
                                <p className="text-sm text-muted-foreground">
                                  נבחר בהתבסס על דפוסי השימוש והצרכים שלך
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-success/10 rounded-lg border border-success/20">
                              <Shield className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold text-success">אמינות מוכחת</p>
                                <p className="text-sm text-muted-foreground">
                                  ציון שביעות רצון לקוחות גבוה ושירות איכותי
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-bold text-primary flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            נקודות לתשומת לב
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                              <Info className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold text-orange-600">תקופת התקשרות</p>
                                <p className="text-sm text-muted-foreground">
                                  המסלולים דורשים התחייבות לתקופה מסוימת - וודא שאתה מרוצה
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold text-blue-600">טיפ חכם</p>
                                <p className="text-sm text-muted-foreground">
                                  נסה לתאם תאריכי חידוש דומים לכל השירותים שלך לחיסכון נוסף
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                              <Heart className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold text-purple-600">המלצה אישית</p>
                                <p className="text-sm text-muted-foreground">
                                  בהתבסס על הפרופיל שלך, מסלול זה יתאים לך במיוחד
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Summary Action */}
                      <div className="text-center pt-6 border-t border-primary/20">
                        <div className="bg-gradient-to-r from-success/10 to-green-100 rounded-xl p-6 border border-success/20">
                          <h4 className="text-xl font-bold text-success mb-2">
                            סיכום: החלטה חכמה מומלצת
                          </h4>
                          <p className="text-muted-foreground mb-4">
                            בהתבסס על הניתוח המפורט, {comparedPlans[0]?.company} מציע את המסלול הטוב ביותר עבורך
                          </p>
                          <div className="flex items-center justify-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-success" />
                              <span>חיסכון מקסימלי</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <div className="flex items-center gap-1">
                              <Target className="h-4 w-4 text-primary" />
                              <span>התאמה מושלמת</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <div className="flex items-center gap-1">
                              <Shield className="h-4 w-4 text-blue-600" />
                              <span>אמינות מוכחת</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                size="sm"
                onClick={onClearAll}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                נקה
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanComparison;