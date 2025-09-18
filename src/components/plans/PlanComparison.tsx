import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ManualPlan } from "@/data/manual-plans";
import { 
  Scale, 
  X, 
  Check, 
  Zap, 
  Wifi, 
  Smartphone, 
  Tv, 
  Building2,
  TrendingUp,
  Crown,
  CheckCircle,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanComparisonProps {
  comparedPlans: ManualPlan[];
  onRemovePlan: (planId: string) => void;
  onClearAll: () => void;
  className?: string;
  onPlanSelect?: (plan: ManualPlan) => void;
}

const PlanComparison = ({ 
  comparedPlans, 
  onRemovePlan, 
  onClearAll, 
  className,
  onPlanSelect 
}: PlanComparisonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electricity': return <Zap className="h-5 w-5" />;
      case 'mobile': return <Smartphone className="h-5 w-5" />;
      case 'internet': return <Wifi className="h-5 w-5" />;
      case 'tv': return <Tv className="h-5 w-5" />;
      default: return <Building2 className="h-5 w-5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'electricity': return 'חשמל';
      case 'mobile': return 'סלולר';
      case 'internet': return 'אינטרנט';
      case 'tv': return 'טלוויזיה';
      default: return '';
    }
  };

  if (comparedPlans.length === 0) {
    return null;
  }

  return (
    <div className={cn("fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50", className)}>
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Scale className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800 font-heebo">השוואת מסלולים</p>
                <p className="text-sm text-gray-600 font-assistant">
                  {comparedPlans.length} מתוך 3 מסלולים
                </p>
              </div>
            </div>

            {/* Plans Preview */}
            <div className="flex items-center gap-2">
              {comparedPlans.map((plan, index) => (
                <div key={plan.id} className="relative group">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-all">
                    {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                    <span className="text-sm font-medium font-assistant">{plan.company}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemovePlan(plan.id)}
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full bg-red-100 hover:bg-red-200"
                  >
                    <X className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onClearAll}
                className="text-red-600 border-red-200 hover:bg-red-50 font-assistant"
              >
                נקה הכל
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 font-heebo font-medium">
                    <BarChart3 className="h-4 w-4 ml-2" />
                    השווה
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-purple-800 font-heebo text-center">
                      השוואת מסלולים
                    </DialogTitle>
                  </DialogHeader>
                  
                  {/* Simple Comparison Table */}
                  <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {comparedPlans.map((plan, index) => (
                        <Card key={plan.id} className={cn(
                          "relative transition-all duration-300 hover:shadow-lg",
                          index === 0 ? "ring-2 ring-green-400 bg-green-50/50" : "border-gray-200"
                        )}>
                          {index === 0 && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <Badge className="bg-green-500 text-white">
                                <Crown className="h-3 w-3 ml-1" />
                                הכי מומלץ
                              </Badge>
                            </div>
                          )}
                          
                          <CardContent className="p-6">
                            {/* Company & Category */}
                            <div className="text-center mb-6">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                {getCategoryIcon(plan.category)}
                                <Badge variant="outline" className="text-xs">
                                  {getCategoryLabel(plan.category)}
                                </Badge>
                              </div>
                              <h3 className="text-xl font-bold text-gray-800 font-heebo">
                                {plan.company}
                              </h3>
                              <p className="text-gray-600 font-assistant">{plan.planName}</p>
                            </div>

                            {/* Price */}
                            <div className="text-center mb-6">
                              <div className="text-3xl font-bold text-purple-600 font-heebo">
                                ₪{plan.regularPrice}
                              </div>
                              <div className="text-sm text-gray-500 font-assistant">לחודש</div>
                            </div>

                            {/* Features */}
                            <div className="space-y-2 mb-6">
                              {plan.features.slice(0, 4).map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  <span className="text-gray-700 font-assistant">{feature}</span>
                                </div>
                              ))}
                            </div>

                            {/* Action */}
                            <Button
                              onClick={() => {
                                onPlanSelect?.(plan);
                                setIsDialogOpen(false);
                              }}
                              className={cn(
                                "w-full font-heebo",
                                index === 0 
                                  ? "bg-green-600 hover:bg-green-700" 
                                  : "bg-purple-600 hover:bg-purple-700"
                              )}
                            >
                              בחר מסלול זה
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Quick Comparison Summary */}
                    <div className="mt-8 bg-gray-50 rounded-xl p-6">
                      <h4 className="text-lg font-bold text-gray-800 mb-4 font-heebo text-center">
                        סיכום מהיר
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-600 font-assistant">המחיר הנמוך ביותר</div>
                          <div className="text-xl font-bold text-green-600 font-heebo">
                            ₪{Math.min(...comparedPlans.map(p => p.regularPrice))}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600 font-assistant">המחיר הגבוה ביותר</div>
                          <div className="text-xl font-bold text-red-600 font-heebo">
                            ₪{Math.max(...comparedPlans.map(p => p.regularPrice))}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600 font-assistant">חיסכון פוטנציאלי</div>
                          <div className="text-xl font-bold text-purple-600 font-heebo">
                            ₪{Math.max(...comparedPlans.map(p => p.regularPrice)) - Math.min(...comparedPlans.map(p => p.regularPrice))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanComparison;