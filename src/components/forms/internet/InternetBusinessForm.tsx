import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { ManualPlan } from "@/data/manual-plans";
import { InternetBusinessForm as FormData } from "@/types/switchForms";
import { useToast } from "@/hooks/use-toast";
import { createHebrewPDF } from "@/lib/pdfUtils";

interface InternetBusinessFormProps {
  selectedPlan: ManualPlan;
  onClose: () => void;
}

export const InternetBusinessForm = ({ selectedPlan, onClose }: InternetBusinessFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    companyName: "", companyId: "", authorizedSignatory: "", signatoryId: "", signatoryRole: "", contactEmail: "",
    infrastructureProvider: "", currentISP: "", customerAccountNumber: "", sites: [{ lineIdentifier: "", address: "" }],
    targetProvider: selectedPlan.company, requestedPackage: selectedPlan.planName, powerOfAttorneyExpiry: "",
    companyRegistration: { file: null, required: true, uploaded: false },
    signatoryIdCopy: { file: null, required: true, uploaded: false }
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const content = [`תאריך: ${new Date().toLocaleDateString('he-IL')}`, "טופס בקשת מעבר ספק אינטרנט - לקוח עסקי", `חברה: ${selectedPlan.company}`, `תאגיד: ${formData.companyName}`];
      const pdf = await createHebrewPDF("טופס בקשת מעבר ספק אינטרנט עסקי", content);
      pdf.save(`internet-business-switch-${formData.companyName.replace(/\s+/g, '-')}.pdf`);
      toast({ title: "הבקשה נשלחה בהצלחה!" });
      onClose();
    } catch (error) {
      toast({ title: "שגיאה ביצירת הקובץ", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <Card>
        <CardHeader><CardTitle>פרטי התאגיד</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div><Label>שם תאגיד *</Label><Input value={formData.companyName} onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))} required /></div>
          <div><Label>ח.פ./ח.צ. *</Label><Input value={formData.companyId} onChange={(e) => setFormData(prev => ({ ...prev, companyId: e.target.value }))} required /></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>הסכמות</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2">
            <Checkbox checked={agreeToTerms} onCheckedChange={(checked) => setAgreeToTerms(checked === true)} />
            <label className="text-sm">אנו מסכימים לתנאי השימוש</label>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox checked={agreeToPrivacy} onCheckedChange={(checked) => setAgreeToPrivacy(checked === true)} />
            <label className="text-sm">אנו מסכימים למדיניות הפרטיות</label>
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