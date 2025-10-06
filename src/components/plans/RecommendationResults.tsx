import { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingDown, Star, Check, AlertCircle, ArrowRight } from "lucide-react";
import { PersonalizedRecommendation } from "@/lib/personalizedRecommendations";
import { ManualPlan } from "@/data/manual-plans";
import { CoverageIndicator } from "@/components/CoverageIndicator";
import { QuickComparisonCard } from "@/components/QuickComparisonCard";
import { cn } from "@/lib/utils";

interface RecommendationResultsProps {
  isOpen: boolean;
  onClose: () => void;
  recommendations: PersonalizedRecommendation[];
  plans: ManualPlan[];
  onPlanSelect: (plan: ManualPlan) => void;
  userLocation?: string;
}

const categoryLabels: Record<string, string> = {
  electricity: 'חשמל',
  internet: 'אינטרנט',
  mobile: 'סלולר',
  tv: 'טלוויזיה'
};

export const RecommendationResults = ({
  isOpen,
  onClose,
  recommendations,
  plans,
  onPlanSelect,
  userLocation
}: RecommendationResultsProps) => {
  const groupedRecommendations = useMemo(() => {
    const grouped: Record<string, { plan: ManualPlan; recommendation: PersonalizedRecommendation }[]> = {};
    
    recommendations.forEach(rec => {
      const plan = plans.find(p => p.id === rec.planId);
      if (!plan) return;
      
      const category = rec.category || plan.category;
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push({ plan, recommendation: rec });
    });
    
    // Sort within each category
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => 
        b.recommendation.personalizedScore - a.recommendation.personalizedScore
      );
    });
    
    return grouped;
  }, [recommendations, plans]);

  const categories = Object.keys(groupedRecommendations);
  
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heebo">
            המלצות מותאמות אישית
          </DialogTitle>
          {categories.length > 1 && (
            <p className="text-sm text-muted-foreground font-assistant">
              נמצאו המלצות עבור {categories.length} סקטורים: {categories.map(c => categoryLabels[c]).join(', ')}
            </p>
          )}
        </DialogHeader>

        <Separator />

        {/* Results by Category */}
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryRecs = groupedRecommendations[category];
            const topRec = categoryRecs[0];
            
            return (
              <div key={category}>
                {/* Category Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold font-heebo mb-1">
                    המלצות ל{categoryLabels[category]}
                  </h3>
                  <p className="text-sm text-muted-foreground font-assistant">
                    {categoryRecs.length} מסלולים מומלצים
                  </p>
                </div>

                {/* Top Recommendation - Enhanced */}
                <Card className="mb-4 border-2 border-primary shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="gap-1 bg-gradient-to-r from-primary to-primary-glow">
                                <Star className="w-3 h-3 fill-current" />
                                ההמלצה שלנו בשבילך
                              </Badge>
                              <Badge variant="outline">
                                {Math.round(topRec.recommendation.personalizedScore)}% התאמה
                              </Badge>
                            </div>
                            <h4 className="text-2xl font-bold font-heebo">{topRec.plan.company}</h4>
                            <p className="text-muted-foreground font-assistant">{topRec.plan.planName}</p>
                          </div>
                          
                          {topRec.plan.regularPrice > 0 && (
                            <div className="text-left">
                              <div className="text-3xl font-bold font-heebo text-primary">
                                ₪{topRec.plan.regularPrice}
                              </div>
                              <div className="text-sm text-muted-foreground">לחודש</div>
                            </div>
                          )}
                        </div>

                        {/* Savings - Enhanced */}
                        {topRec.recommendation.expectedSavings.monthly > 0 && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingDown className="w-5 h-5 text-green-600" />
                              <span className="font-bold font-heebo text-green-700 dark:text-green-400">💰 חיסכון משמעותי!</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground font-assistant">חיסכון חודשי</div>
                                <div className="text-xl font-bold font-heebo text-green-700 dark:text-green-400">
                                  ₪{topRec.recommendation.expectedSavings.monthly}
                                </div>
                              </div>
                              <div>
                                <div className="text-muted-foreground font-assistant">חיסכון שנתי</div>
                                <div className="text-xl font-bold font-heebo text-green-700 dark:text-green-400">
                                  ₪{topRec.recommendation.expectedSavings.annual}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Reasons */}
                        <div className="space-y-2">
                          <h5 className="font-bold font-heebo">למה זה מתאים לך?</h5>
                          <div className="space-y-2">
                            {topRec.recommendation.reasonsForRecommendation.slice(0, 3).map((reason, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <Check className="w-4 h-4 mt-0.5 shrink-0" />
                                <span className="text-sm font-assistant">{reason}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Coverage Indicator */}
                        {userLocation && (category === 'mobile' || category === 'internet') && (
                          <div className="pt-2">
                            <CoverageIndicator 
                              location={userLocation} 
                              category={category as 'mobile' | 'internet'}
                              provider={topRec.plan.company}
                            />
                          </div>
                        )}

                        {/* Concerns */}
                        {topRec.recommendation.potentialConcerns.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="font-bold font-heebo flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              נקודות לשים לב
                            </h5>
                            <div className="space-y-2">
                              {topRec.recommendation.potentialConcerns.slice(0, 2).map((concern, idx) => (
                                <div key={idx} className="text-sm text-muted-foreground font-assistant">
                                  • {concern}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <Button onClick={() => {
                          localStorage.setItem('selectedPlanForSwitch', JSON.stringify(topRec.plan));
                          onPlanSelect(topRec.plan);
                        }} className="w-full font-heebo bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary">
                          <ArrowRight className="w-4 h-4 ml-2" />
                          המשך לבקשת מעבר
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Comparison */}
                {categoryRecs.length > 1 && (
                  <QuickComparisonCard
                    plans={categoryRecs.slice(0, 3).map(r => r.plan)}
                    topPlanId={topRec.plan.id}
                    onSelectPlan={(plan) => {
                      localStorage.setItem('selectedPlanForSwitch', JSON.stringify(plan));
                      onPlanSelect(plan);
                    }}
                    expectedSavings={categoryRecs.slice(0, 3).map(r => r.recommendation.expectedSavings)}
                  />
                )}

                {/* Additional Recommendations */}
                {categoryRecs.length > 1 && (
                  <div>
                    <h5 className="font-bold font-heebo mb-3">אפשרויות נוספות</h5>
                    <div className="grid gap-4">
                      {categoryRecs.slice(1, 4).map(({ plan, recommendation }, idx) => (
                        <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">#{idx + 2}</Badge>
                                  <Badge variant="outline">
                                    {Math.round(recommendation.personalizedScore)}% התאמה
                                  </Badge>
                                </div>
                                <h6 className="font-bold font-heebo">{plan.company}</h6>
                                <p className="text-sm text-muted-foreground font-assistant line-clamp-1">
                                  {plan.planName}
                                </p>
                                {recommendation.reasonsForRecommendation[0] && (
                                  <p className="text-sm text-muted-foreground font-assistant mt-2 line-clamp-2">
                                    {recommendation.reasonsForRecommendation[0]}
                                  </p>
                                )}
                              </div>
                              
                              <div className="text-left shrink-0">
                                {plan.regularPrice > 0 && (
                                  <>
                                    <div className="text-xl font-bold font-heebo">
                                      ₪{plan.regularPrice}
                                    </div>
                                    <div className="text-xs text-muted-foreground">לחודש</div>
                                  </>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => onPlanSelect(plan)}
                                  className="mt-2 font-heebo"
                                >
                                  בחר
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {category !== categories[categories.length - 1] && (
                  <Separator className="my-8" />
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
