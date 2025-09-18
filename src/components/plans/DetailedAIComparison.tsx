import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, Target, AlertTriangle, CheckCircle, Star, Zap, Shield, Award, ArrowRight } from 'lucide-react';
import { ManualPlan } from '@/data/manual-plans';
import { RecommendationEngine, RecommendationContext, EnhancedRecommendation } from '@/lib/recommendationEngine';

interface DetailedAIComparisonProps {
  plans: ManualPlan[];
  userContext: RecommendationContext;
  category: string;
}

const DetailedAIComparison = ({ plans, userContext, category }: DetailedAIComparisonProps) => {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('recommendations');

  // Generate AI recommendations - ensure we only use ManualPlan
  const recommendations = useMemo(() => {
    return RecommendationEngine.generateRecommendations(plans, userContext)
      .slice(0, 5); // Top 5 recommendations
  }, [plans, userContext]);

  const topRecommendation = recommendations[0];
  const categoryLabel = category === 'mobile' ? 'סלולר' : 
                       category === 'electricity' ? 'חשמל' :
                       category === 'internet' ? 'אינטרנט' :
                       category === 'tv' ? 'טלוויזיה' : category;

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  // Helper function to safely get plan properties
  const getPlanName = (plan: ManualPlan | any) => {
    return plan.planName || plan.name || 'מסלול ללא שם';
  };

  const getPlanPrice = (plan: ManualPlan | any) => {
    return plan.regularPrice || plan.price || 0;
  };

  const getPlanFeatures = (plan: ManualPlan | any) => {
    return plan.features || [];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="h-14 px-8 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-heebo text-lg rounded-2xl flex items-center gap-3"
        >
          <Brain className="w-5 h-5" />
          השוואת מסלולים מפורטת
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-800 font-heebo flex items-center gap-3">
            <Brain className="w-7 h-7 text-purple-600" />
            ניתוח AI מתקדם - מסלולי {categoryLabel}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="recommendations" className="font-heebo">המלצות חכמות</TabsTrigger>
            <TabsTrigger value="comparison" className="font-heebo">השוואה מפורטת</TabsTrigger>
            <TabsTrigger value="analysis" className="font-heebo">ניתוח עמוק</TabsTrigger>
            <TabsTrigger value="insights" className="font-heebo">תובנות</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations">
            <div className="space-y-6">
              {/* Top Recommendation Highlight */}
              {topRecommendation && (
                <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-white">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-purple-800 font-heebo">המסלול המומלץ ביותר</h3>
                          <p className="text-purple-600 font-assistant">{topRecommendation.plan.company} - {getPlanName(topRecommendation.plan)}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <Badge className={`${getConfidenceColor(topRecommendation.confidence)} mb-2`}>
                          רמת ביטחון: {topRecommendation.confidence === 'high' ? 'גבוהה' : 
                                        topRecommendation.confidence === 'medium' ? 'בינונית' : 'נמוכה'}
                        </Badge>
                        <div className="text-3xl font-bold text-purple-800 font-heebo">
                          ₪{getPlanPrice(topRecommendation.plan)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-800 font-heebo mb-1">
                          ₪{topRecommendation.savings.annualSavings.toLocaleString()}
                        </div>
                        <div className="text-green-600 font-assistant text-sm">חיסכון שנתי</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-800 font-heebo mb-1">
                          {Math.round(topRecommendation.score)}
                        </div>
                        <div className="text-blue-600 font-assistant text-sm">ציון התאמה</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-800 font-heebo mb-1">
                          {Math.round(topRecommendation.savings.percentageSaving)}%
                        </div>
                        <div className="text-purple-600 font-assistant text-sm">אחוז חיסכון</div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-semibold text-purple-800 font-heebo mb-3">למה המסלול הזה מתאים לכם:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {topRecommendation.matchReasons.map((reason, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 font-assistant">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {topRecommendation.warnings.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-orange-800 font-heebo mb-3">נקודות לתשומת לב:</h4>
                        <div className="space-y-2">
                          {topRecommendation.warnings.map((warning, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 font-assistant">{warning}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* All Recommendations List */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-purple-800 font-heebo">כל ההמלצות לפי סדר התאמה</h3>
                {recommendations.map((rec, index) => (
                  <Card key={index} className={`${index === 0 ? 'ring-2 ring-purple-200' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                            index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                            index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                            'bg-gradient-to-r from-purple-400 to-purple-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 font-heebo">{rec.plan.company}</h4>
                            <p className="text-gray-600 font-assistant">{getPlanName(rec.plan)}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-2xl font-bold text-purple-800 font-heebo">
                            ₪{getPlanPrice(rec.plan)}
                          </div>
                          <Badge className={getConfidenceColor(rec.confidence)}>
                            {rec.confidence === 'high' ? 'ביטחון גבוה' : 
                             rec.confidence === 'medium' ? 'ביטחון בינוני' : 'ביטחון נמוך'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-green-600 font-heebo">
                            ₪{rec.savings.monthlySavings}
                          </div>
                          <div className="text-xs text-gray-500">חיסכון חודשי</div>
                        </div>
                        <div>
                          <div className={`text-lg font-bold font-heebo ${getScoreColor(rec.score)}`}>
                            {Math.round(rec.score)}
                          </div>
                          <div className="text-xs text-gray-500">ציון התאמה</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600 font-heebo">
                            {Math.round(rec.savings.percentageSaving)}%
                          </div>
                          <div className="text-xs text-gray-500">חיסכון</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comparison">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-purple-800 font-heebo">השוואה מפורטת בין המסלולים המובילים</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-purple-50">
                      <th className="border border-purple-200 p-3 text-right font-heebo">מסלול</th>
                      <th className="border border-purple-200 p-3 text-center font-heebo">מחיר</th>
                      <th className="border border-purple-200 p-3 text-center font-heebo">חיסכון חודשי</th>
                      <th className="border border-purple-200 p-3 text-center font-heebo">ציון התאמה</th>
                      <th className="border border-purple-200 p-3 text-center font-heebo">רמת ביטחון</th>
                      <th className="border border-purple-200 p-3 text-center font-heebo">תכונות מרכזיות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommendations.slice(0, 5).map((rec, index) => (
                      <tr key={index} className={index === 0 ? 'bg-green-50' : 'hover:bg-gray-50'}>
                        <td className="border border-purple-200 p-3">
                          <div className="flex items-center gap-2">
                            {index === 0 && <Star className="w-4 h-4 text-yellow-500" />}
                            <div>
                              <div className="font-semibold font-heebo">{rec.plan.company}</div>
                              <div className="text-sm text-gray-600 font-assistant">{getPlanName(rec.plan)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="border border-purple-200 p-3 text-center font-bold font-heebo">
                          ₪{getPlanPrice(rec.plan)}
                        </td>
                        <td className="border border-purple-200 p-3 text-center font-bold text-green-600 font-heebo">
                          ₪{rec.savings.monthlySavings}
                        </td>
                        <td className="border border-purple-200 p-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-sm font-bold ${getScoreColor(rec.score)}`}>
                            {Math.round(rec.score)}
                          </span>
                        </td>
                        <td className="border border-purple-200 p-3 text-center">
                          <Badge className={getConfidenceColor(rec.confidence)}>
                            {rec.confidence === 'high' ? 'גבוהה' : 
                             rec.confidence === 'medium' ? 'בינונית' : 'נמוכה'}
                          </Badge>
                        </td>
                        <td className="border border-purple-200 p-3">
                          <div className="flex flex-wrap gap-1">
                            {getPlanFeatures(rec.plan).slice(0, 3).map((feature: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-purple-800 font-heebo">ניתוח עמוק של המסלולים</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h4 className="font-bold text-purple-800 font-heebo flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      ניתוח חיסכון
                    </h4>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="font-assistant">חיסכון ממוצע:</span>
                        <span className="font-bold text-green-600 font-heebo">
                          ₪{Math.round(recommendations.reduce((sum, rec) => sum + rec.savings.monthlySavings, 0) / recommendations.length)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-assistant">חיסכון מקסימלי:</span>
                        <span className="font-bold text-green-600 font-heebo">
                          ₪{Math.max(...recommendations.map(rec => rec.savings.monthlySavings))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-assistant">אחוז חיסכון ממוצע:</span>
                        <span className="font-bold text-purple-600 font-heebo">
                          {Math.round(recommendations.reduce((sum, rec) => sum + rec.savings.percentageSaving, 0) / recommendations.length)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h4 className="font-bold text-purple-800 font-heebo flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      התאמה אישית
                    </h4>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="font-assistant">תקציב נוכחי:</span>
                        <span className="font-bold font-heebo">₪{userContext.currentAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-assistant">תקציב מומלץ:</span>
                        <span className="font-bold font-heebo">₪{userContext.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-assistant">דפוס שימוש:</span>
                        <span className="font-bold font-heebo">
                          {userContext.usage === 'light' ? 'קל' : 
                           userContext.usage === 'medium' ? 'בינוני' : 'כבד'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Match Quality Analysis */}
              <Card>
                <CardHeader>
                  <h4 className="font-bold text-purple-800 font-heebo flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    איכות ההתאמה
                  </h4>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-purple-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold font-heebo">{rec.plan.company}</div>
                            <div className="text-sm text-gray-600 font-assistant">{getPlanName(rec.plan)}</div>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-lg font-bold font-heebo">{Math.round(rec.score)}/100</div>
                          <div className="text-xs text-gray-500">ציון התאמה</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-purple-800 font-heebo">תובנות והמלצות אסטרטגיות</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="w-8 h-8 text-blue-600" />
                      <h4 className="font-bold text-blue-800 font-heebo">המלצה מיידית</h4>
                    </div>
                    <p className="text-blue-700 font-assistant leading-relaxed">
                      על פי הניתוח, מעבר למסלול המומלץ יחסוך לכם ₪{topRecommendation?.savings.annualSavings.toLocaleString()} בשנה הקרובה. זה שווה ערך לחופשה משפחתית או כמה ארוחות טובות בחודש.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-50 to-green-100">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="w-8 h-8 text-green-600" />
                      <h4 className="font-bold text-green-800 font-heebo">אופטימיזציה חכמה</h4>
                    </div>
                    <p className="text-green-700 font-assistant leading-relaxed">
                      המסלולים המומלצים מותאמים לדפוס השימוש שלכם ולתקציב. כל המסלולים עברו בדיקת איכות ואמינות לפי נתוני השוק העדכניים.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <h4 className="font-bold text-purple-800 font-heebo">שלבים מומלצים למעבר</h4>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      "בחרו את המסלול המתאים לכם מתוך ההמלצות",
                      "צרו קשר עם הספק החדש לאישור הפרטים",
                      "תאמו מועד מעבר נוח (בדרך כלל תוך 7-14 יום)",
                      "השלימו את המעבר ותתחילו לחסוך מיד",
                      "עקבו אחר החשבון הראשון לוודא שהכל תקין"
                    ].map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 font-assistant">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t">
          <Button 
            className="h-12 px-8 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-heebo"
            onClick={() => setOpen(false)}
          >
            בחר מסלול והתחל לחסוך
            <ArrowRight className="w-5 h-5 mr-2" />
          </Button>
          <Button 
            variant="outline"
            onClick={() => setOpen(false)}
            className="h-12 px-6 font-heebo"
          >
            סגור
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedAIComparison;