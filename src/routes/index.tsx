
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import SuperAdminRoutes from "./SuperAdminRoutes";
import TenantAdminRoutes from "./TenantAdminRoutes";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          {PublicRoutes()}
          
          {/* Super Admin Routes */}
          {SuperAdminRoutes()}
          
          {/* Tenant Admin Routes */}
          {TenantAdminRoutes()}
          
          {/* Redirect old admin routes to tenant-admin for backward compatibility */}
          <Route path="/admin/dashboard" element={<Navigate to="/tenant-admin/dashboard" replace />} />
          <Route path="/admin/tenants" element={<Navigate to="/tenant-admin/dashboard" replace />} />
          <Route path="/admin/users" element={<Navigate to="/tenant-admin/users" replace />} />
          <Route path="/admin/settings" element={<Navigate to="/tenant-admin/settings" replace />} />
          
          {/* Redirect tenant-admin/tenants to dashboard since it's no longer needed */}
          <Route path="/tenant-admin/tenants" element={<Navigate to="/tenant-admin/dashboard" replace />} />
          
          {/* Catch-all route - 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
