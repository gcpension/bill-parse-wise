import { useState } from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Building, CreditCard, FileText } from 'lucide-react';
import { CurrentServiceDetails } from '@/types/wizard';

export const CurrentServiceStep = () => {
  const { state, updateCurrentService } = useWizard();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const currentService = state.currentService;

  const handleInputChange = (field: keyof CurrentServiceDetails, value: string) => {
    updateCurrentService({ [field]: value });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (field: 'lastBill', file: File | undefined) => {
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [field]: 'רק קבצי PDF, JPG או PNG מותרים' }));
        return;
      }
      
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, [field]: 'גודל הקובץ לא יכול לעלות על 10MB' }));
        return;
      }
    }
    
    updateCurrentService({ [field]: file });
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            פרטי השירות הנוכחי
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Service Type and Provider */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceType">סוג השירות *</Label>
              <Select 
                value={currentService.serviceType || ''} 
                onValueChange={(value) => handleInputChange('serviceType', value as any)}
              >
                <SelectTrigger className={errors.serviceType ? 'border-destructive' : ''}>
                  <SelectValue placeholder="בחר סוג שירות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electricity">חשמל</SelectItem>
                  <SelectItem value="internet">אינטרנט</SelectItem>
                  <SelectItem value="cellular">סלולר</SelectItem>
                  <SelectItem value="insurance">ביטוח</SelectItem>
                </SelectContent>
              </Select>
              {errors.serviceType && (
                <p className="text-destructive text-sm">{errors.serviceType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="providerName">שם החברה הנוכחית *</Label>
              <Input
                id="providerName"
                value={currentService.providerName || ''}
                onChange={(e) => handleInputChange('providerName', e.target.value)}
                placeholder="למשל: חברת החשמל, בזק, פרטנר..."
                className={errors.providerName ? 'border-destructive' : ''}
              />
              {errors.providerName && (
                <p className="text-destructive text-sm">{errors.providerName}</p>
              )}
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerNumber">מספר לקוח / מנוי *</Label>
              <Input
                id="customerNumber"
                value={currentService.customerNumber || ''}
                onChange={(e) => handleInputChange('customerNumber', e.target.value)}
                placeholder="כפי שמופיע בחשבונית"
                className={errors.customerNumber ? 'border-destructive' : ''}
              />
              {errors.customerNumber && (
                <p className="text-destructive text-sm">{errors.customerNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPlan">מסלול / תכנית נוכחיים *</Label>
              <Input
                id="currentPlan"
                value={currentService.currentPlan || ''}
                onChange={(e) => handleInputChange('currentPlan', e.target.value)}
                placeholder="שם המסלול כפי שמופיע בחשבונית"
                className={errors.currentPlan ? 'border-destructive' : ''}
              />
              {errors.currentPlan && (
                <p className="text-destructive text-sm">{errors.currentPlan}</p>
              )}
            </div>
          </div>

          {/* Contract Commitment */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contractCommitment">התחייבות חוזית (אם קיימת)</Label>
              <Select 
                value={currentService.contractCommitment || ''} 
                onValueChange={(value) => handleInputChange('contractCommitment', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג התחייבות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">ללא התחייבות</SelectItem>
                  <SelectItem value="6months">6 חודשים</SelectItem>
                  <SelectItem value="12months">12 חודשים</SelectItem>
                  <SelectItem value="24months">24 חודשים</SelectItem>
                  <SelectItem value="36months">36 חודשים</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {currentService.contractCommitment && currentService.contractCommitment !== 'none' && (
              <div className="space-y-2">
                <Label htmlFor="commitmentEndDate">תאריך סיום התחייבות</Label>
                <Input
                  id="commitmentEndDate"
                  type="date"
                  value={currentService.commitmentEndDate || ''}
                  onChange={(e) => handleInputChange('commitmentEndDate', e.target.value)}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bill Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            העלאת חשבונית אחרונה
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Upload className="h-4 w-4" />
            <AlertDescription>
              העלאת החשבונית האחרונה תאפשר לנו לאמת את הפרטים ולחשב בדיוק את החיסכון
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="lastBill">חשבונית אחרונה (PDF או תמונה)</Label>
            <Input
              id="lastBill"
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => handleFileUpload('lastBill', e.target.files?.[0])}
              className={errors.lastBill ? 'border-destructive' : ''}
            />
            {errors.lastBill && (
              <p className="text-destructive text-sm">{errors.lastBill}</p>
            )}
            {currentService.lastBill && (
              <p className="text-success text-sm">✓ חשבונית הועלתה בהצלחה</p>
            )}
            <p className="text-muted-foreground text-sm">
              קבצים מותרים: PDF, JPG, PNG (עד 10MB)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};