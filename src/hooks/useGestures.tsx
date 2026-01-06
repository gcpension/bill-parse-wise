import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface SwipeState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isSwiping: boolean;
  direction: 'left' | 'right' | 'up' | 'down' | null;
}

interface UseSwipeOptions {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export const useSwipe = (options: UseSwipeOptions = {}) => {
  const { threshold = 50, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown } = options;
  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isSwiping: false,
    direction: null,
  });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setSwipeState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isSwiping: true,
      direction: null,
    });
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!swipeState.isSwiping) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - swipeState.startX;
    const deltaY = touch.clientY - swipeState.startY;
    
    let direction: 'left' | 'right' | 'up' | 'down' | null = null;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }
    
    setSwipeState(prev => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY,
      direction,
    }));
  }, [swipeState.isSwiping, swipeState.startX, swipeState.startY]);

  const handleTouchEnd = useCallback(() => {
    if (!swipeState.isSwiping) return;
    
    const deltaX = swipeState.currentX - swipeState.startX;
    const deltaY = swipeState.currentY - swipeState.startY;
    
    if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    } else if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }
    
    setSwipeState({
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      isSwiping: false,
      direction: null,
    });
  }, [swipeState, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  const bind = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return { swipeState, bind };
};

// Hook for swipe-to-go-back navigation
export const useSwipeNavigation = () => {
  const navigate = useNavigate();
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isSwipingBack, setIsSwipingBack] = useState(false);
  const startXRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      // Only activate from the left edge (first 30px)
      if (touch.clientX < 30) {
        startXRef.current = touch.clientX;
        setIsSwipingBack(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwipingBack) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - startXRef.current;
      const progress = Math.min(Math.max(deltaX / 150, 0), 1);
      setSwipeProgress(progress);
      
      if (progress > 0.1) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (isSwipingBack && swipeProgress > 0.5) {
        navigate(-1);
      }
      setIsSwipingBack(false);
      setSwipeProgress(0);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isSwipingBack, swipeProgress, navigate]);

  return { containerRef, swipeProgress, isSwipingBack };
};

// Hook for pull-to-refresh
export const usePullToRefresh = (onRefresh: () => Promise<void>) => {
  const [pullProgress, setPullProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const startYRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0 && !isRefreshing) {
        startYRef.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return;
      
      const touch = e.touches[0];
      const deltaY = touch.clientY - startYRef.current;
      
      if (deltaY > 0 && window.scrollY === 0) {
        const progress = Math.min(deltaY / 120, 1);
        setPullProgress(progress);
        
        if (progress > 0.1) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (isPulling && pullProgress > 0.8 && !isRefreshing) {
        setIsRefreshing(true);
        setPullProgress(1);
        
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          setPullProgress(0);
        }
      } else {
        setPullProgress(0);
      }
      setIsPulling(false);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, isRefreshing, pullProgress, onRefresh]);

  return { containerRef, pullProgress, isRefreshing, isPulling };
};

// Hook for card carousel with swipe
export const useCardCarousel = (totalCards: number) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToNext = useCallback(() => {
    setActiveIndex(prev => Math.min(prev + 1, totalCards - 1));
  }, [totalCards]);

  const goToPrev = useCallback(() => {
    setActiveIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, totalCards - 1)));
  }, [totalCards]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      startXRef.current = e.touches[0].clientX;
      setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.touches[0].clientX - startXRef.current;
      setDragOffset(deltaX);
    };

    const handleTouchEnd = () => {
      if (isDragging) {
        if (dragOffset > 50) {
          goToPrev();
        } else if (dragOffset < -50) {
          goToNext();
        }
      }
      setIsDragging(false);
      setDragOffset(0);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragOffset, goToNext, goToPrev]);

  return {
    containerRef,
    activeIndex,
    dragOffset,
    isDragging,
    goToNext,
    goToPrev,
    goTo,
  };
};
