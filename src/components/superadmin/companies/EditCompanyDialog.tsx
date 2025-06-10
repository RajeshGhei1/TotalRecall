
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CompanyForm } from './CompanyForm';
import { CompanyFormValues } from './schema';
import { Company } from '@/hooks/useCompanies';

interface EditCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
  onSubmit: (data: CompanyFormValues) => void;
  isSubmitting: boolean;
}

export const EditCompanyDialog: React.FC<EditCompanyDialogProps> = ({
  isOpen,
  onClose,
  company,
  onSubmit,
  isSubmitting,
}) => {
  // Transform company data to match form schema
  const initialData: Partial<CompanyFormValues> = {
    id: company.id,
    name: company.name,
    website: company.website || '',
    industry: company.industry || '',
    size: company.size || '',
    description: company.description || '',
    location: company.location || '',
    email: company.email || '',
    phone: company.phone || '',
    founded: company.founded,
    linkedin: company.linkedin || '',
    twitter: company.twitter || '',
    facebook: company.facebook || '',
    cin: company.cin || '',
    companyStatus: company.companyStatus || '',
    registeredOfficeAddress: company.registeredOfficeAddress || '',
    registrationDate: company.registrationDate ? new Date(company.registrationDate) : undefined,
    registeredEmailAddress: company.registeredEmailAddress || '',
    noOfDirectives: company.noOfDirectives || '',
    globalRegion: company.globalRegion || '',
    country: company.country || '',
    region: company.region || '',
    hoLocation: company.hoLocation || '',
    industry1: company.industry1 || '',
    industry2: company.industry2 || '',
    industry3: company.industry3 || '',
    companySector: company.companySector || '',
    companyType: company.companyType || '',
    entityType: company.entityType || '',
    noOfEmployee: company.noOfEmployee || '',
    segmentAsPerNumberOfEmployees: company.segmentAsPerNumberOfEmployees || '',
    turnOver: company.turnover || '',
    segmentAsPerTurnover: company.segmentAsPerTurnover || '',
    turnoverYear: company.turnoverYear || '',
    yearOfEstablishment: company.yearOfEstablishment || '',
    paidupCapital: company.paidupCapital || '',
    segmentAsPerPaidUpCapital: company.segmentAsPerPaidUpCapital || '',
    areaOfSpecialize: company.areaOfSpecialize || '',
    serviceLine: company.serviceLine || '',
    verticles: company.verticles || '',
    companyProfile: company.companyProfile || '',
    endUserChannel: company.endUserChannel || '',
    parentCompanyId: company.parent_company_id || '',
    companyGroupName: company.company_group_name || '',
    hierarchyLevel: company.hierarchy_level || 0,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Company: {company.name}</DialogTitle>
        </DialogHeader>
        <CompanyForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onCancel={onClose}
          initialData={initialData}
          isEdit={true}
        />
      </DialogContent>
    </Dialog>
  );
};
