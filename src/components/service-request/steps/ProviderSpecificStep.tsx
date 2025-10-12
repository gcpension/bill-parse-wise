import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { cn } from '@/lib/utils';
import { FileText, Shield, Info, MessageSquare } from 'lucide-react';
import { FieldInfoTooltip, fieldInfo } from '@/components/ui/field-info-tooltip';

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
      <div className="text-center mb-10 animate-fade-in">
        <h2 className="text-3xl font-bold bg-gradient-to-l from-foreground to-foreground/80 bg-clip-text text-transparent mb-3">
          פרטי ספקים
        </h2>
        <p className="text-muted-foreground text-lg">פרטים ספציפיים הנדרשים לביצוע הבקשה</p>
        <div className="w-20 h-1.5 bg-gradient-to-l from-primary to-primary/70 rounded-full mx-auto mt-4 shadow-lg shadow-primary/30" />
      </div>
      
      {/* Current Provider Details */}
      {currentConfig && (
        <Card className="group border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-primary/5 hover:shadow-2xl hover:border-primary/40 transition-all duration-500 animate-fade-in overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl bg-gradient-to-l from-foreground to-foreground/80 bg-clip-text text-transparent">
                  פרטי הספק הנוכחי
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  פרטים נדרשים לביטול השירות הקיים אצל {currentProvider}
                </p>
              </div>
              <Badge className="bg-gradient-to-l from-primary to-primary/80 text-primary-foreground px-4 py-2 text-sm shadow-lg shadow-primary/30">
                {currentProvider}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentConfig.fields.map((field, idx) => (
                <div 
                  key={`current_${field}`} 
                  className="space-y-3 animate-fade-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      {currentConfig.labels[field as keyof typeof currentConfig.labels]}
                      {field !== 'puk_code' && field !== 'last_reading' && (
                        <span className="text-destructive">*</span>
                      )}
                    </Label>
                    <FieldInfoTooltip content={`מידע ספציפי הנדרש לטיפול בבקשה. אנא הקפד על דיוק.`} />
                  </div>
                  <Input
                    value={formData[`current_${field}` as keyof ServiceRequestFormData] as string || ''}
                    onChange={(e) => updateFormData({ [`current_${field}`]: e.target.value })}
                    placeholder={`הזן ${currentConfig.labels[field as keyof typeof currentConfig.labels]}`}
                    className="h-12 border-2 hover:border-primary/50 focus:border-primary transition-all duration-300"
                    required={field !== 'puk_code' && field !== 'last_reading'}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}


      {/* Generic Provider Information for unknown providers */}
      {!currentConfig && currentProvider && (
        <Card className="group border-2 border-muted-foreground/20 bg-gradient-to-br from-muted/50 via-card to-muted/50 hover:shadow-xl hover:border-muted-foreground/40 transition-all duration-500 animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-muted-foreground to-muted-foreground/80 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Info className="w-6 h-6 text-background" />
              </div>
              <div>
                <CardTitle className="text-2xl">פרטי ספק כלליים</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  פרטים בסיסיים עבור {currentProvider}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  מספר לקוח/מנוי
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={formData.customer_number || ''}
                  onChange={(e) => updateFormData({ customer_number: e.target.value })}
                  placeholder="מספר זהות לקוח"
                  className="h-12 border-2 hover:border-primary/50 focus:border-primary transition-all duration-300"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label className="font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                  מספר חוזה/חשבון
                </Label>
                <Input
                  value={formData.account_number || ''}
                  onChange={(e) => updateFormData({ account_number: e.target.value })}
                  placeholder="מספר חוזה או חשבון"
                  className="h-12 border-2 hover:border-primary/50 focus:border-primary transition-all duration-300"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Notes */}
      <Card className="group border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-primary/10 hover:shadow-2xl hover:border-primary/40 transition-all duration-500 animate-fade-in overflow-hidden relative">
        <div className="absolute top-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-l from-foreground to-foreground/80 bg-clip-text text-transparent">
                הערות נוספות
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">מידע נוסף שיכול לסייע בטיפול</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="relative">
            <textarea
              value={formData.additional_notes || ''}
              onChange={(e) => updateFormData({ additional_notes: e.target.value })}
              placeholder="פרטים נוספים, הערות מיוחדות או בקשות ספציפיות..."
              className="w-full min-h-[140px] p-5 border-2 border-border hover:border-primary/50 focus:border-primary rounded-2xl text-sm resize-none transition-all duration-300 bg-card/50 backdrop-blur-sm"
              rows={6}
            />
            <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
              {formData.additional_notes?.length || 0} תווים
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}