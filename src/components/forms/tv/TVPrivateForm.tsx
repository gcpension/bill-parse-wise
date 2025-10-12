import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { ManualPlan } from "@/data/manual-plans";
import { TVPrivateForm as FormData } from "@/types/switchForms";
import { useToast } from "@/hooks/use-toast";
import { validateCommonFields, validateFutureDate, validateFile } from "@/lib/formValidations";
import { getPowerOfAttorneyText, getChecklistItems } from "@/lib/powerOfAttorneyTexts";
import { createHebrewPDF } from "@/lib/pdfUtils";

interface TVPrivateFormProps {
  selectedPlan: ManualPlan;
  onClose: () => void;
}

const providers = [
  "yes",
  "HOT",
  "Partner TV",
  "Cellcom TV",
  "BezeqInt",
  "אחר"
];

export const TVPrivateForm = ({ selectedPlan, onClose }: TVPrivateFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    idNumber: "",
    phone: "",
    email: "",
    currentProvider: "",
    subscriberNumber: "",
    targetProvider: selectedPlan.company,
    requestedPackage: selectedPlan.planName,
    equipmentReturnMethod: 'courier',
    powerOfAttorneyExpiry: "",
    subscriberIdCopy: { file: null, required: true, uploaded: false }
  });

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: 'subscriberIdCopy', file: File | null) => {
    if (file) {
      const validation = validateFile(file);
      if (!validation.valid) {
        toast({
          title: "שגיאה בקובץ",
          description: validation.error,
          variant: "destructive"
        });
        return;
      }
    }
    
    updateFormData(field, {
      file,
      required: true,
      uploaded: !!file
    });
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const commonValidation = validateCommonFields(
      formData.fullName,
      formData.idNumber,
      formData.phone,
      formData.email
    );

    const errors = [...commonValidation.errors];

    if (!formData.currentProvider.trim()) {
      errors.push("חובה לבחור ספק נוכחי");
    }

    if (!formData.subscriberNumber.trim()) {
      errors.push("חובה למלא מספר מנוי/לקוח");
    }

    if (!formData.powerOfAttorneyExpiry || !validateFutureDate(formData.powerOfAttorneyExpiry)) {
      errors.push("תאריך פקיעת ייפוי הכוח חייב להיות עתידי");
    }

    if (!formData.subscriberIdCopy.uploaded) {
      errors.push("חובה לצרף צילום ת.ז.");
    }

    if (!agreeToTerms || !agreeToPrivacy) {
      errors.push("חובה לאשר הסכמה לתנאים ולמדיניות הפרטיות");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const generatePDF = async () => {
    const powerOfAttorney = getPowerOfAttorneyText('tv', 'private');
    const today = new Date().toLocaleDateString('he-IL');
    
    const content = [
      `תאריך: ${today}`,
      "",
      "פרטי המסלול הנבחר:",
      `חברה: ${selectedPlan.company}`,
      `מסלול: ${selectedPlan.planName}`,
      `מחיר: ${selectedPlan.regularPrice ? `₪${selectedPlan.regularPrice}/חודש` : 'לא צוין'}`,
      "",
      "פרטי הלקוח:",
      `שם מלא: ${formData.fullName}`,
      `ת.ז.: ${formData.idNumber}`,
      `טלפון: ${formData.phone}`,
      `אימייל: ${formData.email}`,
      "",
      "פרטי השירות:",
      `ספק נוכחי: ${formData.currentProvider}`,
      `מספר מנוי: ${formData.subscriberNumber}`,
      `ספק יעד: ${formData.targetProvider}`,
      `חבילה מבוקשת: ${formData.requestedPackage}`,
      `אופן החזרת ציוד: ${formData.equipmentReturnMethod === 'courier' ? 'שליח' : 'נקודת מסירה'}`,
      `תוקף ייפוי כוח עד: ${formData.powerOfAttorneyExpiry}`,
      "",
      "ייפוי כוח:",
      powerOfAttorney.full
        .replace('[שם מלא]', formData.fullName)
        .replace('[מס׳]', formData.idNumber)
        .replace('[ספק נוכחי]', formData.currentProvider)
        .replace('[תאריך פקיעה]', formData.powerOfAttorneyExpiry),
      "",
      "מסמכים מצורפים:",
      "✓ צילום ת.ז."
    ];

    const pdf = await createHebrewPDF(
      "טופס בקשת מעבר ספק טלוויזיה - לקוח פרטי",
      content
    );

    const fileName = `tv-switch-${formData.fullName.replace(/\s+/g, '-')}-${today.replace(/\//g, '-')}.pdf`;
    pdf.save(fileName);

    return fileName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (!validation.isValid) {
      toast({
        title: "שגיאות בטופס",
        description: validation.errors.join(", "),
        variant: "destructive"
      });
      return;
    }

    try {
      const fileName = await generatePDF();
      const referenceNumber = `REF-TV-${Date.now()}`;
      
      toast({
        title: "הבקשה נשלחה בהצלחה!",
        description: `מספר אסמכתא: ${referenceNumber}. הקובץ ${fileName} נשמר במחשב שלך.`
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "שגיאה ביצירת הקובץ",
        description: "אנא נסה שוב",
        variant: "destructive"
      });
    }
  };

  const checklistItems = getChecklistItems('tv', 'private');

  return (
    <form onSubmit={handleSubmit} className="space-y-1" dir="rtl">
      {/* Personal Details */}
      <Card>
        <CardHeader className="py-0.5 px-1.5">
          <CardTitle className="text-[9px] font-semibold">פרטים אישיים</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-1 py-1 px-1.5">
          <div>
            <Label htmlFor="fullName" className="text-[8px]">שם מלא *</Label>
            <Input
              id="fullName"
              placeholder="שם מלא"
              value={formData.fullName}
              onChange={(e) => updateFormData("fullName", e.target.value)}
              required
              className="h-6 text-[11px]"
            />
          </div>
          <div>
            <Label htmlFor="idNumber" className="text-[8px]">ת.ז. *</Label>
            <Input
              id="idNumber"
              placeholder="9 ספרות"
              value={formData.idNumber}
              onChange={(e) => updateFormData("idNumber", e.target.value)}
              maxLength={9}
              required
              className="h-6 text-[11px]"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-[8px]">נייד *</Label>
            <Input
              id="phone"
              placeholder="05X-XXX"
              value={formData.phone}
              onChange={(e) => updateFormData("phone", e.target.value)}
              required
              className="h-6 text-[11px]"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-[8px]">מייל *</Label>
            <Input
              id="email"
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

      {/* Service Details */}
      <Card>
        <CardHeader className="py-0.5 px-1.5">
          <CardTitle className="text-[9px] font-semibold">פרטי שירות</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-1 py-1 px-1.5">
          <div>
            <Label htmlFor="currentProvider" className="text-[8px]">ספק נוכחי *</Label>
            <Select onValueChange={(value) => updateFormData("currentProvider", value)}>
              <SelectTrigger className="h-6 text-[11px]">
                <SelectValue placeholder="בחר" />
              </SelectTrigger>
              <SelectContent>
                {providers.map(provider => (
                  <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="subscriberNumber" className="text-[8px]">מס׳ מנוי *</Label>
            <Input
              id="subscriberNumber"
              placeholder="מנוי"
              value={formData.subscriberNumber}
              onChange={(e) => updateFormData("subscriberNumber", e.target.value)}
              required
              className="h-6 text-[11px]"
            />
          </div>
          <div>
            <Label htmlFor="targetProvider" className="text-[8px]">יעד *</Label>
            <Input
              id="targetProvider"
              value={formData.targetProvider}
              disabled
              className="h-6 text-[11px]"
            />
          </div>
          <div>
            <Label htmlFor="powerOfAttorneyExpiry" className="text-[8px]">תוקף *</Label>
            <Input
              id="powerOfAttorneyExpiry"
              type="date"
              value={formData.powerOfAttorneyExpiry}
              onChange={(e) => updateFormData("powerOfAttorneyExpiry", e.target.value)}
              required
              className="h-6 text-[11px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* File & Terms */}
      <Card>
        <CardHeader className="py-0.5 px-1.5">
          <CardTitle className="text-[9px] font-semibold">מסמכים והסכמות</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 py-1 px-1.5">
          <div>
            <Label className="flex items-center gap-0.5 text-[8px]">
              <Upload className="h-2.5 w-2.5" />
              ת.ז. *
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
            <Checkbox
              id="agreeToTerms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
              className="h-3 w-3"
            />
            <label htmlFor="agreeToTerms" className="text-[8px] leading-tight">
              מסכים/ה לתנאים
            </label>
          </div>
          <div className="flex items-start gap-1">
            <Checkbox
              id="agreeToPrivacy"
              checked={agreeToPrivacy}
              onCheckedChange={(checked) => setAgreeToPrivacy(checked === true)}
              className="h-3 w-3"
            />
            <label htmlFor="agreeToPrivacy" className="text-[8px] leading-tight">
              מסכים/ה לפרטיות
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-1 pt-1">
        <Button type="submit" className="flex-1 h-6 text-[11px]">
          <FileText className="h-2.5 w-2.5 ml-0.5" />
          שלח
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="h-6 text-[11px]">
          ביטול
        </Button>
      </div>
    </form>
  );
};