import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Wifi, Zap, Smartphone, Phone } from "lucide-react";
import { Layout } from "@/components/Layout";
import { manualPlans, ManualPlan } from "@/data/manual-plans";

const PlanCard = ({ plan }: { plan: ManualPlan }) => {
  const getCategoryIcon = () => {
    switch (plan.category) {
      case 'electricity':
        return <Zap className="h-5 w-5" />;
      case 'mobile':
        return <Smartphone className="h-5 w-5" />;
      case 'internet':
        return <Wifi className="h-5 w-5" />;
      default:
        return <Wifi className="h-5 w-5" />;
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

  return (
    <article className="bg-card border border-border rounded-2xl shadow-card hover:shadow-elegant transition-all duration-300 overflow-hidden">
      {/* Header with company name and main info */}
      <header className={`${plan.color} text-white p-6 text-center relative overflow-hidden`}>
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getCategoryIcon()}
            <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/20">
              {getCategoryLabel()}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold mb-1">{plan.company}</h3>
          <div className="text-4xl font-bold">{formatPrice()}</div>
          <p className="text-sm opacity-90 mt-1">{plan.planName}</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      </header>

      {/* Pricing section - only for non-electricity plans */}
      {plan.category !== 'electricity' && (
        <div className="p-6 text-center border-b border-border/60">
          <div className="text-2xl font-bold text-foreground mb-1">
            ₪{plan.regularPrice}
            <span className="text-sm font-normal text-muted-foreground mr-1">לחודש</span>
          </div>
          {plan.dataAmount && (
            <div className="text-lg text-muted-foreground">
              כולל {plan.dataAmount} גלישה
            </div>
          )}
        </div>
      )}

      {/* Speed details - only for internet plans */}
      {plan.category === 'internet' && (plan.uploadSpeed || plan.downloadSpeed) && (
        <div className="p-6 border-b border-border/60">
          <div className="grid grid-cols-2 gap-4">
            {plan.uploadSpeed && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Upload className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">העלאה עד</span>
                </div>
                <div className="text-xl font-bold text-primary">{plan.uploadSpeed}</div>
              </div>
            )}
            {plan.downloadSpeed && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Download className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">הורדה עד</span>
                </div>
                <div className="text-xl font-bold text-primary">{plan.downloadSpeed}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="p-6">
        <ul className="space-y-3 mb-6">
          {plan.features.slice(0, 4).map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <span className="text-muted-foreground leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>

        <Button className="w-full" size="lg">
          {getCategoryIcon()}
          <span className="mr-2">בחר מסלול זה</span>
        </Button>
      </div>
    </article>
  );
};

const AllPlans = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'electricity' | 'internet' | 'mobile'>('all');
  
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
      <div dir="rtl" className="min-h-screen container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">כל המסלולים</h1>
          <p className="text-base text-muted-foreground">בחר את המסלול המתאים לך מבין {manualPlans.length} המסלולים הזמינים</p>
        </header>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className="flex items-center gap-2"
          >
            <span>הכל ({manualPlans.length})</span>
          </Button>
          <Button
            variant={selectedCategory === 'electricity' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('electricity')}
            className="flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            <span>חשמל ({counts.electricity})</span>
          </Button>
          <Button
            variant={selectedCategory === 'internet' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('internet')}
            className="flex items-center gap-2"
          >
            <Wifi className="h-4 w-4" />
            <span>אינטרנט ({counts.internet})</span>
          </Button>
          <Button
            variant={selectedCategory === 'mobile' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('mobile')}
            className="flex items-center gap-2"
          >
            <Smartphone className="h-4 w-4" />
            <span>סלולר ({counts.mobile})</span>
          </Button>
        </div>

        {/* Category Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {categoryLabels[selectedCategory]} ({filteredPlans.length})
          </h2>
        </div>

        {/* Plans Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </section>

        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">לא נמצאו מסלולים בקטגוריה זו</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllPlans;