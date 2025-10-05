import { TrendingUp, Calendar, Target, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SavingsHeroProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  resultsCount: number;
}

export const SavingsHero = ({ 
  totalMonthlySavings, 
  totalAnnualSavings, 
  resultsCount 
}: SavingsHeroProps) => {
  const savingsPercentage = Math.round((totalMonthlySavings / 300) * 100); // Average assumption
  const retirementSavings = totalAnnualSavings * 30; // 30 years

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-elegant">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-primary opacity-90"></div>
      <div className="absolute inset-0">
        <div className="absolute top-4 right-6 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative p-3 text-white">
        <div className="text-center mb-2">
          <h2 className="text-lg font-black">החיסכון שלך</h2>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-center">
            <div className="text-2xl font-black text-white">
              {formatCurrency(totalMonthlySavings)}
            </div>
            <div className="text-white/80 text-xs">חודשי</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-black text-white">
              {formatCurrency(totalAnnualSavings)}
            </div>
            <div className="text-white/80 text-xs">שנתי</div>
          </div>
        </div>
      </div>
    </div>
  );
};