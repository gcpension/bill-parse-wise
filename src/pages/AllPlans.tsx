import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Wifi, Zap, Smartphone, Phone, Check, Building2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { manualPlans, ManualPlan } from "@/data/manual-plans";
import { PlanSwitchForm } from "@/components/PlanSwitchForm";

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
    <article className="bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-300 p-6">
      <div className="flex items-center justify-between gap-6">
        {/* Company Logo/Icon */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className={`${getCompanyColor(plan.company)} text-white p-3 rounded-lg flex items-center justify-center`}>
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {getCategoryLabel()}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg text-foreground mt-1">{plan.company}</h3>
          </div>
        </div>

        {/* Plan Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground mb-2 truncate">{plan.planName}</h4>
          
          {/* Speed/Data Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            {plan.category === 'internet' && plan.downloadSpeed && (
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4 text-primary" />
                <span>{plan.downloadSpeed}</span>
              </div>
            )}
            {plan.category === 'internet' && plan.uploadSpeed && (
              <div className="flex items-center gap-1">
                <Upload className="h-4 w-4 text-primary" />
                <span>{plan.uploadSpeed}</span>
              </div>
            )}
            {plan.dataAmount && (
              <div className="flex items-center gap-1">
                <Wifi className="h-4 w-4 text-primary" />
                <span>{plan.dataAmount}</span>
              </div>
            )}
            {plan.callMinutes && (
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4 text-primary" />
                <span>{plan.callMinutes}</span>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {plan.features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-relaxed truncate">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {formatPrice()}
            </div>
            {plan.category !== 'electricity' && (
              <div className="text-sm text-muted-foreground">לחודש</div>
            )}
          </div>
          
          <Button className="px-6" onClick={() => setIsFormOpen(true)}>
            עבור עכשיו
          </Button>
        </div>
      </div>
      
      <PlanSwitchForm 
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

        {/* Plans List */}
        <section className="space-y-4">
          {filteredPlans.map((plan) => (
            <PlanListItem key={plan.id} plan={plan} />
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