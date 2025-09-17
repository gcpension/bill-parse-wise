import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProviderSwitchingForm } from '@/components/ProviderSwitchingForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Smartphone, 
  Wifi,
  User,
  Building
} from 'lucide-react';
import { Link } from 'react-router-dom';

const categoryNames = {
  electricity: 'חשמל',
  cellular: 'סלולר', 
  internet: 'אינטרנט'
};

const categoryIcons = {
  electricity: Zap,
  cellular: Smartphone,
  internet: Wifi
};

const customerTypeNames = {
  private: 'לקוח פרטי',
  business: 'לקוח עסקי'
};

const customerTypeIcons = {
  private: User,
  business: Building
};

export const ProviderSwitch = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const customerType = searchParams.get('customerType') as 'private' | 'business';
  const providerId = searchParams.get('providerId');
  const planId = searchParams.get('planId');
  
  const [showForm, setShowForm] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Validate category
  if (!category || !['electricity', 'cellular', 'internet'].includes(category)) {
    return (
      <Layout>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">קטגוריה לא חוקית</h1>
          <p className="text-muted-foreground">הקטגוריה שבחרת אינה קיימת.</p>
          <Link to="/">
            <Button>חזור לעמוד הבית</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Validate customer type
  if (!customerType || !['private', 'business'].includes(customerType)) {
    return (
      <Layout>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">סוג לקוח לא חוקי</h1>
          <p className="text-muted-foreground">סוג הלקוח שבחרת אינו חוקי.</p>
          <Link to="/">
            <Button>חזור לעמוד הבית</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
  const CustomerIcon = customerTypeIcons[customerType];

  const handleFormComplete = () => {
    setIsCompleted(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  if (isCompleted) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="p-8 bg-gradient-to-r from-success/10 to-green-50 dark:to-green-900/20 rounded-2xl">
            <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-success mb-4">
              הבקשה נשלחה בהצלחה!
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              בקשת המעבר שלך נשלחה לספק החדש. נציג הספק יצור איתך קשר תוך 24-48 שעות לאישור הפרטים ותיאום המעבר.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg">
                <h3 className="font-semibold mb-2">מה יקרה עכשיו?</h3>
                <ul className="text-sm text-muted-foreground space-y-2 text-right">
                  <li>• נציג הספק יצור איתך קשר לאישור הפרטים</li>
                  <li>• הספק החדש יטפל בביטול השירות הקודם</li>
                  <li>• תקבל אישור על המעבר ופרטי החיבור החדשים</li>
                  <li>• השירות החדש יופעל בתאריך שתיאמת</li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/all-plans">
                  <Button variant="outline">ראה כל המסלולים</Button>
                </Link>
                <Link to="/">
                  <Button>חזור לעמוד הבית</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (showForm) {
    return (
      <Layout>
        <ProviderSwitchingForm
          category={category as 'electricity' | 'cellular' | 'internet'}
          customerType={customerType}
          targetProvider={providerId ? { id: providerId, planId } : undefined}
          onComplete={handleFormComplete}
          onCancel={handleCancel}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
            <div className="p-3 bg-primary rounded-lg">
              <CategoryIcon className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <CustomerIcon className="h-8 w-8 text-secondary-foreground" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight">
            מעבר ספק {categoryNames[category as keyof typeof categoryNames]}
          </h1>
          
          <p className="text-xl text-muted-foreground">
            {customerTypeNames[customerType]} - תהליך מעבר מלא בליווי מקצועי
          </p>
          
          <div className="flex justify-center">
            <Badge variant="outline" className="text-base px-4 py-2">
              תהליך מאובטח ומוגן
            </Badge>
          </div>
        </div>

        {/* Process Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">איך התהליך עובד?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">מילוי פרטים</h3>
                <p className="text-sm text-muted-foreground">
                  מלא את הפרטים האישיים והעלה מסמכים נדרשים
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">אימות ואישור</h3>
                <p className="text-sm text-muted-foreground">
                  אמת את הזהות וחתום דיגיטלית על המסמכים
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="p-4 bg-success/10 rounded-full w-fit mx-auto">
                  <Zap className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-semibold">מעבר אוטומטי</h3>
                <p className="text-sm text-muted-foreground">
                  אנחנו נטפל בכל התהליך מולהספקים בשמך
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary-glow/5">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4 text-center">למה לבחור בנו?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'ליווי מקצועי לאורך כל התהליך',
                'חיסכון בזמן ובמאמץ',
                'אבטחת מידע מקסימלית',
                'תמיכה טכנית 24/7',
                'שירות ללא עלות נוספת',
                'ביטול הספק הקודם בשבילך'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200">
                הודעה חשובה לאבטחת מידע
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                כל המידע שתשתף איתנו מוצפן ומאובטח. אנחנו לא שומרים פרטי אשראי או חשבון בנק, 
                ונשתמש במידע אך ורק לצורך ביצוע המעבר המבוקש.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-6">
          <Button 
            size="lg"
            onClick={() => setShowForm(true)}
            className="text-lg px-8 py-4 shadow-elegant"
          >
            התחל תהליך המעבר
            <ArrowRight className="mr-2 h-5 w-5" />
          </Button>
          
          <p className="text-sm text-muted-foreground">
            התהליך לוקח כ-10 דקות ויחסוך לך שעות של טיפול בבירוקרטיה
          </p>
        </div>
      </div>
    </Layout>
  );
};