import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  subMessage?: string;
  variant?: 'default' | 'premium' | 'minimal';
  className?: string;
}

export const LoadingOverlay = ({ 
  isVisible, 
  message = 'טוען...', 
  subMessage,
  variant = 'default',
  className = ''
}: LoadingOverlayProps) => {
  if (!isVisible) return null;

  const variants = {
    default: {
      overlay: 'bg-background/80 backdrop-blur-sm',
      container: 'bg-card border border-border shadow-lg',
      icon: <Loader2 className="w-8 h-8 animate-spin text-primary" />,
      text: 'text-foreground'
    },
    premium: {
      overlay: 'bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-md',
      container: 'bg-gradient-to-br from-card via-purple-50/50 to-pink-50/50 border border-purple-200 shadow-xl',
      icon: <Sparkles className="w-8 h-8 animate-pulse text-purple-600" />,
      text: 'text-purple-900'
    },
    minimal: {
      overlay: 'bg-white/50 backdrop-blur-sm',
      container: 'bg-transparent',
      icon: <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />,
      text: 'text-muted-foreground'
    }
  };

  const currentVariant = variants[variant];

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center',
      currentVariant.overlay,
      className
    )}>
      <div className={cn(
        'flex flex-col items-center justify-center p-8 rounded-xl max-w-sm mx-4',
        currentVariant.container
      )}>
        <div className="mb-4">
          {currentVariant.icon}
        </div>
        
        <h3 className={cn(
          'text-lg font-semibold mb-2 text-center font-heebo',
          currentVariant.text
        )}>
          {message}
        </h3>
        
        {subMessage && (
          <p className={cn(
            'text-sm text-center font-assistant opacity-80',
            currentVariant.text
          )}>
            {subMessage}
          </p>
        )}
        
        {variant === 'premium' && (
          <div className="mt-4 flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>
    </div>
  );
};