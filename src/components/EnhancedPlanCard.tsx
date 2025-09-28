import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Plus, Minus, Crown, Wifi, Zap, Smartphone, Tv } from "lucide-react";
import { ManualPlan } from "@/data/manual-plans";
import { cn } from "@/lib/utils";

interface EnhancedPlanCardProps {
  plan: ManualPlan;
  isCompared: boolean;
  canAddToComparison: boolean;
  onPlanSelect: (plan: ManualPlan) => void;
  onCompareToggle: (plan: ManualPlan) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'electricity': return <Zap className="w-4 h-4" />;
    case 'internet': return <Wifi className="w-4 h-4" />;
    case 'mobile': return <Smartphone className="w-4 h-4" />;
    case 'tv': return <Tv className="w-4 h-4" />;
    default: return null;
  }
};

export const EnhancedPlanCard = ({
  plan,
  isCompared,
  canAddToComparison,
  onPlanSelect,
  onCompareToggle
}: EnhancedPlanCardProps) => {
  const hasIntroPrice = plan.introPrice > 0 && plan.introMonths > 0;
  const isPremium = plan.features.some(f => 
    f.includes('פרימיום') || 
    f.includes('VIP') || 
    f.includes('מקסימום') ||
    f.includes('אולטרה')
  );

  const savingsAmount = hasIntroPrice ? (plan.regularPrice - plan.introPrice) * plan.introMonths : 0;

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-2 cursor-pointer",
      isCompared 
        ? "border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg scale-[1.01] ring-2 ring-blue-200/50" 
        : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-xl"
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white border-0 shadow-lg animate-pulse">
            <Crown className="w-3 h-3 ml-1" />
            פרימיום
          </Badge>
        </div>
      )}
      
      {/* Comparison Badge */}
      {isCompared && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-lg">
            <CheckCircle className="w-3 h-3 ml-1" />
            נבחר להשוואה
          </Badge>
        </div>
      )}

      {/* Special Offer Badge */}
      {hasIntroPrice && (
        <div className="absolute top-12 right-3 z-10">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-md text-xs">
            מבצע מיוחד!
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4 relative z-20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getCategoryIcon(plan.category)}
              <CardTitle className="text-xl font-bold text-gray-800 font-heebo group-hover:text-purple-700 transition-colors">
                {plan.planName}
              </CardTitle>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs border-purple-200 text-purple-700 bg-purple-50">
                {plan.company}
              </Badge>
              
              {plan.category === 'internet' && plan.downloadSpeed && (
                <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                  <Wifi className="w-3 h-3 ml-1" />
                  {plan.downloadSpeed}
                </Badge>
              )}
              
              {plan.category === 'mobile' && plan.dataAmount && (
                <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                  <Smartphone className="w-3 h-3 ml-1" />
                  {plan.dataAmount}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Enhanced Price Section */}
          <div className="text-left pl-4">
            {hasIntroPrice ? (
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-bold text-green-600 font-heebo">₪{plan.introPrice}</span>
                  <div className="flex flex-col">
                    <Badge className="bg-green-100 text-green-800 text-xs mb-1">
                      {plan.introMonths} חודשים
                    </Badge>
                    <div className="text-xs text-green-600 font-medium">
                      חיסכון ₪{savingsAmount}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg text-gray-500 line-through">₪{plan.regularPrice}</span>
                  <span className="text-sm text-gray-600">אח"כ</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-3xl font-bold text-gray-800 font-heebo">₪{plan.regularPrice}</div>
                <div className="text-sm text-gray-500">לחודש</div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Features */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 font-heebo">תכונות עיקריות:</h4>
          <div className="space-y-2">
            {plan.features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 font-assistant leading-relaxed">{feature}</span>
              </div>
            ))}
            {plan.features.length > 4 && (
              <div className="flex items-center gap-2 pt-1">
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
                <span className="text-sm text-purple-600 font-medium">
                  +{plan.features.length - 4} תכונות נוספות
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 relative z-20">
        <div className="flex gap-3">
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-heebo shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => onPlanSelect(plan)}
          >
            <Star className="w-4 h-4 ml-2" />
            בחר מסלול
          </Button>
          
          <Button 
            size="sm" 
            variant={isCompared ? "secondary" : "outline"}
            className={cn(
              "transition-all duration-300 min-w-[44px]",
              isCompared 
                ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 shadow-md" 
                : "border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400",
              !canAddToComparison && !isCompared && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => onCompareToggle(plan)}
            disabled={!canAddToComparison && !isCompared}
            title={!canAddToComparison && !isCompared ? "ניתן להשוות עד 3 מסלולים בו זמנית" : 
                   isCompared ? "הסר מהשוואה" : "הוסף להשוואה"}
          >
            {isCompared ? (
              <Minus className="w-4 h-4 text-blue-600" />
            ) : (
              <Plus className="w-4 h-4 text-purple-600" />
            )}
          </Button>
        </div>

        {/* Enhanced Plan Stats */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div className="text-center">
              <div className="font-semibold text-gray-800">{plan.company}</div>
              <div>ספק</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-800">{plan.category === 'electricity' ? 'חשמל' : 
                plan.category === 'internet' ? 'אינטרנט' : 
                plan.category === 'mobile' ? 'סלולר' : 'טלוויזיה'}</div>
              <div>קטגוריה</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};