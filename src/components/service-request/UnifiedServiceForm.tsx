import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, Loader2, Info, Copy, Pen, AlertCircle, FileText, Trash2 } from 'lucide-react';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import SignatureCanvas from 'react-signature-canvas';
import { getPowerOfAttorneyText } from '@/lib/powerOfAttorneyTexts';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface UnifiedServiceFormProps {
  initialData?: Partial<ServiceRequestFormData>;
  onComplete?: () => void;
}

const providerOptions = [
  'בזק', 'פרטנר/אורנג׳', 'סלקום', 'HOT', 'גולן טלקום', 
  'רמי לוי', 'פלאפון', 'חברת החשמל', 'נקטיק אנרגיה', 'יס', 'אחר'
];

const sectorOptions = [
  { value: 'electricity', label: 'חשמל' },
  { value: 'cellular', label: 'סלולר' },
  { value: 'internet_isp', label: 'אינטרנט' },
  { value: 'tv', label: 'טלוויזיה' }
];

export default function UnifiedServiceForm({ initialData, onComplete }: UnifiedServiceFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  
  const [formData, setFormData] = useState<Partial<ServiceRequestFormData>>({
    customer_type: 'private',
    preferred_language: 'he',
    action_type: 'switch',
    sector: initialData?.sector || 'cellular',
    ...initialData
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
    setSignatureData(null);
  };

  const saveSignature = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      const dataUrl = signatureRef.current.toDataURL('image/png');
      setSignatureData(dataUrl);
      updateField('esign_ok', true);
      setShowSignatureDialog(false);
      toast({
        title: 'החתימה נשמרה',
        description: 'החתימה הדיגיטלית נשמרה בהצלחה'
      });
    } else {
      toast({
        title: 'נא לחתום',
        description: 'אנא חתום על המסמך לפני השמירה',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate signature
    if (!signatureData) {
      toast({
        title: 'חתימה נדרשת',
        description: 'נא לחתום על ייפוי הכוח לפני השליחה',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        sector: formData.sector || initialData?.sector || 'general',
        service_address: formData.service_address || { street: '', number: '', city: '', zip: '' },
        signature_data: signatureData,
        signature_status: 'signed'
      };

      console.log('Submitting form data:', submitData);

      // Call edge function
      const { data: response, error } = await supabase.functions.invoke('create-service-request', {
        body: submitData
      });

      if (error) {
        console.error('Submission error:', error);
        throw new Error(error.message || 'Failed to submit');
      }

      if (!response?.success) {
        if (response?.error === 'duplicate_request') {
          toast({
            title: 'בקשה כפולה',
            description: `כבר קיימת בקשה פעילה. מספר אסמכתה: ${response.existing_reference}`,
            variant: 'destructive'
          });
          return;
        }
        throw new Error(response?.error || 'Unknown error');
      }

      // Success!
      setReferenceNumber(response.reference_number);
      setIsSubmitted(true);
      
      toast({
        title: 'הבקשה נשלחה בהצלחה!',
        description: `מספר אסמכתה: ${response.reference_number}`
      });

      if (onComplete) onComplete();
      
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        title: 'שגיאה בשליחה',
        description: error.message || 'אנא נסה שנית',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferenceNumber = () => {
    if (referenceNumber) {
      navigator.clipboard.writeText(referenceNumber);
      toast({
        title: 'הועתק!',
        description: 'מספר האסמכתה הועתק ללוח'
      });
    }
  };

  const isBusinessCustomer = formData.customer_type === 'business';
  const [disclaimerExpanded, setDisclaimerExpanded] = useState(false);

  // Get sector-specific Power of Attorney text
  const getSectorForPOA = (): 'electricity' | 'cellular' | 'internet' | 'tv' => {
    const sector = formData.sector || 'cellular';
    if (sector === 'internet_isp' || sector === 'internet_infra') return 'internet';
    return sector as 'electricity' | 'cellular' | 'internet' | 'tv';
  };
  
  const poaText = getPowerOfAttorneyText(
    getSectorForPOA(),
    formData.customer_type as 'private' | 'business' || 'private',
    'SaveSwitch'
  );

  // Render sector-specific fields
  const renderSectorFields = () => {
    const sector = formData.sector;
    
    switch (sector) {
      case 'electricity':
        return (
          <div className="space-y-4 p-4 bg-accent/20 rounded-lg border border-border">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              פרטי חשמל
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">מספר חוזה/מונה *</Label>
                <Input
                  value={formData.current_meter_number || ''}
                  onChange={(e) => updateField('current_meter_number', e.target.value)}
                  className="h-10"
                  placeholder="מספר החוזה או המונה"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">מספר חשבון</Label>
                <Input
                  value={formData.current_account_number || ''}
                  onChange={(e) => updateField('current_account_number', e.target.value)}
                  className="h-10"
                  placeholder="מספר חשבון לקוח"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">קריאת מונה אחרונה</Label>
                <Input
                  value={formData.current_last_reading || ''}
                  onChange={(e) => updateField('current_last_reading', e.target.value)}
                  className="h-10"
                  placeholder="קריאה אחרונה"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">ספק יעד</Label>
                <Select value={formData.target_provider} onValueChange={(v) => updateField('target_provider', v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="בחר ספק חדש" />
                  </SelectTrigger>
                  <SelectContent>
                    {['נקטיק אנרגיה', 'פזגז חשמל', 'אלקטרה פאוור', 'אחר'].map(provider => (
                      <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
        
      case 'cellular':
        return (
          <div className="space-y-4 p-4 bg-accent/20 rounded-lg border border-border">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              פרטי סלולר
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">מספר טלפון לניוד *</Label>
                <Input
                  value={formData.current_phone_number || ''}
                  onChange={(e) => updateField('current_phone_number', e.target.value)}
                  className="h-10"
                  placeholder="05X-XXXXXXX"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">מספר SIM</Label>
                <Input
                  value={formData.current_sim_number || ''}
                  onChange={(e) => updateField('current_sim_number', e.target.value)}
                  className="h-10"
                  placeholder="מספר כרטיס ה-SIM"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">קוד PUK</Label>
                <Input
                  value={formData.current_puk_code || ''}
                  onChange={(e) => updateField('current_puk_code', e.target.value)}
                  className="h-10"
                  placeholder="קוד PUK"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">ספק יעד</Label>
                <Select value={formData.target_provider} onValueChange={(v) => updateField('target_provider', v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="בחר ספק חדש" />
                  </SelectTrigger>
                  <SelectContent>
                    {['פרטנר', 'סלקום', 'גולן טלקום', 'רמי לוי', 'פלאפון', 'HOT Mobile', 'אחר'].map(provider => (
                      <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                שים לב: תידרש לאשר קוד OTP שיישלח לכרטיס ה-SIM הנוכחי שלך
              </p>
            </div>
          </div>
        );
        
      case 'internet_isp':
      case 'internet_infra':
        return (
          <div className="space-y-4 p-4 bg-accent/20 rounded-lg border border-border">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              פרטי אינטרנט
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">ספק תשתית *</Label>
                <Select 
                  value={formData.current_provider} 
                  onValueChange={(v) => updateField('current_provider', v)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="בזק/HOT/סיב" />
                  </SelectTrigger>
                  <SelectContent>
                    {['בזק', 'HOT', 'סיב פרטי', 'IBC', 'אחר'].map(provider => (
                      <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">ספק ISP נוכחי</Label>
                <Input
                  value={formData.account_or_contract_no || ''}
                  onChange={(e) => updateField('account_or_contract_no', e.target.value)}
                  className="h-10"
                  placeholder="שם ספק האינטרנט"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">מספר קו/מנוי *</Label>
                <Input
                  value={formData.current_line_number || ''}
                  onChange={(e) => updateField('current_line_number', e.target.value)}
                  className="h-10"
                  placeholder="מספר הקו או המנוי"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">מספר מודם/ONT</Label>
                <Input
                  value={formData.current_modem_serial || ''}
                  onChange={(e) => updateField('current_modem_serial', e.target.value)}
                  className="h-10"
                  placeholder="מספר סידורי"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">כתובת MAC</Label>
                <Input
                  value={formData.current_mac_address || ''}
                  onChange={(e) => updateField('current_mac_address', e.target.value)}
                  className="h-10"
                  placeholder="XX:XX:XX:XX:XX:XX"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">ספק יעד</Label>
                <Select value={formData.target_provider} onValueChange={(v) => updateField('target_provider', v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="בחר ספק חדש" />
                  </SelectTrigger>
                  <SelectContent>
                    {['בזק אינטרנט', 'פרטנר', 'סלקום', 'HOT', 'אחר'].map(provider => (
                      <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
        
      case 'tv':
        return (
          <div className="space-y-4 p-4 bg-accent/20 rounded-lg border border-border">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              פרטי טלוויזיה
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">מספר מנוי *</Label>
                <Input
                  value={formData.current_subscriber_number || ''}
                  onChange={(e) => updateField('current_subscriber_number', e.target.value)}
                  className="h-10"
                  placeholder="מספר מנוי טלוויזיה"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">מספר ממיר/דקודר</Label>
                <Input
                  value={formData.current_decoder_number || ''}
                  onChange={(e) => updateField('current_decoder_number', e.target.value)}
                  className="h-10"
                  placeholder="מספר סידורי של הממיר"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">מספר כרטיס חכם</Label>
                <Input
                  value={formData.current_smart_card || ''}
                  onChange={(e) => updateField('current_smart_card', e.target.value)}
                  className="h-10"
                  placeholder="מספר Smart Card"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">ספק יעד</Label>
                <Select value={formData.target_provider} onValueChange={(v) => updateField('target_provider', v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="בחר ספק חדש" />
                  </SelectTrigger>
                  <SelectContent>
                    {['יס', 'HOT', 'סלקום TV', 'פרטנר TV', 'נטפליקס', 'אחר'].map(provider => (
                      <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                זכור: יש לתאם החזרת ציוד (ממירים, שלטים) לספק הנוכחי
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-green-800">הבקשה נשלחה בהצלחה!</h2>
          <p className="text-muted-foreground">
            כל הפרטים נשמרו במערכת ותטופל בהקדם
          </p>
        </div>

        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-green-800">מספר אסמכתה</span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <code className="text-lg font-mono bg-white px-3 py-2 rounded border text-green-700">
                  {referenceNumber}
                </code>
                <Button variant="outline" size="sm" onClick={copyReferenceNumber}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-green-700 space-y-1">
              <p>• שמרו את מספר האסמכתה למעקב</p>
              <p>• תקבלו הודעת אישור לאימייל תוך 24 שעות</p>
              <p>• המעבר יבוצע תוך 7-30 ימי עבודה</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            חזרה לעמוד הבית
          </Button>
          <Button onClick={() => window.location.href = '/all-plans'}>
            חזרה להשוואת מסלולים
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
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

        {/* Selected Plan Display - Show when plan data is passed */}
        {formData.selected_plan_name && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-bold text-green-800">המסלול שנבחר</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500">שם המסלול:</span>
                <p className="text-base font-bold text-gray-900">{formData.selected_plan_name}</p>
              </div>
              {formData.selected_plan_price && (
                <div>
                  <span className="text-xs text-gray-500">מחיר חודשי:</span>
                  <p className="text-base font-bold text-green-600">₪{formData.selected_plan_price}</p>
                </div>
              )}
            </div>
            {formData.selected_plan_features && Array.isArray(formData.selected_plan_features) && formData.selected_plan_features.length > 0 && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <span className="text-xs text-gray-500">תכונות המסלול:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {formData.selected_plan_features.map((feature, idx) => (
                    <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-green-200 text-gray-700">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sector Selection */}
        <div>
          <Label className="text-sm font-medium text-foreground mb-1.5 block">סוג שירות *</Label>
          <Select value={formData.sector} onValueChange={(v) => updateField('sector', v)}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="בחר סוג שירות" />
            </SelectTrigger>
            <SelectContent>
              {sectorOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <div>
              <Label className="text-sm font-medium text-foreground mb-1.5 block">שם מורשה חתימה</Label>
              <Input
                value={formData.signer_name || ''}
                onChange={(e) => updateField('signer_name', e.target.value)}
                className="h-10"
                placeholder="שם מלא"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground mb-1.5 block">תפקיד מורשה חתימה</Label>
              <Input
                value={formData.signer_title || ''}
                onChange={(e) => updateField('signer_title', e.target.value)}
                className="h-10"
                placeholder="מנכ״ל, סמנכ״ל כספים..."
              />
            </div>
          </div>
        )}

        {/* Sector-specific Fields */}
        {renderSectorFields()}

        {/* Additional Notes */}
        <div>
          <Label className="text-sm font-medium text-foreground mb-1.5 block">הערות נוספות</Label>
          <Textarea
            value={formData.additional_notes || ''}
            onChange={(e) => updateField('additional_notes', e.target.value)}
            className="min-h-[80px]"
            placeholder="הערות, בקשות מיוחדות או מידע נוסף..."
          />
        </div>

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

        {/* Digital Signature Section */}
        <div className="p-5 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Pen className="w-5 h-5" />
                חתימה דיגיטלית על ייפוי כוח
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                נדרשת חתימה דיגיטלית כדי לאשר את ייפוי הכוח ולבצע את המעבר בשמך
              </p>
            </div>
            {signatureData && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">נחתם</span>
              </div>
            )}
          </div>
          
          {signatureData ? (
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg border">
                <img src={signatureData} alt="חתימה" className="max-h-20 mx-auto" />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSignatureData(null);
                  updateField('esign_ok', false);
                }}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 ml-2" />
                מחק חתימה וחתום מחדש
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSignatureDialog(true)}
              disabled={!formData.poa || !formData.privacy_tos || !formData.fees_ack}
              className="w-full h-14 text-base border-dashed border-2"
            >
              <Pen className="w-5 h-5 ml-2" />
              לחץ כאן לחתימה על ייפוי הכוח
            </Button>
          )}
          
          {(!formData.poa || !formData.privacy_tos || !formData.fees_ack) && !signatureData && (
            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              יש לאשר את כל ההצהרות לפני החתימה
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-5">
          <Button
            type="submit"
            disabled={isLoading || !formData.poa || !formData.privacy_tos || !formData.fees_ack || !signatureData}
            className="w-full h-12 text-base font-medium"
            variant={isLoading || !formData.poa || !formData.privacy_tos || !formData.fees_ack || !signatureData ? "outline" : "default"}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                שולח בקשה...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                שלח בקשה
              </span>
            )}
          </Button>
        </div>
      </form>

      {/* Signature Dialog */}
      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6" />
              ייפוי כוח לביצוע מעבר ספקים
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5">
            {/* POA Text */}
            <div className="p-4 bg-muted/50 rounded-lg border max-h-48 overflow-y-auto">
              <h4 className="font-semibold mb-2">נוסח ייפוי הכוח:</h4>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {poaText.full
                  .replace('[שם מלא]', formData.full_name || '___')
                  .replace('[מס׳]', formData.national_id_or_corp || '___')
                  .replace('[כתובת]', formData.service_address ? `${formData.service_address.street} ${formData.service_address.number}, ${formData.service_address.city}` : '___')
                  .replace('[ספק נוכחי]', formData.current_provider || '___')
                  .replace('[שם התאגיד]', formData.company_name || '___')
                  .replace('[תאריך פקיעה]', new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('he-IL'))
                }
              </p>
            </div>

            {/* User Details Summary */}
            <div className="p-4 bg-accent/30 rounded-lg border">
              <h4 className="font-semibold mb-3">פרטי החותם:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">שם:</span> {formData.full_name || '-'}</div>
                <div><span className="text-muted-foreground">ת.ז.:</span> {formData.national_id_or_corp || '-'}</div>
                <div><span className="text-muted-foreground">טלפון:</span> {formData.phone || '-'}</div>
                <div><span className="text-muted-foreground">אימייל:</span> {formData.email || '-'}</div>
                <div className="col-span-2"><span className="text-muted-foreground">כתובת:</span> {formData.service_address ? `${formData.service_address.street} ${formData.service_address.number}, ${formData.service_address.city}` : '-'}</div>
              </div>
            </div>

            {/* Signature Canvas */}
            <div>
              <Label className="text-sm font-medium mb-2 block">חתימתך כאן:</Label>
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-2 bg-white">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    className: 'w-full h-32 border rounded cursor-crosshair',
                    style: { touchAction: 'none' }
                  }}
                  backgroundColor="white"
                />
              </div>
              <div className="flex justify-between mt-2">
                <Button type="button" variant="ghost" size="sm" onClick={clearSignature}>
                  <Trash2 className="w-4 h-4 ml-1" />
                  נקה חתימה
                </Button>
                <span className="text-xs text-muted-foreground">
                  תאריך: {new Date().toLocaleDateString('he-IL')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setShowSignatureDialog(false)} className="flex-1">
                ביטול
              </Button>
              <Button type="button" onClick={saveSignature} className="flex-1">
                <CheckCircle className="w-4 h-4 ml-2" />
                אשר וחתום
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
