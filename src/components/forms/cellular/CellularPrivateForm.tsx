import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Plus, Trash2, AlertTriangle } from "lucide-react";
import { ManualPlan } from "@/data/manual-plans";
import { CellularPrivateForm as FormData } from "@/types/switchForms";
import { useToast } from "@/hooks/use-toast";
import { validateCommonFields, validateIsraeliMobile, validateFutureDate, validateFile } from "@/lib/formValidations";
import { getPowerOfAttorneyText, getChecklistItems } from "@/lib/powerOfAttorneyTexts";
import { createHebrewPDF } from "@/lib/pdfUtils";
import { FieldInfoTooltip, fieldInfo } from "@/components/ui/field-info-tooltip";

interface CellularPrivateFormProps {
  selectedPlan: ManualPlan;
  onClose: () => void;
}

const providers = [
  "פלאפון",
  "סלקום",
  "פרטנר",
  "HOT Mobile",
  "גולן טלקום",
  "רמי לוי",
  "אחר"
];

export const CellularPrivateForm = ({ selectedPlan, onClose }: CellularPrivateFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    idNumber: "",
    phone: "",
    email: "",
    currentProvider: "",
    targetProvider: selectedPlan.company,
    phoneNumbers: [""],
    powerOfAttorneyExpiry: "",
    acceptOtpConfirmation: false,
    subscriberIdCopy: { file: null, required: true, uploaded: false }
  });

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);
  const [showHotMobileWarning, setShowHotMobileWarning] = useState(false);

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addPhoneNumber = () => {
    setFormData(prev => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, ""]
    }));
  };

  const removePhoneNumber = (index: number) => {
    if (formData.phoneNumbers.length > 1) {
      setFormData(prev => ({
        ...prev,
        phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== index)
      }));
    }
  };

  const updatePhoneNumber = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.map((phone, i) => 
        i === index ? value : phone
      )
    }));
  };

  const handleProviderChange = (provider: string) => {
    updateFormData("currentProvider", provider);
    setShowHotMobileWarning(provider === "HOT Mobile");
  };

  const handleFileUpload = (field: 'subscriberIdCopy' | 'lastBill', file: File | null) => {
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
      required: field === 'subscriberIdCopy',
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

    // Validate phone numbers
    const validPhoneNumbers = formData.phoneNumbers.filter(phone => phone.trim());
    if (validPhoneNumbers.length === 0) {
      errors.push("חובה למלא לפחות מספר טלפון אחד להעברה");
    }

    validPhoneNumbers.forEach((phone, index) => {
      if (!validateIsraeliMobile(phone)) {
        errors.push(`מספר טלפון ${index + 1} אינו תקין`);
      }
    });

    if (!formData.powerOfAttorneyExpiry || !validateFutureDate(formData.powerOfAttorneyExpiry)) {
      errors.push("תאריך פקיעת ייפוי הכוח חייב להיות עתידי");
    }

    if (!formData.acceptOtpConfirmation) {
      errors.push("יש לאשר קבלת OTP ב-SIM הנוכחי");
    }

    if (!formData.subscriberIdCopy.uploaded) {
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
    const powerOfAttorney = getPowerOfAttorneyText('cellular', 'private');
    const today = new Date().toLocaleDateString('he-IL');
    
    const validPhoneNumbers = formData.phoneNumbers.filter(phone => phone.trim());
    
    const content = [
      `תאריך יצירת הבקשה: ${today}`,
      `שעת יצירה: ${new Date().toLocaleTimeString('he-IL')}`,
      "",
      "=== פרטי המסלול הנבחר ===",
      `חברת היעד: ${selectedPlan.company}`,
      `שם המסלול: ${selectedPlan.planName}`,
      `קטגוריה: ${selectedPlan.category}`,
      `מחיר חודשי: ${selectedPlan.regularPrice ? `₪${selectedPlan.regularPrice}` : 'לא צוין'}`,
      selectedPlan.downloadSpeed ? `מהירות אינטרנט: ${selectedPlan.downloadSpeed}` : "",
      selectedPlan.dataAmount ? `כמות נתונים: ${selectedPlan.dataAmount}` : "",
      selectedPlan.callMinutes ? `דקות שיחה: ${selectedPlan.callMinutes}` : "",
      selectedPlan.smsAmount ? `כמות SMS: ${selectedPlan.smsAmount}` : "",
      "",
      "=== פרטי הלקוח ===",
      `שם מלא: ${formData.fullName}`,
      `מספר תעודת זהות: ${formData.idNumber}`,
      `מספר טלפון ליצירת קשר: ${formData.phone}`,
      `כתובת אימייל: ${formData.email}`,
      "",
      "=== פרטי השירות הסלולרי ===",
      `ספק סלולרי נוכחי: ${formData.currentProvider}`,
      `ספק סלולרי יעד: ${formData.targetProvider}`,
      `תאריך פקיעת ייפוי הכוח: ${formData.powerOfAttorneyExpiry}`,
      "",
      "=== מספרי קווים להעברה ===",
      ...validPhoneNumbers.map((phone, index) => `${index + 1}. ${phone}`),
      `סך הכל קווים להעברה: ${validPhoneNumbers.length}`,
      "",
      "=== אישורים ===",
      formData.acceptOtpConfirmation ? "✓ מאושר: יש ברשותי את כרטיס ה-SIM הנוכחי ואוכל לקבל OTP" : "✗ לא מאושר קבלת OTP",
      "",
      showHotMobileWarning ? "⚠️ תזכורת חשובה: עבור לקוחות HOT Mobile - יש להתקשר למוקד השירות לאחר קבלת כרטיס ה-SIM החדש לאישור הפעלה" : "",
      "",
      "=== ייפוי כוח מלא ===",
      powerOfAttorney.full
        .replace('[שם מלא]', formData.fullName)
        .replace('[מס׳]', formData.idNumber)
        .replace('[תאריך פקיעה]', formData.powerOfAttorneyExpiry),
      "",
      "=== מסמכים מצורפים ===",
      formData.subscriberIdCopy.uploaded ? "✓ צילום תעודת זהות בעל המנוי" : "✗ צילום ת.ז. בעל המנוי - לא הועלה",
      formData.lastBill?.uploaded ? "✓ חשבונית אחרונה" : "- חשבונית אחרונה (אופציונלי) - לא הועלה",
      "",
      "=== פרטים נוספים ===",
      `מספר אסמכתא: REF-CEL-${Date.now()}`,
      `זמן שליחה מדויק: ${new Date().toISOString()}`,
      `סטטוס בקשה: ממתין לעיבוד`,
      "",
      "=== הוראות המשך ===",
      "• בקשה זו נשלחה אוטומטית למערכת",
      "• תקבלו הודעת SMS לאישור תחילת תהליך הניוד",
      "• חובה לאשר את הודעת ה-OTP ב-SIM הנוכחי",
      "• התהליך יושלם תוך 2-7 ימי עסקים",
      showHotMobileWarning ? "• לקוחות HOT Mobile: התקשרו למוקד לאחר קבלת SIM חדש" : "",
      "• שמרו מסמך זה לעיון עתידי"
    ].filter(line => line !== ""); // Remove empty lines

    const pdf = await createHebrewPDF(
      "טופס בקשת מעבר ספק סלולר - לקוח פרטי",
      content
    );

    const fileName = `cellular-switch-${formData.fullName.replace(/\s+/g, '-')}-${today.replace(/\//g, '-')}.pdf`;
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
      const referenceNumber = `REF-CEL-${Date.now()}`;
      
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

  const checklistItems = getChecklistItems('cellular', 'private');

  return (
    <form onSubmit={handleSubmit} className="space-y-1" dir="rtl">
      {/* Personal Details */}
      <Card>
        <CardHeader className="py-0.5 px-1.5">
          <CardTitle className="text-[9px] font-semibold">פרטים אישיים</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-1 py-1 px-1.5">
          <div>
            <Label htmlFor="fullName" className="text-[8px]">
              שם מלא *
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
          <div>
            <Label htmlFor="idNumber" className="text-[8px]">
              ת.ז. *
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
          <div>
            <Label htmlFor="phone" className="text-[8px]">
              נייד *
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
          <div>
            <Label htmlFor="email" className="text-[8px]">
              מייל *
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
          <div>
            <Label htmlFor="currentProvider" className="text-[8px]">
              ספק נוכחי *
            </Label>
            <Select onValueChange={handleProviderChange}>
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
            <Label htmlFor="targetProvider" className="text-[8px]">
              יעד *
            </Label>
            <Input
              id="targetProvider"
              value={formData.targetProvider}
              disabled
              className="h-6 text-[11px]"
            />
          </div>
          <div>
            <Label htmlFor="powerOfAttorneyExpiry" className="text-[8px]">
              תוקף *
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

      {/* Phone Numbers */}
      <Card>
        <CardHeader className="py-0.5 px-1.5">
          <CardTitle className="flex items-center justify-between text-[9px] font-semibold">
            קווים
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPhoneNumber}
              className="h-5 text-[10px] px-1.5"
            >
              <Plus className="h-2.5 w-2.5" />
              +
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 py-1 px-1.5">
          {formData.phoneNumbers.map((phone, index) => (
            <div key={index} className="flex gap-1 items-end">
              <div className="flex-1">
                <Label htmlFor={`phone-${index}`} className="text-[8px]">
                  קו {index + 1} *
                </Label>
                <Input
                  id={`phone-${index}`}
                  placeholder="05X-XXX"
                  value={phone}
                  onChange={(e) => updatePhoneNumber(index, e.target.value)}
                  required
                  className="h-6 text-[11px]"
                />
              </div>
              {formData.phoneNumbers.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removePhoneNumber(index)}
                  className="h-6 w-6 p-0"
                >
                  <Trash2 className="h-2.5 w-2.5" />
                </Button>
              )}
            </div>
          ))}
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
              id="acceptOtpConfirmation"
              checked={formData.acceptOtpConfirmation}
              onCheckedChange={(checked) => updateFormData("acceptOtpConfirmation", checked as boolean)}
              className="h-3 w-3"
            />
            <label htmlFor="acceptOtpConfirmation" className="text-[8px] leading-tight">
              יש לי SIM נוכחי לקבלת OTP *
            </label>
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

      {showHotMobileWarning && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="py-1 px-1.5">
            <div className="flex items-start gap-1 text-orange-800">
              <AlertTriangle className="h-3 w-3" />
              <p className="text-[8px]">HOT: התקשר למוקד לאחר קבלת SIM</p>
            </div>
          </CardContent>
        </Card>
      )}

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