import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, Sparkles, Star, TrendingUp, Zap, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { enhancedToast } from '@/components/EnhancedToast';
import SimpleStepsBanner from '@/components/marketing/SimpleStepsBanner';
import savingsIcon from '@/assets/savings-icon.png';

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
              
              {/* Enhanced Main Title with Icon */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <img 
                  src={savingsIcon} 
                  alt="חיסכון כסף" 
                  className="w-16 h-16 lg:w-20 lg:h-20 animate-pulse"
                />
                <h1 className="text-5xl lg:text-6xl font-display font-black tracking-tight leading-tight">
                  תפסיקו לבזבז כסף
                  <br />
                  <span className="relative">
                    <span className="bg-gradient-to-l from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x bg-300%">
                      על חשבונות מנופחים
                    </span>
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-600 to-purple-600 rounded-full animate-gradient-x bg-300%"></div>
                  </span>
                </h1>
                <img 
                  src={savingsIcon} 
                  alt="חיסכון כסף" 
                  className="w-16 h-16 lg:w-20 lg:h-20 animate-pulse"
                  style={{ animationDelay: '1s' }}
                />
              </div>
              
              {/* Enhanced Subtitle */}
              <div className="space-y-3 mb-10">
                <p className="text-xl lg:text-2xl text-muted-foreground font-body font-light leading-relaxed max-w-4xl mx-auto">
                  אנחנו נמצא לכם את הספקים הזולים ביותר ונבצע עבורכם את כל המעבר
                </p>
                <p className="text-lg font-display font-semibold">
                  <span className="bg-gradient-to-l from-success via-emerald-600 to-green-600 bg-clip-text text-transparent">
                    המשפחה הממוצעת חוסכת ₪2,400 בשנה
                  </span>
                  {" "}עם השירות שלנו
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
                  
                  <div className="space-y-6 text-right">
                    <p className="text-xl text-muted-foreground font-elegant leading-relaxed">
                      אנחנו מאמינים שכל משפחה ועסק בישראל ראויים לשקיפות ולהוגנות בעולם השירותים הבסיסיים. 
                      <strong className="text-foreground font-semibold"> השליחות שלנו פשוטה אך חיונית - לקזז עלויות מיותרות ולהחזיר לכם את האלפי שקלים שמגיעים לכם מדי שנה.</strong>
                    </p>
                    
                    <p className="text-lg text-muted-foreground font-body leading-relaxed">
                      במקום להישאר תקועים בחוזים יקרים, תעריפים מנופחים ושיחות שימור מייגעות, 
                      אנחנו מביאים לכם מהפכה אמיתית - טכנולוגיה מתקדמת שמנתחת את השוק בזמן אמת, 
                      מזהה הזדמנויות חיסכון ומבצעת עבורכם את כל התהליך הבירוקרטי.
                    </p>
                    
                    <p className="text-lg text-muted-foreground font-body leading-relaxed">
                      האמת הפשוטה היא שהספקים מרוויחים מחוסר המידע שלכם. הם סומכים על העצלות, הפחד מהביורוקרטיה 
                      והקושי להשוות מחירים. <strong className="text-primary text-xl font-semibold">אנחנו משברים את המעגל הזה</strong> - 
                      נותנים לכם כוח, מידע ויכולת לקבל החלטות חכמות שיחסכו לכם כסף אמיתי.
                    </p>
                    
                    <div className="bg-gradient-to-r from-primary/10 to-success/10 p-6 rounded-3xl border border-primary/30 mt-8 shadow-lg">
                      <p className="text-lg text-muted-foreground leading-relaxed font-body">
                        <strong className="text-primary text-xl font-bold">החזון שלנו:</strong> עולם שבו כל צרכן בישראל יודע בדיוק כמה הוא משלם, 
                        למה הוא משלם, ויש לו את הכלים לשנות את המצב תוך דקות. עד היום חסכנו לאלפי משפחות ועסקים מעל 
                        <strong className="text-success text-2xl font-bold"> 15 מיליון שקל בשנה האחרונה בלבד</strong>.
                      </p>
                      
                      <div className="flex flex-wrap gap-4 justify-end mt-6">
                        <div className="flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full border border-primary/30">
                          <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                          <span className="text-base font-semibold text-primary">שקיפות מלאה</span>
                        </div>
                        <div className="flex items-center gap-2 bg-success/20 px-4 py-2 rounded-full border border-success/30">
                          <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                          <span className="text-base font-semibold text-success">חיסכון מבטיח</span>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/30">
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-base font-semibold text-blue-600">שירות אישי</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              {/* Banner */}
                <div className="flex justify-center lg:justify-start">
                  <SimpleStepsBanner />
                </div>
              </div>

              {/* Primary CTA - Directly under banner - Super enlarged */}
              <div className="flex justify-center items-center mt-12">
                <Link to="/analyze" className="group">
                  <Button 
                    size="lg" 
                    className="px-16 py-8 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white font-black text-3xl lg:text-4xl shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 border-0 relative overflow-hidden rounded-3xl ring-4 ring-emerald-500/30 hover:ring-emerald-500/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                    <span className="relative flex items-center gap-6">
                      <span className="drop-shadow-lg">בדקו כמה תחסכו עכשיו</span>
                      <ArrowRight className="h-8 w-8 group-hover:translate-x-3 transition-transform duration-300 drop-shadow-lg" />
                    </span>
                  </Button>
                </Link>
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

            </div>
          </div>
        </div>
      </section>

      {/* Modern Problems vs 2025 Solutions */}
      <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-muted to-muted/50 rounded-full border border-border mb-6">
                <span className="text-muted-foreground font-medium text-sm">הבעיות של היום vs הפתרונות של 2025</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-display font-black mb-6 text-foreground leading-tight">
                למה עדיין מבזבזים כסף 
                <span className="block text-destructive">בלי שום סיבה?</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                בזמן שהעולם התקדם, הספקים בישראל עדיין משתמשים בשיטות מיושנות כדי לגרום לכם להישאר
              </p>
            </div>
            
            {/* Problems vs Solutions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              
              {/* Current Problems */}
              <div className="space-y-8">
                <h3 className="text-2xl font-display font-bold text-destructive mb-8 text-center">
                  💔 המצב הנוכחי
                </h3>
                
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-destructive/5 to-orange-500/5 rounded-2xl border border-destructive/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📞</span>
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-lg text-foreground mb-2">שיחות שימור אינסופיות</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          שעות של המתנה, העברות בין מחלקות, הבטחות ריקות ולחץ פסיכולוגי. 
                          הזמן שלכם יקר מדי בשביל זה.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-orange-500/5 to-amber-500/5 rounded-2xl border border-orange-500/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📋</span>
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-lg text-foreground mb-2">ביורוקרטיה מיותרת</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          טפסים מסובכים, חתימות, אישורים ותהליכים שנועדו להרתיע אתכם מלעבור ספק.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 rounded-2xl border border-amber-500/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🫣</span>
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-lg text-foreground mb-2">חוסר שקיפות מוחלט</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          תעריפים נסתרים, עמלות מפתיעות והנחות שנעלמות. אף אחד לא מסביר לכם מה בדיוק אתם משלמים.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2025 Solutions */}
              <div className="space-y-8">
                <h3 className="text-2xl font-display font-bold text-success mb-8 text-center">
                  ✨ המציאות החדשה
                </h3>
                
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-2xl border border-primary/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🤖</span>
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-lg text-foreground mb-2">AI עושה הכל בשבילכם</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          בינה מלאכותית מנתחת אלפי תעריפים תוך שניות, מוצאת את הדיל הטוב ביותר ומבצעת את כל התהליך.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-success/5 to-green-500/5 rounded-2xl border border-success/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-lg text-foreground mb-2">שקיפות מוחלטת</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          כל התעריפים, העמלות וההנחות - הכל גלוי, ברור ומוסבר בשפה פשוטה שכולם מבינים.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl border border-blue-500/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">⚡</span>
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-lg text-foreground mb-2">מהירות וקלות</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          5 דקות להזין נתונים, תוצאות מיידיות, ושבוע למעבר מלא. הכל דיגיטלי, חלק ובלי מאמץ.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-gradient-to-r from-card to-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50 shadow-xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-success to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-3xl">💡</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4">
                  המהפכה כבר התחילה
                </h3>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  בעוד שאלפי ישראלים עדיין תקועים בשיטות מיושנות, 
                  <strong className="text-primary"> משפחות חכמות כבר חוסכות איתנו מיליונים</strong>
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="text-4xl font-black text-success mb-2 group-hover:scale-110 transition-transform">15M₪</div>
                  <div className="text-muted-foreground">נחסכו השנה</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-black text-primary mb-2 group-hover:scale-110 transition-transform">4,500+</div>
                  <div className="text-muted-foreground">לקוחות מרוצים</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-black text-blue-600 mb-2 group-hover:scale-110 transition-transform">96%</div>
                  <div className="text-muted-foreground">מוצאים חיסכון</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section - Why Choose Us */}
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

      {/* Secondary CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-primary-glow/10 to-background relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-3xl lg:text-4xl font-display font-black mb-4 text-foreground">
                מוכנים להתחיל לחסוך?
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                תוך 3 דקות תדעו בדיוק כמה כסף אתם מבזבזים מיותר ואיך לתקן את זה
              </p>
            </div>
            
            <div className="flex justify-center">
              <Link to="/analyze" className="group">
                <Button 
                  size="lg" 
                  className="px-10 py-5 bg-gradient-to-r from-primary via-primary-glow to-blue-600 hover:from-primary-glow hover:via-blue-600 hover:to-purple-600 text-white font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 relative overflow-hidden rounded-xl"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                  <span className="relative flex items-center gap-3">
                    התחילו את הניתוח החינמי
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Trust elements */}
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>חינמי לחלוטין</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>תוצאות מיידיות</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>ללא התחייבות</span>
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