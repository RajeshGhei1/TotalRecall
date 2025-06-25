
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ATSDashboard from '@/components/ats/ATSDashboard';
import Jobs from '@/pages/tenant-admin/Jobs';
import Talent from '@/pages/tenant-admin/Talent';
import AdminLayout from '@/components/AdminLayout';

const ATSRoutes: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">ATS Core</h1>
          <p className="text-gray-600 mt-2">
            Complete Applicant Tracking System with job and candidate management
          </p>
        </div>
        
        <Routes>
          {/* Default redirect to ATS dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          
          {/* ATS Dashboard - Overview */}
          <Route path="dashboard" element={
            <ATSDashboard view="dashboard" showMetrics={true} allowCreate={true} />
          } />
          
          {/* Jobs Management */}
          <Route path="jobs" element={<Jobs />} />
          
          {/* Talent Pool Management */}
          <Route path="talent/*" element={<Talent />} />
          
          {/* Applications Pipeline */}
          <Route path="pipeline" element={
            <ATSDashboard view="pipeline" showMetrics={true} allowCreate={false} />
          } />
          
          {/* Candidates View */}
          <Route path="candidates" element={
            <ATSDashboard view="candidates" showMetrics={false} allowCreate={true} />
          } />
          
          {/* Analytics View */}
          <Route path="analytics" element={
            <ATSDashboard view="dashboard" showMetrics={true} allowCreate={false} />
          } />
        </Routes>
      </div>
    </AdminLayout>
  );
};

export default ATSRoutes;
