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
            {/* Interactive Plan Header */}
            <div className="bg-gradient-primary text-white rounded-t-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-mesh opacity-10"></div>
              <div className="relative z-10 space-y-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-bounce-gentle backdrop-blur-sm border border-white/30">
                  <Award className="w-12 h-12 text-white animate-pulse-glow" />
                </div>
                <CardTitle className="text-6xl font-bold text-white tracking-tight animate-shimmer-text bg-gradient-to-r from-white via-primary-glow to-white bg-clip-text">
                  {topPlan.planName}
                </CardTitle>
                <p className="text-2xl text-white/90 font-semibold">
                  {topPlan.company}
                </p>
                <div className="pt-6">
                  <div className="text-8xl font-bold text-white mb-2 animate-pulse-glow">
                    ₪{topPlan.regularPrice}
                  </div>
                  <div className="text-xl text-white/80">לחודש</div>
                  {topPlan.introPrice && topPlan.introPrice < topPlan.regularPrice && (
                    <div className="mt-6 p-6 bg-white/20 rounded-3xl inline-block backdrop-blur-sm border border-white/30 hover-scale">
                      <div className="text-sm text-white/90 mb-1 font-semibold">מחיר השקה מיוחד</div>
                      <div className="text-4xl font-bold text-white">₪{topPlan.introPrice}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <CardContent className="p-12 space-y-12">
              {/* Interactive Score Display */}
              <div className="text-center py-8 bg-gradient-card rounded-3xl border border-border/20">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="text-xl text-muted-foreground font-bold">דירוג התאמה אישי</div>
                  <div className="relative">
                    <div className="text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 animate-scale-in">
                      {Math.round(topRecommendation.personalizedScore)}%
                    </div>
                    <div className="flex justify-center space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "w-6 h-6 transition-all duration-300 hover-scale",
                            i < Math.round(topRecommendation.personalizedScore / 20) 
                              ? "text-primary fill-primary animate-bounce-gentle" 
                              : "text-muted-foreground"
                          )} 
                          style={{ animationDelay: `${i * 0.1}s` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-primary h-full rounded-full transition-all duration-2000 ease-out animate-pulse-glow"
                      style={{ width: `${topRecommendation.personalizedScore}%` }}
                    />
                  </div>
                  <div className="text-muted-foreground font-semibold">התאמה מעולה למשפחה שלכם</div>
                </div>
              </div>

              {/* Savings Showcase */}
              {topRecommendation.expectedSavings.monthly > 0 && (
                <div className="bg-success/5 rounded-3xl p-8 border border-success/20">
                  <div className="text-center space-y-6">
                    <div className="text-xl text-success font-bold flex items-center justify-center gap-2">
                      <TrendingUp className="w-6 h-6" />
                      החיסכון הצפוי שלכם
                    </div>
                    <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto">
                      <div className="bg-white rounded-2xl p-6 shadow-card hover-scale transition-all duration-300">
                        <div className="text-5xl font-bold text-success mb-2">₪{topRecommendation.expectedSavings.monthly}</div>
                        <div className="text-muted-foreground font-semibold">חיסכון חודשי</div>
                      </div>
                      <div className="bg-white rounded-2xl p-6 shadow-card hover-scale transition-all duration-300">
                        <div className="text-5xl font-bold text-success mb-2">₪{topRecommendation.expectedSavings.annual}</div>
                        <div className="text-muted-foreground font-semibold">חיסכון שנתי</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-primary/5 rounded-3xl p-8 text-center border border-primary/20 hover-scale transition-all duration-300">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-4 animate-bounce-gentle" />
                  <div className="text-4xl font-bold text-primary mb-2">{Math.round(topRecommendation.confidenceLevel * 100)}%</div>
                  <div className="text-muted-foreground font-semibold">רמת ביטחון</div>
                  <div className="text-sm text-muted-foreground/60 mt-2">מומלץ בביטחון רב</div>
                </div>
                <div className="bg-warning/5 rounded-3xl p-8 text-center border border-warning/20 hover-scale transition-all duration-300">
                  <Heart className="w-12 h-12 text-warning mx-auto mb-4 animate-bounce-gentle" />
                  <div className="text-4xl font-bold text-warning mb-2">
                    {topRecommendation.riskLevel === 'low' ? 'נמוך' : 
                     topRecommendation.riskLevel === 'medium' ? 'בינוני' : 'גבוה'}
                  </div>
                  <div className="text-muted-foreground font-semibold">רמת סיכון</div>
                  <div className="text-sm text-muted-foreground/60 mt-2">בחירה בטוחה</div>
                </div>
              </div>

              {/* Reasons - Interactive */}
              <div className="space-y-6">
                <h4 className="text-3xl font-bold text-foreground text-center flex items-center justify-center gap-3">
                  <Target className="w-8 h-8 text-primary animate-spin-slow" />
                  למה המסלול הזה מתאים לכם?
                </h4>
                <div className="space-y-4 max-w-3xl mx-auto">
                  {topRecommendation.reasonsForRecommendation.slice(0, 4).map((reason, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border/20 hover:shadow-glow transition-all duration-300 hover-scale animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-foreground font-medium leading-relaxed text-lg">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              {topRecommendation.personalizedInsights && topRecommendation.personalizedInsights.length > 0 && (
                <div className="space-y-6 pt-8 border-t border-border/20">
                  <h4 className="text-3xl font-bold text-foreground text-center flex items-center justify-center gap-3">
                    <Zap className="w-8 h-8 text-primary animate-pulse-glow" />
                    תובנות נוספות
                  </h4>
                  <div className="space-y-4 max-w-3xl mx-auto">
                    {topRecommendation.personalizedInsights.slice(0, 3).map((insight, index) => (
                      <div 
                        key={index} 
                        className="flex items-start gap-4 p-4 bg-accent/10 rounded-2xl border border-accent/20 hover-scale transition-all duration-300"
                      >
                        <div className="w-6 h-6 bg-accent/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Zap className="w-4 h-4 text-accent-foreground" />
                        </div>
                        <span className="text-foreground/80 leading-relaxed">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 pt-12">
                <Button 
                  size="lg" 
                  className="flex-1 h-16 text-xl font-bold bg-gradient-primary text-white hover:bg-gradient-primary/90 hover-scale transition-all duration-300 rounded-3xl shadow-glow"
                  onClick={() => onPlanSelect(topPlan)}
                >
                  <ArrowRight className="w-6 h-6 ml-3" />
                  בחר את המסלול הזה
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-16 px-12 font-bold border-2 border-primary/30 hover:bg-primary/10 hover-scale transition-all duration-300 rounded-3xl"
                  onClick={onClose}
                >
                  <RefreshCw className="w-6 h-6 ml-3" />
                  חזור לתוצאות
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Additional Recommendations */}
          {recommendations.length > 1 && (
            <div className="space-y-8 max-w-5xl mx-auto">
              <h3 className="text-3xl font-bold text-foreground text-center flex items-center justify-center gap-3">
                <Users className="w-8 h-8 text-primary animate-bounce-gentle" />
                חלופות נוספות שכדאי לשקול
              </h3>
              <div className="grid gap-6">
                {recommendations.slice(1, 3).map((rec, index) => {
                  const plan = plans.find(p => p.id === rec.planId);
                  if (!plan) return null;
                  
                  return (
                    <Card key={rec.planId} className="border-2 border-border/20 bg-gradient-card rounded-3xl overflow-hidden hover:shadow-glow hover-scale transition-all duration-300 group">
                      <CardContent className="p-8">
                        <div className="flex items-center justify-between">
                          <div className="space-y-4">
                            <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{plan.planName}</h4>
                            <p className="text-lg text-muted-foreground font-semibold">{plan.company}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                <span className="text-primary font-bold">התאמה: {Math.round(rec.personalizedScore)}%</span>
                              </div>
                              <div className="bg-success/10 px-3 py-1 rounded-full border border-success/20">
                                <span className="text-success font-bold">חיסכון: ₪{rec.expectedSavings.monthly}/חודש</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-center space-y-4">
                            <div className="text-5xl font-bold text-primary">₪{plan.regularPrice}</div>
                            <div className="text-lg text-muted-foreground font-semibold">לחודש</div>
                            <Button 
                              variant="outline" 
                              size="lg"
                              className="mt-4 rounded-2xl border-2 border-primary/30 hover:bg-primary/10 hover-scale transition-all duration-300 font-bold"
                              onClick={() => onPlanSelect(plan)}
                            >
                              <Calculator className="w-5 h-5 ml-2" />
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