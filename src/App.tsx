
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css'; // General application styles
import Auth from '@/pages/Auth';
import SuperAdminRoutes from '@/routes/SuperAdminRoutes';
import TenantAdminRoutes from '@/routes/TenantAdminRoutes';
import AuthGuard from '@/components/AuthGuard';
import { TenantProvider } from '@/contexts/TenantContext';

function App() {
  return (
    <TenantProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
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
            
            {/* Tenant Admin Routes - Protected */}
            <Route 
              path="/tenant-admin/*" 
              element={
                <AuthGuard>
                  <TenantAdminRoutes />
                </AuthGuard>
              } 
            />
            
            {/* Default route redirects to superadmin for testing */}
            <Route path="/" element={
              <AuthGuard requiresSuperAdmin={true}>
                <Navigate to="/superadmin/module-development" replace />
              </AuthGuard>
            } />

            {/* Catch all other routes and redirect to superadmin module development */}
            <Route path="*" element={
              <AuthGuard requiresSuperAdmin={true}>
                <Navigate to="/superadmin/module-development" replace />
              </AuthGuard>
            } />
          </Routes>
        </div>
      </Router>
    </TenantProvider>
  );
}

export default App;
