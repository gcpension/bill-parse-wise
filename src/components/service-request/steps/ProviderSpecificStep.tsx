import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { cn } from '@/lib/utils';

interface ProviderSpecificStepProps {
  formData: Partial<ServiceRequestFormData>;
  updateFormData: (data: Partial<ServiceRequestFormData>) => void;
}

// Provider-specific field configurations
const providerConfigs = {
  // Electricity providers
  'חברת החשמל': {
    fields: ['customer_number', 'meter_number', 'last_reading'],
    labels: {
      customer_number: 'מספר לקוח חברת החשמל',
      meter_number: 'מספר מונה',
      last_reading: 'קריאה אחרונה'
    }
  },
  'נקטיק אנרגיה': {
    fields: ['customer_number', 'contract_number'],
    labels: {
      customer_number: 'מספר לקוח נקטיק',
      contract_number: 'מספר חוזה'
    }
  },
  
  // Cellular providers  
  'פלאפון': {
    fields: ['subscriber_number', 'sim_number', 'puk_code'],
    labels: {
      subscriber_number: 'מספר מנוי פלאפון',
      sim_number: 'מספר SIM',
      puk_code: 'קוד PUK (אופציונלי)'
    }
  },
  'סלקום': {
    fields: ['subscriber_number', 'account_number'],
    labels: {
      subscriber_number: 'מספר מנוי סלקום',
      account_number: 'מספר חשבון'
    }
  },
  'פרטנר': {
    fields: ['subscriber_number', 'line_number'],
    labels: {
      subscriber_number: 'מספר מנוי פרטנר',
      line_number: 'מספר קו'
    }
  },
  
  // Internet providers
  'בזק': {
    fields: ['subscriber_number', 'phone_number', 'installation_address'],
    labels: {
      subscriber_number: 'מספר מנוי בזק',
      phone_number: 'מספר טלפון קווי',
      installation_address: 'כתובת התקנה'
    }
  },
  'HOT': {
    fields: ['subscriber_number', 'mac_address', 'modem_serial'],
    labels: {
      subscriber_number: 'מספר מנוי HOT',
      mac_address: 'כתובת MAC',
      modem_serial: 'מספר סדרה של המודם'
    }
  },
  
  // TV providers
  'יס': {
    fields: ['subscriber_number', 'decoder_number', 'smart_card'],
    labels: {
      subscriber_number: 'מספר מנוי יס',
      decoder_number: 'מספר דקודר',
      smart_card: 'מספר כרטיס חכם'
    }
  }
};

export default function ProviderSpecificStep({ formData, updateFormData }: ProviderSpecificStepProps) {
  const currentProvider = formData.current_provider;
  const targetProvider = formData.target_provider;
  const sector = formData.sector;
  
  // Get configuration for current provider
  const currentConfig = currentProvider && providerConfigs[currentProvider as keyof typeof providerConfigs];
  const targetConfig = targetProvider && providerConfigs[targetProvider as keyof typeof providerConfigs];

  const sectorColors = {
    'cellular': 'border-purple-200 bg-purple-50',
    'electricity': 'border-yellow-200 bg-yellow-50', 
    'internet_isp': 'border-blue-200 bg-blue-50',
    'internet_infra': 'border-cyan-200 bg-cyan-50',
    'tv': 'border-green-200 bg-green-50'
  };

  const sectorColor = sectorColors[sector as keyof typeof sectorColors] || 'border-gray-200 bg-gray-50';

  return (
    <div className="space-y-8">
      {/* Current Provider Details */}
      {currentConfig && (
        <Card className={cn("animate-fade-in", sectorColor)}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-heebo text-xl">פרטי הספק הנוכחי</CardTitle>
              <Badge variant="secondary">{currentProvider}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              פרטים נדרשים לביטול השירות הקיים
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentConfig.fields.map((field) => (
                <div key={`current_${field}`} className="space-y-2">
                  <Label className="font-assistant font-semibold">
                    {currentConfig.labels[field as keyof typeof currentConfig.labels]}
                    {field !== 'puk_code' && field !== 'last_reading' && ' *'}
                  </Label>
                  <Input
                    value={formData[`current_${field}` as keyof ServiceRequestFormData] as string || ''}
                    onChange={(e) => updateFormData({ [`current_${field}`]: e.target.value })}
                    placeholder={`הזן ${currentConfig.labels[field as keyof typeof currentConfig.labels]}`}
                    className="font-assistant"
                    required={field !== 'puk_code' && field !== 'last_reading'}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Target Provider Details */}
      {targetConfig && formData.action_type === 'switch' && (
        <Card className={cn("animate-fade-in border-green-200 bg-green-50")}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-heebo text-xl text-green-800">פרטי הספק החדש</CardTitle>
              <Badge className="bg-green-600">{targetProvider}</Badge>
            </div>
            <p className="text-sm text-green-600">
              פרטים נדרשים לפתיחת שירות חדש
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {targetConfig.fields.map((field) => (
                <div key={`target_${field}`} className="space-y-2">
                  <Label className="font-assistant font-semibold">
                    {targetConfig.labels[field as keyof typeof targetConfig.labels]}
                    {field !== 'puk_code' && field !== 'last_reading' && ' (אופציונלי)'}
                  </Label>
                  <Input
                    value={formData[`target_${field}` as keyof ServiceRequestFormData] as string || ''}
                    onChange={(e) => updateFormData({ [`target_${field}`]: e.target.value })}
                    placeholder={`הזן ${targetConfig.labels[field as keyof typeof targetConfig.labels]}`}
                    className="font-assistant"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generic Provider Information for unknown providers */}
      {!currentConfig && currentProvider && (
        <Card className={cn("animate-fade-in", sectorColor)}>
          <CardHeader>
            <CardTitle className="font-heebo text-xl">פרטי ספק כלליים</CardTitle>
            <p className="text-sm text-muted-foreground">
              פרטים בסיסיים עבור {currentProvider}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-assistant font-semibold">מספר לקוח/מנוי *</Label>
                <Input
                  value={formData.customer_number || ''}
                  onChange={(e) => updateFormData({ customer_number: e.target.value })}
                  placeholder="מספר זהות לקוח"
                  className="font-assistant"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="font-assistant font-semibold">מספר חוזה/חשבון</Label>
                <Input
                  value={formData.account_number || ''}
                  onChange={(e) => updateFormData({ account_number: e.target.value })}
                  placeholder="מספר חוזה או חשבון"
                  className="font-assistant"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Notes */}
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="font-heebo text-xl">הערות נוספות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="font-assistant font-semibold">הערות או בקשות מיוחדות</Label>
            <textarea
              value={formData.additional_notes || ''}
              onChange={(e) => updateFormData({ additional_notes: e.target.value })}
              placeholder="פרטים נוספים שיכולים לסייע בטיפול בבקשה..."
              className="w-full min-h-[100px] p-3 border border-input rounded-md font-assistant"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}