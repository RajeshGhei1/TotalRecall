
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import ATSDashboard from '@/components/ats/ATSDashboard';

const ATS = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">ATS Core</h1>
          <p className="text-gray-600 mt-2">
            Complete Applicant Tracking System with job and candidate management
          </p>
        </div>
        <ATSDashboard view="dashboard" showMetrics={true} allowCreate={true} />
      </div>
    </AdminLayout>
  );
};

export default ATS;
