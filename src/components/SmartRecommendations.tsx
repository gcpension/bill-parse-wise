import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Zap,
  Smartphone,
  Wifi,
  Tv,
  Star,
  ArrowRight,
  Target,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { RecommendationEngine, RecommendationContext } from '@/lib/recommendationEngine';
import { DataAccuracyValidator } from '@/lib/dataAccuracy';
import { useSavingsData } from '@/hooks/useSavingsData';
import { useAllPlans } from '@/hooks/useAllPlans';

interface EnhancedRecommendation {
  id: string;
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  title: string;
  description: string;
  potential_savings: number;
  annual_savings: number;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  provider: string;
  validUntil?: Date;
  conditions?: string[];
  matchReasons: string[];
  dataAccuracy: 'high' | 'medium' | 'low';
  marketTrend: 'stable' | 'rising' | 'falling';
}

const categoryIcons = {
  electricity: Zap,
  cellular: Smartphone,
  internet: Wifi,
  tv: Tv
};

const categoryNames = {
  electricity: 'חשמל',
  cellular: 'סלולר', 
  internet: 'אינטרנט',
  tv: 'טלוויזיה'
};

export const SmartRecommendations = () => {
  const [recommendations, setRecommendations] = useState<EnhancedRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { savingsData } = useSavingsData();
  const allPlans = useAllPlans();
  const { toast } = useToast();

  useEffect(() => {
    const generateEnhancedRecommendations = async () => {
      try {
        setLoading(true);
        
        // Get user's current data from savings context
        const enhancedRecommendations: EnhancedRecommendation[] = [];
        
        // Generate recommendations based on actual user data
        if (savingsData.length > 0) {
          for (const userCategory of savingsData) {
            const recommendation = await generateCategoryRecommendation(userCategory);
            if (recommendation) {
              enhancedRecommendations.push(recommendation);
            }
          }
        }
        
        // Add market-based recommendations even without user data
        const marketRecommendations = generateMarketRecommendations();
        enhancedRecommendations.push(...marketRecommendations);
        
        // Sort by priority and potential savings
        enhancedRecommendations.sort((a, b) => {
          const priorityScore = { high: 3, medium: 2, low: 1 };
          const aPriority = priorityScore[a.priority] || 0;
          const bPriority = priorityScore[b.priority] || 0;
          
          if (aPriority !== bPriority) return bPriority - aPriority;
          return b.potential_savings - a.potential_savings;
        });
        
        setRecommendations(enhancedRecommendations.slice(0, 6)); // Limit to 6 recommendations
        logger.info('Generated enhanced recommendations', 'SmartRecommendations', {
          count: enhancedRecommendations.length,
          categories: [...new Set(enhancedRecommendations.map(r => r.category))]
        });
        
      } catch (error) {
        logger.error('Failed to generate recommendations', 'SmartRecommendations', error);
        toast({
          title: 'שגיאה',
          description: 'לא ניתן לטעון את ההמלצות כרגע',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    generateEnhancedRecommendations();
  }, [savingsData, allPlans]);

  const generateCategoryRecommendation = async (
    userData: any
  ): Promise<EnhancedRecommendation | null> => {
    try {
      // Validate data accuracy first
      const accuracyCheck = DataAccuracyValidator.validateCategoryData(
        userData.category,
        {
          currentProvider: userData.currentProvider,
          monthlyAmount: userData.currentAmount,
          familySize: 2 // Default, should come from user profile
        }
      );

      // Create recommendation context
      const context: RecommendationContext = {
        category: userData.category,
        currentProvider: userData.currentProvider,
        currentAmount: userData.currentAmount,
        familySize: 2, // Default
        usage: 'medium', // Default
        budget: userData.currentAmount * 0.85, // 15% savings target
        priorities: [],
        homeType: 'apartment'
      };

      // Get category plans
      const categoryPlans = allPlans.filter(plan => 
        plan.service.toLowerCase() === userData.category
      );

      if (categoryPlans.length === 0) {
        return null;
      }

      // Find best savings opportunity
      const bestPlan = categoryPlans
        .filter(plan => plan.monthlyPrice && plan.monthlyPrice < userData.currentAmount)
        .sort((a, b) => (userData.currentAmount - (a.monthlyPrice || 0)) - (userData.currentAmount - (b.monthlyPrice || 0)))
        .pop(); // Highest savings

      if (!bestPlan || !bestPlan.monthlyPrice) {
        return null;
      }

      const savings = RecommendationEngine.calculateSavings(
        userData.currentAmount,
        bestPlan.monthlyPrice,
        userData.category
      );

      return {
        id: `rec-${userData.category}-${Date.now()}`,
        category: userData.category,
        title: `מסלול חסכוני ב-${bestPlan.company}`,
        description: `מסלול ${bestPlan.plan} יחסוך לך ₪${savings.monthlySavings.toFixed(0)} בחודש`,
        potential_savings: Math.round(savings.monthlySavings),
        annual_savings: Math.round(savings.annualSavings),
        confidence: savings.confidenceScore,
        priority: savings.monthlySavings > 50 ? 'high' : savings.monthlySavings > 25 ? 'medium' : 'low',
        actionable: true,
        provider: bestPlan.company,
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        conditions: [bestPlan.commitment || 'בדוק תנאי ההתחייבות'],
        matchReasons: [`חיסכון של ${savings.percentageSaving.toFixed(0)}%`, 'התאמה לפרופיל הצריכה שלך'],
        dataAccuracy: accuracyCheck.overallAccuracy,
        marketTrend: 'stable'
      };
      
    } catch (error) {
      logger.error('Failed to generate category recommendation', 'SmartRecommendations', error);
      return null;
    }
  };

  const generateMarketRecommendations = (): EnhancedRecommendation[] => {
    const currentDate = new Date();
    const isEndOfYear = currentDate.getMonth() >= 10; // November or December
    
    return [
      {
        id: 'market-electricity-1',
        category: 'electricity',
        title: isEndOfYear ? 'מבצע חשמל ירוק לסוף השנה' : 'תעריף חשמל חדש ומוזל',
        description: isEndOfYear 
          ? 'ספקי החשמל מציעים הנחות משמעותיות לקראת סוף השנה - עד 20% חיסכון'
          : 'תעריפי חשמל חדשים במשק - בדוק אם המעבר כדאי לך',
        potential_savings: 150,
        annual_savings: 1800,
        confidence: 0.8,
        priority: 'high',
        actionable: true,
        provider: 'מספר ספקים',
        validUntil: isEndOfYear 
          ? new Date(currentDate.getFullYear() + 1, 0, 15) // January 15th
          : new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        conditions: ['לקוחות חדשים', 'התחייבות מינימלית'],
        matchReasons: ['מגמה שוק חיובית', 'תחרות בין ספקים'],
        dataAccuracy: 'high',
        marketTrend: 'falling'
      },
      {
        id: 'market-cellular-1',
        category: 'cellular',
        title: 'מהפכת הסלולר 2024',
        description: 'רשתות סלולריות משקיעות בטכנולוגיה חדשה ומציעות תעריפים תחרותיים',
        potential_savings: 60,
        annual_savings: 720,
        confidence: 0.75,
        priority: 'medium',
        actionable: true,
        provider: 'ספקים מובילים',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        conditions: ['משפחות וצרכנים כבדים'],
        matchReasons: ['שיפור ברשת', 'תחרות מחירים'],
        dataAccuracy: 'high',
        marketTrend: 'falling'
      }
    ];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'דחוף';
      case 'medium': return 'בינוני';
      case 'low': return 'נמוך';
      default: return '';
    }
  };

  const handleTakeAction = (recommendation: EnhancedRecommendation) => {
    // Navigate to comparison page with recommendation context
    logger.info('User taking action on enhanced recommendation', 'SmartRecommendations', {
      recommendationId: recommendation.id,
      category: recommendation.category,
      estimatedSavings: recommendation.potential_savings,
      confidence: recommendation.confidence
    });
    
    // Navigate to category-specific comparison
    const categoryRoutes = {
      electricity: '/compare?category=electricity',
      cellular: '/compare?category=cellular', 
      internet: '/compare?category=internet',
      tv: '/compare?category=tv'
    };
    
    const route = categoryRoutes[recommendation.category];
    if (route) {
      window.location.href = `${route}&provider=${encodeURIComponent(recommendation.provider)}`;
    } else {
      toast({
        title: 'מעבר להשוואה',
        description: `מתחיל תהליך השוואה עבור ${recommendation.title}`,
      });
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-success border-success';
    if (confidence >= 0.6) return 'text-warning border-warning';
    return 'text-muted-foreground border-muted';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'גבוה';
    if (confidence >= 0.6) return 'בינוני';
    return 'נמוך';
  };

  const getDataAccuracyIcon = (accuracy: 'high' | 'medium' | 'low') => {
    switch (accuracy) {
      case 'high': return <ShieldCheck className="h-4 w-4 text-success" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'low': return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
  };

  if (loading) {
    return (
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary animate-pulse" />
            ההמלצות החכמות שלי
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          ההמלצות החכמות שלי
          <Badge variant="secondary" className="mr-auto">
            {recommendations.length} המלצות
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const Icon = categoryIcons[rec.category];
            const isUrgent = rec.validUntil && rec.validUntil < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            
            return (
              <div key={rec.id} className="border rounded-lg p-4 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-background/50 to-background/80 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{rec.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{categoryNames[rec.category]} • {rec.provider}</span>
                        {getDataAccuracyIcon(rec.dataAccuracy)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(rec.priority)}>
                        {getPriorityText(rec.priority)}
                      </Badge>
                      {rec.potential_savings > 0 && (
                        <Badge variant="outline" className="text-success border-success font-bold">
                          ₪{rec.potential_savings}/חודש
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className={getConfidenceColor(rec.confidence)}>
                      <Target className="h-3 w-3 mr-1" />
                      דיוק {getConfidenceText(rec.confidence)}
                    </Badge>
                  </div>
                </div>

                <p className="text-muted-foreground mb-3">{rec.description}</p>

                {/* Match Reasons */}
                {rec.matchReasons && rec.matchReasons.length > 0 && (
                  <div className="mb-3 p-3 bg-success/10 rounded-lg border border-success/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium text-success">למה זה מתאים לך:</span>
                    </div>
                    <ul className="text-sm text-success space-y-1">
                      {rec.matchReasons.map((reason, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {rec.conditions && (
                  <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-2">תנאים חשובים:</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {rec.conditions.map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {rec.validUntil && (
                  <Alert className={`mb-3 ${isUrgent ? 'border-destructive bg-destructive/5' : 'border-warning bg-warning/5'}`}>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      <span className={isUrgent ? 'text-destructive font-medium' : 'text-warning-foreground'}>
                        {isUrgent ? 'זמן מוגבל! ' : ''}
                        תקף עד: {rec.validUntil.toLocaleDateString('he-IL')}
                      </span>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4 text-sm">
                      {rec.potential_savings > 0 && (
                        <span className="flex items-center gap-1 text-success font-medium">
                          <TrendingUp className="h-4 w-4" />
                          חיסכון שנתי: ₪{rec.annual_savings.toLocaleString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Target className="h-4 w-4" />
                        רמת דיוק: {Math.round(rec.confidence * 100)}%
                      </span>
                    </div>
                    {rec.marketTrend !== 'stable' && (
                      <span className={`text-xs flex items-center gap-1 ${
                        rec.marketTrend === 'falling' ? 'text-success' : 'text-warning'
                      }`}>
                        <TrendingUp className={`h-3 w-3 ${rec.marketTrend === 'rising' ? 'rotate-180' : ''}`} />
                        מגמת שוק: {rec.marketTrend === 'falling' ? 'מחירים יורדים' : 'מחירים עולים'}
                      </span>
                    )}
                  </div>
                  
                  {rec.actionable && (
                    <Button 
                      size="sm" 
                      onClick={() => handleTakeAction(rec)}
                      className={`font-bold ${isUrgent ? 'bg-destructive hover:bg-destructive/90 animate-pulse' : 'bg-primary hover:bg-primary/90'}`}
                    >
                      {isUrgent ? 'פעל עכשיו!' : 'השווה מסלולים'}
                      <ArrowRight className="mr-1 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};