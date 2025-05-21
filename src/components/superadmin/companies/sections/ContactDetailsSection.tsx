
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CompanyFormValues } from '../schema';
import { FormInput } from '@/components/superadmin/tenant-form/fields';
import { FormSelect } from '@/components/superadmin/tenant-form/fields';

interface ContactDetailsSectionProps {
  form: UseFormReturn<CompanyFormValues>;
  readOnly?: boolean; // Added missing prop
}

const ContactDetailsSection: React.FC<ContactDetailsSectionProps> = ({ form, readOnly = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInput
        form={form}
        name="email"
        label="Business Email Address"
        placeholder="contact@company.com"
        type="email"
        readOnly={readOnly}
      />
      
      <FormInput
        form={form}
        name="phone"
        label="Business Phone Number"
        placeholder="+1 (555) 123-4567"
        readOnly={readOnly}
      />
      
      <FormInput
        form={form}
        name="location"
        label="Primary Business Location"
        placeholder="City, Country"
        readOnly={readOnly}
      />
      
      <FormInput
        form={form}
        name="founded"
        label="Year Founded"
        type="number"
        placeholder="2023"
        readOnly={readOnly}
      />
    </div>
  );
};

export default ContactDetailsSection;
