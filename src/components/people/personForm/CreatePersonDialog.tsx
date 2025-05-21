
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePersonForm } from './usePersonForm';
import PersonFormFields from './PersonFormFields';
import { CustomFieldsForm } from '@/components/customFields';

interface CreatePersonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  personType: 'talent' | 'contact';
}

const CreatePersonDialog: React.FC<CreatePersonDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  personType,
}) => {
  const { form, isSubmitting, error, handleCreatePerson } = usePersonForm({
    personType,
    onSuccess
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New {personType === 'talent' ? 'Talent' : 'Contact'}</DialogTitle>
          <DialogDescription>
            Add a new {personType === 'talent' ? 'talent' : 'business contact'} to the system.
            {personType === 'contact' && " You can optionally associate them with a company."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreatePerson)} className="space-y-4">
            <PersonFormFields form={form} personType={personType} />
            
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium mb-2">Custom Fields</h3>
              <CustomFieldsForm
                entityType={personType === 'talent' ? 'talent_form' : 'contact_form'}
                formContext={personType === 'talent' ? 'talent_form' : 'contact_form'}
                form={form}
              />
            </div>
            
            {error && (
              <div className="text-sm font-medium text-destructive">
                {error}
              </div>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create {personType === 'talent' ? 'Talent' : 'Contact'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePersonDialog;
