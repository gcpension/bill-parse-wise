import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  User, 
  Phone,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { allProviders } from '@/data/providers';

interface CurrentProviderStepProps {
  category: 'electricity' | 'cellular' | 'internet';
  data: any;
  onUpdate: (data: any) => void;
}

export const CurrentProviderStep = ({ category, data, onUpdate }: CurrentProviderStepProps) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: data
  });

  const watchedValues = watch();

  useEffect(() => {
    onUpdate(watchedValues);
  }, [watchedValues, onUpdate]);

  const providers = allProviders.filter(p => p.category === category);

  const categoryLabels = {
    electricity: {
      accountLabel: 'מספר לקוח חשמל',
      billLabel: 'חשבון חשמל אחרון',
      amountLabel: 'סכום החשבון (₪)',
      consumptionLabel: 'צריכה חודשית (קוט"ש)'
    },
    cellular: {
      accountLabel: 'מספר טלפון',
      billLabel: 'חשבון סלולר אחרון', 
      amountLabel: 'סכום החשבון (₪)',
      consumptionLabel: 'נפח גלישה חודשי (GB)'
    },
    internet: {
      accountLabel: 'מספר לקוח אינטרנט',
      billLabel: 'חשבון אינטרנט אחרון',
      amountLabel: 'סכום החשבון (₪)',
      consumptionLabel: 'מהירות נוכחית (Mbps)'
    }
  };

  const labels = categoryLabels[category];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">פרטי הספק הנוכחי</h3>
        <p className="text-muted-foreground">
          מלא את הפרטים על השירות הנוכחי שלך כדי שנוכל לבצע את המעבר
        </p>
      </div>

      <form className="space-y-6">
        {/* Current Provider */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <User className="h-5 w-5 text-primary" />
              <span>הספק הנוכחי</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentProvider">ספק נוכחי</Label>
                <Select 
                  value={watchedValues.currentProvider || ''} 
                  onValueChange={(value) => setValue('currentProvider', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר ספק" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map(provider => (
                      <SelectItem key={provider.id} value={provider.name}>
                        {provider.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">אחר</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="accountNumber">{labels.accountLabel}</Label>
                <Input
                  id="accountNumber"
                  {...register('accountNumber', { 
                    required: `${labels.accountLabel} נדרש` 
                  })}
                  placeholder={`הכנס ${labels.accountLabel.toLowerCase()}`}
                />
                {errors.accountNumber && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.accountNumber.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contractStartDate">תאריך התחלת החוזה</Label>
                <Input
                  id="contractStartDate"
                  type="date"
                  {...register('contractStartDate')}
                />
              </div>

              <div>
                <Label htmlFor="contractEndDate">תאריך סיום החוזה</Label>
                <Input
                  id="contractEndDate"
                  type="date"
                  {...register('contractEndDate')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Plan Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <FileText className="h-5 w-5 text-primary" />
              <span>פרטי החבילה הנוכחית</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currentPlan">שם החבילה</Label>
                <Input
                  id="currentPlan"
                  {...register('currentPlan')}
                  placeholder="שם החבילה הנוכחית"
                />
              </div>

              <div>
                <Label htmlFor="monthlyAmount">{labels.amountLabel}</Label>
                <Input
                  id="monthlyAmount"
                  type="number"
                  {...register('monthlyAmount', { 
                    required: 'סכום חודשי נדרש',
                    min: { value: 0, message: 'סכום חייב להיות חיובי' }
                  })}
                  placeholder="0"
                />
                {errors.monthlyAmount && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.monthlyAmount.message as string}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="consumption">{labels.consumptionLabel}</Label>
                <Input
                  id="consumption"
                  type="number"
                  {...register('consumption')}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="additionalServices">שירותים נוספים</Label>
              <Textarea
                id="additionalServices"
                {...register('additionalServices')}
                placeholder="תאר שירותים נוספים שיש לך (אופציונלי)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Recent Bills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <DollarSign className="h-5 w-5 text-primary" />
              <span>חשבוניות אחרונות</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              העלה את 3 החשבוניות האחרונות לניתוח מדויק יותר
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((billNum) => (
                <div key={billNum} className="space-y-2">
                  <Label>חשבונית {billNum}</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      גרור קובץ או לחץ להעלאה
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG עד 10MB
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Input
                      type="date"
                      placeholder="תאריך חשבונית"
                      {...register(`bill${billNum}Date`)}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="סכום"
                      {...register(`bill${billNum}Amount`)}
                      className="text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cancellation Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Calendar className="h-5 w-5 text-primary" />
              <span>תנאי ביטול</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cancellationPeriod">תקופת הודעה מוקדמת</Label>
                <Select 
                  value={watchedValues.cancellationPeriod || ''} 
                  onValueChange={(value) => setValue('cancellationPeriod', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר תקופה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">מיידי</SelectItem>
                    <SelectItem value="30days">30 יום</SelectItem>
                    <SelectItem value="60days">60 יום</SelectItem>
                    <SelectItem value="90days">90 יום</SelectItem>
                    <SelectItem value="unknown">לא יודע</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cancellationFee">דמי ביטול (₪)</Label>
                <Input
                  id="cancellationFee"
                  type="number"
                  {...register('cancellationFee')}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="specialTerms">תנאים מיוחדים</Label>
              <Textarea
                id="specialTerms"
                {...register('specialTerms')}
                placeholder="תאר תנאים מיוחדים בחוזה הנוכחי (אופציונלי)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Phone className="h-5 w-5 text-primary" />
              <span>העדפות יצירת קשר</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredContactMethod">אמצעי קשר מועדף</Label>
                <Select 
                  value={watchedValues.preferredContactMethod || ''} 
                  onValueChange={(value) => setValue('preferredContactMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר אמצעי קשר" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">טלפון</SelectItem>
                    <SelectItem value="email">אימייל</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="preferredContactTime">שעות קשר מועדפות</Label>
                <Select 
                  value={watchedValues.preferredContactTime || ''} 
                  onValueChange={(value) => setValue('preferredContactTime', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר זמן" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">בוקר (8:00-12:00)</SelectItem>
                    <SelectItem value="afternoon">צהריים (12:00-17:00)</SelectItem>
                    <SelectItem value="evening">ערב (17:00-21:00)</SelectItem>
                    <SelectItem value="anytime">בכל זמן</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="specialInstructions">הוראות מיוחדות</Label>
              <Textarea
                id="specialInstructions"
                {...register('specialInstructions')}
                placeholder="הוראות מיוחדות לתהליך המעבר (אופציונלי)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Completion Status */}
        {watchedValues.currentProvider && watchedValues.accountNumber && watchedValues.monthlyAmount && (
          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse p-4 bg-success/10 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <span className="text-success font-medium">
              פרטי הספק הנוכחי הושלמו בהצלחה
            </span>
          </div>
        )}
      </form>
    </div>
  );
};