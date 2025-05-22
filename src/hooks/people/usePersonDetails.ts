
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Person } from '@/types/person';

export const usePersonDetails = (personId?: string) => {
  const { data: person, isLoading, error } = useQuery({
    queryKey: ['person-details', personId],
    queryFn: async (): Promise<Person | null> => {
      if (!personId) return null;
      
      const { data, error } = await supabase
        .from('people')
        .select(`
          id, 
          full_name, 
          email, 
          phone, 
          type,
          created_at,
          updated_at,
          location
        `)
        .eq('id', personId)
        .single();
        
      if (error) {
        console.error('Error fetching person:', error);
        throw error;
      }
      
      return data as Person;
    },
    enabled: !!personId
  });

  const getPersonById = async (id: string): Promise<Person> => {
    const { data, error } = await supabase
      .from('people')
      .select(`
        id, 
        full_name, 
        email, 
        phone, 
        type,
        created_at,
        updated_at,
        location
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching person:', error);
      throw error;
    }
    
    return data as Person;
  };

  return {
    person,
    isLoading,
    error,
    getPersonById
  };
};
