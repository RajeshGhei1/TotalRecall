import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import DynamicModulePage from '@/components/modules/DynamicModulePage';
import ATS from '@/pages/superadmin/ATS';
import ATSRoutes from '@/routes/ats/ATSRoutes';



const SuperAdminRoutes = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('SuperAdminRoutes - Current location:', location.pathname);
    console.log('SuperAdminRoutes - Location state:', location.state);
  }, [location]);
  
  console.log('SuperAdminRoutes component rendering for path:', location.pathname);
  
  return (
    <Routes>
      {/* Default route - redirect to dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />
      
      {/* Test route to verify routing works */}
      <Route path="test-route" element={<div style={{padding: '20px', background: 'lightgreen'}}>TEST ROUTE WORKS!</div>} />
      
      {/* Core Admin Routes */}
      <Route path="dashboard" element={<SuperAdminDashboard />} />
      <Route path="tenants" element={<Tenants />} />
      <Route path="users" element={<Users />} />
      <Route path="subscription-plans" element={<SubscriptionPlans />} />
      <Route path="module-development" element={<ModuleDevelopment />} />
      <Route path="module-testing" element={<ModuleTesting />} />
      <Route path="security-dashboard" element={<SecurityDashboard />} />
      <Route path="audit-logs" element={<AuditLogs />} />
      <Route path="global-settings" element={<GlobalSettings />} />
      <Route path="settings" element={<Settings />} />
      
      {/* Redirect upgrade path to dashboard - Super Admins don't need upgrades */}
      <Route path="upgrade" element={<Navigate to="dashboard" replace />} />
      
      {/* Module Routes - Keep existing routes for backward compatibility */}
      <Route path="analytics" element={<Analytics />} />
      <Route path="advanced-analytics" element={<AdvancedAnalytics />} />
      <Route path="companies/:companyId" element={<CompanyDetailView />} />
      <Route path="companies" element={<Companies />} />
      <Route path="people" element={<People />} />
      <Route path="documentation" element={<Documentation />} />
      <Route path="ai-orchestration" element={<AIOrchestration />} />
      <Route path="ai-analytics" element={<AIAnalytics />} />
      <Route path="user-activity" element={<UserActivity />} />
      
      {/* ATS Routes - Updated to use dedicated routes */}
      <Route path="ats-core" element={<ATS />} />
      <Route path="ats/*" element={<ATSRoutes />} />
      
      {/* Dynamic Module Routes - Handle all other module routes */}
      <Route path="*" element={<DynamicModulePage />} />
    </Routes>
  );
};

export default SuperAdminRoutes;
