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
const AuthenticatedRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  const { isSuperAdmin, isLoading: checkingRole } = useSuperAdminCheck();
  const location = useLocation(); // Use router hook instead of window.location
  
  // If user is already on a superadmin or tenant-admin route, don't redirect
  if (location.pathname.startsWith('/superadmin/') || location.pathname.startsWith('/tenant-admin/')) {
    logger.debug('AuthenticatedRedirect - User already on protected route, skipping redirect');
    return null; // Let the existing route handle it
  }
  
  // Show loading while checking authentication or role
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

  // If no user, show marketing page
  if (!user) {
    logger.debug('AuthenticatedRedirect - No user, showing Index');
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Index />
      </Suspense>
    );
  }

  // Smart role-based redirects using database role check
  if (isSuperAdmin) {
    logger.debug('AuthenticatedRedirect - User is super admin, redirecting to super admin portal');
    return <Navigate to="/superadmin/dashboard" replace />;
  }

  // Regular users go to tenant admin portal
  logger.debug('AuthenticatedRedirect - User is tenant admin, redirecting to tenant admin portal');
  return <Navigate to="/tenant-admin" replace />;
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
