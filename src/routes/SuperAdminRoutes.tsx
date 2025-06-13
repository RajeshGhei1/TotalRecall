
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/superadmin/Dashboard';
import Analytics from '@/pages/superadmin/Analytics';
import AdvancedAnalytics from '@/pages/superadmin/AdvancedAnalytics';
import Tenants from '@/pages/superadmin/Tenants';
import Users from '@/pages/superadmin/Users';
import Companies from '@/pages/superadmin/Companies';
import CompanyDetailView from '@/components/superadmin/companies/CompanyDetailView';
import People from '@/pages/superadmin/People';
import Documentation from '@/pages/superadmin/Documentation';
import AIOrchestration from '@/pages/superadmin/AIOrchestration';
import AIAnalytics from '@/pages/superadmin/AIAnalytics';
import SecurityDashboard from '@/pages/superadmin/SecurityDashboard';
import AuditLogs from '@/pages/superadmin/AuditLogs';
import UserActivity from '@/pages/superadmin/UserActivity';
import SubscriptionPlans from '@/pages/superadmin/SubscriptionPlans';
import GlobalSettings from '@/pages/superadmin/GlobalSettings';
import Settings from '@/pages/superadmin/Settings';

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
      <Route path="/tenants" element={<Tenants />} />
      <Route path="/users" element={<Users />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/companies/:companyId" element={<CompanyDetailView />} />
      <Route path="/people" element={<People />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/ai-orchestration" element={<AIOrchestration />} />
      <Route path="/ai-analytics" element={<AIAnalytics />} />
      <Route path="/security-dashboard" element={<SecurityDashboard />} />
      <Route path="/audit-logs" element={<AuditLogs />} />
      <Route path="/user-activity" element={<UserActivity />} />
      <Route path="/subscription-plans" element={<SubscriptionPlans />} />
      <Route path="/global-settings" element={<GlobalSettings />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
};

export default SuperAdminRoutes;
