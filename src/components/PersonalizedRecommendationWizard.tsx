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
  Tv
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
      icon: <Zap className="w-6 h-6" />,
      label: 'חשמל',
      color: 'bg-yellow-500'
    },
    internet: {
      icon: <Wifi className="w-6 h-6" />,
      label: 'אינטרנט',
      color: 'bg-blue-500'
    },
    mobile: {
      icon: <Phone className="w-6 h-6" />,
      label: 'סלולר',
      color: 'bg-green-500'
    },
    tv: {
      icon: <Tv className="w-6 h-6" />,
      label: 'טלוויזיה',
      color: 'bg-purple-500'
    }
  };

  const steps = [
    {
      id: 'basic',
      title: 'פרטים בסיסיים',
      icon: <User className="w-5 h-5" />,
      description: 'ספרו לנו על עצמכם'
    },
    {
      id: 'home',
      title: 'מאפייני הבית',
      icon: <Home className="w-5 h-5" />,
      description: 'פרטי הדיור שלכם'
    },
    {
      id: 'budget',
      title: 'תקציב ומחירים',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'העדפות כלכליות'
    },
    {
      id: 'usage',
      title: 'דפוסי שימוש',
      icon: <Activity className="w-5 h-5" />,
      description: 'איך אתם משתמשים'
    },
    {
      id: 'priorities',
      title: 'סדר עדיפויות',
      icon: <Star className="w-5 h-5" />,
      description: 'מה חשוב לכם'
    },
    {
      id: 'preferences',
      title: 'העדפות נוספות',
      icon: <Settings className="w-5 h-5" />,
      description: 'פרטים מתקדמים'
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

  const updateCategorySpecific = (updates: any) => {
    setProfile(prev => ({
      ...prev,
      categorySpecific: {
        ...prev.categorySpecific,
        ...updates
      }
    }));
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white", categoryConfig[category].color)}>
                {categoryConfig[category].icon}
              </div>
              <h3 className="text-2xl font-bold font-heebo">בואו נכיר!</h3>
              <p className="text-muted-foreground font-assistant">
                כמה פרטים בסיסיים יעזרו לנו למצוא את המסלול המושלם עבור {categoryConfig[category].label}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold font-heebo">גודל משק הבית</Label>
                <div className="flex items-center gap-4">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <Slider
                    value={[profile.familySize]}
                    onValueChange={([value]) => updateProfile({ familySize: value })}
                    max={8}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <Badge variant="outline" className="min-w-[60px] justify-center">
                    {profile.familySize} נפשות
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold font-heebo">סוג הדיור</Label>
                <Select value={profile.homeType} onValueChange={(value: any) => updateProfile({ homeType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="apartment">דירה</SelectItem>
                    <SelectItem value="house">בית פרטי</SelectItem>
                    <SelectItem value="student">דיור סטודנטים</SelectItem>
                    <SelectItem value="business">עסק</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold font-heebo">אזור מגורים (אופציונלי)</Label>
                <Select value={profile.location} onValueChange={(value: any) => updateProfile({ location: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחרו אזור" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="north">צפון</SelectItem>
                    <SelectItem value="center">מרכז</SelectItem>
                    <SelectItem value="south">דרום</SelectItem>
                    <SelectItem value="jerusalem">ירושלים והסביבה</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold font-heebo">הספק הנוכחי (אופציונלי)</Label>
                <Input
                  value={profile.currentProvider}
                  onChange={(e) => updateProfile({ currentProvider: e.target.value })}
                  placeholder={`הספק הנוכחי ל${categoryConfig[category].label}`}
                />
              </div>
            </div>
          </div>
        );

      case 'home':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Home className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold font-heebo">מאפייני הבית</h3>
              <p className="text-muted-foreground font-assistant">
                פרטים על הבית יעזרו לנו להמליץ על המסלול המתאים
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold font-heebo">עובד/ת מהבית?</Label>
                  <Switch
                    checked={profile.workFromHome}
                    onCheckedChange={(checked) => updateProfile({ workFromHome: checked })}
                  />
                </div>
                <p className="text-sm text-muted-foreground font-assistant">
                  יעזור לנו להמליץ על מסלולים מתאימים לעבודה מהבית
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold font-heebo">צופה הרבה סטרימינג?</Label>
                  <Switch
                    checked={profile.streamingHeavy}
                    onCheckedChange={(checked) => updateProfile({ streamingHeavy: checked })}
                  />
                </div>
                <p className="text-sm text-muted-foreground font-assistant">
                  נטפליקס, יוטיוב, דיסני+ וכו'
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold font-heebo">גיימר/ית כבד/ה?</Label>
                  <Switch
                    checked={profile.gamingHeavy}
                    onCheckedChange={(checked) => updateProfile({ gamingHeavy: checked })}
                  />
                </div>
                <p className="text-sm text-muted-foreground font-assistant">
                  משחקים מקוונים, עדכונים גדולים
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold font-heebo">שעות השימוש העיקריות</Label>
                <Select value={profile.usageHours} onValueChange={(value: any) => updateProfile({ usageHours: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="morning">בוקר (6-12)</SelectItem>
                    <SelectItem value="day">יום (12-18)</SelectItem>
                    <SelectItem value="evening">ערב (18-23)</SelectItem>
                    <SelectItem value="night">לילה (23-6)</SelectItem>
                    <SelectItem value="mixed">מעורב</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category-specific fields */}
            {category === 'electricity' && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg font-heebo">פרטים נוספים לחשמל</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold font-heebo">יש לכם מונה חכם?</Label>
                    <Switch
                      checked={profile.categorySpecific?.hasSmartMeter || false}
                      onCheckedChange={(checked) => updateCategorySpecific({ hasSmartMeter: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold font-heebo">יש לכם פאנלים סולאריים?</Label>
                    <Switch
                      checked={profile.categorySpecific?.hasSolarPanels || false}
                      onCheckedChange={(checked) => updateCategorySpecific({ hasSolarPanels: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold font-heebo">מודעים לשעות צריכה?</Label>
                    <Switch
                      checked={profile.categorySpecific?.timeOfUseAware || false}
                      onCheckedChange={(checked) => updateCategorySpecific({ timeOfUseAware: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {category === 'internet' && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg font-heebo">פרטים נוספים לאינטרנט</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold font-heebo">מהירות מינימלית נדרשת (Mbps)</Label>
                    <Input
                      type="number"
                      value={profile.categorySpecific?.requiredSpeed || ''}
                      onChange={(e) => updateCategorySpecific({ requiredSpeed: parseInt(e.target.value) || 0 })}
                      placeholder="לדוגמה: 100"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold font-heebo">מהירות העלאה חשובה?</Label>
                    <Switch
                      checked={profile.categorySpecific?.uploadImportant || false}
                      onCheckedChange={(checked) => updateCategorySpecific({ uploadImportant: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'budget':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold font-heebo">תקציב והעדפות כלכליות</h3>
              <p className="text-muted-foreground font-assistant">
                נעזור לכם למצוא את המסלול הכי כדאי בתקציב שלכם
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heebo">תקציב חודשי מקסימלי</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={profile.monthlyBudget}
                      onChange={(e) => updateProfile({ monthlyBudget: parseInt(e.target.value) || 0 })}
                      className="text-xl text-center font-bold"
                    />
                    <span className="text-xl font-bold">₪</span>
                  </div>
                  <Slider
                    value={[profile.monthlyBudget]}
                    onValueChange={([value]) => updateProfile({ monthlyBudget: value })}
                    max={500}
                    min={50}
                    step={10}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heebo">מחיר נוכחי (אופציונלי)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={profile.currentMonthlySpend}
                      onChange={(e) => updateProfile({ currentMonthlySpend: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="text-xl text-center font-bold"
                    />
                    <span className="text-xl font-bold">₪</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-assistant">
                    כמה אתם משלמים היום? יעזור לנו לחשב חיסכון
                  </p>
                </CardContent>
              </Card>

              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-heebo">גמישות במחיר</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={profile.priceFlexibility} onValueChange={(value: any) => updateProfile({ priceFlexibility: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border shadow-lg z-50">
                        <SelectItem value="strict">קפדני - אסור לחרוג מהתקציב</SelectItem>
                        <SelectItem value="flexible">גמיש - אפשר לחרוג עד 20%</SelectItem>
                        <SelectItem value="very_flexible">גמיש מאוד - איכות חשובה ממחיר</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'usage':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Activity className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold font-heebo">דפוסי השימוש שלכם</h3>
              <p className="text-muted-foreground font-assistant">
                איך אתם משתמשים ב{categoryConfig[category].label}?
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-heebo">רמת השימוש</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: 'light', label: 'קל', desc: 'שימוש בסיסי' },
                    { value: 'medium', label: 'בינוני', desc: 'שימוש יומיומי' },
                    { value: 'heavy', label: 'כבד', desc: 'שימוש אינטנסיבי' },
                    { value: 'extreme', label: 'קיצוני', desc: 'משתמש מקצועי' }
                  ].map((option) => (
                    <Card
                      key={option.value}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-lg",
                        profile.usageLevel === option.value
                          ? "ring-2 ring-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      )}
                      onClick={() => updateProfile({ usageLevel: option.value as any })}
                    >
                      <CardContent className="p-4 text-center space-y-2">
                        <div className="text-lg font-bold font-heebo">{option.label}</div>
                        <div className="text-sm text-muted-foreground font-assistant">{option.desc}</div>
                        {profile.usageLevel === option.value && (
                          <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category-specific usage questions */}
            {category === 'mobile' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heebo">שימוש סלולרי</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold font-heebo">שיחות בינלאומיות תכופות?</Label>
                    <Switch
                      checked={profile.categorySpecific?.internationalCalls || false}
                      onCheckedChange={(checked) => updateCategorySpecific({ internationalCalls: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold font-heebo">שימוש כבד בנתונים?</Label>
                    <Switch
                      checked={profile.categorySpecific?.dataHeavyUser || false}
                      onCheckedChange={(checked) => updateCategorySpecific({ dataHeavyUser: checked })}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold font-heebo">מספר קווים נדרש</Label>
                    <Input
                      type="number"
                      value={profile.categorySpecific?.multipleLines || 1}
                      onChange={(e) => updateCategorySpecific({ multipleLines: parseInt(e.target.value) || 1 })}
                      min={1}
                      max={10}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {category === 'tv' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heebo">העדפות צפייה</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold font-heebo">ערוצי ספורט חשובים?</Label>
                    <Switch
                      checked={profile.categorySpecific?.sportsImportant || false}
                      onCheckedChange={(checked) => updateCategorySpecific({ sportsImportant: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold font-heebo">ערוצי ילדים נדרשים?</Label>
                    <Switch
                      checked={profile.categorySpecific?.kidsChannels || false}
                      onCheckedChange={(checked) => updateCategorySpecific({ kidsChannels: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold font-heebo">הקלטה חשובה?</Label>
                    <Switch
                      checked={profile.categorySpecific?.recordingImportant || false}
                      onCheckedChange={(checked) => updateCategorySpecific({ recordingImportant: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'priorities':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold font-heebo">מה הכי חשוב לכם?</h3>
              <p className="text-muted-foreground font-assistant">
                דרגו את החשיבות של כל קריטריון (1 = לא חשוב, 5 = חשוב מאוד)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'price', label: 'מחיר', desc: 'עלות חודשית נמוכה', icon: '💰' },
                { key: 'reliability', label: 'אמינות', desc: 'ספק יציב ואמין', icon: '🔒' },
                { key: 'speed', label: 'מהירות/ביצועים', desc: 'ביצועים טכניים גבוהים', icon: '⚡' },
                { key: 'customerService', label: 'שירות לקוחות', desc: 'תמיכה ושירות איכותי', icon: '📞' },
                { key: 'flexibility', label: 'גמישות', desc: 'חוזה גמיש וללא התחייבות', icon: '🔄' },
                { key: 'features', label: 'תכונות', desc: 'מגוון תכונות ושירותים', icon: '✨' },
                { key: 'brandTrust', label: 'מוניטין המותג', desc: 'מותג מוכר ומהימן', icon: '🏢' },
                { key: 'innovation', label: 'חדשנות', desc: 'טכנולוגיות מתקדמות', icon: '🚀' }
              ].map((priority) => (
                <Card key={priority.key}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{priority.icon}</span>
                      <div>
                        <h4 className="font-bold font-heebo">{priority.label}</h4>
                        <p className="text-sm text-muted-foreground font-assistant">{priority.desc}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-sm">לא חשוב</span>
                      <Slider
                        value={[profile.priorities[priority.key as keyof typeof profile.priorities]]}
                        onValueChange={([value]) => updatePriorities(priority.key as keyof typeof profile.priorities, value)}
                        max={5}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm">חשוב מאוד</span>
                    </div>
                    
                    <div className="flex justify-center mt-2">
                      <Badge variant="outline" className="text-lg font-bold">
                        {profile.priorities[priority.key as keyof typeof profile.priorities]}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold font-heebo">העדפות נוספות</h3>
              <p className="text-muted-foreground font-assistant">
                פרטים אחרונים לכיוונון מדויק של ההמלצות
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heebo">גמישות חוזה</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={profile.contractFlexibility} onValueChange={(value: any) => updateProfile({ contractFlexibility: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="no_commitment">ללא התחייבות - חובה</SelectItem>
                      <SelectItem value="short_term">התחייבות קצרה (עד שנה)</SelectItem>
                      <SelectItem value="long_term">התחייבות ארוכה מקובלת</SelectItem>
                      <SelectItem value="doesnt_matter">לא משנה לי</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heebo">העדפת טכנולוגיה</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={profile.technologyPreference} onValueChange={(value: any) => updateProfile({ technologyPreference: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="latest">הכי חדש - טכנולוגיה מתקדמת</SelectItem>
                      <SelectItem value="stable">יציב ומוכח</SelectItem>
                      <SelectItem value="basic">בסיסי - עושה את העבודה</SelectItem>
                      <SelectItem value="doesnt_matter">לא משנה לי</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heebo">חשיבות התמיכה</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={profile.supportImportance} onValueChange={(value: any) => updateProfile({ supportImportance: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg z-50">
                      <SelectItem value="critical">קריטי - חייב שירות מעולה</SelectItem>
                      <SelectItem value="important">חשוב - שירות טוב</SelectItem>
                      <SelectItem value="nice_to_have">נחמד אבל לא חיוני</SelectItem>
                      <SelectItem value="not_important">לא חשוב</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heebo">סיכום פרופיל שלכם</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-assistant">משק בית:</span>
                    <Badge>{profile.familySize} נפשות</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-assistant">תקציב:</span>
                    <Badge>₪{profile.monthlyBudget}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-assistant">שימוש:</span>
                    <Badge>{profile.usageLevel === 'light' ? 'קל' : profile.usageLevel === 'medium' ? 'בינוני' : profile.usageLevel === 'heavy' ? 'כבד' : 'קיצוני'}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-assistant">עדיפות עליונה:</span>
                    <Badge>
                      {Object.entries(profile.priorities).reduce((a, b) => profile.priorities[a[0] as keyof typeof profile.priorities] > profile.priorities[b[0] as keyof typeof profile.priorities] ? a : b)[0] === 'price' ? 'מחיר' : 
                       Object.entries(profile.priorities).reduce((a, b) => profile.priorities[a[0] as keyof typeof profile.priorities] > profile.priorities[b[0] as keyof typeof profile.priorities] ? a : b)[0] === 'reliability' ? 'אמינות' :
                       Object.entries(profile.priorities).reduce((a, b) => profile.priorities[a[0] as keyof typeof profile.priorities] > profile.priorities[b[0] as keyof typeof profile.priorities] ? a : b)[0] === 'speed' ? 'מהירות' : 'אחר'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-200/30 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-primary font-heebo">אשף ההמלצות החכם</h1>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
          
          {/* Progress */}
          <div className="flex items-center gap-2 mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  index <= currentStep 
                    ? "bg-primary text-white shadow-lg" 
                    : "bg-gray-200 text-gray-500"
                )}>
                  {index < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-8 h-1 rounded transition-all duration-300",
                    index < currentStep ? "bg-primary" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>

          <div className="text-sm text-muted-foreground font-assistant">
            שלב {currentStep + 1} מתוך {steps.length} • {steps[currentStep].description}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-2 border-primary/10 shadow-xl">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            קודם
          </Button>

          <Button
            onClick={handleNext}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <CheckCircle className="w-4 h-4" />
                קבל המלצות
              </>
            ) : (
              <>
                הבא
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};