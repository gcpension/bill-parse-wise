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
        <Card className="border-success/30 bg-gradient-to-r from-success/10 to-success-glow/10 animate-scale-in glass-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center animate-bounce-gentle">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-xl text-success font-heebo">
                🎯 פרטי השירות זוהו אוטומטית
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white/50 rounded-xl hover-scale">
                <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">סוג פעולה</Badge>
                <p className="font-bold text-lg font-heebo">{actionTypes.find(a => a.value === formData.action_type)?.label}</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl hover-scale">
                <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">סקטור</Badge>
                <p className="font-bold text-lg font-heebo">{sectors.find(s => s.value === formData.sector)?.label}</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl hover-scale">
                <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">ספק יעד</Badge>
                <p className="font-bold text-lg font-heebo">{formData.target_provider}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Type Selection */}
      {!isAutoDetected && (
        <Card className="animate-fade-in glass-card border-primary/10">
          <CardHeader className="pb-6">
            <CardTitle className="font-heebo text-2xl text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              🎯 סוג הפעולה המבוקשת
            </CardTitle>
            <p className="text-center text-muted-foreground font-assistant mt-2">
              בחר את סוג הפעולה שברצונך לבצע
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {actionTypes.map((action) => (
                <Button
                  key={action.value}
                  variant={formData.action_type === action.value ? "default" : "outline"}
                  className={cn(
                    "h-auto p-6 flex flex-col items-start gap-4 transition-all duration-300 hover-scale relative overflow-hidden group",
                    formData.action_type === action.value 
                      ? "bg-gradient-to-r from-primary to-primary-glow text-white shadow-elegant border-0" 
                      : "border-2 border-primary/20 hover:border-primary/50 bg-white/50 backdrop-blur-sm"
                  )}
                  onClick={() => updateFormData({ action_type: action.value as any })}
                >
                  {formData.action_type === action.value && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary-glow/10 animate-pulse"></div>
                  )}
                  <div className="flex items-center gap-4 w-full relative z-10">
                    <div className={cn(
                      "p-3 rounded-xl",
                      formData.action_type === action.value 
                        ? "bg-white/20 backdrop-blur-sm" 
                        : "bg-gradient-to-r from-primary to-primary-glow"
                    )}>
                      <div className="text-white text-lg">
                        {action.icon}
                      </div>
                    </div>
                    <span className="font-heebo font-bold text-lg">{action.label}</span>
                  </div>
                  <p className={cn(
                    "text-sm text-right w-full relative z-10",
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
        <Card className="animate-fade-in glass-card border-primary/10">
          <CardHeader className="pb-6">
            <CardTitle className="font-heebo text-2xl text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              🏢 בחירת סקטור השירות
            </CardTitle>
            <p className="text-center text-muted-foreground font-assistant mt-2">
              באיזה תחום אתה מעוניין לבצע את הפעולה?
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {sectors.map((sector) => (
                <Button
                  key={sector.value}
                  variant={formData.sector === sector.value ? "default" : "outline"}
                  className={cn(
                    "h-28 flex flex-col gap-3 transition-all duration-300 hover-scale relative overflow-hidden group",
                    formData.sector === sector.value 
                      ? "bg-gradient-to-r from-primary to-primary-glow text-white shadow-elegant border-0" 
                      : "border-2 border-primary/20 hover:border-primary/50 bg-white/50 backdrop-blur-sm"
                  )}
                  onClick={() => updateFormData({ sector: sector.value as any })}
                >
                  {formData.sector === sector.value && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary-glow/10 animate-pulse"></div>
                  )}
                  <div className={cn(
                    "p-3 rounded-xl relative z-10",
                    formData.sector === sector.value 
                      ? "bg-white/20 backdrop-blur-sm" 
                      : "bg-gradient-to-r from-primary to-primary-glow"
                  )}>
                    <div className="text-white text-xl">
                      {sector.icon}
                    </div>
                  </div>
                  <span className="font-heebo font-bold text-sm relative z-10">{sector.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Type Selection */}
      <Card className="animate-fade-in glass-card border-primary/10">
        <CardHeader className="pb-6">
          <CardTitle className="font-heebo text-2xl text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            👤 סוג הלקוח
          </CardTitle>
          <p className="text-center text-muted-foreground font-assistant mt-2">
            האם אתה לקוח פרטי או עסקי?
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customerTypes.map((type) => (
              <Button
                key={type.value}
                variant={formData.customer_type === type.value ? "default" : "outline"}
                className={cn(
                  "h-auto p-6 flex flex-col items-start gap-4 transition-all duration-300 hover-scale relative overflow-hidden group",
                  formData.customer_type === type.value 
                    ? "bg-gradient-to-r from-primary to-primary-glow text-white shadow-elegant border-0" 
                    : "border-2 border-primary/20 hover:border-primary/50 bg-white/50 backdrop-blur-sm"
                )}
                onClick={() => updateFormData({ customer_type: type.value as any })}
              >
                {formData.customer_type === type.value && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary-glow/10 animate-pulse"></div>
                )}
                <div className="flex items-center gap-4 w-full relative z-10">
                  <div className={cn(
                    "p-3 rounded-xl",
                    formData.customer_type === type.value 
                      ? "bg-white/20 backdrop-blur-sm" 
                      : "bg-gradient-to-r from-primary to-primary-glow"
                  )}>
                    <div className="text-white text-lg">
                      {type.icon}
                    </div>
                  </div>
                  <span className="font-heebo font-bold text-lg">{type.label}</span>
                </div>
                <p className={cn(
                  "text-sm text-right w-full relative z-10",
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
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary-glow/5 animate-scale-in glass-card">
          <CardHeader className="pb-6">
            <CardTitle className="font-heebo text-2xl text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              🏢 פרטים עסקיים נוספים
            </CardTitle>
            <p className="text-center text-muted-foreground font-assistant mt-2">
              נדרש מידע נוסף עבור לקוחות עסקיים
            </p>
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