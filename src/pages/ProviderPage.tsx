import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Star, Phone, Globe, Calendar, ArrowRight, ThumbsUp, BadgeCheck, Zap, Wifi, Smartphone, Tv, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { allProviders, Provider, Plan } from '@/data/providers';
import { supabase } from '@/integrations/supabase/client';
import BackToTop from '@/components/BackToTop';
import { ProviderReviews } from '@/components/reviews/ProviderReviews';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  provider_name: string;
  category: string;
  reviewer_name: string;
  rating: number;
  title: string | null;
  content: string;
  pros: string[] | null;
  cons: string[] | null;
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
}

const categoryLabels: Record<string, string> = {
  electricity: 'חשמל',
  cellular: 'סלולר',
  internet: 'אינטרנט',
  tv: 'טלוויזיה'
};

const categoryIcons: Record<string, React.ComponentType<any>> = {
  electricity: Zap,
  cellular: Smartphone,
  internet: Wifi,
  tv: Tv
};

const ProviderPage = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  // Find the provider
  const provider = allProviders.find(p => p.id === providerId);

  useEffect(() => {
    if (provider) {
      fetchReviews();
    }
  }, [provider]);

  const fetchReviews = async () => {
    if (!provider) return;
    
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('provider_name', provider.name)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setReviews(data);
        if (data.length > 0) {
          const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
          setAverageRating(avg);
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!provider) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">ספק לא נמצא</h1>
            <Button onClick={() => navigate('/all-plans')}>
              חזרה לכל המסלולים
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[provider.category] || Zap;

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": provider.name,
    "description": provider.description,
    "url": provider.website,
    "foundingDate": provider.established,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating.toFixed(1),
      "reviewCount": reviews.length,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviews.slice(0, 5).map(r => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": r.reviewer_name
      },
      "datePublished": r.created_at,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": r.rating
      },
      "reviewBody": r.content
    }))
  };

  return (
    <>
      <Helmet>
        <title>{provider.name} - מסלולים, ביקורות והשוואת מחירים | חסכונט</title>
        <meta name="description" content={`השוואת מסלולי ${categoryLabels[provider.category]} של ${provider.name}. ${reviews.length} ביקורות, דירוג ${averageRating.toFixed(1)}/5. מצא את המסלול המשתלם ביותר.`} />
        <meta name="keywords" content={`${provider.name}, ${categoryLabels[provider.category]}, מסלולים, ביקורות, השוואת מחירים, חיסכון`} />
        <link rel="canonical" href={`https://easyswitch.co.il/provider/${providerId}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${provider.name} - מסלולים וביקורות`} />
        <meta property="og:description" content={`${provider.plans.length} מסלולי ${categoryLabels[provider.category]} | דירוג ${averageRating.toFixed(1)}/5`} />
        <meta property="og:type" content="website" />
        
        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-br from-primary/10 via-primary-glow/5 to-background py-12 md:py-20"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Provider Info */}
              <div className="flex-1 text-center md:text-right">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <div className="p-4 bg-gradient-to-br from-primary to-primary-glow rounded-2xl shadow-lg">
                    <CategoryIcon className="h-8 w-8 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-1">
                    {categoryLabels[provider.category]}
                  </Badge>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{provider.name}</h1>
                <p className="text-xl text-muted-foreground mb-6">{provider.description}</p>
                
                {/* Rating Summary */}
                <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-6 w-6",
                          star <= Math.round(averageRating)
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({reviews.length} ביקורות)</span>
                </div>

                {/* Quick Info */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>פעיל מאז {provider.established}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{provider.customerService}</span>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <Card className="w-full md:w-auto md:min-w-[320px] shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-center">רוצים לעבור ל{provider.name}?</h3>
                  <div className="text-center mb-4">
                    <span className="text-4xl font-bold text-primary">{provider.plans.length}</span>
                    <span className="text-muted-foreground mr-2">מסלולים זמינים</span>
                  </div>
                  <Button 
                    onClick={() => navigate(`/all-plans?provider=${encodeURIComponent(provider.name)}`)}
                    className="w-full bg-gradient-to-r from-primary to-primary-glow"
                    size="lg"
                  >
                    <ArrowRight className="ml-2 h-5 w-5" />
                    צפה במסלולים
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.section>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-12">
          <Tabs defaultValue="plans" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="plans">מסלולים ({provider.plans.length})</TabsTrigger>
              <TabsTrigger value="reviews">ביקורות ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="plans">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {provider.plans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          {plan.recommended && (
                            <Badge className="bg-success text-success-foreground">מומלץ</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary mb-4">
                          ₪{plan.price}
                          <span className="text-sm text-muted-foreground font-normal">/חודש</span>
                        </div>
                        <ul className="space-y-2 mb-6">
                          {plan.features.slice(0, 4).map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <BadgeCheck className="h-4 w-4 text-success shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          onClick={() => navigate('/service-request', { 
                            state: { 
                              selectedProvider: provider.name,
                              selectedPlan: plan.name,
                              selectedPrice: plan.price,
                              sector: provider.category
                            }
                          })}
                          className="w-full"
                          variant="outline"
                        >
                          בחר מסלול זה
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <ProviderReviews 
                providerName={provider.name} 
                category={provider.category}
                reviews={reviews}
                onReviewAdded={fetchReviews}
              />
            </TabsContent>
          </Tabs>
        </section>

        <BackToTop />
      </div>
    </>
  );
};

export default ProviderPage;
