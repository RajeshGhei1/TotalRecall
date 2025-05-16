
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormInput, FormDatePicker, FormSelect } from './FormFields';
import { TenantFormValues } from './schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { createDialogHelpers } from '@/hooks/useDialogHelpers';
import { toast } from '@/hooks/use-toast';

interface BasicInfoSectionProps {
  form: UseFormReturn<TenantFormValues>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
  const [addingCompanyStatus, setAddingCompanyStatus] = useState(false);
  const [newCompanyStatus, setNewCompanyStatus] = useState('');
  
  // Use the new dialog helpers
  const { getDialogTitle, getDialogPlaceholder } = createDialogHelpers({
    'companyStatus': {
      title: 'Add New Company Status',
      placeholder: 'Enter new company status'
    }
  });

  // Get parent tenants
  const { data: tenants = [] } = useQuery({
    queryKey: ["tenants-for-parent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tenants")
        .select("id, name")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  // Get company status options from our hook
  const { 
    options: companyStatusOptionsRaw = [], 
    isLoading: statusLoading,
    isAddingOption: isAddingStatus,
    addOption,
  } = useDropdownOptions('company_statuses');

  // Add an "Add New" option
  const addNewOption = { value: '__add_new__', label: '[+ Add New]' };
  
  // Ensure the test option is always available along with options from the database
  const companyStatusOptions = statusLoading 
    ? [{ value: 'loading', label: 'Loading...' }] 
    : [...companyStatusOptionsRaw.map(o => ({ 
        value: o.value || 'unknown', 
        label: o.label || o.value || 'Unknown' 
      })), 
      { value: 'test', label: 'test' },  // Add the 'test' option here
      addNewOption];

  // Add 'test' option to the database when component mounts if it doesn't already exist
  useEffect(() => {
    const addTestOptionIfNeeded = async () => {
      if (!statusLoading && !companyStatusOptionsRaw.some(o => o.value === 'test')) {
        try {
          console.log("Adding 'test' company status to the database");
          await addOption.mutateAsync({
            value: 'test',
            label: 'test',
            categoryName: 'company_statuses'
          });
        } catch (error) {
          console.error("Failed to add 'test' company status:", error);
        }
      }
    };
    
    addTestOptionIfNeeded();
  }, [statusLoading, companyStatusOptionsRaw, addOption]);

  // Handle selection of the "Add New" option
  const handleSelectCompanyStatus = (value: string) => {
    if (value === '__add_new__') {
      setAddingCompanyStatus(true);
      setNewCompanyStatus('');
    }
  };

  // Handle adding a new company status
  const handleAddNewCompanyStatus = async () => {
    if (!newCompanyStatus.trim()) return;

    try {
      console.log("Adding new company status:", newCompanyStatus);
      const newOption = await addOption.mutateAsync({
        value: newCompanyStatus,
        label: newCompanyStatus,
        categoryName: 'company_statuses'
      });
      
      console.log("New company status added successfully:", newOption);
      
      // Set the form value to the newly added option
      form.setValue('companyStatus', newOption.value);
      setAddingCompanyStatus(false);
      
      toast({
        title: "Success",
        description: `Added new company status: ${newCompanyStatus}`,
      });
    } catch (error) {
      console.error('Failed to add new company status:', error);
      toast({
        title: "Error",
        description: `Failed to add company status: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput 
          form={form}
          name="name"
          label="Account Name"
          required
        />
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Parent</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="[Choose One]" />
            </SelectTrigger>
            <SelectContent className="z-50 bg-background">
              <SelectItem value="none">None</SelectItem>
              {tenants.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.id || 'unknown'}>
                  {tenant.name || 'Unnamed Tenant'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <FormInput 
          form={form}
          name="cin"
          label="CIN"
          required
        />
        
        <FormInput 
          form={form}
          name="registeredOfficeAddress" 
          label="Registered Office Address"
          required
        />
        
        <FormDatePicker
          form={form}
          name="registrationDate"
          label="Registration Date"
          required
        />
        
        <FormInput 
          form={form}
          name="registeredEmailAddress"
          label="Registered Email Address"
          type="email"
          required
        />
        
        <div className="space-y-1">
          <FormSelect 
            form={form}
            name="companyStatus"
            label="Company Status"
            options={companyStatusOptions}
            required
            onChange={handleSelectCompanyStatus}
          />
          {form.watch('companyStatus') === '__add_new__' && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1"
              onClick={() => setAddingCompanyStatus(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Add New Status
            </Button>
          )}
        </div>
        
        <FormInput 
          form={form}
          name="noOfDirectives"
          label="No Of Directives/Partner"
          required
        />
      </div>

      {/* Dialog for adding new company status */}
      <Dialog open={addingCompanyStatus} onOpenChange={setAddingCompanyStatus}>
        <DialogContent className="z-[10000] bg-white">
          <DialogHeader>
            <DialogTitle>{getDialogTitle('companyStatus')}</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder={getDialogPlaceholder('companyStatus')}
              value={newCompanyStatus}
              onChange={(e) => setNewCompanyStatus(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isAddingStatus && newCompanyStatus.trim()) {
                  handleAddNewCompanyStatus();
                }
              }}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddingCompanyStatus(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddNewCompanyStatus} 
              disabled={!newCompanyStatus.trim() || isAddingStatus}
            >
              {isAddingStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>Add</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BasicInfoSection;
