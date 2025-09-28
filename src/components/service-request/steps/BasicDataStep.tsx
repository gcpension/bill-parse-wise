import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          פרטים אישיים
        </h1>
        <p className="text-gray-600">
          מלא את הפרטים הבסיסיים הנדרשים לטיפול בבקשה
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="full_name" className="text-sm font-medium text-gray-700 mb-1 block">
              שם מלא <span className="text-red-500">*</span>
            </Label>
            <Input
              id="full_name"
              value={formData.full_name || ''}
              onChange={(e) => handleFieldChange('full_name', e.target.value)}
              placeholder="הזן שם מלא כפי שמופיע בתעודת הזהות"
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="national_id_or_corp" className="text-sm font-medium text-gray-700 mb-1 block">
              ת.ז / ח.פ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="national_id_or_corp"
              value={formData.national_id_or_corp || ''}
              onChange={(e) => handleFieldChange('national_id_or_corp', e.target.value)}
              placeholder={formData.customer_type === 'business' ? "מספר ח.פ" : "מספר תעודת זהות"}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
              דוא״ל <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder="example@domain.com"
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1 block">
              טלפון נייד <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              value={formData.phone || ''}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              placeholder="050-1234567"
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">כתובת השירות</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="street" className="text-sm font-medium text-gray-700 mb-1 block">
                רחוב <span className="text-red-500">*</span>
              </Label>
              <Input
                id="street"
                value={formData.service_address?.street || ''}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="שם הרחוב"
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="number" className="text-sm font-medium text-gray-700 mb-1 block">
                מספר <span className="text-red-500">*</span>
              </Label>
              <Input
                id="number"
                value={formData.service_address?.number || ''}
                onChange={(e) => handleAddressChange('number', e.target.value)}
                placeholder="מספר בית"
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="city" className="text-sm font-medium text-gray-700 mb-1 block">
                עיר <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                value={formData.service_address?.city || ''}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder="שם העיר"
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">פרטי ספקים</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_provider" className="text-sm font-medium text-gray-700 mb-1 block">
                הספק הנוכחי <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.current_provider || ''}
                onValueChange={(value) => handleFieldChange('current_provider', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="בחר ספק נוכחי" />
                </SelectTrigger>
                <SelectContent>
                  {providerOptions.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {needsTargetProvider && (
              <div>
                <Label htmlFor="target_provider" className="text-sm font-medium text-gray-700 mb-1 block">
                  ספק היעד <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.target_provider || ''}
                  onValueChange={(value) => handleFieldChange('target_provider', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="בחר ספק יעד" />
                  </SelectTrigger>
                  <SelectContent>
                    {providerOptions.filter(p => p !== formData.current_provider).map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">העדפות נוספות</h3>
          <div>
            <Label htmlFor="preferred_language" className="text-sm font-medium text-gray-700 mb-1 block">
              שפה מועדפת <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.preferred_language || ''}
              onValueChange={(value) => handleFieldChange('preferred_language', value)}
            >
              <SelectTrigger className="w-full">
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