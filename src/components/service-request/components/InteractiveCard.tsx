import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface InteractiveCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected?: boolean;
  isCompleted?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'purple' | 'blue' | 'green' | 'orange';
  className?: string;
}

export function InteractiveCard({ 
  title, 
  description, 
  icon, 
  isSelected, 
  isCompleted,
  onClick, 
  children, 
  variant = 'default',
  className 
}: InteractiveCardProps) {
  const { isVisible, elementRef } = useScrollAnimation();

  const variantStyles = {
    default: 'border-primary/20 hover:border-primary/50 bg-gradient-to-r from-white to-primary/5',
    success: 'border-success/30 bg-gradient-to-r from-success/10 to-success-glow/10',
    purple: 'border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100/50',
    blue: 'border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100/50',
    green: 'border-green-200 bg-gradient-to-r from-green-50 to-green-100/50',
    orange: 'border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100/50'
  };

  return (
    <Card 
      ref={elementRef}
      className={cn(
        "group relative overflow-hidden transition-all duration-500 hover-scale cursor-pointer",
        "glass-card shadow-elegant border-2",
        variantStyles[variant],
        isSelected && "ring-4 ring-primary/30 border-primary shadow-primary/20 shadow-2xl",
        isCompleted && "border-success/50 bg-gradient-to-r from-success/10 to-success-glow/10",
        isVisible ? "animate-fade-in" : "opacity-0 translate-y-10",
        className
      )}
      onClick={onClick}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary-glow/30 to-primary/20 animate-gradient-x"></div>
      </div>
      
      {/* Sparkle effect for selected items */}
      {isSelected && (
        <div className="absolute top-4 right-4 z-20">
          <Sparkles className="w-6 h-6 text-primary animate-pulse-glow" />
        </div>
      )}

      {/* Completion badge */}
      {isCompleted && (
        <div className="absolute top-4 right-4 z-20">
          <Badge className="bg-success text-white border-0 animate-bounce-gentle">
            <CheckCircle className="w-4 h-4 ml-1" />
            הושלם
          </Badge>
        </div>
      )}

      <CardHeader className="relative z-10">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-4 rounded-2xl transition-all duration-300 group-hover:scale-110",
            isSelected 
              ? "bg-primary text-white shadow-primary/30 shadow-lg" 
              : "bg-gradient-to-r from-primary to-primary-glow text-white"
          )}>
            {icon}
          </div>
          <div className="flex-1">
            <CardTitle className={cn(
              "text-xl font-heebo transition-colors duration-300",
              isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
            )}>
              {title}
            </CardTitle>
            <p className={cn(
              "text-sm font-assistant mt-1 transition-colors duration-300",
              isSelected ? "text-primary/80" : "text-muted-foreground"
            )}>
              {description}
            </p>
          </div>
        </div>
      </CardHeader>

      {children && (
        <CardContent className="relative z-10 pt-0">
          {children}
        </CardContent>
      )}

      {/* Interactive border glow */}
      <div className={cn(
        "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300",
        "bg-gradient-to-r from-primary/20 via-primary-glow/30 to-primary/20",
        "group-hover:opacity-100"
      )} />
    </Card>
  );
}