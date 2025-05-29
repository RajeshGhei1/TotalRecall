
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useFormContext } from '@/contexts/FormContext';
import { X } from 'lucide-react';

const ConditionalFormModal: React.FC = () => {
  const { activeForm, closeForm } = useFormContext();

  if (!activeForm) return null;

  return (
    <Dialog open={!!activeForm} onOpenChange={() => closeForm()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{activeForm.name}</DialogTitle>
              {activeForm.description && (
                <DialogDescription className="mt-1">
                  {activeForm.description}
                </DialogDescription>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeForm}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          {/* TODO: Integrate with actual form rendering component */}
          <div className="p-8 bg-gray-50 rounded-lg text-center">
            <p className="text-muted-foreground">
              Form rendering component will be integrated here
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Form ID: {activeForm.id}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConditionalFormModal;
