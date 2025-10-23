import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, Mic, ArrowRight, Check, Star, Sparkles, Zap, TrendingUp, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { usePageMeta } from '@/hooks/usePageMeta';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { useAllPlans } from '@/hooks/useAllPlans';

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const navigate = useNavigate();
  const allPlans = useAllPlans();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  usePageMeta({
    title: 'EasySwitch - עוזר AI חכם למציאת המסלולים הטובים ביותר',
    description: 'דברו עם העוזר החכם שלנו וקבלו המלצות מותאמות אישית לחסכון בחשמל, אינטרנט, סלולר וטלוויזיה',
    keywords: ['AI', 'עוזר חכם', 'חיסכון', 'חשמל', 'אינטרנט', 'סלולר', 'טלוויזיה']
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-purple-500/10 py-4" 
          : "bg-transparent py-6"
      )}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 animate-pulse">
                <Sparkles className="text-white h-6 w-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                EasySwitch
              </span>
            </div>
            
            <div className="flex items-center gap-8">
              <a href="/all-plans" className="text-gray-300 hover:text-white transition-colors text-sm font-medium hover:scale-105 transform duration-200">
                כל המסלולים
              </a>
              <a href="/magazine" className="text-gray-300 hover:text-white transition-colors text-sm font-medium hover:scale-105 transform duration-200">
                מגזין
              </a>
              <a href="/about" className="text-gray-300 hover:text-white transition-colors text-sm font-medium hover:scale-105 transform duration-200">
                אודות
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full mb-8 animate-fade-in hover:bg-white/20 transition-all duration-300 shadow-lg shadow-purple-500/20">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                מעל 10,000 משפחות חוסכות
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-tight animate-fade-in">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent inline-block animate-scale-in">
                עוזר AI חכם
              </span>
              <br />
              <span className="text-white drop-shadow-2xl">למציאת המסלולים</span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">הטובים ביותר</span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              שיחה פשוטה עם <span className="text-purple-400 font-semibold">AI מתקדם</span> שמנתח את הצרכים שלכם ומוצא את המסלולים 
              הכי משתלמים ב<span className="text-blue-400">חשמל</span>, <span className="text-green-400">אינטרנט</span>, <span className="text-pink-400">סלולר</span> ו<span className="text-yellow-400">טלוויזיה</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button
                size="lg"
                onClick={() => setShowAI(true)}
                className="h-16 px-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white text-lg font-bold shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transform hover:scale-105 transition-all duration-300 border-2 border-white/20"
              >
                <Sparkles className="h-6 w-6 mr-3 animate-pulse" />
                התחל שיחה עכשיו
                <ArrowRight className="h-6 w-6 mr-3" />
              </Button>

              <Button
                size="lg"
                onClick={() => navigate('/all-plans')}
                className="h-16 px-10 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white/20 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                צפה בכל המסלולים
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-white/20 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">₪2,400</div>
                <div className="text-sm text-gray-300 font-medium">חיסכון ממוצע בשנה</div>
              </div>
              <div className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">24/7</div>
                <div className="text-sm text-gray-300 font-medium">זמין תמיד</div>
              </div>
              <div className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">2 דק׳</div>
                <div className="text-sm text-gray-300 font-medium">זמן תגובה ממוצע</div>
              </div>
            </div>
          </div>

          {/* Chat Preview */}
          <div className="max-w-4xl mx-auto mt-20 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Card className="border-2 border-white/20 shadow-2xl overflow-hidden backdrop-blur-xl bg-white/5 hover:bg-white/10 transition-all duration-500 hover:shadow-purple-500/20 hover:shadow-3xl hover:scale-105 transform">
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl border-b border-white/20 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50 animate-pulse">
                    <Sparkles className="text-white h-7 w-7" />
                  </div>
                  <div>
                    <div className="font-bold text-xl text-white">עוזר AI מתקדם</div>
                    <div className="text-sm text-gray-300 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                      פעיל ומוכן לעזור
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl rounded-tr-sm p-6 max-w-[85%] border border-white/10 animate-fade-in shadow-lg">
                  <p className="text-white text-lg">👋 שלום! איך אוכל לעזור לך לחסוך היום?</p>
                </div>
                
                <div className="flex justify-end animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl rounded-tl-sm p-6 max-w-[85%] shadow-xl shadow-blue-500/30">
                    <p className="text-lg">אני משלם הרבה על חשמל ⚡</p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-3xl rounded-tr-sm p-6 max-w-[85%] border border-white/10 animate-fade-in shadow-lg" style={{ animationDelay: '0.6s' }}>
                  <p className="text-white text-lg">אשמח לעזור! 📊 כמה אתה משלם בחודש בערך?</p>
                </div>

                <div className="flex items-center gap-3 text-gray-300 animate-fade-in" style={{ animationDelay: '0.9s' }}>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce shadow-lg shadow-blue-400/50"></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce shadow-lg shadow-purple-400/50" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full animate-bounce shadow-lg shadow-pink-400/50" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-base font-medium">מנתח את הצרכים שלך...</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-t border-white/10 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => setShowAI(true)}
                    className="h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
                  >
                    <MessageSquare className="h-5 w-5 ml-2" />
                    צ'אט טקסט
                  </Button>
                  <Button
                    onClick={() => setShowAI(true)}
                    className="h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300"
                  >
                    <Mic className="h-5 w-5 ml-2" />
                    שיחה קולית
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-slate-900 to-slate-800 z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4 animate-fade-in">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">איך זה עובד</span>
            </h2>
            <p className="text-xl text-gray-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              שלושה שלבים פשוטים לחיסכון מקסימלי ⚡
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                icon: <MessageSquare className="h-10 w-10" />,
                title: 'שיחה עם AI',
                description: 'ספר לנו על הצרכים שלך בכתב או בקול',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                number: '02',
                icon: <Zap className="h-10 w-10" />,
                title: 'קבל המלצות',
                description: 'המערכת מנתחת ומציעה את המסלולים הטובים ביותר',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                number: '03',
                icon: <TrendingUp className="h-10 w-10" />,
                title: 'התחל לחסוך',
                description: 'בחר מסלול והתחל לחסוך מיידית',
                gradient: 'from-pink-500 to-orange-500'
              }
            ].map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:scale-105 transform animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                  <div className="text-7xl font-black bg-gradient-to-r from-white/10 to-white/5 bg-clip-text text-transparent mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-lg">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-8 -translate-y-1/2 -translate-x-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-purple-400 animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative py-20 px-6 z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-5xl font-black mb-8">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  למה לבחור ב-EasySwitch?
                </span>
              </h2>
              <div className="space-y-5">
                {[
                  { icon: <Sparkles className="h-5 w-5" />, text: 'טכנולוגיית AI מתקדמת שמבינה את הצרכים שלך' },
                  { icon: <Zap className="h-5 w-5" />, text: 'תוצאות מיידיות תוך שניות ספורות' },
                  { icon: <Shield className="h-5 w-5" />, text: 'המידע שלך מוגן ומאובטח' },
                  { icon: <TrendingUp className="h-5 w-5" />, text: 'חיסכון ממוצע של ₪2,400 בשנה' },
                  { icon: <Star className="h-5 w-5" />, text: 'זמין 24/7 ללא עלות' }
                ].map((benefit, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 group hover:scale-105 transition-transform duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="mt-1 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/50 group-hover:shadow-purple-500/70 transition-shadow duration-300">
                      <div className="text-white">{benefit.icon}</div>
                    </div>
                    <span className="text-white text-lg font-medium leading-relaxed">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-10 text-white shadow-2xl shadow-purple-500/50 border-2 border-white/20 backdrop-blur-xl hover:scale-105 transition-transform duration-500 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-7xl font-black mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">₪2,400</div>
              <div className="text-2xl mb-10 text-white/90 font-semibold">חיסכון ממוצע בשנה 💰</div>
              <div className="space-y-4 mb-10">
                {[
                  { name: 'חשמל ⚡', amount: '₪600', gradient: 'from-yellow-400 to-orange-400' },
                  { name: 'סלולר 📱', amount: '₪800', gradient: 'from-blue-400 to-cyan-400' },
                  { name: 'אינטרנט 🌐', amount: '₪600', gradient: 'from-green-400 to-emerald-400' },
                  { name: 'טלוויזיה 📺', amount: '₪400', gradient: 'from-purple-400 to-pink-400' }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center py-3 border-b border-white/20 group hover:border-white/40 transition-colors duration-300"
                  >
                    <span className="text-white/90 text-lg font-medium">{item.name}</span>
                    <span className={`font-bold text-xl bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setShowAI(true)}
                className="w-full bg-white text-purple-600 hover:bg-gray-100 h-14 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="h-5 w-5 ml-2" />
                התחל עכשיו
                <ArrowRight className="h-5 w-5 mr-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden z-10">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-5xl lg:text-7xl font-black mb-8 animate-fade-in">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              מוכנים להתחיל לחסוך?
            </span>
          </h2>
          <p className="text-2xl text-gray-300 mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            הצטרפו ל-<span className="text-purple-400 font-bold">10,000+</span> משפחות שכבר חוסכות 💎
          </p>
          <Button
            size="lg"
            onClick={() => setShowAI(true)}
            className="h-20 px-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white text-xl font-black shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transform hover:scale-110 transition-all duration-300 border-2 border-white/20 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <Sparkles className="h-7 w-7 mr-3 animate-pulse" />
            התחל שיחה עם העוזר החכם
            <ArrowRight className="h-7 w-7 mr-3" />
          </Button>
        </div>
      </section>

      {/* AI Assistant Dialog */}
      {showAI && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowAI(false)}
        >
          <div 
            className="w-full max-w-6xl h-[90vh] bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl overflow-hidden border-2 border-white/10 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <AIAssistant plans={allPlans} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
