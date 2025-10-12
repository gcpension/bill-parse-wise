import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ProviderSelector, { defaultProviders } from '@/components/ui/provider-selector';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { Info, User, Mail, Phone, MapPin, Building2, Languages, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [fieldValidation, setFieldValidation] = useState<Record<string, { isValid: boolean; message?: string; isValidating?: boolean }>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Auto-save to localStorage with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        localStorage.setItem('basic_data_autosave', JSON.stringify(formData));
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData]);

  // Format phone number automatically
  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}${cleaned.length > 6 ? '-' + cleaned.slice(6, 10) : ''}`;
  };

  // Validate Israeli ID
  const validateIsraeliId = (id: string): boolean => {
    if (!id || id.length !== 9) return false;
    const digits = id.split('').map(Number);
    const sum = digits.reduce((acc, digit, index) => {
      const step = digit * ((index % 2) + 1);
      return acc + (step > 9 ? step - 9 : step);
    }, 0);
    return sum % 10 === 0;
  };

  // Validate email
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validate phone
  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 && (cleaned.startsWith('05') || cleaned.startsWith('02') || cleaned.startsWith('03') || cleaned.startsWith('04') || cleaned.startsWith('08') || cleaned.startsWith('09'));
  };

  const handleFieldChange = (field: keyof ServiceRequestFormData, value: any) => {
    updateFormData({ [field]: value });
    setTouchedFields(prev => new Set(prev).add(field));
    
    // Real-time validation
    setTimeout(() => validateField(field, value), 300);
  };

  const validateField = (field: keyof ServiceRequestFormData, value: any) => {
    let validation = { isValid: true, message: undefined as string | undefined };

    switch (field) {
      case 'full_name':
        if (!value || value.length < 2) {
          validation = { isValid: false, message: 'שם חייב להכיל לפחות 2 תווים' };
        } else if (value.length > 100) {
          validation = { isValid: false, message: 'שם ארוך מדי' };
        } else {
          validation = { isValid: true, message: 'נראה טוב!' };
        }
        break;
      
      case 'national_id_or_corp':
        if (formData.customer_type === 'business') {
          validation = value && value.length >= 8 
            ? { isValid: true, message: 'תקין' }
            : { isValid: false, message: 'מספר חברה צריך להיות 8-9 ספרות' };
        } else {
          const isValid = validateIsraeliId(value);
          validation = isValid
            ? { isValid: true, message: 'תעודת זהות תקינה' }
            : { isValid: false, message: 'תעודת זהות לא תקינה' };
        }
        break;
      
      case 'email':
        const isValidEmail = validateEmail(value);
        validation = isValidEmail
          ? { isValid: true, message: 'כתובת דוא״ל תקינה' }
          : { isValid: false, message: 'כתובת דוא״ל לא תקינה' };
        break;
      
      case 'phone':
        const isValidPhone = validatePhone(value);
        validation = isValidPhone
          ? { isValid: true, message: 'מספר תקין' }
          : { isValid: false, message: 'מספר טלפון לא תקין (נדרש 10 ספרות)' };
        break;
    }

    setFieldValidation(prev => ({ ...prev, [field]: validation }));
  };

  const handlePhoneChange = (field: keyof ServiceRequestFormData, value: string) => {
    const formatted = formatPhoneNumber(value);
    handleFieldChange(field, formatted);
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

  const getFieldStatus = (field: keyof ServiceRequestFormData) => {
    if (!touchedFields.has(field) || !fieldValidation[field]) return null;
    return fieldValidation[field];
  };

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="mr-1 p-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-help">
            <Info className="w-2.5 h-2.5 text-slate-500" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-[9px]">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const completedFields = [
    formData.full_name,
    formData.national_id_or_corp,
    formData.email,
    formData.phone,
    formData.service_address?.street,
    formData.service_address?.number,
    formData.service_address?.city,
    formData.current_provider,
    formData.preferred_language
  ].filter(Boolean).length;

  const totalFields = needsTargetProvider ? 10 : 9;
  const progressPercentage = (completedFields / totalFields) * 100;

  return (
    <div className="space-y-2">
      <div className="text-center mb-3">
        <h1 className="text-base font-bold text-slate-900 mb-1">
          פרטים אישיים
        </h1>
        <p className="text-slate-600 text-[10px] mb-2">
          מלא את הפרטים הבסיסיים הנדרשים לטיפול בבקשה
        </p>
        
        {/* Progress indicator */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[9px] font-medium text-slate-600">התקדמות</span>
            <span className="text-[9px] font-bold text-slate-900">{completedFields}/{totalFields}</span>
          </div>
          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-l from-green-500 to-green-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {completedFields === totalFields && (
            <p className="text-[9px] text-green-600 font-medium mt-0.5 animate-fade-in">
              <CheckCircle2 className="w-2.5 h-2.5 inline ml-1" />
              כל השדות מולאו!
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {/* Personal Information Section */}
        <div className="bg-slate-50/50 rounded-lg p-2 space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-5 h-5 bg-slate-200 rounded-md flex items-center justify-center">
              <User className="w-3 h-3 text-slate-700" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">פרטים אישיים</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <div className="flex items-center mb-0.5">
                <Label htmlFor="full_name" className="text-[9px] font-semibold text-slate-700">
                  שם מלא <span className="text-red-500">*</span>
                </Label>
                <InfoTooltip content="הזן את שמך המלא בדיוק כפי שמופיע בתעודת הזהות או בתעודה הרשמית. זה חשוב למניעת בעיות בזיהוי ובאישור הבקשה." />
              </div>
              <div className="relative">
                <Input
                  id="full_name"
                  value={formData.full_name || ''}
                  onChange={(e) => handleFieldChange('full_name', e.target.value)}
                  placeholder="שם פרטי ושם משפחה"
                  className={cn(
                    "h-6 pl-7 transition-all duration-200 text-[10px]",
                    getFieldStatus('full_name')?.isValid === true && "border-green-400 bg-green-50/30 focus:border-green-500",
                    getFieldStatus('full_name')?.isValid === false && "border-red-400 bg-red-50/30 focus:border-red-500"
                  )}
                />
                {getFieldStatus('full_name') && (
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2">
                    {getFieldStatus('full_name')?.isValid ? (
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {getFieldStatus('full_name')?.message && (
                <p className={cn(
                  "text-[8px] mt-0.5 font-medium",
                  getFieldStatus('full_name')?.isValid ? "text-green-600" : "text-red-500"
                )}>
                  {getFieldStatus('full_name')?.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center mb-0.5">
                <Label htmlFor="national_id_or_corp" className="text-[9px] font-semibold text-slate-700">
                  {formData.customer_type === 'business' ? 'מספר חברה' : 'תעודת זהות'} <span className="text-red-500">*</span>
                </Label>
                <InfoTooltip content={formData.customer_type === 'business' 
                  ? "הזן את מספר החברה (ח.פ או ע.ר) כפי שמופיע במרשם החברות"
                  : "הזן את מספר תעודת הזהות שלך בן 9 ספרות (עם ספרת ביקורת)"
                } />
              </div>
              <div className="relative">
                <Input
                  id="national_id_or_corp"
                  value={formData.national_id_or_corp || ''}
                  onChange={(e) => handleFieldChange('national_id_or_corp', e.target.value)}
                  placeholder={formData.customer_type === 'business' ? "מספר ח.פ/ע.ר" : "12345678"}
                  maxLength={9}
                  className={cn(
                    "h-6 pl-7 transition-all duration-200 text-[10px]",
                    getFieldStatus('national_id_or_corp')?.isValid === true && "border-green-400 bg-green-50/30 focus:border-green-500",
                    getFieldStatus('national_id_or_corp')?.isValid === false && "border-red-400 bg-red-50/30 focus:border-red-500"
                  )}
                />
                {getFieldStatus('national_id_or_corp') && (
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2">
                    {getFieldStatus('national_id_or_corp')?.isValid ? (
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {getFieldStatus('national_id_or_corp')?.message && (
                <p className={cn(
                  "text-[8px] mt-0.5 font-medium",
                  getFieldStatus('national_id_or_corp')?.isValid ? "text-green-600" : "text-red-500"
                )}>
                  {getFieldStatus('national_id_or_corp')?.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-slate-50/50 rounded-lg p-2 space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-5 h-5 bg-slate-200 rounded-md flex items-center justify-center">
              <Mail className="w-3 h-3 text-slate-700" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">פרטי קשר</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <div className="flex items-center mb-0.5">
                <Label htmlFor="email" className="text-[9px] font-semibold text-slate-700">
                  כתובת דוא״ל <span className="text-red-500">*</span>
                </Label>
                <InfoTooltip content="הזן כתובת דוא״ל פעילה. אליה נישלח לך אישור הבקשה, קישור לחתימה דיגיטלית ועדכונים על מצב הטיפול." />
              </div>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="name@example.com"
                  className={cn(
                    "h-6 pl-7 transition-all duration-200 text-[10px]",
                    getFieldStatus('email')?.isValid === true && "border-green-400 bg-green-50/30 focus:border-green-500",
                    getFieldStatus('email')?.isValid === false && "border-red-400 bg-red-50/30 focus:border-red-500"
                  )}
                />
                {getFieldStatus('email') && (
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2">
                    {getFieldStatus('email')?.isValid ? (
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {getFieldStatus('email')?.message && (
                <p className={cn(
                  "text-[8px] mt-0.5 font-medium",
                  getFieldStatus('email')?.isValid ? "text-green-600" : "text-red-500"
                )}>
                  {getFieldStatus('email')?.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center mb-0.5">
                <Label htmlFor="phone" className="text-[9px] font-semibold text-slate-700">
                  טלפון נייד <span className="text-red-500">*</span>
                </Label>
                <InfoTooltip content="הזן מספר טלפון נייד פעיל. נשלח אליך SMS עם קוד אימות וקישור לחתימה דיגיטלית. הטלפון ישמש גם ליצירת קשר במידת הצורך." />
              </div>
              <div className="relative">
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handlePhoneChange('phone', e.target.value)}
                  placeholder="050-1234567"
                  maxLength={12}
                  className={cn(
                    "h-6 pl-7 transition-all duration-200 text-[10px]",
                    getFieldStatus('phone')?.isValid === true && "border-green-400 bg-green-50/30 focus:border-green-500",
                    getFieldStatus('phone')?.isValid === false && "border-red-400 bg-red-50/30 focus:border-red-500"
                  )}
                />
                {getFieldStatus('phone') && (
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2">
                    {getFieldStatus('phone')?.isValid ? (
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {getFieldStatus('phone')?.message && (
                <p className={cn(
                  "text-[8px] mt-0.5 font-medium",
                  getFieldStatus('phone')?.isValid ? "text-green-600" : "text-red-500"
                )}>
                  {getFieldStatus('phone')?.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Service Address Section */}
        <div className="bg-slate-50/50 rounded-lg p-2 space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-5 h-5 bg-slate-200 rounded-md flex items-center justify-center">
              <MapPin className="w-3 h-3 text-slate-700" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">כתובת השירות</h3>
              <p className="text-[8px] text-slate-600">הכתובת בה השירות מותקן</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <div className="flex items-center mb-0.5">
                <Label htmlFor="street" className="text-[9px] font-semibold text-slate-700">
                  רחוב <span className="text-red-500">*</span>
                </Label>
                <InfoTooltip content="הזן את שם הרחוב המדויק של הכתובת בה השירות מותקן. וודא שהכתובת מדויקת למניעת עיכובים." />
              </div>
              <Input
                id="street"
                value={formData.service_address?.street || ''}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="שם הרחוב"
                className="h-6 text-[10px]"
              />
            </div>

            <div>
              <div className="flex items-center mb-0.5">
                <Label htmlFor="number" className="text-[9px] font-semibold text-slate-700">
                  מספר בית <span className="text-red-500">*</span>
                </Label>
                <InfoTooltip content="מספר הבית או הדירה. אם יש מספר דירה, הזן גם אותו (לדוגמה: 5 דירה 3 או 5/3)." />
              </div>
              <Input
                id="number"
                value={formData.service_address?.number || ''}
                onChange={(e) => handleAddressChange('number', e.target.value)}
                placeholder="מספר + דירה"
                className="h-6 text-[10px]"
              />
            </div>

            <div>
              <div className="flex items-center mb-0.5">
                <Label htmlFor="city" className="text-[9px] font-semibold text-slate-700">
                  עיר <span className="text-red-500">*</span>
                </Label>
                <InfoTooltip content="שם העיר או הישוב בו נמצאת כתובת השירות. וודא שהשם מדויק כפי שמופיע רשמית." />
              </div>
              <Input
                id="city"
                value={formData.service_address?.city || ''}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder="שם העיר"
                className="h-6 text-[10px]"
              />
            </div>
          </div>
        </div>

        {/* Provider Information Section */}
        <div className="bg-slate-50/50 rounded-lg p-2 space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-5 h-5 bg-slate-200 rounded-md flex items-center justify-center">
              <Building2 className="w-3 h-3 text-slate-700" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">פרטי ספקים</h3>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex items-center mb-1">
                <h4 className="text-[9px] font-semibold text-slate-700">
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
                <div className="flex items-center mb-1">
                  <h4 className="text-[9px] font-semibold text-slate-700">
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
        <div className="bg-slate-50/50 rounded-lg p-2 space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-5 h-5 bg-slate-200 rounded-md flex items-center justify-center">
              <Languages className="w-3 h-3 text-slate-700" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">העדפות תקשורת</h3>
          </div>

          <div className="max-w-md">
            <div className="flex items-center mb-0.5">
              <Label htmlFor="preferred_language" className="text-[9px] font-semibold text-slate-700">
                שפה מועדפת <span className="text-red-500">*</span>
              </Label>
              <InfoTooltip content="בחר את השפה בה תעדיף לקבל הודעות ולנהל תקשורת. זה יעזור לנו לספק שירות מותאם יותר." />
            </div>
            <Select
              value={formData.preferred_language || ''}
              onValueChange={(value) => handleFieldChange('preferred_language', value)}
            >
              <SelectTrigger className="h-6 text-[10px]">
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