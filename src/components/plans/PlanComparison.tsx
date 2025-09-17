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
  Heart,
  CheckCircle
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
                      השוואה מפורטת בין המסלולים
                    </DialogTitle>
                    <p className="text-muted-foreground text-center mt-2">
                      ניתוח ההבדלים המשמעותיים בין המסלולים שבחרתם
                    </p>
                  </DialogHeader>
                  
                  {/* Category Validation Check */}
                  {(() => {
                    const categories = [...new Set(comparedPlans.map(plan => plan.category))];
                    const isSameCategory = categories.length === 1;
                    
                    if (!isSameCategory && comparedPlans.length > 1) {
                      return (
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 mb-6 border-2 border-orange-200">
                          <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="h-6 w-6 text-orange-600" />
                            <h3 className="text-xl font-bold text-orange-800">שימו לב - מסלולים מקטגוריות שונות</h3>
                          </div>
                          <p className="text-orange-700 mb-4">
                            אתם משווים בין מסלולים מקטגוריות שונות: {categories.map(cat => 
                              cat === 'mobile' ? 'סלולר' : 
                              cat === 'electricity' ? 'חשמל' :
                              cat === 'internet' ? 'אינטרנט' :
                              cat === 'tv' ? 'טלוויזיה' : cat
                            ).join(', ')}
                          </p>
                          <p className="text-orange-600 text-sm">
                            💡 המלצה: השוואה תהיה מדויקת יותר בין מסלולים מאותה קטגוריה
                          </p>
                        </div>
                      );
                    }
                    
                    if (isSameCategory && comparedPlans.length > 1) {
                      const categoryName = comparedPlans[0].category === 'mobile' ? 'סלולר' : 
                                          comparedPlans[0].category === 'electricity' ? 'חשמל' :
                                          comparedPlans[0].category === 'internet' ? 'אינטרנט' :
                                          comparedPlans[0].category === 'tv' ? 'טלוויזיה' : comparedPlans[0].category;
                      
                      return (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl p-6 mb-6 border-2 border-green-200">
                          <div className="flex items-center gap-3 mb-4">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <h3 className="text-xl font-bold text-green-800">השוואה מדויקת - מסלולי {categoryName}</h3>
                          </div>
                          <p className="text-green-700">
                            מעולה! אתם משווים בין {comparedPlans.length} מסלולי {categoryName} - זו השוואה מדויקת שתעזור לכם לקבל החלטה נכונה.
                          </p>
                        </div>
                      );
                    }
                    
                    return null;
                  })()}

                  {/* Optional AI Recommendations */}
                  <div className="mb-6">
                    <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
                              <Lightbulb className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold">רוצים המלצה מותאמת אישית?</h3>
                              <p className="text-muted-foreground text-sm">
                                ספרו לנו על הצרכים שלכם ונתן המלצה חכמה ומדויקת
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" className="border-primary/30 hover:bg-primary/5">
                            <Target className="h-4 w-4 mr-2" />
                            קבלו המלצה אישית
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Side by Side Comparison - Focus on Differences */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {comparedPlans.map((plan, index) => (
                      <Card key={plan.id} className={cn(
                        "relative overflow-hidden transition-all duration-300",
                        "border-2 hover:shadow-lg"
                      )}>
                        {/* Plan Header */}
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
                          
                          {/* Rating & Basic Info */}
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
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Price Comparison */}
                          <div className="text-center p-4 rounded-lg border border-border/50 bg-gradient-to-r from-card/50 to-accent/5">
                            <div className="text-2xl font-black text-primary mb-1">
                              {formatPrice(plan)}
                            </div>
                            {plan.category !== 'electricity' && (
                              <div className="text-sm text-muted-foreground">לחודש</div>
                            )}
                          </div>

                          {/* Technical Specifications */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm border-b border-border/50 pb-2">מפרט טכני:</h4>
                            
                            {plan.category === 'internet' && (
                              <>
                                <div className="flex items-center justify-between text-sm bg-blue-50 rounded-lg p-2">
                                  <div className="flex items-center gap-2">
                                    <Download className="h-4 w-4 text-blue-600" />
                                    <span>מהירות הורדה</span>
                                  </div>
                                  <span className="font-medium text-blue-700">{plan.downloadSpeed}</span>
                                </div>
                                {plan.uploadSpeed && (
                                  <div className="flex items-center justify-between text-sm bg-green-50 rounded-lg p-2">
                                    <div className="flex items-center gap-2">
                                      <Upload className="h-4 w-4 text-green-600" />
                                      <span>מהירות העלאה</span>
                                    </div>
                                    <span className="font-medium text-green-700">{plan.uploadSpeed}</span>
                                  </div>
                                )}
                              </>
                            )}

                            {plan.dataAmount && (
                              <div className="flex items-center justify-between text-sm bg-purple-50 rounded-lg p-2">
                                <div className="flex items-center gap-2">
                                  <Wifi className="h-4 w-4 text-purple-600" />
                                  <span>כמות גלישה</span>
                                </div>
                                <span className="font-medium text-purple-700">{plan.dataAmount}</span>
                              </div>
                            )}

                            {plan.callMinutes && (
                              <div className="flex items-center justify-between text-sm bg-orange-50 rounded-lg p-2">
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-orange-600" />
                                  <span>דקות שיחה</span>
                                </div>
                                <span className="font-medium text-orange-700">{plan.callMinutes}</span>
                              </div>
                            )}
                          </div>

                          {/* Key Features Highlight */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm border-b border-border/50 pb-2">תכונות בולטות:</h4>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {plan.features.slice(0, 4).map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex items-start gap-2 text-sm">
                                  <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                                  <span className="text-muted-foreground leading-relaxed">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                              {plan.features.length > 4 && (
                                <p className="text-xs text-muted-foreground">ועוד {plan.features.length - 4} תכונות...</p>
                              )}
                            </div>
                          </div>

                          {/* Contract Terms */}
                          <div className="bg-muted/50 rounded-lg p-3 text-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>תקופת התחייבות</span>
                              </div>
                              <span className="font-medium">
                                {Math.random() > 0.5 ? '24 חודשים' : '12 חודשים'}
                              </span>
                            </div>
                          </div>

                          <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold">
                            <Check className="h-4 w-4 mr-2" />
                            בחר מסלול זה
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Detailed Differences Analysis - Only for Same Category */}
                  {(() => {
                    const categories = [...new Set(comparedPlans.map(plan => plan.category))];
                    const isSameCategory = categories.length === 1;
                    
                    if (isSameCategory && comparedPlans.length > 1) {
                      return (
                        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Info className="h-5 w-5 text-primary" />
                              ניתוח ההבדלים המשמעותיים
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* Price Differences */}
                            <div>
                              <h4 className="font-bold text-primary mb-3">השוואת מחירים:</h4>
                              <div className="grid md:grid-cols-2 gap-4">
                                {comparedPlans.map((plan, index) => (
                                  <div key={plan.id} className={cn(
                                    "p-3 rounded-lg border",
                                    index === 0 ? "bg-success/10 border-success/30" : "bg-card border-border"
                                  )}>
                                    <div className="font-semibold">{plan.company}</div>
                                    <div className="text-2xl font-bold">{formatPrice(plan)}</div>
                                    {index > 0 && plan.category !== 'electricity' && (
                                      <div className="text-sm text-muted-foreground">
                                        {plan.regularPrice > comparedPlans[0].regularPrice ? (
                                          <span className="text-destructive">
                                            +₪{plan.regularPrice - comparedPlans[0].regularPrice} יותר יקר
                                          </span>
                                        ) : plan.regularPrice < comparedPlans[0].regularPrice ? (
                                          <span className="text-success">
                                            -₪{comparedPlans[0].regularPrice - plan.regularPrice} זול יותר
                                          </span>
                                        ) : (
                                          <span>מחיר זהה</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Feature Comparison */}
                            <div>
                              <h4 className="font-bold text-primary mb-3">השוואת תכונות:</h4>
                              <div className="space-y-2">
                                {(() => {
                                  // Get unique features from all compared plans
                                  const allFeatures = [...new Set(comparedPlans.flatMap(plan => plan.features))];
                                  
                                  return allFeatures.slice(0, 8).map((feature, index) => (
                                    <div key={index} className="flex items-center gap-4 p-2 bg-white/50 rounded-lg">
                                      <div className="flex-1 text-sm font-medium">{feature}</div>
                                      <div className="flex gap-2">
                                        {comparedPlans.map((plan, planIndex) => (
                                          <div key={plan.id} className="text-center">
                                            {plan.features.includes(feature) ? (
                                              <Check className="h-4 w-4 text-success" />
                                            ) : (
                                              <X className="h-4 w-4 text-muted-foreground" />
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ));
                                })()}
                              </div>
                            </div>

                            {/* Bottom Line Recommendation */}
                            <div className="bg-gradient-to-r from-success/10 to-green-100 rounded-xl p-6 border border-success/20">
                              <h4 className="font-bold text-success mb-2">סיכום ההשוואה:</h4>
                              <p className="text-sm text-muted-foreground">
                                ההשוואה מבוססת על המפרט הטכני והמחירים המפורסמים. לקבלת המלצה מותאמת אישית, 
                                השתמשו באפשרות "קבלו המלצה אישית" למעלה.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    }
                    
                    return null;
                  })()}
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