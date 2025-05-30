
import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/tenant-admin/Dashboard';
import Companies from '@/pages/tenant-admin/Companies';
import Contacts from '@/pages/tenant-admin/Contacts';
import Talent from '@/pages/tenant-admin/Talent';
import Jobs from '@/pages/tenant-admin/Jobs';
import Users from '@/pages/tenant-admin/Users';
import Settings from '@/pages/tenant-admin/Settings';
import SmartTalentAnalytics from '@/pages/tenant-admin/SmartTalentAnalytics';

const TenantAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/talent" element={<Talent />} />
      <Route path="/smart-talent-analytics" element={<SmartTalentAnalytics />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/users" element={<Users />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default TenantAdminRoutes;
