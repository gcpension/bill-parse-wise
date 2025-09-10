import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ManualPlan } from "@/data/manual-plans";
import { 
  GitCompare, 
  X, 
  Star, 
  Check, 
  Zap, 
  Wifi, 
  Smartphone, 
  Tv, 
  Download, 
  Upload, 
  Phone,
  Building2,
  TrendingUp,
  Award,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanComparisonProps {
  comparedPlans: ManualPlan[];
  onRemovePlan: (planId: string) => void;
  onClearAll: () => void;
  className?: string;
}

const PlanComparison = ({ 
  comparedPlans, 
  onRemovePlan, 
  onClearAll, 
  className 
}: PlanComparisonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electricity': return <Zap className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'internet': return <Wifi className="h-4 w-4" />;
      case 'tv': return <Tv className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
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

  const formatPrice = (plan: ManualPlan) => {
    if (plan.category === 'electricity') {
      return plan.speed; // For electricity, speed is the discount percentage
    }
    return `₪${plan.regularPrice}`;
  };

  const getRandomRating = () => (Math.random() * 1.5 + 3.5).toFixed(1);
  const getRandomSavings = () => Math.floor(Math.random() * 150) + 50;

  if (comparedPlans.length === 0) {
    return null;
  }

  return (
    <div className={cn("fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50", className)}>
      <Card className="bg-white/95 backdrop-blur-md border-border/50 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg">
                <GitCompare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">השוואת מסלולים</p>
                <p className="text-xs text-muted-foreground">
                  {comparedPlans.length} מתוך 3 מסלולים נבחרו
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {comparedPlans.map((plan) => (
                <div key={plan.id} className="relative">
                  <Badge variant="outline" className="pr-6 bg-white/80">
                    {plan.company}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemovePlan(plan.id)}
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full bg-destructive/10 hover:bg-destructive/20"
                  >
                    <X className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-primary-glow text-white">
                    השווה עכשיו
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                      השוואת מסלולים
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {comparedPlans.map((plan) => (
                      <Card key={plan.id} className="relative overflow-hidden">
                        {/* Best Deal Badge */}
                        {comparedPlans.indexOf(plan) === 0 && (
                          <div className="absolute top-4 right-4 z-10">
                            <Badge className="bg-gradient-to-r from-success to-green-600 text-white">
                              <Award className="h-3 w-3 mr-1" />
                              המומלץ ביותר
                            </Badge>
                          </div>
                        )}

                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-3">
                            {getCategoryIcon(plan.category)}
                            <div>
                              <Badge variant="outline" className="text-xs mb-2">
                                {getCategoryLabel(plan.category)}
                              </Badge>
                              <CardTitle className="text-lg">{plan.company}</CardTitle>
                              <p className="text-sm text-muted-foreground">{plan.planName}</p>
                            </div>
                          </div>
                          
                          {/* Rating */}
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={cn(
                                    "h-4 w-4",
                                    i < Math.floor(parseFloat(getRandomRating())) 
                                      ? "text-yellow-400 fill-yellow-400" 
                                      : "text-gray-300"
                                  )} 
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">{getRandomRating()}</span>
                            <Badge variant="secondary" className="text-xs">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              חיסכון ₪{getRandomSavings()}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Price */}
                          <div className="text-center bg-gradient-to-r from-primary/5 to-primary-glow/5 p-4 rounded-lg">
                            <div className="text-2xl font-black text-primary">
                              {formatPrice(plan)}
                            </div>
                            {plan.category !== 'electricity' && (
                              <div className="text-sm text-muted-foreground">לחודש</div>
                            )}
                          </div>

                          {/* Speed/Data */}
                          {plan.category === 'internet' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <Download className="h-4 w-4 text-primary" />
                                  <span>הורדה</span>
                                </div>
                                <span className="font-medium">{plan.downloadSpeed}</span>
                              </div>
                              {plan.uploadSpeed && (
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <Upload className="h-4 w-4 text-success" />
                                    <span>העלאה</span>
                                  </div>
                                  <span className="font-medium">{plan.uploadSpeed}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Mobile Data */}
                          {plan.dataAmount && (
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <Wifi className="h-4 w-4 text-blue-500" />
                                <span>נתונים</span>
                              </div>
                              <span className="font-medium">{plan.dataAmount}</span>
                            </div>
                          )}

                          {/* Call Minutes */}
                          {plan.callMinutes && (
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-orange-500" />
                                <span>דקות שיחה</span>
                              </div>
                              <span className="font-medium">{plan.callMinutes}</span>
                            </div>
                          )}

                          <Separator />

                          {/* Contract Length */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>תקופת התקשרות</span>
                            </div>
                            <span className="font-medium">
                              {Math.random() > 0.5 ? '24 חודשים' : '12 חודשים'}
                            </span>
                          </div>

                          <Separator />

                          {/* Features */}
                          <div className="space-y-2">
                            <p className="font-medium text-sm">תכונות כלולות:</p>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-2 text-sm">
                                  <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                                  <span className="text-muted-foreground leading-relaxed">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action Button */}
                          <Button className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-white">
                            בחר מסלול זה
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                size="sm"
                onClick={onClearAll}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                נקה
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanComparison;