import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormTooltipProps {
  content: string;
  example?: string;
  className?: string;
}

export const FormTooltip = ({ content, example, className }: FormTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative inline-flex", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-1 rounded-full transition-colors",
          "hover:bg-muted active:bg-muted/80",
          isOpen && "bg-muted"
        )}
      >
        <HelpCircle className="w-4 h-4 text-muted-foreground" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2",
                "w-64 p-3 rounded-xl",
                "bg-foreground text-background",
                "shadow-xl"
              )}
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-2 left-2 p-0.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>

              <p className="text-sm font-medium">{content}</p>
              
              {example && (
                <div className="mt-2 pt-2 border-t border-white/20">
                  <p className="text-xs opacity-70">דוגמה:</p>
                  <p className="text-sm font-mono mt-0.5">{example}</p>
                </div>
              )}

              {/* Arrow */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-foreground rotate-45" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormTooltip;
