
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ErrorBoundary } from '@/components/ui/error-boundary';

import { tenantFormSchema, TenantFormValues } from './schema';
import BasicInfoSection from './BasicInfoSection';
import LocationSection from './LocationSection';
import IndustrySection from './IndustrySection';
import CompanyMetricsSection from './CompanyMetricsSection';
import AdditionalInfoSection from './AdditionalInfoSection';
import CustomFieldsForm from '@/components/CustomFieldsForm';
import { useCustomFieldsHook } from '@/hooks/customFields/useCustomFieldsHook';

interface ExtendedTenantFormProps {
  onSubmit: (data: TenantFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  initialData?: Partial<TenantFormValues>;
}

const ExtendedTenantForm: React.FC<ExtendedTenantFormProps> = ({ 
  onSubmit, 
  isSubmitting, 
  onCancel,
  initialData 
}) => {
  const { customFields, isLoading: customFieldsLoading } = useCustomFieldsHook('global', {
    formContext: 'tenant_creation'
  });
  
  const defaultValues = {
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
    ...initialData,
  };
  
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues
  });

  useEffect(() => {
    if (initialData) {
      form.reset(defaultValues);
    }
  }, [initialData, form]);

  useEffect(() => {
    if (customFields && customFields.length > 0) {
      const currentValues = form.getValues();
      form.reset(currentValues);
    }
  }, [customFields, form]);

  const handleFormSubmit = (data: TenantFormValues) => {
    console.log("Form submission with custom fields:", data);
    onSubmit(data);
  };

  const isEditing = !!initialData?.name;

  return (
    <ErrorBoundary>
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

            <ErrorBoundary>
              <TabsContent value="basic" className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
                <BasicInfoSection form={form} />
              </TabsContent>
            </ErrorBoundary>
            
            <ErrorBoundary>
              <TabsContent value="location" className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Location</h3>
                <LocationSection form={form} />
              </TabsContent>
            </ErrorBoundary>
            
            <ErrorBoundary>
              <TabsContent value="industry" className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Industry & Company Type</h3>
                <IndustrySection form={form} />
              </TabsContent>
            </ErrorBoundary>
            
            <ErrorBoundary>
              <TabsContent value="metrics" className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Company Metrics</h3>
                <CompanyMetricsSection form={form} />
              </TabsContent>
            </ErrorBoundary>
            
            <ErrorBoundary>
              <TabsContent value="additional" className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Additional Information</h3>
                <AdditionalInfoSection form={form} />
              </TabsContent>
            </ErrorBoundary>
            
            <ErrorBoundary>
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
                    formContext="tenant_creation"
                    entityType="tenant"
                    form={form}
                  />
                )}
              </TabsContent>
            </ErrorBoundary>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                isEditing ? 'Update Tenant' : 'Create Tenant'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </ErrorBoundary>
  );
};

export default ExtendedTenantForm;
