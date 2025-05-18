
import React from "react";
import SuperAdminNav from "./SuperAdminNav";
import TenantAdminNav from "./TenantAdminNav";

interface AdminSidebarProps {
  isSuperAdmin: boolean;
}

const AdminSidebar = ({ isSuperAdmin }: AdminSidebarProps) => {
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-jobmojo-primary">JobMojo.ai</h2>
        <p className="text-xs text-gray-600">
          {isSuperAdmin ? "Super Admin Dashboard" : "Tenant Admin Dashboard"}
        </p>
      </div>
      {isSuperAdmin ? <SuperAdminNav /> : <TenantAdminNav />}
    </div>
  );
};

export default AdminSidebar;
