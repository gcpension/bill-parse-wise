import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, TrendingDown, Rocket, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PlanRecord } from "@/hooks/useAllPlans";

interface PlanConfirmDialogProps {
  plan: PlanRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentMonthlyBill: number;
}

export const PlanConfirmDialog = ({ plan, isOpen, onClose, onConfirm, currentMonthlyBill }: PlanConfirmDialogProps) => {
  if (!plan) return null;

  const savings = currentMonthlyBill > 0 && plan.monthlyPrice! < currentMonthlyBill
    ? currentMonthlyBill - plan.monthlyPrice!
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 shadow-2xl" dir="rtl">
        {/* Header gradient */}
        <div className="bg-gradient-to-l from-primary via-primary/90 to-primary/80 p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <CheckCircle2 className="w-8 h-8 text-white" />
          </motion.div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">אישור בחירת מסלול</DialogTitle>
            <DialogDescription className="text-white/80 text-sm mt-1">
              בדקו את הפרטים לפני המעבר
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Plan summary */}
          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">ספק</span>
              <span className="font-semibold text-foreground">{plan.company}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">שם המסלול</span>
              <span className="font-semibold text-foreground text-left max-w-[60%] truncate">{plan.plan}</span>
            </div>
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">מחיר חודשי</span>
              <span className="text-2xl font-bold text-foreground">₪{plan.monthlyPrice}</span>
            </div>
          </div>

          {/* Savings highlight */}
          {savings > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingDown className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-emerald-700 font-medium">חיסכון משוער</span>
              </div>
              <div className="text-2xl font-bold text-emerald-700">
                ₪{savings.toFixed(0)}/חודש
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-0 mt-2">
                ₪{(savings * 12).toFixed(0)} בשנה
              </Badge>
            </motion.div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={onConfirm}
              className="flex-1 h-12 font-bold text-base bg-gradient-to-l from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              <Rocket className="ml-2 h-5 w-5" />
              אישור מעבר
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="h-12 px-6 font-medium"
            >
              <ArrowRight className="ml-1 h-4 w-4" />
              חזרה
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
