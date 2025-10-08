import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  Zap
} from "lucide-react";

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navigationItems: NavigationItem[] = [
  { label: "דף הבית", href: "/", icon: Home },
  { label: "מגזין", href: "/magazine", icon: BookOpen },
  { label: "טיפים", href: "/tips", icon: Lightbulb },
  { label: "כל המסלולים", href: "/all-plans", icon: List },
  { label: "אודות", href: "/about", icon: Info },
  { label: "צור קשר", href: "/contact", icon: MessageCircle }
];

export const EnhancedNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPath = window.location.pathname;

  return (
    <nav className="bg-gray-50 border-b border-gray-200 py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center group">
            <h1 className="text-3xl font-bold text-purple-600 font-heebo transition-all duration-200 group-hover:text-purple-700">
              EasySwitch
            </h1>
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href || 
                (item.href !== '/' && currentPath.startsWith(item.href));
              
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-base font-medium font-heebo transition-all duration-200 group",
                    isActive
                      ? "text-purple-600"
                      : "text-gray-600 hover:text-purple-600"
                  )}
                >
                  <span className="relative">
                    {item.label}
                    {/* Underline animation */}
                    <span className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-purple-600 transition-all duration-200",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )} />
                  </span>
                </a>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href ||
                  (item.href !== '/' && currentPath.startsWith(item.href));
                
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg font-medium font-heebo transition-all duration-200",
                      isActive
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:text-purple-600 hover:bg-gray-100"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
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