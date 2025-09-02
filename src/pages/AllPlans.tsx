import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Wifi, Zap, Smartphone, Phone, Check, Building2, Search } from "lucide-react";
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
    <article className="bg-white/80 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-md hover:border-primary/30 transition-all duration-300 p-6 animate-slide-up">
      <div className="flex items-center justify-between gap-6">
        {/* Company Logo/Icon */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
            <Building2 className="h-8 w-8 text-primary group-hover:text-white transition-colors duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                {getCategoryLabel()}
              </Badge>
            </div>
            <h3 className="font-bold text-xl text-foreground">{plan.company}</h3>
          </div>
        </div>

        {/* Plan Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground mb-3 text-lg">{plan.planName}</h4>
          
          {/* Speed/Data Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            {plan.category === 'internet' && plan.downloadSpeed && (
              <div className="flex items-center gap-1 bg-primary/5 px-3 py-1 rounded-full">
                <Download className="h-4 w-4 text-primary" />
                <span>{plan.downloadSpeed}</span>
              </div>
            )}
            {plan.category === 'internet' && plan.uploadSpeed && (
              <div className="flex items-center gap-1 bg-primary/5 px-3 py-1 rounded-full">
                <Upload className="h-4 w-4 text-primary" />
                <span>{plan.uploadSpeed}</span>
              </div>
            )}
            {plan.dataAmount && (
              <div className="flex items-center gap-1 bg-primary/5 px-3 py-1 rounded-full">
                <Wifi className="h-4 w-4 text-primary" />
                <span>{plan.dataAmount}</span>
              </div>
            )}
            {plan.callMinutes && (
              <div className="flex items-center gap-1 bg-primary/5 px-3 py-1 rounded-full">
                <Phone className="h-4 w-4 text-primary" />
                <span>{plan.callMinutes}</span>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {plan.features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex flex-col items-end gap-4 flex-shrink-0">
          <div className="text-center">
            <div className="text-3xl font-black text-primary">
              {formatPrice()}
            </div>
            {plan.category !== 'electricity' && (
              <div className="text-sm text-muted-foreground">לחודש</div>
            )}
          </div>
          
          <Button 
            className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-semibold shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300" 
            onClick={() => setIsFormOpen(true)}
          >
            עבור עכשיו
          </Button>
        </div>
      </div>
      
      <SwitchRequestForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        selectedPlan={plan}
      />
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
      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-4">
                כל המסלולים
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                בחר את המסלול המתאים לך מבין {manualPlans.length} המסלולים הזמינים
              </p>
            </div>
          </header>

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
          <section className="space-y-6 max-w-5xl mx-auto">
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