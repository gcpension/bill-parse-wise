import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, Sparkles, Star, TrendingUp, Zap, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { enhancedToast } from '@/components/EnhancedToast';

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

              {/* Pastel Narrow System Explanation Banner */}
              <div className="mb-8">
                <div className="relative max-w-3xl mx-auto">
                  {/* Narrow floating card with pastel background */}
                  <div className="bg-gradient-to-br from-rose-50/90 via-sky-50/90 to-emerald-50/90 dark:from-slate-800/95 dark:via-slate-700/90 dark:to-slate-600/85 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-600/30 p-5 hover:shadow-xl transition-all duration-500 animate-fade-in relative overflow-hidden">
                    {/* Subtle background decorations */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-100/30 via-purple-100/20 to-transparent rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-green-100/30 via-teal-100/20 to-transparent rounded-full blur-xl" />

                    {/* Top badge */}
                    <div className="flex justify-center mb-3 relative z-10">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/70 dark:bg-slate-700/80 rounded-full border border-slate-300/40 dark:border-slate-600/40 backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
                        <span className="text-slate-700 dark:text-slate-200 font-fredoka font-semibold text-xs">
                          איך זה עובד בפועל – שלושה שלבים פשוטים
                        </span>
                      </div>
                    </div>

                    {/* Horizontal 3-step process with more details */}
                    <div className="flex items-start justify-center gap-4 mb-3">
                      {/* Step 1 */}
                      <div className="flex-1 max-w-[140px] text-center">
                        <div className="w-9 h-9 bg-gradient-to-br from-amber-200 to-orange-200 dark:from-amber-800 dark:to-orange-800 rounded-xl flex items-center justify-center text-amber-800 dark:text-amber-200 font-fredoka font-bold text-sm mx-auto mb-1 border border-amber-300/40 dark:border-amber-600/40">
                          1
                        </div>
                        <h4 className="font-fredoka font-bold text-xs mb-1 text-amber-700 dark:text-amber-300">הזנת נתונים</h4>
                        <ul className="text-[10px] text-slate-700 dark:text-slate-200 font-comfortaa leading-snug space-y-1 text-right">
                          <li>• בחירת קטגוריות: חשמל/סלולר/אינטרנט/TV</li>
                          <li>• סכום חודשי וספק נוכחי</li>
                          <li>• אפשרות להעלאת חשבונית</li>
                        </ul>
                      </div>

                      {/* Divider */}
                      <div className="w-6 mt-5 h-0.5 bg-gradient-to-r from-amber-300 via-sky-300 to-emerald-300 rounded-full" />

                      {/* Step 2 */}
                      <div className="flex-1 max-w-[140px] text-center">
                        <div className="w-9 h-9 bg-gradient-to-br from-sky-200 to-indigo-200 dark:from-sky-800 dark:to-indigo-800 rounded-xl flex items-center justify-center text-sky-800 dark:text-sky-200 font-fredoka font-bold text-sm mx-auto mb-1 border border-sky-300/40 dark:border-sky-600/40">
                          2
                        </div>
                        <h4 className="font-fredoka font-bold text-xs mb-1 text-sky-700 dark:text-sky-300">ניתוח חכם</h4>
                        <ul className="text-[10px] text-slate-700 dark:text-slate-200 font-comfortaa leading-snug space-y-1 text-right">
                          <li>• השוואה מול אלפי תעריפים בזמן אמת</li>
                          <li>• בדיקת עמלות, קנסות ותוקף מבצעים</li>
                          <li>• חישוב חיסכון אמיתי נטו</li>
                        </ul>
                      </div>

                      {/* Divider */}
                      <div className="w-6 mt-5 h-0.5 bg-gradient-to-r from-sky-300 via-emerald-300 to-amber-300 rounded-full" />

                      {/* Step 3 */}
                      <div className="flex-1 max-w-[140px] text-center">
                        <div className="w-9 h-9 bg-gradient-to-br from-emerald-200 to-teal-200 dark:from-emerald-800 dark:to-teal-800 rounded-xl flex items-center justify-center text-emerald-800 dark:text-emerald-200 font-fredoka font-bold text-sm mx-auto mb-1 border border-emerald-300/40 dark:border-emerald-600/40">
                          3
                        </div>
                        <h4 className="font-fredoka font-bold text-xs mb-1 text-emerald-700 dark:text-emerald-300">מעבר מלא</h4>
                        <ul className="text-[10px] text-slate-700 dark:text-slate-200 font-comfortaa leading-snug space-y-1 text-right">
                          <li>• חתימה דיגיטלית מאובטחת</li>
                          <li>• אנחנו מנתקים ומחברים בשבילכם</li>
                          <li>• מעקב סטטוס בזמן אמת</li>
                        </ul>
                      </div>
                    </div>

                    {/* Bottom stats */}
                    <div className="p-2 bg-white/60 dark:bg-slate-700/60 rounded-xl border border-slate-200/40 dark:border-slate-600/40">
                      <div className="flex justify-center gap-4 text-[10px] font-comfortaa font-semibold">
                        <div className="text-emerald-700 dark:text-emerald-300"><span className="text-sm font-bold">35%</span> חיסכון</div>
                        <div className="text-slate-400">•</div>
                        <div className="text-sky-700 dark:text-sky-300"><span className="text-sm font-bold">0₪</span> עמלות</div>
                        <div className="text-slate-400">•</div>
                        <div className="text-amber-700 dark:text-amber-300"><span className="text-sm font-bold">7 ימים</span> מעבר</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Providers Badge - Enhanced */}
              <div className="text-center">
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

              {/* Primary CTAs - Enhanced */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                <Link to="/analyze" className="group">
                  <Button 
                    size="lg" 
                    className="px-8 py-4 bg-gradient-to-r from-primary via-primary-glow to-success hover:from-primary-glow hover:via-success hover:to-primary text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                    <span className="relative flex items-center gap-3">
                      בדקו כמה תחסכו עכשיו
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
                <Link to="/forms" className="group">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-primary/30 text-primary hover:bg-primary hover:text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="relative flex items-center gap-3">
                      בצעו מעבר מהיר
                      <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Tips Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">
                <span className="bg-gradient-to-l from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  טיפים חכמים לחיסכון
                </span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                מהניסיון שלנו - כך תוכלו להמשיך לחסוך גם בעתיד
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[{
                icon: "💡",
                title: "בדקו חשבונות מידי חודש",
                description: "עקבו אחרי הצריכה שלכם - פעמים רבות תוכלו לזהות עליות מיותרות",
                color: "from-amber-400 to-orange-500"
              }, {
                icon: "📊",
                title: "השוו מחירים בקביעות",
                description: "השוק משתנה כל הזמן - מה שהיה זול השנה עלול להיות יקר השנה הבאה",
                color: "from-blue-400 to-blue-600"
              }, {
                icon: "⏰",
                title: "עקבו אחרי תוקף ההתקשרויות",
                description: "רוב הספקים נותנים הנחות לתקופה מוגבלת - חשוב לדעת מתי זה נגמר",
                color: "from-emerald-400 to-green-600"
              }, {
                icon: "🔄",
                title: "אל תפחדו להחליף",
                description: "בעבר זה היה מסובך, היום זה פשוט - וזה יכול לחסוך לכם אלפי שקלים",
                color: "from-purple-400 to-purple-600"
              }].map((tip, index) => (
                <div key={index} className="group bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/30 rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${tip.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {tip.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-lg mb-2">{tip.title}</h3>
                      <p className="text-muted-foreground leading-relaxed font-body text-sm">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">
                <span className="bg-gradient-to-l from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  שאלות נפוצות
                </span>
              </h2>
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
              }].map((faq, index) => (
                <div key={index} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-display font-semibold text-lg mb-3 text-primary">{faq.q}</h3>
                  <p className="text-muted-foreground leading-relaxed font-body">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced "About Us" Section with New Colors */}
      <section className="py-8 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-10 left-1/4 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full blur-2xl animate-bounce"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-fredoka font-bold mb-3">
                <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  המהפכה שאנחנו מובילים בישראל 🚀
                </span>
              </h2>
            </div>

            {/* Main content - side by side with larger boxes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left: Story + Mission - Expanded */}
              <div className="space-y-5">
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm rounded-3xl p-6 border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                  <h3 className="text-base font-fredoka font-bold text-emerald-300 mb-4 flex items-center gap-2">
                    💡 המשימה שלנו - לגמר עם העבדות הצרכנית
                  </h3>
                  <div className="space-y-3 text-white/95">
                    <p className="text-sm leading-relaxed font-comfortaa">
                      <strong className="text-emerald-200">מיליוני ישראלים משלמים יותר מדי</strong> כי השוק מניפולטיבי ולא שקוף. חברות ענק מסתירות עמלות, משנות תעריפים בלי הודעה, ויוצרות מבצעים מבלבלים כדי לבלבל אתכם.
                    </p>
                    <p className="text-sm leading-relaxed font-comfortaa">
                      <strong className="text-teal-200">אנחנו שוברים את הכללים!</strong> במקום להיכנע למערכת המושחתת הזו, בנינו טכנולוgiה מתקדמת שחושפת את כל הטריקים שלהם ונותנת לכם כוח אמיתי להילחם בחזרה.
                    </p>
                    <p className="text-sm leading-relaxed font-comfortaa">
                      זה לא רק עניין של כסף - זה <strong className="text-cyan-200">עניין של כבוד וצדק.</strong> כל משפחה בישראל זכאי לקבל שירות הוגן במחיר הוגן, ללא משחקי כוח ובלי לבזבז שעות על בירוקרטיה מיותרת.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 backdrop-blur-sm rounded-3xl p-6 border border-teal-400/20 hover:border-teal-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10">
                  <h3 className="text-base font-fredoka font-bold text-teal-300 mb-4 flex items-center gap-2">
                    ⚡ איך אנחנו שונים - מהפכה אמיתית
                  </h3>
                  <div className="space-y-3 text-white/95">
                    <p className="text-sm leading-relaxed font-comfortaa">
                      בעוד שאתרי השוואה אחרים רק <strong className="text-teal-200">"מציגים מחירים"</strong> ומשאירים אתכם לבד מול הבירוקרטיה - אנחנו עושים את כל העבודה השחורה עבורכם!
                    </p>
                    <p className="text-sm leading-relaxed font-comfortaa">
                      <strong className="text-cyan-200">הסוד שלנו:</strong> אלגוריתמי AI מתקדמים שלא רק משווים מחירים, אלא גם מזהים בדיוק איפה אתם מפסידים כסף, מנהלים משא ומתן אגרסיבי עם הספקים בשמכם, ומבצעים מעבר מלא תוך ימים ספורים.
                    </p>
                    <p className="text-sm leading-relaxed font-comfortaa">
                      <strong className="text-emerald-200">התוצאה?</strong> בממוצע אנחנו חוסכים למשפחות 2,800 ₪ בשנה, עם זמן השקעה של פחות מ-5 דקות. זה לא רק שירות - זה מהפכה!
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Stats + Proof */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-emerald-400/20 to-teal-400/20 backdrop-blur-sm rounded-2xl p-4 border border-emerald-400/30 text-center group hover:scale-105 transition-all duration-300">
                    <div className="text-2xl font-fredoka font-bold text-emerald-300 mb-2">50K+</div>
                    <div className="text-xs text-emerald-200 font-comfortaa">משפחות חסכו השנה</div>
                  </div>
                  <div className="bg-gradient-to-br from-teal-400/20 to-cyan-400/20 backdrop-blur-sm rounded-2xl p-4 border border-teal-400/30 text-center group hover:scale-105 transition-all duration-300">
                    <div className="text-2xl font-fredoka font-bold text-teal-300 mb-2">₪24M</div>
                    <div className="text-xs text-teal-200 font-comfortaa">נחסך השנה בסה"כ</div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-400/20 to-blue-400/20 backdrop-blur-sm rounded-2xl p-4 border border-cyan-400/30 text-center group hover:scale-105 transition-all duration-300">
                    <div className="text-2xl font-fredoka font-bold text-cyan-300 mb-2">98%</div>
                    <div className="text-xs text-cyan-200 font-comfortaa">שביעות רצון לקוחות</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-400/20 to-indigo-400/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-400/30 text-center group hover:scale-105 transition-all duration-300">
                    <div className="text-2xl font-fredoka font-bold text-blue-300 mb-2">3 דק'</div>
                    <div className="text-xs text-blue-200 font-comfortaa">זמן ממוצע לתהליך</div>
                  </div>
                </div>
                
                {/* Enhanced Testimonial */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/20 group hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-yellow-400 text-lg">⭐⭐⭐⭐⭐</span>
                    <span className="text-xs text-white/70 font-comfortaa bg-emerald-500/20 px-2 py-1 rounded-full border border-emerald-400/30">דירוג גוגל 4.9</span>
                  </div>
                  <p className="text-white/95 text-sm font-comfortaa leading-relaxed mb-4">
                    "התחלתי בספק ובתוך <strong className="text-emerald-300">שבועיים עשיתם לי מעבר מלא לחשמל וסלולר</strong> עם חיסכון של 1,200₪ השנה! הכי מדהים זה שקיבלתי שירות פי 10 יותר טוב והכל בלי שאני אצטרך לדבר עם אף אחד. פשוט מגניב!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-sm">א</div>
                    <div>
                      <p className="text-white font-comfortaa text-sm font-semibold">איתי לוי</p>
                      <p className="text-white/60 text-xs font-comfortaa">רמת גן • חסך 1,200₪</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom enhanced value prop */}
            <div className="text-center mt-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-2xl border border-emerald-400/30 backdrop-blur-sm">
                <span className="text-2xl">🎯</span>
                <p className="text-emerald-200 text-sm font-fredoka font-bold">
                  המטרה: לחסוך לכל משפחה בישראל אלפי שקלים בשנה • 100% חינם • 100% שקוף • 100% מהפכני
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;