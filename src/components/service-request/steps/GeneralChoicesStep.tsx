import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileUpload } from '@/components/ui/file-upload';
import { ServiceRequestFormData, ActionType, Sector, CustomerType } from '@/types/serviceRequest';

interface GeneralChoicesStepProps {
  formData: Partial<ServiceRequestFormData>;
  updateFormData: (data: Partial<ServiceRequestFormData>) => void;
}

const actionTypeOptions = [
  { value: 'disconnect', label: 'ניתוק שירות' },
  { value: 'switch', label: 'מעבר ספק' },
  { value: 'move', label: 'העברת דירה' },
  { value: 'early_terminate', label: 'סיום עסקה מוקדם' },
];

const sectorOptions = [
  { value: 'cellular', label: 'סלולר' },
  { value: 'internet_isp', label: 'אינטרנט (ספק)' },
  { value: 'internet_infra', label: 'אינטרנט (תשתית)' },
  { value: 'tv', label: 'טלוויזיה' },
  { value: 'electricity', label: 'חשמל' },
];

const customerTypeOptions = [
  { value: 'private', label: 'לקוח פרטי' },
  { value: 'business', label: 'לקוח עסקי' },
];

export default function GeneralChoicesStep({ formData, updateFormData }: GeneralChoicesStepProps) {
  const handleFieldChange = (field: keyof ServiceRequestFormData, value: any) => {
    updateFormData({ [field]: value });
  };

  const isBusinessCustomer = formData.customer_type === 'business';

  return (
    <div className="space-y-6">
      {/* Action Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo">סוג הבקשה</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.action_type || ''}
            onValueChange={(value) => handleFieldChange('action_type', value as ActionType)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {actionTypeOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="font-assistant">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Sector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo">תחום השירות</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.sector || ''}
            onValueChange={(value) => handleFieldChange('sector', value as Sector)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {sectorOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="font-assistant">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Customer Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo">סוג לקוח</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.customer_type || ''}
            onValueChange={(value) => handleFieldChange('customer_type', value as CustomerType)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {customerTypeOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="font-assistant">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Business Customer Fields */}
      {isBusinessCustomer && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heebo">פרטי חברה</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="corp_registration_number" className="font-assistant">
                  מספר רישום חברה <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="corp_registration_number"
                  value={formData.corp_registration_number || ''}
                  onChange={(e) => handleFieldChange('corp_registration_number', e.target.value)}
                  placeholder="הזן מספר רישום חברה"
                  className="font-assistant"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_name" className="font-assistant">
                  שם החברה <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company_name"
                  value={formData.company_name || ''}
                  onChange={(e) => handleFieldChange('company_name', e.target.value)}
                  placeholder="הזן שם החברה"
                  className="font-assistant"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signer_name" className="font-assistant">
                  שם החותם <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="signer_name"
                  value={formData.signer_name || ''}
                  onChange={(e) => handleFieldChange('signer_name', e.target.value)}
                  placeholder="הזן שם החותם"
                  className="font-assistant"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signer_title" className="font-assistant">
                  תפקיד החותם <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="signer_title"
                  value={formData.signer_title || ''}
                  onChange={(e) => handleFieldChange('signer_title', e.target.value)}
                  placeholder="הזן תפקיד החותם"
                  className="font-assistant"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-assistant">
                ייפוי כוח (PDF) <span className="text-red-500">*</span>
              </Label>
              <FileUpload
                accept=".pdf"
                onFileUpload={(file) => handleFieldChange('power_of_attorney_file', file)}
                maxSize={10 * 1024 * 1024} // 10MB
                helperText="העלה קובץ PDF של ייפוי הכוח (עד 10MB)"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}