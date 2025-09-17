import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Smartphone, Wifi, Tv, TrendingUp, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface AnalysisResult {
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  currentAmount: number;
  currentProvider: string;
  recommendedPlan: any;
  monthlySavings: number;
  annualSavings: number;
  allProviders: any[];
  fileId?: string;
}

interface SimpleResultsProps {
  results: AnalysisResult[];
  onBackToInput: () => void;
}

const categoryIcons = {
  electricity: Zap,
  cellular: Smartphone,
  internet: Wifi,
  tv: Tv
};

const categoryNames = {
  electricity: 'חשמל',
  cellular: 'סלולר', 
  internet: 'אינטרנט',
  tv: 'טלוויזיה'
};

const categoryColors = {
  electricity: 'from-yellow-500 to-orange-500',
  cellular: 'from-purple-500 to-pink-500',
  internet: 'from-blue-500 to-cyan-500',
  tv: 'from-green-500 to-emerald-500'
};

export const SimpleResults = ({ results, onBackToInput }: SimpleResultsProps) => {
  const totalMonthlySavings = results.reduce((sum, result) => sum + result.monthlySavings, 0);
  const totalAnnualSavings = results.reduce((sum, result) => sum + result.annualSavings, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full border border-success/20">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <span className="text-success font-semibold">ניתוח הושלם בהצלחה</span>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-primary via-success to-blue-600 bg-clip-text text-transparent">
            התוצאות שלכם
          </h1>
        </div>

        {/* Total Savings Summary */}
        <Card className="max-w-md mx-auto border-2 border-success/20 bg-gradient-to-br from-success/5 to-success/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-medium">סך הכל ניתן לחסוך</p>
              <div className="text-3xl font-black text-success">
                {formatCurrency(totalMonthlySavings)}
              </div>
              <p className="text-xs text-muted-foreground">לחודש</p>
              <div className="pt-2 border-t border-success/20">
                <p className="text-sm font-bold text-foreground">
                  {formatCurrency(totalAnnualSavings)} לשנה
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map((result, index) => {
          const CategoryIcon = categoryIcons[result.category];
          const gradientClass = categoryColors[result.category];
          
          return (
            <Card key={index} className="border border-border/50 hover:shadow-lg transition-all duration-300 group overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${gradientClass}`} />
              
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientClass} text-white`}>
                    <CategoryIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">
                      {categoryNames[result.category]}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {result.currentProvider}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Current vs Recommended */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">נוכחי:</span>
                    <span className="font-bold">{formatCurrency(result.currentAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">מומלץ:</span>
                    <span className="font-bold text-primary">{formatCurrency(result.recommendedPlan.price)}</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">חיסכון חודשי:</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="font-bold text-success">{formatCurrency(result.monthlySavings)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommended Plan */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-center space-y-1">
                    <p className="text-xs text-muted-foreground">מסלול מומלץ</p>
                    <p className="font-bold text-sm">{result.recommendedPlan.name}</p>
                    <p className="text-xs text-muted-foreground">{result.recommendedPlan.company}</p>
                  </div>
                </div>

                {/* Annual Savings Badge */}
                <div className="text-center">
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    {formatCurrency(result.annualSavings)} לשנה
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-8">
        <Button 
          variant="outline" 
          onClick={onBackToInput}
          className="px-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          חזרה לניתוח
        </Button>
        
        <Button 
          variant="purple"
          className="px-8"
          onClick={() => window.open('/all-plans', '_blank')}
        >
          ראו כל המסלולים
        </Button>
      </div>
    </div>
  );
};