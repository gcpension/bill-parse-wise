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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-background border-none shadow-elegant rounded-3xl p-0">
        {/* Sophisticated Header */}
        <div className="relative bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90 text-background rounded-t-3xl px-12 py-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <DialogHeader className="relative z-10 space-y-8">
            <div className="relative">
              <div className="w-24 h-24 bg-background/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-background/20 shadow-lg">
                <Crown className="w-12 h-12 text-background drop-shadow-sm" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full opacity-80"></div>
            </div>
            <div className="space-y-3">
              <DialogTitle className="text-4xl font-light text-background tracking-tight leading-tight">
                המסלול המותאם
                <span className="block text-5xl font-bold mt-2">במיוחד עבורכם</span>
              </DialogTitle>
              <div className="w-24 h-0.5 bg-background/30 mx-auto rounded-full"></div>
              <p className="text-background/80 text-lg font-light max-w-md mx-auto leading-relaxed">
                מתוך {recommendations.length} תוכניות שנותחו במדויק
              </p>
            </div>
          </DialogHeader>
        </div>

        {/* Floating Stats Cards */}
        <div className="grid grid-cols-3 gap-6 px-8 -mt-12 relative z-20">
          {[
            { value: `${Math.round(topRecommendation.personalizedScore)}%`, label: "התאמה אישית", icon: Target },
            { value: `₪${topRecommendation.expectedSavings.monthly}`, label: "חיסכון חודשי", icon: TrendingUp },
            { value: `${Math.round(topRecommendation.confidenceLevel * 100)}%`, label: "רמת ביטחון", icon: Shield }
          ].map((stat, index) => (
            <div key={index} className="bg-card rounded-2xl p-6 shadow-elegant border border-border/10 hover:shadow-glow transition-all duration-500 hover:-translate-y-1">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Elegant Main Plan Showcase */}
        <div className="px-8 py-12">
          <Card className="border-none bg-gradient-to-br from-card to-card/50 shadow-elegant rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.02] to-transparent"></div>
            <CardContent className="relative p-12 text-center space-y-10">
              
              {/* Plan Identity */}
              <div className="space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <Award className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-card"></div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-5xl font-bold text-foreground tracking-tight leading-none">
                    {topPlan.planName}
                  </h2>
                  <p className="text-2xl text-muted-foreground font-light tracking-wide">
                    {topPlan.company}
                  </p>
                </div>

                {/* Price Display */}
                <div className="relative">
                  <div className="text-6xl font-light text-primary tracking-tight">
                    ₪{topPlan.regularPrice}
                  </div>
                  <div className="text-lg text-muted-foreground font-medium mt-1">לחודש</div>
                  {topPlan.introPrice && topPlan.introPrice < topPlan.regularPrice && (
                    <div className="mt-6 inline-block">
                      <div className="bg-success/5 border border-success/20 rounded-2xl px-6 py-4 shadow-sm">
                        <div className="text-sm text-success font-semibold mb-1">מחיר השקה מיוחד</div>
                        <div className="text-3xl font-bold text-success">₪{topPlan.introPrice}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{Math.round(topRecommendation.personalizedScore)}%</span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "w-4 h-4 transition-colors duration-300",
                              i < Math.round(topRecommendation.personalizedScore / 20) 
                                ? "text-primary fill-primary" 
                                : "text-muted"
                            )} 
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">התאמה אישית מושלמת</div>
                    <div className="w-full bg-primary/20 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-2000 ease-out"
                        style={{ width: `${topRecommendation.personalizedScore}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-success/5 rounded-2xl p-6 border border-success/10 shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-success">₪{topRecommendation.expectedSavings.annual}</span>
                      <TrendingUp className="w-5 h-5 text-success" />
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">חיסכון שנתי צפוי</div>
                    <div className="text-xs text-success bg-success/10 px-3 py-1 rounded-full inline-block">
                      ₪{topRecommendation.expectedSavings.monthly} לחודש
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="space-y-6 pt-6 border-t border-border/20">
                <h4 className="text-2xl font-bold text-foreground">מדוע זה הבחירה הנכונה?</h4>
                <div className="space-y-4 max-w-3xl mx-auto">
                  {topRecommendation.reasonsForRecommendation.slice(0, 3).map((reason, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl border border-border/10 hover:bg-muted/50 transition-all duration-300"
                    >
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground/90 leading-relaxed font-medium">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sophisticated Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 max-w-2xl mx-auto">
                <Button 
                  size="lg" 
                  className="flex-1 h-14 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 rounded-2xl shadow-card transition-all duration-300 hover:shadow-elegant hover:-translate-y-0.5"
                  onClick={() => onPlanSelect(topPlan)}
                >
                  <ArrowRight className="w-5 h-5 ml-3" />
                  בחר את המסלול הזה
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-14 px-8 font-semibold border-2 border-border/20 hover:bg-muted/50 rounded-2xl transition-all duration-300 hover:border-border/40"
                  onClick={onClose}
                >
                  <RefreshCw className="w-5 h-5 ml-3" />
                  חזור לתוצאות
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Recommendations */}
          {recommendations.length > 1 && (
            <div className="mt-12 space-y-6">
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold text-foreground">אפשרויות נוספות לשיקול</h3>
                <div className="w-16 h-0.5 bg-border mx-auto rounded-full"></div>
              </div>
              
              <div className="space-y-4">
                {recommendations.slice(1, 2).map((rec) => {
                  const plan = plans.find(p => p.id === rec.planId);
                  if (!plan) return null;
                  
                  return (
                    <Card key={rec.planId} className="border border-border/20 bg-card rounded-2xl shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-0.5">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-3">
                            <h4 className="text-xl font-bold text-foreground">{plan.planName}</h4>
                            <p className="text-muted-foreground font-medium">{plan.company}</p>
                            <div className="flex gap-3">
                              <div className="bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
                                <span className="text-primary font-semibold text-sm">
                                  {Math.round(rec.personalizedScore)}% התאמה
                                </span>
                              </div>
                              <div className="bg-success/10 px-3 py-1 rounded-lg border border-success/20">
                                <span className="text-success font-semibold text-sm">
                                  ₪{rec.expectedSavings.monthly} חיסכון
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-center space-y-3">
                            <div className="text-3xl font-bold text-primary">₪{plan.regularPrice}</div>
                            <div className="text-sm text-muted-foreground">לחודש</div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-primary/30 hover:bg-primary/10 rounded-xl font-semibold transition-all duration-300"
                              onClick={() => onPlanSelect(plan)}
                            >
                              <Calculator className="w-4 h-4 ml-2" />
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
      </DialogContent>
    </Dialog>
  );
};