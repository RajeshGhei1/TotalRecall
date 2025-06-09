
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CompanyFormValues } from '../schema';
import { FormInput } from '@/components/superadmin/tenant-form/fields';
import ParentCompanySelector from './ParentCompanySelector';
import CompanyHierarchyDisplay from './CompanyHierarchyDisplay';

interface GroupStructureSectionProps {
  form: UseFormReturn<CompanyFormValues>;
  readOnly?: boolean;
}

const GroupStructureSection: React.FC<GroupStructureSectionProps> = ({ form, readOnly = false }) => {
  const watchedParentId = form.watch('parentCompanyId');
  const watchedCompanyId = form.watch('id');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ParentCompanySelector
          form={form}
          name="parentCompanyId"
          label="Parent Company"
          placeholder="Search for parent company..."
          currentCompanyId={watchedCompanyId}
          disabled={readOnly}
        />
        
        <FormInput
          form={form}
          name="companyGroupName"
          label="Group Name"
          placeholder="e.g., HDFC Group"
          readOnly={readOnly}
        />
      </div>

      {watchedParentId && (
        <div className="mt-6">
          <CompanyHierarchyDisplay 
            companyId={watchedParentId}
            currentCompanyId={watchedCompanyId}
          />
        </div>
      )}

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Group Structure Guidelines</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Select a parent company if this company is part of a larger group</li>
          <li>• Group name helps organize related companies (e.g., "HDFC Group")</li>
          <li>• Hierarchy automatically updates when parent relationships change</li>
          <li>• Companies cannot be their own parent (circular references prevented)</li>
        </ul>
      </div>
    </div>
  );
};

export default GroupStructureSection;
