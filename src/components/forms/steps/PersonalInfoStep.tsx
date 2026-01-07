import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Mail, CreditCard, Building2, Check, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    setFields(prev => ({
      ...prev,
      [name]: { ...prev[name], isTouched: true }
    }));
  };

  const handleNext = () => {
    const requiredFields = data.customerType === 'private' 
      ? ['fullName', 'nationalId', 'phone', 'email']
      : ['fullName', 'nationalId', 'phone', 'email', 'companyName', 'companyId'];
    
    let hasError = false;
    
    requiredFields.forEach(fieldName => {
      const field = fields[fieldName];
      if (!field.value || !field.isValid) {
        hasError = true;
        setShakeField(fieldName);
        setTimeout(() => setShakeField(null), 500);
        setFields(prev => ({
          ...prev,
          [fieldName]: { ...prev[fieldName], isTouched: true, isValid: false }
        }));
      }
    });

    if (!hasError) {
      onNext();
    }
  };

  const renderField = (
    name: string,
    label: string,
    icon: React.ReactNode,
    type: string = "text",
    placeholder: string = "",
    inputMode?: "text" | "numeric" | "tel" | "email"
  ) => {
    const field = fields[name];
    const showError = field.isTouched && field.isValid === false;
    const showSuccess = field.isValid === true;

    return (
      <motion.div
        className="space-y-2"
        animate={shakeField === name ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <Label htmlFor={name} className="text-sm font-medium flex items-center gap-2">
          {icon}
          {label}
        </Label>
        <div className="relative">
          <Input
            id={name}
            type={type}
            inputMode={inputMode}
            value={field.value}
            onChange={(e) => handleChange(name, e.target.value)}
            onBlur={() => handleBlur(name)}
            placeholder={placeholder}
            className={cn(
              "h-12 text-base px-4 transition-all duration-200",
              showError && "border-red-400 focus:border-red-500 focus:ring-red-200",
              showSuccess && "border-green-400 focus:border-green-500 focus:ring-green-200",
              !showError && !showSuccess && "focus:ring-primary/20"
            )}
          />
          
          {/* Validation Indicator */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <AnimatePresence mode="wait">
              {field.isValidating && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                </motion.div>
              )}
              {!field.isValidating && showSuccess && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Check className="w-5 h-5 text-green-500" />
                </motion.div>
              )}
              {!field.isValidating && showError && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Error Message */}
        <AnimatePresence>
          {showError && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-red-500 pr-1"
            >
              {name === 'nationalId' && 'מספר ת.ז. לא תקין'}
              {name === 'phone' && 'מספר טלפון לא תקין'}
              {name === 'email' && 'כתובת אימייל לא תקינה'}
              {name === 'fullName' && 'יש להזין שם מלא'}
              {name === 'companyName' && 'יש להזין שם חברה'}
              {name === 'companyId' && 'מספר ח.פ./ע.מ. לא תקין'}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    );
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
              <User className="w-5 h-5" />
            </div>
            פרטים אישיים
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Customer Type Toggle */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">סוג לקוח</Label>
            <Tabs 
              value={data.customerType} 
              onValueChange={(v) => onUpdate({ customerType: v as 'private' | 'business' })}
              dir="rtl"
            >
              <TabsList className="grid w-full grid-cols-2 h-14 p-1">
                <TabsTrigger 
                  value="private" 
                  className="flex items-center gap-2 data-[state=active]:shadow-md h-full"
                >
                  <User className="w-4 h-4" />
                  <span>פרטי</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="business" 
                  className="flex items-center gap-2 data-[state=active]:shadow-md h-full"
                >
                  <Building2 className="w-4 h-4" />
                  <span>עסקי</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField(
              'fullName',
              'שם מלא',
              <User className="w-4 h-4 text-muted-foreground" />,
              'text',
              'ישראל ישראלי'
            )}
            
            {renderField(
              'nationalId',
              'תעודת זהות',
              <CreditCard className="w-4 h-4 text-muted-foreground" />,
              'text',
              '123456789',
              'numeric'
            )}
            
            {renderField(
              'phone',
              'טלפון נייד',
              <Phone className="w-4 h-4 text-muted-foreground" />,
              'tel',
              '050-1234567',
              'tel'
            )}
            
            {renderField(
              'email',
              'דוא"ל',
              <Mail className="w-4 h-4 text-muted-foreground" />,
              'email',
              'email@example.com',
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
                className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t"
              >
                {renderField(
                  'companyName',
                  'שם חברה',
                  <Building2 className="w-4 h-4 text-muted-foreground" />,
                  'text',
                  'שם החברה בע"מ'
                )}
                
                {renderField(
                  'companyId',
                  'ח.פ. / ע.מ.',
                  <CreditCard className="w-4 h-4 text-muted-foreground" />,
                  'text',
                  '123456789',
                  'numeric'
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            className={cn(
              "w-full h-14 text-lg font-medium mt-6",
              "bg-gradient-to-r",
              categoryColor.primary,
              "hover:opacity-90 transition-opacity"
            )}
          >
            המשך לשלב הבא
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PersonalInfoStep;
