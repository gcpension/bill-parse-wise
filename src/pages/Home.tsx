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
    gradient: "bg-gradient-sunset"
  }, {
    name: "סלולר",
    icon: "📱",
    savings: "עד 40%",
    gradient: "bg-gradient-electric"
  }, {
    name: "אינטרנט",
    icon: "🌐",
    savings: "עד 25%",
    gradient: "bg-gradient-vibrant"
  }, {
    name: "טלוויזיה",
    icon: "📺",
    savings: "עד 35%",
    gradient: "bg-gradient-primary"
  }];
  const features = [{
    icon: BarChart3,
    title: "השוואת מחירים מדויקת",
    description: "אלגוריתם מתקדם שמנתח את כל התעריפים בשוק בזמן אמת",
    gradient: "bg-gradient-electric"
  }, {
    icon: Sparkles,
    title: "תהליך מהיר של 3 דקות",
    description: "מילוי פרטים חכם עם זיהוי אוטומטי וקבלת הצעות מיידית",
    gradient: "bg-gradient-primary"
  }, {
    icon: Shield,
    title: "בטיחות ואמינות מלאה",
    description: "הגנה מתקדמת על הפרטיות עם הצפנה ברמה בנקאית",
    gradient: "bg-gradient-vibrant"
  }, {
    icon: Layers,
    title: "ליווי מקצועי 24/7",
    description: "צוות מומחים וטכנולוגיה מתקדמת לליווי מלא",
    gradient: "bg-gradient-sunset"
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-electric-blue/15 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-vibrant-green/15 rounded-full blur-3xl animate-float" style={{
        animationDelay: '2s'
      }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-royal-purple/10 rounded-full blur-2xl animate-pulse" style={{
        animationDelay: '1s'
      }} />
      </div>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className={`transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/15 to-electric-blue/15 rounded-full border border-primary/30 shadow-glow mb-8">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary">פלטפורמת ההשוואה המתקדמת של 2025</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-black mb-8 tracking-tight leading-tight">
                השוואה והחלפה
                <br />
                <span className="bg-gradient-to-l from-primary via-electric-blue to-royal-purple bg-clip-text text-transparent animate-shimmer-text bg-300%">
                  חכמה של ספקים
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto font-light leading-relaxed">
                פלטפורמה מקצועית מבוססת AI להשוואת תעריפים והחלפת ספקי שירות
                <br className="hidden sm:block" />
                <span className="font-bold text-primary drop-shadow-sm">חסכו עד 45% בחשבונות החודשיים</span> עם טכנולוגיה מתקדמת
              </p>
            </div>
            
            {/* Enhanced Services Preview */}
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-1000 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {services.map((service, index) => <div key={index} className="group relative glass border border-white/20 rounded-2xl p-6 shadow-card hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 cursor-pointer hover-scale" style={{
              animationDelay: `${index * 150}ms`
            }}>
                  <div className={`absolute inset-0 ${service.gradient} opacity-0 group-hover:opacity-15 rounded-2xl transition-opacity duration-500`} />
                  <div className="relative z-10 text-center">
                    <div className="text-3xl mb-4 group-hover:scale-125 transition-transform duration-500 animate-bounce-gentle">{service.icon}</div>
                    <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors">{service.name}</h3>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${service.gradient} text-white text-sm font-bold rounded-full shadow-lg group-hover:shadow-colorful`}>
                      <TrendingUp className="w-4 h-4" />
                      {service.savings}
                    </div>
                  </div>
                </div>)}
            </div>
            
            {/* Enhanced CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Button size="lg" className="group relative text-lg px-10 py-5 rounded-2xl font-black btn-gradient hover-scale shadow-elegant hover:shadow-glow" onClick={() => navigate('/analyze')}>
                <span className="relative z-10 flex items-center gap-3">
                  <Calculator className="w-6 h-6" />
                  התחל השוואה חכמה
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      

      {/* Process Banner - Compact & Beautiful */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Compact Floating Process Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-3xl blur-xl" />
              <div className="relative glass border border-white/40 dark:border-border/40 rounded-3xl shadow-elegant shadow-primary/10 p-8">
                {/* Compact Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-electric-blue/20 rounded-full border border-primary/30 shadow-glow mb-4">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-sm font-bold text-primary">התהליך החכם</span>
                  </div>
                  <h2 className="text-2xl font-black bg-gradient-to-r from-primary via-electric-blue to-royal-purple bg-clip-text text-transparent mb-3">
                    3 שלבים לחיסכון מקסימלי
                  </h2>
                  <p className="text-muted-foreground text-base font-medium">
                    פשוט, מהיר ובטוח
                  </p>
                </div>

                {/* Compact Process Steps */}
                <div className="flex justify-center items-center gap-6">
                  {[{
                  step: 1,
                  title: "בחר",
                  gradient: "bg-gradient-electric"
                }, {
                  step: 2,
                  title: "השווה",
                  gradient: "bg-gradient-primary"
                }, {
                  step: 3,
                  title: "חסוך",
                  gradient: "bg-gradient-vibrant"
                }].map((item, index) => <div key={index} className="flex items-center gap-4">
                      {/* Compact Step Circle */}
                      <div className="relative flex-shrink-0 hover-scale">
                        <div className={`w-16 h-16 ${item.gradient} rounded-full flex items-center justify-center shadow-elegant animate-pulse-glow`}>
                          <span className="text-xl font-black text-white">{item.step}</span>
                        </div>
                        <div className={`absolute -inset-1 ${item.gradient} rounded-full opacity-30 blur-md -z-10`} />
                      </div>
                      
                      {/* Title */}
                      <div className="hidden sm:block">
                        <h3 className="text-base font-bold text-foreground">
                          {item.title}
                        </h3>
                      </div>

                      {/* Arrow for non-last items */}
                      {index < 2 && <ArrowRight className="w-5 h-5 text-primary opacity-70 flex-shrink-0 animate-bounce-gentle" />}
                    </div>)}
                </div>

                {/* Compact Bottom Section */}
                <div className="text-center mt-8 pt-6 border-t border-border/30">
                  <div className="flex justify-center gap-3 flex-wrap">
                    {["פלאפון", "סלקום", "HOT", "בזק"].map((provider, index) => <div key={index} className="px-4 py-2 glass border border-primary/20 rounded-full text-sm font-bold text-primary shadow-glow hover-scale">
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary/15 to-electric-blue/15 rounded-full border border-primary/30 shadow-glow mb-6">
              <Zap className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-base font-bold text-primary">איך זה עובד?</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-foreground via-primary to-electric-blue bg-clip-text text-transparent">
              טכנולוגיה מתקדמת
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-light leading-relaxed">
              פלטפורמה חכמה שמשלבת AI, למידת מכונה וניתוח נתונים מתקדם
              <br />
              לחוויית השוואה ללא תקדים
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return <Card key={index} className="group relative border-0 glass shadow-card hover:shadow-elegant transition-all duration-500 p-8 backdrop-blur-xl hover:-translate-y-3 hover-scale">
                  <div className={`absolute inset-0 ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                  <CardContent className="relative z-10 p-0 text-center">
                    <div className={`w-16 h-16 ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-125 transition-transform duration-500 shadow-elegant mx-auto`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-black mb-4 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed font-medium">
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