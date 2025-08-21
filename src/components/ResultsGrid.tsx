import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, Zap, Smartphone, Wifi, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ComparisonView } from './ComparisonView';
import { PlanSelector } from './PlanSelector';
import { DigitalSignature } from './DigitalSignature';
import { useToast } from '@/hooks/use-toast';

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

interface ResultsGridProps {
  results: AnalysisResult[];
}

const categoryConfig = {
  electricity: {
    icon: Zap,
    name: 'חשמל',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-900'
  },
  cellular: {
    icon: Smartphone,
    name: 'סלולר',
    color: 'from-blue-500 to-purple-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-900'
  },
  internet: {
    icon: Wifi,
    name: 'אינטרנט',
    color: 'from-green-500 to-teal-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-900'
  }
};

export const ResultsGrid = ({ results }: ResultsGridProps) => {
  const { toast } = useToast();
  
  const totalMonthlySavings = results.reduce((sum, result) => sum + result.monthlySavings, 0);
  const totalAnnualSavings = results.reduce((sum, result) => sum + result.annualSavings, 0);

  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <div className="bg-gradient-to-r from-success/10 via-success/5 to-transparent rounded-2xl p-8 border border-success/20">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">סיכום החיסכון שלך</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-success/30">
              <p className="text-sm text-muted-foreground mb-2">חיסכון חודשי כולל</p>
              <p className="text-4xl font-bold text-success">{formatCurrency(totalMonthlySavings)}</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-success/30">
              <p className="text-sm text-muted-foreground mb-2">חיסכון שנתי כולל</p>
              <p className="text-4xl font-bold text-success">{formatCurrency(totalAnnualSavings)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-8">
        {results.map((result, index) => {
          const config = categoryConfig[result.category];
          const Icon = config.icon;
          const savingsPercentage = ((result.monthlySavings / result.currentAmount) * 100);
          
          return (
            <Card key={index} className="overflow-hidden border-0 shadow-elegant hover:shadow-2xl transition-all duration-500 animate-fade-in">
              {/* Header Section */}
              <CardHeader className={`${config.bgColor} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <div className={`w-full h-full bg-gradient-to-bl ${config.color} rounded-full transform translate-x-16 -translate-y-16`}></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className={`p-4 bg-gradient-to-br ${config.color} rounded-xl shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${config.textColor}`}>{config.name}</h3>
                      <p className="text-muted-foreground">ספק נוכחי: {result.currentProvider}</p>
                    </div>
                  </CardTitle>
                  
                  {result.monthlySavings > 0 && (
                    <div className="text-left space-y-2">
                      <Badge className="bg-success text-success-foreground text-lg px-4 py-2 shadow-lg">
                        <TrendingDown className="ml-1 h-4 w-4" />
                        חיסכון: {formatCurrency(result.monthlySavings)}/חודש
                      </Badge>
                      <div className="text-2xl font-bold text-success">
                        -{savingsPercentage.toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                {/* Use existing ComparisonView component */}
                <ComparisonView
                  currentProvider={result.currentProvider}
                  currentAmount={result.currentAmount}
                  recommendedPlan={result.recommendedPlan}
                  monthlySavings={result.monthlySavings}
                  annualSavings={result.annualSavings}
                />

                {/* Detailed Savings Breakdown - only if there are savings */}
                {result.monthlySavings > 0 && (
                  <div className="bg-gradient-to-r from-success/10 to-success/5 rounded-xl p-6">
                    <h4 className="text-lg font-semibold mb-4 text-success flex items-center">
                      <TrendingDown className="h-5 w-5 mr-2" />
                      פירוט החיסכון
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                      <div className="bg-white/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">חיסכון חודשי</p>
                        <p className="text-xl font-bold text-success">
                          {formatCurrency(result.monthlySavings)}
                        </p>
                      </div>
                      <div className="bg-white/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">חיסכון שנתי</p>
                        <p className="text-xl font-bold text-success">
                          {formatCurrency(result.annualSavings)}
                        </p>
                      </div>
                      <div className="bg-white/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">אחוז חיסכון</p>
                        <p className="text-xl font-bold text-success">
                          -{savingsPercentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <DigitalSignature
                    category={result.category}
                    currentProvider={result.currentProvider}
                    newProvider={result.recommendedPlan?.providerName || ''}
                    newPlan={result.recommendedPlan?.name || ''}
                    monthlySavings={result.monthlySavings}
                  />
                  <PlanSelector
                    category={result.category}
                    currentAmount={result.currentAmount}
                    onPlanSelect={(provider, plan) => {
                      toast({
                        title: "תכנית נבחרה בהצלחה!",
                        description: `בחרת את ${plan.name} מ${provider.name}. מומלץ להמשיך עם החתימה הדיגיטלית.`,
                      });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};