import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ManualPlan } from '@/data/manual-plans';
import { enhancedToast } from '@/components/EnhancedToast';
import { CheckCircle, Sparkles } from 'lucide-react';

interface ExpressFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: ManualPlan;
}

export const ExpressForm = ({ isOpen, onClose, selectedPlan }: ExpressFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    idNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName || !formData.phone || !formData.email || !formData.idNumber) {
      enhancedToast.warning({
        title: 'חסרים פרטים',
        description: 'אנא מלאו את כל השדות'
      });
      return;
    }

    // Phone validation
    if (!/^0\d{9}$/.test(formData.phone)) {
      enhancedToast.warning({
        title: 'מספר טלפון לא תקין',
        description: 'אנא הזינו מספר טלפון תקין (10 ספרות)'
      });
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      enhancedToast.warning({
        title: 'אימייל לא תקין',
        description: 'אנא הזינו כתובת אימייל תקינה'
      });
      return;
    }

    // ID validation (basic)
    if (!/^\d{9}$/.test(formData.idNumber)) {
      enhancedToast.warning({
        title: 'תעודת זהות לא תקינה',
        description: 'אנא הזינו מספר תעודת זהות תקין (9 ספרות)'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store in localStorage for now
      const requestData = {
        ...formData,
        plan: selectedPlan,
        timestamp: new Date().toISOString()
      };
      
      const existingRequests = JSON.parse(localStorage.getItem('switchRequests') || '[]');
      localStorage.setItem('switchRequests', JSON.stringify([...existingRequests, requestData]));

      setIsSuccess(true);
      
      enhancedToast.success({
        title: '🎉 הבקשה נשלחה בהצלחה!',
        description: 'נציג יצור איתכם קשר תוך 24 שעות'
      });

      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({ fullName: '', phone: '', email: '', idNumber: '' });
      }, 2000);
    } catch (error) {
      enhancedToast.error({
        title: 'שגיאה',
        description: 'אירעה שגיאה בשליחה, אנא נסו שוב'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="rounded-full bg-green-500 p-4">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-green-900">בקשה נשלחה!</h2>
            <p className="text-center text-gray-700 text-lg">
              נציג יצור איתכם קשר תוך 24 שעות
            </p>
            <p className="text-center text-gray-600">
              נתחיל לטפל במעבר שלכם לספק החדש
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-purple-50 to-pink-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-purple-900">
            כמעט סיימנו! 🎉
          </DialogTitle>
          <p className="text-center text-gray-600 mt-2">
            רק 4 פרטים ונתחיל לטפל בכל השאר בשבילכם
          </p>
        </DialogHeader>

        {/* Selected Plan Info */}
        <div className="bg-white rounded-lg p-4 border-2 border-purple-200 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">המסלול שבחרתם:</p>
              <p className="font-bold text-lg text-purple-900">{selectedPlan.planName}</p>
              <p className="text-sm text-gray-600">{selectedPlan.company}</p>
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-green-600">
                ₪{selectedPlan.introPrice > 0 ? selectedPlan.introPrice : selectedPlan.regularPrice}
              </p>
              <p className="text-sm text-gray-600">לחודש</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-base font-semibold text-purple-900">
              שם מלא
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="לדוגמה: ישראל ישראלי"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="h-12 border-2 border-purple-200 bg-white"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-base font-semibold text-purple-900">
              טלפון נייד
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="050-1234567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-12 border-2 border-purple-200 bg-white"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-semibold text-purple-900">
              אימייל
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="israel@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-12 border-2 border-purple-200 bg-white"
              required
            />
          </div>

          {/* ID Number */}
          <div className="space-y-2">
            <Label htmlFor="idNumber" className="text-base font-semibold text-purple-900">
              תעודת זהות
            </Label>
            <Input
              id="idNumber"
              type="text"
              placeholder="123456789"
              value={formData.idNumber}
              onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
              className="h-12 border-2 border-purple-200 bg-white"
              maxLength={9}
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-xl transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2" />
                שולח...
              </>
            ) : (
              <>
                <Sparkles className="ml-2 h-5 w-5" />
                שלח וסיים!
              </>
            )}
          </Button>

          <p className="text-center text-xs text-gray-500 mt-2">
            🔒 המידע שלכם מאובטח ומוצפן
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
