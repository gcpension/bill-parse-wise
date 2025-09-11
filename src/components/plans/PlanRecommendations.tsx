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

      // Simulated popularity score
      score += Math.random() * 25;

      // Feature richness
      score += plan.features.length * 2;
      return {
        plan,
        score
      };
    });
    return scored.sort((a, b) => b.score - a.score).slice(0, 4);
  };

  // Popular plans (simulated)
  const getPopularPlans = () => {
    return plans.map(plan => ({
      plan,
      popularity: Math.random() * 100
    })).sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  };

  // Best savings plans (simulated)
  const getBestSavingsPlans = () => {
    return plans.map(plan => ({
      plan,
      savings: Math.floor(Math.random() * 200) + 50
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
  return;
};
export default PlanRecommendations;