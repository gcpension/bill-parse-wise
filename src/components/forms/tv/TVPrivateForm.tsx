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
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">פרטים אישיים</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">שם מלא *</Label>
            <Input
              id="fullName"
              placeholder="הקלד/י שם מלא"
              value={formData.fullName}
              onChange={(e) => updateFormData("fullName", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="idNumber">ת.ז. *</Label>
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
            <Label htmlFor="phone">נייד *</Label>
            <Input
              id="phone"
              placeholder="05X-XXXXXXX"
              value={formData.phone}
              onChange={(e) => updateFormData("phone", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">אימייל *</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@email.com"
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
            <Label htmlFor="subscriberNumber">מספר מנוי/לקוח *</Label>
            <Input
              id="subscriberNumber"
              placeholder="מספר מנוי"
              value={formData.subscriberNumber}
              onChange={(e) => updateFormData("subscriberNumber", e.target.value)}
              required
            />
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
            <Label htmlFor="requestedPackage">חבילה מבוקשת</Label>
            <Input
              id="requestedPackage"
              placeholder="שם החבילה"
              value={formData.requestedPackage}
              onChange={(e) => updateFormData("requestedPackage", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="equipmentReturn">אופן החזרת ציוד *</Label>
            <Select onValueChange={(value) => updateFormData("equipmentReturnMethod", value as any)} defaultValue="courier">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="שליח">שליח</SelectItem>
                <SelectItem value="נק׳ מסירה">נק׳ מסירה</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="powerOfAttorneyExpiry">תוקף ייפוי כוח *</Label>
            <Input
              id="powerOfAttorneyExpiry"
              type="date"
              value={formData.powerOfAttorneyExpiry}
              onChange={(e) => updateFormData("powerOfAttorneyExpiry", e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">מסמכים מצורפים</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              צילום ת.ז. *
            </Label>
            <Input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileUpload("subscriberIdCopy", e.target.files?.[0] || null)}
              className="mt-2"
            />
            {formData.subscriberIdCopy.uploaded && (
              <p className="text-sm text-green-600 mt-1">✓ קובץ הועלה בהצלחה</p>
            )}
          </div>
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
              אני מסכים/ה לתנאי השימוש ולביצוע המעבר כמפורט
            </label>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox
              id="agreeToPrivacy"
              checked={agreeToPrivacy}
              onCheckedChange={(checked) => setAgreeToPrivacy(checked === true)}
            />
            <label htmlFor="agreeToPrivacy" className="text-sm">
              אני מסכים/ה למדיניות הפרטיות ולעיבוד הנתונים לצורך המעבר
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