
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus } from 'lucide-react';

interface OptionsFormProps {
  newOptionValue: string;
  setNewOptionValue: (value: string) => void;
  newOptionLabel: string;
  setNewOptionLabel: (value: string) => void;
  handleAddOption: () => void;
  isAddingOption: boolean;
}

const OptionsForm = ({ 
  newOptionValue, 
  setNewOptionValue, 
  newOptionLabel, 
  setNewOptionLabel, 
  handleAddOption,
  isAddingOption
}: OptionsFormProps) => {
  return (
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
        disabled={!newOptionValue.trim() || isAddingOption}
      >
        {isAddingOption ? (
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
  );
};

export default OptionsForm;
