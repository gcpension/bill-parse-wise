import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  CheckCircle
} from 'lucide-react';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { FileUpload } from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';

interface GeneralChoicesStepProps {
  formData: Partial<ServiceRequestFormData>;
  updateFormData: (data: Partial<ServiceRequestFormData>) => void;
}

export default function GeneralChoicesStep({ formData, updateFormData }: GeneralChoicesStepProps) {
  
  const actionTypes = [
    { value: 'disconnect', label: 'ניתוק שירות', icon: <UserX className="w-5 h-5" />, color: 'bg-red-500', description: 'סיום מוחלט של השירות' },
    { value: 'switch', label: 'מעבר ספק', icon: <ArrowRightLeft className="w-5 h-5" />, color: 'bg-blue-500', description: 'מעבר לספק אחר' },
    { value: 'move', label: 'העברת דירה', icon: <Home className="w-5 h-5" />, color: 'bg-green-500', description: 'העברת שירות לכתובת חדשה' },
    { value: 'early_terminate', label: 'סיום מוקדם', icon: <Calendar className="w-5 h-5" />, color: 'bg-orange-500', description: 'סיום חוזה לפני תום התקופה' }
  ];

  const sectors = [
    { value: 'cellular', label: 'סלולר', icon: <Smartphone className="w-5 h-5" />, color: 'bg-purple-500' },
    { value: 'internet_isp', label: 'אינטרנט ISP', icon: <Wifi className="w-5 h-5" />, color: 'bg-blue-500' },
    { value: 'internet_infra', label: 'תשתית אינטרנט', icon: <Wifi className="w-5 h-5" />, color: 'bg-cyan-500' },
    { value: 'tv', label: 'טלוויזיה', icon: <Tv className="w-5 h-5" />, color: 'bg-green-500' },
    { value: 'electricity', label: 'חשמל', icon: <Zap className="w-5 h-5" />, color: 'bg-yellow-500' }
  ];

  const customerTypes = [
    { value: 'private', label: 'לקוח פרטי', icon: <User className="w-5 h-5" />, description: 'משק בית רגיל' },
    { value: 'business', label: 'לקוח עסקי', icon: <Building2 className="w-5 h-5" />, description: 'חברה או עסק' }
  ];

  // Auto-hide action type and sector if already detected from plan selection
  const isAutoDetected = formData.selected_plan_name && formData.action_type && formData.sector;

  return (
    <div className="space-y-8">
      {/* Auto-Detection Banner */}
      {isAutoDetected && (
        <Card className="border-green-200 bg-green-50 animate-scale-in">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <CardTitle className="text-lg text-green-800 font-heebo">
                פרטי השירות זוהו אוטומטית
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Badge variant="secondary" className="mb-2">סוג פעולה</Badge>
                <p className="font-semibold">{actionTypes.find(a => a.value === formData.action_type)?.label}</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="mb-2">סקטור</Badge>
                <p className="font-semibold">{sectors.find(s => s.value === formData.sector)?.label}</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="mb-2">ספק יעד</Badge>
                <p className="font-semibold">{formData.target_provider}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Type Selection */}
      {!isAutoDetected && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="font-heebo text-xl">סוג הפעולה המבוקשת</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actionTypes.map((action) => (
                <Button
                  key={action.value}
                  variant={formData.action_type === action.value ? "default" : "outline"}
                  className={cn(
                    "h-auto p-4 flex flex-col items-start gap-3 transition-all duration-300 hover-scale",
                    formData.action_type === action.value 
                      ? `${action.color} text-white shadow-lg` 
                      : "border-2 hover:border-primary"
                  )}
                  onClick={() => updateFormData({ action_type: action.value as any })}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={cn(
                      "p-2 rounded-lg",
                      formData.action_type === action.value ? "bg-white/20" : action.color
                    )}>
                      <div className={formData.action_type === action.value ? "text-white" : "text-white"}>
                        {action.icon}
                      </div>
                    </div>
                    <span className="font-heebo font-semibold">{action.label}</span>
                  </div>
                  <p className={cn(
                    "text-sm text-right w-full",
                    formData.action_type === action.value ? "text-white/90" : "text-muted-foreground"
                  )}>
                    {action.description}
                  </p>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sector Selection */}
      {!isAutoDetected && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="font-heebo text-xl">בחירת סקטור</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {sectors.map((sector) => (
                <Button
                  key={sector.value}
                  variant={formData.sector === sector.value ? "default" : "outline"}
                  className={cn(
                    "h-20 flex flex-col gap-2 transition-all duration-300 hover-scale",
                    formData.sector === sector.value 
                      ? `${sector.color} text-white shadow-lg` 
                      : "border-2 hover:border-primary"
                  )}
                  onClick={() => updateFormData({ sector: sector.value as any })}
                >
                  <div className={cn(
                    "p-2 rounded-lg",
                    formData.sector === sector.value ? "bg-white/20" : sector.color
                  )}>
                    <div className={formData.sector === sector.value ? "text-white" : "text-white"}>
                      {sector.icon}
                    </div>
                  </div>
                  <span className="font-heebo font-semibold text-sm">{sector.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Type Selection */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="font-heebo text-xl">סוג לקוח</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customerTypes.map((type) => (
              <Button
                key={type.value}
                variant={formData.customer_type === type.value ? "default" : "outline"}
                className={cn(
                  "h-auto p-4 flex flex-col items-start gap-3 transition-all duration-300 hover-scale",
                  formData.customer_type === type.value 
                    ? "bg-primary text-white shadow-lg" 
                    : "border-2 hover:border-primary"
                )}
                onClick={() => updateFormData({ customer_type: type.value as any })}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={cn(
                    "p-2 rounded-lg",
                    formData.customer_type === type.value ? "bg-white/20" : "bg-primary"
                  )}>
                    <div className="text-white">
                      {type.icon}
                    </div>
                  </div>
                  <span className="font-heebo font-semibold">{type.label}</span>
                </div>
                <p className={cn(
                  "text-sm text-right w-full",
                  formData.customer_type === type.value ? "text-white/90" : "text-muted-foreground"
                )}>
                  {type.description}
                </p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business-specific fields */}
      {formData.customer_type === 'business' && (
        <Card className="border-orange-200 bg-orange-50 animate-scale-in">
          <CardHeader>
            <CardTitle className="font-heebo text-xl text-orange-800">פרטים עסקיים</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name" className="font-assistant font-semibold">שם החברה *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name || ''}
                  onChange={(e) => updateFormData({ company_name: e.target.value })}
                  placeholder="שם החברה המלא"
                  className="font-assistant"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="corp_registration_number" className="font-assistant font-semibold">מספר רישום חברה *</Label>
                <Input
                  id="corp_registration_number"
                  value={formData.corp_registration_number || ''}
                  onChange={(e) => updateFormData({ corp_registration_number: e.target.value })}
                  placeholder="מספר ח.פ/ע.ר"
                  className="font-assistant"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signer_name" className="font-assistant font-semibold">שם החותם *</Label>
                <Input
                  id="signer_name"
                  value={formData.signer_name || ''}
                  onChange={(e) => updateFormData({ signer_name: e.target.value })}
                  placeholder="שם מלא של החותם"
                  className="font-assistant"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signer_title" className="font-assistant font-semibold">תפקיד החותם *</Label>
                <Input
                  id="signer_title"
                  value={formData.signer_title || ''}
                  onChange={(e) => updateFormData({ signer_title: e.target.value })}
                  placeholder="מנכ״ל, בעלים, מורשה חתימה"
                  className="font-assistant"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-assistant font-semibold">ייפוי כוח עסקי (PDF) *</Label>
              <FileUpload
                onFileUpload={(file) => updateFormData({ power_of_attorney_file: file })}
                accept=".pdf"
                maxSize={10 * 1024 * 1024}
                className="border-orange-200"
                helperText="נדרש ייפוי כוח חתום עבור לקוחות עסקיים"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}