import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Home, 
  List, 
  Settings, 
  BookOpen, 
  Lightbulb, 
  Info, 
  MessageCircle,
  Menu,
  X,
  Sparkles
} from "lucide-react";

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    label: "דף הבית",
    href: "/",
    icon: <Home className="w-4 h-4" />
  },
  {
    label: "כל המסלולים",
    href: "/all-plans",
    icon: <List className="w-4 h-4" />,
    badge: "חדש"
  },
  {
    label: "בקשת שירות",
    href: "/service-request",
    icon: <Settings className="w-4 h-4" />
  },
  {
    label: "מגזין",
    href: "/magazine",
    icon: <BookOpen className="w-4 h-4" />
  },
  {
    label: "טיפים",
    href: "/tips",
    icon: <Lightbulb className="w-4 h-4" />
  },
  {
    label: "אודות",
    href: "/about",
    icon: <Info className="w-4 h-4" />
  },
  {
    label: "צור קשר",
    href: "/contact",
    icon: <MessageCircle className="w-4 h-4" />
  }
];

export const EnhancedNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPath = window.location.pathname;

  return (
    <nav className="bg-white/90 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-heebo">
                EasySwitch
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 font-heebo",
                    isActive
                      ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-sm"
                      : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-0 h-5">
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
                  )}
                </a>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-purple-600"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 py-4 bg-white/95 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-2">
              {navigationItems.map((item) => {
                const isActive = currentPath === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-heebo transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700"
                        : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-1 py-0 h-4 text-[10px]">
                        {item.badge}
                      </Badge>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};