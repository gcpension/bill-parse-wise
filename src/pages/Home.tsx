import { Shield, Zap, TrendingUp, Users, CheckCircle, Star, Calculator, Clock, Award, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  
  const services = [
    { name: "חשמל", icon: "⚡", savings: "עד 30%" },
    { name: "סלולר", icon: "📱", savings: "עד 40%" },
    { name: "אינטרנט", icon: "🌐", savings: "עד 25%" },
    { name: "גז", icon: "🔥", savings: "עד 20%" }
  ];

  const features = [
    {
      icon: Calculator,
      title: "השוואת מחירים מדויקת",
      description: "אלגוריתם מתקדם שמנתח את כל התעריפים בשוק"
    },
    {
      icon: Clock,
      title: "תהליך מהיר של 5 דקות",
      description: "מילוי פרטים פשוט וקבלת הצעות מיידית"
    },
    {
      icon: Shield,
      title: "בטיחות ואמינות",
      description: "הגנה מלאה על הפרטיות והנתונים האישיים"
    },
    {
      icon: Award,
      title: "ליווי מקצועי",
      description: "צוות מומחים שמלווה אתכם לאורך כל הדרך"
    }
  ];

  const stats = [
    { value: "72,000+", label: "לקוחות פעילים" },
    { value: "₪8.2M", label: "נחסך השנה" },
    { value: "4.9/5", label: "דירוג ממוצע" },
    { value: "98%", label: "שביעות רצון" }
  ];

  return (
    <div className="min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-bl from-background via-background to-muted/50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 tracking-tight font-heebo">
              השוואה והחלפה
              <br />
              <span className="bg-gradient-to-l from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
                חכמה של ספקים
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light leading-relaxed font-heebo">
              פלטפורמה מקצועית להשוואת תעריפים והחלפת ספקי שירות
              <br className="hidden sm:block" />
              חסכו עד 40% בחשבונות החודשיים שלכם
            </p>
            
            {/* Services Preview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {services.map((service, index) => (
                <div key={index} className="bg-card border rounded-2xl p-6 hover:shadow-md transition-all duration-300">
                  <div className="text-2xl mb-3">{service.icon}</div>
                  <h3 className="font-semibold mb-2 font-heebo">{service.name}</h3>
                  <p className="text-sm text-primary font-medium font-heebo">{service.savings}</p>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-10 py-6 rounded-2xl font-medium font-heebo"
                onClick={() => navigate('/analyze')}
              >
                התחל השוואה
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-10 py-6 rounded-2xl font-medium font-heebo">
                <Phone className="w-5 h-5 ml-2" />
                דבר עם יועץ
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2 font-mono">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium font-heebo">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-heebo">
              איך זה עובד?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light font-heebo">
              תהליך פשוט ושקוף שמבטיח לכם את המחירים הטובים ביותר בשוק
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 p-8">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 font-heebo">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed font-heebo">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 font-heebo">
                3 שלבים פשוטים לחיסכון
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold mb-4 font-heebo">מלא פרטים</h3>
                <p className="text-muted-foreground font-heebo">
                  הזן את הפרטים שלך ונתוני הצריכה הנוכחיים
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold mb-4 font-heebo">קבל הצעות</h3>
                <p className="text-muted-foreground font-heebo">
                  המערכת תציג לך את ההצעות הטובות ביותר מכל הספקים
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold mb-4 font-heebo">החלף וחסוך</h3>
                <p className="text-muted-foreground font-heebo">
                  בחר את ההצעה המתאימה ונטפל בכל התהליך עבורך
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-heebo">
              מוכן להתחיל לחסוך?
            </h2>
            <p className="text-xl mb-10 opacity-90 font-light leading-relaxed font-heebo">
              הצטרף לעשרות אלפי לקוחות שכבר חוסכים כסף
              <br />
              עם הפלטפורמה המקצועית שלנו
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-lg px-10 py-6 rounded-2xl font-medium font-heebo"
                onClick={() => navigate('/analyze')}
              >
                התחל השוואה בחינם
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 rounded-2xl font-medium border-white/20 text-white hover:bg-white/10 font-heebo">
                דבר עם יועץ
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;