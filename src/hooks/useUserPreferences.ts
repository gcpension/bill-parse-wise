import { useState, useEffect, useCallback } from 'react';

export interface UserPreferences {
  // View preferences
  viewMode: 'carousel' | 'grid' | 'list';
  sortBy: 'price-asc' | 'price-desc' | 'name';
  
  // Recent amounts per category
  recentAmounts: Record<string, number[]>;
  
  // Favorites
  favoritePlans: string[];
  
  // Last selected categories
  lastSelectedCategories: string[];
  
  // Recent searches
  recentSearches: string[];
  
  // Last visit timestamp
  lastVisit: number;
}

const STORAGE_KEY = 'easyswitch_user_preferences';
const MAX_RECENT_AMOUNTS = 5;
const MAX_RECENT_SEARCHES = 10;

const defaultPreferences: UserPreferences = {
  viewMode: 'carousel',
  sortBy: 'price-asc',
  recentAmounts: {},
  favoritePlans: [],
  lastSelectedCategories: [],
  recentSearches: [],
  lastVisit: Date.now(),
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsed, lastVisit: Date.now() });
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading preferences:', error);
      setIsLoaded(true);
    }
  }, []);

  // Save preferences whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      } catch (error) {
        console.error('Error saving preferences:', error);
      }
    }
  }, [preferences, isLoaded]);

  // Update view mode
  const setViewMode = useCallback((mode: UserPreferences['viewMode']) => {
    setPreferences(prev => ({ ...prev, viewMode: mode }));
  }, []);

  // Update sort preference
  const setSortBy = useCallback((sort: UserPreferences['sortBy']) => {
    setPreferences(prev => ({ ...prev, sortBy: sort }));
  }, []);

  // Add recent amount for a category
  const addRecentAmount = useCallback((category: string, amount: number) => {
    if (amount <= 0) return;
    
    setPreferences(prev => {
      const categoryAmounts = prev.recentAmounts[category] || [];
      // Remove duplicates and add new amount at start
      const updated = [amount, ...categoryAmounts.filter(a => a !== amount)].slice(0, MAX_RECENT_AMOUNTS);
      return {
        ...prev,
        recentAmounts: {
          ...prev.recentAmounts,
          [category]: updated
        }
      };
    });
  }, []);

  // Get recent amounts for a category
  const getRecentAmounts = useCallback((category: string): number[] => {
    return preferences.recentAmounts[category] || [];
  }, [preferences.recentAmounts]);

  // Toggle favorite plan
  const toggleFavorite = useCallback((planId: string) => {
    setPreferences(prev => {
      const isFavorite = prev.favoritePlans.includes(planId);
      return {
        ...prev,
        favoritePlans: isFavorite
          ? prev.favoritePlans.filter(id => id !== planId)
          : [...prev.favoritePlans, planId]
      };
    });
  }, []);

  // Check if plan is favorite
  const isFavorite = useCallback((planId: string): boolean => {
    return preferences.favoritePlans.includes(planId);
  }, [preferences.favoritePlans]);

  // Add recent search
  const addRecentSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    
    setPreferences(prev => {
      const updated = [query, ...prev.recentSearches.filter(s => s !== query)].slice(0, MAX_RECENT_SEARCHES);
      return { ...prev, recentSearches: updated };
    });
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setPreferences(prev => ({ ...prev, recentSearches: [] }));
  }, []);

  // Save last selected categories
  const setLastSelectedCategories = useCallback((categories: string[]) => {
    setPreferences(prev => ({ ...prev, lastSelectedCategories: categories }));
  }, []);

  return {
    preferences,
    isLoaded,
    setViewMode,
    setSortBy,
    addRecentAmount,
    getRecentAmounts,
    toggleFavorite,
    isFavorite,
    addRecentSearch,
    clearRecentSearches,
    setLastSelectedCategories,
  };
};

// Utility functions for direct localStorage access
export const getLastAmount = (category: string): number | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const amounts = parsed.recentAmounts?.[category];
      return amounts?.[0] || null;
    }
  } catch (error) {
    console.error('Error getting last amount:', error);
  }
  return null;
};

export const getQuickAmountSuggestions = (category: string): number[] => {
  // Category-specific suggested amounts
  const suggestions: Record<string, number[]> = {
    electricity: [150, 250, 350, 500, 750],
    cellular: [50, 80, 100, 150, 200],
    internet: [100, 150, 200, 250, 300],
    tv: [100, 150, 200, 300, 400],
    triple: [250, 350, 450, 550, 700],
  };
  
  return suggestions[category] || [100, 200, 300, 400, 500];
};
