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
      color: 'bg-warning'
    },
    internet: {
      icon: <Wifi className="w-5 h-5" />,
      label: 'אינטרנט',
      color: 'bg-primary'
    },
    mobile: {
      icon: <Phone className="w-5 h-5" />,
      label: 'סלולר',
      color: 'bg-success'
    },
    tv: {
      icon: <Tv className="w-5 h-5" />,
      label: 'טלוויזיה',
      color: 'bg-secondary'
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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold font-heebo">גודל משק הבית</Label>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <Slider
                    value={[profile.familySize]}
                    onValueChange={([value]) => updateProfile({ familySize: value })}
                    max={8}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <Badge variant="outline" className="min-w-[50px] justify-center text-xs">
                    {profile.familySize}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold font-heebo">סוג הדיור</Label>
                <Select value={profile.homeType} onValueChange={(value: any) => updateProfile({ homeType: value })}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">דירה</SelectItem>
                    <SelectItem value="house">בית פרטי</SelectItem>
                    <SelectItem value="student">דיור סטודנטים</SelectItem>
                    <SelectItem value="business">עסק</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold font-heebo">הספק הנוכחי</Label>
                <Input
                  value={profile.currentProvider}
                  onChange={(e) => updateProfile({ currentProvider: e.target.value })}
                  placeholder={`הספק הנוכחי ל${categoryConfig[category].label}`}
                  className="h-9"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold font-heebo">עובד/ת מהבית?</Label>
                <Switch
                  checked={profile.workFromHome}
                  onCheckedChange={(checked) => updateProfile({ workFromHome: checked })}
                />
              </div>
            </div>
          </div>
        );

      case 'budget':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold font-heebo">תקציב חודשי מקסימלי</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      value={profile.monthlyBudget}
                      onChange={(e) => updateProfile({ monthlyBudget: parseInt(e.target.value) || 0 })}
                      className="text-center font-bold h-9"
                    />
                    <span className="font-bold">₪</span>
                  </div>
                  <Slider
                    value={[profile.monthlyBudget]}
                    onValueChange={([value]) => updateProfile({ monthlyBudget: value })}
                    max={500}
                    min={50}
                    step={10}
                    className="w-full"
                  />
                </div>
              </Card>

              <Card className="p-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold font-heebo">מחיר נוכחי</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      value={profile.currentMonthlySpend}
                      onChange={(e) => updateProfile({ currentMonthlySpend: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="text-center font-bold h-9"
                    />
                    <span className="font-bold">₪</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-assistant">
                    כמה אתם משלמים היום?
                  </p>
                </div>
              </Card>

              <div className="md:col-span-2">
                <Label className="text-sm font-semibold font-heebo">גמישות במחיר</Label>
                <Select value={profile.priceFlexibility} onValueChange={(value: any) => updateProfile({ priceFlexibility: value })}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strict">חשוב מאוד לחסוך</SelectItem>
                    <SelectItem value="flexible">גמיש במחיר</SelectItem>
                    <SelectItem value="premium">איכות חשובה מעל הכל</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'usage':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold font-heebo">רמת שימוש</Label>
                <Select value={profile.usageLevel} onValueChange={(value: any) => updateProfile({ usageLevel: value })}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">קל - שימוש בסיסי</SelectItem>
                    <SelectItem value="medium">בינוני - שימוש יומיומי</SelectItem>
                    <SelectItem value="heavy">כבד - שימוש אינטנסיבי</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold font-heebo">שעות שימוש עיקריות</Label>
                <Select value={profile.usageHours} onValueChange={(value: any) => updateProfile({ usageHours: value })}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">בוקר (6-12)</SelectItem>
                    <SelectItem value="day">יום (12-18)</SelectItem>
                    <SelectItem value="evening">ערב (18-23)</SelectItem>
                    <SelectItem value="night">לילה (23-6)</SelectItem>
                    <SelectItem value="mixed">מעורב</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold font-heebo">צופה הרבה סטרימינג?</Label>
                <Switch
                  checked={profile.streamingHeavy}
                  onCheckedChange={(checked) => updateProfile({ streamingHeavy: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold font-heebo">גיימר/ית כבד/ה?</Label>
                <Switch
                  checked={profile.gamingHeavy}
                  onCheckedChange={(checked) => updateProfile({ gamingHeavy: checked })}
                />
              </div>
            </div>
          </div>
        );

      case 'priorities':
        return (
          <div className="space-y-6">
            <div className="text-center bg-muted/50 rounded-2xl p-5 mb-6 border border-border">
              <h4 className="text-lg font-bold text-foreground font-heebo mb-2">
                מה הכי חשוב לכם?
              </h4>
              <p className="text-sm text-muted-foreground font-assistant">
                דרגו לפי חשיבות (1 = לא חשוב, 5 = חשוב מאוד)
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(profile.priorities).map(([key, value]) => (
                <div key={key} className="space-y-3 p-4 bg-card rounded-xl border border-border shadow-card hover:shadow-elegant transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold font-heebo text-foreground">
                      {key === 'price' && '💰 מחיר נמוך'}
                      {key === 'reliability' && '🔒 אמינות'}
                      {key === 'speed' && '⚡ מהירות/ביצועים'}
                      {key === 'customerService' && '🎧 שירות לקוחות'}
                      {key === 'flexibility' && '🔄 גמישות'}
                      {key === 'features' && '✨ תכונות נוספות'}
                      {key === 'brandTrust' && '🏢 אמון במותג'}
                      {key === 'innovation' && '🚀 חדשנות'}
                    </Label>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "min-w-[40px] justify-center text-xs font-bold",
                        value >= 4 ? "bg-success/10 text-success border-success/30" :
                        value >= 3 ? "bg-primary/10 text-primary border-primary/30" :
                        value >= 2 ? "bg-warning/10 text-warning border-warning/30" :
                        "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {value}
                    </Badge>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={([newValue]) => updatePriorities(key as keyof UserProfile['priorities'], newValue)}
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
    <div className="bg-background h-full flex flex-col">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6 px-6 shrink-0 shadow-card">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/10 p-2 rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-foreground", categoryConfig[category].color)}>
              {categoryConfig[category].icon}
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold font-heebo">המלצה אישית</h1>
              <p className="text-primary-foreground/90 font-assistant text-sm">עבור {categoryConfig[category].label}</p>
            </div>
          </div>
          
          <div className="w-8" />
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-assistant text-primary-foreground/90">שלב {currentStep + 1} מתוך {steps.length}</span>
            <span className="text-sm font-assistant text-primary-foreground/90">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-primary-foreground/20 rounded-full h-2">
            <div 
              className="bg-primary-foreground h-2 rounded-full transition-all duration-500 shadow-sm" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Title */}
        <div className="text-center mt-6">
          <h2 className="text-xl font-bold font-heebo text-primary-foreground">{steps[currentStep].title}</h2>
          <p className="text-primary-foreground/90 font-assistant text-sm mt-1">{steps[currentStep].description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {renderStepContent()}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-card border-t border-border px-6 py-4 shrink-0 shadow-card">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 font-assistant h-10"
          >
            <ArrowRight className="w-4 h-4" />
            קודם
          </Button>

          <div className="flex items-center gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentStep 
                    ? "bg-primary scale-125" 
                    : index < currentStep 
                    ? "bg-success" 
                    : "bg-muted"
                )}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="flex items-center gap-2 font-assistant bg-primary hover:bg-primary/90 shadow-card hover:shadow-elegant transition-all duration-300 h-10"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <CheckCircle className="w-4 h-4" />
                סיום
              </>
            ) : (
              <>
                הבא
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};