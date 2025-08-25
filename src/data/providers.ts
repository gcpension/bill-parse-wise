// Real data from Israeli market - updated 2024 - COMPREHENSIVE VERSION

export interface Provider {
  id: string;
  name: string;
  logo?: string;
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  plans: Plan[];
  rating: number;
  customerService: string;
  website: string;
  description: string;
  established: string;
  specialOffers?: string[];
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  period: 'month' | 'year';
  features: string[];
  limitations?: string[];
  discount?: {
    amount: number;
    description: string;
    validUntil?: string;
  };
  recommended?: boolean;
  isPromotion?: boolean;
  detailedDescription: string;
  targetAudience: string;
  pros: string[];
  cons: string[];
}

// Electricity Providers
export const electricityProviders: Provider[] = [
  {
    id: 'iec',
    name: 'חברת החשמל לישראל',
    category: 'electricity',
    rating: 3.2,
    customerService: '03-6817777',
    website: 'iec.co.il',
    description: 'החברה הוותיקה והמסורתית',
    established: '1961',
    plans: [
      {
        id: 'iec-standard',
        name: 'תעריף רגיל',
        price: 0.643,
        currency: '₪',
        period: 'month',
        features: ['תעריף יחיד לכל השעות', 'שירות מבוסס ויציב'],
        detailedDescription: 'התעריף הסטנדרטי של חברת החשמל',
        targetAudience: 'כל הצרכנים',
        pros: ['יציבות מוכחת'],
        cons: ['מחיר גבוה']
      }
    ]
  },
  {
    id: 'electra-power',
    name: 'אלקטרה פאוור',
    category: 'electricity',
    rating: 4.1,
    customerService: '1-700-500-770',
    website: 'electra-power.co.il',
    description: 'הנחות של עד 15% על חשבון החשמל',
    established: '2018',
    specialOffers: ['הנחה של 15%'],
    plans: [
      {
        id: 'electra-basic',
        name: 'חבילה בסיסית',
        price: 0.546,
        originalPrice: 0.643,
        currency: '₪',
        period: 'month',
        features: ['הנחה של 15%', 'ללא מחויבות'],
        discount: { amount: 15, description: 'הנחה קבועה של 15%' },
        recommended: true,
        detailedDescription: 'חבילה מעולה למשפחות',
        targetAudience: 'משפחות עם צריכה בינונית',
        pros: ['חיסכון מיידי'],
        cons: ['לא מתאים לצריכה גבוהה']
      },
      {
        id: 'electra-premium',
        name: 'חבילת פרימיום',
        price: 0.495,
        originalPrice: 0.643,
        currency: '₪',
        period: 'month',
        features: ['הנחה של 23%', 'שירות VIP', 'ללא דמי הפסקה'],
        discount: { amount: 23, description: 'הנחה משופרת של 23%' },
        detailedDescription: 'החבילה המשתלמת ביותר למשפחות גדולות',
        targetAudience: 'משפחות גדולות ועסקים קטנים',
        pros: ['חיסכון מרבי', 'שירות מעולה'],
        cons: ['דורש התחייבות של 12 חודשים']
      },
      {
        id: 'electra-green',
        name: 'אנרגיה ירוקה',
        price: 0.530,
        originalPrice: 0.643,
        currency: '₪',
        period: 'month',
        features: ['הנחה של 18%', 'אנרגיה מתחדשת 100%', 'פחמן ניטרלי'],
        discount: { amount: 18, description: 'הנחה ירוקה של 18%' },
        detailedDescription: 'לצרכנים המעוניינים באנרגיה נקייה',
        targetAudience: 'צרכנים מודעים לסביבה',
        pros: ['ידידותי לסביבה', 'חיסכון טוב'],
        cons: ['מעט יותר יקר מהבסיסית']
      }
    ]
  },
  {
    id: 'bezeq-energy',
    name: 'בזק אנרג\'י',
    category: 'electricity',
    rating: 4.0,
    customerService: '1-700-144-144',
    website: 'bezeq.co.il',
    description: 'הנחות של עד 20% על חשבון החשמל',
    established: '2019',
    specialOffers: ['הנחה של עד 20%'],
    plans: [
      {
        id: 'bezeq-basic',
        name: 'חבילה בסיסית',
        price: 0.514,
        originalPrice: 0.643,
        currency: '₪',
        period: 'month',
        features: ['הנחה של 20%', 'שירות 24/7'],
        discount: { amount: 20, description: 'הנחה קבועה של 20%' },
        detailedDescription: 'הנחה טובה מבזק',
        targetAudience: 'לקוחות בזק',
        pros: ['הנחה גבוהה', 'שירות מעולה'],
        cons: ['מוגבל ללקוחות בזק']
      },
      {
        id: 'bezeq-family',
        name: 'חבילה משפחתית',
        price: 0.485,
        originalPrice: 0.643,
        currency: '₪',
        period: 'month',
        features: ['הנחה של 25%', 'שירות 24/7', 'אחריות מלאה'],
        discount: { amount: 25, description: 'הנחה משפחתית של 25%' },
        recommended: true,
        detailedDescription: 'החבילה הכי משתלמת ללקוחות בזק',
        targetAudience: 'משפחות לקוחות בזק',
        pros: ['הנחה גבוהה מאוד', 'שירות מעולה'],
        cons: ['מוגבל ללקוחות בזק עם אינטרנט']
      },
      {
        id: 'bezeq-business',
        name: 'חבילה עסקית',
        price: 0.495,
        originalPrice: 0.643,
        currency: '₪',
        period: 'month',
        features: ['הנחה של 23%', 'חשבונית פלוס', 'מנהל חשבון ייעודי'],
        discount: { amount: 23, description: 'הנחה עסקית של 23%' },
        detailedDescription: 'חבילה מותאמת לעסקים קטנים',
        targetAudience: 'עסקים קטנים ובינוניים',
        pros: ['שירות עסקי מתקדם', 'הנחה משמעותית'],
        cons: ['דורש אישור עסק']
      }
    ]
  },
  {
    id: 'cellcom-energy',
    name: 'סלקום אנרג\'י',
    category: 'electricity',
    rating: 3.9,
    customerService: '1-700-500-500',
    website: 'cellcom.co.il',
    description: 'אנרגיה נקייה בשיתוף משק אנרגיה',
    established: '2020',
    plans: [
      {
        id: 'cellcom-green',
        name: 'אנרגיה ירוקה',
        price: 0.578,
        originalPrice: 0.643,
        currency: '₪',
        period: 'month',
        features: ['הנחה של 10%', 'אנרגיה מתחדשת'],
        discount: { amount: 10, description: 'הנחה ירוקה' },
        detailedDescription: 'חשמל מאנרגיה מתחדשת',
        targetAudience: 'צרכנים ירוקים',
        pros: ['ידידותי לסביבה'],
        cons: ['הנחה נמוכה יחסית']
      }
    ]
  },
  {
    id: 'hot-energy',
    name: 'הוט חשמל',
    category: 'electricity',
    rating: 3.8,
    customerService: '1-700-467-467',
    website: 'hot.net.il',
    description: 'חשמל בשילוב עם שירותי בידור',
    established: '2020',
    plans: [
      {
        id: 'hot-combo',
        name: 'חבילה משולבת',
        price: 0.565,
        originalPrice: 0.643,
        currency: '₪',
        period: 'month',
        features: ['הנחה של 12%', 'הנחה נוספת עם הוט TV'],
        discount: { amount: 12, description: 'הנחה משולבת' },
        detailedDescription: 'חיסכון נוסף ללקוחות הוט',
        targetAudience: 'לקוחות הוט',
        pros: ['הנחה משולבת'],
        cons: ['מחייב חבילת הוט']
      }
    ]
  },
  {
    id: 'partner-energy',
    name: 'פרטנר חשמל',
    category: 'electricity',
    rating: 3.7,
    customerService: '1-700-150-150',
    website: 'partner.co.il',
    description: 'חשמל ותקשורת במקום אחד',
    established: '2021',
    plans: [
      {
        id: 'partner-unified',
        name: 'חבילה מאוחדת',
        price: 0.593,
        originalPrice: 0.643,
        currency: '₪',
        period: 'month',
        features: ['הנחה של 8%', 'חשבון מאוחד'],
        discount: { amount: 8, description: 'הנחת נאמנות' },
        detailedDescription: 'נוחות וחיסכון',
        targetAudience: 'לקוחות פרטנר',
        pros: ['נוחות בתשלום'],
        cons: ['הנחה קטנה']
      }
    ]
  },
  {
    id: 'pazgas-energy',
    name: 'פזגז חשמל',
    category: 'electricity',
    rating: 4.2,
    customerService: '1-700-775-775',
    website: 'pazgas.co.il',
    description: 'ניסיון של שנים באנרגיה',
    established: '2019',
    plans: [
      {
        id: 'pazgas-premium',
        name: 'חבילת פרימיום',
        price: 0.501,
        originalPrice: 0.643,
        currency: '₪',
        period: 'month',
        features: ['הנחה של 22%', 'שירות אישי'],
        discount: { amount: 22, description: 'הנחה מרבית' },
        recommended: true,
        detailedDescription: 'החיסכון הגדול ביותר',
        targetAudience: 'משפחות גדולות',
        pros: ['הנחה הגבוהה ביותר'],
        cons: ['מחייב התחייבות']
      },
      {
        id: 'pazgas-smart',
        name: 'חבילה חכמה',
        price: 0.471,
        originalPrice: 0.643,
        currency: '₪',
        period: 'month',
        features: ['הנחה של 27%', 'מונה חכם', 'ניטור צריכה'],
        discount: { amount: 27, description: 'הנחה חכמה של 27%' },
        detailedDescription: 'הטכנולוגיה החדשה ביותר לחיסכון מקסימלי',
        targetAudience: 'אוהבי טכנולוgia',
        pros: ['הנחה הגבוהה ביותר', 'טכנולוגיה מתקדמת'],
        cons: ['דורש התקנת מונה חכם']
      },
      {
        id: 'pazgas-basic',
        name: 'חבילה בסיסית',
        price: 0.529,
        originalPrice: 0.643,
        currency: '₪',
        period: 'month',
        features: ['הנחה של 18%', 'ללא התחייבות'],
        discount: { amount: 18, description: 'הנחה בסיסית של 18%' },
        detailedDescription: 'חבילה פשוטה וישירה',
        targetAudience: 'צרכנים המחפשים פשטות',
        pros: ['ללא התחייבות', 'הנחה טובה'],
        cons: ['הנחה נמוכה יחסית']
      }
    ]
  }
];

// Cellular Providers
export const cellularProviders: Provider[] = [
  {
    id: 'pelephone',
    name: 'פלאפון',
    category: 'cellular',
    rating: 4.3,
    customerService: '1-700-555-200',
    website: 'pelephone.co.il',
    description: 'החברה הסלולרית הוותיקה ביותר בישראל',
    established: '1986',
    plans: [
      {
        id: 'pelephone-unlimited',
        name: 'ללא הגבלה פלוס',
        price: 89,
        currency: '₪',
        period: 'month',
        features: ['אינטרנט ללא הגבלה', 'שיחות ללא הגבלה', '5G מהיר'],
        detailedDescription: 'החבילה המובילה של פלאפון',
        targetAudience: 'גולשים כבדים',
        pros: ['רשת 5G מעולה', 'כיסוי רחב'],
        cons: ['מחיר גבוה']
      },
      {
        id: 'pelephone-family',
        name: 'חבילה משפחתית',
        price: 65,
        currency: '₪',
        period: 'month',
        features: ['100GB', 'שיחות ללא הגבלה', '4 קווים'],
        detailedDescription: 'מושלם למשפחות',
        targetAudience: 'משפחות',
        pros: ['חיסכון למשפחות'],
        cons: ['מוגבל ל-100GB']
      },
      {
        id: 'pelephone-student',
        name: 'חבילת סטודנטים',
        price: 39,
        originalPrice: 65,
        currency: '₪',
        period: 'month',
        features: ['50GB', 'שיחות ללא הגבלה', 'אפליקציות חינם'],
        discount: { amount: 40, description: 'הנחת סטודנטים' },
        recommended: true,
        detailedDescription: 'החבילה הכי משתלמת לסטודנטים',
        targetAudience: 'סטודנטים',
        pros: ['מחיר נמוך מאוד', 'אפליקציות חינם'],
        cons: ['דורש אישור סטודנט']
      },
      {
        id: 'pelephone-business',
        name: 'חבילה עסקית',
        price: 75,
        currency: '₪',
        period: 'month',
        features: ['200GB', 'שיחות ללא הגבלה', 'תמיכה עסקית'],
        detailedDescription: 'מותאם לעסקים קטנים',
        targetAudience: 'עסקים',
        pros: ['נפח גבוה', 'תמיכה מקצועית'],
        cons: ['יקר יחסית']
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
    description: 'מובילה בחדשנות ובטכנולוגיה',
    established: '1994',
    plans: [
      {
        id: 'cellcom-premium',
        name: 'פרימיום ללא הגבלה',
        price: 95,
        currency: '₪',
        period: 'month',
        features: ['אינטרנט ללא הגבלה', 'שיחות בחו"ל', 'נטפליקס חינם'],
        recommended: true,
        detailedDescription: 'החבילה הכי מלאה בשוק',
        targetAudience: 'עסקים וגולשים כבדים',
        pros: ['שירותים נוספים', 'איכות גבוהה'],
        cons: ['היקר ביותר']
      },
      {
        id: 'cellcom-basic',
        name: 'בסיסי 50GB',
        price: 49,
        currency: '₪',
        period: 'month',
        features: ['50GB גלישה', 'שיחות ללא הגבלה'],
        detailedDescription: 'חבילה בסיסית וחסכונית',
        targetAudience: 'גולשים קלים',
        pros: ['מחיר סביר'],
        cons: ['מוגבל ל-50GB']
      },
      {
        id: 'cellcom-smart',
        name: 'חכם 150GB',
        price: 69,
        originalPrice: 85,
        currency: '₪',
        period: 'month',
        features: ['150GB גלישה', 'שיחות ללא הגבלה', 'הודעות ללא הגבלה'],
        discount: { amount: 19, description: 'מבצע חכם' },
        detailedDescription: 'האיזון המושלם בין מחיר ונפח',
        targetAudience: 'גולשים בינוניים',
        pros: ['יחס מחיר-ביצועים מעולה'],
        cons: ['מוגבל ל-150GB']
      },
      {
        id: 'cellcom-young',
        name: 'צעירים ללא הגבלה',
        price: 55,
        originalPrice: 89,
        currency: '₪',
        period: 'month',
        features: ['אינטרנט ללא הגבלה', 'שיחות ללא הגבלה', 'אפליקציות חברתיות חינם'],
        discount: { amount: 38, description: 'הנחת צעירים' },
        detailedDescription: 'ללא הגבלה במחיר מיוחד לצעירים',
        targetAudience: 'גילאי 18-30',
        pros: ['ללא הגבלה במחיר נמוך', 'אפליקציות חינם'],
        cons: ['מוגבל לגיל']
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
    description: 'שירות אישי ופתרונות מגוונים',
    established: '1999',
    plans: [
      {
        id: 'partner-power',
        name: 'פאוור ללא גבולות',
        price: 79,
        currency: '₪',
        period: 'month',
        features: ['אינטרנט ללא הגבלה', 'שיחות לחו"ל', 'הוט GO חינם'],
        detailedDescription: 'חבילה עם תוספות בידור',
        targetAudience: 'אוהבי בידור',
        pros: ['תוספות בידור', 'גמישות'],
        cons: ['כיסוי פחות טוב']
      },
      {
        id: 'partner-smart',
        name: 'סמארט 80GB',
        price: 59,
        currency: '₪',
        period: 'month',
        features: ['80GB גלישה', 'שיחות ללא הגבלה', 'אפליקציות חינם'],
        detailedDescription: 'איזון מושלם בין מחיר לביצועים',
        targetAudience: 'גולשים בינוניים',
        pros: ['יחס מחיר ביצועים טוב'],
        cons: ['לא ללא הגבלה']
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
    description: 'סלולר ובידור במקום אחד',
    established: '2016',
    plans: [
      {
        id: 'hot-total',
        name: 'טוטאל ללא הגבלה',
        price: 69,
        currency: '₪',
        period: 'month',
        features: ['אינטרנט ללא הגבלה', 'הוט VOD חינם', 'שיחות בחו"ל'],
        detailedDescription: 'הכי משתלם עם שירותי הוט',
        targetAudience: 'לקוחות הוט',
        pros: ['שילוב מושלם עם הוט', 'ערך מוסף גבוה'],
        cons: ['תלוי בשירותי הוט']
      }
    ]
  },
  {
    id: 'rami-levy',
    name: 'רמי לוי תקשורת',
    category: 'cellular',
    rating: 4.5,
    customerService: '1-700-800-100',
    website: 'rami-levy.co.il',
    description: 'המחירים הזולים ביותר בשוק',
    established: '2012',
    specialOffers: ['החבילה הזולה ביותר'],
    plans: [
      {
        id: 'rami-unlimited',
        name: 'אינטרנט ללא הגבלה',
        price: 35,
        currency: '₪',
        period: 'month',
        features: ['300GB גלישה', 'שיחות ללא הגבלה', 'eSIM חינם'],
        recommended: true,
        detailedDescription: 'החבילה הזולה ביותר בשוק',
        targetAudience: 'גולשים חסכוניים',
        pros: ['מחיר הכי נמוך', 'eSIM חינם'],
        cons: ['מהירות מוגבלת אחרי 300GB']
      }
    ]
  },
  {
    id: 'golan-telecom',
    name: 'גולן טלקום',
    category: 'cellular',
    rating: 4.2,
    customerService: '1-700-400-400',
    website: 'golan.co.il',
    description: 'חבילות משפחתיות מיוחדות',
    established: '2015',
    plans: [
      {
        id: 'golan-family-3',
        name: 'משפחתית 3 קווים',
        price: 33,
        currency: '₪',
        period: 'month',
        features: ['1500GB לחלוקה', 'שיחות ללא הגבלה', '3 קווים'],
        detailedDescription: 'מושלם למשפחות קטנות',
        targetAudience: 'משפחות',
        pros: ['זול מאוד למשפחות', 'גמישות בחלוקת הנתונים'],
        cons: ['חייב 3 קווים']
      }
    ]
  },
  {
    id: '018-xphone',
    name: '018 אקספון',
    category: 'cellular',
    rating: 3.8,
    customerService: '1-700-018-018',
    website: '018xphone.co.il',
    description: 'חבילות גמישות ומותאמות אישית',
    established: '2010',
    plans: [
      {
        id: 'xphone-flex',
        name: 'גמיש 120GB',
        price: 45,
        currency: '₪',
        period: 'month',
        features: ['120GB גלישה', 'שיחות ללא הגבלה', 'גמישות בשינויים'],
        detailedDescription: 'חבילה גמישה וחסכונית',
        targetAudience: 'גולשים בינוניים',
        pros: ['גמישות בשינויים', 'מחיר סביר'],
        cons: ['כיסוי מוגבל']
      }
    ]
  }
];

// Internet Providers  
export const internetProviders: Provider[] = [
  {
    id: 'bezeq',
    name: 'בזק',
    category: 'internet',
    rating: 4.0,
    customerService: '1-700-144-144',
    website: 'bezeq.co.il',
    description: 'תשתית הסיבים הגדולה בישראל',
    established: '1984',
    plans: [
      {
        id: 'bezeq-fiber-1000',
        name: 'סיבים 1000 מגה',
        price: 129,
        currency: '₪',
        period: 'month',
        features: ['מהירות עד 1000 מגה', 'העלאה 100 מגה', 'נתב חינם'],
        recommended: true,
        detailedDescription: 'המהירות הגבוהה ביותר',
        targetAudience: 'משפחות גדולות ועסקים',
        pros: ['מהירות מרבית', 'יציבות גבוהה'],
        cons: ['מחיר גבוה']
      },
      {
        id: 'bezeq-fiber-200',
        name: 'סיבים 200 מגה',
        price: 89,
        currency: '₪',
        period: 'month',
        features: ['מהירות עד 200 מגה', 'העלאה 50 מגה'],
        detailedDescription: 'מהירות טובה למשפחה ממוצעת',
        targetAudience: 'משפחות קטנות',
        pros: ['יחס מחיר ביצועים מעולה'],
        cons: ['לא מתאים לגולשים כבדים']
      }
    ]
  },
  {
    id: 'hot-net',
    name: 'הוט נט',
    category: 'internet',
    rating: 4.2,
    customerService: '1-700-467-467',
    website: 'hot.net.il',
    description: 'אינטרנט מהיר עם שירותי בידור',
    established: '2008',
    specialOffers: ['הוט VOD חינם'],
    plans: [
      {
        id: 'hot-fiber-1000',
        name: 'סיבים פרימיום',
        price: 119,
        currency: '₪',
        period: 'month',
        features: ['מהירות עד 1000 מגה', 'הוט VOD חינם', 'נטפליקס במחיר מוזל'],
        recommended: true,
        detailedDescription: 'השילוב המושלם בין אינטרנט לבידור',
        targetAudience: 'משפחות שאוהבות בידור',
        pros: ['ערך מוסף גבוה', 'שירותי בידור'],
        cons: ['מתאים רק לצופי הוט']
      },
      {
        id: 'hot-fiber-basic',
        name: 'סיבים בסיסי',
        price: 89,
        currency: '₪',
        period: 'month',
        features: ['מהירות עד 200 מגה', 'הוט VOD חינם'],
        detailedDescription: 'חבילה בסיסית עם בידור',
        targetAudience: 'משפחות קטנות',
        pros: ['בידור כלול'],
        cons: ['מהירות מוגבלת']
      }
    ]
  },
  {
    id: 'partner-internet',
    name: 'פרטנר אינטרנט',
    category: 'internet',
    rating: 3.9,
    customerService: '1-700-150-150',
    website: 'partner.co.il',
    description: 'אינטרנט וטלוויזיה משולבים',
    established: '2010',
    plans: [
      {
        id: 'partner-fiber-500',
        name: 'סיבים 500 מגה',
        price: 99,
        currency: '₪',
        period: 'month',
        features: ['מהירות עד 500 מגה', 'TV בסיסית כלולה', 'נתב מתקדם'],
        detailedDescription: 'אינטרנט וטלוויזיה במחיר אחד',
        targetAudience: 'משפחות',
        pros: ['TV כלולה', 'מחיר משתלם'],
        cons: ['תלוי בתשתית']
      }
    ]
  },
  {
    id: '018-xphone-internet',
    name: '018 אקספון אינטרנט',
    category: 'internet',
    rating: 3.7,
    customerService: '1-700-018-018',
    website: '018xphone.co.il',
    description: 'פתרונות אינטרנט גמישים',
    established: '2012',
    plans: [
      {
        id: 'xphone-fiber-300',
        name: 'סיבים 300 מגה',
        price: 99.99,
        currency: '₪',
        period: 'month',
        features: ['מהירות עד 300 מגה', 'העלאה 100 מגה', 'מחיר קבוע לשנה'],
        detailedDescription: 'מהירות טובה במחיר קבוע',
        targetAudience: 'גולשים בינוניים',
        pros: ['מחיר קבוע', 'גמישות'],
        cons: ['כיסוי מוגבל']
      },
      {
        id: 'xphone-basic-100',
        name: 'בסיסי 100 מגה',
        price: 99.99,
        currency: '₪',
        period: 'month',
        features: ['מהירות עד 100 מגה', 'העלאה 10 מגה'],
        detailedDescription: 'חבילה בסיסית וחסכונית',
        targetAudience: 'גולשים קלים',
        pros: ['מחיר נמוך'],
        cons: ['מהירות נמוכה']
      }
    ]
  },
  {
    id: 'walla-fiber',
    name: 'וואלה פייבר',
    category: 'internet',
    rating: 4.1,
    customerService: '1-700-925-925',
    website: 'walla.co.il',
    description: 'סיבים מהירים במחיר קבוע לכל החיים',
    established: '2020',
    specialOffers: ['מחיר קבוע לכל החיים'],
    plans: [
      {
        id: 'walla-fiber-1000',
        name: 'פייבר 1000 מגה',
        price: 79,
        currency: '₪',
        period: 'month',
        features: ['מהירות עד 1000 מגה', 'מחיר קבוע לכל החיים', 'נתב ומגדיל טווח חינם'],
        recommended: true,
        detailedDescription: 'המחיר הכי טוב לכל החיים',
        targetAudience: 'גולשים כבדים',
        pros: ['מחיר קבוע', 'ציוד חינם'],
        cons: ['זמינות מוגבלת']
      }
    ]
  },
  {
    id: 'netvision',
    name: 'נטוויזן',
    category: 'internet',
    rating: 3.8,
    customerService: '1-700-012-012',
    website: 'netvision.net.il',
    description: 'ספק אינטרנט ותיק ואמין',
    established: '1995',
    plans: [
      {
        id: 'netvision-business',
        name: 'עסקי 500 מגה',
        price: 149,
        currency: '₪',
        period: 'month',
        features: ['מהירות עד 500 מגה', 'תמיכה עסקית', 'SLA מובטח'],
        detailedDescription: 'פתרון מקצועי לעסקים',
        targetAudience: 'עסקים',
        pros: ['אמינות גבוהה', 'תמיכה מקצועית'],
        cons: ['מחיר גבוה']
      }
    ]
  },
  {
    id: 'smile-012',
    name: '012 סמייל',
    category: 'internet',
    rating: 3.6,
    customerService: '1-700-012-012',
    website: '012.co.il',
    description: 'אינטרנט במחירים אטרקטיביים',
    established: '2000',
    plans: [
      {
        id: 'smile-eco',
        name: 'אקו 150 מגה',
        price: 69,
        currency: '₪',
        period: 'month',
        features: ['מהירות עד 150 מגה', 'מחיר חסכוני'],
        detailedDescription: 'פתרון חסכוני למשפחות',
        targetAudience: 'משפחות חסכוניות',
        pros: ['מחיר נמוך'],
        cons: ['מהירות מוגבלת']
      }
    ]
  }
];

// TV/Streaming Providers
export const tvProviders: Provider[] = [
  {
    id: 'yes',
    name: 'יס',
    category: 'tv',
    rating: 4.1,
    customerService: '1-700-588-588',
    website: 'yes.co.il',
    description: 'טלוויזיה לוויינית ושירותי סטרימינג',
    established: '2000',
    plans: [
      {
        id: 'yes-premium',
        name: 'חבילה מקסימום',
        price: 199,
        currency: '₪',
        period: 'month',
        features: ['כל הערוצים', 'Netflix כלול', 'סטינג TV', '4 מקלטים'],
        recommended: true,
        detailedDescription: 'החבילה המלאה עם כל השירותים',
        targetAudience: 'משפחות גדולות',
        pros: ['תוכן עשיר', 'איכות גבוהה'],
        cons: ['מחיר גבוה']
      },
      {
        id: 'yes-basic',
        name: 'חבילה בסיסית',
        price: 89,
        currency: '₪',
        period: 'month',
        features: ['ערוצים בסיסיים', 'מקלט אחד'],
        detailedDescription: 'חבילה בסיסית למשפחות קטנות',
        targetAudience: 'משפחות קטנות',
        pros: ['מחיר נמוך'],
        cons: ['תוכן מוגבל']
      }
    ]
  },
  {
    id: 'hot',
    name: 'הוט',
    category: 'tv',
    rating: 3.9,
    customerService: '1-700-467-467',
    website: 'hot.net.il',
    description: 'טלוויזיה כבלים ושירותי VOD',
    established: '2000',
    plans: [
      {
        id: 'hot-premium',
        name: 'חבילת פרימיום',
        price: 179,
        currency: '₪',
        period: 'month',
        features: ['כל הערוצים', 'HOT VOD', 'Disney+ כלול', '3 מקלטים'],
        recommended: true,
        detailedDescription: 'חבילה עשירה עם תוכן VOD',
        targetAudience: 'משפחות',
        pros: ['VOD עשיר', 'Disney+ כלול'],
        cons: ['תלוי בתשתית כבלים']
      },
      {
        id: 'hot-basic',
        name: 'חבילה בסיסית',
        price: 99,
        currency: '₪',
        period: 'month',
        features: ['ערוצים בסיסיים', 'HOT VOD בסיסי'],
        detailedDescription: 'חבילה בסיסית עם VOD',
        targetAudience: 'משפחות קטנות',
        pros: ['מחיר סביר'],
        cons: ['תוכן מוגבל']
      }
    ]
  },
  {
    id: 'partner-tv',
    name: 'פרטנר TV',
    category: 'tv',
    rating: 3.8,
    customerService: '1-700-150-150',
    website: 'partner.co.il',
    description: 'שירותי טלוויזיה וסטרימינג דיגיטליים',
    established: '2015',
    plans: [
      {
        id: 'partner-all',
        name: 'הכל כלול',
        price: 159,
        currency: '₪',
        period: 'month',
        features: ['כל הערוצים', '2 מקלטים', 'אפליקציית Partner TV'],
        detailedDescription: 'חבילה משולבת טלוויזיה ואינטרנט',
        targetAudience: 'משפחות',
        pros: ['שילוב עם אינטרנט'],
        cons: ['כיסוי מוגבל']
      }
    ]
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'tv',
    rating: 4.5,
    customerService: 'support.netflix.com',
    website: 'netflix.com',
    description: 'שירות סטרימינג עולמי',
    established: '2007',
    plans: [
      {
        id: 'netflix-premium',
        name: 'פרימיום',
        price: 55,
        currency: '₪',
        period: 'month',
        features: ['4K Ultra HD', '4 מכשירים בו זמנית', 'הורדות'],
        recommended: true,
        detailedDescription: 'איכות מקסימלית עם 4K',
        targetAudience: 'משפחות גדולות',
        pros: ['איכות מעולה', 'תוכן בלעדי'],
        cons: ['דורש אינטרנט מהיר']
      },
      {
        id: 'netflix-standard',
        name: 'סטנדרט',
        price: 40,
        currency: '₪',
        period: 'month',
        features: ['HD', '2 מכשירים בו זמנית'],
        detailedDescription: 'חבילה סטנדרטית לזוגות',
        targetAudience: 'זוגות',
        pros: ['מחיר סביר', 'איכות HD'],
        cons: ['מוגבל ל-2 מכשירים']
      },
      {
        id: 'netflix-basic',
        name: 'בסיסי',
        price: 25,
        currency: '₪',
        period: 'month',
        features: ['SD', 'מכשיר אחד'],
        detailedDescription: 'חבילה חסכונית',
        targetAudience: 'משתמש יחיד',
        pros: ['מחיר נמוך'],
        cons: ['איכות SD', 'מכשיר אחד בלבד']
      }
    ]
  },
  {
    id: 'disney-plus',
    name: 'Disney+',
    category: 'tv',
    rating: 4.3,
    customerService: 'help.disneyplus.com',
    website: 'disneyplus.com',
    description: 'שירות סטרימינג דיסני',
    established: '2019',
    plans: [
      {
        id: 'disney-monthly',
        name: 'חודשי',
        price: 29.90,
        currency: '₪',
        period: 'month',
        features: ['תוכן דיסני בלעדי', '4K Ultra HD', '4 מכשירים בו זמנית'],
        detailedDescription: 'כל תוכן דיסני, מארוול ו-Star Wars',
        targetAudience: 'משפחות עם ילדים',
        pros: ['תוכן איכותי לילדים', '4K'],
        cons: ['ספרייה מוגבלת']
      }
    ]
  },
  {
    id: 'amazon-prime',
    name: 'Amazon Prime Video',
    category: 'tv',
    rating: 4.0,
    customerService: 'amazon.com/support',
    website: 'primevideo.com',
    description: 'שירות סטרימינג אמזון',
    established: '2016',
    plans: [
      {
        id: 'prime-monthly',
        name: 'חודשי',
        price: 22.90,
        currency: '₪',
        period: 'month',
        features: ['תוכן Prime Video', 'סדרות בלעדיות', 'הורדות'],
        detailedDescription: 'שירות סטרימינג עם תוכן בלעדי',
        targetAudience: 'מבוגרים',
        pros: ['מחיר נמוך', 'תוכן בלעדי'],
        cons: ['פחות תוכן ישראלי']
      }
    ]
  }
];

export const allProviders = [...electricityProviders, ...cellularProviders, ...internetProviders, ...tvProviders];

export const getProvidersByCategory = (category: 'electricity' | 'cellular' | 'internet' | 'tv') => {
  return allProviders.filter(provider => provider.category === category);
};

export const getCheapestPlan = (category: 'electricity' | 'cellular' | 'internet' | 'tv') => {
  const providers = getProvidersByCategory(category);
  let cheapestPlan = null;
  let cheapestPrice = Infinity;
  
  providers.forEach(provider => {
    provider.plans.forEach(plan => {
      if (plan.price < cheapestPrice) {
        cheapestPrice = plan.price;
        cheapestPlan = { ...plan, providerName: provider.name, providerId: provider.id };
      }
    });
  });
  
  return cheapestPlan;
};

export const calculateAnnualSavings = (currentPrice: number, newPrice: number, category: 'electricity' | 'cellular' | 'internet' | 'tv') => {
  const multiplier = category === 'electricity' ? 2000 : 12;
  return (currentPrice - newPrice) * multiplier;
};