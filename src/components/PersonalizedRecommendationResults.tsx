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
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-background via-background/95 to-primary/5 border-2 border-primary/20 shadow-glow rounded-3xl">
        <DialogHeader className="sticky top-0 bg-gradient-to-r from-card/95 via-background/95 to-card/95 backdrop-blur-xl z-10 pb-6 mb-8 border-b border-primary/20 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-3xl flex items-center justify-center shadow-glow animate-pulse">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-warning to-warning/80 rounded-full flex items-center justify-center shadow-md">
                  <Star className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  המסלול המתאים ביותר עבורכם
                </DialogTitle>
                <p className="text-lg text-muted-foreground font-medium">
                  ✨ מנתח חכם מתקדם • מבוסס על {recommendations.length} חלופות מותאמות אישית
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-gradient-to-r from-success to-success/80 text-white font-medium px-3 py-1">
                    <Target className="w-3 h-3 ml-1" />
                    מותאם אישית
                  </Badge>
                  <Badge className="bg-gradient-to-r from-primary to-accent text-white font-medium px-3 py-1">
                    <Shield className="w-3 h-3 ml-1" />
                    רמת דיוק {Math.round(topRecommendation.confidenceLevel * 100)}%
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 h-10 px-4 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 hover:scale-105">
                <Share2 className="w-4 h-4" />
                שתף
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-10 px-4 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 hover:scale-105">
                <Bookmark className="w-4 h-4" />
                שמור
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-10 mt-4">
          {/* Enhanced Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-3xl p-6 border-2 border-primary/20 shadow-glow hover:shadow-elegant transition-all duration-500 hover:scale-105 group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{Math.round(topRecommendation.personalizedScore)}%</div>
                  <div className="text-sm text-muted-foreground font-semibold">ציון התאמה אישי</div>
                  <div className="text-xs text-primary font-medium mt-1">מותאם במיוחד עבורכם</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-success/10 via-success/5 to-background rounded-3xl p-6 border-2 border-success/20 shadow-glow hover:shadow-elegant transition-all duration-500 hover:scale-105 group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-success to-success/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-success">₪{topRecommendation.expectedSavings.monthly}</div>
                  <div className="text-sm text-muted-foreground font-semibold">חיסכון חודשי</div>
                  <div className="text-xs text-success font-medium mt-1">₪{topRecommendation.expectedSavings.annual} לשנה</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-warning/10 via-warning/5 to-background rounded-3xl p-6 border-2 border-warning/20 shadow-glow hover:shadow-elegant transition-all duration-500 hover:scale-105 group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-warning to-warning/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-warning">{Math.round(topRecommendation.confidenceLevel * 100)}%</div>
                  <div className="text-sm text-muted-foreground font-semibold">רמת ביטחון</div>
                  <div className="text-xs text-warning font-medium mt-1">אמינות גבוהה</div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Top Recommendation */}
          <Card className="border-3 border-primary/30 bg-gradient-to-br from-card via-background/50 to-primary/5 shadow-glow hover:shadow-elegant animate-fade-in transition-all duration-700 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-50"></div>
            <CardHeader className="relative z-10 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-20 h-20 bg-gradient-to-r from-warning to-warning/80 rounded-3xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-500">
                      <Award className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {topPlan.planName}
                    </CardTitle>
                    <p className="text-xl text-muted-foreground font-semibold">
                      {topPlan.company}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1.5">
                        <Star className="w-4 h-4 text-primary" />
                        <span className="text-sm text-primary font-bold">בחירה מושכלת</span>
                      </div>
                      <div className="flex items-center gap-2 bg-success/10 rounded-full px-3 py-1.5">
                        <Users className="w-4 h-4 text-success" />
                        <span className="text-sm text-success font-medium">מותאם למשפחה שלכם</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center bg-gradient-to-br from-muted/80 to-muted/60 rounded-3xl p-6 shadow-glow border-2 border-primary/20 min-w-[200px]">
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">
                    ₪{topPlan.regularPrice}
                  </div>
                  <div className="text-sm text-muted-foreground font-semibold">לחודש</div>
                  {topPlan.introPrice && topPlan.introPrice < topPlan.regularPrice && (
                    <div className="mt-2 p-2 bg-success/10 rounded-xl border border-success/20">
                      <div className="text-xs text-success font-bold">מחיר השקה מיוחד</div>
                      <div className="text-lg font-bold text-success">₪{topPlan.introPrice}</div>
                    </div>
                  )}
                  <div className="mt-3 text-xs text-primary font-medium">⚡ מחיר מיוחד עבורכם</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 relative z-10">
              {/* Enhanced Match Score */}
              <div className="space-y-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-foreground">דירוג התאמה אישי</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {Math.round(topRecommendation.personalizedScore)}%
                    </div>
                    <div className="text-sm text-success font-medium">התאמה מעולה!</div>
                  </div>
                </div>
                <Progress value={topRecommendation.personalizedScore} className="h-4 bg-muted/30" />
              </div>

              {/* Enhanced Expected Savings */}
              {topRecommendation.expectedSavings.monthly > 0 && (
                <div className="bg-gradient-to-r from-success/10 via-success/5 to-transparent rounded-2xl p-6 border-2 border-success/30 shadow-glow">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-success to-success/80 rounded-2xl flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-success mb-2">💰 החיסכון שלכם</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center bg-white/50 rounded-xl p-3 border border-success/20">
                          <div className="text-2xl font-bold text-success">₪{topRecommendation.expectedSavings.monthly}</div>
                          <div className="text-sm text-muted-foreground font-medium">חיסכון חודשי</div>
                        </div>
                        <div className="text-center bg-white/50 rounded-xl p-3 border border-success/20">
                          <div className="text-2xl font-bold text-success">₪{topRecommendation.expectedSavings.annual}</div>
                          <div className="text-sm text-muted-foreground font-medium">חיסכון שנתי</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Trust Indicators */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 border border-primary/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-8 h-8 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground font-medium">רמת ביטחון</div>
                      <div className="text-2xl font-bold text-primary">{Math.round(topRecommendation.confidenceLevel * 100)}%</div>
                    </div>
                  </div>
                  <div className="text-xs text-primary font-medium bg-primary/10 rounded-lg px-2 py-1 inline-block">
                    ✓ מומלץ בביטחון רב
                  </div>
                </div>
                <div className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-2xl p-5 border border-warning/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertCircle className="w-8 h-8 text-warning" />
                    <div>
                      <div className="text-sm text-muted-foreground font-medium">רמת סיכון</div>
                      <Badge className={`${getRiskColor(topRecommendation.riskLevel)} text-base font-bold px-3 py-1`} variant="secondary">
                        {topRecommendation.riskLevel === 'low' ? '🟢 נמוך' : 
                         topRecommendation.riskLevel === 'medium' ? '🟡 בינוני' : '🔴 גבוה'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-warning font-medium bg-warning/10 rounded-lg px-2 py-1 inline-block">
                    ⚡ בחירה בטוחה
                  </div>
                </div>
              </div>

              {/* Enhanced Reasons */}
              <div className="bg-gradient-to-r from-card to-muted/30 rounded-2xl p-6 border border-border/50">
                <h4 className="text-xl font-bold text-foreground mb-5 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-success to-success/80 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  💡 למה המסלול הזה מושלם עבורכם?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topRecommendation.reasonsForRecommendation.slice(0, 4).map((reason, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white/50 rounded-xl border border-success/20 hover:shadow-md transition-all duration-300">
                      <div className="w-6 h-6 bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-foreground font-medium leading-relaxed">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Insights */}
              {topRecommendation.personalizedInsights && topRecommendation.personalizedInsights.length > 0 && (
                <div className="bg-gradient-to-r from-warning/5 to-accent/5 rounded-2xl p-6 border border-warning/20">
                  <h4 className="text-xl font-bold text-foreground mb-5 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-warning to-warning/80 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    ⚡ תובנות חכמות נוספות
                  </h4>
                  <div className="space-y-3">
                    {topRecommendation.personalizedInsights.slice(0, 3).map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/50 rounded-xl border border-warning/20 hover:shadow-md transition-all duration-300">
                        <div className="w-6 h-6 bg-gradient-to-r from-warning to-warning/80 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-foreground font-medium leading-relaxed">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Premium Action Button */}
              <div className="pt-6">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold text-lg h-14 shadow-glow hover:shadow-elegant transition-all duration-500 hover:scale-105 rounded-2xl"
                  onClick={() => {
                    onPlanSelect(topPlan);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5" />
                    <span>בחר במסלול המומלץ הזה</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-3">
                  ⚡ אפשרות מעבר מהיר וללא טרחה
                </p>
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