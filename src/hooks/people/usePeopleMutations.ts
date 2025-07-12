
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreatePersonData } from '@/types/person';

export const usePeopleMutations = (personType?: 'talent' | 'contact') => {
  const queryClient = useQueryClient();

  const createPerson = useMutation({
    mutationFn: async (data: CreatePersonData) => {
      const { error, data: newPerson } = await supabase
        .from('people')
        .insert([data])
        .select()
        .single();
        
      if (error) throw error;
      
      return newPerson;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people', personType] });
      toast.success(`${personType === 'talent' ? 'Talent' : 'Contact'} created successfully`);
    },
    onError: (error: unknown) => {
      console.error('Error creating person:', error);
      toast.error(`Failed to create ${personType}: ${error.message}`);
    }
  });
  
  const deletePerson = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('people')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people', personType] });
      toast.success(`${personType === 'talent' ? 'Talent' : 'Contact'} deleted successfully`);
    },
    onError: (error: unknown) => {
      console.error('Error deleting person:', error);
      toast.error(`Failed to delete ${personType}: ${error.message}`);
    }
  });

  return {
    createPerson,
    deletePerson
  };
};
