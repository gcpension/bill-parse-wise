import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, MapPin, DollarSign, Target } from 'lucide-react';
import { toast } from 'sonner';

interface QuickRecommendationFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: QuickFlowData) => void;
}

export interface QuickFlowData {
  currentBill: number;
  location: string;
  priority: 'price' | 'speed' | 'service' | 'brand';
  detectedCategory?: string;
}

const priorityOptions = [
  { value: 'price', label: 'מחיר נמוך', icon: '💰', description: 'החיסכון הכי גדול' },
  { value: 'speed', label: 'מהירות גבוהה', icon: '⚡', description: 'ביצועים מקסימליים' },
  { value: 'service', label: 'שירות מעולה', icon: '⭐', description: 'תמיכה ושירות' },
  { value: 'brand', label: 'מותג מוביל', icon: '🏆', description: 'אמינות ומוניטין' }
];

export const QuickRecommendationFlow = ({ isOpen, onClose, onComplete }: QuickRecommendationFlowProps) => {
  const [step, setStep] = useState(1);
  const [currentBill, setCurrentBill] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<'price' | 'speed' | 'service' | 'brand'>('price');
  const [isProcessing, setIsProcessing] = useState(false);

  const detectCategory = (amount: number): string => {
    if (amount < 100) return 'cellular';
    if (amount < 200) return 'internet';
    if (amount < 400) return 'tv';
    return 'electricity';
  };

  const handleComplete = async () => {
    const bill = parseFloat(currentBill);
    if (!bill || !location) {
      toast.error('נא למלא את כל השדות');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const detectedCategory = detectCategory(bill);
    
    // Save to localStorage for later use
    localStorage.setItem('quickFlowData', JSON.stringify({
      currentBill: bill,
      location,
      priority,
      detectedCategory,
      timestamp: new Date().toISOString()
    }));

    setIsProcessing(false);
    onComplete({ currentBill: bill, location, priority, detectedCategory });
    handleReset();
  };

  const handleReset = () => {
    setStep(1);
    setCurrentBill('');
    setLocation('');
    setPriority('price');
    setIsProcessing(false);
  };

  const categoryLabels: Record<string, string> = {
    cellular: 'סלולר',
    internet: 'אינטרנט',
    tv: 'טלוויזיה',
    electricity: 'חשמל'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heebo flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            מציאת התכנית המושלמת - דרך מהירה
          </DialogTitle>
          <p className="text-sm text-muted-foreground font-assistant">
            רק 3 שאלות ל-30 שניות
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress indicator */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Current Bill */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-heebo font-bold">כמה אתם משלמים היום?</h3>
              </div>
              <Label htmlFor="currentBill" className="text-base font-assistant">
                סכום החשבון החודשי (₪)
              </Label>
              <Input
                id="currentBill"
                type="number"
                placeholder="לדוגמה: 150"
                value={currentBill}
                onChange={(e) => setCurrentBill(e.target.value)}
                className="text-lg h-14"
                autoFocus
              />
              {currentBill && parseFloat(currentBill) > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in">
                  <Sparkles className="w-4 h-4" />
                  <span>זיהינו אוטומטית: {categoryLabels[detectCategory(parseFloat(currentBill))]}</span>
                </div>
              )}
              <Button
                onClick={() => setStep(2)}
                disabled={!currentBill || parseFloat(currentBill) <= 0}
                className="w-full h-12 text-lg font-heebo"
              >
                המשך
              </Button>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-heebo font-bold">איפה אתם גרים?</h3>
              </div>
              <Label htmlFor="location" className="text-base font-assistant">
                עיר מגורים (לבדיקת כיסוי)
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="לדוגמה: תל אביב"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="text-lg h-14"
                autoFocus
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12"
                >
                  חזור
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!location}
                  className="flex-1 h-12 text-lg font-heebo"
                >
                  המשך
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Priority */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-heebo font-bold">מה הכי חשוב לכם?</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {priorityOptions.map((option) => (
                  <Card
                    key={option.value}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      priority === option.value
                        ? 'border-2 border-primary bg-primary/5'
                        : 'border hover:border-primary/50'
                    }`}
                    onClick={() => setPriority(option.value as any)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">{option.icon}</div>
                      <div className="font-heebo font-bold">{option.label}</div>
                      <div className="text-xs text-muted-foreground font-assistant mt-1">
                        {option.description}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 h-12"
                >
                  חזור
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={isProcessing}
                  className="flex-1 h-12 text-lg font-heebo"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      מחשב המלצות...
                    </>
                  ) : (
                    'קבל המלצות'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Time estimate */}
          <div className="text-center pt-2">
            <Badge variant="outline" className="font-assistant">
              ⏱️ זמן משוער: {step === 1 ? '30' : step === 2 ? '20' : '10'} שניות
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
