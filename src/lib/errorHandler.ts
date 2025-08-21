import { toast } from '@/hooks/use-toast';

export interface ErrorDetails {
  message: string;
  code?: string;
  action?: string;
}

export class AppError extends Error {
  code?: string;
  action?: string;

  constructor(message: string, code?: string, action?: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.action = action;
  }
}

export const handleError = (error: unknown, context?: string): void => {
  console.error(`Error in ${context || 'Unknown context'}:`, error);

  let errorMessage = 'אירעה שגיאה לא צפויה';
  let errorAction = 'נסה שוב מאוחר יותר';

  if (error instanceof AppError) {
    errorMessage = error.message;
    errorAction = error.action || errorAction;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  toast({
    title: 'שגיאה',
    description: `${errorMessage}. ${errorAction}`,
    variant: 'destructive',
  });
};

export const createUserFriendlyError = (
  technicalError: unknown,
  userMessage: string,
  actionMessage?: string
): AppError => {
  console.error('Technical error:', technicalError);
  return new AppError(userMessage, undefined, actionMessage);
};

// Common error messages in Hebrew
export const ErrorMessages = {
  NETWORK_ERROR: 'בעיה בחיבור לאינטרנט',
  FILE_TOO_LARGE: 'הקובץ גדול מדי. גודל מקסימלי: 10MB',
  UNSUPPORTED_FILE: 'סוג קובץ לא נתמך. נתמכים: JPG, PNG, PDF',
  PARSING_ERROR: 'לא ניתן לנתח את הקובץ',
  SAVE_ERROR: 'לא ניתן לשמור את הנתונים',
  LOAD_ERROR: 'לא ניתן לטעון את הנתונים',
  VALIDATION_ERROR: 'נתונים לא תקינים',
  QUOTA_EXCEEDED: 'חרגת ממגבלת השימוש',
} as const;