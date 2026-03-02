import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, Rocket } from "lucide-react";
import { PlanRecord } from "@/hooks/useAllPlans";

interface StickyPlanSummaryProps {
  selectedPlan: PlanRecord | null;
  currentMonthlyBill: number;
  onContinue: () => void;
  onDismiss: () => void;
}

export const StickyPlanSummary = ({
  selectedPlan,
  currentMonthlyBill,
  onContinue,
  onDismiss,
}: StickyPlanSummaryProps) => {
  const savings = selectedPlan && currentMonthlyBill > 0 && selectedPlan.monthlyPrice && selectedPlan.monthlyPrice < currentMonthlyBill
    ? currentMonthlyBill - selectedPlan.monthlyPrice
    : 0;

  return (
    <AnimatePresence>
      {selectedPlan && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t-2 border-primary shadow-2xl safe-area-bottom"
        >
          <div className="container mx-auto max-w-7xl px-4 py-3">
            <div className="flex items-center gap-3 md:gap-4">
              {/* Dismiss */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onDismiss}
                className="h-8 w-8 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
              
              {/* Plan Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-sm truncate">{selectedPlan.company}</span>
                  <span className="text-muted-foreground text-xs">•</span>
                  <span className="text-xs text-muted-foreground truncate">{selectedPlan.plan}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-primary">₪{selectedPlan.monthlyPrice}/חודש</span>
                  {savings > 0 && (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      חוסך ₪{savings.toFixed(0)}/חודש
                    </span>
                  )}
                </div>
              </div>
              
              {/* CTA */}
              <Button
                onClick={onContinue}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 h-11 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Rocket className="ml-2 h-4 w-4" />
                המשך לסיום
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
