import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ManualPlan } from "@/data/manual-plans";
import { 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Award, 
  ArrowRight,
  Sparkles,
  Target,
  Heart
} from "lucide-react";
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
        score += Math.max(0, 20 - (budgetDiff / 10));
      }
      
      // Simulated popularity score
      score += Math.random() * 25;
      
      // Feature richness
      score += plan.features.length * 2;
      
      return { plan, score };
    });
    
    return scored.sort((a, b) => b.score - a.score).slice(0, 4);
  };

  // Popular plans (simulated)
  const getPopularPlans = () => {
    return plans
      .map(plan => ({ plan, popularity: Math.random() * 100 }))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 4);
  };

  // Best savings plans (simulated)
  const getBestSavingsPlans = () => {
    return plans
      .map(plan => ({ plan, savings: Math.floor(Math.random() * 200) + 50 }))
      .sort((a, b) => b.savings - a.savings)
      .slice(0, 4);
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
    <div className="rounded-lg border shadow-sm mb-6">
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">המסלולים המומלצים עבורך</CardTitle>
                <p className="text-muted-foreground text-sm">מסלולים מותאמים לפרופיל שלך</p>
              </div>
            </div>
          </div>
        
          {/* Recommendation Type Selector */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={selectedRecommendationType === 'smart' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRecommendationType('smart')}
              className="h-9 px-4"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              המלצה חכמה
            </Button>
            <Button
              variant={selectedRecommendationType === 'popular' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRecommendationType('popular')}
              className="h-9 px-4"
            >
              <Users className="h-3 w-3 mr-1" />
              הפופולרים
            </Button>
            <Button
              variant={selectedRecommendationType === 'savings' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRecommendationType('savings')}
              className="h-9 px-4"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              חיסכון מקסימלי
            </Button>
          </div>
      </CardHeader>

        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map(({ plan, reason, badge, badgeColor, icon: IconComponent }, index) => (
              <div 
                key={plan.id}
                className={`group relative overflow-hidden rounded-lg border transition-all duration-200 hover:shadow-md ${
                  index === 0 
                    ? 'bg-primary/5 border-primary/20 shadow-sm' 
                    : 'bg-card border'
                }`}
              >

                <div className="relative p-4">
                  {/* Top Badge */}
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge className={cn(`text-white border-0 px-2 py-1 text-xs ${
                      index === 0 
                        ? 'bg-primary' 
                        : 'bg-muted-foreground'
                    }`)}
                    >
                      <IconComponent className="h-3 w-3 mr-1" />
                      {badge}
                    </Badge>
                  </div>

                  {/* Plan Info */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-semibold text-base ${index === 0 ? 'text-primary' : 'text-foreground'}`}>
                          {plan.company}
                        </h4>
                        <p className={`text-sm ${index === 0 ? 'text-primary/80' : 'text-muted-foreground'}`}>
                          {plan.planName}
                        </p>
                        <div className={`mt-1 flex items-center gap-1 text-xs ${index === 0 ? 'text-primary/70' : 'text-muted-foreground'}`}>
                          <Heart className="h-3 w-3" />
                          {reason}
                        </div>
                      </div>
                      
                      <div className={`text-center p-2 rounded-lg ${
                        index === 0 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'bg-muted/50'
                      }`}>
                        <div className={`text-lg font-bold ${index === 0 ? 'text-primary' : 'text-foreground'}`}>
                          {plan.category === 'electricity' ? plan.speed : `₪${plan.regularPrice}`}
                        </div>
                        {plan.category !== 'electricity' && (
                          <div className="text-xs text-muted-foreground">
                            לחודש
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Top Features */}
                    <div className="space-y-1">
                      {plan.features.slice(0, 2).map((feature, featureIndex) => (
                        <div key={featureIndex} className="text-xs flex items-center gap-1 text-muted-foreground">
                          <div className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                          {feature.length > 25 ? `${feature.substring(0, 25)}...` : feature}
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => onPlanSelect(plan)}
                      variant={index === 0 ? "default" : "outline"}
                      size="sm"
                      className="w-full h-8 text-sm"
                    >
                      <ArrowRight className="h-3 w-3 ml-1" />
                      בחר מסלול זה
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          <div className="text-center mt-4">
            <Button 
              variant="outline" 
              size="sm"
            >
              עוד המלצות
              <ArrowRight className="h-3 w-3 mr-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanRecommendations;