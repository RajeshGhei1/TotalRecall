
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

const TenantAdminRoutes = () => {
  return (
    <Routes>
      {/* Default redirect to dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />
      
      {/* Core Tenant Pages */}
      <Route path="dashboard" element={<Dashboard />} />
      
      {/* Talent Management */}
      <Route path="ats" element={<ATS />} />
      <Route path="jobs" element={<Jobs />} />
      <Route path="talent" element={<Talent />} />
      <Route path="smart-talent-analytics" element={<SmartTalentAnalytics />} />
      
      {/* Business Management */}
      <Route path="companies" element={<Companies />} />
      <Route path="contacts" element={<Contacts />} />
      
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
