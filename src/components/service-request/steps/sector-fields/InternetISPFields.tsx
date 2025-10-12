import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { Plus, Trash2, Globe, Package, Info } from 'lucide-react';
import { FieldInfoTooltip, fieldInfo } from '@/components/ui/field-info-tooltip';

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
    <div className="space-y-8">
      {/* ISP Account Information */}
      <div className="bg-white rounded-xl border-2 border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="p-6 border-b border-gray-50 bg-gradient-to-l from-purple-50/50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">פרטי חשבון ספק האינטרנט</h3>
                <p className="text-sm text-gray-600 mt-1">מידע על חיבור האינטרנט הנוכחי שלך</p>
              </div>
            </div>
            <FieldInfoTooltip content={fieldInfo.currentISP} />
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-base font-semibold text-gray-800">
                מספר חשבון ספק האינטרנט <span className="text-red-500">*</span>
              </Label>
              <FieldInfoTooltip content="מספר החשבון שלך אצל ספק האינטרנט הנוכחי. ניתן למצוא אותו בחשבונית או באזור האישי באתר הספק." />
            </div>
            <Input
              value={internetISPData.isp_account_no}
              onChange={(e) => updateISPData({ isp_account_no: e.target.value })}
              placeholder="הזן מספר חשבון"
              className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">שם משתמש PPPoE (אם קיים)</Label>
              <Input
                value={internetISPData.pppoe_user || ''}
                onChange={(e) => updateISPData({ pppoe_user: e.target.value })}
                placeholder="username@isp.co.il"
                className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">מספר סידורי ONT (אם ידוע)</Label>
              <Input
                value={internetISPData.ont_serial || ''}
                onChange={(e) => updateISPData({ ont_serial: e.target.value })}
                placeholder="הזן מספר סידורי"
                className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Installation Address */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50">
          <h3 className="text-xl font-medium text-gray-900">כתובת התקנה</h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox
              id="install_address_different"
              checked={internetISPData.install_address_different || false}
              onCheckedChange={(checked) => 
                updateISPData({ install_address_different: checked as boolean })
              }
            />
            <Label htmlFor="install_address_different" className="text-sm text-gray-700">
              כתובת התקנה שונה מכתובת השירות
            </Label>
          </div>

          {internetISPData.install_address_different && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">כתובת התקנה</Label>
              <Input
                value={internetISPData.install_address || ''}
                onChange={(e) => updateISPData({ install_address: e.target.value })}
                placeholder="הזן כתובת התקנה המלאה"
                className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
          )}
        </div>
      </div>

      {/* Bundle Services */}
      <div className="bg-white rounded-xl border-2 border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="p-6 border-b border-gray-50 bg-gradient-to-l from-purple-50/50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">חבילת שירותים</h3>
                <p className="text-sm text-gray-600 mt-1">פירוט השירותים הכלולים בחבילה</p>
              </div>
            </div>
            <FieldInfoTooltip content={fieldInfo.isBundleService} />
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Checkbox
              id="is_bundle"
              checked={internetISPData.bundle.is_bundle}
              onCheckedChange={(checked) => 
                updateISPData({
                  bundle: { ...internetISPData.bundle, is_bundle: checked as boolean }
                })
              }
            />
            <Label htmlFor="is_bundle" className="text-sm text-gray-700">
              השירות הוא חלק מחבילה
            </Label>
          </div>

          {internetISPData.bundle.is_bundle && (
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">רכיבי החבילה:</Label>
              {bundleComponents.map((component) => (
                <div key={component} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Checkbox
                    id={`bundle_${component}`}
                    checked={internetISPData.bundle.components.includes(component)}
                    onCheckedChange={(checked) => toggleBundleComponent(component, checked as boolean)}
                  />
                  <Label htmlFor={`bundle_${component}`} className="text-sm text-gray-700">
                    {component}
                  </Label>
                </div>
              ))}
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
                <Label htmlFor={`equipment_${item}`} className="text-sm text-gray-700">
                  {item}
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">שיטת החזרה</Label>
            <Select
              value={internetISPData.equipment_return.method}
              onValueChange={(value) => 
                updateISPData({
                  equipment_return: { ...internetISPData.equipment_return, method: value as 'courier' | 'dropoff' }
                })
              }
            >
              <SelectTrigger className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="courier">איסוף בשליח</SelectItem>
                <SelectItem value="dropoff">הגשה בנקודת שירות</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {internetISPData.equipment_return.method === 'courier' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">זמן מועדף לאיסוף</Label>
              <Input
                value={internetISPData.equipment_return.slot || ''}
                onChange={(e) => 
                  updateISPData({
                    equipment_return: { ...internetISPData.equipment_return, slot: e.target.value }
                  })
                }
                placeholder="לדוגמה: ראשון-חמישי 14:00-18:00"
                className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}