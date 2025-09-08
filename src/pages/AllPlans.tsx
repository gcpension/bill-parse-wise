import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload, Download, Wifi, Zap, Smartphone, Phone, Check, Building2, 
  Search, Star, Award, Gift, Clock, Shield, ExternalLink, Target, Sparkles 
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { manualPlans, ManualPlan } from "@/data/manual-plans";
import { SwitchRequestForm } from "@/components/forms/SwitchRequestForm";

const PlanListItem = ({ plan }: { plan: ManualPlan }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const getCategoryIcon = () => {
    switch (plan.category) {
      case 'electricity':
        return <Zap className="h-6 w-6" />;
      case 'mobile':
        return <Smartphone className="h-6 w-6" />;
      case 'internet':
        return <Wifi className="h-6 w-6" />;
      default:
        return <Wifi className="h-6 w-6" />;
    }
  };

  const getCategoryLabel = () => {
    switch (plan.category) {
      case 'electricity':
        return 'חשמל';
      case 'mobile':
        return 'סלולר';
      case 'internet':
        return 'אינטרנט';
      default:
        return '';
    }
  };

  const formatPrice = () => {
    if (plan.category === 'electricity') {
      return plan.speed; // For electricity, speed is actually the discount percentage
    }
    return `₪${plan.regularPrice}`;
  };

  const getCompanyColor = (company: string) => {
    const colors: { [key: string]: string } = {
      'פרטנר': 'bg-orange-500',
      'בזק': 'bg-blue-500',
      'HOT': 'bg-red-500',
      '019 מובייל': 'bg-pink-500',
      'YES': 'bg-green-500',
      'אלקטרה פאוור': 'bg-blue-600',
      'אמישראגז חשמל': 'bg-green-600',
      'פזגז': 'bg-yellow-600',
      'הוט אנרגי': 'bg-purple-600',
      'סלקום אנרגי': 'bg-orange-600',
      'פרטנר פאוור': 'bg-red-600',
    };
    return colors[company] || 'bg-gray-500';
  };

  return (
                <Card key={plan.id} className="group hover:shadow-lg transition-all duration-300 border hover:border-primary/30 bg-gradient-to-br from-white to-gray-50/50 relative overflow-hidden">
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardContent className="p-4 relative z-10">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-300">
              {getCategoryIcon()}
            </div>
                            <div>
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                {plan.company}
              </h3>
              <p className="text-xs text-muted-foreground">{getCategoryLabel()}</p>
            </div>
          </div>
          
          <h4 className="text-sm font-semibold text-foreground leading-tight">
            {plan.planName}
          </h4>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <Badge className="bg-gradient-to-r from-success to-success/80 text-white shadow text-xs">
            <Star className="ml-1 h-2 w-2 fill-current" />
            פופולרי
          </Badge>
          <Badge className="bg-gradient-to-r from-primary to-primary-glow text-white shadow text-xs">
            <Award className="ml-1 h-2 w-2" />
            מומלץ
          </Badge>
        </div>
      </div>

      {/* Price */}
      <div className="text-center p-3 bg-gradient-to-br from-accent/30 to-accent/10 rounded-xl border border-accent/20">
        <div className="space-y-1">
          <p className="text-2xl font-black text-primary group-hover:scale-105 transition-transform duration-300">
            {formatPrice()}
          </p>
          <p className="text-xs text-muted-foreground font-medium">לחודש</p>
          {plan.regularPrice && plan.regularPrice > 0 && (
            <p className="text-xs text-muted-foreground line-through mt-1">
              ₪{Math.round(plan.regularPrice * 1.2)}
            </p>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">מסלול מתקדם</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Shield className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">שירות מקצועי</span>
          </div>
        </div>
        
        {/* Features list */}
        <div className="space-y-1">
          {plan.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-start gap-2 text-xs">
              <Check className="h-3 w-3 text-success flex-shrink-0 mt-0.5" />
              <span className="text-foreground leading-tight">{feature}</span>
            </div>
          ))}
          {plan.features.length > 3 && (
            <div className="text-xs text-muted-foreground">
              ועוד {plan.features.length - 3} הטבות...
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <Button 
        className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-white font-semibold py-2 rounded-lg shadow hover:shadow-lg transition-all duration-300 group-hover:scale-[1.01] text-sm"
        onClick={() => setIsFormOpen(true)}
      >
        <ExternalLink className="ml-1 h-3 w-3" />
        בחר מסלול זה
      </Button>
                    </div>
                  </CardContent>
                </Card>
  );
};

interface AllPlansProps {
  initialCategories?: ('electricity' | 'cellular' | 'internet' | 'tv')[];
}

const AllPlans = ({ initialCategories = [] }: AllPlansProps = {}) => {
  // Determine initial category based on what was analyzed
  const getInitialCategory = () => {
    if (initialCategories.length === 1) {
      const category = initialCategories[0];
      if (category === 'cellular') return 'mobile';
      return category as 'electricity' | 'internet' | 'mobile';
    }
    return 'all';
  };
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'electricity' | 'internet' | 'mobile'>(getInitialCategory());
  
  useEffect(() => {
    document.title = "כל המסלולים | חסכונט";
  }, []);

  const filteredPlans = selectedCategory === 'all' 
    ? manualPlans 
    : manualPlans.filter(plan => plan.category === selectedCategory);

  const categoryLabels = {
    all: 'כל הקטגוריות',
    electricity: 'חבילות חשמל',
    internet: 'חבילות אינטרנט',
    mobile: 'חבילות סלולר'
  };

  const getCategoryCounts = () => {
    const counts = {
      electricity: manualPlans.filter(p => p.category === 'electricity').length,
      internet: manualPlans.filter(p => p.category === 'internet').length,
      mobile: manualPlans.filter(p => p.category === 'mobile').length,
    };
    return counts;
  };

  const counts = getCategoryCounts();

  return (
    <Layout>
      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-primary/10 via-primary-glow/5 to-success/10 rounded-2xl p-6 md:p-8 text-center space-y-4 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full -translate-x-16 -translate-y-16 blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-success/20 to-transparent rounded-full translate-x-16 translate-y-16 blur-2xl"></div>
            
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary via-primary-glow to-success bg-clip-text text-transparent leading-tight">
                כל המסלולים הזמינים
              </h1>
              
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                גלה את כל האפשרויות הזמינות בשוק ומצא את המסלול המושלם עבורך
              </p>
              
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline" className="px-3 py-1 text-sm bg-white/50 backdrop-blur-sm">
                  <Sparkles className="ml-1 h-3 w-3" />
                  מסלולים מעודכנים
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-sm bg-white/50 backdrop-blur-sm">
                  <Shield className="ml-1 h-3 w-3" />
                  מחירים אמיתיים
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-sm bg-white/50 backdrop-blur-sm">
                  <Zap className="ml-1 h-3 w-3" />
                  השוואה מהירה
                </Badge>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className="bg-white/70 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300"
            >
              <span>הכל ({manualPlans.length})</span>
            </Button>
            <Button
              variant={selectedCategory === 'electricity' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('electricity')}
              className="bg-white/70 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              <span>חשמל ({counts.electricity})</span>
            </Button>
            <Button
              variant={selectedCategory === 'internet' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('internet')}
              className="bg-white/70 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 flex items-center gap-2"
            >
              <Wifi className="h-4 w-4" />
              <span>אינטרנט ({counts.internet})</span>
            </Button>
            <Button
              variant={selectedCategory === 'mobile' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('mobile')}
              className="bg-white/70 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 flex items-center gap-2"
            >
              <Smartphone className="h-4 w-4" />
              <span>סלולר ({counts.mobile})</span>
            </Button>
          </div>

          {/* Category Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {categoryLabels[selectedCategory]} ({filteredPlans.length})
            </h2>
          </div>

          {/* Plans List */}
          <section className="space-y-4 max-w-4xl mx-auto">
            {filteredPlans.map((plan) => (
              <PlanListItem key={plan.id} plan={plan} />
            ))}
          </section>

          {filteredPlans.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-10 w-10 text-primary" />
              </div>
              <p className="text-muted-foreground text-lg">לא נמצאו מסלולים בקטגוריה זו</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AllPlans;