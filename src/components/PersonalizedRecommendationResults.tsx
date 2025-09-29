import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Target, Star, TrendingUp, CheckCircle, AlertCircle, Award, Zap, Shield, Heart, Share2, Bookmark, RefreshCw, ArrowRight, Calculator, Clock, Users, Crown } from "lucide-react";
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-success bg-success/10 border-success/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'high': return 'text-destructive bg-destructive/10 border-destructive/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-background border-none shadow-2xl rounded-2xl">
        <DialogHeader className="border-none pb-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-foreground/60" />
            </div>
            <DialogTitle className="text-4xl font-light text-foreground leading-tight">
              המסלול המתאים ביותר
            </DialogTitle>
            <p className="text-muted-foreground text-lg font-light max-w-lg mx-auto">
              מנתח מתקדם ביסס את ההמלצה על {recommendations.length} חלופות שנבדקו במיוחד עבורכם
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-12">
          {/* Minimal Stats Overview */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-3xl font-light text-foreground">{Math.round(topRecommendation.personalizedScore)}%</div>
              <div className="text-sm text-muted-foreground font-medium">התאמה אישית</div>
            </div>
            <div className="text-center space-y-2 border-x border-border/50 px-4">
              <div className="text-3xl font-light text-foreground">₪{topRecommendation.expectedSavings.monthly}</div>
              <div className="text-sm text-muted-foreground font-medium">חיסכון חודשי</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-light text-foreground">{Math.round(topRecommendation.confidenceLevel * 100)}%</div>
              <div className="text-sm text-muted-foreground font-medium">רמת ביטחון</div>
            </div>
          </div>

          {/* Elegant Main Recommendation Card */}
          <Card className="border border-border/20 bg-card shadow-xl rounded-3xl overflow-hidden max-w-4xl mx-auto">
            <CardHeader className="bg-foreground/[0.02] p-12 text-center">
              <div className="space-y-6">
                <div className="w-24 h-24 bg-foreground/5 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-12 h-12 text-foreground/60" />
                </div>
                <CardTitle className="text-5xl font-light text-foreground tracking-tight">
                  {topPlan.planName}
                </CardTitle>
                <p className="text-2xl text-muted-foreground font-light">
                  {topPlan.company}
                </p>
                <div className="pt-6">
                  <div className="text-6xl font-extralight text-foreground mb-2">
                    ₪{topPlan.regularPrice}
                  </div>
                  <div className="text-lg text-muted-foreground">לחודש</div>
                  {topPlan.introPrice && topPlan.introPrice < topPlan.regularPrice && (
                    <div className="mt-6 p-4 bg-foreground/5 rounded-2xl inline-block">
                      <div className="text-sm text-muted-foreground mb-1">מחיר השקה</div>
                      <div className="text-3xl font-light text-foreground">₪{topPlan.introPrice}</div>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-12 space-y-10">
              {/* Match Score - Minimal Design */}
              <div className="text-center py-8 border-y border-border/20">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="text-lg text-muted-foreground font-medium">דירוג התאמה אישי</div>
                  <div className="text-5xl font-light text-foreground mb-4">
                    {Math.round(topRecommendation.personalizedScore)}%
                  </div>
                  <div className="w-full bg-foreground/10 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-foreground h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${topRecommendation.personalizedScore}%` }}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">התאמה מעולה למשפחה שלכם</div>
                </div>
              </div>

              {/* Expected Savings - Minimal Design */}
              {topRecommendation.expectedSavings.monthly > 0 && (
                <div className="text-center py-8 space-y-6">
                  <div className="text-lg text-muted-foreground font-medium">החיסכון הצפוי שלכם</div>
                  <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto">
                    <div className="space-y-2">
                      <div className="text-4xl font-light text-foreground">₪{topRecommendation.expectedSavings.monthly}</div>
                      <div className="text-sm text-muted-foreground">חיסכון חודשי</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-light text-foreground">₪{topRecommendation.expectedSavings.annual}</div>
                      <div className="text-sm text-muted-foreground">חיסכון שנתי</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Trust Indicators - Minimal */}
              <div className="grid grid-cols-2 gap-8 py-8 border-y border-border/20">
                <div className="text-center space-y-3">
                  <div className="text-2xl font-light text-foreground">{Math.round(topRecommendation.confidenceLevel * 100)}%</div>
                  <div className="text-sm text-muted-foreground">רמת ביטחון</div>
                  <div className="text-xs text-muted-foreground/60">מומלץ בביטחון רב</div>
                </div>
                <div className="text-center space-y-3">
                  <div className="text-2xl font-light text-foreground">
                    {topRecommendation.riskLevel === 'low' ? 'נמוך' : 
                     topRecommendation.riskLevel === 'medium' ? 'בינוני' : 'גבוה'}
                  </div>
                  <div className="text-sm text-muted-foreground">רמת סיכון</div>
                  <div className="text-xs text-muted-foreground/60">בחירה בטוחה</div>
                </div>
              </div>

              {/* Reasons - Clean List */}
              <div className="space-y-6">
                <h4 className="text-2xl font-light text-foreground text-center">
                  למה המסלול הזה מתאים לכם?
                </h4>
                <div className="space-y-4 max-w-2xl mx-auto">
                  {topRecommendation.reasonsForRecommendation.slice(0, 4).map((reason, index) => (
                    <div key={index} className="flex items-start gap-4 py-3 border-b border-border/20 last:border-none">
                      <div className="w-6 h-6 bg-foreground/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-3 h-3 text-foreground/60" />
                      </div>
                      <span className="text-foreground/80 leading-relaxed">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights - If Available */}
              {topRecommendation.personalizedInsights && topRecommendation.personalizedInsights.length > 0 && (
                <div className="space-y-6 pt-8 border-t border-border/20">
                  <h4 className="text-2xl font-light text-foreground text-center">
                    תובנות נוספות
                  </h4>
                  <div className="space-y-3 max-w-2xl mx-auto">
                    {topRecommendation.personalizedInsights.slice(0, 3).map((insight, index) => (
                      <div key={index} className="flex items-start gap-4 py-3">
                        <div className="w-6 h-6 bg-foreground/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Zap className="w-3 h-3 text-foreground/60" />
                        </div>
                        <span className="text-foreground/70 leading-relaxed text-sm">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons - Minimal */}
              <div className="flex flex-col sm:flex-row gap-4 pt-12">
                <Button 
                  size="lg" 
                  className="flex-1 h-14 text-lg font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors duration-200 rounded-2xl"
                  onClick={() => onPlanSelect(topPlan)}
                >
                  <ArrowRight className="w-5 h-5 ml-2" />
                  בחר את המסלול הזה
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-14 px-8 font-medium border-foreground/20 hover:bg-foreground/5 transition-colors duration-200 rounded-2xl"
                  onClick={onClose}
                >
                  <RefreshCw className="w-5 h-5 ml-2" />
                  חזור לתוצאות
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Recommendations - Minimal */}
          {recommendations.length > 1 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <h3 className="text-2xl font-light text-foreground text-center">חלופות נוספות שכדאי לשקול</h3>
              <div className="grid gap-6">
                {recommendations.slice(1, 3).map((rec, index) => {
                  const plan = plans.find(p => p.id === rec.planId);
                  if (!plan) return null;
                  
                  return (
                    <Card key={rec.planId} className="border border-border/20 bg-card rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-8">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <h4 className="text-xl font-medium text-foreground">{plan.planName}</h4>
                            <p className="text-muted-foreground">{plan.company}</p>
                            <div className="text-sm text-muted-foreground">
                              התאמה: {Math.round(rec.personalizedScore)}% • חיסכון: ₪{rec.expectedSavings.monthly}/חודש
                            </div>
                          </div>
                          <div className="text-center space-y-2">
                            <div className="text-3xl font-light text-foreground">₪{plan.regularPrice}</div>
                            <div className="text-sm text-muted-foreground">לחודש</div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="mt-3 rounded-xl"
                              onClick={() => onPlanSelect(plan)}
                            >
                              בחר מסלול זה
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
      </DialogContent>
    </Dialog>
  );
};