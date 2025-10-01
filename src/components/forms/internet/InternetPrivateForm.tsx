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
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <Card>
        <CardHeader><CardTitle>פרטים אישיים</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center gap-2">
              שם מלא *
              <FieldInfoTooltip content={fieldInfo.fullName} />
            </Label>
            <Input 
              placeholder="שם פרטי ושם משפחה"
              value={formData.fullName} 
              onChange={(e) => updateFormData("fullName", e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label className="flex items-center gap-2">
              מס׳ תעודת זהות *
              <FieldInfoTooltip content={fieldInfo.idNumber} />
            </Label>
            <Input 
              placeholder="9 ספרות"
              value={formData.idNumber} 
              onChange={(e) => updateFormData("idNumber", e.target.value)} 
              maxLength={9}
              required 
            />
          </div>
          <div>
            <Label className="flex items-center gap-2">
              טלפון נייד *
              <FieldInfoTooltip content={fieldInfo.phone} />
            </Label>
            <Input 
              placeholder="05X-XXXXXXX"
              value={formData.phone} 
              onChange={(e) => updateFormData("phone", e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label className="flex items-center gap-2">
              דוא״ל *
              <FieldInfoTooltip content={fieldInfo.email} />
            </Label>
            <Input 
              type="email" 
              placeholder="name@example.com"
              value={formData.email} 
              onChange={(e) => updateFormData("email", e.target.value)} 
              required 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>פרטי השירות</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center gap-2">
              ספק תשתית נוכחי *
              <FieldInfoTooltip content={fieldInfo.infrastructureProvider} />
            </Label>
            <Select onValueChange={(value) => updateFormData("infrastructureProvider", value)}>
              <SelectTrigger><SelectValue placeholder="בחר/י ספק תשתית" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="בזק">בזק</SelectItem>
                <SelectItem value="HOT">HOT</SelectItem>
                <SelectItem value="סיב אחר">סיב אחר</SelectItem>
                <SelectItem value="אחר">אחר</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="flex items-center gap-2">
              ספק אינטרנט (ISP) נוכחי *
              <FieldInfoTooltip content={fieldInfo.currentISP} />
            </Label>
            <Input 
              placeholder="בחר/י או כתוב/י"
              value={formData.currentISP} 
              onChange={(e) => updateFormData("currentISP", e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label className="flex items-center gap-2">
              מזהה קו/מנוי/ONT *
              <FieldInfoTooltip content={fieldInfo.lineIdentifier} />
            </Label>
            <Input 
              placeholder="מספר או מזהה ציוד"
              value={formData.lineIdentifier} 
              onChange={(e) => updateFormData("lineIdentifier", e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label className="flex items-center gap-2">
              ספק יעד + חבילה *
              <FieldInfoTooltip content={fieldInfo.requestedPackage} />
            </Label>
            <Input 
              placeholder="בחר/י חבילה"
              value={formData.requestedPackage} 
              onChange={(e) => updateFormData("requestedPackage", e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label className="flex items-center gap-2">
              תוקף ייפוי כוח *
              <FieldInfoTooltip content={fieldInfo.powerOfAttorneyExpiry} />
            </Label>
            <Input 
              type="date" 
              value={formData.powerOfAttorneyExpiry} 
              onChange={(e) => updateFormData("powerOfAttorneyExpiry", e.target.value)} 
              required 
            />
            <p className="text-sm text-muted-foreground mt-1">בחר/י תאריך (מומלץ 12 חודשים)</p>
          </div>
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox 
                id="bundleService"
                checked={formData.isBundleService}
                onCheckedChange={(checked) => updateFormData("isBundleService", checked as boolean)}
              />
              <Label htmlFor="bundleService" className="text-sm flex items-start gap-2">
                התשתית וה-ISP באותה חבילה (דורש שתי בקשות)
                <FieldInfoTooltip content={fieldInfo.isBundleService} />
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>העלאת מסמכים</CardTitle></CardHeader>
        <CardContent>
          <Label className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            צילום ת״ז (חובה) *
            <FieldInfoTooltip content={fieldInfo.subscriberIdCopy} />
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
        </CardContent>
      </Card>

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

      <Card>
        <CardHeader><CardTitle>הסכמות</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2">
            <Checkbox checked={agreeToTerms} onCheckedChange={(checked) => setAgreeToTerms(checked === true)} />
            <label className="text-sm">אני מסכים/ה לתנאי השימוש</label>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox checked={agreeToPrivacy} onCheckedChange={(checked) => setAgreeToPrivacy(checked === true)} />
            <label className="text-sm">אני מסכים/ה למדיניות הפרטיות</label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 pt-4">
        <Button type="submit" className="flex-1"><FileText className="h-4 w-4 ml-2" />שלח בקשה וצור PDF</Button>
        <Button type="button" variant="outline" onClick={onClose}>ביטול</Button>
      </div>
    </form>
  );
};