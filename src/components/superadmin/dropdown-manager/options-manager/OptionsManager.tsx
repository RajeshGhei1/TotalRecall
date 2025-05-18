
import React, { useState, useEffect } from 'react';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { DropdownOption } from '@/hooks/dropdown/types';

// Import our new component files
import CategorySelector from '../CategorySelector';
import AddCategoryDialog from '../AddCategoryDialog';
import OptionsList from './OptionsList';
import EmptyState from '../EmptyState';

const OptionsManager = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { 
    categories, 
    options, 
    isLoading, 
    addCategory, 
    getCategoryIdByName,
  } = useDropdownOptions(selectedCategory);

  useEffect(() => {
    console.log("DropdownOptionsManager mounted");
    console.log("Categories available:", categories);
  }, [categories]);

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

        {selectedCategory && categories && categories.length > 0 ? (
          <OptionsList 
            selectedCategory={selectedCategory}
            options={options}
            isLoading={isLoading}
            getCategoryIdByName={getCategoryIdByName}
          />
        ) : (!categories || categories.length === 0) ? (
          <EmptyState onAddCategoryClick={() => setIsAddCategoryOpen(true)} />
        ) : null}
      </CardContent>
    </Card>
  );
};

export default OptionsManager;
