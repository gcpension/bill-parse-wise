import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, MapPin, Hash, Calendar, Building, Home, Check, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to focused field on mobile
  useEffect(() => {
    if (focusedField) {
      const element = document.getElementById(focusedField);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [focusedField]);

  const getCategoryFields = () => {
    const baseCategory = category.includes('חשמל') ? 'חשמל' 
      : category.includes('סלולר') ? 'סלולר'
      : category.includes('אינטרנט') ? 'אינטרנט'
      : category.includes('טלוויזיה') ? 'טלוויזיה'
      : 'כללי';

    switch (baseCategory) {
      case 'חשמל':
        return [
          { name: 'currentProvider', label: 'ספק חשמל נוכחי', icon: Building, required: false, placeholder: 'לדוגמה: חברת החשמל' },
          { name: 'accountNumber', label: 'מספר חשבון / חוזה', icon: Hash, required: true, placeholder: 'מספר החשבון מהחשבונית' },
        ];
      case 'סלולר':
        return [
          { name: 'currentProvider', label: 'ספק סלולר נוכחי', icon: Building, required: false, placeholder: 'לדוגמה: פלאפון' },
          { name: 'accountNumber', label: 'מספר הקו', icon: Hash, required: true, placeholder: '050-1234567' },
        ];
      case 'אינטרנט':
        return [
          { name: 'currentProvider', label: 'ספק אינטרנט נוכחי', icon: Building, required: false, placeholder: 'לדוגמה: בזק' },
          { name: 'customerNumber', label: 'מספר לקוח', icon: Hash, required: false, placeholder: 'מספר הלקוח שלך' },
        ];
      case 'טלוויזיה':
        return [
          { name: 'currentProvider', label: 'ספק טלוויזיה נוכחי', icon: Building, required: false, placeholder: 'לדוגמה: HOT' },
          { name: 'customerNumber', label: 'מספר לקוח', icon: Hash, required: false, placeholder: 'מספר הלקוח שלך' },
        ];
      default:
        return [
          { name: 'currentProvider', label: 'ספק נוכחי', icon: Building, required: false, placeholder: 'שם הספק הנוכחי' },
          { name: 'accountNumber', label: 'מספר חשבון', icon: Hash, required: false, placeholder: 'מספר החשבון שלך' },
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
    setFocusedField(null);
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
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
    } else {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const element = document.getElementById(firstError);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Calculate progress
  const requiredFields = [
    ...categoryFields.filter(f => f.required).map(f => f.name),
    'serviceAddress.street',
    'serviceAddress.city'
  ];
  
  const getFieldValue = (field: string) => {
    if (field.startsWith('serviceAddress.')) {
      return (data.serviceAddress as any)?.[field.split('.')[1]] || '';
    }
    return (data as any)[field] || '';
  };
  
  const filledCount = requiredFields.filter(f => getFieldValue(f).trim()).length;
  const progress = requiredFields.length > 0 ? (filledCount / requiredFields.length) * 100 : 100;

  const renderField = (
    name: string,
    label: string,
    Icon: React.ComponentType<{ className?: string }>,
    required: boolean = false,
    placeholder: string = "",
    type: string = "text"
  ) => {
    const value = name.startsWith('serviceAddress.') 
      ? (data.serviceAddress as any)?.[name.split('.')[1]] || ''
      : (data as any)[name] || '';
    
    const error = errors[name];
    const showError = touched[name] && error;
    const showSuccess = touched[name] && !error && value.trim();
    const isFocused = focusedField === name;

    return (
      <div className="relative">
        <div className={cn(
          "relative rounded-2xl border-2 transition-all duration-200 bg-white overflow-hidden",
          isFocused && "ring-2 ring-offset-1",
          isFocused && !showError && `ring-primary/30 ${categoryColor.border}`,
          showError && "border-red-300 ring-red-200",
          showSuccess && "border-green-300",
          !isFocused && !showError && !showSuccess && "border-muted-foreground/20"
        )}>
          {/* Label Row */}
          <div className={cn(
            "flex items-center gap-2 px-4 pt-3 pb-1 transition-colors",
            isFocused && categoryColor.bg
          )}>
            <div className={cn(
              "transition-colors",
              isFocused ? categoryColor.text : "text-muted-foreground"
            )}>
              <Icon className="w-4 h-4" />
            </div>
            <Label 
              htmlFor={name} 
              className={cn(
                "text-xs font-medium transition-colors",
                isFocused ? categoryColor.text : "text-muted-foreground"
              )}
            >
              {label}
              {required && <span className="text-red-500 mr-1">*</span>}
            </Label>
            
            {/* Status Indicator */}
            <div className="mr-auto">
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-100 rounded-full p-0.5"
                >
                  <Check className="w-3 h-3 text-green-600" />
                </motion.div>
              )}
              {showError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-100 rounded-full p-0.5"
                >
                  <AlertCircle className="w-3 h-3 text-red-500" />
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Input */}
          <Input
            id={name}
            type={type}
            value={value}
            onChange={(e) => handleFieldChange(name, e.target.value)}
            onBlur={() => handleBlur(name)}
            onFocus={() => handleFocus(name)}
            placeholder={placeholder}
            className={cn(
              "border-0 h-12 text-lg px-4 pb-3 pt-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-muted-foreground/40"
            )}
            style={{ fontSize: '16px' }}
          />
        </div>
        
        {/* Error Message */}
        <AnimatePresence>
          {showError && (
            <motion.p
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              className="text-sm text-red-500 pr-4 pt-1.5"
            >
              ⚠️ {error}
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
      ref={formRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">פרטי השירות</span>
          <span className={cn("font-bold", categoryColor.text)}>
            {filledCount}/{requiredFields.length}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className={cn("h-full rounded-full bg-gradient-to-r", categoryColor.primary)}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Category-specific Fields */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <FileText className="w-4 h-4" />
          <span>פרטי הספק הנוכחי</span>
        </div>
        
        {categoryFields.map(field => (
          <div key={field.name}>
            {renderField(field.name, field.label, field.icon, field.required, field.placeholder)}
          </div>
        ))}
      </div>

      {/* Address Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <MapPin className={cn("w-4 h-4", categoryColor.text)} />
          <span>כתובת השירות</span>
        </div>
        
        {renderField('serviceAddress.street', 'רחוב ומספר', Home, true, 'לדוגמה: הרצל 1')}
        {renderField('serviceAddress.city', 'עיר', Building, true, 'לדוגמה: תל אביב')}
        {renderField('serviceAddress.zipCode', 'מיקוד', Hash, false, 'לדוגמה: 1234567')}
      </div>

      {/* Preferred Date */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Calendar className={cn("w-4 h-4", categoryColor.text)} />
          <span>תאריך מעבר מועדף (אופציונלי)</span>
        </div>
        
        <div className={cn(
          "relative rounded-2xl border-2 transition-all duration-200 bg-white overflow-hidden",
          "border-muted-foreground/20"
        )}>
          <Input
            id="preferredSwitchDate"
            type="date"
            min={getMinDate()}
            value={data.preferredSwitchDate || ''}
            onChange={(e) => handleFieldChange('preferredSwitchDate', e.target.value)}
            className="border-0 h-14 text-lg px-4 focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{ fontSize: '16px' }}
          />
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2 pt-2">
        <Label htmlFor="additionalNotes" className="text-sm font-medium text-muted-foreground">
          הערות נוספות (אופציונלי)
        </Label>
        <Textarea
          id="additionalNotes"
          value={data.additionalNotes || ''}
          onChange={(e) => handleFieldChange('additionalNotes', e.target.value)}
          placeholder="מידע נוסף שברצונכם לציין..."
          className="min-h-[100px] text-base rounded-2xl border-2 border-muted-foreground/20 resize-none focus-visible:ring-2 focus-visible:ring-primary/30"
          style={{ fontSize: '16px' }}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 h-14 text-lg rounded-2xl border-2"
        >
          <ChevronRight className="w-5 h-5 ml-2" />
          חזרה
        </Button>
        <Button
          onClick={handleNext}
          disabled={progress < 100}
          className={cn(
            "flex-[2] h-14 text-lg font-bold rounded-2xl shadow-lg",
            "bg-gradient-to-r",
            categoryColor.primary,
            "hover:opacity-90 hover:shadow-xl active:scale-[0.98]",
            "disabled:opacity-50"
          )}
        >
          המשך לחתימה
          <ChevronLeft className="w-5 h-5 mr-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default ServiceDetailsStep;
