
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CompanyFormValues } from '../schema';
import CompanyPeopleManager from '@/components/people/CompanyPeopleManager';

interface PeopleSectionProps {
  form: UseFormReturn<CompanyFormValues>;
}

const PeopleSection: React.FC<PeopleSectionProps> = ({ form }) => {
  // Get company ID from form (for existing companies) or generate a temporary ID for new companies
  const formValues = form.getValues();
  // Use nullish coalescing to provide a fallback for the ID
  const companyId = formValues.id ?? 'new';
  
  return (
    <CompanyPeopleManager companyId={companyId} />
  );
};

export default PeopleSection;
