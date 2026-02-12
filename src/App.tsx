import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import ImportScreenshots from "@/pages/ImportScreenshots";
import HistoryPage from "@/pages/HistoryPage";
import TrendsPage from "@/pages/TrendsPage";
import SettingsPage from "@/pages/SettingsPage";
import DisclaimerPage from "@/pages/DisclaimerPage";
import HowToUsePage from "@/pages/HowToUsePage";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import AppStoreMetadataPage from "@/pages/AppStoreMetadataPage";
import InstallPage from "@/pages/InstallPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
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
            <Route path="/how-to-use" element={<HowToUsePage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/app-store-metadata" element={<AppStoreMetadataPage />} />
            <Route path="/install" element={<InstallPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
