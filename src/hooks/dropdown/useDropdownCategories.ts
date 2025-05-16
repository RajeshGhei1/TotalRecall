
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { DropdownCategory } from './types';

export function useDropdownCategories() {
  const queryClient = useQueryClient();
  
  // Fetch all categories
  const { 
    data: categories = [], 
    isLoading,
    refetch: refetchCategories 
  } = useQuery({
    queryKey: ['dropdown-categories'],
    queryFn: async () => {
      console.log("Fetching dropdown categories...");
      const { data, error } = await supabase
        .from('dropdown_option_categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching dropdown categories:', error);
        throw error;
      }
      console.log("Dropdown categories fetched:", data);
      return data as DropdownCategory[];
    },
  });

  // Create a new category
  const createCategory = async (name: string, description: string | null = null): Promise<string> => {
    console.log(`Creating new category: ${name}`);
    const { data, error } = await supabase
      .from('dropdown_option_categories')
      .insert([{
        name,
        description,
      }])
      .select();

    if (error) {
      console.error('Error creating category:', error);
      throw error;
    }
    
    console.log('Successfully created category:', data[0]);
    
    // Refresh the categories list
    refetchCategories();
    
    return data[0].id;
  };

  // Add a new category
  const addCategory = useMutation({
    mutationFn: async ({ 
      name, 
      description = null 
    }: { 
      name: string; 
      description?: string | null;
    }) => {
      console.log(`Adding new category: ${name}`);
      
      const { data, error } = await supabase
        .from('dropdown_option_categories')
        .insert([{
          name,
          description,
        }])
        .select();

      if (error) {
        console.error('Error adding category:', error);
        throw error;
      }
      
      console.log('Successfully added category:', data[0]);
      return data[0] as DropdownCategory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropdown-categories'] });
      toast({
        title: 'Category added',
        description: 'New dropdown category has been added successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to add category',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Get category ID by name
  const getCategoryIdByName = async (
    name: string, 
    createIfNotExists: boolean = false
  ): Promise<string | null> => {
    console.log(`Looking up category ID for name: ${name}`);
    
    // First check if it exists in our cached categories
    const category = categories.find(c => c.name === name);
    
    if (category) {
      console.log(`Found category ID in cache: ${category.id} for name: ${name}`);
      return category.id;
    }
    
    console.log(`Category not found in cache, fetching from database: ${name}`);
    // If not found in cache, fetch from database
    const { data, error } = await supabase
      .from('dropdown_option_categories')
      .select('id')
      .eq('name', name)
      .single();
    
    if (error) {
      console.log(`Category not found in database: ${name}`);
      
      // If we should create it and it doesn't exist
      if (createIfNotExists) {
        console.log(`Creating category: ${name}`);
        try {
          return await createCategory(name);
        } catch (createError) {
          console.error(`Error creating category ${name}:`, createError);
          throw createError;
        }
      }
      
      return null;
    }
    
    console.log(`Found category ID in database: ${data.id} for name: ${name}`);
    return data.id;
  };

  return {
    categories,
    isLoading,
    addCategory,
    getCategoryIdByName,
    refetchCategories
  };
}
