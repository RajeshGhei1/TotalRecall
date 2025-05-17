
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { createDialogHelpers } from '@/hooks/useDialogHelpers';

interface DialogManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  value: string;
  onChange: (value: string) => void;
  isAdding: boolean;
  dialogType: string;
}

const DialogManager: React.FC<DialogManagerProps> = ({
  isOpen,
  onClose,
  onAdd,
  value,
  onChange,
  isAdding,
  dialogType,
}) => {
  const { getDialogTitle, getDialogPlaceholder } = createDialogHelpers({
    'companyStatus': {
      title: 'Add New Company Status',
      placeholder: 'Enter new company status'
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="z-[10000] bg-white">
        <DialogHeader>
          <DialogTitle>{getDialogTitle(dialogType)}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Input
            placeholder={getDialogPlaceholder(dialogType)}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isAdding && value.trim()) {
                onAdd();
              }
            }}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onAdd} 
            disabled={!value.trim() || isAdding}
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>Add</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogManager;
