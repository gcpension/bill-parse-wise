import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  BarChart3, 
  Calculator, 
  BookmarkCheck, 
  HelpCircle, 
  Settings, 
  Zap,
  TrendingDown,
  Star,
  Clock
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const mainMenuItems = [
  { title: "עמוד הבית", url: "/", icon: Home },
  { title: "ניתוח חכם", url: "/analyze", icon: Calculator },
  { title: "השוואה מהירה", url: "/compare", icon: BarChart3 },
  { title: "השוואות שמורות", url: "/saved", icon: BookmarkCheck },
];

const helpMenuItems = [
  { title: "עזרה ו-FAQ", url: "/help", icon: HelpCircle },
  { title: "הגדרות", url: "/settings", icon: Settings },
];

const statsItems = [
  { title: "₪2,400 חיסכון ממוצע", icon: TrendingDown, color: "text-success" },
  { title: "50,000+ משפחות", icon: Star, color: "text-primary" },
  { title: "15 דק׳ תהליך", icon: Clock, color: "text-primary-glow" },
];

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `transition-all duration-200 ${
      isActive 
        ? "bg-primary text-primary-foreground font-medium shadow-md" 
        : "hover:bg-accent hover:text-accent-foreground"
    }`;

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-72"} transition-all duration-300 border-r bg-gradient-to-b from-background via-accent/5 to-background`}
      collapsible
    >
      <SidebarContent className="p-2">
        {/* Header */}
        {!collapsed && (
          <div className="p-4 mb-4 bg-gradient-to-r from-primary/10 to-primary-glow/5 rounded-xl border">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-2 bg-primary rounded-lg">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold gradient-primary bg-clip-text text-transparent">
                  חוסכים חכם
                </h2>
                <p className="text-xs text-muted-foreground">המערכת לחיסכון בבית</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            ניווט ראשי
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12 mb-1">
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className={`h-5 w-5 ${collapsed ? "mx-auto" : "ml-2"}`} />
                      {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Stats Section - only when expanded */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>נתונים מהירים</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2">
                {statsItems.map((stat, index) => (
                  <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-accent/30 rounded-lg">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    <span className="text-xs font-medium">{stat.title}</span>
                  </div>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Help Section */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            עזרה
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {helpMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className={`h-4 w-4 ${collapsed ? "mx-auto" : "ml-2"}`} />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Action - only when expanded */}
        {!collapsed && (
          <div className="mt-auto p-4 bg-gradient-to-r from-success/10 to-primary/5 rounded-xl border">
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="text-xs">
                💡 טיפ
              </Badge>
              <p className="text-xs text-muted-foreground">
                העלה חשבונית עכשיו וגלה כמה תוכל לחסוך!
              </p>
              <NavLink to="/analyze">
                <button className="w-full bg-primary text-primary-foreground text-xs py-2 px-3 rounded-lg hover:bg-primary/90 transition-colors">
                  התחל עכשיו
                </button>
              </NavLink>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}