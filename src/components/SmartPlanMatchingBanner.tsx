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
      "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50",
      className
    )}>
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 px-6 py-4 max-w-md">
        <div className="flex items-center justify-between gap-4">
          {/* Content */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-gray-800 font-heebo">
                השוואה חכמה
              </h3>
              <p className="text-xs text-gray-600 font-assistant">
                השוו מסלולים עם AI
              </p>
            </div>
          </div>
          
          {/* Button */}
          <Button 
            size="sm" 
            className="h-9 px-4 text-sm font-heebo bg-purple-600 hover:bg-purple-700 text-white"
            onClick={onMatchingClick}
          >
            <BarChart3 className="w-4 h-4 ml-1" />
            התחל
          </Button>
        </div>
      </div>
    </div>
  );
};