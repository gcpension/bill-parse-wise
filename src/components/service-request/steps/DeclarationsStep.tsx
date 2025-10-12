import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { 
  Shield, 
  FileText, 
  CreditCard, 
  Smartphone,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeclarationsStepProps {
  formData: Partial<ServiceRequestFormData>;
  updateFormData: (data: Partial<ServiceRequestFormData>) => void;
}

export default function DeclarationsStep({ formData, updateFormData }: DeclarationsStepProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleCheckboxChange = (field: keyof ServiceRequestFormData, checked: boolean) => {
    updateFormData({ [field]: checked });
  };

  const allDeclarationsComplete = !!(formData.poa && formData.privacy_tos && 
                                    formData.fees_ack && formData.esign_ok);
  
  const completedCount = [
    formData.poa,
    formData.privacy_tos,
    formData.fees_ack,
    formData.esign_ok
  ].filter(Boolean).length;

  const declarations = [
    {
      key: 'poa' as keyof ServiceRequestFormData,
      icon: FileText,
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
      icon: Shield,
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
      icon: CreditCard,
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
      icon: Smartphone,
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
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold font-heebo text-foreground mb-3">
          הצהרות והסכמות
        </h2>
        <p className="text-base text-muted-foreground font-assistant">
          אנא קרא בעיון כל הצהרה וסמן את תיבת האישור
        </p>
      </div>

      {/* Progress */}
      {completedCount > 0 && (
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5 border-2 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className={cn(
                "w-6 h-6",
                allDeclarationsComplete ? "text-green-600" : "text-muted-foreground"
              )} />
              <span className="font-bold font-heebo text-base">
                {allDeclarationsComplete ? "כל ההצהרות אושרו בהצלחה!" : `${completedCount} מתוך 4 הצהרות אושרו`}
              </span>
            </div>
            <Badge variant={allDeclarationsComplete ? "default" : "secondary"} className="text-base px-4 py-1">
              {completedCount}/4
            </Badge>
          </div>
        </div>
      )}

      {/* Declarations List */}
      <div className="space-y-6">
        {declarations.map((declaration, index) => {
          const isChecked = formData[declaration.key] as boolean;
          const isExpanded = expandedCard === declaration.key;
          const Icon = declaration.icon;
          
          return (
            <Card 
              key={declaration.key} 
              className={cn(
                "transition-all duration-300 hover:shadow-lg",
                isChecked 
                  ? "border-2 border-green-500 bg-green-50/50 shadow-md" 
                  : "border-2 border-border hover:border-primary/40"
              )}
            >
              <CardContent className="p-6">
                {/* Number Badge */}
                <div className="flex items-start gap-4 mb-5">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg",
                    isChecked 
                      ? "bg-green-600 text-white" 
                      : "bg-primary/10 text-primary border-2 border-primary/30"
                  )}>
                    {isChecked ? <CheckCircle className="w-6 h-6" /> : index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-heebo text-foreground mb-2 flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary" />
                      {declaration.title}
                    </h3>
                    <p className="text-base text-foreground/80 font-assistant leading-relaxed">
                      {declaration.description}
                    </p>
                  </div>
                </div>
                
                {/* Details Section - Always Visible */}
                <div className="bg-muted/30 rounded-xl p-5 mb-5 border border-border">
                  <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full"></span>
                    פירוט:
                  </h4>
                  <ul className="space-y-3">
                    {declaration.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-base text-foreground font-assistant leading-relaxed">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Checkbox - Prominent */}
                <div 
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-xl border-3 cursor-pointer transition-all hover:scale-[1.02]",
                    isChecked 
                      ? "border-green-500 bg-green-50" 
                      : "border-dashed border-2 border-primary hover:border-primary hover:bg-primary/5"
                  )}
                  onClick={() => handleCheckboxChange(declaration.key, !isChecked)}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(declaration.key, checked as boolean)
                    }
                    className="w-6 h-6"
                  />
                  <span className="text-lg font-bold font-heebo text-foreground flex items-center gap-2">
                    {isChecked ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        הצהרה זו אושרה
                      </>
                    ) : (
                      <>
                        אני מאשר/ת את ההצהרה הזו
                        <span className="text-destructive text-xl">*</span>
                      </>
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom Summary */}
      {allDeclarationsComplete && (
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CheckCircle className="w-7 h-7 text-green-600" />
            <p className="font-bold text-xl text-green-700 font-heebo">
              מעולה! כל ההצהרות אושרו בהצלחה
            </p>
          </div>
          <p className="text-base text-green-600 font-assistant">
            ניתן להמשיך לשלב הבא
          </p>
        </div>
      )}
    </div>
  );
}
