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
  return <div className="min-h-screen bg-background font-sans overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '1s'
      }} />
      </div>

      {/* Hero Section */}
      <section className="relative py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">פלטפורמת ההשוואה המתקדמת של 2025</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
                השוואה והחלפה
                <br />
                <span className="bg-gradient-to-l from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                  חכמה של ספקים
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto font-light leading-relaxed">
                פלטפורמה מקצועית מבוססת AI להשוואת תעריפים והחלפת ספקי שירות
                <br className="hidden sm:block" />
                <span className="font-semibold text-primary">חסכו עד 45% בחשבונות החודשיים</span> עם טכנולוגיה מתקדמת
              </p>
            </div>
            
            {/* Enhanced Services Preview */}
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {services.map((service, index) => <div key={index} className="group relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer" style={{
              animationDelay: `${index * 100}ms`
            }}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                    <h3 className="font-bold text-base mb-2">{service.name}</h3>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r ${service.color} text-white text-xs font-bold rounded-full`}>
                      <TrendingUp className="w-3 h-3" />
                      {service.savings}
                    </div>
                  </div>
                </div>)}
            </div>
            
            {/* Enhanced CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Button size="lg" className="group relative text-base px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25 hover:scale-105" onClick={() => navigate('/analyze')}>
                <span className="relative z-10 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  התחל השוואה חכמה
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              
              
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      

      {/* Process Banner - Compact & Beautiful */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Compact Floating Process Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-blue-500/4 to-purple-500/8 rounded-2xl blur-lg" />
              <div className="relative bg-white/90 dark:bg-card/90 backdrop-blur-xl border border-white/30 dark:border-border/30 rounded-2xl shadow-xl shadow-primary/5 p-6">
                {/* Compact Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-full border border-primary/20 mb-3">
                    <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                    <span className="text-xs font-semibold text-primary">התהליך החכם</span>
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    3 שלבים לחיסכון מקסימלי
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    פשוט, מהיר ובטוח
                  </p>
                </div>

                {/* Compact Process Steps */}
                <div className="flex justify-center items-center gap-4">
                  {[{
                  step: 1,
                  title: "בחר",
                  color: "from-blue-500 to-blue-600"
                }, {
                  step: 2,
                  title: "השווה",
                  color: "from-purple-500 to-purple-600"
                }, {
                  step: 3,
                  title: "חסוך",
                  color: "from-emerald-500 to-emerald-600"
                }].map((item, index) => <div key={index} className="flex items-center gap-3">
                      {/* Compact Step Circle */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300`}>
                          <span className="text-lg font-bold text-white">{item.step}</span>
                        </div>
                        <div className={`absolute -inset-0.5 bg-gradient-to-br ${item.color} rounded-full opacity-20 blur-sm`} />
                      </div>
                      
                      {/* Title */}
                      <div className="hidden sm:block">
                        <h3 className="text-sm font-bold text-foreground">
                          {item.title}
                        </h3>
                      </div>

                      {/* Arrow for non-last items */}
                      {index < 2 && <ArrowRight className="w-4 h-4 text-muted-foreground opacity-60 flex-shrink-0" />}
                    </div>)}
                </div>

                {/* Compact Bottom Section */}
                <div className="text-center mt-6 pt-4 border-t border-border/50">
                  <div className="flex justify-center gap-2 flex-wrap">
                    {["פלאפון", "סלקום", "HOT", "בזק"].map((provider, index) => <div key={index} className="px-2 py-1 bg-gradient-to-r from-primary/5 to-blue-500/5 border border-primary/10 rounded-full text-xs font-medium text-primary">
                        {provider}
                      </div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Enhanced Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">איך זה עובד?</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              טכנולוגיה מתקדמת
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              פלטפורמה חכמה שמשלבת AI, למידת מכונה וניתוח נתונים מתקדם
              <br />
              לחוויית השוואה ללא תקדים
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return <Card key={index} className="group relative border-0 shadow-md hover:shadow-lg transition-all duration-300 p-6 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:-translate-y-1">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-300`} />
                  <CardContent className="relative z-10 p-0">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      

      {/* Testimonials */}
      <section className="py-16">
        
      </section>

      {/* Final Enhanced CTA */}
      
    </div>;
};
export default Home;