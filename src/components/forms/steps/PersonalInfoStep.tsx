import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Mail, CreditCard, Building2, Check, AlertCircle, Loader2, ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PersonalInfoData {
  customerType: 'private' | 'business';
  fullName: string;
  nationalId: string;
  phone: string;
  email: string;
  companyName?: string;
  companyId?: string;
}

interface PersonalInfoStepProps {
  data: PersonalInfoData;
  onUpdate: (data: Partial<PersonalInfoData>) => void;
  onNext: () => void;
  categoryColor?: {
    primary: string;
    light: string;
    text: string;
    border: string;
    bg: string;
  };
}

// Israeli ID validation (Luhn algorithm variant)
const validateIsraeliId = (id: string): boolean => {
  if (!/^\d{9}$/.test(id)) return false;
  const digits = id.split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let num = digits[i] * ((i % 2) + 1);
    if (num > 9) num -= 9;
    sum += num;
  }
  return sum % 10 === 0;
};

// Israeli phone validation
const validateIsraeliPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return /^(05\d{8}|0[23489]\d{7})$/.test(cleaned);
};

// Email validation
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

interface FieldState {
  value: string;
  isValid: boolean | null;
  isTouched: boolean;
  isValidating: boolean;
}

export const PersonalInfoStep = ({
  data,
  onUpdate,
  onNext,
  categoryColor = {
    primary: "from-primary to-primary/80",
    light: "from-primary/5 to-primary/10",
    text: "text-primary",
    border: "border-primary/20",
    bg: "bg-primary/5"
  }
}: PersonalInfoStepProps) => {
  const [fields, setFields] = useState<Record<string, FieldState>>({
    fullName: { value: data.fullName || '', isValid: null, isTouched: false, isValidating: false },
    nationalId: { value: data.nationalId || '', isValid: null, isTouched: false, isValidating: false },
    phone: { value: data.phone || '', isValid: null, isTouched: false, isValidating: false },
    email: { value: data.email || '', isValid: null, isTouched: false, isValidating: false },
    companyName: { value: data.companyName || '', isValid: null, isTouched: false, isValidating: false },
    companyId: { value: data.companyId || '', isValid: null, isTouched: false, isValidating: false },
  });

  const [shakeField, setShakeField] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to focused field on mobile
  useEffect(() => {
    if (focusedField && formRef.current) {
      const element = document.getElementById(focusedField);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [focusedField]);

  const validateField = (name: string, value: string): boolean => {
    switch (name) {
      case 'fullName':
        return value.trim().length >= 2;
      case 'nationalId':
        return validateIsraeliId(value);
      case 'phone':
        return validateIsraeliPhone(value);
      case 'email':
        return validateEmail(value);
      case 'companyName':
        return value.trim().length >= 2;
      case 'companyId':
        return /^\d{9}$/.test(value);
      default:
        return true;
    }
  };

  const handleChange = (name: string, value: string) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        isValidating: true,
      }
    }));

    // Debounced validation
    setTimeout(() => {
      const isValid = validateField(name, value);
      setFields(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          isValid: value ? isValid : null,
          isValidating: false,
        }
      }));
      
      // Update parent
      onUpdate({ [name]: value });
    }, 300);
  };

  const handleBlur = (name: string) => {
    setFocusedField(null);
    setFields(prev => ({
      ...prev,
      [name]: { ...prev[name], isTouched: true }
    }));
  };

  const handleFocus = (name: string) => {
    setFocusedField(name);
  };

  const handleNext = () => {
    const requiredFields = data.customerType === 'private' 
      ? ['fullName', 'nationalId', 'phone', 'email']
      : ['fullName', 'nationalId', 'phone', 'email', 'companyName', 'companyId'];
    
    let hasError = false;
    let firstErrorField: string | null = null;
    
    requiredFields.forEach(fieldName => {
      const field = fields[fieldName];
      if (!field.value || !field.isValid) {
        hasError = true;
        if (!firstErrorField) firstErrorField = fieldName;
        setShakeField(fieldName);
        setTimeout(() => setShakeField(null), 500);
        setFields(prev => ({
          ...prev,
          [fieldName]: { ...prev[fieldName], isTouched: true, isValid: false }
        }));
      }
    });

    if (hasError && firstErrorField) {
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    } else if (!hasError) {
      onNext();
    }
  };

  // Calculate progress
  const requiredFields = data.customerType === 'private' 
    ? ['fullName', 'nationalId', 'phone', 'email']
    : ['fullName', 'nationalId', 'phone', 'email', 'companyName', 'companyId'];
  
  const filledCount = requiredFields.filter(f => fields[f].isValid).length;
  const progress = (filledCount / requiredFields.length) * 100;

  const renderField = (
    name: string,
    label: string,
    icon: React.ReactNode,
    type: string = "text",
    placeholder: string = "",
    inputMode?: "text" | "numeric" | "tel" | "email",
    autoComplete?: string
  ) => {
    const field = fields[name];
    const showError = field.isTouched && field.isValid === false;
    const showSuccess = field.isValid === true;
    const isFocused = focusedField === name;

    return (
      <motion.div
        className="relative"
        animate={shakeField === name ? { x: [0, -8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {/* Floating Label Style Card */}
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
              {icon}
            </div>
            <Label 
              htmlFor={name} 
              className={cn(
                "text-xs font-medium transition-colors",
                isFocused ? categoryColor.text : "text-muted-foreground"
              )}
            >
              {label}
            </Label>
            
            {/* Status Indicator */}
            <div className="mr-auto">
              <AnimatePresence mode="wait">
                {field.isValidating && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                  </motion.div>
                )}
                {!field.isValidating && showSuccess && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-green-100 rounded-full p-0.5"
                  >
                    <Check className="w-3 h-3 text-green-600" />
                  </motion.div>
                )}
                {!field.isValidating && showError && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-red-100 rounded-full p-0.5"
                  >
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Input */}
          <Input
            id={name}
            type={type}
            inputMode={inputMode}
            autoComplete={autoComplete}
            value={field.value}
            onChange={(e) => handleChange(name, e.target.value)}
            onBlur={() => handleBlur(name)}
            onFocus={() => handleFocus(name)}
            placeholder={placeholder}
            className={cn(
              "border-0 h-12 text-lg px-4 pb-3 pt-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-muted-foreground/40"
            )}
            style={{ fontSize: '16px' }} // Prevent iOS zoom
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
              {name === 'nationalId' && '⚠️ מספר ת.ז. לא תקין'}
              {name === 'phone' && '⚠️ מספר טלפון לא תקין'}
              {name === 'email' && '⚠️ כתובת אימייל לא תקינה'}
              {name === 'fullName' && '⚠️ יש להזין שם מלא'}
              {name === 'companyName' && '⚠️ יש להזין שם חברה'}
              {name === 'companyId' && '⚠️ מספר ח.פ./ע.מ. לא תקין (9 ספרות)'}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    );
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
          <span className="font-medium">מילוי פרטים</span>
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

      {/* Customer Type Toggle - Modern Pills */}
      <div className="flex gap-3 p-1.5 bg-muted/50 rounded-2xl">
        <button
          onClick={() => onUpdate({ customerType: 'private' })}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl transition-all duration-200 font-medium",
            data.customerType === 'private' 
              ? cn("bg-white shadow-md", categoryColor.text)
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <User className="w-5 h-5" />
          <span>לקוח פרטי</span>
        </button>
        <button
          onClick={() => onUpdate({ customerType: 'business' })}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl transition-all duration-200 font-medium",
            data.customerType === 'business' 
              ? cn("bg-white shadow-md", categoryColor.text)
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Building2 className="w-5 h-5" />
          <span>עסקי</span>
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {renderField(
          'fullName',
          'שם מלא',
          <User className="w-4 h-4" />,
          'text',
          'ישראל ישראלי',
          'text',
          'name'
        )}
        
        {renderField(
          'nationalId',
          'תעודת זהות',
          <CreditCard className="w-4 h-4" />,
          'text',
          '123456789',
          'numeric'
        )}
        
        {renderField(
          'phone',
          'טלפון נייד',
          <Phone className="w-4 h-4" />,
          'tel',
          '050-1234567',
          'tel',
          'tel'
        )}
        
        {renderField(
          'email',
          'דואר אלקטרוני',
          <Mail className="w-4 h-4" />,
          'email',
          'email@example.com',
          'email',
          'email'
        )}
      </div>

      {/* Business Fields */}
      <AnimatePresence>
        {data.customerType === 'business' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 pt-2"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span>פרטי העסק</span>
            </div>
            
            {renderField(
              'companyName',
              'שם החברה',
              <Building2 className="w-4 h-4" />,
              'text',
              'שם החברה בע"מ',
              'text',
              'organization'
            )}
            
            {renderField(
              'companyId',
              'ח.פ. / ע.מ.',
              <CreditCard className="w-4 h-4" />,
              'text',
              '123456789',
              'numeric'
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Button - Full width, prominent */}
      <div className="pt-4">
        <Button
          onClick={handleNext}
          disabled={progress < 100}
          className={cn(
            "w-full h-16 text-lg font-bold rounded-2xl shadow-lg transition-all duration-200",
            "bg-gradient-to-r",
            categoryColor.primary,
            "hover:opacity-90 hover:shadow-xl active:scale-[0.98]",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <span>המשך לפרטי השירות</span>
          <ChevronLeft className="w-5 h-5 mr-2" />
        </Button>
        
        {progress < 100 && (
          <p className="text-center text-sm text-muted-foreground mt-3">
            יש למלא את כל השדות להמשך
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default PersonalInfoStep;
