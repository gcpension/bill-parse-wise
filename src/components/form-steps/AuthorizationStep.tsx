import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, FileText, Calendar } from "lucide-react";

interface AuthorizationStepProps {
  category: string;
  customerType: string;
  data: any;
  onUpdate: (data: any) => void;
}

const getLegalText = (category: string, customerType: string) => {
  const isPrivate = customerType === 'private';
  const companyPlaceholder = "[שם חברת המעבר]";
  
  switch (category) {
    case 'cellular':
      return isPrivate 
        ? `אני הח"מ, [שם מלא], ת.ז. [מספר ת.ז.], מרשה לחברת ${companyPlaceholder} ו/או למורשיה (להלן: "המיופה") לבצע בשמי ובמקומי את כל הפעולות הנדרשות לצורך ביטול/ניתוק שירותי סלולר אצל ספק(ים) נוכחי(ים) והצטרפות/ניוד לספק חדש, לרבות: הגשת בקשות ניוד מספרים, שינוי בעלות בקו, קבלת/מסירת מידע מזהה הנחוץ לביצוע הפעולות, קבלת/מסירת הודעות ניתוק, חתימה על הצהרות טכניות נלוות, וקבלת מסמכים/חשבוניות סופיות. ייפוי כוח זה אינו מתיר למיופה לבצע פעולות כספיות בחשבון הבנק/כרטיס האשראי שלי, זולת מסירת פרטי חיוב שנמסרו על-ידי לצורך הצטרפות לשירות החדש. ההרשאה מוגבלת לביצוע המעבר המבוקש ותוקפה עד [תאריך פקיעה] או עד להודעה על ביטולה בכתב, לפי המוקדם. ידוע לי כי הספקים רשאים לדרוש אימות זהות וכי אספק כל מסמך נדרש.`
        : `אנחנו, [שם התאגיד], ח.פ. [מס'], מייפים את כוחם של חברת ${companyPlaceholder} ו/או מורשיה לפעול בשמנו לביצוע ניתוק/ביטול שירותי סלולר אצל ספק(ים) נוכחי(ים) והצטרפות/ניוד לספק חדש, לרבות טיפול במאגר קווים מרובים, הגשת בקשות ניוד קבוצתי, שינוי בעלות, קבלת/מסירת מידע מזהה הנחוץ, וקבלת מסמכים/חשבונות סופיים. ההרשאה מוגבלת לביצוע המעבר המבוקש; אינה מקנה סמכות לבצע פעולות כספיות שאינן נחוצות להצטרפות. תוקף עד [תאריך פקיעה] או ביטול בכתב.`;

    case 'tv':
      return isPrivate
        ? `אני הח"מ מאשר/ת לחברת ${companyPlaceholder} לבטל את מנוי הטלוויזיה שלי אצל [שם ספק נוכחי], ולצרף אותי לשירות אצל ספק חדש על-פי בחירתי, לרבות משלוח הודעת ביטול, קבלת/מסירת מידע מנוי לצורך זיהוי, ואישור תנאי ההצטרפות החדשים. אני מודע/ת לכך שייתכנו דמי יציאה/ציוד להחזרה. תוקף עד [תאריך פקיעה] או ביטול.`
        : `אנחנו, [שם התאגיד], ח.פ. [מס'], מאשרים לחברת ${companyPlaceholder} לבטל את מנוי הטלוויזיה שלנו ולהצטרף לספק חדש. תוקף עד [תאריך פקיעה] או ביטול בכתב.`;

    case 'internet':
      return isPrivate
        ? `אני הח"מ מרשה לחברת ${companyPlaceholder} לנתק את שירותי האינטרנט והתשתית אצלי אצל ספק(ים) נוכחי(ים) ולהצטרף לשירות אצל ספק חדש, לרבות שינוי ספק תשתית/ISP, מסירת מזהי קו/לקוח, קבלת הודעות ניתוק והצטרפות, וחתימה על הצהרות טכניות נלוות. ידוע לי על צורך אפשרי בתיאום ציוד קצה/קריאת טכנאי. תוקף עד [תאריך פקיעה] או ביטול.`
        : `אנחנו, [שם התאגיד], ח.פ. [מס'], מרשים לחברת ${companyPlaceholder} לנתק שירותי אינטרנט ולהצטרף לספק חדש. תוקף עד [תאריך פקיעה] או ביטול בכתב.`;

    case 'electricity':
      return isPrivate
        ? `אני הח"מ, [שם מלא], ת.ז. [מס'], מזכה את חברת ${companyPlaceholder} ו/או מיופה מטעמה לקבל בשמי מידע צרכני הנוגע לנקודת הצריכה שלי (מס' חוזה/מונה: [מס']) ולבצע בשמי החלפת ספק חשמל בהתאם לבחירתי, לרבות הגשת בקשה מקוונת, קבלת הודעות אימות (לרבות SMS/Email) ומסירת מענה לאישורים טכניים נדרשים. ייפוי כוח זה מוגבל להליך המעבר, עד [תאריך פקיעה] או ביטול.`
        : `אנחנו, [שם התאגיד], ח.פ. [מס'], ממנים את חברת ${companyPlaceholder} לפעול בשמנו לקבל מידע צרכני על נקודת הצריכה/ות (מס' חוזה/מונה: [___]) ולבצע החלפת ספק חשמל עבורנו, לרבות הגשה מקוונת ואישורים נדרשים. תוקף עד [תאריך פקיעה] או ביטול.`;

    default:
      return `הרשאה כללית לחברת ${companyPlaceholder} לבצע מעבר ספק.`;
  }
};

export const AuthorizationStep = ({ category, customerType, data, onUpdate }: AuthorizationStepProps) => {
  const [formData, setFormData] = useState({
    poaExpiry: data.poaExpiry || '',
    termsAccepted: data.termsAccepted || false,
    understandingDeclaration: data.understandingDeclaration || false,
    companyName: data.companyName || 'חברת מעבר ספקים',
    ...data
  });

  const { register, setValue, watch } = useForm({
    defaultValues: formData
  });

  const watchedValues = watch();

  useEffect(() => {
    const defaultExpiry = new Date();
    defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 1);
    
    if (!formData.poaExpiry) {
      const expiryString = defaultExpiry.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, poaExpiry: expiryString }));
      setValue('poaExpiry', expiryString);
    }
  }, []);

  useEffect(() => {
    const updatedData = { ...formData, ...watchedValues };
    setFormData(updatedData);
    onUpdate(updatedData);
  }, [watchedValues, onUpdate]);

  const legalText = getLegalText(category, customerType);
  const isPrivate = customerType === 'private';

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">הרשאות והצהרות</h2>
        <p className="text-muted-foreground">
          אנא קראו בעיון את ייפוי הכוח ואשרו את הסכמתכם
        </p>
      </div>

      {/* Company Name Input */}
      <Card className="p-4 bg-blue-50">
        <div className="space-y-3">
          <Label htmlFor="companyName">שם חברת המעבר *</Label>
          <Input
            id="companyName"
            {...register("companyName", { required: "חובה למלא שם החברה" })}
            placeholder="הכניסו את שם חברת המעבר"
          />
          <p className="text-xs text-muted-foreground">
            שם החברה יופיע במסמך ייפוי הכוח
          </p>
        </div>
      </Card>

      {/* Power of Attorney Expiry */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">תקופת תוקף ייפוי הכוח</h3>
        </div>
        <div className="space-y-3">
          <Label htmlFor="poaExpiry">תאריך פקיעה *</Label>
          <Input
            id="poaExpiry"
            type="date"
            {...register("poaExpiry", { required: "חובה לבחור תאריך פקיעה" })}
            min={new Date().toISOString().split('T')[0]}
          />
          <p className="text-xs text-muted-foreground">
            ברירת מחדל: 12 חודשים מהיום. ניתן לשנות לפי הצורך
          </p>
        </div>
      </Card>

      {/* Legal Text */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">נוסח ייפוי הכוח</h3>
          <Badge variant="outline">
            {isPrivate ? 'לקוח פרטי' : 'לקוח עסקי'}
          </Badge>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border">
          <Textarea
            value={legalText}
            readOnly
            className="min-h-40 text-sm leading-relaxed resize-none"
          />
        </div>
        
        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <div className="font-medium mb-1">שימו לב:</div>
              <ul className="space-y-1 text-xs">
                <li>• ייפוי הכוח מוגבל רק לביצוע המעבר המבוקש</li>
                <li>• אינו מתיר ביצוע פעולות כספיות</li>
                <li>• ניתן לבטל בכל עת בהודעה בכתב</li>
                <li>• תוקף מוגבל לתקופה שנבחרה</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Consent Checkboxes */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">הצהרות והסכמות נדרשות</h3>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <Checkbox
              id="termsAccepted"
              {...register("termsAccepted", { required: true })}
              onCheckedChange={(checked) => setValue("termsAccepted", checked)}
            />
            <div className="space-y-1">
              <Label htmlFor="termsAccepted" className="text-sm font-medium cursor-pointer">
                קראתי ואני מאשר/ת את התנאים *
              </Label>
              <p className="text-xs text-muted-foreground">
                אישור קריאת ייפוי הכוח והסכמה לתנאיו
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <Checkbox
              id="understandingDeclaration"
              {...register("understandingDeclaration", { required: true })}
              onCheckedChange={(checked) => setValue("understandingDeclaration", checked)}
            />
            <div className="space-y-1">
              <Label htmlFor="understandingDeclaration" className="text-sm font-medium cursor-pointer">
                הצהרת הבנה *
              </Label>
              <div className="text-xs text-muted-foreground space-y-1">
                {isPrivate ? (
                  <div>
                    אני בעל/ת הקווים או מוסמך/כת לפעול מטעמם; ידוע לי על אפשרות קנסות יציאה/חובות;
                    אני מאשר/ת העברת מידע לצורך המעבר.
                  </div>
                ) : (
                  <div>
                    אנו מורשים לפעול בשם התאגיד; ידוע לנו על אפשרות עלויות נוספות;
                    אנו מאשרים העברת מידע לצורך המעבר.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy Notice */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 text-green-600 mt-0.5" />
          <div className="text-sm text-green-800">
            <div className="font-medium mb-1">הצהרת פרטיות</div>
            <p>
              אני מאשר/ת לחברת המעבר לעבד את נתוניי האישיים לצורך ביצוע המעבר,
              לרבות מסירתם לספקים המעורבים, הכל בהתאם לדין החל ולמדיניות הפרטיות של החברה.
              ידוע לי כי אוכל לבקש לעיין, לתקן או למחוק מידע בכפוף לדין.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};