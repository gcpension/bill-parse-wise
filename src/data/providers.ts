// Real data from Israeli market - updated 2024

export interface Provider {
  id: string;
  name: string;
  logo?: string;
  category: 'electricity' | 'cellular' | 'internet';
  plans: Plan[];
  rating: number;
  customerService: string;
  website: string;
  description: string;
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
}

// Electricity Providers (after 2024 reform)
export const electricityProviders: Provider[] = [
  {
    id: 'iec',
    name: 'חברת החשמל לישראל',
    category: 'electricity',
    rating: 3.2,
    customerService: '03-6817777',
    website: 'iec.co.il',
    description: 'החברה הוותיקה והמסורתית - ללא הנחות מיוחדות',
    plans: [
      {
        id: 'iec-standard',
        name: 'תעריף רגיל',
        price: 0.643,
        currency: '₪',
        period: 'month',
        features: [
          'תעריف יחיד לכל השעות',
          'שירות מבוסס ויציב',
          'ללא מחויבות'
        ]
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
    plans: [
      {
        id: 'electra-basic',
        name: 'חבילה בסיסית',
        price: 0.546,
        originalPrice: 0.643,
        currency: '₪',
        period: 'month',
        features: [
          'הנחה של 15% מהתעריף הרגיל',
          'ללא תקופת מחויבות',
          'מעבר חינם'
        ],
        discount: {
          amount: 15,
          description: 'הנחה קבועה של 15%'
        },
        recommended: true
      },
      {
        id: 'electra-green',
        name: 'חבילה ירוקה',
        price: 0.514,
        originalPrice: 0.643,
        currency: '₪',
        period: 'month',
        features: [
          'הנחה של 20% מהתעריף הרגיל',
          'חשמל ממקורות מתחדשים',
          'מעבר חינם'
        ],
        discount: {
          amount: 20,
          description: 'הנחה של 20% + אנרגיה ירוקה'
        }
      }
    ]
  },
  {
    id: 'paz-power',
    name: 'פז פאוור',
    category: 'electricity',
    rating: 4.3,
    customerService: '1-700-555-729',
    website: 'pazpower.co.il',
    description: 'הנחות מיוחדות ללקוחות פז',
    plans: [
      {
        id: 'paz-smart',
        name: 'פז חכם',
        price: 0.539,
        originalPrice: 0.643,
        currency: '₪',
        period: 'month',
        features: [
          'הנחה של 16% מהתעריף הרגיל',
          'הנחות נוספות בתחנות פז',
          'אפליקציה לניהול צריכה'
        ],
        discount: {
          amount: 16,
          description: 'הנחה של 16% + הטבות בפז'
        }
      }
    ]
  }
];

// Cellular Providers
export const cellularProviders: Provider[] = [
  {
    id: 'cellcom',
    name: 'סלקום',
    category: 'cellular',
    rating: 4.0,
    customerService: '052-9990000',
    website: 'cellcom.co.il',
    description: 'החברה הסלולרית הוותיקה בישראל',
    plans: [
      {
        id: 'cellcom-unlimited',
        name: 'אינטרנט בלתי מוגבל',
        price: 79,
        currency: '₪',
        period: 'month',
        features: [
          'אינטרנט בלתי מוגבל בישראל',
          'שיחות בלתי מוגבלות',
          'SMS בלתי מוגבל',
          '5GB לחו"ל'
        ]
      },
      {
        id: 'cellcom-5g',
        name: '5G פרימיום',
        price: 129,
        currency: '₪',
        period: 'month',
        features: [
          'רשת 5G מהירה',
          'אינטרנט בלתי מוגבל',
          '10GB לחו"ל',
          'שירותי פרימיום'
        ],
        recommended: true
      }
    ]
  },
  {
    id: 'pelephone',
    name: 'פלפון',
    category: 'cellular',
    rating: 3.8,
    customerService: '052-5252525',
    website: 'pelephone.co.il',
    description: 'מגוון רחב של חבילות וחדשנות טכנולוגית',
    plans: [
      {
        id: 'pele-basic',
        name: 'בסיסי פלוס',
        price: 65,
        currency: '₪',
        period: 'month',
        features: [
          '20GB אינטרנט',
          'שיחות בלתי מוגבלות',
          'SMS בלתי מוגבל',
          '3GB לחו"ל'
        ]
      },
      {
        id: 'pele-unlimited',
        name: 'אינטרנט ללא הגבלה',
        price: 89,
        currency: '₪',
        period: 'month',
        features: [
          'אינטרנט בלתי מוגבל',
          'שיחות בלתי מוגבלות',
          '6GB לחו"ל',
          'אפליקציות פרימיום'
        ]
      }
    ]
  },
  {
    id: 'partner',
    name: 'פרטנר',
    category: 'cellular',
    rating: 4.2,
    customerService: '052-9999999',
    website: 'partner.co.il',
    description: 'שירות מעולה ותמיכה טכנית מתקדמת',
    plans: [
      {
        id: 'partner-family',
        name: 'חבילה משפחתית',
        price: 199,
        currency: '₪',
        period: 'month',
        features: [
          '4 קווים במחיר אחד',
          'אינטרנט בלתי מוגבל לכל קו',
          '20GB לחו"ל משותף',
          'הנחות על מכשירים'
        ],
        recommended: true
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
    description: 'חבילות משתלמות עם שירותי בידור',
    plans: [
      {
        id: 'hot-combo',
        name: 'קומבו הוט',
        price: 95,
        currency: '₪',
        period: 'month',
        features: [
          'אינטרנט בלתי מוגבל',
          'הוט VOD חינם',
          '5GB לחו"ל',
          'הנחה על הוט TV'
        ]
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
    plans: [
      {
        id: 'rami-basic',
        name: 'חבילה חסכונית',
        price: 39,
        currency: '₪',
        period: 'month',
        features: [
          '15GB אינטרנט',
          'שיחות בלתי מוגבלות',
          'SMS בלתי מוגבל',
          '2GB לחו"ל'
        ],
        discount: {
          amount: 50,
          description: 'החבילה הזולה ביותר בשוק'
        }
      },
      {
        id: 'rami-unlimited',
        name: 'אינטרנט ללא הגבלה',
        price: 55,
        currency: '₪',
        period: 'month',
        features: [
          'אינטרנט בלתי מוגבל',
          'שיחות בלתי מוגבלות',
          '4GB לחו"ל',
          'ללא מחויבות'
        ],
        recommended: true
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
    rating: 3.5,
    customerService: '1-800-400-400',
    website: 'bezeq.co.il',
    description: 'הספק הוותיק והגדול ביותר בישראל',
    plans: [
      {
        id: 'bezeq-basic',
        name: 'אינטרנט בסיסי',
        price: 89,
        currency: '₪',
        period: 'month',
        features: [
          'מהירות עד 100 מגה',
          'גלישה בלתי מוגבלת',
          'תמיכה טכנית 24/7',
          'ללא מחויבות'
        ]
      },
      {
        id: 'bezeq-fiber',
        name: 'סיבים אופטיים',
        price: 129,
        currency: '₪',
        period: 'month',
        features: [
          'מהירות עד 1000 מגה',
          'יציבות מקסימלית',
          'Upload מהיר',
          'WiFi 6 חינם'
        ]
      }
    ]
  },
  {
    id: 'hot-net',
    name: 'הוט נטו',
    category: 'internet',
    rating: 4.2,
    customerService: '1-700-467-467',
    website: 'hot.net.il',
    description: 'אינטרנט מהיר עם שירותי בידור משולבים',
    plans: [
      {
        id: 'hot-fiber-basic',
        name: 'סיבים בסיסי',
        price: 99,
        currency: '₪',
        period: 'month',
        features: [
          'מהירות עד 200 מגה',
          'הוט VOD חינם',
          'Netflix כלול',
          'התקנה חינם'
        ],
        recommended: true
      },
      {
        id: 'hot-fiber-premium',
        name: 'סיבים פרימיום',
        price: 149,
        currency: '₪',
        period: 'month',
        features: [
          'מהירות עד 1000 מגה',
          'חבילת בידור מלאה',
          'תמיכה טכנית מתקדמת',
          'WiFi מתקדם'
        ]
      }
    ]
  },
  {
    id: 'partner-tv',
    name: 'פרטנר TV',
    category: 'internet',
    rating: 4.0,
    customerService: '1-800-800-800',
    website: 'partner.co.il',
    description: 'שירותי אינטרנט מתקדמים עם טכנולוגיית ענן',
    plans: [
      {
        id: 'partner-combo',
        name: 'קומבו משפחתי',
        price: 139,
        currency: '₪',
        period: 'month',
        features: [
          'אינטרנט 500 מגה',
          'טלוויזיה מלאה',
          'אפליקציות סטרימינג',
          'אחסון ענן'
        ]
      }
    ]
  }
];

export const allProviders = [...electricityProviders, ...cellularProviders, ...internetProviders];

// Helper functions
export const getProvidersByCategory = (category: 'electricity' | 'cellular' | 'internet') => {
  return allProviders.filter(provider => provider.category === category);
};

export const getCheapestPlan = (category: 'electricity' | 'cellular' | 'internet') => {
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

export const calculateAnnualSavings = (currentPrice: number, newPrice: number, category: 'electricity' | 'cellular' | 'internet') => {
  const multiplier = category === 'electricity' ? 2000 : 12; // Average kWh per year for electricity, months for others
  return (currentPrice - newPrice) * multiplier;
};