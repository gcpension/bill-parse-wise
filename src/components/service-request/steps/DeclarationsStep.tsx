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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Simple Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold font-heebo text-foreground mb-2">
          הצהרות והסכמות
        </h2>
        <p className="text-muted-foreground font-assistant">
          יש לקרוא בעיון ולאשר את כל ההצהרות כדי להמשיך
        </p>
      </div>

      {/* Simple Progress */}
      {completedCount > 0 && (
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className={cn(
                "w-5 h-5",
                allDeclarationsComplete ? "text-green-600" : "text-muted-foreground"
              )} />
              <span className="font-medium font-heebo text-sm">
                {allDeclarationsComplete ? "כל ההצהרות אושרו" : `${completedCount} מתוך 4 אושרו`}
              </span>
            </div>
            <Badge variant={allDeclarationsComplete ? "default" : "secondary"}>
              {completedCount}/4
            </Badge>
          </div>
        </div>
      )}

      {/* Clean Declarations List */}
      <div className="space-y-4">
        {declarations.map((declaration) => {
          const isChecked = formData[declaration.key] as boolean;
          const isExpanded = expandedCard === declaration.key;
          const Icon = declaration.icon;
          
          return (
            <Card 
              key={declaration.key} 
              className={cn(
                "transition-all duration-300",
                isChecked 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/30"
              )}
            >
              <CardContent className="p-5">
                {/* Main Content */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Simple Icon */}
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    isChecked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold font-heebo text-foreground">
                        {declaration.title}
                      </h3>
                      {isChecked && (
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-assistant">
                      {declaration.description}
                    </p>
                  </div>
                </div>
                
                {/* Expandable Details */}
                <button
                  onClick={() => setExpandedCard(isExpanded ? null : declaration.key)}
                  className="w-full text-left text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 mb-3"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {isExpanded ? "הסתר פרטים" : "הצג פרטים"}
                </button>
                
                {isExpanded && (
                  <div className="bg-muted/50 rounded-lg p-4 mb-4 space-y-2">
                    {declaration.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm text-foreground/80 font-assistant">
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Checkbox */}
                <div 
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors",
                    isChecked 
                      ? "border-primary bg-primary/5" 
                      : "border-dashed border-border hover:border-primary/30 hover:bg-muted/30"
                  )}
                  onClick={() => handleCheckboxChange(declaration.key, !isChecked)}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(declaration.key, checked as boolean)
                    }
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium font-heebo text-foreground">
                    אני מסכים ומאשר את ההצהרה
                    <span className="text-destructive mr-1">*</span>
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom Summary */}
      {allDeclarationsComplete && (
        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="font-medium text-green-700 font-heebo">
              מעולה! כל ההצהרות אושרו בהצלחה
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
