import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  CheckCircle
} from 'lucide-react';
import { ServiceRequestFormData } from '@/types/serviceRequest';
import { FileUpload } from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';

interface GeneralChoicesStepProps {
  formData: Partial<ServiceRequestFormData>;
  updateFormData: (data: Partial<ServiceRequestFormData>) => void;
}

export default function GeneralChoicesStep({ formData, updateFormData }: GeneralChoicesStepProps) {
  
  const actionTypes = [
    { value: 'disconnect', label: 'ניתוק שירות', description: 'סיום מוחלט של השירות' },
    { value: 'switch', label: 'מעבר ספק', description: 'מעבר לספק אחר' },
    { value: 'move', label: 'העברת דירה', description: 'העברת שירות לכתובת חדשה' },
    { value: 'early_terminate', label: 'סיום מוקדם', description: 'סיום חוזה לפני תום התקופה' }
  ];

  const sectors = [
    { value: 'cellular', label: 'סלולר' },
    { value: 'internet_isp', label: 'אינטרנט ISP' },
    { value: 'internet_infra', label: 'תשתית אינטרנט' },
    { value: 'tv', label: 'טלוויזיה' },
    { value: 'electricity', label: 'חשמל' }
  ];

  const customerTypes = [
    { value: 'private', label: 'לקוח פרטי', description: 'משק בית רגיל' },
    { value: 'business', label: 'לקוח עסקי', description: 'חברה או עסק' }
  ];

  // First step - Action Type
  if (!formData.action_type) {
    return (
      <div className="text-center space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            כמה שאלות צרידות ונמצא לך את
          </h1>
          <h2 className="text-3xl font-bold text-gray-900">
            הרצוות המשתלמות ביותר
          </h2>
        </div>
        
        <div className="space-y-4">
          {actionTypes.map((action) => (
            <button
              key={action.value}
              onClick={() => updateFormData({ action_type: action.value as any })}
              className="w-full max-w-md mx-auto block p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-red-500 hover:shadow-lg transition-all duration-200 text-right"
            >
              <div className="text-lg font-semibold text-gray-900 mb-2">
                {action.label}
              </div>
              <div className="text-sm text-gray-600">
                {action.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Second step - Sector
  if (!formData.sector) {
    return (
      <div className="text-center space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            באיזה תחום?
          </h1>
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {sectors.map((sector) => (
            <button
              key={sector.value}
              onClick={() => updateFormData({ sector: sector.value as any })}
              className="p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-red-500 hover:shadow-lg transition-all duration-200"
            >
              <div className="text-lg font-semibold text-gray-900">
                {sector.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Third step - Customer Type
  return (
    <div className="text-center space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          סוג הלקוח?
        </h1>
      </div>
      
      <div className="space-y-4 max-w-md mx-auto">
        {customerTypes.map((type) => (
          <div key={type.value} className="flex items-center">
            <input
              type="radio"
              id={type.value}
              name="customer_type"
              checked={formData.customer_type === type.value}
              onChange={() => updateFormData({ customer_type: type.value as any })}
              className="w-5 h-5 text-red-500 border-gray-300 focus:ring-red-500"
            />
            <label htmlFor={type.value} className="mr-3 text-lg text-gray-900 cursor-pointer">
              {type.label}
            </label>
          </div>
        ))}
        {formData.customer_type && (
          <p className="text-sm text-gray-600 mt-4">
            {customerTypes.find(t => t.value === formData.customer_type)?.description}
          </p>
        )}
      </div>

      {/* Business-specific fields - show as separate step-like section */}
      {formData.customer_type === 'business' && (
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            פרטים עסקיים נוספים
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company_name" className="text-sm font-medium text-gray-700 mb-1 block">שם החברה *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name || ''}
                  onChange={(e) => updateFormData({ company_name: e.target.value })}
                  placeholder="שם החברה המלא"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="corp_registration_number" className="text-sm font-medium text-gray-700 mb-1 block">מספר רישום חברה *</Label>
                <Input
                  id="corp_registration_number"
                  value={formData.corp_registration_number || ''}
                  onChange={(e) => updateFormData({ corp_registration_number: e.target.value })}
                  placeholder="מספר ח.פ/ע.ר"
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="signer_name" className="text-sm font-medium text-gray-700 mb-1 block">שם החותם *</Label>
                <Input
                  id="signer_name"
                  value={formData.signer_name || ''}
                  onChange={(e) => updateFormData({ signer_name: e.target.value })}
                  placeholder="שם מלא של החותם"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="signer_title" className="text-sm font-medium text-gray-700 mb-1 block">תפקיד החותם *</Label>
                <Input
                  id="signer_title"
                  value={formData.signer_title || ''}
                  onChange={(e) => updateFormData({ signer_title: e.target.value })}
                  placeholder="מנכ״ל, בעלים, מורשה חתימה"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}