import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface FieldInfoTooltipProps {
  content: string | string[];
  className?: string;
}

export const FieldInfoTooltip = ({ content, className }: FieldInfoTooltipProps) => {
  const contentArray = Array.isArray(content) ? content : [content];
  
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-purple-100 transition-colors cursor-help",
              className
            )}
            onClick={(e) => e.preventDefault()}
          >
            <HelpCircle className="w-4 h-4 text-purple-500 hover:text-purple-700 transition-colors" />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs bg-white border-2 border-purple-200 shadow-xl p-4 pointer-events-auto"
        >
          <div className="space-y-2 text-sm">
            {contentArray.map((line, index) => (
              <p key={index} className="text-gray-700 leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Field information content for different form fields
export const fieldInfo = {
  fullName: "הזן את שמך המלא בדיוק כפי שמופיע בתעודת הזהות. חובה לכתוב גם שם פרטי וגם שם משפחה.",
  idNumber: [
    "מספר תעודת הזהות שלך בן 9 ספרות.",
    "הקפד על דיוק - טעות במספר עלולה לעכב את הבקשה."
  ],
  phone: [
    "מספר טלפון נייד ישראלי פעיל.",
    "נשתמש במספר זה ליצירת קשר ועדכונים בנוגע לבקשה."
  ],
  email: [
    "כתובת אימייל פעילה.",
    "נשלח אישורים ומסמכים חשובים לכתובת זו."
  ],
  currentProvider: "בחר את הספק הנוכחי שלך. אם הספק שלך לא מופיע ברשימה, בחר 'אחר'.",
  targetProvider: "הספק שאליו אתה מבקש לעבור - מוזן אוטומטית לפי המסלול שבחרת.",
  contractNumber: [
    "מספר החוזה שלך עם הספק הנוכחי.",
    "ניתן למצוא אותו בחשבונית האחרונה או באזור האישי באתר הספק."
  ],
  meterNumber: [
    "מספר המונה המותקן בנכס.",
    "מספר זה נמצא על המונה עצמו או בחשבונית החשמל.",
    "יש למלא לפחות שדה אחד: מספר חוזה או מספר מונה."
  ],
  consumptionAddress: [
    "הכתובת המדויקת של נקודת הצריכה.",
    "רחוב, מספר בית, עיר ומיקוד.",
    "חשוב שהכתובת תהיה זהה לזו הרשומה אצל הספק הנוכחי."
  ],
  powerOfAttorneyExpiry: [
    "תאריך תפוגת ייפוי הכוח למעבר ספק.",
    "מומלץ לבחור תאריך של 12 חודשים מהיום.",
    "התאריך חייב להיות עתידי."
  ],
  subscriberIdCopy: [
    "יש להעלות צילום ברור של תעודת הזהות.",
    "קבצים נתמכים: JPG, PNG, PDF.",
    "גודל מקסימלי: 5MB.",
    "ודא שהצילום קריא וכל הפרטים נראים בבירור."
  ],
  attorneyIdCopy: "אם מישהו אחר מייצג אותך בתהליך, יש להעלות צילום של תעודת הזהות של המיופה כוח.",
  phoneNumbers: [
    "מספרי הטלפון שברצונך להעביר לספק החדש.",
    "ניתן להוסיף מספר קווים - לחץ על 'הוסף מספר'.",
    "כל מספר חייב להיות תקין ופעיל."
  ],
  acceptOtpConfirmation: [
    "יש לאשר שיש לך גישה לכרטיס ה-SIM הנוכחי.",
    "תקבל קוד OTP (חד פעמי) בהודעת SMS שיש לאשר.",
    "ללא אישור OTP לא ניתן להשלים את תהליך המעבר."
  ],
  infrastructureProvider: [
    "ספק התשתית מספק את החיבור הפיזי לבית.",
    "לדוגמה: בזק, HOT, או ספק סיב אופטי אחר."
  ],
  currentISP: [
    "ספק שירותי האינטרנט (ISP) הנוכחי שלך.",
    "זה עשוי להיות שונה מספק התשתית."
  ],
  lineIdentifier: [
    "מזהה הקו או מספר המנוי שלך.",
    "ניתן למצוא אותו בחשבונית או ליד מכשיר ה-ONT/מודם.",
    "לפעמים מסומן כ-'מספר קו', 'מזהה ציוד' או 'ONT ID'."
  ],
  requestedPackage: [
    "החבילה או המסלול הספציפי שאתה מבקש.",
    "מוזן אוטומטית בהתאם למסלול שבחרת."
  ],
  isBundleService: [
    "סמן אם התשתית והאינטרנט מסופקים כחבילה אחת.",
    "במקרה כזה עשויות להידרש שתי בקשות נפרדות."
  ],
  billingNotes: "הערות נוספות שתרצה להעביר לגבי החיוב או דרישות מיוחדות.",
  creditCardLast4: [
    "4 הספרות האחרונות של כרטיס האשראי שלך.",
    "משמש לזיהוי בלבד - לא נשמר מידע מלא.",
    "אבטחת המידע היא בראש סדר העדיפויות שלנו."
  ],
  bankName: "בחר את הבנק שבו תרצה שהחיובים יבוצעו בעתיד.",
  lastBill: [
    "חשבונית אחרונה מהספק הנוכחי (אופציונלי).",
    "עוזר לאמת את הפרטים ולזרז את התהליך."
  ]
};
