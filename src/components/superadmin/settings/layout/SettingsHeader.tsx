
import React from 'react';

const SettingsHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage platform modules, system configurations, and integrations
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsHeader;
