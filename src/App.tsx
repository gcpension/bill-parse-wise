import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Magazine from "./pages/Magazine";
import Tips from "./pages/Tips";
import { Settings } from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import { Analyze } from "./pages/Analyze";
import { ProviderSwitch } from "./pages/ProviderSwitch";
import ResultsPreview from "./pages/ResultsPreview";
import SwitchWizard from "./pages/SwitchWizard";
import RequestStatus from "./pages/RequestStatus";
import AllPlans from "./pages/AllPlans";
import ServiceRequest from "./pages/ServiceRequest";
import IntegrationTestPage from "./components/IntegrationTestPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAuth from "./pages/AdminAuth";
import AdminReports from "./pages/AdminReports";
import CustomerRequestStatus from "./pages/CustomerRequestStatus";
import { AdminRoute } from "./components/AdminRoute";

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
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/magazine" element={<Magazine />} />
              <Route path="/tips" element={<Tips />} />
              <Route path="/analyze" element={<Analyze />} />
              <Route path="/results-preview" element={<ResultsPreview />} />
              <Route path="/switch-wizard" element={<SwitchWizard />} />
              {/* Plans routes */}
              <Route path="/all-plans" element={<AllPlans />} />
              <Route path="/plans" element={<AllPlans />} />
              <Route path="/plans/all" element={<AllPlans />} />
              <Route path="/service-request" element={<ServiceRequest />} />
              <Route path="/request-status/:requestId?" element={<RequestStatus />} />
              {/* Customer status tracking */}
              <Route path="/track-request" element={<CustomerRequestStatus />} />
              <Route path="/my-request" element={<CustomerRequestStatus />} />
              <Route
                path="/switch/:category"
                element={<ProviderSwitch />}
              />
              <Route path="/help" element={<Help />} />
              <Route path="/settings" element={<Settings />} />
              {/* Admin routes */}
              <Route path="/admin-login" element={<AdminAuth />} />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/reports" element={
                <AdminRoute>
                  <AdminReports />
                </AdminRoute>
              } />
              <Route path="/integration-test" element={<IntegrationTestPage />} />
              {/* Redirect old routes to analyze */}
              <Route path="/dashboard" element={<Navigate to="/analyze" replace />} />
              <Route path="/compare" element={<Navigate to="/analyze" replace />} />
              <Route path="/forms/:category" element={<Navigate to="/analyze" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
