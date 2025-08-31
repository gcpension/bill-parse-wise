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
  {
    id: "partner-fiber-5000",
    company: "Partner Fiber",
    planName: "במהירות עד",
    speed: "5000Mb",
    introPrice: 69,
    introMonths: 3,
    regularPrice: 209,
    uploadSpeed: "500 Mb",
    downloadSpeed: "5000 Mb",
    features: [
      "כולל מתאם תקין ללא תוספת תשלום"
    ],
    color: "bg-gradient-to-br from-teal-400 to-teal-500"
  },
  {
    id: "partner-fiber-1000",
    company: "Partner Fiber", 
    planName: "במהירות עד",
    speed: "1000Mb",
    introPrice: 49,
    introMonths: 3,
    regularPrice: 139,
    uploadSpeed: "250 Mb",
    downloadSpeed: "1000 Mb",
    features: [
      "כולל CyberGuard",
      "כולל Easy Mesh מדיו סוויץ",
      "כדיקהההההההש",
      "החל מחודש ה-13 ב-149 ₪ לחודש",
      "התקנה בתיים בדירות בבנייין"
    ],
    color: "bg-gradient-to-br from-teal-400 to-teal-500"
  },
  {
    id: "partner-fiber-600-new",
    company: "Partner Fiber",
    planName: "במהירות עד", 
    speed: "600Mb",
    introPrice: 69,
    introMonths: 1,
    regularPrice: 100,
    uploadSpeed: "100 Mb",
    downloadSpeed: "600 Mb",
    features: [
      "נתב פייבר בהשכרה בתוספת 25 ₪ לחודש",
      "התקנה בתיים בדירות בבנייין"
    ],
    color: "bg-gradient-to-br from-teal-400 to-teal-500"
  },
  {
    id: "partner-fiber-300",
    company: "Partner Fiber",
    planName: "במהירות עד", 
    speed: "300Mb",
    introPrice: 69,
    introMonths: 1,
    regularPrice: 90,
    uploadSpeed: "30 Mb",
    downloadSpeed: "300 Mb",
    features: [
      "חבילת פרטנר פייבר עד 300 (טווח ומהירות טובים אופטימיים של פרטנר)"
    ],
    color: "bg-gradient-to-br from-teal-400 to-teal-500"
  }
];
