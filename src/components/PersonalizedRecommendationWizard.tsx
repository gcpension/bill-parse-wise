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
import { Progress } from '@/components/ui/progress';
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
  CheckCircle,
  Heart,
  Sparkles,
  TrendingUp,
  Building,
  GraduationCap,
  Briefcase,
  Globe,
  Battery,
  Signal,
  MonitorSpeaker,
  Lightbulb,
  Router
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

  // שלבים ספציפיים לכל סקטור
  const getSectorSteps = () => {
    const baseSteps = [
      { id: 'basic', title: 'פרטים בסיסיים', icon: <User className="w-4 h-4" /> },
      { id: 'budget', title: 'תקציב', icon: <DollarSign className="w-4 h-4" /> }
    ];

    const sectorSpecificSteps = {
      electricity: [
        { id: 'usage', title: 'צריכת חשמל', icon: <Zap className="w-4 h-4" /> },
        { id: 'priorities', title: 'עדיפויות', icon: <Star className="w-4 h-4" /> }
      ],
      internet: [
        { id: 'usage', title: 'שימוש באינטרנט', icon: <Router className="w-4 h-4" /> },
        { id: 'priorities', title: 'עדיפויות', icon: <Star className="w-4 h-4" /> }
      ],
      mobile: [
        { id: 'usage', title: 'שימוש בסלולר', icon: <Signal className="w-4 h-4" /> },
        { id: 'priorities', title: 'עדיפויות', icon: <Star className="w-4 h-4" /> }
      ],
      tv: [
        { id: 'usage', title: 'צפייה בטלוויזיה', icon: <MonitorSpeaker className="w-4 h-4" /> },
        { id: 'priorities', title: 'עדיפויות', icon: <Star className="w-4 h-4" /> }
      ]
    };

    return [...baseSteps, ...sectorSpecificSteps[category]];
  };

  const steps = getSectorSteps();

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

  // שאלות ספציפיות לכל סקטור
  const renderSectorSpecificUsage = () => {
    switch (category) {
      case 'electricity':
        return (
          <div className="space-y-8">
            {/* צריכת חשמל - קילו-וואט שעה */}
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  צריכת חשמל חודשית משוערת
                </Label>
                <p className="text-sm text-muted-foreground mt-1">בקילו-וואט שעה (kWh)</p>
              </div>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateProfile({ 
                    categorySpecific: { 
                      ...profile.categorySpecific, 
                      monthlyKWH: Math.max(100, (profile.categorySpecific?.monthlyKWH || 500) - 50) 
                    } 
                  })}
                  className="h-12 w-12 rounded-full hover:scale-110 transition-transform"
                >
                  -
                </Button>
                
                <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-primary/10 to-primary-glow/10 border-4 border-primary/20 shadow-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{profile.categorySpecific?.monthlyKWH || 500}</div>
                    <div className="text-sm text-muted-foreground">kWh</div>
                  </div>
                </div>
                
                <Button
                  variant="outline" 
                  size="icon"
                  onClick={() => updateProfile({ 
                    categorySpecific: { 
                      ...profile.categorySpecific, 
                      monthlyKWH: Math.min(2000, (profile.categorySpecific?.monthlyKWH || 500) + 50) 
                    } 
                  })}
                  className="h-12 w-12 rounded-full hover:scale-110 transition-transform"
                >
                  +
                </Button>
              </div>
            </div>

            {/* מכשירי חשמל */}
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-lg font-semibold">מכשירי חשמל עיקריים</Label>
                <p className="text-sm text-muted-foreground mt-1">בחרו את המכשירים שיש לכם</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'airConditioner', label: 'מזגן', emoji: '❄️' },
                  { key: 'waterHeater', label: 'דוד מים', emoji: '🚿' },
                  { key: 'washer', label: 'מכונת כביסה', emoji: '👕' },
                  { key: 'dishwasher', label: 'מדיח כלים', emoji: '🍽️' }
                ].map(({ key, label, emoji }) => (
                  <Card 
                    key={key}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md",
                      profile.categorySpecific?.[key] 
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => updateProfile({ 
                      categorySpecific: { 
                        ...profile.categorySpecific, 
                        [key]: !profile.categorySpecific?.[key] 
                      } 
                    })}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{emoji}</div>
                      <div className="font-medium text-sm">{label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'internet':
        return (
          <div className="space-y-8">
            {/* מהירות אינטרנט */}
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  מהירות אינטרנט נדרשת
                </Label>
                <p className="text-sm text-muted-foreground mt-1">מגה-ביט לשנייה (Mbps)</p>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 100, label: 'בסיסי', desc: '100 Mbps', emoji: '🐌' },
                  { value: 200, label: 'בינוני', desc: '200 Mbps', emoji: '🚀' },
                  { value: 500, label: 'מהיר', desc: '500+ Mbps', emoji: '⚡' }
                ].map(({ value, label, desc, emoji }) => (
                  <Card 
                    key={value}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md",
                      profile.categorySpecific?.internetSpeed === value 
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => updateProfile({ 
                      categorySpecific: { ...profile.categorySpecific, internetSpeed: value } 
                    })}
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

            {/* שימושים באינטרנט */}
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-lg font-semibold">שימושים עיקריים</Label>
                <p className="text-sm text-muted-foreground mt-1">מה אתם עושים באינטרנט?</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'streaming', label: 'סטרימינג', emoji: '📺' },
                  { key: 'workFromHome', label: 'עבודה מהבית', emoji: '💻' },
                  { key: 'gaming', label: 'משחקים', emoji: '🎮' },
                  { key: 'videoConf', label: 'ועידות וידאו', emoji: '📹' }
                ].map(({ key, label, emoji }) => (
                  <Card 
                    key={key}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md",
                      profile.categorySpecific?.[key] 
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => updateProfile({ 
                      categorySpecific: { 
                        ...profile.categorySpecific, 
                        [key]: !profile.categorySpecific?.[key] 
                      } 
                    })}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{emoji}</div>
                      <div className="font-medium text-sm">{label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'mobile':
        return (
          <div className="space-y-8">
            {/* מספר קווים */}
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  כמה קווי סלולרי יש לכם?
                </Label>
                <p className="text-sm text-muted-foreground mt-1">מספר הקווים במשפחה</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary/20 to-primary-glow/20 border-2 border-primary/30">
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary">{profile.categorySpecific?.multipleLines || 1}</div>
                      <div className="text-xs text-muted-foreground">{(profile.categorySpecific?.multipleLines || 1) === 1 ? 'קו' : 'קווים'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="px-4">
                  <Slider
                    value={[profile.categorySpecific?.multipleLines || 1]}
                    onValueChange={([value]) => updateProfile({ 
                      categorySpecific: { 
                        ...profile.categorySpecific, 
                        multipleLines: value 
                      } 
                    })}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full [&_.relative]:h-3 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>קו אחד</span>
                    <span>10 קווים</span>
                  </div>
                </div>
              </div>
            </div>

            {/* שימוש בסלולר */}
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-lg font-semibold">סוג השימוש</Label>
                <p className="text-sm text-muted-foreground mt-1">איך אתם משתמשים בסלולר?</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'callsOnly', label: 'שיחות בלבד', emoji: '📞' },
                  { key: 'dataHeavy', label: 'שימוש באינטרנט', emoji: '📱' },
                  { key: 'international', label: 'שיחות בינלאומיות', emoji: '🌍' },
                  { key: 'roaming', label: 'נדידה בחו"ל', emoji: '✈️' }
                ].map(({ key, label, emoji }) => (
                  <Card 
                    key={key}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md",
                      profile.categorySpecific?.[key] 
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => updateProfile({ 
                      categorySpecific: { 
                        ...profile.categorySpecific, 
                        [key]: !profile.categorySpecific?.[key] 
                      } 
                    })}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{emoji}</div>
                      <div className="font-medium text-sm">{label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'tv':
        return (
          <div className="space-y-8">
            {/* סוג הצפייה */}
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Tv className="w-5 h-5 text-primary" />
                  סוג הצפייה
                </Label>
                <p className="text-sm text-muted-foreground mt-1">איך אתם אוהבים לצפות?</p>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'basic', label: 'בסיסי', desc: 'ערוצי חינם', emoji: '📺' },
                  { value: 'premium', label: 'מורחב', desc: 'חבילות תוכן', emoji: '🎬' },
                  { value: 'sports', label: 'ספורט', desc: 'ערוצי ספורט', emoji: '⚽' }
                ].map(({ value, label, desc, emoji }) => (
                  <Card 
                    key={value}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md",
                      profile.categorySpecific?.tvPackage === value 
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => updateProfile({ 
                      categorySpecific: { ...profile.categorySpecific, tvPackage: value } 
                    })}
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

            {/* שירותי VOD */}
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-lg font-semibold">שירותי VOD</Label>
                <p className="text-sm text-muted-foreground mt-1">איזה שירותים אתם רוצים?</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'netflix', label: 'נטפליקס', emoji: '🍿' },
                  { key: 'disney', label: 'דיסני+', emoji: '🏰' },
                  { key: 'hbo', label: 'HBO Max', emoji: '🎭' },
                  { key: 'local', label: 'תוכן ישראלי', emoji: '🇮🇱' }
                ].map(({ key, label, emoji }) => (
                  <Card 
                    key={key}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md",
                      profile.categorySpecific?.[key] 
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => updateProfile({ 
                      categorySpecific: { 
                        ...profile.categorySpecific, 
                        [key]: !profile.categorySpecific?.[key] 
                      } 
                    })}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{emoji}</div>
                      <div className="font-medium text-sm">{label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'basic':
        return (
          <div className="space-y-8">
            {/* Family Size - Interactive Counter */}
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  גודל משק הבית
                </Label>
                <p className="text-sm text-muted-foreground mt-1">כמה אנשים גרים בבית?</p>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateProfile({ familySize: Math.max(1, profile.familySize - 1) })}
                  disabled={profile.familySize <= 1}
                  className="h-12 w-12 rounded-full hover:scale-110 transition-transform"
                >
                  -
                </Button>
                
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 animate-pulse">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profile.familySize}</div>
                    <div className="text-xs text-muted-foreground">{profile.familySize === 1 ? 'אדם' : 'אנשים'}</div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateProfile({ familySize: Math.min(8, profile.familySize + 1) })}
                  disabled={profile.familySize >= 8}
                  className="h-12 w-12 rounded-full hover:scale-110 transition-transform"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Home Type - Card Selection */}
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Home className="w-5 h-5 text-primary" />
                  סוג הדיור
                </Label>
                <p className="text-sm text-muted-foreground mt-1">איפה אתם גרים?</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'apartment', label: 'דירה', icon: Building, emoji: '🏠' },
                  { value: 'house', label: 'בית פרטי', icon: Home, emoji: '🏡' },
                  { value: 'student', label: 'דיור סטודנטים', icon: GraduationCap, emoji: '🎓' },
                  { value: 'business', label: 'עסק', icon: Briefcase, emoji: '🏢' }
                ].map(({ value, label, icon: Icon, emoji }) => (
                  <Card 
                    key={value}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md",
                      profile.homeType === value 
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => updateProfile({ homeType: value as any })}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{emoji}</div>
                      <Icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                      <div className="font-medium text-sm">{label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Current Provider - Interactive Input */}
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-lg font-semibold flex items-center justify-center gap-2">
                  {categoryConfig[category].icon}
                  הספק הנוכחי ל{categoryConfig[category].label}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">איזה חברה משרתת אתכם היום?</p>
              </div>
              
              <div className="relative">
                <Input
                  value={profile.currentProvider}
                  onChange={(e) => updateProfile({ currentProvider: e.target.value })}
                  placeholder="לדוגמה: בזק, פרטנר, סלקום..."
                  className="h-14 text-center text-lg font-medium rounded-xl border-2 transition-all duration-300 focus:scale-105"
                />
                {profile.currentProvider && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <CheckCircle className="w-5 h-5 text-success animate-scale-in" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'budget':
        return (
          <div className="space-y-8">
            {/* Monthly Budget - Interactive Input */}
            <div className="space-y-6">
              <div className="text-center">
                <Label className="text-lg font-semibold flex items-center justify-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  תקציב חודshי מקסימלי
                </Label>
                <p className="text-sm text-muted-foreground mt-1">כמה אתם מוכנים להשקיע בחודש?</p>
              </div>
              
              <div className="relative">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateProfile({ monthlyBudget: Math.max(50, profile.monthlyBudget - 10) })}
                    className="h-12 w-12 rounded-full hover:scale-110 transition-transform"
                  >
                    -
                  </Button>
                  
                  <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-primary/10 to-primary-glow/10 border-4 border-primary/20 shadow-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{profile.monthlyBudget}</div>
                      <div className="text-sm text-muted-foreground">₪ בחודש</div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline" 
                    size="icon"
                    onClick={() => updateProfile({ monthlyBudget: Math.min(1000, profile.monthlyBudget + 10) })}
                    className="h-12 w-12 rounded-full hover:scale-110 transition-transform"
                  >
                    +
                  </Button>
                </div>
                
                <div className="px-4">
                  <Slider
                    value={[profile.monthlyBudget]}
                    onValueChange={([value]) => updateProfile({ monthlyBudget: value })}
                    max={500}
                    min={50}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>50₪</span>
                    <span>500₪</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Spending */}
            <div className="space-y-6">
              <div className="text-center">
                <Label className="text-lg font-semibold flex items-center justify-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  התשלום החודשי הנוכחי
                </Label>
                <p className="text-sm text-muted-foreground mt-1">כמה אתם משלמים היום?</p>
              </div>
              
              <div className="relative">
                <Input
                  type="number"
                  value={profile.currentMonthlySpend}
                  onChange={(e) => updateProfile({ currentMonthlySpend: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-300 focus:scale-105"
                  min="0"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">₪</div>
              </div>
            </div>
          </div>
        );

      case 'usage':
        return renderSectorSpecificUsage();

      case 'priorities':
        return (
          <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="text-center space-y-4 p-6 bg-gradient-to-br from-primary/5 via-background to-accent/5 rounded-3xl border border-primary/20">
              <div className="flex items-center justify-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-r from-warning to-warning/80 rounded-full flex items-center justify-center animate-pulse shadow-glow">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  מה הכי חשוב לכם?
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-lg text-muted-foreground font-medium">
                  בחרו את הדברים הכי חשובים לכם במסלול החדש
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium">
                  <Sparkles className="w-4 h-4" />
                  <span>דרגו על פי החשיבות עבורכם</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            {/* Priority Cards - Enhanced Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { 
                  key: 'price' as const, 
                  label: 'מחיר נמוך', 
                  icon: DollarSign, 
                  description: 'החיסכון המקסימלי עבור המשפחה',
                  color: 'from-green-500 to-emerald-600',
                  bgColor: 'from-green-500/10 to-emerald-600/5'
                },
                { 
                  key: 'reliability' as const, 
                  label: 'אמינות ויציבות', 
                  icon: Shield, 
                  description: 'רשת יציבה עם זמינות גבוהה',
                  color: 'from-indigo-500 to-blue-600',
                  bgColor: 'from-indigo-500/10 to-blue-600/5'
                },
                { 
                  key: 'speed' as const, 
                  label: 'מהירות וביצועים', 
                  icon: Zap, 
                  description: 'טכנולוגיה מתקדמת וביצועים מעולים',
                  color: 'from-purple-500 to-violet-600',
                  bgColor: 'from-purple-500/10 to-violet-600/5'
                },
                { 
                  key: 'customerService' as const, 
                  label: 'שירות לקוחות', 
                  icon: Heart, 
                  description: 'זמינות 24/7 ומקצועיות גבוהה',
                  color: 'from-pink-500 to-rose-600',
                  bgColor: 'from-pink-500/10 to-rose-600/5'
                }
              ].map((priority) => {
                const Icon = priority.icon;
                const currentValue = profile.priorities[priority.key];
                const isHighPriority = currentValue >= 4;
                
                return (
                  <Card 
                    key={priority.key}
                    className={cn(
                      "transition-all duration-500 border-2 group overflow-hidden relative",
                      isHighPriority 
                        ? `border-primary bg-gradient-to-br ${priority.bgColor} shadow-glow transform scale-105` 
                        : "border-border hover:border-primary/50 hover:bg-muted/50 hover:scale-102 hover:shadow-md"
                    )}
                  >
                    {/* Background gradient effect */}
                    {isHighPriority && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${priority.bgColor} opacity-20`}></div>
                    )}
                    
                    <CardContent className="p-6 relative z-10 space-y-6">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-md",
                          isHighPriority 
                            ? `bg-gradient-to-r ${priority.color} text-white transform rotate-3 shadow-lg` 
                            : "bg-muted text-muted-foreground group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-hover:text-white"
                        )}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className={cn(
                              "font-bold text-xl transition-colors",
                              isHighPriority ? "text-primary" : "text-foreground"
                            )}>
                              {priority.label}
                            </h4>
                            <Badge 
                              variant={isHighPriority ? "default" : "outline"} 
                              className={cn(
                                "px-3 py-1 text-sm font-bold transition-all duration-300",
                                isHighPriority && "bg-gradient-to-r from-primary to-accent text-white shadow-md"
                              )}
                            >
                              {currentValue}/5
                            </Badge>
                          </div>
                          <p className={cn(
                            "text-sm leading-relaxed",
                            isHighPriority ? "text-foreground font-medium" : "text-muted-foreground"
                          )}>
                            {priority.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Interactive Slider */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">לא חשוב</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star}
                                className={cn(
                                  "w-4 h-4 transition-all duration-300",
                                  star <= currentValue 
                                    ? "text-warning fill-warning" 
                                    : "text-muted-foreground/30"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-muted-foreground">חשוב מאוד</span>
                        </div>
                        
                        <Slider
                          value={[currentValue]}
                          onValueChange={([value]) => updatePriorities(priority.key, value)}
                          max={5}
                          min={1}
                          step={1}
                          className={cn(
                            "w-full [&_.relative]:h-4 [&_[role=slider]]:h-7 [&_[role=slider]]:w-7 [&_[role=slider]]:border-2",
                            isHighPriority && "[&_[role=slider]]:border-primary [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-primary [&_[role=slider]]:to-accent"
                          )}
                        />
                        
                        {/* Value Labels */}
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>1</span>
                          <span>2</span>
                          <span>3</span>
                          <span>4</span>
                          <span>5</span>
                        </div>
                      </div>
                      
                      {/* High Priority Indicator */}
                      {isHighPriority && (
                        <div className="flex items-center justify-center pt-2 border-t border-primary/20">
                          <div className="flex items-center gap-2 text-success font-medium text-sm">
                            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                            עדיפות גבוהה
                            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Summary Section */}
            <div className="p-6 bg-gradient-to-r from-muted/30 to-muted/20 rounded-2xl border border-border/50">
              <div className="text-center space-y-4">
                <h4 className="text-xl font-bold text-foreground flex items-center justify-center gap-3">
                  <Lightbulb className="w-6 h-6 text-warning" />
                  סיכום העדיפויות שלכם
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(profile.priorities).map(([key, value]) => {
                    const priorityLabels: Record<string, string> = {
                      price: 'מחיר',
                      reliability: 'אמינות',
                      speed: 'מהירות',
                      customerService: 'שירות לקוחות'
                    };
                    return (
                      <div key={key} className="text-center p-3 bg-card rounded-xl border border-border/30">
                        <div className="font-bold text-lg text-primary">{value}/5</div>
                        <div className="text-sm text-muted-foreground">{priorityLabels[key]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-background rounded-2xl shadow-2xl border-2 border-primary/10 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/5 to-primary-glow/5 border-b border-primary/10 p-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                {categoryConfig[category].icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  המלצה אישית ל{categoryConfig[category].label}
                </h2>
                <p className="text-muted-foreground">
                  בואו נמצא את המסלול המושלם עבורכם
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="hover:bg-destructive/10 hover:text-destructive rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">שלב {currentStep + 1} מתוך {steps.length}</span>
              <span className="text-muted-foreground">{Math.round(((currentStep + 1) / steps.length) * 100)}% הושלם</span>
            </div>
            
            <div className="relative">
              <Progress 
                value={((currentStep + 1) / steps.length) * 100} 
                className="h-3 bg-muted/50"
              />
            </div>
            
            {/* Step Indicators */}
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center text-xs transition-all duration-300",
                    index === currentStep ? "text-primary" : 
                    index < currentStep ? "text-success" : "text-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 shadow-lg",
                    index === currentStep ? "bg-primary text-primary-foreground" : 
                    index < currentStep ? "bg-success text-success-foreground" : "bg-muted"
                  )}>
                    {index < currentStep ? <CheckCircle className="w-5 h-5" /> : step.icon}
                  </div>
                  <span className="hidden sm:block font-medium">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="animate-fade-in">
              {renderStepContent()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/30 border-t border-primary/10 p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 h-12 px-6 rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              קודם
            </Button>

            <div className="text-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>הנתונים נשמרים אוטומטית</span>
              </div>
            </div>

            <Button
              onClick={handleNext}
              className="flex items-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Star className="h-4 w-4" />
                  קבל המלצה
                </>
              ) : (
                <>
                  הבא
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};