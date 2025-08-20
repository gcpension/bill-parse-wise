import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  UserCheck, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  AlertTriangle,
  CheckCircle2,
  Download,
  Send,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProviderSwitchFormProps {
  category: 'electricity' | 'cellular' | 'internet';
  currentProvider: string;
  newProvider: string;
  newPlan: string;
  monthlySavings: number;
}

const categoryNames = {
  electricity: 'חשמל',
  cellular: 'סלולר', 
  internet: 'אינטרנט'
};

export const ProviderSwitchForm = ({ 
  category, 
  currentProvider, 
  newProvider, 
  newPlan,
  monthlySavings 
}: ProviderSwitchFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    idNumber: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    
    // Current Service Details
    currentAccountNumber: '',
    currentContractEndDate: '',
    hasEarlyTerminationFee: false,
    earlyTerminationAmount: '',
    
    // New Service Preferences
    preferredInstallationDate: '',
    preferredTimeSlot: '',
    specialRequests: '',
    
    // Payment Details
    paymentMethod: '',
    bankName: '',
    branchNumber: '',
    accountNumber: '',
    creditCardLast4: '',
    
    // Agreements
    agreeToTerms: false,
    agreeToDisclaimer: false,
    agreeToMarketing: false
  });

  const { toast } = useToast();

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDownloadForm = async (category: string) => {
    try {
      // Create PDF content dynamically
      const pdfContent = generatePowerOfAttorneyPDF(category, currentProvider, newProvider);
      
      // Create blob and download
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `power-of-attorney-${category}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "טופס ייפוי הכוח נוצר!",
        description: `הטופס עבור מעבר ${categoryNames[category]} נשמר במחשב שלך`,
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן ליצור את הטופס כרגע. נסה שוב מאוחר יותר.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = ['fullName', 'idNumber', 'phone', 'email', 'address'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "שגיאה",
        description: "אנא מלא את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }

    if (!formData.agreeToTerms || !formData.agreeToDisclaimer) {
      toast({
        title: "שגיאה", 
        description: "אנא אשר את התנאים והדיסקליימר",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "הטופס נשלח בהצלחה!",
      description: "נציגינו יחזרו אליך בתוך 24 שעות לתיאום המעבר",
    });

    setIsOpen(false);
    setCurrentStep(1);
  };

  const steps = [
    { id: 1, title: 'פרטים אישיים', icon: UserCheck },
    { id: 2, title: 'שירות נוכחי', icon: FileText },
    { id: 3, title: 'שירות חדש', icon: Phone },
    { id: 4, title: 'תשלום', icon: CreditCard },
    { id: 5, title: 'אישור', icon: CheckCircle2 }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>שם מלא *</Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => updateFormData('fullName', e.target.value)}
                  placeholder="הזן שם מלא"
                />
              </div>
              <div className="space-y-2">
                <Label>תעודת זהות *</Label>
                <Input
                  value={formData.idNumber}
                  onChange={(e) => updateFormData('idNumber', e.target.value)}
                  placeholder="9 ספרות"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>טלפון *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="05X-XXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label>אימייל *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>כתובת מלאה *</Label>
              <Input
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                placeholder="רחוב, מספר בית, מספר דירה"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>עיר</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  placeholder="שם העיר"
                />
              </div>
              <div className="space-y-2">
                <Label>מיקוד</Label>
                <Input
                  value={formData.zipCode}
                  onChange={(e) => updateFormData('zipCode', e.target.value)}
                  placeholder="מיקוד"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                פרטים על השירות הנוכחי שלך עם {currentProvider}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>מספר לקוח נוכחי</Label>
              <Input
                value={formData.currentAccountNumber}
                onChange={(e) => updateFormData('currentAccountNumber', e.target.value)}
                placeholder="מספר לקוח/מנוי/חוזה"
              />
            </div>

            <div className="space-y-2">
              <Label>תאריך סיום החוזה הנוכחי</Label>
              <Input
                type="date"
                value={formData.currentContractEndDate}
                onChange={(e) => updateFormData('currentContractEndDate', e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox
                id="earlyTermination"
                checked={formData.hasEarlyTerminationFee}
                onCheckedChange={(checked) => updateFormData('hasEarlyTerminationFee', checked)}
              />
              <Label htmlFor="earlyTermination">
                יש דמי ביטול מוקדם
              </Label>
            </div>

            {formData.hasEarlyTerminationFee && (
              <div className="space-y-2">
                <Label>סכום דמי הביטול המוקדם (₪)</Label>
                <Input
                  type="number"
                  value={formData.earlyTerminationAmount}
                  onChange={(e) => updateFormData('earlyTerminationAmount', e.target.value)}
                  placeholder="0"
                />
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Alert className="border-success/20 bg-success/5">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription>
                השירות החדש שלך: {newPlan} מ{newProvider}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>תאריך התקנה מועדף</Label>
              <Input
                type="date"
                value={formData.preferredInstallationDate}
                onChange={(e) => updateFormData('preferredInstallationDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label>שעות מועדפות להתקנה</Label>
              <Select value={formData.preferredTimeSlot} onValueChange={(value) => updateFormData('preferredTimeSlot', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר זמן מועדף" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">בוקר (8:00-12:00)</SelectItem>
                  <SelectItem value="afternoon">אחר הצהריים (12:00-16:00)</SelectItem>
                  <SelectItem value="evening">ערב (16:00-20:00)</SelectItem>
                  <SelectItem value="flexible">גמיש</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>הערות מיוחדות</Label>
              <Textarea
                value={formData.specialRequests}
                onChange={(e) => updateFormData('specialRequests', e.target.value)}
                placeholder="בקשות מיוחדות, הנחיות נגישות, וכו'"
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>אמצעי תשלום</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => updateFormData('paymentMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר אמצעי תשלום" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">חיוב חשבון בנק</SelectItem>
                  <SelectItem value="credit">כרטיס אשראי</SelectItem>
                  <SelectItem value="check">המחאות</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.paymentMethod === 'bank' && (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>בנק</Label>
                  <Input
                    value={formData.bankName}
                    onChange={(e) => updateFormData('bankName', e.target.value)}
                    placeholder="שם הבנק"
                  />
                </div>
                <div className="space-y-2">
                  <Label>סניף</Label>
                  <Input
                    value={formData.branchNumber}
                    onChange={(e) => updateFormData('branchNumber', e.target.value)}
                    placeholder="מספר סניף"
                  />
                </div>
                <div className="space-y-2">
                  <Label>חשבון</Label>
                  <Input
                    value={formData.accountNumber}
                    onChange={(e) => updateFormData('accountNumber', e.target.value)}
                    placeholder="מספר חשבון"
                  />
                </div>
              </div>
            )}

            {formData.paymentMethod === 'credit' && (
              <div className="space-y-2">
                <Label>4 ספרות אחרונות של כרטיס האשראי</Label>
                <Input
                  value={formData.creditCardLast4}
                  onChange={(e) => updateFormData('creditCardLast4', e.target.value)}
                  placeholder="XXXX"
                  maxLength={4}
                />
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-2xl font-bold">סיכום הבקשה</h3>
              <p className="text-muted-foreground">
                אנא בדוק את הפרטים לפני השליחה
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">שם מלא</p>
                    <p className="font-medium">{formData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">טלפון</p>
                    <p className="font-medium">{formData.phone}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">מעבר מ</p>
                  <p className="font-medium">{currentProvider}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">אל</p>
                  <p className="font-medium">{newProvider} - {newPlan}</p>
                </div>

                <div className="bg-success/10 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">חיסכון צפוי</p>
                  <p className="text-2xl font-bold text-success">
                    ₪{monthlySavings.toFixed(2)} לחודש
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id="agreeTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => updateFormData('agreeToTerms', checked)}
                />
                <Label htmlFor="agreeTerms">
                  אני מסכים לתנאי השירות של {newProvider}
                </Label>
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id="agreeDisclaimer"
                  checked={formData.agreeToDisclaimer}
                  onCheckedChange={(checked) => updateFormData('agreeToDisclaimer', checked)}
                />
                <Label htmlFor="agreeDisclaimer">
                  קראתי והבנתי את הדיסקליימר המשפטי
                </Label>
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id="agreeMarketing"
                  checked={formData.agreeToMarketing}
                  onCheckedChange={(checked) => updateFormData('agreeToMarketing', checked)}
                />
                <Label htmlFor="agreeMarketing">
                  אני מסכים לקבל עדכונים שיווקיים (אופציונלי)
                </Label>
              </div>
            </div>

            <div className="bg-warning/10 border border-warning rounded-lg p-6">
              <h4 className="font-semibold text-warning-foreground mb-3 text-lg">
                <AlertTriangle className="inline ml-2 h-5 w-5" />
                דיסקליימר משפטי חשוב - אנא קרא בעיון
              </h4>
              <div className="text-sm text-warning-foreground space-y-3">
                <div className="bg-destructive/10 border border-destructive/20 rounded p-3">
                  <h5 className="font-semibold mb-2">הגבלת אחריות:</h5>
                  <p>• השירות מסופק "כמות שהוא" ואיננו נושאים באחריות כלשהי לתוצאות, נזקים או הפסדים</p>
                  <p>• אין אחריות להתאמה בין הצעת המחיר לבין המחיר הסופי שיוצע על ידי הספק</p>
                  <p>• אין אחריות לזמינות השירות, איכותו או המשכיותו</p>
                </div>
                
                <div className="bg-primary/10 border border-primary/20 rounded p-3">
                  <h5 className="font-semibold mb-2">אחריות הלקוח:</h5>
                  <p>• הלקוח אחראי באופן מלא לביטול החוזה הקודם ולתיאום המעבר</p>
                  <p>• הלקוח מתחייב לוודא את כל התנאים והמחירים עם הספק החדש</p>
                  <p>• הלקוח אחראי לכל העמלות, קנסות או תשלומים הנובעים מהמעבר</p>
                </div>
                
                <div className="bg-muted border border-border rounded p-3">
                  <h5 className="font-semibold mb-2">הצהרות כלליות:</h5>
                  <p>• המחירים והתנאים עשויים להשתנות ללא הודעה מוקדמת</p>
                  <p>• הנתונים מתעדכנים באופן תקופתי ועשויים שלא להיות מדויקים ברגע זה</p>
                  <p>• השירות מיועד למידע בלבד ואינו מהווה הצעה מחייבת</p>
                  <p>• החברה אינה נציגה או שותפה של הספקים המופיעים במערכת</p>
                </div>
                
                <div className="bg-success/10 border border-success/20 rounded p-3">
                  <h5 className="font-semibold mb-2">המלצות חשובות:</h5>
                  <p>• התייעץ עם יועץ משפטי/כלכלי לפני ביצוע המעבר</p>
                  <p>• קרא בעיון את כל החוזים לפני החתימה</p>
                  <p>• שמור תיעוד של כל השיחות והתכתובות עם הספקים</p>
                  <p>• וודא שקיבלת אישור בכתב על ביטול החוזה הקודם</p>
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-gradient-to-r from-success to-success-glow hover:shadow-glow">
          <UserCheck className="ml-2 h-4 w-4" />
          נתק אותי וחבר לחברה החדשה
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            מעבר ל{newProvider} - {categoryNames[category]}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center space-x-2 rtl:space-x-reverse p-2 rounded-lg transition-all
                  ${isActive ? 'bg-primary text-primary-foreground' : 
                    isCompleted ? 'bg-success text-success-foreground' : 
                    'bg-muted text-muted-foreground'}
                `}>
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium hidden md:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-border mx-2"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            הקודם
          </Button>

          <div className="space-x-2 rtl:space-x-reverse">
            {currentStep < 5 ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)}>
                הבא
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-success to-success-glow hover:shadow-glow"
              >
                <Send className="ml-2 h-4 w-4" />
                שלח בקשה
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};