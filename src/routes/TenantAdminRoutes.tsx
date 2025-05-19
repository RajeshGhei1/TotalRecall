
import { Route } from "react-router-dom";
import TenantAdminDashboard from "@/pages/tenant-admin/Dashboard";
import TenantAdminUsers from "@/pages/tenant-admin/Users";
import TenantAdminSettings from "@/pages/tenant-admin/Settings";
import TenantAdminTalent from "@/pages/tenant-admin/Talent";
import TenantAdminJobs from "@/pages/tenant-admin/Jobs";
import TenantAdminCompanies from "@/pages/tenant-admin/Companies";
import TenantAdminContacts from "@/pages/tenant-admin/Contacts";
import AuthGuard from "@/components/AuthGuard";

const TenantAdminRoutes = () => {
  return (
    <>
      {/* Tenant Admin Routes with Authentication Guard */}
      <Route
        path="/tenant-admin/dashboard"
        element={
          <AuthGuard>
            <TenantAdminDashboard />
          </AuthGuard>
        }
      />
      <Route
        path="/tenant-admin/users"
        element={
          <AuthGuard>
            <TenantAdminUsers />
          </AuthGuard>
        }
      />
      
      {/* Talent Management Routes */}
      <Route
        path="/tenant-admin/talent"
        element={
          <AuthGuard>
            <TenantAdminTalent />
          </AuthGuard>
        }
      />
      <Route
        path="/tenant-admin/talent/:action"
        element={
          <AuthGuard>
            <TenantAdminTalent />
          </AuthGuard>
        }
      />
      <Route
        path="/tenant-admin/talent/:action/:id"
        element={
          <AuthGuard>
            <TenantAdminTalent />
          </AuthGuard>
        }
      />
      
      {/* Companies Routes */}
      <Route
        path="/tenant-admin/companies"
        element={
          <AuthGuard>
            <TenantAdminCompanies />
          </AuthGuard>
        }
      />
      <Route
        path="/tenant-admin/companies/:action"
        element={
          <AuthGuard>
            <TenantAdminCompanies />
          </AuthGuard>
        }
      />
      <Route
        path="/tenant-admin/companies/:action/:id"
        element={
          <AuthGuard>
            <TenantAdminCompanies />
          </AuthGuard>
        }
      />
      
      {/* Contacts Routes */}
      <Route
        path="/tenant-admin/contacts"
        element={
          <AuthGuard>
            <TenantAdminContacts />
          </AuthGuard>
        }
      />
      <Route
        path="/tenant-admin/contacts/:action"
        element={
          <AuthGuard>
            <TenantAdminContacts />
          </AuthGuard>
        }
      />
      <Route
        path="/tenant-admin/contacts/:action/:id"
        element={
          <AuthGuard>
            <TenantAdminContacts />
          </AuthGuard>
        }
      />
      
      <Route
        path="/tenant-admin/jobs"
        element={
          <AuthGuard>
            <TenantAdminJobs />
          </AuthGuard>
        }
      />
      <Route
        path="/tenant-admin/settings"
        element={
          <AuthGuard>
            <TenantAdminSettings />
          </AuthGuard>
        }
      />
    </>
  );
};

export default TenantAdminRoutes;
