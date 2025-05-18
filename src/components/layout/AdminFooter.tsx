
import React from "react";

interface AdminFooterProps {
  isSuperAdmin: boolean;
}

const AdminFooter = ({ isSuperAdmin }: AdminFooterProps) => {
  return (
    <footer className="bg-white p-4 text-center text-sm text-gray-600 shadow-inner">
      © {new Date().getFullYear()} JobMojo.ai - {isSuperAdmin ? "Super Admin Portal" : "Tenant Admin Portal"}
    </footer>
  );
};

export default AdminFooter;
