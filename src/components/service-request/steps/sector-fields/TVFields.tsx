import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { Tv, MonitorSpeaker } from 'lucide-react';

interface TVFieldsProps {
  formData: Partial<ServiceRequestFormData>;
  updateFormData: (data: Partial<ServiceRequestFormData>) => void;
}

export default function TVFields({ formData, updateFormData }: TVFieldsProps) {
  const tvData = formData.tv_data || {
    tv_account_no: '',
    decoders: 1,
    ott_profiles: 0,
    equipment_return: { items: [], method: 'courier' as const }
  };

  const updateTVData = (newData: Partial<typeof tvData>) => {
    updateFormData({
      tv_data: { ...tvData, ...newData }
    });
  };

  const equipmentItems = [
    'ממיר (דיקודר)',
    'שלט רחוק',
    'כרטיס חכם',
    'מתאם חשמל',
    'כבל HDMI',
    'כבל אנטנה',
    'אנטנה לוויינית',
    'אחר'
  ];

  return (
    <div className="space-y-8">
      {/* TV Account Information */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
              <Tv className="w-5 h-5 text-pink-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">פרטי חשבון טלוויזיה</h3>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              מספר חשבון טלוויזיה <span className="text-red-500">*</span>
            </Label>
            <Input
              value={tvData.tv_account_no}
              onChange={(e) => updateTVData({ tv_account_no: e.target.value })}
              placeholder="הזן מספר חשבון"
              className="h-11 border-gray-200 focus:border-pink-500 focus:ring-pink-500/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                מספר ממירים (דיקודרים) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min="1"
                value={tvData.decoders}
                onChange={(e) => updateTVData({ decoders: parseInt(e.target.value) || 1 })}
                className="h-11 border-gray-200 focus:border-pink-500 focus:ring-pink-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">מספר פרופילי OTT</Label>
              <Input
                type="number"
                min="0"
                value={tvData.ott_profiles}
                onChange={(e) => updateTVData({ ott_profiles: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="h-11 border-gray-200 focus:border-pink-500 focus:ring-pink-500/20"
              />
              <p className="text-xs text-gray-500">
                פרופילי Netflix, Disney+, וכו׳
              </p>
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
              checked={tvData.install_address_different || false}
              onCheckedChange={(checked) => 
                updateTVData({ install_address_different: checked as boolean })
              }
            />
            <Label htmlFor="install_address_different" className="text-sm text-gray-700">
              כתובת התקנה שונה מכתובת השירות
            </Label>
          </div>

          {tvData.install_address_different && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">כתובת התקנה</Label>
              <Input
                value={tvData.install_address || ''}
                onChange={(e) => updateTVData({ install_address: e.target.value })}
                placeholder="הזן כתובת התקנה המלאה"
                className="h-11 border-gray-200 focus:border-pink-500 focus:ring-pink-500/20"
              />
            </div>
          )}
        </div>
      </div>

      {/* Equipment Return */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
              <MonitorSpeaker className="w-5 h-5 text-pink-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">החזרת ציוד</h3>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">ציוד להחזרה:</Label>
            {equipmentItems.map((item) => (
              <div key={item} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Checkbox
                  id={`equipment_${item}`}
                  checked={tvData.equipment_return.items.includes(item)}
                  onCheckedChange={(checked) => {
                    const updatedItems = checked
                      ? [...tvData.equipment_return.items, item]
                      : tvData.equipment_return.items.filter(i => i !== item);
                    
                    updateTVData({
                      equipment_return: { ...tvData.equipment_return, items: updatedItems }
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
              value={tvData.equipment_return.method}
              onValueChange={(value) => 
                updateTVData({
                  equipment_return: { ...tvData.equipment_return, method: value as 'courier' | 'dropoff' }
                })
              }
            >
              <SelectTrigger className="h-11 border-gray-200 focus:border-pink-500 focus:ring-pink-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="courier">איסוף בשליח</SelectItem>
                <SelectItem value="dropoff">הגשה בנקודת שירות</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {tvData.equipment_return.method === 'courier' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">זמן מועדף לאיסוף</Label>
              <Input
                value={tvData.equipment_return.slot || ''}
                onChange={(e) => 
                  updateTVData({
                    equipment_return: { ...tvData.equipment_return, slot: e.target.value }
                  })
                }
                placeholder="לדוגמה: ראשון-חמישי 14:00-18:00"
                className="h-11 border-gray-200 focus:border-pink-500 focus:ring-pink-500/20"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}