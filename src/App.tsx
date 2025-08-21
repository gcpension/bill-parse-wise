import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Home } from "./pages/Home";
import { Analyze } from "./pages/Analyze";
import { Compare } from "./pages/Compare";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/Layout";

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
          <Layout>
            <ErrorBoundary fallbackMessage="שגיאה בטעינת העמוד">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/analyze" element={<Analyze />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/settings" element={<Settings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
