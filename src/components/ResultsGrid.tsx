import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingDown, Zap, Smartphone, Wifi, Eye, ChevronDown, ChevronUp, Star, CheckCircle2, Sparkles } from 'lucide-react';
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
  const [selectedPlans, setSelectedPlans] = useState<Record<number, string>>({});
  
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

  const selectPlan = (resultIndex: number, providerName: string, planName: string) => {
    setSelectedPlans(prev => ({ ...prev, [resultIndex]: `${providerName}-${planName}` }));
    toast({
      title: "חבילה נבחרה",
      description: `בחרת בחבילת ${planName} של ${providerName}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Beautiful Summary */}
      <div className="relative overflow-hidden rounded-3xl shadow-elegant">
        <div className="absolute inset-0 gradient-primary opacity-90"></div>
        <div className="absolute inset-0">
          <div className="absolute top-4 right-6 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-6 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        </div>
        <div className="relative p-8 text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-6 w-6 animate-pulse" />
            <h2 className="text-2xl font-black">סה&quot;כ חיסכון</h2>
            <Sparkles className="h-6 w-6 animate-pulse delay-500" />
          </div>
          <div className="text-4xl font-black mb-2">{formatCurrency(totalMonthlySavings)}</div>
          <p className="text-white/90 text-lg">בכל חודש</p>
          <div className="mt-4 p-3 bg-white/10 rounded-2xl backdrop-blur-sm inline-block">
            <p className="text-white/90 text-sm">חיסכון שנתי: <span className="font-bold text-xl">{formatCurrency(totalAnnualSavings)}</span></p>
          </div>
        </div>
      </div>

      {/* Beautiful Results Cards */}
      <div className="space-y-6">
        {results.map((result, index) => {
          const config = categoryConfig[result.category];
          const Icon = config.icon;
          const savingsPercentage = ((result.monthlySavings / result.currentAmount) * 100);
          const allProviders = getProvidersForCategory(result.category);
          const isExpanded = expandedPlans[index];
          
          return (
            <Card key={index} className="relative overflow-hidden shadow-card border-0 hover:shadow-elegant transition-all duration-300">
              {/* Background gradient based on category */}
              <div className={`absolute inset-0 opacity-5 ${
                result.category === 'electricity' ? 'gradient-sunset' :
                result.category === 'cellular' ? 'gradient-electric' :
                'gradient-vibrant'
              }`}></div>
              
              <div className="relative p-6">
                {/* Enhanced Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${config.bg} shadow-colorful`}>
                      <Icon className={`h-6 w-6 ${config.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{config.name}</h3>
                      <p className="text-muted-foreground">נוכחי: <span className="font-medium">{result.currentProvider}</span></p>
                    </div>
                  </div>
                  {result.monthlySavings > 0 && (
                    <div className="text-left">
                      <Badge variant="secondary" className="bg-success/20 text-success font-bold px-4 py-2 text-lg">
                        -{savingsPercentage.toFixed(0)}%
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">חיסכון חודשי</p>
                    </div>
                  )}
                </div>

                {/* Modern Comparison Cards */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-destructive/5 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
                    <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl p-4 border border-destructive/20">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-destructive" />
                        <span className="text-sm font-medium text-destructive">תשלום נוכחי</span>
                      </div>
                      <div className="text-2xl font-black text-destructive">₪{result.currentAmount.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">לחודש</p>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 bg-success/5 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
                    <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl p-4 border border-success/20">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium text-success">מומלץ - {result.recommendedPlan?.providerName}</span>
                      </div>
                      <div className="text-2xl font-black text-success">₪{result.recommendedPlan?.price.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">לחודש</p>
                      <span className="inline-block mt-2 px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                        {result.recommendedPlan?.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Plans Toggle */}
                <Button 
                  variant="outline" 
                  onClick={() => togglePlans(index)}
                  className="w-full mb-4 h-12 text-base font-medium hover:shadow-card"
                >
                  <Eye className="h-5 w-5 ml-2" />
                  {isExpanded ? 'הסתר' : 'הצג'} כל החבילות ({allProviders.reduce((sum, p) => sum + p.plans.length, 0)} אפשרויות)
                  {isExpanded ? <ChevronUp className="h-5 w-5 mr-2" /> : <ChevronDown className="h-5 w-5 mr-2" />}
                </Button>

                {/* Beautiful Plans Grid */}
                {isExpanded && (
                  <div className="mb-6">
                    <div className="grid gap-3 max-h-96 overflow-y-auto">
                      {allProviders.map(provider =>
                        provider.plans.map(plan => {
                          const savings = result.currentAmount - plan.price;
                          const savingsPercent = ((savings / result.currentAmount) * 100);
                          const isRecommended = plan.name === result.recommendedPlan?.name && provider.name === result.recommendedPlan?.providerName;
                          const isSelected = selectedPlans[index] === `${provider.name}-${plan.name}`;
                          
                          return (
                            <div 
                              key={`${provider.name}-${plan.name}`}
                              className={`group relative p-4 rounded-xl border transition-all cursor-pointer hover:shadow-card ${
                                isRecommended ? 'border-success bg-success/5 shadow-md' : 
                                isSelected ? 'border-primary bg-primary/5 shadow-md' :
                                'border-border hover:border-primary/50'
                              }`}
                              onClick={() => selectPlan(index, provider.name, plan.name)}
                            >
                              {isRecommended && (
                                <div className="absolute top-2 right-2">
                                  <Badge className="bg-success text-white">
                                    <Star className="h-3 w-3 ml-1" />
                                    מומלץ
                                  </Badge>
                                </div>
                              )}
                              
                              {isSelected && (
                                <div className="absolute top-2 left-2">
                                  <CheckCircle2 className="h-5 w-5 text-primary" />
                                </div>
                              )}
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                                <div>
                                  <p className="font-bold text-lg">{provider.name}</p>
                                  <p className="text-xs text-muted-foreground">ספק</p>
                                </div>
                                
                                <div>
                                  <p className="font-medium truncate">{plan.name}</p>
                                  <p className="text-xs text-muted-foreground">חבילה</p>
                                </div>
                                
                                <div className="text-center">
                                  <p className="text-xl font-black">₪{plan.price.toLocaleString()}</p>
                                  <p className="text-xs text-muted-foreground">לחודש</p>
                                </div>
                                
                                <div className="text-center">
                                  <p className={`text-lg font-bold ${savings > 0 ? 'text-success' : 'text-destructive'}`}>
                                    {savings > 0 ? `+₪${savings.toFixed(0)}` : `₪${Math.abs(savings).toFixed(0)}-`}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {savings !== 0 && `${savingsPercent > 0 ? '+' : ''}${savingsPercent.toFixed(0)}%`}
                                  </p>
                                </div>
                              </div>
                              
                              {plan.features && (
                                <div className="mt-3 pt-3 border-t border-border/50">
                                  <div className="flex flex-wrap gap-1">
                                    {plan.features.slice(0, 3).map((feature: string, idx: number) => (
                                      <span key={idx} className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded">
                                        {feature}
                                      </span>
                                    ))}
                                    {plan.features.length > 3 && (
                                      <span className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded">
                                        +{plan.features.length - 3} עוד
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* Enhanced Action Button */}
                <Button 
                  className="w-full h-14 text-lg font-bold gradient-primary text-white shadow-glow hover:shadow-elegant transition-all" 
                  onClick={() => setActiveSignatureDialog(index)}
                >
                  <Sparkles className="h-5 w-5 ml-2" />
                  עבור ל{result.recommendedPlan?.providerName} • חסוך {formatCurrency(result.monthlySavings)}/חודש
                  <Sparkles className="h-5 w-5 mr-2" />
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