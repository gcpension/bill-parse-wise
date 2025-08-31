import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Smartphone, 
  Wifi, 
  Tv,
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
import { Layout } from '@/components/Layout';

const features = [
  {
    icon: Calculator,
    title: 'השוואת מחירים חכמה',
    description: 'השווה בין כל הספקים בשוק הישראלי ומצא את החבילה הזולה ביותר',
    color: 'text-primary'
  },
  {
    icon: Upload,
    title: 'סריקת חשבוניות אוטומטית',
    description: 'העלה תמונה של החשבונית והמערכת תזהה אוטומטית את הנתונים',
    color: 'text-success'
  },
  {
    icon: BarChart3,
    title: 'ניתוח והמלצות',
    description: 'קבל המלצות מותאמות אישית לחיסכון מקסימלי',
    color: 'text-primary-glow'
  },
  {
    icon: Shield,
    title: 'בטוח ומהימן',
    description: 'המידע שלך מוגן ולא נשמר במערכת',
    color: 'text-warning-foreground'
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
    color: 'gradient-sunset',
    providers: 12,
    trend: '+15%'
  },
  {
    name: 'סלולר',
    icon: Smartphone,
    description: 'חבילות סלולר זולות עד 60% יותר',
    savings: '₪360-1,440',
    color: 'gradient-electric',
    providers: 15,
    trend: '+8%'
  },
  {
    name: 'אינטרנט',
    icon: Wifi,
    description: 'סיבים אופטיים במחירים מעולים',
    savings: '₪240-720',
    color: 'gradient-vibrant',
    providers: 9,
    trend: '+12%'
  },
  {
    name: 'טלוויזיה וסטרימינג',
    icon: Tv,
    description: 'שירותי סטרימינג וטלוויזיה במחירים מעולים',
    savings: '₪300-900',
    color: 'bg-gradient-to-r from-royal-purple to-coral-pink',
    providers: 8,
    trend: '+25%'
  }
];

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center space-y-12">
            {/* Main Title */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
                פלטפורמת חכמה שתוביא
                <br />
                עבור את המבצעים הטובים
                <br />
                ביותר ומכניסה מעבר חלק
                <br />
                ללא טרחה
              </h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">50K+</div>
                <div className="text-sm text-gray-600">לקוחות מרוצים</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">₪180</div>
                <div className="text-sm text-gray-600">חיסכון ממוצע לחודש</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">48</div>
                <div className="text-sm text-gray-600">שעות לתהליך</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">4.9</div>
                <div className="text-sm text-gray-600">דירוג לקוחות</div>
              </div>
            </div>

            {/* Process Steps */}
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-blue-500 text-white p-6 rounded-2xl text-right">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">בחר כספי</h3>
                    <p className="text-blue-100">בחירה קמדיה קמרה מהירמטיה</p>
                  </div>
                  <div className="bg-white text-blue-500 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">1</div>
                </div>
              </div>
              
              <div className="bg-purple-500 text-white p-6 rounded-2xl text-right">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">השווה מחירים</h3>
                    <p className="text-purple-100">מחירים מכל הספקים</p>
                  </div>
                  <div className="bg-white text-purple-500 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">2</div>
                </div>
              </div>
              
              <div className="bg-green-500 text-white p-6 rounded-2xl text-right">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">עבור וחסוך</h3>
                    <p className="text-green-100">אתחנו נדאג לכל השאר</p>
                  </div>
                  <div className="bg-white text-green-500 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">3</div>
                </div>
              </div>
            </div>

            {/* Working with all providers */}
            <div className="mt-12">
              <p className="text-gray-600 mb-6">עובדים עם כל הספקים הגדולים:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="outline" className="px-4 py-2">פלאפון</Badge>
                <Badge variant="outline" className="px-4 py-2 bg-orange-100 text-orange-600">פארטנר</Badge>
                <Badge variant="outline" className="px-4 py-2 bg-pink-100 text-pink-600">HOT</Badge>
                <Badge variant="outline" className="px-4 py-2 bg-gray-100 text-gray-600">בזק</Badge>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-12">
              <Link to="/analyze">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 text-xl rounded-full shadow-lg hover:shadow-xl transition-all">
                  בדוק כמה אתה יכול לחסוך
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;