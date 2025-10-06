import { useState, useEffect, useMemo } from 'react';
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
import { Separator } from '@/components/ui/separator';
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
  onComplete: (profile: UserProfile, categories: Array<'electricity' | 'internet' | 'mobile' | 'tv'>) => void;
  categories: Array<'electricity' | 'internet' | 'mobile' | 'tv'>;
  onClose: () => void;
}

export const PersonalizedRecommendationWizard = ({ 
  onComplete, 
  categories, 
  onClose 
}: PersonalizedRecommendationWizardProps) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const category = categories[currentCategoryIndex];
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
    location: '',
    categorySpecific: {}
  });

  const categoryConfig = {
    electricity: { icon: <Zap className="w-4 h-4" />, label: 'חשמל' },
    internet: { icon: <Wifi className="w-4 h-4" />, label: 'אינטרנט' },
    mobile: { icon: <Phone className="w-4 h-4" />, label: 'סלולר' },
    tv: { icon: <Tv className="w-4 h-4" />, label: 'טלוויזיה' }
  };

  // שלבים ספציפיים לכל סקטור - עכשיו יותר קצרים וממוקדים
  const getSectorSteps = () => {
    // Base step only for first category - merged all basic info
    const baseSteps = currentCategoryIndex === 0 ? [
      { id: 'overview', title: 'בואו נכיר', icon: <Users className="w-4 h-4" /> }
    ] : [];

    const sectorSpecificSteps = {
      electricity: [
        { id: 'usage', title: `שימוש ב${categoryConfig[category].label}`, icon: <Zap className="w-4 h-4" /> },
        { id: 'priorities', title: 'מה חשוב לך', icon: <Star className="w-4 h-4" /> }
      ],
      internet: [
        { id: 'usage', title: `שימוש ב${categoryConfig[category].label}`, icon: <Router className="w-4 h-4" /> },
        { id: 'priorities', title: 'מה חשוב לך', icon: <Star className="w-4 h-4" /> }
      ],
      mobile: [
        { id: 'usage', title: `שימוש ב${categoryConfig[category].label}`, icon: <Signal className="w-4 h-4" /> },
        { id: 'priorities', title: 'מה חשוב לך', icon: <Star className="w-4 h-4" /> }
      ],
      tv: [
        { id: 'usage', title: `שימוש ב${categoryConfig[category].label}`, icon: <MonitorSpeaker className="w-4 h-4" /> },
        { id: 'priorities', title: 'מה חשוב לך', icon: <Star className="w-4 h-4" /> }
      ]
    };

    return [...baseSteps, ...sectorSpecificSteps[category]];
  };

  const steps = getSectorSteps();

  // Load saved data on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('wizardProfile');
    const savedStep = localStorage.getItem('wizardStep');
    const savedCategory = localStorage.getItem('wizardCategory');
    
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Failed to load saved profile', e);
      }
    }
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
    if (savedCategory) {
      setCurrentCategoryIndex(parseInt(savedCategory));
    }
  }, []);

  // Auto-save progress to localStorage whenever profile changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('wizardProfile', JSON.stringify(profile));
      localStorage.setItem('wizardStep', currentStep.toString());
      localStorage.setItem('wizardCategory', currentCategoryIndex.toString());
    }, 500); // Debounce saves by 500ms

    return () => clearTimeout(timeout);
  }, [profile, currentStep, currentCategoryIndex]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (currentCategoryIndex < categories.length - 1) {
      // Move to next category
      console.log(`✅ Completed category: ${category}, moving to next...`);
      console.log(`Current profile categorySpecific:`, profile.categorySpecific);
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentStep(0);
    } else {
      console.log('🎉 Wizard completed! Final profile:', profile);
      console.log('Categories:', categories);
      console.log('CategorySpecific data:', profile.categorySpecific);
      onComplete(profile, categories);
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

  const updateCategorySpecific = (updates: any) => {
    setProfile(prev => ({
      ...prev,
      categorySpecific: {
        ...prev.categorySpecific,
        [category]: {
          ...(prev.categorySpecific?.[category] || {}),
          ...updates
        }
      }
    }));
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
                  onClick={() => updateCategorySpecific({ 
                    monthlyKWH: Math.max(100, (profile.categorySpecific?.[category]?.monthlyKWH || 500) - 50) 
                  })}
                  className="h-12 w-12 rounded-full hover:scale-110 transition-transform"
                >
                  -
                </Button>
                
                  <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-primary/10 to-primary-glow/10 border-4 border-primary/20 shadow-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{profile.categorySpecific?.[category]?.monthlyKWH || 500}</div>
                      <div className="text-sm text-muted-foreground">kWh</div>
                    </div>
                  </div>
                
                <Button
                  variant="outline" 
                  size="icon"
                  onClick={() => updateCategorySpecific({ 
                    monthlyKWH: Math.min(2000, (profile.categorySpecific?.[category]?.monthlyKWH || 500) + 50) 
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
                      profile.categorySpecific?.[category]?.[key] 
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => updateCategorySpecific({ 
                      [key]: !profile.categorySpecific?.[category]?.[key] 
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
                      profile.categorySpecific?.[category]?.internetSpeed === value 
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => updateCategorySpecific({ internetSpeed: value })}
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
                      profile.categorySpecific?.[category]?.[key] 
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => updateCategorySpecific({ 
                      [key]: !profile.categorySpecific?.[category]?.[key] 
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
                      <div className="text-xl font-bold text-primary">{profile.categorySpecific?.[category]?.multipleLines || 1}</div>
                      <div className="text-xs text-muted-foreground">{(profile.categorySpecific?.[category]?.multipleLines || 1) === 1 ? 'קו' : 'קווים'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="px-4">
                  <Slider
                    value={[profile.categorySpecific?.[category]?.multipleLines || 1]}
                    onValueChange={([value]) => updateCategorySpecific({ 
                      multipleLines: value 
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
                      profile.categorySpecific?.[category]?.[key] 
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => updateCategorySpecific({ 
                      [key]: !profile.categorySpecific?.[category]?.[key] 
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
                      profile.categorySpecific?.[category]?.tvPackage === value 
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => updateCategorySpecific({ tvPackage: value })}
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
                      profile.categorySpecific?.[category]?.[key] 
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => updateCategorySpecific({ 
                      [key]: !profile.categorySpecific?.[category]?.[key] 
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
      case 'overview':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground text-right">
                💡 כל השאלות אופציונליות - ככל שתענה על יותר, ההמלצות יהיו מדויקות יותר
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="familySize" className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  כמה נפשות במשפחה?
                </Label>
                <Input
                  id="familySize"
                  type="number"
                  min="1"
                  max="20"
                  value={profile.familySize}
                  onChange={(e) => updateProfile({ familySize: parseInt(e.target.value) || 1 })}
                  className="text-right text-lg h-12"
                  placeholder="4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeType" className="text-lg font-semibold flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  סוג הדיור
                </Label>
                <Select
                  value={profile.homeType}
                  onValueChange={(value: 'apartment' | 'house' | 'student' | 'business') => 
                    updateProfile({ homeType: value })
                  }
                >
                  <SelectTrigger id="homeType" className="text-right text-lg h-12">
                    <SelectValue placeholder="בחר סוג דיור" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">דירה</SelectItem>
                    <SelectItem value="house">בית פרטי</SelectItem>
                    <SelectItem value="student">דיור סטודנטים</SelectItem>
                    <SelectItem value="business">עסק</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  איזור מגורים (אופציונלי)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => updateProfile({ location: e.target.value })}
                    placeholder="עיר או אזור"
                    className="text-right text-lg h-12 flex-1"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {['מרכז', 'צפון', 'דרום', 'ירושלים'].map(region => (
                    <Button
                      key={region}
                      type="button"
                      variant={profile.location === region ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateProfile({ location: region })}
                      className="flex-1"
                    >
                      {region}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyBudget" className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  כמה אתם משלמים היום?
                </Label>
                <Input
                  id="monthlyBudget"
                  type="number"
                  min="0"
                  value={profile.monthlyBudget}
                  onChange={(e) => updateProfile({ monthlyBudget: parseFloat(e.target.value) || 0 })}
                  className="text-right text-lg h-12"
                  placeholder="למשל: 250"
                />
                <p className="text-sm text-muted-foreground text-right">
                  ₪ לחודש עבור {categoryConfig[category].label}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentProvider" className="text-lg font-semibold flex items-center gap-2">
                {categoryConfig[category].icon}
                מי הספק הנוכחי? (אופציונלי)
              </Label>
              <Input
                id="currentProvider"
                value={profile.currentProvider}
                onChange={(e) => updateProfile({ currentProvider: e.target.value })}
                placeholder={
                  category === 'electricity' ? 'לדוגמה: חברת החשמל' :
                  category === 'internet' ? 'לדוגמה: בזק בינלאומי' :
                  category === 'mobile' ? 'לדוגמה: פרטנר' :
                  'לדוגמה: yes'
                }
                className="text-right text-lg h-12"
              />
            </div>
          </div>
        );

      case 'usage':
        return renderSectorSpecificUsage();

      case 'priorities':
        return (
          <div className="space-y-8">
            {/* Clean Header */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-3">
                <Star className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">
                  מה הכי חשוב לכם?
                </h3>
              </div>
              <p className="text-muted-foreground max-w-lg mx-auto">
                דרגו את הקריטריונים החשובים לכם. זה יעזור לנו למצוא את המסלול המתאים ביותר.
              </p>
            </div>

            {/* Main Priority - Single Focus Question */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardContent className="p-6 space-y-4">
                <div className="text-center space-y-2">
                  <Label className="text-lg font-semibold">מה הדבר הכי חשוב לכם במסלול?</Label>
                  <p className="text-sm text-muted-foreground">בחרו אחד שחשוב לכם מעל הכל</p>
                </div>
                
                <RadioGroup 
                  value={profile.categorySpecific?.[category]?.topPriority || 'price'}
                  onValueChange={(value) => updateCategorySpecific({ topPriority: value })}
                  className="grid grid-cols-2 gap-3"
                >
                  {[
                    { value: 'price', label: '💰 מחיר נמוך', desc: 'חיסכון מקסימלי' },
                    { value: 'reliability', label: '🛡️ אמינות', desc: 'שירות יציב' },
                    { value: 'speed', label: '⚡ ביצועים', desc: 'מהירות גבוהה' },
                    { value: 'service', label: '❤️ שירות', desc: 'תמיכה מעולה' }
                  ].map(({ value, label, desc }) => (
                    <label
                      key={value}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-primary/5",
                        profile.categorySpecific?.[category]?.topPriority === value
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border"
                      )}
                    >
                      <RadioGroupItem value={value} id={value} className="mt-1" />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{label}</div>
                        <div className="text-xs text-muted-foreground">{desc}</div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Sector-Specific Questions */}
            {category === 'electricity' && (
              <Card className="border border-border/50">
                <CardContent className="p-6 space-y-4">
                  <Label className="text-base font-semibold">האם אתם מוכנים לחתום על התחייבות?</Label>
                  <RadioGroup 
                    value={profile.categorySpecific?.[category]?.commitmentWillingness || 'no'}
                    onValueChange={(value) => updateCategorySpecific({ commitmentWillingness: value })}
                    className="space-y-2"
                  >
                    <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="yes" id="commit-yes" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">כן, מוכן להתחייבות</div>
                        <div className="text-xs text-muted-foreground">בתמורה למחירים טובים יותר</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="no" id="commit-no" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">לא, רוצה גמישות</div>
                        <div className="text-xs text-muted-foreground">אפשרות לעזוב בכל רגע</div>
                      </div>
                    </label>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {category === 'internet' && (
              <Card className="border border-border/50">
                <CardContent className="p-6 space-y-4">
                  <Label className="text-base font-semibold">מה יותר חשוב לכם?</Label>
                  <RadioGroup 
                    value={profile.categorySpecific?.[category]?.internetPreference || 'speed'}
                    onValueChange={(value) => updateCategorySpecific({ internetPreference: value })}
                    className="space-y-2"
                  >
                    <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="speed" id="pref-speed" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">מהירות גבוהה</div>
                        <div className="text-xs text-muted-foreground">חשוב שהאינטרנט יהיה מהיר גם בשעות עומס</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="stability" id="pref-stability" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">יציבות</div>
                        <div className="text-xs text-muted-foreground">חשוב שלא יהיו ניתוקים והאינטרנט יעבוד כל הזמן</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="price" id="pref-price" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">מחיר נמוך</div>
                        <div className="text-xs text-muted-foreground">המחיר הוא השיקול העיקרי</div>
                      </div>
                    </label>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {category === 'mobile' && (
              <Card className="border border-border/50">
                <CardContent className="p-6 space-y-4">
                  <Label className="text-base font-semibold">האם אתם נוסעים לחו"ל?</Label>
                  <RadioGroup 
                    value={profile.categorySpecific?.[category]?.travelFrequency || 'rarely'}
                    onValueChange={(value) => updateCategorySpecific({ travelFrequency: value })}
                    className="space-y-2"
                  >
                    <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="often" id="travel-often" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">כן, לעיתים קרובות</div>
                        <div className="text-xs text-muted-foreground">חשוב לי שיהיה לי כיסוי טוב בחו"ל</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="sometimes" id="travel-sometimes" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">מדי פעם</div>
                        <div className="text-xs text-muted-foreground">פעם בשנה או שנתיים</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="rarely" id="travel-rarely" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">כמעט אף פעם</div>
                        <div className="text-xs text-muted-foreground">לא חשוב לי כיסוי בחו"ל</div>
                      </div>
                    </label>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {category === 'tv' && (
              <Card className="border border-border/50">
                <CardContent className="p-6 space-y-4">
                  <Label className="text-base font-semibold">כמה שעות ביום אתם צופים בטלוויזיה?</Label>
                  <RadioGroup 
                    value={profile.categorySpecific?.[category]?.watchingHours || 'medium'}
                    onValueChange={(value) => updateCategorySpecific({ watchingHours: value })}
                    className="space-y-2"
                  >
                    <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="low" id="watch-low" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">פחות משעה ביום</div>
                        <div className="text-xs text-muted-foreground">רק בסופי שבוע או לפעמים</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="medium" id="watch-medium" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">1-3 שעות ביום</div>
                        <div className="text-xs text-muted-foreground">צופה קבוע אבל לא הרבה</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="high" id="watch-high" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">יותר מ-3 שעות ביום</div>
                        <div className="text-xs text-muted-foreground">הטלוויזיה פועלת הרבה זמן</div>
                      </div>
                    </label>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {/* Additional Context Question */}
            <Card className="border border-border/50">
              <CardContent className="p-6 space-y-4">
                <Label className="text-base font-semibold">איזה תקופת התחייבות מתאימה לכם?</Label>
                <RadioGroup 
                  value={profile.contractFlexibility}
                  onValueChange={(value: any) => updateProfile({ contractFlexibility: value })}
                  className="space-y-2"
                >
                  <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="no_commitment" id="contract-no" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">ללא התחייבות</div>
                      <div className="text-xs text-muted-foreground">רוצה לעזוב בכל רגע</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="short" id="contract-short" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">עד שנה</div>
                      <div className="text-xs text-muted-foreground">התחייבות קצרה</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="doesnt_matter" id="contract-any" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">לא משנה</div>
                      <div className="text-xs text-muted-foreground">מוכן להתחייב אם המחיר טוב</div>
                    </div>
                  </label>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl max-h-[90vh] bg-background rounded-2xl shadow-2xl border-2 border-primary/10 flex overflow-hidden">
        {/* Sidebar - Progress & Steps */}
        <div className="w-80 bg-gradient-to-b from-primary/5 via-primary-glow/5 to-background border-l border-primary/10 flex flex-col flex-shrink-0">
          {/* Header */}
          <div className="p-6 border-b border-primary/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg">
                {categoryConfig[category].icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">
                  {categoryConfig[category].label}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {categories.length > 1 && (
                    <>סקטור {currentCategoryIndex + 1}/{categories.length}</>
                  )}
                </p>
              </div>
            </div>
            
            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">התקדמות</span>
                <span className="font-bold text-primary">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <Progress 
                value={((currentStep + 1) / steps.length) * 100} 
                className="h-2"
              />
            </div>
          </div>

          {/* Step List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const isUpcoming = index > currentStep;
              
              return (
                <div 
                  key={step.id}
                  className={cn(
                    "relative p-4 rounded-xl transition-all duration-300 cursor-pointer group",
                    isCurrent && "bg-primary/10 border-2 border-primary shadow-md",
                    isCompleted && "bg-success/5 border border-success/20 hover:bg-success/10",
                    isUpcoming && "bg-muted/20 border border-border/30 hover:bg-muted/40"
                  )}
                  onClick={() => {
                    if (index < currentStep) {
                      setCurrentStep(index);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0",
                      isCurrent && "bg-primary text-primary-foreground shadow-lg scale-110",
                      isCompleted && "bg-success text-success-foreground",
                      isUpcoming && "bg-muted text-muted-foreground"
                    )}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <div className="text-lg font-bold">{index + 1}</div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "font-semibold text-sm transition-colors",
                        isCurrent && "text-primary",
                        isCompleted && "text-success",
                        isUpcoming && "text-muted-foreground"
                      )}>
                        {step.title}
                      </div>
                      <div className={cn(
                        "text-xs transition-opacity",
                        isCurrent ? "text-primary/70 opacity-100" : "text-muted-foreground opacity-60"
                      )}>
                        {isCompleted && "הושלם ✓"}
                        {isCurrent && "בתהליך..."}
                        {isUpcoming && "ממתין"}
                      </div>
                    </div>

                    {isCurrent && (
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>

                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "absolute right-[2.25rem] top-14 w-0.5 h-4 transition-colors",
                      isCompleted ? "bg-success/30" : "bg-border/30"
                    )} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Help Section */}
          <div className="p-4 border-t border-primary/10 bg-gradient-to-t from-muted/30 to-transparent">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">💡 עצה</p>
                <p>ענו בכנות כדי לקבל המלצות מדויקות יותר</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar with Close */}
          <div className="p-4 border-b border-border/50 bg-muted/20 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                {steps[currentStep]?.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                שלב {currentStep + 1} מתוך {steps.length}
              </p>
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

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8 max-w-3xl mx-auto">
              <div className="animate-fade-in">
                {renderStepContent()}
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="border-t border-border/50 bg-gradient-to-t from-muted/30 to-transparent p-6">
            <div className="max-w-3xl mx-auto flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2 h-11 px-5 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                קודם
              </Button>

              <div className="text-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="font-medium">שמירה אוטומטית</span>
                </div>
              </div>

              <Button
                onClick={handleNext}
                className="flex items-center gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                {currentStep === steps.length - 1 ? (
                  currentCategoryIndex < categories.length - 1 ? (
                    <>
                      סקטור הבא
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      קבל המלצות
                    </>
                  )
                ) : (
                  <>
                    המשך
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};