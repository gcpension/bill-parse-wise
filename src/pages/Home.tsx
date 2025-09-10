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

              {/* Compact Colorful System Explanation Banner */}
              <div className="mb-8">
                <div className="relative max-w-4xl mx-auto">
                  {/* Compact floating card */}
                  <div className="bg-gradient-to-br from-white/95 via-pink-50/90 to-purple-50/85 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gradient-to-r from-pink-200 via-purple-200 to-blue-200 dark:border-purple-500/30 p-6 hover:shadow-3xl transition-all duration-500 animate-fade-in relative overflow-hidden">
                    {/* Colorful background decorations */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-pink-400/20 via-purple-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-400/20 via-teal-400/20 to-cyan-400/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
                    
                    {/* Colorful top badge */}
                    <div className="flex justify-center mb-4 relative z-10">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-full border-2 border-purple-300/50 backdrop-blur-sm animate-pulse-glow">
                        <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-ping"></div>
                        <span className="text-purple-700 dark:text-purple-300 font-fredoka font-bold text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                          המערכת החכמה שתשנה לכם את החיים ✨
                        </span>
                      </div>
                    </div>
                    
                    {/* Compact content */}
                    <div className="text-center relative z-10">
                      <h3 className="text-xl font-fredoka font-bold mb-3 bg-gradient-to-r from-pink-600 via-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent bg-300% animate-gradient-x">
                        מה המערכת שלנו עושה? הכל פשוט!
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-5 max-w-2xl mx-auto font-comfortaa">
                        במקום לבזבז זמן על השוואות מתישות - האלגוריתם החכם שלנו עושה הכל ומעביר אתכם אוטומטית
                      </p>
                      
                      {/* Compact colorful 3-step process */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* Step 1 */}
                        <div className="group hover:scale-105 transition-all duration-300">
                          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 rounded-2xl flex items-center justify-center text-white font-fredoka font-bold text-lg mx-auto mb-2 shadow-lg group-hover:shadow-xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative">1</span>
                          </div>
                          <h4 className="font-fredoka font-bold text-sm mb-1 text-pink-700 dark:text-pink-300">הזינו נתונים</h4>
                          <p className="text-muted-foreground text-xs font-comfortaa leading-relaxed">
                            בחרו קטגוריות והזינו סכומים - <strong className="text-pink-600">המערכת תזהה הזדמנויות לחיסכון</strong>
                          </p>
                        </div>
                        
                        {/* Colorful arrow */}
                        <div className="hidden md:flex justify-center items-center">
                          <div className="w-8 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full animate-pulse"></div>
                        </div>
                        
                        {/* Step 2 */}
                        <div className="group hover:scale-105 transition-all duration-300">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-fredoka font-bold text-lg mx-auto mb-2 shadow-lg group-hover:shadow-xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative">2</span>
                          </div>
                          <h4 className="font-fredoka font-bold text-sm mb-1 text-blue-700 dark:text-blue-300">AI סורק ומנתח</h4>
                          <p className="text-muted-foreground text-xs font-comfortaa leading-relaxed">
                            <strong className="text-blue-600">אלפי תעריפים נסרקים</strong> ומושווים בזמן אמת כולל עמלות נסתרות
                          </p>
                        </div>
                        
                        {/* Colorful arrow */}
                        <div className="hidden md:flex justify-center items-center">
                          <div className="w-8 h-1 bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                        </div>
                        
                        {/* Step 3 */}
                        <div className="group hover:scale-105 transition-all duration-300">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white font-fredoka font-bold text-lg mx-auto mb-2 shadow-lg group-hover:shadow-xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative">3</span>
                          </div>
                          <h4 className="font-fredoka font-bold text-sm mb-1 text-green-700 dark:text-green-300">מעבר אוטומטי</h4>
                          <p className="text-muted-foreground text-xs font-comfortaa leading-relaxed">
                            <strong className="text-green-600">חתימה דיגיטלית אחת</strong> ואנחנו מטפלים בכל הביטולים והחיבורים
                          </p>
                        </div>
                      </div>
                      
                      {/* Colorful bottom stats */}
                      <div className="mt-4 p-3 bg-gradient-to-r from-green-100/80 via-teal-100/80 to-blue-100/80 dark:from-green-900/20 dark:via-teal-900/20 dark:to-blue-900/20 rounded-xl border border-green-200/50 dark:border-green-700/30">
                        <div className="flex justify-center gap-6 text-xs font-comfortaa font-bold">
                          <div className="text-green-600 dark:text-green-400">
                            <span className="text-lg">35%</span><br/>חיסכון ממוצע
                          </div>
                          <div className="text-teal-600 dark:text-teal-400">
                            <span className="text-lg">0₪</span><br/>עמלות
                          </div>
                          <div className="text-blue-600 dark:text-blue-400">
                            <span className="text-lg">7 ימים</span><br/>מעבר מהיר
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Colorful floating decorations */}
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full opacity-80 animate-bounce"></div>
                  <div className="absolute -bottom-3 -left-3 w-5 h-5 bg-gradient-to-br from-green-400 to-teal-400 rounded-full opacity-80 animate-bounce" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute top-1/3 -right-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-70 animate-bounce" style={{animationDelay: '1s'}}></div>
                  <div className="absolute bottom-1/3 -left-2 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-70 animate-bounce" style={{animationDelay: '1.5s'}}></div>
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

      {/* Reimagined Compact "About Us" Section */}
      <section className="py-6 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-2xl animate-bounce"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-fredoka font-bold mb-2">
                <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  המהפכה שאנחנו מובילים בישראל 🚀
                </span>
              </h2>
            </div>

            {/* Main content - side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Left: Story + Mission */}
              <div className="space-y-3">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <h3 className="text-sm font-fredoka font-bold text-cyan-300 mb-2">💡 המשימה שלנו</h3>
                  <p className="text-white/90 text-xs leading-relaxed font-comfortaa">
                    <strong>לגמר עם העבדות הצרכנית!</strong> מיליוני ישראלים משלמים יותר מדי כי השוק לא שקוף ומניפולטיבי. 
                    אנחנו שוברים את הכללים ונותנים לכם כוח אמיתי להילחם בספקים הגדולים.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <h3 className="text-sm font-fredoka font-bold text-purple-300 mb-2">⚡ איך אנחנו שונים</h3>
                  <p className="text-white/90 text-xs leading-relaxed font-comfortaa">
                    בעוד שאחרים רק משווים מחירים, <strong>אנחנו עושים את כל העבודה השחורה עבורכם:</strong> מזהים בדיוק איפה אתם מפסידים כסף, 
                    מנהלים משא ומתן עם הספקים, ומבצעים מעבר מלא ללא שיחות שימור מעצבנות.
                  </p>
                </div>
              </div>

              {/* Right: Stats + Proof */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-3 border border-cyan-400/30 text-center">
                    <div className="text-lg font-fredoka font-bold text-cyan-300 mb-1">50K+</div>
                    <div className="text-xs text-cyan-200">משפחות חסכו</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-3 border border-green-400/30 text-center">
                    <div className="text-lg font-fredoka font-bold text-green-300 mb-1">₪24M</div>
                    <div className="text-xs text-green-200">נחסך השנה</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-3 border border-purple-400/30 text-center">
                    <div className="text-lg font-fredoka font-bold text-purple-300 mb-1">98%</div>
                    <div className="text-xs text-purple-200">שביעות רצון</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-3 border border-orange-400/30 text-center">
                    <div className="text-lg font-fredoka font-bold text-orange-300 mb-1">3 דק'</div>
                    <div className="text-xs text-orange-200">זמן ממוצע</div>
                  </div>
                </div>
                
                {/* Testimonial */}
                <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                    <span className="text-xs text-white/70 font-comfortaa">דירוג גוגל 4.9</span>
                  </div>
                  <p className="text-white/95 text-xs font-comfortaa italic leading-relaxed">
                    "עשיתם לי <strong>מעבר מלא לחשמל וסלולר</strong> תוך 5 ימים. חסכתי 1,200₪ השנה וקיבלתי שירות פי 10 יותר טוב!"
                  </p>
                  <p className="text-white/60 text-xs mt-1 font-comfortaa">- איתי לוי, רמת גן</p>
                </div>
              </div>
            </div>
            
            {/* Bottom value prop */}
            <div className="text-center mt-4">
              <p className="text-cyan-200 text-xs font-fredoka font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                🎯 המטרה: לחסוך לכל משפחה בישראל אלפי שקלים בשנה • 100% חינם • 100% שקוף
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;