import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { 
  Shield, 
  FileText, 
  CreditCard, 
  Smartphone,
  CheckCircle
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
      ]
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
      ]
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
      ]
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
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">הצהרות והסכמות</h2>
        <p className="text-gray-600">יש לקרוא בעיון ולאשר את כל ההצהרות כדי להמשיך</p>
      </div>

      {allDeclarationsComplete && (
        <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-green-800 font-semibold">כל ההצהרות אושרו בהצלחה!</p>
        </div>
      )}

      {/* Declarations Grid */}
      <div className="grid gap-4">
        {declarations.map((declaration, index) => {
          const isChecked = formData[declaration.key] as boolean;
          
          return (
            <Card 
              key={declaration.key} 
              className={cn(
                "border-2 transition-all duration-300 cursor-pointer hover:shadow-md",
                isChecked 
                  ? "border-green-300 bg-green-50/50 shadow-sm" 
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => handleCheckboxChange(declaration.key, !isChecked)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-xl flex-shrink-0",
                    isChecked ? "bg-green-100" : "bg-gray-100"
                  )}>
                    {React.cloneElement(declaration.icon, {
                      className: cn(
                        "w-6 h-6",
                        isChecked ? "text-green-600" : "text-gray-600"
                      )
                    })}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {declaration.title}
                      </h3>
                      {isChecked && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {declaration.description}
                    </p>
                    
                    <div className="bg-white/80 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">כולל:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {declaration.details.slice(0, 2).map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {detail}
                          </li>
                        ))}
                        {declaration.details.length > 2 && (
                          <li className="text-gray-500 text-xs">+ {declaration.details.length - 2} נוספים...</li>
                        )}
                      </ul>
                    </div>
                    
                    <div className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border-2 border-dashed transition-colors",
                      isChecked 
                        ? "border-green-300 bg-green-50" 
                        : "border-gray-300 hover:border-gray-400"
                    )}>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange(declaration.key, checked as boolean)
                        }
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                      <span className={cn(
                        "font-medium text-sm",
                        isChecked ? "text-green-800" : "text-gray-700"
                      )}>
                        אני מסכים ומאשר את ההצהרה
                        <span className="text-red-500 mr-1">*</span>
                      </span>
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
}