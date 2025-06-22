
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SuperAdminDashboard from '@/pages/superadmin/Dashboard';
import Tenants from '@/pages/superadmin/Tenants';
import Users from '@/pages/superadmin/Users';
import Settings from '@/pages/superadmin/Settings';
import Analytics from '@/pages/superadmin/Analytics';
import AdvancedAnalytics from '@/pages/superadmin/AdvancedAnalytics';
import Companies from '@/pages/superadmin/Companies';
import People from '@/pages/superadmin/People';
import Documentation from '@/pages/superadmin/Documentation';
import AIOrchestration from '@/pages/superadmin/AIOrchestration';
import AIAnalytics from '@/pages/superadmin/AIAnalytics';
import UserActivity from '@/pages/superadmin/UserActivity';
import SecurityDashboard from '@/pages/superadmin/SecurityDashboard';
import AuditLogs from '@/pages/superadmin/AuditLogs';
import GlobalSettings from '@/pages/superadmin/GlobalSettings';
import SubscriptionPlans from '@/pages/superadmin/SubscriptionPlans';
import ModuleDevelopment from '@/pages/superadmin/ModuleDevelopment';
import ModuleTesting from '@/pages/superadmin/ModuleTesting';
import CompanyDetailView from '@/components/superadmin/companies/CompanyDetailView';

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<SuperAdminDashboard />} />
      <Route path="/module-development" element={<ModuleDevelopment />} />
      <Route path="/module-testing" element={<ModuleTesting />} />
      <Route path="/tenants" element={<Tenants />} />
      <Route path="/users" element={<Users />} />
      <Route path="/subscription-plans" element={<SubscriptionPlans />} />
      <Route path="/security-dashboard" element={<SecurityDashboard />} />
      <Route path="/audit-logs" element={<AuditLogs />} />
      <Route path="/global-settings" element={<GlobalSettings />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
      <Route path="/companies/:companyId" element={<CompanyDetailView />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/people" element={<People />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/ai-orchestration" element={<AIOrchestration />} />
      <Route path="/ai-analytics" element={<AIAnalytics />} />
      <Route path="/user-activity" element={<UserActivity />} />
    </Routes>
  );
};

export default SuperAdminRoutes;
