import { Shield, Phone, Sparkles, Zap, Star, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const trustIndicators = [
    {
      icon: Shield,
      title: "100% מאובטח",
      subtitle: "הגנה מלאה על הנתונים",
      color: "text-[var(--color-trust-blue)]"
    },
    {
      icon: Users,
      title: "50K+ לקוחות",
      subtitle: "מרוצים ומעוניינים לחסוך",
      color: "text-green-700"
    },
    {
      icon: Award,
      title: "תמיכה 24/7",
      subtitle: "זמינים תמיד עבורך",
      color: "text-yellow-700"
    }
  ];

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-sm transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 border-gray-200 shadow-lg' 
        : 'bg-white/90 border-gray-100 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-[var(--color-trust-blue)] to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            
            <div className="hidden sm:block">
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-[var(--color-trust-blue)] to-blue-700 bg-clip-text text-transparent">
                Switch IL
              </span>
              <div className="text-xs lg:text-sm text-gray-600 mt-1">
                פלטפורמת החיסכון המובילה בישראל
              </div>
            </div>
          </div>
          
          {/* Trust indicators - desktop only */}
          <div className="hidden lg:flex items-center space-x-6">
            {trustIndicators.map((indicator, index) => {
              const IconComponent = indicator.icon;
              
              return (
                <div 
                  key={index}
                  className="flex items-center space-x-3 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200 shadow-sm"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${indicator.color}`}>
                      {indicator.title}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {indicator.subtitle}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA button */}
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[var(--color-trust-blue)]/30 text-[var(--color-trust-blue)] hover:bg-[var(--color-trust-blue)] hover:text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg transition-colors duration-200 text-sm lg:text-base"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">התחבר</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile trust indicators bar */}
      <div className="lg:hidden border-t border-gray-100 bg-white/90 backdrop-blur-sm">
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <main className="relative">
        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="text-center space-y-8">
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  חסוך עד 80%
                </span>
                <span className="block text-gray-900 mt-2">
                  על שירותי הטלקום שלך
                </span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                השוואת מחירים חכמה, מעבר אוטומטי, וחיסכון מובטח - כל זה במקום אחד
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  התחל לחסוך עכשיו
                </span>
              </button>
              
              <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 text-lg font-semibold rounded-lg hover:border-gray-300 transition-colors duration-200">
                <span className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  צור קשר
                </span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 max-w-5xl mx-auto">
              <div className="text-center space-y-4 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                  <Shield className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">100% מאובטח</h3>
                <p className="text-gray-600">הגנה מלאה על הנתונים האישיים שלך</p>
              </div>

              <div className="text-center space-y-4 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">50K+ לקוחות מרוצים</h3>
                <p className="text-gray-600">חסכו יחד מיליוני שקלים בשנה האחרונה</p>
              </div>

              <div className="text-center space-y-4 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto">
                  <Award className="w-7 h-7 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">תמיכה 24/7</h3>
                <p className="text-gray-600">צוות מקצועי זמין עבורך בכל שעה</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                איך זה עובד?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                תהליך פשוט ומהיר שיחסוך לך אלפי שקלים בשנה
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">הזן פרטי צריכה</h3>
                  <p className="text-gray-600 leading-relaxed">
                    פשוט הזן את פרטי החבילה הנוכחית שלך או העלה חשבון אחרון - אנחנו נטפל בשאר
                  </p>
                </div>
              </div>

              <div className="relative p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">השוואה חכמה</h3>
                  <p className="text-gray-600 leading-relaxed">
                    האלגוריתם שלנו משווה מאות חבילות ומוצא את האפשרויות הטובות ביותר עבורך
                  </p>
                </div>
              </div>

              <div className="relative p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">מעבר אוטומטי</h3>
                  <p className="text-gray-600 leading-relaxed">
                    אנחנו מטפלים בכל התהליך - מהזמנה ועד ביטול הספק הישן. פשוט וללא טרחה
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">50K+</div>
                <div className="text-gray-600">לקוחות מרוצים</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">₪12M</div>
                <div className="text-gray-600">נחסכו השנה</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-yellow-600">24/7</div>
                <div className="text-gray-600">תמיכה</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">99%</div>
                <div className="text-gray-600">שביעות רצון</div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              מוכן להתחיל לחסוך?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              הצטרף לאלפי לקוחות מרוצים שכבר חוסכים מאות שקלים מדי חודש
            </p>
            <button className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200">
              התחל עכשיו - זה חינם!
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}