import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, Sparkles, Star, TrendingUp, Zap, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { enhancedToast } from '@/components/EnhancedToast';
import SimpleStepsBanner from '@/components/marketing/SimpleStepsBanner';

const Home = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [{
    title: "השוואה מתקדמת",
    description: "אלגוריתמי AI מנתחים אלפי תעריפים בזמן אמת",
    icon: TrendingUp
  }, {
    title: "מעבר אוטומטי",
    description: "אנחנו מטפלים בכל התהליך - ניתוק והתחברות",
    icon: Zap
  }, {
    title: "ללא עמלות",
    description: "השירות חינם לחלוטין - אנחנו מקבלים מהספקים",
    icon: Star
  }, {
    title: "תמיכה 24/7",
    description: "צוות מקצועי זמין לכם בכל שעה",
    icon: Users
  }, {
    title: "אבטחה מלאה",
    description: "הצפנת נתונים ברמה בנקאית",
    icon: Shield
  }, {
    title: "מעקב בזמן אמת",
    description: "עדכונים על סטטוס המעבר בכל שלב",
    icon: CheckCircle
  }];

  const testimonials = [{
    name: "שרה כהן",
    role: "לקוחה מרוצה",
    content: "חסכתי 1,200 ₪ בשנה בקלות! השירות מקצועי והתהליך פשוט.",
    rating: 5,
    savings: "₪1,200"
  }, {
    name: "דני לוי",
    role: "בעל עסק",
    content: "הפלטפורמה הכי מתקדמת שיש. חיסכון משמעותי בזמן וכסף.",
    rating: 5,
    savings: "₪3,400"
  }, {
    name: "מיכל אברהם",
    role: "אמא לשלושה",
    content: "סוף סוף מצאתי פתרון שמתאים לכל המשפחה. מומלץ בחום!",
    rating: 5,
    savings: "₪2,100"
  }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 font-body overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-background to-secondary/5" />
        <div className="absolute top-10 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-primary/8 to-purple-500/8 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-1/3 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/8 to-blue-500/8 rounded-full blur-3xl animate-float" style={{
          animationDelay: '2s'
        }} />
        <div className="absolute top-1/2 left-10 w-[400px] h-[400px] bg-gradient-to-br from-orange-400/6 to-pink-500/6 rounded-full blur-3xl animate-float" style={{
          animationDelay: '4s'
        }} />
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className={`transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {/* Compact Premium Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 rounded-full border border-primary/20 mb-6 backdrop-blur-sm shadow-sm">
                <div className="w-4 h-4 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
                <span className="text-xs font-display font-semibold bg-gradient-to-l from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  הפלטפורמה המתקדמת ביותר • 2025
                </span>
              </div>
              
              {/* Enhanced Main Title */}
              <h1 className="text-5xl lg:text-6xl font-display font-black mb-6 tracking-tight leading-tight">
                השוואה והחלפה
                <br />
                <span className="relative">
                  <span className="bg-gradient-to-l from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x bg-300%">
                    חכמה של ספקים
                  </span>
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-600 to-purple-600 rounded-full animate-gradient-x bg-300%"></div>
                </span>
              </h1>
              
              {/* Enhanced Subtitle */}
              <div className="space-y-3 mb-10">
                <p className="text-xl lg:text-2xl text-muted-foreground font-body font-light leading-relaxed max-w-4xl mx-auto">
                  הפלטפורמה המתקדמת ביותר להשוואת תעריפים והחלפת ספקי שירות
                </p>
                <p className="text-lg font-display font-semibold">
                  <span className="bg-gradient-to-l from-success via-emerald-600 to-green-600 bg-clip-text text-transparent">
                    חסכו עד 45% בחשבונות החודשיים
                  </span>
                  {" "}עם טכנולוגיית AI מתקדמת
                </p>
              </div>

              {/* Mission & Banner Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mt-12">
                {/* Mission Text */}
                <div className="space-y-6">
                  <div className="text-right">
                    <h2 className="text-2xl lg:text-3xl font-display font-bold mb-4 leading-tight">
                      <span className="bg-gradient-to-l from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                        השליחות שלנו
                      </span>
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-primary to-blue-600 rounded-full mb-6 mr-auto"></div>
                  </div>
                  
                  <div className="space-y-5 text-right">
                    <p className="text-lg text-muted-foreground font-body leading-relaxed">
                      אנחנו מאמינים שכל משפחה ועסק בישראל ראויים לשקיפות ולהוגנות בעולם השירותים הבסיסיים. 
                      <strong className="text-foreground"> השליחות שלנו פשוטה אך חיונית - לקזז עלויות מיותרות ולהחזיר לכם את האלפי שקלים שמגיעים לכם מדי שנה.</strong>
                    </p>
                    
                    <p className="text-base text-muted-foreground font-body leading-relaxed">
                      במקום להישאר תקועים בחוזים יקרים, תעריפים מנופחים ושיחות שימור מייגעות, 
                      אנחנו מביאים לכם מהפכה אמיתית - טכנולוגיה מתקדמת שמנתחת את השוק בזמן אמת, 
                      מזהה הזדמנויות חיסכון ומבצעת עבורכם את כל התהליך הבירוקרטי.
                    </p>
                    
                    <p className="text-base text-muted-foreground font-body leading-relaxed">
                      האמת הפשוטה היא שהספקים מרוויחים מחוסר המידע שלכם. הם סומכים על העצלות, הפחד מהביורוקרטיה 
                      והקושי להשוות מחירים. <strong className="text-primary">אנחנו משברים את המעגל הזה</strong> - 
                      נותנים לכם כוח, מידע ויכולת לקבל החלטות חכמות שיחסכו לכם כסף אמיתי.
                    </p>
                    
                    <div className="bg-gradient-to-r from-primary/5 to-success/5 p-4 rounded-2xl border border-primary/20 mt-6">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <strong className="text-primary">החזון שלנו:</strong> עולם שבו כל צרכן בישראל יודע בדיוק כמה הוא משלם, 
                        למה הוא משלם, ויש לו את הכלים לשנות את המצב תוך דקות. עד היום חסכנו לאלפי משפחות ועסקים מעל 
                        <strong className="text-success"> 15 מיליון שקל בשנה האחרונה בלבד</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Banner */}
                <div className="flex justify-center lg:justify-start">
                  <SimpleStepsBanner />
                </div>
              </div>

              {/* Providers Badge - Enhanced */}
              <div className="text-center mt-16">
                <p className="text-sm text-muted-foreground mb-4 font-medium">עובדים עם כל הספקים המובילים בישראל</p>
                <div className="flex justify-center gap-3 flex-wrap">
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white/70 hover:bg-white/90 transition-colors font-medium shadow-sm">פלאפון</Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white/70 hover:bg-white/90 transition-colors font-medium shadow-sm">סלקום</Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white/70 hover:bg-white/90 transition-colors font-medium shadow-sm">HOT</Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white/70 hover:bg-white/90 transition-colors font-medium shadow-sm">בזק</Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white/70 hover:bg-white/90 transition-colors font-medium shadow-sm">פרטנר</Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white/70 hover:bg-white/90 transition-colors font-medium shadow-sm">חח"י</Badge>
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white/70 hover:bg-white/90 transition-colors font-medium shadow-sm">+עוד</Badge>
                </div>
              </div>

              {/* Primary CTA - Single button */}
              <div className="flex justify-center items-center mt-12">
                <Link to="/analyze" className="group">
                  <Button 
                    size="lg" 
                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                    <span className="relative flex items-center gap-3">
                      בדקו כמה תחסכו עכשיו
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section - Instead of tips */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">
                <span className="bg-gradient-to-l from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  למה בוחרים בנו אלפי משפחות ועסקים?
                </span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                כי אנחנו הפלטפורמה היחידה שמשלבת טכנולוגיה מתקדמת עם שירות אישי מקצועי
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[{
                icon: "🎯",
                title: "דיוק מושלם",
                description: "האלגוריתם שלנו לוקח בחשבון את הפרופיל הספציפי שלכם - גודל משפחה, צריכה, העדפות, ומוצא את הפתרון המושלם בדיוק עבורכם",
                stats: "דיוק של 96.8%",
                color: "from-blue-500 to-cyan-600"
              }, {
                icon: "⚡",
                title: "מהירות שוברת שיאים",
                description: "בזמן שאתם שותים קפה אחד, המערכת שלנו כבר סורקת כל הספקים, מחשבת, ומציגה לכם את האפשרויות הטובות ביותר עם כל הפרטים",
                stats: "תוצאות תוך 90 שניות",
                color: "from-emerald-500 to-green-600"
              }, {
                icon: "🛡️",
                title: "בטיחות ללא פשרות",
                description: "רמת הצפנה בנקאית, אבטחת נתונים ברמה הגבוהה ביותר, ושקיפות מלאה. כל המידע שלכם נשמר בבטחה ולא נמכר לגורמים שלישיים",
                stats: "אבטחה ברמה בנקאית",
                color: "from-purple-500 to-indigo-600"
              }, {
                icon: "💰",
                title: "חיסכון מבטיח",
                description: "לא רק משווים - גם מבטיחים חיסכון. אם לא חסכתם לפחות 15% מהחשבון החודשי, אנחנו מחזירים לכם את ההפרש במזומן",
                stats: "גרנטי חיסכון 15%+",
                color: "from-amber-500 to-orange-600"
              }, {
                icon: "🎪",
                title: "שירות VIP לכולם",
                description: "יש לנו נציג אישי לכל לקוח. לא בוטים, לא מוקד טלפוני - בן אדם אמיתי שמכיר את התיק שלכם ועונה תוך דקות בוואטסאפ",
                stats: "מענה תוך 3 דקות בממוצע",
                color: "from-pink-500 to-rose-600"
              }, {
                icon: "🔄",
                title: "מעקב חי 24/7",
                description: "אפליקציה נייחת שמתעדכנת בזמן אמת על כל שלב במעבר. תדעו בדיוק איפה אתם עומדים ומתי הכל יהיה מוכן - ללא הפתעות",
                stats: "עדכונים בזמן אמת",
                color: "from-teal-500 to-blue-600"
              }].map((feature, index) => (
                <div key={index} className="group bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm border border-border/40 rounded-3xl p-6 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2">
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-xl mx-auto mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-display font-bold text-xl mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-body text-sm mb-4">{feature.description}</p>
                    <div className={`inline-block px-3 py-1.5 bg-gradient-to-r ${feature.color} text-white rounded-full text-xs font-display font-bold shadow-lg`}>
                      {feature.stats}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2025 Revolution Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 text-gray-800 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            
            {/* Main revolutionary message */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-gray-200/50 shadow-2xl hover:shadow-3xl transition-all duration-500 mb-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-orange-100 rounded-full border border-red-200 mb-6">
                  <span className="text-red-600 font-bold text-sm">⚠️ המצב הנוכחי חייב להשתנות</span>
                </div>
                <h2 className="text-4xl font-fredoka font-black mb-4 text-gray-800 leading-tight">
                  למה בשנת 2025 אנחנו עדיין 
                  <span className="text-red-600 block">מבזבזים כסף בלי סיבה?</span>
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 rounded-full mx-auto"></div>
              </div>
              
              <div className="space-y-8">
                {/* Current Problems */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-fredoka font-bold text-red-700 mb-4">
                      🚫 החסרונות של היום
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50/80 rounded-2xl border border-red-200/50">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">😤</div>
                          <div>
                            <h4 className="font-fredoka font-bold text-red-800 mb-2">שיחות שימור אינסופיות</h4>
                            <p className="text-sm text-red-700 leading-relaxed">
                              שעות של טלפונים, השהיות, הבטחות ריקות והעברות בין מחלקות. 
                              זמן יקר שאתם מבזבזים במקום לחיות.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-orange-50/80 rounded-2xl border border-orange-200/50">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">📋</div>
                          <div>
                            <h4 className="font-fredoka font-bold text-orange-800 mb-2">ביורוקרטיה מיותרת</h4>
                            <p className="text-sm text-orange-700 leading-relaxed">
                              טפסים, חתימות, אישורים, המתנות. תהליכים מסובכים בכוונה 
                              כדי שתוותרו ותישארו בתעריף היקר.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-50/80 rounded-2xl border border-yellow-200/50">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">🕳️</div>
                          <div>
                            <h4 className="font-fredoka font-bold text-yellow-800 mb-2">חוסר שקיפות מוחלט</h4>
                            <p className="text-sm text-yellow-700 leading-relaxed">
                              תעריפים נסתרים, עמלות מסתירות, הנחות זמניות שנעלמות. 
                              אף אחד לא מסביר לכם את האמת.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-2xl font-fredoka font-bold text-green-700 mb-4">
                      ✨ איך זה צריך להיראות ב-2025
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50/80 rounded-2xl border border-green-200/50">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">⚡</div>
                          <div>
                            <h4 className="font-fredoka font-bold text-green-800 mb-2">טכנולוגיה חכמה</h4>
                            <p className="text-sm text-green-700 leading-relaxed">
                              AI מנתח עבורכם אלפי תעריפים תוך שניות, מוצא את הדיל הטוב ביותר 
                              ומבצע את כל התהליך אוטומטית.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200/50">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">🎯</div>
                          <div>
                            <h4 className="font-fredoka font-bold text-blue-800 mb-2">שקיפות מוחלטת</h4>
                            <p className="text-sm text-blue-700 leading-relaxed">
                              כל התעריפים, כל העמלות, כל ההנחות - הכל גלוי, ברור ומוסבר 
                              בשפה פשוטה ומובנת.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-200/50">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">🚀</div>
                          <div>
                            <h4 className="font-fredoka font-bold text-purple-800 mb-2">מהירות וקלות</h4>
                            <p className="text-sm text-purple-700 leading-relaxed">
                              5 דקות להזין נתונים, 2 דקות לקבל תוצאות, 
                              ושבוע אחד למעבר מלא. הכל דיגיטלי וחלק.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* The Reality Check */}
                <div className="mt-10 p-8 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 rounded-3xl border-2 border-primary/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5 animate-pulse"></div>
                  <div className="relative z-10 text-center">
                    <div className="text-6xl mb-4">💡</div>
                    <h3 className="text-2xl font-fredoka font-black text-primary mb-6">
                      המציאות החדשה כבר כאן
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6 max-w-3xl mx-auto">
                      בעוד שרוב הישראלים עדיין תקועים בשיטות של שנות ה-90, 
                      <strong className="text-primary"> אלפי משפחות חכמות כבר חוסכות איתנו מיליוני שקלים מדי שנה</strong>. 
                      הן לא מחכות לספקים - הן מחליפות אותם בקליק.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                      <div className="p-4 bg-white/70 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all">
                        <div className="text-3xl font-black text-primary mb-2">15M₪</div>
                        <div className="text-sm text-gray-600">נחסכו בשנה האחרונה</div>
                      </div>
                      <div className="p-4 bg-white/70 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all">
                        <div className="text-3xl font-black text-success mb-2">4,500+</div>
                        <div className="text-sm text-gray-600">משפחות חסכו כבר</div>
                      </div>
                      <div className="p-4 bg-white/70 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all">
                        <div className="text-3xl font-black text-blue-600 mb-2">96%</div>
                        <div className="text-sm text-gray-600">מוצאים חיסכון משמעותי</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="text-center">
              <div className="max-w-2xl mx-auto">
                <p className="text-xl font-comfortaa text-gray-700 mb-6 leading-relaxed">
                  <strong className="text-primary">השאלה היא לא אם תחסכו כסף</strong> - 
                  השאלה היא כמה זמן אתם מוכנים לחכות עד שתתחילו?
                </p>
                
                <div className="flex justify-center gap-3 flex-wrap">
                  <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20">✓ ללא סיכון</span>
                  <span className="inline-block px-4 py-2 bg-success/10 text-success rounded-full text-sm font-bold border border-success/20">✓ ללא עלות</span>
                  <span className="inline-block px-4 py-2 bg-blue-500/10 text-blue-600 rounded-full text-sm font-bold border border-blue-500/20">✓ תוצאות תוך דקות</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Tips - Moved to bottom in sidebar style */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
            
            {/* Main FAQ Content */}
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-display font-bold mb-4">
                  <span className="bg-gradient-to-l from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    שאלות נפוצות
                  </span>
                </h2>
                <p className="text-muted-foreground">תשובות לשאלות הנפוצות ביותר שאנחנו מקבלים</p>
              </div>

              <div className="space-y-4">
                {[{
                  q: "האם השירות באמת חינם?",
                  a: "כן! אנחנו לא גובים כלום מהלקוחות. הכנסה שלנו מגיעה מהספקים החדשים כשאתם עוברים אליהם."
                }, {
                  q: "כמה זמן לוקח לקבל תוצאות?",
                  a: "הניתוח מוכן תוך דקות ספורות. המעבר הפיזי לוקח 3-7 ימי עסקים בהתאם לסוג השירות."
                }, {
                  q: "מה אם אני כבר בהתקשרות?",
                  a: "אנחנו בודקים את תנאי ההתקשרות ויכולים לייעץ מתי כדאי לעבור ומתי לחכות."
                }, {
                  q: "האם יש ביטול אוטומטי מהספק הישן?",
                  a: "כן! חלק מהתהליך שלנו כולל טיפול בביטול מהספק הישן כך שלא תשלמו כפול."
                }, {
                  q: "האם אני מחויב לעבור לספק שאתם ממליצים?",
                  a: "בהחלט לא! אתם מקבלים את המלצותינו ויכולים לבחור בעצמכם. אם תחליטו לא לעבור - זה בסדר גמור."
                }, {
                  q: "איך אתם מרוויחים כסף?",
                  a: "אנחנו מקבלים עמלה מהספק החדש רק אם אתם בוחרים לעבור אליו. לכן האינטרס שלנו הוא למצוא לכם באמת את הדיל הטוב ביותר."
                }, {
                  q: "האם אתם עובדים עם כל הספקים?",
                  a: "כן, אנחנו עובדים עם כל הספקים הגדולים בישראל ועם עשרות ספקים קטנים יותר."
                }, {
                  q: "מה קורה אם אני לא מרוצה מהמעבר?",
                  a: "יש לנו אחריות מלאה על התהליך. אם משהו לא תקין, אנחנו מטפלים בזה ללא עלות."
                }, {
                  q: "האם המידע שלי בטוח?",
                  a: "כן, אנחנו משתמשים בהצפנה ברמה בנקאית ולא שומרים מידע רגיש יותר מהנדרש."
                }].map((faq, index) => (
                  <div key={index} className="bg-card/80 backdrop-blur-sm border border-border/40 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                    <h3 className="font-display font-semibold text-lg mb-3 text-foreground">{faq.q}</h3>
                    <p className="text-muted-foreground leading-relaxed font-body">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Side Tips Panel */}
            <div className="lg:sticky lg:top-8 h-fit">
              <div className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-sm border border-border/40 rounded-3xl p-6 shadow-xl">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg">
                    💡
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">
                    <span className="bg-gradient-to-l from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                      טיפים לחיסכון
                    </span>
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    מהניסיון שלנו עם אלפי לקוחות
                  </p>
                </div>

                <div className="space-y-4">
                  {[{
                    icon: "📊",
                    title: "בדקו חשבונות מידי חודש",
                    description: "עקבו אחרי הצריכה - זיהוי מוקדם של עליות"
                  }, {
                    icon: "⏰",
                    title: "תוקף ההתקשרויות",
                    description: "הנחות זמניות נגמרות - חשוב לעקוב"
                  }, {
                    icon: "🔄",
                    title: "אל תפחדו להחליף",
                    description: "היום זה פשוט ויכול לחסוך אלפי שקלים"
                  }].map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-br from-background/80 to-muted/20 rounded-2xl border border-border/20">
                      <div className="text-lg">{tip.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-display font-semibold text-sm mb-1">{tip.title}</h4>
                        <p className="text-muted-foreground text-xs leading-tight font-body">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;