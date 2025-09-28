import { Button } from "@/components/ui/button";
import { Brain, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartPlanMatchingBannerProps {
  onMatchingClick: () => void;
  className?: string;
}

export const SmartPlanMatchingBanner = ({ 
  onMatchingClick, 
  className 
}: SmartPlanMatchingBannerProps) => {
  return (
    <div className={cn(
      "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in",
      className
    )}>
      <div className="bg-gradient-to-r from-white via-purple-50/80 to-white backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-purple-200/50 px-8 py-6 max-w-lg hover:shadow-3xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between gap-6">
          {/* Enhanced Content */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
              <Brain className="w-7 h-7 text-white" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent font-heebo">
                השוואה חכמה מבוססת AI
              </h3>
              <p className="text-sm text-gray-600 font-assistant">
                ניתוח מתקדם עם המלצות מותאמות אישית
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">זמין עכשיו</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Button */}
          <Button 
            size="lg"
            className="h-12 px-6 text-base font-heebo bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={onMatchingClick}
          >
            <BarChart3 className="w-5 h-5 ml-2" />
            התחל השוואה
          </Button>
        </div>
      </div>
    </div>
  );
};