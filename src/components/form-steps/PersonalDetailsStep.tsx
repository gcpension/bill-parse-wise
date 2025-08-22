import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
// Validation functions inline for now
const validateIsraeliId = (id: string): boolean => {
  if (!id || id.length !== 9) return false;
  const digits = id.split('').map(Number);
  const checksum = digits.reduce((sum, digit, index) => {
    const weight = index % 2 === 0 ? 1 : 2;
    const product = digit * weight;
    return sum + (product > 9 ? product - 9 : product);
  }, 0);
  return checksum % 10 === 0;
};

const validateCompanyId = (id: string): boolean => {
  return /^[0-9]{8,9}$/.test(id);
};

const validateIsraeliPhone = (phone: string): boolean => {
  return /^05[0-9]-?[0-9]{7}$/.test(phone.replace(/\s/g, ''));
};

const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

interface PersonalDetailsStepProps {
  category: string;
  customerType: string;
  data: any;
  onUpdate: (data: any) => void;
}

export const PersonalDetailsStep = ({ category, customerType, data, onUpdate }: PersonalDetailsStepProps) => {
  const { register, watch, formState: { errors }, setValue } = useForm({
    defaultValues: data
  });

  const watchedValues = watch();

  useEffect(() => {
    onUpdate(watchedValues);
  }, [watchedValues, onUpdate]);

  const isPrivate = customerType === 'private';

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">פרטים {isPrivate ? 'אישיים' : 'עסקיים'}</h2>
        <p className="text-muted-foreground">
          אנא מלאו את הפרטים הנדרשים לביצוע המעבר
        </p>
      </div>

      {isPrivate ? (
        // Private Customer Form
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">שם פרטי *</Label>
            <Input
              id="firstName"
              {...register("firstName", { required: "חובה למלא שם פרטי" })}
              placeholder="הכניסו את השם הפרטי"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">שם משפחה *</Label>
            <Input
              id="lastName"
              {...register("lastName", { required: "חובה למלא שם משפחה" })}
              placeholder="הכניסו את שם המשפחה"
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="idNumber">תעודת זהות *</Label>
            <Input
              id="idNumber"
              {...register("idNumber", { 
                required: "חובה למלא מספר תעודת זהות",
                validate: (value) => validateIsraeliId(value) || "מספר תעודת זהות לא תקין"
              })}
              placeholder="000000000"
              maxLength={9}
            />
            {errors.idNumber && (
              <p className="text-sm text-red-500">{errors.idNumber.message as string}</p>
            )}
            <p className="text-xs text-muted-foreground">
              הכניסו 9 ספרות ללא רווחים או מקפים
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">תאריך לידה</Label>
            <Input
              id="birthDate"
              type="date"
              {...register("birthDate")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">טלפון נייד *</Label>
            <Input
              id="mobile"
              {...register("mobile", { 
                required: "חובה למלא מספר טלפון",
                validate: (value) => validateIsraeliPhone(value) || "מספר טלפון לא תקין"
              })}
              placeholder="050-0000000"
            />
            {errors.mobile && (
              <p className="text-sm text-red-500">{errors.mobile.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">כתובת אימייל *</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { 
                required: "חובה למלא כתובת אימייל",
                validate: (value) => validateEmail(value) || "כתובת אימייל לא תקינה"
              })}
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message as string}</p>
            )}
          </div>
        </div>
      ) : (
        // Business Customer Form
        <div className="space-y-6">
          <Card className="p-4 bg-blue-50">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Badge variant="outline">עסקי</Badge>
              פרטי התאגיד
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">שם התאגיד *</Label>
                <Input
                  id="companyName"
                  {...register("companyName", { required: "חובה למלא שם התאגיד" })}
                  placeholder="שם החברה"
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500">{errors.companyName.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyId">מספר חברה/ח.פ *</Label>
                <Input
                  id="companyId"
                  {...register("companyId", { 
                    required: "חובה למלא מספר חברה",
                    validate: (value) => validateCompanyId(value) || "מספר חברה לא תקין (8-9 ספרות)"
                  })}
                  placeholder="000000000"
                />
                {errors.companyId && (
                  <p className="text-sm text-red-500">{errors.companyId.message as string}</p>
                )}
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <Label htmlFor="registeredAddress">כתובת רשומה *</Label>
              <Input
                id="registeredAddress"
                {...register("registeredAddress", { required: "חובה למלא כתובת רשומה" })}
                placeholder="רחוב, מספר בית, עיר"
              />
              {errors.registeredAddress && (
                <p className="text-sm text-red-500">{errors.registeredAddress.message as string}</p>
              )}
            </div>
          </Card>

          <Separator />

          <Card className="p-4 bg-green-50">
            <h3 className="font-semibold mb-2">מורשה חתימה</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signatoryName">שם מורשה החתימה *</Label>
                <Input
                  id="signatoryName"
                  {...register("signatoryName", { required: "חובה למלא שם מורשה החתימה" })}
                  placeholder="שם מלא"
                />
                {errors.signatoryName && (
                  <p className="text-sm text-red-500">{errors.signatoryName.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signatoryId">תעודת זהות מורשה חתימה *</Label>
                <Input
                  id="signatoryId"
                  {...register("signatoryId", { 
                    required: "חובה למלא תעודת זהות",
                    validate: (value) => validateIsraeliId(value) || "מספר תעודת זהות לא תקין"
                  })}
                  placeholder="000000000"
                />
                {errors.signatoryId && (
                  <p className="text-sm text-red-500">{errors.signatoryId.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signatoryTitle">תפקיד *</Label>
                <Input
                  id="signatoryTitle"
                  {...register("signatoryTitle", { required: "חובה למלא תפקיד" })}
                  placeholder="מנכ״ל, מנהל כללי, וכו'"
                />
                {errors.signatoryTitle && (
                  <p className="text-sm text-red-500">{errors.signatoryTitle.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">טלפון *</Label>
                <Input
                  id="contactPhone"
                  {...register("contactPhone", { 
                    required: "חובה למלא מספר טלפון",
                    validate: (value) => validateIsraeliPhone(value) || "מספר טלפון לא תקין"
                  })}
                  placeholder="050-0000000"
                />
                {errors.contactPhone && (
                  <p className="text-sm text-red-500">{errors.contactPhone.message as string}</p>
                )}
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <Label htmlFor="contactEmail">אימייל התאגיד *</Label>
              <Input
                id="contactEmail"
                type="email"
                {...register("contactEmail", { 
                  required: "חובה למלא כתובת אימייל",
                  validate: (value) => validateEmail(value) || "כתובת אימייל לא תקינה"
                })}
                placeholder="info@company.com"
              />
              {errors.contactEmail && (
                <p className="text-sm text-red-500">{errors.contactEmail.message as string}</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Address Section for Private Customers */}
      {isPrivate && (
        <>
          <Separator />
          <Card className="p-4">
            <h3 className="font-semibold mb-4">כתובת למשלוח מסמכים</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">רחוב ומספר בית</Label>
                <Input
                  id="street"
                  {...register("street")}
                  placeholder="שם הרחוב ומספר הבית"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">עיר</Label>
                <Input
                  id="city"
                  {...register("city")}
                  placeholder="שם העיר"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">מיקוד</Label>
                <Input
                  id="zipCode"
                  {...register("zipCode")}
                  placeholder="0000000"
                />
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};