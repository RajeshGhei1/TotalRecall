
import React from 'react';
import AdminLayout from '@/components/AdminLayout';

const UserManagement = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage system users and permissions
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">User management interface coming soon...</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
