import { Shield, Phone, Sparkles, Crown, Zap, Star, Award, Users, TrendingUp, ArrowRight, CheckCircle2, Target, Calendar, DollarSign, Globe, Wifi, Tv, Smartphone, Battery } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeIndicator, setActiveIndicator] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    const indicatorInterval = setInterval(() => {
      setActiveIndicator(prev => (prev + 1) % 3);
    }, 3000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(indicatorInterval);
    };
  }, []);

  const trustIndicators = [
    {
      icon: Shield,
      title: "100% מאובטח",
      subtitle: "הגנה מלאה על הנתונים",
      gradient: "from-blue-500 via-blue-600 to-purple-600",
      color: "text-[var(--color-trust-blue)]"
    },
    {
      icon: Users,
      title: "50K+ לקוחות",
      subtitle: "מרוצים ומעוניינים לחסוך",
      gradient: "from-green-500 via-emerald-600 to-teal-600",
      color: "text-green-700"
    },
    {
      icon: Award,
      title: "תמיכה 24/7",
      subtitle: "זמינים תמיד עבורך",
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      color: "text-yellow-700"
    }
  ];

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-3xl transition-all duration-700 ${
      scrolled 
        ? 'glass border-white/40 bg-white/98 shadow-2xl' 
        : 'border-white/20 bg-white/95 shadow-xl'
    }`}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 lg:h-24">
          {/* Enhanced Logo */}
          <div className="flex items-center space-x-4 group cursor-pointer">
            <div className="relative">
              {/* Main logo container */}
              <div className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${scrolled ? 'animate-glow' : ''}`}>
                <Shield className="w-7 h-7 lg:w-8 lg:h-8 text-white group-hover:animate-wiggle" />
              </div>
              
              {/* Premium badge */}
              <div className="absolute -top-2 -right-2 w-6 h-6 lg:w-7 lg:h-7 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <Crown className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
              
              {/* Floating particles */}
              <div className="absolute -inset-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-2 w-1 h-1 bg-blue-400 rounded-full animate-float"></div>
                <div className="absolute top-2 right-0 w-1 h-1 bg-purple-400 rounded-full animate-float delay-300"></div>
                <div className="absolute bottom-1 left-0 w-1 h-1 bg-yellow-400 rounded-full animate-float delay-500"></div>
              </div>
            </div>
            
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-2xl lg:text-3xl bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:via-blue-600 group-hover:to-blue-500 transition-all duration-500 bg-300% animate-shimmer-text">
                  Switch IL
                </span>
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-xs lg:text-sm text-gray-600 group-hover:text-blue-500 transition-colors duration-300 mt-1">
                פלטפורמת החיסכון המובילה בישראל
              </div>
            </div>
          </div>
          
          {/* Enhanced Trust indicators - desktop only */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {trustIndicators.map((indicator, index) => {
              const IconComponent = indicator.icon;
              const isActive = activeIndicator === index;
              
              return (
                <div 
                  key={index}
                  className={`group flex items-center space-x-3 glass backdrop-blur-xl rounded-2xl lg:rounded-3xl px-4 py-3 lg:px-6 lg:py-4 hover:bg-white/90 hover:shadow-2xl transition-all duration-700 border border-white/30 ${
                    isActive ? 'bg-white/95 shadow-xl scale-105' : 'hover:scale-105'
                  }`}
                >
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${indicator.gradient} rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg ${
                    isActive ? 'animate-pulse' : ''
                  }`}>
                    <IconComponent className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <span className={`text-base lg:text-lg text-blue-600 group-hover:text-blue-600 transition-colors duration-300 ${isActive ? 'animate-pulse' : ''}`}>
                      {indicator.title}
                    </span>
                    <div className="text-xs lg:text-sm text-gray-600 mt-1 hidden xl:block">
                      {indicator.subtitle}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced CTA button */}
          <div className="relative group">
            {/* Animated background */}
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-500 via-purple-500 via-blue-600 to-purple-500 rounded-2xl lg:rounded-3xl blur opacity-0 group-hover:opacity-70 transition duration-700 animate-gradient-x bg-300%"></div>
            
            {/* Main button */}
            <Button 
              variant="outline" 
              className="relative flex items-center gap-2 lg:gap-3 glass backdrop-blur-xl border-2 border-white/40 hover:border-blue-500/60 text-blue-500 hover:text-blue-600 px-4 py-2 lg:px-8 lg:py-4 rounded-xl lg:rounded-3xl transition-all duration-500 hover:shadow-2xl hover:scale-105 text-sm lg:text-lg group-hover:bg-white/95"
            >
              {/* Icon with multiple states */}
              <div className="relative">
                <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 group-hover:animate-pulse transition-all duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"></div>
              </div>
              
              <span className="hidden sm:inline">התחבר</span>
              
              {/* Floating mini elements */}
              <div className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-0 right-2 w-1 h-1 bg-blue-400 rounded-full animate-float"></div>
                <div className="absolute bottom-1 left-2 w-1 h-1 bg-purple-400 rounded-full animate-float delay-300"></div>
              </div>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile trust indicators bar */}
      <div className="lg:hidden border-t border-white/20 bg-white/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center space-x-6 text-xs">
            <div className="flex items-center gap-1 text-blue-600">
              <Shield className="w-3 h-3" />
              <span>מאובטח</span>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <Users className="w-3 h-3" />
              <span>50K+ לקוחות</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-600">
              <Award className="w-3 h-3" />
              <span>תמיכה 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Hero Section Component
function HeroSection() {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: TrendingUp,
      title: "חיסכון מובטח",
      subtitle: "עד 70% הנחה",
    },
    {
      icon: Shield,
      title: "מאובטח ומהימן", 
      subtitle: "הגנה מלאה",
    },
    {
      icon: Award,
      title: "שירות מקצועי",
      subtitle: "תמיכה 24/7",
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-gray-50/50">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Hero Content */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl lg:text-7xl font-black bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Switch IL
            </h1>
            <div className="w-16 h-16 bg-gradient-to-br from-primary-glow to-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <p className="text-xl lg:text-3xl font-bold text-foreground mb-4">
            פלטפורמת החיסכון המובילה בישראל
          </p>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            חסוך עד 70% על כל השירותים שלך - חשמל, סלולר, אינטרנט וטלוויזיה
            <br />
            <span className="font-semibold text-primary">50,000+ לקוחות כבר חסכו מיליוני שקלים</span>
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isActive = activeFeature === index;
              
              return (
                <div 
                  key={index}
                  className={`flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 border border-border/50 transition-all duration-500 shadow-sm ${
                    isActive ? 'bg-white shadow-md scale-105 border-primary/20' : 'hover:bg-white/90 hover:scale-102'
                  }`}
                >
                  <div className={`w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-primary text-white' : ''
                  } transition-all duration-500`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-lg ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {feature.title}
                    </div>
                    <div className="text-sm text-muted-foreground">{feature.subtitle}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg"
              onClick={() => navigate('/analyze')}
              className="bg-primary hover:bg-primary/90 text-white px-12 py-6 rounded-2xl text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="ml-2 h-6 w-6" />
              התחל לחסוך עכשיו
              <ArrowRight className="mr-2 h-6 w-6" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              onClick={() => navigate('/compare')}
              className="border-2 border-border hover:border-primary/60 text-foreground hover:text-primary px-8 py-6 rounded-2xl text-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 bg-white/50"
            >
              <Target className="ml-2 h-5 w-5" />
              השווה מחירים
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { number: "50K+", label: "לקוחות מרוצים", icon: Users },
            { number: "₪2.5M", label: "נחסך השנה", icon: DollarSign },
            { number: "24/7", label: "תמיכה זמינה", icon: Award }
          ].map((stat, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-md">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl font-black text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Services Section Component
function ServicesSection() {
  const navigate = useNavigate();
  
  const services = [
    {
      icon: Zap,
      title: "חשמל",
      subtitle: "חסוך עד 30% על חשבון החשמל",
      savings: "₪200-500",
      path: "/forms?category=electricity"
    },
    {
      icon: Smartphone,
      title: "סלולר",
      subtitle: "תוכניות בלתי מוגבלות במחירים נמוכים",
      savings: "₪50-150",
      path: "/forms?category=cellular"
    },
    {
      icon: Wifi,
      title: "אינטרנט",
      subtitle: "מהירות גבוהה במחירים משתלמים",
      savings: "₪30-100",
      path: "/forms?category=internet"
    },
    {
      icon: Tv,
      title: "טלוויזיה",
      subtitle: "ערוצים פרימיום במחיר נמוך",
      savings: "₪40-120",
      path: "/forms?category=tv"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-6">
            השירותים שלנו
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            חסוך על כל השירותים החיוניים שלך במקום אחד
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden border-border hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-500 animate-slide-up cursor-pointer bg-white/70 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(service.path)}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              
              <CardHeader className="text-center p-8">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                  <service.icon className="w-10 h-10 text-primary group-hover:text-white transition-colors duration-500" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {service.subtitle}
                </p>
                
                <Badge className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 mx-auto transition-all duration-300">
                  חיסכון חודשי: {service.savings}
                </Badge>
              </CardHeader>
              
              <CardContent className="p-8 pt-0">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white shadow-sm transform hover:scale-105 transition-all duration-300"
                >
                  <ArrowRight className="ml-2 h-4 w-4" />
                  התחל לחסוך
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Why Choose Us Section
function WhyChooseUsSection() {
  const reasons = [
    {
      icon: Shield,
      title: "מאובטח ומהימן",
      description: "הגנה מלאה על הנתונים האישיים שלך עם הצפנה מתקדמת"
    },
    {
      icon: TrendingUp,
      title: "חיסכון מובטח",
      description: "אנחנו מבטיחים לך חיסכון או שאתה מקבל את הכסף בחזרה"
    },
    {
      icon: Users,
      title: "50,000+ לקוחות מרוצים",
      description: "הצטרף לקהילה הגדולה של חוסכים מרוצים"
    },
    {
      icon: Award,
      title: "שירות מקצועי",
      description: "צוות מקצועי זמין 24/7 לכל שאלה או בעיה"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-6">
            למה לבחור בנו?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            אנחנו לא רק עוזרים לך לחסוך, אנחנו דואגים לחוויה הטובה ביותר
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 animate-slide-up border-border bg-white/70 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="absolute inset-0 bg-primary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardContent className="relative p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-500 flex-shrink-0">
                    <reason.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-500" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {reason.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <WhyChooseUsSection />
    </div>
  );
}
