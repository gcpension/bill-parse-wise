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
  Lightbulb,
  Brain,
  BarChart3,
  Sparkles,
  Award
} from 'lucide-react';
import { ManualPlan } from '@/data/manual-plans';
import { ComparisonMatrix, DetailedComparison } from '@/lib/comparisonAnalyzer';
import { cn } from '@/lib/utils';

interface SmartComparisonTableProps {
  comparisonMatrix: ComparisonMatrix;
  plans: ManualPlan[];
  onPlanSelect?: (plan: ManualPlan) => void;
}

export const SmartComparisonTable = ({ comparisonMatrix, plans, onPlanSelect }: SmartComparisonTableProps) => {
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

  const getInsightIcon = (type: 'advantage' | 'disadvantage' | 'neutral' | 'warning' | 'opportunity' | 'trend') => {
    switch (type) {
      case 'advantage': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'disadvantage': return <X className="w-4 h-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'opportunity': return <TrendingUp className="w-4 h-4 text-primary" />;
      case 'trend': return <Sparkles className="w-4 h-4 text-purple-600" />;
      default: return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* AI Analysis Header */}
      <div className="text-center bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-purple-200/30">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent font-heebo">
            ניתוח AI מתקדם
          </h2>
        </div>
        <p className="text-muted-foreground text-lg font-assistant">
          הניתוח בוצע בעזרת בינה מלאכותית לספק לכם את ההמלצות הטובות ביותר
        </p>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-success/10 via-emerald-50 to-success/5 border-2 border-success/30 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Crown className="w-6 h-6 text-success" />
              <h3 className="font-bold text-success font-heebo">המוביל הכללי</h3>
            </div>
            <div className="text-xl font-black text-success">
              {getPlan(comparisonMatrix.summary.bestOverall)?.company}
            </div>
            <div className="text-sm text-success/80 mt-1 font-assistant">
              {getPlan(comparisonMatrix.summary.bestOverall)?.planName}
            </div>
            <Badge className="mt-2 bg-success/20 text-success border-success/30">
              ציון: {comparisonMatrix.plans.find(p => p.planId === comparisonMatrix.summary.bestOverall)?.score.overall}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 via-blue-50 to-primary/5 border-2 border-primary/30 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h3 className="font-bold text-primary font-heebo">יחס מחיר-ביצועים</h3>
            </div>
            <div className="text-xl font-black text-primary">
              {getPlan(comparisonMatrix.summary.bestValue)?.company}
            </div>
            <div className="text-sm text-primary/80 mt-1 font-assistant">הכדאי ביותר</div>
            <Badge className="mt-2 bg-primary/20 text-primary border-primary/30">
              ערך מעולה
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-100/50 via-violet-50 to-purple-100/30 border-2 border-purple-300/30 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Star className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-purple-600 font-heebo">עשיר בתכונות</h3>
            </div>
            <div className="text-xl font-black text-purple-600">
              {getPlan(comparisonMatrix.summary.bestFeatures)?.company}
            </div>
            <div className="text-sm text-purple-600/80 mt-1 font-assistant">מספר התכונות הגבוה</div>
            <Badge className="mt-2 bg-purple-100 text-purple-700 border-purple-300">
              תכונות רבות
            </Badge>
          </CardContent>
        </Card>

      </div>

      {/* Enhanced Comparison Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200/30">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            סקירה כללית
          </TabsTrigger>
          <TabsTrigger value="detailed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            השוואה מפורטת
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            תובנות AI
          </TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
            מטריצת תכונות
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Target className="w-7 h-7 text-primary" />
                דירוג המסלולים המושווים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {comparisonMatrix.plans.map((comparison) => {
                  const plan = getPlan(comparison.planId);
                  if (!plan) return null;

                  return (
                    <div key={comparison.planId} className={cn(
                      "p-8 rounded-3xl border-2 transition-all duration-300 hover:shadow-2xl animate-fade-in",
                      comparison.rank === 1 
                        ? "bg-gradient-to-r from-success/10 via-emerald-50 to-success/10 border-success/40 shadow-success/20 shadow-lg"
                        : comparison.rank === 2
                        ? "bg-gradient-to-r from-primary/10 via-blue-50 to-primary/10 border-primary/40"
                        : "bg-gradient-to-r from-card via-accent/5 to-card border-border/50"
                    )}>
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <Badge className={cn(
                              "text-2xl font-black px-6 py-3 shadow-xl",
                              comparison.rank === 1 
                                ? "bg-gradient-to-r from-success to-green-600 text-white shadow-success/30" 
                                : comparison.rank === 2
                                ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-primary/30"
                                : "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
                            )}>
                              #{comparison.rank}
                            </Badge>
                            {comparison.rank === 1 && (
                              <Crown className="absolute -top-3 -right-3 w-8 h-8 text-success animate-bounce" />
                            )}
                            {comparison.rank === 2 && (
                              <Award className="absolute -top-3 -right-3 w-8 h-8 text-primary animate-pulse" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-3xl font-black text-foreground font-heebo">{plan.company}</h3>
                            <p className="text-xl text-muted-foreground font-medium font-assistant">{plan.planName}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <div className={cn("px-4 py-2 rounded-full text-base font-bold", getScoreBgColor(comparison.score.overall))}>
                                <span className={getScoreColor(comparison.score.overall)}>
                                  <Sparkles className="w-4 h-4 inline ml-1" />
                                  {comparison.score.overall} נקודות
                                </span>
                              </div>
                              <Badge className="bg-primary/10 text-primary border-primary/30 text-base px-3 py-1">
                                {formatPrice(plan)}
                                {plan.category !== 'electricity' && '/חודש'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-8">
                          {/* Enhanced Score Breakdown */}
                          <div className="hidden lg:grid grid-cols-2 gap-4">
                            <div className="text-center p-4 bg-white/80 rounded-2xl border-2 border-border/30 shadow-sm">
                              <div className={cn("text-2xl font-bold", getScoreColor(comparison.score.value))}>
                                {comparison.score.value}
                              </div>
                              <div className="text-sm text-muted-foreground font-assistant">יחס מחיר</div>
                            </div>
                            <div className="text-center p-4 bg-white/80 rounded-2xl border-2 border-border/30 shadow-sm">
                              <div className={cn("text-2xl font-bold", getScoreColor(comparison.score.features))}>
                                {comparison.score.features}
                              </div>
                              <div className="text-sm text-muted-foreground font-assistant">תכונות</div>
                            </div>
                          </div>
                          
                          <Button 
                            className={cn(
                              "font-bold text-xl px-10 py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105",
                              comparison.rank === 1 
                                ? "bg-gradient-to-r from-success to-green-600 hover:from-success/90 hover:to-green-600/90 text-white shadow-success/30" 
                                : comparison.rank === 2
                                ? "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-primary/30"
                                : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                            )}
                            onClick={() => onPlanSelect?.(plan)}
                          >
                            {comparison.rank === 1 ? (
                              <>
                                <Crown className="w-6 h-6 ml-3" />
                                בחר במוביל
                              </>
                            ) : comparison.rank === 2 ? (
                              <>
                                <Award className="w-6 h-6 ml-3" />
                                בחר במועמד השני
                              </>
                            ) : (
                              <>
                                <ArrowRight className="w-6 h-6 ml-3" />
                                בחר מסלול
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Enhanced Key Points */}
                      {(comparison.strongPoints.length > 0 || comparison.bestFor.length > 0) && (
                        <div className="mt-8 pt-8 border-t-2 border-border/30">
                          <div className="grid md:grid-cols-2 gap-8">
                            {comparison.strongPoints.length > 0 && (
                              <div>
                                <h4 className="font-bold text-success mb-4 flex items-center gap-3 text-lg">
                                  <ThumbsUp className="w-5 h-5" />
                                  נקודות חוזק מובילות
                                </h4>
                                <ul className="space-y-3">
                                  {comparison.strongPoints.slice(0, 3).map((point, index) => (
                                    <li key={index} className="flex items-center gap-3 text-base">
                                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                                      <span className="font-assistant">{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {comparison.bestFor.length > 0 && (
                              <div>
                                <h4 className="font-bold text-primary mb-4 flex items-center gap-3 text-lg">
                                  <Target className="w-5 h-5" />
                                  מומלץ במיוחד עבור
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                  {comparison.bestFor.slice(0, 4).map((use, index) => (
                                    <Badge key={index} variant="outline" className="bg-primary/10 text-primary border-primary/30 text-sm px-3 py-1 font-assistant">
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
              <CardTitle className="flex items-center gap-3 text-2xl">
                <BarChart3 className="w-7 h-7 text-primary" />
                השוואה מפורטת - ציונים וביצועים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-50 to-blue-50">
                      <th className="text-right p-6 font-bold border-b-2 border-border rounded-tl-xl">מסלול</th>
                      <th className="text-center p-6 font-bold border-b-2 border-border">דירוג</th>
                      <th className="text-center p-6 font-bold border-b-2 border-border">ציון כללי</th>
                      <th className="text-center p-6 font-bold border-b-2 border-border">יחס מחיר</th>
                      <th className="text-center p-6 font-bold border-b-2 border-border">תכונות</th>
                      <th className="text-center p-6 font-bold border-b-2 border-border">נוחות</th>
                      <th className="text-center p-6 font-bold border-b-2 border-border rounded-tr-xl">מחיר</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonMatrix.plans.map((comparison) => {
                      const plan = getPlan(comparison.planId);
                      if (!plan) return null;

                      return (
                        <tr key={comparison.planId} className={cn(
                          "border-b hover:bg-muted/30 transition-colors",
                          comparison.rank === 1 && "bg-success/5 hover:bg-success/10"
                        )}>
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              {comparison.rank === 1 && <Crown className="w-6 h-6 text-success" />}
                              <div>
                                <div className="font-bold text-lg font-heebo">{plan.company}</div>
                                <div className="text-sm text-muted-foreground font-assistant">{plan.planName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center p-6">
                            <Badge className={cn(
                              "font-bold text-base px-4 py-2",
                              comparison.rank === 1 ? "bg-success text-white shadow-lg" :
                              comparison.rank === 2 ? "bg-primary text-white shadow-lg" :
                              "bg-muted text-muted-foreground"
                            )}>
                              #{comparison.rank}
                            </Badge>
                          </td>
                          <td className="text-center p-6">
                            <div className={cn("text-2xl font-bold", getScoreColor(comparison.score.overall))}>
                              {comparison.score.overall}
                            </div>
                          </td>
                          <td className="text-center p-6">
                            <div className={cn("text-xl font-bold", getScoreColor(comparison.score.value))}>
                              {comparison.score.value}
                            </div>
                          </td>
                          <td className="text-center p-6">
                            <div className={cn("text-xl font-bold", getScoreColor(comparison.score.features))}>
                              {comparison.score.features}
                            </div>
                          </td>
                          <td className="text-center p-6">
                            <div className={cn("text-xl font-bold", getScoreColor(comparison.score.usability))}>
                              {comparison.score.usability}
                            </div>
                          </td>
                          <td className="text-center p-6">
                            <Badge className="text-base px-3 py-1 bg-primary/10 text-primary border-primary/30">
                              {formatPrice(plan)}
                            </Badge>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Lightbulb className="w-7 h-7 text-primary" />
                תובנות AI מתקדמות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {comparisonMatrix.plans.map((comparison) => {
                  const plan = getPlan(comparison.planId);
                  if (!plan) return null;

                  return (
                    <div key={comparison.planId} className="bg-gradient-to-r from-card via-accent/5 to-card rounded-2xl p-8 border-2 border-border/30">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <Badge className={cn(
                            "text-lg font-bold px-4 py-2",
                            comparison.rank === 1 ? "bg-success text-white" :
                            comparison.rank === 2 ? "bg-primary text-white" :
                            "bg-muted text-muted-foreground"
                          )}>
                            #{comparison.rank}
                          </Badge>
                          <div>
                            <h3 className="text-2xl font-bold font-heebo">{plan.company}</h3>
                            <p className="text-lg text-muted-foreground font-assistant">{plan.planName}</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">{comparison.score.overall}</div>
                          <div className="text-sm text-muted-foreground">ציון כללי</div>
                        </div>
                      </div>

                      {comparison.insights.length > 0 && (
                        <div className="grid md:grid-cols-3 gap-6">
                          {/* Advantages */}
                          <div>
                            <h4 className="font-bold text-success mb-4 flex items-center gap-2 text-lg">
                              <ThumbsUp className="w-5 h-5" />
                              יתרונות
                            </h4>
                            <div className="space-y-3">
                              {comparison.insights
                                .filter(insight => insight.type === 'advantage')
                                .slice(0, 3)
                                .map((insight, index) => (
                                  <div key={index} className="bg-success/10 rounded-xl p-4 border border-success/30">
                                    <div className="flex items-start gap-3">
                                      {getInsightIcon(insight.type)}
                                      <div>
                                        <h5 className="font-bold text-success text-sm">{insight.title}</h5>
                                        <p className="text-xs text-success/80 mt-1">{insight.description}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {/* Disadvantages */}
                          <div>
                            <h4 className="font-bold text-destructive mb-4 flex items-center gap-2 text-lg">
                              <X className="w-5 h-5" />
                              חסרונות
                            </h4>
                            <div className="space-y-3">
                              {comparison.insights
                                .filter(insight => insight.type === 'disadvantage')
                                .slice(0, 3)
                                .map((insight, index) => (
                                  <div key={index} className="bg-destructive/10 rounded-xl p-4 border border-destructive/30">
                                    <div className="flex items-start gap-3">
                                      {getInsightIcon(insight.type)}
                                      <div>
                                        <h5 className="font-bold text-destructive text-sm">{insight.title}</h5>
                                        <p className="text-xs text-destructive/80 mt-1">{insight.description}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>

                          {/* Opportunities & Trends */}
                          <div>
                            <h4 className="font-bold text-primary mb-4 flex items-center gap-2 text-lg">
                              <TrendingUp className="w-5 h-5" />
                              הזדמנות ומגמות
                            </h4>
                            <div className="space-y-3">
                              {comparison.insights
                                .filter(insight => ['opportunity', 'trend'].includes(insight.type))
                                .slice(0, 3)
                                .map((insight, index) => (
                                  <div key={index} className="bg-primary/10 rounded-xl p-4 border border-primary/30">
                                    <div className="flex items-start gap-3">
                                      {getInsightIcon(insight.type)}
                                      <div>
                                        <h5 className="font-bold text-primary text-sm">{insight.title}</h5>
                                        <p className="text-xs text-primary/80 mt-1">{insight.description}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
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

        {/* Features Matrix Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Star className="w-7 h-7 text-primary" />
                מטריצת תכונות מפורטת
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-50 to-blue-50">
                      <th className="text-right p-4 font-bold border-b-2 border-border rounded-tl-xl">תכונה</th>
                      {comparisonMatrix.plans.map((comparison) => {
                        const plan = getPlan(comparison.planId);
                        if (!plan) return null;
                        return (
                          <th key={comparison.planId} className="text-center p-4 font-bold border-b-2 border-border">
                            <div className="flex flex-col items-center gap-2">
                              <div className="font-bold">{plan.company}</div>
                              <Badge className={cn(
                                "text-xs",
                                comparison.rank === 1 ? "bg-success text-white" :
                                comparison.rank === 2 ? "bg-primary text-white" :
                                "bg-muted text-muted-foreground"
                              )}>
                                #{comparison.rank}
                              </Badge>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Get all unique features */}
                    {[...new Set(plans.flatMap(p => p.features))].map((feature, index) => (
                      <tr key={feature} className={cn(
                        "hover:bg-muted/30 transition-colors",
                        index % 2 === 0 ? "bg-muted/10" : "bg-transparent"
                      )}>
                        <td className="p-4 font-medium text-right border-b border-border/30">
                          {feature}
                        </td>
                        {comparisonMatrix.plans.map((comparison) => {
                          const plan = getPlan(comparison.planId);
                          if (!plan) return null;
                          const hasFeature = plan.features.includes(feature);
                          return (
                            <td key={comparison.planId} className="text-center p-4 border-b border-border/30">
                              {hasFeature ? (
                                <CheckCircle className="w-6 h-6 text-success mx-auto" />
                              ) : (
                                <X className="w-6 h-6 text-destructive/50 mx-auto" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
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