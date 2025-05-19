
import React from 'react';
import AdminSidebar from './layout/AdminSidebar';
import AdminHeader from './layout/AdminHeader';
import AdminFooter from './layout/AdminFooter';

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  // Determine if the current route starts with /superadmin
  const isSuperAdmin = window.location.pathname.startsWith('/superadmin');

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block">
        <AdminSidebar isSuperAdmin={isSuperAdmin} />
      </div>
      
      {/* Mobile header with navigation */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader isSuperAdmin={isSuperAdmin} />
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
        <AdminFooter isSuperAdmin={isSuperAdmin} />
      </div>
    </div>
  );
};

export default AdminLayout;
