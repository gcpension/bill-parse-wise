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
    <div className="relative overflow-hidden rounded-3xl shadow-elegant">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-primary opacity-90"></div>
      <div className="absolute inset-0">
        <div className="absolute top-8 right-12 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-8 left-8 w-20 h-20 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-20 left-1/3 w-12 h-12 bg-white/5 rounded-full animate-bounce-gentle"></div>
      </div>
      
      <div className="relative p-8 text-white">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 animate-pulse" />
            <h2 className="text-4xl font-black">תוצאות מדהימות!</h2>
            <TrendingUp className="h-8 w-8 animate-pulse delay-500" />
          </div>
          <p className="text-white/90 text-lg">
            ניתחנו {resultsCount} שירותים ומצאנו לך חיסכון משמעותי
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/15 backdrop-blur-sm border-white/20 p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-white/20 rounded-full">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-white mb-1">
              {formatCurrency(totalMonthlySavings)}
            </div>
            <div className="text-white/80 text-sm">חיסכון חודשי</div>
          </Card>

          <Card className="bg-white/15 backdrop-blur-sm border-white/20 p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-white/20 rounded-full">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-white mb-1">
              {formatCurrency(totalAnnualSavings)}
            </div>
            <div className="text-white/80 text-sm">חיסכון שנתי</div>
          </Card>

          <Card className="bg-white/15 backdrop-blur-sm border-white/20 p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-white/20 rounded-full">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-white mb-1">
              {savingsPercentage}%
            </div>
            <div className="text-white/80 text-sm">חיסכון ממוצע</div>
          </Card>
        </div>

        <div className="text-center">
          <Badge className="bg-white/20 text-white border-white/30 px-6 py-2 text-lg font-semibold">
            🎉 זה כמו לקבל {Math.round(totalAnnualSavings / totalMonthlySavings)} חודשים בחינם בשנה!
          </Badge>
          <div className="mt-4 text-white/80 text-sm">
            * בתוספת חיסכון של {formatCurrency(retirementSavings)} עד הפנסיה
          </div>
        </div>
      </div>
    </div>
  );
};