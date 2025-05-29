
import React from "react";
import SuperAdminNav from "./SuperAdminNav";
import TenantAdminNav from "./TenantAdminNav";
import { useAdminContext } from "@/hooks/useAdminContext";
import { Brain, Sparkles } from 'lucide-react';

const AdminSidebar = () => {
  const { adminType, isLoading } = useAdminContext();

  if (isLoading) {
    return (
      <div className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse flex-1"></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Loading...</p>
        </div>
        <div className="p-4 flex-1">
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
    <div className="w-64 bg-white shadow-md flex flex-col h-full">
      <div className="p-6 border-b flex-shrink-0">
        <div className="flex items-center space-x-3 mb-2">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-jobmojo-primary to-jobmojo-secondary rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-jobmojo-accent" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-jobmojo-primary to-jobmojo-secondary bg-clip-text text-transparent">
              TOTAL RECALL
            </span>
            <span className="text-xs text-jobmojo-accent font-semibold -mt-1">.ai</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 text-left">
          {isSuperAdmin ? "Super Admin Dashboard" : "Tenant Admin Dashboard"}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isSuperAdmin ? <SuperAdminNav /> : <TenantAdminNav />}
      </div>
    </div>
  );
};

export default AdminSidebar;
