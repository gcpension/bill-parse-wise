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
      
      <div className="relative p-4 md:p-6 text-white">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 animate-pulse" />
            <h2 className="text-2xl font-black">תוצאות מדהימות!</h2>
            <TrendingUp className="h-5 w-5 animate-pulse delay-500" />
          </div>
          <p className="text-white/90 text-sm">
            ניתחנו {resultsCount} שירותים ומצאנו לך חיסכון משמעותי
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mb-4">
          <Card className="bg-white/15 backdrop-blur-sm border-white/20 p-3 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-white/20 rounded-full">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="text-xl font-black text-white mb-1">
              {formatCurrency(totalMonthlySavings)}
            </div>
            <div className="text-white/80 text-xs">חיסכון חודשי</div>
          </Card>

          <Card className="bg-white/15 backdrop-blur-sm border-white/20 p-3 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-white/20 rounded-full">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="text-xl font-black text-white mb-1">
              {formatCurrency(totalAnnualSavings)}
            </div>
            <div className="text-white/80 text-xs">חיסכון שנתי</div>
          </Card>

          <Card className="bg-white/15 backdrop-blur-sm border-white/20 p-3 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-white/20 rounded-full">
                <Target className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="text-xl font-black text-white mb-1">
              {savingsPercentage}%
            </div>
            <div className="text-white/80 text-xs">חיסכון ממוצע</div>
          </Card>
        </div>

        <div className="text-center">
          <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 text-sm font-semibold">
            🎉 זה כמו לקבל {Math.round(totalAnnualSavings / totalMonthlySavings)} חודשים בחינם בשנה!
          </Badge>
          <div className="mt-2 text-white/80 text-xs">
            * בתוספת חיסכון של {formatCurrency(retirementSavings)} עד הפנסיה
          </div>
        </div>
      </div>
    </div>
  );
};