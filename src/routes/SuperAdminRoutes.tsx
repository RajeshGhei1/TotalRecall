
import { Route } from "react-router-dom";
import Dashboard from "@/pages/superadmin/Dashboard";
import Tenants from "@/pages/superadmin/Tenants";
import Users from "@/pages/superadmin/Users";
import Settings from "@/pages/superadmin/Settings";
import People from "@/pages/superadmin/People";
import Companies from "@/pages/superadmin/Companies";
import Revenue from "@/pages/superadmin/Revenue";
import AuthGuard from "@/components/AuthGuard";
import { Navigate } from "react-router-dom";

const SuperAdminRoutes = () => {
  return (
    <>
      {/* Superadmin Routes with Authentication Guard */}
      <Route
        path="/superadmin/dashboard"
        element={
          <AuthGuard requiresSuperAdmin={true}>
            <Dashboard />
          </AuthGuard>
        }
      />
      <Route
        path="/superadmin/tenants"
        element={
          <AuthGuard requiresSuperAdmin={true}>
            <Tenants />
          </AuthGuard>
        }
      />
      <Route
        path="/superadmin/users"
        element={
          <AuthGuard requiresSuperAdmin={true}>
            <Users />
          </AuthGuard>
        }
      />
      <Route
        path="/superadmin/people"
        element={
          <AuthGuard requiresSuperAdmin={true}>
            <People />
          </AuthGuard>
        }
      />
      <Route
        path="/superadmin/companies"
        element={
          <AuthGuard requiresSuperAdmin={true}>
            <Companies />
          </AuthGuard>
        }
      />
      <Route
        path="/superadmin/settings"
        element={
          <AuthGuard requiresSuperAdmin={true}>
            <Settings />
          </AuthGuard>
        }
      />
      <Route
        path="/superadmin/revenue"
        element={
          <AuthGuard requiresSuperAdmin={true}>
            <Revenue />
          </AuthGuard>
        }
      />
      
      {/* Redirect old Talents and Contacts routes to the new People page */}
      <Route
        path="/superadmin/talents"
        element={<Navigate to="/superadmin/people" replace />}
      />
      <Route
        path="/superadmin/contacts"
        element={<Navigate to="/superadmin/people" replace />}
      />
    </>
  );
};

export default SuperAdminRoutes;
