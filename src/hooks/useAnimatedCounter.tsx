import { useState, useEffect } from 'react';

interface UseAnimatedCounterOptions {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
}

export const useAnimatedCounter = ({ 
  start = 0, 
  end, 
  duration = 2000,
  decimals = 0 
}: UseAnimatedCounterOptions) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
      const currentCount = start + (end - start) * easeOut;
      
      setCount(parseFloat(currentCount.toFixed(decimals)));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [start, end, duration, decimals]);

  return count;
};