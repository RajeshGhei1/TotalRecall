
import { Routes, Route } from "react-router-dom";
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
import SetupWizard from "@/pages/tenant-admin/settings/SetupWizard";

const TenantAdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="ats" element={<ATS />} />
      <Route path="jobs" element={<Jobs />} />
      <Route path="talent" element={<Talent />} />
      <Route path="companies" element={<Companies />} />
      <Route path="contacts" element={<Contacts />} />
      <Route path="smart-talent-analytics" element={<SmartTalentAnalytics />} />
      <Route path="settings" element={<Settings />} />
      <Route path="settings/general" element={<GeneralSettings />} />
      <Route path="settings/custom-fields" element={<CustomFieldsSettings />} />
      <Route path="settings/api" element={<ApiSettings />} />
      <Route path="settings/communication" element={<CommunicationSettings />} />
      <Route path="settings/outreach" element={<OutreachSettings />} />
      <Route path="settings/social-media" element={<SocialMediaSettings />} />
      <Route path="settings/setup-wizard" element={<SetupWizard />} />
    </Routes>
  );
};

export default TenantAdminRoutes;
