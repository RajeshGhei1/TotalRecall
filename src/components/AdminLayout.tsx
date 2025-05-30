
import React from 'react';
import AdminSidebar from './layout/AdminSidebar';
import AdminHeader from './layout/AdminHeader';
import TopHeader from './layout/TopHeader';
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
    <div className="flex min-h-screen flex-col md:flex-row w-full">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        <AdminHeader />
        
        {/* Desktop top header */}
        <TopHeader />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
        
        {/* Footer */}
        <AdminFooter isSuperAdmin={isSuperAdmin} />
      </div>
    </div>
  );
};

export default AdminLayout;
