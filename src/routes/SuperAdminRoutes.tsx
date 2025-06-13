
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/superadmin/Dashboard';
import Tenants from '@/pages/superadmin/Tenants';
import Companies from '@/pages/superadmin/Companies';
import CompanyDetailView from '@/components/superadmin/companies/CompanyDetailView';
import SubscriptionPlans from '@/pages/superadmin/SubscriptionPlans';
import Analytics from '@/pages/superadmin/Analytics';
import AdvancedAnalytics from '@/pages/superadmin/AdvancedAnalytics';
import TenantUsers from '@/pages/superadmin/TenantUsers';
import People from '@/pages/superadmin/People';
import Documentation from '@/pages/superadmin/Documentation';
import AIOrchestration from '@/pages/superadmin/AIOrchestration';
import AIAnalytics from '@/pages/superadmin/AIAnalytics';
import SecurityDashboard from '@/pages/superadmin/SecurityDashboard';
import AuditLogs from '@/pages/superadmin/AuditLogs';
import UserActivity from '@/pages/superadmin/UserActivity';
import GlobalSettings from '@/pages/superadmin/GlobalSettings';
import TenantSettings from '@/pages/superadmin/TenantSettings';
import { RouteGuard } from '@/components/security/RouteGuard';
import { SecureErrorBoundary } from '@/components/common/SecureErrorBoundary';

const SuperAdminRoutes = () => {
  return (
    <SecureErrorBoundary>
      <Routes>
        <Route 
          path="/dashboard" 
          element={
            <RouteGuard requiredRole={['super_admin']}>
              <Dashboard />
            </RouteGuard>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <RouteGuard 
              requiredRole={['super_admin']}
              requiredPermission={{ resource: 'analytics', action: 'view' }}
            >
              <Analytics />
            </RouteGuard>
          } 
        />
        <Route 
          path="/advanced-analytics" 
          element={
            <RouteGuard 
              requiredRole={['super_admin']}
              requiredPermission={{ resource: 'analytics', action: 'view' }}
            >
              <AdvancedAnalytics />
            </RouteGuard>
          } 
        />
        <Route 
          path="/tenants" 
          element={
            <RouteGuard 
              requiredRole={['super_admin']}
              requiredPermission={{ resource: 'tenants', action: 'view' }}
            >
              <Tenants />
            </RouteGuard>
          } 
        />
        <Route 
          path="/users" 
          element={
            <RouteGuard 
              requiredRole={['super_admin']}
              requiredPermission={{ resource: 'users', action: 'view' }}
            >
              <TenantUsers />
            </RouteGuard>
          } 
        />
        <Route 
          path="/companies" 
          element={
            <RouteGuard 
              requiredRole={['super_admin']}
              requiredPermission={{ resource: 'companies', action: 'view' }}
            >
              <Companies />
            </RouteGuard>
          } 
        />
        <Route 
          path="/companies/:companyId" 
          element={
            <RouteGuard 
              requiredRole={['super_admin']}
              requiredPermission={{ resource: 'companies', action: 'view' }}
            >
              <CompanyDetailView />
            </RouteGuard>
          } 
        />
        <Route 
          path="/people" 
          element={
            <RouteGuard 
              requiredRole={['super_admin']}
              requiredPermission={{ resource: 'people', action: 'view' }}
            >
              <People />
            </RouteGuard>
          } 
        />
        <Route 
          path="/documentation" 
          element={
            <RouteGuard 
              requiredRole={['super_admin']}
              requiredPermission={{ resource: 'documentation', action: 'view' }}
            >
              <Documentation />
            </RouteGuard>
          } 
        />
        <Route 
          path="/ai-orchestration" 
          element={
            <RouteGuard 
              requiredRole={['super_admin']}
              requiredPermission={{ resource: 'ai_system', action: 'manage' }}
            >
              <AIOrchestration />
            </RouteGuard>
          } 
        />
        <Route 
          path="/ai-analytics" 
          element={
            <RouteGuard 
              requiredRole={['super_admin']}
              requiredPermission={{ resource: 'ai_system', action: 'view' }}
            >
              <AIAnalytics />
            </RouteGuard>
          } 
        />
        <Route 
          path="/security-dashboard" 
          element={
            <RouteGuard 
              requiredRole={['super_admin']}
              requiredPermission={{ resource: 'security', action: 'view' }}
            >
              <SecurityDashboard />
            </RouteGuard>
          } 
        />
        <Route 
          path="/audit-logs" 
          element={
            <RouteGuard 
              requiredRole={['super_admin']}
              requiredPermission={{ resource: 'audit_logs', action: 'view' }}
            >
              <AuditLogs />
            </RouteGuard>
          } 
        />
        <Route 
          path="/user-activity" 
          element={
            <RouteGuard 
              requiredRole={['super_admin']}
              requiredPermission={{ resource: 'user_activity', action: 'view' }}
            >
              <UserActivity />
            </RouteGuard>
          } 
        />
        <Route 
          path="/subscription-plans" 
          element={
            <RouteGuard 
              requiredRole={['super_admin']}
              requiredPermission={{ resource: 'subscription_plans', action: 'view' }}
            >
              <SubscriptionPlans />
            </RouteGuard>
          } 
        />
        <Route 
          path="/global-settings" 
          element={
            <RouteGuard 
              requiredRole={['super_admin']}
              requiredPermission={{ resource: 'settings', action: 'manage' }}
            >
              <GlobalSettings />
            </RouteGuard>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <RouteGuard 
              requiredRole={['super_admin']}
              requiredPermission={{ resource: 'tenant_settings', action: 'manage' }}
            >
              <TenantSettings />
            </RouteGuard>
          } 
        />
        <Route 
          path="/" 
          element={
            <RouteGuard requiredRole={['super_admin']}>
              <Dashboard />
            </RouteGuard>
          } 
        />
      </Routes>
    </SecureErrorBoundary>
  );
};

export default SuperAdminRoutes;
