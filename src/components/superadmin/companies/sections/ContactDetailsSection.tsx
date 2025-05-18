
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CompanyFormValues } from '../schema';
import { FormInput } from '@/components/superadmin/tenant-form/fields';
import { FormSelect } from '@/components/superadmin/tenant-form/fields';

interface ContactDetailsSectionProps {
  form: UseFormReturn<CompanyFormValues>;
}

const ContactDetailsSection: React.FC<ContactDetailsSectionProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInput
        form={form}
        name="email"
        label="Business Email Address"
        placeholder="contact@company.com"
        type="email"
      />
      
      <FormInput
        form={form}
        name="phone"
        label="Business Phone Number"
        placeholder="+1 (555) 123-4567"
      />
      
      <FormInput
        form={form}
        name="location"
        label="Primary Business Location"
        placeholder="City, Country"
      />
      
      <FormInput
        form={form}
        name="founded"
        label="Year Founded"
        type="number"
        placeholder="2023"
      />
    </div>
  );
};

export default ContactDetailsSection;
