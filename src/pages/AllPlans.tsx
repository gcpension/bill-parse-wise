import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Zap, 
  Wifi, 
  Smartphone, 
  Tv,
  TrendingDown,
  ArrowLeft,
  Search,
  SlidersHorizontal
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter companies by selected category and search
  const filteredCompanies = useMemo(() => {
    let filtered = companies;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(company => company.category.includes(selectedCategory));
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [selectedCategory, searchQuery]);

  const handleCompanyClick = (companyName: string) => {
    // Navigate to company plans or show details
    console.log('Clicked company:', companyName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 font-['Rubik']">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background py-12 border-b">
        <div className="container mx-auto px-4 max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 hover:bg-white/50 font-['Rubik']"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            חזרה לדף הבית
          </Button>

          <div className="text-center space-y-3">
            <Badge className="mb-3 bg-gradient-to-r from-primary to-primary/80 text-white px-5 py-1.5 font-['Rubik']">
              כל החברות במקום אחד
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 font-['Rubik']">
              באיזה תחום תרצו{" "}
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-transparent bg-clip-text">
                להתחיל לחסוך?
              </span>
            </h1>
            <p className="text-lg text-gray-600 font-['Rubik'] max-w-2xl mx-auto leading-relaxed">
              בחרו קטגוריה וגלו את כל הספקים והמסלולים הזמינים
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl -z-10" />
      </section>

      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden font-['Rubik']",
                  "flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105",
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
                  "relative z-10 p-1.5 rounded-lg bg-gradient-to-br transition-transform group-hover:scale-110",
                  selectedCategory === category.id ? category.color + " text-white" : "bg-gray-100 text-gray-600"
                )}>
                  {category.icon}
                </div>
                
                <span className="relative z-10 text-base">{category.label}</span>
                
                {/* Active indicator */}
                {selectedCategory === category.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="חיפוש חברה..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 py-6 rounded-xl border-2 focus:border-primary font-['Rubik'] text-base"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
            <span className="text-2xl font-bold text-primary font-['Rubik']">{filteredCompanies.length}</span>
            <span className="text-gray-600 font-['Rubik']">
              חברות
              {selectedCategory !== 'all' && (
                <> ב{categories.find(c => c.id === selectedCategory)?.label}</>
              )}
            </span>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredCompanies.map((company, index) => (
            <Card
              key={company.name}
              className={cn(
                "group relative overflow-hidden cursor-pointer transition-all duration-300",
                "hover:shadow-xl hover:scale-105",
                "border hover:border-primary/50",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 30}ms` }}
              onMouseEnter={() => setHoveredCompany(company.name)}
              onMouseLeave={() => setHoveredCompany(null)}
              onClick={() => handleCompanyClick(company.name)}
            >
              <CardContent className="p-4">
                {/* Logo Container - Smaller */}
                <div className="relative mb-3">
                  <div className="w-full h-16 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-lg p-2 group-hover:from-primary/5 group-hover:to-primary/10 transition-colors">
                    <img
                      src={company.logo}
                      alt={`${company.name} לוגו`}
                      className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Company Info */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-gray-900 font-['Rubik'] text-center group-hover:text-primary transition-colors line-clamp-1">
                    {company.name}
                  </h3>
                  
                  <div className="flex items-center justify-center">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 text-xs font-['Rubik']">
                      {company.plansCount} מסלולים
                    </Badge>
                  </div>

                  {/* Category Tags - Compact */}
                  <div className="flex flex-wrap gap-1 justify-center">
                    {company.category.slice(0, 2).map((cat) => {
                      const categoryConfig = categories.find(c => c.id === cat);
                      return (
                        <div
                          key={cat}
                          className={cn(
                            "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium",
                            "bg-gradient-to-r text-white font-['Rubik']",
                            categoryConfig?.color
                          )}
                        >
                          <div className="w-3 h-3">
                            {categoryConfig?.icon}
                          </div>
                        </div>
                      );
                    })}
                    {company.category.length > 2 && (
                      <div className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-200 text-gray-600 font-['Rubik']">
                        +{company.category.length - 2}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Action */}
                {hoveredCompany === company.name && (
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/95 to-primary/80 flex items-center justify-center animate-fade-in rounded-lg">
                    <div className="text-center text-white space-y-2">
                      <p className="text-sm font-bold font-['Rubik'] px-2">לחץ לצפייה במסלולים</p>
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
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
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-['Rubik']">לא נמצאו חברות</h3>
            <p className="text-gray-600 font-['Rubik']">נסה לשנות את החיפוש או בחר קטגוריה אחרת</p>
            {searchQuery && (
              <Button
                onClick={() => setSearchQuery('')}
                variant="outline"
                className="mt-4 font-['Rubik']"
              >
                נקה חיפוש
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPlans;
