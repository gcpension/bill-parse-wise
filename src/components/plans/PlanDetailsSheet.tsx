import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ManualPlan } from "@/data/manual-plans";
import { CheckCircle, Star, Zap, Package, Clock, Award, ArrowRight, Sparkles } from "lucide-react";

interface PlanDetailsSheetProps {
  plan: ManualPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForSwitch: (plan: ManualPlan) => void;
}

export function PlanDetailsSheet({ plan, isOpen, onClose, onSelectForSwitch }: PlanDetailsSheetProps) {
  if (!plan) return null;

  const hasIntroOffer = plan.introPrice && plan.introPrice < plan.regularPrice;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-2xl overflow-y-auto bg-gradient-to-b from-background via-background to-muted/20 animate-slide-in-right"
      >
        <SheetHeader className="pb-6 border-b-2 border-primary/10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-xl">
              <Package className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-3xl font-bold font-heebo text-right mb-2 bg-gradient-to-l from-primary to-foreground bg-clip-text text-transparent">
                {plan.planName}
              </SheetTitle>
              <p className="text-sm text-muted-foreground font-assistant">
                לחץ על "בחר מסלול" למעבר להחלפת ספק
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* Company & Category */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-base font-assistant">
                {plan.company}
              </Badge>
              <Badge variant="secondary" className="font-assistant">
                {plan.category}
              </Badge>
            </div>
            {plan.introPrice && plan.introPrice < plan.regularPrice && (
              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 font-assistant">
                <Star className="w-3 h-3 ml-1" />
                מבצע מיוחד
              </Badge>
            )}
          </div>

          <Separator />

          {/* Pricing Section with Animation */}
          <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border-2 border-primary/20 shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground font-assistant mb-3 uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                מחיר חודשי
              </div>
              {hasIntroOffer ? (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-5xl font-bold text-primary font-heebo animate-scale-in">
                      ₪{plan.introPrice}
                    </div>
                    <div className="text-3xl text-muted-foreground line-through font-heebo opacity-60">
                      ₪{plan.regularPrice}
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-assistant text-base px-4 py-1 animate-pulse">
                    <Sparkles className="w-4 h-4 ml-1" />
                    הנחה מיוחדת למצטרפים חדשים!
                  </Badge>
                  <div className="text-lg text-green-600 font-semibold font-assistant">
                    חיסכון של ₪{plan.regularPrice - plan.introPrice} בחודש!
                  </div>
                </div>
              ) : (
                <div className="animate-scale-in">
                  <div className="text-5xl font-bold text-primary font-heebo">
                    ₪{plan.regularPrice}
                  </div>
                  <div className="text-sm text-muted-foreground font-assistant mt-2">
                    לחודש, ללא התחייבות
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Features Section with Staggered Animation */}
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold font-heebo mb-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              תכונות המסלול
            </h3>
            <div className="space-y-3">
              {plan.features.map((feature, index) => (
                <div 
                  key={index} 
                  className="group flex items-start gap-3 bg-gradient-to-l from-muted/20 to-muted/40 hover:from-primary/10 hover:to-primary/5 rounded-xl p-4 border border-border hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-green-500/30 transition-colors">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-assistant leading-relaxed group-hover:text-foreground transition-colors">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Specific Details */}
          {(plan.downloadSpeed || plan.uploadSpeed || plan.dataAmount || plan.speed) && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold font-heebo mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  מפרט טכני
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {plan.downloadSpeed && (
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <div className="text-sm text-muted-foreground font-assistant mb-1">
                        מהירות הורדה
                      </div>
                      <div className="text-lg font-bold font-heebo">
                        {plan.downloadSpeed}
                      </div>
                    </div>
                  )}
                  {plan.uploadSpeed && (
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <div className="text-sm text-muted-foreground font-assistant mb-1">
                        מהירות העלאה
                      </div>
                      <div className="text-lg font-bold font-heebo">
                        {plan.uploadSpeed}
                      </div>
                    </div>
                  )}
                  {plan.dataAmount && (
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <div className="text-sm text-muted-foreground font-assistant mb-1">
                        נפח גלישה
                      </div>
                      <div className="text-lg font-bold font-heebo">
                        {plan.dataAmount}
                      </div>
                    </div>
                  )}
                  {plan.speed && plan.category === 'electricity' && (
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <div className="text-sm text-muted-foreground font-assistant mb-1">
                        הנחה
                      </div>
                      <div className="text-lg font-bold font-heebo">
                        {plan.speed}
                      </div>
                    </div>
                  )}
                  {plan.callMinutes && (
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <div className="text-sm text-muted-foreground font-assistant mb-1">
                        דקות שיחה
                      </div>
                      <div className="text-lg font-bold font-heebo">
                        {plan.callMinutes}
                      </div>
                    </div>
                  )}
                  {plan.smsAmount && (
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <div className="text-sm text-muted-foreground font-assistant mb-1">
                        הודעות SMS
                      </div>
                      <div className="text-lg font-bold font-heebo">
                        {plan.smsAmount}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Enhanced Action Button */}
          <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-2 border-t-2 border-primary/20">
            <Button
              onClick={() => onSelectForSwitch(plan)}
              className="group relative w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              size="lg"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <span className="relative flex items-center justify-center gap-2 font-assistant">
                בחר מסלול ועבור להחלפה
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-3 font-assistant">
              תועבר לטופס החלפת ספק עם פרטי המסלול
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
