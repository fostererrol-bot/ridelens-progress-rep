import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import ImportScreenshots from "@/pages/ImportScreenshots";
import HistoryPage from "@/pages/HistoryPage";
import TrendsPage from "@/pages/TrendsPage";
import SettingsPage from "@/pages/SettingsPage";
import DisclaimerPage from "@/pages/DisclaimerPage";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/import" element={<ImportScreenshots />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/trends" element={<TrendsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
