import { useState, useEffect } from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Star, Zap, TrendingDown, Calendar } from 'lucide-react';
import { getProvidersByCategory } from '@/data/providers';

export const ServiceSelectionStep = () => {
  const { state, updateNewService } = useWizard();
  const [availableProviders, setAvailableProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const newService = state.newService;
  const currentService = state.currentService;

  useEffect(() => {
    if (currentService.serviceType && currentService.serviceType !== 'insurance') {
      const providers = getProvidersByCategory(currentService.serviceType as 'electricity' | 'internet' | 'cellular');
      setAvailableProviders(providers);
    }
  }, [currentService.serviceType]);

  useEffect(() => {
    if (newService.newProvider) {
      const provider = availableProviders.find(p => p.name === newService.newProvider);
      setSelectedProvider(provider);
      setAvailablePlans(provider?.plans || []);
    }
  }, [newService.newProvider, availableProviders]);

  const handleProviderChange = (providerName: string) => {
    updateNewService({ newProvider: providerName, newPlan: '' });
  };

  const handlePlanChange = (planName: string) => {
    updateNewService({ newPlan: planName });
  };

  const handleSwitchDateChange = (switchDate: string) => {
    updateNewService({ switchDate: switchDate as any });
  };

  const handleCustomDateChange = (date: string) => {
    updateNewService({ customSwitchDate: date });
  };

  const getServiceTypeIcon = (type: string) => {
    return <Zap className="h-5 w-5" />; // Simplified for now
  };

  const selectedPlan = availablePlans.find(p => p.name === newService.newPlan);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getServiceTypeIcon(currentService.serviceType || '')}
            בחירת ספק חדש - {currentService.serviceType === 'electricity' ? 'חשמל' : 
                                currentService.serviceType === 'internet' ? 'אינטרנט' : 
                                currentService.serviceType === 'cellular' ? 'סלולר' : 'ביטוח'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label htmlFor="newProvider">ספק חדש *</Label>
            <Select value={newService.newProvider || ''} onValueChange={handleProviderChange}>
              <SelectTrigger>
                <SelectValue placeholder="בחר ספק חדש" />
              </SelectTrigger>
              <SelectContent>
                {availableProviders.map((provider) => (
                  <SelectItem key={provider.id} value={provider.name}>
                    <div className="flex items-center gap-2">
                      <span>{provider.name}</span>
                      {provider.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-golden-yellow text-golden-yellow" />
                          <span className="text-xs">{provider.rating}</span>
                        </div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Provider Info */}
          {selectedProvider && (
            <Card className="bg-muted/30">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{selectedProvider.name}</h4>
                    {selectedProvider.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-golden-yellow text-golden-yellow" />
                        <span className="text-sm">{selectedProvider.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedProvider.description}</p>
                  <div className="text-xs text-muted-foreground">
                    שירות לקוחות: {selectedProvider.customerService} • אתר: {selectedProvider.website}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Plan Selection */}
          {availablePlans.length > 0 && (
            <div className="space-y-4">
              <Label>בחר מסלול *</Label>
              <div className="grid gap-4">
                {availablePlans.slice(0, 3).map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      newService.newPlan === plan.name ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handlePlanChange(plan.name)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{plan.name}</h4>
                            {plan.recommended && (
                              <Badge className="bg-success text-success-foreground">מומלץ</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{plan.detailedDescription}</p>
                          <div className="text-xs text-muted-foreground">
                            {plan.features?.slice(0, 3).join(' • ')}
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-2xl font-bold text-primary">
                            ₪{plan.price}
                          </div>
                          <div className="text-sm text-muted-foreground">לחודש</div>
                          {plan.originalPrice && plan.originalPrice > plan.price && (
                            <div className="flex items-center gap-1 text-success text-sm">
                              <TrendingDown className="h-3 w-3" />
                              חסכון ₪{plan.originalPrice - plan.price}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {availablePlans.length > 3 && (
                <div className="text-center">
                  <Button variant="outline" size="sm">
                    הצג עוד מסלולים ({availablePlans.length - 3})
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Selected Plan Details */}
          {selectedPlan && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">מסלול נבחר: {selectedPlan.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">מחיר חודשי</div>
                    <div className="text-xl font-bold">₪{selectedPlan.price}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">חיסכון משוער</div>
                    <div className="text-xl font-bold text-success">
                      ₪{Math.max(0, (state.currentService.currentPlan ? 150 : 100) - selectedPlan.price)}
                    </div>
                  </div>
                </div>
                
                {selectedPlan.features && (
                  <div>
                    <div className="text-sm font-medium mb-2">מה כלול במסלול:</div>
                    <div className="text-sm space-y-1">
                      {selectedPlan.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 bg-success rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Switch Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            מועד רצוי למעבר
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={newService.switchDate || ''}
            onValueChange={handleSwitchDateChange}
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="immediate" id="immediate" />
              <Label htmlFor="immediate">מעבר מיידי (תוך 7-14 ימי עסקים)</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="end_of_billing" id="end_of_billing" />
              <Label htmlFor="end_of_billing">בסיום מחזור החיוב הנוכחי</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="end_of_commitment" id="end_of_commitment" />
              <Label htmlFor="end_of_commitment">בתום תקופת ההתחייבות</Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom">תאריך מותאם אישית</Label>
            </div>
          </RadioGroup>

          {newService.switchDate === 'custom' && (
            <div className="space-y-2 mr-6">
              <Label htmlFor="customDate">תאריך מעבר מועדף</Label>
              <Input
                id="customDate"
                type="date"
                value={newService.customSwitchDate || ''}
                onChange={(e) => handleCustomDateChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};