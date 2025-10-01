import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { UserProfile } from '@/lib/personalizedRecommendations';
import { cn } from '@/lib/utils';

interface RecommendationWizardProps {
  onComplete: (profile: UserProfile, categories: Array<'electricity' | 'internet' | 'mobile' | 'tv'>) => void;
  categories: Array<'electricity' | 'internet' | 'mobile' | 'tv'>;
  onClose: () => void;
}

export const RecommendationWizard = ({
  onComplete,
  categories,
  onClose
}: RecommendationWizardProps) => {
  const [step, setStep] = useState(0);
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

  const steps = [
    { id: 'basic', title: 'פרטים בסיסיים' },
    { id: 'budget', title: 'תקציב ותשלום נוכחי' },
    { id: 'usage', title: 'דפוסי שימוש' },
    { id: 'priorities', title: 'סדרי עדיפויות' }
  ];

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updatePriority = (key: keyof UserProfile['priorities'], value: number) => {
    setProfile(prev => ({
      ...prev,
      priorities: { ...prev.priorities, [key]: value }
    }));
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(profile, categories);
    }
  };

  const handlePrevious = () => {
    if (step > 0) setStep(step - 1);
  };

  const renderStep = () => {
    switch (steps[step].id) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div>
              <Label className="font-heebo mb-3 block">גודל משק הבית</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[profile.familySize]}
                  onValueChange={([value]) => updateProfile({ familySize: value })}
                  max={10}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span className="text-2xl font-bold w-12 text-center">
                  {profile.familySize}
                </span>
              </div>
            </div>

            <div>
              <Label className="font-heebo mb-3 block">סוג דיור</Label>
              <RadioGroup value={profile.homeType} onValueChange={(value: any) => updateProfile({ homeType: value })}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'apartment', label: 'דירה' },
                    { value: 'house', label: 'בית' },
                    { value: 'student', label: 'דירת סטודנט' },
                    { value: 'business', label: 'עסק' }
                  ].map(option => (
                    <Label
                      key={option.value}
                      className={cn(
                        "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors",
                        profile.homeType === option.value && "border-foreground bg-muted"
                      )}
                    >
                      <RadioGroupItem value={option.value} />
                      <span className="font-assistant">{option.label}</span>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 'budget':
        return (
          <div className="space-y-6">
            <div>
              <Label className="font-heebo mb-3 block">תקציב חודשי מקסימלי (₪)</Label>
              <Input
                type="number"
                value={profile.monthlyBudget}
                onChange={(e) => updateProfile({ monthlyBudget: Number(e.target.value) })}
                className="text-lg font-bold text-center"
              />
            </div>

            <div>
              <Label className="font-heebo mb-3 block">תשלום חודשי נוכחי (₪)</Label>
              <Input
                type="number"
                value={profile.currentMonthlySpend}
                onChange={(e) => updateProfile({ currentMonthlySpend: Number(e.target.value) })}
                className="text-lg font-bold text-center"
              />
            </div>

            <div>
              <Label className="font-heebo mb-3 block">ספק נוכחי</Label>
              <Input
                value={profile.currentProvider}
                onChange={(e) => updateProfile({ currentProvider: e.target.value })}
                placeholder="לדוגמה: בזק, חברת החשמל..."
              />
            </div>

            <div>
              <Label className="font-heebo mb-3 block">גמישות במחיר</Label>
              <Select value={profile.priceFlexibility} onValueChange={(value: any) => updateProfile({ priceFlexibility: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strict">קפדני - עד התקציב בדיוק</SelectItem>
                  <SelectItem value="flexible">גמיש - עד 10% יותר</SelectItem>
                  <SelectItem value="very_flexible">גמיש מאוד - עד 20% יותר</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'usage':
        return (
          <div className="space-y-6">
            <div>
              <Label className="font-heebo mb-3 block">רמת שימוש</Label>
              <RadioGroup value={profile.usageLevel} onValueChange={(value: any) => updateProfile({ usageLevel: value })}>
                <div className="space-y-3">
                  {[
                    { value: 'light', label: 'קל', desc: 'שימוש בסיסי' },
                    { value: 'medium', label: 'בינוני', desc: 'שימוש יומיומי' },
                    { value: 'heavy', label: 'כבד', desc: 'שימוש אינטנסיבי' },
                    { value: 'extreme', label: 'אקסטרים', desc: 'שימוש מקסימלי' }
                  ].map(option => (
                    <Label
                      key={option.value}
                      className={cn(
                        "flex items-center gap-3 p-4 border rounded-lg cursor-pointer",
                        profile.usageLevel === option.value && "border-foreground bg-muted"
                      )}
                    >
                      <RadioGroupItem value={option.value} />
                      <div>
                        <div className="font-heebo font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground font-assistant">{option.desc}</div>
                      </div>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 'priorities':
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground font-assistant">
              דרגו את החשיבות של כל קריטריון (1 = לא חשוב, 5 = חשוב מאוד)
            </p>
            
            {[
              { key: 'price', label: 'מחיר נמוך' },
              { key: 'reliability', label: 'אמינות' },
              { key: 'speed', label: 'מהירות' },
              { key: 'customerService', label: 'שירות לקוחות' }
            ].map(({ key, label }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-heebo">{label}</Label>
                  <span className="text-sm font-bold">{profile.priorities[key as keyof typeof profile.priorities]}/5</span>
                </div>
                <Slider
                  value={[profile.priorities[key as keyof typeof profile.priorities]]}
                  onValueChange={([value]) => updatePriority(key as keyof typeof profile.priorities, value)}
                  max={5}
                  min={1}
                  step={1}
                />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-heebo">אשף המלצות מותאמות אישית</CardTitle>
        <Progress value={(step + 1) / steps.length * 100} className="mt-4" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground font-assistant">
          <span>שלב {step + 1} מתוך {steps.length}</span>
          <span>{steps[step].title}</span>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        {renderStep()}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={step === 0 ? onClose : handlePrevious}
            className="font-heebo"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            {step === 0 ? 'ביטול' : 'הקודם'}
          </Button>

          <Button onClick={handleNext} className="font-heebo">
            {step === steps.length - 1 ? (
              <>
                <Check className="w-4 h-4 ml-2" />
                סיום וקבלת המלצות
              </>
            ) : (
              <>
                הבא
                <ArrowLeft className="w-4 h-4 mr-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
