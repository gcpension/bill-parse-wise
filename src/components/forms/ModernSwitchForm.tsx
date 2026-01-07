import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    <div className="space-y-5" dir="rtl">
      {/* Header Info - Compact for mobile */}
      {currentStep < 4 && (
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-xs">
            <Shield className="w-3 h-3 ml-1" />
            מאובטח
          </Badge>
          <Badge variant="secondary" className={cn(categoryColor.bg, categoryColor.text, categoryColor.border, "border text-xs")}>
            <Clock className="w-3 h-3 ml-1" />
            ~3 דק׳
          </Badge>
        </div>
      )}

      {/* Stepper - Hidden on mobile, use progress bar instead */}
      {currentStep < 4 && (
        <div className="hidden md:block">
          <FormStepper 
            currentStep={currentStep} 
            categoryColor={categoryColor.primary}
          />
        </div>
      )}

      {/* Mobile Step Indicator */}
      {currentStep < 4 && (
        <div className="md:hidden">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-bold">{
              currentStep === 1 ? 'פרטים אישיים' :
              currentStep === 2 ? 'פרטי השירות' :
              'חתימה ואישור'
            }</span>
            <span className="text-muted-foreground">שלב {currentStep} מתוך 3</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className={cn("h-full rounded-full bg-gradient-to-r", categoryColor.primary)}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Plan Hero Card - Compact on mobile */}
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
          transition={{ duration: 0.25 }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  // Use Dialog for both mobile and desktop with responsive styling
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent 
        className={cn(
          "overflow-hidden flex flex-col",
          // Mobile: Full screen style
          isMobile && "w-full h-[100dvh] max-w-full max-h-full rounded-none p-0 gap-0",
          // Desktop: Regular dialog
          !isMobile && "max-w-3xl max-h-[95vh]"
        )}
        // Prevent closing on outside click for mobile
        onPointerDownOutside={(e) => isMobile && e.preventDefault()}
        onInteractOutside={(e) => isMobile && e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className={cn(
          "flex-shrink-0 border-b",
          isMobile ? "px-4 py-3" : "pb-4"
        )}>
          <div className="flex items-center justify-between">
            <DialogTitle className={cn(
              "font-bold",
              categoryColor.text,
              isMobile ? "text-lg" : "text-2xl"
            )}>
              טופס מעבר ספק
            </DialogTitle>
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleClose} 
                className="h-9 w-9 -ml-2"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </DialogHeader>
        
        {/* Scrollable Content */}
        <div className={cn(
          "flex-1 overflow-y-auto overscroll-contain no-pull-refresh",
          isMobile ? "px-4 py-4 pb-safe" : "px-6 py-4"
        )}>
          {formContent}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModernSwitchForm;
