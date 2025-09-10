import { z } from 'zod';

// Validation schemas
export const categoryDataSchema = z.object({
  category: z.enum(['electricity', 'cellular', 'internet', 'tv']),
  currentProvider: z.string().min(1, 'יש לבחור ספק נוכחי'),
  monthlyAmount: z.string()
    .min(1, 'יש להזין סכום חודשי')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'הסכום חייב להיות מספר חיובי'),
  accountDetails: z.string().optional(),
  isActive: z.boolean(),
});

export const analysisFormSchema = z.object({
  categories: z.array(categoryDataSchema)
    .min(1, 'יש לבחור לפחות קטגוריה אחת')
    .refine((categories) => {
      return categories.some(cat => cat.isActive && parseFloat(cat.monthlyAmount) > 0);
    }, 'יש להזין נתונים תקינים לפחות בקטגוריה אחת'),
});

// Validation functions
export const validateAmount = (amount: string, category: string): string | null => {
  if (!amount || amount.trim() === '') {
    return 'יש להזין סכום';
  }

  const num = parseFloat(amount);
  if (isNaN(num)) {
    return 'יש להזין מספר תקין';
  }

  if (num <= 0) {
    return 'הסכום חייב להיות חיובי';
  }

  // Category-specific validations
  switch (category) {
    case 'electricity':
      if (num < 50) {
        return 'חשבון חשמל נמוך מהרגיל - בדוק שהסכום נכון';
      }
      if (num > 5000) {
        return 'חשבון חשמל גבוה מהרגיל - בדוק שהסכום נכון';
      }
      break;
    
    case 'cellular':
      if (num < 20) {
        return 'תעריף סלולר נמוך מהרגיל - בדוק שהסכום נכון';
      }
      if (num > 500) {
        return 'תעריף סלולר גבוה מהרגיל - בדוק שהסכום נכון';
      }
      break;
    
    case 'internet':
      if (num < 30) {
        return 'תעריף אינטרנט נמוך מהרגיל - בדוק שהסכום נכון';
      }
      if (num > 300) {
        return 'תעריף אינטרנט גבוה מהרגיל - בדוק שהסכום נכון';
      }
      break;
    
    case 'tv':
      if (num < 20) {
        return 'תעריף טלוויזיה נמוך מהרגיל - בדוק שהסכום נכון';
      }
      if (num > 400) {
        return 'תעריף טלוויזיה גבוה מהרגיל - בדוק שהסכום נכון';
      }
      break;
  }

  return null;
};

export const validateProvider = (provider: string): string | null => {
  if (!provider || provider.trim() === '') {
    return 'יש לבחור ספק';
  }
  
  if (provider.length < 2) {
    return 'שם הספק קצר מדי';
  }

  return null;
};

export const validateForm = (categoryData: Record<string, any>): { isValid: boolean; errors: Record<string, string[]> } => {
  const errors: Record<string, string[]> = {};
  let isValid = true;

  const activeCategories = Object.entries(categoryData).filter(([_, data]) => data.isActive);
  
  if (activeCategories.length === 0) {
    errors.general = ['יש לבחור לפחות קטגוריה אחת'];
    isValid = false;
  }

  activeCategories.forEach(([key, data]) => {
    const categoryErrors: string[] = [];

    // Validate provider
    const providerError = validateProvider(data.currentProvider);
    if (providerError) {
      categoryErrors.push(providerError);
    }

    // Validate amount
    const amountError = validateAmount(data.monthlyAmount, data.category);
    if (amountError) {
      categoryErrors.push(amountError);
    }

    if (categoryErrors.length > 0) {
      errors[key] = categoryErrors;
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Real-time validation hook
import { useState, useEffect } from 'react';

export const useFormValidation = (categoryData: Record<string, any>) => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isValid, setIsValid] = useState(true); // Start as valid
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const validateField = (category: string, field: string, value: string) => {
    const fieldKey = `${category}-${field}`;
    setTouchedFields(prev => new Set(prev).add(fieldKey));
    
    let fieldError: string | null = null;

    if (field === 'monthlyAmount') {
      fieldError = validateAmount(value, category);
    } else if (field === 'currentProvider') {
      fieldError = validateProvider(value);
    }

    setErrors(prev => ({
      ...prev,
      [category]: fieldError ? [fieldError] : []
    }));

    return fieldError === null;
  };

  const validateAll = () => {
    const validation = validateForm(categoryData);
    setErrors(validation.errors);
    setIsValid(validation.isValid);
    return validation.isValid;
  };

  // Only validate touched fields or active categories with data
  useEffect(() => {
    const activeCategories = Object.values(categoryData).filter((cat: any) => cat.isActive);
    const hasData = activeCategories.some((cat: any) => cat.monthlyAmount || cat.currentProvider);
    
    if (hasData || touchedFields.size > 0) {
      const validation = validateForm(categoryData);
      setErrors(validation.errors);
      setIsValid(validation.isValid);
    }
  }, [categoryData, touchedFields]);

  return {
    errors,
    isValid,
    validateField,
    validateAll,
    hasError: (category: string) => {
      const categoryData_ = categoryData[category];
      const hasTouchedField = touchedFields.has(`${category}-monthlyAmount`) || touchedFields.has(`${category}-currentProvider`);
      const hasData = categoryData_?.monthlyAmount || categoryData_?.currentProvider;
      return (hasTouchedField || hasData) && errors[category] && errors[category].length > 0;
    },
    getError: (category: string) => {
      const categoryData_ = categoryData[category];
      const hasTouchedField = touchedFields.has(`${category}-monthlyAmount`) || touchedFields.has(`${category}-currentProvider`);
      const hasData = categoryData_?.monthlyAmount || categoryData_?.currentProvider;
      return (hasTouchedField || hasData) && errors[category]?.[0] || null;
    },
  };
};