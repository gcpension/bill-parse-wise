import { Shield, Zap, TrendingUp, Users, CheckCircle, Star, Calculator, Clock, Award, Phone, Sparkles, ArrowRight, BarChart3, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const Home = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const services = [{
    name: "חשמל",
    icon: "⚡",
    savings: "עד 30%",
    color: "from-amber-400 to-orange-500"
  }, {
    name: "סלולר",
    icon: "📱",
    savings: "עד 40%",
    color: "from-blue-400 to-purple-500"
  }, {
    name: "אינטרנט",
    icon: "🌐",
    savings: "עד 25%",
    color: "from-green-400 to-teal-500"
  }, {
    name: "טלוויזיה",
    icon: "📺",
    savings: "עד 35%",
    color: "from-pink-400 to-rose-500"
  }];
  const features = [{
    icon: BarChart3,
    title: "השוואת מחירים מדויקת",
    description: "אלגוריתם מתקדם שמנתח את כל התעריפים בשוק בזמן אמת",
    gradient: "from-blue-500 to-cyan-500"
  }, {
    icon: Sparkles,
    title: "תהליך מהיר של 3 דקות",
    description: "מילוי פרטים חכם עם זיהוי אוטומטי וקבלת הצעות מיידית",
    gradient: "from-violet-500 to-purple-500"
  }, {
    icon: Shield,
    title: "בטיחות ואמינות מלאה",
    description: "הגנה מתקדמת על הפרטיות עם הצפנה ברמה בנקאית",
    gradient: "from-emerald-500 to-teal-500"
  }, {
    icon: Layers,
    title: "ליווי מקצועי 24/7",
    description: "צוות מומחים וטכנולוגיה מתקדמת לליווי מלא",
    gradient: "from-orange-500 to-red-500"
  }];
  const stats = [{
    value: "150,000+",
    label: "לקוחות פעילים",
    icon: Users
  }, {
    value: "₪24.5M",
    label: "נחסך השנה",
    icon: TrendingUp
  }, {
    value: "4.9/5",
    label: "דירוג ממוצע",
    icon: Star
  }, {
    value: "99.2%",
    label: "שביעות רצון",
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
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 font-body overflow-hidden">
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

      {/* Process Steps Banner - Enhanced and positioned after hero */}
      <section className="mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-background/98 via-background/95 to-background/98 backdrop-blur-md border border-border/30 rounded-3xl px-8 py-10 shadow-2xl shadow-primary/5">
            {/* Header */}
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-4">
                איך זה עובד? 3 שלבים פשוטים
              </h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">מעבר ספק מעולם לא היה כל כך פשוט - אנחנו מטפלים בהכל עבורכם!</p>
            </div>
            
            {/* Steps Grid - Enhanced with animations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {/* Step 1 */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 border border-blue-200/60 rounded-3xl p-8 text-center h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:border-blue-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-2xl">1</span>
                  </div>
                  <h4 className="font-bold text-blue-800 text-xl mb-4">השוואת מחירים חכמה</h4>
                  <p className="text-blue-700 leading-relaxed">בחרו קטגוריה ובדקו מיד את כל הספקים, המחירים והחבילות במקום אחד - עם המלצות מותאמות אישית</p>
                </div>
                {/* Arrow for desktop */}
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-primary/30 z-10">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 border border-purple-200/60 rounded-3xl p-8 text-center h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:border-purple-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-2xl">2</span>
                  </div>
                  <h4 className="font-bold text-purple-800 text-xl mb-4">מילוי פרטים מהיר</h4>
                  <p className="text-purple-700 leading-relaxed">מלאו פרטים בסיסיים בטופס חכם וקבלו ייפוי כוח מוכן לחתימה דיגיטלית - הכול מאובטח ומוצפן</p>
                </div>
                {/* Arrow for desktop */}
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-primary/30 z-10">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group">
                <div className="bg-gradient-to-br from-green-50 via-green-50 to-green-100 border border-green-200/60 rounded-3xl p-8 text-center h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:border-green-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-2xl">3</span>
                  </div>
                  <h4 className="font-bold text-green-800 text-xl mb-4">המעבר מתבצע אוטומטית</h4>
                  <p className="text-green-700 leading-relaxed">
                    <strong>ניתוק אוטומטי</strong> מהספק הנוכחי + <strong>חיבור מלא</strong> לספק החדש - אתם לא צריכים לעשות כלום!
                  </p>
                </div>
              </div>
            </div>

            {/* Service Options - Enhanced */}
            <div className="bg-gradient-to-r from-amber-50/90 to-orange-50/90 border border-amber-200/60 rounded-2xl p-8 mb-6">
              <div className="text-center">
                <h4 className="font-bold text-amber-800 mb-6 text-2xl">שני סוגי שירות לבחירתכם:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/80 rounded-2xl p-6 border border-amber-200/40 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="w-4 h-4 bg-green-500 rounded-full shadow-md"></div>
                      <span className="font-bold text-green-800 text-lg">שירות מלא (מומלץ)</span>
                    </div>
                    <p className="text-amber-800 leading-relaxed">אנחנו מבצעים <strong>ניתוק מלא</strong> מהספק הנוכחי <strong>+ התחברות</strong> לספק החדש - אתם לא צריכים לעשות כלום!</p>
                  </div>
                  <div className="bg-white/80 rounded-2xl p-6 border border-amber-200/40 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="w-4 h-4 bg-blue-500 rounded-full shadow-md"></div>
                      <span className="font-bold text-blue-800 text-lg">התחברות בלבד</span>
                    </div>
                    <p className="text-amber-800 leading-relaxed">רק <strong>התחברות מהירה</strong> לספק החדש - תנתקו מהספק הישן בעצמכם בזמן שנוח לכם</p>
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
          </div>
        </div>
      </section>
            </div>
            
            {/* Enhanced Services Preview */}
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {services.map((service, index) => <div key={index} className="group relative bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-sm border border-border/30 rounded-2xl p-5 hover:shadow-2xl hover:shadow-primary/15 transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden" style={{
              animationDelay: `${index * 150}ms`
            }}>
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <div className="relative z-10">
                    <div className="text-2xl mb-3 group-hover:scale-125 transition-transform duration-500">{service.icon}</div>
                    <h3 className="font-display font-bold text-base mb-2">{service.name}</h3>
                    <div className={`inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r ${service.color} text-white text-sm font-bold rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <TrendingUp className="w-3 h-3" />
                      {service.savings}
                    </div>
                  </div>
                </div>)}
            </div>
            
            {/* Enhanced CTA Button */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Button size="lg" className="group relative text-lg px-8 py-4 rounded-2xl font-display font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:from-purple-600 hover:via-primary hover:to-blue-600 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:shadow-primary/30 hover:scale-110 transform-gpu" onClick={() => navigate('/analyze')}>
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />
                
                <span className="relative z-10 flex items-center gap-3">
                  <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <Calculator className="w-3 h-3" />
                  </div>
                  התחל השוואה חכמה
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tips & Guides Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4">
                <span className="bg-gradient-to-l from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  טיפים לחיסכון חכם
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
                רוצים לחסוך עוד יותר? הנה כמה טיפים מהמומחים שלנו
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
            }].map((tip, index) => <div key={index} className="group bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/30 rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${tip.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {tip.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-lg mb-2">{tip.title}</h3>
                      <p className="text-muted-foreground leading-relaxed font-body text-sm">{tip.description}</p>
                    </div>
                  </div>
                </div>)}
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
            }].map((faq, index) => <div key={index} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <h3 className="font-display font-semibold text-lg mb-3 text-primary">{faq.q}</h3>
                  <p className="text-muted-foreground leading-relaxed font-body">{faq.a}</p>
                </div>)}
            </div>
          </div>
        </div>
      </section>
      


      {/* About Us Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl animate-bounce-gentle"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-display font-black mb-6">
                <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                  מי אנחנו?
                </span>
              </h2>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed font-body">
                אנחנו צוות של מומחים בתחום הטלקום והאנרגיה שהחליט לעזור לכם לחסוך כסף
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold mb-3">המשימה שלנו</h3>
                      <p className="text-purple-100 leading-relaxed">
                        אנחנו מאמינים שכל אדם בישראל זכאי לקבל את השירותים הטובים ביותר במחיר הוגן. 
                        בנינו פלטפורמה שחוסכת לכם את הכאב ראש של השוואת מחירים וטיפול בספקים.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">💡</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold mb-3">איך זה עובד?</h3>
                      <p className="text-purple-100 leading-relaxed">
                        אנחנו עובדים עם כל הספקים הגדולים בשוק, מנתחים את המבצעים העדכניים, 
                        ומוצאים לכם את הדיל הכי טוב. הכנסה שלנו מגיעה מהספקים - לכם זה חינם לגמרי.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🛡️</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold mb-3">הבטחת השקיפות</h3>
                      <p className="text-purple-100 leading-relaxed">
                        אנחנו פועלים בשקיפות מלאה - תמיד נסביר לכם מה השתנה, למה, וכמה זה עולה. 
                        אין עמלות נסתרות, אין הפתעות, רק חיסכון אמיתי.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Stats */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-black text-white mb-2">50,000+</div>
                    <div className="text-purple-200 font-medium">לקוחות מרוצים</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-black text-white mb-2">₪24M</div>
                    <div className="text-purple-200 font-medium">סך החיסכון השנתי</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-black text-white mb-2">98%</div>
                    <div className="text-purple-200 font-medium">שביעות רצון</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-black text-white mb-2">7</div>
                    <div className="text-purple-200 font-medium">שנות ניסיון</div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                  <h4 className="text-xl font-display font-bold mb-4 text-center">מה הלקוחות אומרים?</h4>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <span className="text-2xl">⭐⭐⭐⭐⭐</span>
                      </div>
                      <p className="text-purple-100 text-sm italic">
                        "חסכתי 800 שקל בשנה על החשמל בלי להזיז אצבע. פשוט מדהים!"
                      </p>
                      <p className="text-purple-200 text-xs mt-2">- רחל כהן, תל אביב</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>;
};
export default Home;