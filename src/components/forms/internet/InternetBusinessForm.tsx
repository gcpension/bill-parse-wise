import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Plus, Trash2 } from "lucide-react";
import { ManualPlan } from "@/data/manual-plans";
import { InternetBusinessForm as FormData } from "@/types/switchForms";
import { useToast } from "@/hooks/use-toast";
import { validateCommonFields, validateCompanyId, validateIsraeliId, validateEmail, validateFutureDate, validateFile } from "@/lib/formValidations";
import { getPowerOfAttorneyText, getChecklistItems } from "@/lib/powerOfAttorneyTexts";
import { createHebrewPDF } from "@/lib/pdfUtils";

interface InternetBusinessFormProps {
  selectedPlan: ManualPlan;
  onClose: () => void;
}

const infrastructureProviders = [
  "בזק",
  "HOT",
  "סיב אחר",
  "אחר"
];

const ispProviders = [
  "בזק אינטרנשיונל",
  "HOT",
  "Partner",
  "018 Xphone",
  "NetVision",
  "אחר"
];

export const InternetBusinessForm = ({ selectedPlan, onClose }: InternetBusinessFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    companyId: "",
    authorizedSignatory: "",
    signatoryId: "",
    signatoryRole: "",
    contactEmail: "",
    infrastructureProvider: "",
    currentISP: "",
    customerAccountNumber: "",
    sites: [{ lineIdentifier: "", address: "" }],
    targetProvider: selectedPlan.company,
    requestedPackage: selectedPlan.planName,
    powerOfAttorneyExpiry: "",
    companyRegistration: { file: null, required: true, uploaded: false },
    signatoryIdCopy: { file: null, required: true, uploaded: false }
  });

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSite = () => {
    setFormData(prev => ({
      ...prev,
      sites: [...prev.sites, { lineIdentifier: "", address: "" }]
    }));
  };

  const removeSite = (index: number) => {
    if (formData.sites.length > 1) {
      setFormData(prev => ({
        ...prev,
        sites: prev.sites.filter((_, i) => i !== index)
      }));
    }
  };

  const updateSite = (index: number, field: keyof FormData['sites'][0], value: string) => {
    setFormData(prev => ({
      ...prev,
      sites: prev.sites.map((site, i) =>
        i === index ? { ...site, [field]: value } : site
      )
    }));
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
      errors.push("חובה למלא שם תאגיד");
    }

    if (!formData.companyId.trim()) {
      errors.push("חובה למלא ח.פ./ח.צ.");
    } else if (!validateCompanyId(formData.companyId)) {
      errors.push("מספר תאגיד חייב לכלול 8–9 ספרות");
    }

    if (!formData.authorizedSignatory.trim()) {
      errors.push("חובה למלא שם מורשה חתימה");
    }

    if (!formData.signatoryId.trim()) {
      errors.push("חובה למלא ת.ז. מורשה חתימה");
    } else if (!validateIsraeliId(formData.signatoryId)) {
      errors.push("ת.ז. מורשה חתימה אינה תקינה");
    }

    if (!formData.signatoryRole.trim()) {
      errors.push("חובה למלא תפקיד מורשה חתימה");
    }

    if (!formData.contactEmail.trim()) {
      errors.push("חובה למלא אימייל איש קשר");
    } else if (!validateEmail(formData.contactEmail)) {
      errors.push("כתובת אימייל אינה תקינה");
    }

    if (!formData.infrastructureProvider.trim()) {
      errors.push("חובה לבחור ספק תשתית נוכחי");
    }

    if (!formData.currentISP.trim()) {
      errors.push("חובה לבחור ספק אינטרנט נוכחי");
    }

    // Validate sites
    const validSites = formData.sites.filter(site => site.lineIdentifier.trim() && site.address.trim());
    if (validSites.length === 0) {
      errors.push("חובה למלא לפחות קו/אתר אחד");
    }

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
    const powerOfAttorney = getPowerOfAttorneyText('internet', 'business');
    const today = new Date().toLocaleDateString('he-IL');
    
    const validSites = formData.sites.filter(site => site.lineIdentifier.trim() && site.address.trim());
    
    const content = [
      `תאריך: ${today}`,
      "",
      "פרטי המסלול הנבחר:",
      `חברה: ${selectedPlan.company}`,
      `מסלול: ${selectedPlan.planName}`,
      `מחיר: ${selectedPlan.regularPrice ? `₪${selectedPlan.regularPrice}/חודש` : 'לא צוין'}`,
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
      `ספק תשתית נוכחי: ${formData.infrastructureProvider}`,
      `ספק אינטרנט נוכחי: ${formData.currentISP}`,
      formData.customerAccountNumber ? `מספר חשבון לקוח: ${formData.customerAccountNumber}` : "",
      `ספק יעד: ${formData.targetProvider}`,
      `חבילה מבוקשת: ${formData.requestedPackage}`,
      `תוקף ייפוי כוח עד: ${formData.powerOfAttorneyExpiry}`,
      "",
      "קווים/אתרים:",
      ...validSites.map((site, index) => `${index + 1}. מזהה: ${site.lineIdentifier}, כתובת: ${site.address}`),
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
      "טופס בקשת מעבר ספק אינטרנט - לקוח עסקי",
      content
    );

    const fileName = `internet-business-switch-${formData.companyName.replace(/\s+/g, '-')}-${today.replace(/\//g, '-')}.pdf`;
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
      const referenceNumber = `REF-INT-BIZ-${Date.now()}`;
      
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

  const checklistItems = getChecklistItems();

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
            <Label htmlFor="infrastructureProvider">ספק תשתית נוכחי *</Label>
            <Select onValueChange={(value) => updateFormData("infrastructureProvider", value)}>
              <SelectTrigger>
                <SelectValue placeholder="בחר/י ספק תשתית" />
              </SelectTrigger>
              <SelectContent>
                {infrastructureProviders.map(provider => (
                  <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="currentISP">ספק אינטרנט נוכחי *</Label>
            <Select onValueChange={(value) => updateFormData("currentISP", value)}>
              <SelectTrigger>
                <SelectValue placeholder="בחר/י ISP" />
              </SelectTrigger>
              <SelectContent>
                {ispProviders.map(provider => (
                  <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="customerAccountNumber">מספר חשבון/לקוח</Label>
            <Input
              id="customerAccountNumber"
              placeholder="אם ידוע - מומלץ"
              value={formData.customerAccountNumber}
              onChange={(e) => updateFormData("customerAccountNumber", e.target.value)}
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
            <Label htmlFor="requestedPackage">חבילה מבוקשת *</Label>
            <Input
              id="requestedPackage"
              placeholder="שם החבילה"
              value={formData.requestedPackage}
              onChange={(e) => updateFormData("requestedPackage", e.target.value)}
              required
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

      {/* Sites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            קווים/אתרים
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSite}
            >
              <Plus className="h-4 w-4 ml-1" />
              הוסף קו/אתר
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.sites.map((site, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded">
              <div>
                <Label htmlFor={`lineId-${index}`}>מזהה קו/מנוי/ONT *</Label>
                <Input
                  id={`lineId-${index}`}
                  placeholder="מספר או מזהה"
                  value={site.lineIdentifier}
                  onChange={(e) => updateSite(index, 'lineIdentifier', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`address-${index}`}>כתובת אתר *</Label>
                <Input
                  id={`address-${index}`}
                  placeholder="כתובת מלאה"
                  value={site.address}
                  onChange={(e) => updateSite(index, 'address', e.target.value)}
                  required
                />
              </div>
              {formData.sites.length > 1 && (
                <div className="col-span-2 flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSite(index)}
                  >
                    <Trash2 className="h-4 w-4 ml-1" />
                    הסר קו/אתר
                  </Button>
                </div>
              )}
            </div>
          ))}
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
          ביטול
        </Button>
      </div>
    </form>
  );
};