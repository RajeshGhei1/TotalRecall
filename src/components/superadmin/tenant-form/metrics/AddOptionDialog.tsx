
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AddOptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

const AddOptionDialog: React.FC<AddOptionDialogProps> = ({
  open,
  onOpenChange,
  title,
  placeholder,
  value,
  onChange,
  onSubmit,
  isSubmitting
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={!value.trim() || isSubmitting}
          >
            {isSubmitting ? (
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

export default AddOptionDialog;
