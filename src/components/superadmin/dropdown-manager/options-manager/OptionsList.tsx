
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { DropdownOption } from '@/hooks/dropdown/types';

import OptionsForm from './OptionsForm';
import OptionsTable from '../OptionsTable';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';

interface OptionsListProps {
  selectedCategory: string;
  options: DropdownOption[] | undefined;
  isLoading: boolean;
  getCategoryIdByName: (name: string) => Promise<string | null>;
}

const OptionsList = ({
  selectedCategory,
  options: initialOptions,
  isLoading,
  getCategoryIdByName,
}: OptionsListProps) => {
  const [newOptionValue, setNewOptionValue] = useState('');
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [localOptions, setLocalOptions] = useState<DropdownOption[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const queryClient = useQueryClient();
  const { updateOptionOrder } = useDropdownOptions(selectedCategory);
  
  // Update local options when options change from the API
  useEffect(() => {
    if (initialOptions && initialOptions.length > 0) {
      setLocalOptions(initialOptions);
      setHasUnsavedChanges(false);
    } else {
      setLocalOptions([]);
      setHasUnsavedChanges(false);
    }
  }, [initialOptions]);

  // Add a new option
  const addOption = useMutation({
    mutationFn: async () => {
      if (!selectedCategory || !newOptionValue.trim()) {
        toast({
          title: 'Missing information',
          description: 'Please select a category and provide a value',
          variant: 'destructive',
        });
        return null;
      }
      
      const categoryId = await getCategoryIdByName(selectedCategory);
      
      if (!categoryId) {
        toast({
          title: 'Error',
          description: 'Category not found',
          variant: 'destructive',
        });
        return null;
      }

      const { data, error } = await supabase
        .from('dropdown_options')
        .insert([{
          category_id: categoryId,
          value: newOptionValue,
          label: newOptionLabel || newOptionValue,
          sort_order: localOptions.length > 0 ? Math.max(...localOptions.map(opt => opt.sort_order || 0)) + 1 : 0
        }])
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: (newOption) => {
      if (!newOption) return;
      
      toast({
        title: 'Option added',
        description: `Added new option "${newOptionLabel || newOptionValue}"`,
      });
      setNewOptionValue('');
      setNewOptionLabel('');
      
      if (newOption) {
        // Update local state to avoid a refetch
        setLocalOptions(prev => [...prev, newOption]);
      } else {
        // If we don't have the new option, refetch
        queryClient.invalidateQueries({ queryKey: ['dropdown-options', selectedCategory] });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error adding option',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete an option
  const deleteOption = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('dropdown_options')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      toast({
        title: 'Option deleted',
        description: 'The option has been removed',
      });
      
      // Update local state to avoid a refetch
      setLocalOptions(prev => prev.filter(opt => opt.id !== deletedId));
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting option',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleAddOption = () => {
    addOption.mutate();
  };

  const handleDeleteOption = (id: string) => {
    if (window.confirm('Are you sure you want to delete this option?')) {
      deleteOption.mutate(id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Find the indices of the items
      const oldIndex = localOptions.findIndex(item => item.id === active.id);
      const newIndex = localOptions.findIndex(item => item.id === over.id);
      
      // Reorder the array
      const newArray = arrayMove(localOptions, oldIndex, newIndex);
      
      // Update state
      setLocalOptions(newArray);
      setHasUnsavedChanges(true);
    }
  };

  const handleSaveOrder = () => {
    if (localOptions && localOptions.length > 0) {
      updateOptionOrder.mutate(localOptions);
    }
  };

  return (
    <>
      <OptionsForm
        newOptionValue={newOptionValue}
        setNewOptionValue={setNewOptionValue}
        newOptionLabel={newOptionLabel}
        setNewOptionLabel={setNewOptionLabel}
        handleAddOption={handleAddOption}
        isAddingOption={addOption.isPending}
      />

      <OptionsTable
        options={localOptions}
        isLoading={isLoading}
        hasUnsavedChanges={hasUnsavedChanges}
        handleSaveOrder={handleSaveOrder}
        handleDragEnd={handleDragEnd}
        handleDeleteOption={handleDeleteOption}
        isSaving={updateOptionOrder.isPending}
      />
    </>
  );
};

export default OptionsList;
