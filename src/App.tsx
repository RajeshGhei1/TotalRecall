
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; // General application styles
import Auth from '@/pages/Auth';
import SuperAdminRoutes from '@/routes/SuperAdminRoutes';
import AuthGuard from '@/components/AuthGuard';

function App() {
  return (
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
          
          {/* Default route redirects to superadmin dashboard for now */}
          <Route path="/" element={
            <AuthGuard requiresSuperAdmin={true}>
              <SuperAdminRoutes />
            </AuthGuard>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
