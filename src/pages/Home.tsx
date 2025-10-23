import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, Mic, ArrowRight, Check, Star } from 'lucide-react';
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 backdrop-blur-sm shadow-sm py-4" 
          : "bg-white py-6"
      )}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ES</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">EasySwitch</span>
            </div>
            
            <div className="flex items-center gap-8">
              <a href="/all-plans" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                כל המסלולים
              </a>
              <a href="/magazine" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                מגזין
              </a>
              <a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                אודות
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full mb-8">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="h-3.5 w-3.5 fill-gray-900 text-gray-900" />
                ))}
              </div>
              <span className="text-sm text-gray-600">מעל 10,000 משפחות חוסכות</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              עוזר AI חכם למציאת
              <br />
              <span className="text-gray-400">המסלולים הטובים ביותר</span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              שיחה פשוטה עם AI מתקדם שמנתח את הצרכים שלכם ומוצא את המסלולים 
              הכי משתלמים בחשמל, אינטרנט, סלולר וטלוויזיה
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                size="lg"
                onClick={() => setShowAI(true)}
                className="h-14 px-8 bg-gray-900 hover:bg-gray-800 text-white text-base font-medium"
              >
                התחל שיחה
                <ArrowRight className="h-5 w-5 mr-3" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/all-plans')}
                className="h-14 px-8 border-2 border-gray-900 text-gray-900 hover:bg-gray-50 text-base font-medium"
              >
                צפה בכל המסלולים
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">₪2,400</div>
                <div className="text-sm text-gray-600">חיסכון ממוצע בשנה</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
                <div className="text-sm text-gray-600">זמין תמיד</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">2 דק׳</div>
                <div className="text-sm text-gray-600">זמן תגובה ממוצע</div>
              </div>
            </div>
          </div>

          {/* Chat Preview */}
          <div className="max-w-3xl mx-auto mt-20">
            <Card className="border-2 border-gray-200 shadow-2xl overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">AI</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">עוזר חכם</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      פעיל
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4 bg-white">
                <div className="bg-gray-50 rounded-2xl rounded-tr-sm p-4 max-w-[85%]">
                  <p className="text-gray-800">שלום! איך אוכל לעזור לך לחסוך היום?</p>
                </div>
                
                <div className="flex justify-end">
                  <div className="bg-gray-900 text-white rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
                    <p>אני משלם הרבה על חשמל</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl rounded-tr-sm p-4 max-w-[85%]">
                  <p className="text-gray-800">אשמח לעזור. כמה אתה משלם בחודש?</p>
                </div>

                <div className="flex items-center gap-2 text-gray-400">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-sm">מנתח...</span>
                </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowAI(true)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <MessageSquare className="h-4 w-4 ml-2" />
                    כתוב הודעה
                  </Button>
                  <Button
                    onClick={() => setShowAI(true)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Mic className="h-4 w-4 ml-2" />
                    דבר בקול
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">איך זה עובד</h2>
            <p className="text-lg text-gray-600">שלושה שלבים פשוטים לחיסכון מקסימלי</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                title: 'שיחה עם AI',
                description: 'ספר לנו על הצרכים שלך בכתב או בקול'
              },
              {
                number: '02',
                title: 'קבל המלצות',
                description: 'המערכת מנתחת ומציעה את המסלולים הטובים ביותר'
              },
              {
                number: '03',
                title: 'התחל לחסוך',
                description: 'בחר מסלול והתחל לחסוך מיידית'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-900 transition-colors">
                  <div className="text-6xl font-bold text-gray-100 mb-4">{step.number}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-8 -translate-y-1/2 -translate-x-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                למה לבחור ב-EasySwitch?
              </h2>
              <div className="space-y-4">
                {[
                  'טכנולוגיית AI מתקדמת שמבינה את הצרכים שלך',
                  'תוצאות מיידיות תוך שניות ספורות',
                  'המידע שלך מוגן ומאובטח',
                  'חיסכון ממוצע של ₪2,400 בשנה',
                  'זמין 24/7 ללא עלות'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-12 text-white">
              <div className="text-6xl font-bold mb-4">₪2,400</div>
              <div className="text-xl mb-8 text-gray-300">חיסכון ממוצע בשנה</div>
              <div className="space-y-3 mb-8">
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-300">חשמל</span>
                  <span className="font-semibold">₪600</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-300">סלולר</span>
                  <span className="font-semibold">₪800</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-300">אינטרנט</span>
                  <span className="font-semibold">₪600</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-300">טלוויזיה</span>
                  <span className="font-semibold">₪400</span>
                </div>
              </div>
              <Button
                onClick={() => setShowAI(true)}
                className="w-full bg-white text-gray-900 hover:bg-gray-100 h-12"
              >
                התחל עכשיו
                <ArrowRight className="h-4 w-4 mr-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            מוכנים להתחיל לחסוך?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            הצטרפו ל-10,000+ משפחות שכבר חוסכות
          </p>
          <Button
            size="lg"
            onClick={() => setShowAI(true)}
            className="h-14 px-8 bg-white text-gray-900 hover:bg-gray-100 text-base font-medium"
          >
            התחל שיחה עם העוזר החכם
            <ArrowRight className="h-5 w-5 mr-3" />
          </Button>
        </div>
      </section>

      {/* AI Assistant Dialog */}
      {showAI && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowAI(false)}
        >
          <div 
            className="w-full max-w-2xl h-[70vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
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
