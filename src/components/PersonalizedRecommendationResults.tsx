import { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Target, Star, TrendingUp, CheckCircle, Award, Zap, Shield, ArrowRight, Brain, Crown, Plus, Wifi, Phone, Tv, Sparkles, Building2 } from "lucide-react";
import { PersonalizedRecommendation } from "@/lib/personalizedRecommendations";
import { ManualPlan } from "@/data/manual-plans";
import { cn } from "@/lib/utils";

interface PersonalizedRecommendationResultsProps {
  isOpen: boolean;
  onClose: () => void;
  recommendations: PersonalizedRecommendation[];
  plans: ManualPlan[];
  onPlanSelect: (plan: ManualPlan) => void;
}

export const PersonalizedRecommendationResults = ({
  isOpen,
  onClose,
  recommendations,
  plans,
  onPlanSelect
}: PersonalizedRecommendationResultsProps) => {
  console.log('📊 PersonalizedRecommendationResults rendering with:', {
    recommendationsCount: recommendations.length,
    plansCount: plans.length,
    uniqueCategories: [...new Set(recommendations.map(r => r.category))]
  });

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  // Group recommendations by category
  const recommendationsByCategory = useMemo(() => {
    const grouped: Record<string, { plan: ManualPlan; recommendation: PersonalizedRecommendation }[]> = {};
    
    recommendations.forEach(rec => {
      const plan = plans.find(p => p.id === rec.planId);
      if (!plan) {
        console.warn(`Plan not found for recommendation:`, rec.planId);
        return;
      }
      
      // Use the category from the recommendation itself
      const category = rec.category || plan.category;
      
      if (!grouped[category]) {
        grouped[category] = [];
      }
      
      grouped[category].push({ plan, recommendation: rec });
    });
    
    // Sort within each category by score
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => b.recommendation.personalizedScore - a.recommendation.personalizedScore);
    });
    
    console.log('Grouped recommendations by category:', Object.keys(grouped).map(cat => `${cat}: ${grouped[cat].length} plans`));
    
    return grouped;
  }, [recommendations, plans]);

  const categoryLabels: Record<string, string> = {
    electricity: 'חשמל',
    internet: 'אינטרנט',
    mobile: 'סלולר',
    tv: 'טלוויזיה'
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    electricity: <Zap className="w-5 h-5" />,
    internet: <Wifi className="w-5 h-5" />,
    mobile: <Phone className="w-5 h-5" />,
    tv: <Tv className="w-5 h-5" />
  };

  const categoryColors: Record<string, string> = {
    electricity: 'from-yellow-500 to-orange-500',
    internet: 'from-blue-500 to-cyan-500',
    mobile: 'from-green-500 to-emerald-500',
    tv: 'from-purple-500 to-pink-500'
  };

  const categories = Object.keys(recommendationsByCategory);
  const hasMultipleCategories = categories.length > 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold font-heebo">
              {hasMultipleCategories ? 'המלצות מותאמות אישית לכל סקטור' : 'המלצות מותאמות אישית'}
            </DialogTitle>
          </div>
          {hasMultipleCategories && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
              <p className="text-sm text-blue-800 font-assistant">
                <strong>מצאנו המלצות עבור {categories.length} סקטורים שבחרתם:</strong> {categories.map(cat => categoryLabels[cat]).join(', ')}
              </p>
            </div>
          )}
        </DialogHeader>

        <Separator className="mb-6" />

        {/* Render each category section */}
        {categories.map((category, categoryIndex) => {
          const categoryRecs = recommendationsByCategory[category];
          const topRec = categoryRecs[0];
          const topPlan = topRec.plan;
          const topRecommendation = topRec.recommendation;

          return (
            <div key={category} className={cn("space-y-6", categoryIndex > 0 && "mt-12 pt-8 border-t-4 border-dashed")}>
              {/* Category Header - Always visible */}
              <div className={cn(
                "bg-gradient-to-r rounded-2xl p-8 border-4 shadow-2xl relative overflow-hidden",
                categoryColors[category] || 'from-gray-500 to-gray-600'
              )}>
                {/* Decorative pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
                </div>
                
                <div className="relative z-10 flex items-center gap-5 text-white">
                  <div className="w-20 h-20 bg-white/25 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30">
                    {categoryIcons[category]}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold" style={{color: 'hsl(var(--primary))'}}>
                      {categoryRecs.length}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-4xl font-bold font-heebo mb-2 drop-shadow-lg">
                      המלצות מותאמות אישית ל{categoryLabels[category]}
                    </h2>
                    <p className="text-white/95 font-assistant text-lg backdrop-blur-sm bg-white/10 rounded-lg px-4 py-2 inline-block">
                      מצאנו {categoryRecs.length} מסלולים מתאימים עבורך בסקטור זה
                    </p>
                  </div>
                </div>
              </div>

              {/* Top Recommendation for this category */}
              <Card className="border-4 border-primary/30 bg-gradient-to-br from-primary/5 via-white to-primary/10 relative overflow-hidden shadow-2xl group hover:shadow-3xl transition-all duration-500">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
                  <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
                </div>

                {/* Category indicator badge on top-right */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge className={cn(
                    "text-white shadow-xl text-base px-5 py-2.5 bg-gradient-to-r border-0 backdrop-blur-sm transition-all duration-300 hover:scale-105",
                    categoryColors[category]
                  )}>
                    <Crown className="w-5 h-5 ml-1" />
                    ההמלצה הטובה ביותר ל{categoryLabels[category]}
                  </Badge>
                </div>
                
                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      {/* Company and Plan Name */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/30">
                            <Building2 className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold font-heebo text-foreground">
                              {topPlan.company}
                            </h3>
                            <Badge variant="outline" className="mt-1 font-assistant">
                              {categoryLabels[category]}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-lg text-muted-foreground font-assistant mr-14">
                          {topPlan.planName}
                        </p>
                      </div>
                      
                      {/* Match Score with Animation */}
                      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-transparent rounded-xl p-4 border border-primary/20">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                              <Target className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <span className="text-sm font-medium font-assistant text-muted-foreground">רמת התאמה אישית</span>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${topRecommendation.personalizedScore}%` }}
                                  />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                  {Math.round(topRecommendation.personalizedScore)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Pricing Section */}
                    <div className="text-left">
                      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border-2 border-primary/20 text-center min-w-[160px]">
                        <div className="text-sm text-muted-foreground font-assistant mb-2">מחיר חודשי</div>
                        <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-heebo">
                          ₪{topPlan.regularPrice}
                        </div>
                        <div className="text-xs text-muted-foreground font-assistant mt-1">לחודש</div>
                        {topRecommendation.expectedSavings.monthly > 0 && (
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 mt-3 px-3 py-1">
                            <TrendingUp className="w-3 h-3 ml-1" />
                            חיסכון ₪{topRecommendation.expectedSavings.monthly}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 relative z-10">
                  {/* Why This Plan Section */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-l from-primary/10 via-accent/5 to-transparent p-5 rounded-xl border-r-4 border-primary">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <h5 className="font-bold text-foreground font-heebo text-xl">
                          למה זה המסלול הנכון בשבילך ב{categoryLabels[category]}?
                        </h5>
                      </div>
                      <p className="text-sm text-muted-foreground font-assistant mr-11">
                        המערכת החכמה שלנו זיהתה <span className="font-bold text-primary">{topRecommendation.reasonsForRecommendation.length} סיבות מבוססות נתונים</span> למה מסלול זה מושלם עבורך
                      </p>
                    </div>
                    
                    {/* Key Benefits with Enhanced Design */}
                    <div className="grid gap-4">
                      {topRecommendation.reasonsForRecommendation.slice(0, 3).map((reason, index) => {
                        const benefits = [
                          { icon: TrendingUp, color: "from-green-500 to-emerald-500", textColor: "text-green-700", bg: "bg-green-50", title: "חיסכון מקסימלי", emoji: "💰" },
                          { icon: Shield, color: "from-blue-500 to-cyan-500", textColor: "text-blue-700", bg: "bg-blue-50", title: "התאמה מושלמת", emoji: "🎯" },
                          { icon: Award, color: "from-purple-500 to-pink-500", textColor: "text-purple-700", bg: "bg-purple-50", title: "יתרון תחרותי", emoji: "⭐" }
                        ];
                        const benefit = benefits[index] || benefits[0];
                        
                        return (
                          <div key={index} className={`${benefit.bg} border-2 border-current/20 rounded-xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group/benefit`}>
                            <div className="flex items-start gap-4">
                              <div className="relative">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg group-hover/benefit:scale-110 transition-transform duration-300`}>
                                  <benefit.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -left-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm border-2 border-current/20">
                                  {benefit.emoji}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`text-base font-bold ${benefit.textColor} font-heebo`}>
                                    {benefit.title}
                                  </span>
                                  <Badge variant="outline" className="text-xs font-assistant">
                                    סיבה #{index + 1}
                                  </Badge>
                                </div>
                                <p className="text-sm text-foreground/90 font-assistant leading-relaxed">
                                  {reason}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Value Proposition with Enhanced Design */}
                    <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-blue-50 border-2 border-green-300/50 rounded-xl p-5 mt-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-bold text-green-700 font-heebo text-lg">
                            התוצאה בשורה התחתונה 💎
                          </span>
                        </div>
                        <p className="text-sm text-green-800/90 font-assistant leading-relaxed mr-13">
                          בחירה במסלול זה תחסוך לך <span className="font-bold text-lg">₪{topRecommendation.expectedSavings.monthly} כל חודש</span> 
                          {topRecommendation.expectedSavings.annual > 0 && (
                            <span> ו-<span className="font-bold text-lg">₪{topRecommendation.expectedSavings.annual} בשנה</span></span>
                          )}
                          , תוך מתן שירות המותאם במדויק לצרכים שלך עם <span className="font-bold text-lg">{Math.round(topRecommendation.personalizedScore)}% התאמה אישית</span>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="space-y-3 pt-2">
                    <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border-2 border-primary/30 rounded-xl p-5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-5 h-5 text-primary" />
                          <span className="text-base font-semibold text-primary font-heebo">
                            מוכן להתחיל לחסוך ב{categoryLabels[category]}?
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-assistant mb-4">
                          לחיצה אחת תתחיל את תהליך המעבר החכם והמהיר שלך - ללא עלויות נסתרות
                        </p>
                        <Button 
                          onClick={() => onPlanSelect(topPlan)}
                          className="w-full font-heebo bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 text-base py-6 group/btn"
                          size="lg"
                        >
                          <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          בחר את המסלול הזה ב{categoryLabels[category]}
                          <Sparkles className="w-4 h-4 mr-2" />
                        </Button>
                        
                        {/* Trust Indicators */}
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-assistant">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            תהליך מהיר ופשוט
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-assistant">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            ללא עלויות נסתרות
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Recommendations for this category */}
              {categoryRecs.length > 1 && (
                <div className="space-y-4 mt-6">
                  <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                    <h3 className="text-lg font-semibold text-foreground font-heebo mb-1">
                      אפשרויות נוספות ב{categoryLabels[category]}
                    </h3>
                    <p className="text-sm text-muted-foreground font-assistant">
                      למקרה שהמלצה ראשונה לא מתאימה לך על הצד הטוב ביותר
                    </p>
                  </div>
                  
                  <div className="grid gap-4">
                    {categoryRecs.slice(1, 3).map((rec, index) => {
                      const { plan, recommendation } = rec;
                      const whyGood = recommendation.reasonsForRecommendation[0] || "מסלול איכותי עם ביצועים טובים";
                      const matchLevel = recommendation.personalizedScore >= 80 ? "התאמה מעולה" : 
                                       recommendation.personalizedScore >= 60 ? "התאמה טובה" : "התאמה בסיסית";
                      const matchColor = recommendation.personalizedScore >= 80 ? "text-green-600" : 
                                        recommendation.personalizedScore >= 60 ? "text-blue-600" : "text-orange-600";
                      
                      return (
                        <Card key={plan.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/30">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-3">
                                  <h4 className="font-bold text-foreground font-heebo text-lg">{plan.company}</h4>
                                  <Badge variant="outline" className="text-xs font-assistant">
                                    דירוג #{index + 2}
                                  </Badge>
                                </div>
                                
                                <p className="text-muted-foreground font-assistant font-medium">
                                  {plan.planName}
                                </p>
                                
                                <div className="bg-muted/50 rounded-lg p-3 border border-border/30">
                                  <p className="text-xs font-semibold text-foreground/70 mb-1 font-assistant">
                                    למה זה מתאים:
                                  </p>
                                  <p className="text-sm text-foreground/80 font-assistant">
                                    {whyGood}
                                  </p>
                                </div>
                                
                                <div className="flex gap-2 flex-wrap">
                                  <Badge className={`bg-primary/10 text-primary border-primary/20 text-xs ${matchColor}`}>
                                    {Math.round(recommendation.personalizedScore)}% • {matchLevel}
                                  </Badge>
                                  {recommendation.expectedSavings.monthly > 0 && (
                                    <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                      <TrendingUp className="w-3 h-3 ml-1" />
                                      חיסכון ₪{recommendation.expectedSavings.monthly}/חודש
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="text-center space-y-3 min-w-[120px]">
                                <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                                  <div className="text-2xl font-bold text-primary font-heebo">
                                    ₪{plan.regularPrice}
                                  </div>
                                  <div className="text-xs text-muted-foreground font-assistant">לחודש</div>
                                </div>
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onPlanSelect(plan)}
                                  className="w-full font-assistant border-primary/30 hover:bg-primary/10 hover:border-primary/50"
                                >
                                  <Plus className="w-3 h-3 ml-1" />
                                  בחר מסלול
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Final Actions */}
        <div className="mt-6 flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 font-assistant"
          >
            חזור לתוצאות
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};