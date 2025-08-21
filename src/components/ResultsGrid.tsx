import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingDown, Zap, Smartphone, Wifi, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ComparisonView } from './ComparisonView';
import { PlanSelector } from './PlanSelector';
import { DigitalSignature } from './DigitalSignature';
import { SavingsSummaryHeader } from './SavingsSummaryHeader';
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
  const [activeSignatureDialog, setActiveSignatureDialog] = useState<number | null>(null);
  
  const totalMonthlySavings = results.reduce((sum, result) => sum + result.monthlySavings, 0);
  const totalAnnualSavings = results.reduce((sum, result) => sum + result.annualSavings, 0);

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <SavingsSummaryHeader 
        totalMonthlySavings={totalMonthlySavings}
        totalAnnualSavings={totalAnnualSavings}
        resultCount={results.length}
      />

      {/* Results Grid */}
      <div className="grid gap-4">
        {results.map((result, index) => {
          const config = categoryConfig[result.category];
          const Icon = config.icon;
          const savingsPercentage = ((result.monthlySavings / result.currentAmount) * 100);
          
          return (
            <Card key={index} className="overflow-hidden border shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in">
              {/* Header Section */}
              <CardHeader className={`${config.bgColor} relative overflow-hidden p-4`}>
                <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                  <div className={`w-full h-full bg-gradient-to-bl ${config.color} rounded-full transform translate-x-10 -translate-y-10`}></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className={`p-2 bg-gradient-to-br ${config.color} rounded-lg shadow-md`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${config.textColor}`}>{config.name}</h3>
                      <p className="text-sm text-muted-foreground">ספק נוכחי: {result.currentProvider}</p>
                    </div>
                  </CardTitle>
                  
                  {result.monthlySavings > 0 && (
                    <div className="text-left space-y-1">
                      <Badge className="bg-success text-success-foreground text-sm px-3 py-1 shadow-md">
                        <TrendingDown className="ml-1 h-3 w-3" />
                        {formatCurrency(result.monthlySavings)}/חודש
                      </Badge>
                      <div className="text-lg font-bold text-success">
                        -{savingsPercentage.toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-6">
                {/* Use existing ComparisonView component */}
                <ComparisonView
                  currentProvider={result.currentProvider}
                  currentAmount={result.currentAmount}
                  recommendedPlan={result.recommendedPlan}
                  monthlySavings={result.monthlySavings}
                  annualSavings={result.annualSavings}
                />

                {/* All Available Plans Section */}
                <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 rounded-xl p-4 border shadow-sm">
                   <h4 className="text-lg font-bold mb-4 text-center flex items-center justify-center">
                     <Star className="h-4 w-4 mr-2 text-primary" />
                     כל החבילות ב{config.name}
                   </h4>
                   
                   <PlanSelector
                     category={result.category}
                     currentAmount={result.currentAmount}
                     dense={true}
                     showHeader={false}
                     onPlanSelect={(provider, plan) => {
                       toast({
                         title: "תכנית נבחרה! 🎉",
                         description: `בחרת את ${plan.name} מ${provider.name}. המשך עם החתימה הדיגיטלית.`,
                         duration: 4000,
                       });
                     }}
                   />
                 </div>

                {/* Detailed Savings Breakdown - only if there are savings */}
                {result.monthlySavings > 0 && (
                  <div className="bg-gradient-to-r from-success/10 to-success/5 rounded-lg p-4">
                    <h4 className="text-sm font-semibold mb-3 text-success flex items-center justify-center">
                      <TrendingDown className="h-4 w-4 mr-2" />
                      פירוט החיסכון שלך
                    </h4>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-white/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">חודשי</p>
                        <p className="text-sm font-bold text-success">
                          {formatCurrency(result.monthlySavings)}
                        </p>
                      </div>
                      <div className="bg-white/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">שנתי</p>
                        <p className="text-sm font-bold text-success">
                          {formatCurrency(result.annualSavings)}
                        </p>
                      </div>
                      <div className="bg-white/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">אחוז</p>
                        <p className="text-sm font-bold text-success">
                          -{savingsPercentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Action Buttons */}
                <div className="bg-gradient-to-br from-primary/10 via-primary-glow/5 to-success/10 rounded-xl p-4 border border-primary/20 shadow-md">
                   <h4 className="text-lg font-bold mb-4 text-center bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                     🚀 מוכן לעבור לחבילה החדשה?
                   </h4>
                   
                   <div className="space-y-3">
                     {/* Main Switch Button - Opens Digital Signature */}
                     <Button 
                       size="lg" 
                       className="w-full bg-gradient-to-r from-success via-success-foreground to-primary hover:from-success/90 hover:via-success-foreground/90 hover:to-primary/90 text-white font-bold py-4 px-6 text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                       onClick={() => setActiveSignatureDialog(index)}
                     >
                       <TrendingDown className="h-5 w-5 ml-3" />
                       <span className="font-bold">
                         נתק אותי מ{result.currentProvider} וחבר אותי ל{result.recommendedPlan?.providerName || 'ספק חדש'}
                       </span>
                     </Button>

                     {/* Digital Signature Dialog */}
                     <DigitalSignature
                       category={result.category}
                       currentProvider={result.currentProvider}
                       newProvider={result.recommendedPlan?.providerName || ''}
                       newPlan={result.recommendedPlan?.name || ''}
                       monthlySavings={result.monthlySavings}
                       open={activeSignatureDialog === index}
                       onOpenChange={(open) => {
                         if (!open) setActiveSignatureDialog(null);
                       }}
                       hideTrigger={true}
                     />
                   </div>
                   
                   <div className="mt-4 text-center bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
                     <p className="text-sm font-semibold text-primary mb-2">
                       🎯 השירות שלנו כולל:
                     </p>
                     <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                       <span className="flex items-center">✅ ניתוק מהספק הקודם</span>
                       <span className="flex items-center">✅ חיבור לספק החדש</span>
                       <span className="flex items-center">✅ טיפול בכל הניירת</span>
                       <span className="flex items-center">🆓 ללא עלות!</span>
                     </div>
                   </div>
                 </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};