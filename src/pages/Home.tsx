import { Shield, Phone, Sparkles, Crown, Zap, Star, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

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
  return <Header />;
}
