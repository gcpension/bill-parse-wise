import { useState, useEffect } from 'react';

export interface SavingsData {
  id: string;
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  currentProvider: string;
  currentAmount: number;
  recommendedProvider: string;
  recommendedAmount: number;
  monthlySavings: number;
  annualSavings: number;
  analysisDate: Date;
  status: 'active' | 'pending' | 'completed';
  switchDate?: Date;
}

const STORAGE_KEY = 'userSavingsData';

export const useSavingsData = () => {
  const [savingsData, setSavingsData] = useState<SavingsData[]>([]);
  
  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSavingsData(parsed.map((item: any) => ({
          ...item,
          analysisDate: new Date(item.analysisDate),
          switchDate: item.switchDate ? new Date(item.switchDate) : undefined
        })));
      } catch (error) {
        console.error('Error parsing savings data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (savingsData.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savingsData));
    }
  }, [savingsData]);

  const addSavingsData = (data: Omit<SavingsData, 'id' | 'analysisDate'>) => {
    const newEntry: SavingsData = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      analysisDate: new Date(),
    };
    
    // Remove existing entry for same category if exists
    setSavingsData(prev => [
      ...prev.filter(item => item.category !== data.category),
      newEntry
    ]);
  };

  const updateSavingsStatus = (id: string, status: SavingsData['status'], switchDate?: Date) => {
    setSavingsData(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, status, switchDate: switchDate || item.switchDate }
          : item
      )
    );
  };

  const removeSavingsData = (id: string) => {
    setSavingsData(prev => prev.filter(item => item.id !== id));
  };

  const getTotalMonthlySavings = () => {
    return savingsData.reduce((sum, item) => sum + item.monthlySavings, 0);
  };

  const getTotalAnnualSavings = () => {
    return savingsData.reduce((sum, item) => sum + item.annualSavings, 0);
  };

  const getSavingsByCategory = (category: SavingsData['category']) => {
    return savingsData.find(item => item.category === category);
  };

  const clearAllData = () => {
    setSavingsData([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    savingsData,
    addSavingsData,
    updateSavingsStatus,
    removeSavingsData,
    getTotalMonthlySavings,
    getTotalAnnualSavings,
    getSavingsByCategory,
    clearAllData
  };
};