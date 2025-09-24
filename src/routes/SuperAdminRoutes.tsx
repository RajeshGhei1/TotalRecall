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
import FeatureManagement from '@/pages/superadmin/FeatureManagement';
import ConsolidatedFeatureManagement from '@/components/features/ConsolidatedFeatureManagement';
import CompanyDetailView from '@/components/superadmin/companies/CompanyDetailView';
import DynamicModulePage from '@/components/modules/DynamicModulePage';
import ATS from '@/pages/superadmin/ATS';
import ATSRoutes from '@/routes/ats/ATSRoutes';

// Super Admin Module Components (placeholder components)
const SystemAdministrationSuite = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">System Administration Suite</h1>
    <p className="text-gray-600">Comprehensive system administration including user management, security policies, and global configuration.</p>
    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
      <h3 className="font-semibold text-blue-800">Features:</h3>
      <ul className="mt-2 text-blue-700 list-disc list-inside">
        <li>Multi-tenant user management</li>
        <li>Role-based access control</li>
        <li>System-wide security policies</li>
        <li>Global configuration management</li>
        <li>Cross-tenant analytics and monitoring</li>
      </ul>
    </div>
  </div>
);

const ModuleRegistryDeployment = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Module Registry & Deployment</h1>
    <p className="text-gray-600">Module discovery, registration, deployment, and lifecycle management across the platform.</p>
    <div className="mt-4 p-4 bg-green-50 rounded-lg">
      <h3 className="font-semibold text-green-800">Features:</h3>
      <ul className="mt-2 text-green-700 list-disc list-inside">
        <li>Intelligent module recommendations</li>
        <li>Automated dependency resolution</li>
        <li>Predictive performance analysis</li>
        <li>Module lifecycle management</li>
      </ul>
    </div>
  </div>
);

const EnterpriseMonitoringAudit = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Enterprise Monitoring & Audit</h1>
    <p className="text-gray-600">System-wide monitoring, audit trails, compliance reporting, and security analytics.</p>
    <div className="mt-4 p-4 bg-purple-50 rounded-lg">
      <h3 className="font-semibold text-purple-800">Features:</h3>
      <ul className="mt-2 text-purple-700 list-disc list-inside">
        <li>Anomaly detection</li>
        <li>Predictive failure analysis</li>
        <li>Compliance insights</li>
        <li>Security analytics</li>
      </ul>
    </div>
  </div>
);

const SuperAdminRoutes = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('SuperAdminRoutes - Current location:', location.pathname);
    console.log('SuperAdminRoutes - Location state:', location.state);
  }, [location]);
  
  console.log('🔥 SuperAdminRoutes component rendering for path:', location.pathname);
  console.log('🔥 SuperAdminRoutes - Full URL:', window.location.href);
  console.log('🔥 SuperAdminRoutes - Search params:', location.search);
  
  return (
    <Routes>
      {/* SIMPLE TEST ROUTE - FIRST PRIORITY */}
      <Route path="simple-test" element={
        <div style={{
          padding: '40px',
          background: 'lightgreen',
          margin: '20px',
          border: '3px solid green'
        }}>
          <h1>🎉 SIMPLE TEST SUCCESS!</h1>
          <p><strong>Path:</strong> {location.pathname}</p>
          <p><strong>URL:</strong> {window.location.href}</p>
          <p style={{color: 'green', fontWeight: 'bold'}}>✅ SuperAdminRoutes is working!</p>
        </div>
      } />
      
      {/* Default route - redirect to dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />
      
      {/* SIMPLE TEST ROUTE - FIRST PRIORITY */}
      <Route path="simple-test" element={
        <div style={{
          padding: '40px',
          background: 'lightgreen',
          margin: '20px',
          border: '3px solid green'
        }}>
          <h1>🎉 SIMPLE TEST SUCCESS!</h1>
          <p><strong>Path:</strong> {location.pathname}</p>
          <p><strong>URL:</strong> {window.location.href}</p>
          <p style={{color: 'green', fontWeight: 'bold'}}>✅ SuperAdminRoutes is working!</p>
        </div>
      } />
      
      {/* Test route to verify routing works */}
      <Route path="test-route" element={<div style={{padding: '20px', background: 'lightgreen'}}>TEST ROUTE WORKS!</div>} />
      
      {/* Core Admin Routes */}
      <Route path="dashboard" element={<SuperAdminDashboard />} />
      <Route path="tenants" element={<Tenants />} />
      <Route path="users" element={<Users />} />
      <Route path="subscription-plans" element={<SubscriptionPlans />} />
      <Route path="module-development" element={<ModuleDevelopment />} />
      <Route path="feature-management" element={<ConsolidatedFeatureManagement />} />
      <Route path="feature-management-legacy" element={<FeatureManagement />} />
      <Route path="feature-management-consolidated" element={<ConsolidatedFeatureManagement />} />
      <Route path="module-testing" element={<ModuleTesting />} />
      <Route path="security-dashboard" element={<SecurityDashboard />} />
      <Route path="audit-logs" element={<AuditLogs />} />
      <Route path="global-settings" element={<GlobalSettings />} />
      <Route path="settings" element={<Settings />} />
      
      {/* Super Admin Modules - Core Platform Administration */}
      <Route path="system-administration-suite" element={<SystemAdministrationSuite />} />
      <Route path="module-registry-deployment" element={<ModuleRegistryDeployment />} />
      <Route path="enterprise-monitoring-audit" element={<EnterpriseMonitoringAudit />} />
      
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
