
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

import { tenantFormSchema, TenantFormValues } from './schema';
import BasicInfoSection from './BasicInfoSection';
import LocationSection from './LocationSection';
import IndustrySection from './IndustrySection';
import CompanyMetricsSection from './CompanyMetricsSection';
import AdditionalInfoSection from './AdditionalInfoSection';
import CustomFieldsForm from '@/components/CustomFieldsForm';
import { useCustomFields } from '@/hooks/useCustomFields';

interface ExtendedTenantFormProps {
  onSubmit: (data: TenantFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

const ExtendedTenantForm: React.FC<ExtendedTenantFormProps> = ({ 
  onSubmit, 
  isSubmitting, 
  onCancel 
}) => {
  const { customFields, isLoading: customFieldsLoading } = useCustomFields('global');
  
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      name: '',
      domain: '',
      cin: '',
      companyStatus: '',
      registeredOfficeAddress: '',
      registrationDate: undefined,
      registeredEmailAddress: '',
      noOfDirectives: '',
      globalRegion: '',
      country: '',
      region: '',
      hoLocation: '',
      industry1: '',
      industry2: '',
      industry3: '',
      companySector: '',
      companyType: '',
      entityType: '',
      noOfEmployee: '',
      segmentAsPerNumberOfEmployees: '',
      turnOver: '',
      segmentAsPerTurnover: '',
      turnoverYear: '',
      yearOfEstablishment: '',
      paidupCapital: '',
      segmentAsPerPaidUpCapital: '',
      areaOfSpecialize: '',
      serviceLine: '',
      verticles: '',
      webSite: '',
      companyProfile: '',
      endUserChannel: '',
    }
  });

  useEffect(() => {
    // This ensures the form knows about any custom fields that might be added
    if (customFields && customFields.length > 0) {
      const currentValues = form.getValues();
      form.reset(currentValues);
    }
  }, [customFields, form]);

  const handleFormSubmit = (data: TenantFormValues) => {
    console.log("Form submission with custom fields:", data);
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
        <BasicInfoSection form={form} />
        
        <h3 className="text-lg font-medium border-b pb-2 mt-8">Location</h3>
        <LocationSection form={form} />
        
        <h3 className="text-lg font-medium border-b pb-2 mt-8">Industry & Company Type</h3>
        <IndustrySection form={form} />
        
        <h3 className="text-lg font-medium border-b pb-2 mt-8">Company Metrics</h3>
        <CompanyMetricsSection form={form} />
        
        <h3 className="text-lg font-medium border-b pb-2 mt-8">Additional Information</h3>
        <AdditionalInfoSection form={form} />
        
        {!customFieldsLoading && customFields.length > 0 && (
          <>
            <h3 className="text-lg font-medium border-b pb-2 mt-8">Custom Fields</h3>
            <CustomFieldsForm
              tenantId="global"
              entityType="tenant"
              form={form}
            />
          </>
        )}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ExtendedTenantForm;
