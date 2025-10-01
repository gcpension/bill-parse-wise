import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Crown, 
  Sparkles, 
  Star, 
  CheckCircle, 
  Plus, 
  Minus, 
  Eye, 
  Zap,
  Shield,
  Award,
  TrendingUp,
  Brain,
  Target
} from 'lucide-react';
import { ManualPlan } from '@/data/manual-plans';
import { cn } from '@/lib/utils';

interface EnhancedPlanCardProps {
  plan: ManualPlan;
  index: number;
  isCheapest?: boolean;
  isTopRecommendation?: boolean;
  isInComparison?: boolean;
  canAddToComparison?: boolean;
  aiScore?: number;
  monthlySavings?: number;
  onSelect: (plan: ManualPlan) => void;
  onCompareToggle: (plan: ManualPlan) => void;
}

export const EnhancedPlanCard = ({
  plan,
  index,
  isCheapest = false,
  isTopRecommendation = false,
  isInComparison = false,
  canAddToComparison = true,
  aiScore,
  monthlySavings,
  onSelect,
  onCompareToggle
}: EnhancedPlanCardProps) => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'from-green-500 to-green-600';
    if (score >= 70) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <Card 
      className={cn(
        "group transition-all duration-500 hover:shadow-2xl border-2 relative overflow-hidden",
        "animate-fade-in opacity-0 hover:-translate-y-1",
        isCheapest && "ring-2 ring-green-400/60 bg-gradient-to-br from-green-50/50 via-white to-green-50/30",
        isInComparison && "ring-2 ring-blue-400/60 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30",
        isTopRecommendation && "ring-2 ring-purple-400/60 bg-gradient-to-br from-purple-50/50 via-white to-purple-50/30",
        "hover:border-primary/40"
      )}
      style={{ 
        animationDelay: `${index * 0.15}s`, 
        animationFillMode: 'forwards' 
      }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top AI Recommendation Badge */}
      {isTopRecommendation && (
        <div className="absolute -top-3 -right-3 z-10">
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 shadow-xl">
            <Brain className="w-4 h-4 ml-1" />
            בחירת AI #1
          </Badge>
        </div>
      )}

      {/* Best Deal Badge */}
      {isCheapest && !isTopRecommendation && (
        <div className="absolute -top-3 -right-3 z-10">
          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 shadow-xl">
            <Crown className="w-4 h-4 ml-1" />
            המחיר הטוב ביותר
          </Badge>
        </div>
      )}

      {/* Comparison Badge */}
      {isInComparison && (
        <div className="absolute -top-3 -left-3 z-10">
          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 shadow-xl">
            <CheckCircle className="w-4 h-4 ml-1" />
            בהשוואה
          </Badge>
        </div>
      )}

      {/* AI Score Badge */}
      {aiScore && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className={`${getScoreBadgeColor(aiScore)} px-3 py-1 shadow-lg font-bold`}>
            <Target className="w-3 h-3 ml-1" />
            {Math.round(aiScore)}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-foreground font-heebo group-hover:text-primary transition-colors">
                {plan.company}
              </h3>
              {plan.company === 'חברת החשמל' && (
                <Badge variant="outline" className="text-xs">
                  <Shield className="w-3 h-3 ml-1" />
                  רשמי
                </Badge>
              )}
            </div>
            <h4 className="text-lg text-muted-foreground font-assistant font-medium">
              {plan.planName}
            </h4>
            {aiScore && (
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-16 h-2 bg-gradient-to-r ${getScoreColor(aiScore)} rounded-full shadow-inner`}>
                  <div 
                    className="h-full bg-white/30 rounded-full transition-all duration-1000"
                    style={{ width: `${100 - aiScore}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-assistant">
                  התאמה: {Math.round(aiScore)}%
                </span>
              </div>
            )}
          </div>
          <div className="text-left">
            <div className="text-3xl font-bold text-primary font-heebo mb-1 group-hover:scale-110 transition-transform duration-300">
              ₪{plan.regularPrice}
            </div>
            <div className="text-sm text-muted-foreground font-assistant">לחודש</div>
            {monthlySavings && monthlySavings > 0 && (
              <Badge className="bg-green-100 text-green-800 border-green-200 mt-2">
                <TrendingUp className="w-3 h-3 ml-1" />
                חוסך ₪{monthlySavings}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Features Preview */}
        <div className="space-y-2">
          <h5 className="font-semibold text-foreground font-assistant flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            עיקרי התכונות
          </h5>
          <div className="space-y-1">
            {plan.features?.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span className="text-muted-foreground font-assistant">{feature}</span>
              </div>
            ))}
            {(plan.features?.length || 0) > 3 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="text-xs p-0 h-auto font-assistant">
                    <Plus className="w-3 h-3 ml-1" />
                    +{(plan.features?.length || 0) - 3} תכונות נוספות
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-heebo text-xl">
                      {plan.company} - {plan.planName}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold font-assistant mb-2">כל התכונות</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {plan.features?.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground font-assistant">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold font-assistant mb-2">פרטי המסלול</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>חברה:</span>
                            <span className="font-semibold">{plan.company}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>מחיר חודשי:</span>
                            <span className="font-bold text-primary">₪{plan.regularPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>מחיר שנתי:</span>
                            <span className="font-semibold">₪{(plan.regularPrice * 12).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>תכונות:</span>
                            <span>{plan.features?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={() => onSelect(plan)}
            className="flex-1 font-assistant h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg group-hover:shadow-xl transition-all duration-300"
          >
            <Zap className="w-4 h-4 ml-2" />
            בחר מסלול זה
          </Button>
          <Button
            variant={isInComparison ? "secondary" : "outline"}
            onClick={() => onCompareToggle(plan)}
            disabled={!canAddToComparison && !isInComparison}
            className="h-12 font-assistant border-2 hover:scale-105 transition-all duration-300"
          >
            {isInComparison ? (
              <Minus className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Quick Stats */}
        {(aiScore || monthlySavings) && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            {aiScore && (
              <div className="text-center">
                <div className="text-lg font-bold font-heebo text-primary">{Math.round(aiScore)}%</div>
                <div className="text-xs text-muted-foreground font-assistant">התאמה</div>
              </div>
            )}
            {monthlySavings && monthlySavings > 0 && (
              <div className="text-center">
                <div className="text-lg font-bold font-heebo text-green-600">₪{monthlySavings}</div>
                <div className="text-xs text-muted-foreground font-assistant">חיסכון</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};