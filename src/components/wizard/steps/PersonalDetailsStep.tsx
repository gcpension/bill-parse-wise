import { useState } from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, User, Mail, Phone, MapPin, Calendar, CreditCard } from 'lucide-react';
import { PersonalDetails } from '@/types/wizard';

export const PersonalDetailsStep = () => {
  const { state, updatePersonalDetails } = useWizard();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const personalDetails = state.personalDetails;

  const validateIsraeliId = (id: string): boolean => {
    if (!/^\d{9}$/.test(id)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let digit = parseInt(id[i]);
      if (i % 2 === 1) digit *= 2;
      if (digit > 9) digit = Math.floor(digit / 10) + (digit % 10);
      sum += digit;
    }
    return sum % 10 === 0;
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^05\d{8}$/.test(phone.replace(/[\s-]/g, ''));
  };

  const handleInputChange = (field: keyof PersonalDetails, value: string) => {
    updatePersonalDetails({ [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    const currentAddress = personalDetails.address || { street: '', houseNumber: '', city: '', zipCode: '' };
    updatePersonalDetails({
      address: { ...currentAddress, [field]: value }
    });
    
    if (errors[`address.${field}`]) {
      setErrors(prev => ({ ...prev, [`address.${field}`]: '' }));
    }
  };

  const handleFileUpload = (field: 'idDocument' | 'idSupplement', file: File | undefined) => {
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [field]: 'רק קבצי JPG, PNG או PDF מותרים' }));
        return;
      }
      
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, [field]: 'גודל הקובץ לא יכול לעלות על 5MB' }));
        return;
      }
    }
    
    updatePersonalDetails({ [field]: file });
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!personalDetails.firstName?.trim()) {
      newErrors.firstName = 'שם פרטי חובה';
    }

    if (!personalDetails.lastName?.trim()) {
      newErrors.lastName = 'שם משפחה חובה';
    }

    if (!personalDetails.idNumber) {
      newErrors.idNumber = 'מספר תעודת זהות חובה';
    } else if (!validateIsraeliId(personalDetails.idNumber)) {
      newErrors.idNumber = 'מספר תעודת זהות לא תקין';
    }

    if (!personalDetails.email) {
      newErrors.email = 'כתובת אימייל חובה';
    } else if (!validateEmail(personalDetails.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }

    if (!personalDetails.phone) {
      newErrors.phone = 'מספר טלפון חובה';
    } else if (!validatePhone(personalDetails.phone)) {
      newErrors.phone = 'מספר טלפון לא תקין (05xxxxxxxx)';
    }

    if (!personalDetails.birthDate) {
      newErrors.birthDate = 'תאריך לידה חובה';
    }

    const address = personalDetails.address;
    if (!address?.street?.trim()) newErrors['address.street'] = 'שם רחוב חובה';
    if (!address?.houseNumber?.trim()) newErrors['address.houseNumber'] = 'מספר בית חובה';
    if (!address?.city?.trim()) newErrors['address.city'] = 'עיר חובה';
    if (!address?.zipCode?.trim()) newErrors['address.zipCode'] = 'מיקוד חובה';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            פרטים אישיים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">שם פרטי *</Label>
              <Input
                id="firstName"
                value={personalDetails.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="כפי שמופיע בתעודת הזהות"
                className={errors.firstName ? 'border-destructive' : ''}
              />
              {errors.firstName && (
                <p className="text-destructive text-sm">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">שם משפחה *</Label>
              <Input
                id="lastName"
                value={personalDetails.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="כפי שמופיע בתעודת הזהות"
                className={errors.lastName ? 'border-destructive' : ''}
              />
              {errors.lastName && (
                <p className="text-destructive text-sm">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* ID and Birth Date */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="idNumber">מספר תעודת זהות *</Label>
              <Input
                id="idNumber"
                value={personalDetails.idNumber || ''}
                onChange={(e) => handleInputChange('idNumber', e.target.value.replace(/\D/g, '').slice(0, 9))}
                placeholder="9 ספרות כולל ספרת ביקורת"
                className={errors.idNumber ? 'border-destructive' : ''}
                maxLength={9}
              />
              {errors.idNumber && (
                <p className="text-destructive text-sm">{errors.idNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">תאריך לידה *</Label>
              <Input
                id="birthDate"
                type="date"
                value={personalDetails.birthDate || ''}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className={errors.birthDate ? 'border-destructive' : ''}
              />
              {errors.birthDate && (
                <p className="text-destructive text-sm">{errors.birthDate}</p>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">כתובת אימייל *</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={personalDetails.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@email.com"
                  className={`pr-10 ${errors.email ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">טלפון נייד *</Label>
              <div className="relative">
                <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={personalDetails.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="05X-XXXXXXX"
                  className={`pr-10 ${errors.phone ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.phone && (
                <p className="text-destructive text-sm">{errors.phone}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            כתובת מגורים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="street">רחוב *</Label>
              <Input
                id="street"
                value={personalDetails.address?.street || ''}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="שם הרחוב"
                className={errors['address.street'] ? 'border-destructive' : ''}
              />
              {errors['address.street'] && (
                <p className="text-destructive text-sm">{errors['address.street']}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="houseNumber">מספר בית *</Label>
              <Input
                id="houseNumber"
                value={personalDetails.address?.houseNumber || ''}
                onChange={(e) => handleAddressChange('houseNumber', e.target.value)}
                placeholder="מספר"
                className={errors['address.houseNumber'] ? 'border-destructive' : ''}
              />
              {errors['address.houseNumber'] && (
                <p className="text-destructive text-sm">{errors['address.houseNumber']}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">עיר *</Label>
              <Input
                id="city"
                value={personalDetails.address?.city || ''}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder="שם העיר"
                className={errors['address.city'] ? 'border-destructive' : ''}
              />
              {errors['address.city'] && (
                <p className="text-destructive text-sm">{errors['address.city']}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">מיקוד *</Label>
              <Input
                id="zipCode"
                value={personalDetails.address?.zipCode || ''}
                onChange={(e) => handleAddressChange('zipCode', e.target.value.replace(/\D/g, '').slice(0, 7))}
                placeholder="מיקוד"
                className={errors['address.zipCode'] ? 'border-destructive' : ''}
                maxLength={7}
              />
              {errors['address.zipCode'] && (
                <p className="text-destructive text-sm">{errors['address.zipCode']}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            העלאת מסמכים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CreditCard className="h-4 w-4" />
            <AlertDescription>
              יש להעלות צילום ברור של תעודת הזהות (דף מול) וספח (דף אחורי) לאימות זהות
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="idDocument">תעודת זהות (דף מול)</Label>
              <Input
                id="idDocument"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload('idDocument', e.target.files?.[0])}
                className={errors.idDocument ? 'border-destructive' : ''}
              />
              {errors.idDocument && (
                <p className="text-destructive text-sm">{errors.idDocument}</p>
              )}
              {personalDetails.idDocument && (
                <p className="text-success text-sm">✓ קובץ הועלה בהצלחה</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="idSupplement">ספח תעודת זהות (דף אחורי)</Label>
              <Input
                id="idSupplement"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload('idSupplement', e.target.files?.[0])}
                className={errors.idSupplement ? 'border-destructive' : ''}
              />
              {errors.idSupplement && (
                <p className="text-destructive text-sm">{errors.idSupplement}</p>
              )}
              {personalDetails.idSupplement && (
                <p className="text-success text-sm">✓ קובץ הועלה בהצלחה</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Button */}
      <div className="flex justify-center">
        <Button 
          onClick={validateStep}
          variant="outline"
          className="w-full md:w-auto"
        >
          בדוק נתונים
        </Button>
      </div>
    </div>
  );
};