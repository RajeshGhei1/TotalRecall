
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
          <TabsList className="w-full grid grid-cols-4 mb-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="contact">Contact Details</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
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
          
          <TabsContent value="contact" className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Contact Details</h3>
            <ContactDetailsSection form={form} />
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Social Media</h3>
            <SocialMediaSection form={form} />
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
