import { Shield, Zap, TrendingUp, Users, CheckCircle, Star, Calculator, Clock, Award, Phone, Sparkles, ArrowRight, BarChart3, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
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
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 rounded-full border border-primary/20 mb-8 backdrop-blur-sm shadow-lg">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-display font-semibold bg-gradient-to-l from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  הפלטפורמה המתקדמת ביותר בישראל • 2025
                </span>
              </div>
              
              {/* Enhanced Main Title */}
              <h1 className="text-5xl lg:text-6xl font-display font-black mb-8 tracking-tight leading-tight">
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
              <div className="space-y-4 mb-12">
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
            </div>
            
            {/* Enhanced Services Preview */}
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {services.map((service, index) => <div key={index} className="group relative bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-sm border border-border/30 rounded-2xl p-6 hover:shadow-2xl hover:shadow-primary/15 transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden" style={{
              animationDelay: `${index * 150}ms`
            }}>
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <div className="relative z-10">
                    <div className="text-3xl mb-4 group-hover:scale-125 transition-transform duration-500">{service.icon}</div>
                    <h3 className="font-display font-bold text-lg mb-3">{service.name}</h3>
                    <div className={`inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r ${service.color} text-white text-sm font-bold rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <TrendingUp className="w-4 h-4" />
                      {service.savings}
                    </div>
                  </div>
                </div>)}
            </div>
            
            {/* Enhanced CTA Button */}
            <div className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Button 
                size="lg" 
                className="group relative text-lg px-10 py-6 rounded-2xl font-display font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:from-purple-600 hover:via-primary hover:to-blue-600 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:shadow-primary/30 hover:scale-110 transform-gpu"
                onClick={() => navigate('/analyze')}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />
                
                <span className="relative z-10 flex items-center gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <Calculator className="w-4 h-4" />
                  </div>
                  התחל השוואה חכמה
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-l from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  איך זה עובד?
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                התהליך פשוט, מהיר ובטוח שחוזר לך זמן טרחה. אנחנו דואגים לכל השלבים במקום 
                ומבטיחים החלפה חלקה - זה לוקח רק 3 דקות
              </p>
            </div>

            {/* Process Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 right-6 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-blue-600">מלא פרטים</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    מלא את הפרטים האישיים שלך 
                    ובחר ספק חדש - זה לוקח רק 3 דקות
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/10 to-red-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 right-6 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-orange-600">אנחנו מנתקים</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    אנחנו דואגים לניתוק מהספק הקיים ללא 
                    טרחה מצידך - זה חינם!
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/10 to-green-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 right-6 w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-emerald-600">התחברות חלקה</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    אנחנו מקיימים אותך לספק החדש 
                    ומוודאים שהכל עובד מושלם
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Enhanced Features Section */}
      <section className="py-16">
        
      </section>

      {/* Process Steps */}
      

      {/* Testimonials */}
      <section className="py-16">
        
      </section>

      {/* Final Enhanced CTA */}
      
    </div>;
};
export default Home;