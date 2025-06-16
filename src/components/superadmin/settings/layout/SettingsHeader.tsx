
import React from 'react';

const SettingsHeader: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-lg text-gray-600 mt-2">
          Manage platform modules, system configurations, and integrations
        </p>
      </div>
    </div>
  );
};

export default SettingsHeader;
