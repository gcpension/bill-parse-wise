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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-background border border-border shadow-elegant rounded-2xl p-0">
        {/* Compact Header */}
        <div className="bg-gradient-primary text-white rounded-t-2xl p-8 text-center">
          <DialogHeader className="space-y-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-3xl font-bold text-white">
              המסלול המומלץ עבורכם
            </DialogTitle>
            <p className="text-white/90 text-sm">
              נבחר מתוך {recommendations.length} אפשרויות
            </p>
          </DialogHeader>
        </div>

        {/* Compact Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 -mt-4 relative z-10">
          <div className="bg-card rounded-xl p-4 shadow-card text-center">
            <div className="text-2xl font-bold text-primary">{Math.round(topRecommendation.personalizedScore)}%</div>
            <div className="text-xs text-muted-foreground">התאמה</div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card text-center">
            <div className="text-2xl font-bold text-success">₪{topRecommendation.expectedSavings.monthly}</div>
            <div className="text-xs text-muted-foreground">חיסכון חודשי</div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card text-center">
            <div className="text-2xl font-bold text-primary">{Math.round(topRecommendation.confidenceLevel * 100)}%</div>
            <div className="text-xs text-muted-foreground">ביטחון</div>
          </div>
        </div>

        {/* Main Plan Card */}
        <div className="px-6 pb-6">
          <Card className="border border-border/20 bg-card shadow-card rounded-2xl overflow-hidden">
            <CardContent className="p-8 text-center space-y-6">
              {/* Plan Header */}
              <div className="space-y-3">
                <Award className="w-12 h-12 text-primary mx-auto" />
                <h2 className="text-4xl font-bold text-foreground">{topPlan.planName}</h2>
                <p className="text-xl text-muted-foreground">{topPlan.company}</p>
                <div className="text-5xl font-bold text-primary">₪{topPlan.regularPrice}</div>
                <div className="text-sm text-muted-foreground">לחודש</div>
                {topPlan.introPrice && topPlan.introPrice < topPlan.regularPrice && (
                  <div className="inline-block bg-success/10 border border-success/20 rounded-xl p-3">
                    <div className="text-xs text-success">מחיר השקה</div>
                    <div className="text-2xl font-bold text-success">₪{topPlan.introPrice}</div>
                  </div>
                )}
              </div>

              {/* Quick Benefits */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <div className="text-lg font-bold text-primary">{Math.round(topRecommendation.personalizedScore)}%</div>
                  <div className="text-xs text-muted-foreground">התאמה אישית</div>
                  <div className="w-full bg-primary/20 h-1 rounded-full mt-2">
                    <div 
                      className="bg-primary h-full rounded-full transition-all duration-1000"
                      style={{ width: `${topRecommendation.personalizedScore}%` }}
                    />
                  </div>
                </div>
                <div className="bg-success/5 rounded-xl p-4 border border-success/20">
                  <div className="text-lg font-bold text-success">₪{topRecommendation.expectedSavings.annual}</div>
                  <div className="text-xs text-muted-foreground">חיסכון שנתי</div>
                  <div className="flex justify-center mt-2">
                    <TrendingUp className="w-4 h-4 text-success" />
                  </div>
                </div>
              </div>

              {/* Key Reasons */}
              <div className="space-y-3 pt-4 border-t border-border/20">
                <h4 className="text-lg font-bold text-foreground">למה זה מתאים לכם?</h4>
                <div className="space-y-2">
                  {topRecommendation.reasonsForRecommendation.slice(0, 3).map((reason, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/80">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  size="lg" 
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold"
                  onClick={() => onPlanSelect(topPlan)}
                >
                  <ArrowRight className="w-4 h-4 ml-2" />
                  בחר מסלול זה
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-6 border-border hover:bg-muted rounded-xl"
                  onClick={onClose}
                >
                  <RefreshCw className="w-4 h-4 ml-2" />
                  חזור
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Options - Compact */}
          {recommendations.length > 1 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-bold text-foreground text-center">אפשרויות נוספות</h3>
              <div className="space-y-3">
                {recommendations.slice(1, 2).map((rec) => {
                  const plan = plans.find(p => p.id === rec.planId);
                  if (!plan) return null;
                  
                  return (
                    <Card key={rec.planId} className="border border-border/20 bg-card rounded-xl">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="font-bold text-foreground">{plan.planName}</h4>
                            <p className="text-sm text-muted-foreground">{plan.company}</p>
                            <div className="flex gap-2 text-xs">
                              <span className="bg-primary/10 px-2 py-1 rounded text-primary">
                                {Math.round(rec.personalizedScore)}% התאמה
                              </span>
                              <span className="bg-success/10 px-2 py-1 rounded text-success">
                                ₪{rec.expectedSavings.monthly} חיסכון
                              </span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">₪{plan.regularPrice}</div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="mt-2 text-xs"
                              onClick={() => onPlanSelect(plan)}
                            >
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
        </div>
      </DialogContent>
    </Dialog>
  );
};