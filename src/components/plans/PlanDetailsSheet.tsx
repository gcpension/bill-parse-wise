import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ManualPlan } from "@/data/manual-plans";
import { CheckCircle, Star, Zap, Package, Clock, Award, ArrowRight } from "lucide-react";

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
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold font-heebo text-right">
            {plan.planName}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
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

          {/* Pricing Section */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground font-assistant mb-2">
                מחיר חודשי
              </div>
              {hasIntroOffer ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-4xl font-bold text-primary font-heebo">
                      ₪{plan.introPrice}
                    </div>
                    <div className="text-2xl text-muted-foreground line-through font-heebo">
                      ₪{plan.regularPrice}
                    </div>
                  </div>
                  <Badge variant="destructive" className="font-assistant">
                    הנחה מיוחדת למצטרפים חדשים!
                  </Badge>
                </div>
              ) : (
                <div className="text-4xl font-bold text-primary font-heebo">
                  ₪{plan.regularPrice}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Features Section */}
          <div>
            <h3 className="text-lg font-semibold font-heebo mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              תכונות המסלול
            </h3>
            <div className="space-y-3">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 bg-muted/30 rounded-lg p-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-assistant">{feature}</span>
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

          {/* Action Button */}
          <div className="sticky bottom-0 bg-background pt-4 pb-2 border-t">
            <Button
              onClick={() => onSelectForSwitch(plan)}
              className="w-full h-12 text-lg font-semibold"
              size="lg"
            >
              <span className="font-assistant">בחר מסלול ועבור להחלפה</span>
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
