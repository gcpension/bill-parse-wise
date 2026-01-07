import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

interface UseHapticFeedbackReturn {
  trigger: (type?: HapticType) => void;
  isSupported: boolean;
}

export function useHapticFeedback(): UseHapticFeedbackReturn {
  // Check if vibration API is supported
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const trigger = useCallback((type: HapticType = 'light') => {
    if (!isSupported) return;

    try {
      // Vibration patterns for different feedback types (in milliseconds)
      const patterns: Record<HapticType, number | number[]> = {
        light: 10,
        medium: 20,
        heavy: 40,
        success: [10, 50, 20], // Short, pause, medium
        warning: [20, 30, 20, 30, 20], // Triple pulse
        error: [50, 30, 50], // Strong double pulse
        selection: 5, // Very light tap
      };

      const pattern = patterns[type];
      navigator.vibrate(pattern);
    } catch (error) {
      // Silently fail if vibration is not available
      console.debug('Haptic feedback not available:', error);
    }
  }, [isSupported]);

  return { trigger, isSupported };
}

// Convenience hooks for specific feedback types
export const useHapticSuccess = () => {
  const { trigger } = useHapticFeedback();
  return useCallback(() => trigger('success'), [trigger]);
};

export const useHapticError = () => {
  const { trigger } = useHapticFeedback();
  return useCallback(() => trigger('error'), [trigger]);
};

export const useHapticSelection = () => {
  const { trigger } = useHapticFeedback();
  return useCallback(() => trigger('selection'), [trigger]);
};

export default useHapticFeedback;
