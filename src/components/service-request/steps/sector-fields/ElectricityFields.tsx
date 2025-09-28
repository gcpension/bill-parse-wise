import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { Plus, Trash2, Zap, BarChart3 } from 'lucide-react';

interface ElectricityFieldsProps {
  formData: Partial<ServiceRequestFormData>;
  updateFormData: (data: Partial<ServiceRequestFormData>) => void;
}

export default function ElectricityFields({ formData, updateFormData }: ElectricityFieldsProps) {
  const electricityData = formData.electricity_data || {
    electricity_account_no: '',
    meter_number: '',
    consumption_points: [{ point_id: '', address: '', meter_type: '' }]
  };

  const updateElectricityData = (newData: Partial<typeof electricityData>) => {
    updateFormData({
      electricity_data: { ...electricityData, ...newData }
    });
  };

  const addConsumptionPoint = () => {
    updateElectricityData({
      consumption_points: [
        ...electricityData.consumption_points,
        { point_id: '', address: '', meter_type: '' }
      ]
    });
  };

  const removeConsumptionPoint = (index: number) => {
    if (electricityData.consumption_points.length > 1) {
      updateElectricityData({
        consumption_points: electricityData.consumption_points.filter((_, i) => i !== index)
      });
    }
  };

  const updateConsumptionPoint = (index: number, field: string, value: string) => {
    const updatedPoints = electricityData.consumption_points.map((point, i) =>
      i === index ? { ...point, [field]: value } : point
    );
    updateElectricityData({ consumption_points: updatedPoints });
  };

  const meterTypes = [
    'מונה אלקטרוני',
    'מונה חכם',
    'מונה מכני',
    'מונה תלת פאזי',
    'מונה חד פאזי',
    'אחר'
  ];

  const tariffTypes = [
    'ביתי רגיל',
    'ביתי עם חשבון כפול',
    'ביתי עם חימום חשמלי',
    'מסחרי',
    'תעשייתי',
    'חקלאי',
    'אחר'
  ];

  return (
    <div className="space-y-6">
      {/* Electricity Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo flex items-center gap-2">
            <Zap className="w-5 h-5" />
            פרטי חשבון חשמל
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-assistant">
                מספר חשבון חשמל <span className="text-red-500">*</span>
              </Label>
              <Input
                value={electricityData.electricity_account_no}
                onChange={(e) => updateElectricityData({ electricity_account_no: e.target.value })}
                placeholder="הזן מספר חשבון"
                className="font-assistant"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-assistant">
                מספר מונה עיקרי <span className="text-red-500">*</span>
              </Label>
              <Input
                value={electricityData.meter_number}
                onChange={(e) => updateElectricityData({ meter_number: e.target.value })}
                placeholder="הזן מספר מונה"
                className="font-assistant"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-assistant">תעריף נוכחי</Label>
              <Select
                value={electricityData.current_tariff || ''}
                onValueChange={(value) => updateElectricityData({ current_tariff: value })}
              >
                <SelectTrigger className="font-assistant">
                  <SelectValue placeholder="בחר תעריף" />
                </SelectTrigger>
                <SelectContent>
                  {tariffTypes.map((tariff) => (
                    <SelectItem key={tariff} value={tariff} className="font-assistant">
                      {tariff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-assistant">צריכה חודשית ממוצעת (קוט״ש)</Label>
              <Input
                type="number"
                value={electricityData.avg_monthly_kwh || ''}
                onChange={(e) => updateElectricityData({ avg_monthly_kwh: parseInt(e.target.value) || undefined })}
                placeholder="לדוגמה: 300"
                className="font-assistant"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consumption Points */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            נקודות צריכה
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {electricityData.consumption_points.map((point, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-heebo font-semibold">נקודת צריכה {index + 1}</h4>
                {electricityData.consumption_points.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeConsumptionPoint(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-assistant">
                    מזהה נקודה <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={point.point_id}
                    onChange={(e) => updateConsumptionPoint(index, 'point_id', e.target.value)}
                    placeholder="הזן מזהה נקודה"
                    className="font-assistant"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-assistant">סוג מונה</Label>
                  <Select
                    value={point.meter_type}
                    onValueChange={(value) => updateConsumptionPoint(index, 'meter_type', value)}
                  >
                    <SelectTrigger className="font-assistant">
                      <SelectValue placeholder="בחר סוג מונה" />
                    </SelectTrigger>
                    <SelectContent>
                      {meterTypes.map((type) => (
                        <SelectItem key={type} value={type} className="font-assistant">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-assistant">
                  כתובת נקודת הצריכה <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={point.address}
                  onChange={(e) => updateConsumptionPoint(index, 'address', e.target.value)}
                  placeholder="הזן כתובת מלאה"
                  className="font-assistant"
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addConsumptionPoint}
            className="w-full font-assistant"
          >
            <Plus className="w-4 h-4 ml-2" />
            הוסף נקודת צריכה
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}