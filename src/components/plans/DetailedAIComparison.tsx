import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Brain, TrendingUp, Target, AlertTriangle, CheckCircle, Star, Zap, Shield, Award, ArrowRight, BarChart3, Calculator, MessageSquare, ChevronDown, ChevronUp, Lightbulb, Clock, DollarSign, Users, FileText, Sparkles } from 'lucide-react';
import { ManualPlan } from '@/data/manual-plans';
import { RecommendationEngine, RecommendationContext, EnhancedRecommendation } from '@/lib/recommendationEngine';

interface DetailedAIComparisonProps {
  plans: ManualPlan[];
  userContext: RecommendationContext;
  category: 'electricity' | 'internet' | 'mobile' | 'tv';
}

const DetailedAIComparison = ({ plans, userContext, category }: DetailedAIComparisonProps) => {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('recommendations');

  // Generate AI recommendations only if userContext exists
  const recommendations = useMemo(() => {
    if (!userContext || !plans.length) return [];
    try {
      return RecommendationEngine.generateRecommendations(plans, userContext)
        .slice(0, 5); // Top 5 recommendations
    } catch (error) {
      console.warn('Failed to generate recommendations:', error);
      return [];
    }
  }, [plans, userContext]);

  const topRecommendation = recommendations[0];
  const categoryLabel = category === 'mobile' ? 'סלולר' : 
                       category === 'electricity' ? 'חשמל' :
                       category === 'internet' ? 'אינטרנט' :
                       category === 'tv' ? 'טלוויזיה' : category;

  // If no valid context, show simplified comparison
  if (!userContext || !recommendations.length) {
    return (
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-white">
        <CardContent className="p-6">
          <div className="text-center">
            <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-purple-800 font-heebo mb-2">
              השוואה בסיסית
            </h3>
            <p className="text-purple-600 font-assistant mb-6">
              השוואה פשוטה בין המסלולים שבחרתם
            </p>
            
            {/* Basic comparison table */}
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-right font-heebo font-semibold">מסלול</th>
                    <th className="p-3 text-center font-heebo font-semibold">חברה</th>
                    <th className="p-3 text-center font-heebo font-semibold">מחיר חודשי</th>
                    <th className="p-3 text-center font-heebo font-semibold">תכונות</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan, index) => (
                    <tr key={plan.id} className="border-t">
                      <td className="p-3 font-semibold font-assistant">{plan.planName}</td>
                      <td className="p-3 text-center font-assistant">{plan.company}</td>
                      <td className="p-3 text-center font-bold text-primary font-heebo">
                        ₪{plan.regularPrice}
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-sm text-muted-foreground">
                          {plan.features?.length || 0} תכונות
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          <DialogTitle className="text-3xl font-bold text-purple-800 font-heebo flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <div>ניתוח AI מתקדם</div>
              <div className="text-lg text-purple-600 font-normal">מסלולי {categoryLabel}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 h-14">
            <TabsTrigger value="recommendations" className="font-heebo text-base h-12">
              <Award className="w-4 h-4 ml-2" />
              המלצות חכמות
            </TabsTrigger>
            <TabsTrigger value="comparison" className="font-heebo text-base h-12">
              <TrendingUp className="w-4 h-4 ml-2" />
              השוואה מפורטת
            </TabsTrigger>
            <TabsTrigger value="analysis" className="font-heebo text-base h-12">
              <Target className="w-4 h-4 ml-2" />
              ניתוח עמוק
            </TabsTrigger>
            <TabsTrigger value="insights" className="font-heebo text-base h-12">
              <Zap className="w-4 h-4 ml-2" />
              תובנות
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations">
            <div className="space-y-6">
              {/* Top Recommendation Highlight */}
              {topRecommendation && (
                <Card className="border-3 border-purple-300 bg-gradient-to-br from-purple-50 via-white to-purple-50 shadow-xl">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-2xl font-bold text-purple-800 font-heebo">המסלול המומלץ ביותר</h3>
                            <Badge className="bg-yellow-500 text-white px-3 py-1 rounded-full">
                              <Star className="w-3 h-3 ml-1" />
                              #1
                            </Badge>
                          </div>
                          <p className="text-lg text-purple-600 font-assistant font-medium">
                            {topRecommendation.plan.company} • {getPlanName(topRecommendation.plan)}
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <Badge className={`${getConfidenceColor(topRecommendation.confidence)} mb-3 px-4 py-2 text-sm font-semibold`}>
                          רמת ביטחון: {topRecommendation.confidence === 'high' ? 'גבוהה' : 
                                        topRecommendation.confidence === 'medium' ? 'בינונית' : 'נמוכה'}
                        </Badge>
                        <div className="text-4xl font-bold text-purple-800 font-heebo">
                          ₪{getPlanPrice(topRecommendation.plan)}
                        </div>
                        <div className="text-purple-600 font-assistant">לחודש</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-green-700 font-semibold font-assistant">חיסכון שנתי</span>
                        </div>
                        <div className="text-3xl font-bold text-green-800 font-heebo">
                          ₪{topRecommendation.savings.annualSavings.toLocaleString()}
                        </div>
                        <div className="text-sm text-green-600 font-assistant">
                          ₪{topRecommendation.savings.monthlySavings} לחודש
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Target className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-blue-700 font-semibold font-assistant">ציון התאמה</span>
                        </div>
                        <div className="text-3xl font-bold text-blue-800 font-heebo">
                          {Math.round(topRecommendation.score)}
                        </div>
                        <div className="text-sm text-blue-600 font-assistant">מתוך 100</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-purple-700 font-semibold font-assistant">אחוז חיסכון</span>
                        </div>
                        <div className="text-3xl font-bold text-purple-800 font-heebo">
                          {Math.round(topRecommendation.savings.percentageSaving)}%
                        </div>
                        <div className="text-sm text-purple-600 font-assistant">מהעלות הנוכחית</div>
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
            <div className="space-y-8">
              {/* Advanced Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Calculator className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold text-blue-800 font-heebo">
                          ₪{Math.round(recommendations.reduce((sum, rec) => sum + rec.savings.monthlySavings, 0) / recommendations.length)}
                        </div>
                        <div className="text-sm text-blue-600 font-assistant">חיסכון ממוצע</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                      <div>
                        <div className="text-2xl font-bold text-green-800 font-heebo">
                          ₪{Math.max(...recommendations.map(rec => rec.savings.monthlySavings))}
                        </div>
                        <div className="text-sm text-green-600 font-assistant">חיסכון מקסימלי</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                      <div>
                        <div className="text-2xl font-bold text-purple-800 font-heebo">
                          {Math.round(recommendations.reduce((sum, rec) => sum + rec.score, 0) / recommendations.length)}
                        </div>
                        <div className="text-sm text-purple-600 font-assistant">ציון ממוצע</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-orange-600" />
                      <div>
                        <div className="text-2xl font-bold text-orange-800 font-heebo">
                          {recommendations.filter(r => r.confidence === 'high').length}
                        </div>
                        <div className="text-sm text-orange-600 font-assistant">ביטחון גבוה</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Comparison Cards */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-purple-800 font-heebo flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  השוואה מפורטת - {recommendations.length} מסלולים מובילים
                </h3>
                
                {recommendations.slice(0, 5).map((rec, index) => (
                  <Card key={index} className={`${
                    index === 0 ? 'ring-2 ring-green-400 bg-gradient-to-r from-green-50 to-white' : 
                    'hover:shadow-lg transition-all duration-300'
                  } relative overflow-hidden`}>
                    {index === 0 && (
                      <div className="absolute top-0 left-0 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1 text-sm font-bold rounded-br-lg">
                        <Star className="w-4 h-4 inline ml-1" />
                        מומלץ ביותר
                      </div>
                    )}
                    
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        {/* Company Info */}
                        <div className="lg:col-span-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                              index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                              index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                              index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                              'bg-gradient-to-r from-purple-400 to-purple-600'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-800 font-heebo">{rec.plan.company}</h4>
                              <p className="text-gray-600 font-assistant text-sm">{getPlanName(rec.plan)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Price & Savings */}
                        <div className="lg:col-span-3 space-y-2">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-800 font-heebo">
                              ₪{getPlanPrice(rec.plan)}
                            </div>
                            <div className="text-sm text-gray-500 font-assistant">לחודש</div>
                          </div>
                          <div className="bg-green-100 rounded-lg p-2 text-center">
                            <div className="text-lg font-bold text-green-700 font-heebo">
                              ₪{rec.savings.monthlySavings}
                            </div>
                            <div className="text-xs text-green-600 font-assistant">חיסכון חודשי</div>
                          </div>
                        </div>

                        {/* Score & Progress */}
                        <div className="lg:col-span-3 space-y-3">
                          <div className="text-center">
                            <div className={`text-2xl font-bold font-heebo ${getScoreColor(rec.score).replace('bg-', 'text-').replace('-50', '-600')}`}>
                              {Math.round(rec.score)}/100
                            </div>
                            <div className="text-sm text-gray-500 font-assistant">ציון התאמה</div>
                          </div>
                          <Progress value={rec.score} className="h-2" />
                          <Badge className={`${getConfidenceColor(rec.confidence)} w-full justify-center`}>
                            {rec.confidence === 'high' ? 'ביטחון גבוה' : 
                             rec.confidence === 'medium' ? 'ביטחון בינוני' : 'ביטחון נמוך'}
                          </Badge>
                        </div>

                        {/* Features & Details */}
                        <div className="lg:col-span-3">
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {getPlanFeatures(rec.plan).slice(0, 4).map((feature: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-sm text-gray-600 font-assistant">
                              {rec.savings.percentageSaving.toFixed(1)}% חיסכון • {getPlanFeatures(rec.plan).length} תכונות
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Match Reasons (Expandable) */}
                      {rec.matchReasons.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <details className="group">
                            <summary className="flex items-center justify-between cursor-pointer text-purple-700 font-semibold hover:text-purple-800">
                              <span className="font-heebo">למה מתאים לכם ({rec.matchReasons.length} סיבות)</span>
                              <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                              {rec.matchReasons.map((reason, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-gray-700 font-assistant">{reason}</span>
                                </div>
                              ))}
                            </div>
                          </details>
                        </div>
                      )}

                      {/* Warnings (if any) */}
                      {rec.warnings.length > 0 && (
                        <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-sm font-semibold text-orange-800 font-heebo">שימו לב:</span>
                              <div className="text-sm text-orange-700 font-assistant mt-1">
                                {rec.warnings.join(' • ')}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Summary Comparison Table */}
              <Card>
                <CardHeader>
                  <h4 className="text-lg font-bold text-purple-800 font-heebo flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    סיכום השוואה מהיר
                  </h4>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-purple-50 to-purple-100">
                          <th className="border border-purple-200 p-3 text-right font-heebo">דירוג</th>
                          <th className="border border-purple-200 p-3 text-right font-heebo">חברה</th>
                          <th className="border border-purple-200 p-3 text-center font-heebo">מחיר חודשי</th>
                          <th className="border border-purple-200 p-3 text-center font-heebo">חיסכון</th>
                          <th className="border border-purple-200 p-3 text-center font-heebo">ציון</th>
                          <th className="border border-purple-200 p-3 text-center font-heebo">ביטחון</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recommendations.slice(0, 5).map((rec, index) => (
                          <tr key={index} className={`${
                            index === 0 ? 'bg-green-50' : 
                            index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                          } hover:bg-purple-50 transition-colors`}>
                            <td className="border border-purple-200 p-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                  index === 0 ? 'bg-yellow-500' : 'bg-gray-400'
                                }`}>
                                  {index + 1}
                                </div>
                                {index === 0 && <Star className="w-4 h-4 text-yellow-500" />}
                              </div>
                            </td>
                            <td className="border border-purple-200 p-3">
                              <div className="font-semibold font-heebo">{rec.plan.company}</div>
                              <div className="text-sm text-gray-600 font-assistant">{getPlanName(rec.plan)}</div>
                            </td>
                            <td className="border border-purple-200 p-3 text-center">
                              <div className="font-bold text-lg font-heebo">₪{getPlanPrice(rec.plan)}</div>
                            </td>
                            <td className="border border-purple-200 p-3 text-center">
                              <div className="font-bold text-green-600 font-heebo">₪{rec.savings.monthlySavings}</div>
                              <div className="text-xs text-green-500">{rec.savings.percentageSaving.toFixed(1)}%</div>
                            </td>
                            <td className="border border-purple-200 p-3 text-center">
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(rec.score)}`}>
                                {Math.round(rec.score)}
                              </div>
                            </td>
                            <td className="border border-purple-200 p-3 text-center">
                              <Badge className={getConfidenceColor(rec.confidence)}>
                                {rec.confidence === 'high' ? 'גבוהה' : 
                                 rec.confidence === 'medium' ? 'בינונית' : 'נמוכה'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-purple-800 font-heebo flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                ניתוח עמוק וחכם של המסלולים
              </h3>
              
              {/* Enhanced Financial Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader className="pb-3">
                    <h4 className="font-bold text-green-800 font-heebo flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      ניתוח חיסכון פיננסי
                    </h4>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-assistant text-gray-600">חיסכון ממוצע חודשי:</span>
                        <span className="font-bold text-green-600 font-heebo text-lg">
                          ₪{Math.round(recommendations.reduce((sum, rec) => sum + rec.savings.monthlySavings, 0) / recommendations.length)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="font-assistant text-gray-600">חיסכון שנתי פוטנציאלי:</span>
                        <span className="font-bold text-green-600 font-heebo text-xl">
                          ₪{(Math.round(recommendations.reduce((sum, rec) => sum + rec.savings.monthlySavings, 0) / recommendations.length) * 12).toLocaleString()}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="font-assistant text-gray-600">חיסכון מקסימלי אפשרי:</span>
                        <span className="font-bold text-green-700 font-heebo text-lg">
                          ₪{Math.max(...recommendations.map(rec => rec.savings.monthlySavings))}
                        </span>
                      </div>
                      <div className="bg-green-100 rounded-lg p-3 mt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-800 font-heebo">
                            {Math.round(recommendations.reduce((sum, rec) => sum + rec.savings.percentageSaving, 0) / recommendations.length)}%
                          </div>
                          <div className="text-sm text-green-600 font-assistant">אחוז חיסכון ממוצע</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader className="pb-3">
                    <h4 className="font-bold text-blue-800 font-heebo flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      התאמה אישית מתקדמת
                    </h4>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-assistant text-gray-600">תקציב נוכחי:</span>
                        <span className="font-bold font-heebo text-blue-600">₪{userContext.currentAmount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-assistant text-gray-600">תקציב מומלץ:</span>
                        <span className="font-bold font-heebo text-blue-700">₪{userContext.budget}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="font-assistant text-gray-600">דפוס שימוש:</span>
                        <Badge className={`
                          ${userContext.usage === 'heavy' ? 'bg-red-100 text-red-800' : 
                            userContext.usage === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'}
                        `}>
                          {userContext.usage === 'light' ? 'קל' : 
                           userContext.usage === 'medium' ? 'בינוני' : 'כבד'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-assistant text-gray-600">ספק נוכחי:</span>
                        <span className="font-bold font-heebo text-gray-800">{userContext.currentProvider}</span>
                      </div>
                    </div>
                    
                    <div className="bg-blue-100 rounded-lg p-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-800 font-heebo">
                          {recommendations.filter(r => r.confidence === 'high').length} מתוך {recommendations.length}
                        </div>
                        <div className="text-sm text-blue-600 font-assistant">מסלולים בביטחון גבוה</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardHeader className="pb-3">
                    <h4 className="font-bold text-purple-800 font-heebo flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      איכות ואמינות
                    </h4>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white rounded-lg p-4 space-y-3">
                      <div className="text-center mb-3">
                        <div className="text-2xl font-bold text-purple-800 font-heebo">
                          {Math.round(recommendations.reduce((sum, rec) => sum + rec.score, 0) / recommendations.length)}
                        </div>
                        <div className="text-sm text-purple-600 font-assistant">ציון איכות ממוצע</div>
                      </div>
                      
                      <div className="space-y-2">
                        {[
                          { label: 'מעולה (80+)', count: recommendations.filter(r => r.score >= 80).length, color: 'bg-green-500' },
                          { label: 'טוב (60-79)', count: recommendations.filter(r => r.score >= 60 && r.score < 80).length, color: 'bg-yellow-500' },
                          { label: 'בסיסי (40-59)', count: recommendations.filter(r => r.score < 60).length, color: 'bg-red-500' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                              <span className="text-sm font-assistant">{item.label}</span>
                            </div>
                            <span className="font-bold font-heebo">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Match Quality Analysis */}
              <Card>
                <CardHeader>
                  <h4 className="font-bold text-purple-800 font-heebo flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    ניתוח התאמה מתקדם לכל מסלול
                  </h4>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className={`p-6 border-2 rounded-xl ${
                        index === 0 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
                      } hover:shadow-lg transition-all duration-300`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold ${
                              index === 0 ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                              index === 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 
                              'bg-gradient-to-r from-purple-500 to-purple-600'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <h5 className="text-lg font-bold font-heebo text-gray-800">{rec.plan.company}</h5>
                              <p className="text-gray-600 font-assistant">{getPlanName(rec.plan)}</p>
                            </div>
                            {index === 0 && (
                              <Badge className="bg-green-500 text-white">
                                <Star className="w-3 h-3 ml-1" />
                                הכי מתאים
                              </Badge>
                            )}
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold font-heebo text-purple-800">{Math.round(rec.score)}</div>
                            <div className="text-sm text-gray-500 font-assistant">ציון התאמה</div>
                            <Progress value={rec.score} className="w-20 h-2 mt-2" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white rounded-lg p-4 border">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="font-semibold text-green-700 font-assistant">חיסכון</span>
                            </div>
                            <div className="text-xl font-bold text-green-800 font-heebo">
                              ₪{rec.savings.monthlySavings}
                            </div>
                            <div className="text-sm text-green-600 font-assistant">
                              {rec.savings.percentageSaving.toFixed(1)}% חיסכון
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold text-blue-700 font-assistant">תקופת החזר</span>
                            </div>
                            <div className="text-xl font-bold text-blue-800 font-heebo">
                              {Math.ceil(100 / rec.savings.percentageSaving)} חודשים
                            </div>
                            <div className="text-sm text-blue-600 font-assistant">להחזר השקעה</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border">
                            <div className="flex items-center gap-2 mb-2">
                              <Lightbulb className="w-4 h-4 text-purple-600" />
                              <span className="font-semibold text-purple-700 font-assistant">המלצה</span>
                            </div>
                            <Badge className={getConfidenceColor(rec.confidence)}>
                              {rec.confidence === 'high' ? 'מומלץ בחום' : 
                               rec.confidence === 'medium' ? 'כדאי לשקול' : 'בדקו היטב'}
                            </Badge>
                          </div>
                        </div>

                        {/* Detailed Analysis for Top Recommendation */}
                        {index === 0 && (
                          <div className="mt-6 p-4 bg-green-100 rounded-lg">
                            <h6 className="font-bold text-green-800 font-heebo mb-3 flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              למה זה הבחירה הטובה ביותר עבורכם:
                            </h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {rec.matchReasons.slice(0, 4).map((reason, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-green-800 font-assistant">{reason}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* ROI Analysis */}
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardHeader>
                  <h4 className="font-bold text-purple-800 font-heebo flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    ניתוח החזר השקעה (ROI) ופוטנציאל חיסכון
                  </h4>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        title: "חיסכון בשנה הראשונה",
                        value: `₪${(topRecommendation?.savings.monthlySavings * 12).toLocaleString() || 0}`,
                        subtitle: "לפי המסלול המומלץ",
                        icon: TrendingUp,
                        color: "text-green-600"
                      },
                      {
                        title: "חיסכון תלת-שנתי",
                        value: `₪${((topRecommendation?.savings.monthlySavings * 36) || 0).toLocaleString()}`,
                        subtitle: "פוטנציאל ארוך טווח",
                        icon: Target,
                        color: "text-blue-600"
                      },
                      {
                        title: "זמן החזר השקעה",
                        value: `${Math.ceil(100 / (topRecommendation?.savings.percentageSaving || 1))} חודשים`,
                        subtitle: "עד למימוש החיסכון",
                        icon: Clock,
                        color: "text-purple-600"
                      },
                      {
                        title: "יעילות החיסכון",
                        value: `${Math.round((topRecommendation?.savings.percentageSaving || 0) * 10) / 10}%`,
                        subtitle: "מהתקציב הנוכחי",
                        icon: Zap,
                        color: "text-orange-600"
                      }
                    ].map((metric, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <metric.icon className={`w-5 h-5 ${metric.color}`} />
                          <span className="font-semibold font-assistant text-gray-700">{metric.title}</span>
                        </div>
                        <div className={`text-2xl font-bold font-heebo ${metric.color}`}>
                          {metric.value}
                        </div>
                        <div className="text-sm text-gray-500 font-assistant mt-1">
                          {metric.subtitle}
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