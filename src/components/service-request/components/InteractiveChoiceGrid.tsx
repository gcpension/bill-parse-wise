import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';

interface Choice {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color?: string;
  badge?: string;
}

interface InteractiveChoiceGridProps {
  title: string;
  description: string;
  choices: Choice[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function InteractiveChoiceGrid({
  title,
  description,
  choices,
  selectedValue,
  onSelect,
  columns = 2,
  className
}: InteractiveChoiceGridProps) {
  const { visibleItems, containerRef } = useStaggeredAnimation(choices, 150);

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={cn("space-y-6", className)} ref={containerRef}>
      {/* Header */}
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent font-heebo">
          {title}
        </h3>
        <p className="text-muted-foreground font-assistant max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Grid */}
      <div className={cn("grid gap-6", gridCols[columns])}>
        {choices.map((choice, index) => (
          <Button
            key={choice.value}
            variant="outline"
            className={cn(
              "h-auto p-6 flex flex-col items-start gap-4 transition-all duration-500 relative overflow-hidden group",
              "border-2 hover-scale",
              selectedValue === choice.value 
                ? "bg-gradient-to-r from-primary to-primary-glow text-white shadow-elegant border-0 ring-4 ring-primary/30" 
                : "border-primary/20 hover:border-primary/50 bg-white/50 backdrop-blur-sm hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary-glow/5",
              visibleItems[index] ? "animate-fade-in" : "opacity-0 translate-y-10"
            )}
            onClick={() => onSelect(choice.value)}
            style={{ 
              animationDelay: `${index * 150}ms`,
              transitionDelay: `${index * 50}ms`
            }}
          >
            {/* Background sparkle effect for selected */}
            {selectedValue === choice.value && (
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-white/20 animate-gradient-x"></div>
              </div>
            )}

            {/* Selection indicator */}
            {selectedValue === choice.value && (
              <div className="absolute top-3 right-3 z-20">
                <div className="relative">
                  <CheckCircle className="w-6 h-6 text-white animate-bounce-gentle" />
                  <Sparkles className="w-4 h-4 text-white absolute -top-1 -right-1 animate-pulse-glow" />
                </div>
              </div>
            )}

            {/* Badge */}
            {choice.badge && (
              <div className="absolute top-3 left-3 z-20">
                <Badge className="bg-primary/20 text-primary border-primary/30 animate-scale-in">
                  {choice.badge}
                </Badge>
              </div>
            )}

            <div className="flex items-center gap-4 w-full relative z-10">
              <div className={cn(
                "p-4 rounded-2xl transition-all duration-300 group-hover:scale-110",
                selectedValue === choice.value 
                  ? "bg-white/20 backdrop-blur-sm shadow-lg" 
                  : "bg-gradient-to-r from-primary to-primary-glow shadow-md"
              )}>
                <div className="text-white text-xl">
                  {choice.icon}
                </div>
              </div>
              <div className="flex-1 text-right">
                <span className={cn(
                  "font-heebo font-bold text-lg transition-colors duration-300",
                  selectedValue === choice.value ? "text-white" : "text-foreground group-hover:text-primary"
                )}>
                  {choice.label}
                </span>
              </div>
            </div>
            
            <p className={cn(
              "text-sm text-right w-full relative z-10 transition-colors duration-300",
              selectedValue === choice.value ? "text-white/90" : "text-muted-foreground group-hover:text-primary/80"
            )}>
              {choice.description}
            </p>

            {/* Hover effect border */}
            <div className={cn(
              "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 pointer-events-none",
              "bg-gradient-to-r from-primary/10 via-primary-glow/20 to-primary/10",
              "group-hover:opacity-100"
            )} />
          </Button>
        ))}
      </div>
    </div>
  );
}