import {
  Check,
  X,
  Star,
  Filter,
  ArrowUpDown,
  Smartphone,
  Wifi,
  Tv,
  Zap,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

interface Plan {
  id: string;
  provider: string;
  logo: string;
  name: string;
  price: number;
  originalPrice?: number;
  features: string[];
  isPopular?: boolean;
  discount?: string;
  data?: string;
  speed?: string;
}

interface ComparisonTableProps {
  service: string;
  onSwitchNow: (plan: Plan) => void;
  onBack?: () => void;
}

const mockPlans: Record<string, Plan[]> = {
  אינטרנט: [
    {
      id: "1",
      provider: "פרטנר",
      logo: "https://via.placeholder.com/80x40/00b8a8/ffffff?text=פרטנר",
      name: "פייבר עד 300 מגה",
      price: 90,
      speed: "עד 300Mbps",
      features: [
        "מהירות הורדה עד 300Mbps",
        "מהירות פריצות עד 30Mbps",
        'צרכי נתונים 25 ש"ח לחודש',
        "נתב WiFi 6 חינם",
        "שירות לקוחות 24/7",
        "התקנה חינם",
      ],
      isPopular: true,
    },
    {
      id: "2",
      provider: "פרטנר",
      logo: "https://via.placeholder.com/80x40/00b8a8/ffffff?text=פרטנר",
      name: "פייבר עד 600 מגה",
      price: 100,
      speed: "עד 600Mbps",
      features: [
        "מהירות הורדה עד 600Mbps",
        "מהירות פריצות עד 60Mbps",
        'צרכי נתונים 25 ש"ח לחודש',
        "נתב WiFi 6 מתקדם",
        "שירות לקוחות VIP",
        "התקנה מהירה",
      ],
    },
  ],
};

function ComparisonTable({
  service,
  onSwitchNow,
  onBack,
}: ComparisonTableProps) {
  const [activeCategory, setActiveCategory] = useState(
    service || "אינטרנט",
  ); // Default to internet category
  const [sortBy, setSortBy] = useState("price");
  const [priceRange, setPriceRange] = useState("all");

  const allPlans = mockPlans[activeCategory] || [];

  // Filter and sort plans
  const filteredPlans = allPlans
    .filter((plan) => {
      if (priceRange === "low") return plan.price < 100;
      if (priceRange === "medium")
        return plan.price >= 100 && plan.price < 200;
      if (priceRange === "high") return plan.price >= 200;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "priceDesc") return b.price - a.price;
      if (sortBy === "provider")
        return a.provider.localeCompare(b.provider);
      return 0;
    });

  const categories = [
    {
      id: "אינטרנט",
      name: "אינטרנט",
      count: mockPlans["אינטרנט"]?.length || 0,
    },
  ];

  // Remove service selection - go directly to comparison

  if (filteredPlans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          לא נמצאו תוכניות מתאימות לקריטריונים שנבחרו
        </p>
      </div>
    );
  }

  return (
    <section className="py-8 lg:py-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-white min-h-screen relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-32 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Back Button */}
        {onBack && (
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="group text-gray-600 hover:text-[var(--color-trust-blue)] px-4 py-2 transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>חזור</span>
            </Button>
          </div>
        )}

        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200/30 rounded-full px-6 py-3 mb-6">
            <div className="w-2 h-2 bg-[var(--color-trust-blue)] rounded-full animate-pulse"></div>
            <span className="text-[var(--color-trust-blue)] text-sm">
              השוואת מסלולים
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl mb-4 text-gray-900">
            <span className="bg-gradient-to-r from-[var(--color-trust-blue)] to-blue-600 bg-clip-text text-transparent">
              מסלולי אינטרנט
            </span>
            <br />
            <span className="text-gray-900">פרטנר פייבר</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            בחר מתוך {filteredPlans.length} מסלולי פייבר מהירים
            מפרטנר
          </p>
        </div>

        {/* Enhanced Filters */}
        <div className="mb-10">
          <Card className="glass border border-white/30 backdrop-blur-xl p-6 shadow-lg">
            <div className="flex flex-wrap gap-6 items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-trust-blue)] to-blue-600 rounded-xl flex items-center justify-center">
                    <Filter className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg text-[var(--color-trust-blue)] mb-1">
                      סינון וחיפוש
                    </h3>
                    <p className="text-sm text-gray-600">
                      מצא את המסלול המתאים לך
                    </p>
                  </div>
                </div>
                <Select
                  value={priceRange}
                  onValueChange={setPriceRange}
                >
                  <SelectTrigger className="w-48 h-10 text-sm glass border border-white/30 backdrop-blur-sm">
                    <SelectValue placeholder="טווח מחירים" />
                  </SelectTrigger>
                  <SelectContent className="glass backdrop-blur-xl border border-white/30">
                    <SelectItem value="all">
                      כל המחירים
                    </SelectItem>
                    <SelectItem value="low">עד ₪100</SelectItem>
                    <SelectItem value="medium">
                      ₪100-200
                    </SelectItem>
                    <SelectItem value="high">
                      מעל ₪200
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <ArrowUpDown className="w-5 h-5 text-[var(--color-trust-blue)]" />
                  <span className="text-gray-700">מיון:</span>
                </div>
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <SelectTrigger className="w-48 h-10 text-sm glass border border-white/30 backdrop-blur-sm">
                    <SelectValue placeholder="מיון לפי" />
                  </SelectTrigger>
                  <SelectContent className="glass backdrop-blur-xl border border-white/30">
                    <SelectItem value="price">
                      מחיר נמוך לגבוה
                    </SelectItem>
                    <SelectItem value="priceDesc">
                      מחיר גבוה לנמוך
                    </SelectItem>
                    <SelectItem value="provider">
                      שם ספק
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced Desktop Table View */}
        <div className="hidden lg:block">
          <Card className="glass border border-white/30 backdrop-blur-xl overflow-hidden shadow-xl rounded-2xl">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-blue-50/60 to-purple-50/40 border-b border-white/30">
                  <TableHead className="text-right py-5 px-6 text-[var(--color-trust-blue)]">
                    ספק
                  </TableHead>
                  <TableHead className="text-right py-5 px-6 text-[var(--color-trust-blue)]">
                    חבילה
                  </TableHead>
                  {activeCategory === "סלולר" && (
                    <TableHead className="text-right py-5 px-6 text-[var(--color-trust-blue)]">
                      נתונים
                    </TableHead>
                  )}
                  {activeCategory === "אינטרנט" && (
                    <TableHead className="text-right py-5 px-6 text-[var(--color-trust-blue)]">
                      מהירות
                    </TableHead>
                  )}
                  <TableHead className="text-right py-5 px-6 text-[var(--color-trust-blue)]">
                    מחיר
                  </TableHead>
                  <TableHead className="text-right py-5 px-6 text-[var(--color-trust-blue)]">
                    תכונות
                  </TableHead>
                  <TableHead className="text-right py-5 px-6 text-[var(--color-trust-blue)]">
                    פעולה
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan, index) => (
                  <TableRow
                    key={plan.id}
                    className={`group transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/30 border-b border-white/20 ${
                      plan.isPopular
                        ? "bg-gradient-to-r from-blue-50/60 to-purple-50/30"
                        : ""
                    }`}
                    style={{
                      animationDelay: `${(index + 1) * 100}ms`,
                    }}
                  >
                    <TableCell className="py-6 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={plan.logo}
                            alt={plan.provider}
                            className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
                          />
                          {plan.isPopular && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                              <Star className="w-2 h-2 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="text-lg text-gray-900">
                            {plan.provider}
                          </span>
                          {plan.isPopular && (
                            <Badge className="mr-2 bg-gradient-to-r from-[var(--color-trust-blue)] to-blue-600 text-white text-xs">
                              <Star className="w-2 h-2 mr-1" />
                              פופולרי
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-6">
                      <div>
                        <div className="text-lg text-gray-900 mb-2">
                          {plan.name}
                        </div>
                        {plan.discount && (
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs">
                            {plan.discount}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-6">
                      <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl px-4 py-2 inline-block">
                        <span className="text-base text-blue-700">
                          {plan.speed}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl text-[var(--color-trust-blue)] animate-pulse">
                            ₪{plan.price}
                          </span>
                          {plan.originalPrice && (
                            <span className="text-base text-gray-400 line-through">
                              ₪{plan.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-base text-gray-600">
                          לחודש
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-6">
                      <div className="space-y-2">
                        {plan.features
                          .slice(0, 3)
                          .map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-sm text-gray-700">
                                {feature}
                              </span>
                            </div>
                          ))}
                        {plan.features.length > 3 && (
                          <div className="bg-blue-50 rounded-lg px-3 py-1 inline-block">
                            <span className="text-xs text-blue-700">
                              +{plan.features.length - 3} תכונות
                              נוספות
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-6">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-trust-blue)] to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                        <Button
                          onClick={() => onSwitchNow(plan)}
                          className="relative bg-gradient-to-r from-[var(--color-trust-blue)] to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          עבור עכשיו
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Enhanced Mobile Card View */}
        <div className="lg:hidden space-y-6">
          {filteredPlans.map((plan, index) => (
            <Card
              key={plan.id}
              className={`group relative p-6 transition-all duration-500 overflow-hidden ${
                plan.isPopular
                  ? "border-2 border-[var(--color-trust-blue)] bg-gradient-to-br from-white via-white to-blue-50/50 shadow-xl"
                  : "glass border border-white/30 backdrop-blur-xl hover:shadow-xl hover:scale-102"
              }`}
              style={{
                animationDelay: `${(index + 1) * 150}ms`,
              }}
            >
              {/* Gradient overlay for popular plans */}
              {plan.isPopular && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
              )}

              {plan.isPopular && (
                <div className="relative mb-6">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 text-sm animate-pulse">
                    <Star className="w-3 h-3 mr-2" />
                    הכי פופולרי
                  </Badge>
                </div>
              )}

              <div className="relative flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={plan.logo}
                      alt={plan.provider}
                      className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
                    />
                    {plan.isPopular && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Star className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-base text-gray-600">
                      {plan.provider}
                    </p>
                    {plan.discount && (
                      <Badge className="mt-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs">
                        {plan.discount}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-3 justify-end mb-2">
                    <span className="text-3xl text-[var(--color-trust-blue)] animate-pulse">
                      ₪{plan.price}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        ₪{plan.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-base text-gray-600">
                    לחודש
                  </span>
                </div>
              </div>

              {plan.speed && (
                <div className="mb-6">
                  <div className="p-3 rounded-xl inline-block bg-gradient-to-r from-blue-100 to-cyan-100">
                    <span className="text-base text-blue-700">
                      מהירות: {plan.speed}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-3 mb-6">
                {plan.features
                  .slice(0, 4)
                  .map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >
                      <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-base text-gray-700">
                        {feature}
                      </span>
                    </div>
                  ))}
                {plan.features.length > 4 && (
                  <div className="bg-blue-50 rounded-xl px-3 py-2 inline-block">
                    <span className="text-sm text-blue-700">
                      +{plan.features.length - 4} תכונות נוספות
                    </span>
                  </div>
                )}
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-trust-blue)] to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                <Button
                  onClick={() => onSwitchNow(plan)}
                  className="relative w-full bg-gradient-to-r from-[var(--color-trust-blue)] to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-3">
                    עבור עכשיו - ₪{plan.price}/חודש
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const handleSwitchNow = (plan: Plan) => {
    console.log("Switch to plan:", plan);
  };

  return (
    <ComparisonTable 
      service="אינטרנט" 
      onSwitchNow={handleSwitchNow}
    />
  );
}
