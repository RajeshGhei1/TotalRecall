
import React from 'react';
import { Route, Routes } from 'react-router-dom';
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

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="tenants" element={<Tenants />} />
      <Route path="users" element={<Users />} />
      <Route path="companies" element={<Companies />} />
      <Route path="people" element={<People />} />
      <Route path="talents" element={<Talents />} />
      <Route path="contacts" element={<Contacts />} />
      <Route path="revenue" element={<Revenue />} />
      <Route path="settings" element={<Settings />} />
      <Route path="analytics" element={<Analytics />} />
    </Routes>
  );
};

export default SuperAdminRoutes;
