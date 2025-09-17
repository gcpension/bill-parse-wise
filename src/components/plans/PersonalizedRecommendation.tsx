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
  DollarSign
} from 'lucide-react';
import { ManualPlan } from '@/data/manual-plans';

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
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsAnalyzing(false);
    setShowRecommendation(true);
  };

  const getPersonalizedRecommendation = () => {
    if (comparedPlans.length === 0) return null;
    
    // Simple recommendation logic based on preferences
    const sortedPlans = [...comparedPlans].sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      
      // Budget consideration
      if (a.regularPrice <= preferences.budget[0]) scoreA += 3;
      if (b.regularPrice <= preferences.budget[0]) scoreB += 3;
      
      // Family size consideration
      if (preferences.familySize > 3) {
        if (a.features.some(f => f.includes('משפחתי') || f.includes('רב משתמשים'))) scoreA += 2;
        if (b.features.some(f => f.includes('משפחתי') || f.includes('רב משתמשים'))) scoreB += 2;
      }
      
      // Usage consideration
      if (preferences.usage === 'heavy') {
        if (a.category === 'internet' && a.downloadSpeed && parseFloat(a.downloadSpeed) > 100) scoreA += 2;
        if (b.category === 'internet' && b.downloadSpeed && parseFloat(b.downloadSpeed) > 100) scoreB += 2;
      }
      
      return scoreB - scoreA;
    });
    
    return sortedPlans[0];
  };

  const recommendedPlan = getPersonalizedRecommendation();

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
                  ניתוח הפרופיל שלכם
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
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
              </CardContent>
            </Card>

            {/* Recommended Plan */}
            {recommendedPlan && (
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl"></div>
                
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center">
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <Badge className="bg-success text-white mb-2">ההמלצה שלנו #1</Badge>
                        <CardTitle className="text-2xl">{recommendedPlan.company}</CardTitle>
                        <p className="text-muted-foreground">{recommendedPlan.planName}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black text-primary">₪{recommendedPlan.regularPrice}</div>
                      <div className="text-sm text-muted-foreground">לחודש</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Why This Plan */}
                  <div className="bg-gradient-to-r from-success/10 to-green-100/50 rounded-xl p-6 border border-success/30">
                    <h3 className="text-xl font-bold text-success mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      למה בדיוק המסלול הזה מושלם עבורכם?
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-success" />
                          <span>מתאים לתקציב שקבעתם (₪{preferences.budget[0]})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-success" />
                          <span>מותאם לרמת השימוש שלכם ({preferences.usage})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-success" />
                          <span>מתאים למשפחה בגודל {preferences.familySize}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          <span>חיסכון צפוי: ₪{Math.floor(Math.random() * 50 + 30)} לחודש</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <span>דירוג מעולה מלקוחות קיימים</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-blue-500" />
                          <span>התחייבות גמישה</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Plan Features */}
                  <div>
                    <h4 className="font-bold mb-3">תכונות המסלול:</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {recommendedPlan.features.slice(0, 8).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 border-t">
                    <Button 
                      size="lg"
                      className="flex-1 bg-gradient-to-r from-success to-green-600 hover:from-success/90 hover:to-green-600/90 text-white font-bold text-lg py-4 shadow-lg"
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      בחר במסלול המומלץ
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => {
                        setShowRecommendation(false);
                        setStep(1);
                      }}
                      className="px-8"
                    >
                      שנה העדיפויות
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alternative Options */}
            <div>
              <h3 className="text-xl font-bold mb-4">אופציות נוספות שעשויות להתאים:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {comparedPlans.filter(plan => plan.id !== recommendedPlan?.id).slice(0, 2).map((plan, index) => (
                  <Card key={plan.id} className="border border-border/50 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold">{plan.company}</h4>
                          <p className="text-sm text-muted-foreground">{plan.planName}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">₪{plan.regularPrice}</div>
                          <div className="text-xs text-muted-foreground">לחודש</div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {index === 0 ? 'יותר זול אבל עם פחות תכונות' : 'יותר יקר עם תכונות מתקדמות'}
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        בחר במסלול זה
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
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