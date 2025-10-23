import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, Mic, Sparkles, ArrowRight, Zap, Shield, Clock, CheckCircle, Star, TrendingUp } from 'lucide-react';
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
      setIsScrolled(window.scrollY > 50);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Sticky Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/90 backdrop-blur-lg shadow-lg py-3" 
          : "bg-transparent py-4"
      )}>
        <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                EasySwitch AI
              </h1>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="/all-plans" className="text-gray-700 font-medium hover:text-purple-600 transition-colors">
                כל המסלולים
              </a>
              <a href="/magazine" className="text-gray-700 font-medium hover:text-purple-600 transition-colors">
                מגזין
              </a>
              <a href="/about" className="text-gray-700 font-medium hover:text-purple-600 transition-colors">
                אודות
              </a>
              <Button 
                onClick={() => setShowAI(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Sparkles className="h-4 w-4 ml-2" />
                התחל עכשיו
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-purple-100">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  מעל 10,000 משפחות חוסכות איתנו
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="block text-gray-900">דברו עם</span>
                <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">
                  העוזר החכם שלנו
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                AI מתקדם שמנתח את הצרכים שלכם ומוצא את המסלולים הכי משתלמים בחשמל, אינטרנט, סלולר וטלוויזיה
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={() => setShowAI(true)}
                  className="group h-16 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg font-semibold shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                >
                  <MessageSquare className="h-6 w-6 ml-3 group-hover:rotate-12 transition-transform" />
                  התחל שיחה עם AI
                  <ArrowRight className="h-5 w-5 mr-3 group-hover:translate-x-[-4px] transition-transform" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowAI(true)}
                  className="group h-16 px-8 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 text-lg font-semibold"
                >
                  <Mic className="h-6 w-6 ml-3 group-hover:scale-110 transition-transform" />
                  דבר באמצעות קול
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">₪2,400</div>
                  <div className="text-sm text-gray-600">חיסכון ממוצע בשנה</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600">זמין תמיד</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-600">2 דק׳</div>
                  <div className="text-sm text-gray-600">זמן תגובה</div>
                </div>
              </div>
            </div>

            {/* Right: Interactive Demo */}
            <div className="relative">
              {/* Floating Chat Preview */}
              <Card className="relative bg-white/90 backdrop-blur-lg shadow-2xl border-2 border-purple-100 p-6 animate-float">
                <div className="space-y-4">
                  {/* AI Avatar */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">עוזר AI חכם</div>
                      <div className="text-sm text-green-600 flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        פעיל עכשיו
                      </div>
                    </div>
                  </div>

                  {/* Sample Messages */}
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl rounded-tr-sm p-4 border border-purple-100">
                      <p className="text-gray-800">
                        שלום! 👋 איך אוכל לעזור לך לחסוך היום?
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl rounded-tl-sm p-4 border border-gray-200 max-w-[80%]">
                        <p className="text-gray-800">
                          אני משלם הרבה על חשמל...
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl rounded-tr-sm p-4 border border-purple-100">
                      <p className="text-gray-800">
                        אשמח לעזור! 🎯 כמה אתה משלם בחודש?
                      </p>
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-sm">מנתח את הנתונים...</span>
                  </div>

                  {/* Voice Indicator */}
                  <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-100/50 to-blue-100/50 rounded-xl border border-purple-200/50">
                    <Mic className="h-5 w-5 text-purple-600" />
                    <div className="flex gap-1">
                      {[1,2,3,4,5,6,7].map((i) => (
                        <div
                          key={i}
                          className="w-1 bg-gradient-to-t from-purple-600 to-blue-600 rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 24 + 8}px`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        ></div>
                      ))}
                    </div>
                    <span className="text-sm text-purple-600 font-medium">מקשיב...</span>
                  </div>
                </div>
              </Card>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              למה לבחור בעוזר החכם שלנו?
            </h2>
            <p className="text-xl text-gray-600">
              טכנולוגיית AI מתקדמת שעובדת בשבילך 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'AI מתקדם',
                description: 'טכנולוגיית בינה מלאכותית שמבינה את הצרכים שלך',
                color: 'from-purple-600 to-purple-400'
              },
              {
                icon: Zap,
                title: 'תוצאות מיידיות',
                description: 'קבל המלצות מותאמות תוך שניות ספורות',
                color: 'from-blue-600 to-blue-400'
              },
              {
                icon: Shield,
                title: 'אמין ומאובטח',
                description: 'המידע שלך מוגן ומאובטח ברמה הגבוהה ביותר',
                color: 'from-cyan-600 to-cyan-400'
              },
              {
                icon: TrendingUp,
                title: 'חיסכון מקסימלי',
                description: 'המשפחה הממוצעת חוסכת ₪2,400 בשנה',
                color: 'from-green-600 to-green-400'
              }
            ].map((feature, index) => (
              <Card 
                key={index}
                className="group p-6 bg-white/80 backdrop-blur-sm border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                  feature.color
                )}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              איך זה עובד?
            </h2>
            <p className="text-xl text-gray-600">
              3 שלבים פשוטים לחיסכון מקסימלי
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'דבר עם העוזר',
                description: 'ספר לנו על הצרכים שלך - בכתב או בקול',
                icon: MessageSquare
              },
              {
                step: '2',
                title: 'קבל המלצות',
                description: 'ה-AI שלנו מנתח ומציע את המסלולים הטובים ביותר',
                icon: Sparkles
              },
              {
                step: '3',
                title: 'התחל לחסוך',
                description: 'בחר את המסלול שמתאים לך והתחל לחסוך',
                icon: CheckCircle
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-8 bg-white/80 backdrop-blur-sm border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300">
                  <div className="absolute -top-6 right-8 w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {step.step}
                  </div>
                  <div className="pt-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4">
                      <step.icon className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </Card>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-8 -translate-y-1/2 -translate-x-1/2">
                    <ArrowRight className="h-8 w-8 text-purple-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            מוכנים להתחיל לחסוך?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            הצטרפו ל-10,000+ משפחות שכבר חוסכות עם העוזר החכם שלנו
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setShowAI(true)}
              className="group h-16 px-8 bg-white text-purple-600 hover:bg-gray-50 text-lg font-semibold shadow-2xl"
            >
              <Sparkles className="h-6 w-6 ml-3 group-hover:rotate-12 transition-transform" />
              התחל עכשיו בחינם
              <ArrowRight className="h-5 w-5 mr-3 group-hover:translate-x-[-4px] transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/all-plans')}
              className="h-16 px-8 border-2 border-white text-white hover:bg-white/10 text-lg font-semibold"
            >
              צפה בכל המסלולים
            </Button>
          </div>
        </div>
      </section>

      {/* AI Assistant Modal */}
      {showAI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <AIAssistant plans={allPlans} />
            <Button
              onClick={() => setShowAI(false)}
              variant="ghost"
              className="absolute top-4 left-4"
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
