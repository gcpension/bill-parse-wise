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
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-background border-border shadow-elegant">
        <DialogHeader className="sticky top-0 bg-card/95 backdrop-blur-sm z-10 pb-4 mb-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-card">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-foreground font-heebo">
                  ההמלצה המותאמת שלכם
                </DialogTitle>
                <p className="text-sm text-muted-foreground font-assistant mt-1">
                  מנתח אישי מתקדם • מבוסס על {recommendations.length} חלופות
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 h-8">
                <Share2 className="w-3 h-3" />
                שתף
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-8">
                <Bookmark className="w-3 h-3" />
                שמור
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 mt-2">
          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card rounded-2xl p-4 border border-border shadow-card hover:shadow-elegant transition-all duration-300">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-xl font-bold text-foreground">{Math.round(topRecommendation.personalizedScore)}%</div>
                  <div className="text-sm text-muted-foreground font-medium">ציון התאמה</div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-4 border border-border shadow-card hover:shadow-elegant transition-all duration-300">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-success" />
                <div>
                  <div className="text-xl font-bold text-foreground">₪{topRecommendation.expectedSavings.monthly}</div>
                  <div className="text-sm text-muted-foreground font-medium">חיסכון חודשי</div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-4 border border-border shadow-card hover:shadow-elegant transition-all duration-300">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-xl font-bold text-foreground">{Math.round(topRecommendation.confidenceLevel * 100)}%</div>
                  <div className="text-sm text-muted-foreground font-medium">רמת ביטחון</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Recommendation */}
          <Card className="border border-border shadow-elegant hover:shadow-glow bg-card animate-fade-in transition-all duration-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-card">
                      <Award className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-warning rounded-full flex items-center justify-center">
                      <Crown className="w-3 h-3 text-warning-foreground" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-foreground font-heebo">
                      {topPlan.planName}
                    </CardTitle>
                    <p className="text-lg text-muted-foreground font-assistant font-medium">
                      {topPlan.company}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">מותאם אישית עבורכם</span>
                    </div>
                  </div>
                </div>
                <div className="text-left bg-muted/50 rounded-2xl p-4 shadow-card border border-border">
                  <div className="text-3xl font-bold text-foreground font-heebo">
                    ₪{topPlan.regularPrice}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">לחודש</div>
                  {topPlan.introPrice && topPlan.introPrice < topPlan.regularPrice && (
                    <div className="text-xs text-success mt-1">
                      מחיר השקה: ₪{topPlan.introPrice}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Match Score */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground font-assistant">ציון התאמה</span>
                  <span className="font-bold text-primary">{Math.round(topRecommendation.personalizedScore)}%</span>
                </div>
                <Progress value={topRecommendation.personalizedScore} className="h-2" />
              </div>

              {/* Expected Savings */}
              {topRecommendation.expectedSavings.monthly > 0 && (
                <div className="flex items-center gap-3 bg-success/10 rounded-xl p-4 border border-success/20">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <div>
                    <div className="font-bold text-foreground font-heebo">
                      חיסכון צפוי: ₪{topRecommendation.expectedSavings.monthly} לחודש
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ₪{topRecommendation.expectedSavings.annual} לשנה
                    </div>
                  </div>
                </div>
              )}

              {/* Confidence & Risk */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">רמת ביטחון</div>
                    <div className="font-bold text-foreground">{Math.round(topRecommendation.confidenceLevel * 100)}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  <div>
                    <div className="text-sm text-muted-foreground">רמת סיכון</div>
                    <Badge className={getRiskColor(topRecommendation.riskLevel)} variant="secondary">
                      {topRecommendation.riskLevel === 'low' ? 'נמוך' : 
                       topRecommendation.riskLevel === 'medium' ? 'בינוני' : 'גבוה'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Reasons */}
              <div>
                <h4 className="font-bold text-foreground font-heebo mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  למה המסלול הזה מתאים לכם?
                </h4>
                <div className="space-y-2">
                  {topRecommendation.reasonsForRecommendation.slice(0, 4).map((reason, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 shrink-0"></div>
                      <span className="text-muted-foreground font-assistant">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              {topRecommendation.personalizedInsights && topRecommendation.personalizedInsights.length > 0 && (
                <div>
                  <h4 className="font-bold text-foreground font-heebo mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-warning" />
                    תובנות נוספות
                  </h4>
                  <div className="space-y-2">
                    {topRecommendation.personalizedInsights.slice(0, 3).map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 text-sm">
                        <div className="w-1.5 h-1.5 bg-warning rounded-full mt-2.5 shrink-0"></div>
                        <span className="text-muted-foreground font-assistant">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4">
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heebo text-base h-11 shadow-card hover:shadow-elegant transition-all duration-300"
                  onClick={() => {
                    onPlanSelect(topPlan);
                    onClose();
                  }}
                >
                  <Heart className="w-4 h-4 ml-2" />
                  בחר במסלול הזה
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Recommendations */}
          {recommendations.length > 1 && (
            <div>
              <h3 className="text-xl font-bold text-foreground font-heebo mb-4">
                אלטרנטיבות נוספות
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.slice(1, 3).map((rec, index) => {
                  const altPlan = plans.find(p => p.id === rec.planId);
                  if (!altPlan) return null;
                  
                  return (
                    <Card key={index} className="border border-border shadow-card hover:shadow-elegant transition-all duration-300 bg-card">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg font-heebo text-foreground">{altPlan.planName}</CardTitle>
                            <p className="text-sm text-muted-foreground">{altPlan.company}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-foreground">₪{altPlan.regularPrice}</div>
                            <div className="text-xs text-muted-foreground">לחודש</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">ציון התאמה</span>
                            <span className="font-bold text-foreground">{Math.round(rec.personalizedScore)}%</span>
                          </div>
                          <Progress value={rec.personalizedScore} className="h-2" />
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="w-full mt-3 hover:bg-muted/50 transition-colors"
                            onClick={() => {
                              onPlanSelect(altPlan);
                              onClose();
                            }}
                          >
                            בחר מסלול זה
                          </Button>
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