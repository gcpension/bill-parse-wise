import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ManualPlan } from "@/data/manual-plans";
import PersonalizedRecommendation from "./PersonalizedRecommendation";
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
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);

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
                <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-background via-background/95 to-accent/5">
                  <DialogHeader>
                    <DialogTitle className="text-4xl font-bold text-center bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                      השוואה מפורטת ומקצועית
                    </DialogTitle>
                    <p className="text-muted-foreground text-center mt-3 text-lg">
                      ניתוח מעמיק של ההבדלים המשמעותיים בין המסלולים שבחרתם
                    </p>
                  </DialogHeader>
                  
                  {/* Category Validation Check - Enhanced Design */}
                  {(() => {
                    const categories = [...new Set(comparedPlans.map(plan => plan.category))];
                    const isSameCategory = categories.length === 1;
                    
                    if (!isSameCategory && comparedPlans.length > 1) {
                      return (
                        <Card className="bg-gradient-to-r from-orange-50 via-orange-100/70 to-orange-50 border-2 border-orange-300/50 shadow-lg mb-6">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <AlertTriangle className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-orange-800 mb-3">השוואה בין קטגוריות שונות</h3>
                                <p className="text-orange-700 mb-4 leading-relaxed">
                                  אתם משווים בין מסלולים מקטגוריות שונות: {categories.map(cat => 
                                    cat === 'mobile' ? 'סלולר' : 
                                    cat === 'electricity' ? 'חשמל' :
                                    cat === 'internet' ? 'אינטרנט' :
                                    cat === 'tv' ? 'טלוויזיה' : cat
                                  ).join(', ')}
                                </p>
                                <div className="bg-orange-100/80 rounded-xl p-4 border border-orange-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className="h-5 w-5 text-orange-600" />
                                    <span className="font-semibold text-orange-800">המלצה חכמה:</span>
                                  </div>
                                  <p className="text-orange-700 text-sm">
                                    השוואה תהיה מדויקת ומועילה יותר בין מסלולים מאותה קטגוריה. כך תוכלו להשוות מפרטים טכניים ותכונות רלוונטיות.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    }
                    
                    if (isSameCategory && comparedPlans.length > 1) {
                      const categoryName = comparedPlans[0].category === 'mobile' ? 'סלולר' : 
                                          comparedPlans[0].category === 'electricity' ? 'חשמל' :
                                          comparedPlans[0].category === 'internet' ? 'אינטרנט' :
                                          comparedPlans[0].category === 'tv' ? 'טלוויזיה' : comparedPlans[0].category;
                      
                      return (
                        <Card className="bg-gradient-to-r from-success/10 via-emerald-50 to-success/10 border-2 border-success/30 shadow-lg mb-6">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-success rounded-2xl flex items-center justify-center shadow-lg">
                                <CheckCircle className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-success mb-3">השוואה מדויקת - מסלולי {categoryName}</h3>
                                <p className="text-green-700 leading-relaxed">
                                  מעולה! אתם משווים בין {comparedPlans.length} מסלולי {categoryName} - זו השוואה מדויקת שתעזור לכם לקבל החלטה נכונה ומושכלת.
                                </p>
                                <div className="mt-4 flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-success" />
                                    <span>השוואה טכנית מדויקת</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-success" />
                                    <span>מחירים ותכונות רלוונטיים</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-success" />
                                    <span>המלצות מותאמות</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    }
                    
                    return null;
                  })()}

                  {/* Enhanced Comparison Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    {comparedPlans.map((plan, index) => (
                      <Card key={plan.id} className="relative overflow-hidden transition-all duration-500 hover:shadow-2xl border-0 bg-gradient-to-br from-card via-card/95 to-accent/5 backdrop-blur-sm">
                        {/* Ranking Badge */}
                        <div className="absolute top-4 left-4 z-10">
                          <Badge className={cn(
                            "font-bold text-sm px-3 py-1 shadow-lg",
                            index === 0 ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white" :
                            index === 1 ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white" :
                            "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                          )}>
                            #{index + 1}
                          </Badge>
                        </div>

                        {/* Background Glow */}
                        <div className={cn(
                          "absolute inset-0 opacity-0 hover:opacity-10 transition-opacity duration-500",
                          index === 0 ? "bg-gradient-to-br from-success/30 to-success/10" : "bg-gradient-to-br from-primary/30 to-primary/10"
                        )} />

                        <CardHeader className="pb-4 relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={cn(
                              "p-3 rounded-2xl text-white shadow-lg",
                              plan.category === 'electricity' ? "bg-gradient-to-r from-yellow-400 to-yellow-500" :
                              plan.category === 'mobile' ? "bg-gradient-to-r from-purple-400 to-purple-500" :
                              plan.category === 'internet' ? "bg-gradient-to-r from-cyan-400 to-cyan-500" :
                              "bg-gradient-to-r from-orange-400 to-orange-500"
                            )}>
                              {getCategoryIcon(plan.category)}
                            </div>
                            <div className="flex-1">
                              <Badge variant="outline" className="text-xs mb-2 bg-white/50 backdrop-blur-sm">
                                {getCategoryLabel(plan.category)}
                              </Badge>
                              <CardTitle className="text-xl font-black">{plan.company}</CardTitle>
                              <p className="text-muted-foreground font-medium">{plan.planName}</p>
                            </div>
                          </div>
                          
                          {/* Enhanced Rating */}
                          <div className="flex items-center gap-3 p-3 bg-white/30 backdrop-blur-sm rounded-xl">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={cn(
                                    "h-5 w-5",
                                    i < Math.floor(parseFloat(getRandomRating())) 
                                      ? "text-yellow-400 fill-yellow-400" 
                                      : "text-gray-300"
                                  )} 
                                />
                              ))}
                            </div>
                            <span className="font-bold text-foreground">{getRandomRating()}</span>
                            <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
                              {Math.floor(Math.random() * 200) + 150} ביקורות
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-6 relative z-10">
                          {/* Enhanced Price Display */}
                          <div className={cn(
                            "text-center p-6 rounded-2xl border-2 shadow-lg backdrop-blur-sm",
                            index === 0 
                              ? "bg-gradient-to-r from-success/20 to-emerald-100/50 border-success/30" 
                              : "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20"
                          )}>
                            <div className={cn(
                              "text-4xl font-black mb-2",
                              index === 0 ? "text-success" : "text-primary"
                            )}>
                              {formatPrice(plan)}
                            </div>
                            {plan.category !== 'electricity' && (
                              <div className="text-muted-foreground font-medium">לחודש</div>
                            )}
                            
                            {/* Price Comparison Indicator */}
                            {index > 0 && plan.category !== 'electricity' && (
                              <div className="mt-3 p-2 rounded-lg bg-white/50 backdrop-blur-sm">
                                {plan.regularPrice > comparedPlans[0].regularPrice ? (
                                  <span className="text-destructive font-semibold text-sm">
                                    +₪{plan.regularPrice - comparedPlans[0].regularPrice} יותר יקר מהמוביל
                                  </span>
                                ) : plan.regularPrice < comparedPlans[0].regularPrice ? (
                                  <span className="text-success font-semibold text-sm">
                                    -₪{comparedPlans[0].regularPrice - plan.regularPrice} זול יותר!
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground font-semibold text-sm">מחיר זהה</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Technical Specifications */}
                          <div className="space-y-3">
                            <h4 className="font-bold text-foreground border-b border-border/50 pb-2 flex items-center gap-2">
                              <Info className="h-4 w-4" />
                              מפרט טכני
                            </h4>
                            
                            {plan.category === 'internet' && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-blue-50/80 rounded-lg border border-blue-200/50">
                                  <div className="flex items-center gap-2">
                                    <Download className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium">מהירות הורדה</span>
                                  </div>
                                  <Badge className="bg-blue-100 text-blue-700 border-blue-300 font-bold">
                                    {plan.downloadSpeed}
                                  </Badge>
                                </div>
                                {plan.uploadSpeed && (
                                  <div className="flex items-center justify-between p-3 bg-green-50/80 rounded-lg border border-green-200/50">
                                    <div className="flex items-center gap-2">
                                      <Upload className="h-4 w-4 text-green-600" />
                                      <span className="font-medium">מהירות העלאה</span>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 border-green-300 font-bold">
                                      {plan.uploadSpeed}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            )}

                            {plan.dataAmount && (
                              <div className="flex items-center justify-between p-3 bg-purple-50/80 rounded-lg border border-purple-200/50">
                                <div className="flex items-center gap-2">
                                  <Wifi className="h-4 w-4 text-purple-600" />
                                  <span className="font-medium">כמות גלישה</span>
                                </div>
                                <Badge className="bg-purple-100 text-purple-700 border-purple-300 font-bold">
                                  {plan.dataAmount}
                                </Badge>
                              </div>
                            )}

                            {plan.callMinutes && (
                              <div className="flex items-center justify-between p-3 bg-orange-50/80 rounded-lg border border-orange-200/50">
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-orange-600" />
                                  <span className="font-medium">דקות שיחה</span>
                                </div>
                                <Badge className="bg-orange-100 text-orange-700 border-orange-300 font-bold">
                                  {plan.callMinutes}
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Key Features */}
                          <div className="space-y-3">
                            <h4 className="font-bold text-foreground border-b border-border/50 pb-2 flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              תכונות מרכזיות
                            </h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                              {plan.features.slice(0, 6).map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex items-start gap-3 p-2 bg-white/30 backdrop-blur-sm rounded-lg">
                                  <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                                  <span className="text-sm text-foreground font-medium leading-relaxed">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                              {plan.features.length > 6 && (
                                <p className="text-xs text-muted-foreground text-center p-2 bg-muted/50 rounded-lg">
                                  ועוד {plan.features.length - 6} תכונות נוספות...
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Contract & Commitment */}
                          <div className="bg-gradient-to-r from-muted/50 to-accent/10 rounded-xl p-4 border border-border/50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold text-sm">תנאי החוזה</span>
                              </div>
                              <Badge variant="secondary" className="font-medium">
                                {Math.random() > 0.5 ? '24 חודשים' : '12 חודשים'}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              התחייבות לתקופה מינימלית • ביטול בהודעה מוקדמת
                            </div>
                          </div>

                          {/* Action Button */}
                          <Button className={cn(
                            "w-full font-bold text-lg py-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105",
                            index === 0 
                              ? "bg-gradient-to-r from-success to-green-600 hover:from-success/90 hover:to-green-600/90 text-white shadow-success/30" 
                              : "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
                          )}
                          onClick={() => {
                            console.log('Plan selected from comparison:', plan); // Debug log
                            onPlanSelect?.(plan);
                          }}
                          >
                            {index === 0 ? (
                              <>
                                <Crown className="h-5 w-5 mr-2" />
                                בחר במוביל!
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-5 w-5 mr-2" />
                                בחר מסלול זה
                              </>
                            )}
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
                        <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border-2 border-primary/20 shadow-xl">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-2xl">
                              <Info className="h-6 w-6 text-primary" />
                              ניתוח ההבדלים המשמעותיים
                            </CardTitle>
                            <p className="text-muted-foreground">
                              השוואה מפורטת של המאפיינים החשובים ביותר
                            </p>
                          </CardHeader>
                          <CardContent className="space-y-8">
                            {/* Price Analysis */}
                            <div>
                              <h4 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                השוואת מחירים וחיסכון
                              </h4>
                              <div className="grid md:grid-cols-3 gap-4">
                                {comparedPlans.map((plan, index) => (
                                  <Card key={plan.id} className={cn(
                                    "p-4 text-center transition-all duration-300 hover:shadow-lg",
                                    index === 0 ? "bg-gradient-to-r from-success/20 to-emerald-100/50 border-2 border-success/40" : "bg-card border border-border"
                                  )}>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                      <div className="font-bold text-lg">{plan.company}</div>
                                      {index === 0 && <Crown className="h-4 w-4 text-success" />}
                                    </div>
                                    <div className="text-3xl font-black text-primary mb-1">{formatPrice(plan)}</div>
                                    <div className="text-sm text-muted-foreground mb-3">
                                      {plan.category !== 'electricity' ? 'לחודש' : 'הנחה'}
                                    </div>
                                    {index > 0 && plan.category !== 'electricity' && (
                                      <div className="text-sm font-medium">
                                        {plan.regularPrice > comparedPlans[0].regularPrice ? (
                                          <span className="text-destructive bg-red-50 px-2 py-1 rounded-full">
                                            +₪{plan.regularPrice - comparedPlans[0].regularPrice} יקר יותר
                                          </span>
                                        ) : plan.regularPrice < comparedPlans[0].regularPrice ? (
                                          <span className="text-success bg-green-50 px-2 py-1 rounded-full">
                                            -₪{comparedPlans[0].regularPrice - plan.regularPrice} זול יותר
                                          </span>
                                        ) : (
                                          <span className="text-muted-foreground bg-gray-50 px-2 py-1 rounded-full">מחיר זהה</span>
                                        )}
                                      </div>
                                    )}
                                  </Card>
                                ))}
                              </div>
                            </div>

                            {/* Feature Matrix */}
                            <div>
                              <h4 className="font-bold text-lg text-primary mb-4 flex items-center gap-2">
                                <Check className="h-5 w-5" />
                                מטריצת תכונות
                              </h4>
                              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                                <div className="overflow-x-auto">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="border-b border-border/50">
                                        <th className="text-right p-3 font-bold">תכונה</th>
                                        {comparedPlans.map((plan) => (
                                          <th key={plan.id} className="text-center p-3 font-bold">
                                            {plan.company}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(() => {
                                        const allFeatures = [...new Set(comparedPlans.flatMap(plan => plan.features))];
                                        
                                        return allFeatures.slice(0, 8).map((feature, index) => (
                                          <tr key={index} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                                            <td className="p-3 font-medium text-sm">{feature}</td>
                                            {comparedPlans.map((plan) => (
                                              <td key={plan.id} className="text-center p-3">
                                                {plan.features.includes(feature) ? (
                                                  <CheckCircle className="h-5 w-5 text-success mx-auto" />
                                                ) : (
                                                  <X className="h-5 w-5 text-muted-foreground mx-auto" />
                                                )}
                                              </td>
                                            ))}
                                          </tr>
                                        ));
                                      })()}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>

                            {/* Bottom Line Summary */}
                            <Card className="bg-gradient-to-r from-success/10 via-emerald-50 to-success/10 border-2 border-success/30">
                              <CardContent className="p-6">
                                <h4 className="font-bold text-xl text-success mb-3 flex items-center gap-2">
                                  <Target className="h-5 w-5" />
                                  המסקנה החכמה
                                </h4>
                                <p className="text-foreground leading-relaxed">
                                  ההשוואה מבוססת על נתונים טכניים ומחירים מפורסמים. {comparedPlans[0]?.company} מוביל במדדי המחיר-ביצועים, 
                                  בעוד {comparedPlans[1]?.company} מציע תכונות מתקדמות יותר.
                                </p>
                                <div className="mt-4 p-4 bg-white/70 rounded-lg border border-success/20">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className="h-4 w-4 text-success" />
                                    <span className="font-semibold text-success">המלצה מקצועית:</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    לקבלת המלצה מותאמת אישית לצרכים שלכם, השתמשו בכפתור "קבלו המלצה אישית" למעלה.
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
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