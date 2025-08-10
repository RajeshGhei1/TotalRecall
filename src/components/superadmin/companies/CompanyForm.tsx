
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader, Settings } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { companyFormSchema, CompanyFormValues, formOptions } from './schema';
import BasicInfoSection from './sections/BasicInfoSection';
import ContactDetailsSection from './sections/ContactDetailsSection';
import SocialMediaSection from './sections/SocialMediaSection';
import PeopleSection from './sections/PeopleSection';
import GroupStructureSection from './sections/GroupStructureSection';
import CustomFieldsForm from '@/components/CustomFieldsForm';
import { useCustomFieldsQuery } from '@/hooks/customFields/useCustomFieldsQuery';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Import sections from tenant form
import LocationSection from '@/components/superadmin/tenant-form/LocationSection';
import IndustrySection from '@/components/superadmin/tenant-form/IndustrySection';
import CompanyMetricsSection from '@/components/superadmin/tenant-form/CompanyMetricsSection';

interface CompanyFormProps {
  onSubmit: (data: CompanyFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
  initialData?: Partial<CompanyFormValues>;
  isEdit?: boolean;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({ 
  onSubmit, 
  isSubmitting, 
  onCancel,
  initialData = {},
  isEdit = false
}) => {
  const navigate = useNavigate();
  const { user, bypassAuth } = useAuth();
  
  // Get current tenant ID using the standard pattern
  const { data: tenantData } = useQuery({
    queryKey: ['currentTenantData', user?.id],
    queryFn: async () => {
      if (bypassAuth) {
        return { tenant_id: 'mock-tenant-id' };
      }
      
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_tenants')
        .select('tenant_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user || bypassAuth,
  });

  const currentTenantId = tenantData?.tenant_id || null;

  // Fetch custom fields for companies
  const { fields: customFields = [], isLoading: customFieldsLoading } = useCustomFieldsQuery(
    currentTenantId || 'global',
    'company' // Form context for companies
  );
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      id: initialData.id || undefined,
      name: initialData.name || '',
      website: initialData.website || '',
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
    // Extract custom field values from the form data
    const customFieldValues: Record<string, any> = {};
    customFields.forEach(field => {
      const fieldKey = `custom_${field.field_key}`;
      if (data[fieldKey] !== undefined) {
        customFieldValues[field.field_key] = data[fieldKey];
      }
    });

    // Include custom field values in the submission
    const submissionData = {
      ...data,
      customFieldValues
    };

    onSubmit(submissionData);
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
            <LocationSection 
              form={form} 
              showBranchOffices={isEdit && !!initialData.id}
              companyId={initialData.id}
              companyName={initialData.name || ''}
            />
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

          {/* Enhanced Custom Fields Section */}
          {customFieldsLoading ? (
            <Card className="border-dashed border-gray-300">
              <CardContent className="pt-6">
                <div className="text-center text-gray-500 py-8">
                  <Loader className="h-8 w-8 mx-auto mb-2 animate-spin" />
                  <p>Loading custom fields...</p>
                </div>
              </CardContent>
            </Card>
          ) : customFields.length > 0 ? (
            <>
              <Separator />
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <Settings className="h-5 w-5 text-purple-600" />
                      Custom Fields
                    </h2>
                    <p className="text-sm text-muted-foreground">Additional custom information for this company</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-purple-50 border-purple-200">
                      {customFields.length} fields available
                    </Badge>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('/superadmin/settings?tab=custom-fields', '_blank')}
                    >
                      Manage Global Fields
                    </Button>
                  </div>
                </div>
                
                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="pt-6">
                    <CustomFieldsForm
                      formContext="company"
                      entityType="company"
                      entityId={initialData.id}
                      form={form}
                      title=""
                      description=""
                      tenantId={currentTenantId || 'global'}
                    />
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card className="border-dashed border-gray-300">
              <CardContent className="pt-6">
                <div className="text-center text-gray-500 py-8">
                  <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="mb-2">No custom fields configured</p>
                  <p className="text-sm mb-4">Create custom fields to collect additional company information</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/superadmin/settings?tab=custom-fields')}
                  >
                    Create Global Custom Fields
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                  {isEdit ? 'Updating...' : 'Creating Company...'}
                </>
              ) : (
                isEdit ? 'Update Company' : 'Create Company'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CompanyForm;
