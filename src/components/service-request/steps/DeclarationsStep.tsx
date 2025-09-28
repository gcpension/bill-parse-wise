import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { AlertTriangle, FileText, Shield, CreditCard, Signature } from 'lucide-react';

interface DeclarationsStepProps {
  formData: Partial<ServiceRequestFormData>;
  updateFormData: (data: Partial<ServiceRequestFormData>) => void;
}

export default function DeclarationsStep({ formData, updateFormData }: DeclarationsStepProps) {
  const handleCheckboxChange = (field: keyof ServiceRequestFormData, checked: boolean) => {
    updateFormData({ [field]: checked });
  };

  const declarations = [
    {
      field: 'poa' as keyof ServiceRequestFormData,
      icon: FileText,
      title: 'ייפוי כוח',
      description: 'אני מאשר ומקנה ייפוי כוח לביצוע ניתוק/מעבר ספק בשמי ומטעמי',
      longDescription: 'הרינני מאשר ומקנה בזאת ייפוי כוח מלא ובלתי חוזר לחברה לבצע בשמי ומטעמי את כל הפעולות הנדרשות לביצוע הבקשה, לרבות פנייה לספקים, חתימה על מסמכים, וביצוע הליכי המעבר או הניתוק.',
      required: true
    },
    {
      field: 'privacy_tos' as keyof ServiceRequestFormData,
      icon: Shield,
      title: 'תנאי שימוש ופרטיות',
      description: 'אני מסכים לתנאי השימוש, מדיניות הפרטיות ולשיתוף נתונים עם ספקים לצורך ביצוע הבקשה',
      longDescription: 'הרינני מאשר שקראתי והסכמתי לתנאי השימוש ולמדיניות הפרטיות של החברה. אני מסכים לשיתוף הנתונים האישיים שלי עם ספקי השירות הרלוונטיים לצורך ביצוע הבקשה.',
      required: true
    },
    {
      field: 'fees_ack' as keyof ServiceRequestFormData,
      icon: CreditCard,
      title: 'הכרה בקנסות וחיובים',
      description: 'אני מודע לאפשרות של קנסות ביטול, דמי סיום מוקדם והחזרת ציוד',
      longDescription: 'הרינני מודע לכך שבביצוע הבקשה עלולים להיגרם חיובים נוספים כגון: קנסות ביטול, דמי סיום מוקדם של חוזה, דמי החזרת ציוד, או חיובים אחרים על פי תנאי החוזה הקיים.',
      required: true
    },
    {
      field: 'esign_ok' as keyof ServiceRequestFormData,
      icon: Signature,
      title: 'הסכמה לחתימה מרחוק',
      description: 'אני מסכים לחתימה מרחוק באמצעות SMS (COMSIGN) ולשמירת מסמכים דיגיטליים',
      longDescription: 'הרינני מסכים לביצוע חתימה דיגיטלית מרחוק באמצעות הודעת SMS שתישלח אליי, ולשמירת המסמכים החתומים במערכת דיגיטלית. החתימה הדיגיטלית תהיה בעלת תוקף משפטי מלא.',
      required: true
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            הצהרות ואישורים נדרשים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {declarations.map((declaration) => {
              const Icon = declaration.icon;
              const isChecked = formData[declaration.field] as boolean || false;
              
              return (
                <div key={declaration.field} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Checkbox
                        id={declaration.field}
                        checked={isChecked}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange(declaration.field, checked as boolean)
                        }
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-blue-600" />
                        <Label 
                          htmlFor={declaration.field} 
                          className="font-heebo font-semibold cursor-pointer"
                        >
                          {declaration.title}
                          {declaration.required && <span className="text-red-500 mr-1">*</span>}
                        </Label>
                      </div>
                      
                      <p className="text-sm font-assistant text-muted-foreground leading-relaxed">
                        {declaration.description}
                      </p>
                      
                      <details className="text-xs text-muted-foreground">
                        <summary className="cursor-pointer hover:text-foreground font-assistant">
                          לחץ לקריאת הנוסח המלא
                        </summary>
                        <p className="mt-2 p-3 bg-muted/50 rounded border-r-4 border-blue-200 font-assistant leading-relaxed">
                          {declaration.longDescription}
                        </p>
                      </details>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Signature className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-heebo font-semibold text-blue-900">
                  לגבי החתימה הדיגיטלית
                </h4>
                <p className="text-sm font-assistant text-blue-800 leading-relaxed">
                  לאחר שליחת הטופס, תקבל הודעת SMS עם קישור לחתימה דיגיטלית. 
                  החתימה תתבצע באמצעות מערכת COMSIGN המאובטחת ותהיה בעלת תוקף משפטי מלא.
                  <br />
                  <strong>שים לב:</strong> ללא החתימה הדיגיטלית, הבקשה לא תעובד.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}