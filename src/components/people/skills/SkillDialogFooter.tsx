
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface SkillDialogFooterProps {
  onClose: () => void;
  isSubmitting: boolean;
  isEditMode: boolean;
  isFormValid: boolean;
}

const SkillDialogFooter: React.FC<SkillDialogFooterProps> = ({
  onClose,
  isSubmitting,
  isEditMode,
  isFormValid
}) => {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting || !isFormValid}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditMode ? 'Updating...' : 'Adding...'}
          </>
        ) : (
          isEditMode ? 'Update Skill' : 'Add Skill'
        )}
      </Button>
    </DialogFooter>
  );
};

export default SkillDialogFooter;
