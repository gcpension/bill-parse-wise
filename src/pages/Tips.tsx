import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb, 
  DollarSign, 
  TrendingDown, 
  Shield, 
  Clock,
  Zap,
  Smartphone,
  Wifi,
  Tv,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Star,
  Target,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Tips = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const { isVisible: heroVisible, elementRef: heroRef } = useScrollAnimation();
  const { isVisible: statsVisible, elementRef: statsRef } = useScrollAnimation();

  const tipCategories = [
    { id: 'electricity', name: 'חשמל', icon: Zap, color: 'yellow' },
    { id: 'cellular', name: 'סלולר', icon: Smartphone, color: 'purple' },
    { id: 'internet', name: 'אינטרנט', icon: Wifi, color: 'blue' },
    { id: 'tv', name: 'טלוויזיה', icon: Tv, color: 'orange' },
    { id: 'general', name: 'כללי', icon: Target, color: 'green' }
  ];

  const tips = {
    electricity: [
      {
        title: "החלף נורות ל-LED",
        description: "נורות LED צורכות עד 75% פחות חשמל מנורות רגילות ומחזיקות עד 25 שנים",
        savings: "₪200-500 בשנה",
        difficulty: "easy",
        timeToImplement: "30 דקות",
        icon: Lightbulb
      },
      {
        title: "כבה מכשירים במצב המתנה",
        description: "מכשירים במצב standby צורכים עד 10% מסך צריכת החשמל הביתית",
        savings: "₪150-300 בשנה", 
        difficulty: "easy",
        timeToImplement: "מיידי",
        icon: Zap
      },
      {
        title: "התקן טיימר למים חמים",
        description: "חמם מים רק כשצריך - דוד חשמלי הוא אחד הצרכנים הגדולים בבית",
        savings: "₪300-600 בשנה",
        difficulty: "medium", 
        timeToImplement: "2-3 שעות",
        icon: Clock
      },
      {
        title: "שדרג למזגן חסכוני",
        description: "מזגן חדש עם דירוג אנרגיה A+ יחסוך עד 30% מהצריכה",
        savings: "₪400-800 בשנה",
        difficulty: "hard",
        timeToImplement: "יום עבודה",
        icon: TrendingDown
      }
    ],
    cellular: [
      {
        title: "בדוק את צריכת הדאטה שלך",
        description: "רוב האנשים משלמים על דאטא שלא משתמשים בו. בדוק את הצריכה הממוצעת שלך",
        savings: "₪30-80 בחודש",
        difficulty: "easy",
        timeToImplement: "10 דקות",
        icon: Smartphone
      },
      {
        title: "השתמש ב-WiFi במקום דאטא",
        description: "חבר לרשתות WiFi בבית, בעבודה ובמקומות ציבוריים לחיסכון בדאטא",
        savings: "₪20-50 בחודש",
        difficulty: "easy",
        timeToImplement: "מיידי",
        icon: Wifi
      },
      {
        title: "שקול מעבר לחבילה משפחתית",
        description: "משפחות עם 3+ קווים יכולות לחסוך משמעותית עם חבילות משפחתיות",
        savings: "₪100-300 בחודש",
        difficulty: "medium",
        timeToImplement: "שעה",
        icon: Shield
      }
    ],
    internet: [
      {
        title: "בדוק את מהירות האינטרנט שלך",
        description: "אולי אתה משלם על מהירות שלא צריך. בדוק מה המהירות בפועל שאתה צריך",
        savings: "₪30-70 בחודש", 
        difficulty: "easy",
        timeToImplement: "15 דקות",
        icon: Wifi
      },
      {
        title: "שדרג את הנתב",
        description: "נתב ישן יכול להאט את המהירות ולגרום לך לשלם על מהירות גבוהה יותר",
        savings: "₪20-50 בחודש",
        difficulty: "medium",
        timeToImplement: "שעה",
        icon: Shield
      }
    ],
    tv: [
      {
        title: "בדוק איזה ערוצים אתה באמת צופה",
        description: "רוב האנשים צופים רק ב-20% מהערוצים שהם משלמים עליהם",
        savings: "₪40-100 בחודש",
        difficulty: "easy", 
        timeToImplement: "שבוע מעקב",
        icon: Tv
      },
      {
        title: "שקול מעבר לסטרימינג בלבד",
        description: "נטפליקס + 2-3 שירותי סטרימינג עולים פחות מחבילת טלוויזיה מלאה",
        savings: "₪50-150 בחודש",
        difficulty: "medium",
        timeToImplement: "יום",
        icon: DollarSign
      }
    ],
    general: [
      {
        title: "עשה השוואת מחירים פעם בשנה",
        description: "המחירים משתנים כל הזמן. השוואה שנתית יכולה לחסוך אלפי שקלים",
        savings: "₪500-2000 בשנה",
        difficulty: "easy",
        timeToImplement: "2-3 שעות",
        icon: Calculator
      },
      {
        title: "בדוק חבילות משולבות",
        description: "לפעמים חבילה משולבת (חשמל+אינטרנט+סלולר) יותר זולה מחבילות נפרדות",
        savings: "₪100-300 בחודש",
        difficulty: "medium", 
        timeToImplement: "יום",
        icon: Target
      },
      {
        title: "קרא את השטר הקטן",
        description: "התבונן בעלויות נוספות, תקופות התחייבות ותנאי ביטול לפני חתימה",
        savings: "חיסכון בהפתעות",
        difficulty: "medium",
        timeToImplement: "30 דקות",
        icon: Shield
      }
    ]
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <Badge className="bg-green-100 text-green-700">קל</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700">בינוני</Badge>;
      case 'hard':
        return <Badge className="bg-red-100 text-red-700">מתקדם</Badge>;
      default:
        return null;
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'hard':
        return <Star className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-accent text-primary-foreground py-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid-16"></div>
          <div 
            ref={heroRef}
            className={`container mx-auto px-4 text-center relative z-10 transition-all duration-1000 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Lightbulb className="w-8 h-8 text-accent-foreground animate-pulse" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-accent-foreground bg-clip-text text-transparent">
                טיפים לחיסכון חכם
              </h1>
              <Sparkles className="w-8 h-8 text-accent-foreground animate-pulse" />
            </div>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              טיפים מעשיים שיעזרו לכם לחסוך כסף על חשבונות הבית
              <br />
              <span className="font-semibold text-accent-foreground">מהפשוטים שאפשר ליישם מיד ועד לשיפורים מתקדמים יותר</span>
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          {/* Quick Stats */}
          <section 
            ref={statsRef}
            className={`mb-16 transition-all duration-1000 ${
              statsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">₪2,400</div>
                  <div className="text-sm text-gray-600">חיסכון ממוצע בשנה</div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">15 דק׳</div>
                  <div className="text-sm text-gray-600">זמן ממוצע ליישום</div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">20+</div>
                  <div className="text-sm text-gray-600">טיפים מעשיים</div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <div className="text-sm text-gray-600">הצלחה ביישום</div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Tips by Category */}
          <Tabs defaultValue="electricity" className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">טיפים לפי קטגוריה</h2>
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-5 mb-8">
                {tipCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{category.name}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {Object.entries(tips).map(([categoryId, categoryTips]) => (
              <TabsContent key={categoryId} value={categoryId}>
                <div className="grid md:grid-cols-2 gap-6">
                  {categoryTips.map((tip, index) => {
                    const TipIcon = tip.icon;
                    return (
                      <Card key={index} className="hover:shadow-lg transition-all duration-300 group">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                <TipIcon className="w-6 h-6 text-green-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg group-hover:text-green-600 transition-colors">
                                  {tip.title}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-2">
                                  {getDifficultyBadge(tip.difficulty)}
                                  <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    {tip.timeToImplement}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {getDifficultyIcon(tip.difficulty)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">
                            {tip.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {tip.savings}
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="hover:bg-green-50 hover:text-green-600"
                            >
                              יישם עכשיו
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* CTA Section */}
          <section className="mt-16 text-center bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">רוצים לחסוך עוד יותר?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              השתמשו בפלטפורמה שלנו למציאת העסקאות הטובות ביותר בשוק
            </p>
            <Button 
              className="group bg-white text-primary hover:bg-gray-100 hover:scale-105 font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300"
              onClick={() => navigate('/')}
            >
              התחילו השוואה עכשיו
              <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Tips;