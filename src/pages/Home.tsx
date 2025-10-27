import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, ArrowLeft, Check, Zap, Shield, TrendingDown, Clock, Users, Award, ChevronDown, Play, Star, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { usePageMeta } from '@/hooks/usePageMeta';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { useAllPlans } from '@/hooks/useAllPlans';

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const allPlans = useAllPlans();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  usePageMeta({
    title: 'EasySwitch - עוזר AI חכם למציאת המסלולים הטובים ביותר',
    description: 'דברו עם העוזר החכם שלנו וקבלו המלצות מותאמות אישית לחסכון בחשמל, אינטרנט, סלולר וטלוויזיה',
    keywords: ['AI', 'עוזר חכם', 'חיסכון', 'חשמל', 'אינטרנט', 'סלולר', 'טלוויזיה']
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Gradient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-30 transition-all duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.15), transparent 50%)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-primary-glow/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Ultra Modern Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "bg-background/95 backdrop-blur-2xl border-b border-border/40 shadow-elegant" 
          : "bg-transparent"
      )}>
        <div className="container mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-l from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                EasySwitch
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/all-plans')}
                className="text-base font-medium hover:text-primary transition-colors"
              >
                תוכניות
              </Button>
              <Button 
                variant="ghost"
                onClick={() => navigate('/about')}
                className="text-base font-medium hover:text-primary transition-colors"
              >
                אודות
              </Button>
              <Button
                onClick={() => setShowAI(true)}
                className="relative overflow-hidden bg-gradient-primary text-white px-8 py-6 rounded-2xl font-bold text-base shadow-glow hover:shadow-elegant transition-all duration-300 hover:scale-105 group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  התחל עכשיו
                </span>
                <div className="absolute inset-0 bg-gradient-to-l from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Revolutionary Hero Section */}
      <section ref={heroRef} className="relative pt-40 pb-32 px-8 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full border border-primary/20 animate-fade-in">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-foreground">פלטפורמת החיסכון המובילה בישראל</span>
              <Award className="h-4 w-4 text-primary" />
            </div>

            {/* Main Headline */}
            <h1 className="text-7xl md:text-8xl font-black leading-tight animate-slide-up">
              <span className="block bg-gradient-to-l from-primary via-primary-glow to-accent bg-clip-text text-transparent mb-4">
                חסכו עד 40%
              </span>
              <span className="block text-foreground text-5xl md:text-6xl font-bold mt-6">
                על חשבונות החשמל, הסלולר והאינטרנט
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium animate-fade-in" style={{ animationDelay: '0.2s' }}>
              מערכת חכמה שמשווה עבורכם אלפי תוכניות ומוצאת את העסקה הכי משתלמת - תוך דקות
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button
                onClick={() => setShowAI(true)}
                size="lg"
                className="relative group overflow-hidden bg-gradient-primary text-white px-12 py-8 rounded-3xl text-xl font-bold shadow-glow hover:shadow-elegant transition-all duration-500 hover:scale-105 border-2 border-primary/20"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Sparkles className="h-6 w-6 animate-pulse" />
                  התחילו לחסוך עכשיו
                  <ChevronDown className="h-5 w-5 animate-bounce-gentle" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-l from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>
              
              <Button
                onClick={() => navigate('/all-plans')}
                size="lg"
                variant="outline"
                className="px-10 py-8 rounded-3xl text-lg font-semibold border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-105 group"
              >
                <span className="flex items-center gap-2">
                  <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  צפו בתוכניות
                </span>
              </Button>
            </div>

            {/* Social Proof Stats */}
            <div className="grid grid-cols-3 gap-8 pt-16 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
              {[
                { icon: Users, value: '50,000+', label: 'משתמשים מרוצים' },
                { icon: TrendingDown, value: '₪2.5M', label: 'נחסכו השנה' },
                { icon: Star, value: '4.9', label: 'דירוג ממוצע' }
              ].map((stat, i) => (
                <div key={i} className="glass-card p-6 rounded-3xl border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-105 group">
                  <stat.icon className="h-10 w-10 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-black bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-gentle">
          <ChevronDown className="h-8 w-8 text-primary" />
        </div>
      </section>

      {/* Revolutionary Process Section */}
      <section className="py-32 px-8 relative">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 glass-card px-5 py-2 rounded-full border border-primary/20 mb-4">
              <Zap className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-bold text-primary">תהליך פשוט ומהיר</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black">
              <span className="bg-gradient-to-l from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                איך זה עובד?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              שלושה שלבים פשוטים להתחלת החיסכון שלכם
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                icon: MessageSquare,
                step: '01',
                title: 'שתפו פרטים',
                description: 'ספרו לנו על השירותים הנוכחיים שלכם והעדפותיכם - זה לוקח רק דקה',
                color: 'from-primary to-primary-glow'
              },
              {
                icon: Zap,
                step: '02',
                title: 'ניתוח חכם',
                description: 'המערכת שלנו משווה אלפי תוכניות בזמן אמת ומוצאת את העסקאות הכי משתלמות',
                color: 'from-accent to-primary'
              },
              {
                icon: Check,
                step: '03',
                title: 'התחילו לחסוך',
                description: 'בחרו בתוכנית המושלמת עבורכם והתחילו לחסוך כסף מיד',
                color: 'from-primary-glow to-accent'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="relative group animate-fade-in"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {/* Connection Line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-24 left-full w-full h-1 bg-gradient-to-r from-primary/30 to-transparent -translate-y-1/2 z-0" />
                )}
                
                <div className="relative glass-card p-10 rounded-3xl border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-glow">
                  {/* Step Number */}
                  <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow text-white font-black text-xl rotate-12 group-hover:rotate-0 transition-transform duration-300">
                    {feature.step}
                  </div>

                  {/* Icon */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Trust Section */}
      <section className="py-32 px-8 relative bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Left: Benefits */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full border border-primary/20">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-primary">למה לבחור בנו?</span>
                </div>
                <h2 className="text-5xl font-black leading-tight">
                  <span className="bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
                    החיסכון שלכם
                  </span>
                  <br />
                  <span className="text-foreground">בידיים הכי טובות</span>
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  { icon: Zap, title: 'מהיר וקל', desc: 'תהליך של דקות בלבד, ללא טפסים מסובכים' },
                  { icon: Shield, title: 'מאובטח ואמין', desc: 'המידע שלכם מוגן ברמה הגבוהה ביותר' },
                  { icon: TrendingDown, title: 'חיסכון מובטח', desc: 'ממוצע של 35% חיסכון על כל שירות' },
                  { icon: Clock, title: 'זמינות 24/7', desc: 'השירות זמין בכל זמן שנוח לכם' }
                ].map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 glass-card p-6 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow group-hover:scale-110 transition-transform">
                      <benefit.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Stats Card */}
            <div className="glass-card p-12 rounded-3xl border border-primary/20 shadow-elegant hover:shadow-glow transition-all duration-500">
              <div className="text-center space-y-8">
                <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-glow animate-pulse-glow">
                  <TrendingDown className="h-12 w-12 text-white" />
                </div>
                
                <div>
                  <div className="text-6xl font-black bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent mb-4">
                    ₪2.5M
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-2">נחסכו לחברינו השנה</div>
                  <div className="text-muted-foreground text-lg">וזה רק ההתחלה</div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-border/50">
                  <div className="space-y-2">
                    <div className="text-3xl font-black text-primary">35%</div>
                    <div className="text-sm text-muted-foreground">חיסכון ממוצע</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-black text-accent">2 דק׳</div>
                    <div className="text-sm text-muted-foreground">זמן ממוצע</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Powerful Final CTA */}
      <section className="py-32 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary) / 0.1) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto glass-card p-16 rounded-[3rem] border-2 border-primary/20 shadow-elegant hover:shadow-glow transition-all duration-500">
            <div className="text-center space-y-10">
              <div className="space-y-6">
                <h2 className="text-5xl md:text-6xl font-black leading-tight">
                  <span className="bg-gradient-to-l from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                    מוכנים להתחיל לחסוך?
                  </span>
                </h2>
                <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
                  הצטרפו ל-50,000+ ישראלים שכבר חוסכים אלפי שקלים בשנה
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button
                  onClick={() => setShowAI(true)}
                  size="lg"
                  className="relative group overflow-hidden bg-gradient-primary text-white px-14 py-8 rounded-3xl text-xl font-bold shadow-glow hover:shadow-elegant transition-all duration-500 hover:scale-110"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Sparkles className="h-6 w-6 animate-pulse" />
                    בואו נתחיל!
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-l from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-12 pt-8 border-t border-border/50">
                {[
                  { icon: Check, text: 'ללא התחייבות' },
                  { icon: Check, text: 'חינם לחלוטין' },
                  { icon: Check, text: 'תוצאות מיידיות' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-success" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary AI Modal */}
      {showAI && (
        <div className="fixed inset-0 bg-background/98 backdrop-blur-2xl z-50 flex items-center justify-center p-8 animate-fade-in">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="relative w-full max-w-5xl h-[90vh] animate-scale-in">
            <Button
              onClick={() => setShowAI(false)}
              variant="ghost"
              size="icon"
              className="absolute -top-4 -left-4 z-10 w-12 h-12 rounded-full bg-background/90 backdrop-blur-xl border-2 border-border hover:border-destructive hover:bg-destructive/10 shadow-elegant transition-all duration-300 hover:scale-110 group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </Button>
            <AIAssistant plans={allPlans} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;