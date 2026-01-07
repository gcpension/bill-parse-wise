import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'easyswitch_search_history';
const MAX_HISTORY = 10;
const DEBOUNCE_DELAY = 300;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  category?: string;
}

export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceTimer = useRef<NodeJS.Timeout>();

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((newHistory: SearchHistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }, []);

  // Add search to history
  const addToHistory = useCallback((query: string, category?: string) => {
    if (!query.trim() || query.length < 2) return;

    const newItem: SearchHistoryItem = {
      query: query.trim(),
      timestamp: Date.now(),
      category,
    };

    setHistory(prev => {
      // Remove duplicates and add new item at start
      const filtered = prev.filter(item => item.query.toLowerCase() !== query.toLowerCase());
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);
      saveHistory(updated);
      return updated;
    });
  }, [saveHistory]);

  // Remove item from history
  const removeFromHistory = useCallback((query: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.query !== query);
      saveHistory(updated);
      return updated;
    });
  }, [saveHistory]);

  // Clear all history
  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  // Debounced search handler
  const handleSearchChange = useCallback((query: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_DELAY);
  }, []);

  // Get suggestions based on current input
  const getSuggestions = useCallback((input: string, limit = 5): string[] => {
    if (!input.trim()) {
      return history.slice(0, limit).map(item => item.query);
    }

    const lowerInput = input.toLowerCase();
    return history
      .filter(item => item.query.toLowerCase().includes(lowerInput))
      .slice(0, limit)
      .map(item => item.query);
  }, [history]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    history,
    debouncedQuery,
    addToHistory,
    removeFromHistory,
    clearHistory,
    handleSearchChange,
    getSuggestions,
  };
};
