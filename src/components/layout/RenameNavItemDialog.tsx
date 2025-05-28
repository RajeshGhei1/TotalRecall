
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RenameNavItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemLabel: string;
  customLabel?: string;
  onRename: (newLabel: string) => void;
  onReset: () => void;
}

const RenameNavItemDialog: React.FC<RenameNavItemDialogProps> = ({
  isOpen,
  onClose,
  itemLabel,
  customLabel,
  onRename,
  onReset,
}) => {
  const [newLabel, setNewLabel] = useState(customLabel || itemLabel);

  const handleSubmit = () => {
    if (newLabel.trim() && newLabel.trim() !== itemLabel) {
      onRename(newLabel.trim());
    } else if (newLabel.trim() === itemLabel) {
      onReset();
    }
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Navigation Item</DialogTitle>
          <DialogDescription>
            Enter a new name for this navigation item. Leave blank or use the original name to reset.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              Name
            </Label>
            <Input
              id="label"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyPress={handleKeyPress}
              className="col-span-3"
              placeholder={itemLabel}
              autoFocus
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Original name: {itemLabel}
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
          <Button onClick={handleSubmit}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RenameNavItemDialog;
