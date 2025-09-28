import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Zap, 
  Smartphone, 
  Wifi, 
  Tv, 
  Building2, 
  User, 
  ArrowRightLeft,
  UserX,
  Home,
  Calendar,
  CheckCircle,
  Info,
  Users
} from 'lucide-react';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { FileUpload } from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';

interface GeneralChoicesStepProps {
  formData: Partial<ServiceRequestFormData>;
  updateFormData: (data: Partial<ServiceRequestFormData>) => void;
}

export default function GeneralChoicesStep({ formData, updateFormData }: GeneralChoicesStepProps) {
  
  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="ml-2 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-help">
            <Info className="w-4 h-4 text-slate-500" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
  
  const actionTypes = [
    { 
      value: 'disconnect', 
      label: 'ניתוק שירות', 
      description: 'סיום מוחלט של השירות',
      icon: UserX,
      info: 'סיום מלא של השירות עם הספק הנוכחי. השירות יופסק לחלוטין ולא יועבר לספק אחר.'
    },
    { 
      value: 'switch', 
      label: 'מעבר ספק', 
      description: 'מעבר לספק אחר',
      icon: ArrowRightLeft,
      info: 'העברת השירות מהספק הנוכחי לספק חדש תוך שמירה על רציפות השירות.'
    },
    { 
      value: 'move', 
      label: 'העברת דירה', 
      description: 'העברת שירות לכתובת חדשה',
      icon: Home,
      info: 'העברת השירות הקיים מהכתובת הנוכחית לכתובת חדשה אצל אותו הספק.'
    },
    { 
      value: 'early_terminate', 
      label: 'סיום מוקדם', 
      description: 'סיום חוזה לפני תום התקופה',
      icon: Calendar,
      info: 'סיום חוזה לפני תאריך הסיום המקורי. עלולים לחול דמי ביטול בהתאם לתנאי החוזה.'
    }
  ];

  const sectors = [
    { 
      value: 'cellular', 
      label: 'סלולר',
      icon: Smartphone,
      info: 'שירותי טלפון נייד וחבילות סלולריות - קווים, אינטרנט נייד, SMS ושיחות.'
    },
    { 
      value: 'internet_isp', 
      label: 'אינטרנט ISP',
      icon: Wifi,
      info: 'שירותי אינטרנט ביתי מספק שירות (ISP) כמו בזק, פרטנר או HOT.'
    },
    { 
      value: 'internet_infra', 
      label: 'תשתית אינטרנט',
      icon: Building2,
      info: 'תשתית תקשורת פיזית - כבלים, סיבים אופטיים ומתקני תקשורת.'
    },
    { 
      value: 'tv', 
      label: 'טלוויזיה',
      icon: Tv,
      info: 'שירותי טלוויזיה דיגיטלית, חבילות ערוצים ושירותי VOD.'
    },
    { 
      value: 'electricity', 
      label: 'חשמל',
      icon: Zap,
      info: 'אספקת חשמל לצרכנים פרטיים ועסקיים - חוזי אספקה ותעריפים.'
    }
  ];

  const customerTypes = [
    { 
      value: 'private', 
      label: 'לקוח פרטי', 
      description: 'משק בית רגיל',
      icon: User,
      info: 'צרכן פרטי או משק בית - חוזים ותעריפים לצרכנים ביתיים.'
    },
    { 
      value: 'business', 
      label: 'לקוח עסקי', 
      description: 'חברה או עסק',
      icon: Users,
      info: 'עסק, חברה או ארגון - חוזים מסחריים עם תנאים ותעריפים עסקיים.'
    }
  ];

  // First step - Action Type
  if (!formData.action_type) {
    return (
      <div className="text-center space-y-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            איזה פעולה תרצה לבצע?
          </h1>
          <p className="text-slate-600 text-lg">
            בחר את סוג הבקשה שתרצה להגיש
          </p>
        </div>
        
        <div className="space-y-4 max-w-2xl mx-auto">
          {actionTypes.map((action) => {
            const IconComponent = action.icon;
            return (
              <div key={action.value} className="relative">
                <button
                  onClick={() => updateFormData({ action_type: action.value as any })}
                  className="w-full p-6 bg-white border-2 border-slate-200 rounded-2xl hover:border-slate-400 hover:shadow-lg transition-all duration-200 text-right group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <IconComponent className="w-6 h-6 text-slate-700" />
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-bold text-slate-900 mb-1">
                        {action.label}
                      </div>
                      <div className="text-sm text-slate-600">
                        {action.description}
                      </div>
                    </div>
                    <InfoTooltip content={action.info} />
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Second step - Sector
  if (!formData.sector) {
    return (
      <div className="text-center space-y-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            באיזה תחום?
          </h1>
          <p className="text-slate-600 text-lg">
            בחר את סוג השירות שברצונך לטפל בו
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {sectors.map((sector) => {
            const IconComponent = sector.icon;
            return (
              <div key={sector.value} className="relative">
                <button
                  onClick={() => updateFormData({ sector: sector.value as any })}
                  className="w-full p-6 bg-white border-2 border-slate-200 rounded-2xl hover:border-slate-400 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <IconComponent className="w-8 h-8 text-slate-700" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900 mb-2">
                        {sector.label}
                      </div>
                      <div className="absolute top-4 left-4">
                        <InfoTooltip content={sector.info} />
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Third step - Customer Type
  return (
    <div className="text-center space-y-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          סוג הלקוח?
        </h1>
        <p className="text-slate-600 text-lg">
          בחר את סוג הלקוח המתאים לך
        </p>
      </div>
      
      <div className="space-y-6 max-w-2xl mx-auto">
        {customerTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <div key={type.value} className="relative">
              <button
                onClick={() => updateFormData({ customer_type: type.value as any })}
                className={cn(
                  "w-full p-6 border-2 rounded-2xl transition-all duration-200 group",
                  formData.customer_type === type.value
                    ? "border-slate-400 bg-slate-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    formData.customer_type === type.value
                      ? "bg-slate-200"
                      : "bg-slate-100 group-hover:bg-slate-200"
                  )}>
                    <IconComponent className="w-6 h-6 text-slate-700" />
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-lg font-bold text-slate-900 mb-1">
                      {type.label}
                    </div>
                    <div className="text-sm text-slate-600">
                      {type.description}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <InfoTooltip content={type.info} />
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 mr-3 transition-colors",
                      formData.customer_type === type.value
                        ? "border-slate-500 bg-slate-500"
                        : "border-slate-300"
                    )}>
                      {formData.customer_type === type.value && (
                        <CheckCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Business-specific fields */}
      {formData.customer_type === 'business' && (
        <div className="mt-10 p-8 bg-slate-50/50 rounded-2xl border border-slate-200 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-slate-700" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              פרטים עסקיים נוספים
            </h3>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-2">
                  <Label htmlFor="company_name" className="text-sm font-semibold text-slate-700">
                    שם החברה <span className="text-red-500">*</span>
                  </Label>
                  <InfoTooltip content="הזן את שם החברה המלא כפי שמופיע במרשם החברות. זה חשוב לזיהוי נכון של הישות המשפטית." />
                </div>
                <Input
                  id="company_name"
                  value={formData.company_name || ''}
                  onChange={(e) => updateFormData({ company_name: e.target.value })}
                  placeholder="שם החברה המלא"
                  className="h-12 border-slate-300 focus:border-slate-500 focus:ring-slate-500/20"
                />
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <Label htmlFor="corp_registration_number" className="text-sm font-semibold text-slate-700">
                    מספר רישום חברה <span className="text-red-500">*</span>
                  </Label>
                  <InfoTooltip content="הזן את מספר החברה (ח.פ) או מספר העמותה (ע.ר) כפי שמופיע במרשם הרשמי. זה נדרש לאימות זהות החברה." />
                </div>
                <Input
                  id="corp_registration_number"
                  value={formData.corp_registration_number || ''}
                  onChange={(e) => updateFormData({ corp_registration_number: e.target.value })}
                  placeholder="מספר ח.פ/ע.ר"
                  className="h-12 border-slate-300 focus:border-slate-500 focus:ring-slate-500/20"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-2">
                  <Label htmlFor="signer_name" className="text-sm font-semibold text-slate-700">
                    שם החותם <span className="text-red-500">*</span>
                  </Label>
                  <InfoTooltip content="שם האדם המורשה לחתום בשם החברה על מסמכים משפטיים. בדרך כלל המנכ״ל, הבעלים או מורשה חתימה רשום." />
                </div>
                <Input
                  id="signer_name"
                  value={formData.signer_name || ''}
                  onChange={(e) => updateFormData({ signer_name: e.target.value })}
                  placeholder="שם מלא של החותם"
                  className="h-12 border-slate-300 focus:border-slate-500 focus:ring-slate-500/20"
                />
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <Label htmlFor="signer_title" className="text-sm font-semibold text-slate-700">
                    תפקיד החותם <span className="text-red-500">*</span>
                  </Label>
                  <InfoTooltip content="התפקיד הרשמי של החותם בחברה. לדוגמה: מנכ״ל, בעלים, מנהל כללי, מורשה חתימה. זה חשוב לתוקף המשפטי של החתימה." />
                </div>
                <Input
                  id="signer_title"
                  value={formData.signer_title || ''}
                  onChange={(e) => updateFormData({ signer_title: e.target.value })}
                  placeholder="מנכ״ל, בעלים, מורשה חתימה"
                  className="h-12 border-slate-300 focus:border-slate-500 focus:ring-slate-500/20"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}