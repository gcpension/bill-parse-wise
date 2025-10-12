import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Upload, FileText, AlertCircle } from "lucide-react";
import { ManualPlan } from "@/data/manual-plans";
import { ElectricityPrivateForm as FormData } from "@/types/switchForms";
import { useToast } from "@/hooks/use-toast";
import { validateCommonFields, validateFutureDate, validateFile } from "@/lib/formValidations";
import { getPowerOfAttorneyText, getChecklistItems } from "@/lib/powerOfAttorneyTexts";
import { createHebrewPDF } from "@/lib/pdfUtils";
import { FieldInfoTooltip, fieldInfo } from "@/components/ui/field-info-tooltip";

interface ElectricityPrivateFormProps {
  selectedPlan: ManualPlan;
  onClose: () => void;
}

const providers = [
  "חברת החשמל",
  "נקסט אנרגיה",
  "פז פאור",
  "אלקטרה פאור",
  "סלולר אנרגיה",
  "אחר"
];

export const ElectricityPrivateForm = ({ selectedPlan, onClose }: ElectricityPrivateFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    idNumber: "",
    phone: "",
    email: "",
    currentProvider: "",
    targetProvider: selectedPlan.company,
    contractNumber: "",
    meterNumber: "",
    consumptionAddress: "",
    powerOfAttorneyExpiry: "",
    consumerIdCopy: { file: null, required: true, uploaded: false },
    attorneyIdCopy: { file: null, required: false, uploaded: false }
  });

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: 'consumerIdCopy' | 'attorneyIdCopy', file: File | null) => {
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

    if (!formData.contractNumber.trim() && !formData.meterNumber.trim()) {
      errors.push("יש להזין מספר חוזה או מספר מונה (לפחות אחד)");
    }

    if (!formData.consumptionAddress.trim()) {
      errors.push("יש להזין כתובת אתר צריכה");
    }

    if (!formData.powerOfAttorneyExpiry || !validateFutureDate(formData.powerOfAttorneyExpiry)) {
      errors.push("תוקף ייפוי הכוח חייב להיות עתידי");
    }

    if (!formData.consumerIdCopy.uploaded) {
      errors.push("יש להעלות את כל המסמכים המסומנים כחובה");
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
    const powerOfAttorney = getPowerOfAttorneyText('electricity', 'private');
    const today = new Date().toLocaleDateString('he-IL');
    
    const content = [
      `תאריך יצירת הבקשה: ${today}`,
      `שעת יצירה: ${new Date().toLocaleTimeString('he-IL')}`,
      "",
      "=== פרטי המסלול הנבחר ===",
      `חברת היעד: ${selectedPlan.company}`,
      `שם המסלול: ${selectedPlan.planName}`,
      `קטגוריה: ${selectedPlan.category}`,
      `מחיר חודשי: ${selectedPlan.regularPrice ? `₪${selectedPlan.regularPrice}` : 'לא צוין'}`,
      selectedPlan.downloadSpeed ? `מהירות הורדה: ${selectedPlan.downloadSpeed}` : "",
      selectedPlan.uploadSpeed ? `מהירות העלאה: ${selectedPlan.uploadSpeed}` : "",
      selectedPlan.dataAmount ? `כמות נתונים: ${selectedPlan.dataAmount}` : "",
      "",
      "=== פרטי הלקוח ===",
      `שם מלא: ${formData.fullName}`,
      `מספר תעודת זהות: ${formData.idNumber}`,
      `מספר טלפון: ${formData.phone}`,
      `כתובת אימייל: ${formData.email}`,
      "",
      "=== פרטי שירות החשמל ===",
      `ספק חשמל נוכחי: ${formData.currentProvider}`,
      `ספק חשמל יעד: ${formData.targetProvider}`,
      `מספר חוזה: ${formData.contractNumber || 'לא צוין'}`,
      `מספר מונה: ${formData.meterNumber || 'לא צוין'}`,
      `כתובת אתר הצריכה: ${formData.consumptionAddress}`,
      `תאריך פקיעת ייפוי הכוח: ${formData.powerOfAttorneyExpiry}`,
      formData.billingNotes ? `הערות לחשבונית: ${formData.billingNotes}` : "",
      "",
      "=== ייפוי כוח מלא ===",
      powerOfAttorney.full
        .replace('[שם מלא]', formData.fullName)
        .replace('[מס׳]', formData.idNumber)
        .replace('[מס׳ חוזה/מונה]', formData.contractNumber || formData.meterNumber || 'לא צוין')
        .replace('[כתובת]', formData.consumptionAddress)
        .replace('[תאריך פקיעה]', formData.powerOfAttorneyExpiry),
      "",
      "=== מסמכים מצורפים ===",
      formData.consumerIdCopy.uploaded ? "✓ צילום תעודת זהות של הצרכן" : "✗ צילום ת.ז. צרכן - לא הועלה",
      formData.attorneyIdCopy.uploaded ? "✓ צילום תעודת זהות של מיופה הכוח" : "✗ צילום ת.ז. מיופה הכוח - לא הועלה",
      "",
      "=== פרטים נוספים ===",
      `מספר אסמכתא: REF-ELE-${Date.now()}`,
      `זמן שליחה מדויק: ${new Date().toISOString()}`,
      `סטטוס בקשה: ממתין לעיבוד`,
      "",
      "=== הוראות המשך ===",
      "• בקשה זו נשלחה אוטומטית למערכת",
      "• תקבלו אישור בטלפון ו/או במייל תוך 24-48 שעות",
      "• במקרה של שאלות ניתן לפנות לשירות הלקוחות",
      "• שמרו מסמך זה לעיון עתידי"
    ].filter(line => line !== ""); // Remove empty lines from conditions

    const pdf = await createHebrewPDF(
      "טופס בקשת מעבר ספק חשמל - לקוח פרטי",
      content
    );

    const fileName = `electricity-switch-${formData.fullName.replace(/\s+/g, '-')}-${today.replace(/\//g, '-')}.pdf`;
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
      const referenceNumber = `REF-ELE-${Date.now()}`;
      
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

  const checklistItems = getChecklistItems('electricity', 'private');

  return (
    <form onSubmit={handleSubmit} className="space-y-1" dir="rtl">
      {/* Personal Details */}
      <Card>
        <CardHeader className="py-0.5 px-1.5">
          <CardTitle className="text-[9px] font-semibold">פרטים אישיים</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-1 py-1 px-1.5">
          <div className="space-y-0">
            <Label htmlFor="fullName" className="flex items-center gap-0.5 text-[8px]">
              שם מלא *
              <FieldInfoTooltip content={fieldInfo.fullName} />
            </Label>
            <Input
              id="fullName"
              placeholder="שם מלא"
              value={formData.fullName}
              onChange={(e) => updateFormData("fullName", e.target.value)}
              required
              className="h-6 text-[11px]"
            />
          </div>
          <div className="space-y-0">
            <Label htmlFor="idNumber" className="flex items-center gap-0.5 text-[8px]">
              ת.ז. *
              <FieldInfoTooltip content={fieldInfo.idNumber} />
            </Label>
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
          <div className="space-y-0">
            <Label htmlFor="phone" className="flex items-center gap-0.5 text-[8px]">
              נייד *
              <FieldInfoTooltip content={fieldInfo.phone} />
            </Label>
            <Input
              id="phone"
              placeholder="05X-XXX"
              value={formData.phone}
              onChange={(e) => updateFormData("phone", e.target.value)}
              required
              className="h-6 text-[11px]"
            />
          </div>
          <div className="space-y-0">
            <Label htmlFor="email" className="flex items-center gap-0.5 text-[8px]">
              מייל *
              <FieldInfoTooltip content={fieldInfo.email} />
            </Label>
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
          <div className="space-y-0">
            <Label htmlFor="currentProvider" className="flex items-center gap-0.5 text-[8px]">
              ספק נוכחי *
              <FieldInfoTooltip content={fieldInfo.currentProvider} />
            </Label>
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
          <div className="space-y-0">
            <Label htmlFor="targetProvider" className="flex items-center gap-0.5 text-[8px]">
              יעד *
            </Label>
            <Input
              id="targetProvider"
              value={formData.targetProvider}
              disabled
              className="h-6 text-[11px]"
            />
          </div>
          <div className="space-y-0">
            <Label htmlFor="contractNumber" className="text-[8px]">
              מס׳ חוזה
            </Label>
            <Input
              id="contractNumber"
              placeholder="אופ׳"
              value={formData.contractNumber}
              onChange={(e) => updateFormData("contractNumber", e.target.value)}
              className="h-6 text-[11px]"
            />
          </div>
          <div className="space-y-0">
            <Label htmlFor="meterNumber" className="text-[8px]">
              מס׳ מונה
            </Label>
            <Input
              id="meterNumber"
              placeholder="אופ׳"
              value={formData.meterNumber}
              onChange={(e) => updateFormData("meterNumber", e.target.value)}
              className="h-6 text-[11px]"
            />
          </div>
          <div className="col-span-2 space-y-0">
            <Label htmlFor="consumptionAddress" className="text-[8px]">
              כתובת צריכה *
            </Label>
            <Input
              id="consumptionAddress"
              placeholder="רחוב, מס׳, עיר"
              value={formData.consumptionAddress}
              onChange={(e) => updateFormData("consumptionAddress", e.target.value)}
              required
              className="h-6 text-[11px]"
            />
          </div>
          <div className="space-y-0">
            <Label htmlFor="powerOfAttorneyExpiry" className="text-[8px]">
              תוקף ייפוי *
            </Label>
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
              ת״ז *
            </Label>
            <Input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileUpload("consumerIdCopy", e.target.files?.[0] || null)}
              className="h-6 text-[11px]"
            />
            {formData.consumerIdCopy.uploaded && (
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