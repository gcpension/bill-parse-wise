import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { Info, Mail, Phone, MapPin, Building, AlertCircle, CheckCircle } from 'lucide-react';
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
  const handleFieldChange = (field: keyof ServiceRequestFormData, value: any) => {
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
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^0\d{1,2}-?\d{7}$/.test(phone.replace(/\s/g, ''));

  // Progress indicators for completion
  const personalDetailsComplete = !!(formData.full_name && formData.national_id_or_corp && 
                                    formData.email && formData.phone);
  const addressComplete = !!(formData.service_address?.street && formData.service_address?.number && 
                            formData.service_address?.city);
  const providersComplete = !!(formData.current_provider && 
                              (!needsTargetProvider || formData.target_provider));

  return (
    <div className="space-y-8">
      {/* Step Overview */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 font-assistant">
          <strong>שלב 2:</strong> מלאו את הפרטים הבסיסיים הנדרשים לטיפול בבקשה. 
          כל השדות המסומנים ב-<span className="text-red-500">*</span> הם חובה.
        </AlertDescription>
      </Alert>

      {/* Personal Details */}
      <Card className="animate-fade-in border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-heebo">פרטים אישיים</CardTitle>
            </div>
            {personalDetailsComplete && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="w-4 h-4 ml-1" />
                הושלם
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-assistant mt-2">
            פרטים אלו ישמשו לזיהוי ויצירת קשר עמכם במהלך תהליך הטיפול בבקשה
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="font-assistant font-semibold">
                שם מלא <span className="text-red-500">*</span>
              </Label>
              <Input
                id="full_name"
                value={formData.full_name || ''}
                onChange={(e) => handleFieldChange('full_name', e.target.value)}
                placeholder="הזן שם מלא כפי שמופיע בתעודת הזהות"
                className={cn(
                  "font-assistant",
                  formData.full_name ? "border-green-300 bg-green-50" : ""
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="national_id_or_corp" className="font-assistant font-semibold">
                ת.ז / ח.פ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="national_id_or_corp"
                value={formData.national_id_or_corp || ''}
                onChange={(e) => handleFieldChange('national_id_or_corp', e.target.value)}
                placeholder={formData.customer_type === 'business' ? "מספר ח.פ" : "מספר תעודת זהות"}
                className={cn(
                  "font-assistant",
                  formData.national_id_or_corp ? "border-green-300 bg-green-50" : ""
                )}
              />
              <p className="text-xs text-muted-foreground">
                {formData.customer_type === 'business' ? 
                  'הזן מספר חברה פרטית או עמותה רשומה' : 
                  'הזן 9 ספרות של תעודת הזהות'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-assistant font-semibold">
                דוא״ל <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="example@domain.com"
                className={cn(
                  "font-assistant",
                  formData.email && isValidEmail(formData.email) ? "border-green-300 bg-green-50" : 
                  formData.email && !isValidEmail(formData.email) ? "border-red-300 bg-red-50" : ""
                )}
              />
              {formData.email && !isValidEmail(formData.email) && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  כתובת דוא״ל לא תקינה
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                נשלח אליכם עדכונים על סטטוס הבקשה
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="font-assistant font-semibold">
                טלפון נייד <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="050-1234567"
                className={cn(
                  "font-assistant",
                  formData.phone && isValidPhone(formData.phone) ? "border-green-300 bg-green-50" : 
                  formData.phone && !isValidPhone(formData.phone) ? "border-red-300 bg-red-50" : ""
                )}
              />
              {formData.phone && !isValidPhone(formData.phone) && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  מספר טלפון לא תקין
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                נשלח SMS עם קוד אימוח לחתימה דיגיטלית
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Address */}
      <Card className="animate-fade-in border-l-4 border-l-green-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <CardTitle className="text-xl font-heebo">כתובת השירות</CardTitle>
            </div>
            {addressComplete && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="w-4 h-4 ml-1" />
                הושלם
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-assistant mt-2">
            כתובת המקום בו ניתן השירות הנוכחי (חשמל/אינטרנט/טלוויזיה)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="street" className="font-assistant font-semibold">
                רחוב <span className="text-red-500">*</span>
              </Label>
              <Input
                id="street"
                value={formData.service_address?.street || ''}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="שם הרחוב"
                className={cn(
                  "font-assistant",
                  formData.service_address?.street ? "border-green-300 bg-green-50" : ""
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number" className="font-assistant font-semibold">
                מספר <span className="text-red-500">*</span>
              </Label>
              <Input
                id="number"
                value={formData.service_address?.number || ''}
                onChange={(e) => handleAddressChange('number', e.target.value)}
                placeholder="מספר בית"
                className={cn(
                  "font-assistant",
                  formData.service_address?.number ? "border-green-300 bg-green-50" : ""
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="font-assistant font-semibold">
                עיר <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                value={formData.service_address?.city || ''}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder="שם העיר"
                className={cn(
                  "font-assistant",
                  formData.service_address?.city ? "border-green-300 bg-green-50" : ""
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip" className="font-assistant font-semibold">
              מיקוד (אופציונלי)
            </Label>
            <Input
              id="zip"
              value={formData.service_address?.zip || ''}
              onChange={(e) => handleAddressChange('zip', e.target.value)}
              placeholder="1234567"
              className="font-assistant w-full md:w-1/3"
            />
            <p className="text-xs text-muted-foreground">
              מיקוד יכול לעזור לזיהוי מדויק יותר של הכתובת
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Provider Information */}
      <Card className="animate-fade-in border-l-4 border-l-purple-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-heebo">פרטי ספקים</CardTitle>
            </div>
            {providersComplete && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="w-4 h-4 ml-1" />
                הושלם
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-assistant mt-2">
            פרטי הספק הנוכחי {needsTargetProvider && 'והספק אליו ברצונכם לעבור'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current_provider" className="font-assistant font-semibold">
                הספק הנוכחי <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.current_provider || ''}
                onValueChange={(value) => handleFieldChange('current_provider', value)}
              >
                <SelectTrigger className={cn(
                  "font-assistant",
                  formData.current_provider ? "border-green-300 bg-green-50" : ""
                )}>
                  <SelectValue placeholder="בחר ספק נוכחי" />
                </SelectTrigger>
                <SelectContent>
                  {providerOptions.map((provider) => (
                    <SelectItem key={provider} value={provider} className="font-assistant">
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                הספק שמספק לכם את השירות כעת
              </p>
            </div>

            {needsTargetProvider && (
              <div className="space-y-2">
                <Label htmlFor="target_provider" className="font-assistant font-semibold">
                  ספק היעד <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.target_provider || ''}
                  onValueChange={(value) => handleFieldChange('target_provider', value)}
                >
                  <SelectTrigger className={cn(
                    "font-assistant",
                    formData.target_provider ? "border-green-300 bg-green-50" : ""
                  )}>
                    <SelectValue placeholder="בחר ספק יעד" />
                  </SelectTrigger>
                  <SelectContent>
                    {providerOptions.filter(p => p !== formData.current_provider).map((provider) => (
                      <SelectItem key={provider} value={provider} className="font-assistant">
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  הספק החדש אליו ברצונכם לעבור
                </p>
                
                {formData.selected_plan_name && formData.target_provider && (
                  <Alert className="border-blue-200 bg-blue-50 mt-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 font-assistant text-sm">
                      מסלול נבחר: <strong>{formData.selected_plan_name}</strong>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Preferences */}
      <Card className="animate-fade-in border-l-4 border-l-orange-500">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Phone className="w-5 h-5 text-orange-600" />
            </div>
            <CardTitle className="text-xl font-heebo">העדפות יצירת קשר</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground font-assistant mt-2">
            פרטים שיעזרו לנו ליצור עמכם קשר בצורה הנוחה ביותר
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferred_contact_window" className="font-assistant font-semibold">
                זמן מועדף ליצירת קשר (אופציונלי)
              </Label>
              <Input
                id="preferred_contact_window"
                value={formData.preferred_contact_window || ''}
                onChange={(e) => handleFieldChange('preferred_contact_window', e.target.value)}
                placeholder="לדוגמה: ראשון-חמישי 09:00-17:00"
                className="font-assistant"
              />
              <p className="text-xs text-muted-foreground">
                אם אין העדפה, נחזור אליכם בשעות העבודה הרגילות
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred_language" className="font-assistant font-semibold">
                שפה מועדפת <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.preferred_language || 'he'}
                onValueChange={(value) => handleFieldChange('preferred_language', value)}
              >
                <SelectTrigger className="font-assistant">
                  <SelectValue placeholder="בחר שפה" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((language) => (
                    <SelectItem key={language.value} value={language.value} className="font-assistant">
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                השפה בה תרצו לקבל התכתבות ושיחות
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optional Information */}
      <Card className="animate-fade-in border border-dashed border-gray-300">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Info className="w-5 h-5 text-gray-600" />
            </div>
            <CardTitle className="text-xl font-heebo text-gray-700">מידע נוסף (אופציונלי)</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground font-assistant mt-2">
            מידע זה יכול לזרז את תהליך הטיפול בבקשה אך אינו חובה
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account_or_contract_no" className="font-assistant font-semibold">
                מספר חוזה/חשבון
              </Label>
              <Input
                id="account_or_contract_no"
                value={formData.account_or_contract_no || ''}
                onChange={(e) => handleFieldChange('account_or_contract_no', e.target.value)}
                placeholder="מספר חוזה או חשבון אצל הספק הנוכחי"
                className="font-assistant"
              />
              <p className="text-xs text-muted-foreground">
                מזרז את זיהוי החשבון אצל הספק הנוכחי
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_last4_optional" className="font-assistant font-semibold">
                4 ספרות אחרונות של אמצעי תשלום
              </Label>
              <Input
                id="payment_last4_optional"
                value={formData.payment_last4_optional || ''}
                onChange={(e) => handleFieldChange('payment_last4_optional', e.target.value)}
                placeholder="1234"
                maxLength={4}
                className="font-assistant"
              />
              <p className="text-xs text-muted-foreground">
                עוזר לזיהוי בשיחות טלפון עם הספק
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-assistant font-semibold">חשבון אחרון (PDF/JPG/PNG, עד 10MB)</Label>
              <FileUpload
                accept=".pdf,.jpg,.jpeg,.png"
                onFileUpload={(file) => handleFieldChange('last_bill_file', file)}
                maxSize={10 * 1024 * 1024}
                helperText="העלה צילום של החשבון האחרון - עוזר לזיהוי פרטי החשבון"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-assistant font-semibold">מסמך מזהה (PDF/JPG/PNG, עד 10MB)</Label>
              <FileUpload
                accept=".pdf,.jpg,.jpeg,.png"
                onFileUpload={(file) => handleFieldChange('id_doc_file', file)}
                maxSize={10 * 1024 * 1024}
                helperText="העלה צילום תעודת זהות או מסמך מזהה - נדרש לזיהוי במקרים מסוימים"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}