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

              {/* Process Steps Banner - Modern Card Design */}
              <section className="mb-12">
                <div className="max-w-5xl mx-auto">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-3">
                      איך זה עובד? פשוט כמו 1-2-3
                    </h3>
                    <p className="text-lg text-muted-foreground">המעבר הכי קל שיש - אנחנו עושים הכל</p>
                  </div>

                  {/* Modern Steps Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Step 1 */}
                    <div className="group relative">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200/60 rounded-3xl p-8 text-center h-full transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-3 group-hover:border-blue-300 relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full blur-2xl"></div>
                        
                        <div className="relative z-10">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-all duration-500 group-hover:shadow-blue-300/50">
                            <span className="text-white font-bold text-2xl">1</span>
                          </div>
                          <h4 className="font-bold text-blue-800 text-xl mb-4">השוואה חכמה</h4>
                          <p className="text-blue-700 leading-relaxed">
                            בחרו קטגוריה ואנחנו נבדוק עבורכם את <strong>כל הספקים</strong> והמחירים במקום אחד
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="group relative">
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200/60 rounded-3xl p-8 text-center h-full transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-3 group-hover:border-purple-300 relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full blur-2xl"></div>
                        
                        <div className="relative z-10">
                          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-all duration-500 group-hover:shadow-purple-300/50">
                            <span className="text-white font-bold text-2xl">2</span>
                          </div>
                          <h4 className="font-bold text-purple-800 text-xl mb-4">חתימה דיגיטלית</h4>
                          <p className="text-purple-700 leading-relaxed">
                            מילוי פרטים מהיר + <strong>חתימה מאובטחת</strong> על ייפוי כוח - הכל דיגיטלי ומוצפן
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="group relative">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200/60 rounded-3xl p-8 text-center h-full transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-3 group-hover:border-green-300 relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full blur-2xl"></div>
                        
                        <div className="relative z-10">
                          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-all duration-500 group-hover:shadow-green-300/50">
                            <span className="text-white font-bold text-2xl">3</span>
                          </div>
                          <h4 className="font-bold text-green-800 text-xl mb-4">מעבר אוטומטי</h4>
                          <p className="text-green-700 leading-relaxed">
                            <strong>ניתוק מלא</strong> מהספק הישן + <strong>התחברות</strong> לספק החדש - אתם לא עושים כלום!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Service Options */}
                  <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 border border-amber-200/60 rounded-3xl p-8 shadow-lg">
                    <div className="text-center">
                      <h4 className="font-bold text-amber-800 mb-6 text-2xl flex items-center justify-center gap-3">
                        <span className="text-3xl">⚡</span>
                        שני סוגי שירות לבחירתכם
                        <span className="text-3xl">⚡</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white/90 rounded-2xl p-6 border-2 border-green-200/60 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                          <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-6 h-6 bg-green-500 rounded-full shadow-md flex items-center justify-center">
                              <span className="text-white text-sm font-bold">✓</span>
                            </div>
                            <span className="font-bold text-green-800 text-xl">שירות מלא (מומלץ)</span>
                          </div>
                          <p className="text-amber-800 leading-relaxed">
                            אנחנו מבצעים <strong>ניתוק מלא</strong> מהספק הנוכחי <strong>+ התחברות</strong> לספק החדש
                          </p>
                          <div className="mt-4 p-3 bg-green-50 rounded-xl">
                            <p className="text-green-700 text-sm font-medium">💚 אתם לא צריכים לעשות כלום!</p>
                          </div>
                        </div>
                        
                        <div className="bg-white/90 rounded-2xl p-6 border-2 border-blue-200/60 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                          <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-6 h-6 bg-blue-500 rounded-full shadow-md flex items-center justify-center">
                              <span className="text-white text-sm font-bold">+</span>
                            </div>
                            <span className="font-bold text-blue-800 text-xl">התחברות בלבד</span>
                          </div>
                          <p className="text-amber-800 leading-relaxed">
                            רק <strong>התחברות מהירה</strong> לספק החדש - תנתקו מהספק הישן בעצמכם
                          </p>
                          <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                            <p className="text-blue-700 text-sm font-medium">⏰ בזמן שנוח לכם</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

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

      {/* Compact About Us Section */}
      <section className="py-12 bg-gradient-to-br from-purple-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                מי אנחנו?
              </span>
            </h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto leading-relaxed">
              אנחנו מאמינים שכל אדם בישראל זכאי לקבל את השירותים הטובים ביותר במחיר הוגן. 
              בנינו פלטפורמה שחוסכת לכם את הכאב ראש של השוואת מחירים וטיפול בספקים.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white mb-1">50K+</div>
                <div className="text-xs text-purple-200">לקוחות מרוצים</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white mb-1">₪24M</div>
                <div className="text-xs text-purple-200">חיסכון כולל</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white mb-1">98%</div>
                <div className="text-xs text-purple-200">שביעות רצון</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white mb-1">7</div>
                <div className="text-xs text-purple-200">שנות ניסיון</div>
              </div>
            </div>

            {/* Simple value proposition */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex justify-center mb-3">
                <span className="text-xl">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-purple-100 text-sm italic mb-2">
                "חסכתי 800 ₪ בשנה על החשמל בלי להזיז אצבע. פשוט מדהים!"
              </p>
              <p className="text-purple-200 text-xs">- רחל כהן, תל אביב</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;