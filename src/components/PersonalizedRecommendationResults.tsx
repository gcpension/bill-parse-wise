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
            {/* Key Benefits */}
            <div className="space-y-3">
              <h5 className="font-semibold text-foreground font-assistant">
                מדוע זה המסלול המתאים לך:
              </h5>
              <div className="space-y-2">
                {topRecommendation.reasonsForRecommendation.slice(0, 3).map((reason, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground font-assistant">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => onPlanSelect(topPlan)}
                className="flex-1 font-heebo bg-primary hover:bg-primary/90"
              >
                <ArrowRight className="w-4 h-4 ml-2" />
                בחר מסלול זה
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="font-assistant"
              >
                חזור לתוצאות
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Recommendations */}
        {recommendations.length > 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground font-heebo">
              אפשרויות נוספות לשיקול
            </h3>
            
            <div className="grid gap-4">
              {recommendations.slice(1, 4).map((rec, index) => {
                const plan = plans.find(p => p.id === rec.planId);
                if (!plan) return null;
                
                return (
                  <Card key={rec.planId} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-foreground font-heebo">{plan.company}</h4>
                            <Badge variant="outline" className="text-xs font-assistant">
                              #{index + 2}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground font-assistant">
                            {plan.planName}
                          </p>
                          <div className="flex gap-2">
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                              {Math.round(rec.personalizedScore)}% התאמה
                            </Badge>
                            {rec.expectedSavings.monthly > 0 && (
                              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                ₪{rec.expectedSavings.monthly} חיסכון
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-left space-y-2">
                          <div className="text-2xl font-bold text-foreground font-heebo">
                            ₪{plan.regularPrice}
                          </div>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => onPlanSelect(plan)}
                            className="font-assistant"
                          >
                            <Plus className="w-3 h-3 ml-1" />
                            בחר
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
      </DialogContent>
    </Dialog>
  );
};