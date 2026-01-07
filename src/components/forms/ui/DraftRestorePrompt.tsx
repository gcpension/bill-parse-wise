import { motion, AnimatePresence } from "framer-motion";
import { History, X, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DraftRestorePromptProps {
  isVisible: boolean;
  savedAt: Date | null;
  onRestore: () => void;
  onDismiss: () => void;
  categoryColor: {
    primary: string;
    text: string;
    bg: string;
    border: string;
  };
}

export const DraftRestorePrompt = ({
  isVisible,
  savedAt,
  onRestore,
  onDismiss,
  categoryColor
}: DraftRestorePromptProps) => {
  const formatTime = (date: Date | null) => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'עכשיו';
    if (minutes < 60) return `לפני ${minutes} דקות`;
    if (hours < 24) return `לפני ${hours} שעות`;
    return date.toLocaleDateString('he-IL');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={cn(
            "relative rounded-2xl border-2 overflow-hidden",
            "bg-gradient-to-br",
            categoryColor.bg,
            categoryColor.border
          )}
        >
          {/* Close button */}
          <button
            onClick={onDismiss}
            className="absolute top-2 left-2 p-1 rounded-full hover:bg-black/10 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          <div className="p-4">
            <div className="flex items-start gap-3">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className={cn(
                  "p-2 rounded-xl",
                  "bg-white shadow-sm"
                )}
              >
                <History className={cn("w-5 h-5", categoryColor.text)} />
              </motion.div>

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground">נמצאה טיוטה שמורה</h4>
                <p className="text-sm text-muted-foreground mt-0.5">
                  נשמר {formatTime(savedAt)}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onDismiss}
                className="flex-1 h-10 rounded-xl border-2 gap-1"
              >
                <Trash2 className="w-4 h-4" />
                התחל מחדש
              </Button>
              <Button
                size="sm"
                onClick={onRestore}
                className={cn(
                  "flex-1 h-10 rounded-xl gap-1",
                  "bg-gradient-to-r",
                  categoryColor.primary
                )}
              >
                <RotateCcw className="w-4 h-4" />
                שחזר
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DraftRestorePrompt;
