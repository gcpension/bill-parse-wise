import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
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
  const customerType: CustomerType = 'private'; // Always use private form
  
  // Map plan category to our form categories
  const mapServiceCategory = (planCategory: string): ServiceCategory => {
    const categoryMap: Record<string, ServiceCategory> = {
      'חשמל': 'electricity',
      'electricity': 'electricity', 
      'סלולר': 'cellular',
      'cellular': 'cellular',
      'mobile': 'cellular',
      'אינטרנט': 'internet',
      'internet': 'internet',
      'טלוויזיה': 'tv',
      'tv': 'tv'
    };
    
    return categoryMap[planCategory.toLowerCase()] || 'electricity';
  };

  const serviceCategory = mapServiceCategory(selectedPlan.category);

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
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto p-2" dir="rtl">
        <DialogHeader className="pb-1">
          <DialogTitle className="flex items-center gap-1.5 text-sm">
            <FileText className="h-3.5 w-3.5" />
            טופס מעבר ספק - {selectedPlan.company}
          </DialogTitle>
        </DialogHeader>

        {/* Plan Details Card */}
        <Card className="mb-1.5">
          <CardHeader className="py-1.5 px-2.5">
            <CardTitle className="text-xs">המסלול שנבחר</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-1.5 text-xs py-1.5 px-2.5">
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

        {/* Dynamic Form Component */}
        <div className="mt-1">
          {renderFormComponent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};