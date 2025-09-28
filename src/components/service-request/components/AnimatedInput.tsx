import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  required?: boolean;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  validation?: (value: string) => boolean;
  className?: string;
}

export function AnimatedInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  helperText,
  errorMessage,
  successMessage,
  validation,
  className
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const isValid = validation ? validation(value) : true;
  const hasError = value && !isValid;
  const hasSuccess = value && isValid;
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={cn("space-y-2 group", className)}>
      <Label 
        htmlFor={id} 
        className={cn(
          "font-assistant font-semibold transition-all duration-300 flex items-center gap-2",
          isFocused && "text-primary",
          hasError && "text-destructive",
          hasSuccess && "text-success"
        )}
      >
        {label}
        {required && <span className="text-destructive">*</span>}
        {hasSuccess && <CheckCircle className="w-4 h-4 text-success animate-scale-in" />}
      </Label>
      
      <div className="relative">
        <Input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "font-assistant transition-all duration-300 relative z-10",
            "focus:ring-4 focus:ring-primary/20 focus:border-primary",
            hasError && "border-destructive/50 bg-destructive/5 focus:border-destructive focus:ring-destructive/20",
            hasSuccess && "border-success/50 bg-success/5 focus:border-success focus:ring-success/20",
            "group-hover:border-primary/50"
          )}
          required={required}
        />
        
        {/* Password toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200 z-20"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}

        {/* Animated border glow */}
        <div className={cn(
          "absolute inset-0 rounded-md opacity-0 pointer-events-none transition-opacity duration-300",
          "bg-gradient-to-r from-primary/10 via-primary-glow/20 to-primary/10",
          isFocused && "opacity-100",
          hasError && "from-destructive/10 via-destructive/20 to-destructive/10",
          hasSuccess && "from-success/10 via-success/20 to-success/10"
        )} />
      </div>

      {/* Messages */}
      {helperText && !hasError && !hasSuccess && (
        <p className="text-xs text-muted-foreground font-assistant animate-fade-in">
          {helperText}
        </p>
      )}
      
      {hasError && errorMessage && (
        <Alert className="border-destructive/30 bg-destructive/5 animate-fade-in">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive font-assistant text-sm">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {hasSuccess && successMessage && (
        <Alert className="border-success/30 bg-success/5 animate-fade-in">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertDescription className="text-success font-assistant text-sm">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}