
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CompanyFormValues } from '../schema';
import { FormInput } from '@/components/superadmin/tenant-form/fields';

interface SocialMediaSectionProps {
  form: UseFormReturn<CompanyFormValues>;
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInput
        form={form}
        name="linkedin"
        label="LinkedIn"
        placeholder="https://linkedin.com/company/example"
      />
      
      <FormInput
        form={form}
        name="twitter"
        label="Twitter/X"
        placeholder="https://twitter.com/example"
      />
      
      <FormInput
        form={form}
        name="facebook"
        label="Facebook"
        placeholder="https://facebook.com/example"
      />
    </div>
  );
};

export default SocialMediaSection;
