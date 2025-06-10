
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CompanyFormValues } from '@/components/superadmin/companies/schema';
import { CognitiveFormWrapper } from './CognitiveFormWrapper';
import { SmartInput } from './SmartInput';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SmartCompanyFormProps {
  form: UseFormReturn<CompanyFormValues>;
  userId: string;
  readOnly?: boolean;
}

export const SmartCompanyForm: React.FC<SmartCompanyFormProps> = ({
  form,
  userId,
  readOnly = false
}) => {
  return (
    <CognitiveFormWrapper
      form={form}
      formType="company_creation"
      userId={userId}
      autoSuggest={!readOnly}
      showSuggestionsPanel={!readOnly}
    >
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="contact">Contact Details</TabsTrigger>
          <TabsTrigger value="additional">Additional Info</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <SmartInput
                    name="name"
                    label="Company Name"
                    value={field.value}
                    onChange={field.onChange}
                    fieldType="company_name"
                    formType="company_creation"
                    userId={userId}
                    required
                    placeholder="Enter company name"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <SmartInput
                    name="website"
                    label="Website"
                    value={field.value || ''}
                    onChange={field.onChange}
                    fieldType="website"
                    formType="company_creation"
                    userId={userId}
                    placeholder="https://example.com"
                    context={{ companyName: form.watch('name') }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <SmartInput
                    name="email"
                    label="Business Email"
                    value={field.value || ''}
                    onChange={field.onChange}
                    fieldType="email"
                    formType="company_creation"
                    userId={userId}
                    placeholder="contact@company.com"
                    context={{ 
                      companyName: form.watch('name'),
                      website: form.watch('website')
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <SmartInput
                    name="phone"
                    label="Phone Number"
                    value={field.value || ''}
                    onChange={field.onChange}
                    fieldType="phone"
                    formType="company_creation"
                    userId={userId}
                    placeholder="+1 (555) 123-4567"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry1"
              render={({ field }) => (
                <FormItem>
                  <SmartInput
                    name="industry1"
                    label="Primary Industry"
                    value={field.value || ''}
                    onChange={field.onChange}
                    fieldType="industry"
                    formType="company_creation"
                    userId={userId}
                    placeholder="e.g., Technology, Healthcare"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <SmartInput
                    name="location"
                    label="Location"
                    value={field.value || ''}
                    onChange={field.onChange}
                    fieldType="location"
                    formType="company_creation"
                    userId={userId}
                    placeholder="City, Country"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe what the company does..."
                    rows={4}
                    readOnly={readOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>

        <TabsContent value="contact" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <SmartInput
                    name="linkedin"
                    label="LinkedIn"
                    value={field.value || ''}
                    onChange={field.onChange}
                    fieldType="social_linkedin"
                    formType="company_creation"
                    userId={userId}
                    placeholder="https://linkedin.com/company/example"
                    context={{ companyName: form.watch('name') }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <SmartInput
                    name="twitter"
                    label="Twitter/X"
                    value={field.value || ''}
                    onChange={field.onChange}
                    fieldType="social_twitter"
                    formType="company_creation"
                    userId={userId}
                    placeholder="https://twitter.com/example"
                    context={{ companyName: form.watch('name') }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="additional" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <SmartInput
                    name="size"
                    label="Company Size"
                    value={field.value || ''}
                    onChange={field.onChange}
                    fieldType="company_size"
                    formType="company_creation"
                    userId={userId}
                    placeholder="e.g., Startup, Small, Medium, Large"
                    context={{ industry1: form.watch('industry1') }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="founded"
              render={({ field }) => (
                <FormItem>
                  <SmartInput
                    name="founded"
                    label="Year Founded"
                    value={field.value ? field.value.toString() : ''}
                    onChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                    fieldType="year"
                    formType="company_creation"
                    userId={userId}
                    placeholder="2023"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>
      </Tabs>
    </CognitiveFormWrapper>
  );
};
