
import React from 'react';
import AdminLayout from '@/components/AdminLayout';

const Settings = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            System configuration and preferences
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Settings interface coming soon...</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
