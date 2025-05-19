
import { Route } from "react-router-dom";
import TenantAdminDashboard from "@/pages/tenant-admin/Dashboard";
import TenantAdminUsers from "@/pages/tenant-admin/Users";
import TenantAdminSettings from "@/pages/tenant-admin/Settings";
import TenantAdminTalent from "@/pages/tenant-admin/Talent";
import TenantAdminJobs from "@/pages/tenant-admin/Jobs";
import TenantAdminCompanies from "@/pages/tenant-admin/Companies";
import TenantAdminContacts from "@/pages/tenant-admin/Contacts";
import AuthGuard from "@/components/AuthGuard";

const TenantAdminRoutes = () => [
  /* Tenant Admin Routes with Authentication Guard */
  <Route
    path="/tenant-admin/dashboard"
    element={
      <AuthGuard>
        <TenantAdminDashboard />
      </AuthGuard>
    }
    key="tenant-dashboard"
  />,
  <Route
    path="/tenant-admin/users"
    element={
      <AuthGuard>
        <TenantAdminUsers />
      </AuthGuard>
    }
    key="tenant-users"
  />,
  
  /* Talent Management Routes */
  <Route
    path="/tenant-admin/talent"
    element={
      <AuthGuard>
        <TenantAdminTalent />
      </AuthGuard>
    }
    key="tenant-talent"
  />,
  <Route
    path="/tenant-admin/talent/:action"
    element={
      <AuthGuard>
        <TenantAdminTalent />
      </AuthGuard>
    }
    key="tenant-talent-action"
  />,
  <Route
    path="/tenant-admin/talent/:action/:id"
    element={
      <AuthGuard>
        <TenantAdminTalent />
      </AuthGuard>
    }
    key="tenant-talent-action-id"
  />,
  
  /* Companies Routes */
  <Route
    path="/tenant-admin/companies"
    element={
      <AuthGuard>
        <TenantAdminCompanies />
      </AuthGuard>
    }
    key="tenant-companies"
  />,
  <Route
    path="/tenant-admin/companies/:action"
    element={
      <AuthGuard>
        <TenantAdminCompanies />
      </AuthGuard>
    }
    key="tenant-companies-action"
  />,
  <Route
    path="/tenant-admin/companies/:action/:id"
    element={
      <AuthGuard>
        <TenantAdminCompanies />
      </AuthGuard>
    }
    key="tenant-companies-action-id"
  />,
  
  /* Contacts Routes */
  <Route
    path="/tenant-admin/contacts"
    element={
      <AuthGuard>
        <TenantAdminContacts />
      </AuthGuard>
    }
    key="tenant-contacts"
  />,
  <Route
    path="/tenant-admin/contacts/:action"
    element={
      <AuthGuard>
        <TenantAdminContacts />
      </AuthGuard>
    }
    key="tenant-contacts-action"
  />,
  <Route
    path="/tenant-admin/contacts/:action/:id"
    element={
      <AuthGuard>
        <TenantAdminContacts />
      </AuthGuard>
    }
    key="tenant-contacts-action-id"
  />,
  
  <Route
    path="/tenant-admin/jobs"
    element={
      <AuthGuard>
        <TenantAdminJobs />
      </AuthGuard>
    }
    key="tenant-jobs"
  />,
  <Route
    path="/tenant-admin/settings"
    element={
      <AuthGuard>
        <TenantAdminSettings />
      </AuthGuard>
    }
    key="tenant-settings"
  />
];

export default TenantAdminRoutes;
