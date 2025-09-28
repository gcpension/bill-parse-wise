import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { cn } from '@/lib/utils';
import { FileText, Shield, Info, MessageSquare } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">פרטי ספקים</h2>
        <p className="text-gray-600">פרטים ספציפיים הנדרשים לביצוע הבקשה</p>
      </div>
      
      {/* Current Provider Details */}
      {currentConfig && (
        <Card className="border-2 border-blue-200 bg-blue-50/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-blue-900">פרטי הספק הנוכחי</CardTitle>
                <p className="text-sm text-blue-700 mt-1">
                  פרטים נדרשים לביטול השירות הקיים אצל {currentProvider}
                </p>
              </div>
              <Badge className="bg-blue-600 mr-auto">{currentProvider}</Badge>
            </div>
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
        <Card className="border-2 border-green-200 bg-green-50/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-green-900">פרטי הספק החדש</CardTitle>
                <p className="text-sm text-green-700 mt-1">
                  פרטים נדרשים לפתיחת שירות חדש אצל {targetProvider}
                </p>
              </div>
              <Badge className="bg-green-600 mr-auto">{targetProvider}</Badge>
            </div>
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
        <Card className="border-2 border-gray-200 bg-gray-50/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Info className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900">פרטי ספק כלליים</CardTitle>
                <p className="text-sm text-gray-700 mt-1">
                  פרטים בסיסיים עבור {currentProvider}
                </p>
              </div>
            </div>
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
      <Card className="border-2 border-purple-200 bg-purple-50/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-purple-900">הערות נוספות</CardTitle>
              <p className="text-sm text-purple-700 mt-1">מידע נוסף שיכול לסייע בטיפול</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <textarea
            value={formData.additional_notes || ''}
            onChange={(e) => updateFormData({ additional_notes: e.target.value })}
            placeholder="פרטים נוספים, הערות מיוחדות או בקשות ספציפיות..."
            className="w-full min-h-[120px] p-4 border-2 border-gray-200 rounded-xl font-assistant text-sm resize-none focus:border-purple-300 focus:ring-0 transition-colors"
            rows={5}
          />
        </CardContent>
      </Card>
    </div>
  );
}