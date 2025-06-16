
import React from 'react';
import ModuleManagement from '../ModuleManagement';

const ModulesTabContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Module Management</h2>
        <p className="text-gray-600">
          Configure platform modules that can be assigned to subscription plans
        </p>
      </div>

      <ModuleManagement />
    </div>
  );
};

export default ModulesTabContent;
