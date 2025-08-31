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
  category: 'electricity' | 'internet' | 'mobile';
  dataAmount?: string;
  smsAmount?: string;
  callMinutes?: string;
}

export const manualPlans: ManualPlan[] = [
  // === חבילות חשמל ===
  
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
    color: "bg-gradient-to-br from-blue-400 to-blue-600",
    category: "electricity"
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
    color: "bg-gradient-to-br from-blue-400 to-blue-600",
    category: "electricity"
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
    color: "bg-gradient-to-br from-blue-400 to-blue-600",
    category: "electricity"
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
    color: "bg-gradient-to-br from-green-400 to-green-600",
    category: "electricity"
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
    color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    category: "electricity"
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
    color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    category: "electricity"
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
    color: "bg-gradient-to-br from-purple-400 to-purple-600",
    category: "electricity"
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
    color: "bg-gradient-to-br from-purple-400 to-purple-600",
    category: "electricity"
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
    color: "bg-gradient-to-br from-purple-400 to-purple-600",
    category: "electricity"
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
    color: "bg-gradient-to-br from-purple-400 to-purple-600",
    category: "electricity"
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
    color: "bg-gradient-to-br from-orange-400 to-orange-600",
    category: "electricity"
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
    color: "bg-gradient-to-br from-orange-400 to-orange-600",
    category: "electricity"
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
    color: "bg-gradient-to-br from-orange-400 to-orange-600",
    category: "electricity"
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
    color: "bg-gradient-to-br from-orange-400 to-orange-600",
    category: "electricity"
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
    color: "bg-gradient-to-br from-orange-400 to-orange-600",
    category: "electricity"
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
    color: "bg-gradient-to-br from-orange-400 to-orange-600",
    category: "electricity"
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
    color: "bg-gradient-to-br from-orange-400 to-orange-600",
    category: "electricity"
  },

  // פרטנר חשמל
  {
    id: "partner-power-fixed-savings",
    company: "פרטנר פאוור",
    planName: "הנחה קבועה כל היום",
    speed: "5%-7%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת חשמל פרטנר פאוור לחסכון קבוע בכל שעות היום וימות השבוע",
      "6% הנחה בשעות השעירייה",
      "5% הנחה ראשונה",
      "הנחה קבועה בכל ימות השבוע וכל שעות היממה",
      "7% הנחה שלישית",
      "למבותה זמין לאבותים גם ללא מונה חכם"
    ],
    color: "bg-gradient-to-br from-red-400 to-red-600",
    category: "electricity"
  },
  {
    id: "partner-power-workers",
    company: "פרטנר פאוור",
    planName: "עובדים מהבית",
    speed: "15%",
    introPrice: 0,
    introMonths: 0,
    regularPrice: 0,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "חבילת חשמל פרטנר פאוור לחסכון בשעות היום בימים א'-ה' משעה 7:00 ועד השעה 17:00",
      "15% הנחה",
      "חסכון בשעות היום",
      "הנחה בימים א'-ה' בין השעות 7:00 ועד 17:00",
      "במבותה זמין צורך במונה חכם"
    ],
    color: "bg-gradient-to-br from-red-400 to-red-600",
    category: "electricity"
  },

  // === חבילות אינטרנט/סלולר ===

  // 019 מובייל
  {
    id: "019-mobile-40gb",
    company: "019 מובייל",
    planName: "חבילת אינטרנט 40 מגה",
    speed: "",
    introPrice: 82,
    introMonths: 0,
    regularPrice: 82,
    uploadSpeed: "",
    downloadSpeed: "",
    dataAmount: "40 GB",
    features: [
      "חבילת אינטרנט ספק והשירת 40 מגה",
      "אינטרנט ברג'ת 40 מגה",
      "זמב בקטלת של 8 שע לחודש",
      "משלוח חודשי קבוע",
      "ללקותות עם השוגת בוק קייטת ברגית"
    ],
    color: "bg-gradient-to-br from-pink-400 to-pink-600",
    category: "mobile"
  },
  {
    id: "019-mobile-100gb",
    company: "019 מובייל",
    planName: "חבילת אינטרנט 100 מגה",
    speed: "",
    introPrice: 82,
    introMonths: 0,
    regularPrice: 82,
    uploadSpeed: "",
    downloadSpeed: "",
    dataAmount: "100 GB",
    features: [
      "חבילת אינטרנט ספק והשירת 100 מגה",
      "אינטרנט ברג'ת 100 מגה",
      "זמב בקטלת של 8 שע לחודש",
      "משלוח חודשי קבוע",
      "ללקותות עם השוגת בוק קייטת ברגית"
    ],
    color: "bg-gradient-to-br from-pink-400 to-pink-600",
    category: "mobile"
  },
  {
    id: "019-mobile-200gb",
    company: "019 מובייל",
    planName: "חבילת אינטרנט 200 מגה",
    speed: "",
    introPrice: 82,
    introMonths: 0,
    regularPrice: 82,
    uploadSpeed: "",
    downloadSpeed: "",
    dataAmount: "200 GB",
    features: [
      "חבילת אינטרנט ספק והשירת 200 מגה",
      "אינטרנט ברג'ת 200 מגה",
      "זמב בקטלת של 10 שע לחודש",
      "משלוח חודשי קבוע",
      "ללקותות עם השוגת בוק קייטת ברגית"
    ],
    color: "bg-gradient-to-br from-pink-400 to-pink-600",
    category: "mobile"
  },
  {
    id: "019-mobile-200gb-fiber",
    company: "019 מובייל",
    planName: "סיבים אופטיים - 200",
    speed: "",
    introPrice: 69,
    introMonths: 0,
    regularPrice: 69,
    uploadSpeed: "200 Mbps",
    downloadSpeed: "200 Mbps",
    features: [
      "חבילת סיבים עד 200 מגה (משירת סיבים אופטיים של אמירמיקה)",
      "מהירות הורדה עד 200Mbps",
      "מהירות העלאה עד 20Mbps",
      "זמב בקטלת של 19 שע לחודש",
      "במשך חצי שנהו",
      "הצטרפות לסיבים אופטיים במחאם לצירוף ומאוגר פרסוח המשובה"
    ],
    color: "bg-gradient-to-br from-pink-400 to-pink-600",
    category: "internet"
  },
  {
    id: "019-mobile-nester",
    company: "019 מובייל",
    planName: "אינטרנט נסטר",
    speed: "",
    introPrice: 82,
    introMonths: 0,
    regularPrice: 99,
    uploadSpeed: "",
    downloadSpeed: "",
    features: [
      "אינטרנט נסטר מסוג ואוקסר ואי וחד הרגעים",
      "אינטרנט מסוג",
      "זמב בקטלת של 8 שע לחודש",
      "אינטרנט ברג'ת- 40-200 מגה",
      "ללקותות עם השוגת בוק קייטת ברגית",
      "אפשרות להסרכת נגב בעלות שנויה. וגוף המשגית (תשתיגת רגילה או סיבים)",
      "שירת תלשית הכנים 'חונת מגן' ניתן ללקחות 019 ללקחות הבות החכםי."
    ],
    color: "bg-gradient-to-br from-pink-400 to-pink-600",
    category: "mobile"
  },
  {
    id: "019-mobile-500gb-fiber",
    company: "019 מובייל",
    planName: "סיבים אופטיים - 500",
    speed: "",
    introPrice: 69,
    introMonths: 0,
    regularPrice: 69,
    uploadSpeed: "50 Mbps",
    downloadSpeed: "500 Mbps",
    features: [
      "חבילת סיבים עד 500 מגה (משירת סיבים אופטיים של אמירמיקה)",
      "מהירות הורדה עד 500Mbps",
      "מהירות העלאה עד 50Mbps",
      "זמב בקטלת של 19 שע לחודש",
      "במשך חצי שנהו",
      "הצטרפות לסיבים אופטיים במחאם לצירוף ומאוגר פרסוח המשובה"
    ],
    color: "bg-gradient-to-br from-pink-400 to-pink-600",
    category: "internet"
  },
  {
    id: "019-mobile-1000gb-fiber",
    company: "019 מובייל",
    planName: "סיבים אופטיים - 1000",
    speed: "",
    introPrice: 69,
    introMonths: 0,
    regularPrice: 69,
    uploadSpeed: "100 Mbps",
    downloadSpeed: "1000 Mbps",
    features: [
      "חבילת סיבים עד 1000 מגה (משירת סיבים אופטיים של אמירמיקה)",
      "מהירות הורדה עד 1000Mbps",
      "מהירות העלאה עד 100Mbps",
      "זמב בקטלת של 19 שע לחודש",
      "במשך חצי שנהו",
      "הצטרפות לסיבים אופטיים במחאם לצירוף ומאוגר פרסוח המשובה"
    ],
    color: "bg-gradient-to-br from-pink-400 to-pink-600",
    category: "internet"
  },

  // YES אינטרנט
  {
    id: "yes-internet-300gb",
    company: "YES אינטרנט",
    planName: "אינטרנט בלבד",
    speed: "",
    introPrice: 109,
    introMonths: 0,
    regularPrice: 109,
    uploadSpeed: "30 Mbps",
    downloadSpeed: "300 Mbps",
    dataAmount: "300 GB",
    features: [
      "חבילת yes+FIBER עד 300 מגה (ספק ומשיחת סיבים אופטיים של בזק)",
      "אינטרנט סיבים אופטיים",
      "מהירות הורדה עד 300Mbps",
      "מהירות העלאה עד 30Mbps",
      "תוספים ראשונים חיסם",
      "הנקטת השירות -Bfiber סיבים חיסם לדירה בבנייינים",
      "נתב WiFi7 ללא עלות - ULTRA חודשים ראשונים ללא עלות",
      "הצטרפות לסיבים אופטיים במחאם לצירוף ומאוגר פרסוח המשובה"
    ],
    color: "bg-gradient-to-br from-cyan-400 to-cyan-600",
    category: "internet"
  },
  {
    id: "yes-internet-1gb",
    company: "YES אינטרנט",
    planName: "אינטרנט בלבד",
    speed: "",
    introPrice: 119,
    introMonths: 0,
    regularPrice: 119,
    uploadSpeed: "100 Mbps",
    downloadSpeed: "1000 Mbps",
    dataAmount: "1 GB",
    features: [
      "חבילת yes+FIBER עד 1 גיגה (ספק ומשיחת סיבים אופטיים של בזק)",
      "אינטרנט סיבים אופטיים",
      "מהירות הורדה עד 1000Mbps",
      "מהירות העלאה עד 100Mbps",
      "תוספים ראשונים חיסם",
      "הנקטת השירות -Bfiber סיבים חיסם לדירה בבנייינים",
      "נתב WiFi7 ללא עלות - ULTRA חודשים ראשונים ללא עלות",
      "הצטרפות לסיבים אופטיים במחאם לצירוף ומאוגר פרסוח המשובה"
    ],
    color: "bg-gradient-to-br from-cyan-400 to-cyan-600",
    category: "internet"
  },

  // בזק אינטרנט
  {
    id: "bezeq-multi-fiber-5gb",
    company: "בזק",
    planName: "Multi Fiber - במהירות 5Gb",
    speed: "",
    introPrice: 199,
    introMonths: 0,
    regularPrice: 199,
    uploadSpeed: "500 Mbps",
    downloadSpeed: "5000 Mbps",
    features: [
      "חבילת בזק Fiber עד 5 גיגה (ספק ומשיחת סיבים אופטיים של בזק)",
      "אינטרנט סיבים אופטיים",
      "מהירות הורדה עד 5000Mbps",
      "מהירות העלאה עד 500Mbps",
      "נתב WiFi7 זמב בתוספת 39.90 ש\"ח לחודש",
      "הצטרפות לסיבים אופטיים במחאם לצירוף ומאוגר פרסוח המשובה"
    ],
    color: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    category: "internet"
  },
  {
    id: "bezeq-fiber-1gb-phone",
    company: "בזק",
    planName: "תשתית Bfiber + ספק במהירות 1Gb + ספק ומהירות העלאה עד 250Mb",
    speed: "",
    introPrice: 149,
    introMonths: 0,
    regularPrice: 149,
    uploadSpeed: "250 Mbps",
    downloadSpeed: "1000 Mbps",
    features: [
      "חבילת בזק Fiber עד 1 גיגה עם מהירות העלאה עד 250Mb (ספק ומשיחת סיבים אופטיים של בזק)",
      "אינטרנט סיבים אופטיים",
      "מהירות הורדה עד 1000Mbps",
      "מהירות העלאה עד 250Mbps",
      "נתב WiFi7 בתוספת 19.90 ש\"ח לחודש",
      "הצטרפות לסיבים אופטיים במחאם לצירוף ומאוגר פרסוח המשובה"
    ],
    color: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    category: "internet"
  },
  {
    id: "bezeq-fiber-2.5gb-phone",
    company: "בזק",
    planName: "תשתית Bfiber + ספק במהירות 2.5Gb",
    speed: "",
    introPrice: 159,
    introMonths: 0,
    regularPrice: 159,
    uploadSpeed: "250 Mbps",
    downloadSpeed: "2500 Mbps",
    features: [
      "חבילת בזק Fiber עד 2.5 גיגה (ספק ומשיחת סיבים אופטיים של בזק)",
      "אינטרנט סיבים אופטיים",
      "מהירות הורדה עד 2500Mbps",
      "מהירות העלאה עד 250Mbps",
      "נתב WiFi7 בתוספת 19.90 ש\"ח לחודש",
      "הצטרפות לסיבים אופטיים במחאם לצירוף ומאוגר פרסוח המשובה"
    ],
    color: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    category: "internet"
  },
  {
    id: "bezeq-fiber-300mb-phone",
    company: "בזק",
    planName: "תשתית Bfiber + ספק במהירות 300Mb",
    speed: "",
    introPrice: 109,
    introMonths: 0,
    regularPrice: 109,
    uploadSpeed: "100 Mbps",
    downloadSpeed: "300 Mbps",
    features: [
      "חבילת בזק Fiber עד 300 מגה (ספק ומשיחת סיבים אופטיים של בזק)",
      "אינטרנט סיבים אופטיים",
      "מהירות הורדה עד 300Mbps",
      "מהירות העלאה עד 100Mbps",
      "נתב WiFi7 בתוספת 19.90 ש\"ח לחודש",
      "מהיר קבוע לשנה",
      "הצטרפות לסיבים אופטיים במחאם לצירוף ומאוגר פרסוח המשובה"
    ],
    color: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    category: "internet"
  },
  {
    id: "bezeq-fiber-1gb-phone-gift",
    company: "בזק",
    planName: "תשתית Bfiber + ספק במהירות 1Gb",
    speed: "",
    introPrice: 139,
    introMonths: 0,
    regularPrice: 139,
    uploadSpeed: "100 Mbps",
    downloadSpeed: "1000 Mbps",
    features: [
      "חבילת בזק Fiber עד 1 גיגה (ספק ומשיחת סיבים אופטיים של בזק)",
      "אינטרנט סיבים אופטיים",
      "מהירות הורדה עד 1000Mbps",
      "מהירות העלאה עד 100Mbps",
      "5 חודשים ראשונים ב-95 ש\"ח לחודש",
      "נתב WiFi7 ללא עלות 5-ב חודשים ראשונים",
      "מחיר חבילת 5 חודשים ראשונים, החל מחודש 6-12 חודשים 6-139 ש\"ח לחודש",
      "הצטרפות לסיבים אופטיים במחאם לצירוף ומאוגר פרסוח המשובה"
    ],
    color: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    category: "internet"
  },
  {
    id: "bezeq-adsl-100mb",
    company: "בזק",
    planName: "ספק+שיחת אינטרנט 100Mb",
    speed: "",
    introPrice: 95,
    introMonths: 0,
    regularPrice: 95,
    uploadSpeed: "",
    downloadSpeed: "100 Mbps",
    dataAmount: "100 MB",
    features: [
      "חבילת אינטרנט ספק ושיחת 100 מגה ג' של ADSL ג' של בזק",
      "אינטרנט ברג'ת 100 מגה",
      "3 חודשים ראשונים 45-ג ראשונים 45 ש\"ח לחודש",
      "נתב נטלי המנת סירכו AI בתוספת 19.90 ש\"ח לחודש"
    ],
    color: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    category: "internet"
  },
  {
    id: "bezeq-adsl-100mb-10mb-discount",
    company: "בזק",
    planName: "ספק + שיחת בזק 100Mb + ומהירות העלאה 10Mb",
    speed: "",
    introPrice: 99,
    introMonths: 0,
    regularPrice: 99,
    uploadSpeed: "10 Mbps",
    downloadSpeed: "100 Mbps",
    dataAmount: "100 MB",
    features: [
      "חבילת אינטרנט ספק ושיחת 100 מגה ג' של ADSL ג' של בזק",
      "אינטרנט ברג'ת 100 מגה",
      "מהיר קבוע לשנה",
      "מהירות העלאה עד 10Mbps",
      "נתב נטלי המנת סירכו AI בתוספת 19.90 ש\"ח לחודש"
    ],
    color: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    category: "internet"
  },
  {
    id: "bezeq-adsl-200mb",
    company: "בזק",
    planName: "ספק+שיחת אינטרנט 200Mb",
    speed: "",
    introPrice: 109,
    introMonths: 0,
    regularPrice: 109,
    uploadSpeed: "20 Mbps",
    downloadSpeed: "200 Mbps",
    dataAmount: "200 MB",
    features: [
      "חבילת אינטרנט ספק ושיחת 200 מגה ג' של ADSL ג' של בזק",
      "אינטרנט ברג'ת 200 מגה",
      "מהיר קבוע לשנה",
      "מהירות העלאה עד 20Mbps",
      "נתב נטלי המנת סירכו AI בתוספת 19.90 ש\"ח לחודש"
    ],
    color: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    category: "internet"
  }
];
