import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Wifi, Zap, Smartphone, Phone, Check, Building2, Search, Tv } from "lucide-react";
import { Layout } from "@/components/Layout";
import { manualPlans, ManualPlan } from "@/data/manual-plans";
import { SwitchRequestForm } from "@/components/forms/SwitchRequestForm";
import { SavingsComparisonHeader } from "@/components/SavingsComparisonHeader";

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
      case 'tv':
        return <Tv className="h-6 w-6" />;
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
      case 'tv':
        return 'טלוויזיה';
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
    <article className="bg-white/95 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-xl hover:border-primary/30 transition-all duration-300 p-5 animate-slide-up group hover:scale-[1.01]">
      <div className="flex items-center justify-between gap-4">
        {/* Company Logo/Icon */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="w-14 h-14 bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-2xl flex items-center justify-center group-hover:from-primary group-hover:to-primary-glow transition-all duration-300 shadow-sm">
            <Building2 className="h-7 w-7 text-primary group-hover:text-white transition-colors duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20 font-semibold px-2 py-1">
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
            {plan.category === 'internet' && plan.downloadSpeed && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-primary/5 to-primary-glow/5 px-3 py-2 rounded-full border border-primary/10">
                <Download className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{plan.downloadSpeed}</span>
              </div>
            )}
            {plan.category === 'internet' && plan.uploadSpeed && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-success/5 to-success/10 px-3 py-2 rounded-full border border-success/10">
                <Upload className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">{plan.uploadSpeed}</span>
              </div>
            )}
            {plan.dataAmount && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-electric-blue/5 to-electric-blue/10 px-3 py-2 rounded-full border border-electric-blue/10">
                <Wifi className="h-4 w-4 text-electric-blue" />
                <span className="text-sm font-medium">{plan.dataAmount}</span>
              </div>
            )}
            {plan.callMinutes && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-golden-yellow/5 to-golden-yellow/10 px-3 py-2 rounded-full border border-golden-yellow/10">
                <Phone className="h-4 w-4 text-golden-yellow" />
                <span className="text-sm font-medium">{plan.callMinutes}</span>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
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
          <div className="text-center bg-gradient-to-r from-primary/5 to-primary-glow/5 p-4 rounded-xl border border-primary/10">
            <div className="text-3xl font-black bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              {formatPrice()}
            </div>
            {plan.category !== 'electricity' && (
              <div className="text-sm text-muted-foreground font-medium">לחודש</div>
            )}
          </div>
          
          <Button 
            className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-white font-bold text-base px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
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

interface CategorySavings {
  category: 'electricity' | 'cellular' | 'internet' | 'tv';
  currentAmount: number;
  newAmount: number;
  monthlySavings: number;
  currentProvider: string;
  newProvider: string;
}

interface AllPlansProps {
  initialSelectedCategories?: string[];
  savingsData?: CategorySavings[];
}

const AllPlans = ({ initialSelectedCategories = [], savingsData = [] }: AllPlansProps) => {
  // Set initial category based on analyzed categories
  const getInitialCategory = () => {
    if (initialSelectedCategories.length === 1) {
      const cat = initialSelectedCategories[0];
      if (cat === 'cellular') return 'mobile';
      if (cat === 'electricity' || cat === 'internet' || cat === 'tv') return cat as 'electricity' | 'internet' | 'tv';
    }
    return 'all' as const;
  };
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'electricity' | 'internet' | 'mobile' | 'tv'>(getInitialCategory());
  
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
    mobile: 'חבילות סלולר',
    tv: 'חבילות טלוויזיה וסטרימינג'
  };

  const getCategoryCounts = () => {
    const counts = {
      electricity: manualPlans.filter(p => p.category === 'electricity').length,
      internet: manualPlans.filter(p => p.category === 'internet').length,
      mobile: manualPlans.filter(p => p.category === 'mobile').length,
      tv: manualPlans.filter(p => p.category === 'tv').length,
    };
    return counts;
  };

  const counts = getCategoryCounts();

  return (
    <Layout>
      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
        <div className="container mx-auto px-4 py-12">
          {/* Savings Comparison Header - Only show if we have savings data */}
          {savingsData.length > 0 && (
            <SavingsComparisonHeader categorySavings={savingsData} />
          )}

          {/* Header */}
          <header className="text-center mb-8">
            <div className="mb-4">
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-3">
                {savingsData.length > 0 ? 'המסלולים המומלצים עבורך' : 'כל המסלולים'}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {savingsData.length > 0 
                  ? 'בחר את המסלולים שיחסכו לך הכי הרבה כסף מהרשימה המותאמת אישית'
                  : `בחר את המסלול המתאים לך מבין ${manualPlans.length} המסלולים הזמינים`
                }
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
            <Button
              variant={selectedCategory === 'tv' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('tv')}
              className="bg-white/70 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 flex items-center gap-2"
            >
              <Tv className="h-4 w-4" />
              <span>טלוויזיה ({counts.tv})</span>
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