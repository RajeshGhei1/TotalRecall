
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load pages to reduce initial bundle size
const SuperAdminDashboard = React.lazy(() => import('@/pages/superadmin/Dashboard'));
const Tenants = React.lazy(() => import('@/pages/superadmin/Tenants'));
const Users = React.lazy(() => import('@/pages/superadmin/Users'));
const Settings = React.lazy(() => import('@/pages/superadmin/Settings'));
const Analytics = React.lazy(() => import('@/pages/superadmin/Analytics'));
const AdvancedAnalytics = React.lazy(() => import('@/pages/superadmin/AdvancedAnalytics'));
const Companies = React.lazy(() => import('@/pages/superadmin/Companies'));
const People = React.lazy(() => import('@/pages/superadmin/People'));
const Documentation = React.lazy(() => import('@/pages/superadmin/Documentation'));
const AIOrchestration = React.lazy(() => import('@/pages/superadmin/AIOrchestration'));
const AIAnalytics = React.lazy(() => import('@/pages/superadmin/AIAnalytics'));
const UserActivity = React.lazy(() => import('@/pages/superadmin/UserActivity'));
const SecurityDashboard = React.lazy(() => import('@/pages/superadmin/SecurityDashboard'));
const AuditLogs = React.lazy(() => import('@/pages/superadmin/AuditLogs'));
const GlobalSettings = React.lazy(() => import('@/pages/superadmin/GlobalSettings'));
const SubscriptionPlans = React.lazy(() => import('@/pages/superadmin/SubscriptionPlans'));
const ModuleDevelopment = React.lazy(() => import('@/pages/superadmin/ModuleDevelopment'));
const ModuleTesting = React.lazy(() => import('@/pages/superadmin/ModuleTesting'));
const CompanyDetailView = React.lazy(() => import('@/components/superadmin/companies/CompanyDetailView'));
const DynamicModulePage = React.lazy(() => import('@/components/modules/DynamicModulePage'));
const ATS = React.lazy(() => import('@/pages/superadmin/ATS'));
const ATSRoutes = React.lazy(() => import('@/routes/ats/ATSRoutes'));

// Loading component for lazy-loaded routes
const RouteLoading = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
      <p>Loading...</p>
    </div>
  </div>
);

// Wrapper component for lazy-loaded routes with Suspense
const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<RouteLoading />}>
    {children}
  </Suspense>
);

const SuperAdminRoutes = () => {
  return (
    <Routes>
      {/* Default route - redirect to dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />
      
      {/* Core Admin Routes */}
      <Route path="dashboard" element={
        <LazyRoute>
          <SuperAdminDashboard />
        </LazyRoute>
      } />
      <Route path="tenants" element={
        <LazyRoute>
          <Tenants />
        </LazyRoute>
      } />
      <Route path="users" element={
        <LazyRoute>
          <Users />
        </LazyRoute>
      } />
      <Route path="subscription-plans" element={
        <LazyRoute>
          <SubscriptionPlans />
        </LazyRoute>
      } />
      <Route path="module-development" element={
        <LazyRoute>
          <ModuleDevelopment />
        </LazyRoute>
      } />
      <Route path="module-testing" element={
        <LazyRoute>
          <ModuleTesting />
        </LazyRoute>
      } />
      <Route path="security-dashboard" element={
        <LazyRoute>
          <SecurityDashboard />
        </LazyRoute>
      } />
      <Route path="audit-logs" element={
        <LazyRoute>
          <AuditLogs />
        </LazyRoute>
      } />
      <Route path="global-settings" element={
        <LazyRoute>
          <GlobalSettings />
        </LazyRoute>
      } />
      <Route path="settings" element={
        <LazyRoute>
          <Settings />
        </LazyRoute>
      } />
      
      {/* Redirect upgrade path to dashboard - Super Admins don't need upgrades */}
      <Route path="upgrade" element={<Navigate to="dashboard" replace />} />
      
      {/* Module Routes - Keep existing routes for backward compatibility */}
      <Route path="analytics" element={
        <LazyRoute>
          <Analytics />
        </LazyRoute>
      } />
      <Route path="advanced-analytics" element={
        <LazyRoute>
          <AdvancedAnalytics />
        </LazyRoute>
      } />
      <Route path="companies/:companyId" element={
        <LazyRoute>
          <CompanyDetailView />
        </LazyRoute>
      } />
      <Route path="companies" element={
        <LazyRoute>
          <Companies />
        </LazyRoute>
      } />
      <Route path="people" element={
        <LazyRoute>
          <People />
        </LazyRoute>
      } />
      <Route path="documentation" element={
        <LazyRoute>
          <Documentation />
        </LazyRoute>
      } />
      <Route path="ai-orchestration" element={
        <LazyRoute>
          <AIOrchestration />
        </LazyRoute>
      } />
      <Route path="ai-analytics" element={
        <LazyRoute>
          <AIAnalytics />
        </LazyRoute>
      } />
      <Route path="user-activity" element={
        <LazyRoute>
          <UserActivity />
        </LazyRoute>
      } />
      
      {/* ATS Routes - Updated to use dedicated routes */}
      <Route path="ats-core" element={
        <LazyRoute>
          <ATS />
        </LazyRoute>
      } />
      <Route path="ats/*" element={
        <LazyRoute>
          <ATSRoutes />
        </LazyRoute>
      } />
      
      {/* Dynamic Module Routes - Handle all other module routes */}
      <Route path="*" element={
        <LazyRoute>
          <DynamicModulePage />
        </LazyRoute>
      } />
    </Routes>
  );
};

export default SuperAdminRoutes;
