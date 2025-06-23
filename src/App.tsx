
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css'; // General application styles
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import SuperAdminRoutes from '@/routes/SuperAdminRoutes';
import TenantAdminRoutes from '@/routes/TenantAdminRoutes';
import AuthGuard from '@/components/AuthGuard';
import { TenantProvider } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';

// Enhanced component to handle smart authenticated user redirects
const AuthenticatedRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Index />;
  }

  // Smart role-based redirects - try tenant-admin first, then fall back to superadmin
  // This implements the module independence plan where users get direct access to their modules
  return <Navigate to="/tenant-admin" replace />;
};

function App() {
  return (
    <TenantProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Home route - shows marketing page for unauthenticated users, smart redirects for authenticated users */}
            <Route path="/" element={<AuthenticatedRedirect />} />
            
            {/* Auth Route */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Superadmin Routes - Protected */}
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
        </div>
      </Router>
    </TenantProvider>
  );
}

export default App;
