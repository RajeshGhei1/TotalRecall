import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css'; // General application styles
import AuthGuard from '@/components/AuthGuard';
import { TenantProvider } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSuperAdminCheck } from '@/hooks/useSuperAdminCheck';
import { useSessionLogger } from '@/hooks/useSessionLogger';
import { logger } from '@/utils/logger';

// Lazy load routes and pages for code splitting
const Index = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const AppSubscription = lazy(() => import('@/pages/AppSubscription'));
const SuperAdminRoutes = lazy(() => import('@/routes/SuperAdminRoutes'));
const TenantAdminRoutes = lazy(() => import('@/routes/TenantAdminRoutes'));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Enhanced component to handle smart authenticated user redirects
// Allow home page to be accessible even when logged in
const AuthenticatedRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  const { isSuperAdmin, isLoading: checkingRole } = useSuperAdminCheck();
  const location = useLocation();
  
  // Always show the home page (Index) - users can navigate to their dashboard via navbar
  // This allows logged-in users to see the apps listing and marketing content
  if (loading || checkingRole) {
    logger.debug('AuthenticatedRedirect - Loading state');
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Always show the home page - authenticated users can access it
  logger.debug('AuthenticatedRedirect - Showing Index page');
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Index />
    </Suspense>
  );
};

function App() {
  useSessionLogger();
  return (
    <TenantProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Home route - shows marketing page for unauthenticated users, smart redirects for authenticated users */}
              <Route path="/" element={<AuthenticatedRedirect />} />
              
              {/* Auth Route */}
              <Route path="/auth" element={<Auth />} />
              
              {/* App Subscription Route - Public, handles auth internally */}
              <Route path="/subscribe" element={<AppSubscription />} />
              
              {/* Superadmin Routes - Protected, no subscription checks */}
              <Route 
                path="/superadmin/*" 
                element={
                  <AuthGuard requiresSuperAdmin={true}>
                    <SuperAdminRoutes />
                  </AuthGuard>
                } 
              />
              
              {/* Tenant Admin Routes - Protected with Smart Module Independence */}
              <Route 
                path="/tenant-admin/*" 
                element={
                  <AuthGuard>
                    <TenantAdminRoutes />
                  </AuthGuard>
                } 
              />

              {/* Catch all other routes and redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </TenantProvider>
  );
}

export default App;
