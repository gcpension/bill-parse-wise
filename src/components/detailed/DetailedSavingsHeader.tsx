import { TrendingUp, Star, Crown, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface DetailedSavingsHeaderProps {
  category: string;
  categoryName: string;
  monthlySavings: number;
  annualSavings: number;
  savingsPercentage: number;
  currentAmount: number;
  recommendedAmount: number;
}

export const DetailedSavingsHeader = ({
  category,
  categoryName,
  monthlySavings,
  annualSavings,
  savingsPercentage,
  currentAmount,
  recommendedAmount
}: DetailedSavingsHeaderProps) => {
  return (
    <section className="relative overflow-hidden rounded-2xl shadow-elegant mb-6 bg-gradient-success text-success-foreground">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-primary-glow/30 blur-2xl"></div>
        <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-success-glow/30 blur-2xl"></div>
      </div>
      
      <div className="relative p-3">
        <div className="text-center">
          <h1 className="text-base font-black mb-2">חיסכון {categoryName}</h1>
          
          <div className="text-2xl font-black text-success-foreground mb-1">
            ₪{monthlySavings.toFixed(2)}
          </div>
          <div className="text-xs text-success-foreground/90 mb-1">
            חיסכון חודשי
          </div>
          <div className="text-sm font-bold text-success-foreground/95">
            ₪{annualSavings.toFixed(2)} שנתי
          </div>
        </div>
      </div>
    </section>
  );
};