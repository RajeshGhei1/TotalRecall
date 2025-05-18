
import React from 'react';

interface CustomFieldsFormActionsProps {
  onCancel?: () => void;
}

const CustomFieldsFormActions: React.FC<CustomFieldsFormActionsProps> = ({ onCancel }) => {
  if (!onCancel) return null;
  
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border rounded-md hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Save
      </button>
    </div>
  );
};

export default CustomFieldsFormActions;
