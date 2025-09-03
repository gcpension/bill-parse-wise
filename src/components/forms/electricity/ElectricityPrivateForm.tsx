import { useState } from "react";
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
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">פרטים אישיים</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">שם מלא</Label>
            <Input
              id="fullName"
              placeholder="שם פרטי ושם משפחה"
              value={formData.fullName}
              onChange={(e) => updateFormData("fullName", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="idNumber">מס׳ תעודת זהות</Label>
            <Input
              id="idNumber"
              placeholder="9 ספרות"
              value={formData.idNumber}
              onChange={(e) => updateFormData("idNumber", e.target.value)}
              maxLength={9}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">טלפון נייד</Label>
            <Input
              id="phone"
              placeholder="05X-XXXXXXX"
              value={formData.phone}
              onChange={(e) => updateFormData("phone", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">דוא״ל</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Service Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">פרטי השירות</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentProvider">ספק נוכחי *</Label>
            <Select onValueChange={(value) => updateFormData("currentProvider", value)}>
              <SelectTrigger>
                <SelectValue placeholder="בחר/י ספק" />
              </SelectTrigger>
              <SelectContent>
                {providers.map(provider => (
                  <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="targetProvider">ספק יעד *</Label>
            <Input
              id="targetProvider"
              value={formData.targetProvider}
              onChange={(e) => updateFormData("targetProvider", e.target.value)}
              required
              disabled
            />
          </div>
          <div>
            <Label htmlFor="contractNumber">מס׳ חוזה (אם ידוע)</Label>
            <Input
              id="contractNumber"
              placeholder="מספר"
              value={formData.contractNumber}
              onChange={(e) => updateFormData("contractNumber", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="meterNumber">מס׳ מונה (אם ידוע)</Label>
            <Input
              id="meterNumber"
              placeholder="מספר"
              value={formData.meterNumber}
              onChange={(e) => updateFormData("meterNumber", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="consumptionAddress">כתובת אתר צריכה</Label>
            <Input
              id="consumptionAddress"
              placeholder="רחוב, מספר, עיר"
              value={formData.consumptionAddress}
              onChange={(e) => updateFormData("consumptionAddress", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="powerOfAttorneyExpiry">תוקף ייפוי כוח</Label>
            <Input
              id="powerOfAttorneyExpiry"
              type="date"
              value={formData.powerOfAttorneyExpiry}
              onChange={(e) => updateFormData("powerOfAttorneyExpiry", e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">מומלץ 12 חודשים</p>
          </div>
        </CardContent>
      </Card>

      {/* File Uploads */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">מסמכים מצורפים</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              צילום ת״ז לקוח (חובה)
            </Label>
            <Input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileUpload("consumerIdCopy", e.target.files?.[0] || null)}
              className="mt-2"
            />
            {formData.consumerIdCopy.uploaded && (
              <p className="text-sm text-green-600 mt-1">✓ קובץ הועלה בהצלחה</p>
            )}
          </div>
          <div>
            <Label className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              צילום ת״ז מיופה כוח (אם צד ג׳)
            </Label>
            <Input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileUpload("attorneyIdCopy", e.target.files?.[0] || null)}
              className="mt-2"
            />
            {formData.attorneyIdCopy.uploaded && (
              <p className="text-sm text-green-600 mt-1">✓ קובץ הועלה בהצלחה</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Optional Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">הערת תאימות</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            ייתכן אימות ישיר מהספק (SMS/קישור) לאישור סופי.
          </p>
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            צ׳קליסט לפני שליחה
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {checklistItems.map(item => (
            <div key={item.id} className="flex items-start gap-2">
              <Checkbox
                id={item.id}
                checked={checkedItems[item.id] || false}
                onCheckedChange={(checked) => setCheckedItems(prev => ({
                  ...prev,
                  [item.id]: checked as boolean
                }))}
              />
              <label htmlFor={item.id} className="text-sm leading-relaxed">
                {item.text}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Terms and Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">הסכמות</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2">
            <Checkbox
              id="agreeToTerms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
            />
            <label htmlFor="agreeToTerms" className="text-sm">
              מאשר/ת עיבוד נתונים והעברתם לספקים לצורך המעבר
            </label>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox
              id="agreeToPrivacy"
              checked={agreeToPrivacy}
              onCheckedChange={(checked) => setAgreeToPrivacy(checked === true)}
            />
            <label htmlFor="agreeToPrivacy" className="text-sm">
              אני מסכים/ה למדיניות הפרטיות ולעיבוד הנתונים
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1">
          <FileText className="h-4 w-4 ml-2" />
          שלח בקשה וצור PDF
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          ביטול
        </Button>
      </div>
    </form>
  );
};