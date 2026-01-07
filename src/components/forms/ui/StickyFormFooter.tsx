import { motion } from "framer-motion";
import { ChevronLeft, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StickyFormFooterProps {
  onNext: () => void;
  onBack?: () => void;
  progress: number;
  filledCount: number;
  totalFields: number;
  isSubmitting?: boolean;
  isLastStep?: boolean;
  canProceed?: boolean;
  nextLabel?: string;
  categoryColor: {
    primary: string;
    text: string;
  };
}

export const StickyFormFooter = ({
  onNext,
  onBack,
  progress,
  filledCount,
  totalFields,
  isSubmitting = false,
  isLastStep = false,
  canProceed = true,
  nextLabel = "המשך",
  categoryColor
}: StickyFormFooterProps) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-white/95 backdrop-blur-lg border-t shadow-2xl",
        "pb-safe"
      )}
    >
      {/* Progress indicator */}
      <div className="h-1 bg-muted overflow-hidden">
        <motion.div
          className={cn("h-full bg-gradient-to-r", categoryColor.primary)}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="px-4 py-3">
        {/* Field counter */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm">
            {progress === 100 ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-green-600"
              >
                <Check className="w-4 h-4" />
                <span className="font-medium">הכל מוכן!</span>
              </motion.div>
            ) : (
              <>
                <span className="text-muted-foreground">
                  {filledCount} מתוך {totalFields} שדות
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: totalFields }).map((_, i) => (
                    <motion.div
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        i < filledCount ? "bg-green-500" : "bg-muted"
                      )}
                      initial={false}
                      animate={i < filledCount ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          {!isLastStep && (
            <span className={cn("text-sm font-bold", categoryColor.text)}>
              {Math.round(progress)}%
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
              className="h-14 px-6 rounded-2xl border-2 text-base"
            >
              חזרה
            </Button>
          )}
          
          <Button
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            className={cn(
              "flex-1 h-14 text-lg font-bold rounded-2xl shadow-lg",
              "bg-gradient-to-r transition-all duration-200",
              categoryColor.primary,
              "hover:opacity-90 hover:shadow-xl",
              "active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                שולח...
              </>
            ) : (
              <>
                {nextLabel}
                <ChevronLeft className="w-5 h-5 mr-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default StickyFormFooter;
