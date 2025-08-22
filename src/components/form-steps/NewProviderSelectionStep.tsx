import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Star, 
  CheckCircle2, 
  TrendingDown, 
  Award,
  Phone,
  Globe,
  DollarSign,
  Calendar,
  Shield,
  Zap,
  Info
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getProvidersByCategory } from '@/data/providers';

interface NewProviderSelectionStepProps {
  category: 'electricity' | 'cellular' | 'internet';
  currentProviderData: any;
  data: any;
  onUpdate: (data: any) => void;
}

export const NewProviderSelectionStep = ({ 
  category, 
  currentProviderData, 
  data, 
  onUpdate 
}: NewProviderSelectionStepProps) => {
  const [selectedProvider, setSelectedProvider] = useState(data.selectedProvider || null);
  const [selectedPlan, setSelectedPlan] = useState(data.selectedPlan || null);
  const [customization, setCustomization] = useState(data.customization || {});
  const [additionalServices, setAdditionalServices] = useState(data.additionalServices || []);

  const providers = getProvidersByCategory(category);

  useEffect(() => {
    onUpdate({
      selectedProvider,
      selectedPlan,
      customization,
      additionalServices,
      estimatedSavings: calculateSavings()
    });
  }, [selectedProvider, selectedPlan, customization, additionalServices]);

  const calculateSavings = () => {
    if (!selectedPlan || !currentProviderData?.monthlyAmount) return 0;
    const currentAmount = parseFloat(currentProviderData.monthlyAmount);
    const newAmount = selectedPlan.price;
    return Math.max(0, currentAmount - newAmount);
  };

  const getProviderPlan = (providerId: string, planId: string) => {
    const provider = providers.find(p => p.id === providerId);
    return provider?.plans.find(p => p.id === planId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">בחירת ספק וחבילה חדשים</h3>
        <p className="text-muted-foreground">
          בחר את הספק והחבילה החדשים שברצונך לעבור אליהם
        </p>
      </div>

      {/* Current vs New Comparison */}
      {selectedPlan && currentProviderData?.monthlyAmount && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary-glow/5">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-muted-foreground">
                  {formatCurrency(parseFloat(currentProviderData.monthlyAmount))}
                </div>
                <div className="text-sm text-muted-foreground">מחיר נוכחי</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(selectedPlan.price)}
                </div>
                <div className="text-sm text-primary">מחיר חדש</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">
                  -{formatCurrency(calculateSavings())}
                </div>
                <div className="text-sm text-success">חיסכון חודשי</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Provider Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
            <Award className="h-5 w-5 text-primary" />
            <span>בחירת ספק</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedProvider?.id || ''} 
            onValueChange={(value) => {
              const provider = providers.find(p => p.id === value);
              setSelectedProvider(provider);
              setSelectedPlan(null); // Reset plan when provider changes
            }}
            className="space-y-4"
          >
            {providers.map((provider) => (
              <div key={provider.id}>
                <Label 
                  htmlFor={provider.id}
                  className="flex items-center space-x-4 rtl:space-x-reverse cursor-pointer p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <RadioGroupItem value={provider.id} id={provider.id} />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <h4 className="font-semibold text-lg">{provider.name}</h4>
                          {provider.plans.some(p => p.recommended) && (
                            <Badge className="bg-success">מומלץ</Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < Math.floor(provider.rating) 
                                    ? 'text-yellow-500 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                            <span>({provider.rating})</span>
                          </div>
                          
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Phone className="h-4 w-4 text-blue-500" />
                            <span>{provider.customerService}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Globe className="h-4 w-4 text-green-500" />
                            <span className="text-xs">{provider.website}</span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground text-sm">
                          {provider.description}
                        </p>
                      </div>
                      
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground">החל מ-</div>
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(Math.min(...provider.plans.map(p => p.price)))}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{category === 'electricity' ? 'קוט"ש' : 'חודש'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Plan Selection */}
      {selectedProvider && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <DollarSign className="h-5 w-5 text-primary" />
              <span>בחירת חבילה - {selectedProvider.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={selectedPlan?.id || ''} 
              onValueChange={(value) => {
                const plan = selectedProvider.plans.find(p => p.id === value);
                setSelectedPlan(plan);
              }}
              className="space-y-4"
            >
              {selectedProvider.plans.map((plan) => (
                <div key={plan.id}>
                  <Label 
                    htmlFor={plan.id}
                    className="flex items-start space-x-4 rtl:space-x-reverse cursor-pointer p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <h5 className="font-semibold">{plan.name}</h5>
                            {plan.recommended && (
                              <Badge className="bg-success text-xs">מומלץ ביותר</Badge>
                            )}
                            {plan.discount && (
                              <Badge className="bg-destructive text-xs">
                                הנחה {plan.discount.amount}%
                              </Badge>
                            )}
                          </div>
                          
                          {plan.description && (
                            <p className="text-sm text-muted-foreground">
                              {plan.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-left">
                          <div className="text-2xl font-bold text-primary">
                            {formatCurrency(plan.price)}
                          </div>
                          {plan.originalPrice && plan.originalPrice > plan.price && (
                            <div className="text-sm text-muted-foreground line-through">
                              {formatCurrency(plan.originalPrice)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <ul className="space-y-1 text-sm">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center space-x-2 rtl:space-x-reverse">
                              <CheckCircle2 className="h-3 w-3 text-success" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        {plan.limitations && plan.limitations.length > 0 && (
                          <ul className="space-y-1 text-sm">
                            {plan.limitations.map((limitation, i) => (
                              <li key={i} className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
                                <Info className="h-3 w-3" />
                                <span>{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Plan Customization */}
      {selectedPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Zap className="h-5 w-5 text-primary" />
              <span>התאמה אישית</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="connectionDate">תאריך חיבור רצוי</Label>
                <Input
                  id="connectionDate"
                  type="date"
                  value={customization.connectionDate || ''}
                  onChange={(e) => setCustomization(prev => ({
                    ...prev,
                    connectionDate: e.target.value
                  }))}
                />
              </div>
              
              <div>
                <Label htmlFor="installationTime">זמן התקנה מועדף</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={customization.installationTime || ''}
                  onChange={(e) => setCustomization(prev => ({
                    ...prev,
                    installationTime: e.target.value
                  }))}
                >
                  <option value="">בחר זמן</option>
                  <option value="morning">בוקר (8:00-12:00)</option>
                  <option value="afternoon">צהריים (12:00-17:00)</option>
                  <option value="evening">ערב (17:00-20:00)</option>
                  <option value="flexible">גמיש</option>
                </select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="specialRequests">בקשות מיוחדות</Label>
              <Textarea
                id="specialRequests"
                placeholder="תאר בקשות מיוחדות או הוראות התקנה"
                value={customization.specialRequests || ''}
                onChange={(e) => setCustomization(prev => ({
                  ...prev,
                  specialRequests: e.target.value
                }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Services */}
      {selectedPlan && selectedProvider.additionalServices && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Shield className="h-5 w-5 text-primary" />
              <span>שירותים נוספים</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedProvider.additionalServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Checkbox
                      id={service.id}
                      checked={additionalServices.includes(service.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAdditionalServices(prev => [...prev, service.id]);
                        } else {
                          setAdditionalServices(prev => prev.filter(id => id !== service.id));
                        }
                      }}
                    />
                    <Label htmlFor={service.id} className="font-medium cursor-pointer">
                      {service.name}
                    </Label>
                  </div>
                  <div className="text-sm font-semibold text-primary">
                    +{formatCurrency(service.price)}/חודש
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {selectedPlan && (
        <Card className="border-success/20 bg-gradient-to-r from-success/5 to-green-50 dark:to-green-900/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
              <div>
                <h4 className="font-semibold text-lg mb-2">בחירה הושלמה!</h4>
                <p className="text-muted-foreground">
                  נבחרו: {selectedProvider.name} - {selectedPlan.name}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-background rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(selectedPlan.price)}
                  </div>
                  <div className="text-sm text-muted-foreground">מחיר חודשי</div>
                </div>
                <div className="p-3 bg-background rounded-lg">
                  <div className="text-2xl font-bold text-success">
                    -{formatCurrency(calculateSavings())}
                  </div>
                  <div className="text-sm text-muted-foreground">חיסכון חודשי</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};