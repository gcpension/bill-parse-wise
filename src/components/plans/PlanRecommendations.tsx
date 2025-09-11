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
    <div className="relative overflow-hidden rounded-2xl shadow-2xl mb-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700"></div>
      <div className="absolute inset-0">
        <div className="absolute top-4 right-6 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-6 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full"></div>
      </div>
      
      <Card className="relative bg-transparent border-0 shadow-none">
        <CardHeader className="pb-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg">
                <Sparkles className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black text-white mb-1">המסלולים המומלצים עבורך</CardTitle>
                <p className="text-white/90 font-medium">מסלולים שנבחרו במיוחד עבורך עם החיסכון הטוב ביותר</p>
              </div>
            </div>
          </div>
        
          {/* Recommendation Type Selector */}
          <div className="flex gap-3 mt-6">
            <Button
              variant={selectedRecommendationType === 'smart' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setSelectedRecommendationType('smart')}
              className={`h-12 px-6 font-bold transition-all duration-300 ${
                selectedRecommendationType === 'smart' 
                  ? 'bg-white text-purple-600 border-white hover:bg-white/90 shadow-lg' 
                  : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
              }`}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              המלצה חכמה
            </Button>
            <Button
              variant={selectedRecommendationType === 'popular' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setSelectedRecommendationType('popular')}
              className={`h-12 px-6 font-bold transition-all duration-300 ${
                selectedRecommendationType === 'popular' 
                  ? 'bg-white text-purple-600 border-white hover:bg-white/90 shadow-lg' 
                  : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              הפופולרים
            </Button>
            <Button
              variant={selectedRecommendationType === 'savings' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setSelectedRecommendationType('savings')}
              className={`h-12 px-6 font-bold transition-all duration-300 ${
                selectedRecommendationType === 'savings' 
                  ? 'bg-white text-purple-600 border-white hover:bg-white/90 shadow-lg' 
                  : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
              }`}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              חיסכון מקסימלי
            </Button>
          </div>
      </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map(({ plan, reason, badge, badgeColor, icon: IconComponent }, index) => (
              <div 
                key={plan.id}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:rotate-1 ${
                  index === 0 
                    ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 shadow-2xl shadow-orange-500/30' 
                    : 'bg-gradient-to-br from-white to-gray-50 border-2 border-white/50 shadow-xl'
                }`}
              >
                {/* Animated Background Effect for Top Recommendation */}
                {index === 0 && (
                  <div className="absolute inset-0">
                    <div className="absolute top-2 right-4 w-12 h-12 bg-white/20 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-2 left-4 w-8 h-8 bg-white/20 rounded-full animate-pulse delay-500"></div>
                  </div>
                )}

                <div className="relative p-6">
                  {/* Top Badge */}
                  <div className="absolute -top-3 -right-3 z-10">
                    <Badge className={cn(`text-white shadow-xl border-0 px-4 py-2 text-sm font-bold ${
                      index === 0 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse' 
                        : `bg-gradient-to-r ${badgeColor}`
                    }`)}
                    >
                      <IconComponent className="h-4 w-4 mr-1" />
                      {badge}
                    </Badge>
                  </div>

                  {/* Plan Info */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-black text-xl ${index === 0 ? 'text-white' : 'text-foreground'}`}>
                          {plan.company}
                        </h4>
                        <p className={`text-base font-bold ${index === 0 ? 'text-white/90' : 'text-muted-foreground'}`}>
                          {plan.planName}
                        </p>
                        <div className={`mt-2 flex items-center gap-2 text-sm font-medium ${index === 0 ? 'text-white/95' : 'text-blue-600'}`}>
                          <Heart className="h-4 w-4" />
                          {reason}
                        </div>
                      </div>
                      
                      <div className={`text-center p-3 rounded-xl shadow-lg ${
                        index === 0 
                          ? 'bg-white/20 backdrop-blur-md border border-white/30' 
                          : 'bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200'
                      }`}>
                        <div className={`text-2xl font-black ${index === 0 ? 'text-white' : 'text-purple-600'}`}>
                          {plan.category === 'electricity' ? plan.speed : `₪${plan.regularPrice}`}
                        </div>
                        {plan.category !== 'electricity' && (
                          <div className={`text-xs font-medium ${index === 0 ? 'text-white/80' : 'text-muted-foreground'}`}>
                            לחודש
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Top Features */}
                    <div className="space-y-2">
                      {plan.features.slice(0, 2).map((feature, featureIndex) => (
                        <div key={featureIndex} className={`text-sm flex items-center gap-2 ${index === 0 ? 'text-white/90' : 'text-muted-foreground'}`}>
                          <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-green-500'}`}></div>
                          {feature.length > 35 ? `${feature.substring(0, 35)}...` : feature}
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => onPlanSelect(plan)}
                      className={`w-full h-14 text-lg font-bold transition-all duration-300 ${
                        index === 0
                          ? 'bg-white text-purple-600 hover:bg-white/90 shadow-2xl hover:shadow-white/50'
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/30'
                      }`}
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      בחר מסלול זה
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 h-12 px-8 font-bold"
            >
              עוד המלצות מותאמות אישית
              <ArrowRight className="h-4 w-4 mr-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanRecommendations;