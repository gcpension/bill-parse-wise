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

// Hebrew name validation (letters and spaces only)
export const validateHebrewName = (name: string): boolean => {
  return /^[\u0590-\u05FF\s]+$/.test(name.trim()) && name.trim().length > 0;
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

// Validation messages
export const ValidationMessages = {
  fullName: 'נא להזין שם מלא בעברית',
  idNumber: 'המספר שהוזן לא תקין (בדיקת ספרת ביקורת נכשלה)',
  companyId: 'מספר תאגיד חייב לכלול 8–9 ספרות',
  phone: 'נא להזין מספר נייד ישראלי בפורמט 05X-XXXXXXX',
  email: 'נא להזין כתובת דוא״ל תקינה',
  contractNumber: 'שדה חובה',
  phoneNumber: 'הפורמט חייב להיות ‎05X-XXXXXXX',
  requiredFile: 'חובה לצרף את כל הקבצים המסומנים',
  futureDate: 'על התאריך להיות עתידי',
  otpConfirmation: 'יש לאשר קבלת SMS ב-SIM הנוכחי',
  bundleService: 'נדרשות שתי בקשות — תשתית ו-ISP',
  equipmentReturn: 'נא לבחור אפשרות'
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
    errors.push(ValidationMessages.fullName);
  } else if (!validateHebrewName(fullName)) {
    errors.push(ValidationMessages.fullName);
  }
  
  if (!idNumber.trim()) {
    errors.push(ValidationMessages.idNumber);
  } else if (!validateIsraeliId(idNumber)) {
    errors.push(ValidationMessages.idNumber);
  }
  
  if (!phone.trim()) {
    errors.push(ValidationMessages.phone);
  } else if (!validateIsraeliMobile(phone)) {
    errors.push(ValidationMessages.phone);
  }
  
  if (!email.trim()) {
    errors.push(ValidationMessages.email);
  } else if (!validateEmail(email)) {
    errors.push(ValidationMessages.email);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};