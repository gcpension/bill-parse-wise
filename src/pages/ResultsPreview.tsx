import { useMemo } from 'react';
import { DetailedAnalysisResults } from './DetailedAnalysisResults';
import { getCheapestPlan, calculateAnnualSavings, getProvidersByCategory } from '@/data/providers';

// Preview page to showcase the 2025 results UI with realistic mock data
export const ResultsPreview = () => {
  type Category = 'electricity' | 'cellular' | 'internet';

  const results = useMemo(() => {
    const categories: Category[] = ['cellular', 'internet', 'electricity'];

    return categories.map((category) => {
      const cheapest = getCheapestPlan(category)!;

      // Set realistic current amounts above the cheapest plan to show savings
      const currentAmount = category === 'electricity' ? 750 : category === 'internet' ? 129 : 119;
      const currentPrice = category === 'electricity' ? currentAmount / 850 : currentAmount;
      const newPrice = cheapest.price;

      return {
        category,
        currentAmount,
        currentProvider: 'הספק הנוכחי שלי',
        recommendedPlan: cheapest,
        monthlySavings: Math.max(0, currentPrice - newPrice),
        annualSavings: calculateAnnualSavings(currentPrice, newPrice, category),
        allProviders: getProvidersByCategory(category),
      };
    });
  }, []);

  return (
    <DetailedAnalysisResults results={results} onBackToInput={() => history.back()} />
  );
};

export default ResultsPreview;
