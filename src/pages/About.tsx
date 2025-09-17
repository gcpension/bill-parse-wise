import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, Shield, Award, Zap, TrendingUp, CheckCircle, Heart } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">אודות EasySwitch</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              אנחנו מאמינים שכל משפחה בישראל זכאית לחסוך כסף על החשבונות הבסיסיים שלה.
              <br />
              EasySwitch הוא הפתרון הפשוט והמהיר לחיסכון אמיתי.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          {/* Our Mission */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">המשימה שלנו</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                לעזור למשפחות ישראליות לחסוך אלפי שקלים בשנה על חשבונות החשמל, הסלולר, האינטרנט והטלוויזיה
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Target className="w-16 h-16 mx-auto text-purple-600 mb-4" />
                  <CardTitle className="text-xl text-gray-800">יעד ברור</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    לחסוך למשפחה הישראלית הממוצעת לפחות ₪2,400 בשנה על חשבונות הבית
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="w-16 h-16 mx-auto text-purple-600 mb-4" />
                  <CardTitle className="text-xl text-gray-800">שירות מהימן</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    אנחנו עובדים רק עם ספקים מורשים ומבצעים את כל התהליך בבטחה ושקיפות מלאה
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Zap className="w-16 h-16 mx-auto text-purple-600 mb-4" />
                  <CardTitle className="text-xl text-gray-800">פשוט ומהיר</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    תהליך של 5 דקות בלבד - אתם מזינים את הפרטים ואנחנו דואגים לכל השאר
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Statistics */}
          <section className="mb-16 bg-purple-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">המספרים מדברים בעד עצמם</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">50,000+</div>
                <div className="text-gray-600">משפחות שחסכו</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">₪120M+</div>
                <div className="text-gray-600">סך החיסכון השנתי</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">15</div>
                <div className="text-gray-600">דקות ממוצעות להשוואה</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
                <div className="text-gray-600">שביעות רצון לקוחות</div>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">הסיפור שלנו</h2>
                <div className="space-y-4 text-gray-600">
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
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-8 rounded-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                    <span className="text-gray-800">השוואת מחירים מקיפה</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                    <span className="text-gray-800">ביצוע מעבר מלא</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                    <span className="text-gray-800">שירות לקוחות מעולה</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                    <span className="text-gray-800">שקיפות מלאה בתהליך</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">הערכים שלנו</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Heart className="w-12 h-12 text-purple-600 mb-4" />
                  <CardTitle className="text-xl text-gray-800">אכפתיות אמיתית</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    אנחנו באמת דואגים לחיסכון שלכם ועובדים קשה למצוא לכם את העסקה הטובה ביותר
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Shield className="w-12 h-12 text-purple-600 mb-4" />
                  <CardTitle className="text-xl text-gray-800">שקיפות מוחלטת</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    אין עמלות נסתרות, אין הפתעות - אתם יודעים בדיוק מה קורה בכל שלב
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <TrendingUp className="w-12 h-12 text-purple-600 mb-4" />
                  <CardTitle className="text-xl text-gray-800">חדשנות מתמדת</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    אנחנו כל הזמן משפרים את הפלטפורמה ומוסיפים תכונות שיעזרו לכם לחסוך עוד יותר
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">מוכנים להצטרף למהפכת החיסכון?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              גלו כמה אתם יכולים לחסוך על חשבונות הבית שלכם כבר היום
            </p>
            <Button 
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-xl"
              onClick={() => window.location.href = '/'}
            >
              התחילו לחסוך עכשיו
            </Button>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default About;