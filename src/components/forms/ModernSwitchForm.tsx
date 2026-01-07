import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

import FormStepper from "./ui/FormStepper";
import PlanHeroCard from "./ui/PlanHeroCard";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import ServiceDetailsStep from "./steps/ServiceDetailsStep";
import SignatureFormStep from "./steps/SignatureFormStep";
import SuccessFormStep from "./steps/SuccessFormStep";
import { supabase } from "@/integrations/supabase/client";

interface ModernSwitchFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: {
    company: string;
    plan: string;
    monthlyPrice: number;
    service: string;
    features?: string[];
  };
  currentBill?: number;
}

interface FormData {
  // Personal Info
  customerType: 'private' | 'business';
  fullName: string;
  nationalId: string;
  phone: string;
  email: string;
  companyName?: string;
  companyId?: string;
  
  // Service Details
  currentProvider?: string;
  accountNumber?: string;
  customerNumber?: string;
  phoneNumber?: string;
  simNumber?: string;
  decoderNumber?: string;
  serviceAddress: {
    street: string;
    city: string;
    zipCode?: string;
  };
  preferredSwitchDate?: string;
  additionalNotes?: string;
  
  // Signature
  signatureData?: string;
}

const initialFormData: FormData = {
  customerType: 'private',
  fullName: '',
  nationalId: '',
  phone: '',
  email: '',
  serviceAddress: {
    street: '',
    city: '',
    zipCode: '',
  },
};

export const ModernSwitchForm = ({
  isOpen,
  onClose,
  selectedPlan,
  currentBill
}: ModernSwitchFormProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');

  // Get category-specific colors
  const getCategoryColor = () => {
    const category = selectedPlan.service;
    if (category.includes('חשמל')) {
      return {
        primary: "from-yellow-500 to-amber-500",
        light: "from-yellow-50 to-amber-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
        bg: "bg-yellow-50"
      };
    }
    if (category.includes('סלולר')) {
      return {
        primary: "from-purple-500 to-violet-500",
        light: "from-purple-50 to-violet-50",
        text: "text-purple-700",
        border: "border-purple-200",
        bg: "bg-purple-50"
      };
    }
    if (category.includes('אינטרנט')) {
      return {
        primary: "from-cyan-500 to-blue-500",
        light: "from-cyan-50 to-blue-50",
        text: "text-cyan-700",
        border: "border-cyan-200",
        bg: "bg-cyan-50"
      };
    }
    if (category.includes('טלוויזיה')) {
      return {
        primary: "from-orange-500 to-red-500",
        light: "from-orange-50 to-red-50",
        text: "text-orange-700",
        border: "border-orange-200",
        bg: "bg-orange-50"
      };
    }
    return {
      primary: "from-primary to-primary/80",
      light: "from-primary/5 to-primary/10",
      text: "text-primary",
      border: "border-primary/20",
      bg: "bg-primary/5"
    };
  };

  const categoryColor = getCategoryColor();

  // Generate reference number
  const generateReferenceNumber = (): string => {
    const prefix = selectedPlan.service.charAt(0).toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  // Handle form submission
  const handleSubmit = async (signatureData: string) => {
    setIsSubmitting(true);
    
    try {
      const refNum = generateReferenceNumber();
      setReferenceNumber(refNum);

      // Map category to sector
      const sectorMap: Record<string, string> = {
        'חשמל': 'electricity',
        'סלולר': 'cellular',
        'אינטרנט': 'internet_isp',
        'טלוויזיה': 'tv',
      };
      
      let sector = 'electricity';
      for (const [key, value] of Object.entries(sectorMap)) {
        if (selectedPlan.service.includes(key)) {
          sector = value;
          break;
        }
      }

      // Prepare data for Supabase
      const requestData = {
        reference_number: refNum,
        full_name: formData.fullName,
        national_id_or_corp: formData.nationalId,
        phone: formData.phone,
        email: formData.email,
        customer_type: formData.customerType,
        company_name: formData.companyName || null,
        corp_registration_number: formData.companyId || null,
        sector: sector,
        action_type: 'switch',
        current_provider: formData.currentProvider || null,
        current_account_number: formData.accountNumber || null,
        current_customer_number: formData.customerNumber || null,
        target_provider: selectedPlan.company,
        selected_plan_name: selectedPlan.plan,
        selected_plan_price: selectedPlan.monthlyPrice,
        selected_plan_features: selectedPlan.features || [],
        service_address: {
          street: formData.serviceAddress.street,
          city: formData.serviceAddress.city,
          zipCode: formData.serviceAddress.zipCode || '',
        },
        additional_notes: formData.additionalNotes || null,
        signature_data: signatureData,
        signature_status: 'signed',
        poa: true,
        privacy_tos: true,
        fees_ack: true,
        esign_ok: true,
        status: 'pending',
      };

      // Insert to Supabase
      const { error } = await supabase
        .from('service_requests')
        .insert(requestData);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to save request');
      }

      toast({
        title: "הבקשה נשלחה בהצלחה!",
        description: `מספר אסמכתה: ${refNum}`,
      });

      setCurrentStep(4);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "שגיאה בשליחת הבקשה",
        description: "אנא נסו שוב מאוחר יותר",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle close with confirmation
  const handleClose = () => {
    if (currentStep > 1 && currentStep < 4) {
      if (window.confirm('האם אתה בטוח שברצונך לצאת? הנתונים שהזנת לא יישמרו.')) {
        setCurrentStep(1);
        setFormData(initialFormData);
        onClose();
      }
    } else {
      setCurrentStep(1);
      setFormData(initialFormData);
      onClose();
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={{
              customerType: formData.customerType,
              fullName: formData.fullName,
              nationalId: formData.nationalId,
              phone: formData.phone,
              email: formData.email,
              companyName: formData.companyName,
              companyId: formData.companyId,
            }}
            onUpdate={(data) => setFormData(prev => ({ ...prev, ...data }))}
            onNext={() => setCurrentStep(2)}
            categoryColor={categoryColor}
          />
        );
      case 2:
        return (
          <ServiceDetailsStep
            data={{
              currentProvider: formData.currentProvider,
              accountNumber: formData.accountNumber,
              customerNumber: formData.customerNumber,
              serviceAddress: formData.serviceAddress,
              preferredSwitchDate: formData.preferredSwitchDate,
              additionalNotes: formData.additionalNotes,
            }}
            category={selectedPlan.service}
            onUpdate={(data) => setFormData(prev => ({ ...prev, ...data }))}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
            categoryColor={categoryColor}
          />
        );
      case 3:
        return (
          <SignatureFormStep
            personalInfo={{
              fullName: formData.fullName,
              nationalId: formData.nationalId,
            }}
            selectedPlan={{
              company: selectedPlan.company,
              planName: selectedPlan.plan,
              price: selectedPlan.monthlyPrice,
            }}
            onSubmit={handleSubmit}
            onBack={() => setCurrentStep(2)}
            isSubmitting={isSubmitting}
            categoryColor={categoryColor}
          />
        );
      case 4:
        return (
          <SuccessFormStep
            referenceNumber={referenceNumber}
            personalInfo={{
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
            }}
            selectedPlan={{
              company: selectedPlan.company,
              planName: selectedPlan.plan,
              price: selectedPlan.monthlyPrice,
            }}
            onClose={handleClose}
            categoryColor={categoryColor}
          />
        );
      default:
        return null;
    }
  };

  // Form content
  const formContent = (
    <div className="space-y-6" dir="rtl">
      {/* Header Info */}
      {currentStep < 4 && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            <Shield className="w-3 h-3 ml-1" />
            מאובטח SSL
          </Badge>
          <Badge variant="secondary" className={cn(categoryColor.bg, categoryColor.text, categoryColor.border, "border")}>
            <Clock className="w-3 h-3 ml-1" />
            3 דקות
          </Badge>
        </div>
      )}

      {/* Stepper */}
      {currentStep < 4 && (
        <FormStepper 
          currentStep={currentStep} 
          categoryColor={categoryColor.primary}
        />
      )}

      {/* Plan Hero Card */}
      {currentStep < 4 && (
        <PlanHeroCard
          company={selectedPlan.company}
          planName={selectedPlan.plan}
          price={selectedPlan.monthlyPrice}
          category={selectedPlan.service}
          features={selectedPlan.features}
          currentBill={currentBill}
          categoryColor={categoryColor}
        />
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  // Mobile: Use Drawer with full height
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DrawerContent className="h-[92vh] flex flex-col">
          <DrawerHeader className="pb-2 flex-shrink-0 border-b">
            <div className="flex items-center justify-between">
              <DrawerTitle className={cn("text-lg font-bold", categoryColor.text)}>
                טופס מעבר ספק
              </DrawerTitle>
              <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-8 pt-4">
            {formContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Use Dialog
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className={cn("text-2xl font-bold", categoryColor.text)}>
              טופס מעבר ספק
            </DialogTitle>
          </div>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default ModernSwitchForm;
