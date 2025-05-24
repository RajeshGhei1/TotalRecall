
import React from "react";
import SuperAdminNav from "./SuperAdminNav";
import TenantAdminNav from "./TenantAdminNav";
import { useAdminContext } from "@/hooks/useAdminContext";

const AdminSidebar = () => {
  const { adminType, isLoading } = useAdminContext();

  if (isLoading) {
    return (
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-jobmojo-primary">JobMojo.ai</h2>
          <p className="text-xs text-gray-600">Loading...</p>
        </div>
        <div className="p-4">
          <div className="animate-pulse space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isSuperAdmin = adminType === 'super_admin';

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
