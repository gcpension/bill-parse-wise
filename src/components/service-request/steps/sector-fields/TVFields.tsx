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
    <div className="space-y-6">
      {/* TV Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo flex items-center gap-2">
            <Tv className="w-5 h-5" />
            פרטי חשבון טלוויזיה
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-assistant">
              מספר חשבון טלוויזיה <span className="text-red-500">*</span>
            </Label>
            <Input
              value={tvData.tv_account_no}
              onChange={(e) => updateTVData({ tv_account_no: e.target.value })}
              placeholder="הזן מספר חשבון"
              className="font-assistant"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-assistant">
                מספר ממירים (דיקודרים) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min="1"
                value={tvData.decoders}
                onChange={(e) => updateTVData({ decoders: parseInt(e.target.value) || 1 })}
                className="font-assistant"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-assistant">מספר פרופילי OTT</Label>
              <Input
                type="number"
                min="0"
                value={tvData.ott_profiles}
                onChange={(e) => updateTVData({ ott_profiles: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="font-assistant"
              />
              <p className="text-xs text-muted-foreground font-assistant">
                פרופילי Netflix, Disney+, וכו׳
              </p>
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
              checked={tvData.install_address_different || false}
              onCheckedChange={(checked) => 
                updateTVData({ install_address_different: checked as boolean })
              }
            />
            <Label htmlFor="install_address_different" className="font-assistant">
              כתובת התקנה שונה מכתובת השירות
            </Label>
          </div>

          {tvData.install_address_different && (
            <div className="space-y-2">
              <Label className="font-assistant">כתובת התקנה</Label>
              <Input
                value={tvData.install_address || ''}
                onChange={(e) => updateTVData({ install_address: e.target.value })}
                placeholder="הזן כתובת התקנה המלאה"
                className="font-assistant"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Equipment Return */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo flex items-center gap-2">
            <MonitorSpeaker className="w-5 h-5" />
            החזרת ציוד
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="font-assistant">ציוד להחזרה:</Label>
            {equipmentItems.map((item) => (
              <div key={item} className="flex items-center space-x-2 space-x-reverse">
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
                <Label htmlFor={`equipment_${item}`} className="font-assistant">
                  {item}
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label className="font-assistant">שיטת החזרה</Label>
            <Select
              value={tvData.equipment_return.method}
              onValueChange={(value) => 
                updateTVData({
                  equipment_return: { ...tvData.equipment_return, method: value as 'courier' | 'dropoff' }
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

          {tvData.equipment_return.method === 'courier' && (
            <div className="space-y-2">
              <Label className="font-assistant">זמן מועדף לאיסוף</Label>
              <Input
                value={tvData.equipment_return.slot || ''}
                onChange={(e) => 
                  updateTVData({
                    equipment_return: { ...tvData.equipment_return, slot: e.target.value }
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