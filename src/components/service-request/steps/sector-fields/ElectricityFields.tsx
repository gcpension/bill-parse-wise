import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { Plus, Trash2, Zap, BarChart3, Info } from 'lucide-react';
import { FieldInfoTooltip, fieldInfo } from '@/components/ui/field-info-tooltip';

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
    <div className="space-y-8">
      {/* Electricity Account Information */}
      <div className="bg-white rounded-xl border-2 border-yellow-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="p-6 border-b border-gray-50 bg-gradient-to-l from-yellow-50/50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">פרטי חשבון חשמל</h3>
                <p className="text-sm text-gray-600 mt-1">מידע על חשבון החשמל שלך</p>
              </div>
            </div>
            <FieldInfoTooltip content="פרטי חשבון החשמל נדרשים לזיהוי החיבור שלך במערכת חברת החשמל או הספק הנוכחי." />
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-base font-semibold text-gray-800">
                  מספר חשבון חשמל <span className="text-red-500">*</span>
                </Label>
                <FieldInfoTooltip content={fieldInfo.contractNumber} />
              </div>
              <Input
                value={electricityData.electricity_account_no}
                onChange={(e) => updateElectricityData({ electricity_account_no: e.target.value })}
                placeholder="הזן מספר חשבון"
                className="h-11 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-base font-semibold text-gray-800">
                  מספר מונה עיקרי <span className="text-red-500">*</span>
                </Label>
                <FieldInfoTooltip content={fieldInfo.meterNumber} />
              </div>
              <Input
                value={electricityData.meter_number}
                onChange={(e) => updateElectricityData({ meter_number: e.target.value })}
                placeholder="הזן מספר מונה"
                className="h-11 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">תעריף נוכחי</Label>
              <Select
                value={electricityData.current_tariff || ''}
                onValueChange={(value) => updateElectricityData({ current_tariff: value })}
              >
                <SelectTrigger className="h-11 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/20">
                  <SelectValue placeholder="בחר תעריף" />
                </SelectTrigger>
                <SelectContent>
                  {tariffTypes.map((tariff) => (
                    <SelectItem key={tariff} value={tariff}>
                      {tariff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">צריכה חודשית ממוצעת (קוט״ש)</Label>
              <Input
                type="number"
                value={electricityData.avg_monthly_kwh || ''}
                onChange={(e) => updateElectricityData({ avg_monthly_kwh: parseInt(e.target.value) || undefined })}
                placeholder="לדוגמה: 300"
                className="h-11 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Consumption Points */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">נקודות צריכה</h3>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {electricityData.consumption_points.map((point, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-5 space-y-5">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-gray-800">נקודת צריכה {index + 1}</h4>
                {electricityData.consumption_points.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeConsumptionPoint(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    מזהה נקודה <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={point.point_id}
                    onChange={(e) => updateConsumptionPoint(index, 'point_id', e.target.value)}
                    placeholder="הזן מזהה נקודה"
                    className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">סוג מונה</Label>
                  <Select
                    value={point.meter_type}
                    onValueChange={(value) => updateConsumptionPoint(index, 'meter_type', value)}
                  >
                    <SelectTrigger className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500/20">
                      <SelectValue placeholder="בחר סוג מונה" />
                    </SelectTrigger>
                    <SelectContent>
                      {meterTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  כתובת נקודת הצריכה <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={point.address}
                  onChange={(e) => updateConsumptionPoint(index, 'address', e.target.value)}
                  placeholder="הזן כתובת מלאה"
                  className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addConsumptionPoint}
            className="w-full h-12 border-2 border-dashed border-gray-200 rounded-lg text-gray-600 hover:border-green-300 hover:text-green-600 hover:bg-green-50/50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            הוסף נקודת צריכה
          </button>
        </div>
      </div>
    </div>
  );
}