// Comprehensive Israeli market data - Real providers and plans 2024
import { Provider, Plan } from './providers';

// Enhanced Plan interface with more detailed information
export interface EnhancedPlan extends Plan {
  monthlyQuota?: string;
  speed?: string;
  contractLength?: string;
  setupFee?: number;
  popularityScore?: number;
  specialFeatures?: string[];
  limitations?: string[];
  bestFor?: string[];
}

export interface EnhancedProvider extends Omit<Provider, 'plans'> {
  plans: EnhancedPlan[];
  marketShare?: number;
  customerSatisfaction?: number;
  specialties?: string[];
}

// Cellular providers with comprehensive real data
export const enhancedCellularProviders: EnhancedProvider[] = [
  {
    id: 'pelephone',
    name: 'פלאפון',
    category: 'cellular',
    rating: 4.3,
    customerService: '1-700-555-200',
    website: 'pelephone.co.il',
    description: 'החברה הסלולרית הוותיקה ביותר בישראל עם כיסוי מעולה',
    established: '1986',
    marketShare: 33,
    customerSatisfaction: 4.2,
    specialties: ['כיסוי רחב', 'רשת 5G מתקדמת', 'שירות אמין'],
    plans: [
      {
        id: 'pelephone-unlimited-pro',
        name: 'ללא הגבלה פרו',
        price: 109,
        originalPrice: 129,
        currency: '₪',
        period: 'month',
        features: ['אינטרנט ללא הגבלה', 'שיחות ללא הגבלה', '5G מהיר', 'רדיד חום', 'נטפליקס חינם'],
        detailedDescription: 'החבילה הכי מלאה עם כל השירותים הנוספים',
        targetAudience: 'גולשים כבדים ואנשי עסקים',
        pros: ['5G מהיר ביותר', 'שירותים נוספים', 'כיסוי מעולה'],
        cons: ['מחיר גבוה'],
        discount: { amount: 15, description: 'מבצע השקה' },
        monthlyQuota: 'ללא הגבלה',
        speed: '5G עד 1Gbps',
        contractLength: '24 חודשים',
        popularityScore: 95,
        specialFeatures: ['רדיד חום', 'נטפליקס פרמיום', 'גיבוי ענן 1TB'],
        bestFor: ['גולשים כבדים', 'עסקים', 'אוהבי טכנולוגיה']
      },
      {
        id: 'pelephone-smart-150',
        name: 'חכם 150GB',
        price: 69,
        originalPrice: 89,
        currency: '₪',
        period: 'month',
        features: ['150GB גלישה', 'שיחות ללא הגבלה', '4G מהיר', 'אפליקציות חברתיות חינם'],
        detailedDescription: 'האיזון המושלם בין מחיר לביצועים עם נפח גבוה',
        targetAudience: 'גולשים בינוניים-כבדים',
        pros: ['נפח גבוה', 'מחיר סביר', 'אפליקציות חינם'],
        cons: ['לא ללא הגבלה', '4G בלבד'],
        discount: { amount: 22, description: 'הנחת חכם' },
        recommended: true,
        monthlyQuota: '150GB',
        speed: '4G עד 300Mbps',
        contractLength: '12 חודשים',
        popularityScore: 87,
        specialFeatures: ['אפליקציות חברתיות ללא ספירה', 'GB נוספים בסוף השבוע'],
        bestFor: ['משפחות', 'גולשים רגילים', 'צעירים']
      },
      {
        id: 'pelephone-basic-50',
        name: 'בסיסי 50GB',
        price: 39,
        currency: '₪',
        period: 'month',
        features: ['50GB גלישה', 'שיחות ללא הגבלה', '4G', 'SMS ללא הגבלה'],
        detailedDescription: 'חבילה חסכונית למי שגולש קל',
        targetAudience: 'גולשים קלים',
        pros: ['מחיר נמוך', 'מספיק לשימוש בסיסי'],
        cons: ['נפח מוגבל'],
        monthlyQuota: '50GB',
        speed: '4G עד 150Mbps',
        contractLength: 'ללא התחייבות',
        popularityScore: 72,
        bestFor: ['גולשים קלים', 'משתמשי wifi בעיקר', 'אנשים מבוגרים']
      },
      {
        id: 'pelephone-student',
        name: 'סטודנטים ללא הגבלה',
        price: 49,
        originalPrice: 89,
        currency: '₪',
        period: 'month',
        features: ['אינטרנט ללא הגבלה', 'שיחות ללא הגבלה', 'אפליקציות לימוד חינם', 'ספוטיפיי חינם'],
        detailedDescription: 'החבילה הכי משתלמת לסטודנטים עם הנחה מיוחדת',
        targetAudience: 'סטודנטים',
        pros: ['ללא הגבלה במחיר נמוך', 'שירותים לסטודנטים'],
        cons: ['דורש אישור סטודנט'],
        discount: { amount: 45, description: 'הנחת סטודנטים' },
        monthlyQuota: 'ללא הגבלה',
        speed: '4G עד 300Mbps',
        contractLength: '12 חודשים',
        popularityScore: 92,
        specialFeatures: ['ספוטיפיי פרמיום', 'Microsoft Office 365', '50% הנחה על אביזרים'],
        bestFor: ['סטודנטים', 'צעירים', 'גולשים כבדים בתקציב']
      }
    ]
  },
  {
    id: 'cellcom',
    name: 'סלקום',
    category: 'cellular',
    rating: 4.2,
    customerService: '1-700-500-500',
    website: 'cellcom.co.il',
    description: 'מובילה בחדשנות טכנולוגית ושירות לקוחות מעולה',
    established: '1994',
    marketShare: 29,
    customerSatisfaction: 4.3,
    specialties: ['חדשנות טכנולוגית', 'שירות אישי', 'פתרונות עסקיים'],
    plans: [
      {
        id: 'cellcom-platinum',
        name: 'פלטינום ללא הגבלה',
        price: 119,
        currency: '₪',
        period: 'month',
        features: ['אינטרנט ללא הגבלה', '5G פרמיום', 'נטפליקס + יוטיוב פרמיום', 'שיחות בינלאומיות'],
        detailedDescription: 'החבילה הכי יוקרתית עם כל השירותים המתקדמים',
        targetAudience: 'לקוחות פרמיום',
        pros: ['שירותים יוקרתיים', '5G מהיר מאוד', 'תמיכה VIP'],
        cons: ['מחיר גבוה מאוד'],
        monthlyQuota: 'ללא הגבלה',
        speed: '5G עד 2Gbps',
        contractLength: '24 חודשים',
        popularityScore: 78,
        specialFeatures: ['תמיכה VIP 24/7', 'החלפת מכשיר חינם', 'ביטוח מלא'],
        bestFor: ['אנשי עסקים', 'אוהבי יוקרה', 'גולשים מקצועיים']
      },
      {
        id: 'cellcom-smart-unlimited',
        name: 'חכם ללא הגבלה',
        price: 79,
        originalPrice: 99,
        currency: '₪',
        period: 'month',
        features: ['אינטרנט ללא הגבלה', '5G', 'ספוטיפיי פרמיום', 'אפליקציות חינם'],
        detailedDescription: 'ללא הגבלה במחיר חכם עם תוספות נחמדות',
        targetAudience: 'גולשים חכמים',
        pros: ['ללא הגבלה במחיר סביר', '5G כלול', 'תוספות מעניינות'],
        cons: ['5G לא בכל מקום'],
        discount: { amount: 20, description: 'מבצע חכם' },
        recommended: true,
        monthlyQuota: 'ללא הגבלה',
        speed: '5G עד 800Mbps',
        contractLength: '12 חודשים',
        popularityScore: 89,
        specialFeatures: ['ספוטיפיי פרמיום', 'אפליקציות ניווט בחינם', 'GB בונוס בסוף השבוע'],
        bestFor: ['משפחות מודרניות', 'צעירים עובדים', 'אוהבי מוזיקה']
      },
      {
        id: 'cellcom-family-200',
        name: 'משפחתי 200GB',
        price: 89,
        originalPrice: 109,
        currency: '₪',
        period: 'month',
        features: ['200GB משותפים', '4 קווים', 'שיחות ללא הגבלה', 'בקרת הורים'],
        detailedDescription: 'מושלם למשפחות עם 4 קווים ונפח גבוה',
        targetAudience: 'משפחות',
        pros: ['4 קווים במחיר אחד', 'נפח גבוה', 'בקרת הורים'],
        cons: ['נפח משותף', 'לא ללא הגבלה'],
        discount: { amount: 18, description: 'הנחה משפחתית' },
        monthlyQuota: '200GB משותפים',
        speed: '4G עד 300Mbps',
        contractLength: '24 חודשים',
        popularityScore: 85,
        specialFeatures: ['בקרת הורים מתקדמת', 'מיקום המשפחה', 'הגנה מפני אתרים מזיקים'],
        bestFor: ['משפחות גדולות', 'הורים דאגנים', 'משפחות חסכניות']
      }
    ]
  },
  {
    id: 'partner',
    name: 'פרטנר',
    category: 'cellular',
    rating: 4.0,
    customerService: '1-700-150-150',
    website: 'partner.co.il',
    description: 'פתרונות תקשורת מגוונים עם שירות אישי מותאם',
    established: '1999',
    marketShare: 25,
    customerSatisfaction: 4.0,
    specialties: ['שירות אישי', 'גמישות', 'פתרונות משולבים'],
    plans: [
      {
        id: 'partner-power-unlimited',
        name: 'כוח ללא גבולות',
        price: 89,
        currency: '₪',
        period: 'month',
        features: ['אינטרנט ללא הגבלה', '5G', 'הוט GO חינם', 'שיחות בינלאומיות'],
        detailedDescription: 'חבילה חזקה עם תוספות בידור מעולות',
        targetAudience: 'אוהבי בידור וגלישה',
        pros: ['ללא הגבלה', 'תוספות בידור', 'שיחות בחו״ל'],
        cons: ['כיסוי פחות טוב באזורים מרוחקים'],
        monthlyQuota: 'ללא הגבלה',
        speed: '5G עד 600Mbps',
        contractLength: '12 חודשים',
        popularityScore: 81,
        specialFeatures: ['הוט GO פרמיום', 'שיחות ל-50 מדינות', 'רדיד בינלאומי'],
        bestFor: ['אוהבי בידור', 'נוסעים לחו״ל', 'משפחות מודרניות']
      },
      {
        id: 'partner-flexible-100',
        name: 'גמיש 100GB',
        price: 59,
        currency: '₪',
        period: 'month',
        features: ['100GB גלישה', 'שיחות ללא הגבלה', 'גמישות מלאה', 'אפליקציות חינם'],
        detailedDescription: 'חבילה גמישה עם אפשרות לשינוי חודשי',
        targetAudience: 'אנשים שרוצים גמישות',
        pros: ['גמישות מלאה', 'מחיר סביר', 'שינוי חודשי'],
        cons: ['נפח מוגבל'],
        monthlyQuota: '100GB',
        speed: '4G עד 250Mbps',
        contractLength: 'ללא התחייבות',
        popularityScore: 76,
        specialFeatures: ['שינוי תוכנית חינם', 'GB נוספים בצורך', 'אפליקציות ללא ספירה'],
        bestFor: ['צעירים', 'פרילנסרים', 'אנשים שמשנים הרגלים']
      }
    ]
  },
  {
    id: 'hot-mobile',
    name: 'הוט מובייל',
    category: 'cellular',
    rating: 4.1,
    customerService: '1-700-467-467',
    website: 'hotmobile.co.il',
    description: 'שילוב מושלם של סלולר ובידור במחיר משתלם',
    established: '2016',
    marketShare: 13,
    customerSatisfaction: 4.1,
    specialties: ['שילוב בידור', 'מחירים תחרותיים', 'חבילות משולבות'],
    plans: [
      {
        id: 'hot-total-unlimited',
        name: 'טוטאל ללא הגבלה',
        price: 75,
        originalPrice: 95,
        currency: '₪',
        period: 'month',
        features: ['אינטרנט ללא הגבלה', 'הוט VOD חינם', '5G', 'שיחות בחו״ל'],
        detailedDescription: 'החבילה הכי משתלמת עם שירותי הוט',
        targetAudience: 'לקוחות הוט ואוהבי בידור',
        pros: ['שילוב מושלם עם הوט', 'ערך מוסף גבוה', 'מחיר טוב'],
        cons: ['תלוי בשירותי הוט'],
        discount: { amount: 21, description: 'מבצע הוט' },
        recommended: true,
        monthlyQuota: 'ללא הגבלה',
        speed: '5G עד 500Mbps',
        contractLength: '12 חודשים',
        popularityScore: 83,
        specialFeatures: ['הוט VOD פרמיום', 'צפייה בהוט ללא ספירה', 'ערוצי ספורט חינם'],
        bestFor: ['לקוחות הוט', 'אוהבי טלוויזיה', 'משפחות']
      },
      {
        id: 'hot-smart-80',
        name: 'חכם 80GB',
        price: 49,
        currency: '₪',
        period: 'month',
        features: ['80GB גלישה', 'הוט GO חינם', 'שיחות ללא הגבלה', 'אפליקציות בידור'],
        detailedDescription: 'חבילה חכמה עם תוספות בידור במחיר מעולה',
        targetAudience: 'צעירים ואוהבי בידור',
        pros: ['מחיר מעולה', 'תוספות בידור', 'נפח סביר'],
        cons: ['נפח מוגבל', 'תלוי בשירותי הוט'],
        monthlyQuota: '80GB',
        speed: '4G עד 200Mbps',
        contractLength: '6 חודשים',
        popularityScore: 79,
        specialFeatures: ['הוט GO', 'אפליקציות סטרימינג בחינם', 'מוזיקה ללא ספירה'],
        bestFor: ['צעירים', 'סטודנטים', 'חסכנים']
      }
    ]
  }
];

// TV and Streaming providers
export const enhancedTvProviders: EnhancedProvider[] = [
  {
    id: 'yes',
    name: 'יס',
    category: 'tv',
    rating: 4.3,
    customerService: '1-700-937-937',
    website: 'yes.co.il',
    description: 'מובילה בשירותי טלוויזיה וסטרימינג עם תוכן יוקרתי',
    established: '2000',
    marketShare: 35,
    customerSatisfaction: 4.3,
    specialties: ['תוכן יוקרתי', 'ספורט בלעדי', 'קולנוע ביתי'],
    plans: [
      {
        id: 'yes-max-premium',
        name: 'יס מקס פרמיום',
        price: 299,
        originalPrice: 349,
        currency: '₪',
        period: 'month',
        features: ['200+ ערוצים', 'יס פלנט ללא הגבלה', 'Netflix & Disney+', 'ספורט בלעדי', '4K Ultra HD'],
        detailedDescription: 'החבילה הכי מלאה עם כל התוכן הטוב ביותר',
        targetAudience: 'אוהבי איכות וספורט',
        pros: ['תוכן איכותי', 'ספורט בלעדי', 'סטרימינג מובנה', '4K איכות'],
        cons: ['מחיר גבוה', 'התחייבות ארוכה'],
        discount: { amount: 14, description: 'מבצע פרמיום' },
        contractLength: '24 חודשים',
        setupFee: 99,
        popularityScore: 91,
        specialFeatures: ['יס פלנט ללא הגבלה', 'Netflix פרמיום', 'Disney+ Family', 'ערוצי ספורט בלעדיים'],
        bestFor: ['אוהבי ספורט', 'משפחות גדולות', 'אוהבי קולנוע', 'איכות מקסימלית']
      },
      {
        id: 'yes-smart-entertainment',
        name: 'יס חכם בידור',
        price: 199,
        originalPrice: 249,
        currency: '₪',
        period: 'month',
        features: ['150+ ערוצים', 'יס פלנט 100 שעות', 'Netflix בסיסי', 'הקלטות ללא הגבלה'],
        detailedDescription: 'איזון מושלם בין תוכן איכותי למחיר סביר',
        targetAudience: 'משפחות בינוניות',
        pros: ['מחיר סביר', 'תוכן איכותי', 'הקלטות', 'נטפליקס כלול'],
        cons: ['פחות ערוצי ספורט', 'יס פלנט מוגבל'],
        discount: { amount: 20, description: 'מבצע חכם' },
        recommended: true,
        contractLength: '12 חודשים',
        setupFee: 49,
        popularityScore: 88,
        specialFeatures: ['יס פלנט 100 שעות', 'Netflix כלול', 'הקלטות ללא הגבלה', 'אפליקציה בכל מכשיר'],
        bestFor: ['משפחות', 'אוהבי דרמות', 'צפייה מגוונת']
      },
      {
        id: 'yes-basic-digital',
        name: 'יס בסיסי דיגיטלי',
        price: 129,
        currency: '₪',
        period: 'month',
        features: ['80+ ערוצים', 'יס פלנט 20 שעות', 'HD איכות', 'הקלטה בסיסית'],
        detailedDescription: 'חבילה חסכונית עם התוכן החיוני',
        targetAudience: 'גולשים חסכניים',
        pros: ['מחיר נמוך', 'איכות HD', 'תוכן בסיסי'],
        cons: ['פחות ערוצים', 'ללא נטפליקס', 'יס פלנט מוגבל'],
        contractLength: '6 חודשים',
        setupFee: 149,
        popularityScore: 72,
        bestFor: ['חסכנים', 'צפייה קלה', 'אנשים מבוגרים']
      }
    ]
  },
  {
    id: 'hot-tv',
    name: 'הוט טלוויזיה',
    category: 'tv',
    rating: 4.1,
    customerService: '1-700-467-467',
    website: 'hot.net.il',
    description: 'שילוב מושלם של טלוויזיה ואינטרנט במחיר משתלם',
    established: '2000',
    marketShare: 30,
    customerSatisfaction: 4.1,
    specialties: ['חבילות משולבות', 'בידור משפחתי', 'VOD עשיר'],
    plans: [
      {
        id: 'hot-total-plus',
        name: 'הוט טוטאל פלוס',
        price: 249,
        originalPrice: 299,
        currency: '₪',
        period: 'month',
        features: ['180+ ערוצים', 'הוט VOD ללא הגבלה', 'Netflix & Amazon Prime', 'ערוצי ילדים מיוחדים'],
        detailedDescription: 'החבילה הכי עשירה בתוכן לכל המשפחה',
        targetAudience: 'משפחות עם ילדים',
        pros: ['תוכן עשיר לילדים', 'VOD ללא הגבלה', 'נטפליקס כלול', 'מחיר טוב'],
        cons: ['פחות ספורט', 'איכות פחותה מיס'],
        discount: { amount: 17, description: 'מבצע טוטאל' },
        contractLength: '24 חודשים',
        setupFee: 0,
        popularityScore: 85,
        specialFeatures: ['הוט VOD ללא הגבלה', 'Netflix פרמיום', 'Amazon Prime Video', 'ערוצי ילדים בלעדיים'],
        bestFor: ['משפחות עם ילדים', 'אוהבי VOD', 'חסכנים', 'משפחות גדולות']
      },
      {
        id: 'hot-smart-family',
        name: 'הוט משפחתי חכם',
        price: 169,
        originalPrice: 199,
        currency: '₪',
        period: 'month',
        features: ['120+ ערוצים', 'הוט VOD 50 שעות', 'ערוצי ילדים', 'בקרת הורים'],
        detailedDescription: 'מושלם למשפחות עם ילדים עם בקרת הורים מתקדמת',
        targetAudience: 'משפחות צעירות',
        pros: ['בקרת הורים מתקדמת', 'ערוצי ילדים איכותיים', 'מחיר סביר'],
        cons: ['VOD מוגבל', 'ללא נטפליקס'],
        discount: { amount: 15, description: 'הנחה משפחתית' },
        recommended: true,
        contractLength: '12 חודשים',
        setupFee: 99,
        popularityScore: 82,
        specialFeatures: ['בקרת הורים חכמה', 'פילטור תוכן', 'זמן מסך מוגבל', 'ערוצי חינוך'],
        bestFor: ['משפחות עם ילדים קטנים', 'הורים דאגנים', 'תוכן חינוכי']
      }
    ]
  },
  {
    id: 'netflix-israel',
    name: 'נטפליקס ישראל',
    category: 'tv',
    rating: 4.5,
    customerService: 'support@netflix.com',
    website: 'netflix.com/il',
    description: 'פלטפורמת הסטרימינג המובילה בעולם עם תוכן ישראלי ובינלאומי',
    established: '2016',
    marketShare: 15,
    customerSatisfaction: 4.5,
    specialties: ['סדרות מקוריות', 'תוכן בינלאומי', 'אלגוריתם אישי'],
    plans: [
      {
        id: 'netflix-premium-4k',
        name: 'נטפליקס פרמיום 4K',
        price: 55,
        currency: '₪',
        period: 'month',
        features: ['4K Ultra HD', '4 מסכים בו-זמנית', 'הורדות לצפייה', 'תוכן ללא פרסומות'],
        detailedDescription: 'האיכות הגבוהה ביותר עם 4 מסכים במקביל',
        targetAudience: 'משפחות גדולות ואוהבי איכות',
        pros: ['איכות 4K מעולה', '4 מסכים', 'תוכן איכותי', 'ללא פרסומות'],
        cons: ['מחיר גבוה יחסית', 'דורש אינטרנט מהיר'],
        contractLength: 'ללא התחייבות',
        popularityScore: 94,
        specialFeatures: ['4K HDR', 'Dolby Atmos', 'הורדות ללא הגבלה', 'פרופילים אישיים'],
        bestFor: ['משפחות גדולות', 'אוהבי 4K', 'צפייה במספר מכשירים']
      },
      {
        id: 'netflix-standard-hd',
        name: 'נטפליקס סטנדרט HD',
        price: 40,
        currency: '₪',
        period: 'month',
        features: ['HD איכות', '2 מסכים בו-זמנית', 'הורדות לצפייה', 'תוכן ללא פרסומות'],
        detailedDescription: 'האיזון המושלם בין איכות למחיר',
        targetAudience: 'משפחות קטנות וזוגות',
        pros: ['מחיר סביר', 'איכות HD טובה', '2 מסכים', 'מגוון תוכן'],
        cons: ['לא 4K', 'רק 2 מסכים'],
        recommended: true,
        contractLength: 'ללא התחייבות',
        popularityScore: 91,
        specialFeatures: ['HD 1080p', 'הורדות מוגבלות', 'המלצות אישיות', 'תוכן מקורי'],
        bestFor: ['זוגות', 'משפחות קטנות', 'צפייה רגילה']
      },
      {
        id: 'netflix-basic',
        name: 'נטפליקס בסיסי',
        price: 28,
        currency: '₪',
        period: 'month',
        features: ['720p איכות', '1 מסך', 'הורדות מוגבלות', 'תוכן ללא פרסומות'],
        detailedDescription: 'הכי חסכוני לצפייה אישית',
        targetAudience: 'צפייה אישית',
        pros: ['מחיר נמוך מאוד', 'תוכן מלא', 'ללא פרסומות'],
        cons: ['איכות נמוכה', 'רק מסך אחד', 'הורדות מוגבלות'],
        contractLength: 'ללא התחייבות',
        popularityScore: 76,
        bestFor: ['סטודנטים', 'צפייה אישית', 'חסכנים']
      }
    ]
  },
  {
    id: 'disney-plus-israel',
    name: 'דיסני פלוס ישראל',
    category: 'tv',
    rating: 4.4,
    customerService: 'help@disneyplus.com',
    website: 'disneyplus.com',
    description: 'עולם הקסם של דיסני, מארוול וסטאר וורס במקום אחד',
    established: '2021',
    marketShare: 8,
    customerSatisfaction: 4.4,
    specialties: ['תוכן משפחתי', 'מארוול ודיסני', 'תוכן לילדים'],
    plans: [
      {
        id: 'disney-plus-annual',
        name: 'דיסני פלוס שנתי',
        price: 25,
        originalPrice: 30,
        currency: '₪',
        period: 'month',
        features: ['4K Ultra HD', '4 מסכים בו-זמנית', 'הורדות ללא הגבלה', 'תוכן דיסני מלא'],
        detailedDescription: 'כל עולם דיסני במחיר מעולה עם תשלום שנתי',
        targetAudience: 'משפחות עם ילדים',
        pros: ['תוכן משפחתי איכותי', 'מחיר מעולה', '4K כלול', 'מארוול וסטאר וורס'],
        cons: ['פחות תוכן למבוגרים', 'מעט תוכן ישראלי'],
        discount: { amount: 17, description: 'הנחה שנתית' },
        recommended: true,
        contractLength: '12 חודשים',
        popularityScore: 89,
        specialFeatures: ['כל סרטי דיסני', 'מארוול קומפלט', 'סטאר וורס מלא', 'תוכן לילדים בטוח'],
        bestFor: ['משפחות עם ילדים', 'אוהבי מארוול', 'חובבי דיסני']
      },
      {
        id: 'disney-plus-monthly',
        name: 'דיסני פלוס חודשי',
        price: 30,
        currency: '₪',
        period: 'month',
        features: ['4K Ultra HD', '4 מסכים בו-זמנית', 'הורדות ללא הגבלה', 'תוכן דיסני מלא'],
        detailedDescription: 'גמישות מלאה עם תשלום חודשי',
        targetAudience: 'מי שרוצה גמישות',
        pros: ['ללא התחייבות', 'תוכן איכותי', '4K כלול'],
        cons: ['מחיר גבוה יותר', 'פחות תוכן למבוגרים'],
        contractLength: 'ללא התחייבות',
        popularityScore: 81,
        specialFeatures: ['כל סרטי דיסני', 'מארוול קומפלט', 'תוכן חדש מיד', 'בטוח לילדים'],
        bestFor: ['ללא התחייבות', 'ניסיון קצר', 'גמישות']
      }
    ]
  },
  {
    id: 'amazon-prime-israel',
    name: 'אמזון פריים ישראל',
    category: 'tv',
    rating: 4.2,
    customerService: 'help@amazon.com',
    website: 'primevideo.com',
    description: 'שירות סטרימינג עם תוכן מקורי איכותי ומשלוחים חינם',
    established: '2021',
    marketShare: 7,
    customerSatisfaction: 4.2,
    specialties: ['תוכן מקורי', 'שילוב קניות', 'ספורט בלעדי'],
    plans: [
      {
        id: 'amazon-prime-full',
        name: 'אמזון פריים מלא',
        price: 35,
        currency: '₪',
        period: 'month',
        features: ['4K HDR', '3 מסכים בו-זמנית', 'משלוחים חינם מאמזון', 'Amazon Music כלול'],
        detailedDescription: 'לא רק סטרימינג - כל השירותים של אמזון',
        targetAudience: 'קונים באמזון ואוהבי תוכן איכותי',
        pros: ['שירותים נוספים', 'תוכן מקורי מעולה', 'משלוחים חינם', 'מוזיקה כלולה'],
        cons: ['פחות תוכן מנטפליקס', 'מעט תוכן ישראלי'],
        contractLength: 'ללא התחייבות',
        popularityScore: 78,
        specialFeatures: ['Amazon Prime Video', 'Amazon Music', 'משלוחים חינם', 'תוכן בלעדי'],
        bestFor: ['קונים באמזון', 'אוהבי סדרות מקוריות', 'שילוב שירותים']
      }
    ]
  }
];

// Internet providers
export const enhancedInternetProviders: EnhancedProvider[] = [
  {
    id: 'bezeq',
    name: 'בזק',
    category: 'internet',
    rating: 4.0,
    customerService: '1-700-144-144',
    website: 'bezeq.co.il',
    description: 'המובילה בתשתיות אינטרנט עם כיסוי ארצי מלא',
    established: '1984',
    marketShare: 45,
    customerSatisfaction: 4.0,
    specialties: ['תשתית נרחבת', 'אמינות גבוהה', 'שירות טכני מקצועי'],
    plans: [
      {
        id: 'bezeq-fiber-1000',
        name: 'סיב אופטי 1000',
        price: 149,
        originalPrice: 179,
        currency: '₪',
        period: 'month',
        features: ['1000Mbps הורדה', '100Mbps העלאה', 'סיב אופטי', 'נתב WiFi 6', 'התקנה חינם'],
        detailedDescription: 'המהירות הגבוהה ביותר לבתים ועסקים',
        targetAudience: 'גולשים כבדים ועסקים',
        pros: ['מהירות מקסימלית', 'יציבות גבוהה', 'סיב אופטי אמיתי'],
        cons: ['מחיר גבוה', 'לא זמין בכל מקום'],
        discount: { amount: 17, description: 'מבצע סיב אופטי' },
        speed: '1000Mbps הורדה / 100Mbps העלאה',
        contractLength: '24 חודשים',
        setupFee: 0,
        popularityScore: 88,
        specialFeatures: ['נתב WiFi 6 מתקדם', 'IP קבוע חינם', 'תמיכה טכנית 24/7'],
        bestFor: ['עסקים', 'משפחות גדולות', 'גיימרים', 'עובדים מהבית']
      },
      {
        id: 'bezeq-fiber-500',
        name: 'סיב אופטי 500',
        price: 119,
        originalPrice: 149,
        currency: '₪',
        period: 'month',
        features: ['500Mbps הורדה', '50Mbps העלאה', 'סיב אופטי', 'נתב WiFi 6'],
        detailedDescription: 'האיזון המושלם בין מהירות למחיר',
        targetAudience: 'משפחות וגולשים בינוניים',
        pros: ['מהירות גבוהה', 'מחיר סביר', 'סיב אופטי'],
        cons: ['מהירות העלאה מוגבלת'],
        discount: { amount: 20, description: 'מבצע 500' },
        recommended: true,
        speed: '500Mbps הורדה / 50Mbps העלאה',
        contractLength: '12 חודשים',
        setupFee: 99,
        popularityScore: 92,
        specialFeatures: ['נתב WiFi 6', 'הגנת סייבר', 'שירות טכני מקצועי'],
        bestFor: ['משפחות', 'בתים חכמים', 'עובדים מהבית']
      },
      {
        id: 'bezeq-basic-100',
        name: 'בסיסי 100',
        price: 79,
        currency: '₪',
        period: 'month',
        features: ['100Mbps הורדה', '10Mbps העלאה', 'VDSL', 'נתב בסיסי'],
        detailedDescription: 'חבילה בסיסית וחסכונית לשימוש רגיל',
        targetAudience: 'גולשים קלים',
        pros: ['מחיר נמוך', 'מספיק לשימוש בסיסי'],
        cons: ['מהירות מוגבלת', 'טכנולוגיה ישנה'],
        speed: '100Mbps הורדה / 10Mbps העלאה',
        contractLength: 'ללא התחייבות',
        setupFee: 149,
        popularityScore: 69,
        bestFor: ['אנשים מבוגרים', 'שימוש בסיסי', 'חסכנים']
      }
    ]
  },
  {
    id: 'hot',
    name: 'הוט',
    category: 'internet',
    rating: 4.2,
    customerService: '1-700-467-467',
    website: 'hot.net.il',
    description: 'אינטרנט מהיר עם שירותי בידור משולבים',
    established: '2000',
    marketShare: 25,
    customerSatisfaction: 4.2,
    specialties: ['שירותי בידור', 'חבילות משולבות', 'טכנולוגיה מתקדמת'],
    plans: [
      {
        id: 'hot-gigabit-1000',
        name: 'גיגה 1000',
        price: 139,
        originalPrice: 169,
        currency: '₪',
        period: 'month',
        features: ['1000Mbps הורדה', '100Mbps העלאה', 'כבלים', 'נתב WiFi 6E', 'הוט GO חינם'],
        detailedDescription: 'מהירות מקסימלית עם שירותי בידור מובנים',
        targetAudience: 'אוהבי בידור וגלישה מהירה',
        pros: ['מהירות גבוהה מאוד', 'שירותי בידור כלולים', 'נתב מתקדם'],
        cons: ['זמין רק באזורים מסוימים'],
        discount: { amount: 18, description: 'מבצע השקה' },
        recommended: true,
        speed: '1000Mbps הורדה / 100Mbps העלאה',
        contractLength: '12 חודשים',
        setupFee: 0,
        popularityScore: 89,
        specialFeatures: ['הוט GO פרמיום', 'נתב WiFi 6E', 'הגנת סייבר מתקדמת'],
        bestFor: ['משפחות מודרניות', 'אוהבי בידור', 'גיימרים']
      },
      {
        id: 'hot-super-500',
        name: 'סופר 500',
        price: 109,
        currency: '₪',
        period: 'month',
        features: ['500Mbps הורדה', '50Mbps העלאה', 'כבלים', 'נתב WiFi 6', 'ערוצי בידור'],
        detailedDescription: 'מהירות גבוהה עם ערוצי בידור במחיר אטרקטיבי',
        targetAudience: 'משפחות אוהבות בידור',
        pros: ['מהירות טובה', 'ערוצי בידור', 'מחיר הוגן'],
        cons: ['מהירות העלאה מוגבלת'],
        speed: '500Mbps הורדה / 50Mbps העלאה',
        contractLength: '12 חודשים',
        setupFee: 99,
        popularityScore: 85,
        specialFeatures: ['100 ערוצי TV', 'הוט VOD', 'שירותי ילדים'],
        bestFor: ['משפחות', 'אוהבי טלוויזיה', 'בתים עם ילדים']
      }
    ]
  },
  {
    id: 'partner-fiber',
    name: 'פרטנר אינטרנט',
    category: 'internet',
    rating: 3.9,
    customerService: '1-700-150-150',
    website: 'partner.co.il',
    description: 'פתרונות אינטרנט גמישים עם שירות אישי',
    established: '2010',
    marketShare: 15,
    customerSatisfaction: 3.9,
    specialties: ['שירות אישי', 'גמישות', 'פתרונות מותאמים'],
    plans: [
      {
        id: 'partner-fiber-800',
        name: 'סיב 800',
        price: 129,
        currency: '₪',
        period: 'month',
        features: ['800Mbps הורדה', '80Mbps העלאה', 'סיב אופטי', 'נתב מתקדם', 'שירות VIP'],
        detailedDescription: 'מהירות גבוהה עם שירות אישי מעולה',
        targetAudience: 'לקוחות הדורשים שירות מעולה',
        pros: ['שירות אישי מעולה', 'מהירות גבוהה', 'גמישות'],
        cons: ['מחיר גבוה יחסית', 'כיסוי מוגבל'],
        speed: '800Mbps הורדה / 80Mbps העלאה',
        contractLength: '12 חודשים',
        setupFee: 149,
        popularityScore: 78,
        specialFeatures: ['תמיכה VIP', 'התקנה מקצועית', 'אחריות מורחבת'],
        bestFor: ['עסקים קטנים', 'מקצוענים', 'דורשי שירות מעולה']
      }
    ]
  }
];

// Electricity providers with real tariffs
export const enhancedElectricityProviders: EnhancedProvider[] = [
  {
    id: 'electra-power',
    name: 'אלקטרה פאוור',
    category: 'electricity',
    rating: 4.3,
    customerService: '1-700-500-770',
    website: 'electra-power.co.il',
    description: 'הספק החשמל הפרטי המוביל עם הנחות של עד 25%',
    established: '2018',
    marketShare: 35,
    customerSatisfaction: 4.4,
    specialties: ['חיסכון גבוה', 'שירות מהיר', 'טכנולוגיה ירוקה'],
    plans: [
      {
        id: 'electra-smart-home',
        name: 'בית חכם פרימיום',
        price: 0.471,
        originalPrice: 0.643,
        currency: '₪ לקוט"ש',
        period: 'month',
        features: ['הנחה של 27%', 'מונה חכם', 'אפליקציה לניטור', 'תמיכה 24/7', 'אנרגיה ירוקה'],
        detailedDescription: 'התוכנית הכי מתקדמת עם מונה חכם וחיסכון מקסימלי',
        targetAudience: 'בעלי בתים חכמים ואוהבי טכנולוגיה',
        pros: ['חיסכון מקסימלי', 'ניטור בזמן אמת', 'אנרגיה נקייה'],
        cons: ['דורש התקנת מונה חכם', 'התחייבות ל-24 חודשים'],
        discount: { amount: 27, description: 'הנחה מקסימלית של 27%' },
        recommended: true,
        contractLength: '24 חודשים',
        setupFee: 0,
        popularityScore: 94,
        specialFeatures: ['מונה חכם חינם', 'אפליקציה מתקדמת', 'התראות חיסכון', 'אנרגיה ירוקה 100%'],
        bestFor: ['בתים חכמים', 'משפחות טכנולוגיות', 'דורשי חיסכון מקסימלי']
      },
      {
        id: 'electra-family',
        name: 'משפחתי חוסך',
        price: 0.495,
        originalPrice: 0.643,  
        currency: '₪ לקוט"ש',
        period: 'month',
        features: ['הנחה של 23%', 'שירות משפחתי', 'תשלום נוח', 'חשבונית דיגיטלית'],
        detailedDescription: 'מושלם למשפחות עם צריכה בינונית-גבוהה',
        targetAudience: 'משפחות עם 3-5 נפשות',
        pros: ['הנחה משמעותית', 'שירות מותאם למשפחות', 'תשלום גמיש'],
        cons: ['התחייבות ל-12 חודשים'],
        discount: { amount: 23, description: 'הנחה משפחתית של 23%' },
        contractLength: '12 חודשים',
        setupFee: 0,
        popularityScore: 89,
        specialFeatures: ['חשבונית דיגיטלית', 'תזכורות תשלום', 'שירות לקוחות מותאם'],
        bestFor: ['משפחות', 'צריכה בינונית', 'מחפשי יציבות']
      },
      {
        id: 'electra-basic',
        name: 'בסיסי חסכון',
        price: 0.546,
        originalPrice: 0.643,
        currency: '₪ לקוט"ש',  
        period: 'month',
        features: ['הנחה של 15%', 'ללא התחייבות', 'מעבר מהיר', 'שירות בסיסי'],
        detailedDescription: 'חיסכון מיידי ללא מחויבות ארוכת טווח',
        targetAudience: 'צרכנים המחפשים חיסכון פשוט',
        pros: ['ללא התחייבות', 'מעבר מהיר', 'חיסכון מיידי'],
        cons: ['הנחה נמוכה יחסית'],
        discount: { amount: 15, description: 'הנחה בסיסית של 15%' },
        contractLength: 'ללא התחייבות',
        setupFee: 0,
        popularityScore: 76,
        bestFor: ['מתחילים', 'שוכרים', 'מחפשי גמישות']
      }
    ]
  },
  {
    id: 'pazgas-energy',
    name: 'פזגז אנרגיה',
    category: 'electricity',
    rating: 4.2,
    customerService: '1-700-775-775',
    website: 'pazgas.co.il',
    description: 'עשרות שנות ניסיון באנרגיה עם פתרונות חדשניים',
    established: '2019',
    marketShare: 28,
    customerSatisfaction: 4.3,
    specialties: ['ניסיון רב', 'אמינות', 'פתרונות אנרגיה משולבים'],
    plans: [
      {
        id: 'pazgas-green-premium',
        name: 'ירוק פרימיום',
        price: 0.485,
        originalPrice: 0.643,
        currency: '₪ לקוט"ש',
        period: 'month',
        features: ['הנחה של 25%', 'אנרגיה ירוקה 100%', 'פחמן ניטרלי', 'תעודת ירוק'],
        detailedDescription: 'החיסכון הגדול ביותר עם מחויבות סביבתית מלאה',
        targetAudience: 'צרכנים מודעים לסביבה',
        pros: ['חיסכון גבוה', 'אנרגיה נקייה 100%', 'תרומה לסביבה'],
        cons: ['מחיר מעט גבוה מהבסיסי'],
        discount: { amount: 25, description: 'הנחה ירוקה של 25%' },
        recommended: true,
        contractLength: '12 חודשים',
        setupFee: 0,
        popularityScore: 87,
        specialFeatures: ['תעודת אנרגיה ירוקה', 'דו"ח פחמן ניטרלי', 'תרומה לפרויקטים ירוקים'],
        bestFor: ['מודעים לסביבה', 'משפחות ירוקות', 'עסקים בר קיימא']
      },
      {
        id: 'pazgas-business',
        name: 'עסקי מתקדם',
        price: 0.501,
        originalPrice: 0.643,
        currency: '₪ לקוט"ש',
        period: 'month',
        features: ['הנחה של 22%', 'ייעוץ אנרגטי', 'חשבונית פלוס', 'מנהל חשבון'],
        detailedDescription: 'פתרון מותאם לעסקים עם שירות מקצועי',
        targetAudience: 'עסקים קטנים ובינוניים',
        pros: ['שירות עסקי מקצועי', 'ייעוץ מומחה', 'חיסכון משמעותי'],
        cons: ['דורש אישור עסק', 'התחייבות ארוכה'],
        discount: { amount: 22, description: 'הנחה עסקית של 22%' },
        contractLength: '24 חודשים',
        setupFee: 0,
        popularityScore: 82,
        specialFeatures: ['ייעוץ אנרגטי אישי', 'דו"חות צריכה מפורטים', 'מנהל חשבון ייעודי'],
        bestFor: ['עסקים קטנים', 'משרדים', 'חנויות']
      }
    ]
  }
];

// Helper function to get all plans by category
export const getEnhancedPlansByCategory = (category: string): EnhancedPlan[] => {
  switch (category) {
    case 'cellular':
      return enhancedCellularProviders.flatMap(provider => provider.plans);
    case 'internet':
      return enhancedInternetProviders.flatMap(provider => provider.plans);
    case 'electricity':
      return enhancedElectricityProviders.flatMap(provider => provider.plans);
    case 'tv':
      return enhancedTvProviders.flatMap(provider => provider.plans);
    default:
      return [];
  }
};

// Helper function to get provider by plan
export const getProviderByPlan = (planId: string): EnhancedProvider | null => {
  const allProviders = [...enhancedCellularProviders, ...enhancedInternetProviders, ...enhancedElectricityProviders, ...enhancedTvProviders];
  return allProviders.find(provider => 
    provider.plans.some(plan => plan.id === planId)
  ) || null;
};