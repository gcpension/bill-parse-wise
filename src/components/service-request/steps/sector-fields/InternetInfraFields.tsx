import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { Router, Settings } from 'lucide-react';

interface InternetInfraFieldsProps {
  formData: Partial<ServiceRequestFormData>;
  updateFormData: (data: Partial<ServiceRequestFormData>) => void;
}

export default function InternetInfraFields({ formData, updateFormData }: InternetInfraFieldsProps) {
  const internetInfraData = formData.internet_infra_data || {
    infra_provider: 'bezeq' as const,
    contract_no: '',
    tech_visit: { required: false },
    equipment_return: { items: [], method: 'courier' as const }
  };

  const updateInfraData = (newData: Partial<typeof internetInfraData>) => {
    updateFormData({
      internet_infra_data: { ...internetInfraData, ...newData }
    });
  };

  const equipmentItems = [
    'מודם ONT',
    'נתב',
    'מתאם חשמל',
    'כבל רשת',
    'ספליטר',
    'פילטר',
    'אחר'
  ];

  return (
    <div className="space-y-6">
      {/* Infrastructure Provider */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo flex items-center gap-2">
            <Router className="w-5 h-5" />
            ספק תשתית
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-assistant">
              ספק התשתית <span className="text-red-500">*</span>
            </Label>
            <Select
              value={internetInfraData.infra_provider}
              onValueChange={(value) => 
                updateInfraData({ infra_provider: value as 'bezeq' | 'hot' })
              }
            >
              <SelectTrigger className="font-assistant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bezeq" className="font-assistant">בזק</SelectItem>
                <SelectItem value="hot" className="font-assistant">HOT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-assistant">
              מספר חוזה <span className="text-red-500">*</span>
            </Label>
            <Input
              value={internetInfraData.contract_no}
              onChange={(e) => updateInfraData({ contract_no: e.target.value })}
              placeholder="הזן מספר חוזה"
              className="font-assistant"
            />
          </div>
        </CardContent>
      </Card>

      {/* Equipment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo">פרטי ציוד</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {internetInfraData.infra_provider === 'bezeq' ? (
            <div className="space-y-2">
              <Label className="font-assistant">מספר סידורי ONT או מודם</Label>
              <Input
                value={internetInfraData.ont_or_modem_serial || ''}
                onChange={(e) => updateInfraData({ ont_or_modem_serial: e.target.value })}
                placeholder="הזן מספר סידורי"
                className="font-assistant"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="font-assistant">כתובת MAC של מודם כבלים</Label>
              <Input
                value={internetInfraData.cm_mac || ''}
                onChange={(e) => updateInfraData({ cm_mac: e.target.value })}
                placeholder="XX:XX:XX:XX:XX:XX"
                className="font-assistant"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Technical Visit */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo flex items-center gap-2">
            <Settings className="w-5 h-5" />
            ביקור טכנאי
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="tech_visit_required"
              checked={internetInfraData.tech_visit.required}
              onCheckedChange={(checked) => 
                updateInfraData({
                  tech_visit: { ...internetInfraData.tech_visit, required: checked as boolean }
                })
              }
            />
            <Label htmlFor="tech_visit_required" className="font-assistant">
              נדרש ביקור טכנאי לניתוק
            </Label>
          </div>

          {internetInfraData.tech_visit.required && (
            <div className="space-y-2">
              <Label className="font-assistant">זמן מועדף לביקור</Label>
              <Input
                value={internetInfraData.tech_visit.slot || ''}
                onChange={(e) => 
                  updateInfraData({
                    tech_visit: { ...internetInfraData.tech_visit, slot: e.target.value }
                  })
                }
                placeholder="לדוגמה: ראשון-חמישי 08:00-16:00"
                className="font-assistant"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Equipment Return */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo">החזרת ציוד</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="font-assistant">ציוד להחזרה:</Label>
            {equipmentItems.map((item) => (
              <div key={item} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={`equipment_${item}`}
                  checked={internetInfraData.equipment_return.items.includes(item)}
                  onCheckedChange={(checked) => {
                    const updatedItems = checked
                      ? [...internetInfraData.equipment_return.items, item]
                      : internetInfraData.equipment_return.items.filter(i => i !== item);
                    
                    updateInfraData({
                      equipment_return: { ...internetInfraData.equipment_return, items: updatedItems }
                    });
                  }}
                />
                <Label htmlFor={`equipment_${item}`} className="font-assistant">
                  {item}
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label className="font-assistant">שיטת החזרה</Label>
            <Select
              value={internetInfraData.equipment_return.method}
              onValueChange={(value) => 
                updateInfraData({
                  equipment_return: { ...internetInfraData.equipment_return, method: value as 'courier' | 'dropoff' }
                })
              }
            >
              <SelectTrigger className="font-assistant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="courier" className="font-assistant">איסוף בשליח</SelectItem>
                <SelectItem value="dropoff" className="font-assistant">הגשה בנקודת שירות</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {internetInfraData.equipment_return.method === 'courier' && (
            <div className="space-y-2">
              <Label className="font-assistant">זמן מועדף לאיסוף</Label>
              <Input
                value={internetInfraData.equipment_return.slot || ''}
                onChange={(e) => 
                  updateInfraData({
                    equipment_return: { ...internetInfraData.equipment_return, slot: e.target.value }
                  })
                }
                placeholder="לדוגמה: ראשון-חמישי 14:00-18:00"
                className="font-assistant"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}