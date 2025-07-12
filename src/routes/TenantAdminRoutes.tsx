
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import UnifiedModuleAccessGuard from "@/components/access-control/UnifiedModuleAccessGuard";
import AdminLayout from "@/components/AdminLayout";

// Lazy load pages to reduce initial bundle size
const Dashboard = React.lazy(() => import("@/pages/tenant-admin/Dashboard"));
const Companies = React.lazy(() => import("@/pages/tenant-admin/Companies"));
const Contacts = React.lazy(() => import("@/pages/tenant-admin/Contacts"));
const SmartTalentAnalytics = React.lazy(() => import("@/pages/tenant-admin/SmartTalentAnalytics"));
const Settings = React.lazy(() => import("@/pages/tenant-admin/Settings"));
const GeneralSettings = React.lazy(() => import("@/pages/tenant-admin/settings/GeneralSettings"));
const CustomFieldsSettings = React.lazy(() => import("@/pages/tenant-admin/settings/CustomFieldsSettings"));
const ApiSettings = React.lazy(() => import("@/pages/tenant-admin/settings/ApiSettings"));
const CommunicationSettings = React.lazy(() => import("@/pages/tenant-admin/settings/CommunicationSettings"));
const OutreachSettings = React.lazy(() => import("@/pages/tenant-admin/settings/OutreachSettings"));
const SocialMediaSettings = React.lazy(() => import("@/pages/tenant-admin/settings/SocialMediaSettings"));
const IntelligentWorkflowsPage = React.lazy(() => import("@/components/workflow/IntelligentWorkflowsPage"));
const PredictiveInsights = React.lazy(() => import("@/pages/tenant-admin/PredictiveInsights"));
const LinkedInIntegrationPage = React.lazy(() => import("@/pages/tenant-admin/LinkedInIntegration"));
const SmartTalentMatcher = React.lazy(() => import("@/components/talent-matching/SmartTalentMatcher"));
const UpgradePlan = React.lazy(() => import("@/pages/tenant-admin/UpgradePlan"));
const ATSRoutes = React.lazy(() => import("@/routes/ats/ATSRoutes"));
const TalentDatabase = React.lazy(() => import("@/modules/talent-database"));

// Loading component for lazy-loaded routes
const RouteLoading = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
      <p>Loading...</p>
    </div>
  </div>
);

// Wrapper component for lazy-loaded routes with Suspense
const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<RouteLoading />}>
    {children}
  </Suspense>
);

// Smart redirect component for intelligent default routing
const SmartTenantRedirect: React.FC = () => {
  const { user, bypassAuth } = useAuth();

  const { data: tenantData } = useQuery({
    queryKey: ['currentTenantData', user?.id],
    queryFn: async () => {
      if (bypassAuth) {
        return { tenant_id: 'mock-tenant-id' };
      }
      
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_tenants')
        .select('tenant_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user || bypassAuth,
  });

  const currentTenantId = tenantData?.tenant_id || null;

  // Check available modules and redirect to the first available one
  if (currentTenantId) {
    // For now, redirect to settings (always accessible) until we can determine the best available module
    return <Navigate to="settings" replace />;
  }

  return <Navigate to="upgrade" replace />;
};

const TenantAdminRoutes = () => {
  const { user, bypassAuth } = useAuth();

  // Get current tenant ID for module access checks
  const { data: tenantData } = useQuery({
    queryKey: ['currentTenantData', user?.id],
    queryFn: async () => {
      if (bypassAuth) {
        return { tenant_id: 'mock-tenant-id' };
      }
      
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_tenants')
        .select('tenant_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user || bypassAuth,
  });

  const currentTenantId = tenantData?.tenant_id || null;

  return (
    <Routes>
      {/* Smart default redirect - no longer requires Core Dashboard */}
      <Route index element={<SmartTenantRedirect />} />
      
      {/* Core Dashboard - Now Optional Module Protected */}
      <Route path="dashboard" element={
        <UnifiedModuleAccessGuard 
          moduleName="core_dashboard" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <LazyRoute>
            <Dashboard />
          </LazyRoute>
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Intelligent Workflows - Independent Module */}
      <Route path="intelligent-workflows" element={
        <UnifiedModuleAccessGuard 
          moduleName="workflow_management" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <LazyRoute>
            <IntelligentWorkflowsPage />
          </LazyRoute>
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Predictive Insights - Independent Module */}
      <Route path="predictive-insights" element={
        <UnifiedModuleAccessGuard 
          moduleName="predictive_insights" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <LazyRoute>
            <PredictiveInsights />
          </LazyRoute>
        </UnifiedModuleAccessGuard>
      } />
      
      {/* LinkedIn Integration - Independent Module */}
      <Route path="linkedin-integration" element={
        <UnifiedModuleAccessGuard 
          moduleName="linkedin_integration" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <LazyRoute>
            <LinkedInIntegrationPage />
          </LazyRoute>
        </UnifiedModuleAccessGuard>
      } />
      
      {/* ATS Core - Fully Independent with Complete Sub-routes */}
      <Route path="ats/*" element={
        <UnifiedModuleAccessGuard 
          moduleName="ats_core" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <LazyRoute>
            <ATSRoutes />
          </LazyRoute>
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Talent Database - Independent Module */}
      <Route path="talent-database" element={
        <UnifiedModuleAccessGuard 
          moduleName="talent_database" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <AdminLayout>
            <div className="p-6">
              <LazyRoute>
                <TalentDatabase view="search" showFilters={true} allowAdd={true} />
              </LazyRoute>
            </div>
          </AdminLayout>
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Legacy ATS routes - redirect to new structure */}
      <Route path="jobs" element={<Navigate to="ats/jobs" replace />} />
      <Route path="talent/*" element={<Navigate to="ats/talent" replace />} />
      
      {/* Smart Talent Matching - ATS Feature */}
      <Route path="smart-talent-matching" element={
        <UnifiedModuleAccessGuard 
          moduleName="ats_core" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <AdminLayout>
            <div className="p-6">
              <LazyRoute>
                <SmartTalentMatcher />
              </LazyRoute>
            </div>
          </AdminLayout>
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Companies - Independent Module (Fixed naming) */}
      <Route path="companies" element={
        <UnifiedModuleAccessGuard 
          moduleName="companies" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <LazyRoute>
            <Companies />
          </LazyRoute>
        </UnifiedModuleAccessGuard>
      } />
      
      {/* People/Contacts - Independent Module (Fixed naming) */}
      <Route path="contacts" element={
        <UnifiedModuleAccessGuard 
          moduleName="people" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <LazyRoute>
            <Contacts />
          </LazyRoute>
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Smart Talent Analytics - Independent Module (No Core Dashboard dependency) */}
      <Route path="smart-talent-analytics" element={
        <UnifiedModuleAccessGuard 
          moduleName="smart_talent_analytics" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <LazyRoute>
            <SmartTalentAnalytics />
          </LazyRoute>
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Settings - Always Accessible (No Module Protection) */}
      <Route path="settings" element={
        <LazyRoute>
          <Settings />
        </LazyRoute>
      } />
      <Route path="settings/general" element={
        <LazyRoute>
          <GeneralSettings />
        </LazyRoute>
      } />
      <Route path="settings/custom-fields" element={
        <LazyRoute>
          <CustomFieldsSettings />
        </LazyRoute>
      } />
      <Route path="settings/api" element={
        <LazyRoute>
          <ApiSettings />
        </LazyRoute>
      } />
      <Route path="settings/communication" element={
        <LazyRoute>
          <CommunicationSettings />
        </LazyRoute>
      } />
      <Route path="settings/outreach" element={
        <LazyRoute>
          <OutreachSettings />
        </LazyRoute>
      } />
      <Route path="settings/social-media" element={
        <LazyRoute>
          <SocialMediaSettings />
        </LazyRoute>
      } />
      
      {/* Upgrade Plan - Always accessible */}
      <Route path="upgrade" element={
        <LazyRoute>
          <UpgradePlan />
        </LazyRoute>
      } />
    </Routes>
  );
};

export default TenantAdminRoutes;
