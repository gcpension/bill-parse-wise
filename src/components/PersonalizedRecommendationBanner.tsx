import { Button } from "@/components/ui/button";
import { User, Target } from "lucide-react";
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
      "fixed bottom-6 right-6 z-50 animate-fade-in hover:scale-105 transition-all duration-300",
      className
    )}>
      <div className="bg-gradient-to-r from-white via-green-50/90 to-white backdrop-blur-md rounded-xl shadow-lg border border-green-200/60 px-5 py-3 max-w-sm hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between gap-3">
          {/* Content */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-green-700 font-heebo leading-tight">
                המלצה אישית מותאמת
              </h3>
              <p className="text-xs text-gray-600 font-assistant">
                קבלו המלצות מדויקות בהתאם לצרכים
              </p>
            </div>
          </div>
          
          {/* Button */}
          <Button 
            size="sm"
            className="h-8 px-3 text-xs font-heebo bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
            onClick={onRecommendationClick}
          >
            <Target className="w-3 h-3 ml-1.5" />
            התחל
          </Button>
        </div>
      </div>
    </div>
  );
};