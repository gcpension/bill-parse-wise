import { Button } from "@/components/ui/button";
import { User, Target, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonalizedRecommendationBannerProps {
  onRecommendationClick: () => void;
  className?: string;
}

export const PersonalizedRecommendationBanner = ({ 
  onRecommendationClick, 
  className 
}: PersonalizedRecommendationBannerProps) => {
  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 animate-fade-in hover:scale-105 transition-all duration-500",
      className
    )}>
      <div className="glass-card rounded-2xl shadow-elegant hover:shadow-glow px-4 py-3 max-w-xs border border-border/50 transition-all duration-500 group">
        <div className="flex items-center justify-between gap-3">
          {/* Content */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-foreground font-heebo leading-tight">
                המלצה אישית
              </h3>
              <p className="text-xs text-muted-foreground font-assistant">
                מותאמת לצרכים שלכם
              </p>
            </div>
          </div>
          
          {/* Button */}
          <Button 
            size="sm"
            className="h-7 px-3 text-xs font-heebo bg-primary hover:bg-primary/90 text-primary-foreground shadow-card hover:shadow-elegant transition-all duration-300 rounded-lg"
            onClick={onRecommendationClick}
          >
            <Sparkles className="w-3 h-3 ml-1" />
            התחל
          </Button>
        </div>
      </div>
    </div>
  );
};