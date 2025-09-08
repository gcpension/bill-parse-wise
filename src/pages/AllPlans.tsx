import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Wifi, Zap, Smartphone, Phone, Check, Building2, Search, Star } from "lucide-react";
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
    <article className="bg-white/95 backdrop-blur-sm border-2 border-border/30 rounded-2xl hover:shadow-xl hover:border-primary/50 hover:scale-[1.02] transition-all duration-500 p-6 animate-slide-up group relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex items-center justify-between gap-6">
        {/* Company Logo/Icon */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:from-primary group-hover:to-primary/80 transition-all duration-500 shadow-lg group-hover:shadow-xl">
              <Building2 className="h-8 w-8 text-primary group-hover:text-white transition-colors duration-300" />
            </div>
            {/* Rating badge */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
              ★
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30 font-semibold">
                {getCategoryLabel()}
              </Badge>
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                מומלץ
              </Badge>
            </div>
            <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300">{plan.company}</h3>
            <p className="text-sm text-muted-foreground mt-1">ספק מוביל בישראל</p>
          </div>
        </div>

        {/* Plan Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <h4 className="font-bold text-foreground text-xl group-hover:text-primary transition-colors">{plan.planName}</h4>
            {plan.regularPrice && (
              <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold text-xs px-2 py-1 animate-pulse">
                🔥 מבצע חם
              </Badge>
            )}
          </div>
          
          {/* Speed/Data Info */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4 flex-wrap">
            {plan.category === 'internet' && plan.downloadSpeed && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 px-3 py-2 rounded-xl">
                <Download className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">{plan.downloadSpeed}</span>
              </div>
            )}
            {plan.category === 'internet' && plan.uploadSpeed && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 px-3 py-2 rounded-xl">
                <Upload className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">{plan.uploadSpeed}</span>
              </div>
            )}
            {plan.dataAmount && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 px-3 py-2 rounded-xl">
                <Wifi className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800">{plan.dataAmount}</span>
              </div>
            )}
            {plan.callMinutes && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 px-3 py-2 rounded-xl">
                <Phone className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-emerald-800">{plan.callMinutes}</span>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold text-sm text-foreground">מה כלול במסלול:</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {plan.features.slice(0, 6).map((feature, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground leading-relaxed font-medium">{feature}</span>
                </div>
              ))}
            </div>
            {plan.features.length > 6 && (
              <div className="text-xs text-muted-foreground mt-2">
                ועוד {plan.features.length - 6} הטבות נוספות...
              </div>
            )}
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex flex-col items-end gap-4 flex-shrink-0">
          <div className="text-center relative">
            {/* Price highlight */}
            <div className="absolute -inset-3 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="text-4xl font-black bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {formatPrice()}
              </div>
              {plan.category !== 'electricity' && (
                <div className="text-sm text-muted-foreground font-medium">לחודש</div>
              )}
              {plan.regularPrice && plan.regularPrice > 0 && (
                <div className="text-xs text-muted-foreground line-through mt-1">
                  ₪{Math.round(plan.regularPrice * 1.2)}
                </div>
              )}
            </div>
          </div>
          
          {/* Savings indicator */}
          {plan.regularPrice && plan.regularPrice > 50 && (
            <div className="text-center">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xs">
                חוסכים ₪{Math.round(plan.regularPrice * 0.2)}
              </Badge>
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <Button 
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
              onClick={() => setIsFormOpen(true)}
            >
              <span className="flex items-center gap-2">
                🚀 עבור עכשיו
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="border-primary/30 text-primary hover:bg-primary/5 text-xs"
            >
              פרטים נוספים
            </Button>
          </div>
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
          {/* Header */}
          <header className="text-center mb-8">
            <div className="mb-4">
              {initialCategories.length > 0 && (
                <div className="mb-4">
                  <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-2 text-base font-bold">
                    🎯 מסלולים מומלצים בהתאם לניתוח שלכם
                  </Badge>
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-3">
                המסלולים הטובים ביותר עבורכם
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {initialCategories.length > 0 
                  ? `נמצאו ${filteredPlans.length} מסלולים מותאמים לתחומים שבחרתם`
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