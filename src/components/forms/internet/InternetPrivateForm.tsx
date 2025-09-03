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
            <Label>שם מלא *</Label>
            <Input value={formData.fullName} onChange={(e) => updateFormData("fullName", e.target.value)} required />
          </div>
          <div>
            <Label>ת.ז. *</Label>
            <Input value={formData.idNumber} onChange={(e) => updateFormData("idNumber", e.target.value)} required />
          </div>
          <div>
            <Label>טלפון *</Label>
            <Input value={formData.phone} onChange={(e) => updateFormData("phone", e.target.value)} required />
          </div>
          <div>
            <Label>אימייל *</Label>
            <Input type="email" value={formData.email} onChange={(e) => updateFormData("email", e.target.value)} required />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>פרטי השירות</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label>ספק תשתית נוכחי *</Label>
            <Select onValueChange={(value) => updateFormData("infrastructureProvider", value)}>
              <SelectTrigger><SelectValue placeholder="בחר ספק תשתית" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="בזק">בזק</SelectItem>
                <SelectItem value="HOT">HOT</SelectItem>
                <SelectItem value="סיב אחר">סיב אחר</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>ספק אינטרנט נוכחי *</Label>
            <Input value={formData.currentISP} onChange={(e) => updateFormData("currentISP", e.target.value)} required />
          </div>
          <div>
            <Label>מזהה קו/מנוי/ONT *</Label>
            <Input value={formData.lineIdentifier} onChange={(e) => updateFormData("lineIdentifier", e.target.value)} required />
          </div>
          <div>
            <Label>תוקף ייפוי כוח *</Label>
            <Input type="date" value={formData.powerOfAttorneyExpiry} onChange={(e) => updateFormData("powerOfAttorneyExpiry", e.target.value)} required />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>העלאת מסמכים</CardTitle></CardHeader>
        <CardContent>
          <Label className="flex items-center gap-2"><Upload className="h-4 w-4" />צילום ת.ז. *</Label>
          <Input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleFileUpload("subscriberIdCopy", e.target.files?.[0] || null)} />
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