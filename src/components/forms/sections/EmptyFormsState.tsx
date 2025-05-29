
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyFormsStateProps {
  formsLength: number;
  filteredFormsLength: number;
  onCreateNew: () => void;
}

const EmptyFormsState: React.FC<EmptyFormsStateProps> = ({
  formsLength,
  filteredFormsLength,
  onCreateNew
}) => {
  if (filteredFormsLength > 0) return null;

  return (
    <div className="text-center py-12">
      <div className="text-gray-500 mb-4">
        {formsLength === 0 ? 'No forms found' : 'No forms match your filters'}
      </div>
      <Button onClick={onCreateNew}>Create your first form</Button>
    </div>
  );
};

export default EmptyFormsState;
