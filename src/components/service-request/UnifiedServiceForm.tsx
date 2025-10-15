import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, Loader2 } from 'lucide-react';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-heebo">
      {/* Customer Type */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          type="button"
          onClick={() => updateField('customer_type', 'private')}
          className={cn(
            "px-4 py-2 rounded-lg border-2 transition-all text-sm font-normal",
            formData.customer_type === 'private'
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          לקוח פרטי
        </button>
        <button
          type="button"
          onClick={() => updateField('customer_type', 'business')}
          className={cn(
            "px-4 py-2 rounded-lg border-2 transition-all text-sm font-normal",
            formData.customer_type === 'business'
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          לקוח עסקי
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* Personal Details */}
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-normal text-gray-700">שם מלא *</Label>
            <Input
              value={formData.full_name || ''}
              onChange={(e) => updateField('full_name', e.target.value)}
              className="h-9 text-sm"
              required
            />
          </div>

          <div>
            <Label className="text-xs font-normal text-gray-700">תעודת זהות / ח.פ *</Label>
            <Input
              value={formData.national_id_or_corp || ''}
              onChange={(e) => updateField('national_id_or_corp', e.target.value)}
              className="h-9 text-sm"
              required
            />
          </div>

          <div>
            <Label className="text-xs font-normal text-gray-700">דוא״ל *</Label>
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              className="h-9 text-sm"
              required
            />
          </div>

          <div>
            <Label className="text-xs font-normal text-gray-700">טלפון נייד *</Label>
            <Input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              className="h-9 text-sm"
              required
            />
          </div>
        </div>

        {/* Provider & Address */}
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-normal text-gray-700">ספק נוכחי *</Label>
            <Select value={formData.current_provider} onValueChange={(v) => updateField('current_provider', v)}>
              <SelectTrigger className="h-9 text-sm">
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
            <Label className="text-xs font-normal text-gray-700">עיר *</Label>
            <Input
              value={formData.service_address?.city || ''}
              onChange={(e) => updateField('service_address', { ...formData.service_address, city: e.target.value })}
              className="h-9 text-sm"
              required
            />
          </div>

          <div>
            <Label className="text-xs font-normal text-gray-700">רחוב *</Label>
            <Input
              value={formData.service_address?.street || ''}
              onChange={(e) => updateField('service_address', { ...formData.service_address, street: e.target.value })}
              className="h-9 text-sm"
              required
            />
          </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-normal text-gray-700">מספר *</Label>
                <Input
                  value={formData.service_address?.number || ''}
                  onChange={(e) => updateField('service_address', { ...formData.service_address, number: e.target.value, city: formData.service_address?.city || '', street: formData.service_address?.street || '', zip: formData.service_address?.zip || '' })}
                  className="h-9 text-sm"
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-normal text-gray-700">מיקוד</Label>
                <Input
                  value={formData.service_address?.zip || ''}
                  onChange={(e) => updateField('service_address', { ...formData.service_address, zip: e.target.value, city: formData.service_address?.city || '', street: formData.service_address?.street || '', number: formData.service_address?.number || '' })}
                  className="h-9 text-sm"
                />
              </div>
            </div>
        </div>
      </div>

      {/* Business Fields */}
      {isBusinessCustomer && (
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
          <div>
            <Label className="text-xs font-normal text-gray-700">שם החברה *</Label>
            <Input
              value={formData.company_name || ''}
              onChange={(e) => updateField('company_name', e.target.value)}
              className="h-9 text-sm"
              required={isBusinessCustomer}
            />
          </div>
          <div>
            <Label className="text-xs font-normal text-gray-700">ח.פ / ע.מ *</Label>
            <Input
              value={formData.corp_registration_number || ''}
              onChange={(e) => updateField('corp_registration_number', e.target.value)}
              className="h-9 text-sm"
              required={isBusinessCustomer}
            />
          </div>
        </div>
      )}

      {/* Declarations */}
      <div className="space-y-3 pt-3 border-t border-gray-200">
        <div className="flex items-start gap-2">
          <Checkbox
            id="poa"
            checked={formData.poa || false}
            onCheckedChange={(checked) => updateField('poa', checked)}
            className="mt-0.5"
          />
          <label htmlFor="poa" className="text-xs font-light text-gray-700 cursor-pointer">
            אני בעל הנכס / מורשה לחתום על הסכם זה
          </label>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="privacy"
            checked={formData.privacy_tos || false}
            onCheckedChange={(checked) => updateField('privacy_tos', checked)}
            className="mt-0.5"
          />
          <label htmlFor="privacy" className="text-xs font-light text-gray-700 cursor-pointer">
            אני מאשר את תנאי השימוש והפרטיות
          </label>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="fees"
            checked={formData.fees_ack || false}
            onCheckedChange={(checked) => updateField('fees_ack', checked)}
            className="mt-0.5"
          />
          <label htmlFor="fees" className="text-xs font-light text-gray-700 cursor-pointer">
            המידע שמסרתי מדויק ונכון
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={isLoading || !formData.poa || !formData.privacy_tos || !formData.fees_ack}
          className={cn(
            "w-full h-10 rounded-lg font-normal text-sm transition-all duration-300",
            isLoading || !formData.poa || !formData.privacy_tos || !formData.fees_ack
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white shadow-sm"
          )}
        >
          {isLoading ? (
            <span className="flex items-center">
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              שולח...
            </span>
          ) : (
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 ml-2" />
              שלח בקשה
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
