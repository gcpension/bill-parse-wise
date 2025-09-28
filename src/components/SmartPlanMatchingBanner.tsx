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
      "fixed bottom-6 left-6 z-50 animate-fade-in",
      className
    )}>
      <div className="bg-gradient-to-r from-white via-purple-50/80 to-white backdrop-blur-sm rounded-xl shadow-xl border-2 border-purple-200/50 px-6 py-4 max-w-md hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between gap-4">
          {/* Content */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md animate-pulse">
              <Brain className="w-6 h-6 text-white" />
            </div>
            
            <div>
              <h3 className="text-base font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent font-heebo">
                השוואה חכמה מבוססת AI
              </h3>
              <p className="text-xs text-gray-600 font-assistant">
                ניתוח מתקדם עם המלצות מותאמות אישית
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">זמין עכשיו</span>
              </div>
            </div>
          </div>
          
          {/* Button */}
          <Button 
            size="sm"
            className="h-10 px-4 text-sm font-heebo bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={onMatchingClick}
          >
            <BarChart3 className="w-4 h-4 ml-2" />
            התחל השוואה
          </Button>
        </div>
      </div>
    </div>
  );
};