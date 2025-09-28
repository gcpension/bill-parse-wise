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
  Zap,
  Award,
  ArrowRight
} from 'lucide-react';
import { ManualPlan } from '@/data/manual-plans';
import { PlanRecord } from '@/hooks/useAllPlans';
import { RecommendationEngine, RecommendationContext, EnhancedRecommendation } from '@/lib/recommendationEngine';
import { DataAccuracyValidator } from '@/lib/dataAccuracy';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

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
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-background via-background to-primary/5">
          <DialogHeader className="text-center pb-6 border-b border-border/50">
            <div className="flex flex-col items-center space-y-4">
              {/* Hero Animation */}
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-glow animate-pulse-glow">
                  <Crown className="w-10 h-10 text-white animate-bounce" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-warning rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="w-4 h-4 text-warning-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <DialogTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x">
                  🎉 מצאנו את המסלול המושלם עבורכם! 🎉
                </DialogTitle>
                <p className="text-lg text-muted-foreground">
                  הבינה המלאכותית שלנו בחרה עבורכם את הדיל הכי טוב
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-success font-medium">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    מותאם אישית
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    מבוסס נתונים
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    חיסכון מוגדל
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-8 p-6">
            {/* Success Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20 shadow-card">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-success animate-fade-in">
                    {Math.round((enhancedRecommendations[0]?.score || 85))}%
                  </div>
                  <div className="text-sm text-success/70 font-medium">ציון התאמה</div>
                  <div className="text-xs text-muted-foreground mt-1">מעולה!</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-card">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-primary animate-fade-in">
                    ₪{Math.round(enhancedRecommendations[0]?.savings?.monthlySavings || 120)}
                  </div>
                  <div className="text-sm text-primary/70 font-medium">חיסכון חודשי</div>
                  <div className="text-xs text-muted-foreground mt-1">לחודש</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 shadow-card">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-accent animate-fade-in">
                    ₪{Math.round((enhancedRecommendations[0]?.savings?.monthlySavings || 120) * 12)}
                  </div>
                  <div className="text-sm text-accent/70 font-medium">חיסכון שנתי</div>
                  <div className="text-xs text-muted-foreground mt-1">בשנה!</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Recommendation Card */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/30 shadow-elegant hover:shadow-glow transition-all duration-500 animate-scale-in">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-2xl opacity-50"></div>
              
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-3xl flex items-center justify-center shadow-elegant">
                        <Award className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-warning rounded-full flex items-center justify-center animate-bounce shadow-md">
                        <Crown className="w-4 h-4 text-warning-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-success text-white px-3 py-1 text-sm font-bold animate-pulse">
                          ⭐ המלצה #1
                        </Badge>
                        <Badge variant="outline" className="border-primary text-primary">
                          מותאם אישית
                        </Badge>
                      </div>
                      <CardTitle className="text-3xl font-bold text-foreground">
                        {enhancedRecommendations[0]?.plan?.company || 'החברה המומלצת'}
                      </CardTitle>
                      <p className="text-xl text-muted-foreground font-medium">
                        {getPlanName(enhancedRecommendations[0]?.plan || comparedPlans[0])}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-success">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">נבחר במיוחד עבורכם</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-muted/50 to-muted/30 rounded-3xl p-6 shadow-card border border-border/50">
                    <div className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      ₪{getPlanPrice(enhancedRecommendations[0]?.plan || comparedPlans[0])}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">לחודש</div>
                    <div className="text-xs text-success mt-1 font-medium">מחיר מיוחד!</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 relative z-10">
                {/* Savings Highlight */}
                {(enhancedRecommendations[0]?.savings?.monthlySavings || 0) > 0 && (
                  <div className="p-6 bg-gradient-to-r from-success/10 via-success/5 to-success/10 rounded-2xl border-2 border-success/30 shadow-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-success rounded-2xl flex items-center justify-center shadow-md">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-success">
                            💰 חוסכים ₪{Math.round(enhancedRecommendations[0]?.savings?.monthlySavings || 120)} לחודש!
                          </div>
                          <div className="text-success/70 font-medium">
                            זה ₪{Math.round((enhancedRecommendations[0]?.savings?.monthlySavings || 120) * 12)} בשנה! 
                            ({(enhancedRecommendations[0]?.savings?.percentageSaving || 25).toFixed(1)}% חיסכון)
                          </div>
                        </div>
                      </div>
                      <div className="text-6xl animate-bounce-gentle">🎯</div>
                    </div>
                  </div>
                )}

                {/* Why This Plan */}
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-foreground flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-warning" />
                    למה המסלול הזה מושלם עבורכם?
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {(enhancedRecommendations[0]?.matchReasons || [
                      'מתאים לתקציב שלכם',
                      'מספק את כל הצרכים שלכם',
                      'ספק אמין עם שירות מעולה',
                      'יחס מחיר-ביצועים מצוין'
                    ]).slice(0, 4).map((reason, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button 
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-success to-success/90 hover:from-success/90 hover:to-success/80 text-white font-bold text-lg py-6 shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105"
                  >
                    <Crown className="w-6 h-6 mr-2" />
                    🎉 כן! אני רוצה את המסלול הזה
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="px-8 py-6 border-2 border-primary/30 hover:bg-primary/5 transition-all duration-300"
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    רוצה לחשוב
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Alternative Options */}
            {enhancedRecommendations.length > 1 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-center text-foreground">
                  עוד אפשרויות נהדרות שמתאימות לכם
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {enhancedRecommendations.slice(1, 3).map((rec, index) => (
                    <Card key={index} className="border border-border shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-105 bg-card">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <Badge variant="secondary" className="w-fit">
                              חלופה #{index + 2}
                            </Badge>
                            <CardTitle className="text-xl font-bold text-foreground">
                              {rec.plan.company}
                            </CardTitle>
                            <p className="text-muted-foreground">{getPlanName(rec.plan)}</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-foreground">₪{getPlanPrice(rec.plan)}</div>
                            <div className="text-sm text-muted-foreground">לחודש</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">ציון התאמה</span>
                          <Badge variant="outline" className="text-primary border-primary">
                            {Math.round(rec.score)}%
                          </Badge>
                        </div>
                        {rec.savings.monthlySavings > 0 && (
                          <div className="text-sm text-success font-medium">
                            💰 חיסכון: ₪{Math.round(rec.savings.monthlySavings)} לחודש
                          </div>
                        )}
                        <Button 
                          variant="outline"
                          className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          בחר מסלול זה
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">בואו נכיר - פרטים בסיסיים</h3>
                <p className="text-muted-foreground">כמה פרטים שיעזרו לנו להתאים לכם את המסלול המושלם</p>
              </div>
              
              <div className="space-y-8">
                {/* Family Size */}
                <div className="space-y-4">
                  <div className="text-center">
                    <Label className="text-lg font-semibold flex items-center justify-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      כמה אנשים במשפחה?
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">זה יעזור לנו להעריך את צרכי הצריכה</p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((size) => (
                      <Card 
                        key={size}
                        className={cn(
                          "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md",
                          preferences.familySize === size 
                            ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => setPreferences(prev => ({ ...prev, familySize: size }))}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl mb-2">
                            {size === 1 ? '👤' : size === 2 ? '👥' : size === 3 ? '👨‍👩‍👧' : '👨‍👩‍👧‍👦'}
                          </div>
                          <div className="font-medium">{size} {size === 1 ? 'אדם' : 'אנשים'}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {/* More than 4 option */}
                  <Card 
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md",
                      preferences.familySize > 4 
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => setPreferences(prev => ({ ...prev, familySize: 5 }))}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">👨‍👩‍👧‍👦+</div>
                      <div className="font-medium">יותר מ-4</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Budget */}
                <div className="space-y-4">
                  <div className="text-center">
                    <Label className="text-lg font-semibold flex items-center justify-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      תקציב חודשי מקסימלי
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">כמה אתם מוכנים להשקיע?</p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { value: 100, label: 'עד ₪100', desc: 'תקציב חסכוני' },
                      { value: 200, label: 'עד ₪200', desc: 'תקציב בינוני' },
                      { value: 300, label: 'עד ₪300', desc: 'תקציב נוח' },
                      { value: 500, label: 'עד ₪500+', desc: 'תקציב גבוה' }
                    ].map(({ value, label, desc }) => (
                      <Card 
                        key={value}
                        className={cn(
                          "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md",
                          preferences.budget[0] === value 
                            ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => setPreferences(prev => ({ ...prev, budget: [value] }))}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl mb-2">💰</div>
                          <div className="font-medium">{label}</div>
                          <div className="text-xs text-muted-foreground">{desc}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Home Type */}
                <div className="space-y-4">
                  <div className="text-center">
                    <Label className="text-lg font-semibold flex items-center justify-center gap-2">
                      <Home className="w-5 h-5 text-primary" />
                      סוג הדיור
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">איפה אתם גרים?</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'apartment', label: 'דירה', emoji: '🏢', desc: 'דירה ברחוב עמוס' },
                      { value: 'house', label: 'בית פרטי', emoji: '🏠', desc: 'בית עם חצר' },
                      { value: 'office', label: 'משרד', emoji: '🏢', desc: 'מקום עבודה' }
                    ].map(({ value, label, emoji, desc }) => (
                      <Card 
                        key={value}
                        className={cn(
                          "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md",
                          preferences.homeType === value 
                            ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => setPreferences(prev => ({ ...prev, homeType: value as any }))}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl mb-2">{emoji}</div>
                          <div className="font-medium">{label}</div>
                          <div className="text-xs text-muted-foreground">{desc}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Usage Level */}
                <div className="space-y-4">
                  <div className="text-center">
                    <Label className="text-lg font-semibold flex items-center justify-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      רמת השימוש
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">איך אתם משתמשים בשירות?</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: 'קל', desc: 'שימוש בסיסי', emoji: '🌱' },
                      { value: 'medium', label: 'בינוני', desc: 'שימוש יומיומי', emoji: '⚡' },
                      { value: 'heavy', label: 'כבד', desc: 'שימוש אינטנסיבי', emoji: '🔥' }
                    ].map(({ value, label, desc, emoji }) => (
                      <Card 
                        key={value}
                        className={cn(
                          "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md",
                          preferences.usage === value 
                            ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => setPreferences(prev => ({ ...prev, usage: value as any }))}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl mb-2">{emoji}</div>
                          <div className="font-medium">{label}</div>
                          <div className="text-xs text-muted-foreground">{desc}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)} 
                size="touch"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold shadow-elegant hover:shadow-glow transition-all duration-300"
              >
                <ArrowRight className="w-5 h-5 ml-2" />
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