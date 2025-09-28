import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { ServiceRequestFormData } from '@/types/serviceRequest';

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

  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo">פרטים אישיים</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="font-assistant">
                שם מלא <span className="text-red-500">*</span>
              </Label>
              <Input
                id="full_name"
                value={formData.full_name || ''}
                onChange={(e) => handleFieldChange('full_name', e.target.value)}
                placeholder="הזן שם מלא"
                className="font-assistant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="national_id_or_corp" className="font-assistant">
                ת.ז / ח.פ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="national_id_or_corp"
                value={formData.national_id_or_corp || ''}
                onChange={(e) => handleFieldChange('national_id_or_corp', e.target.value)}
                placeholder="הזן מספר זהות או ח.פ"
                className="font-assistant"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-assistant">
                דוא״ל <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="הזן כתובת דוא״ל"
                className="font-assistant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="font-assistant">
                טלפון <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="050-1234567"
                className="font-assistant"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo">כתובת השירות</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="street" className="font-assistant">
                רחוב <span className="text-red-500">*</span>
              </Label>
              <Input
                id="street"
                value={formData.service_address?.street || ''}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="הזן שם רחוב"
                className="font-assistant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number" className="font-assistant">
                מספר <span className="text-red-500">*</span>
              </Label>
              <Input
                id="number"
                value={formData.service_address?.number || ''}
                onChange={(e) => handleAddressChange('number', e.target.value)}
                placeholder="מספר בית"
                className="font-assistant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="font-assistant">
                עיר <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                value={formData.service_address?.city || ''}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder="הזן שם עיר"
                className="font-assistant"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip" className="font-assistant">
              מיקוד
            </Label>
            <Input
              id="zip"
              value={formData.service_address?.zip || ''}
              onChange={(e) => handleAddressChange('zip', e.target.value)}
              placeholder="הזן מיקוד"
              className="font-assistant w-full md:w-1/3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Provider Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo">פרטי ספקים</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current_provider" className="font-assistant">
                הספק הנוכחי <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.current_provider || ''}
                onValueChange={(value) => handleFieldChange('current_provider', value)}
              >
                <SelectTrigger className="font-assistant">
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
            </div>

            {needsTargetProvider && (
              <div className="space-y-2">
                <Label htmlFor="target_provider" className="font-assistant">
                  ספק היעד <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.target_provider || ''}
                  onValueChange={(value) => handleFieldChange('target_provider', value)}
                >
                  <SelectTrigger className="font-assistant">
                    <SelectValue placeholder="בחר ספק יעד" />
                  </SelectTrigger>
                  <SelectContent>
                    {providerOptions.map((provider) => (
                      <SelectItem key={provider} value={provider} className="font-assistant">
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo">העדפות יצירת קשר</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferred_contact_window" className="font-assistant">
                זמן מועדף ליצירת קשר
              </Label>
              <Input
                id="preferred_contact_window"
                value={formData.preferred_contact_window || ''}
                onChange={(e) => handleFieldChange('preferred_contact_window', e.target.value)}
                placeholder="לדוגמה: ראשון-חמישי 09:00-17:00"
                className="font-assistant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferred_language" className="font-assistant">
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo">מידע נוסף (אופציונלי)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="account_or_contract_no" className="font-assistant">
                מספר חוזה/חשבון
              </Label>
              <Input
                id="account_or_contract_no"
                value={formData.account_or_contract_no || ''}
                onChange={(e) => handleFieldChange('account_or_contract_no', e.target.value)}
                placeholder="הזן מספר חוזה או חשבון"
                className="font-assistant"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_last4_optional" className="font-assistant">
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
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-assistant">חשבון אחרון (PDF/JPG/PNG, עד 10MB)</Label>
              <FileUpload
                accept=".pdf,.jpg,.jpeg,.png"
                onFileUpload={(file) => handleFieldChange('last_bill_file', file)}
                maxSize={10 * 1024 * 1024}
                helperText="העלה צילום של החשבון האחרון"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-assistant">מסמך מזהה (PDF/JPG/PNG, עד 10MB)</Label>
              <FileUpload
                accept=".pdf,.jpg,.jpeg,.png"
                onFileUpload={(file) => handleFieldChange('id_doc_file', file)}
                maxSize={10 * 1024 * 1024}
                helperText="העלה צילום תעודת זהות או מסמך מזהה"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}