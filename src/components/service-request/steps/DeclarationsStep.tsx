import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { 
  Shield, 
  FileText, 
  CreditCard, 
  Smartphone,
  CheckCircle,
  Sparkles,
  Lock,
  Zap,
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
  const [celebrateComplete, setCelebrateComplete] = useState(false);

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

  const progressPercentage = (completedCount / 4) * 100;

  useEffect(() => {
    if (allDeclarationsComplete) {
      setCelebrateComplete(true);
      const timer = setTimeout(() => setCelebrateComplete(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [allDeclarationsComplete]);

  const declarations = [
    {
      key: 'poa' as keyof ServiceRequestFormData,
      icon: FileText,
      title: 'ייפוי כוח לביצוע פעולות',
      description: 'אני מסמיך את השירות לפעול בשמי מול הספקים לביצוע הבקשה',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600',
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
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-700',
      iconColor: 'text-green-600',
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
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-700',
      iconColor: 'text-orange-600',
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
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-700',
      iconColor: 'text-purple-600',
      details: [
        'קבלת SMS עם קוד חתימה למספר הטלפון שהוזן',
        'החתימה תתבצע מרחוק ללא צורך בפגישה פיזית',
        'המסמכים ישמרו דיגיטלית במערכת מאובטחת',
        'תהליך חתימה מהיר ונוח מהבית'
      ]
    }
  ];

  return (
    <div className="space-y-6 relative">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header Section */}
      <div className="text-center mb-8 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold font-heebo bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            הצהרות והסכמות
          </h2>
        </div>
        <p className="text-muted-foreground font-assistant text-lg">
          יש לקרוא בעיון ולאשר את כל ההצהרות כדי להמשיך
        </p>
      </div>

      {/* Progress Section */}
      <div className="relative z-10">
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                  allDeclarationsComplete 
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 scale-110" 
                    : "bg-gradient-to-r from-primary to-accent"
                )}>
                  {allDeclarationsComplete ? (
                    <CheckCircle className="w-6 h-6 text-white animate-scale-in" />
                  ) : (
                    <Zap className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-bold font-heebo text-foreground">
                    {allDeclarationsComplete ? "כל ההצהרות אושרו! 🎉" : "התקדמות אישור ההצהרות"}
                  </p>
                  <p className="text-sm text-muted-foreground font-assistant">
                    {completedCount} מתוך 4 הצהרות אושרו
                  </p>
                </div>
              </div>
              <Badge 
                className={cn(
                  "text-lg px-4 py-2 font-bold transition-all duration-500",
                  allDeclarationsComplete 
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
                    : "bg-gradient-to-r from-primary to-accent text-white"
                )}
              >
                {Math.round(progressPercentage)}%
              </Badge>
            </div>
            
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-muted"
            />
            
            {allDeclarationsComplete && celebrateComplete && (
              <div className="mt-4 text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 animate-fade-in">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-green-600 animate-pulse" />
                  <p className="text-green-800 font-bold font-heebo text-lg">מעולה! כל ההצהרות אושרו בהצלחה</p>
                  <Sparkles className="w-5 h-5 text-green-600 animate-pulse" />
                </div>
                <p className="text-sm text-green-700 font-assistant">
                  אתה יכול להמשיך לשלב הבא
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Declarations Grid */}
      <div className="grid gap-5 relative z-10">
        {declarations.map((declaration, index) => {
          const isChecked = formData[declaration.key] as boolean;
          const isExpanded = expandedCard === declaration.key;
          const Icon = declaration.icon;
          
          return (
            <Card 
              key={declaration.key} 
              className={cn(
                "border-2 transition-all duration-500 cursor-pointer relative overflow-hidden group",
                isChecked 
                  ? `${declaration.borderColor} ${declaration.bgColor} shadow-xl scale-[1.02]` 
                  : "border-border hover:border-primary/50 hover:shadow-lg hover:scale-[1.01]"
              )}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Animated Background Gradient on Hover */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                declaration.color
              )} />
              
              {/* Checkmark Badge */}
              {isChecked && (
                <div className={cn(
                  "absolute top-4 left-4 z-10 animate-scale-in"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r shadow-lg",
                    declaration.color
                  )}>
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
              
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start gap-4">
                  {/* Icon Section */}
                  <div className={cn(
                    "p-4 rounded-xl flex-shrink-0 transition-all duration-500 relative",
                    isChecked 
                      ? `bg-gradient-to-br ${declaration.color} shadow-lg scale-110` 
                      : "bg-muted group-hover:scale-105"
                  )}>
                    <Icon className={cn(
                      "w-7 h-7 transition-colors duration-300",
                      isChecked ? "text-white" : declaration.iconColor
                    )} />
                    
                    {/* Pulse Animation Ring */}
                    {isChecked && (
                      <div className={cn(
                        "absolute inset-0 rounded-xl bg-gradient-to-br animate-ping opacity-75",
                        declaration.color
                      )} style={{ animationDuration: '2s' }} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    {/* Title and Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={cn(
                            "text-xl font-bold font-heebo transition-colors duration-300",
                            isChecked ? declaration.textColor : "text-foreground"
                          )}>
                            {declaration.title}
                          </h3>
                          <Badge 
                            variant="outline" 
                            className="text-xs font-assistant"
                          >
                            חובה
                          </Badge>
                        </div>
                        <p className="text-muted-foreground font-assistant leading-relaxed">
                          {declaration.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Details Section - Expandable */}
                    <div 
                      className={cn(
                        "bg-background/80 backdrop-blur-sm rounded-xl border-2 transition-all duration-500 overflow-hidden",
                        isExpanded ? "border-primary/30 shadow-inner" : "border-border/50"
                      )}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCard(isExpanded ? null : declaration.key);
                        }}
                        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                      >
                        <p className="text-sm font-medium text-foreground font-assistant">
                          {isExpanded ? "הסתר פרטים" : "הצג פרטים מלאים"}
                        </p>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                      
                      <div className={cn(
                        "transition-all duration-500 overflow-hidden",
                        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      )}>
                        <div className="px-4 pb-4 space-y-2">
                          <p className="text-sm font-medium text-muted-foreground mb-3 font-assistant">
                            כולל:
                          </p>
                          {declaration.details.map((detail, idx) => (
                            <div 
                              key={idx} 
                              className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                                isChecked ? `bg-gradient-to-br ${declaration.color}` : "bg-muted"
                              )}>
                                <CheckCircle className={cn(
                                  "w-4 h-4",
                                  isChecked ? "text-white" : "text-muted-foreground"
                                )} />
                              </div>
                              <span className="text-sm text-foreground/80 font-assistant leading-relaxed">
                                {detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Checkbox Section */}
                    <div 
                      className={cn(
                        "mt-4 flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-500",
                        isChecked 
                          ? `${declaration.borderColor} bg-gradient-to-r ${declaration.color} bg-opacity-10 shadow-md` 
                          : "border-dashed border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckboxChange(declaration.key, !isChecked);
                      }}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange(declaration.key, checked as boolean)
                        }
                        className={cn(
                          "w-6 h-6 transition-all duration-300",
                          isChecked && `data-[state=checked]:bg-gradient-to-br data-[state=checked]:${declaration.color}`
                        )}
                      />
                      <div className="flex-1">
                        <span className={cn(
                          "font-bold font-heebo block transition-colors duration-300",
                          isChecked ? declaration.textColor : "text-foreground"
                        )}>
                          אני מסכים ומאשר את ההצהרה
                          <span className="text-destructive mr-1">*</span>
                        </span>
                        <span className="text-xs text-muted-foreground font-assistant">
                          {isChecked ? "✓ אושר בהצלחה" : "לחץ לאישור"}
                        </span>
                      </div>
                      
                      {isChecked && (
                        <Sparkles className={cn(
                          "w-5 h-5 animate-pulse",
                          declaration.iconColor
                        )} />
                      )}
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