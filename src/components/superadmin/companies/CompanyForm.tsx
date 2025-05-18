
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { companyFormSchema, CompanyFormValues, formOptions } from './schema';
import BasicInfoSection from './sections/BasicInfoSection';
import ContactDetailsSection from './sections/ContactDetailsSection';
import SocialMediaSection from './sections/SocialMediaSection';
import CustomFieldsForm from '@/components/CustomFieldsForm';
import { useCustomFields } from '@/hooks/useCustomFields';

// Import sections from tenant form
import LocationSection from '@/components/superadmin/tenant-form/LocationSection';
import IndustrySection from '@/components/superadmin/tenant-form/IndustrySection';
import CompanyMetricsSection from '@/components/superadmin/tenant-form/CompanyMetricsSection';
import AdditionalInfoSection from '@/components/superadmin/tenant-form/AdditionalInfoSection';

interface CompanyFormProps {
  onSubmit: (data: CompanyFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  initialData?: Partial<CompanyFormValues>;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({ 
  onSubmit, 
  isSubmitting, 
  onCancel,
  initialData = {}
}) => {
  const { customFields, isLoading: customFieldsLoading } = useCustomFields('global', {
    formContext: 'company_creation'
  });
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: initialData.name || '',
      website: initialData.website || '',
      industry: initialData.industry || '',
      size: initialData.size || '',
      description: initialData.description || '',
      location: initialData.location || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      founded: initialData.founded,
      linkedin: initialData.linkedin || '',
      twitter: initialData.twitter || '',
      facebook: initialData.facebook || '',
      // Add tenant-specific fields
      cin: initialData.cin || '',
      companyStatus: initialData.companyStatus || '',
      registeredOfficeAddress: initialData.registeredOfficeAddress || '',
      registrationDate: initialData.registrationDate || undefined,
      registeredEmailAddress: initialData.registeredEmailAddress || '',
      noOfDirectives: initialData.noOfDirectives || '',
      globalRegion: initialData.globalRegion || '',
      country: initialData.country || '',
      region: initialData.region || '',
      hoLocation: initialData.hoLocation || '',
      industry1: initialData.industry1 || '',
      industry2: initialData.industry2 || '',
      industry3: initialData.industry3 || '',
      companySector: initialData.companySector || '',
      companyType: initialData.companyType || '',
      entityType: initialData.entityType || '',
      noOfEmployee: initialData.noOfEmployee || '',
      segmentAsPerNumberOfEmployees: initialData.segmentAsPerNumberOfEmployees || '',
      turnOver: initialData.turnOver || '',
      segmentAsPerTurnover: initialData.segmentAsPerTurnover || '',
      turnoverYear: initialData.turnoverYear || '',
      yearOfEstablishment: initialData.yearOfEstablishment || '',
      paidupCapital: initialData.paidupCapital || '',
      segmentAsPerPaidUpCapital: initialData.segmentAsPerPaidUpCapital || '',
      areaOfSpecialize: initialData.areaOfSpecialize || '',
      serviceLine: initialData.serviceLine || '',
      verticles: initialData.verticles || '',
      companyProfile: initialData.companyProfile || '',
      endUserChannel: initialData.endUserChannel || '',
      ...initialData
    }
  });

  useEffect(() => {
    // This ensures the form knows about any custom fields that might be added
    if (customFields && customFields.length > 0) {
      const currentValues = form.getValues();
      form.reset(currentValues);
    }
  }, [customFields, form]);

  const handleFormSubmit = (data: CompanyFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="w-full grid grid-cols-6 mb-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="industry">Industry & Type</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
            <TabsTrigger value="custom" className="relative">
              Custom Fields
              {!customFieldsLoading && customFields.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {customFields.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
            <BasicInfoSection form={form} options={formOptions} />
          </TabsContent>
          
          <TabsContent value="location" className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Location</h3>
            <LocationSection form={form} />
          </TabsContent>
          
          <TabsContent value="industry" className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Industry & Company Type</h3>
            <IndustrySection form={form} />
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Company Metrics</h3>
            <CompanyMetricsSection form={form} />
          </TabsContent>
          
          <TabsContent value="additional" className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Additional Information</h3>
            <AdditionalInfoSection form={form} />
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Custom Fields</h3>
            {customFieldsLoading ? (
              <div className="flex items-center justify-center p-8 border rounded-md">
                <Loader className="h-5 w-5 animate-spin mr-2" />
                <span>Loading custom fields...</span>
              </div>
            ) : customFields.length === 0 ? (
              <div className="p-8 text-center border rounded-md">
                <p className="text-muted-foreground">No custom fields have been defined yet.</p>
                <p className="text-sm mt-2">
                  You can define global custom fields in the Settings page.
                </p>
              </div>
            ) : (
              <CustomFieldsForm
                formContext="company_creation"
                entityType="company"
                form={form}
              />
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Create Company'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CompanyForm;
