import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { Plus, Trash2, Globe, Package } from 'lucide-react';

interface InternetISPFieldsProps {
  formData: Partial<ServiceRequestFormData>;
  updateFormData: (data: Partial<ServiceRequestFormData>) => void;
}

export default function InternetISPFields({ formData, updateFormData }: InternetISPFieldsProps) {
  const internetISPData = formData.internet_isp_data || {
    isp_account_no: '',
    bundle: { is_bundle: false, components: [] },
    equipment_return: { items: [], method: 'courier' as const }
  };

  const updateISPData = (newData: Partial<typeof internetISPData>) => {
    updateFormData({
      internet_isp_data: { ...internetISPData, ...newData }
    });
  };

  const toggleBundleComponent = (component: string, checked: boolean) => {
    const updatedComponents = checked
      ? [...internetISPData.bundle.components, component]
      : internetISPData.bundle.components.filter(c => c !== component);
    
    updateISPData({
      bundle: { ...internetISPData.bundle, components: updatedComponents }
    });
  };

  const equipmentItems = [
    'נתב (Router)',
    'מודם',
    'ממיר טלוויזיה',
    'שלט רחוק',
    'כבלים',
    'מתאם חשמל',
    'אחר'
  ];

  const bundleComponents = [
    'טלפון',
    'טלוויזיה',
    'סלולר',
    'שירותי תוכן'
  ];

  return (
    <div className="space-y-6">
      {/* ISP Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo flex items-center gap-2">
            <Globe className="w-5 h-5" />
            פרטי חשבון ספק האינטרנט
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-assistant">
              מספר חשבון ספק האינטרנט <span className="text-red-500">*</span>
            </Label>
            <Input
              value={internetISPData.isp_account_no}
              onChange={(e) => updateISPData({ isp_account_no: e.target.value })}
              placeholder="הזן מספר חשבון"
              className="font-assistant"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-assistant">שם משתמש PPPoE (אם קיים)</Label>
              <Input
                value={internetISPData.pppoe_user || ''}
                onChange={(e) => updateISPData({ pppoe_user: e.target.value })}
                placeholder="username@isp.co.il"
                className="font-assistant"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-assistant">מספר סידורי ONT (אם ידוע)</Label>
              <Input
                value={internetISPData.ont_serial || ''}
                onChange={(e) => updateISPData({ ont_serial: e.target.value })}
                placeholder="הזן מספר סידורי"
                className="font-assistant"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Installation Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo">כתובת התקנה</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="install_address_different"
              checked={internetISPData.install_address_different || false}
              onCheckedChange={(checked) => 
                updateISPData({ install_address_different: checked as boolean })
              }
            />
            <Label htmlFor="install_address_different" className="font-assistant">
              כתובת התקנה שונה מכתובת השירות
            </Label>
          </div>

          {internetISPData.install_address_different && (
            <div className="space-y-2">
              <Label className="font-assistant">כתובת התקנה</Label>
              <Input
                value={internetISPData.install_address || ''}
                onChange={(e) => updateISPData({ install_address: e.target.value })}
                placeholder="הזן כתובת התקנה המלאה"
                className="font-assistant"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bundle Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo flex items-center gap-2">
            <Package className="w-5 h-5" />
            חבילת שירותים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="is_bundle"
              checked={internetISPData.bundle.is_bundle}
              onCheckedChange={(checked) => 
                updateISPData({
                  bundle: { ...internetISPData.bundle, is_bundle: checked as boolean }
                })
              }
            />
            <Label htmlFor="is_bundle" className="font-assistant">
              השירות הוא חלק מחבילה
            </Label>
          </div>

          {internetISPData.bundle.is_bundle && (
            <div className="space-y-3">
              <Label className="font-assistant">רכיבי החבילה:</Label>
              {bundleComponents.map((component) => (
                <div key={component} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={`bundle_${component}`}
                    checked={internetISPData.bundle.components.includes(component)}
                    onCheckedChange={(checked) => toggleBundleComponent(component, checked as boolean)}
                  />
                  <Label htmlFor={`bundle_${component}`} className="font-assistant">
                    {component}
                  </Label>
                </div>
              ))}
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
                  checked={internetISPData.equipment_return.items.includes(item)}
                  onCheckedChange={(checked) => {
                    const updatedItems = checked
                      ? [...internetISPData.equipment_return.items, item]
                      : internetISPData.equipment_return.items.filter(i => i !== item);
                    
                    updateISPData({
                      equipment_return: { ...internetISPData.equipment_return, items: updatedItems }
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
              value={internetISPData.equipment_return.method}
              onValueChange={(value) => 
                updateISPData({
                  equipment_return: { ...internetISPData.equipment_return, method: value as 'courier' | 'dropoff' }
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

          {internetISPData.equipment_return.method === 'courier' && (
            <div className="space-y-2">
              <Label className="font-assistant">זמן מועדף לאיסוף</Label>
              <Input
                value={internetISPData.equipment_return.slot || ''}
                onChange={(e) => 
                  updateISPData({
                    equipment_return: { ...internetISPData.equipment_return, slot: e.target.value }
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