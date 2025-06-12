
import React from 'react';
import { Button } from "@/components/ui/button";
import CompanySelector from './CompanySelector';
import RoleInput from './RoleInput';
import DateSelectors from './DateSelectors';
import ManagerSelector from './ManagerSelector';
import { DialogFooter } from "@/components/ui/dialog";
import { LinkCompanyRelationshipData } from '@/types/company-relationship-types';

interface CompanyLinkFormContentProps {
  formData: LinkCompanyRelationshipData;
  startDate: Date | undefined;
  endDate: Date | undefined;
  companies: { id: string; name: string }[];
  potentialManagers: Array<{ person: {
    id: string;
    full_name: string;
    email?: string | null;
    type?: string;
    role?: string;
  } | null }>;
  isSubmitting: boolean;
  handleCompanyChange: (value: string) => void;
  handleRoleChange: (value: string) => void;
  handleStartDateChange: (date: Date | undefined) => void;
  handleEndDateChange: (date: Date | undefined) => void;
  handleManagerChange: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const CompanyLinkFormContent: React.FC<CompanyLinkFormContentProps> = ({
  formData,
  startDate,
  endDate,
  companies,
  potentialManagers,
  isSubmitting,
  handleCompanyChange,
  handleRoleChange,
  handleStartDateChange,
  handleEndDateChange,
  handleManagerChange,
  handleSubmit
}) => {
  console.log('CompanyLinkFormContent rendering with:', {
    formData,
    companiesCount: companies.length,
    potentialManagersCount: potentialManagers.length
  });

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <CompanySelector 
        companyId={formData.company_id}
        companies={companies}
        onCompanyChange={handleCompanyChange}
      />
      
      <RoleInput 
        role={formData.role}
        onRoleChange={handleRoleChange}
      />
      
      <DateSelectors 
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
      />
      
      {formData.company_id && potentialManagers.length > 0 && (
        <ManagerSelector 
          reportsTo={formData.reports_to || ''}
          potentialManagers={potentialManagers}
          onManagerChange={handleManagerChange}
        />
      )}
      
      <DialogFooter>
        <Button 
          type="submit" 
          disabled={isSubmitting || !formData.company_id || !formData.role || !startDate}
        >
          {isSubmitting ? "Submitting..." : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CompanyLinkFormContent;
