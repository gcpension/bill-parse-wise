import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Target, 
  Users, 
  Home, 
  Briefcase, 
  Star, 
  TrendingUp, 
  CheckCircle, 
  Lightbulb,
  Sparkles,
  Crown,
  Clock,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { ManualPlan } from '@/data/manual-plans';
import { PlanRecord } from '@/hooks/useAllPlans';
import { RecommendationEngine, RecommendationContext, EnhancedRecommendation } from '@/lib/recommendationEngine';
import { DataAccuracyValidator } from '@/lib/dataAccuracy';
import { logger } from '@/lib/logger';

// Helper functions to handle both ManualPlan and PlanRecord types
const getPlanName = (plan: ManualPlan | PlanRecord): string => {
  return 'planName' in plan ? plan.planName : plan.plan;
};

const getPlanPrice = (plan: ManualPlan | PlanRecord): number => {
  return 'regularPrice' in plan ? plan.regularPrice : (plan.monthlyPrice || 0);
};

interface PersonalizedRecommendationProps {
  isOpen: boolean;
  onClose: () => void;
  comparedPlans: ManualPlan[];
}

interface UserPreferences {
  usage: 'light' | 'medium' | 'heavy';
  budget: number[];
  familySize: number;
  homeType: 'apartment' | 'house' | 'office';
  priorities: string[];
  previousExperience: string;
  specificNeeds: string;
}

const PersonalizedRecommendation = ({ isOpen, onClose, comparedPlans }: PersonalizedRecommendationProps) => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [enhancedRecommendations, setEnhancedRecommendations] = useState<EnhancedRecommendation[]>([]);
  const [dataValidation, setDataValidation] = useState<any>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    usage: 'medium',
    budget: [200],
    familySize: 2,
    homeType: 'apartment',
    priorities: [],
    previousExperience: '',
    specificNeeds: ''
  });

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    try {
      logger.info('Starting enhanced recommendation analysis', 'PersonalizedRecommendation', {
        preferences,
        plansCount: comparedPlans.length
      });

  // Create recommendation context with sector-specific data
      const context: RecommendationContext = {
        category: (comparedPlans[0]?.category === 'mobile' ? 'cellular' : comparedPlans[0]?.category) || 'electricity',
        currentProvider: comparedPlans[0]?.company || 'לא ידוע',
        currentAmount: preferences.budget[0] * 1.2,
        familySize: preferences.familySize,
        usage: preferences.usage,
        budget: preferences.budget[0],
        priorities: preferences.priorities,
        homeType: preferences.homeType
      };

      // Validate data accuracy
      const validation = DataAccuracyValidator.validateCategoryData(
        context.category,
        {
          currentProvider: context.currentProvider,
          monthlyAmount: context.currentAmount,
          familySize: preferences.familySize,
          homeType: preferences.homeType
        }
      );
      setDataValidation(validation);

      // Generate enhanced recommendations
      const recommendations = RecommendationEngine.generateRecommendations(
        comparedPlans,
        context
      );
      
      setEnhancedRecommendations(recommendations.slice(0, 3)); // Top 3 recommendations
      
      // Simulate analysis time for better UX
      await new Promise(resolve => setTimeout(resolve, 2500));
      
    } catch (error) {
      logger.error('Failed to generate enhanced recommendations', 'PersonalizedRecommendation', error);
    } finally {
      setIsAnalyzing(false);
      setShowRecommendation(true);
    }
  };

  const getPersonalizedRecommendation = () => {
    return enhancedRecommendations[0] || null;
  };

  const recommendedPlan = getPersonalizedRecommendation()?.plan;

  if (showRecommendation) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center justify-center gap-3">
              <Crown className="w-8 h-8 text-primary animate-bounce" />
              ההמלצה האישית שלכם מוכנה!
              <Sparkles className="w-8 h-8 text-accent animate-pulse" />
            </DialogTitle>
            <p className="text-muted-foreground text-center text-lg mt-2">
              בהתבסס על הצרכים והעדיפויות שלכם, הנה ההמלצה החכמה שלנו
            </p>
          </DialogHeader>
          
          <div className="space-y-8 p-6">
            {/* AI Analysis Summary */}
            <Card className="bg-gradient-to-r from-success/10 to-emerald-100/50 border-2 border-success/30 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-success">
                  <Target className="w-6 h-6" />
                  ניתוח הפרופיל החכם שלכם
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/70 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-success">{preferences.familySize}</div>
                    <div className="text-sm text-muted-foreground">חברי משפחה</div>
                  </div>
                  <div className="bg-white/70 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">₪{preferences.budget[0]}</div>
                    <div className="text-sm text-muted-foreground">תקציב חודשי</div>
                  </div>
                  <div className="bg-white/70 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 capitalize">{preferences.usage}</div>
                    <div className="text-sm text-muted-foreground">רמת שימוש</div>
                  </div>
                </div>

                {/* Data Accuracy Indicator */}
                {dataValidation && (
                  <div className={`p-3 rounded-lg border ${
                    dataValidation.overallAccuracy === 'high' ? 'bg-success/10 border-success/30' :
                    dataValidation.overallAccuracy === 'medium' ? 'bg-warning/10 border-warning/30' :
                    'bg-destructive/10 border-destructive/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {dataValidation.overallAccuracy === 'high' ? 
                        <ShieldCheck className="w-4 h-4 text-success" /> :
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      }
                      <span className={`text-sm font-medium ${
                        dataValidation.overallAccuracy === 'high' ? 'text-success' : 'text-warning'
                      }`}>
                        רמת דיוק הנתונים: {dataValidation.overallAccuracy === 'high' ? 'גבוהה' : 
                        dataValidation.overallAccuracy === 'medium' ? 'בינונית' : 'נמוכה'}
                      </span>
                    </div>
                    {dataValidation.recommendedActions.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        המלצות לשיפור: {dataValidation.recommendedActions.slice(0, 2).join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Recommendations */}
            {enhancedRecommendations.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-center">ההמלצות החכמות שלנו:</h3>
                
                {enhancedRecommendations.map((recommendation, index) => (
                  <Card key={index} className={`${index === 0 ? 
                    'bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/30 shadow-2xl' :
                    'border border-border/50 hover:shadow-lg transition-shadow'
                  } relative overflow-hidden`}>
                    
                    {index === 0 && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl"></div>
                    )}
                    
                    <CardHeader className="relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 ${index === 0 ? 
                            'bg-gradient-to-r from-primary to-accent' : 
                            'bg-gradient-to-r from-muted to-muted-foreground/20'
                          } rounded-2xl flex items-center justify-center`}>
                            {index === 0 ? 
                              <Crown className="w-8 h-8 text-white" /> :
                              <Star className="w-6 h-6 text-muted-foreground" />
                            }
                          </div>
                          <div>
                            <Badge className={index === 0 ? 
                              "bg-success text-white mb-2" : 
                              "bg-muted text-muted-foreground mb-2"
                            }>
                              {index === 0 ? 'המלצה #1' : `חלופה #${index + 1}`}
                            </Badge>
                            <CardTitle className="text-xl">{recommendation.plan.company}</CardTitle>
                            <p className="text-muted-foreground">{getPlanName(recommendation.plan)}</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className={`text-3xl font-black ${index === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                            ₪{getPlanPrice(recommendation.plan)}
                          </div>
                          <div className="text-sm text-muted-foreground">לחודש</div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Recommendation Score & Confidence */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-lg font-bold text-primary">{Math.round(recommendation.score)}/100</div>
                          <div className="text-xs text-muted-foreground">ציון התאמה</div>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="text-lg font-bold text-success">{Math.round(recommendation.savings.confidenceScore * 100)}%</div>
                          <div className="text-xs text-muted-foreground">רמת ביטחון</div>
                        </div>
                      </div>

                      {/* Savings Information */}
                      {recommendation.savings.monthlySavings > 0 && (
                        <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-lg font-bold text-success">
                                חיסכון: ₪{Math.round(recommendation.savings.monthlySavings)} לחודש
                              </div>
                              <div className="text-sm text-success/70">
                                ₪{Math.round(recommendation.savings.annualSavings)} בשנה 
                                ({recommendation.savings.percentageSaving.toFixed(1)}%)
                              </div>
                            </div>
                            <Zap className="w-6 h-6 text-success" />
                          </div>
                        </div>
                      )}

                      {/* Match Reasons */}
                      {recommendation.matchReasons.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-sm">למה זה מתאים לך:</h5>
                          <div className="space-y-1">
                            {recommendation.matchReasons.map((reason, reasonIndex) => (
                              <div key={reasonIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                                {reason}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Warnings */}
                      {recommendation.warnings.length > 0 && (
                        <div className="p-3 bg-warning/10 rounded-lg border border-warning/30">
                          <h5 className="font-medium text-sm text-warning mb-2">שים לב:</h5>
                          <div className="space-y-1">
                            {recommendation.warnings.map((warning, warningIndex) => (
                              <div key={warningIndex} className="flex items-center gap-2 text-sm text-warning">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                {warning}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      {index === 0 && (
                        <Button 
                          size="lg"
                          className="w-full bg-gradient-to-r from-success to-green-600 hover:from-success/90 hover:to-green-600/90 text-white font-bold text-lg py-4 shadow-lg"
                        >
                          <Crown className="w-5 h-5 mr-2" />
                          בחר במסלול המומלץ
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isAnalyzing) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">מנתחים את הצרכים שלכם...</h3>
            <p className="text-muted-foreground mb-6">
              הבינה המלאכותית שלנו בוחנת את העדיפויות שלכם ומוצאת את המסלול המושלם
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <span>בוחן את התקציב והשימוש</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                <span>משווה בין המסלולים</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                <span>מכין המלצה מותאמת אישית</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-3">
            <Lightbulb className="w-6 h-6 text-primary" />
            בואו נכיר אתכם לקבלת המלצה מותאמת
          </DialogTitle>
          <p className="text-muted-foreground text-center">
            כמה שאלות קצרות שיעזרו לנו להמליץ לכם על המסלול המושלם
          </p>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= stepNumber 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-20 h-1 mx-2 ${
                    step > stepNumber ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">בואו נכיר - פרטים בסיסיים</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">כמה אנשים במשפחה?</Label>
                    <div className="mt-3">
                      <Slider
                        value={[preferences.familySize]}
                        onValueChange={(value) => setPreferences(prev => ({ ...prev, familySize: value[0] }))}
                        max={8}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>1</span>
                        <span className="font-semibold text-primary">{preferences.familySize} אנשים</span>
                        <span>8+</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">סוג הדיור</Label>
                    <Select value={preferences.homeType} onValueChange={(value: any) => setPreferences(prev => ({ ...prev, homeType: value }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">דירה</SelectItem>
                        <SelectItem value="house">בית פרטי</SelectItem>
                        <SelectItem value="office">משרד</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">תקציב חודשי מקסימלי</Label>
                    <div className="mt-3">
                      <Slider
                        value={preferences.budget}
                        onValueChange={(value) => setPreferences(prev => ({ ...prev, budget: value }))}
                        max={1000}
                        min={50}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>₪50</span>
                        <span className="font-semibold text-primary">₪{preferences.budget[0]}</span>
                        <span>₪1000+</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-semibold">רמת השימוש</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {[
                        { value: 'light', label: 'קל', desc: 'שימוש בסיסי' },
                        { value: 'medium', label: 'בינוני', desc: 'שימוש יומיומי' },
                        { value: 'heavy', label: 'כבד', desc: 'שימוש אינטנסיבי' }
                      ].map((usage) => (
                        <Card 
                          key={usage.value}
                          className={`cursor-pointer transition-all duration-200 ${
                            preferences.usage === usage.value 
                              ? 'ring-2 ring-primary bg-primary/5' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setPreferences(prev => ({ ...prev, usage: usage.value as any }))}
                        >
                          <CardContent className="p-3 text-center">
                            <div className="font-semibold">{usage.label}</div>
                            <div className="text-xs text-muted-foreground">{usage.desc}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)} 
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                המשך לשלב הבא
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">מה חשוב לכם במסלול?</h3>
              
              <div>
                <Label className="text-base font-semibold mb-4 block">בחרו את העדיפויות שלכם (ניתן לבחור כמה אפשרויות)</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { id: 'price', label: 'מחיר נמוך', icon: DollarSign },
                    { id: 'speed', label: 'מהירות גבוהה', icon: TrendingUp },
                    { id: 'reliability', label: 'אמינות ויציבות', icon: CheckCircle },
                    { id: 'support', label: 'שירות לקוחות מעולה', icon: Users },
                    { id: 'flexibility', label: 'גמישות בחוזה', icon: Clock },
                    { id: 'features', label: 'תכונות מתקדמות', icon: Star }
                  ].map((priority) => (
                    <div key={priority.id} className="flex items-center space-x-3 space-x-reverse">
                      <Checkbox
                        id={priority.id}
                        checked={preferences.priorities.includes(priority.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPreferences(prev => ({ 
                              ...prev, 
                              priorities: [...prev.priorities, priority.id] 
                            }));
                          } else {
                            setPreferences(prev => ({ 
                              ...prev, 
                              priorities: prev.priorities.filter(p => p !== priority.id) 
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={priority.id} className="flex items-center gap-2 cursor-pointer">
                        <priority.icon className="w-4 h-4" />
                        {priority.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="experience" className="text-base font-semibold">איך הייתה החוויה עם הספק הקודם? (אופציונלי)</Label>
                <Textarea
                  id="experience"
                  placeholder="למשל: שירות איטי, מחירים גבוהים, בעיות טכניות..."
                  value={preferences.previousExperience}
                  onChange={(e) => setPreferences(prev => ({ ...prev, previousExperience: e.target.value }))}
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => setStep(1)} 
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  חזור
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  המשך
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">פרטים אחרונים</h3>
              
              <div>
                <Label htmlFor="needs" className="text-base font-semibold">יש לכם צרכים מיוחדים? (אופציונלי)</Label>
                <Textarea
                  id="needs"
                  placeholder="למשל: עבודה מהבית, גיימינג, סטרימינג, עסק קטן..."
                  value={preferences.specificNeeds}
                  onChange={(e) => setPreferences(prev => ({ ...prev, specificNeeds: e.target.value }))}
                  className="mt-2"
                  rows={4}
                />
              </div>

              {/* Summary */}
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
                <CardHeader>
                  <CardTitle className="text-center">סיכום הפרטים שלכם</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="font-semibold text-primary">{preferences.familySize} אנשים</div>
                      <div className="text-sm text-muted-foreground">במשפחה</div>
                    </div>
                    <div>
                      <div className="font-semibold text-primary">₪{preferences.budget[0]}</div>
                      <div className="text-sm text-muted-foreground">תקציב חודשי</div>
                    </div>
                    <div>
                      <div className="font-semibold text-primary capitalize">{preferences.usage}</div>
                      <div className="text-sm text-muted-foreground">רמת שימוש</div>
                    </div>
                  </div>
                  {preferences.priorities.length > 0 && (
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">העדיפויות שלכם:</div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {preferences.priorities.map((priority) => (
                          <Badge key={priority} variant="secondary">
                            {priority === 'price' && 'מחיר נמוך'}
                            {priority === 'speed' && 'מהירות גבוהה'}
                            {priority === 'reliability' && 'אמינות'}
                            {priority === 'support' && 'שירות לקוחות'}
                            {priority === 'flexibility' && 'גמישות'}
                            {priority === 'features' && 'תכונות מתקדמות'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button 
                  onClick={() => setStep(2)} 
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  חזור
                </Button>
                <Button 
                  onClick={handleAnalyze}
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold"
                >
                  <Target className="w-5 h-5 mr-2" />
                  קבלו את ההמלצה שלכם!
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalizedRecommendation;