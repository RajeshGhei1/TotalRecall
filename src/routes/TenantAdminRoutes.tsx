
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
import { useCurrentTenant } from "@/hooks/useCurrentTenant";
import PredictiveInsights from "@/pages/tenant-admin/PredictiveInsights";
import LinkedInIntegrationPage from "@/pages/tenant-admin/LinkedInIntegration";
import SmartTalentMatcher from "@/components/talent-matching/SmartTalentMatcher";
import AdminLayout from "@/components/AdminLayout";
import UpgradePlan from "@/pages/tenant-admin/UpgradePlan";
import ATSRoutes from "@/routes/ats/ATSRoutes";
import TalentDatabase from "@/modules/talent-database";

// Smart redirect component for intelligent default routing
const SmartTenantRedirect: React.FC = () => {
  const { data: tenantData } = useCurrentTenant();
  const currentTenantId = tenantData?.tenant_id || null;

  // Check available modules and redirect to the first available one
  if (currentTenantId) {
    // For now, redirect to settings (always accessible) until we can determine the best available module
    return <Navigate to="settings" replace />;
  }

  return <Navigate to="upgrade" replace />;
};

const TenantAdminRoutes = () => {
  const { user } = useAuth();
  const { data: tenantData } = useCurrentTenant();
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
          <Dashboard />
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Intelligent Workflows - Independent Module */}
      <Route path="intelligent-workflows" element={
        <UnifiedModuleAccessGuard 
          moduleName="workflow_management" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <IntelligentWorkflowsPage />
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Predictive Insights - Independent Module */}
      <Route path="predictive-insights" element={
        <UnifiedModuleAccessGuard 
          moduleName="predictive_insights" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <PredictiveInsights />
        </UnifiedModuleAccessGuard>
      } />
      
      {/* LinkedIn Integration - Independent Module */}
      <Route path="linkedin-integration" element={
        <UnifiedModuleAccessGuard 
          moduleName="linkedin_integration" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <LinkedInIntegrationPage />
        </UnifiedModuleAccessGuard>
      } />
      
      {/* ATS Core - Fully Independent with Complete Sub-routes */}
      <Route path="ats/*" element={
        <UnifiedModuleAccessGuard 
          moduleName="ats_core" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <ATSRoutes />
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
              <TalentDatabase view="search" showFilters={true} allowAdd={true} />
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
              <SmartTalentMatcher />
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
          <Companies />
        </UnifiedModuleAccessGuard>
      } />
      
      {/* People/Contacts - Independent Module (Fixed naming) */}
      <Route path="contacts" element={
        <UnifiedModuleAccessGuard 
          moduleName="people" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <Contacts />
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Smart Talent Analytics - Independent Module (No Core Dashboard dependency) */}
      <Route path="smart-talent-analytics" element={
        <UnifiedModuleAccessGuard 
          moduleName="smart_talent_analytics" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <SmartTalentAnalytics />
        </UnifiedModuleAccessGuard>
      } />
      
      {/* Settings - Always Accessible (No Module Protection) */}
      <Route path="settings" element={<Settings />} />
      <Route path="settings/general" element={<GeneralSettings />} />
      <Route path="settings/custom-fields" element={<CustomFieldsSettings />} />
      <Route path="settings/api" element={<ApiSettings />} />
      <Route path="settings/communication" element={<CommunicationSettings />} />
      <Route path="settings/outreach" element={<OutreachSettings />} />
      <Route path="settings/social-media" element={<SocialMediaSettings />} />
      
      {/* Upgrade Plan - Always accessible */}
      <Route path="upgrade" element={<UpgradePlan />} />
    </Routes>
  );
};

export default TenantAdminRoutes;
