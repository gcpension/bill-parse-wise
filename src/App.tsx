import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Home from "./pages/Home";
import { Forms } from "./pages/Forms";
import { Settings } from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import { Analyze } from "./pages/Analyze";
import { DetailedCompareProviders } from "./pages/DetailedCompareProviders";
import { ProviderSwitch } from "./pages/ProviderSwitch";
import { Dashboard } from "./components/Dashboard";
import ResultsPreview from "./pages/ResultsPreview";
import SwitchWizard from "./pages/SwitchWizard";
import RequestStatus from "./pages/RequestStatus";
// Import the newly created AllPlans page
import AllPlans from "./pages/AllPlans";

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
            v7_relativeSplatPath: true,
          }}
        >
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/forms/:category" element={<Forms />} />
              <Route path="/analyze" element={<Analyze />} />
              <Route path="/results-preview" element={<ResultsPreview />} />
              <Route path="/switch-wizard" element={<SwitchWizard />} />
              {/* Plans routes */}
              <Route path="/all-plans" element={<AllPlans />} />
              <Route path="/plans" element={<AllPlans />} />
              <Route path="/plans/all" element={<AllPlans />} />
              <Route path="/request-status/:requestId?" element={<RequestStatus />} />
              <Route
                path="/compare"
                element={<Navigate to="/analyze" replace />}
              />
              <Route
                path="/switch/:category"
                element={<ProviderSwitch />}
              />
              <Route path="/help" element={<Help />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
