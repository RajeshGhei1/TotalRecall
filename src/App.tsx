
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
import SuperAdminAI from "./pages/superadmin/AI";
import SuperAdminAnalytics from "./pages/superadmin/Analytics";
import SuperAdminAudit from "./pages/superadmin/Audit";
import SuperAdminGlobalSettings from "./pages/superadmin/GlobalSettings";
import TenantAdminDashboard from "./pages/tenant-admin/Dashboard";
import TenantAdminATS from "./pages/tenant-admin/ATS";
import TenantAdminJobs from "./pages/tenant-admin/Jobs";
import TenantAdminTalent from "./pages/tenant-admin/Talent";
import TenantAdminCompanies from "./pages/tenant-admin/Companies";
import TenantAdminContacts from "./pages/tenant-admin/Contacts";
import TenantAdminIntelligentWorkflows from "./pages/tenant-admin/IntelligentWorkflows";
import TenantAdminSmartTalentAnalytics from "./pages/tenant-admin/SmartTalentAnalytics";
import TenantAdminSettings from "./pages/tenant-admin/Settings";
import TenantAdminPredictiveInsights from "./pages/tenant-admin/PredictiveInsights";
import LinkedInIntegrationPage from "./pages/tenant-admin/LinkedInIntegration";
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
                  <AuthGuard requiredRole="super_admin">
                    <SuperAdminDashboard />
                  </AuthGuard>
                } />
                <Route path="/superadmin/tenants" element={
                  <AuthGuard requiredRole="super_admin">
                    <SuperAdminTenants />
                  </AuthGuard>
                } />
                <Route path="/superadmin/settings" element={
                  <AuthGuard requiredRole="super_admin">
                    <SuperAdminSettings />
                  </AuthGuard>
                } />
                <Route path="/superadmin/users" element={
                  <AuthGuard requiredRole="super_admin">
                    <SuperAdminUsers />
                  </AuthGuard>
                } />
                <Route path="/superadmin/revenue" element={
                  <AuthGuard requiredRole="super_admin">
                    <SuperAdminRevenue />
                  </AuthGuard>
                } />
                <Route path="/superadmin/companies" element={
                  <AuthGuard requiredRole="super_admin">
                    <SuperAdminCompanies />
                  </AuthGuard>
                } />
                <Route path="/superadmin/ai" element={
                  <AuthGuard requiredRole="super_admin">
                    <SuperAdminAI />
                  </AuthGuard>
                } />
                <Route path="/superadmin/analytics" element={
                  <AuthGuard requiredRole="super_admin">
                    <SuperAdminAnalytics />
                  </AuthGuard>
                } />
                <Route path="/superadmin/audit" element={
                  <AuthGuard requiredRole="super_admin">
                    <SuperAdminAudit />
                  </AuthGuard>
                } />
                <Route path="/superadmin/global-settings" element={
                  <AuthGuard requiredRole="super_admin">
                    <SuperAdminGlobalSettings />
                  </AuthGuard>
                } />

                {/* Tenant Admin Routes */}
                <Route path="/tenant-admin/dashboard" element={
                  <AuthGuard requiredRole="tenant_admin">
                    <TenantAdminDashboard />
                  </AuthGuard>
                } />
                <Route path="/tenant-admin/ats" element={
                  <AuthGuard requiredRole="tenant_admin">
                    <TenantAdminATS />
                  </AuthGuard>
                } />
                <Route path="/tenant-admin/jobs" element={
                  <AuthGuard requiredRole="tenant_admin">
                    <TenantAdminJobs />
                  </AuthGuard>
                } />
                <Route path="/tenant-admin/talent" element={
                  <AuthGuard requiredRole="tenant_admin">
                    <TenantAdminTalent />
                  </AuthGuard>
                } />
                <Route path="/tenant-admin/companies" element={
                  <AuthGuard requiredRole="tenant_admin">
                    <TenantAdminCompanies />
                  </AuthGuard>
                } />
                <Route path="/tenant-admin/contacts" element={
                  <AuthGuard requiredRole="tenant_admin">
                    <TenantAdminContacts />
                  </AuthGuard>
                } />
                <Route path="/tenant-admin/linkedin-integration" element={
                  <AuthGuard requiredRole="tenant_admin">
                    <LinkedInIntegrationPage />
                  </AuthGuard>
                } />
                <Route path="/tenant-admin/intelligent-workflows" element={
                  <AuthGuard requiredRole="tenant_admin">
                    <TenantAdminIntelligentWorkflows />
                  </AuthGuard>
                } />
                <Route path="/tenant-admin/smart-talent-analytics" element={
                  <AuthGuard requiredRole="tenant_admin">
                    <TenantAdminSmartTalentAnalytics />
                  </AuthGuard>
                } />
                <Route path="/tenant-admin/settings" element={
                  <AuthGuard requiredRole="tenant_admin">
                    <TenantAdminSettings />
                  </AuthGuard>
                } />
                <Route path="/tenant-admin/predictive-insights" element={
                  <AuthGuard requiredRole="tenant_admin">
                    <TenantAdminPredictiveInsights />
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
