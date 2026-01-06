// Verified Israeli telecom plans for 2025
// Data sourced from official comparison sites and company websites

export interface VerifiedPlan {
  id: string;
  company: string;
  planName: string;
  category: 'cellular' | 'internet' | 'tv' | 'electricity' | 'triple';
  monthlyPrice: number;
  promoPrice?: number;
  promoMonths?: number;
  dataAmount?: string;
  speed?: string;
  callMinutes?: string;
  smsIncluded?: boolean;
  features: string[];
  commitment?: string;
  recommended?: boolean;
  badge?: string;
  channels?: number;
  includes4K?: boolean;
  includesNetflix?: boolean;
  includesHBO?: boolean;
  // Triple bundle specific
  includesTV?: boolean;
  includesInternet?: boolean;
  includesCellular?: boolean;
  cellularLines?: number;
}

// Real cellular plans verified from Israeli telecom providers - 2025
export const verifiedCellularPlans: VerifiedPlan[] = [
  // 019 Mobile
  {
    id: 'cellular-019-basic',
    company: '019 מובייל',
    planName: 'חבילה בסיסית',
    category: 'cellular',
    monthlyPrice: 19.90,
    dataAmount: '12GB',
    callMinutes: '5000 דקות',
    smsIncluded: true,
    features: ['תשתית פרטנר', 'eSIM ללא עלות', 'חריגה 5.90₪ לג\'יגה'],
    recommended: true,
    badge: 'הכי זול'
  },
  {
    id: 'cellular-019-50gb',
    company: '019 מובייל',
    planName: 'חבילה 50GB',
    category: 'cellular',
    monthlyPrice: 29.90,
    dataAmount: '50GB',
    callMinutes: 'ללא הגבלה',
    smsIncluded: true,
    features: ['תשתית פרטנר', 'eSIM ללא עלות', 'שיחות ללא הגבלה'],
  },
  {
    id: 'cellular-019-100gb',
    company: '019 מובייל',
    planName: 'חבילה 100GB',
    category: 'cellular',
    monthlyPrice: 39.90,
    dataAmount: '100GB',
    callMinutes: 'ללא הגבלה',
    smsIncluded: true,
    features: ['תשתית פרטנר', 'eSIM ללא עלות', 'גלישה חופשית'],
  },

  // Pelephone
  {
    id: 'cellular-pelephone-1000gb',
    company: 'פלאפון',
    planName: 'חבילת 1000 ג\'יגה',
    category: 'cellular',
    monthlyPrice: 54.90,
    promoPrice: 27.90,
    promoMonths: 2,
    dataAmount: '1000GB',
    callMinutes: 'ללא הגבלה',
    smsIncluded: true,
    features: ['רשת 5G מתקדמת', 'גלישה חופשית באפליקציות', 'שירות פלאפון'],
    recommended: true,
    badge: 'הכי נדיב'
  },
  {
    id: 'cellular-pelephone-500gb',
    company: 'פלאפון',
    planName: 'חבילת 500 ג\'יגה',
    category: 'cellular',
    monthlyPrice: 44.90,
    dataAmount: '500GB',
    callMinutes: 'ללא הגבלה',
    smsIncluded: true,
    features: ['רשת 5G', 'גלישה חופשית ברשתות חברתיות', 'שירות 24/7'],
  },
  {
    id: 'cellular-pelephone-200gb',
    company: 'פלאפון',
    planName: 'חבילת 200 ג\'יגה',
    category: 'cellular',
    monthlyPrice: 34.90,
    dataAmount: '200GB',
    callMinutes: 'ללא הגבלה',
    smsIncluded: true,
    features: ['רשת 5G', 'שיחות ללא הגבלה'],
  },

  // Cellcom
  {
    id: 'cellular-cellcom-400gb',
    company: 'סלקום',
    planName: 'חבילת 400 ג\'יגה',
    category: 'cellular',
    monthlyPrice: 34.90,
    dataAmount: '400GB',
    callMinutes: 'ללא הגבלה',
    smsIncluded: true,
    features: ['איזון מלא בין מחיר לנפח', 'יציבות גבוהה', 'שירות מוכח'],
    recommended: true,
    badge: 'הכי מאוזן'
  },
  {
    id: 'cellular-cellcom-200gb',
    company: 'סלקום',
    planName: 'חבילת 200 ג\'יגה',
    category: 'cellular',
    monthlyPrice: 29.90,
    dataAmount: '200GB',
    callMinutes: 'ללא הגבלה',
    smsIncluded: true,
    features: ['רשת 5G', 'שיחות ללא הגבלה'],
  },
  {
    id: 'cellular-cellcom-unlimited',
    company: 'סלקום',
    planName: 'ללא הגבלה',
    category: 'cellular',
    monthlyPrice: 69.90,
    dataAmount: 'ללא הגבלה',
    callMinutes: 'ללא הגבלה',
    smsIncluded: true,
    features: ['גלישה ללא הגבלה', 'רשת 5G+', 'עדיפות ברשת'],
  },

  // Partner
  {
    id: 'cellular-partner-300gb',
    company: 'פרטנר',
    planName: 'חבילת 300 ג\'יגה',
    category: 'cellular',
    monthlyPrice: 39.90,
    dataAmount: '300GB',
    callMinutes: 'ללא הגבלה',
    smsIncluded: true,
    features: ['רשת 5G מתקדמת', 'כיסוי ארצי מלא', 'שירות דיגיטלי'],
    badge: 'הכי מתקדם'
  },
  {
    id: 'cellular-partner-150gb',
    company: 'פרטנר',
    planName: 'חבילת 150 ג\'יגה',
    category: 'cellular',
    monthlyPrice: 29.90,
    dataAmount: '150GB',
    callMinutes: 'ללא הגבלה',
    smsIncluded: true,
    features: ['רשת 5G', 'אפליקציית Partner'],
  },
  {
    id: 'cellular-partner-family',
    company: 'פרטנר',
    planName: 'חבילה משפחתית',
    category: 'cellular',
    monthlyPrice: 99.90,
    dataAmount: '500GB משותף',
    callMinutes: 'ללא הגבלה',
    smsIncluded: true,
    features: ['עד 4 קווים', 'גלישה משותפת', 'ניהול משפחתי באפליקציה'],
  },

  // HOT Mobile
  {
    id: 'cellular-hot-200gb',
    company: 'הוט מובייל',
    planName: 'חבילת 200 ג\'יגה',
    category: 'cellular',
    monthlyPrice: 29.90,
    dataAmount: '200GB',
    callMinutes: 'ללא הגבלה',
    smsIncluded: true,
    features: ['רשת 5G', 'יציבות גבוהה', 'שילוב עם שירותי HOT'],
    badge: 'הכי יציב'
  },
  {
    id: 'cellular-hot-100gb',
    company: 'הוט מובייל',
    planName: 'חבילת 100 ג\'יגה',
    category: 'cellular',
    monthlyPrice: 24.90,
    dataAmount: '100GB',
    callMinutes: 'ללא הגבלה',
    smsIncluded: true,
    features: ['רשת 4G/5G', 'שיחות ללא הגבלה'],
  },
  {
    id: 'cellular-hot-triple',
    company: 'הוט מובייל',
    planName: 'חבילה משולבת טריפל',
    category: 'cellular',
    monthlyPrice: 49.90,
    dataAmount: '300GB',
    callMinutes: 'ללא הגבלה',
    smsIncluded: true,
    features: ['הנחה ללקוחות HOT TV', 'הנחה ללקוחות אינטרנט HOT'],
  },

  // Rami Levy
  {
    id: 'cellular-rami-levy-50gb',
    company: 'רמי לוי',
    planName: 'חבילת 50 ג\'יגה',
    category: 'cellular',
    monthlyPrice: 19.90,
    dataAmount: '50GB',
    callMinutes: 'ללא הגבלה',
    smsIncluded: true,
    features: ['מחיר זול', 'ללא התחייבות', 'רכישה בסניפים'],
    badge: 'מחיר שובר שוק'
  },
  {
    id: 'cellular-rami-levy-100gb',
    company: 'רמי לוי',
    planName: 'חבילת 100 ג\'יגה',
    category: 'cellular',
    monthlyPrice: 29.90,
    dataAmount: '100GB',
    callMinutes: 'ללא הגבלה',
    smsIncluded: true,
    features: ['מחיר זול', 'ללא התחייבות'],
  },
];

// Real TV plans verified from Israeli providers - 2025
export const verifiedTVPlans: VerifiedPlan[] = [
  // HOT TV
  {
    id: 'tv-hot-basic',
    company: 'HOT',
    planName: 'חבילה בסיסית',
    category: 'tv',
    monthlyPrice: 99,
    channels: 80,
    features: ['ממיר HD', 'VOD בסיסי', 'צפייה לאחור 7 ימים'],
  },
  {
    id: 'tv-hot-family',
    company: 'HOT',
    planName: 'חבילת משפחה',
    category: 'tv',
    monthlyPrice: 149,
    channels: 120,
    includes4K: true,
    features: ['ממיר 4K', 'כל ערוצי הילדים', 'VOD מורחב', 'הקלטה ענן'],
    recommended: true,
    badge: 'הכי פופולרי'
  },
  {
    id: 'tv-hot-premium',
    company: 'HOT',
    planName: 'חבילת פרימיום',
    category: 'tv',
    monthlyPrice: 199,
    channels: 150,
    includes4K: true,
    includesNetflix: true,
    features: ['כל הערוצים', 'ספורט 4K', 'Netflix כלול', 'ממיר נוסף חינם'],
    badge: 'הכל כלול'
  },
  {
    id: 'tv-hot-sport',
    company: 'HOT',
    planName: 'חבילת ספורט',
    category: 'tv',
    monthlyPrice: 179,
    channels: 100,
    includes4K: true,
    features: ['כל ערוצי הספורט', 'ONE HD', 'ספורט 5', 'ליגת האלופות'],
  },

  // YES TV
  {
    id: 'tv-yes-basic',
    company: 'YES',
    planName: 'חבילה בסיסית',
    category: 'tv',
    monthlyPrice: 109,
    channels: 70,
    features: ['ממיר Apple TV', 'YesGO אפליקציה', 'VOD'],
  },
  {
    id: 'tv-yes-complete',
    company: 'YES',
    planName: 'החבילה המושלמת',
    category: 'tv',
    monthlyPrice: 149,
    channels: 100,
    includes4K: true,
    includesNetflix: true,
    features: ['ממיר Apple TV 4K', 'Netflix כלול', 'HBO Max', 'YesGO'],
    recommended: true,
    badge: 'הכי מתקדם'
  },
  {
    id: 'tv-yes-hbo',
    company: 'YES',
    planName: 'חבילת HBO',
    category: 'tv',
    monthlyPrice: 169,
    channels: 90,
    includes4K: true,
    includesHBO: true,
    features: ['כל תכני HBO', 'סדרות בלעדיות', 'סרטים חדשים'],
    badge: 'תוכן בלעדי'
  },
  {
    id: 'tv-yes-family',
    company: 'YES',
    planName: 'חבילת משפחה',
    category: 'tv',
    monthlyPrice: 139,
    channels: 85,
    includes4K: true,
    features: ['ערוצי ילדים', 'VOD ילדים', 'בקרת הורים'],
  },

  // Partner TV
  {
    id: 'tv-partner-basic',
    company: 'פרטנר TV',
    planName: 'חבילה בסיסית',
    category: 'tv',
    monthlyPrice: 79,
    channels: 60,
    features: ['ללא התחייבות', 'אפליקציה', 'צפייה בכל מקום'],
    badge: 'ללא התחייבות'
  },
  {
    id: 'tv-partner-netflix',
    company: 'פרטנר TV',
    planName: 'חבילה + Netflix',
    category: 'tv',
    monthlyPrice: 119,
    channels: 80,
    includesNetflix: true,
    features: ['Netflix Standard כלול', 'ערוצים + סטרימינג', 'ממיר Android TV'],
    recommended: true,
    badge: 'הכי משתלם'
  },
  {
    id: 'tv-partner-full',
    company: 'פרטנר TV',
    planName: 'החבילה המלאה',
    category: 'tv',
    monthlyPrice: 149,
    channels: 100,
    includes4K: true,
    includesNetflix: true,
    features: ['כל הערוצים', 'Netflix Premium', 'ספורט', 'ילדים'],
  },

  // Cellcom TV
  {
    id: 'tv-cellcom-basic',
    company: 'סלקום TV',
    planName: 'חבילה בסיסית',
    category: 'tv',
    monthlyPrice: 69,
    channels: 50,
    features: ['ללא התחייבות', 'צפייה באפליקציה', 'VOD'],
    badge: 'הכי זול'
  },
  {
    id: 'tv-cellcom-family',
    company: 'סלקום TV',
    planName: 'חבילת משפחה',
    category: 'tv',
    monthlyPrice: 99,
    channels: 70,
    features: ['ערוצי ילדים', 'ספורט בסיסי', 'הנחה ללקוחות סלקום'],
    recommended: true,
  },
  {
    id: 'tv-cellcom-premium',
    company: 'סלקום TV',
    planName: 'חבילת פרימיום',
    category: 'tv',
    monthlyPrice: 139,
    channels: 90,
    includes4K: true,
    features: ['כל הערוצים', 'ספורט מלא', 'סרטים חדשים'],
  },

  // STING TV
  {
    id: 'tv-sting-basic',
    company: 'STING TV',
    planName: 'חבילה בסיסית',
    category: 'tv',
    monthlyPrice: 49,
    channels: 40,
    features: ['מחיר נמוך', 'ללא התחייבות', 'אפליקציה בלבד'],
    badge: 'הכי זול בשוק'
  },
  {
    id: 'tv-sting-sport',
    company: 'STING TV',
    planName: 'חבילת ספורט',
    category: 'tv',
    monthlyPrice: 79,
    channels: 50,
    features: ['ערוצי ספורט', 'ONE', 'מחיר תחרותי'],
  },
  {
    id: 'tv-sting-full',
    company: 'STING TV',
    planName: 'החבילה המלאה',
    category: 'tv',
    monthlyPrice: 99,
    channels: 65,
    features: ['כל הערוצים של STING', 'ספורט מלא', 'סרטים'],
  },
];

// Internet plans
export const verifiedInternetPlans: VerifiedPlan[] = [
  // Bezeq
  {
    id: 'internet-bezeq-100',
    company: 'בזק',
    planName: 'סיבים 100 מגה',
    category: 'internet',
    monthlyPrice: 99,
    speed: '100Mbps',
    features: ['חיבור סיבים', 'ראוטר WiFi 6', 'התקנה חינם'],
  },
  {
    id: 'internet-bezeq-500',
    company: 'בזק',
    planName: 'סיבים 500 מגה',
    category: 'internet',
    monthlyPrice: 129,
    speed: '500Mbps',
    features: ['חיבור סיבים', 'ראוטר WiFi 6', 'מהירות סימטרית'],
    recommended: true,
    badge: 'הכי פופולרי'
  },
  {
    id: 'internet-bezeq-1000',
    company: 'בזק',
    planName: 'סיבים 1 ג\'יגה',
    category: 'internet',
    monthlyPrice: 159,
    speed: '1Gbps',
    features: ['מהירות מקסימלית', 'WiFi 6E', 'עדיפות שירות'],
    badge: 'הכי מהיר'
  },

  // HOT Internet
  {
    id: 'internet-hot-200',
    company: 'HOT',
    planName: 'אינטרנט 200 מגה',
    category: 'internet',
    monthlyPrice: 89,
    speed: '200Mbps',
    features: ['תשתית כבלים', 'ראוטר כלול'],
  },
  {
    id: 'internet-hot-500',
    company: 'HOT',
    planName: 'סיבים 500 מגה',
    category: 'internet',
    monthlyPrice: 119,
    speed: '500Mbps',
    features: ['חיבור סיבים', 'מהירות גבוהה', 'הנחה ללקוחות TV'],
    recommended: true,
  },
  {
    id: 'internet-hot-1000',
    company: 'HOT',
    planName: 'סיבים 1 ג\'יגה',
    category: 'internet',
    monthlyPrice: 149,
    speed: '1Gbps',
    features: ['מהירות מקסימלית', 'WiFi 6', 'שירות פרימיום'],
  },

  // Partner Fiber
  {
    id: 'internet-partner-100',
    company: 'פרטנר',
    planName: 'סיבים 100 מגה',
    category: 'internet',
    monthlyPrice: 79,
    speed: '100Mbps',
    features: ['ללא התחייבות', 'התקנה מהירה'],
    badge: 'ללא התחייבות'
  },
  {
    id: 'internet-partner-500',
    company: 'פרטנר',
    planName: 'סיבים 500 מגה',
    category: 'internet',
    monthlyPrice: 109,
    speed: '500Mbps',
    features: ['מהירות גבוהה', 'ראוטר WiFi 6'],
    recommended: true,
  },
  {
    id: 'internet-partner-1000',
    company: 'פרטנר',
    planName: 'סיבים 1 ג\'יגה',
    category: 'internet',
    monthlyPrice: 139,
    speed: '1Gbps',
    features: ['מהירות מקסימלית', 'שירות VIP'],
  },

  // Cellcom Internet
  {
    id: 'internet-cellcom-200',
    company: 'סלקום',
    planName: 'אינטרנט 200 מגה',
    category: 'internet',
    monthlyPrice: 79,
    speed: '200Mbps',
    features: ['מחיר תחרותי', 'ללא התחייבות'],
  },
  {
    id: 'internet-cellcom-500',
    company: 'סלקום',
    planName: 'סיבים 500 מגה',
    category: 'internet',
    monthlyPrice: 99,
    speed: '500Mbps',
    features: ['הנחה ללקוחות סלקום', 'ראוטר מתקדם'],
    recommended: true,
    badge: 'הכי משתלם'
  },
  {
    id: 'internet-cellcom-1000',
    company: 'סלקום',
    planName: 'סיבים 1 ג\'יגה',
    category: 'internet',
    monthlyPrice: 129,
    speed: '1Gbps',
    features: ['מהירות מקסימלית', 'שירות פרימיום'],
  },
];

// Triple Bundle Plans - TV + Internet + Cellular packages
export const verifiedTriplePlans: VerifiedPlan[] = [
  // HOT Triple
  {
    id: 'triple-hot-family',
    company: 'HOT',
    planName: 'חבילת משפחה טריפל',
    category: 'triple',
    monthlyPrice: 279,
    promoPrice: 199,
    promoMonths: 3,
    speed: '500Mbps',
    channels: 120,
    dataAmount: '200GB לקו',
    cellularLines: 2,
    includes4K: true,
    includesTV: true,
    includesInternet: true,
    includesCellular: true,
    features: ['טלוויזיה + אינטרנט + 2 קווי סלולר', 'ממיר 4K', 'WiFi 6', 'שירות אחד מאוחד'],
    recommended: true,
    badge: 'הכי פופולרי'
  },
  {
    id: 'triple-hot-premium',
    company: 'HOT',
    planName: 'חבילת פרימיום טריפל',
    category: 'triple',
    monthlyPrice: 349,
    speed: '1Gbps',
    channels: 150,
    dataAmount: '500GB לקו',
    cellularLines: 4,
    includes4K: true,
    includesNetflix: true,
    includesTV: true,
    includesInternet: true,
    includesCellular: true,
    features: ['הכל כלול', 'Netflix', 'סיבים 1 גיגה', 'עד 4 קווי סלולר', 'ספורט מלא'],
    badge: 'הכל כלול'
  },
  {
    id: 'triple-hot-basic',
    company: 'HOT',
    planName: 'חבילה בסיסית טריפל',
    category: 'triple',
    monthlyPrice: 229,
    speed: '200Mbps',
    channels: 80,
    dataAmount: '100GB לקו',
    cellularLines: 2,
    includesTV: true,
    includesInternet: true,
    includesCellular: true,
    features: ['טלוויזיה + אינטרנט + 2 קווי סלולר', 'ממיר HD', 'מחיר משתלם'],
  },

  // Partner Triple
  {
    id: 'triple-partner-family',
    company: 'פרטנר',
    planName: 'משפחה טריפל',
    category: 'triple',
    monthlyPrice: 269,
    promoPrice: 189,
    promoMonths: 6,
    speed: '500Mbps',
    channels: 80,
    dataAmount: '300GB לקו',
    cellularLines: 3,
    includes4K: true,
    includesTV: true,
    includesInternet: true,
    includesCellular: true,
    features: ['פרטנר TV + סיבים + 3 קווי סלולר', 'ניהול באפליקציה', 'שירות דיגיטלי'],
    recommended: true,
    badge: 'הכי משתלם'
  },
  {
    id: 'triple-partner-premium',
    company: 'פרטנר',
    planName: 'פרימיום טריפל',
    category: 'triple',
    monthlyPrice: 329,
    speed: '1Gbps',
    channels: 100,
    dataAmount: '500GB לקו',
    cellularLines: 4,
    includes4K: true,
    includesNetflix: true,
    includesTV: true,
    includesInternet: true,
    includesCellular: true,
    features: ['Netflix כלול', 'סיבים 1 גיגה', '4 קווי סלולר 5G', 'כל הערוצים'],
    badge: 'פרימיום'
  },
  {
    id: 'triple-partner-lite',
    company: 'פרטנר',
    planName: 'לייט טריפל',
    category: 'triple',
    monthlyPrice: 199,
    speed: '100Mbps',
    channels: 60,
    dataAmount: '150GB לקו',
    cellularLines: 2,
    includesTV: true,
    includesInternet: true,
    includesCellular: true,
    features: ['חבילה קלה', 'ללא התחייבות', '2 קווי סלולר'],
    badge: 'ללא התחייבות'
  },

  // Cellcom Triple
  {
    id: 'triple-cellcom-family',
    company: 'סלקום',
    planName: 'חבילת משפחה טריפל',
    category: 'triple',
    monthlyPrice: 259,
    promoPrice: 179,
    promoMonths: 3,
    speed: '500Mbps',
    channels: 70,
    dataAmount: '400GB לקו',
    cellularLines: 3,
    includes4K: true,
    includesTV: true,
    includesInternet: true,
    includesCellular: true,
    features: ['סלקום TV + סיבים + 3 קווי סלולר', 'יציבות גבוהה', 'תמיכה 24/7'],
    recommended: true,
    badge: 'בחירת העורכים'
  },
  {
    id: 'triple-cellcom-unlimited',
    company: 'סלקום',
    planName: 'ללא הגבלה טריפל',
    category: 'triple',
    monthlyPrice: 399,
    speed: '1Gbps',
    channels: 90,
    dataAmount: 'ללא הגבלה',
    cellularLines: 4,
    includes4K: true,
    includesNetflix: true,
    includesTV: true,
    includesInternet: true,
    includesCellular: true,
    features: ['גלישה ללא הגבלה', 'כל הערוצים', 'Netflix', '4 קווים', 'VIP'],
    badge: 'ללא הגבלה'
  },
  {
    id: 'triple-cellcom-basic',
    company: 'סלקום',
    planName: 'בסיסי טריפל',
    category: 'triple',
    monthlyPrice: 219,
    speed: '200Mbps',
    channels: 50,
    dataAmount: '200GB לקו',
    cellularLines: 2,
    includesTV: true,
    includesInternet: true,
    includesCellular: true,
    features: ['חבילה משולבת', 'מחיר נוח', '2 קווי סלולר'],
  },

  // YES + Bezeq + Pelephone Triple
  {
    id: 'triple-yes-family',
    company: 'YES + בזק',
    planName: 'משפחה טריפל',
    category: 'triple',
    monthlyPrice: 289,
    promoPrice: 209,
    promoMonths: 3,
    speed: '500Mbps',
    channels: 100,
    dataAmount: '300GB לקו',
    cellularLines: 2,
    includes4K: true,
    includesTV: true,
    includesInternet: true,
    includesCellular: true,
    features: ['YES TV + בזק סיבים + פלאפון', 'Apple TV 4K', 'תשתית בזק'],
    recommended: true,
    badge: 'איכות מעולה'
  },
  {
    id: 'triple-yes-premium',
    company: 'YES + בזק',
    planName: 'פרימיום טריפל',
    category: 'triple',
    monthlyPrice: 379,
    speed: '1Gbps',
    channels: 120,
    dataAmount: '1000GB לקו',
    cellularLines: 4,
    includes4K: true,
    includesNetflix: true,
    includesHBO: true,
    includesTV: true,
    includesInternet: true,
    includesCellular: true,
    features: ['Netflix + HBO', 'סיבים 1 גיגה', '4 קווי פלאפון 5G', 'הכל כלול'],
    badge: 'VIP'
  },

  // Rami Levy Triple (Budget option)
  {
    id: 'triple-rami-basic',
    company: 'רמי לוי',
    planName: 'משפחה חסכונית',
    category: 'triple',
    monthlyPrice: 149,
    speed: '100Mbps',
    channels: 40,
    dataAmount: '50GB לקו',
    cellularLines: 2,
    includesTV: true,
    includesInternet: true,
    includesCellular: true,
    features: ['STING TV + אינטרנט + 2 קווי סלולר', 'מחיר שובר שוק', 'ללא התחייבות'],
    badge: 'הכי זול בשוק'
  },
  {
    id: 'triple-rami-family',
    company: 'רמי לוי',
    planName: 'משפחה פלוס',
    category: 'triple',
    monthlyPrice: 199,
    speed: '200Mbps',
    channels: 65,
    dataAmount: '100GB לקו',
    cellularLines: 3,
    includesTV: true,
    includesInternet: true,
    includesCellular: true,
    features: ['STING TV מלא + אינטרנט מהיר + 3 קווים', 'מחיר תחרותי'],
    recommended: true,
    badge: 'חיסכון מקסימלי'
  },
];

// All verified plans combined
export const allVerifiedPlans: VerifiedPlan[] = [
  ...verifiedCellularPlans,
  ...verifiedTVPlans,
  ...verifiedInternetPlans,
  ...verifiedTriplePlans,
];

// Helper to get plans by category
export const getPlansByCategory = (category: VerifiedPlan['category']) => 
  allVerifiedPlans.filter(plan => plan.category === category);

// Helper to get plans by company
export const getPlansByCompany = (company: string) => 
  allVerifiedPlans.filter(plan => plan.company === company);
