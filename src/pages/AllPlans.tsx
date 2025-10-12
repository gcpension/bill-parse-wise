import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Zap, 
  Wifi, 
  Smartphone, 
  Tv,
  TrendingDown,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Import company logos
import electraLogo from "@/assets/logos/electra-logo.png";
import electricityLogo from "@/assets/logos/electricity-logo.png";
import bezeqLogo from "@/assets/logos/bezeq-logo.png";
import hotLogo from "@/assets/logos/hot-logo.svg";
import partnerLogo from "@/assets/logos/partner-logo.png";
import cellcomLogo from "@/assets/logos/cellcom-logo.svg";
import pelephoneLogo from "@/assets/logos/pelephone-logo.png";
import logo019 from "@/assets/logos/019-logo.png";
import ramiLevyLogo from "@/assets/logos/rami-levy-logo.png";
import yesLogo from "@/assets/logos/yes-logo.png";
import netflixLogo from "@/assets/logos/netflix-logo.svg";
import disneyLogo from "@/assets/logos/disney-logo.png";
import hboLogo from "@/assets/logos/hbo-logo.png";

type CategoryType = 'electricity' | 'internet' | 'mobile' | 'tv' | 'all';

interface Company {
  name: string;
  logo: string;
  category: CategoryType[];
  plansCount: number;
}

const AllPlans = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [hoveredCompany, setHoveredCompany] = useState<string | null>(null);

  // Company data with categories
  const companies: Company[] = [
    { name: 'חברת החשמל', logo: electricityLogo, category: ['electricity'], plansCount: 12 },
    { name: 'אלקטרה', logo: electraLogo, category: ['electricity'], plansCount: 8 },
    { name: 'בזק', logo: bezeqLogo, category: ['internet'], plansCount: 15 },
    { name: 'HOT', logo: hotLogo, category: ['internet', 'tv'], plansCount: 20 },
    { name: 'סלקום', logo: cellcomLogo, category: ['mobile'], plansCount: 18 },
    { name: 'פרטנר', logo: partnerLogo, category: ['mobile', 'internet'], plansCount: 22 },
    { name: 'פלאפון', logo: pelephoneLogo, category: ['mobile'], plansCount: 16 },
    { name: '019', logo: logo019, category: ['mobile'], plansCount: 10 },
    { name: 'רמי לוי', logo: ramiLevyLogo, category: ['mobile'], plansCount: 14 },
    { name: 'YES', logo: yesLogo, category: ['tv'], plansCount: 12 },
    { name: 'נטפליקס', logo: netflixLogo, category: ['tv'], plansCount: 4 },
    { name: 'דיסני', logo: disneyLogo, category: ['tv'], plansCount: 3 },
    { name: 'HBO', logo: hboLogo, category: ['tv'], plansCount: 2 },
  ];

  // Categories configuration
  const categories = [
    { id: 'all' as CategoryType, label: 'הכל', icon: <TrendingDown className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' },
    { id: 'electricity' as CategoryType, label: 'חשמל', icon: <Zap className="w-5 h-5" />, color: 'from-yellow-500 to-orange-500' },
    { id: 'internet' as CategoryType, label: 'אינטרנט', icon: <Wifi className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
    { id: 'mobile' as CategoryType, label: 'סלולר', icon: <Smartphone className="w-5 h-5" />, color: 'from-green-500 to-emerald-500' },
    { id: 'tv' as CategoryType, label: 'טלוויזיה', icon: <Tv className="w-5 h-5" />, color: 'from-red-500 to-pink-500' },
  ];

  // Filter companies by selected category
  const filteredCompanies = useMemo(() => {
    if (selectedCategory === 'all') return companies;
    return companies.filter(company => company.category.includes(selectedCategory));
  }, [selectedCategory]);

  const handleCompanyClick = (companyName: string) => {
    // Navigate to company plans or show details
    console.log('Clicked company:', companyName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 border-b">
        <div className="container mx-auto px-4 max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 hover:bg-white/50"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            חזרה לדף הבית
          </Button>

          <div className="text-center space-y-4">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-2">
              כל החברות במקום אחד
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 font-heebo">
              מרכז השוואת{" "}
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-transparent bg-clip-text">
                המסלולים
              </span>
            </h1>
            <p className="text-xl text-gray-600 font-assistant max-w-3xl mx-auto leading-relaxed">
              גלו את כל הספקים והחברות בישראל • השוו מחירים • חסכו כסף
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl -z-10" />
      </section>

      <div className="container mx-auto px-4 max-w-7xl py-12">
        {/* Category Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "group relative px-8 py-4 rounded-2xl font-semibold transition-all duration-300 overflow-hidden",
                  "flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105",
                  selectedCategory === category.id
                    ? "bg-white text-primary ring-2 ring-primary ring-offset-2"
                    : "bg-white text-gray-700 hover:text-primary"
                )}
              >
                {/* Background gradient on hover */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity",
                  category.color
                )} />
                
                {/* Icon with gradient */}
                <div className={cn(
                  "relative z-10 p-2 rounded-xl bg-gradient-to-br transition-transform group-hover:scale-110",
                  selectedCategory === category.id ? category.color + " text-white" : "bg-gray-100 text-gray-600"
                )}>
                  {category.icon}
                </div>
                
                <span className="relative z-10 text-lg">{category.label}</span>
                
                {/* Active indicator */}
                {selectedCategory === category.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 font-assistant">
            מציג <span className="font-bold text-primary">{filteredCompanies.length}</span> חברות
            {selectedCategory !== 'all' && (
              <span> בקטגוריית <span className="font-bold">{categories.find(c => c.id === selectedCategory)?.label}</span></span>
            )}
          </p>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCompanies.map((company, index) => (
            <Card
              key={company.name}
              className={cn(
                "group relative overflow-hidden cursor-pointer transition-all duration-300",
                "hover:shadow-2xl hover:scale-105 hover:-translate-y-2",
                "border-2 hover:border-primary/50",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              onMouseEnter={() => setHoveredCompany(company.name)}
              onMouseLeave={() => setHoveredCompany(null)}
              onClick={() => handleCompanyClick(company.name)}
            >
              <CardContent className="p-8">
                {/* Logo Container */}
                <div className="relative mb-6">
                  <div className="w-full h-32 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 group-hover:from-primary/5 group-hover:to-primary/10 transition-colors">
                    <img
                      src={company.logo}
                      alt={`${company.name} לוגו`}
                      className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                </div>

                {/* Company Info */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 font-heebo text-center group-hover:text-primary transition-colors">
                    {company.name}
                  </h3>
                  
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      {company.plansCount} מסלולים
                    </Badge>
                  </div>

                  {/* Category Tags */}
                  <div className="flex flex-wrap gap-1 justify-center pt-2">
                    {company.category.map((cat) => {
                      const categoryConfig = categories.find(c => c.id === cat);
                      return (
                        <div
                          key={cat}
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
                            "bg-gradient-to-r text-white",
                            categoryConfig?.color
                          )}
                        >
                          {categoryConfig?.icon}
                          <span>{categoryConfig?.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Hover Action */}
                {hoveredCompany === company.name && (
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/95 to-primary/80 flex items-center justify-center animate-fade-in">
                    <div className="text-center text-white space-y-3">
                      <p className="text-lg font-bold">לחץ לצפייה במסלולים</p>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <Zap className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">לא נמצאו חברות</h3>
            <p className="text-gray-600">נסה לבחור קטגוריה אחרת</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPlans;
