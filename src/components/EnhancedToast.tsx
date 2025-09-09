import { CheckCircle, AlertCircle, XCircle, Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-success" />;
    case 'error':
      return <XCircle className="w-5 h-5 text-destructive" />;
    case 'warning':
      return <AlertCircle className="w-5 h-5 text-warning" />;
    case 'info':
      return <Info className="w-5 h-5 text-primary" />;
    case 'loading':
      return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
    default:
      return <Info className="w-5 h-5 text-primary" />;
  }
};

const getToastStyle = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'border-success/20 bg-success/5';
    case 'error':
      return 'border-destructive/20 bg-destructive/5';
    case 'warning':
      return 'border-warning/20 bg-warning/5';
    case 'info':
      return 'border-primary/20 bg-primary/5';
    case 'loading':
      return 'border-primary/20 bg-primary/5';
    default:
      return 'border-border bg-background';
  }
};

export const enhancedToast = {
  success: (options: ToastOptions) => {
    toast.success(options.title, {
      description: options.description,
      duration: options.duration || 4000,
      icon: getToastIcon('success'),
      className: getToastStyle('success'),
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  },

  error: (options: ToastOptions) => {
    toast.error(options.title, {
      description: options.description,
      duration: options.duration || 6000,
      icon: getToastIcon('error'),
      className: getToastStyle('error'),
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  },

  warning: (options: ToastOptions) => {
    toast.warning(options.title, {
      description: options.description,
      duration: options.duration || 5000,
      icon: getToastIcon('warning'),
      className: getToastStyle('warning'),
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  },

  info: (options: ToastOptions) => {
    toast.info(options.title, {
      description: options.description,
      duration: options.duration || 4000,
      icon: getToastIcon('info'),
      className: getToastStyle('info'),
      action: options.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    });
  },

  loading: (options: ToastOptions) => {
    return toast.loading(options.title, {
      description: options.description,
      icon: getToastIcon('loading'),
      className: getToastStyle('loading'),
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading: options.loading,
      success: options.success,
      error: options.error,
    });
  },
};

// Enhanced toast for analysis operations
export const analysisToast = {
  startAnalysis: () => {
    return enhancedToast.loading({
      title: 'מתחיל ניתוח...',
      description: 'אנא המתן, אנחנו מנתחים את הנתונים שלך',
    });
  },

  analysisSuccess: (savingsAmount: number) => {
    enhancedToast.success({
      title: '🎉 הניתוח הושלם בהצלחה!',
      description: `מצאנו לך חיסכון של ₪${savingsAmount.toLocaleString()} לחודש`,
      duration: 6000,
    });
  },

  analysisError: (error?: string) => {
    enhancedToast.error({
      title: 'שגיאה בניתוח',
      description: error || 'אירעה שגיאה בעת ניתוח הנתונים. אנא נסה שוב.',
      action: {
        label: 'נסה שוב',
        onClick: () => window.location.reload(),
      },
    });
  },

  dataSaved: () => {
    enhancedToast.success({
      title: 'הנתונים נשמרו!',
      description: 'ההשוואה שלך נשמרה בהצלחה',
    });
  },

  validationError: (message: string) => {
    enhancedToast.warning({
      title: 'בדוק את הנתונים',
      description: message,
      duration: 5000,
    });
  },
};