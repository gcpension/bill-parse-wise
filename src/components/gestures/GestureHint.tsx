import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, ArrowLeft, ArrowRight, ArrowDown, Smartphone } from 'lucide-react';

interface GestureHintProps {
  type: 'swipe-back' | 'swipe-cards' | 'pull-refresh' | 'swipe-action';
  show?: boolean;
  onDismiss?: () => void;
  autoHide?: boolean;
  autoHideDelay?: number;
}

const GestureHint: React.FC<GestureHintProps> = ({
  type,
  show = true,
  onDismiss,
  autoHide = true,
  autoHideDelay = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    // Check if user has seen this hint before
    const seenHints = JSON.parse(localStorage.getItem('seenGestureHints') || '[]');
    if (seenHints.includes(type)) {
      setIsVisible(false);
      return;
    }

    if (autoHide && show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Save that user has seen this hint
        localStorage.setItem('seenGestureHints', JSON.stringify([...seenHints, type]));
        onDismiss?.();
      }, autoHideDelay);
      
      return () => clearTimeout(timer);
    }
  }, [type, show, autoHide, autoHideDelay, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    const seenHints = JSON.parse(localStorage.getItem('seenGestureHints') || '[]');
    localStorage.setItem('seenGestureHints', JSON.stringify([...seenHints, type]));
    onDismiss?.();
  };

  const hintContent = {
    'swipe-back': {
      title: 'החלק מקצה המסך',
      description: 'החלק מימין לשמאל לחזרה לדף הקודם',
      animation: (
        <motion.div className="flex items-center gap-2">
          <motion.div
            animate={{ x: [0, -30, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Hand className="w-8 h-8 text-primary" />
          </motion.div>
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      ),
    },
    'swipe-cards': {
      title: 'החלק בין כרטיסים',
      description: 'החלק ימינה או שמאלה לעבור בין הכרטיסים',
      animation: (
        <motion.div className="flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <motion.div
            animate={{ x: [-20, 20, -20] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Hand className="w-8 h-8 text-primary" />
          </motion.div>
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      ),
    },
    'pull-refresh': {
      title: 'משוך לרענון',
      description: 'משוך למטה כדי לרענן את התוכן',
      animation: (
        <motion.div className="flex flex-col items-center gap-1">
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Hand className="w-8 h-8 text-primary rotate-180" />
          </motion.div>
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      ),
    },
    'swipe-action': {
      title: 'החלק לפעולה',
      description: 'החלק ימינה או שמאלה לביצוע פעולה מהירה',
      animation: (
        <motion.div className="flex items-center gap-2">
          <motion.div
            animate={{ x: [-15, 15, -15] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Smartphone className="w-8 h-8 text-primary" />
          </motion.div>
        </motion.div>
      ),
    },
  };

  const content = hintContent[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-20 left-4 right-4 z-50 pointer-events-auto md:hidden"
          onClick={handleDismiss}
        >
          <div className="bg-card/95 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-border/50 flex items-center gap-4">
            <div className="flex-shrink-0">
              {content.animation}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground">{content.title}</h4>
              <p className="text-sm text-muted-foreground">{content.description}</p>
            </div>
            <button className="text-xs text-muted-foreground hover:text-foreground">
              הבנתי
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GestureHint;
