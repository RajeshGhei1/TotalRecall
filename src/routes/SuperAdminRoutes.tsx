
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
import Settings from '@/pages/superadmin/Settings';
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
            <RouteGuard requiredRole={['super_admin']}>
              <Analytics />
            </RouteGuard>
          } 
        />
        <Route 
          path="/advanced-analytics" 
          element={
            <RouteGuard requiredRole={['super_admin']}>
              <AdvancedAnalytics />
            </RouteGuard>
          } 
        />
        <Route 
          path="/tenants" 
          element={
            <RouteGuard requiredRole={['super_admin']}>
              <Tenants />
            </RouteGuard>
          } 
        />
        <Route 
          path="/users" 
          element={
            <RouteGuard requiredRole={['super_admin']}>
              <TenantUsers />
            </RouteGuard>
          } 
        />
        <Route 
          path="/companies" 
          element={
            <RouteGuard requiredRole={['super_admin']}>
              <Companies />
            </RouteGuard>
          } 
        />
        <Route 
          path="/companies/:companyId" 
          element={
            <RouteGuard requiredRole={['super_admin']}>
              <CompanyDetailView />
            </RouteGuard>
          } 
        />
        <Route 
          path="/people" 
          element={
            <RouteGuard requiredRole={['super_admin']}>
              <People />
            </RouteGuard>
          } 
        />
        <Route 
          path="/documentation" 
          element={
            <RouteGuard requiredRole={['super_admin']}>
              <Documentation />
            </RouteGuard>
          } 
        />
        <Route 
          path="/ai-orchestration" 
          element={
            <RouteGuard requiredRole={['super_admin']}>
              <AIOrchestration />
            </RouteGuard>
          } 
        />
        <Route 
          path="/ai-analytics" 
          element={
            <RouteGuard requiredRole={['super_admin']}>
              <AIAnalytics />
            </RouteGuard>
          } 
        />
        <Route 
          path="/security-dashboard" 
          element={
            <RouteGuard requiredRole={['super_admin']}>
              <SecurityDashboard />
            </RouteGuard>
          } 
        />
        <Route 
          path="/audit-logs" 
          element={
            <RouteGuard requiredRole={['super_admin']}>
              <AuditLogs />
            </RouteGuard>
          } 
        />
        <Route 
          path="/user-activity" 
          element={
            <RouteGuard requiredRole={['super_admin']}>
              <UserActivity />
            </RouteGuard>
          } 
        />
        <Route 
          path="/subscription-plans" 
          element={
            <RouteGuard requiredRole={['super_admin']}>
              <SubscriptionPlans />
            </RouteGuard>
          } 
        />
        <Route 
          path="/global-settings" 
          element={
            <RouteGuard requiredRole={['super_admin']}>
              <GlobalSettings />
            </RouteGuard>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <RouteGuard requiredRole={['super_admin']}>
              <Settings />
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
