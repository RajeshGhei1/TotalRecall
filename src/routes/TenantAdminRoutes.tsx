
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/tenant-admin/Dashboard";
import Companies from "@/pages/tenant-admin/Companies";
import Contacts from "@/pages/tenant-admin/Contacts";
import Jobs from "@/pages/tenant-admin/Jobs";
import Talent from "@/pages/tenant-admin/Talent";
import ATS from "@/pages/tenant-admin/ATS";
import SmartTalentAnalytics from "@/pages/tenant-admin/SmartTalentAnalytics";
import Settings from "@/pages/tenant-admin/Settings";
import GeneralSettings from "@/pages/tenant-admin/settings/GeneralSettings";
import CustomFieldsSettings from "@/pages/tenant-admin/settings/CustomFieldsSettings";
import ApiSettings from "@/pages/tenant-admin/settings/ApiSettings";
import CommunicationSettings from "@/pages/tenant-admin/settings/CommunicationSettings";
import OutreachSettings from "@/pages/tenant-admin/settings/OutreachSettings";
import SocialMediaSettings from "@/pages/tenant-admin/settings/SocialMediaSettings";
import UnifiedModuleAccessGuard from "@/components/access-control/UnifiedModuleAccessGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      
      {/* Core Tenant Pages */}
      <Route path="dashboard" element={<Dashboard />} />
      
      {/* ATS Core Module Protected Routes */}
      <Route path="ats" element={
        <UnifiedModuleAccessGuard 
          moduleName="ATS Core" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <ATS />
        </UnifiedModuleAccessGuard>
      } />
      <Route path="jobs" element={
        <UnifiedModuleAccessGuard 
          moduleName="ATS Core" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <Jobs />
        </UnifiedModuleAccessGuard>
      } />
      <Route path="talent/*" element={
        <UnifiedModuleAccessGuard 
          moduleName="ATS Core" 
          tenantId={currentTenantId}
          userId={user?.id}
        >
          <Talent />
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
      
      {/* Settings */}
      <Route path="settings" element={<Settings />} />
      <Route path="settings/general" element={<GeneralSettings />} />
      <Route path="settings/custom-fields" element={<CustomFieldsSettings />} />
      <Route path="settings/api" element={<ApiSettings />} />
      <Route path="settings/communication" element={<CommunicationSettings />} />
      <Route path="settings/outreach" element={<OutreachSettings />} />
      <Route path="settings/social-media" element={<SocialMediaSettings />} />
    </Routes>
  );
};

export default TenantAdminRoutes;
