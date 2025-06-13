
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/superadmin/Dashboard';
import Tenants from '@/pages/superadmin/Tenants';
import Companies from '@/pages/superadmin/Companies';
import CompanyDetailView from '@/components/superadmin/companies/CompanyDetailView';
import SubscriptionPlans from '@/pages/superadmin/SubscriptionPlans';
import AIModels from '@/pages/superadmin/AIModels';

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tenants" element={<Tenants />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/companies/:companyId" element={<CompanyDetailView />} />
      <Route path="/subscription-plans" element={<SubscriptionPlans />} />
      <Route path="/ai-models" element={<AIModels />} />
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
};

export default SuperAdminRoutes;
