import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { ServiceRequestFormData, CellularLine } from '@/types/serviceRequest';
import { Plus, Trash2, Smartphone, Info, AlertCircle } from 'lucide-react';
import { FieldInfoTooltip, fieldInfo } from '@/components/ui/field-info-tooltip';

interface CellularFieldsProps {
  formData: Partial<ServiceRequestFormData>;
  updateFormData: (data: Partial<ServiceRequestFormData>) => void;
}

export default function CellularFields({ formData, updateFormData }: CellularFieldsProps) {
  const cellularData = formData.cellular_data || {
    lines: [{ msisdn: '', sim_type: 'SIM' as const }],
    cancel_vas: { intl: false, premium: false, other: false }
  };

  const updateCellularData = (newData: Partial<typeof cellularData>) => {
    updateFormData({
      cellular_data: { ...cellularData, ...newData }
    });
  };

  const addLine = () => {
    const newLine: CellularLine = { msisdn: '', sim_type: 'SIM' };
    updateCellularData({
      lines: [...cellularData.lines, newLine]
    });
  };

  const removeLine = (index: number) => {
    if (cellularData.lines.length > 1) {
      updateCellularData({
        lines: cellularData.lines.filter((_, i) => i !== index)
      });
    }
  };

  const updateLine = (index: number, field: keyof CellularLine, value: any) => {
    const updatedLines = cellularData.lines.map((line, i) =>
      i === index ? { ...line, [field]: value } : line
    );
    updateCellularData({ lines: updatedLines });
  };

  return (
    <div className="space-y-8">
      {/* Phone Lines */}
      <div className="bg-white rounded-xl border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="p-6 border-b border-gray-50 bg-gradient-to-l from-blue-50/50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">קווי טלפון סלולריים</h3>
                <p className="text-sm text-gray-600 mt-1">הזן את מספרי הטלפון שברצונך להעביר</p>
              </div>
            </div>
            <FieldInfoTooltip content={fieldInfo.phoneNumbers} />
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {cellularData.lines.map((line, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-5 space-y-5">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-gray-800">קו מספר {index + 1}</h4>
                {cellularData.lines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLine(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-semibold text-gray-800">
                      מספר טלפון <span className="text-red-500">*</span>
                    </Label>
                    <FieldInfoTooltip content="מספר הטלפון הנייד שברצונך להעביר. הקפד על הזנת מספר תקין ופעיל." />
                  </div>
                  <Input
                    value={line.msisdn}
                    onChange={(e) => updateLine(index, 'msisdn', e.target.value)}
                    placeholder="050-1234567"
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">סוג SIM</Label>
                  <Select
                    value={line.sim_type}
                    onValueChange={(value) => updateLine(index, 'sim_type', value)}
                  >
                    <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SIM">SIM פיזי</SelectItem>
                      <SelectItem value="eSIM">eSIM דיגיטלי</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">בעלים של הקו (אם שונה)</Label>
                <Input
                  value={line.owner_id || ''}
                  onChange={(e) => updateLine(index, 'owner_id', e.target.value)}
                  placeholder="מספר זהות של בעל הקו"
                  className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              {formData.action_type === 'disconnect' && (
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                  <Checkbox
                    id={`port_out_${index}`}
                    checked={line.port_out || false}
                    onCheckedChange={(checked) => updateLine(index, 'port_out', checked)}
                  />
                  <Label htmlFor={`port_out_${index}`} className="text-sm text-gray-700">
                    העברת מספר לספק אחר (Port Out)
                  </Label>
                </div>
              )}

              {formData.action_type === 'switch' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">ספק יעד להעברת המספר</Label>
                  <Input
                    value={line.port_in_provider || ''}
                    onChange={(e) => updateLine(index, 'port_in_provider', e.target.value)}
                    placeholder="שם הספק החדש"
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addLine}
            className="w-full h-12 border-2 border-dashed border-gray-200 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            הוסף קו נוסף
          </button>
        </div>
      </div>

      {/* OTP Code */}
      {(formData.action_type === 'switch' || formData.action_type === 'disconnect') && (
        <div className="bg-amber-50 rounded-xl border-2 border-amber-200 shadow-lg">
          <div className="p-6 border-b border-amber-100 bg-gradient-to-l from-amber-100/50 to-amber-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">קוד OTP להעברת מספר</h3>
                  <p className="text-sm text-gray-600 mt-1">קוד זה נדרש לאימות העברת המספר</p>
                </div>
              </div>
              <FieldInfoTooltip content={fieldInfo.acceptOtpConfirmation} />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-800">קוד OTP (אם התקבל מהספק)</Label>
              <Input
                value={cellularData.porting_otp || ''}
                onChange={(e) => updateCellularData({ porting_otp: e.target.value })}
                    placeholder="הזן קוד OTP"
                    className="h-12 text-base border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500/20"
                  />
                  <div className="flex items-start gap-2 p-3 bg-amber-100/50 rounded-lg border border-amber-200">
                    <Info className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-900 leading-relaxed">
                      קוד OTP מתקבל בדרך כלל בהודעת SMS מהספק הנוכחי. הקוד תקף למשך זמן מוגבל בלבד.
                    </p>
                  </div>
            </div>
          </div>
        </div>
      )}

      {/* Value Added Services */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50">
          <h3 className="text-xl font-medium text-gray-900">ביטול שירותים נוספים</h3>
          <p className="text-sm text-gray-500 mt-1">בחר אילו שירותים נוספים ברצונך לבטל</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox
                id="cancel_intl"
                checked={cellularData.cancel_vas.intl}
                onCheckedChange={(checked) => 
                  updateCellularData({
                    cancel_vas: { ...cellularData.cancel_vas, intl: checked as boolean }
                  })
                }
              />
              <Label htmlFor="cancel_intl" className="text-sm text-gray-700">
                שיחות בינלאומיות
              </Label>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox
                id="cancel_premium"
                checked={cellularData.cancel_vas.premium}
                onCheckedChange={(checked) => 
                  updateCellularData({
                    cancel_vas: { ...cellularData.cancel_vas, premium: checked as boolean }
                  })
                }
              />
              <Label htmlFor="cancel_premium" className="text-sm text-gray-700">
                שירותי תוכן פרימיום
              </Label>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Checkbox
                id="cancel_other"
                checked={cellularData.cancel_vas.other}
                onCheckedChange={(checked) => 
                  updateCellularData({
                    cancel_vas: { ...cellularData.cancel_vas, other: checked as boolean }
                  })
                }
              />
              <Label htmlFor="cancel_other" className="text-sm text-gray-700">
                שירותים נוספים אחרים
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Power of Attorney (if not uploaded globally) */}
      {formData.customer_type === 'private' && !formData.power_of_attorney_file && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-xl font-medium text-gray-900">ייפוי כוח</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">ייפוי כוח (PDF)</Label>
              <FileUpload
                accept=".pdf"
                onFileUpload={(file) => updateCellularData({ power_of_attorney_file: file })}
                maxSize={10 * 1024 * 1024}
                helperText="העלה קובץ PDF של ייפוי הכוח (עד 10MB)"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}