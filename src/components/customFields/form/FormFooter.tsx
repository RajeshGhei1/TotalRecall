
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface FormFooterProps {
  form: UseFormReturn<any>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const FormFooter: React.FC<FormFooterProps> = ({ form, onCancel, isSubmitting = false }) => {
  return (
    <div className="flex justify-end space-x-2 pt-4 border-t">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      )}
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Save Custom Fields
      </Button>
    </div>
  );
};

export default FormFooter;
