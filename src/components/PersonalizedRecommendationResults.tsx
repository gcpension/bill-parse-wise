import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Target, Star, TrendingUp, CheckCircle, Award, Zap, Shield, ArrowRight, Brain, Crown, Plus } from "lucide-react";
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
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const topRecommendation = recommendations[0];
  const topPlan = plans.find(p => p.id === topRecommendation.planId);

  if (!topPlan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold font-heebo">
              המלצות מותאמות אישית
            </DialogTitle>
          </div>
          <p className="text-muted-foreground font-assistant">
            מתוך {recommendations.length} תוכניות שנותחו
          </p>
        </DialogHeader>

        <Separator className="mb-6" />

        {/* Top Recommendation */}
        <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden">
          <div className="absolute -top-3 -right-3">
            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
              <Crown className="w-4 h-4 ml-1" />
              המלצה מובילה
            </Badge>
          </div>
          
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-xl font-bold font-heebo">
                  {topPlan.company}
                </CardTitle>
                <p className="text-lg text-muted-foreground font-assistant">
                  {topPlan.planName}
                </p>
                
                {/* Match Score */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium font-assistant">התאמה:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${topRecommendation.personalizedScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {Math.round(topRecommendation.personalizedScore)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-left">
                <div className="text-3xl font-bold text-primary font-heebo">
                  ₪{topPlan.regularPrice}
                </div>
                <div className="text-sm text-muted-foreground font-assistant">לחודש</div>
                {topRecommendation.expectedSavings.monthly > 0 && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 mt-2">
                    <TrendingUp className="w-3 h-3 ml-1" />
                    חיסכון ₪{topRecommendation.expectedSavings.monthly}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Key Benefits - Enhanced */}
            <div className="space-y-4">
              <div className="bg-gradient-to-l from-primary/10 to-transparent p-4 rounded-lg border-r-4 border-primary">
                <h5 className="font-bold text-foreground font-heebo text-lg mb-1">
                  למה זה המסלול הנכון בשבילך?
                </h5>
                <p className="text-sm text-muted-foreground font-assistant">
                  המערכת שלנו זיהתה {topRecommendation.reasonsForRecommendation.length} סיבות חזקות
                </p>
              </div>
              
              <div className="grid gap-3">
                {topRecommendation.reasonsForRecommendation.slice(0, 3).map((reason, index) => {
                  const benefits = [
                    { icon: TrendingUp, color: "text-green-600", bg: "bg-green-50", title: "חיסכון מקסימלי" },
                    { icon: Shield, color: "text-blue-600", bg: "bg-blue-50", title: "התאמה מושלמת" },
                    { icon: Award, color: "text-purple-600", bg: "bg-purple-50", title: "יתרון תחרותי" }
                  ];
                  const benefit = benefits[index] || benefits[0];
                  
                  return (
                    <div key={index} className={`${benefit.bg} border border-current/20 rounded-lg p-4 hover:shadow-md transition-all duration-300`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${benefit.bg} ${benefit.color} border border-current/20`}>
                          <benefit.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-bold ${benefit.color} font-heebo`}>
                              {benefit.title}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              #{index + 1}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground/80 font-assistant leading-relaxed">
                            {reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Value Proposition */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200/50 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-green-700 font-heebo">
                    התוצאה בשורה התחתונה
                  </span>
                </div>
                <p className="text-sm text-green-700/80 font-assistant">
                  בחירה במסלול זה תחסוך לך <span className="font-bold">₪{topRecommendation.expectedSavings.monthly} כל חודש</span> 
                  {topRecommendation.expectedSavings.annual > 0 && (
                    <span> ו<span className="font-bold">₪{topRecommendation.expectedSavings.annual} בשנה</span></span>
                  )}
                  , תוך מתן שירות המותאם לצרכים שלך ב<span className="font-bold">{Math.round(topRecommendation.personalizedScore)}% התאמה</span>.
                </p>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="space-y-3 pt-4">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary font-heebo">
                    מוכן להתחיל לחסוך?
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-assistant mb-3">
                  לחיצה אחת תתחיל את תהליך המעבר החכם שלך
                </p>
                <Button 
                  onClick={() => onPlanSelect(topPlan)}
                  className="w-full font-heebo bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  <ArrowRight className="w-5 h-5 ml-2" />
                  בחר את המסלול הזה ותתחיל לחסוך
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="flex-1 font-assistant"
                  size="sm"
                >
                  חזור לתוצאות
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex-1 font-assistant text-muted-foreground"
                  size="sm"
                >
                  <Target className="w-4 h-4 ml-1" />
                  השווה עם אחרים
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Recommendations - Enhanced */}
        {recommendations.length > 1 && (
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <h3 className="text-lg font-semibold text-foreground font-heebo mb-1">
                אפשרויות נוספות שכדאי לשקול
              </h3>
              <p className="text-sm text-muted-foreground font-assistant">
                למקרה שהמלצה ראשונה לא מתאימה לך על הצד הטוב ביותר
              </p>
            </div>
            
            <div className="grid gap-4">
              {recommendations.slice(1, 3).map((rec, index) => {
                const plan = plans.find(p => p.id === rec.planId);
                if (!plan) return null;
                
                const whyGood = rec.reasonsForRecommendation[0] || "מסלול איכותי עם ביצועים טובים";
                const matchLevel = rec.personalizedScore >= 80 ? "התאמה מעולה" : 
                                 rec.personalizedScore >= 60 ? "התאמה טובה" : "התאמה בסיסית";
                const matchColor = rec.personalizedScore >= 80 ? "text-green-600" : 
                                  rec.personalizedScore >= 60 ? "text-blue-600" : "text-orange-600";
                
                return (
                  <Card key={rec.planId} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/30">
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
                              {Math.round(rec.personalizedScore)}% • {matchLevel}
                            </Badge>
                            {rec.expectedSavings.monthly > 0 && (
                              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                <TrendingUp className="w-3 h-3 ml-1" />
                                חיסכון ₪{rec.expectedSavings.monthly}/חודש
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
            
            {recommendations.length > 3 && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm" className="font-assistant text-muted-foreground">
                  <Plus className="w-4 h-4 ml-1" />
                  ראה עוד {recommendations.length - 3} מסלולים
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};