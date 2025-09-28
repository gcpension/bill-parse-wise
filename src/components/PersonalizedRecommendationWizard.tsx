import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Home, 
  DollarSign, 
  Activity, 
  Settings, 
  Star,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Users,
  Wifi,
  Zap,
  Phone,
  Tv,
  X
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
    electricity: {
      icon: <Zap className="w-5 h-5" />,
      label: 'חשמל',
      gradient: 'from-warning/20 via-warning-glow/15 to-warning/10',
      accent: 'warning'
    },
    internet: {
      icon: <Wifi className="w-5 h-5" />,
      label: 'אינטרנט', 
      gradient: 'from-primary/20 via-primary-glow/15 to-primary/10',
      accent: 'primary'
    },
    mobile: {
      icon: <Phone className="w-5 h-5" />,
      label: 'סלולר',
      gradient: 'from-success/20 via-success-glow/15 to-success/10', 
      accent: 'success'
    },
    tv: {
      icon: <Tv className="w-5 h-5" />,
      label: 'טלוויזיה',
      gradient: 'from-secondary/20 via-accent/15 to-secondary/10',
      accent: 'secondary'
    }
  };

  const steps = [
    {
      id: 'basic',
      title: 'פרטים בסיסיים',
      icon: <User className="w-4 h-4" />,
      description: 'ספרו לנו על עצמכם'
    },
    {
      id: 'budget',
      title: 'תקציב',
      icon: <DollarSign className="w-4 h-4" />,
      description: 'העדפות כלכליות'
    },
    {
      id: 'usage',
      title: 'שימוש',
      icon: <Activity className="w-4 h-4" />,
      description: 'דפוסי שימוש'
    },
    {
      id: 'priorities',
      title: 'עדיפויות',
      icon: <Star className="w-4 h-4" />,
      description: 'מה חשוב לכם'
    }
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
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              {/* Family Size */}
              <Card className="p-6 bg-gradient-to-br from-card via-card to-card/95 border border-border/50 shadow-elegant hover:shadow-card-hover transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary-glow/10 border border-primary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <Label className="text-base font-bold font-heebo text-foreground">גודל משק הבית</Label>
                      <p className="text-xs text-muted-foreground font-assistant">כמה אנשים גרים בבית?</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[profile.familySize]}
                      onValueChange={([value]) => updateProfile({ familySize: value })}
                      max={8}
                      min={1}
                      step={1}
                      className="flex-1 [&>span:first-child]:h-3 [&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-muted [&>span:first-child]:to-muted/80 [&>span:first-child]:rounded-full [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-gradient-to-br [&_[role=slider]]:from-primary [&_[role=slider]]:to-primary-glow [&_[role=slider]]:border-2 [&_[role=slider]]:border-background [&_[role=slider]]:shadow-elegant [&>span:last-child]:bg-gradient-to-r [&>span:last-child]:from-primary [&>span:last-child]:to-primary-glow [&>span:last-child]:h-3 [&>span:last-child]:rounded-full"
                    />
                    <Badge variant="secondary" className="min-w-[60px] justify-center text-sm font-bold bg-gradient-to-br from-primary/10 to-primary-glow/5 text-primary border-primary/20">
                      {profile.familySize} {profile.familySize === 1 ? 'אדם' : 'אנשים'}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Home Type */}
              <Card className="p-6 bg-gradient-to-br from-card via-card to-card/95 border border-border/50 shadow-elegant hover:shadow-card-hover transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-accent/10 border border-secondary/20 flex items-center justify-center">
                      <Home className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <Label className="text-base font-bold font-heebo text-foreground">סוג הדיור</Label>
                      <p className="text-xs text-muted-foreground font-assistant">איזה סוג דיור יש לכם?</p>
                    </div>
                  </div>
                  <Select value={profile.homeType} onValueChange={(value: any) => updateProfile({ homeType: value })}>
                    <SelectTrigger className="h-12 bg-gradient-to-r from-background to-background/95 border border-border/50 hover:border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300">
                      <SelectValue className="font-assistant" />
                    </SelectTrigger>
                    <SelectContent className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-card">
                      <SelectItem value="apartment" className="font-assistant hover:bg-primary/5 focus:bg-primary/10">🏠 דירה</SelectItem>
                      <SelectItem value="house" className="font-assistant hover:bg-primary/5 focus:bg-primary/10">🏡 בית פרטי</SelectItem>
                      <SelectItem value="student" className="font-assistant hover:bg-primary/5 focus:bg-primary/10">🎓 דיור סטודנטים</SelectItem>
                      <SelectItem value="business" className="font-assistant hover:bg-primary/5 focus:bg-primary/10">🏢 עסק</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              {/* Current Provider */}
              <Card className="p-6 bg-gradient-to-br from-card via-card to-card/95 border border-border/50 shadow-elegant hover:shadow-card-hover transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn("w-10 h-10 rounded-xl border border-border/20 flex items-center justify-center bg-gradient-to-br", categoryConfig[category].gradient)}>
                      {categoryConfig[category].icon}
                    </div>
                    <div>
                      <Label className="text-base font-bold font-heebo text-foreground">הספק הנוכחי</Label>
                      <p className="text-xs text-muted-foreground font-assistant">מי הספק הנוכחי שלכם ל{categoryConfig[category].label}?</p>
                    </div>
                  </div>
                  <Input
                    value={profile.currentProvider}
                    onChange={(e) => updateProfile({ currentProvider: e.target.value })}
                    placeholder={`לדוגמה: בזק, פרטנר, סלקום...`}
                    className="h-12 bg-gradient-to-r from-background to-background/95 border border-border/50 hover:border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 font-assistant"
                  />
                </div>
              </Card>

              {/* Work From Home */}
              <Card className="p-6 bg-gradient-to-br from-card via-card to-card/95 border border-border/50 shadow-elegant hover:shadow-card-hover transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success/20 to-success-glow/10 border border-success/20 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <Label className="text-base font-bold font-heebo text-foreground">עובד/ת מהבית?</Label>
                      <p className="text-xs text-muted-foreground font-assistant">האם אתם עובדים מהבית באופן קבוע?</p>
                    </div>
                  </div>
                  <Switch
                    checked={profile.workFromHome}
                    onCheckedChange={(checked) => updateProfile({ workFromHome: checked })}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-primary-glow data-[state=unchecked]:bg-muted scale-110"
                  />
                </div>
              </Card>
            </div>
          </div>
        );

      case 'budget':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monthly Budget */}
              <Card className="p-8 bg-gradient-to-br from-success/5 via-success-glow/5 to-success/10 border border-success/20 shadow-elegant hover:shadow-card-hover transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success/30 to-success-glow/20 border border-success/30 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <Label className="text-lg font-bold font-heebo text-foreground">תקציב חודשי מקסימלי</Label>
                      <p className="text-sm text-muted-foreground font-assistant">כמה אתם מוכנים להשקיע?</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-background/50 to-background/30 rounded-2xl p-6 border border-border/30">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Input
                        type="number"
                        value={profile.monthlyBudget}
                        onChange={(e) => updateProfile({ monthlyBudget: parseInt(e.target.value) || 0 })}
                        className="text-center font-bold text-2xl h-14 bg-gradient-to-r from-background to-background/95 border-success/30 focus:border-success focus:ring-2 focus:ring-success/20"
                      />
                      <span className="font-bold text-2xl text-success">₪</span>
                    </div>
                    
                    <Slider
                      value={[profile.monthlyBudget]}
                      onValueChange={([value]) => updateProfile({ monthlyBudget: value })}
                      max={500}
                      min={50}
                      step={10}
                      className="w-full [&>span:first-child]:h-4 [&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-muted [&>span:first-child]:to-muted/80 [&>span:first-child]:rounded-full [&_[role=slider]]:h-7 [&_[role=slider]]:w-7 [&_[role=slider]]:bg-gradient-to-br [&_[role=slider]]:from-success [&_[role=slider]]:to-success-glow [&_[role=slider]]:border-3 [&_[role=slider]]:border-background [&_[role=slider]]:shadow-elegant [&>span:last-child]:bg-gradient-to-r [&>span:last-child]:from-success [&>span:last-child]:to-success-glow [&>span:last-child]:h-4 [&>span:last-child]:rounded-full"
                    />
                    
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>50₪</span>
                      <span>500₪</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Current Spending */}
              <Card className="p-8 bg-gradient-to-br from-warning/5 via-warning-glow/5 to-warning/10 border border-warning/20 shadow-elegant hover:shadow-card-hover transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning/30 to-warning-glow/20 border border-warning/30 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <Label className="text-lg font-bold font-heebo text-foreground">התשלום הנוכחי</Label>
                      <p className="text-sm text-muted-foreground font-assistant">כמה אתם משלמים עכשיו?</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-background/50 to-background/30 rounded-2xl p-6 border border-border/30">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Input
                        type="number"
                        value={profile.currentMonthlySpend}
                        onChange={(e) => updateProfile({ currentMonthlySpend: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        className="text-center font-bold text-2xl h-14 bg-gradient-to-r from-background to-background/95 border-warning/30 focus:border-warning focus:ring-2 focus:ring-warning/20"
                      />
                      <span className="font-bold text-2xl text-warning">₪</span>
                    </div>
                    
                    {profile.currentMonthlySpend > 0 && profile.monthlyBudget > profile.currentMonthlySpend && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-success/10 to-success-glow/5 rounded-xl border border-success/20">
                        <p className="text-sm text-success font-assistant text-center">
                          יש לכם פוטנציאל לחסוך {profile.monthlyBudget - profile.currentMonthlySpend}₪ בחודש! 💰
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Price Flexibility */}
            <Card className="p-8 bg-gradient-to-br from-card via-card to-card/95 border border-border/50 shadow-elegant hover:shadow-card-hover transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary-glow/10 border border-primary/20 flex items-center justify-center">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <Label className="text-lg font-bold font-heebo text-foreground">גמישות במחיר</Label>
                    <p className="text-sm text-muted-foreground font-assistant">מה החשיבות של המחיר עבורכם?</p>
                  </div>
                </div>
                
                <Select value={profile.priceFlexibility} onValueChange={(value: any) => updateProfile({ priceFlexibility: value })}>
                  <SelectTrigger className="h-14 bg-gradient-to-r from-background to-background/95 border border-border/50 hover:border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-base">
                    <SelectValue className="font-assistant" />
                  </SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-card">
                    <SelectItem value="strict" className="font-assistant hover:bg-primary/5 focus:bg-primary/10 text-base py-3">💰 חשוב מאוד לחסוך - מחיר זה הכל</SelectItem>
                    <SelectItem value="flexible" className="font-assistant hover:bg-primary/5 focus:bg-primary/10 text-base py-3">⚖️ גמיש במחיר - איזון בין מחיר לאיכות</SelectItem>
                    <SelectItem value="premium" className="font-assistant hover:bg-primary/5 focus:bg-primary/10 text-base py-3">✨ איכות חשובה מעל הכל - מוכן לשלם יותר</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>
        );

      case 'usage':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Usage Level */}
              <Card className="p-8 bg-gradient-to-br from-card via-card to-card/95 border border-border/50 shadow-elegant hover:shadow-card-hover transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary-glow/10 border border-primary/20 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <Label className="text-lg font-bold font-heebo text-foreground">רמת השימוש</Label>
                      <p className="text-sm text-muted-foreground font-assistant">כמה אתם משתמשים בשירות?</p>
                    </div>
                  </div>
                  
                  <Select value={profile.usageLevel} onValueChange={(value: any) => updateProfile({ usageLevel: value })}>
                    <SelectTrigger className="h-14 bg-gradient-to-r from-background to-background/95 border border-border/50 hover:border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-base">
                      <SelectValue className="font-assistant" />
                    </SelectTrigger>
                    <SelectContent className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-card">
                      <SelectItem value="light" className="font-assistant hover:bg-primary/5 focus:bg-primary/10 text-base py-3">🟢 קל - שימוש בסיסי מדי פעם</SelectItem>
                      <SelectItem value="medium" className="font-assistant hover:bg-primary/5 focus:bg-primary/10 text-base py-3">🟡 בינוני - שימוש יומיומי רגיל</SelectItem>
                      <SelectItem value="heavy" className="font-assistant hover:bg-primary/5 focus:bg-primary/10 text-base py-3">🔴 כבד - שימוש אינטנסיבי מתמיד</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              {/* Usage Hours */}
              <Card className="p-8 bg-gradient-to-br from-card via-card to-card/95 border border-border/50 shadow-elegant hover:shadow-card-hover transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-accent/10 border border-secondary/20 flex items-center justify-center">
                      <Settings className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <Label className="text-lg font-bold font-heebo text-foreground">שעות השימוש העיקריות</Label>
                      <p className="text-sm text-muted-foreground font-assistant">מתי אתם משתמשים הכי הרבה?</p>
                    </div>
                  </div>
                  
                  <Select value={profile.usageHours} onValueChange={(value: any) => updateProfile({ usageHours: value })}>
                    <SelectTrigger className="h-14 bg-gradient-to-r from-background to-background/95 border border-border/50 hover:border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-base">
                      <SelectValue className="font-assistant" />
                    </SelectTrigger>
                    <SelectContent className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-card">
                      <SelectItem value="morning" className="font-assistant hover:bg-primary/5 focus:bg-primary/10 text-base py-3">🌅 בוקר (6-12) - התחלת היום</SelectItem>
                      <SelectItem value="day" className="font-assistant hover:bg-primary/5 focus:bg-primary/10 text-base py-3">☀️ יום (12-18) - אמצע היום</SelectItem>
                      <SelectItem value="evening" className="font-assistant hover:bg-primary/5 focus:bg-primary/10 text-base py-3">🌆 ערב (18-23) - סוף היום</SelectItem>
                      <SelectItem value="night" className="font-assistant hover:bg-primary/5 focus:bg-primary/10 text-base py-3">🌙 לילה (23-6) - שעות הלילה</SelectItem>
                      <SelectItem value="mixed" className="font-assistant hover:bg-primary/5 focus:bg-primary/10 text-base py-3">🔄 מעורב - כל שעות היום</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            </div>

            {/* Usage Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-8 bg-gradient-to-br from-card via-card to-card/95 border border-border/50 shadow-elegant hover:shadow-card-hover transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success/20 to-success-glow/10 border border-success/20 flex items-center justify-center">
                      <Tv className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <Label className="text-lg font-bold font-heebo text-foreground">צופה הרבה סטרימינג?</Label>
                      <p className="text-sm text-muted-foreground font-assistant">נטפליקס, יוטיוב, וכו'</p>
                    </div>
                  </div>
                  <Switch
                    checked={profile.streamingHeavy}
                    onCheckedChange={(checked) => updateProfile({ streamingHeavy: checked })}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-success data-[state=checked]:to-success-glow data-[state=unchecked]:bg-muted scale-110"
                  />
                </div>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-card via-card to-card/95 border border-border/50 shadow-elegant hover:shadow-card-hover transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning/20 to-warning-glow/10 border border-warning/20 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <Label className="text-lg font-bold font-heebo text-foreground">גיימר/ית כבד/ה?</Label>
                      <p className="text-sm text-muted-foreground font-assistant">משחקים מקוונים, קונסולה</p>
                    </div>
                  </div>
                  <Switch
                    checked={profile.gamingHeavy}
                    onCheckedChange={(checked) => updateProfile({ gamingHeavy: checked })}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-warning data-[state=checked]:to-warning-glow data-[state=unchecked]:bg-muted scale-110"
                  />
                </div>
              </Card>
            </div>
          </div>
        );

      case 'priorities':
        return (
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-primary/5 via-primary-glow/5 to-primary/10 border border-primary/20 shadow-elegant">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/30 to-primary-glow/20 border border-primary/30 flex items-center justify-center">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-2xl font-bold text-foreground font-heebo mb-3">
                  מה הכי חשוב לכם?
                </h4>
                <p className="text-base text-muted-foreground font-assistant">
                  דרגו לפי חשיבות כדי שנוכל למצוא עבורכם את ההתאמה המושלמת
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-6">
              {Object.entries(profile.priorities).map(([key, value]) => (
                <Card key={key} className="p-8 bg-gradient-to-br from-card via-card to-card/95 border border-border/50 shadow-elegant hover:shadow-card-hover transition-all duration-300">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl border flex items-center justify-center text-2xl",
                          value >= 4 ? "bg-gradient-to-br from-success/30 to-success-glow/20 border-success/30" :
                          value >= 3 ? "bg-gradient-to-br from-primary/30 to-primary-glow/20 border-primary/30" :
                          value >= 2 ? "bg-gradient-to-br from-warning/30 to-warning-glow/20 border-warning/30" :
                          "bg-gradient-to-br from-muted/30 to-muted/20 border-border"
                        )}>
                          {key === 'price' && '💰'}
                          {key === 'reliability' && '🔒'}
                          {key === 'speed' && '⚡'}
                          {key === 'customerService' && '🎧'}
                          {key === 'flexibility' && '🔄'}
                          {key === 'features' && '✨'}
                          {key === 'brandTrust' && '🏢'}
                          {key === 'innovation' && '🚀'}
                        </div>
                        <div>
                          <Label className="text-lg font-bold font-heebo text-foreground">
                            {key === 'price' && 'מחיר נמוך'}
                            {key === 'reliability' && 'אמינות ויציבות'}
                            {key === 'speed' && 'מהירות וביצועים'}
                            {key === 'customerService' && 'שירות לקוחות'}
                            {key === 'flexibility' && 'גמישות בחוזה'}
                            {key === 'features' && 'תכונות נוספות'}
                            {key === 'brandTrust' && 'אמון במותג'}
                            {key === 'innovation' && 'חדשנות וטכנולוגיה'}
                          </Label>
                          <p className="text-sm text-muted-foreground font-assistant">
                            {key === 'price' && 'חשיבות החיסכון והמחיר הנמוך'}
                            {key === 'reliability' && 'שירות יציב וזמין בכל עת'}
                            {key === 'speed' && 'ביצועים גבוהים ומהירות'}
                            {key === 'customerService' && 'זמינות ואיכות התמיכה'}
                            {key === 'flexibility' && 'אפשרות לשינוי וביטול'}
                            {key === 'features' && 'תכונות ושירותים מתקדמים'}
                            {key === 'brandTrust' && 'מוניטין וביטחון'}
                            {key === 'innovation' && 'טכנולוגיות חדישות'}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary"
                        className={cn(
                          "min-w-[60px] justify-center text-base font-bold h-8",
                          value >= 4 ? "bg-gradient-to-br from-success/20 to-success-glow/10 text-success border-success/30" :
                          value >= 3 ? "bg-gradient-to-br from-primary/20 to-primary-glow/10 text-primary border-primary/30" :
                          value >= 2 ? "bg-gradient-to-br from-warning/20 to-warning-glow/10 text-warning border-warning/30" :
                          "bg-gradient-to-br from-muted/20 to-muted/10 text-muted-foreground border-border"
                        )}
                      >
                        {value}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <Slider
                        value={[value]}
                        onValueChange={([newValue]) => updatePriorities(key as keyof UserProfile['priorities'], newValue)}
                        max={5}
                        min={1}
                        step={1}
                        className={cn(
                          "w-full [&>span:first-child]:h-4 [&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-muted [&>span:first-child]:to-muted/80 [&>span:first-child]:rounded-full [&_[role=slider]]:h-7 [&_[role=slider]]:w-7 [&_[role=slider]]:border-3 [&_[role=slider]]:border-background [&_[role=slider]]:shadow-elegant [&>span:last-child]:h-4 [&>span:last-child]:rounded-full",
                          value >= 4 ? "[&_[role=slider]]:bg-gradient-to-br [&_[role=slider]]:from-success [&_[role=slider]]:to-success-glow [&>span:last-child]:bg-gradient-to-r [&>span:last-child]:from-success [&>span:last-child]:to-success-glow" :
                          value >= 3 ? "[&_[role=slider]]:bg-gradient-to-br [&_[role=slider]]:from-primary [&_[role=slider]]:to-primary-glow [&>span:last-child]:bg-gradient-to-r [&>span:last-child]:from-primary [&>span:last-child]:to-primary-glow" :
                          value >= 2 ? "[&_[role=slider]]:bg-gradient-to-br [&_[role=slider]]:from-warning [&_[role=slider]]:to-warning-glow [&>span:last-child]:bg-gradient-to-r [&>span:last-child]:from-warning [&>span:last-child]:to-warning-glow" :
                          "[&_[role=slider]]:bg-gradient-to-br [&_[role=slider]]:from-muted [&_[role=slider]]:to-muted/80 [&>span:last-child]:bg-gradient-to-r [&>span:last-child]:from-muted [&>span:last-child]:to-muted/80"
                        )}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>לא חשוב (1)</span>
                        <span>חשוב במיוחד (5)</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-background h-full flex flex-col overflow-hidden">
      {/* Enhanced Header with Glassmorphism */}
      <div className={cn("relative overflow-hidden shrink-0 shadow-elegant", 
        `bg-gradient-to-br ${categoryConfig[category].gradient} backdrop-blur-sm`
      )}>
        {/* Header Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary-glow/20 to-primary/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)] opacity-50" />
        
        <div className="relative px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-primary-foreground hover:bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20 shadow-card transition-all duration-300 hover:shadow-elegant"
            >
              <X className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-card">
                {categoryConfig[category].icon}
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold font-heebo text-white drop-shadow-sm">המלצה אישית</h1>
                <p className="text-white/90 font-assistant text-base">עבור {categoryConfig[category].label}</p>
              </div>
            </div>
            
            <div className="w-12" />
          </div>

          {/* Enhanced Progress Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-assistant text-white/90 font-medium">שלב {currentStep + 1} מתוך {steps.length}</span>
              <span className="text-base font-assistant text-white/90 font-bold">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            
            <div className="w-full bg-white/20 rounded-full h-3 shadow-inner backdrop-blur-sm">
              <div 
                className="bg-gradient-to-r from-white to-white/90 h-3 rounded-full transition-all duration-700 ease-out shadow-card" 
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center items-center gap-3 mt-6">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2",
                    index === currentStep 
                      ? "bg-white text-primary border-white shadow-elegant scale-110" 
                      : index < currentStep 
                      ? "bg-success text-success-foreground border-success shadow-card" 
                      : "bg-white/20 text-white border-white/30 backdrop-blur-sm"
                  )}>
                    {index < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
                  </div>
                  <div className={cn(
                    "text-xs font-assistant text-center transition-all duration-300 hidden sm:block",
                    index === currentStep ? "text-white font-bold" : "text-white/70"
                  )}>
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Info */}
          <div className="text-center mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <h2 className="text-xl font-bold font-heebo text-white mb-1">{steps[currentStep].title}</h2>
            <p className="text-white/90 font-assistant">{steps[currentStep].description}</p>
          </div>
        </div>
      </div>

      {/* Enhanced Content Area */}
      <div className="flex-1 px-6 py-8 overflow-y-auto bg-gradient-to-br from-background via-background/95 to-muted/20">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {renderStepContent()}
        </div>
      </div>

      {/* Enhanced Footer */}
      <div className="bg-card/80 backdrop-blur-sm border-t border-border/50 px-6 py-6 shrink-0 shadow-elegant">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-3 font-assistant h-12 px-6 bg-background/50 border-border/50 hover:bg-background hover:border-border transition-all duration-300 disabled:opacity-50"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="font-medium">קודם</span>
          </Button>

          {/* Enhanced Step Dots */}
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-full transition-all duration-500",
                  index === currentStep 
                    ? "w-8 h-3 bg-gradient-to-r from-primary to-primary-glow shadow-card" 
                    : index < currentStep 
                    ? "w-3 h-3 bg-success shadow-sm" 
                    : "w-3 h-3 bg-muted"
                )}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="flex items-center gap-3 font-assistant bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 shadow-elegant hover:shadow-card transition-all duration-300 h-12 px-6"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold">קבלת המלצות</span>
              </>
            ) : (
              <>
                <span className="font-medium">הבא</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};