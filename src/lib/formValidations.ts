import { FormValidation } from '@/types/switchForms';

// Israeli ID validation with check digit
export const validateIsraeliId = (id: string): boolean => {
  if (!/^\d{9}$/.test(id)) return false;
  
  const digits = id.split('').map(Number);
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    let digit = digits[i] * ((i % 2) + 1);
    if (digit > 9) digit = Math.floor(digit / 10) + (digit % 10);
    sum += digit;
  }
  
  return sum % 10 === 0;
};

// Israeli company ID validation (8-9 digits)
export const validateCompanyId = (id: string): boolean => {
  return /^\d{8,9}$/.test(id);
};

// Israeli mobile phone validation
export const validateIsraeliMobile = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[-\s]/g, '');
  return /^05[0-9]-?\d{7}$/.test(cleanPhone) || /^05[0-9]\d{7}$/.test(cleanPhone);
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Future date validation
export const validateFutureDate = (date: string): boolean => {
  const selectedDate = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return selectedDate >= tomorrow;
};

// File validation
export const validateFile = (file: File | null, maxSizeMB: number = 10): { valid: boolean; error?: string } => {
  if (!file) return { valid: false, error: 'חובה לצרף קובץ' };
  
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'סוג קובץ לא נתמך. יש להעלות JPG, PNG או PDF' };
  }
  
  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: `גודל הקובץ חורג מ-${maxSizeMB}MB` };
  }
  
  return { valid: true };
};

// Common form validation function
export const validateCommonFields = (
  fullName: string,
  idNumber: string,
  phone: string,
  email: string
): FormValidation => {
  const errors: string[] = [];
  
  if (!fullName.trim()) {
    errors.push('נא להזין שם מלא');
  }
  
  if (!idNumber.trim()) {
    errors.push('מספר ת.ז. לא תקין (בדיקת ספרת ביקורת נכשלה)');
  } else if (!validateIsraeliId(idNumber)) {
    errors.push('מספר ת.ז. לא תקין (בדיקת ספרת ביקורת נכשלה)');
  }
  
  if (!phone.trim()) {
    errors.push('נא להזין מספר נייד ישראלי בפורמט 05X-XXXXXXX');
  } else if (!validateIsraeliMobile(phone)) {
    errors.push('נא להזין מספר נייד ישראלי בפורמט 05X-XXXXXXX');
  }
  
  if (!email.trim()) {
    errors.push('נא להזין כתובת דוא"ל תקינה');
  } else if (!validateEmail(email)) {
    errors.push('נא להזין כתובת דוא"ל תקינה');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};