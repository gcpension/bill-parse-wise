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
          <div className="ml-1 p-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-help">
            <Info className="w-2.5 h-2.5 text-slate-500" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-[9px]">{content}</p>
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
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="mb-4">
          <h1 className="text-base font-bold bg-gradient-to-l from-primary to-primary/80 bg-clip-text text-transparent mb-1">
            איזה פעולה תרצה לבצע?
          </h1>
          <p className="text-slate-600 text-[10px]">
            בחר את סוג הבקשה שתרצה להגיש
          </p>
        </div>
        
        <div className="space-y-2">
          {actionTypes.map((action) => {
            const IconComponent = action.icon;
            return (
              <div key={action.value} className="relative">
                <button
                  onClick={() => updateFormData({ action_type: action.value as any })}
                  className="w-full p-3 bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60 rounded-lg hover:border-primary/30 hover:shadow-md transition-all duration-200 text-right group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                      <IconComponent className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-900 mb-0.5">
                        {action.label}
                      </div>
                      <div className="text-[9px] text-slate-600">
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
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="mb-4">
          <h1 className="text-base font-bold bg-gradient-to-l from-primary to-primary/80 bg-clip-text text-transparent mb-1">
            באיזה תחום?
          </h1>
          <p className="text-slate-600 text-[10px]">
            בחר את סוג השירות שברצונך לטפל בו
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {sectors.map((sector) => {
            const IconComponent = sector.icon;
            return (
              <div key={sector.value} className="relative">
                <button
                  onClick={() => updateFormData({ sector: sector.value as any })}
                  className="w-full p-3 bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60 rounded-lg hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex flex-col items-center space-y-1.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-[10px] font-bold text-slate-900">
                      {sector.label}
                    </div>
                    <div className="absolute top-1 left-1">
                      <InfoTooltip content={sector.info} />
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
    <div className="text-center space-y-3 max-w-xl mx-auto">
      <div className="mb-4">
        <h1 className="text-base font-bold bg-gradient-to-l from-primary to-primary/80 bg-clip-text text-transparent mb-1">
          סוג הלקוח?
        </h1>
        <p className="text-slate-600 text-[10px]">
          בחר את סוג הלקוח המתאים לך
        </p>
      </div>
      
      <div className="space-y-2">
        {customerTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <div key={type.value} className="relative">
              <button
                onClick={() => updateFormData({ customer_type: type.value as any })}
                className={cn(
                  "w-full p-3 border rounded-lg transition-all duration-200 group",
                  formData.customer_type === type.value
                    ? "border-primary/40 bg-primary/5 shadow-sm"
                    : "border-slate-200/60 bg-gradient-to-br from-slate-50 to-slate-100/50 hover:border-primary/20 hover:shadow-md"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                    formData.customer_type === type.value
                      ? "bg-primary/20"
                      : "bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10"
                  )}>
                    <IconComponent className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-xs font-bold text-slate-900 mb-0.5">
                      {type.label}
                    </div>
                    <div className="text-[9px] text-slate-600">
                      {type.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <InfoTooltip content={type.info} />
                    <div className={cn(
                      "w-3.5 h-3.5 rounded-full border transition-colors",
                      formData.customer_type === type.value
                        ? "border-primary bg-primary"
                        : "border-slate-300"
                    )}>
                      {formData.customer_type === type.value && (
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
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
        <div className="mt-4 p-3 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg border border-slate-200/60">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-5 h-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded flex items-center justify-center">
              <Building2 className="w-3 h-3 text-primary" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">
              פרטים עסקיים נוספים
            </h3>
          </div>
          
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <div className="flex items-center mb-0.5">
                  <Label htmlFor="company_name" className="text-[8px] font-semibold text-slate-700">
                    שם החברה <span className="text-red-500">*</span>
                  </Label>
                  <InfoTooltip content="הזן את שם החברה המלא." />
                </div>
                <Input
                  id="company_name"
                  value={formData.company_name || ''}
                  onChange={(e) => updateFormData({ company_name: e.target.value })}
                  placeholder="שם החברה המלא"
                  className="h-7 border-slate-200 text-[9px]"
                />
              </div>
              <div>
                <div className="flex items-center mb-0.5">
                  <Label htmlFor="corp_registration_number" className="text-[8px] font-semibold text-slate-700">
                    מספר רישום חברה <span className="text-red-500">*</span>
                  </Label>
                  <InfoTooltip content="מספר ח.פ או ע.ר" />
                </div>
                <Input
                  id="corp_registration_number"
                  value={formData.corp_registration_number || ''}
                  onChange={(e) => updateFormData({ corp_registration_number: e.target.value })}
                  placeholder="מספר ח.פ/ע.ר"
                  className="h-7 border-slate-200 text-[9px]"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <div className="flex items-center mb-0.5">
                  <Label htmlFor="signer_name" className="text-[8px] font-semibold text-slate-700">
                    שם החותם <span className="text-red-500">*</span>
                  </Label>
                  <InfoTooltip content="שם המורשה לחתום בשם החברה" />
                </div>
                <Input
                  id="signer_name"
                  value={formData.signer_name || ''}
                  onChange={(e) => updateFormData({ signer_name: e.target.value })}
                  placeholder="שם מלא של החותם"
                  className="h-7 border-slate-200 text-[9px]"
                />
              </div>
              <div>
                <div className="flex items-center mb-0.5">
                  <Label htmlFor="signer_title" className="text-[8px] font-semibold text-slate-700">
                    תפקיד החותם <span className="text-red-500">*</span>
                  </Label>
                  <InfoTooltip content="התפקיד הרשמי" />
                </div>
                <Input
                  id="signer_title"
                  value={formData.signer_title || ''}
                  onChange={(e) => updateFormData({ signer_title: e.target.value })}
                  placeholder="מנכ״ל, בעלים"
                  className="h-7 border-slate-200 text-[9px]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}