import { useState } from 'react';
import { Star, Phone, Globe, CheckCircle2, ArrowRight, Award, TrendingDown, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ProviderComparisonCardProps {
  provider: any;
  selectedCategory: 'electricity' | 'cellular' | 'internet';
  index: number;
  onSwitchProvider: (provider: any, plan: any) => void;
  onContact: (provider: any) => void;
}

export const ProviderComparisonCard = ({
  provider,
  selectedCategory,
  index,
  onSwitchProvider,
  onContact
}: ProviderComparisonCardProps) => {
  const [showAllPlans, setShowAllPlans] = useState(false);
  const { toast } = useToast();

  const bestPlan = provider.plans.find((plan: any) => plan.recommended) || provider.plans[0];
  const lowestPrice = Math.min(...provider.plans.map((plan: any) => plan.price));
  
  const handlePlanSelect = (plan: any) => {
    onSwitchProvider(provider, plan);
    toast({
      title: "בחירה מצוינת! 🎉",
      description: `נבחר ${plan.name} מ${provider.name}`,
    });
  };

  return (
    <Card 
      className="group relative overflow-hidden shadow-card hover:shadow-elegant transition-all duration-500 animate-slide-up border-l-4 border-l-primary/20 hover:border-l-primary"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            {/* Provider Name & Badges */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="relative">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary-glow transition-all duration-300">
                  {provider.name}
                </h3>
                <div className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-primary-glow group-hover:w-full transition-all duration-500" />
              </div>
              
              {bestPlan.recommended && (
                <Badge className="bg-gradient-to-r from-success to-green-500 text-white shadow-md animate-pulse border-0">
                  <Award className="ml-1 h-3 w-3" />
                  מומלץ ביותר
                </Badge>
              )}
              
              {bestPlan.discount && (
                <Badge className="bg-gradient-to-r from-destructive to-red-500 text-white shadow-md border-0">
                  <TrendingDown className="ml-1 h-3 w-3" />
                  מבצע חם
                </Badge>
              )}
            </div>
            
            {/* Provider Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center space-x-1 rtl:space-x-reverse bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 transition-colors duration-200 ${
                      i < Math.floor(provider.rating) 
                        ? 'text-amber-500 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
                <span className="font-semibold text-amber-700 dark:text-amber-300">({provider.rating})</span>
              </div>
              
              <div className="flex items-center space-x-1 rtl:space-x-reverse bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">{provider.customerService}</span>
              </div>
              
              <div className="flex items-center space-x-1 rtl:space-x-reverse bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-200 dark:border-green-800">
                <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-green-700 dark:text-green-300 font-medium text-xs">{provider.website}</span>
              </div>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              {provider.description}
            </p>
          </div>
          
          {/* Pricing */}
          <div className="text-left relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 p-3">
              <div className="text-sm text-muted-foreground font-medium">החל מ-</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent group-hover:from-green-600 group-hover:to-green-400 transition-all duration-300">
                {formatCurrency(lowestPrice)}
                <span className="text-base font-normal text-muted-foreground">
                  /{selectedCategory === 'electricity' ? 'קוט"ש' : 'חודש'}
                </span>
              </div>
              {bestPlan.originalPrice && bestPlan.originalPrice > bestPlan.price && (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="text-sm text-muted-foreground line-through">
                    {formatCurrency(bestPlan.originalPrice)}
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    חסכון {Math.round(((bestPlan.originalPrice - bestPlan.price) / bestPlan.originalPrice) * 100)}%
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        {/* Best Plan Highlight */}
        <div className="p-5 rounded-xl border-2 border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-primary-glow/10 shadow-lg">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-bold text-lg">{bestPlan.name}</h4>
              {bestPlan.discount && (
                <Badge variant="outline" className="mt-1">
                  הנחה {bestPlan.discount.amount}%
                </Badge>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-primary">
                {formatCurrency(bestPlan.price)}
              </div>
              {bestPlan.originalPrice && (
                <div className="text-sm text-muted-foreground line-through">
                  {formatCurrency(bestPlan.originalPrice)}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <ul className="space-y-1 text-sm">
              {bestPlan.features.slice(0, 3).map((feature: string, i: number) => (
                <li key={i} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="text-sm">
              <div className="text-muted-foreground mb-1">קהל יעד:</div>
              <div className="font-medium">{bestPlan.targetAudience}</div>
            </div>
          </div>
          
          <Button 
            className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-lg hover:shadow-primary/30 transform hover:scale-105 transition-all duration-300"
            onClick={() => handlePlanSelect(bestPlan)}
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            בחר את החבילה הזו
          </Button>
        </div>

        {/* All Plans Toggle */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => setShowAllPlans(!showAllPlans)}
            className="w-full justify-between"
          >
            <span>הצג את כל החבילות ({provider.plans.length})</span>
            {showAllPlans ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {showAllPlans && (
            <div className="grid gap-4">
              {provider.plans.filter((plan: any) => plan.id !== bestPlan.id).map((plan: any) => (
                <div 
                  key={plan.id} 
                  className="p-4 rounded-xl border transition-all duration-300 hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-semibold">{plan.name}</h5>
                      <p className="text-sm text-muted-foreground">{plan.targetAudience}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">
                        {formatCurrency(plan.price)}
                      </div>
                      {plan.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          {formatCurrency(plan.originalPrice)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <ul className="space-y-1 text-sm mb-3">
                    {plan.features.slice(0, 3).map((feature: string, i: number) => (
                      <li key={i} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <CheckCircle2 className="h-3 w-3 text-success" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => handlePlanSelect(plan)}
                  >
                    בחר חבילה זו
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Actions */}
        <div className="flex gap-3 pt-6 border-t">
          <Button 
            variant="outline" 
            className="flex-1 border-2 hover:border-primary hover:bg-primary/5 transform hover:scale-105 transition-all duration-300"
            onClick={() => onContact(provider)}
          >
            <Phone className="ml-2 h-4 w-4" />
            צור קשר
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-2 hover:border-primary hover:bg-primary/5 transform hover:scale-105 transition-all duration-300"
          >
            <Shield className="ml-2 h-4 w-4" />
            פרטים נוספים
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};