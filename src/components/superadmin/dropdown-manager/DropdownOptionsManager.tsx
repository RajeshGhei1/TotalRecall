
import React, { useState, useEffect } from 'react';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { DropdownOption } from '@/hooks/dropdown/types';
import CategorySelector from './CategorySelector';
import AddCategoryDialog from './AddCategoryDialog';
import AddOptionForm from './AddOptionForm';
import OptionsTable from './OptionsTable';
import EmptyState from './EmptyState';

const DropdownOptionsManager = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [localOptions, setLocalOptions] = useState<DropdownOption[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const queryClient = useQueryClient();
  
  const { 
    categories, 
    options, 
    isLoading, 
    addCategory, 
    getCategoryIdByName,
    updateOptionOrder 
  } = useDropdownOptions(selectedCategory);

  // Update local options when options change from the API
  useEffect(() => {
    if (options && options.length > 0) {
      setLocalOptions(options);
      setHasUnsavedChanges(false);
    } else {
      setLocalOptions([]);
      setHasUnsavedChanges(false);
    }
  }, [options]);

  useEffect(() => {
    console.log("DropdownOptionsManager mounted");
    console.log("Categories available:", categories);
  }, [categories]);

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

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please provide a category name',
        variant: 'destructive',
      });
      return;
    }

    addCategory.mutate(
      { 
        name: newCategoryName.trim(), 
        description: newCategoryDescription.trim() || null 
      },
      {
        onSuccess: () => {
          setNewCategoryName('');
          setNewCategoryDescription('');
          setIsAddCategoryOpen(false);
        }
      }
    );
  };

  console.log("Rendering DropdownOptionsManager with categories:", categories);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Dropdown Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CategorySelector
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          onAddCategoryClick={() => setIsAddCategoryOpen(true)}
        />
        
        <AddCategoryDialog
          isOpen={isAddCategoryOpen}
          onOpenChange={setIsAddCategoryOpen}
          newCategoryName={newCategoryName}
          setNewCategoryName={setNewCategoryName}
          newCategoryDescription={newCategoryDescription}
          setNewCategoryDescription={setNewCategoryDescription}
          handleAddCategory={handleAddCategory}
          isAddingCategory={addCategory.isPending}
        />

        {selectedCategory && categories && categories.length > 0 && (
          <>
            <AddOptionForm
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
        )}

        {(!categories || categories.length === 0) && (
          <EmptyState onAddCategoryClick={() => setIsAddCategoryOpen(true)} />
        )}
      </CardContent>
    </Card>
  );
};

export default DropdownOptionsManager;
