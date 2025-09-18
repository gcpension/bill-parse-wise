import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Target,
  Zap,
  Star,
  DollarSign,
  Users,
  Award,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { ManualPlan } from '@/data/manual-plans';
import { ComparisonMatrix } from '@/lib/comparisonAnalyzer';
import { cn } from '@/lib/utils';

interface ComparisonAnalyticsProps {
  comparisonMatrix: ComparisonMatrix;
  plans: ManualPlan[];
}

const ComparisonAnalytics = ({ comparisonMatrix, plans }: ComparisonAnalyticsProps) => {
  
  const analytics = useMemo(() => {
    const prices = plans.filter(p => p.category !== 'electricity').map(p => p.regularPrice);
    const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    
    // Score distribution
    const scores = comparisonMatrix.plans.map(p => p.score.overall);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const scoreDistribution = {
      excellent: scores.filter(s => s >= 80).length,
      good: scores.filter(s => s >= 60 && s < 80).length,
      average: scores.filter(s => s >= 40 && s < 60).length,
      poor: scores.filter(s => s < 40).length
    };
    
    // Feature analysis
    const allFeatures = [...new Set(plans.flatMap(p => p.features))];
    const featureCoverage = allFeatures.map(feature => ({
      feature,
      count: plans.filter(p => p.features.includes(feature)).length,
      percentage: (plans.filter(p => p.features.includes(feature)).length / plans.length) * 100
    }));
    
    const mostCommonFeatures = featureCoverage
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Price competitiveness analysis
    const priceCompetitiveness = comparisonMatrix.plans.map(comp => {
      const plan = plans.find(p => p.id === comp.planId);
      if (!plan || plan.category === 'electricity') return null;
      
      return {
        planId: comp.planId,
        company: plan.company,
        price: plan.regularPrice,
        deviation: ((plan.regularPrice - avgPrice) / avgPrice) * 100,
        competitiveness: comp.priceAnalysis.valueRating
      };
    }).filter(Boolean);
    
    return {
      avgPrice,
      maxPrice,
      minPrice,
      avgScore,
      scoreDistribution,
      featureCoverage: mostCommonFeatures,
      priceCompetitiveness
    };
  }, [comparisonMatrix, plans]);

  const formatPrice = (price: number) => `₪${Math.round(price).toLocaleString()}`;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getPriceDeviationIcon = (deviation: number) => {
    if (deviation > 10) return <ArrowUp className="w-4 h-4 text-destructive" />;
    if (deviation < -10) return <ArrowDown className="w-4 h-4 text-success" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-8">
      {/* Key Metrics Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-blue-50 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary font-medium text-sm">ממוצע מחירים</p>
                <p className="text-2xl font-black text-primary">{formatPrice(analytics.avgPrice)}</p>
                <p className="text-xs text-muted-foreground mt-1">לחודש</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-green-50 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-success font-medium text-sm">ציון ממוצע</p>
                <p className="text-2xl font-black text-success">{Math.round(analytics.avgScore)}</p>
                <p className="text-xs text-muted-foreground mt-1">מתוך 100</p>
              </div>
              <Star className="w-8 h-8 text-success/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-100/50 to-violet-50 border-purple-300/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium text-sm">טווח מחירים</p>
                <p className="text-lg font-black text-purple-600">
                  {formatPrice(analytics.minPrice)} - {formatPrice(analytics.maxPrice)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">הפרש: {formatPrice(analytics.maxPrice - analytics.minPrice)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-100/50 to-amber-50 border-orange-300/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 font-medium text-sm">מסלולים מוערכים</p>
                <p className="text-2xl font-black text-orange-600">{analytics.scoreDistribution.excellent}</p>
                <p className="text-xs text-muted-foreground mt-1">ציון 80+</p>
              </div>
              <Award className="w-8 h-8 text-orange-600/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score Distribution Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <PieChart className="w-6 h-6 text-primary" />
            פילוח ציוני המסלולים
          </CardTitle>
          <p className="text-muted-foreground">התפלגות איכות המסלולים לפי ציונים</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-success/10 rounded-xl border border-success/20">
                <div className="text-3xl font-black text-success mb-2">{analytics.scoreDistribution.excellent}</div>
                <div className="text-sm font-medium text-success">מעולים (80+)</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-xl border border-primary/20">
                <div className="text-3xl font-black text-primary mb-2">{analytics.scoreDistribution.good}</div>
                <div className="text-sm font-medium text-primary">טובים (60-79)</div>
              </div>
              <div className="text-center p-4 bg-warning/10 rounded-xl border border-warning/20">
                <div className="text-3xl font-black text-warning mb-2">{analytics.scoreDistribution.average}</div>
                <div className="text-sm font-medium text-warning">בינוניים (40-59)</div>
              </div>
              <div className="text-center p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                <div className="text-3xl font-black text-destructive mb-2">{analytics.scoreDistribution.poor}</div>
                <div className="text-sm font-medium text-destructive">חלשים (40-)</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold">התפלגות ציונים מפורטת</h4>
              {comparisonMatrix.plans.map((comparison, index) => {
                const plan = plans.find(p => p.id === comparison.planId);
                if (!plan) return null;

                return (
                  <div key={comparison.planId} className="flex items-center gap-4 p-3 bg-card/50 rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <Badge className={cn(
                        "font-bold px-3 py-1",
                        comparison.rank === 1 ? "bg-success text-white" :
                        comparison.rank === 2 ? "bg-primary text-white" :
                        "bg-muted text-muted-foreground"
                      )}>
                        #{comparison.rank}
                      </Badge>
                      <div>
                        <div className="font-semibold">{plan.company}</div>
                        <div className="text-sm text-muted-foreground">{plan.planName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <Progress 
                        value={comparison.score.overall} 
                        className="flex-1"
                      />
                      <div className={cn("text-xl font-bold", getScoreColor(comparison.score.overall))}>
                        {comparison.score.overall}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Competitiveness Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-primary" />
            ניתוח תחרותיות מחירים
          </CardTitle>
          <p className="text-muted-foreground">איך המחירים מתייחסים לממוצע השוק</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.priceCompetitiveness.map((item: any) => {
              if (!item) return null;
              
              return (
                <div key={item.planId} className="flex items-center justify-between p-4 bg-card/50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold">{item.company}</div>
                    <div className="flex items-center gap-2">
                      {getPriceDeviationIcon(item.deviation)}
                      <span className={cn(
                        "text-sm font-medium",
                        item.deviation > 10 ? "text-destructive" :
                        item.deviation < -10 ? "text-success" :
                        "text-muted-foreground"
                      )}>
                        {item.deviation > 0 ? '+' : ''}{item.deviation.toFixed(1)}% מהממוצע
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-lg">{formatPrice(item.price)}</div>
                      <div className="text-sm text-muted-foreground">לחודש</div>
                    </div>
                    <Badge className={cn(
                      item.competitiveness >= 80 ? "bg-success text-white" :
                      item.competitiveness >= 60 ? "bg-primary text-white" :
                      item.competitiveness >= 40 ? "bg-warning text-white" :
                      "bg-destructive text-white"
                    )}>
                      {item.competitiveness} ציון ערך
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Feature Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary" />
            ניתוח תכונות נפוצות
          </CardTitle>
          <p className="text-muted-foreground">התכונות הנפוצות ביותר במסלולים המושווים</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.featureCoverage.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{item.feature}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {item.count}/{plans.length} מסלולים
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {item.percentage.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Recommendations */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-primary" />
            המלצות חכמות מהניתוח
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comparisonMatrix.summary.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-white/50 rounded-lg border">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div className="text-sm leading-relaxed">{rec}</div>
              </div>
            ))}
            
            {/* Additional dynamic recommendations */}
            {analytics.scoreDistribution.excellent > analytics.scoreDistribution.poor && (
              <div className="flex items-start gap-3 p-4 bg-success/10 rounded-lg border border-success/20">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div className="text-sm leading-relaxed">
                  יש לכם מבחר טוב - {analytics.scoreDistribution.excellent} מסלולים מקבלים ציון מעולה
                </div>
              </div>
            )}
            
            {analytics.maxPrice - analytics.minPrice > analytics.avgPrice * 0.5 && (
              <div className="flex items-start gap-3 p-4 bg-warning/10 rounded-lg border border-warning/20">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="text-sm leading-relaxed">
                  יש פער מחירים משמעותי - כדאי לבחון את התכונות לעומת המחיר
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonAnalytics;