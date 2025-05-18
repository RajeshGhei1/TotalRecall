
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddCategoryClick: () => void;
}

const EmptyState = ({ onAddCategoryClick }: EmptyStateProps) => {
  return (
    <div className="border rounded-md p-8 text-center">
      <p className="text-muted-foreground mb-4">No dropdown categories available. Create a category first.</p>
      <Button 
        onClick={onAddCategoryClick}
        variant="default"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add First Category
      </Button>
    </div>
  );
};

export default EmptyState;
