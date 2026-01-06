import React, { useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Check, X, Trash2, Star } from 'lucide-react';

interface SwipeAction {
  icon: React.ReactNode;
  color: string;
  onAction: () => void;
  label: string;
}

interface SwipeToActionProps {
  children: React.ReactNode;
  leftAction?: SwipeAction;
  rightAction?: SwipeAction;
  threshold?: number;
}

const SwipeToAction: React.FC<SwipeToActionProps> = ({
  children,
  leftAction,
  rightAction,
  threshold = 100,
}) => {
  const [isActioned, setIsActioned] = useState(false);
  const x = useMotionValue(0);
  
  // Transform for left action background
  const leftBgOpacity = useTransform(x, [-threshold, 0], [1, 0]);
  const leftIconScale = useTransform(x, [-threshold, -threshold/2, 0], [1.2, 1, 0.5]);
  
  // Transform for right action background  
  const rightBgOpacity = useTransform(x, [0, threshold], [0, 1]);
  const rightIconScale = useTransform(x, [0, threshold/2, threshold], [0.5, 1, 1.2]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -threshold && leftAction) {
      setIsActioned(true);
      setTimeout(() => {
        leftAction.onAction();
        setIsActioned(false);
      }, 300);
    } else if (info.offset.x > threshold && rightAction) {
      setIsActioned(true);
      setTimeout(() => {
        rightAction.onAction();
        setIsActioned(false);
      }, 300);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Left action background */}
      {leftAction && (
        <motion.div 
          className="absolute inset-y-0 left-0 w-full flex items-center justify-start px-6"
          style={{ 
            opacity: leftBgOpacity,
            backgroundColor: leftAction.color,
          }}
        >
          <motion.div 
            className="flex flex-col items-center gap-1 text-white"
            style={{ scale: leftIconScale }}
          >
            {leftAction.icon}
            <span className="text-xs font-medium">{leftAction.label}</span>
          </motion.div>
        </motion.div>
      )}

      {/* Right action background */}
      {rightAction && (
        <motion.div 
          className="absolute inset-y-0 right-0 w-full flex items-center justify-end px-6"
          style={{ 
            opacity: rightBgOpacity,
            backgroundColor: rightAction.color,
          }}
        >
          <motion.div 
            className="flex flex-col items-center gap-1 text-white"
            style={{ scale: rightIconScale }}
          >
            {rightAction.icon}
            <span className="text-xs font-medium">{rightAction.label}</span>
          </motion.div>
        </motion.div>
      )}

      {/* Main content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5}
        onDragEnd={handleDragEnd}
        style={{ x }}
        animate={isActioned ? { 
          x: isActioned && x.get() < 0 ? -500 : 500,
          opacity: 0 
        } : undefined}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative z-10 bg-card cursor-grab active:cursor-grabbing"
      >
        {children}
      </motion.div>
    </div>
  );
};

// Preset configurations
export const SwipeToDelete: React.FC<{
  children: React.ReactNode;
  onDelete: () => void;
}> = ({ children, onDelete }) => (
  <SwipeToAction
    leftAction={{
      icon: <Trash2 className="w-6 h-6" />,
      color: 'hsl(var(--destructive))',
      onAction: onDelete,
      label: 'מחק',
    }}
  >
    {children}
  </SwipeToAction>
);

export const SwipeToApprove: React.FC<{
  children: React.ReactNode;
  onApprove: () => void;
  onReject: () => void;
}> = ({ children, onApprove, onReject }) => (
  <SwipeToAction
    rightAction={{
      icon: <Check className="w-6 h-6" />,
      color: 'hsl(142, 76%, 36%)',
      onAction: onApprove,
      label: 'אשר',
    }}
    leftAction={{
      icon: <X className="w-6 h-6" />,
      color: 'hsl(var(--destructive))',
      onAction: onReject,
      label: 'דחה',
    }}
  >
    {children}
  </SwipeToAction>
);

export const SwipeToFavorite: React.FC<{
  children: React.ReactNode;
  onFavorite: () => void;
  onRemove: () => void;
}> = ({ children, onFavorite, onRemove }) => (
  <SwipeToAction
    rightAction={{
      icon: <Star className="w-6 h-6" />,
      color: 'hsl(45, 93%, 47%)',
      onAction: onFavorite,
      label: 'מועדף',
    }}
    leftAction={{
      icon: <Trash2 className="w-6 h-6" />,
      color: 'hsl(var(--destructive))',
      onAction: onRemove,
      label: 'הסר',
    }}
  >
    {children}
  </SwipeToAction>
);

export default SwipeToAction;
