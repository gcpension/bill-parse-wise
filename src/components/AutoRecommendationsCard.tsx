import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  TrendingDown, 
  Star, 
  ChevronDown, 
  CheckCircle2,
  Info,
  Zap
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ManualPlan } from '@/data/manual-plans';
import { PersonalizedRecommendation } from '@/lib/personalizedRecommendations';
import { RecommendationExplanation } from '@/lib/smartRecommendations';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface AutoRecommendationsCardProps {
  recommendations: PersonalizedRecommendation[];
  plans: ManualPlan[];
  currentMonthlyBill: number;
  familySize: number;
  explanation?: RecommendationExplanation;
  onPlanSelect?: (planId: string) => void;
  onImproveRecommendations?: () => void;
}

export const AutoRecommendationsCard = ({
  recommendations,
  plans,
  currentMonthlyBill,
  familySize,
  explanation,
  onPlanSelect,
  onImproveRecommendations,
}: AutoRecommendationsCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showImproveDialog, setShowImproveDialog] = useState(false);
  const [topPriority, setTopPriority] = useState<string>('');

  // Get plan details
  const getPlanDetails = (planId: string) => {
    return plans.find(p => p.id === planId);
  };

  // Calculate total potential savings
  const totalMonthlySavings = recommendations.reduce(
    (sum, rec) => sum + (rec.expectedSavings?.monthly || 0), 
    0
  );
  const totalAnnualSavings = totalMonthlySavings * 12;

  const topRecommendation = recommendations[0];
  const topPlan = topRecommendation ? getPlanDetails(topRecommendation.planId) : null;

  const handleImprove = (priority: string) => {
    setTopPriority(priority);
    setShowImproveDialog(false);
    // Here we could trigger the full wizard or update recommendations
    if (onImproveRecommendations) {
      onImproveRecommendations();
    }
  };

  if (!topRecommendation || !topPlan) {
    return null;
  }

  const matchPercentage = Math.round(topRecommendation.personalizedScore);
  const confidencePercentage = Math.round(topRecommendation.confidenceLevel * 100);

  return (
    <>
      <Card className="relative overflow-hidden border-2 border-primary/20 shadow-elegant hover:shadow-glow transition-all duration-300">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        
        <div className="relative p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground font-heebo">
                  בחרנו בשבילך את המסלול הטוב ביותר
                </h2>
              </div>
              <p className="text-muted-foreground font-assistant text-sm md:text-base">
                {explanation?.profileSummary || `על סמך: משפחה של ~${familySize} נפשות | תקציב ₪${currentMonthlyBill}`}
              </p>
              {explanation && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="text-primary hover:text-primary/80 p-0 h-auto font-assistant text-xs"
                >
                  <Info className="w-3 h-3 ml-1" />
                  {showExplanation ? 'הסתר הסבר מפורט' : 'הצג על סמך אילו פרמטרים בחרנו'}
                </Button>
              )}
            </div>
          </div>

          {/* Explanation Section */}
          {showExplanation && explanation && (
            <div className="mb-6 p-5 bg-primary/5 rounded-lg border border-primary/20">
              <h3 className="text-lg font-bold text-foreground font-heebo mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                פרמטרים שלקחנו בחשבון
              </h3>
              
              {/* Parameters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {explanation.keyParameters.map((param, idx) => (
                  <div key={idx} className="bg-card rounded-lg p-4 border border-border/50">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl">{param.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-foreground font-heebo text-sm">
                            {param.name}
                          </span>
                          <span className="text-xs text-muted-foreground font-assistant">
                            משקל {Math.round(param.weight * 100)}%
                          </span>
                        </div>
                        <div className="text-primary font-bold mb-1 font-heebo">
                          {param.value}
                        </div>
                        <Progress value={param.weight * 100} className="h-1.5 mb-2" />
                        <p className="text-xs text-muted-foreground font-assistant leading-relaxed">
                          {param.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Match Reasons */}
              {explanation.matchReasons.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <h4 className="text-sm font-semibold text-foreground font-heebo mb-2">
                    למה זה המסלול הטוב ביותר עבורך:
                  </h4>
                  <div className="space-y-2">
                    {explanation.matchReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground font-assistant">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confidence Badge */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-assistant">
                    רמת דיוק ההמלצה:
                  </span>
                  <Badge variant="secondary" className="font-heebo">
                    {Math.round(explanation.confidenceLevel * 100)}% דיוק
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Main Recommendation */}
          <div className="bg-card rounded-xl border border-border/50 p-6 mb-6 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <h3 className="text-xl font-bold text-foreground font-heebo">
                    {topPlan.company} - {topPlan.planName}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="default" className="bg-primary text-primary-foreground">
                    {matchPercentage}% התאמה
                  </Badge>
                  <Badge variant="outline" className="border-green-500 text-green-700">
                    <TrendingDown className="w-3 h-3 ml-1" />
                    חיסכון ₪{Math.round(topRecommendation.expectedSavings.monthly)}/חודש
                  </Badge>
                  <Badge variant="secondary">
                    <CheckCircle2 className="w-3 h-3 ml-1" />
                    {confidencePercentage}% דיוק
                  </Badge>
                </div>
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-primary font-heebo">
                  ₪{topPlan.regularPrice}
                </div>
                <div className="text-sm text-muted-foreground font-assistant">לחודש</div>
              </div>
            </div>

            {/* Reasons */}
            <div className="space-y-2 mb-4">
              {topRecommendation.reasonsForRecommendation.slice(0, 3).map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground font-assistant">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <Button 
              onClick={() => onPlanSelect?.(topRecommendation.planId)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-heebo"
              size="lg"
            >
              <Zap className="w-4 h-4 ml-2" />
              בחר במסלול הזה
            </Button>
          </div>

          {/* Additional Recommendations */}
          {recommendations.length > 1 && (
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between text-muted-foreground hover:text-foreground font-heebo"
              >
                <span>עוד {recommendations.length - 1} המלצות מתאימות</span>
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform",
                  showDetails && "rotate-180"
                )} />
              </Button>
              
              {showDetails && (
                <div className="mt-4 space-y-3">
                  {recommendations.slice(1, 3).map((rec, idx) => {
                    const plan = getPlanDetails(rec.planId);
                    if (!plan) return null;
                    
                    return (
                      <div 
                        key={idx}
                        className="bg-card/50 rounded-lg border border-border/30 p-4 hover:border-primary/20 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground font-heebo">
                            {plan.company} - {plan.planName}
                          </h4>
                          <span className="text-lg font-bold text-primary font-heebo">
                            ₪{plan.regularPrice}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {Math.round(rec.personalizedScore)}% התאמה
                          </Badge>
                          <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                            חיסכון ₪{Math.round(rec.expectedSavings.monthly)}/חודש
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onPlanSelect?.(rec.planId)}
                          className="w-full font-heebo mt-2"
                        >
                          בחר מסלול זה
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Improve Button */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-border/50">
            <Info className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground font-assistant">
              רוצה המלצות מדויקות יותר?
            </p>
            <Button
              variant="outline"
              onClick={() => setShowImproveDialog(true)}
              className="font-heebo"
            >
              <Sparkles className="w-4 h-4 ml-2" />
              שפר המלצות
            </Button>
          </div>

          {/* Annual Savings Summary */}
          {totalAnnualSavings > 0 && (
            <div className="mt-6 text-center p-4 bg-green-50/50 rounded-lg border border-green-200/50">
              <p className="text-sm text-muted-foreground font-assistant mb-1">
                חיסכון פוטנציאלי שנתי
              </p>
              <p className="text-3xl font-bold text-green-600 font-heebo">
                ₪{Math.round(totalAnnualSavings).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Improve Recommendations Dialog */}
      <Dialog open={showImproveDialog} onOpenChange={setShowImproveDialog}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-heebo text-xl">שפר את ההמלצות</DialogTitle>
            <DialogDescription className="font-assistant">
              מה הכי חשוב לך? זה יעזור לנו להתאים את ההמלצות בדיוק רב יותר.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-3 py-4">
            <Button
              variant="outline"
              className="justify-start h-auto py-4 font-heebo"
              onClick={() => handleImprove('price')}
            >
              <div className="text-right">
                <div className="font-semibold mb-1">💰 לחסוך כמה שיותר</div>
                <div className="text-xs text-muted-foreground font-assistant">
                  מחפש את המחיר הנמוך ביותר
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="justify-start h-auto py-4 font-heebo"
              onClick={() => handleImprove('reliability')}
            >
              <div className="text-right">
                <div className="font-semibold mb-1">🔒 שירות אמין ויציב</div>
                <div className="text-xs text-muted-foreground font-assistant">
                  איכות ושירות מעל הכל
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="justify-start h-auto py-4 font-heebo"
              onClick={() => handleImprove('speed')}
            >
              <div className="text-right">
                <div className="font-semibold mb-1">⚡ מהירות/ביצועים גבוהים</div>
                <div className="text-xs text-muted-foreground font-assistant">
                  חשוב לי שיהיה מהיר וחזק
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="justify-start h-auto py-4 font-heebo"
              onClick={() => handleImprove('flexibility')}
            >
              <div className="text-right">
                <div className="font-semibold mb-1">🌟 גמישות וללא התחייבות</div>
                <div className="text-xs text-muted-foreground font-assistant">
                  חופש לשנות בכל רגע
                </div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
