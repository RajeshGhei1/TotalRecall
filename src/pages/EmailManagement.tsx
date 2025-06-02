
import React from 'react';
import { EmailManagementPage } from '@/components/email/EmailManagementPage';
import TenantLayout from '@/components/TenantLayout';

const EmailManagement: React.FC = () => {
  return (
    <TenantLayout>
      <div className="p-6">
        <EmailManagementPage />
      </div>
    </TenantLayout>
  );
};

export default EmailManagement;
