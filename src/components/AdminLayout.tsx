
import React from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "./layout/AdminSidebar";
import AdminHeader from "./layout/AdminHeader";
import AdminFooter from "./layout/AdminFooter";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  
  // Determine if we're in superadmin or tenant-admin route
  const isSuperAdmin = location.pathname.startsWith('/superadmin');

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar isSuperAdmin={isSuperAdmin} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader isSuperAdmin={isSuperAdmin} />

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <AdminFooter isSuperAdmin={isSuperAdmin} />
      </div>
    </div>
  );
};

export default AdminLayout;
