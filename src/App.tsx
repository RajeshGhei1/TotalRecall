
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantProvider } from "@/contexts/TenantContext";
import AuthGuard from "@/components/AuthGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import SuperAdminTenants from "./pages/superadmin/Tenants";
import SuperAdminSettings from "./pages/superadmin/Settings";
import SuperAdminUsers from "./pages/superadmin/Users";
import SuperAdminRevenue from "./pages/superadmin/Revenue";
import SuperAdminCompanies from "./pages/superadmin/Companies";
import SuperAdminAnalytics from "./pages/superadmin/Analytics";
import SuperAdminGlobalSettings from "./pages/superadmin/GlobalSettings";
import TenantAdminRoutes from "./routes/TenantAdminRoutes";
import Pricing from "./pages/Pricing";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <TenantProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/pricing" element={<Pricing />} />
                
                {/* Super Admin Routes */}
                <Route path="/superadmin/dashboard" element={
                  <AuthGuard requiresSuperAdmin={true}>
                    <SuperAdminDashboard />
                  </AuthGuard>
                } />
                <Route path="/superadmin/tenants" element={
                  <AuthGuard requiresSuperAdmin={true}>
                    <SuperAdminTenants />
                  </AuthGuard>
                } />
                <Route path="/superadmin/settings" element={
                  <AuthGuard requiresSuperAdmin={true}>
                    <SuperAdminSettings />
                  </AuthGuard>
                } />
                <Route path="/superadmin/users" element={
                  <AuthGuard requiresSuperAdmin={true}>
                    <SuperAdminUsers />
                  </AuthGuard>
                } />
                <Route path="/superadmin/revenue" element={
                  <AuthGuard requiresSuperAdmin={true}>
                    <SuperAdminRevenue />
                  </AuthGuard>
                } />
                <Route path="/superadmin/companies" element={
                  <AuthGuard requiresSuperAdmin={true}>
                    <SuperAdminCompanies />
                  </AuthGuard>
                } />
                <Route path="/superadmin/analytics" element={
                  <AuthGuard requiresSuperAdmin={true}>
                    <SuperAdminAnalytics />
                  </AuthGuard>
                } />
                <Route path="/superadmin/global-settings" element={
                  <AuthGuard requiresSuperAdmin={true}>
                    <SuperAdminGlobalSettings />
                  </AuthGuard>
                } />

                {/* Tenant Admin Routes */}
                <Route path="/tenant-admin/*" element={
                  <AuthGuard>
                    <TenantAdminRoutes />
                  </AuthGuard>
                } />
              </Routes>
            </TenantProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
