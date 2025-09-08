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
  
  const services = [
    { name: "חשמל", icon: "⚡", savings: "עד 30%", color: "from-amber-400 to-orange-500" },
    { name: "סלולר", icon: "📱", savings: "עד 40%", color: "from-blue-400 to-purple-500" },
    { name: "אינטרנט", icon: "🌐", savings: "עד 25%", color: "from-green-400 to-teal-500" },
    { name: "טלוויזיה", icon: "📺", savings: "עד 35%", color: "from-pink-400 to-rose-500" }
  ];

  const features = [
    {
      icon: BarChart3,
      title: "השוואת מחירים מדויקת",
      description: "אלגוריתם מתקדם שמנתח את כל התעריפים בשוק בזמן אמת",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Sparkles,
      title: "תהליך מהיר של 3 דקות",
      description: "מילוי פרטים חכם עם זיהוי אוטומטי וקבלת הצעות מיידית",
      gradient: "from-violet-500 to-purple-500"
    },
    {
      icon: Shield,
      title: "בטיחות ואמינות מלאה",
      description: "הגנה מתקדמת על הפרטיות עם הצפנה ברמה בנקאית",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: Layers,
      title: "ליווי מקצועי 24/7",
      description: "צוות מומחים וטכנולוגיה מתקדמת לליווי מלא",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { value: "150,000+", label: "לקוחות פעילים", icon: Users },
    { value: "₪24.5M", label: "נחסך השנה", icon: TrendingUp },
    { value: "4.9/5", label: "דירוג ממוצע", icon: Star },
    { value: "99.2%", label: "שביעות רצון", icon: CheckCircle }
  ];

  const testimonials = [
    {
      name: "שרה כהן",
      role: "לקוחה מרוצה",
      content: "חסכתי 1,200 ₪ בשנה בקלות! השירות מקצועי והתהליך פשוט.",
      rating: 5,
      savings: "₪1,200"
    },
    {
      name: "דני לוי",
      role: "בעל עסק",
      content: "הפלטפורמה הכי מתקדמת שיש. חיסכון משמעותי בזמן וכסף.",
      rating: 5,
      savings: "₪3,400"
    },
    {
      name: "מיכל אברהם",
      role: "אמא לשלושה",
      content: "סוף סוף מצאתי פתרון שמתאים לכל המשפחה. מומלץ בחום!",
      rating: 5,
      savings: "₪2,100"
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className="group relative bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                    <h3 className="font-bold text-base mb-2">{service.name}</h3>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r ${service.color} text-white text-xs font-bold rounded-full`}>
                      <TrendingUp className="w-3 h-3" />
                      {service.savings}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Enhanced CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Button 
                size="lg" 
                className="group relative text-base px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25 hover:scale-105"
                onClick={() => navigate('/analyze')}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  התחל השוואה חכמה
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="group text-base px-8 py-4 rounded-xl font-bold border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-105"
              >
                <Phone className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                דבר עם יועץ מומחה
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-12 border-y bg-gradient-to-r from-muted/30 via-muted/10 to-muted/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="group">
                  <div className="flex items-center justify-center mb-3">
                    <IconComponent className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-primary mb-2 font-mono group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Banner - Floating Style */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Floating Process Card */}
            <div className="relative mx-auto max-w-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/5 to-purple-500/10 rounded-3xl blur-xl" />
              <div className="relative bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-primary/10 p-8 md:p-12">
                {/* Header */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-full border border-primary/20 mb-4">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-sm font-semibold text-primary">התהליך החכם שלנו</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                    3 שלבים לחיסכון מקסימלי
                  </h2>
                  <p className="text-muted-foreground text-base">
                    פשוט, מהיר ובטוח - עובדים על כל הספקים הגדולים
                  </p>
                </div>

                {/* Process Steps */}
                <div className="space-y-6">
                  {[
                    {
                      step: 1,
                      title: "בחר מסלול",
                      subtitle: "בחירה מהירה ממגוון רחב",
                      color: "from-blue-500 to-blue-600",
                      bgColor: "from-blue-50 to-blue-100/50",
                      textColor: "text-blue-600",
                      borderColor: "border-blue-200"
                    },
                    {
                      step: 2,
                      title: "השווה מחירים",
                      subtitle: "מחירים טוב מכל הספקים",
                      color: "from-purple-500 to-purple-600", 
                      bgColor: "from-purple-50 to-purple-100/50",
                      textColor: "text-purple-600",
                      borderColor: "border-purple-200"
                    },
                    {
                      step: 3,
                      title: "עבור וחסוך",
                      subtitle: "אנחנו נדאג לכל השאר",
                      color: "from-emerald-500 to-emerald-600",
                      bgColor: "from-emerald-50 to-emerald-100/50", 
                      textColor: "text-emerald-600",
                      borderColor: "border-emerald-200"
                    }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className={`flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-r ${item.bgColor} border ${item.borderColor} hover:shadow-lg transition-all duration-300`}
                    >
                      {/* Step Circle */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center shadow-lg`}>
                          <span className="text-2xl font-bold text-white">{item.step}</span>
                        </div>
                        <div className={`absolute -inset-1 bg-gradient-to-br ${item.color} rounded-full opacity-20 blur-sm`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold ${item.textColor} mb-1`}>
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {item.subtitle}
                        </p>
                      </div>

                      {/* Arrow for non-last items */}
                      {index < 2 && (
                        <div className="hidden md:block">
                          <ArrowRight className={`w-5 h-5 ${item.textColor} opacity-60`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom Section */}
                <div className="text-center mt-10 pt-8 border-t border-border/50">
                  <p className="text-sm text-muted-foreground mb-4">
                    עובדים על כל הספקים הגדולים:
                  </p>
                  <div className="flex justify-center gap-4 flex-wrap">
                    {["פלאפון", "סלקום", "HOT", "בזק"].map((provider, index) => (
                      <div key={index} className="px-3 py-1 bg-gradient-to-r from-primary/5 to-blue-500/5 border border-primary/10 rounded-full text-xs font-medium text-primary">
                        {provider}
                      </div>
                    ))}
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
              return (
                <Card key={index} className="group relative border-0 shadow-md hover:shadow-lg transition-all duration-300 p-6 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:-translate-y-1">
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
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-gradient-to-br from-muted/20 via-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                3 שלבים לחיסכון מקסימלי
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: 1, title: "מלא פרטים חכם", desc: "מילוי אוטומטי עם טכנולוגיית OCR וזיהוי חכם", icon: Calculator },
                { step: 2, title: "קבל הצעות מותאמות", desc: "אלגוריתם AI מנתח ומציג את ההצעות הטובות ביותר", icon: BarChart3 },
                { step: 3, title: "החלף וחסוך", desc: "ליווי מלא עם חתימה דיגיטלית ומעקב בזמן אמת", icon: CheckCircle }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto shadow-lg group-hover:shadow-xl group-hover:shadow-primary/25 transition-all duration-300 group-hover:scale-110">
                        {item.step}
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    </div>
                    <IconComponent className="w-6 h-6 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              לקוחות מרוצים
            </h2>
            <p className="text-lg text-muted-foreground">
              מה אומרים עלינו לקוחות שכבר חוסכים
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group p-6 border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">{testimonial.savings}</div>
                      <div className="text-xs text-muted-foreground">נחסך בשנה</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final Enhanced CTA */}
      <section className="relative py-16 bg-gradient-to-br from-primary via-blue-600 to-purple-600 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <Sparkles className="w-12 h-12 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              מוכן לחסוך בגדול?
            </h2>
            <p className="text-lg mb-8 opacity-90 font-light leading-relaxed">
              הצטרף ל-150,000+ לקוחות שכבר חוסכים עם הפלטפורמה החכמה ביותר
              <br />
              <span className="font-bold">התחל עכשיו וחסוך מיד!</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="group text-base px-8 py-4 rounded-xl font-bold bg-white text-primary hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                onClick={() => navigate('/analyze')}
              >
                <span className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  התחל השוואה בחינם
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base px-8 py-4 rounded-xl font-bold border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                <Phone className="w-5 h-5 ml-2" />
                דבר עם יועץ מומחה
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;