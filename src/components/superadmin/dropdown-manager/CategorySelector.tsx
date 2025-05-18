
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DropdownCategory } from '@/hooks/dropdown/types';

interface CategorySelectorProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  categories?: DropdownCategory[];
  onAddCategoryClick: () => void;
}

const CategorySelector = ({
  selectedCategory,
  setSelectedCategory,
  categories,
  onAddCategoryClick
}: CategorySelectorProps) => {
  return (
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
            {!categories || categories.length === 0 ? (
              <SelectItem value="no-categories" disabled>No categories available</SelectItem>
            ) : (
              categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" className="mt-6" onClick={onAddCategoryClick}>
        <Plus className="mr-2 h-4 w-4" />
        Add New Category
      </Button>
    </div>
  );
};

export default CategorySelector;
