
import React, { useState, useEffect } from 'react';
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
  const [newLabel, setNewLabel] = useState('');

  // Reset state when dialog opens with different item or when props change
  useEffect(() => {
    if (isOpen) {
      setNewLabel(customLabel || itemLabel);
      console.log('Dialog opened for item:', itemLabel, 'custom:', customLabel);
    }
  }, [isOpen, itemLabel, customLabel]);

  const handleSubmit = () => {
    const trimmedLabel = newLabel.trim();
    console.log('Submitting rename:', { original: itemLabel, custom: customLabel, new: trimmedLabel });
    
    if (trimmedLabel && trimmedLabel !== itemLabel) {
      onRename(trimmedLabel);
    } else if (trimmedLabel === itemLabel) {
      onReset();
    }
    onClose();
  };

  const handleReset = () => {
    console.log('Resetting label for:', itemLabel);
    onReset();
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleClose = () => {
    console.log('Dialog closing');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
              onKeyDown={handleKeyPress}
              className="col-span-3"
              placeholder={itemLabel}
              autoFocus
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Original name: <span className="font-medium">{itemLabel}</span>
            {customLabel && (
              <span className="block">Current custom name: <span className="font-medium">{customLabel}</span></span>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Cancel
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
