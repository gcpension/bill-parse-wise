import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, User, Building2 } from "lucide-react";
import { ManualPlan } from "@/data/manual-plans";
import { ServiceCategory, CustomerType, SwitchFormData } from "@/types/switchForms";
import { useToast } from "@/hooks/use-toast";

// Import individual form components
import { ElectricityPrivateForm } from "./electricity/ElectricityPrivateForm";
import { ElectricityBusinessForm } from "./electricity/ElectricityBusinessForm";
import { CellularPrivateForm } from "./cellular/CellularPrivateForm";
import { CellularBusinessForm } from "./cellular/CellularBusinessForm";
import { InternetPrivateForm } from "./internet/InternetPrivateForm";
import { InternetBusinessForm } from "./internet/InternetBusinessForm";
import { TVPrivateForm } from "./tv/TVPrivateForm";
import { TVBusinessForm } from "./tv/TVBusinessForm";

interface SwitchRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: ManualPlan;
}

export const SwitchRequestForm = ({ isOpen, onClose, selectedPlan }: SwitchRequestFormProps) => {
  const { toast } = useToast();
  const [customerType, setCustomerType] = useState<CustomerType>('private');
  
  // Map plan category to our form categories
  const getServiceCategory = (planCategory: string): ServiceCategory => {
    switch (planCategory.toLowerCase()) {
      case 'חשמל':
      case 'electricity':
        return 'electricity';
      case 'סלולר':
      case 'cellular':
        return 'cellular';
      case 'אינטרנט':
      case 'internet':
        return 'internet';
      case 'טלוויזיה':
      case 'tv':
        return 'tv';
      default:
        return 'electricity'; // fallback
    }
  };

  const serviceCategory = getServiceCategory(selectedPlan.category);

  const renderFormComponent = () => {
    const formKey = `${serviceCategory}-${customerType}`;
    
    switch (formKey) {
      case 'electricity-private':
        return <ElectricityPrivateForm selectedPlan={selectedPlan} onClose={onClose} />;
      case 'electricity-business':
        return <ElectricityBusinessForm selectedPlan={selectedPlan} onClose={onClose} />;
      case 'cellular-private':
        return <CellularPrivateForm selectedPlan={selectedPlan} onClose={onClose} />;
      case 'cellular-business':
        return <CellularBusinessForm selectedPlan={selectedPlan} onClose={onClose} />;
      case 'internet-private':
        return <InternetPrivateForm selectedPlan={selectedPlan} onClose={onClose} />;
      case 'internet-business':
        return <InternetBusinessForm selectedPlan={selectedPlan} onClose={onClose} />;
      case 'tv-private':
        return <TVPrivateForm selectedPlan={selectedPlan} onClose={onClose} />;
      case 'tv-business':
        return <TVBusinessForm selectedPlan={selectedPlan} onClose={onClose} />;
      default:
        return <div>טופס לא נמצא</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-6 w-6" />
            טופס מעבר ספק - {selectedPlan.company}
          </DialogTitle>
        </DialogHeader>

        {/* Plan Details Card */}
        <Card className="mb-4">
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
            {selectedPlan.dataAmount && (
              <div><strong>כמות גלישה:</strong> {selectedPlan.dataAmount}</div>
            )}
          </CardContent>
        </Card>

        {/* Customer Type Selection */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">סוג לקוח</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={customerType} onValueChange={(value) => setCustomerType(value as CustomerType)} dir="rtl">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="private" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  לקוח פרטי
                </TabsTrigger>
                <TabsTrigger value="business" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  לקוח עסקי
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Dynamic Form Component */}
        <div className="mt-4">
          {renderFormComponent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};