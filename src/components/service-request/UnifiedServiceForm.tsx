import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, Loader2, Info } from 'lucide-react';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface UnifiedServiceFormProps {
  initialData?: Partial<ServiceRequestFormData>;
  onComplete?: () => void;
}

const providerOptions = [
  'בזק', 'פרטנר/אורנג׳', 'סלקום', 'HOT', 'גולן טלקום', 
  'רמי לוי', 'פלאפון', 'חברת החשמל', 'נקטיק אנרגיה', 'יס', 'אחר'
];

export default function UnifiedServiceForm({ initialData, onComplete }: UnifiedServiceFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ServiceRequestFormData>>({
    customer_type: 'private',
    preferred_language: 'he',
    ...initialData
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-service-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to submit');

      toast({
        title: 'הבקשה נשלחה בהצלחה!',
        description: 'תקבל SMS עם קישור לחתימה דיגיטלית'
      });

      if (onComplete) onComplete();
    } catch (error) {
      toast({
        title: 'שגיאה בשליחה',
        description: 'אנא נסה שנית',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isBusinessCustomer = formData.customer_type === 'business';
  const [disclaimerExpanded, setDisclaimerExpanded] = useState(false);

  return (
    <form onSubmit={handleSubmit} className="space-y-5 font-heebo">
      {/* Customer Type */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => updateField('customer_type', 'private')}
          className={cn(
            "px-5 py-3 rounded-lg border-2 transition-all text-sm font-medium",
            formData.customer_type === 'private'
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-border hover:border-primary/50 hover:bg-accent"
          )}
        >
          לקוח פרטי
        </button>
        <button
          type="button"
          onClick={() => updateField('customer_type', 'business')}
          className={cn(
            "px-5 py-3 rounded-lg border-2 transition-all text-sm font-medium",
            formData.customer_type === 'business'
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-border hover:border-primary/50 hover:bg-accent"
          )}
        >
          לקוח עסקי
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-foreground mb-1.5 block">שם מלא *</Label>
            <Input
              value={formData.full_name || ''}
              onChange={(e) => updateField('full_name', e.target.value)}
              className="h-10"
              placeholder="שם פרטי ומשפחה"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-1.5 block">תעודת זהות / ח.פ *</Label>
            <Input
              value={formData.national_id_or_corp || ''}
              onChange={(e) => updateField('national_id_or_corp', e.target.value)}
              className="h-10"
              placeholder="9 ספרות"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-1.5 block">דוא״ל *</Label>
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              className="h-10"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-1.5 block">טלפון נייד *</Label>
            <Input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              className="h-10"
              placeholder="05X-XXXXXXX"
              required
            />
          </div>
        </div>

        {/* Provider & Address */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-foreground mb-1.5 block">ספק נוכחי *</Label>
            <Select value={formData.current_provider} onValueChange={(v) => updateField('current_provider', v)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="בחר ספק" />
              </SelectTrigger>
              <SelectContent>
                {providerOptions.map(provider => (
                  <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-1.5 block">עיר *</Label>
            <Input
              value={formData.service_address?.city || ''}
              onChange={(e) => updateField('service_address', { ...formData.service_address, city: e.target.value })}
              className="h-10"
              placeholder="תל אביב"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-1.5 block">רחוב *</Label>
            <Input
              value={formData.service_address?.street || ''}
              onChange={(e) => updateField('service_address', { ...formData.service_address, street: e.target.value })}
              className="h-10"
              placeholder="דיזנגוף"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium text-foreground mb-1.5 block">מספר *</Label>
              <Input
                value={formData.service_address?.number || ''}
                onChange={(e) => updateField('service_address', { ...formData.service_address, number: e.target.value, city: formData.service_address?.city || '', street: formData.service_address?.street || '', zip: formData.service_address?.zip || '' })}
                className="h-10"
                placeholder="50"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground mb-1.5 block">מיקוד</Label>
              <Input
                value={formData.service_address?.zip || ''}
                onChange={(e) => updateField('service_address', { ...formData.service_address, zip: e.target.value, city: formData.service_address?.city || '', street: formData.service_address?.street || '', number: formData.service_address?.number || '' })}
                className="h-10"
                placeholder="6100001"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Business Fields */}
      {isBusinessCustomer && (
        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
          <div>
            <Label className="text-sm font-medium text-foreground mb-1.5 block">שם החברה *</Label>
            <Input
              value={formData.company_name || ''}
              onChange={(e) => updateField('company_name', e.target.value)}
              className="h-10"
              placeholder="שם החברה המלא"
              required={isBusinessCustomer}
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-foreground mb-1.5 block">ח.פ / ע.מ *</Label>
            <Input
              value={formData.corp_registration_number || ''}
              onChange={(e) => updateField('corp_registration_number', e.target.value)}
              className="h-10"
              placeholder="9 ספרות"
              required={isBusinessCustomer}
            />
          </div>
        </div>
      )}

      {/* Declarations */}
      <div className="space-y-4 pt-5 border-t border-border">
        <Collapsible open={disclaimerExpanded} onOpenChange={setDisclaimerExpanded}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors mb-3">
            <Info className="w-4 h-4" />
            הצהרות והסכמות חשובות
            <span className="text-xs text-muted-foreground mr-auto">
              {disclaimerExpanded ? '(לחץ לסגירה)' : '(לחץ להרחבה)'}
            </span>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 bg-accent/30 p-4 rounded-lg border border-border">
            {/* Power of Attorney */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="poa"
                  checked={formData.poa || false}
                  onCheckedChange={(checked) => updateField('poa', checked)}
                  className="mt-1"
                />
                <label htmlFor="poa" className="text-sm font-medium text-foreground cursor-pointer flex-1">
                  אני בעל הנכס / מורשה לחתום על הסכם זה
                </label>
              </div>
              <p className="text-xs text-muted-foreground mr-7 leading-relaxed">
                אני מצהיר/ה כי אני בעל/ת הנכס או בעל/ת ייפוי כוח חוקי לחתום על הסכם זה ולבצע את המעבר בין הספקים. אני מבין/ה שמסירת מידע כוזב עלולה לגרום לביטול הבקשה ולחשיפה לתביעות משפטיות.
              </p>
            </div>

            {/* Privacy & Terms */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="privacy"
                  checked={formData.privacy_tos || false}
                  onCheckedChange={(checked) => updateField('privacy_tos', checked)}
                  className="mt-1"
                />
                <label htmlFor="privacy" className="text-sm font-medium text-foreground cursor-pointer flex-1">
                  אני מאשר את תנאי השימוש והפרטיות
                </label>
              </div>
              <p className="text-xs text-muted-foreground mr-7 leading-relaxed">
                אני מאשר/ת שקראתי והבנתי את תנאי השימוש ומדיניות הפרטיות של השירות. אני מסכים/ה לשיתוף המידע האישי שלי עם הספק החדש לצורך השלמת תהליך המעבר, וכן מסכים/ה לקבל עדכונים על סטטוס הבקשה באמצעות SMS ואימייל.
              </p>
            </div>

            {/* Accuracy Acknowledgment */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="fees"
                  checked={formData.fees_ack || false}
                  onCheckedChange={(checked) => updateField('fees_ack', checked)}
                  className="mt-1"
                />
                <label htmlFor="fees" className="text-sm font-medium text-foreground cursor-pointer flex-1">
                  המידע שמסרתי מדויק ונכון
                </label>
              </div>
              <p className="text-xs text-muted-foreground mr-7 leading-relaxed">
                אני מצהיר/ה כי כל המידע שמסרתי בטופס זה - לרבות פרטים אישיים, כתובת, פרטי ספק נוכחי ופרטי חיוב - הינו מדויק, נכון ועדכני. אני מודע/ת שמסירת מידע שגוי עלולה לגרום לעיכובים בתהליך, לדחיית הבקשה, או לחיובים כספיים לא רצויים.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Quick checkboxes when collapsed */}
        {!disclaimerExpanded && (
          <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Checkbox
                id="poa-quick"
                checked={formData.poa || false}
                onCheckedChange={(checked) => updateField('poa', checked)}
              />
              <label htmlFor="poa-quick" className="text-sm text-foreground cursor-pointer">
                אני בעל הנכס / מורשה לחתום
              </label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="privacy-quick"
                checked={formData.privacy_tos || false}
                onCheckedChange={(checked) => updateField('privacy_tos', checked)}
              />
              <label htmlFor="privacy-quick" className="text-sm text-foreground cursor-pointer">
                אני מאשר תנאי שימוש ופרטיות
              </label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="fees-quick"
                checked={formData.fees_ack || false}
                onCheckedChange={(checked) => updateField('fees_ack', checked)}
              />
              <label htmlFor="fees-quick" className="text-sm text-foreground cursor-pointer">
                המידע שמסרתי מדויק ונכון
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-5">
        <Button
          type="submit"
          disabled={isLoading || !formData.poa || !formData.privacy_tos || !formData.fees_ack}
          className="w-full h-12 text-base font-medium"
          variant={isLoading || !formData.poa || !formData.privacy_tos || !formData.fees_ack ? "outline" : "default"}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              שולח בקשה...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              שלח בקשה לחתימה דיגיטלית
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
