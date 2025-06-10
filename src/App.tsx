import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; // General application styles
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Profile from '@/pages/Profile';
import People from '@/pages/People';
import PersonDetail from '@/pages/PersonDetail';
import Settings from '@/pages/Settings';
import SuperAdminDashboard from '@/pages/superadmin/SuperAdminDashboard';
import Tenants from '@/pages/superadmin/Tenants';
import Companies from '@/pages/superadmin/Companies';
import CompanyDetailView from '@/components/superadmin/companies/CompanyDetailView';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes (requires authentication) */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/people" element={<People />} />
          <Route path="/people/:personId" element={<PersonDetail />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Superadmin Routes */}
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/tenants" element={<Tenants />} />
          <Route path="/superadmin/companies" element={<Companies />} />
          <Route path="/superadmin/companies/:companyId" element={<CompanyDetailView />} />
          
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
