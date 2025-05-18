
import React, { useState, useEffect } from 'react';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Save, Trash, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DropdownOption } from '@/hooks/dropdown/types';

// Sortable item component for dropdown options
const SortableOptionItem = ({ option, onDelete }) => {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition 
  } = useSortable({ id: option.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      className="group hover:bg-slate-50"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-grab">
        <div className="flex items-center" {...attributes} {...listeners}>
          <GripVertical className="h-5 w-5 text-gray-400 opacity-50 group-hover:opacity-100" />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {option.value}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {option.label}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onDelete(option.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash className="h-4 w-4 text-red-500" />
        </Button>
      </td>
    </tr>
  );
};

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

  // Sensors for drag and drop functionality
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
        <div className="flex items-center space-x-4">
          <div className="space-y-2 flex-1">
            <label className="text-sm font-medium">Select Category</label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                console.log("Category selected:", value);
                setSelectedCategory(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent className="bg-white" style={{ zIndex: 1000 }}>
                {categories?.length === 0 ? (
                  <SelectItem value="no-categories" disabled>No categories available</SelectItem>
                ) : (
                  categories?.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="mt-6">
                <Plus className="mr-2 h-4 w-4" />
                Add New Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new dropdown category for organizing options.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoryName" className="col-span-4">
                    Name *
                  </Label>
                  <Input
                    id="categoryName"
                    className="col-span-4" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., industries, departments, job_types"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoryDescription" className="col-span-4">
                    Description (optional)
                  </Label>
                  <Input
                    id="categoryDescription"
                    className="col-span-4"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                    placeholder="A description of what this category is for"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim() || addCategory.isPending}
                >
                  {addCategory.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Category'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {selectedCategory && categories && categories.length > 0 && (
          <>
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-3">Add New Option</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Value</label>
                  <Input
                    placeholder="Internal value"
                    value={newOptionValue}
                    onChange={(e) => setNewOptionValue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Label (optional)</label>
                  <Input
                    placeholder="Display label (leave empty to use value)"
                    value={newOptionLabel}
                    onChange={(e) => setNewOptionLabel(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                className="mt-4" 
                onClick={handleAddOption}
                disabled={!newOptionValue.trim() || addOption.isPending}
              >
                {addOption.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                  </>
                )}
              </Button>
            </div>

            <div className="border rounded-md overflow-hidden">
              {hasUnsavedChanges && (
                <div className="bg-amber-50 p-3 flex items-center justify-between border-b">
                  <p className="text-sm text-amber-700">
                    You've changed the order of items. Remember to save your changes.
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveOrder}
                    disabled={updateOptionOrder.isPending}
                  >
                    {updateOptionOrder.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Order
                      </>
                    )}
                  </Button>
                </div>
              )}

              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Label
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : localOptions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center">
                        No options found for this category. Add some options above.
                      </td>
                    </tr>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={localOptions.map(option => option.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {localOptions.map((option) => (
                          <SortableOptionItem 
                            key={option.id} 
                            option={option} 
                            onDelete={handleDeleteOption} 
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {(!categories || categories.length === 0) && (
          <div className="border rounded-md p-8 text-center">
            <p className="text-muted-foreground mb-4">No dropdown categories available. Create a category first.</p>
            <Button 
              onClick={() => setIsAddCategoryOpen(true)}
              variant="default"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Category
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DropdownOptionsManager;
