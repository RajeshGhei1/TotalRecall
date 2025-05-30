import { Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/superadmin/Dashboard';
import Tenants from '@/pages/superadmin/Tenants';
import Users from '@/pages/superadmin/Users';
import Companies from '@/pages/superadmin/Companies';
import People from '@/pages/superadmin/People';
import AIOrchestration from '@/pages/superadmin/AIOrchestration';
import AIAnalytics from '@/pages/superadmin/AIAnalytics';
import SubscriptionPlans from '@/pages/superadmin/SubscriptionPlans';
import GlobalSettings from '@/pages/superadmin/GlobalSettings';
import Settings from '@/pages/superadmin/Settings';

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tenants" element={<Tenants />} />
      <Route path="/users" element={<Users />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/people" element={<People />} />
      <Route path="/ai-orchestration" element={<AIOrchestration />} />
      <Route path="/ai-analytics" element={<AIAnalytics />} />
      <Route path="/subscription-plans" element={<SubscriptionPlans />} />
      <Route path="/global-settings" element={<GlobalSettings />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default SuperAdminRoutes;
