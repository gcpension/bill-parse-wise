import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { Home } from "./pages/Home";
import { Analyze } from "./pages/Analyze";
import { Compare } from "./pages/Compare";
import { Settings } from "./pages/Settings";
import { SavedComparisons } from "./pages/SavedComparisons";
import { Help } from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary fallbackMessage="אירעה שגיאה במערכת השוואת הספקים">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter 
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
              <AppSidebar />
              
              <div className="flex-1 flex flex-col">
                {/* Global Header with Sidebar Trigger */}
                <header className="h-12 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 px-4">
                  <SidebarTrigger className="lg:hidden" />
                  <div className="flex items-center space-x-2 rtl:space-x-reverse lg:hidden">
                    <div className="p-1 bg-primary rounded">
                      <div className="w-4 h-4 bg-primary-foreground/20 rounded" />
                    </div>
                    <span className="font-semibold text-sm">חוסכים חכם</span>
                  </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                  <div className="container mx-auto px-4 py-6 max-w-7xl">
                    <ErrorBoundary fallbackMessage="שגיאה בטעינת העמוד">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/analyze" element={<Analyze />} />
                        <Route path="/compare" element={<Compare />} />
                        <Route path="/saved" element={<SavedComparisons />} />
                        <Route path="/help" element={<Help />} />
                        <Route path="/settings" element={<Settings />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </ErrorBoundary>
                  </div>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
