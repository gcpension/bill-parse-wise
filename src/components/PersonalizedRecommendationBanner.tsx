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
      <div className="bg-gradient-to-br from-white via-emerald-50/90 to-green-50/80 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-emerald-300/30 px-8 py-6 max-w-lg hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:rotate-1">
        {/* Enhanced floating elements */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full animate-bounce opacity-80"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-pulse opacity-60"></div>
        
        <div className="flex items-center justify-between gap-6">
          {/* Enhanced Content */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                <User className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Target className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 bg-clip-text text-transparent font-heebo leading-tight">
                המלצה אישית מותאמת
              </h3>
              <p className="text-sm text-gray-700 font-assistant leading-relaxed">
                קבלו המלצות מדויקות בהתאם לצרכים ולתקציב שלכם
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-emerald-700 font-semibold">התאמה אישית</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-300"></div>
                  <span className="text-xs text-green-700 font-semibold">חיסכון מקסימלי</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-medium">חינמי</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">מהיר</span>
                <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full font-medium">מדויק</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Button */}
          <Button 
            size="lg"
            className="h-14 px-6 text-base font-heebo bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-rotate-1 border-2 border-white/20"
            onClick={onRecommendationClick}
          >
            <div className="flex flex-col items-center gap-1">
              <Target className="w-5 h-5" />
              <span className="font-bold">התחל עכשיו</span>
            </div>
          </Button>
        </div>
        
        {/* Enhanced glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-green-400/20 to-teal-400/20 rounded-2xl blur-xl -z-10 animate-pulse"></div>
      </div>
    </div>
  );
};