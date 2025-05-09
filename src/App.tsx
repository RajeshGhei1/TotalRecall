
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/superadmin/Dashboard";
import Tenants from "./pages/superadmin/Tenants";
import Users from "./pages/superadmin/Users";
import Settings from "./pages/superadmin/Settings";
import Talents from "./pages/superadmin/Talents";
import TenantAdminDashboard from "./pages/tenant-admin/Dashboard";
import TenantAdminUsers from "./pages/tenant-admin/Users";
import TenantAdminSettings from "./pages/tenant-admin/Settings";
import TenantAdminTalent from "./pages/tenant-admin/Talent";
import TenantAdminJobs from "./pages/tenant-admin/Jobs";
import TenantAdminCompanies from "./pages/tenant-admin/Companies";
import AuthGuard from "./components/AuthGuard";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<Index />} />
            
            {/* Auth Route */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Superadmin Routes with Authentication Guard */}
            <Route
              path="/superadmin/dashboard"
              element={
                <AuthGuard requiresSuperAdmin={true}>
                  <Dashboard />
                </AuthGuard>
              }
            />
            <Route
              path="/superadmin/tenants"
              element={
                <AuthGuard requiresSuperAdmin={true}>
                  <Tenants />
                </AuthGuard>
              }
            />
            <Route
              path="/superadmin/users"
              element={
                <AuthGuard requiresSuperAdmin={true}>
                  <Users />
                </AuthGuard>
              }
            />
            <Route
              path="/superadmin/talents"
              element={
                <AuthGuard requiresSuperAdmin={true}>
                  <Talents />
                </AuthGuard>
              }
            />
            <Route
              path="/superadmin/settings"
              element={
                <AuthGuard requiresSuperAdmin={true}>
                  <Settings />
                </AuthGuard>
              }
            />
            
            {/* Tenant Admin Routes with Authentication Guard */}
            <Route
              path="/tenant-admin/dashboard"
              element={
                <AuthGuard>
                  <TenantAdminDashboard />
                </AuthGuard>
              }
            />
            <Route
              path="/tenant-admin/users"
              element={
                <AuthGuard>
                  <TenantAdminUsers />
                </AuthGuard>
              }
            />
            
            {/* Talent Management Routes */}
            <Route
              path="/tenant-admin/talent"
              element={
                <AuthGuard>
                  <TenantAdminTalent />
                </AuthGuard>
              }
            />
            <Route
              path="/tenant-admin/talent/:action"
              element={
                <AuthGuard>
                  <TenantAdminTalent />
                </AuthGuard>
              }
            />
            <Route
              path="/tenant-admin/talent/:action/:id"
              element={
                <AuthGuard>
                  <TenantAdminTalent />
                </AuthGuard>
              }
            />
            
            {/* Companies Routes */}
            <Route
              path="/tenant-admin/companies"
              element={
                <AuthGuard>
                  <TenantAdminCompanies />
                </AuthGuard>
              }
            />
            <Route
              path="/tenant-admin/companies/:action"
              element={
                <AuthGuard>
                  <TenantAdminCompanies />
                </AuthGuard>
              }
            />
            <Route
              path="/tenant-admin/companies/:action/:id"
              element={
                <AuthGuard>
                  <TenantAdminCompanies />
                </AuthGuard>
              }
            />
            
            <Route
              path="/tenant-admin/jobs"
              element={
                <AuthGuard>
                  <TenantAdminJobs />
                </AuthGuard>
              }
            />
            <Route
              path="/tenant-admin/settings"
              element={
                <AuthGuard>
                  <TenantAdminSettings />
                </AuthGuard>
              }
            />
            
            {/* Redirect old admin routes to tenant-admin for backward compatibility */}
            <Route path="/admin/dashboard" element={<Navigate to="/tenant-admin/dashboard" replace />} />
            <Route path="/admin/tenants" element={<Navigate to="/tenant-admin/dashboard" replace />} />
            <Route path="/admin/users" element={<Navigate to="/tenant-admin/users" replace />} />
            <Route path="/admin/settings" element={<Navigate to="/tenant-admin/settings" replace />} />
            
            {/* Redirect tenant-admin/tenants to dashboard since it's no longer needed */}
            <Route path="/tenant-admin/tenants" element={<Navigate to="/tenant-admin/dashboard" replace />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
