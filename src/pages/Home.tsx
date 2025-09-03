import { Shield, Phone, Sparkles, Crown, Zap, Star, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

function Header() {
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
              <div className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-[var(--color-trust-blue)] via-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${scrolled ? 'animate-glow' : ''}`}>
                <Shield className="w-7 h-7 lg:w-8 lg:h-8 text-white group-hover:animate-wiggle" />
              </div>
              
              {/* Premium badge */}
              <div className="absolute -top-2 -right-2 w-6 h-6 lg:w-7 lg:h-7 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <Crown className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-trust-blue)] to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
              
              {/* Floating particles */}
              <div className="absolute -inset-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-2 w-1 h-1 bg-blue-400 rounded-full animate-float"></div>
                <div className="absolute top-2 right-0 w-1 h-1 bg-purple-400 rounded-full animate-float delay-300"></div>
                <div className="absolute bottom-1 left-0 w-1 h-1 bg-yellow-400 rounded-full animate-float delay-500"></div>
              </div>
            </div>
            
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-2xl lg:text-3xl bg-gradient-to-r from-[var(--color-trust-blue)] via-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:via-blue-600 group-hover:to-[var(--color-trust-blue)] transition-all duration-500 bg-300% animate-shimmer-text">
                  Switch IL
                </span>
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-xs lg:text-sm text-gray-600 group-hover:text-[var(--color-trust-blue)] transition-colors duration-300 mt-1">
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
                    <span className={`text-base lg:text-lg ${indicator.color} group-hover:text-blue-600 transition-colors duration-300 ${isActive ? 'animate-pulse' : ''}`}>
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
              className="relative flex items-center gap-2 lg:gap-3 glass backdrop-blur-xl border-2 border-white/40 hover:border-[var(--color-trust-blue)]/60 text-[var(--color-trust-blue)] hover:text-blue-600 px-4 py-2 lg:px-8 lg:py-4 rounded-xl lg:rounded-3xl transition-all duration-500 hover:shadow-2xl hover:scale-105 text-sm lg:text-lg group-hover:bg-white/95"
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

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-float delay-700"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-float delay-1000"></div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-8">
            {/* Main Headline */}
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold">
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-shimmer-text bg-300%">
                  חסוך עד 80%
                </span>
                <span className="block text-gray-800 mt-2">
                  על שירותי הטלקום שלך
                </span>
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                השוואת מחירים חכמה, מעבר אוטומטי, וחיסכון מובטח - כל זה במקום אחד
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 animate-fade-in delay-300">
              <button className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white text-xl font-semibold rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 rounded-3xl blur opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                <span className="relative flex items-center gap-3">
                  <Zap className="w-6 h-6 group-hover:animate-pulse" />
                  התחל לחסוך עכשיו
                </span>
              </button>
              
              <button className="group px-10 py-6 glass backdrop-blur-xl border-2 border-white/40 hover:border-blue-500/60 text-blue-600 text-xl font-semibold rounded-3xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <span className="flex items-center gap-3">
                  <Phone className="w-6 h-6 group-hover:animate-pulse" />
                  צור קשר
                </span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 animate-fade-in delay-500">
              <div className="group text-center space-y-3 p-6 glass backdrop-blur-xl rounded-3xl border border-white/30 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">100% מאובטח</h3>
                <p className="text-gray-600">הגנה מלאה על הנתונים האישיים שלך</p>
              </div>

              <div className="group text-center space-y-3 p-6 glass backdrop-blur-xl rounded-3xl border border-white/30 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">50K+ לקוחות מרוצים</h3>
                <p className="text-gray-600">חסכו יחד מיליוני שקלים בשנה האחרונה</p>
              </div>

              <div className="group text-center space-y-3 p-6 glass backdrop-blur-xl rounded-3xl border border-white/30 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">תמיכה 24/7</h3>
                <p className="text-gray-600">צוות מקצועי זמין עבורך בכל שעה</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              איך זה עובד?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              תהליך פשוט ומהיר שיחסוך לך אלפי שקלים בשנה
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative p-8 glass backdrop-blur-xl rounded-3xl border border-white/30 hover:shadow-2xl transition-all duration-700 hover:scale-105">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                1
              </div>
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">הזן פרטי צריכה</h3>
                <p className="text-gray-600 leading-relaxed">
                  פשוט הזן את פרטי החבילה הנוכחית שלך או העלה חשבון אחרון - אנחנו נטפל בשאר
                </p>
              </div>
            </div>

            <div className="group relative p-8 glass backdrop-blur-xl rounded-3xl border border-white/30 hover:shadow-2xl transition-all duration-700 hover:scale-105">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                2
              </div>
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">השוואה חכמה</h3>
                <p className="text-gray-600 leading-relaxed">
                  האלגוריתם שלנו משווה מאות חבילות ומוצא את האפשרויות הטובות ביותר עבורך
                </p>
              </div>
            </div>

            <div className="group relative p-8 glass backdrop-blur-xl rounded-3xl border border-white/30 hover:shadow-2xl transition-all duration-700 hover:scale-105">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                3
              </div>
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">מעבר אוטומטי</h3>
                <p className="text-gray-600 leading-relaxed">
                  אנחנו מטפלים בכל התהליך - מהזמנה ועד ביטול הספק הישן. פשוט וללא טרחה
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="glass backdrop-blur-xl rounded-3xl border border-white/30 p-12 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  50K+
                </div>
                <div className="text-gray-600 font-medium">לקוחות מרוצים</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  ₪50M
                </div>
                <div className="text-gray-600 font-medium">נחסכו השנה</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
                  98%
                </div>
                <div className="text-gray-600 font-medium">שביעות רצון</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                  24/7
                </div>
                <div className="text-gray-600 font-medium">תמיכה</div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              מוכן להתחיל לחסוך?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              הצטרף ל-50,000+ לקוחות שכבר חוסכים אלפי שקלים מדי שנה
            </p>
            <div className="pt-6">
              <button className="group relative px-16 py-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white text-2xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 rounded-full blur opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                <span className="relative flex items-center gap-4">
                  <Crown className="w-8 h-8 group-hover:animate-pulse" />
                  בואו נתחיל!
                  <Sparkles className="w-8 h-8 group-hover:animate-pulse" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
