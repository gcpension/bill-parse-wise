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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30">
        <DialogHeader className="sticky top-0 bg-gradient-to-r from-white/95 to-green-50/95 backdrop-blur-sm z-10 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent font-heebo">
                  ההמלצה המושלמת שלכם
                </DialogTitle>
                <p className="text-lg text-gray-600 font-assistant mt-1">
                  מנתח אישי מתקדם • מבוסס על {recommendations.length} חלופות
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                שתף
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="w-4 h-4" />
                שמור
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 mt-2">
          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <Calculator className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-700">{Math.round(topRecommendation.personalizedScore)}%</div>
                  <div className="text-sm text-blue-600 font-medium">ציון התאמה</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-700">₪{topRecommendation.expectedSavings.monthly}</div>
                  <div className="text-sm text-green-600 font-medium">חיסכון חודשי</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-700">{Math.round(topRecommendation.confidenceLevel * 100)}%</div>
                  <div className="text-sm text-purple-600 font-medium">רמת ביטחון</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Recommendation */}
          <Card className="border-0 bg-gradient-to-br from-white via-green-50/50 to-emerald-50/50 shadow-2xl shadow-green-500/20 animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 to-emerald-100/20 rounded-lg"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <Award className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-yellow-800" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent font-heebo">
                      {topPlan.planName}
                    </CardTitle>
                    <p className="text-xl text-green-600 font-assistant font-medium">
                      {topPlan.company}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">מותאם אישית עבורכם</span>
                    </div>
                  </div>
                </div>
                <div className="text-left bg-white/80 rounded-2xl p-4 shadow-lg border border-green-200">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent font-heebo">
                    ₪{topPlan.regularPrice}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">לחודש</div>
                  {topPlan.introPrice && topPlan.introPrice < topPlan.regularPrice && (
                    <div className="text-xs text-green-600 mt-1">
                      מחיר השקה: ₪{topPlan.introPrice}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Match Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 font-assistant">ציון התאמה</span>
                  <span className="font-bold text-green-700">{Math.round(topRecommendation.personalizedScore)}%</span>
                </div>
                <Progress value={topRecommendation.personalizedScore} className="h-3" />
              </div>

              {/* Expected Savings */}
              {topRecommendation.expectedSavings.monthly > 0 && (
                <div className="flex items-center gap-2 bg-green-100 rounded-lg p-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-bold text-green-800 font-heebo">
                      חיסכון צפוי: ₪{topRecommendation.expectedSavings.monthly} לחודש
                    </div>
                    <div className="text-sm text-green-600">
                      ₪{topRecommendation.expectedSavings.annual} לשנה
                    </div>
                  </div>
                </div>
              )}

              {/* Confidence & Risk */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">רמת ביטחון</div>
                    <div className="font-bold text-blue-700">{Math.round(topRecommendation.confidenceLevel * 100)}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="text-sm text-gray-600">רמת סיכון</div>
                    <Badge className={getRiskColor(topRecommendation.riskLevel)}>
                      {topRecommendation.riskLevel === 'low' ? 'נמוך' : 
                       topRecommendation.riskLevel === 'medium' ? 'בינוני' : 'גבוה'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Reasons */}
              <div>
                <h4 className="font-bold text-gray-800 font-heebo mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  למה המסלול הזה מתאים לכם?
                </h4>
                <div className="space-y-2">
                  {topRecommendation.reasonsForRecommendation.slice(0, 4).map((reason, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <span className="text-gray-700 font-assistant">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights */}
              {topRecommendation.personalizedInsights && topRecommendation.personalizedInsights.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-800 font-heebo mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    תובנות נוספות
                  </h4>
                  <div className="space-y-2">
                    {topRecommendation.personalizedInsights.slice(0, 3).map((insight, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <span className="text-gray-700 font-assistant">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-heebo text-lg h-12"
                  onClick={() => {
                    onPlanSelect(topPlan);
                    onClose();
                  }}
                >
                  <Heart className="w-5 h-5 ml-2" />
                  בחר במסלול הזה
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Recommendations */}
          {recommendations.length > 1 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 font-heebo mb-4">
                אלטרנטיבות נוספות
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.slice(1, 3).map((rec, index) => {
                  const altPlan = plans.find(p => p.id === rec.planId);
                  if (!altPlan) return null;
                  
                  return (
                    <Card key={index} className="border border-gray-200 hover:border-green-300 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg font-heebo">{altPlan.planName}</CardTitle>
                            <p className="text-sm text-gray-600">{altPlan.company}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-700">₪{altPlan.regularPrice}</div>
                            <div className="text-xs text-gray-500">לחודש</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>ציון התאמה</span>
                            <span className="font-bold">{Math.round(rec.personalizedScore)}%</span>
                          </div>
                          <Progress value={rec.personalizedScore} className="h-2" />
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="w-full mt-3"
                            onClick={() => {
                              onPlanSelect(altPlan);
                              onClose();
                            }}
                          >
                            בחר מסלול זה
                          </Button>
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