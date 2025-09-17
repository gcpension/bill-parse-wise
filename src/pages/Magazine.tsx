import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, User, Search, TrendingUp, Zap, Smartphone, Wifi, Tv, DollarSign, Shield, Target, BookOpen, Star } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Magazine = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { isVisible: heroVisible, elementRef: heroRef } = useScrollAnimation();
  const { isVisible: articlesVisible, elementRef: articlesRef } = useScrollAnimation();

  const categories = [
    { id: 'all', name: 'הכל', icon: TrendingUp },
    { id: 'electricity', name: 'חשמל', icon: Zap },
    { id: 'cellular', name: 'סלולר', icon: Smartphone },
    { id: 'internet', name: 'אינטרנט', icon: Wifi },
    { id: 'tv', name: 'טלוויזיה', icon: Tv },
    { id: 'tips', name: 'טיפים', icon: Target },
    { id: 'savings', name: 'חיסכון', icon: DollarSign }
  ];

  const articles = [
    {
      id: 1,
      title: "5 טיפים לחיסכון משמעותי על חשבון החשמל ב-2024",
      excerpt: "גלו איך לחסוך עד 30% על חשבון החשמל החודשי שלכם עם הטיפים החדשים ביותר מהשוק",
      category: 'electricity',
      author: "צוות EasySwitch",
      date: "15 בינואר 2024",
      readTime: "5 דקות קריאה",
      featured: true,
      image: "/api/placeholder/400/200"
    },
    {
      id: 2,
      title: "המדריך המלא למעבר ספק סלולר ללא כאב ראש",
      excerpt: "כל מה שצריך לדעת על מעבר ספק סלולר: מתי כדאי לעבור, איך לבחור ספק חדש ואיך לא לאבד את המספר",
      category: 'cellular',
      author: "רונית כהן",
      date: "12 בינואר 2024", 
      readTime: "7 דקות קריאה",
      featured: false,
      image: "/api/placeholder/400/200"
    },
    {
      id: 3,
      title: "מה עדיף: חבילות נפרדות או חבילה משולבת?",
      excerpt: "השוואה מעמיקה בין חבילות משולבות לחבילות נפרדות - מה באמת יותר כדאי למשפחה הישראלית?",
      category: 'tips',
      author: "דני לוי",
      date: "10 בינואר 2024",
      readTime: "6 דקות קריאה", 
      featured: true,
      image: "/api/placeholder/400/200"
    },
    {
      id: 4,
      title: "מהפכת האינטרנט הביתי: כל מה שחדש ב-2024",
      excerpt: "טכנולוגיות חדשות, מהירויות מטורפות ומחירים משתנים - המדריך המלא לאינטרנט ביתי",
      category: 'internet',
      author: "אור אברהם",
      date: "8 בינואר 2024",
      readTime: "8 דקות קריאה",
      featured: false,
      image: "/api/placeholder/400/200"
    },
    {
      id: 5,
      title: "נטפליקס, יס או הוט? השוואת פלטפורמות הסטרימינג",
      excerpt: "מה כדאי יותר ב-2024? השוואה מקיפה של כל פלטפורמות הסטרימינג הפופולאריות בישראל",
      category: 'tv',
      author: "מיכל רוזן",
      date: "5 בינואר 2024",
      readTime: "10 דקות קריאה",
      featured: false,
      image: "/api/placeholder/400/200"
    },
    {
      id: 6,
      title: "איך חסכתי ₹3,000 בשנה על חשבונות הבית",
      excerpt: "סיפור אישי של לקוחה שלנו שהצליחה לחסוך אלפי שקלים בשנה על כל חשבונות הבית",
      category: 'savings',
      author: "שרה כהן (לקוחה)",
      date: "3 בינואר 2024",
      readTime: "4 דקות קריאה",
      featured: true,
      image: "/api/placeholder/400/200"
    },
    {
      id: 7,
      title: "חוק הגנת הצרכן: הזכויות שלכם במעבר ספקים",
      excerpt: "מה חשוב לדעת על הזכויות שלכם כצרכנים בתחום החשמל, הטלקום והאינטרנט",
      category: 'tips',
      author: "עו״ד יוסי גולד",
      date: "1 בינואר 2024",
      readTime: "6 דקות קריאה",
      featured: false,
      image: "/api/placeholder/400/200"
    },
    {
      id: 8,
      title: "הטעויות הנפוצות ביותר בבחירת ספק חשמל",
      excerpt: "5 טעויות שעולות לכם יקר בבחירת ספק חשמל וכיצד להימנע מהן",
      category: 'electricity',
      author: "צוות EasySwitch",
      date: "28 בדצמבר 2023",
      readTime: "5 דקות קריאה",
      featured: false,
      image: "/api/placeholder/400/200"
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const getCategoryInfo = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category || { name: categoryId, icon: Target };
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground py-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid-16"></div>
          <div 
            ref={heroRef}
            className={`container mx-auto px-4 text-center relative z-10 transition-all duration-1000 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-accent-foreground animate-pulse" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-accent-foreground bg-clip-text text-transparent">
                מגזין EasySwitch
              </h1>
              <Star className="w-8 h-8 text-accent-foreground animate-pulse" />
            </div>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              הכל על חיסכון חכם בחשבונות הבית: טיפים, מדריכים ועדכונים מהשוק
              <br />
              <span className="font-semibold text-accent-foreground">הידע שיעזור לכם לחסוך אלפי שקלים בשנה</span>
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          {/* Search and Filters */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="חפשו מאמרים..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-10 h-12"
                />
              </div>
              
              <div className="text-gray-600">
                {filteredArticles.length} מאמרים נמצאו
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <CategoryIcon className="w-4 h-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <section 
              ref={articlesRef}
              className={`mb-16 transition-all duration-1000 ${
                articlesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">מאמרים מומלצים</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-8"></div>
              <div className="grid lg:grid-cols-2 gap-8">
                {featuredArticles.map((article) => {
                  const categoryInfo = getCategoryInfo(article.category);
                  const CategoryIcon = categoryInfo.icon;
                  
                  return (
                    <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
                      <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                        <CategoryIcon className="w-16 h-16 text-purple-600" />
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            {categoryInfo.name}
                          </Badge>
                          <Badge variant="outline">מומלץ</Badge>
                        </div>
                        <CardTitle className="text-xl group-hover:text-purple-600 transition-colors line-clamp-2">
                          {article.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {article.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {article.date}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.readTime}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* Regular Articles */}
          {regularArticles.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">מאמרים נוספים</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularArticles.map((article) => {
                  const categoryInfo = getCategoryInfo(article.category);
                  const CategoryIcon = categoryInfo.icon;
                  
                  return (
                    <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <CategoryIcon className="w-12 h-12 text-gray-600" />
                      </div>
                      <CardHeader className="pb-2">
                        <Badge variant="secondary" className="w-fit mb-2 bg-gray-100 text-gray-700">
                          {categoryInfo.name}
                        </Badge>
                        <CardTitle className="text-lg group-hover:text-purple-600 transition-colors line-clamp-2">
                          {article.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {article.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.readTime}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* No Results */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">לא נמצאו מאמרים</h3>
              <p className="text-gray-500 mb-6">נסו לשנות את מונחי החיפוש או הקטגוריה</p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                variant="outline"
              >
                נקו פילטרים
              </Button>
            </div>
          )}

          {/* Newsletter Signup */}
          <section className="mt-16 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">הישארו מעודכנים</h3>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              קבלו את המאמרים החדשים והטיפים הטובים ביותר לחיסכון ישירות למייל
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input
                placeholder="האימייל שלכם"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12"
              />
              <Button className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-6">
                הירשמו
              </Button>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Magazine;