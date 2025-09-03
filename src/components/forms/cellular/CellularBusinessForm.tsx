import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, AlertTriangle } from "lucide-react";
import { ManualPlan } from "@/data/manual-plans";
import { CellularBusinessForm as FormData } from "@/types/switchForms";
import { useToast } from "@/hooks/use-toast";
import { validateSignatoryFields, validateCompanyId, validateIsraeliMobile, validateFutureDate, validateFile } from "@/lib/formValidations";
import { getPowerOfAttorneyText, getChecklistItems } from "@/lib/powerOfAttorneyTexts";
import { createHebrewPDF } from "@/lib/pdfUtils";

interface CellularBusinessFormProps {
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

export const CellularBusinessForm = ({ selectedPlan, onClose }: CellularBusinessFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    companyId: "",
    authorizedSignatory: "",
    signatoryId: "",
    signatoryRole: "",
    contactEmail: "",
    currentProvider: "",
    targetProvider: selectedPlan.company,
    customerNumber: "",
    phoneNumbers: [""],
    powerOfAttorneyExpiry: "",
    companyRegistration: { file: null, required: true, uploaded: false },
    signatoryIdCopy: { file: null, required: true, uploaded: false }
  });

  const [phoneNumbersText, setPhoneNumbersText] = useState("");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneNumbersTextChange = (text: string) => {
    setPhoneNumbersText(text);
    // Parse CSV or line-separated phone numbers
    const numbers = text
      .split(/[,\n\r\t]/)
      .map(num => num.trim())
      .filter(num => num.length > 0);
    
    updateFormData("phoneNumbers", numbers.length > 0 ? numbers : [""]);
  };

  const handleFileUpload = (field: 'companyRegistration' | 'signatoryIdCopy', file: File | null) => {
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
    const errors: string[] = [];

    if (!formData.companyName.trim()) {
      errors.push("חובה למלא שם התאגיד");
    }

    if (!formData.companyId.trim()) {
      errors.push("חובה למלא ח.פ./ח.צ.");
    } else if (!validateCompanyId(formData.companyId)) {
      errors.push("מספר תאגיד חייב לכלול 8–9 ספרות");
    }

    const signatoryValidation = validateSignatoryFields(
      formData.authorizedSignatory,
      formData.signatoryId,
      formData.contactEmail
    );
    errors.push(...signatoryValidation.errors);

    if (!formData.signatoryRole.trim()) {
      errors.push("חובה למלא תפקיד מורשה החתימה");
    }

    if (!formData.currentProvider.trim()) {
      errors.push("חובה לבחור ספק נוכחי");
    }

    // Validate phone numbers
    const validPhoneNumbers = formData.phoneNumbers.filter(phone => phone.trim());
    if (validPhoneNumbers.length === 0) {
      errors.push("חובה למלא לפחות מספר טלפון אחד");
    }

    validPhoneNumbers.forEach((phone, index) => {
      if (!validateIsraeliMobile(phone)) {
        errors.push(`מספר טלפון ${index + 1} אינו תקין`);
      }
    });

    if (!formData.powerOfAttorneyExpiry || !validateFutureDate(formData.powerOfAttorneyExpiry)) {
      errors.push("תאריך פקיעת ייפוי הכוח חייב להיות עתידי");
    }

    if (!formData.companyRegistration.uploaded) {
      errors.push("חובה לצרף נסח חברה");
    }

    if (!formData.signatoryIdCopy.uploaded) {
      errors.push("חובה לצרף צילום ת.ז. מורשה חתימה");
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
    const powerOfAttorney = getPowerOfAttorneyText('cellular', 'business');
    const today = new Date().toLocaleDateString('he-IL');
    
    const validPhoneNumbers = formData.phoneNumbers.filter(phone => phone.trim());
    
    const content = [
      `תאריך: ${today}`,
      "",
      "פרטי המסלול הנבחר:",
      `חברה: ${selectedPlan.company}`,
      `מסלול: ${selectedPlan.planName}`,
      `מחיר: ${selectedPlan.regularPrice ? `₪${selectedPlan.regularPrice}/חודש` : 'לא צוין'}`,
      selectedPlan.dataAmount ? `כמות גלישה: ${selectedPlan.dataAmount}` : "",
      "",
      "פרטי התאגיד:",
      `שם תאגיד: ${formData.companyName}`,
      `ח.פ./ח.צ.: ${formData.companyId}`,
      `מורשה חתימה: ${formData.authorizedSignatory}`,
      `ת.ז. מורשה חתימה: ${formData.signatoryId}`,
      `תפקיד: ${formData.signatoryRole}`,
      `אימייל איש קשר: ${formData.contactEmail}`,
      "",
      "פרטי השירות:",
      `ספק נוכחי: ${formData.currentProvider}`,
      `ספק יעד: ${formData.targetProvider}`,
      formData.customerNumber ? `מספר לקוח: ${formData.customerNumber}` : "",
      `תוקף ייפוי כוח עד: ${formData.powerOfAttorneyExpiry}`,
      "",
      "מספרי קווים להעברה:",
      ...validPhoneNumbers.map((phone, index) => `${index + 1}. ${phone}`),
      "",
      "ייפוי כוח:",
      powerOfAttorney.full
        .replace('[שם התאגיד]', formData.companyName)
        .replace('[מס׳]', formData.companyId)
        .replace('[תאריך פקיעה]', formData.powerOfAttorneyExpiry),
      "",
      "מסמכים מצורפים:",
      "✓ נסח חברה",
      "✓ צילום ת.ז. מורשה חתימה"
    ];

    const pdf = await createHebrewPDF(
      "טופס בקשת מעבר ספק סלולר - לקוח עסקי",
      content
    );

    const fileName = `cellular-business-switch-${formData.companyName.replace(/\s+/g, '-')}-${today.replace(/\//g, '-')}.pdf`;
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
      const referenceNumber = `REF-CEL-BUS-${Date.now()}`;
      
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

  const checklistItems = getChecklistItems('cellular', 'business');

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {/* Company Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">פרטי התאגיד</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName">שם תאגיד *</Label>
            <Input
              id="companyName"
              placeholder="שם רשמי"
              value={formData.companyName}
              onChange={(e) => updateFormData("companyName", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="companyId">ח.פ./ח.צ. *</Label>
            <Input
              id="companyId"
              placeholder="8–9 ספרות"
              value={formData.companyId}
              onChange={(e) => updateFormData("companyId", e.target.value)}
              maxLength={9}
              required
            />
          </div>
          <div>
            <Label htmlFor="authorizedSignatory">מורשה חתימה *</Label>
            <Input
              id="authorizedSignatory"
              placeholder="שם מלא"
              value={formData.authorizedSignatory}
              onChange={(e) => updateFormData("authorizedSignatory", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="signatoryId">ת.ז. מורשה חתימה *</Label>
            <Input
              id="signatoryId"
              placeholder="9 ספרות"
              value={formData.signatoryId}
              onChange={(e) => updateFormData("signatoryId", e.target.value)}
              maxLength={9}
              required
            />
          </div>
          <div>
            <Label htmlFor="signatoryRole">תפקיד מורשה *</Label>
            <Input
              id="signatoryRole"
              placeholder="תפקיד"
              value={formData.signatoryRole}
              onChange={(e) => updateFormData("signatoryRole", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="contactEmail">אימייל איש קשר *</Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="contact@company.com"
              value={formData.contactEmail}
              onChange={(e) => updateFormData("contactEmail", e.target.value)}
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
            <Label htmlFor="customerNumber">מספר לקוח (אם ידוע)</Label>
            <Input
              id="customerNumber"
              placeholder="מספר לקוח/חשבון נוכחי"
              value={formData.customerNumber || ""}
              onChange={(e) => updateFormData("customerNumber", e.target.value)}
            />
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

      {/* Phone Numbers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">רשימת מספרים</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="phoneNumbersText">מספרי טלפון להעברה *</Label>
            <Textarea
              id="phoneNumbersText"
              placeholder="הזן מספרי טלפון (מופרדים בפסיק או בשורות נפרדות)
דוגמה:
052-1234567
053-9876543
או:
052-1234567, 053-9876543"
              value={phoneNumbersText}
              onChange={(e) => handlePhoneNumbersTextChange(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
            <p className="text-sm text-muted-foreground mt-2">
              ניתן להזין מספרי טלפון מופרדים בפסיק, רווח או בשורות נפרדות
            </p>
            {formData.phoneNumbers.length > 1 && (
              <div className="mt-2 p-2 bg-muted rounded-md">
                <p className="text-sm font-medium">מספרים שזוהו ({formData.phoneNumbers.filter(p => p.trim()).length}):</p>
                <ul className="text-sm mt-1 space-y-1">
                  {formData.phoneNumbers.filter(phone => phone.trim()).map((phone, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className={validateIsraeliMobile(phone) ? "text-green-600" : "text-red-600"}>
                        {validateIsraeliMobile(phone) ? "✓" : "✗"}
                      </span>
                      {phone}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
              נסח חברה *
            </Label>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileUpload("companyRegistration", e.target.files?.[0] || null)}
              className="mt-2"
            />
            {formData.companyRegistration.uploaded && (
              <p className="text-sm text-green-600 mt-1">✓ קובץ הועלה בהצלחה</p>
            )}
          </div>
          <div>
            <Label className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              צילום ת.ז. מורשה חתימה *
            </Label>
            <Input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileUpload("signatoryIdCopy", e.target.files?.[0] || null)}
              className="mt-2"
            />
            {formData.signatoryIdCopy.uploaded && (
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
              אנו מסכימים לתנאי השימוש ולביצוע המעבר כמפורט
            </label>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox
              id="agreeToPrivacy"
              checked={agreeToPrivacy}
              onCheckedChange={(checked) => setAgreeToPrivacy(checked === true)}
            />
            <label htmlFor="agreeToPrivacy" className="text-sm">
              אנו מסכימים למדיניות הפרטיות ולעיבוד הנתונים לצורך המעבר
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
          ביטول
        </Button>
      </div>
    </form>
  );
};