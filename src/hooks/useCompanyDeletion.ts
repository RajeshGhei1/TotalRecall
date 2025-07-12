
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Company } from '@/hooks/useCompanies';

interface DeletionInfo {
  hasChildCompanies: boolean;
  childCompaniesCount: number;
  hasBranchOffices: boolean;
  branchOfficesCount: number;
  hasRelationships: boolean;
  relationshipsCount: number;
  canDelete: boolean;
  warnings: string[];
}

export const useCompanyDeletion = () => {
  const queryClient = useQueryClient();

  // Check deletion prerequisites
  const checkDeletionInfo = async (company: Company, allCompanies: Company[]): Promise<DeletionInfo> => {
    const warnings: string[] = [];
    
    // Check for child companies
    const childCompanies = allCompanies.filter(c => c.parent_company_id === company.id);
    const hasChildCompanies = childCompanies.length > 0;
    
    if (hasChildCompanies) {
      warnings.push(`This company has ${childCompanies.length} child companies that will become orphaned.`);
    }

    // Check branch offices - using type assertion since table is newly created
    const { data: branchOffices } = await (supabase as any)
      .from('company_branch_offices')
      .select('id')
      .eq('company_id', company.id);
    
    const branchOfficesCount = branchOffices?.length || 0;
    const hasBranchOffices = branchOfficesCount > 0;
    
    if (hasBranchOffices) {
      warnings.push(`This will delete ${branchOfficesCount} branch office(s).`);
    }

    // Check company relationships (people)
    const { data: relationships } = await supabase
      .from('company_relationships')
      .select('id')
      .eq('company_id', company.id);
    
    const relationshipsCount = relationships?.length || 0;
    const hasRelationships = relationshipsCount > 0;
    
    if (hasRelationships) {
      warnings.push(`This will remove ${relationshipsCount} people relationship(s).`);
    }

    return {
      hasChildCompanies,
      childCompaniesCount: childCompanies.length,
      hasBranchOffices,
      branchOfficesCount,
      hasRelationships,
      relationshipsCount,
      canDelete: true, // We allow deletion but show warnings
      warnings
    };
  };

  // Delete company mutation
  const deleteCompany = useMutation({
    mutationFn: async (company: Company) => {
      // Start transaction by deleting related data first
      
      // 1. Delete custom field values
      const { error: customFieldError } = await supabase
        .from('custom_field_values')
        .delete()
        .eq('entity_type', 'company')
        .eq('entity_id', company.id);

      if (customFieldError) {
        console.error('Error deleting custom field values:', customFieldError);
        throw new Error('Failed to delete custom field values');
      }

      // 2. Delete branch offices - using type assertion
      const { error: branchError } = await (supabase as any)
        .from('company_branch_offices')
        .delete()
        .eq('company_id', company.id);

      if (branchError) {
        console.error('Error deleting branch offices:', branchError);
        throw new Error('Failed to delete branch offices');
      }

      // 3. Delete company relationships (people)
      const { error: relationshipError } = await supabase
        .from('company_relationships')
        .delete()
        .eq('company_id', company.id);

      if (relationshipError) {
        console.error('Error deleting company relationships:', relationshipError);
        throw new Error('Failed to delete company relationships');
      }

      // 4. Update child companies to remove parent reference
      const { error: childUpdateError } = await supabase
        .from('companies')
        .update({ 
          parent_company_id: null,
          hierarchy_level: 0 
        })
        .eq('parent_company_id', company.id);

      if (childUpdateError) {
        console.error('Error updating child companies:', childUpdateError);
        throw new Error('Failed to update child companies');
      }

      // 5. Finally delete the company itself
      const { error: companyError } = await supabase
        .from('companies')
        .delete()
        .eq('id', company.id);

      if (companyError) {
        console.error('Error deleting company:', companyError);
        throw new Error('Failed to delete company');
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['branch-offices'] });
      toast({
        title: 'Company deleted',
        description: 'The company and all related data have been deleted successfully',
      });
    },
    onError: (error: unknown) => {
      console.error("Error deleting company:", error);
      toast({
        title: 'Error',
        description: `Failed to delete company: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    deleteCompany,
    checkDeletionInfo,
    isDeleting: deleteCompany.isPending,
  };
};
