import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

import { companyFormSchema, CompanyFormValues, formOptions } from './schema';
import BasicInfoSection from './sections/BasicInfoSection';
import ContactDetailsSection from './sections/ContactDetailsSection';
import SocialMediaSection from './sections/SocialMediaSection';
import PeopleSection from './sections/PeopleSection';
import GroupStructureSection from './sections/GroupStructureSection';
import CustomFieldsForm from '@/components/CustomFieldsForm';
import { useCustomFields } from '@/hooks/useCustomFields';

// Import sections from tenant form
import LocationSection from '@/components/superadmin/tenant-form/LocationSection';
import IndustrySection from '@/components/superadmin/tenant-form/IndustrySection';
import CompanyMetricsSection from '@/components/superadmin/tenant-form/CompanyMetricsSection';

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
      id: initialData.id || undefined,
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
      parentCompanyId: initialData.parentCompanyId || '',
      companyGroupName: initialData.companyGroupName || '',
      hierarchyLevel: initialData.hierarchyLevel || 0,
      ...initialData
    }
  });

  useEffect(() => {
    if (customFields && customFields.length > 0) {
      const currentValues = form.getValues();
      form.reset(currentValues);
    }
  }, [customFields, form]);

  const handleFormSubmit = (data: CompanyFormValues) => {
    onSubmit(data);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          
          {/* Basic Information Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>
              <p className="text-sm text-muted-foreground">Core company details and registration information</p>
            </div>
            <BasicInfoSection form={form} options={formOptions} />
          </div>

          <Separator />

          {/* Group Structure Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Group Structure</h2>
              <p className="text-sm text-muted-foreground">Parent company and organizational hierarchy</p>
            </div>
            <GroupStructureSection form={form} />
          </div>

          <Separator />

          {/* Location Information Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Location Information</h2>
              <p className="text-sm text-muted-foreground">Geographic and regional details</p>
            </div>
            <LocationSection form={form} />
          </div>

          <Separator />

          {/* Industry & Company Type Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Industry & Company Type</h2>
              <p className="text-sm text-muted-foreground">Business sector and classification details</p>
            </div>
            <IndustrySection form={form} />
          </div>

          <Separator />

          {/* Company Metrics Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Company Metrics</h2>
              <p className="text-sm text-muted-foreground">Financial and operational metrics</p>
            </div>
            <CompanyMetricsSection form={form} />
          </div>

          <Separator />

          {/* Contact Details Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Contact Details</h2>
              <p className="text-sm text-muted-foreground">Business contact information</p>
            </div>
            <ContactDetailsSection form={form} />
          </div>

          <Separator />

          {/* Social Media & Online Presence Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Online Presence</h2>
              <p className="text-sm text-muted-foreground">Social media and web presence</p>
            </div>
            <SocialMediaSection form={form} />
          </div>

          <Separator />

          {/* Associated People Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Associated People</h2>
              <p className="text-sm text-muted-foreground">Key personnel and relationships</p>
            </div>
            <PeopleSection form={form} />
          </div>

          {/* Custom Fields Section */}
          {!customFieldsLoading && customFields.length > 0 && (
            <>
              <Separator />
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Custom Fields</h2>
                    <p className="text-sm text-muted-foreground">Additional custom information</p>
                  </div>
                  <div className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
                    {customFields.length} fields
                  </div>
                </div>
                <CustomFieldsForm
                  formContext="company_creation"
                  entityType="company"
                  form={form}
                />
              </div>
            </>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Creating Company...
                </>
              ) : (
                'Create Company'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CompanyForm;
