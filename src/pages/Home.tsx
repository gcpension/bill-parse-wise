import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Wifi, Smartphone, Tv, Sparkles, TrendingDown, Clock, Shield, CheckCircle2 } from 'lucide-react';
import { QuickStartModal } from '@/components/QuickStartModal';
import { EnhancedNavigation } from '@/components/ui/enhanced-navigation';

const Home = () => {
  const [isQuickStartOpen, setIsQuickStartOpen] = useState(false);

  const categories = [
    { id: 'electricity', name: 'חשמל', icon: Zap },
    { id: 'internet', name: 'אינטרנט', icon: Wifi },
    { id: 'mobile', name: 'סלולר', icon: Smartphone },
    { id: 'tv', name: 'טלוויזיה', icon: Tv }
  ];

  const benefits = [
    { icon: TrendingDown, title: 'חיסכון משמעותי', description: 'עד ₪2,400 בשנה' },
    { icon: Clock, title: 'תהליך מהיר', description: 'תוצאות תוך דקות' },
    { icon: Shield, title: 'בטוח ומאובטח', description: '100% אמין' }
  ];

  const stats = [
    { value: '50,000+', label: 'לקוחות מרוצים' },
    { value: '₪12M+', label: 'חיסכון כולל' },
    { value: '4.9/5', label: 'דירוג ממוצע' }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }} />
      </div>

      <EnhancedNavigation />

      <div className="container mx-auto px-4 py-20 max-w-7xl relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-24 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-primary/10 text-primary animate-scale-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">המשפחה הממוצעת חוסכת ₪2,400 בשנה</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-8 leading-tight">
            חסכו בחשבונות<br />
            <span className="text-primary">הבית שלכם</span>
          </h1>

          <p className="text-2xl md:text-3xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            נמצא עבורכם את המסלולים הזולים ביותר ונבצע את המעבר במקומכם
          </p>

          {/* Main CTA */}
          <Button
            onClick={() => setIsQuickStartOpen(true)}
            size="lg"
            className="h-20 px-20 text-2xl gradient-primary hover:gradient-primary-hover shadow-purple-lg group mb-8 animate-scale-in"
          >
            <Sparkles className="w-6 h-6 ml-3 group-hover:rotate-12 transition-transform" />
            התחילו לחסוך עכשיו
          </Button>

          <p className="text-sm text-muted-foreground">
            ⚡ תוצאות מיידיות • ללא עלות • ללא התחייבות
          </p>
        </section>

        {/* Categories Grid */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              באיזה שירות נתחיל?
            </h2>
            <p className="text-xl text-muted-foreground">
              בחרו קטגוריה ונמצא עבורכם את המסלולים הזולים ביותר
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  onClick={() => setIsQuickStartOpen(true)}
                  className="group cursor-pointer hover-lift hover-glow transition-all duration-300 border-2 hover:border-primary/50 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="h-48 flex flex-col items-center justify-center gap-4 p-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className="text-xl font-bold">{category.name}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card 
                  key={index} 
                  className="glass-card-strong border-2 border-primary/20 hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
                    <p className="text-lg text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-24">
          <Card className="glass-card-strong border-2 border-primary/20 shadow-purple-lg max-w-5xl mx-auto">
            <CardContent className="p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {stats.map((stat, index) => (
                  <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="text-5xl md:text-6xl font-bold text-primary mb-3">
                      {stat.value}
                    </div>
                    <p className="text-lg text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How It Works */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              איך זה עובד?
            </h2>
            <p className="text-xl text-muted-foreground">
              3 שלבים פשוטים לחיסכון מקסימלי
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: '1', title: 'ספרו לנו', description: 'מה הסכום החודשי שלכם היום' },
              { step: '2', title: 'נמצא עבורכם', description: 'את 3 המסלולים הזולים ביותר' },
              { step: '3', title: 'נבצע את המעבר', description: 'אנחנו נדאג לכל השאר' }
            ].map((item, index) => (
              <Card 
                key={index} 
                className="border-2 border-primary/20 hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-lg text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="text-center">
          <Card className="glass-card-strong max-w-4xl mx-auto border-2 border-primary/20 shadow-purple-lg">
            <CardContent className="p-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="w-10 h-10 text-primary animate-pulse-slow" />
                <h2 className="text-5xl font-bold">מוכנים להתחיל?</h2>
              </div>
              <p className="text-2xl text-muted-foreground mb-10">
                הצטרפו ל-50,000+ משפחות שכבר חוסכות
              </p>
              <Button
                onClick={() => setIsQuickStartOpen(true)}
                size="lg"
                className="h-20 px-20 text-2xl gradient-primary hover:gradient-primary-hover shadow-purple group"
              >
                <Sparkles className="w-6 h-6 ml-3 group-hover:rotate-12 transition-transform" />
                גלו את החיסכון שלכם
              </Button>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-8 mt-10 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>ללא עלות</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>מאובטח</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>מהיר</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Quick Start Modal */}
      <QuickStartModal 
        isOpen={isQuickStartOpen} 
        onClose={() => setIsQuickStartOpen(false)} 
      />
    </div>
  );
};

export default Home;
