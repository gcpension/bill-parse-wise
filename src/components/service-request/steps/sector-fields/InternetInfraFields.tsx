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
    <div className="space-y-8">
      {/* Infrastructure Provider */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Router className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">ספק תשתית</h3>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              ספק התשתית <span className="text-red-500">*</span>
            </Label>
            <Select
              value={internetInfraData.infra_provider}
              onValueChange={(value) => 
                updateInfraData({ infra_provider: value as 'bezeq' | 'hot' })
              }
            >
              <SelectTrigger className="h-11 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bezeq">בזק</SelectItem>
                <SelectItem value="hot">HOT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              מספר חוזה <span className="text-red-500">*</span>
            </Label>
            <Input
              value={internetInfraData.contract_no}
              onChange={(e) => updateInfraData({ contract_no: e.target.value })}
              placeholder="הזן מספר חוזה"
              className="h-11 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </div>

      {/* Equipment Information */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50">
          <h3 className="text-xl font-medium text-gray-900">פרטי ציוד</h3>
        </div>
        
        <div className="p-6">
          {internetInfraData.infra_provider === 'bezeq' ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">מספר סידורי ONT או מודם</Label>
              <Input
                value={internetInfraData.ont_or_modem_serial || ''}
                onChange={(e) => updateInfraData({ ont_or_modem_serial: e.target.value })}
                placeholder="הזן מספר סידורי"
                className="h-11 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">כתובת MAC של מודם כבלים</Label>
              <Input
                value={internetInfraData.cm_mac || ''}
                onChange={(e) => updateInfraData({ cm_mac: e.target.value })}
                placeholder="XX:XX:XX:XX:XX:XX"
                className="h-11 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>
          )}
        </div>
      </div>

      {/* Technical Visit */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">ביקור טכנאי</h3>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox
              id="tech_visit_required"
              checked={internetInfraData.tech_visit.required}
              onCheckedChange={(checked) => 
                updateInfraData({
                  tech_visit: { ...internetInfraData.tech_visit, required: checked as boolean }
                })
              }
            />
            <Label htmlFor="tech_visit_required" className="text-sm text-gray-700">
              נדרש ביקור טכנאי לניתוק
            </Label>
          </div>

          {internetInfraData.tech_visit.required && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">זמן מועדף לביקור</Label>
              <Input
                value={internetInfraData.tech_visit.slot || ''}
                onChange={(e) => 
                  updateInfraData({
                    tech_visit: { ...internetInfraData.tech_visit, slot: e.target.value }
                  })
                }
                placeholder="לדוגמה: ראשון-חמישי 08:00-16:00"
                className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20"
              />
            </div>
          )}
        </div>
      </div>

      {/* Equipment Return */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50">
          <h3 className="text-xl font-medium text-gray-900">החזרת ציוד</h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">ציוד להחזרה:</Label>
            {equipmentItems.map((item) => (
              <div key={item} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
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
                <Label htmlFor={`equipment_${item}`} className="text-sm text-gray-700">
                  {item}
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">שיטת החזרה</Label>
            <Select
              value={internetInfraData.equipment_return.method}
              onValueChange={(value) => 
                updateInfraData({
                  equipment_return: { ...internetInfraData.equipment_return, method: value as 'courier' | 'dropoff' }
                })
              }
            >
              <SelectTrigger className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="courier">איסוף בשליח</SelectItem>
                <SelectItem value="dropoff">הגשה בנקודת שירות</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {internetInfraData.equipment_return.method === 'courier' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">זמן מועדף לאיסוף</Label>
              <Input
                value={internetInfraData.equipment_return.slot || ''}
                onChange={(e) => 
                  updateInfraData({
                    equipment_return: { ...internetInfraData.equipment_return, slot: e.target.value }
                  })
                }
                placeholder="לדוגמה: ראשון-חמישי 14:00-18:00"
                className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}