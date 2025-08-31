import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, User, Phone, Mail, MapPin, CreditCard, Calendar } from "lucide-react";
import jsPDF from "jspdf";
import { ManualPlan } from "@/data/manual-plans";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  // פרטים אישיים
  firstName: string;
  lastName: string;
  idNumber: string;
  phone: string;
  email: string;
  birthDate: string;
  
  // כתובת
  address: string;
  city: string;
  postalCode: string;
  
  // פרטי חשבון בנק
  bankName: string;
  branchNumber: string;
  accountNumber: string;
  accountOwnerName: string;
  
  // פרטי ספק נוכחי
  currentProvider: string;
  currentPlan: string;
  currentAccountNumber: string;
  lastBillAmount: string;
  
  // העדפות
  preferredStartDate: string;
  installationTime: string;
  specialRequests: string;
  
  // הסכמות
  agreeTerms: boolean;
  agreeMarketing: boolean;
  confirmDetails: boolean;
}

interface PlanSwitchFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: ManualPlan;
}

export const PlanSwitchForm = ({ isOpen, onClose, selectedPlan }: PlanSwitchFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    idNumber: "",
    phone: "",
    email: "",
    birthDate: "",
    address: "",
    city: "",
    postalCode: "",
    bankName: "",
    branchNumber: "",
    accountNumber: "",
    accountOwnerName: "",
    currentProvider: "",
    currentPlan: "",
    currentAccountNumber: "",
    lastBillAmount: "",
    preferredStartDate: "",
    installationTime: "",
    specialRequests: "",
    agreeTerms: false,
    agreeMarketing: false,
    confirmDetails: false,
  });

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // הגדרת פונט עברי - נשתמש בפונט ברירת מחדל ונכתוב בעברית
    doc.setFont("helvetica");
    
    let yPosition = 20;
    const lineHeight = 8;
    
    // כותרת
    doc.setFontSize(20);
    doc.text("Provider Switch Request Form", 105, yPosition, { align: "center" });
    doc.text("טופס בקשת מעבר ספק", 105, yPosition + 10, { align: "center" });
    yPosition += 30;
    
    // פרטי המסלול הנבחר
    doc.setFontSize(16);
    doc.text("Selected Plan Details:", 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.text(`Company: ${selectedPlan.company}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Plan: ${selectedPlan.planName}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Category: ${selectedPlan.category}`, 20, yPosition);
    yPosition += lineHeight;
    if (selectedPlan.regularPrice) {
      doc.text(`Price: ${selectedPlan.regularPrice} NIS/month`, 20, yPosition);
      yPosition += lineHeight;
    }
    if (selectedPlan.downloadSpeed) {
      doc.text(`Download Speed: ${selectedPlan.downloadSpeed}`, 20, yPosition);
      yPosition += lineHeight;
    }
    if (selectedPlan.uploadSpeed) {
      doc.text(`Upload Speed: ${selectedPlan.uploadSpeed}`, 20, yPosition);
      yPosition += lineHeight;
    }
    if (selectedPlan.dataAmount) {
      doc.text(`Data Amount: ${selectedPlan.dataAmount}`, 20, yPosition);
      yPosition += lineHeight;
    }
    yPosition += 10;
    
    // פרטים אישיים
    doc.setFontSize(16);
    doc.text("Personal Information:", 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    const personalFields = [
      [`Name: ${formData.firstName} ${formData.lastName}`, formData.firstName || formData.lastName],
      [`ID Number: ${formData.idNumber}`, formData.idNumber],
      [`Phone: ${formData.phone}`, formData.phone],
      [`Email: ${formData.email}`, formData.email],
      [`Birth Date: ${formData.birthDate}`, formData.birthDate],
    ];
    
    personalFields.forEach(([text, value]) => {
      if (value) {
        doc.text(text, 20, yPosition);
        yPosition += lineHeight;
      }
    });
    yPosition += 10;
    
    // כתובת
    doc.setFontSize(16);
    doc.text("Address:", 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    const addressFields = [
      [`Address: ${formData.address}`, formData.address],
      [`City: ${formData.city}`, formData.city],
      [`Postal Code: ${formData.postalCode}`, formData.postalCode],
    ];
    
    addressFields.forEach(([text, value]) => {
      if (value) {
        doc.text(text, 20, yPosition);
        yPosition += lineHeight;
      }
    });
    yPosition += 10;
    
    // פרטי בנק
    if (formData.bankName || formData.accountNumber) {
      doc.setFontSize(16);
      doc.text("Bank Details:", 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      const bankFields = [
        [`Bank: ${formData.bankName}`, formData.bankName],
        [`Branch: ${formData.branchNumber}`, formData.branchNumber],
        [`Account: ${formData.accountNumber}`, formData.accountNumber],
        [`Account Owner: ${formData.accountOwnerName}`, formData.accountOwnerName],
      ];
      
      bankFields.forEach(([text, value]) => {
        if (value) {
          doc.text(text, 20, yPosition);
          yPosition += lineHeight;
        }
      });
      yPosition += 10;
    }
    
    // ספק נוכחי
    if (formData.currentProvider) {
      doc.setFontSize(16);
      doc.text("Current Provider:", 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      const currentFields = [
        [`Provider: ${formData.currentProvider}`, formData.currentProvider],
        [`Plan: ${formData.currentPlan}`, formData.currentPlan],
        [`Account: ${formData.currentAccountNumber}`, formData.currentAccountNumber],
        [`Last Bill: ${formData.lastBillAmount} NIS`, formData.lastBillAmount],
      ];
      
      currentFields.forEach(([text, value]) => {
        if (value) {
          doc.text(text, 20, yPosition);
          yPosition += lineHeight;
        }
      });
      yPosition += 10;
    }
    
    // העדפות
    if (formData.preferredStartDate || formData.specialRequests) {
      doc.setFontSize(16);
      doc.text("Preferences:", 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      if (formData.preferredStartDate) {
        doc.text(`Start Date: ${formData.preferredStartDate}`, 20, yPosition);
        yPosition += lineHeight;
      }
      if (formData.installationTime) {
        doc.text(`Installation Time: ${formData.installationTime}`, 20, yPosition);
        yPosition += lineHeight;
      }
      if (formData.specialRequests) {
        doc.text(`Special Requests: ${formData.specialRequests}`, 20, yPosition);
        yPosition += lineHeight;
      }
    }
    
    // הוספת תאריך יצירה
    yPosition += 20;
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString('he-IL')}`, 20, yPosition);
    
    // שמירת ה-PDF
    const fileName = `provider-switch-${selectedPlan.company}-${formData.firstName}-${formData.lastName}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    toast({
      title: "PDF נוצר בהצלחה!",
      description: "טופס מעבר הספק הורד למחשב שלך",
    });
  };

  const isFormValid = () => {
    return formData.firstName && 
           formData.lastName && 
           formData.phone && 
           formData.email && 
           formData.agreeTerms && 
           formData.confirmDetails;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      generatePDF();
      onClose();
    } else {
      toast({
        title: "נא למלא את כל השדות הנדרשים",
        description: "שדות חובה: שם פרטי, שם משפחה, טלפון, אימייל והסכמות",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-6 w-6" />
            טופס מעבר ספק - {selectedPlan.company}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* פרטי המסלול */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">המסלול שנבחר</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>חברה:</strong> {selectedPlan.company}</div>
              <div><strong>מסלול:</strong> {selectedPlan.planName}</div>
              <div><strong>קטגוריה:</strong> {selectedPlan.category}</div>
              {selectedPlan.regularPrice && (
                <div><strong>מחיר:</strong> ₪{selectedPlan.regularPrice}/חודש</div>
              )}
              {selectedPlan.downloadSpeed && (
                <div><strong>מהירות הורדה:</strong> {selectedPlan.downloadSpeed}</div>
              )}
              {selectedPlan.uploadSpeed && (
                <div><strong>מהירות העלאה:</strong> {selectedPlan.uploadSpeed}</div>
              )}
            </CardContent>
          </Card>

          {/* פרטים אישיים */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                פרטים אישיים
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">שם פרטי *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">שם משפחה *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="idNumber">תעודת זהות</Label>
                <Input
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => updateFormData("idNumber", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">טלפון *</Label>
                <Input
                  id="phone"
                  type="tel"
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
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="birthDate">תאריך לידה</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => updateFormData("birthDate", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* כתובת */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                כתובת מגורים
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="address">כתובת</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="city">עיר</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="postalCode">מיקוד</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => updateFormData("postalCode", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* פרטי חשבון בנק */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                פרטי חשבון בנק
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankName">בנק</Label>
                <Select onValueChange={(value) => updateFormData("bankName", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר בנק" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="בנק הפועלים">בנק הפועלים</SelectItem>
                    <SelectItem value="בנק לאומי">בנק לאומי</SelectItem>
                    <SelectItem value="בנק דיסקונט">בנק דיסקונט</SelectItem>
                    <SelectItem value="מזרחי טפחות">מזרחי טפחות</SelectItem>
                    <SelectItem value="בנק יהב">בנק יהב</SelectItem>
                    <SelectItem value="בנק מרכנתיל">בנק מרכנתיל</SelectItem>
                    <SelectItem value="אחר">אחר</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="branchNumber">סניף</Label>
                <Input
                  id="branchNumber"
                  value={formData.branchNumber}
                  onChange={(e) => updateFormData("branchNumber", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">מספר חשבון</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => updateFormData("accountNumber", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="accountOwnerName">שם בעל החשבון</Label>
                <Input
                  id="accountOwnerName"
                  value={formData.accountOwnerName}
                  onChange={(e) => updateFormData("accountOwnerName", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* ספק נוכחי */}
          <Card>
            <CardHeader>
              <CardTitle>פרטי ספק נוכחי</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentProvider">ספק נוכחי</Label>
                <Input
                  id="currentProvider"
                  value={formData.currentProvider}
                  onChange={(e) => updateFormData("currentProvider", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="currentPlan">מסלול נוכחי</Label>
                <Input
                  id="currentPlan"
                  value={formData.currentPlan}
                  onChange={(e) => updateFormData("currentPlan", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="currentAccountNumber">מספר לקוח נוכחי</Label>
                <Input
                  id="currentAccountNumber"
                  value={formData.currentAccountNumber}
                  onChange={(e) => updateFormData("currentAccountNumber", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastBillAmount">סכום חשבון אחרון (₪)</Label>
                <Input
                  id="lastBillAmount"
                  type="number"
                  value={formData.lastBillAmount}
                  onChange={(e) => updateFormData("lastBillAmount", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* העדפות */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                העדפות מעבר
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredStartDate">תאריך מעבר מועדף</Label>
                <Input
                  id="preferredStartDate"
                  type="date"
                  value={formData.preferredStartDate}
                  onChange={(e) => updateFormData("preferredStartDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="installationTime">זמן התקנה מועדף</Label>
                <Select onValueChange={(value) => updateFormData("installationTime", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר זמן" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">בוקר (8:00-12:00)</SelectItem>
                    <SelectItem value="afternoon">אחר הצהריים (12:00-16:00)</SelectItem>
                    <SelectItem value="evening">ערב (16:00-20:00)</SelectItem>
                    <SelectItem value="flexible">גמיש</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="specialRequests">בקשות מיוחדות</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => updateFormData("specialRequests", e.target.value)}
                  placeholder="הערות או בקשות מיוחדות..."
                />
              </div>
            </CardContent>
          </Card>

          {/* הסכמות */}
          <Card>
            <CardHeader>
              <CardTitle>הסכמות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => updateFormData("agreeTerms", checked as boolean)}
                />
                <Label htmlFor="agreeTerms" className="text-sm">
                  אני מסכים/ה לתנאי השירות ולמדיניות הפרטיות *
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="agreeMarketing"
                  checked={formData.agreeMarketing}
                  onCheckedChange={(checked) => updateFormData("agreeMarketing", checked as boolean)}
                />
                <Label htmlFor="agreeMarketing" className="text-sm">
                  אני מסכים/ה לקבל עדכונים שיווקיים
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="confirmDetails"
                  checked={formData.confirmDetails}
                  onCheckedChange={(checked) => updateFormData("confirmDetails", checked as boolean)}
                />
                <Label htmlFor="confirmDetails" className="text-sm">
                  אני מאשר/ת כי הפרטים שמילאתי נכונים *
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* כפתורי פעולה */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid()}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              הורד טופס PDF
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};