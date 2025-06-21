
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SuperAdminDashboard from '@/pages/superadmin/SuperAdminDashboard';
import TenantManagement from '@/pages/superadmin/TenantManagement';
import UserManagement from '@/pages/superadmin/UserManagement';
import JobManagement from '@/pages/superadmin/JobManagement';
import DatabaseManagement from '@/pages/superadmin/DatabaseManagement';
import ModuleDevelopment from '@/pages/superadmin/ModuleDevelopment';
import Analytics from '@/pages/superadmin/Analytics';
import Reports from '@/pages/superadmin/Reports';
import Settings from '@/pages/superadmin/Settings';

const SuperAdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<SuperAdminDashboard />} />
      <Route path="tenant-management" element={<TenantManagement />} />
      <Route path="user-management" element={<UserManagement />} />
      <Route path="job-management" element={<JobManagement />} />
      <Route path="database-management" element={<DatabaseManagement />} />
      <Route path="module-development" element={<ModuleDevelopment />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="reports" element={<Reports />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
};

export default SuperAdminRoutes;
