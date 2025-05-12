
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface FormFooterProps {
  onCancel: () => void;
  isSubmitting: boolean;
}

const FormFooter: React.FC<FormFooterProps> = ({ onCancel, isSubmitting }) => {
  return (
    <CardFooter className="flex justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Save Custom Field
      </Button>
    </CardFooter>
  );
};

export default FormFooter;
