import { Button } from "@/components/ui/button";
import { Brain, Target, Sparkles, BarChart3 } from "lucide-react";
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
      "fixed bottom-6 left-6 right-6 z-50 mx-auto max-w-5xl",
      className
    )}>
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 rounded-2xl shadow-2xl p-6 backdrop-blur-sm border border-white/20">
        <div className="flex items-center justify-between gap-6">
          {/* Main Content */}
          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Brain className="w-10 h-10 text-white" />
            </div>
            
            <div className="text-white">
              <h2 className="text-2xl font-bold font-heebo mb-1">
                התאמת מסלולים חכמה עכשיו! 🚀
              </h2>
              <p className="text-lg font-assistant opacity-90 mb-2">
                השוו עד 3 מסלולים עם ניתוח מתקדם, המלצות אישיות וחישוב חיסכון מדויק
              </p>
              
              {/* Features */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  <span>המלצות אישיות</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4" />
                  <span>חישוב חיסכון מדויק</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>ניתוח AI מתקדם</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="flex-shrink-0">
            <Button 
              size="lg" 
              variant="secondary"
              className="h-14 px-8 text-lg font-bold font-heebo bg-white text-purple-600 hover:bg-gray-100 shadow-xl transition-all duration-300 hover:scale-105"
              onClick={onMatchingClick}
            >
              <BarChart3 className="w-6 h-6 ml-2" />
              התחל השוואה חכמה
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};