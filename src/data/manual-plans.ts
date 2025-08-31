// Manual plans data from uploaded images
export interface ManualPlan {
  id: string;
  company: string;
  planName: string;
  speed: string;
  introPrice: number;
  introMonths: number;
  regularPrice: number;
  uploadSpeed: string;
  downloadSpeed: string;
  features: string[];
  color: string;
}

export const manualPlans: ManualPlan[] = [
  // אלקטרה פאוור
  {
    id: "electra-power-fixed-savings",
    company: "אלקטרה פאוור",
    planName: "חסכון קבוע",
    speed: "6.5%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת חשמל אלקטרא פאוור לחסכון קבוע בכל שעות היום וכל ימות השבוע",
      "6.5% הנחה",
      "הנחה קבועה בכל ימות השבוע וכל שעות היממה",
      "למבותה זמין לאבותים גם ללא מונה חכם"
    ],
    color: "bg-gradient-to-br from-blue-400 to-blue-600"
  },
  {
    id: "electra-power-time-savings",
    company: "אלקטרה פאוור",
    planName: "חסכון הזמים",
    speed: "10%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת חשמל אלקטרא פאוור לחסכון בשעות היום וחלילה הכול עד 23:00 ועד 17:00",
      "10% הנחה",
      "הנחה בשעות 23:00 עד 7:00 שלחרגת",
      "במבותה זמין צורך במונה חכם"
    ],
    color: "bg-gradient-to-br from-blue-400 to-blue-600"
  },
  {
    id: "electra-power-night-savings",
    company: "אלקטרה פאוור",
    planName: "חסכון לילה",
    speed: "20%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת חשמל אלקטרא פאוור לחסכון בכל ימות השבוע בכל שעות הלילה מהשעה 7:00 ועד 23:00",
      "20% הנחה קבועה",
      "חסכון בשעות הלילה",
      "במבותה זמין צורך במונה חכם"
    ],
    color: "bg-gradient-to-br from-blue-400 to-blue-600"
  },

  // אמישראגז חשמל
  {
    id: "amishragaz-fixed-savings",
    company: "אמישראגז חשמל",
    planName: "חסכון קבוע",
    speed: "6%-7%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת חשמל אמישראגז חשמל - חסכון קבוע",
      "7% הנחה קבועה לצרכני אמישראגז",
      "6% הנחה קבועה",
      "הנחה קבועה בכל ימות השבוע וכל שעות היממה",
      "להצטרפות לאמישראגז חשמל"
    ],
    color: "bg-gradient-to-br from-green-400 to-green-600"
  },

  // פזגז
  {
    id: "pazgas-24-7-discount",
    company: "פזגז",
    planName: "הנחה 24/7",
    speed: "6%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת חשמל פזגז הכוללת הנחה קבועה בכל שעות היום וכל ימות השבוע",
      "6% הנחה",
      "הנחה קבועה בכל ימות השבוע וכל שעות היממה",
      "למבותה זמין לאבותים גם ללא מונה חכם"
    ],
    color: "bg-gradient-to-br from-yellow-400 to-yellow-600"
  },
  {
    id: "pazgas-yellow-app",
    company: "פזגז",
    planName: "צבירה לאירגב באפליקציית yellow",
    speed: "10%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת חשמל פזגז המעניקה 10% צבירה לארגב באפליקציית yellow המשמשת בבעלות צבור התשלום בפועל",
      "10% צבירה על תשלום צבירת החשמל בפועל בכל ימות השבוע וכל שעות היממה",
      "סכום אצור תמופעל מחודש עד 50 ש\"ח בחודש עד לש 600 ש\"ח בשנה",
      "מצביר תחזורות ברישמים באפליקציית yellow"
    ],
    color: "bg-gradient-to-br from-yellow-400 to-yellow-600"
  },

  // הוט אנרגי
  {
    id: "hot-energy-day-savings",
    company: "הוט אנרגי",
    planName: "חסכים ביום",
    speed: "15%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת חשמל הוט אנרגי לחסכון בשעות היום מא'-ה' משעה 7:00 ועד השעה 17:00",
      "15% הנחה",
      "חסכון בשעות היום",
      "הנחה בימים א'-ה' בין השעות 7:00 ועד 17:00",
      "במבותה זמין צורך במונה חכם"
    ],
    color: "bg-gradient-to-br from-purple-400 to-purple-600"
  },
  {
    id: "hot-energy-night-savings",
    company: "הוט אנרגי",
    planName: "חסכים בלילה",
    speed: "20%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת חשמל הוט אנרגי לחסכון בשעות הלילה בימים א'-ה' משעה 23:00 ועד השעה 7:00 למחרת",
      "20% הנחה",
      "חסכון בשעות הלילה",
      "הנחה בימים א'-ה' בין השעות 23:00 ועד 7:00 למחרת",
      "במבותה זמין צורך במונה חכם"
    ],
    color: "bg-gradient-to-br from-purple-400 to-purple-600"
  },
  {
    id: "hot-energy-24-7-mobile",
    company: "הוט אנרגי",
    planName: "חסכים 24/7 - מסלול ללקוחות הוט מובייל או energy",
    speed: "5%-7%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת חשמל הוט אנרגי לחסכון קבוע בכל שעות היום וימות השבוע Hot energy ix mobile",
      "5% הנחה ראשונה",
      "HOT ללקוחות Hot ix mobile energy בלבד",
      "7% הנחה שלישית",
      "6% הנחה שנייה",
      "למבותה זמין לאבותים גם ללא מונה חכם"
    ],
    color: "bg-gradient-to-br from-purple-400 to-purple-600"
  },
  {
    id: "hot-energy-hot-next",
    company: "הוט אנרגי",
    planName: "חסכים קבוע HOT - מסלול ללקוחות הוט/NEXT",
    speed: "7%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת חשמל הוט אנרגי המיועדת רק ללקוחות HOT/NEXT לחסכון קבוע בכל שעות היום וימות השבוע",
      "7% הנחה",
      "הנחה בכל ימות השבוע וכל שעות היממה",
      "הנחה רק ללקוחות NEXT ix HOT",
      "עד 100 ש\"ח הנחה בחודש",
      "למבותה זמין לאבותים גם ללא מונה חכם"
    ],
    color: "bg-gradient-to-br from-purple-400 to-purple-600"
  },

  // סלקום אנרגי
  {
    id: "selcom-100-green",
    company: "סלקום אנרגי",
    planName: "100% חשמל ירוק",
    speed: "1%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת 100% חשמל ירוק סלקום אנרגי לחסכון קבוע בכל שעות היום וימות השבוע",
      "1% הנחה קבועה",
      "הנחה קבועה בכל ימות השבוע וכל שעות היממה",
      "למבותה זמין לאבותים גם ללא מונה חכם"
    ],
    color: "bg-gradient-to-br from-orange-400 to-orange-600"
  },
  {
    id: "selcom-fixed-savings",
    company: "סלקום אנרגי",
    planName: "חסכים קבוע",
    speed: "5%-6%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת חשמל סלקום אנרגי לחסכון קבוע בכל שעות היום וימות השבוע",
      "6% הנחה בשעות והעירייה אורכי",
      "5% הנחה ראשונה",
      "הנחה קבועה בכל ימות השבוע וכל שעות היממה",
      "למבותה זמין לאבותים גם ללא מונה חכם"
    ],
    color: "bg-gradient-to-br from-orange-400 to-orange-600"
  },
  {
    id: "selcom-50-green",
    company: "סלקום אנרגי",
    planName: "50% חשמל ירוק",
    speed: "3%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת 50% חשמל ירוק סלקום אנרגי לחסכון קבוע בכל שעות היום וימות השבוע",
      "3% הנחה קבועה",
      "הנחה קבועה בכל ימות השבוע וכל שעות היממה",
      "למבותה זמין לאבותים גם ללא מונה חכם"
    ],
    color: "bg-gradient-to-br from-orange-400 to-orange-600"
  },
  {
    id: "selcom-family-savings",
    company: "סלקום אנרגי",
    planName: "חסכים למשפחה",
    speed: "18%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת חשמל סלקום אנרגי לחסכון בשעות בימים א'-ה' משעה 14:00 ועד השעה 20:00",
      "18% הנחה",
      "חסכון בשעות האמצעי-האור",
      "הנחה בימים א'-ה' בשעות 14:00 עד 20:00",
      "בעליש דסלקום",
      "במבותה זמין צורך במונה חכם"
    ],
    color: "bg-gradient-to-br from-orange-400 to-orange-600"
  },
  {
    id: "selcom-night-savings",
    company: "סלקום אנרגי",
    planName: "חסכים בלילה",
    speed: "20%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת חשמל סלקום אנרגי לחסכון בשעות הלילה בימים א'-ה' משעה 23:00 ועד השעה 7:00",
      "20% הנחה",
      "חסכון בשעות הלילה",
      "הנחה בימים א'-ה' בין השעות 23:00 עד 7:00 למחרת",
      "במבותה זמין צורך במונה חכם"
    ],
    color: "bg-gradient-to-br from-orange-400 to-orange-600"
  },
  {
    id: "selcom-small-bill",
    company: "סלקום אנרגי",
    planName: "חשבון קטן הנחה גדולה",
    speed: "5%-10%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת חשמל סלקום אנרגי לחסכון עלפי צריכה חודשית",
      "10% הנחה בצריכה החודשית עד ש\"ח 149",
      "8% הנחה בצריכה עד 199 ש\"ח חודשית",
      "6% הנחה בצריכה עד 299 ש\"ח חודשית",
      "5% הנחה בצריכה 300ח שית עד הולית",
      "הנחה מדורגת בהתאם לצריכה החודשית",
      "למבותה זמין לאבותים גם ללא מונה חכם"
    ],
    color: "bg-gradient-to-br from-orange-400 to-orange-600"
  },
  {
    id: "selcom-day-savings",
    company: "סלקום אנרגי", 
    planName: "חסכים ביום",
    speed: "15%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת חשמל סלקום אנרגי לחסכון בשעות היום בימים א'-ה' משעה 7:00 ועד השעה 17:00",
      "15% הנחה",
      "חסכון בשעות היום",
      "הנחה בימים א'-ה' בין השעות 7:00 ועד 17:00",
      "במבותה זמין צורך במונה חכם"
    ],
    color: "bg-gradient-to-br from-orange-400 to-orange-600"
  },

  // פרטנר חשמל
  {
    id: "partner-power-night",
    company: "פרטנר חשמל",
    planName: "חית לילה",
    speed: "20%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת חשמל פרטנר פאוור לחסכון בשעות הלילה בימים א'-ה' משעה 23:00 ועד השעה 07:00",
      "20% הנחה",
      "חסכון בשעות הלילה",
      "הנחה בימים א'-ה' ועד 23:00 בשעות 07:00",
      "במבותה זמין צורך במונה חכם"
    ],
    color: "bg-gradient-to-br from-red-400 to-red-600"
  }
];
