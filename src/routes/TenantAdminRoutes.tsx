
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/tenant-admin/Dashboard";
import Companies from "@/pages/tenant-admin/Companies";
import Contacts from "@/pages/tenant-admin/Contacts";
import SmartTalentAnalytics from "@/pages/tenant-admin/SmartTalentAnalytics";
import Settings from "@/pages/tenant-admin/Settings";
import GeneralSettings from "@/pages/tenant-admin/settings/GeneralSettings";
import CustomFieldsSettings from "@/pages/tenant-admin/settings/CustomFieldsSettings";
import ApiSettings from "@/pages/tenant-admin/settings/ApiSettings";
import CommunicationSettings from "@/pages/tenant-admin/settings/CommunicationSettings";
import OutreachSettings from "@/pages/tenant-admin/settings/OutreachSettings";
import SocialMediaSettings from "@/pages/tenant-admin/settings/SocialMediaSettings";
import IntelligentWorkflowsPage from "@/components/workflow/IntelligentWorkflowsPage";
import UnifiedModuleAccessGuard from "@/components/access-control/UnifiedModuleAccessGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PredictiveInsights from "@/pages/tenant-admin/PredictiveInsights";
import LinkedInIntegrationPage from "@/pages/tenant-admin/LinkedInIntegration";
import SmartTalentMatcher from "@/components/talent-matching/SmartTalentMatcher";
import AdminLayout from "@/components/AdminLayout";
import UpgradePlan from "@/pages/tenant-admin/UpgradePlan";
import ATSRoutes from "@/routes/ats/ATSRoutes";
import TalentDatabase from "@/modules/talent-database";

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
      {/* Default redirect to dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />
      
      {/* Core Dashboard - Now Module Protected */}
      <Route path="dashboard" element={
        <UnifiedModuleAccessGuard 
          moduleName="Dashboard Analytics" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <Dashboard />
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Intelligent Workflows - Now Module Protected */}
      <Route path="intelligent-workflows" element={
        <UnifiedModuleAccessGuard 
          moduleName="Workflow Management" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <IntelligentWorkflowsPage />
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Predictive Insights - Now Module Protected */}
      <Route path="predictive-insights" element={
        <UnifiedModuleAccessGuard 
          moduleName="Predictive Insights" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <PredictiveInsights />
        </UnifiedModuleAccessGuard>
      } />
      
      {/* LinkedIn Integration Module Protected Route */}
      <Route path="linkedin-integration" element={
        <UnifiedModuleAccessGuard 
          moduleName="LinkedIn Integration" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <LinkedInIntegrationPage />
        </UnifiedModuleAccessGuard>
      } />
      
      {/* ATS Core Module Protected Routes - Now with comprehensive sub-routes */}
      <Route path="ats/*" element={
        <UnifiedModuleAccessGuard 
          moduleName="ATS Core" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <ATSRoutes />
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Talent Database - Advanced Module Protected Route */}
      <Route path="talent-database" element={
        <UnifiedModuleAccessGuard 
          moduleName="Talent Database" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <AdminLayout>
            <div className="p-6">
              <TalentDatabase view="search" showFilters={true} allowAdd={true} />
            </div>
          </AdminLayout>
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Legacy ATS routes - redirect to new structure */}
      <Route path="jobs" element={<Navigate to="ats/jobs" replace />} />
      <Route path="talent/*" element={<Navigate to="ats/talent" replace />} />
      
      {/* Smart Talent Matching - AI Feature */}
      <Route path="smart-talent-matching" element={
        <UnifiedModuleAccessGuard 
          moduleName="ATS Core" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <AdminLayout>
            <div className="p-6">
              <SmartTalentMatcher />
            </div>
          </AdminLayout>
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Companies Database Module Protected Routes */}
      <Route path="companies" element={
        <UnifiedModuleAccessGuard 
          moduleName="company_data_access" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <Companies />
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Business Contact Database Module Protected Routes */}
      <Route path="contacts" element={
        <UnifiedModuleAccessGuard 
          moduleName="business_contacts_data_access" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <Contacts />
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Smart Talent Analytics - separate module */}
      <Route path="smart-talent-analytics" element={
        <UnifiedModuleAccessGuard 
          moduleName="smart_talent_analytics" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <SmartTalentAnalytics />
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Settings - Now Module Protected */}
      <Route path="settings" element={
        <UnifiedModuleAccessGuard 
          moduleName="User Management" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <Settings />
        </UnifiedModuleAccessGuard>
      } />
      <Route path="settings/general" element={
        <UnifiedModuleAccessGuard 
          moduleName="User Management" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <GeneralSettings />
        </UnifiedModuleAccessGuard>
      } />
      <Route path="settings/custom-fields" element={
        <UnifiedModuleAccessGuard 
          moduleName="User Management" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <CustomFieldsSettings />
        </UnifiedModuleAccessGuard>
      } />
      <Route path="settings/api" element={
        <UnifiedModuleAccessGuard 
          moduleName="User Management" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <ApiSettings />
        </UnifiedModuleAccessGuard>
      } />
      <Route path="settings/communication" element={
        <UnifiedModuleAccessGuard 
          moduleName="User Management" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <CommunicationSettings />
        </UnifiedModuleAccessGuard>
      } />
      <Route path="settings/outreach" element={
        <UnifiedModuleAccessGuard 
          moduleName="User Management" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <OutreachSettings />
        </UnifiedModuleAccessGuard>
      } />
      <Route path="settings/social-media" element={
        <UnifiedModuleAccessGuard 
          moduleName="User Management" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <SocialMediaSettings />
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Upgrade Plan - Always accessible */}
      <Route path="upgrade" element={<UpgradePlan />} />
    </Routes>
  );
};

export default TenantAdminRoutes;
