import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  X, 
  TrendingUp, 
  Star, 
  Zap, 
  Crown,
  Info,
  Target,
  ArrowRight,
  ThumbsUp,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { ManualPlan } from '@/data/manual-plans';
import { ComparisonMatrix, DetailedComparison } from '@/lib/comparisonAnalyzer';
import { cn } from '@/lib/utils';

interface SmartComparisonTableProps {
  comparisonMatrix: ComparisonMatrix;
  plans: ManualPlan[];
  onPlanSelect?: (plan: ManualPlan) => void;
}

const SmartComparisonTable = ({ comparisonMatrix, plans, onPlanSelect }: SmartComparisonTableProps) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const getPlan = (planId: string) => plans.find(p => p.id === planId);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };
  
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-success/10 border-success/30';
    if (score >= 60) return 'bg-primary/10 border-primary/30';
    if (score >= 40) return 'bg-warning/10 border-warning/30';
    return 'bg-destructive/10 border-destructive/30';
  };

  const formatPrice = (plan: ManualPlan) => {
    if (plan.category === 'electricity') {
      return plan.speed; // For electricity, speed is the discount percentage
    }
    return `₪${plan.regularPrice}`;
  };

  const getInsightIcon = (type: 'advantage' | 'disadvantage' | 'neutral' | 'warning') => {
    switch (type) {
      case 'advantage': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'disadvantage': return <X className="w-4 h-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      default: return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-success/10 to-emerald-100/50 border-2 border-success/30">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Crown className="w-6 h-6 text-success" />
              <h3 className="font-bold text-success">המוביל הכללי</h3>
            </div>
            <div className="text-lg font-black text-success">
              {getPlan(comparisonMatrix.summary.bestOverall)?.company}
            </div>
            <div className="text-sm text-success/80 mt-1">
              {getPlan(comparisonMatrix.summary.bestOverall)?.planName}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-primary/10 to-blue-100/50 border-2 border-primary/30">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h3 className="font-bold text-primary">יחס מחיר-ביצועים</h3>
            </div>
            <div className="text-lg font-black text-primary">
              {getPlan(comparisonMatrix.summary.bestValue)?.company}
            </div>
            <div className="text-sm text-primary/80 mt-1">הכדאי ביותר</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-100/50 to-violet-100/50 border-2 border-purple-300/30">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Star className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-purple-600">עשיר בתכונות</h3>
            </div>
            <div className="text-lg font-black text-purple-600">
              {getPlan(comparisonMatrix.summary.bestFeatures)?.company}
            </div>
            <div className="text-sm text-purple-600/80 mt-1">מספר התכונות הגבוה</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-100/50 to-amber-100/50 border-2 border-orange-300/30">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Zap className="w-6 h-6 text-orange-600" />
              <h3 className="font-bold text-orange-600">הכי אמין</h3>
            </div>
            <div className="text-lg font-black text-orange-600">
              {getPlan(comparisonMatrix.summary.mostReliable)?.company}
            </div>
            <div className="text-sm text-orange-600/80 mt-1">ציון אמינות גבוה</div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Comparison Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            סקירה כללית
          </TabsTrigger>
          <TabsTrigger value="detailed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            השוואה מפורטת
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            תובנות AI
          </TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            מטריצת תכונות
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                סקירת המסלולים המושווים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comparisonMatrix.plans.map((comparison) => {
                  const plan = getPlan(comparison.planId);
                  if (!plan) return null;

                  return (
                    <div key={comparison.planId} className={cn(
                      "p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg",
                      comparison.rank === 1 
                        ? "bg-gradient-to-r from-success/10 via-emerald-50 to-success/10 border-success/30"
                        : "bg-gradient-to-r from-card via-accent/5 to-card border-border/50"
                    )}>
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Badge className={cn(
                              "text-lg font-black px-4 py-2 shadow-lg",
                              comparison.rank === 1 
                                ? "bg-gradient-to-r from-success to-green-600 text-white" 
                                : comparison.rank === 2
                                ? "bg-gradient-to-r from-primary to-blue-600 text-white"
                                : "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
                            )}>
                              #{comparison.rank}
                            </Badge>
                            {comparison.rank === 1 && (
                              <Crown className="absolute -top-2 -right-2 w-6 h-6 text-success animate-pulse" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-foreground">{plan.company}</h3>
                            <p className="text-lg text-muted-foreground font-medium">{plan.planName}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <div className={cn("px-3 py-1 rounded-full text-sm font-bold", getScoreBgColor(comparison.score.overall))}>
                                <span className={getScoreColor(comparison.score.overall)}>
                                  {comparison.score.overall} נקודות
                                </span>
                              </div>
                              <Badge className="bg-primary/10 text-primary border-primary/30">
                                {formatPrice(plan)}
                                {plan.category !== 'electricity' && '/חודש'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          {/* Score Breakdown */}
                          <div className="hidden lg:grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-white/50 rounded-xl border">
                              <div className={cn("text-xl font-bold", getScoreColor(comparison.score.value))}>
                                {comparison.score.value}
                              </div>
                              <div className="text-xs text-muted-foreground">יחס מחיר</div>
                            </div>
                            <div className="text-center p-3 bg-white/50 rounded-xl border">
                              <div className={cn("text-xl font-bold", getScoreColor(comparison.score.features))}>
                                {comparison.score.features}
                              </div>
                              <div className="text-xs text-muted-foreground">תכונות</div>
                            </div>
                          </div>
                          
                          <Button 
                            className={cn(
                              "font-bold text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300",
                              comparison.rank === 1 
                                ? "bg-gradient-to-r from-success to-green-600 hover:from-success/90 hover:to-green-600/90 text-white" 
                                : "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
                            )}
                            onClick={() => onPlanSelect?.(plan)}
                          >
                            {comparison.rank === 1 ? (
                              <>
                                <Crown className="w-5 h-5 mr-2" />
                                בחר במוביל
                              </>
                            ) : (
                              <>
                                <ArrowRight className="w-5 h-5 mr-2" />
                                בחר מסלול
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Key Points */}
                      {(comparison.strongPoints.length > 0 || comparison.weakPoints.length > 0) && (
                        <div className="mt-6 pt-4 border-t border-border/50">
                          <div className="grid md:grid-cols-2 gap-6">
                            {comparison.strongPoints.length > 0 && (
                              <div>
                                <h4 className="font-bold text-success mb-3 flex items-center gap-2">
                                  <ThumbsUp className="w-4 h-4" />
                                  נקודות חוזק
                                </h4>
                                <ul className="space-y-2">
                                  {comparison.strongPoints.slice(0, 3).map((point, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm">
                                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {comparison.bestFor.length > 0 && (
                              <div>
                                <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                                  <Target className="w-4 h-4" />
                                  מומלץ עבור
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {comparison.bestFor.slice(0, 3).map((use, index) => (
                                    <Badge key={index} variant="outline" className="bg-primary/5 text-primary border-primary/30 text-xs">
                                      {use}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detailed Comparison Tab */}
        <TabsContent value="detailed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>השוואה מפורטת - ציונים וביצועים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-right p-4 font-bold">מסלול</th>
                      <th className="text-center p-4 font-bold">דירוג</th>
                      <th className="text-center p-4 font-bold">ציון כללי</th>
                      <th className="text-center p-4 font-bold">יחס מחיר</th>
                      <th className="text-center p-4 font-bold">תכונות</th>
                      <th className="text-center p-4 font-bold">נוחות</th>
                      <th className="text-center p-4 font-bold">אמינות</th>
                      <th className="text-center p-4 font-bold">מחיר</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonMatrix.plans.map((comparison) => {
                      const plan = getPlan(comparison.planId);
                      if (!plan) return null;

                      return (
                        <tr key={comparison.planId} className={cn(
                          "border-b hover:bg-muted/30 transition-colors",
                          comparison.rank === 1 && "bg-success/5"
                        )}>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {comparison.rank === 1 && <Crown className="w-5 h-5 text-success" />}
                              <div>
                                <div className="font-bold">{plan.company}</div>
                                <div className="text-sm text-muted-foreground">{plan.planName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center p-4">
                            <Badge className={cn(
                              "font-bold",
                              comparison.rank === 1 ? "bg-success text-white" :
                              comparison.rank === 2 ? "bg-primary text-white" :
                              "bg-muted text-muted-foreground"
                            )}>
                              #{comparison.rank}
                            </Badge>
                          </td>
                          <td className="text-center p-4">
                            <div className={cn("text-xl font-bold", getScoreColor(comparison.score.overall))}>
                              {comparison.score.overall}
                            </div>
                          </td>
                          <td className="text-center p-4">
                            <div className={cn("text-lg font-bold", getScoreColor(comparison.score.value))}>
                              {comparison.score.value}
                            </div>
                          </td>
                          <td className="text-center p-4">
                            <div className={cn("text-lg font-bold", getScoreColor(comparison.score.features))}>
                              {comparison.score.features}
                            </div>
                          </td>
                          <td className="text-center p-4">
                            <div className={cn("text-lg font-bold", getScoreColor(comparison.score.usability))}>
                              {comparison.score.usability}
                            </div>
                          </td>
                          <td className="text-center p-4">
                            <div className={cn("text-lg font-bold", getScoreColor(comparison.score.reliability))}>
                              {comparison.score.reliability}
                            </div>
                          </td>
                          <td className="text-center p-4">
                            <div className="font-bold text-primary">
                              {formatPrice(plan)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          {comparisonMatrix.plans.map((comparison) => {
            const plan = getPlan(comparison.planId);
            if (!plan || comparison.insights.length === 0) return null;

            return (
              <Card key={comparison.planId} className={cn(
                "transition-all duration-300 hover:shadow-lg",
                comparison.rank === 1 && "border-2 border-success/30"
              )}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-primary" />
                    תובנות AI עבור {plan.company}
                    {comparison.rank === 1 && <Crown className="w-5 h-5 text-success" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {comparison.insights.map((insight, index) => (
                      <div key={index} className={cn(
                        "p-4 rounded-xl border-2",
                        insight.type === 'advantage' && "bg-success/10 border-success/30",
                        insight.type === 'disadvantage' && "bg-destructive/10 border-destructive/30",
                        insight.type === 'warning' && "bg-warning/10 border-warning/30",
                        insight.type === 'neutral' && "bg-muted/20 border-border"
                      )}>
                        <div className="flex items-start gap-3">
                          {getInsightIcon(insight.type)}
                          <div className="flex-1">
                            <h4 className="font-bold text-sm mb-2">{insight.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {insight.description}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                              <Badge variant="outline" className="text-xs">
                                השפעה: {insight.impact === 'high' ? 'גבוהה' : insight.impact === 'medium' ? 'בינונית' : 'נמוכה'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                ביטחון: {Math.round(insight.confidence * 100)}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Features Matrix Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>מטריצת תכונות מפורטת</CardTitle>
              <p className="text-muted-foreground">השוואה מקיפה של כל התכונות והיכולות</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-right p-4 font-bold sticky left-0 bg-background">תכונה</th>
                      {comparisonMatrix.plans.map((comparison) => {
                        const plan = getPlan(comparison.planId);
                        return (
                          <th key={comparison.planId} className="text-center p-4 font-bold min-w-[120px]">
                            <div className="flex items-center justify-center gap-2">
                              {comparison.rank === 1 && <Crown className="w-4 h-4 text-success" />}
                              <span>{plan?.company}</span>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const allFeatures = [...new Set(plans.flatMap(p => p.features))];
                      return allFeatures.slice(0, 15).map((feature, index) => (
                        <tr key={index} className="border-b hover:bg-muted/20 transition-colors">
                          <td className="p-4 font-medium text-sm sticky left-0 bg-background border-r">
                            {feature}
                          </td>
                          {comparisonMatrix.plans.map((comparison) => {
                            const plan = getPlan(comparison.planId);
                            const hasFeature = plan?.features.includes(feature);
                            
                            return (
                              <td key={comparison.planId} className="text-center p-4">
                                {hasFeature ? (
                                  <CheckCircle className="w-6 h-6 text-success mx-auto" />
                                ) : (
                                  <X className="w-6 h-6 text-muted-foreground mx-auto" />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartComparisonTable;