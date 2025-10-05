import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Shield, Award, Zap, TrendingUp, CheckCircle, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const About = () => {
  const navigate = useNavigate();
  const { isVisible: heroVisible, elementRef: heroRef } = useScrollAnimation();
  const { isVisible: missionVisible, elementRef: missionRef } = useScrollAnimation();
  const { isVisible: statsVisible, elementRef: statsRef } = useScrollAnimation();

  return (
    <Layout>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div 
            ref={heroRef}
            className={`container mx-auto px-4 text-center relative z-10 transition-all duration-1000 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <h1 className="text-5xl md:text-6xl font-bold gradient-primary bg-clip-text text-transparent">
                אודות EasySwitch
              </h1>
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              אנחנו מאמינים שכל משפחה בישראל זכאית לחסוך כסף על החשבונות הבסיסיים שלה.
              <br />
              <span className="font-semibold text-primary">EasySwitch</span> הוא הפתרון הפשוט והמהיר לחיסכון אמיתי.
            </p>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-lg px-6 py-2 hover-glow">
              מובילים בחדשנות פיננסית ב-2025
            </Badge>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          {/* Our Mission */}
          <section 
            ref={missionRef}
            className={`mb-16 transition-all duration-1000 ${
              missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-6">המשימה שלנו</h2>
              <div className="w-24 h-1 gradient-primary mx-auto mb-6 rounded-full"></div>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                לעזור למשפחות ישראליות לחסוך אלפי שקלים בשנה על חשבונות החשמל, הסלולר, האינטרנט והטלוויזיה
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="group text-center glass-card-strong hover-lift hover-glow border-0 shadow-lg">
                <CardHeader>
                  <div className="relative mb-4">
                    <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-12 h-12 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">יעד ברור</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    לחסוך למשפחה הישראלית הממוצעת לפחות <span className="font-bold text-primary">₪2,400 בשנה</span> על חשבונות הבית
                  </p>
                </CardContent>
              </Card>

              <Card className="group text-center glass-card-strong hover-lift hover-glow border-0 shadow-lg">
                <CardHeader>
                  <div className="relative mb-4">
                    <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-12 h-12 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-purple">
                      <CheckCircle className="w-3 h-3 text-primary-foreground" />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">שירות מהימן</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    אנחנו עובדים רק עם ספקים מורשים ומבצעים את כל התהליך בבטחה ו<span className="font-bold text-primary">שקיפות מלאה</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="group text-center glass-card-strong hover-lift hover-glow border-0 shadow-lg">
                <CardHeader>
                  <div className="relative mb-4">
                    <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-12 h-12 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">פשוט ומהיר</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    תהליך של <span className="font-bold text-primary">5 דקות בלבד</span> - אתם מזינים את הפרטים ואנחנו דואגים לכל השאר
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Statistics */}
          <section 
            ref={statsRef}
            className={`mb-16 glass-card-strong rounded-3xl p-12 shadow-purple-lg transition-all duration-1000 ${
              statsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">המספרים מדברים בעד עצמם</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">50,000+</div>
                <div className="text-muted-foreground font-medium">משפחות שחסכו</div>
                <div className="w-12 h-1 gradient-primary mx-auto mt-2 group-hover:w-16 transition-all duration-300 rounded-full"></div>
              </div>
              <div className="group">
                <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">₪120M+</div>
                <div className="text-muted-foreground font-medium">סך החיסכון השנתי</div>
                <div className="w-12 h-1 gradient-primary mx-auto mt-2 group-hover:w-16 transition-all duration-300 rounded-full"></div>
              </div>
              <div className="group">
                <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">15</div>
                <div className="text-muted-foreground font-medium">דקות ממוצעות להשוואה</div>
                <div className="w-12 h-1 gradient-primary mx-auto mt-2 group-hover:w-16 transition-all duration-300 rounded-full"></div>
              </div>
              <div className="group">
                <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">98%</div>
                <div className="text-muted-foreground font-medium">שביעות רצון לקוחות</div>
                <div className="w-12 h-1 gradient-primary mx-auto mt-2 group-hover:w-16 transition-all duration-300 rounded-full"></div>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">הסיפור שלנו</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    EasySwitch נוסד בשנת 2023 מתוך הבנה פשוטה - משפחות ישראליות משלמות יותר מדי 
                    על שירותים בסיסיים כמו חשמל, טלפון ואינטרנט.
                  </p>
                  <p>
                    המייסדים שלנו, שחוו בעצמם את הקושי בהשוואת מחירים ומעבר בין ספקים, 
                    החליטו ליצור פלטפורמה שתעשה את העבודה הקשה במקומכם.
                  </p>
                  <p>
                    היום אנחנו גאים להיות הפלטפורמה המובילה בישראל לחיסכון על חשבונות הבית,
                    עם עשרות אלפי לקוחות מרוצים ומיליוני שקלים בחיסכון שנתי.
                  </p>
                </div>
              </div>
              <div className="glass-card-strong p-8 rounded-2xl shadow-purple-lg">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-primary" />
                    <span className="text-foreground font-medium">השוואת מחירים מקיפה</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-primary" />
                    <span className="text-foreground font-medium">ביצוע מעבר מלא</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-primary" />
                    <span className="text-foreground font-medium">שירות לקוחות מעולה</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-primary" />
                    <span className="text-foreground font-medium">שקיפות מלאה בתהליך</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">הערכים שלנו</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="glass-card-strong hover-lift hover-glow border-0 shadow-lg">
                <CardHeader>
                  <Heart className="w-12 h-12 text-primary mb-4" />
                  <CardTitle className="text-xl text-foreground">אכפתיות אמיתית</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    אנחנו באמת דואגים לחיסכון שלכם ועובדים קשה למצוא לכם את העסקה הטובה ביותר
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card-strong hover-lift hover-glow border-0 shadow-lg">
                <CardHeader>
                  <Shield className="w-12 h-12 text-primary mb-4" />
                  <CardTitle className="text-xl text-foreground">שקיפות מוחלטת</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    אין עמלות נסתרות, אין הפתעות - אתם יודעים בדיוק מה קורה בכל שלב
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card-strong hover-lift hover-glow border-0 shadow-lg">
                <CardHeader>
                  <TrendingUp className="w-12 h-12 text-primary mb-4" />
                  <CardTitle className="text-xl text-foreground">חדשנות מתמדת</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    אנחנו כל הזמן משפרים את הפלטפורמה ומוסיפים תכונות שיעזרו לכם לחסוך עוד יותר
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center glass-card-strong rounded-2xl p-12 shadow-purple-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <h2 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">מוכנים להצטרף למהפכת החיסכון?</h2>
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              גלו כמה אתם יכולים לחסוך על חשבונות הבית שלכם כבר היום
            </p>
            <Button 
              className="gradient-primary hover:gradient-primary-hover text-primary-foreground font-bold text-lg px-8 py-4 rounded-xl shadow-purple hover-lift group"
              onClick={() => navigate('/')}
            >
              התחילו לחסוך עכשיו
              <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default About;