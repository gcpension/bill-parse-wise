import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Smartphone, 
  Tv, 
  Wifi, 
  Zap, 
  Plus, 
  Trash2, 
  Building,
  Phone,
  Upload
} from "lucide-react";

interface VerificationStepProps {
  category: string;
  customerType: string;
  data: any;
  onUpdate: (data: any) => void;
}

const providers = {
  cellular: [
    'פלאפון', 'סלקום', 'פרטנר', 'Hot Mobile', '012 Mobile', 'רמי לוי', 'גולן טלקום', 'אחר'
  ],
  tv: [
    'HOT', 'יס', 'סלקום TV', 'פרטנר TV', 'נטפליקס', 'אמזון פריים', 'אחר'
  ],
  internet: [
    'בזק בינלאומי', 'HOT', 'פרטנר', 'סלקום', '012', 'יס אינטרנט', 'אחר'
  ],
  electricity: [
    'חברת החשמל', 'אנרג\'יה ישראלית', 'פז אנרגיה', 'חשמל הגליל', 'דלק אנרגיה', 'אחר'
  ]
};

export const VerificationStep = ({ category, customerType, data, onUpdate }: VerificationStepProps) => {
  const [formData, setFormData] = useState({
    currentProvider: data.currentProvider || '',
    customerNumber: data.customerNumber || '',
    targetProvider: data.targetProvider || '',
    targetPlan: data.targetPlan || '',
    lines: data.lines || [''],
    contractNumbers: data.contractNumbers || [{ contractNumber: '', meterNumber: '', siteAddress: '' }],
    subscriberNumber: data.subscriberNumber || '',
    infraProvider: data.infraProvider || '',
    serviceProvider: data.serviceProvider || '',
    identifier: data.identifier || '',
    currentSupplier: data.currentSupplier || '',
    targetSupplier: data.targetSupplier || '',
    ...data
  });

  const { register, setValue, watch } = useForm({
    defaultValues: formData
  });

  const watchedValues = watch();
  const isPrivate = customerType === 'private';

  useEffect(() => {
    const updatedData = { ...formData, ...watchedValues };
    setFormData(updatedData);
    onUpdate(updatedData);
  }, [watchedValues, onUpdate]);

  const addLine = () => {
    const newLines = [...(formData.lines || []), ''];
    setFormData(prev => ({ ...prev, lines: newLines }));
  };

  const removeLine = (index: number) => {
    const newLines = formData.lines?.filter((_, i) => i !== index) || [];
    setFormData(prev => ({ ...prev, lines: newLines }));
  };

  const updateLine = (index: number, value: string) => {
    const newLines = [...(formData.lines || [])];
    newLines[index] = value;
    setFormData(prev => ({ ...prev, lines: newLines }));
    setValue(`lines.${index}`, value);
  };

  const addContractNumber = () => {
    const newContracts = [...(formData.contractNumbers || []), { contractNumber: '', meterNumber: '', siteAddress: '' }];
    setFormData(prev => ({ ...prev, contractNumbers: newContracts }));
  };

  const removeContractNumber = (index: number) => {
    const newContracts = formData.contractNumbers?.filter((_, i) => i !== index) || [];
    setFormData(prev => ({ ...prev, contractNumbers: newContracts }));
  };

  const updateContractNumber = (index: number, field: string, value: string) => {
    const newContracts = [...(formData.contractNumbers || [])];
    newContracts[index] = { ...newContracts[index], [field]: value };
    setFormData(prev => ({ ...prev, contractNumbers: newContracts }));
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'cellular': return Smartphone;
      case 'tv': return Tv;
      case 'internet': return Wifi;
      case 'electricity': return Zap;
      default: return Phone;
    }
  };

  const CategoryIcon = getCategoryIcon();

  const renderCellularFields = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentProvider">ספק נוכחי *</Label>
          <Select onValueChange={(value) => setValue('currentProvider', value)}>
            <SelectTrigger>
              <SelectValue placeholder="בחרו ספק נוכחי" />
            </SelectTrigger>
            <SelectContent>
              {providers.cellular.map(provider => (
                <SelectItem key={provider} value={provider}>{provider}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerNumber">מספר לקוח (אם ידוע)</Label>
          <Input
            id="customerNumber"
            {...register("customerNumber")}
            placeholder="מספר לקוח אצל הספק הנוכחי"
          />
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Label className="font-semibold">מספרי קווים להעברה *</Label>
          <Button type="button" variant="outline" size="sm" onClick={addLine}>
            <Plus className="ml-2 h-4 w-4" />
            הוסף קו
          </Button>
        </div>
        <div className="space-y-2">
          {formData.lines?.map((line, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="05X-XXXXXXX"
                value={line}
                onChange={(e) => updateLine(index, e.target.value)}
              />
              {formData.lines && formData.lines.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeLine(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          לפחות מספר קו אחד נדרש לסלולר
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="targetProvider">ספק יעד רצוי *</Label>
          <Select onValueChange={(value) => setValue('targetProvider', value)}>
            <SelectTrigger>
              <SelectValue placeholder="בחרו ספק יעד" />
            </SelectTrigger>
            <SelectContent>
              {providers.cellular.map(provider => (
                <SelectItem key={provider} value={provider}>{provider}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetPlan">סוג חבילה</Label>
          <Input
            id="targetPlan"
            {...register("targetPlan")}
            placeholder="תאור החבילה הרצויה"
          />
        </div>
      </div>
    </div>
  );

  const renderTvFields = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentProvider">ספק נוכחי *</Label>
          <Select onValueChange={(value) => setValue('currentProvider', value)}>
            <SelectTrigger>
              <SelectValue placeholder="בחרו ספק נוכחי" />
            </SelectTrigger>
            <SelectContent>
              {providers.tv.map(provider => (
                <SelectItem key={provider} value={provider}>{provider}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subscriberNumber">מספר מנוי/לקוח *</Label>
          <Input
            id="subscriberNumber"
            {...register("subscriberNumber", { required: "נדרש מספר מנוי" })}
            placeholder="מספר מנוי אצל הספק הנוכחי"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="targetProvider">ספק יעד רצוי</Label>
          <Select onValueChange={(value) => setValue('targetProvider', value)}>
            <SelectTrigger>
              <SelectValue placeholder="בחרו ספק יעד" />
            </SelectTrigger>
            <SelectContent>
              {providers.tv.map(provider => (
                <SelectItem key={provider} value={provider}>{provider}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetPlan">העדפות חבילה</Label>
          <Input
            id="targetPlan"
            {...register("targetPlan")}
            placeholder="תאור החבילה הרצויה"
          />
        </div>
      </div>
    </div>
  );

  const renderInternetFields = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="infraProvider">ספק תשתית (בזק/HOT/סיבים) *</Label>
          <Select onValueChange={(value) => setValue('infraProvider', value)}>
            <SelectTrigger>
              <SelectValue placeholder="בחרו ספק תשתית" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bezeq">בזק</SelectItem>
              <SelectItem value="hot">HOT</SelectItem>
              <SelectItem value="fiber">סיבים אופטיים</SelectItem>
              <SelectItem value="other">אחר</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceProvider">ספק ISP נוכחי *</Label>
          <Select onValueChange={(value) => setValue('serviceProvider', value)}>
            <SelectTrigger>
              <SelectValue placeholder="בחרו ספק אינטרנט" />
            </SelectTrigger>
            <SelectContent>
              {providers.internet.map(provider => (
                <SelectItem key={provider} value={provider}>{provider}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="identifier">מספר קו/מנוי/ONT *</Label>
        <Input
          id="identifier"
          {...register("identifier", { required: "נדרש מזהה קו" })}
          placeholder="מספר קו או מזהה אחר"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="targetProvider">ספק יעד</Label>
          <Select onValueChange={(value) => setValue('targetProvider', value)}>
            <SelectTrigger>
              <SelectValue placeholder="בחרו ספק יעד" />
            </SelectTrigger>
            <SelectContent>
              {providers.internet.map(provider => (
                <SelectItem key={provider} value={provider}>{provider}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetPlan">תוכנית יעד</Label>
          <Input
            id="targetPlan"
            {...register("targetPlan")}
            placeholder="מהירות וחבילה רצויה"
          />
        </div>
      </div>
    </div>
  );

  const renderElectricityFields = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentSupplier">ספק חשמל נוכחי</Label>
          <Select onValueChange={(value) => setValue('currentSupplier', value)}>
            <SelectTrigger>
              <SelectValue placeholder="בחרו ספק נוכחי" />
            </SelectTrigger>
            <SelectContent>
              {providers.electricity.map(provider => (
                <SelectItem key={provider} value={provider}>{provider}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetSupplier">ספק חשמל יעד *</Label>
          <Select onValueChange={(value) => setValue('targetSupplier', value)}>
            <SelectTrigger>
              <SelectValue placeholder="בחרו ספק יעד" />
            </SelectTrigger>
            <SelectContent>
              {providers.electricity.map(provider => (
                <SelectItem key={provider} value={provider}>{provider}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Label className="font-semibold">
            {isPrivate ? 'פרטי חוזה/מונה *' : 'נקודות צריכה *'}
          </Label>
          {!isPrivate && (
            <Button type="button" variant="outline" size="sm" onClick={addContractNumber}>
              <Plus className="ml-2 h-4 w-4" />
              הוסף נקודה
            </Button>
          )}
        </div>

        {isPrivate ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractNumber">מספר חוזה *</Label>
                <Input
                  id="contractNumber"
                  {...register("contractNumber", { required: "נדרש מספר חוזה" })}
                  placeholder="מספר החוזה"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meterNumber">מספר מונה *</Label>
                <Input
                  id="meterNumber"
                  {...register("meterNumber", { required: "נדרש מספר מונה" })}
                  placeholder="מספר המונה"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteAddress">כתובת אתר הצריכה *</Label>
              <Input
                id="siteAddress"
                {...register("siteAddress", { required: "נדרשת כתובת" })}
                placeholder="כתובת מלאה של נקודת הצריכה"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {formData.contractNumbers?.map((contract, index) => (
              <Card key={index} className="p-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">נקודת צריכה {index + 1}</Label>
                  {formData.contractNumbers && formData.contractNumbers.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeContractNumber(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    placeholder="מספר חוזה"
                    value={contract.contractNumber}
                    onChange={(e) => updateContractNumber(index, 'contractNumber', e.target.value)}
                  />
                  <Input
                    placeholder="מספר מונה"
                    value={contract.meterNumber}
                    onChange={(e) => updateContractNumber(index, 'meterNumber', e.target.value)}
                  />
                  <Input
                    placeholder="כתובת אתר"
                    value={contract.siteAddress}
                    onChange={(e) => updateContractNumber(index, 'siteAddress', e.target.value)}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-2">
          מספרי החוזה והמונה נמצאים בחשבונית החשמל
        </p>
      </Card>
    </div>
  );

  const renderCategorySpecificFields = () => {
    switch (category) {
      case 'cellular': return renderCellularFields();
      case 'tv': return renderTvFields();
      case 'internet': return renderInternetFields();
      case 'electricity': return renderElectricityFields();
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <CategoryIcon className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">פרטי השירות</h2>
        </div>
        <p className="text-muted-foreground">
          מלאו את הפרטים הנוגעים לשירות הנוכחי והרצוי
        </p>
      </div>

      {renderCategorySpecificFields()}

      {!isPrivate && (
        <>
          <Separator />
          <Card className="p-4 bg-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <Upload className="h-4 w-4 text-blue-600" />
              <Label className="font-semibold text-blue-900">ייבוא נתונים (רשות)</Label>
            </div>
            <p className="text-sm text-blue-800 mb-3">
              עבור לקוחות עסקיים: ניתן להעלות קובץ CSV עם רשימת {category === 'cellular' ? 'מספרים' : 'נקודות'} להעברה
            </p>
            <Button variant="outline" size="sm" disabled>
              <Upload className="ml-2 h-4 w-4" />
              העלה CSV (בפיתוח)
            </Button>
          </Card>
        </>
      )}
    </div>
  );
};