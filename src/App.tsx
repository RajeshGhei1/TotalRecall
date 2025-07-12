import React, { useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css'; // General application styles
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import SuperAdminRoutes from '@/routes/SuperAdminRoutes';
import TenantAdminRoutes from '@/routes/TenantAdminRoutes';
import AuthGuard from '@/components/AuthGuard';
import { TenantProvider } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSuperAdminCheck } from '@/hooks/useSuperAdminCheck';
import { useSessionLogger } from '@/hooks/useSessionLogger';

// Enhanced component to handle smart authenticated user redirects
const AuthenticatedRedirect: React.FC = React.memo(() => {
  const { user, loading } = useAuth();
  const { isSuperAdmin, isLoading: checkingRole } = useSuperAdminCheck();
  
  // Show loading while checking authentication or role
  if (loading || checkingRole) {
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
    return <Index />;
  }

  // Smart role-based redirects using database role check
  if (isSuperAdmin) {
    console.log('AuthenticatedRedirect: User is super admin, redirecting to super admin portal');
    return <Navigate to="/superadmin/dashboard" replace />;
  }

  // Regular users go to tenant admin portal
  console.log('AuthenticatedRedirect: User is tenant admin, redirecting to tenant admin portal');
  return <Navigate to="/tenant-admin" replace />;
});

AuthenticatedRedirect.displayName = 'AuthenticatedRedirect';

// Memoized route components to prevent unnecessary re-renders
const MemoizedSuperAdminRoutes = React.memo(() => (
  <AuthGuard requiresSuperAdmin={true}>
    <SuperAdminRoutes />
  </AuthGuard>
));

const MemoizedTenantAdminRoutes = React.memo(() => (
  <AuthGuard>
    <TenantAdminRoutes />
  </AuthGuard>
));

MemoizedSuperAdminRoutes.displayName = 'MemoizedSuperAdminRoutes';
MemoizedTenantAdminRoutes.displayName = 'MemoizedTenantAdminRoutes';

function App() {
  useSessionLogger();

  // Memoize route configurations to prevent unnecessary re-renders
  const routes = useMemo(() => [
    {
      path: "/",
      element: <AuthenticatedRedirect />
    },
    {
      path: "/auth",
      element: <Auth />
    },
    {
      path: "/superadmin/*",
      element: <MemoizedSuperAdminRoutes />
    },
    {
      path: "/tenant-admin/*",
      element: <MemoizedTenantAdminRoutes />
    },
    {
      path: "*",
      element: <Navigate to="/" replace />
    }
  ], []);

  // Memoize the routes JSX to prevent unnecessary re-renders
  const routesJSX = useMemo(() => (
    <Routes>
      {routes.map((route, index) => (
        <Route
          key={`${route.path}-${index}`}
          path={route.path}
          element={route.element}
        />
      ))}
    </Routes>
  ), [routes]);

  return (
    <TenantProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {routesJSX}
        </div>
      </Router>
    </TenantProvider>
  );
}

export default React.memo(App);
