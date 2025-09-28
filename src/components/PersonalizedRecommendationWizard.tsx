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
  Briefcase
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
              
              <div className="flex justify-center">
                <div className="flex gap-1">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i < profile.familySize ? 'bg-primary scale-125' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
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

            {/* Mobile Lines Count - Interactive Slider */}
            {category === 'mobile' && (
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
                  
                  <div className="flex justify-center">
                    <div className="flex gap-1">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            i < (profile.categorySpecific?.multipleLines || 1) ? 'bg-primary scale-125' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Work From Home - Toggle Card */}
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  עבודה מהבית
                </Label>
                <p className="text-sm text-muted-foreground mt-1">האם אתם עובדים מהבית באופן קבוע?</p>
              </div>
              
              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:scale-105",
                  profile.workFromHome 
                    ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                    : "hover:bg-muted/50"
                )}
                onClick={() => updateProfile({ workFromHome: !profile.workFromHome })}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                        profile.workFromHome ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        <Home className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-semibold">עבודה מהבית</div>
                        <div className="text-sm text-muted-foreground">עבודה קבועה מהבית</div>
                      </div>
                    </div>
                    <Switch
                      checked={profile.workFromHome}
                      onCheckedChange={(checked) => updateProfile({ workFromHome: checked })}
                      className="scale-125"
                    />
                  </div>
                </CardContent>
              </Card>
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
                  תקציב חודשי מקסימלי
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
                    className="w-full [&_.relative]:h-4 [&_[role=slider]]:h-8 [&_[role=slider]]:w-8 [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-primary [&_[role=slider]]:to-primary-glow"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>50₪</span>
                    <span>500₪</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Spending - Interactive Comparison */}
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
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">₪</div>
                {profile.currentMonthlySpend > 0 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <CheckCircle className="w-6 h-6 text-success animate-scale-in" />
                  </div>
                )}
              </div>
              
              {profile.currentMonthlySpend > 0 && profile.monthlyBudget > profile.currentMonthlySpend && (
                <Card className="bg-gradient-to-r from-success/10 to-success/5 border-success/20 animate-fade-in">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-success" />
                      <span className="font-semibold text-success">פוטנציאל חיסכון!</span>
                    </div>
                    <div className="text-2xl font-bold text-success">
                      {profile.monthlyBudget - profile.currentMonthlySpend}₪ בחודש
                    </div>
                    <div className="text-sm text-success/80 mt-1">
                      {(profile.monthlyBudget - profile.currentMonthlySpend) * 12}₪ בשנה
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Price Flexibility - Card Selection */}
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  עד כמה המחיר חשוב לכם?
                </Label>
                <p className="text-sm text-muted-foreground mt-1">איך אתם מתייחסים למחיר?</p>
              </div>
              
              <div className="space-y-3">
                {[
                  { value: 'strict', label: 'המחיר הכי חשוב', desc: 'רוצה את הזול ביותר', icon: '💰', color: 'from-red-500/10 to-red-400/10' },
                  { value: 'flexible', label: 'מוכן לשלם יותר', desc: 'עבור שירות טוב', icon: '⚖️', color: 'from-yellow-500/10 to-yellow-400/10' },
                  { value: 'premium', label: 'מחיר לא משנה', desc: 'רוצה את הטוב ביותר', icon: '👑', color: 'from-green-500/10 to-green-400/10' }
                ].map(({ value, label, desc, icon, color }) => (
                  <Card 
                    key={value}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md",
                      profile.priceFlexibility === value 
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => updateProfile({ priceFlexibility: value as any })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${color} flex items-center justify-center text-xl`}>
                          {icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{label}</div>
                          <div className="text-sm text-muted-foreground">{desc}</div>
                        </div>
                        {profile.priceFlexibility === value && (
                          <CheckCircle className="w-5 h-5 text-primary animate-scale-in" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'usage':
        return (
          <div className="space-y-8">
            {/* Usage Level - Interactive Cards */}
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  רמת השימוש ב{categoryConfig[category].label}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">איך אתם משתמשים בשירות?</p>
              </div>
              
              <div className="grid gap-3">
                {[
                  { 
                    value: 'light', 
                    label: 'שימוש קל', 
                    desc: 'בסיסי ומינימלי', 
                    icon: '🌱',
                    gradient: 'from-blue-500/10 to-blue-400/10',
                    intensity: 33
                  },
                  { 
                    value: 'medium', 
                    label: 'שימוש בינוני', 
                    desc: 'יומיומי ורגיל', 
                    icon: '🌿',
                    gradient: 'from-green-500/10 to-green-400/10',
                    intensity: 66
                  },
                  { 
                    value: 'heavy', 
                    label: 'שימוש כבד', 
                    desc: 'אינטנסיבי ומקצועי', 
                    icon: '🔥',
                    gradient: 'from-red-500/10 to-red-400/10',
                    intensity: 100
                  }
                ].map(({ value, label, desc, icon, gradient, intensity }) => (
                  <Card 
                    key={value}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md",
                      profile.usageLevel === value 
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => updateProfile({ usageLevel: value as any })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-2xl relative overflow-hidden`}>
                          {icon}
                          <div 
                            className="absolute bottom-0 left-0 right-0 bg-primary/20 transition-all duration-500"
                            style={{ height: `${intensity}%` }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-lg">{label}</div>
                          <div className="text-sm text-muted-foreground">{desc}</div>
                          <div className="flex items-center gap-1 mt-2">
                            {Array.from({ length: 3 }, (_, i) => (
                              <div
                                key={i}
                                className={`h-1 w-8 rounded-full transition-all duration-300 ${
                                  i < intensity / 33 ? 'bg-primary' : 'bg-muted'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {profile.usageLevel === value && (
                          <CheckCircle className="w-6 h-6 text-primary animate-scale-in" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Usage Hours - Time Selection */}
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  מתי השימוש העיקרי?
                </Label>
                <p className="text-sm text-muted-foreground mt-1">באיזה שעות אתם הכי פעילים?</p>
              </div>
              
              <div className="grid gap-3">
                {[
                  { value: 'day', label: 'בעיקר ביום', icon: '☀️', time: '09:00-17:00', gradient: 'from-yellow-500/10 to-yellow-400/10' },
                  { value: 'evening', label: 'בעיקר בערב', icon: '🌙', time: '18:00-23:00', gradient: 'from-purple-500/10 to-purple-400/10' },
                  { value: 'mixed', label: 'לאורך כל היום', icon: '🔄', time: '24/7', gradient: 'from-orange-500/10 to-orange-400/10' }
                ].map(({ value, label, icon, time, gradient }) => (
                  <Card 
                    key={value}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md",
                      profile.usageHours === value 
                        ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => updateProfile({ usageHours: value as any })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-xl`}>
                          {icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{label}</div>
                          <div className="text-sm text-muted-foreground">{time}</div>
                        </div>
                        {profile.usageHours === value && (
                          <CheckCircle className="w-5 h-5 text-primary animate-scale-in" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Interactive Toggle Cards */}
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-lg font-semibold">פעילויות מיוחדות</Label>
                <p className="text-sm text-muted-foreground mt-1">בחרו את הפעילויות הרלוונטיות</p>
              </div>
              
              <div className="grid gap-3">
                {/* Streaming Card */}
                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:scale-105",
                    profile.streamingHeavy 
                      ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => updateProfile({ streamingHeavy: !profile.streamingHeavy })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300",
                          profile.streamingHeavy ? "bg-gradient-to-r from-red-500/20 to-red-400/20" : "bg-muted"
                        )}>
                          📺
                        </div>
                        <div>
                          <div className="font-semibold">צפייה בסטרימינג</div>
                          <div className="text-sm text-muted-foreground">נטפליקס, יוטיוב וכו'</div>
                        </div>
                      </div>
                      <Switch
                        checked={profile.streamingHeavy}
                        onCheckedChange={(checked) => updateProfile({ streamingHeavy: checked })}
                        className="scale-125"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Gaming Card */}
                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:scale-105",
                    profile.gamingHeavy 
                      ? "ring-2 ring-primary bg-primary/5 shadow-lg" 
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => updateProfile({ gamingHeavy: !profile.gamingHeavy })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300",
                          profile.gamingHeavy ? "bg-gradient-to-r from-purple-500/20 to-purple-400/20" : "bg-muted"
                        )}>
                          🎮
                        </div>
                        <div>
                          <div className="font-semibold">גיימינג אונליין</div>
                          <div className="text-sm text-muted-foreground">משחקים באינטרנט</div>
                        </div>
                      </div>
                      <Switch
                        checked={profile.gamingHeavy}
                        onCheckedChange={(checked) => updateProfile({ gamingHeavy: checked })}
                        className="scale-125"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'priorities':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <Label className="text-2xl font-bold flex items-center justify-center gap-3 mb-2">
                <Star className="w-6 h-6 text-primary" />
                העדיפות שלכם
              </Label>
              <p className="text-muted-foreground">דרגו כל קריטריון לפי החשיבות שלו עבורכם</p>
              <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted"></div>
                  <span>לא חשוב</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>חשוב מאוד</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { key: 'price', label: 'מחיר', icon: DollarSign, emoji: '💰', desc: 'העלות החודשית', color: 'from-green-500/10 to-green-400/10' },
                { key: 'reliability', label: 'אמינות', icon: Shield, emoji: '🛡️', desc: 'יציבות השירות', color: 'from-blue-500/10 to-blue-400/10' },
                { key: 'speed', label: 'מהירות', icon: Zap, emoji: '⚡', desc: 'ביצועים וזמני תגובה', color: 'from-yellow-500/10 to-yellow-400/10' },
                { key: 'customerService', label: 'שירות לקוחות', icon: Users, emoji: '👥', desc: 'תמיכה ויעוץ', color: 'from-purple-500/10 to-purple-400/10' },
                { key: 'flexibility', label: 'גמישות חוזה', icon: Settings, emoji: '🔧', desc: 'תנאי הסכם גמישים', color: 'from-orange-500/10 to-orange-400/10' },
                { key: 'features', label: 'תוספות ופיצ\'רים', icon: Star, emoji: '✨', desc: 'אפשרויות נוספות', color: 'from-pink-500/10 to-pink-400/10' },
                { key: 'brandTrust', label: 'מוניטין החברה', icon: CheckCircle, emoji: '🏆', desc: 'אמינות המותג', color: 'from-indigo-500/10 to-indigo-400/10' },
                { key: 'innovation', label: 'טכנולוגיה חדשנית', icon: Activity, emoji: '🚀', desc: 'חדשנות וטכנולוגיה', color: 'from-cyan-500/10 to-cyan-400/10' }
              ].map(({ key, label, icon: Icon, emoji, desc, color }) => {
                const value = profile.priorities[key as keyof UserProfile['priorities']];
                return (
                  <Card key={key} className={`bg-gradient-to-r ${color} border-2 transition-all duration-300 hover:shadow-lg`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-background/80 flex items-center justify-center text-xl">
                            {emoji}
                          </div>
                          <div>
                            <div className="font-semibold text-lg flex items-center gap-2">
                              <Icon className="w-5 h-5 text-primary" />
                              {label}
                            </div>
                            <div className="text-sm text-muted-foreground">{desc}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={value >= 4 ? "default" : value >= 3 ? "secondary" : "outline"} 
                            className="text-lg px-3 py-1 min-w-[50px] text-center font-bold"
                          >
                            {value}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Slider
                          value={[value]}
                          onValueChange={([newValue]) => updatePriorities(key as keyof UserProfile['priorities'], newValue)}
                          max={5}
                          min={1}
                          step={1}
                          className="w-full [&_.relative]:h-3 [&_[role=slider]]:h-6 [&_[role=slider]]:w-6"
                        />
                        
                        <div className="flex justify-between items-center">
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div
                                key={i}
                                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 ${
                                  i < value ? 'bg-primary shadow-lg' : 'bg-muted hover:bg-muted-foreground/30'
                                }`}
                                onClick={() => updatePriorities(key as keyof UserProfile['priorities'], i + 1)}
                              />
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {value === 1 && <span className="text-red-500 font-medium">לא חשוב</span>}
                            {value === 2 && <span className="text-orange-500 font-medium">קצת חשוב</span>}
                            {value === 3 && <span className="text-yellow-500 font-medium">חשוב</span>}
                            {value === 4 && <span className="text-blue-500 font-medium">מאוד חשוב</span>}
                            {value === 5 && <span className="text-green-500 font-medium">קריטי</span>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
        {/* Header - Fixed with Enhanced Design */}
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
          
          {/* Enhanced Progress Bar */}
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
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-glow/20 rounded-full opacity-50" />
            </div>
            
            {/* Interactive Step Indicators */}
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center text-xs cursor-pointer transition-all duration-300 hover:scale-110",
                    index === currentStep ? "text-primary" : 
                    index < currentStep ? "text-success" : "text-muted-foreground"
                  )}
                  onClick={() => index < currentStep && setCurrentStep(index)}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 shadow-lg",
                    index === currentStep ? "bg-primary text-primary-foreground animate-pulse" : 
                    index < currentStep ? "bg-success text-success-foreground" : "bg-muted"
                  )}>
                    {index < currentStep ? <CheckCircle className="w-5 h-5" /> : step.icon}
                  </div>
                  <span className="hidden sm:block font-medium">{step.title}</span>
                  {index === currentStep && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-1 animate-bounce" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content - Scrollable with Enhanced Styling */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="animate-fade-in">
              {renderStepContent()}
            </div>
          </div>
        </div>

        {/* Footer - Enhanced Design */}
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