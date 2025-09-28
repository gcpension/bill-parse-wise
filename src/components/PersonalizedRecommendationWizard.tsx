import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Home, 
  DollarSign, 
  Activity, 
  Star,
  ArrowRight,
  ArrowLeft,
  Users,
  Wifi,
  Zap,
  Phone,
  Tv,
  X,
  Clock,
  Shield,
  Settings,
  CheckCircle
} from 'lucide-react';
import { UserProfile } from '@/lib/personalizedRecommendations';
import { cn } from '@/lib/utils';

interface PersonalizedRecommendationWizardProps {
  onComplete: (profile: UserProfile) => void;
  category: 'electricity' | 'internet' | 'mobile' | 'tv';
  onClose: () => void;
}

export const PersonalizedRecommendationWizard = ({ 
  onComplete, 
  category, 
  onClose 
}: PersonalizedRecommendationWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    familySize: 2,
    homeType: 'apartment',
    monthlyBudget: 200,
    currentMonthlySpend: 0,
    currentProvider: '',
    priceFlexibility: 'flexible',
    usageLevel: 'medium',
    usageHours: 'mixed',
    workFromHome: false,
    streamingHeavy: false,
    gamingHeavy: false,
    priorities: {
      price: 4,
      reliability: 3,
      speed: 3,
      customerService: 2,
      flexibility: 2,
      features: 3,
      brandTrust: 3,
      innovation: 2
    },
    contractFlexibility: 'doesnt_matter',
    technologyPreference: 'stable',
    supportImportance: 'important',
    categorySpecific: {}
  });

  const categoryConfig = {
    electricity: { icon: <Zap className="w-4 h-4" />, label: 'חשמל' },
    internet: { icon: <Wifi className="w-4 h-4" />, label: 'אינטרנט' },
    mobile: { icon: <Phone className="w-4 h-4" />, label: 'סלולר' },
    tv: { icon: <Tv className="w-4 h-4" />, label: 'טלוויזיה' }
  };

  const steps = [
    { id: 'basic', title: 'פרטים בסיסיים', icon: <User className="w-4 h-4" /> },
    { id: 'budget', title: 'תקציב', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'usage', title: 'שימוש', icon: <Activity className="w-4 h-4" /> },
    { id: 'priorities', title: 'עדיפויות', icon: <Star className="w-4 h-4" /> }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(profile);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updatePriorities = (key: keyof UserProfile['priorities'], value: number) => {
    setProfile(prev => ({
      ...prev,
      priorities: {
        ...prev.priorities,
        [key]: value
      }
    }));
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'basic':
        return (
          <div className="space-y-6">
            {/* Family Size */}
            <div className="space-y-3">
              <Label className="text-base font-medium">גודל משק הבית</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[profile.familySize]}
                  onValueChange={([value]) => updateProfile({ familySize: value })}
                  max={8}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <Badge variant="secondary" className="min-w-[70px] text-center">
                  {profile.familySize} {profile.familySize === 1 ? 'אדם' : 'אנשים'}
                </Badge>
              </div>
            </div>

            {/* Home Type */}
            <div className="space-y-3">
              <Label className="text-base font-medium">סוג הדיור</Label>
              <Select value={profile.homeType} onValueChange={(value: any) => updateProfile({ homeType: value })}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">🏠 דירה</SelectItem>
                  <SelectItem value="house">🏡 בית פרטי</SelectItem>
                  <SelectItem value="student">🎓 דיור סטודנטים</SelectItem>
                  <SelectItem value="business">🏢 עסק</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Current Provider */}
            <div className="space-y-3">
              <Label className="text-base font-medium">הספק הנוכחי ל{categoryConfig[category].label}</Label>
              <Input
                value={profile.currentProvider}
                onChange={(e) => updateProfile({ currentProvider: e.target.value })}
                placeholder="לדוגמה: בזק, פרטנר, סלקום..."
                className="h-12"
              />
            </div>

            {/* Work From Home */}
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-base font-medium">עובד/ת מהבית?</Label>
                <p className="text-sm text-muted-foreground">עבודה קבועה מהבית</p>
              </div>
              <Switch
                checked={profile.workFromHome}
                onCheckedChange={(checked) => updateProfile({ workFromHome: checked })}
              />
            </div>
          </div>
        );

      case 'budget':
        return (
          <div className="space-y-6">
            {/* Monthly Budget */}
            <div className="space-y-4">
              <Label className="text-base font-medium">תקציב חודשי מקסימלי</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={profile.monthlyBudget}
                  onChange={(e) => updateProfile({ monthlyBudget: parseInt(e.target.value) || 0 })}
                  className="text-center h-12 text-lg font-medium"
                  min="50"
                  max="1000"
                />
                <span className="text-lg font-medium">₪</span>
              </div>
              <Slider
                value={[profile.monthlyBudget]}
                onValueChange={([value]) => updateProfile({ monthlyBudget: value })}
                max={500}
                min={50}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>50₪</span>
                <span>500₪</span>
              </div>
            </div>

            {/* Current Spending */}
            <div className="space-y-4">
              <Label className="text-base font-medium">התשלום החודשי הנוכחי</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  value={profile.currentMonthlySpend}
                  onChange={(e) => updateProfile({ currentMonthlySpend: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="text-center h-12 text-lg font-medium"
                  min="0"
                />
                <span className="text-lg font-medium">₪</span>
              </div>
              {profile.currentMonthlySpend > 0 && profile.monthlyBudget > profile.currentMonthlySpend && (
                <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                  <p className="text-sm text-success text-center">
                    פוטנציאל חיסכון: {profile.monthlyBudget - profile.currentMonthlySpend}₪ בחודש
                  </p>
                </div>
              )}
            </div>

            {/* Price Flexibility */}
            <div className="space-y-3">
              <Label className="text-base font-medium">עד כמה המחיר חשוב לכם?</Label>
              <RadioGroup 
                value={profile.priceFlexibility} 
                onValueChange={(value: any) => updateProfile({ priceFlexibility: value })}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="strict" id="strict" />
                  <Label htmlFor="strict">המחיר הכי חשוב - רוצה את הזול ביותר</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="flexible" id="flexible" />
                  <Label htmlFor="flexible">מוכן לשלם יותר עבור שירות טוב</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="premium" id="premium" />
                  <Label htmlFor="premium">מחיר לא משנה - רוצה את הטוב ביותר</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 'usage':
        return (
          <div className="space-y-6">
            {/* Usage Level */}
            <div className="space-y-3">
              <Label className="text-base font-medium">רמת השימוש ב{categoryConfig[category].label}</Label>
              <RadioGroup 
                value={profile.usageLevel} 
                onValueChange={(value: any) => updateProfile({ usageLevel: value })}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">שימוש קל - בסיסי</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">שימוש בינוני - יומיומי</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="heavy" id="heavy" />
                  <Label htmlFor="heavy">שימוש כבד - אינטנסיבי</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Usage Hours */}
            <div className="space-y-3">
              <Label className="text-base font-medium">מתי השימוש העיקרי?</Label>
              <RadioGroup 
                value={profile.usageHours} 
                onValueChange={(value: any) => updateProfile({ usageHours: value })}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="day" id="day" />
                  <Label htmlFor="day">בעיקר ביום</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="evening" id="evening" />
                  <Label htmlFor="evening">בעיקר בערב</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="mixed" id="mixed" />
                  <Label htmlFor="mixed">לאורך כל היום</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Streaming */}
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-base font-medium">צפייה בהרבה סטרימינג?</Label>
                <p className="text-sm text-muted-foreground">נטפליקס, יוטיוב וכו'</p>
              </div>
              <Switch
                checked={profile.streamingHeavy}
                onCheckedChange={(checked) => updateProfile({ streamingHeavy: checked })}
              />
            </div>

            {/* Gaming */}
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-base font-medium">גיימינג אונליין?</Label>
                <p className="text-sm text-muted-foreground">משחקים באינטרנט</p>
              </div>
              <Switch
                checked={profile.gamingHeavy}
                onCheckedChange={(checked) => updateProfile({ gamingHeavy: checked })}
              />
            </div>
          </div>
        );

      case 'priorities':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium mb-2">דרגו את החשיבות של כל קריטריון</h3>
              <p className="text-sm text-muted-foreground">1 = לא חשוב, 5 = חשוב מאוד</p>
            </div>

            <div className="space-y-6">
              {[
                { key: 'price', label: 'מחיר', icon: <DollarSign className="w-4 h-4" /> },
                { key: 'reliability', label: 'אמינות', icon: <Shield className="w-4 h-4" /> },
                { key: 'speed', label: 'מהירות', icon: <Zap className="w-4 h-4" /> },
                { key: 'customerService', label: 'שירות לקוחות', icon: <Users className="w-4 h-4" /> },
                { key: 'flexibility', label: 'גמישות חוזה', icon: <Settings className="w-4 h-4" /> },
                { key: 'features', label: 'תוספות ופיצ\'רים', icon: <Star className="w-4 h-4" /> },
                { key: 'brandTrust', label: 'מוניטין החברה', icon: <CheckCircle className="w-4 h-4" /> },
                { key: 'innovation', label: 'טכנולוגיה חדשנית', icon: <Activity className="w-4 h-4" /> }
              ].map(({ key, label, icon }) => (
                <div key={key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {icon}
                      <Label className="text-base font-medium">{label}</Label>
                    </div>
                    <Badge variant="outline" className="min-w-[30px] text-center">
                      {profile.priorities[key as keyof UserProfile['priorities']]}
                    </Badge>
                  </div>
                  <Slider
                    value={[profile.priorities[key as keyof UserProfile['priorities']]]}
                    onValueChange={([value]) => updatePriorities(key as keyof UserProfile['priorities'], value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>לא חשוב</span>
                    <span>חשוב מאוד</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {categoryConfig[category].icon}
              <div>
                <CardTitle className="text-xl">המלצה אישית ל{categoryConfig[category].label}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  שלב {currentStep + 1} מתוך {steps.length}: {steps[currentStep].title}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mt-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {renderStepContent()}
        </CardContent>

        <div className="border-t p-6 flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            הקודם
          </Button>
          
          <Button 
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            {currentStep === steps.length - 1 ? 'קבל המלצה' : 'הבא'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};