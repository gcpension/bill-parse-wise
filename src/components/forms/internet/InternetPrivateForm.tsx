import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { ManualPlan } from "@/data/manual-plans";
import { InternetPrivateForm as FormData } from "@/types/switchForms";
import { useToast } from "@/hooks/use-toast";
import { validateCommonFields, validateFutureDate, validateFile } from "@/lib/formValidations";
import { getPowerOfAttorneyText, getChecklistItems } from "@/lib/powerOfAttorneyTexts";
import { createHebrewPDF } from "@/lib/pdfUtils";
import { FieldInfoTooltip, fieldInfo } from "@/components/ui/field-info-tooltip";

interface InternetPrivateFormProps {
  selectedPlan: ManualPlan;
  onClose: () => void;
}

export const InternetPrivateForm = ({ selectedPlan, onClose }: InternetPrivateFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    idNumber: "",
    phone: "",
    email: "",
    infrastructureProvider: "",
    currentISP: "",
    lineIdentifier: "",
    targetProvider: selectedPlan.company,
    requestedPackage: selectedPlan.planName,
    powerOfAttorneyExpiry: "",
    isBundleService: false,
    subscriberIdCopy: { file: null, required: true, uploaded: false }
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);
  
  const checklistItems = getChecklistItems('internet', 'private');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: 'subscriberIdCopy', file: File | null) => {
    if (file && !validateFile(file).valid) {
      toast({ title: "שגיאה בקובץ", variant: "destructive" });
      return;
    }
    updateFormData(field, { file, required: true, uploaded: !!file });
  };

  const validateForm = () => {
    const commonValidation = validateCommonFields(formData.fullName, formData.idNumber, formData.phone, formData.email);
    const errors = [...commonValidation.errors];
    
    if (!formData.infrastructureProvider.trim()) errors.push("חובה לבחור ספק תשתית");
    if (!formData.currentISP.trim()) errors.push("חובה לבחור ספק אינטרנט נוכחי");
    if (!formData.lineIdentifier.trim()) errors.push("חובה למלא מזהה קו");
    if (!formData.powerOfAttorneyExpiry || !validateFutureDate(formData.powerOfAttorneyExpiry)) {
      errors.push("תאריך פקיעת ייפוי הכוח חייב להיות עתידי");
    }
    if (!formData.subscriberIdCopy.uploaded) errors.push("חובה לצרף צילום ת.ז.");
    if (!agreeToTerms || !agreeToPrivacy) errors.push("חובה לאשר הסכמות");

    return { isValid: errors.length === 0, errors };
  };

  const generatePDF = async () => {
    const content = [
      `תאריך: ${new Date().toLocaleDateString('he-IL')}`,
      "טופס בקשת מעבר ספק אינטרנט - לקוח פרטי",
      `חברה: ${selectedPlan.company}`,
      `מסלול: ${selectedPlan.planName}`,
      `שם מלא: ${formData.fullName}`,
      `ת.ז.: ${formData.idNumber}`,
      `ספק תשתית נוכחי: ${formData.infrastructureProvider}`,
      `ספק אינטרנט נוכחי: ${formData.currentISP}`,
      `ספק יעד: ${formData.targetProvider}`
    ];

    const pdf = await createHebrewPDF("טופס בקשת מעבר ספק אינטרנט", content);
    const fileName = `internet-switch-${formData.fullName.replace(/\s+/g, '-')}.pdf`;
    pdf.save(fileName);
    return fileName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateForm();
    if (!validation.isValid) {
      toast({ title: "שגיאות בטופס", description: validation.errors.join(", "), variant: "destructive" });
      return;
    }

    try {
      await generatePDF();
      toast({ title: "הבקשה נשלחה בהצלחה!" });
      onClose();
    } catch (error) {
      toast({ title: "שגיאה ביצירת הקובץ", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-1" dir="rtl">
      <Card>
        <CardHeader className="py-0.5 px-1.5"><CardTitle className="text-[9px] font-semibold">פרטים אישיים</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-1 py-1 px-1.5">
          <div>
            <Label className="text-[8px]">שם מלא *</Label>
            <Input 
              placeholder="שם מלא"
              value={formData.fullName} 
              onChange={(e) => updateFormData("fullName", e.target.value)} 
              required 
              className="h-6 text-[11px]"
            />
          </div>
          <div>
            <Label className="text-[8px]">ת.ז. *</Label>
            <Input 
              placeholder="9 ספרות"
              value={formData.idNumber} 
              onChange={(e) => updateFormData("idNumber", e.target.value)} 
              maxLength={9}
              required 
              className="h-6 text-[11px]"
            />
          </div>
          <div>
            <Label className="text-[8px]">נייד *</Label>
            <Input 
              placeholder="05X-XXX"
              value={formData.phone} 
              onChange={(e) => updateFormData("phone", e.target.value)} 
              required 
              className="h-6 text-[11px]"
            />
          </div>
          <div>
            <Label className="text-[8px]">מייל *</Label>
            <Input 
              type="email" 
              placeholder="email"
              value={formData.email} 
              onChange={(e) => updateFormData("email", e.target.value)} 
              required 
              className="h-6 text-[11px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-0.5 px-1.5"><CardTitle className="text-[9px] font-semibold">פרטי שירות</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-1 py-1 px-1.5">
          <div>
            <Label className="text-[8px]">תשתית *</Label>
            <Select onValueChange={(value) => updateFormData("infrastructureProvider", value)}>
              <SelectTrigger className="h-6 text-[11px]"><SelectValue placeholder="בחר" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="בזק">בזק</SelectItem>
                <SelectItem value="HOT">HOT</SelectItem>
                <SelectItem value="סיב אחר">סיב</SelectItem>
                <SelectItem value="אחר">אחר</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[8px]">ISP נוכחי *</Label>
            <Input 
              placeholder="ספק"
              value={formData.currentISP} 
              onChange={(e) => updateFormData("currentISP", e.target.value)} 
              required 
              className="h-6 text-[11px]"
            />
          </div>
          <div>
            <Label className="text-[8px]">מזהה קו *</Label>
            <Input 
              placeholder="מזהה"
              value={formData.lineIdentifier} 
              onChange={(e) => updateFormData("lineIdentifier", e.target.value)} 
              required 
              className="h-6 text-[11px]"
            />
          </div>
          <div>
            <Label className="text-[8px]">תוקף *</Label>
            <Input 
              type="date" 
              value={formData.powerOfAttorneyExpiry} 
              onChange={(e) => updateFormData("powerOfAttorneyExpiry", e.target.value)} 
              required 
              className="h-6 text-[11px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-0.5 px-1.5"><CardTitle className="text-[9px] font-semibold">מסמכים והסכמות</CardTitle></CardHeader>
        <CardContent className="space-y-1 py-1 px-1.5">
          <div>
            <Label className="flex items-center gap-0.5 text-[8px]">
              <Upload className="h-2.5 w-2.5" />
              ת״ז *
            </Label>
            <Input 
              type="file" 
              accept=".jpg,.jpeg,.png,.pdf" 
              onChange={(e) => handleFileUpload("subscriberIdCopy", e.target.files?.[0] || null)} 
              className="h-6 text-[11px]"
            />
            {formData.subscriberIdCopy.uploaded && (
              <p className="text-[8px] text-green-600">✓</p>
            )}
          </div>
          <div className="flex items-start gap-1">
            <Checkbox checked={agreeToTerms} onCheckedChange={(checked) => setAgreeToTerms(checked === true)} className="h-3 w-3" />
            <label className="text-[8px] leading-tight">מסכים/ה לתנאים</label>
          </div>
          <div className="flex items-start gap-1">
            <Checkbox checked={agreeToPrivacy} onCheckedChange={(checked) => setAgreeToPrivacy(checked === true)} className="h-3 w-3" />
            <label className="text-[8px] leading-tight">מסכים/ה לפרטיות</label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-1 pt-1">
        <Button type="submit" className="flex-1 h-6 text-[11px]"><FileText className="h-2.5 w-2.5 ml-0.5" />שלח</Button>
        <Button type="button" variant="outline" onClick={onClose} className="h-6 text-[11px]">ביטול</Button>
      </div>
    </form>
  );
};