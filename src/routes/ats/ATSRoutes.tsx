
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ATSDashboard from '@/components/ats/ATSDashboard';
import Jobs from '@/pages/tenant-admin/Jobs';
import Talent from '@/pages/tenant-admin/Talent';
import AdminLayout from '@/components/AdminLayout';

const ATSRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Default redirect to ATS dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />
      
      {/* ATS Dashboard - Overview */}
      <Route path="dashboard" element={
        <AdminLayout>
          <ATSDashboard view="dashboard" showMetrics={true} allowCreate={true} />
        </AdminLayout>
      } />
      
      {/* Jobs Management */}
      <Route path="jobs" element={<Jobs />} />
      
      {/* Talent Pool Management */}
      <Route path="talent/*" element={<Talent />} />
      
      {/* Applications Pipeline */}
      <Route path="pipeline" element={
        <AdminLayout>
          <ATSDashboard view="pipeline" showMetrics={true} allowCreate={false} />
        </AdminLayout>
      } />
      
      {/* Candidates View */}
      <Route path="candidates" element={
        <AdminLayout>
          <ATSDashboard view="candidates" showMetrics={false} allowCreate={true} />
        </AdminLayout>
      } />
    </Routes>
  );
};

export default ATSRoutes;
