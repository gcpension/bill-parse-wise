import { useState, useEffect, useCallback } from 'react';

interface PlanPreferences {
  favorites: string[]; // plan IDs (company-plan combination)
  viewedPlans: string[];
  compareList: string[];
  savedFilters: {
    features: string[];
    maxPrice: number | null;
    noCommitment: boolean;
  };
}

const STORAGE_KEY = 'plan-preferences';

const defaultPreferences: PlanPreferences = {
  favorites: [],
  viewedPlans: [],
  compareList: [],
  savedFilters: {
    features: [],
    maxPrice: null,
    noCommitment: false,
  },
};

export const usePlanPreferences = () => {
  const [preferences, setPreferences] = useState<PlanPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPreferences({ ...defaultPreferences, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Error loading plan preferences:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      } catch (error) {
        console.error('Error saving plan preferences:', error);
      }
    }
  }, [preferences, isLoaded]);

  // Generate plan ID
  const getPlanId = useCallback((company: string, planName: string): string => {
    return `${company}-${planName}`.replace(/\s+/g, '-').toLowerCase();
  }, []);

  // Favorites
  const toggleFavorite = useCallback((company: string, planName: string) => {
    const planId = getPlanId(company, planName);
    setPreferences(prev => ({
      ...prev,
      favorites: prev.favorites.includes(planId)
        ? prev.favorites.filter(id => id !== planId)
        : [...prev.favorites, planId],
    }));
  }, [getPlanId]);

  const isFavorite = useCallback((company: string, planName: string): boolean => {
    const planId = getPlanId(company, planName);
    return preferences.favorites.includes(planId);
  }, [preferences.favorites, getPlanId]);

  const getFavoriteCount = useCallback((): number => {
    return preferences.favorites.length;
  }, [preferences.favorites]);

  // Compare list
  const toggleCompare = useCallback((company: string, planName: string): boolean => {
    const planId = getPlanId(company, planName);
    const isInList = preferences.compareList.includes(planId);
    
    if (isInList) {
      setPreferences(prev => ({
        ...prev,
        compareList: prev.compareList.filter(id => id !== planId),
      }));
      return false;
    } else if (preferences.compareList.length < 3) {
      setPreferences(prev => ({
        ...prev,
        compareList: [...prev.compareList, planId],
      }));
      return true;
    }
    return false; // Can't add more than 3
  }, [preferences.compareList, getPlanId]);

  const isInCompare = useCallback((company: string, planName: string): boolean => {
    const planId = getPlanId(company, planName);
    return preferences.compareList.includes(planId);
  }, [preferences.compareList, getPlanId]);

  const getCompareCount = useCallback((): number => {
    return preferences.compareList.length;
  }, [preferences.compareList]);

  const clearCompare = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      compareList: [],
    }));
  }, []);

  // Viewed plans
  const markAsViewed = useCallback((company: string, planName: string) => {
    const planId = getPlanId(company, planName);
    setPreferences(prev => {
      if (prev.viewedPlans.includes(planId)) return prev;
      const newViewed = [planId, ...prev.viewedPlans].slice(0, 20); // Keep last 20
      return { ...prev, viewedPlans: newViewed };
    });
  }, [getPlanId]);

  const wasViewed = useCallback((company: string, planName: string): boolean => {
    const planId = getPlanId(company, planName);
    return preferences.viewedPlans.includes(planId);
  }, [preferences.viewedPlans, getPlanId]);

  // Saved filters
  const saveFilters = useCallback((filters: PlanPreferences['savedFilters']) => {
    setPreferences(prev => ({
      ...prev,
      savedFilters: filters,
    }));
  }, []);

  const getSavedFilters = useCallback((): PlanPreferences['savedFilters'] => {
    return preferences.savedFilters;
  }, [preferences.savedFilters]);

  return {
    isLoaded,
    // Favorites
    toggleFavorite,
    isFavorite,
    getFavoriteCount,
    favorites: preferences.favorites,
    // Compare
    toggleCompare,
    isInCompare,
    getCompareCount,
    clearCompare,
    compareList: preferences.compareList,
    // Viewed
    markAsViewed,
    wasViewed,
    viewedPlans: preferences.viewedPlans,
    // Filters
    saveFilters,
    getSavedFilters,
    // Utility
    getPlanId,
  };
};
