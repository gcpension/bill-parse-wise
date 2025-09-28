import { toast } from '@/hooks/use-toast';
import { CheckCircle, AlertTriangle, XCircle, Info, Sparkles } from 'lucide-react';

export interface EnhancedToastOptions {
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class EnhancedToastService {
  success(options: EnhancedToastOptions) {
    return toast({
      title: options.title,
      description: options.description,
      duration: options.duration || 4000,
      className: "border-green-200 bg-green-50 text-green-900",
      action: options.action ? (
        <button
          onClick={options.action.onClick}
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {options.action.label}
        </button>
      ) : undefined,
    });
  }

  error(options: EnhancedToastOptions) {
    return toast({
      title: options.title,
      description: options.description,
      duration: options.duration || 6000,
      className: "border-red-200 bg-red-50 text-red-900",
      action: options.action ? (
        <button
          onClick={options.action.onClick}
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          {options.action.label}
        </button>
      ) : undefined,
    });
  }

  warning(options: EnhancedToastOptions) {
    return toast({
      title: options.title,
      description: options.description,
      duration: options.duration || 5000,
      className: "border-yellow-200 bg-yellow-50 text-yellow-900",
      action: options.action ? (
        <button
          onClick={options.action.onClick}
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          {options.action.label}
        </button>
      ) : undefined,
    });
  }

  info(options: EnhancedToastOptions) {
    return toast({
      title: options.title,
      description: options.description,
      duration: options.duration || 4000,
      className: "border-blue-200 bg-blue-50 text-blue-900",
      action: options.action ? (
        <button
          onClick={options.action.onClick}
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {options.action.label}
        </button>
      ) : undefined,
    });
  }

  premium(options: EnhancedToastOptions) {
    return toast({
      title: options.title,
      description: options.description,
      duration: options.duration || 5000,
      className: "border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-900 shadow-lg",
      action: options.action ? (
        <button
          onClick={options.action.onClick}
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-gradient-to-r from-purple-500 to-pink-500 px-3 text-sm font-medium text-white transition-all duration-300 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          {options.action.label}
        </button>
      ) : undefined,
    });
  }

  // Shorthand methods for common use cases
  quickSuccess(title: string, description?: string) {
    return this.success({ title, description });
  }

  quickError(title: string, description?: string) {
    return this.error({ title, description });
  }

  quickWarning(title: string, description?: string) {
    return this.warning({ title, description });
  }

  quickInfo(title: string, description?: string) {
    return this.info({ title, description });
  }
}

export const enhancedToast = new EnhancedToastService();