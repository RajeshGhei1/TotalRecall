
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Talent } from "@/types/talent";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CustomFieldsForm from "@/components/CustomFieldsForm";
import { useAuth } from "@/contexts/AuthContext";

// Form schema with validation
const talentFormSchema = z.object({
  full_name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  location: z.string().optional(),
  years_of_experience: z
    .number()
    .int()
    .min(0)
    .max(50)
    .optional()
    .transform(val => val === null ? undefined : val),
  current_salary: z
    .number()
    .min(0)
    .optional()
    .transform(val => val === null ? undefined : val),
  desired_salary: z
    .number()
    .min(0)
    .optional()
    .transform(val => val === null ? undefined : val),
  availability_status: z.enum(["available", "interviewing", "considering offers", "hired", "not available"]).optional(),
  bio: z.string().max(1000, { message: "Bio cannot exceed 1000 characters" }).optional(),
});

type TalentFormData = z.infer<typeof talentFormSchema>;

interface TalentFormProps {
  talentId?: string;
  onSuccess?: () => void;
}

const TalentForm: React.FC<TalentFormProps> = ({ talentId, onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!talentId;
  const [tenantId, setTenantId] = useState<string | null>(null);

  // Fetch current tenant information for custom fields
  const { data: tenantData } = useQuery({
    queryKey: ['currentTenantData'],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_tenants')
        .select(`
          tenant_id,
          tenants:tenant_id (
            id,
            name
          )
        `)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (tenantData?.tenant_id) {
      setTenantId(tenantData.tenant_id);
    }
  }, [tenantData]);

  // Fetch talent data if in edit mode
  const { data: talentData, isLoading: isLoadingTalent } = useQuery({
    queryKey: ['talent', talentId],
    queryFn: async () => {
      if (!talentId) return null;
      
      const { data, error } = await supabase
        .from('talents')
        .select('*')
        .eq('id', talentId)
        .single();
        
      if (error) throw error;
      return data as Talent;
    },
    enabled: isEditMode,
  });

  // Initialize form
  const form = useForm<TalentFormData>({
    resolver: zodResolver(talentFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      location: "",
      years_of_experience: undefined,
      current_salary: undefined,
      desired_salary: undefined,
      availability_status: "available",
      bio: "",
    },
  });

  // Update form values when talent data is loaded
  useEffect(() => {
    if (talentData) {
      form.reset({
        full_name: talentData.full_name,
        email: talentData.email,
        phone: talentData.phone || undefined,
        location: talentData.location || undefined,
        years_of_experience: talentData.years_of_experience || undefined,
        current_salary: talentData.current_salary || undefined,
        desired_salary: talentData.desired_salary || undefined,
        availability_status: talentData.availability_status as any || "available",
        bio: talentData.bio || undefined,
      });
    }
  }, [talentData, form]);

  // Create/update talent mutation
  const talentMutation = useMutation({
    mutationFn: async (data: TalentFormData) => {
      if (isEditMode) {
        const { error } = await supabase
          .from('talents')
          .update({
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            location: data.location,
            years_of_experience: data.years_of_experience,
            current_salary: data.current_salary,
            desired_salary: data.desired_salary,
            availability_status: data.availability_status,
            bio: data.bio,
            updated_at: new Date().toISOString(),
          })
          .eq('id', talentId!);
          
        if (error) throw error;
        return talentId;
      } else {
        const { data: newTalent, error } = await supabase
          .from('talents')
          .insert({
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            location: data.location,
            years_of_experience: data.years_of_experience,
            current_salary: data.current_salary,
            desired_salary: data.desired_salary,
            availability_status: data.availability_status,
            bio: data.bio,
          })
          .select()
          .single();
          
        if (error) throw error;
        return newTalent.id;
      }
    },
    onSuccess: (talentId) => {
      queryClient.invalidateQueries({ queryKey: ['talents'] });
      queryClient.invalidateQueries({ queryKey: ['talent', talentId] });
      
      toast({
        title: isEditMode ? "Talent Updated" : "Talent Created",
        description: `Successfully ${isEditMode ? "updated" : "added"} talent profile.`,
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/tenant-admin/talent`);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? "update" : "create"} talent: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Custom field mutation
  const customFieldMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!tenantId || !talentId) return;
      
      const customFields = Object.keys(data)
        .filter(key => key.startsWith('custom_'))
        .reduce((acc, key) => {
          acc[key.replace('custom_', '')] = data[key];
          return acc;
        }, {} as Record<string, any>);
      
      if (Object.keys(customFields).length === 0) return;

      // Save custom field values
      await Promise.all(
        Object.entries(customFields).map(async ([key, value]) => {
          // Find field ID based on key
          const { data: fieldData } = await supabase
            .from('custom_fields')
            .select('id')
            .eq('field_key', key)
            .eq('tenant_id', tenantId)
            .maybeSingle();
          
          if (fieldData?.id) {
            await supabase
              .from('custom_field_values')
              .upsert({
                field_id: fieldData.id,
                entity_id: talentId,
                entity_type: 'talent',
                value: value,
              }, { onConflict: 'field_id, entity_id, entity_type' });
          }
        })
      );
    }
  });

  const onSubmit = async (data: TalentFormData) => {
    try {
      const talentId = await talentMutation.mutateAsync(data);
      
      if (tenantId && talentId) {
        // Save custom field values if there's a talentId (which means the talent was saved successfully)
        await customFieldMutation.mutateAsync(form.getValues());
      }
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  if ((isEditMode && isLoadingTalent) || !user) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, Country" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="years_of_experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="5" 
                      {...field} 
                      value={field.value === undefined ? '' : field.value}
                      onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="current_salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Salary</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="65000" 
                      {...field} 
                      value={field.value === undefined ? '' : field.value}
                      onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="desired_salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desired Salary</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="75000" 
                      {...field} 
                      value={field.value === undefined ? '' : field.value}
                      onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value || "available"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="interviewing">Interviewing</SelectItem>
                      <SelectItem value="considering offers">Considering Offers</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                      <SelectItem value="not available">Not Available</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biography</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of the candidate's background, skills, and interests..."
                      className="min-h-[120px]"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a summary of the talent's professional background and key skills.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        {tenantId && isEditMode && talentId && (
          <Card className="p-6">
            <CustomFieldsForm
              tenantId={tenantId}
              entityType="talent"
              entityId={talentId}
              form={form}
            />
          </Card>
        )}

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/tenant-admin/talent')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={talentMutation.isPending || customFieldMutation.isPending}
          >
            {talentMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditMode ? 'Update Talent' : 'Create Talent'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TalentForm;
