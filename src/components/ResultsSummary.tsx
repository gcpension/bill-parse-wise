import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { PiggyBank, Target, Award, TrendingUp } from 'lucide-react';

interface AnalysisResult {
  category: 'electricity' | 'cellular' | 'internet';
  currentAmount: number;
  currentProvider: string;
  recommendedPlan: any;
  monthlySavings: number;
  annualSavings: number;
  allProviders: any[];
  fileId?: string;
}

interface ResultsSummaryProps {
  results: AnalysisResult[];
}

export const ResultsSummary = ({ results }: ResultsSummaryProps) => {
  const totalSavings = {
    monthly: results.reduce((sum, result) => sum + result.monthlySavings, 0),
    annual: results.reduce((sum, result) => sum + result.annualSavings, 0),
  };

  const averageSavingsPercentage = results.length > 0 
    ? (results.reduce((sum, r) => sum + (r.monthlySavings / r.currentAmount * 100), 0) / results.length)
    : 0;

  return (
    <Card className="shadow-elegant bg-gradient-to-br from-success/10 via-success/5 to-transparent border-success/20 animate-scale-in overflow-hidden relative">
      {/* Background Animation */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-success/10 to-transparent rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
      
      <CardContent className="p-8 relative">
        <div className="text-center space-y-6">
          {/* Main Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-success/30 rounded-full blur-2xl scale-125 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-success via-success/90 to-success/70 text-white rounded-full w-28 h-28 mx-auto flex items-center justify-center shadow-2xl">
              <PiggyBank className="h-14 w-14" />
            </div>
          </div>
          
          {/* Main Title */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-success">סך הכל חיסכון צפוי</h2>
            
            {/* Savings Display */}
            <div className="flex justify-center items-baseline space-x-8 rtl:space-x-reverse">
              <div className="text-center p-6 bg-white/20 backdrop-blur rounded-2xl border border-success/20">
                <p className="text-5xl font-bold text-success animate-pulse">
                  {formatCurrency(totalSavings.monthly)}
                </p>
                <p className="text-lg text-success/80 font-medium">לחודש</p>
              </div>
              <div className="text-6xl text-success/30 animate-bounce">🚀</div>
              <div className="text-center p-6 bg-white/20 backdrop-blur rounded-2xl border border-success/20">
                <p className="text-5xl font-bold text-success animate-pulse">
                  {formatCurrency(totalSavings.annual)}
                </p>
                <p className="text-lg text-success/80 font-medium">לשנה</p>
              </div>
            </div>
          </div>
          
          {/* Celebration Message */}
          <div className="bg-gradient-to-r from-white/80 to-white/60 backdrop-blur rounded-2xl p-6 border border-success/20">
            <p className="text-xl text-success font-bold">
              🎉 מזל טוב! תוכל לחסוך עד {formatCurrency(totalSavings.annual)} בשנה הקרובה
            </p>
            <p className="text-success/80 mt-2">
              זה כמו לקבל {Math.round(totalSavings.annual / 1000)} משכורות נוספות בשנה!
            </p>
          </div>
          
          {/* Statistics Grid */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 bg-white/10 backdrop-blur rounded-xl border border-primary/20">
              <div className="p-3 bg-primary/20 rounded-full w-fit mx-auto mb-2">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">תחומים נותחו</h3>
              <p className="text-2xl font-bold text-primary">
                {results.length}
              </p>
            </div>
            
            <div className="text-center p-4 bg-white/10 backdrop-blur rounded-xl border border-orange-200">
              <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-2">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">% חיסכון ממוצע</h3>
              <p className="text-2xl font-bold text-orange-600">
                {averageSavingsPercentage.toFixed(1)}%
              </p>
            </div>
            
            <div className="text-center p-4 bg-white/10 backdrop-blur rounded-xl border border-purple-200">
              <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">חיסכון בגיל פרישה</h3>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(totalSavings.annual * 20)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};