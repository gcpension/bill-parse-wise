import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { 
  Shield, 
  FileText, 
  CreditCard, 
  Smartphone,
  Info,
  AlertTriangle,
  CheckCircle,
  Lock,
  Eye,
  Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeclarationsStepProps {
  formData: Partial<ServiceRequestFormData>;
  updateFormData: (data: Partial<ServiceRequestFormData>) => void;
}

export default function DeclarationsStep({ formData, updateFormData }: DeclarationsStepProps) {
  const handleCheckboxChange = (field: keyof ServiceRequestFormData, checked: boolean) => {
    updateFormData({ [field]: checked });
  };

  const allDeclarationsComplete = !!(formData.poa && formData.privacy_tos && 
                                    formData.fees_ack && formData.esign_ok);

  const declarations = [
    {
      key: 'poa' as keyof ServiceRequestFormData,
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      title: 'ייפוי כוח לביצוע פעולות',
      description: 'אני מסמיך את השירות לפעול בשמי מול הספקים לביצוע הבקשה',
      details: [
        'יצירת קשר עם הספק הנוכחי לביטול/ניתוק השירות',
        'יצירת קשר עם הספק החדש לפתיחת שירות (במעבר ספק)',
        'קבלת מידע על החשבון והסטטוס',
        'ביצוע פעולות אדמיניסטרטיביות הנדרשות'
      ],
      color: 'border-blue-200 bg-blue-50',
      iconBg: 'bg-blue-100'
    },
    {
      key: 'privacy_tos' as keyof ServiceRequestFormData,
      icon: <Shield className="w-5 h-5 text-green-600" />,
      title: 'תנאי שימוש ומדיניות פרטיות',
      description: 'אני מסכים לתנאי השימוש ולמדיניות הפרטיות של השירות',
      details: [
        'שמירה מאובטחת של הנתונים האישיים',
        'שיתוף נתונים רק עם הספקים הרלוונטיים',
        'שימוש במידע רק לצורך ביצוע הבקשה',
        'זכות למחיקת נתונים לאחר סיום התהליך'
      ],
      color: 'border-green-200 bg-green-50',
      iconBg: 'bg-green-100'
    },
    {
      key: 'fees_ack' as keyof ServiceRequestFormData,
      icon: <CreditCard className="w-5 h-5 text-orange-600" />,
      title: 'הכרה בחיובים אפשריים',
      description: 'אני מודע לאפשרות של קנסות, חיובי סיום והחזרת ציוד',
      details: [
        'קנסות סיום מוקדם של חוזה (אם ישנם)',
        'חיובי החזרת ציוד (דקודרים, מודמים וכו\')',
        'חיובי ביטול חוזה לפי תנאי הספק',
        'החשבון הסופי יכול לכלול חיובים נוספים'
      ],
      color: 'border-orange-200 bg-orange-50',
      iconBg: 'bg-orange-100'
    },
    {
      key: 'esign_ok' as keyof ServiceRequestFormData,
      icon: <Smartphone className="w-5 h-5 text-purple-600" />,
      title: 'חתימה דיגיטלית מרחוק',
      description: 'אני מסכים לחתימה דיגיטלית באמצעות SMS דרך COMSIGN',
      details: [
        'קבלת SMS עם קוד חתימה למספר הטלפון שהוזן',
        'החתימה תתבצע מרחוק ללא צורך בפגישה פיזית',
        'המסמכים ישמרו דיגיטלית במערכת מאובטחת',
        'תהליך חתימה מהיר ונוח מהבית'
      ],
      color: 'border-purple-200 bg-purple-50',
      iconBg: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Step Overview */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800 font-assistant">
          <strong>שלב 3:</strong> הצהרות והסכמות נדרשות. 
          יש לקרוא בעיון ולאשר את כל ההצהרות כדי להמשיך.
        </AlertDescription>
      </Alert>

      {/* Progress Indicator */}
      {allDeclarationsComplete && (
        <Alert className="border-green-200 bg-green-50 animate-scale-in">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 font-assistant">
            <strong>מעולה!</strong> כל ההצהרות אושרו. אתם יכולים להמשיך לשלב הבא.
          </AlertDescription>
        </Alert>
      )}

      {/* Declarations */}
      {declarations.map((declaration, index) => {
        const isChecked = formData[declaration.key] as boolean;
        
        return (
          <Card 
            key={declaration.key} 
            className={cn(
              "animate-fade-in border-l-4 transition-all duration-300",
              declaration.color,
              isChecked ? "shadow-lg" : "opacity-90"
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={cn("p-3 rounded-lg", declaration.iconBg)}>
                    {declaration.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg font-heebo">
                        {declaration.title}
                      </CardTitle>
                      {isChecked && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="w-3 h-3 ml-1" />
                          אושר
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-assistant">
                      {declaration.description}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Details List */}
              <div className="bg-white/60 rounded-lg p-4 space-y-2">
                <h4 className="font-assistant font-semibold text-sm mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  פירוט ההסכמה:
                </h4>
                <ul className="space-y-2">
                  {declaration.details.map((detail, idx) => (
                    <li key={idx} className="text-sm font-assistant flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Checkbox */}
              <div className="flex items-center space-x-3 space-x-reverse p-4 bg-white rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
                <Checkbox
                  id={declaration.key}
                  checked={isChecked}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(declaration.key, checked as boolean)
                  }
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label 
                  htmlFor={declaration.key} 
                  className={cn(
                    "font-assistant font-semibold cursor-pointer flex-1",
                    isChecked ? "text-primary" : "text-gray-700"
                  )}
                >
                  אני מסכים ומאשר את ההצהרה לעיל
                  <span className="text-red-500 mr-1">*</span>
                </Label>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Additional Information */}
      <Card className="border-gray-200 bg-gray-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Lock className="w-5 h-5 text-gray-600" />
            </div>
            <CardTitle className="text-lg font-heebo text-gray-700">מידע אבטחה וחוקיות</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <h4 className="font-assistant font-semibold">שקיפות ופרטיות</h4>
              </div>
              <ul className="text-sm font-assistant text-muted-foreground space-y-1">
                <li>• כל הנתונים מוצפנים ומאובטחים</li>
                <li>• גישה למידע רק לגורמים מורשים</li>
                <li>• מחיקת נתונים לאחר סיום התהליך</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-600" />
                <h4 className="font-assistant font-semibold">תמיכה ושירות</h4>
              </div>
              <ul className="text-sm font-assistant text-muted-foreground space-y-1">
                <li>• תמיכה טלפונית לאורך התהליך</li>
                <li>• עדכונים בזמן אמת באמצעות SMS</li>
                <li>• זמינות לשאלות ובעיות</li>
              </ul>
            </div>
          </div>
          
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 font-assistant text-sm">
              התהליך כולו מתבצע בהתאם לחוק הגנת הפרטיות ותקנות משרד התקשורת. 
              לכל שאלה, ניתן לפנות לשירות הלקוחות שלנו.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}