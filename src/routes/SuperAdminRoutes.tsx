
import { Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/superadmin/Dashboard";
import Tenants from "@/pages/superadmin/Tenants";
import Users from "@/pages/superadmin/Users";
import Settings from "@/pages/superadmin/Settings";
import People from "@/pages/superadmin/People";
import Companies from "@/pages/superadmin/Companies";
import Revenue from "@/pages/superadmin/Revenue";
import AuthGuard from "@/components/AuthGuard";

const SuperAdminRoutes = () => [
  /* Superadmin Routes with Authentication Guard */
  <Route
    path="/superadmin/dashboard"
    element={
      <AuthGuard requiresSuperAdmin={true}>
        <Dashboard />
      </AuthGuard>
    }
    key="superadmin-dashboard"
  />,
  <Route
    path="/superadmin/tenants"
    element={
      <AuthGuard requiresSuperAdmin={true}>
        <Tenants />
      </AuthGuard>
    }
    key="superadmin-tenants"
  />,
  <Route
    path="/superadmin/users"
    element={
      <AuthGuard requiresSuperAdmin={true}>
        <Users />
      </AuthGuard>
    }
    key="superadmin-users"
  />,
  <Route
    path="/superadmin/people"
    element={
      <AuthGuard requiresSuperAdmin={true}>
        <People />
      </AuthGuard>
    }
    key="superadmin-people"
  />,
  <Route
    path="/superadmin/companies"
    element={
      <AuthGuard requiresSuperAdmin={true}>
        <Companies />
      </AuthGuard>
    }
    key="superadmin-companies"
  />,
  <Route
    path="/superadmin/settings"
    element={
      <AuthGuard requiresSuperAdmin={true}>
        <Settings />
      </AuthGuard>
    }
    key="superadmin-settings"
  />,
  <Route
    path="/superadmin/revenue"
    element={
      <AuthGuard requiresSuperAdmin={true}>
        <Revenue />
      </AuthGuard>
    }
    key="superadmin-revenue"
  />,
  
  /* Redirect old Talents and Contacts routes to the new People page */
  <Route
    path="/superadmin/talents"
    element={<Navigate to="/superadmin/people" replace />}
    key="superadmin-talents-redirect"
  />,
  <Route
    path="/superadmin/contacts"
    element={<Navigate to="/superadmin/people" replace />}
    key="superadmin-contacts-redirect"
  />
];

export default SuperAdminRoutes;
