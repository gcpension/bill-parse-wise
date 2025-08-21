import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown } from 'lucide-react';
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

interface ResultCardProps {
  result: AnalysisResult;
  index: number;
}

const categoryIcons = {
  electricity: '⚡',
  cellular: '📱',
  internet: '🌐'
};

const categoryNames = {
  electricity: 'חשמל',
  cellular: 'סלולר',
  internet: 'אינטרנט'
};

const categoryColors = {
  electricity: 'from-yellow-500 to-orange-500',
  cellular: 'from-blue-500 to-purple-500',
  internet: 'from-green-500 to-teal-500'
};

export const ResultCard = ({ result, index }: ResultCardProps) => {
  const gradientClass = categoryColors[result.category];
  const savingsPercentage = ((result.monthlySavings / result.currentAmount) * 100);
  const { toast } = useToast();
  
  return (
    <Card className="shadow-elegant hover:shadow-2xl transition-all duration-500 animate-fade-in overflow-hidden relative group border-0 ring-1 ring-border/50 hover:ring-primary/50">
      {/* Animated Background Pattern */}
      <div className={`absolute top-0 right-0 pointer-events-none w-64 h-64 bg-gradient-to-bl ${gradientClass} opacity-5 rounded-full -translate-y-32 translate-x-32 group-hover:scale-110 transition-transform duration-700`}></div>
      
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-4 rtl:space-x-reverse text-2xl">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} rounded-xl blur-md scale-110 opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
              <div className={`relative p-4 bg-gradient-to-br ${gradientClass} rounded-xl shadow-xl flex items-center justify-center text-4xl`}>
                {categoryIcons[result.category]}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold">{categoryNames[result.category]}</h3>
              <p className="text-muted-foreground font-normal">
                ספק נוכחי: {result.currentProvider}
              </p>
            </div>
          </CardTitle>
          
          {result.monthlySavings > 0 && (
            <div className="flex flex-col items-end space-y-2">
              <Badge className="bg-success text-success-foreground text-lg px-4 py-2 animate-pulse shadow-lg">
                <TrendingDown className="ml-1 h-4 w-4" />
                חיסכון: {formatCurrency(result.monthlySavings)}/חודש
              </Badge>
              <div className="text-3xl font-bold text-success animate-pulse">
                -{savingsPercentage.toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {/* Comparison View */}
        <ComparisonView
          currentProvider={result.currentProvider}
          currentAmount={result.currentAmount}
          recommendedPlan={result.recommendedPlan}
          monthlySavings={result.monthlySavings}
          annualSavings={result.annualSavings}
        />

        {/* Savings Breakdown */}
        {result.monthlySavings > 0 && (
          <div className="bg-gradient-to-r from-success/10 to-success/5 rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-4 text-success">פירוט החיסכון</h4>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">חיסכון חודשי</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(result.monthlySavings)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">חיסכון שנתי</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(result.annualSavings)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">אחוז חיסכון</p>
                <p className="text-2xl font-bold text-success">
                  {((result.monthlySavings / result.currentAmount) * 100).toFixed(1)}%
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
};