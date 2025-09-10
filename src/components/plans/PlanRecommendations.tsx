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
    <Card className={cn("bg-gradient-to-br from-white/95 to-slate-50/90 border-border/40 shadow-lg", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl">
              <Lightbulb className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">המלצות חכמות</CardTitle>
              <p className="text-sm text-muted-foreground">מסלולים שנבחרו במיוחד עבורך</p>
            </div>
          </div>
        </div>
        
        {/* Recommendation Type Selector */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={selectedRecommendationType === 'smart' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedRecommendationType('smart')}
            className="h-8"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            חכם
          </Button>
          <Button
            variant={selectedRecommendationType === 'popular' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedRecommendationType('popular')}
            className="h-8"
          >
            <Users className="h-3 w-3 mr-1" />
            פופולרי
          </Button>
          <Button
            variant={selectedRecommendationType === 'savings' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedRecommendationType('savings')}
            className="h-8"
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            חיסכון
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map(({ plan, reason, badge, badgeColor, icon: IconComponent }, index) => (
            <div 
              key={plan.id}
              className="group relative p-4 bg-white/80 backdrop-blur-sm border border-border/30 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Top Badge */}
              <div className="absolute -top-2 -right-2">
                <Badge className={cn("bg-gradient-to-r text-white shadow-lg", badgeColor)}>
                  <IconComponent className="h-3 w-3 mr-1" />
                  {badge}
                </Badge>
              </div>

              {/* Plan Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground text-lg">{plan.company}</h4>
                    <p className="text-sm text-muted-foreground font-medium">{plan.planName}</p>
                    <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {reason}
                    </p>
                  </div>
                  
                  <div className="text-center bg-gradient-to-r from-primary/5 to-primary-glow/5 p-2 rounded-lg border border-primary/10">
                    <div className="text-lg font-black text-primary">
                      {plan.category === 'electricity' ? plan.speed : `₪${plan.regularPrice}`}
                    </div>
                    {plan.category !== 'electricity' && (
                      <div className="text-xs text-muted-foreground">לחודש</div>
                    )}
                  </div>
                </div>

                {/* Top Features */}
                <div className="space-y-1">
                  {plan.features.slice(0, 2).map((feature, featureIndex) => (
                    <div key={featureIndex} className="text-xs text-muted-foreground flex items-center gap-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                      {feature.length > 40 ? `${feature.substring(0, 40)}...` : feature}
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => onPlanSelect(plan)}
                  className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-white text-sm py-2 group-hover:shadow-lg transition-all duration-300"
                >
                  בחר מסלול זה
                  <ArrowRight className="h-3 w-3 mr-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        <div className="text-center mt-4">
          <Button variant="outline" size="sm" className="text-xs">
            עוד המלצות
            <ArrowRight className="h-3 w-3 mr-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanRecommendations;