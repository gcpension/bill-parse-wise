import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { ServiceRequestFormData, CellularLine } from '@/types/serviceRequest';
import { Plus, Trash2, Smartphone } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Phone Lines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            קווי טלפון סלולריים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cellularData.lines.map((line, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-heebo font-semibold">קו מספר {index + 1}</h4>
                {cellularData.lines.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeLine(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-assistant">
                    מספר טלפון <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={line.msisdn}
                    onChange={(e) => updateLine(index, 'msisdn', e.target.value)}
                    placeholder="050-1234567"
                    className="font-assistant"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-assistant">סוג SIM</Label>
                  <Select
                    value={line.sim_type}
                    onValueChange={(value) => updateLine(index, 'sim_type', value)}
                  >
                    <SelectTrigger className="font-assistant">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SIM" className="font-assistant">SIM פיזי</SelectItem>
                      <SelectItem value="eSIM" className="font-assistant">eSIM דיגיטלי</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-assistant">בעלים של הקו (אם שונה)</Label>
                <Input
                  value={line.owner_id || ''}
                  onChange={(e) => updateLine(index, 'owner_id', e.target.value)}
                  placeholder="מספר זהות של בעל הקו"
                  className="font-assistant"
                />
              </div>

              {formData.action_type === 'disconnect' && (
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={`port_out_${index}`}
                    checked={line.port_out || false}
                    onCheckedChange={(checked) => updateLine(index, 'port_out', checked)}
                  />
                  <Label htmlFor={`port_out_${index}`} className="font-assistant">
                    העברת מספר לספק אחר (Port Out)
                  </Label>
                </div>
              )}

              {formData.action_type === 'switch' && (
                <div className="space-y-2">
                  <Label className="font-assistant">ספק יעד להעברת המספר</Label>
                  <Input
                    value={line.port_in_provider || ''}
                    onChange={(e) => updateLine(index, 'port_in_provider', e.target.value)}
                    placeholder="שם הספק החדש"
                    className="font-assistant"
                  />
                </div>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addLine}
            className="w-full font-assistant"
          >
            <Plus className="w-4 h-4 ml-2" />
            הוסף קו נוסף
          </Button>
        </CardContent>
      </Card>

      {/* OTP Code */}
      {(formData.action_type === 'switch' || formData.action_type === 'disconnect') && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heebo">קוד OTP להעברת מספר</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="font-assistant">קוד OTP (אם התקבל מהספק)</Label>
              <Input
                value={cellularData.porting_otp || ''}
                onChange={(e) => updateCellularData({ porting_otp: e.target.value })}
                placeholder="הזן קוד OTP"
                className="font-assistant"
              />
              <p className="text-sm text-muted-foreground font-assistant">
                קוד OTP מתקבל בדרך כלל בהודעת SMS מהספק הנוכחי
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Value Added Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heebo">ביטול שירותים נוספים</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground font-assistant">
              בחר אילו שירותים נוספים ברצונך לבטל:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="cancel_intl"
                  checked={cellularData.cancel_vas.intl}
                  onCheckedChange={(checked) => 
                    updateCellularData({
                      cancel_vas: { ...cellularData.cancel_vas, intl: checked as boolean }
                    })
                  }
                />
                <Label htmlFor="cancel_intl" className="font-assistant">
                  שיחות בינלאומיות
                </Label>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="cancel_premium"
                  checked={cellularData.cancel_vas.premium}
                  onCheckedChange={(checked) => 
                    updateCellularData({
                      cancel_vas: { ...cellularData.cancel_vas, premium: checked as boolean }
                    })
                  }
                />
                <Label htmlFor="cancel_premium" className="font-assistant">
                  שירותי תוכן פרימיום
                </Label>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="cancel_other"
                  checked={cellularData.cancel_vas.other}
                  onCheckedChange={(checked) => 
                    updateCellularData({
                      cancel_vas: { ...cellularData.cancel_vas, other: checked as boolean }
                    })
                  }
                />
                <Label htmlFor="cancel_other" className="font-assistant">
                  שירותים נוספים אחרים
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Power of Attorney (if not uploaded globally) */}
      {formData.customer_type === 'private' && !formData.power_of_attorney_file && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heebo">ייפוי כוח</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="font-assistant">ייפוי כוח (PDF)</Label>
              <FileUpload
                accept=".pdf"
                onFileUpload={(file) => updateCellularData({ power_of_attorney_file: file })}
                maxSize={10 * 1024 * 1024}
                helperText="העלה קובץ PDF של ייפוי הכוח (עד 10MB)"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}