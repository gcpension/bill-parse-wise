import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  CheckCircle, 
  Star, 
  TrendingUp, 
  Award,
  Plus,
  Minus,
  Zap,
  Smartphone,
  Wifi,
  Tv,
  Crown
} from "lucide-react";
import { ManualPlan } from "@/data/manual-plans";
import { cn } from "@/lib/utils";

interface PlanGridProps {
  plans: ManualPlan[];
  category: 'electricity' | 'internet' | 'mobile' | 'tv';
  company: string;
  onBack: () => void;
  onPlanSelect: (plan: ManualPlan) => void;
  onCompareToggle: (plan: ManualPlan) => void;
  comparedPlans: ManualPlan[];
}

const PlanGrid = ({ 
  plans, 
  category, 
  company, 
  onBack, 
  onPlanSelect, 
  onCompareToggle, 
  comparedPlans 
}: PlanGridProps) => {
  const [sortBy, setSortBy] = useState<'price' | 'features'>('price');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electricity': return <Zap className="w-5 h-5" />;
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      case 'internet': return <Wifi className="w-5 h-5" />;
      case 'tv': return <Tv className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const sortedPlans = [...plans].sort((a, b) => {
    if (sortBy === 'price') {
      return a.regularPrice - b.regularPrice;
    }
    return b.features.length - a.features.length;
  });

  const cheapestPlan = plans.reduce((min, plan) => 
    plan.regularPrice < min.regularPrice ? plan : min
  );

  const isInComparison = (planId: string) => 
    comparedPlans.some(p => p.id === planId);

  const canAddToComparison = comparedPlans.length < 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-white">
      <div className="container mx-auto px-4 lg:px-6 max-w-6xl py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-6 hover:bg-primary/10 font-assistant"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            חזרה לבחירת חברה
          </Button>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                {getCategoryIcon(category)}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-primary font-heebo">
                  מסלולי {company}
                </h1>
                <p className="text-lg text-muted-foreground font-assistant">
                  {plans.length} מסלולים זמינים
                </p>
              </div>
            </div>
            
            {/* Sort Controls */}
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'price' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('price')}
                className="font-assistant"
              >
                <TrendingUp className="w-4 h-4 ml-2" />
                מיין לפי מחיר
              </Button>
              <Button
                variant={sortBy === 'features' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('features')}
                className="font-assistant"
              >
                <Award className="w-4 h-4 ml-2" />
                מיין לפי תכונות
              </Button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedPlans.map((plan, index) => {
            const isCheapest = plan.id === cheapestPlan.id;
            const inComparison = isInComparison(plan.id);
            
            return (
              <Card 
                key={plan.id}
                className={cn(
                  "group transition-all duration-300 hover:shadow-xl border-2 relative",
                  "animate-fade-in opacity-0",
                  isCheapest && "ring-2 ring-green-400/50 bg-green-50/30",
                  inComparison && "ring-2 ring-blue-400/50 bg-blue-50/30",
                  "hover:border-primary/30"
                )}
                style={{ 
                  animationDelay: `${index * 0.1}s`, 
                  animationFillMode: 'forwards' 
                }}
              >
                {/* Best Deal Badge */}
                {isCheapest && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <Badge className="bg-green-500 text-white px-3 py-1 shadow-lg">
                      <Crown className="w-4 h-4 ml-1" />
                      המחיר הטוב ביותר
                    </Badge>
                  </div>
                )}

                {/* Comparison Badge */}
                {inComparison && (
                  <div className="absolute -top-3 -left-3 z-10">
                    <Badge className="bg-blue-500 text-white px-3 py-1 shadow-lg">
                      בהשוואה
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category)}
                      <Badge variant="outline" className="text-xs font-assistant">
                        {company}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-muted-foreground font-assistant">
                        {(Math.random() * 1.5 + 3.5).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground font-heebo mb-2">
                    {plan.planName}
                  </h3>
                  
                  {/* Price Display */}
                  <div className="text-center bg-primary/5 rounded-xl p-4 mb-4">
                    <div className="text-3xl font-bold text-primary font-heebo mb-1">
                      ₪{plan.regularPrice}
                    </div>
                    <div className="text-sm text-muted-foreground font-assistant">לחודש</div>
                    {isCheapest && (
                      <div className="mt-2 text-sm text-green-600 font-medium font-assistant flex items-center justify-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        המחיר הנמוך ביותר!
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Key Features */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground font-heebo text-sm">תכונות עיקריות:</h4>
                    <div className="space-y-1">
                      {plan.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground font-assistant text-xs leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                      {plan.features.length > 4 && (
                        <div className="text-xs text-center py-2 bg-muted/50 rounded-lg font-assistant text-muted-foreground">
                          +{plan.features.length - 4} תכונות נוספות
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-4">
                    <Button
                      onClick={() => onPlanSelect(plan)}
                      className={cn(
                        "font-heebo font-medium transition-all duration-300",
                        isCheapest 
                          ? "bg-green-600 hover:bg-green-700" 
                          : "bg-primary hover:bg-primary/90"
                      )}
                    >
                      בחר מסלול
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => onCompareToggle(plan)}
                      disabled={!canAddToComparison && !inComparison}
                      className={cn(
                        "font-assistant font-medium transition-all duration-300",
                        inComparison && "bg-blue-50 border-blue-300 text-blue-700"
                      )}
                    >
                      {inComparison ? (
                        <>
                          <Minus className="w-4 h-4 ml-1" />
                          הסר
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 ml-1" />
                          השווה
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-primary/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary font-heebo mb-2">
                {plans.length}
              </div>
              <div className="text-sm text-muted-foreground font-assistant">מסלולים זמינים</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 font-heebo mb-2">
                ₪{Math.min(...plans.map(p => p.regularPrice))}
              </div>
              <div className="text-sm text-muted-foreground font-assistant">המחיר הנמוך ביותר</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 font-heebo mb-2">
                ₪{Math.max(...plans.map(p => p.regularPrice))}
              </div>
              <div className="text-sm text-muted-foreground font-assistant">המחיר הגבוה ביותר</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 font-heebo mb-2">
                ₪{Math.round(plans.reduce((sum, p) => sum + p.regularPrice, 0) / plans.length)}
              </div>
              <div className="text-sm text-muted-foreground font-assistant">מחיר ממוצע</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanGrid;