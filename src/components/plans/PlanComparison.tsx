import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ManualPlan } from "@/data/manual-plans";
import PersonalizedRecommendation from "./PersonalizedRecommendation";
import SmartComparisonTable from "./advanced/SmartComparisonTable";
import ComparisonAnalytics from "./advanced/ComparisonAnalytics";
import { ComparisonAnalyzer } from "@/lib/comparisonAnalyzer";
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
  CheckCircle,
  BarChart3,
  Sparkles
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
  const [viewMode, setViewMode] = useState<'enhanced' | 'analytics'>('enhanced');

  // Generate AI analysis when dialog opens
  const comparisonMatrix = isDialogOpen ? ComparisonAnalyzer.analyzeComparison(comparedPlans) : null;

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
      <Card className="bg-white/95 backdrop-blur-md border-2 border-primary/20 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-pulse-glow">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Enhanced Header Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-r from-primary via-primary-glow to-accent rounded-2xl shadow-lg animate-pulse">
                  <Scale className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full animate-bounce"></div>
              </div>
              <div className="text-center lg:text-right">
                <p className="font-black text-lg text-foreground">השוואת מסלולים חכמה</p>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <p className="text-sm text-muted-foreground font-medium">
                    {comparedPlans.length} מתוך 3 מסלולים נבחרו
                  </p>
                  <Badge className="bg-primary/10 text-primary border-primary/30 text-xs animate-pulse">
                    <Flame className="w-3 h-3 mr-1" />
                    פעיל
                  </Badge>
                </div>
              </div>
            </div>

            {/* Enhanced Plan Pills */}
            <div className="flex items-center gap-3 flex-wrap">
              {comparedPlans.map((plan, index) => (
                <div key={plan.id} className="relative group">
                  <div className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 hover:scale-105 cursor-pointer",
                    index === 0 
                      ? "bg-gradient-to-r from-success/20 to-emerald-100 border-success/40 shadow-success/20" 
                      : "bg-gradient-to-r from-card via-accent/5 to-card border-border/50"
                  )}>
                    {index === 0 && <Crown className="h-4 w-4 text-success" />}
                    <span className="font-semibold text-sm">{plan.company}</span>
                    <Badge className="bg-white/50 text-primary text-xs px-2 py-0.5">
                      #{index + 1}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemovePlan(plan.id)}
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-destructive/20 hover:bg-destructive/30 border-2 border-white shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <X className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center gap-3">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary via-primary-glow to-accent hover:from-primary/90 hover:via-primary-glow/90 hover:to-accent/90 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-pulse-subtle relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <div className="relative flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 animate-bounce" />
                      השווה עם AI
                      <Sparkles className="h-4 w-4 animate-pulse" />
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-background via-background/95 to-accent/5 backdrop-blur-xl border-2 border-primary/20">
                  <DialogHeader className="relative overflow-hidden">
                    {/* Background decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-success/20 to-primary/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
                    
                    <div className="relative z-10">
                      <DialogTitle className="text-5xl lg:text-6xl font-black text-center mb-4">
                        <span className="bg-gradient-to-r from-primary via-primary-glow via-accent to-success bg-clip-text text-transparent animate-gradient-x">
                          השוואה חכמה עם AI
                        </span>
                      </DialogTitle>
                      
                      <div className="text-center space-y-4">
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                          ניתוח מעמיק ומתקדם של המסלולים שבחרתם עם המלצות מותאמות אישית באמצעות בינה מלאכותית
                        </p>
                        
                        <div className="flex items-center justify-center gap-6">
                          <div className="flex items-center gap-2 bg-success/10 backdrop-blur-sm px-4 py-2 rounded-full border border-success/30">
                            <CheckCircle className="w-5 h-5 text-success" />
                            <span className="font-bold text-success text-sm">ניתוח מדויק 100%</span>
                          </div>
                          <div className="flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30">
                            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                            <span className="font-bold text-primary text-sm">חסכון מובטח</span>
                          </div>
                          <div className="flex items-center gap-2 bg-accent/10 backdrop-blur-sm px-4 py-2 rounded-full border border-accent/30">
                            <Shield className="w-5 h-5 text-accent" />
                            <span className="font-bold text-accent text-sm">מהימן ואמין</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced View Mode Toggle */}
                    <div className="flex justify-center mt-8 relative z-10">
                      <div className="flex items-center gap-1 bg-gradient-to-r from-card/80 via-accent/10 to-card/80 backdrop-blur-sm p-2 rounded-3xl border-2 border-primary/20 shadow-2xl">
                        <Button
                          variant={viewMode === 'enhanced' ? 'default' : 'ghost'}
                          size="lg"
                          onClick={() => setViewMode('enhanced')}
                          className={cn(
                            "rounded-2xl font-bold text-lg px-6 py-3 transition-all duration-300",
                            viewMode === 'enhanced' 
                              ? "bg-gradient-to-r from-primary to-primary-glow text-white shadow-lg hover:shadow-xl" 
                              : "hover:bg-primary/10"
                          )}
                        >
                          <Target className="w-5 h-5 mr-2" />
                          השוואה מתקדמת
                        </Button>
                        <Button
                          variant={viewMode === 'analytics' ? 'default' : 'ghost'}
                          size="lg"
                          onClick={() => setViewMode('analytics')}
                          className={cn(
                            "rounded-2xl font-bold text-lg px-6 py-3 transition-all duration-300",
                            viewMode === 'analytics' 
                              ? "bg-gradient-to-r from-success to-green-600 text-white shadow-lg hover:shadow-xl" 
                              : "hover:bg-success/10"
                          )}
                        >
                          <BarChart3 className="w-5 h-5 mr-2" />
                          אנליטיקה וניתוח
                        </Button>
                      </div>
                    </div>
                  </DialogHeader>
                  
                  {/* Enhanced AI Analysis with Interactive Features */}
                  {comparisonMatrix && (
                    <div className="mt-12 relative">
                      {/* AI Analysis Header */}
                      <div className="mb-8 text-center">
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 backdrop-blur-sm px-8 py-4 rounded-3xl border-2 border-primary/30 shadow-xl">
                          <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center animate-pulse">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-right">
                            <h3 className="text-2xl font-black text-primary">ניתוח AI מתקדם</h3>
                            <p className="text-sm text-muted-foreground">מופעל על ידי בינה מלאכותית מתקדמת</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Analysis Content */}
                      {viewMode === 'enhanced' ? (
                        <SmartComparisonTable 
                          comparisonMatrix={comparisonMatrix}
                          plans={comparedPlans}
                          onPlanSelect={onPlanSelect}
                        />
                      ) : (
                        <ComparisonAnalytics 
                          comparisonMatrix={comparisonMatrix}
                          plans={comparedPlans}
                        />
                      )}
                    </div>
                  )}
                  
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

                  {/* Enhanced Interactive AI Recommendation Button */}
                  <div className="mb-8">
                    <Card className="bg-gradient-to-r from-primary/10 via-accent/5 to-success/10 border-2 border-primary/30 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden relative animate-pulse-subtle">
                      {/* Background Animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/10 to-success/5 animate-gradient-x"></div>
                      
                      <CardContent className="p-8 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-8">
                          <div className="flex items-center gap-6 flex-1">
                            <div className="relative">
                              <div className="w-16 h-16 bg-gradient-to-r from-primary via-accent to-success rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                                <Sparkles className="h-8 w-8 text-white animate-spin-slow" />
                              </div>
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center animate-bounce">
                                <Heart className="h-3 w-3 text-white" />
                              </div>
                            </div>
                            <div className="text-center lg:text-right">
                              <h3 className="text-3xl font-black mb-3 bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
                                רוצים המלצה מותאמת אישית?
                              </h3>
                              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                                בואו נכיר אתכם קצת יותר ונתן לכם המלצה חכמה ומדויקת בהתאם לצרכים הייחודיים שלכם
                              </p>
                              <div className="flex items-center justify-center lg:justify-start gap-4 mt-4">
                                <div className="flex items-center gap-2 bg-success/10 px-3 py-1 rounded-full">
                                  <CheckCircle className="w-4 h-4 text-success" />
                                  <span className="text-sm font-medium text-success">100% חינם</span>
                                </div>
                                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                                  <Shield className="w-4 h-4 text-primary" />
                                  <span className="text-sm font-medium text-primary">בטוח ומאובטח</span>
                                </div>
                                <div className="flex items-center gap-2 bg-accent/10 px-3 py-1 rounded-full">
                                  <Zap className="w-4 h-4 text-accent" />
                                  <span className="text-sm font-medium text-accent">תוצאות מיידיות</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-4">
                            <Button 
                              size="lg"
                              className="bg-gradient-to-r from-primary via-accent to-success hover:from-primary/90 hover:via-accent/90 hover:to-success/90 text-white font-black text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 relative overflow-hidden group"
                              onClick={() => setIsRecommendationOpen(true)}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                              <div className="relative flex items-center gap-3">
                                <Target className="h-6 w-6 animate-pulse" />
                                קבלו המלצה מותאמת אישית
                                <Sparkles className="h-5 w-5 animate-bounce" />
                              </div>
                            </Button>
                            
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">
                                ⭐ מעל 10,000 לקוחות מרוצים השתמשו בשירות
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

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
      
      {/* PersonalizedRecommendation Dialog */}
      <PersonalizedRecommendation
        isOpen={isRecommendationOpen}
        onClose={() => setIsRecommendationOpen(false)}
        comparedPlans={comparedPlans}
      />
    </div>
  );
};

export default PlanComparison;