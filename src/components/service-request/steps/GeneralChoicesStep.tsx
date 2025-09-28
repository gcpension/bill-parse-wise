import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { FileUpload } from '@/components/ui/file-upload';
import { 
  Zap, 
  Smartphone, 
  Wifi, 
  Tv, 
  Building2, 
  User, 
  ArrowRightLeft,
  UserX,
  Home,
  Calendar,
  CheckCircle,
  Sparkles,
  Target
} from 'lucide-react';
import { InteractiveCard } from '../components/InteractiveCard';
import { InteractiveChoiceGrid } from '../components/InteractiveChoiceGrid';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface GeneralChoicesStepProps {
  formData: Partial<ServiceRequestFormData>;
  updateFormData: (data: Partial<ServiceRequestFormData>) => void;
}

export default function GeneralChoicesStep({ formData, updateFormData }: GeneralChoicesStepProps) {
  const { isVisible, elementRef } = useScrollAnimation();
  
  const actionTypes = [
    { 
      value: 'disconnect', 
      label: 'ניתוק שירות', 
      icon: <UserX className="w-6 h-6" />, 
      color: 'bg-red-500', 
      description: 'סיום מוחלט של השירות הקיים',
      badge: 'פעולה מיוחדת'
    },
    { 
      value: 'switch', 
      label: 'מעבר ספק', 
      icon: <ArrowRightLeft className="w-6 h-6" />, 
      color: 'bg-blue-500', 
      description: 'מעבר לספק אחר תוך שמירה על רציפות השירות',
      badge: 'פופולרי'
    },
    { 
      value: 'move', 
      label: 'העברת דירה', 
      icon: <Home className="w-6 h-6" />, 
      color: 'bg-green-500', 
      description: 'העברת השירות הקיים לכתובת חדשה'
    },
    { 
      value: 'early_terminate', 
      label: 'סיום מוקדם', 
      icon: <Calendar className="w-6 h-6" />, 
      color: 'bg-orange-500', 
      description: 'סיום חוזה לפני תום התקופה הקבועה'
    }
  ];

  const sectors = [
    { 
      value: 'cellular', 
      label: 'סלולר', 
      icon: <Smartphone className="w-6 h-6" />, 
      color: 'bg-purple-500',
      description: 'מעבר ספק סלולרי, מספר נייד וחבילות נתונים'
    },
    { 
      value: 'internet_isp', 
      label: 'אינטרנט ISP', 
      icon: <Wifi className="w-6 h-6" />, 
      color: 'bg-blue-500',
      description: 'ספקי אינטרנט וחבילות גלישה ביתיות'
    },
    { 
      value: 'internet_infra', 
      label: 'תשתית אינטרנט', 
      icon: <Wifi className="w-6 h-6" />, 
      color: 'bg-cyan-500',
      description: 'תשתיות תקשורת ופתרונות אינטרנט מתקדמים'
    },
    { 
      value: 'tv', 
      label: 'טלוויזיה', 
      icon: <Tv className="w-6 h-6" />, 
      color: 'bg-green-500',
      description: 'שירותי טלוויזיה ומולטימדיה ביתיים'
    },
    { 
      value: 'electricity', 
      label: 'חשמל', 
      icon: <Zap className="w-6 h-6" />, 
      color: 'bg-yellow-500',
      description: 'ספקי חשמל ופתרונות אנרגיה'
    }
  ];

  const customerTypes = [
    { 
      value: 'private', 
      label: 'לקוח פרטי', 
      icon: <User className="w-6 h-6" />, 
      description: 'משק בית רגיל - פרטיות מלאה ותמיכה אישית'
    },
    { 
      value: 'business', 
      label: 'לקוח עסקי', 
      icon: <Building2 className="w-6 h-6" />, 
      description: 'חברה או עסק - פתרונות מתקדמים ותמיכה מקצועית'
    }
  ];

  // Auto-hide action type and sector if already detected from plan selection
  const isAutoDetected = formData.selected_plan_name && formData.action_type && formData.sector;

  return (
    <div className="space-y-10" ref={elementRef}>
      {/* Auto-Detection Banner */}
      {isAutoDetected && (
        <InteractiveCard
          title="🎯 פרטי השירות זוהו אוטומטית"
          description="המערכת זיהתה את הבחירות שלך על בסיס התוכנית שנבחרה"
          icon={<Target className="w-7 h-7" />}
          variant="success"
          className="animate-bounce-gentle"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="text-center p-4 bg-white/50 rounded-xl hover-scale transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ArrowRightLeft className="w-6 h-6 text-primary" />
              </div>
              <p className="font-bold text-lg font-heebo text-primary">
                {actionTypes.find(a => a.value === formData.action_type)?.label}
              </p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-xl hover-scale transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                {sectors.find(s => s.value === formData.sector)?.icon}
              </div>
              <p className="font-bold text-lg font-heebo text-primary">
                {sectors.find(s => s.value === formData.sector)?.label}
              </p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-xl hover-scale transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <p className="font-bold text-lg font-heebo text-success">
                {formData.target_provider}
              </p>
            </div>
          </div>
        </InteractiveCard>
      )}

      {/* Action Type Selection */}
      {!isAutoDetected && (
        <div className={isVisible ? "animate-fade-in" : "opacity-0 translate-y-10"}>
          <InteractiveChoiceGrid
            title="🎯 בחר את סוג הפעולה"
            description="איזה סוג פעולה ברצונך לבצע? כל אפשרות מותאמת לצרכים שלך"
            choices={actionTypes}
            selectedValue={formData.action_type}
            onSelect={(value) => updateFormData({ action_type: value as any })}
            columns={2}
          />
        </div>
      )}

      {/* Sector Selection */}
      {!isAutoDetected && (
        <div className={isVisible ? "animate-fade-in" : "opacity-0 translate-y-10"} style={{ animationDelay: '200ms' }}>
          <InteractiveChoiceGrid
            title="🏢 בחר את סקטור השירות"
            description="באיזה תחום אתה מעוניין לבצע את הפעולה? נתאמן למגוון רחב של שירותים"
            choices={sectors}
            selectedValue={formData.sector}
            onSelect={(value) => updateFormData({ sector: value as any })}
            columns={3}
          />
        </div>
      )}

      {/* Customer Type Selection */}
      <div className={isVisible ? "animate-fade-in" : "opacity-0 translate-y-10"} style={{ animationDelay: '400ms' }}>
        <InteractiveChoiceGrid
          title="👤 בחר את סוג הלקוח"
          description="האם אתה לקוח פרטי או עסקי? זה יעזור לנו להתאים את השירות הטוב ביותר עבורך"
          choices={customerTypes}
          selectedValue={formData.customer_type}
          onSelect={(value) => updateFormData({ customer_type: value as any })}
          columns={2}
        />
      </div>

      {/* Business-specific fields */}
      {formData.customer_type === 'business' && (
        <InteractiveCard
          title="🏢 פרטים עסקיים נוספים"
          description="מידע נוסף הנדרש עבור לקוחות עסקיים כדי לטפל בבקשה בצורה המקצועית ביותר"
          icon={<Building2 className="w-7 h-7" />}
          variant="purple"
          className="animate-scale-in border-l-4 border-l-primary"
        >
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="company_name" className="font-assistant font-semibold text-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  שם החברה <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="company_name"
                    value={formData.company_name || ''}
                    onChange={(e) => updateFormData({ company_name: e.target.value })}
                    placeholder="שם החברה המלא כפי שמופיע ברישום"
                    className="font-assistant h-12 border-2 border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300"
                    required
                  />
                  <div className="absolute inset-0 rounded-md opacity-0 hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-primary/10 to-primary-glow/10 pointer-events-none" />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="corp_registration_number" className="font-assistant font-semibold text-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  מספר רישום חברה <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="corp_registration_number"
                    value={formData.corp_registration_number || ''}
                    onChange={(e) => updateFormData({ corp_registration_number: e.target.value })}
                    placeholder="מספר ח.פ או ע.ר"
                    className="font-assistant h-12 border-2 border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300"
                    required
                  />
                  <div className="absolute inset-0 rounded-md opacity-0 hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-primary/10 to-primary-glow/10 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="signer_name" className="font-assistant font-semibold text-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  שם החותם <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="signer_name"
                    value={formData.signer_name || ''}
                    onChange={(e) => updateFormData({ signer_name: e.target.value })}
                    placeholder="שם מלא של המורשה לחתום"
                    className="font-assistant h-12 border-2 border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300"
                    required
                  />
                  <div className="absolute inset-0 rounded-md opacity-0 hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-primary/10 to-primary-glow/10 pointer-events-none" />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="signer_title" className="font-assistant font-semibold text-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  תפקיד החותם <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="signer_title"
                    value={formData.signer_title || ''}
                    onChange={(e) => updateFormData({ signer_title: e.target.value })}
                    placeholder="מנכ״ל, בעלים, מורשה חתימה"
                    className="font-assistant h-12 border-2 border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300"
                    required
                  />
                  <div className="absolute inset-0 rounded-md opacity-0 hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-primary/10 to-primary-glow/10 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="font-assistant font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                ייפוי כוח עסקי (PDF) <span className="text-destructive">*</span>
              </Label>
              <div className="p-6 border-2 border-dashed border-primary/30 rounded-xl bg-gradient-to-r from-primary/5 to-primary-glow/5 hover:from-primary/10 hover:to-primary-glow/10 transition-all duration-300">
                <FileUpload
                  onFileUpload={(file) => updateFormData({ power_of_attorney_file: file })}
                  accept=".pdf"
                  maxSize={10 * 1024 * 1024}
                  className="border-0 bg-transparent"
                  helperText="העלה ייפוי כוח חתום וסרוק במקום. קובץ PDF עד 10MB"
                />
              </div>
            </div>
          </div>
        </InteractiveCard>
      )}
    </div>
  );
}