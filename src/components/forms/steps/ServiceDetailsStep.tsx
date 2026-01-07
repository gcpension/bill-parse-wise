import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, MapPin, Hash, Calendar, Building, Home, Check, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ServiceDetailsData {
  currentProvider?: string;
  accountNumber?: string;
  customerNumber?: string;
  serviceAddress: {
    street: string;
    city: string;
    zipCode?: string;
  };
  preferredSwitchDate?: string;
  additionalNotes?: string;
}

interface ServiceDetailsStepProps {
  data: ServiceDetailsData;
  category: string;
  onUpdate: (data: Partial<ServiceDetailsData>) => void;
  onNext: () => void;
  onBack: () => void;
  categoryColor?: {
    primary: string;
    light: string;
    text: string;
    border: string;
    bg: string;
  };
}

export const ServiceDetailsStep = ({
  data,
  category,
  onUpdate,
  onNext,
  onBack,
  categoryColor = {
    primary: "from-primary to-primary/80",
    light: "from-primary/5 to-primary/10",
    text: "text-primary",
    border: "border-primary/20",
    bg: "bg-primary/5"
  }
}: ServiceDetailsStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const getCategoryFields = () => {
    switch (category) {
      case 'חשמל':
        return [
          { name: 'currentProvider', label: 'ספק חשמל נוכחי', icon: Building, required: false },
          { name: 'accountNumber', label: 'מספר חשבון / חוזה', icon: Hash, required: true },
        ];
      case 'סלולר':
        return [
          { name: 'currentProvider', label: 'ספק סלולר נוכחי', icon: Building, required: false },
          { name: 'phoneNumber', label: 'מספר הקו', icon: Hash, required: true },
          { name: 'simNumber', label: 'מספר SIM', icon: Hash, required: false },
        ];
      case 'אינטרנט':
        return [
          { name: 'currentProvider', label: 'ספק אינטרנט נוכחי', icon: Building, required: false },
          { name: 'customerNumber', label: 'מספר לקוח', icon: Hash, required: false },
        ];
      case 'טלוויזיה':
        return [
          { name: 'currentProvider', label: 'ספק טלוויזיה נוכחי', icon: Building, required: false },
          { name: 'customerNumber', label: 'מספר לקוח', icon: Hash, required: false },
          { name: 'decoderNumber', label: 'מספר ממיר', icon: Hash, required: false },
        ];
      default:
        return [
          { name: 'currentProvider', label: 'ספק נוכחי', icon: Building, required: false },
          { name: 'accountNumber', label: 'מספר חשבון', icon: Hash, required: false },
        ];
    }
  };

  const categoryFields = getCategoryFields();

  const handleFieldChange = (field: string, value: string) => {
    if (field.startsWith('serviceAddress.')) {
      const addressField = field.split('.')[1];
      onUpdate({
        serviceAddress: {
          ...data.serviceAddress,
          [addressField]: value
        }
      });
    } else {
      onUpdate({ [field]: value });
    }
    
    // Clear error when typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate required category fields
    categoryFields.forEach(field => {
      if (field.required) {
        const value = (data as any)[field.name];
        if (!value || value.trim() === '') {
          newErrors[field.name] = `${field.label} הוא שדה חובה`;
        }
      }
    });

    // Validate address
    if (!data.serviceAddress?.street?.trim()) {
      newErrors['serviceAddress.street'] = 'רחוב הוא שדה חובה';
    }
    if (!data.serviceAddress?.city?.trim()) {
      newErrors['serviceAddress.city'] = 'עיר היא שדה חובה';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // Mark all as touched
    const allTouched: Record<string, boolean> = {};
    categoryFields.forEach(f => { allTouched[f.name] = true; });
    allTouched['serviceAddress.street'] = true;
    allTouched['serviceAddress.city'] = true;
    setTouched(allTouched);

    if (validate()) {
      onNext();
    }
  };

  const renderField = (
    name: string,
    label: string,
    Icon: React.ComponentType<{ className?: string }>,
    required: boolean = false,
    type: string = "text"
  ) => {
    const value = name.startsWith('serviceAddress.') 
      ? (data.serviceAddress as any)?.[name.split('.')[1]] || ''
      : (data as any)[name] || '';
    
    const error = errors[name];
    const showError = touched[name] && error;

    return (
      <div className="space-y-2">
        <Label htmlFor={name} className="text-sm font-medium flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="relative">
          <Input
            id={name}
            type={type}
            value={value}
            onChange={(e) => handleFieldChange(name, e.target.value)}
            onBlur={() => handleBlur(name)}
            className={cn(
              "h-14 text-base px-4 text-[16px]",
              showError && "border-red-400 focus:border-red-500"
            )}
          />
          
          {touched[name] && !error && value && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Check className="w-5 h-5 text-green-500" />
            </div>
          )}
          
          {showError && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          )}
        </div>
        
        <AnimatePresence>
          {showError && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-red-500"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              "bg-gradient-to-br",
              categoryColor.primary,
              "text-white"
            )}>
              <FileText className="w-5 h-5" />
            </div>
            פרטי השירות
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Category-specific Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryFields.map(field => (
              <div key={field.name}>
                {renderField(field.name, field.label, field.icon, field.required)}
              </div>
            ))}
          </div>

          {/* Address Section */}
          <div className="pt-4 border-t space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <MapPin className={cn("w-5 h-5", categoryColor.text)} />
              כתובת השירות
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField('serviceAddress.street', 'רחוב ומספר', Home, true)}
              {renderField('serviceAddress.city', 'עיר', Building, true)}
            </div>
            
            <div className="md:w-1/2">
              {renderField('serviceAddress.zipCode', 'מיקוד', Hash, false)}
            </div>
          </div>

          {/* Preferred Date */}
          <div className="pt-4 border-t space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preferredSwitchDate" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                תאריך מעבר מועדף
              </Label>
              <Input
                id="preferredSwitchDate"
                type="date"
                min={getMinDate()}
                value={data.preferredSwitchDate || ''}
                onChange={(e) => handleFieldChange('preferredSwitchDate', e.target.value)}
                className="h-12 text-base px-4 md:w-1/2"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="additionalNotes" className="text-sm font-medium">
              הערות נוספות (אופציונלי)
            </Label>
            <Textarea
              id="additionalNotes"
              value={data.additionalNotes || ''}
              onChange={(e) => handleFieldChange('additionalNotes', e.target.value)}
              placeholder="מידע נוסף שברצונכם לציין..."
              className="min-h-[100px] text-base resize-none"
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col-reverse md:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="h-12 md:h-14 flex-1"
            >
              חזרה
            </Button>
            <Button
              onClick={handleNext}
              className={cn(
                "h-12 md:h-14 flex-1 text-lg font-medium",
                "bg-gradient-to-r",
                categoryColor.primary,
                "hover:opacity-90 transition-opacity"
              )}
            >
              המשך לחתימה
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceDetailsStep;
