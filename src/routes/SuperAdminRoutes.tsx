
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/superadmin/Dashboard';
import Tenants from '@/pages/superadmin/Tenants';
import Companies from '@/pages/superadmin/Companies';
import CompanyDetailView from '@/components/superadmin/companies/CompanyDetailView';
import SubscriptionPlans from '@/pages/superadmin/SubscriptionPlans';
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
