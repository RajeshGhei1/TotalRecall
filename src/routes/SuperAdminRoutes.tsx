
import { Route } from "react-router-dom";
import SuperAdminDashboard from "@/pages/superadmin/Dashboard";
import SuperAdminAnalytics from "@/pages/superadmin/Analytics";
import SuperAdminUsers from "@/pages/superadmin/Users";
import SuperAdminTenants from "@/pages/superadmin/Tenants";
import SuperAdminSettings from "@/pages/superadmin/Settings";
import SuperAdminTalents from "@/pages/superadmin/Talents";
import SuperAdminCompanies from "@/pages/superadmin/Companies";
import SuperAdminPeople from "@/pages/superadmin/People";
import SuperAdminContacts from "@/pages/superadmin/Contacts";
import SuperAdminRevenue from "@/pages/superadmin/Revenue";
import AuthGuard from "@/components/AuthGuard";
import CompanyDetailView from "@/components/superadmin/companies/CompanyDetailView";
import { PersonDetailView } from "@/components/people";

const SuperAdminRoutes = () => [
  <Route
    path="/superadmin/dashboard"
    element={
      <AuthGuard>
        <SuperAdminDashboard />
      </AuthGuard>
    }
    key="superadmin-dashboard"
  />,
  <Route
    path="/superadmin/analytics"
    element={
      <AuthGuard>
        <SuperAdminAnalytics />
      </AuthGuard>
    }
    key="superadmin-analytics"
  />,
  <Route
    path="/superadmin/users"
    element={
      <AuthGuard>
        <SuperAdminUsers />
      </AuthGuard>
    }
    key="superadmin-users"
  />,
  <Route
    path="/superadmin/tenants"
    element={
      <AuthGuard>
        <SuperAdminTenants />
      </AuthGuard>
    }
    key="superadmin-tenants"
  />,
  <Route
    path="/superadmin/settings"
    element={
      <AuthGuard>
        <SuperAdminSettings />
      </AuthGuard>
    }
    key="superadmin-settings"
  />,
  <Route
    path="/superadmin/talents"
    element={
      <AuthGuard>
        <SuperAdminTalents />
      </AuthGuard>
    }
    key="superadmin-talents"
  />,
  <Route
    path="/superadmin/companies"
    element={
      <AuthGuard>
        <SuperAdminCompanies />
      </AuthGuard>
    }
    key="superadmin-companies"
  />,
  <Route
    path="/superadmin/companies/:id"
    element={
      <AuthGuard>
        <CompanyDetailView />
      </AuthGuard>
    }
    key="superadmin-company-detail"
  />,
  <Route
    path="/superadmin/people"
    element={
      <AuthGuard>
        <SuperAdminPeople />
      </AuthGuard>
    }
    key="superadmin-people"
  />,
  <Route
    path="/superadmin/people/:id"
    element={
      <AuthGuard>
        <PersonDetailView />
      </AuthGuard>
    }
    key="superadmin-person-detail"
  />,
  <Route
    path="/superadmin/contacts"
    element={
      <AuthGuard>
        <SuperAdminContacts />
      </AuthGuard>
    }
    key="superadmin-contacts"
  />,
  <Route
    path="/superadmin/revenue"
    element={
      <AuthGuard>
        <SuperAdminRevenue />
      </AuthGuard>
    }
    key="superadmin-revenue"
  />
];

export default SuperAdminRoutes;
