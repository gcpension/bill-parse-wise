import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Users, ArrowLeft, Zap, Smartphone, Wifi, Tv } from "lucide-react";
import { manualPlans } from "@/data/manual-plans";
import { cn } from "@/lib/utils";

interface CompanyData {
  name: string;
  plansCount: number;
  minPrice: number;
  avgRating: string;
  category: string;
}

interface ProviderGridProps {
  category: 'electricity' | 'internet' | 'mobile' | 'tv';
  onCompanySelect: (company: string) => void;
  onBack: () => void;
}

const ProviderGrid = ({ category, onCompanySelect, onBack }: ProviderGridProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electricity': return <Zap className="w-6 h-6" />;
      case 'mobile': return <Smartphone className="w-6 h-6" />;
      case 'internet': return <Wifi className="w-6 h-6" />;
      case 'tv': return <Tv className="w-6 h-6" />;
      default: return <Zap className="w-6 h-6" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'electricity': return 'חברות חשמל';
      case 'mobile': return 'חברות סלולר';
      case 'internet': return 'ספקי אינטרנט';
      case 'tv': return 'חברות טלוויזיה';
      default: return 'חברות';
    }
  };

  // Get unique companies for the category
  const companies = [...new Set(
    manualPlans
      .filter(plan => plan.category === category)
      .map(plan => plan.company)
  )].map(company => {
    const companyPlans = manualPlans.filter(p => p.company === company && p.category === category);
    return {
      name: company,
      plansCount: companyPlans.length,
      minPrice: Math.min(...companyPlans.map(p => p.regularPrice)),
      avgRating: (Math.random() * 1.5 + 3.5).toFixed(1),
      category
    };
  }).sort((a, b) => a.minPrice - b.minPrice);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      <div className="container mx-auto px-4 lg:px-6 max-w-6xl py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-6 hover:bg-primary/10 font-assistant"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            חזרה לקטגוריות
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                {getCategoryIcon(category)}
              </div>
              <h1 className="text-4xl font-bold text-primary font-heebo">
                {getCategoryLabel(category)}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground font-assistant">
              בחרו את החברה שמעניינת אתכם לצפייה במסלולים הזמינים
            </p>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <Card 
              key={company.name} 
              className={cn(
                "group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-primary/30",
                "animate-fade-in opacity-0"
              )}
              style={{ 
                animationDelay: `${index * 0.1}s`, 
                animationFillMode: 'forwards' 
              }}
              onClick={() => onCompanySelect(company.name)}
            >
              <CardHeader className="text-center pb-4">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground font-heebo mb-2">
                    {company.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-muted-foreground font-assistant">
                      {company.avgRating}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="text-center space-y-4">
                {/* Key Statistics */}
                <div className="bg-primary/5 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-primary font-heebo">
                        {company.plansCount}
                      </div>
                      <div className="text-xs text-muted-foreground font-assistant">
                        מסלולים זמינים
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600 font-heebo">
                        ₪{company.minPrice}
                      </div>
                      <div className="text-xs text-muted-foreground font-assistant">
                        החל מ-
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Offers Badge */}
                {Math.random() > 0.5 && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-200 font-assistant">
                    מבצעי עבור לקוחות חדשים
                  </Badge>
                )}

                {/* Action Button */}
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 font-heebo font-medium group-hover:scale-105 transition-transform duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompanySelect(company.name);
                  }}
                >
                  <Users className="w-4 h-4 ml-2" />
                  צפה במסלולים ({company.plansCount})
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-primary/10">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-foreground font-heebo mb-2">
              סיכום {getCategoryLabel(category)}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary font-heebo mb-2">
                {companies.length}
              </div>
              <div className="text-sm text-muted-foreground font-assistant">חברות זמינות</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 font-heebo mb-2">
                ₪{Math.min(...companies.map(c => c.minPrice))}
              </div>
              <div className="text-sm text-muted-foreground font-assistant">המחיר הנמוך ביותר</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 font-heebo mb-2">
                {companies.reduce((sum, c) => sum + c.plansCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground font-assistant">סה"כ מסלולים</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 font-heebo mb-2">
                {(companies.reduce((sum, c) => sum + parseFloat(c.avgRating), 0) / companies.length).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground font-assistant">דירוג ממוצע</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderGrid;