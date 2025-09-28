import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ProviderSelector, { defaultProviders } from '@/components/ui/provider-selector';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { Info, User, Mail, Phone, MapPin, Building2, Languages } from 'lucide-react';

interface BasicDataStepProps {
  formData: Partial<ServiceRequestFormData>;
  updateFormData: (data: Partial<ServiceRequestFormData>) => void;
}

const providerOptions = [
  'בזק',
  'פרטנר/אורנג׳',
  'סלקום',
  'HOT',
  'גולן טלקום',
  'רמי לוי',
  'פלאפון',
  'חברת החשמל',
  'נקטיק אנרגיה',
  'יס',
  'אחר'
];

const languageOptions = [
  { value: 'he', label: 'עברית' },
  { value: 'en', label: 'אנגלית' },
  { value: 'ru', label: 'רוסית' },
  { value: 'other', label: 'אחר' },
];

export default function BasicDataStep({ formData, updateFormData }: BasicDataStepProps) {
  const handleFieldChange = (field: keyof ServiceRequestFormData, value: any) => {
    console.log('Field changed:', field, 'Value:', value);
    updateFormData({ [field]: value });
  };

  const handleAddressChange = (field: string, value: string) => {
    updateFormData({
      service_address: {
        ...formData.service_address,
        [field]: value
      }
    });
  };

  const needsTargetProvider = formData.action_type === 'switch';

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

  return (
    <div className="space-y-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          פרטים אישיים
        </h1>
        <p className="text-slate-600 text-lg">
          מלא את הפרטים הבסיסיים הנדרשים לטיפול בבקשה
        </p>
      </div>

      <div className="space-y-8">
        {/* Personal Information Section */}
        <div className="bg-slate-50/50 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">פרטים אישיים</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-2">
                <Label htmlFor="full_name" className="text-sm font-semibold text-slate-700">
                  שם מלא <span className="text-red-500">*</span>
                </Label>
                <InfoTooltip content="הזן את שמך המלא בדיוק כפי שמופיע בתעודת הזהות או בתעודה הרשמית. זה חשוב למניעת בעיות בזיהוי ובאישור הבקשה." />
              </div>
              <Input
                id="full_name"
                value={formData.full_name || ''}
                onChange={(e) => handleFieldChange('full_name', e.target.value)}
                placeholder="שם פרטי ושם משפחה"
                className="h-12 border-slate-300 focus:border-slate-500 focus:ring-slate-500/20"
              />
            </div>

            <div>
              <div className="flex items-center mb-2">
                <Label htmlFor="national_id_or_corp" className="text-sm font-semibold text-slate-700">
                  {formData.customer_type === 'business' ? 'מספר חברה' : 'תעודת זהות'} <span className="text-red-500">*</span>
                </Label>
                <InfoTooltip content={formData.customer_type === 'business' 
                  ? "הזן את מספר החברה (ח.פ או ע.ר) כפי שמופיע במרשם החברות"
                  : "הזן את מספר תעודת הזהות שלך בן 9 ספרות (עם ספרת ביקורת)"
                } />
              </div>
              <Input
                id="national_id_or_corp"
                value={formData.national_id_or_corp || ''}
                onChange={(e) => handleFieldChange('national_id_or_corp', e.target.value)}
                placeholder={formData.customer_type === 'business' ? "מספר ח.פ/ע.ר" : "123456789"}
                className="h-12 border-slate-300 focus:border-slate-500 focus:ring-slate-500/20"
              />
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-slate-50/50 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">פרטי קשר</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                  כתובת דוא״ל <span className="text-red-500">*</span>
                </Label>
                <InfoTooltip content="הזן כתובת דוא״ל פעילה. אליה נישלח לך אישור הבקשה, קישור לחתימה דיגיטלית ועדכונים על מצב הטיפול." />
              </div>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="name@example.com"
                className="h-12 border-slate-300 focus:border-slate-500 focus:ring-slate-500/20"
              />
            </div>

            <div>
              <div className="flex items-center mb-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                  טלפון נייד <span className="text-red-500">*</span>
                </Label>
                <InfoTooltip content="הזן מספר טלפון נייד פעיל. נשלח אליך SMS עם קוד אימות וקישור לחתימה דיגיטלית. הטלפון ישמש גם ליצירת קשר במידת הצורך." />
              </div>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="050-1234567"
                className="h-12 border-slate-300 focus:border-slate-500 focus:ring-slate-500/20"
              />
            </div>
          </div>
        </div>

        {/* Service Address Section */}
        <div className="bg-slate-50/50 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">כתובת השירות</h3>
              <p className="text-sm text-slate-600">הכתובת בה השירות מותקן או מסופק</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center mb-2">
                <Label htmlFor="street" className="text-sm font-semibold text-slate-700">
                  רחוב <span className="text-red-500">*</span>
                </Label>
                <InfoTooltip content="הזן את שם הרחוב המדויק של הכתובת בה השירות מותקן. וודא שהכתובת מדויקת למניעת עיכובים." />
              </div>
              <Input
                id="street"
                value={formData.service_address?.street || ''}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="שם הרחוב"
                className="h-12 border-slate-300 focus:border-slate-500 focus:ring-slate-500/20"
              />
            </div>

            <div>
              <div className="flex items-center mb-2">
                <Label htmlFor="number" className="text-sm font-semibold text-slate-700">
                  מספר בית <span className="text-red-500">*</span>
                </Label>
                <InfoTooltip content="מספר הבית או הדירה. אם יש מספר דירה, הזן גם אותו (לדוגמה: 5 דירה 3 או 5/3)." />
              </div>
              <Input
                id="number"
                value={formData.service_address?.number || ''}
                onChange={(e) => handleAddressChange('number', e.target.value)}
                placeholder="מספר + דירה"
                className="h-12 border-slate-300 focus:border-slate-500 focus:ring-slate-500/20"
              />
            </div>

            <div>
              <div className="flex items-center mb-2">
                <Label htmlFor="city" className="text-sm font-semibold text-slate-700">
                  עיר <span className="text-red-500">*</span>
                </Label>
                <InfoTooltip content="שם העיר או הישוב בו נמצאת כתובת השירות. וודא שהשם מדויק כפי שמופיע רשמית." />
              </div>
              <Input
                id="city"
                value={formData.service_address?.city || ''}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder="שם העיר"
                className="h-12 border-slate-300 focus:border-slate-500 focus:ring-slate-500/20"
              />
            </div>
          </div>
        </div>

        {/* Provider Information Section */}
        <div className="bg-slate-50/50 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">פרטי ספקים</h3>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center mb-4">
                <h4 className="text-lg font-semibold text-slate-700">
                  הספק הנוכחי <span className="text-red-500">*</span>
                </h4>
                <InfoTooltip content="בחר את הספק שממנו אתה מבקש לעבור או לבצע פעולה. זה הספק שמספק לך כרגע את השירות." />
              </div>
              <ProviderSelector
                providers={defaultProviders}
                selectedProvider={formData.current_provider}
                onSelect={(providerId) => handleFieldChange('current_provider', providerId)}
              />
            </div>

            {needsTargetProvider && (
              <div>
                <div className="flex items-center mb-4">
                  <h4 className="text-lg font-semibold text-slate-700">
                    ספק היעד <span className="text-red-500">*</span>
                  </h4>
                  <InfoTooltip content="בחר את הספק החדש אליו אתה רוצה לעבור. וודא שהספק מספק שירות באזור שלך." />
                </div>
                <ProviderSelector
                  providers={defaultProviders}
                  selectedProvider={formData.target_provider}
                  onSelect={(providerId) => handleFieldChange('target_provider', providerId)}
                  excludeProvider={formData.current_provider}
                />
              </div>
            )}
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-slate-50/50 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
              <Languages className="w-5 h-5 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">העדפות תקשורת</h3>
          </div>

          <div className="max-w-md">
            <div className="flex items-center mb-2">
              <Label htmlFor="preferred_language" className="text-sm font-semibold text-slate-700">
                שפה מועדפת <span className="text-red-500">*</span>
              </Label>
              <InfoTooltip content="בחר את השפה בה תעדיף לקבל הודעות ולנהל תקשורת. זה יעזור לנו לספק שירות מותאם יותר." />
            </div>
            <Select
              value={formData.preferred_language || ''}
              onValueChange={(value) => handleFieldChange('preferred_language', value)}
            >
              <SelectTrigger className="h-12 border-slate-300 focus:border-slate-500 focus:ring-slate-500/20">
                <SelectValue placeholder="בחר שפה מועדפת" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}