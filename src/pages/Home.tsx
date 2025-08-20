import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Smartphone, 
  Wifi, 
  TrendingDown, 
  Shield, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Calculator,
  Upload,
  BarChart3,
  Star,
  Users,
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/utils';

const features = [
  {
    icon: Calculator,
    title: 'השוואת מחירים חכמה',
    description: 'השווה בין כל הספקים בשוק הישראלי ומצא את החבילה הזולה ביותר',
    color: 'text-blue-600'
  },
  {
    icon: Upload,
    title: 'סריקת חשבוניות אוטומטית',
    description: 'העלה תמונה של החשבונית והמערכת תזהה אוטומטית את הנתונים',
    color: 'text-green-600'
  },
  {
    icon: BarChart3,
    title: 'ניתוח והמלצות',
    description: 'קבל המלצות מותאמות אישית לחיסכון מקסימלי',
    color: 'text-purple-600'
  },
  {
    icon: Shield,
    title: 'בטוח ומהימן',
    description: 'המידע שלך מוגן ולא נשמר במערכת',
    color: 'text-orange-600'
  }
];

const stats = [
  { number: '₪2,400', label: 'חיסכון ממוצע בשנה', icon: DollarSign },
  { number: '50,000+', label: 'משפחות חסכו כסף', icon: Users },
  { number: '4.8/5', label: 'דירוג שביעות רצון', icon: Star },
  { number: '15 דק׳', label: 'זמן ממוצע לחיסכון', icon: Clock }
];

const categories = [
  {
    name: 'חשמל',
    icon: Zap,
    description: 'רפורמת החשמל החדשה - חסוך עד 20%',
    savings: '₪500-1,200',
    color: 'from-yellow-500 to-orange-500',
    providers: 7
  },
  {
    name: 'סלולר',
    icon: Smartphone,
    description: 'חבילות סלולר זולות עד 60% יותר',
    savings: '₪360-1,440',
    color: 'from-blue-500 to-purple-500',
    providers: 8
  },
  {
    name: 'אינטרנט',
    icon: Wifi,
    description: 'סיבים אופטיים במחירים מעולים',
    savings: '₪240-720',
    color: 'from-green-500 to-teal-500',
    providers: 6
  }
];

export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12 animate-fade-in">
        <div className="space-y-4">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            💡 חדש! רפורמת החשמל 2024
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="gradient-primary bg-clip-text text-transparent">
              חסוך אלפי שקלים
            </span>
            <br />
            על הוצאות הבית
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            השווה בין כל ספקי החשמל, הסלולר והאינטרנט בישראל. 
            מצא את החבילות הזולות ביותר ותחסוך אלפי שקלים בשנה.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/analyze">
            <Button size="lg" className="text-lg px-8 py-4 shadow-elegant animate-pulse-glow">
              <Calculator className="ml-2 h-5 w-5" />
              התחל לחסוך עכשיו
            </Button>
          </Link>
          <Link to="/compare">
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              <BarChart3 className="ml-2 h-5 w-5" />
              השווה מחירים
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="text-center shadow-card">
              <CardContent className="p-6">
                <div className="p-3 gradient-primary rounded-full w-fit mx-auto mb-4">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Categories Section */}
      <section className="space-y-8 animate-scale-in">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">מה נוכל לחסוך לך?</h2>
          <p className="text-xl text-muted-foreground">
            בחר את הקטגוריה שמעניינת אותך ותראה כמה תוכל לחסוך
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.name;
            
            return (
              <Card 
                key={category.name}
                className={`cursor-pointer transition-all duration-300 hover:shadow-elegant hover:scale-105 ${
                  isSelected ? 'ring-2 ring-primary shadow-glow' : ''
                }`}
                onClick={() => setSelectedCategory(isSelected ? null : category.name)}
              >
                <CardContent className="p-6">
                  <div className={`p-4 bg-gradient-to-br ${category.color} rounded-xl w-fit mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">חיסכון בשנה:</span>
                      <span className="font-bold text-success text-lg">{category.savings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">ספקים זמינים:</span>
                      <span className="font-medium">{category.providers}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                      <Link to={`/compare?category=${category.name.toLowerCase()}`}>
                        <Button className="w-full">
                          השווה ספקים
                          <ArrowRight className="mr-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">איך זה עובד?</h2>
          <p className="text-xl text-muted-foreground">
            4 צעדים פשוטים לחיסכון משמעותי
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="p-4 bg-accent/20 rounded-full w-fit mx-auto mb-4">
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-accent/30 rounded-2xl p-8 space-y-8 animate-scale-in">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">מה הלקוחות אומרים?</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'אילנה כהן',
              location: 'תל אביב',
              savings: '₪2,100',
              quote: 'התגלה שאני משלמת כפול על החשמל! עברתי לספק חדש וחוסכת ₪175 בחודש.'
            },
            {
              name: 'משה לוי',
              location: 'חיפה',
              savings: '₪1,680',
              quote: 'המערכת מצאה לי חבילת סלולר במחצית מהמחיר. פשוט מדהים!'
            },
            {
              name: 'רות אברהם',
              location: 'ירושלים',
              savings: '₪2,800',
              quote: 'בזכותכם החלפתי את כל הספקים וחוסכת אלפי שקלים בשנה.'
            }
          ].map((testimonial, index) => (
            <Card key={index} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  </div>
                  <div className="text-success font-bold text-lg">
                    {testimonial.savings}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-8 py-12 bg-gradient-to-br from-primary/5 to-primary-glow/5 rounded-2xl animate-fade-in">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">מוכן להתחיל לחסוך?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            הצטרף לאלפי משפחות שכבר חוסכות אלפי שקלים בשנה
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/analyze">
            <Button size="lg" className="text-lg px-8 py-4 shadow-elegant">
              <Upload className="ml-2 h-5 w-5" />
              העלה חשבונית עכשיו
            </Button>
          </Link>
          <Link to="/compare">
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              <Calculator className="ml-2 h-5 w-5" />
              חשבון ידני מהיר
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center space-x-6 rtl:space-x-reverse text-sm text-muted-foreground">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>חינם לחלוטין</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>ללא מחויבות</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>תוצאות מיידיות</span>
          </div>
        </div>
      </section>
    </div>
  );
};