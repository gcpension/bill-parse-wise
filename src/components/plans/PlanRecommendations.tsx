import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ManualPlan } from "@/data/manual-plans";
import { Lightbulb, TrendingUp, Users, Award, ArrowRight, Sparkles, Target, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
interface PlanRecommendationsProps {
  plans: ManualPlan[];
  userProfile?: {
    category?: string;
    budget?: number;
    usage?: 'light' | 'medium' | 'heavy';
  };
  onPlanSelect: (plan: ManualPlan) => void;
  className?: string;
}
const PlanRecommendations = ({
  plans,
  userProfile,
  onPlanSelect,
  className
}: PlanRecommendationsProps) => {
  const [selectedRecommendationType, setSelectedRecommendationType] = useState<'smart' | 'popular' | 'savings'>('smart');

  // Smart recommendation algorithm
  const getSmartRecommendations = () => {
    let scored = plans.map(plan => {
      let score = 0;

      // Category match
      if (userProfile?.category && plan.category === userProfile.category) {
        score += 30;
      }

      // Budget consideration
      if (userProfile?.budget && plan.category !== 'electricity') {
        const price = parseInt(plan.regularPrice.toString());
        const budgetDiff = Math.abs(price - userProfile.budget);
        score += Math.max(0, 20 - budgetDiff / 10);
      }

      // Feature richness
      score += plan.features.length * 2;
      return {
        plan,
        score
      };
    });
    return scored.sort((a, b) => b.score - a.score).slice(0, 4);
  };

  // Popular plans (based on price competitiveness)
  const getPopularPlans = () => {
    return plans.map(plan => ({
      plan,
      popularity: 100 - plan.regularPrice / 10 // Lower price = higher popularity
    })).sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  };

  // Best savings plans (based on price difference from average)
  const getBestSavingsPlans = () => {
    const avgPrice = plans.reduce((sum, p) => sum + p.regularPrice, 0) / plans.length;
    return plans.map(plan => ({
      plan,
      savings: Math.floor(Math.max(0, avgPrice - plan.regularPrice))
    })).sort((a, b) => b.savings - a.savings).slice(0, 4);
  };
  const getCurrentRecommendations = () => {
    switch (selectedRecommendationType) {
      case 'popular':
        return getPopularPlans().map(item => ({
          plan: item.plan,
          reason: `${Math.floor(item.popularity)}% מהלקוחות בוחרים במסלול זה`,
          badge: 'פופולרי ביותר',
          badgeColor: 'from-orange-500 to-red-500',
          icon: Users
        }));
      case 'savings':
        return getBestSavingsPlans().map(item => ({
          plan: item.plan,
          reason: `חיסכון של עד ₪${item.savings} לחודש`,
          badge: 'חיסכון מקסימלי',
          badgeColor: 'from-green-500 to-emerald-600',
          icon: TrendingUp
        }));
      case 'smart':
      default:
        return getSmartRecommendations().map((item, index) => ({
          plan: item.plan,
          reason: index === 0 ? 'המתאים ביותר עבורך' : `התאמה של ${Math.floor(item.score)}%`,
          badge: index === 0 ? 'המומלץ ביותר' : 'מומלץ',
          badgeColor: index === 0 ? 'from-blue-500 to-purple-600' : 'from-blue-400 to-blue-500',
          icon: index === 0 ? Award : Target
        }));
    }
  };
  const recommendations = getCurrentRecommendations();
  
  if (recommendations.length === 0) return null;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-3 p-6 bg-gradient-to-br from-primary/10 via-background to-accent/5 rounded-2xl border border-primary/20">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ההמלצה התואמת טלכוב
          </h2>
        </div>
        <p className="text-lg text-muted-foreground font-medium">
          מנתח אישי מקיצים • מבוסס על 5 תליקופ
        </p>
      </div>

      {/* Recommendation Type Selector */}
      <div className="flex justify-center gap-2 p-2 bg-muted/50 rounded-xl border border-border/50">
        {[
          { key: 'smart', label: 'חכם', icon: Target },
          { key: 'popular', label: 'פופולרי', icon: Users },
          { key: 'savings', label: 'חיסכון', icon: TrendingUp }
        ].map((type) => {
          const Icon = type.icon;
          return (
            <Button
              key={type.key}
              variant={selectedRecommendationType === type.key ? "default" : "ghost"}
              onClick={() => setSelectedRecommendationType(type.key as any)}
              className={cn(
                "flex-1 h-12 gap-2 transition-all duration-300",
                selectedRecommendationType === type.key 
                  ? "bg-primary text-white shadow-lg scale-105" 
                  : "hover:bg-muted hover:scale-102"
              )}
            >
              <Icon className="w-4 h-4" />
              {type.label}
            </Button>
          );
        })}
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-black text-primary mb-2">72%</div>
            <div className="text-sm font-bold text-primary/80">רמת ביטחון</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/30 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-black text-success mb-2">סקר</div>
            <div className="text-sm font-bold text-success/80">חיסכון חודשי</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-black text-accent mb-2">62%</div>
            <div className="text-sm font-bold text-accent/80">ציון התאמה</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Recommended Plan */}
      {recommendations.length > 0 && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/30 shadow-xl hover:shadow-glow transition-all duration-500 animate-scale-in">
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl opacity-60"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-xl opacity-60"></div>
          
          <CardHeader className="relative z-10 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning rounded-full flex items-center justify-center animate-bounce">
                    <Sparkles className="w-3 h-3 text-warning-foreground" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-success text-white px-2 py-1 text-xs font-bold">
                      המומלץ ביותר
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {recommendations[0].plan.company}
                  </h3>
                  <p className="text-lg text-muted-foreground font-medium">
                    {recommendations[0].plan.planName}
                  </p>
                </div>
              </div>
              
              <div className="text-center bg-gradient-to-br from-muted/80 to-muted/50 rounded-2xl p-4 shadow-md border border-border/50">
                <div className="text-3xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ₪{recommendations[0].plan.regularPrice}
                </div>
                <div className="text-sm text-muted-foreground font-medium">לחודש</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 relative z-10">
            {/* Plan Details */}
            <div className="bg-gradient-to-r from-muted/30 to-muted/20 rounded-xl p-4 border border-border/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">רמת ביטחון</span>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold text-primary">72%</div>
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                  style={{ width: '72%' }}
                ></div>
              </div>
              
              <div className="flex items-center justify-center mt-3 gap-2 text-sm">
                <div className="flex items-center gap-1 text-success">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>רמת ביטחון</span>
                </div>
                <span className="text-muted-foreground">נמוך</span>
              </div>
            </div>

            {/* Why This Plan Section */}
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-warning" />
                למה המסלול הזה מתאים לכם?
              </h4>
              <div className="bg-gradient-to-r from-success/10 to-success/5 p-4 rounded-xl border border-success/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-success">
                      הממסרין ניתוק מתאים לכל המשפחה בעשרים של 66% ב-
                    </div>
                    <div className="text-sm text-success/80">
                      {recommendations[0].reason}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => onPlanSelect(recommendations[0].plan)}
                className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Heart className="w-5 h-5 mr-2" />
                בחירה במסלול זה
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                className="px-6 h-14 border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
              >
                פרטים נוספים
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Recommendations */}
      {recommendations.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground text-center">המלצות נוספות עבורכם</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.slice(1, 3).map((rec, index) => {
              const Icon = rec.icon;
              return (
                <Card 
                  key={index}
                  className="bg-gradient-to-br from-card to-muted/20 border border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-102"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${rec.badgeColor} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{rec.plan.company}</div>
                        <div className="text-sm text-muted-foreground">{rec.plan.planName}</div>
                      </div>
                      <div className="ml-auto text-xl font-bold text-primary">
                        ₪{rec.plan.regularPrice}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {rec.badge}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">{rec.reason}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onPlanSelect(rec.plan)}
                      className="w-full mt-3 hover:bg-primary/10"
                    >
                      בחירה
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanRecommendations;