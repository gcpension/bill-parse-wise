import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingDown, Zap, Smartphone, Wifi, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { DigitalSignature } from './DigitalSignature';
import { SavingsSummaryHeader } from './SavingsSummaryHeader';
import { useToast } from '@/hooks/use-toast';
import { electricityProviders, cellularProviders, internetProviders } from '@/data/providers';
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
  electricity: { icon: Zap, name: 'חשמל', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  cellular: { icon: Smartphone, name: 'סלולר', color: 'text-blue-600', bg: 'bg-blue-100' },
  internet: { icon: Wifi, name: 'אינטרנט', color: 'text-green-600', bg: 'bg-green-100' }
};

export const ResultsGrid = ({ results }: ResultsGridProps) => {
  const { toast } = useToast();
  const [activeSignatureDialog, setActiveSignatureDialog] = useState<number | null>(null);
  const [expandedPlans, setExpandedPlans] = useState<Record<number, boolean>>({});
  
  const totalMonthlySavings = results.reduce((sum, result) => sum + result.monthlySavings, 0);
  const totalAnnualSavings = results.reduce((sum, result) => sum + result.annualSavings, 0);

  const togglePlans = (index: number) => {
    setExpandedPlans(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const getProvidersForCategory = (category: 'electricity' | 'cellular' | 'internet') => {
    switch (category) {
      case 'electricity': return electricityProviders;
      case 'cellular': return cellularProviders;
      case 'internet': return internetProviders;
      default: return [];
    }
  };

  return (
    <div className="space-y-4">
      {/* Compact Summary */}
      <div className="bg-gradient-to-r from-success/20 to-primary/20 rounded-lg p-4 text-center">
        <h2 className="text-lg font-bold mb-2">סה&quot;כ חיסכון חודשי: {formatCurrency(totalMonthlySavings)}</h2>
        <p className="text-sm text-muted-foreground">חיסכון שנתי: {formatCurrency(totalAnnualSavings)}</p>
      </div>

      {/* Compact Results List */}
      <div className="space-y-3">
        {results.map((result, index) => {
          const config = categoryConfig[result.category];
          const Icon = config.icon;
          const savingsPercentage = ((result.monthlySavings / result.currentAmount) * 100);
          const allProviders = getProvidersForCategory(result.category);
          const isExpanded = expandedPlans[index];
          
          return (
            <Card key={index} className="border hover:shadow-md transition-shadow">
              {/* Compact Header */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.bg}`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">{config.name}</h3>
                      <p className="text-xs text-muted-foreground">נוכחי: {result.currentProvider}</p>
                    </div>
                  </div>
                  {result.monthlySavings > 0 && (
                    <Badge variant="secondary" className="bg-success/20 text-success">
                      -{savingsPercentage.toFixed(0)}% • {formatCurrency(result.monthlySavings)}/חודש
                    </Badge>
                  )}
                </div>

                {/* Current vs Recommended - Compact View */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-red-600 mb-1">תשלום נוכחי</p>
                    <p className="font-bold text-red-700">₪{result.currentAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-green-600 mb-1">מומלץ - {result.recommendedPlan?.providerName}</p>
                    <p className="font-bold text-green-700">₪{result.recommendedPlan?.price.toLocaleString()}</p>
                  </div>
                </div>

                {/* Toggle Plans Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => togglePlans(index)}
                  className="w-full mb-3"
                >
                  <Eye className="h-4 w-4 ml-2" />
                  {isExpanded ? 'הסתר' : 'הצג'} כל החבילות ({allProviders.reduce((sum, p) => sum + p.plans.length, 0)})
                  {isExpanded ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
                </Button>

                {/* Expanded Plans Table */}
                {isExpanded && (
                  <div className="border rounded-lg overflow-hidden mb-3">
                    <div className="bg-muted/50 p-2 grid grid-cols-4 gap-2 text-xs font-semibold">
                      <span>ספק</span>
                      <span>חבילה</span>
                      <span>מחיר</span>
                      <span>חיסכון</span>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {allProviders.map(provider =>
                        provider.plans.map(plan => {
                          const savings = result.currentAmount - plan.price;
                          const savingsPercent = ((savings / result.currentAmount) * 100);
                          const isRecommended = plan.name === result.recommendedPlan?.name && provider.name === result.recommendedPlan?.providerName;
                          
                          return (
                            <div 
                              key={`${provider.name}-${plan.name}`}
                              className={`p-2 grid grid-cols-4 gap-2 text-xs border-b hover:bg-muted/30 ${
                                isRecommended ? 'bg-green-50 border-green-200' : ''
                              }`}
                            >
                              <span className="font-medium">{provider.name}</span>
                              <span className="truncate">{plan.name}</span>
                              <span className="font-bold">₪{plan.price.toLocaleString()}</span>
                              <span className={savings > 0 ? 'text-green-600 font-medium' : 'text-red-600'}>
                                {savings > 0 ? `+₪${savings.toFixed(0)}` : `₪${Math.abs(savings).toFixed(0)}-`}
                                {savings !== 0 && ` (${savingsPercent > 0 ? '+' : ''}${savingsPercent.toFixed(0)}%)`}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-success" 
                  onClick={() => setActiveSignatureDialog(index)}
                >
                  עבור ל{result.recommendedPlan?.providerName} • חסוך {formatCurrency(result.monthlySavings)}/חודש
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
            </Card>
          );
        })}
      </div>
    </div>
  );
};