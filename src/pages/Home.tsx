import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, Sparkles, ArrowLeft, Check, Zap, Shield, TrendingDown, Clock } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 py-3" 
          : "bg-transparent py-6"
      )}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-110">
                <Sparkles className="text-white h-6 w-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
                EasySwitch
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="/all-plans" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium hover:scale-105 transform duration-200">
                כל המסלולים
              </a>
              <a href="/magazine" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium hover:scale-105 transform duration-200">
                מגזין
              </a>
              <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium hover:scale-105 transform duration-200">
                אודות
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full mb-10 animate-fade-in border border-primary/20">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-foreground">מעל 10,000 משפחות חוסכות כל חודש</span>
            </div>

            {/* Main Heading with gradient */}
            <h1 className="text-6xl lg:text-8xl font-bold mb-8 leading-tight animate-slide-up">
              <span className="block mb-2">חיסכון חכם</span>
              <span className="block bg-gradient-to-l from-primary via-primary-glow to-accent bg-clip-text text-transparent animate-gradient-x bg-300%">
                בקליק אחד
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground mb-14 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              שיחה פשוטה עם AI מתקדם שמנתח את הצרכים שלכם ומוצא את המסלולים 
              הכי משתלמים בחשמל, אינטרנט, סלולר וטלוויזיה
            </p>

            {/* CTA Button - Single, prominent */}
            <div className="mb-20 animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <Button
                size="lg"
                onClick={() => setShowAI(true)}
                className="h-16 px-12 bg-gradient-primary hover:shadow-glow text-white text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-elegant group"
              >
                <Sparkles className="h-6 w-6 ml-3 group-hover:animate-pulse" />
                התחל עכשיו בחינם
                <ArrowLeft className="h-6 w-6 mr-3 group-hover:-translate-x-1 transition-transform" />
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">ללא התחייבות • תוצאות מיידיות</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
              {[
                { icon: TrendingDown, value: '₪2,400', label: 'חיסכון ממוצע בשנה', color: 'success' },
                { icon: Clock, value: '2 דקות', label: 'זמן ממוצע לתוצאות', color: 'primary' },
                { icon: Shield, value: '100%', label: 'מאובטח ומוגן', color: 'accent' }
              ].map((stat, index) => (
                <Card key={index} className="glass-card p-6 hover:shadow-glow transition-all duration-300 hover:-translate-y-2 group cursor-pointer border-primary/20">
                  <stat.icon className={`h-10 w-10 mx-auto mb-4 text-${stat.color} group-hover:scale-110 transition-transform`} />
                  <div className="text-3xl font-bold mb-2 bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
                איך זה עובד?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              תהליך פשוט ומהיר שחוסך לכם זמן וכסף
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: '01',
                icon: MessageSquare,
                title: 'שיחה חכמה',
                description: 'ספרו לנו על הצרכים שלכם דרך צ\'אט פשוט או דיבור',
                gradient: 'from-primary to-primary-glow'
              },
              {
                step: '02',
                icon: Zap,
                title: 'ניתוח מיידי',
                description: 'AI מתקדם מנתח אלפי מסלולים ומוצא את ההתאמה המושלמת',
                gradient: 'from-accent to-primary'
              },
              {
                step: '03',
                icon: Check,
                title: 'חיסכון מיידי',
                description: 'קבלו המלצות מדויקות והתחילו לחסוך מיד',
                gradient: 'from-success to-success-glow'
              }
            ].map((feature, index) => (
              <div key={index} className="relative group">
                <Card className="glass-card p-8 h-full hover:shadow-glow transition-all duration-500 hover:-translate-y-4 border-primary/20">
                  <div className={`absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-glow rotate-12 group-hover:rotate-0 transition-transform duration-500`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-7xl font-bold text-primary/10 mb-4">{feature.step}</div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative py-32 px-6 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full">
                  למה בוחרים בנו?
                </span>
              </div>
              <h2 className="text-5xl font-bold leading-tight">
                <span className="block text-foreground mb-2">המקום שבו</span>
                <span className="bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
                  החיסכון מתחיל
                </span>
              </h2>
              
              <div className="space-y-6">
                {[
                  { icon: Zap, text: 'AI מתקדם שמבין את הצרכים שלך' },
                  { icon: Shield, text: 'אבטחה מלאה ושמירה על פרטיות' },
                  { icon: TrendingDown, text: 'חיסכון ממוצע של ₪2,400 בשנה' },
                  { icon: Clock, text: 'תוצאות תוך שניות ספורות' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-colorful group-hover:scale-110 transition-transform">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-lg font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={() => navigate('/all-plans')}
                variant="outline"
                className="h-14 px-8 border-2 hover:bg-accent/5 text-base font-semibold rounded-xl group"
              >
                צפה בכל המסלולים
                <ArrowLeft className="h-5 w-5 mr-3 group-hover:-translate-x-1 transition-transform" />
              </Button>
            </div>

            <Card className="glass-card p-10 border-primary/20 shadow-elegant">
              <div className="text-center mb-8">
                <div className="text-7xl font-bold bg-gradient-to-l from-success to-success-glow bg-clip-text text-transparent mb-3">
                  ₪2,400
                </div>
                <p className="text-xl text-muted-foreground">חיסכון ממוצע בשנה</p>
              </div>
              
              <div className="space-y-4">
                {[
                  { category: 'חשמל', amount: '₪600', color: 'from-[#FFB800] to-[#FFA000]' },
                  { category: 'סלולר', amount: '₪800', color: 'from-primary to-primary-glow' },
                  { category: 'אינטרנט', amount: '₪600', color: 'from-accent to-primary' },
                  { category: 'טלוויזיה', amount: '₪400', color: 'from-success to-success-glow' }
                ].map((item, index) => (
                  <div key={index} className="glass-card p-5 rounded-xl hover:shadow-glow transition-all duration-300 group cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`}></div>
                        <span className="font-medium text-foreground">{item.category}</span>
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                        {item.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setShowAI(true)}
                className="w-full mt-8 h-14 bg-gradient-primary hover:shadow-glow text-white text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 group"
              >
                <Sparkles className="h-5 w-5 ml-2 group-hover:animate-pulse" />
                התחל לחסוך עכשיו
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-10"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary) / 0.1) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <h2 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="block text-foreground mb-2">מוכנים</span>
            <span className="bg-gradient-to-l from-primary via-primary-glow to-accent bg-clip-text text-transparent animate-gradient-x bg-300%">
              להתחיל לחסוך?
            </span>
          </h2>
          
          <p className="text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            הצטרפו ל-10,000+ משפחות שכבר חוסכות
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => setShowAI(true)}
              className="h-16 px-12 bg-gradient-primary hover:shadow-glow text-white text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-110 shadow-elegant group"
            >
              <Sparkles className="h-6 w-6 ml-3 group-hover:animate-pulse" />
              בואו נתחיל
              <ArrowLeft className="h-6 w-6 mr-3 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-success" />
              <span>ללא עלות</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-success" />
              <span>ללא התחייבות</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-success" />
              <span>תוצאות מיידיות</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Dialog */}
      {showAI && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
          style={{ 
            background: 'linear-gradient(135deg, rgba(96, 192, 232, 0.1) 0%, rgba(166, 67, 235, 0.1) 100%)',
            backdropFilter: 'blur(20px)'
          }}
          onClick={() => setShowAI(false)}
        >
          <div 
            className="relative w-full max-w-4xl h-[85vh] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAI(false)}
              className="absolute -top-4 -left-4 w-14 h-14 bg-gradient-primary rounded-full shadow-glow flex items-center justify-center hover:scale-110 hover:rotate-90 transition-all duration-300 z-10"
            >
              <span className="text-white text-3xl font-light">×</span>
            </button>
            <AIAssistant plans={allPlans} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
