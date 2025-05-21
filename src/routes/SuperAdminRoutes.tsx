
import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from '@/pages/superadmin/Dashboard';
import Tenants from '@/pages/superadmin/Tenants';
import Users from '@/pages/superadmin/Users';
import Companies from '@/pages/superadmin/Companies';
import People from '@/pages/superadmin/People';
import Talents from '@/pages/superadmin/Talents';
import Contacts from '@/pages/superadmin/Contacts';
import Revenue from '@/pages/superadmin/Revenue';
import Settings from '@/pages/superadmin/Settings';
import Analytics from '@/pages/superadmin/Analytics';
import AuthGuard from '@/components/AuthGuard';

const SuperAdminRoutes = () => [
  /* Super Admin Routes with Authentication Guard */
  <Route
    path="/superadmin/dashboard"
    element={
      <AuthGuard>
        <Dashboard />
      </AuthGuard>
    }
    key="superadmin-dashboard"
  />,
  <Route
    path="/superadmin/tenants"
    element={
      <AuthGuard>
        <Tenants />
      </AuthGuard>
    }
    key="superadmin-tenants"
  />,
  <Route
    path="/superadmin/users"
    element={
      <AuthGuard>
        <Users />
      </AuthGuard>
    }
    key="superadmin-users"
  />,
  <Route
    path="/superadmin/companies"
    element={
      <AuthGuard>
        <Companies />
      </AuthGuard>
    }
    key="superadmin-companies"
  />,
  <Route
    path="/superadmin/people"
    element={
      <AuthGuard>
        <People />
      </AuthGuard>
    }
    key="superadmin-people"
  />,
  <Route
    path="/superadmin/talents"
    element={
      <AuthGuard>
        <Talents />
      </AuthGuard>
    }
    key="superadmin-talents"
  />,
  <Route
    path="/superadmin/contacts"
    element={
      <AuthGuard>
        <Contacts />
      </AuthGuard>
    }
    key="superadmin-contacts"
  />,
  <Route
    path="/superadmin/revenue"
    element={
      <AuthGuard>
        <Revenue />
      </AuthGuard>
    }
    key="superadmin-revenue"
  />,
  <Route
    path="/superadmin/settings"
    element={
      <AuthGuard>
        <Settings />
      </AuthGuard>
    }
    key="superadmin-settings"
  />,
  <Route
    path="/superadmin/analytics"
    element={
      <AuthGuard>
        <Analytics />
      </AuthGuard>
    }
    key="superadmin-analytics"
  />
];

export default SuperAdminRoutes;
