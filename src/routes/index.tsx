
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
          
          {/* Redirect old admin routes to superadmin for backward compatibility */}
          <Route path="/admin/dashboard" element={<Navigate to="/superadmin/dashboard" replace />} />
          <Route path="/admin/tenants" element={<Navigate to="/superadmin/tenants" replace />} />
          <Route path="/admin/users" element={<Navigate to="/superadmin/users" replace />} />
          <Route path="/admin/settings" element={<Navigate to="/superadmin/settings" replace />} />
          <Route path="/admin/analytics" element={<Navigate to="/superadmin/analytics" replace />} />
          <Route path="/admin/companies" element={<Navigate to="/superadmin/companies" replace />} />
          <Route path="/admin/people" element={<Navigate to="/superadmin/people" replace />} />
          <Route path="/admin/contacts" element={<Navigate to="/superadmin/contacts" replace />} />
          <Route path="/admin/revenue" element={<Navigate to="/superadmin/revenue" replace />} />
          <Route path="/admin/subscription-plans" element={<Navigate to="/superadmin/subscription-plans" replace />} />
          <Route path="/admin/form-builder" element={<Navigate to="/superadmin/form-builder" replace />} />
          
          {/* Redirect tenant-admin/tenants to dashboard since tenants shouldn't manage other tenants */}
          <Route path="/tenant-admin/tenants" element={<Navigate to="/tenant-admin/dashboard" replace />} />
          <Route path="/tenant-admin/tenants/*" element={<Navigate to="/tenant-admin/dashboard" replace />} />
          
          {/* Catch-all route - 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
