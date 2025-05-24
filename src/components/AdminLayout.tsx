
import React from 'react';
import AdminSidebar from './layout/AdminSidebar';
import AdminHeader from './layout/AdminHeader';
import AdminFooter from './layout/AdminFooter';
import { useAdminContext } from '@/hooks/useAdminContext';

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { adminType, isLoading, error } = useAdminContext();

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Access Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const isSuperAdmin = adminType === 'super_admin';

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>
      
      {/* Mobile header with navigation */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
        <AdminFooter isSuperAdmin={isSuperAdmin} />
      </div>
    </div>
  );
};

export default AdminLayout;
