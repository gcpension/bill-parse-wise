import { useState, useMemo } from "react";
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
  Crown,
  Brain,
  Target,
  AlertTriangle,
  Sparkles
} from "lucide-react";
import { ManualPlan } from "@/data/manual-plans";
import { cn } from "@/lib/utils";
import { RecommendationEngine, RecommendationContext } from "@/lib/recommendationEngine";

interface EnhancedPlanGridProps {
  plans: ManualPlan[];
  category: 'electricity' | 'internet' | 'mobile' | 'tv';
  company?: string;
  userContext?: RecommendationContext;
  onBack: () => void;
  onPlanSelect: (plan: ManualPlan) => void;
  onCompareToggle: (plan: ManualPlan) => void;
  comparedPlans: ManualPlan[];
  showAllCompanies?: boolean;
}

const EnhancedPlanGrid = ({ 
  plans, 
  category, 
  company,
  userContext,
  onBack, 
  onPlanSelect, 
  onCompareToggle, 
  comparedPlans,
  showAllCompanies = false
}: EnhancedPlanGridProps) => {
  const [sortBy, setSortBy] = useState<'price' | 'features' | 'ai'>('ai');
  const [showAIInsights, setShowAIInsights] = useState(true);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electricity': return <Zap className="w-5 h-5" />;
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      case 'internet': return <Wifi className="w-5 h-5" />;
      case 'tv': return <Tv className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  // Generate AI recommendations if userContext is provided
  const aiRecommendations = useMemo(() => {
    if (!userContext) return [];
    // Ensure we only work with ManualPlan objects and cast the result properly
    const recommendations = RecommendationEngine.generateRecommendations(plans, userContext);
    return recommendations.map(rec => ({
      ...rec,
      plan: rec.plan as ManualPlan // Type assertion since we know plans are ManualPlan[]
    }));
  }, [plans, userContext]);

  const sortedPlans = useMemo(() => {
    let sorted = [...plans];
    
    if (sortBy === 'price') {
      sorted = sorted.sort((a, b) => a.regularPrice - b.regularPrice);
    } else if (sortBy === 'features') {
      sorted = sorted.sort((a, b) => (b.features?.length || 0) - (a.features?.length || 0));
    } else if (sortBy === 'ai' && aiRecommendations.length > 0) {
      // Sort by AI recommendation score
      const scoreMap = new Map(aiRecommendations.map(rec => [rec.plan.id, rec.score]));
      sorted = sorted.sort((a, b) => (scoreMap.get(b.id) || 0) - (scoreMap.get(a.id) || 0));
    }
    
    return sorted;
  }, [plans, sortBy, aiRecommendations]);

  const cheapestPlan = plans.reduce((min, plan) => 
    plan.regularPrice < min.regularPrice ? plan : min
  );

  const isInComparison = (planId: string) => 
    comparedPlans.some(p => p.id === planId);

  const canAddToComparison = comparedPlans.length < 3;

  // Get AI recommendation for a specific plan
  const getAIRecommendation = (planId: string) => 
    aiRecommendations.find(rec => rec.plan.id === planId);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const topRecommendation = aiRecommendations[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-white">
      <div className="container mx-auto px-4 lg:px-6 max-w-6xl py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-6 hover:bg-primary/10 font-assistant"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            {showAllCompanies ? 'חזרה לבחירת קטגוריה' : 'חזרה לבחירת חברה'}
          </Button>
          
          {/* AI Top Recommendation Banner */}
          {topRecommendation && showAIInsights && (
            <Card className="mb-6 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-purple-800 font-heebo">המסלול המומלץ ביותר עבורכם</h3>
                      <p className="text-purple-600 font-assistant">
                        {topRecommendation.plan.company} - {topRecommendation.plan.planName}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge className={getConfidenceColor(topRecommendation.confidence)}>
                          ביטחון {topRecommendation.confidence === 'high' ? 'גבוה' : 
                                   topRecommendation.confidence === 'medium' ? 'בינוני' : 'נמוך'}
                        </Badge>
                        <span className="text-sm text-green-600 font-medium">
                          חיסכון ₪{topRecommendation.savings.annualSavings.toLocaleString()} בשנה
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-800 font-heebo">
                      ₪{topRecommendation.plan.regularPrice}
                    </div>
                    <div className="text-sm text-purple-600">לחודש</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                {getCategoryIcon(category)}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-primary font-heebo">
                  {showAllCompanies ? `כל מסלולי ${category === 'mobile' ? 'הסלולר' : 
                    category === 'electricity' ? 'החשמל' :
                    category === 'internet' ? 'האינטרנט' : 'הטלוויזיה'}` :
                    `מסלולי ${company}`}
                </h1>
                <p className="text-lg text-muted-foreground font-assistant">
                  {plans.length} מסלולים זמינים
                  {aiRecommendations.length > 0 && ` • ${aiRecommendations.length} המלצות AI`}
                </p>
              </div>
            </div>
            
            {/* Enhanced Sort Controls */}
            <div className="flex gap-2">
              {userContext && (
                <Button
                  variant={sortBy === 'ai' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('ai')}
                  className="font-assistant"
                >
                  <Brain className="w-4 h-4 ml-2" />
                  מיון AI
                </Button>
              )}
              <Button
                variant={sortBy === 'price' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('price')}
                className="font-assistant"
              >
                <TrendingUp className="w-4 h-4 ml-2" />
                מחיר
              </Button>
              <Button
                variant={sortBy === 'features' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('features')}
                className="font-assistant"
              >
                <Award className="w-4 h-4 ml-2" />
                תכונות
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedPlans.map((plan, index) => {
            const isCheapest = plan.id === cheapestPlan.id;
            const inComparison = isInComparison(plan.id);
            const aiRec = getAIRecommendation(plan.id);
            const isTopRecommendation = aiRec === topRecommendation;
            
            return (
              <Card 
                key={plan.id}
                className={cn(
                  "group transition-all duration-300 hover:shadow-xl border-2 relative",
                  "animate-fade-in opacity-0",
                  isCheapest && "ring-2 ring-green-400/50 bg-green-50/30",
                  inComparison && "ring-2 ring-blue-400/50 bg-blue-50/30",
                  isTopRecommendation && "ring-2 ring-purple-400/50 bg-purple-50/30",
                  "hover:border-primary/30"
                )}
                style={{ 
                  animationDelay: `${index * 0.1}s`, 
                  animationFillMode: 'forwards' 
                }}
              >
                {/* Top AI Recommendation Badge */}
                {isTopRecommendation && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <Badge className="bg-purple-500 text-white px-3 py-1 shadow-lg">
                      <Sparkles className="w-4 h-4 ml-1" />
                      בחירת AI
                    </Badge>
                  </div>
                )}

                {/* Best Deal Badge */}
                {isCheapest && !isTopRecommendation && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <Badge className="bg-green-500 text-white px-3 py-1 shadow-lg">
                      <Crown className="w-4 h-4 ml-1" />
                      הזול ביותר
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
                        {plan.company}
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
                  
                  {/* Enhanced Price Display with AI info */}
                  <div className="bg-primary/5 rounded-xl p-4 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary font-heebo mb-1">
                        ₪{plan.regularPrice}
                      </div>
                      <div className="text-sm text-muted-foreground font-assistant">לחודש</div>
                      
                      {/* AI Insights */}
                      {aiRec && (
                        <div className="mt-3 space-y-1">
                          <div className="text-sm text-green-600 font-medium font-assistant">
                            חיסכון ₪{aiRec.savings.monthlySavings} בחודש
                          </div>
                          <Badge className={`${getConfidenceColor(aiRec.confidence)} text-xs`}>
                            ציון התאמה: {Math.round(aiRec.score)}
                          </Badge>
                        </div>
                      )}
                      
                      {isCheapest && !aiRec && (
                        <div className="mt-2 text-sm text-green-600 font-medium font-assistant flex items-center justify-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          המחיר הנמוך ביותר!
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* AI Match Reasons */}
                  {aiRec && aiRec.matchReasons.length > 0 && showAIInsights && (
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                      <h4 className="font-semibold text-purple-800 font-heebo text-sm mb-2 flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        למה מתאים לכם:
                      </h4>
                      <div className="space-y-1">
                        {aiRec.matchReasons.slice(0, 2).map((reason, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-purple-700 font-assistant leading-relaxed">
                              {reason}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Warnings */}
                  {aiRec && aiRec.warnings.length > 0 && showAIInsights && (
                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                      <h4 className="font-semibold text-orange-800 font-heebo text-sm mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        שימו לב:
                      </h4>
                      {aiRec.warnings.slice(0, 1).map((warning, idx) => (
                        <div key={idx} className="text-xs text-orange-700 font-assistant">
                          {warning}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Key Features */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground font-heebo text-sm">תכונות עיקריות:</h4>
                    <div className="space-y-1">
                      {(plan.features || []).slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground font-assistant text-xs leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                      {(plan.features || []).length > 3 && (
                        <div className="text-xs text-center py-2 bg-muted/50 rounded-lg font-assistant text-muted-foreground">
                          +{plan.features.length - 3} תכונות נוספות
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-4">
                    <Button
                      onClick={() => onPlanSelect(plan)}
                      className={cn(
                        "font-heebo font-medium transition-all duration-300",
                        isTopRecommendation 
                          ? "bg-purple-600 hover:bg-purple-700" 
                          : isCheapest 
                          ? "bg-green-600 hover:bg-green-700" 
                          : "bg-primary hover:bg-primary/90"
                      )}
                    >
                      {isTopRecommendation ? 'בחר המלצת AI' : 'בחר מסלול'}
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

        {/* Enhanced Summary Stats */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-primary/10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
            {aiRecommendations.length > 0 && (
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 font-heebo mb-2">
                  ₪{Math.round(aiRecommendations.reduce((sum, rec) => sum + rec.savings.monthlySavings, 0) / aiRecommendations.length)}
                </div>
                <div className="text-sm text-muted-foreground font-assistant">חיסכון ממוצע</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPlanGrid;