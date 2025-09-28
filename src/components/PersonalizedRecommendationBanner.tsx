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
      "fixed bottom-6 right-6 z-50 animate-fade-in",
      className
    )}>
      <div className="bg-gradient-to-r from-white via-green-50/80 to-white backdrop-blur-sm rounded-xl shadow-xl border-2 border-green-200/50 px-6 py-4 max-w-md hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between gap-4">
          {/* Content */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md animate-pulse">
              <User className="w-6 h-6 text-white" />
            </div>
            
            <div>
              <h3 className="text-base font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent font-heebo">
                המלצה אישית מותאמת
              </h3>
              <p className="text-xs text-gray-600 font-assistant">
                קבלו המלצות מדויקות בהתאם לצרכים שלכם
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">התאמה אישית</span>
              </div>
            </div>
          </div>
          
          {/* Button */}
          <Button 
            size="sm"
            className="h-10 px-4 text-sm font-heebo bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={onRecommendationClick}
          >
            <Target className="w-4 h-4 ml-2" />
            התחל
          </Button>
        </div>
      </div>
    </div>
  );
};