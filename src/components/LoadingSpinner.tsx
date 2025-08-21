import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elegant' | 'minimal';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'טוען...',
  size = 'md',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const containerSizeClasses = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12'
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        {message && <span className="text-muted-foreground">{message}</span>}
      </div>
    );
  }

  if (variant === 'elegant') {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-12">
        {/* Animated Background */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary-glow/30 to-success/20 rounded-full animate-ping"></div>
          <div className="relative p-6 bg-gradient-to-br from-primary/10 via-primary-glow/10 to-success/10 rounded-full border border-primary/20">
            <Sparkles className={`${sizeClasses.lg} text-primary animate-pulse`} />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold text-primary">{message}</p>
          <p className="text-sm text-muted-foreground">אנא המתן...</p>
        </div>

        {/* Progress Animation */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full animate-pulse transform scale-x-50 origin-left"></div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex flex-col items-center justify-center ${containerSizeClasses[size]} space-y-4`}>
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        <div className="absolute inset-0 animate-ping">
          <Loader2 className={`${sizeClasses[size]} text-primary/30`} />
        </div>
      </div>
      
      {message && (
        <p className="text-center text-muted-foreground font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};