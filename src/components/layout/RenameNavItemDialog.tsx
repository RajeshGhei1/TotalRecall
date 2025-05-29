
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
import { Loader2 } from 'lucide-react';

interface RenameNavItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemLabel: string;
  customLabel?: string;
  onRename: (newLabel: string) => Promise<void>;
  onReset: () => Promise<void>;
  isLoading?: boolean;
}

const RenameNavItemDialog: React.FC<RenameNavItemDialogProps> = ({
  isOpen,
  onClose,
  itemLabel,
  customLabel,
  onRename,
  onReset,
  isLoading = false
}) => {
  const [newLabel, setNewLabel] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNewLabel(customLabel || itemLabel);
      setError(null);
    }
  }, [isOpen, customLabel, itemLabel]);

  const handleSave = async () => {
    if (!newLabel.trim()) {
      setError('Label cannot be empty');
      return;
    }

    try {
      setError(null);
      await onRename(newLabel.trim());
    } catch (error) {
      setError('Failed to rename item. Please try again.');
      console.error('Error renaming item:', error);
    }
  };

  const handleReset = async () => {
    try {
      setError(null);
      await onReset();
    } catch (error) {
      setError('Failed to reset label. Please try again.');
      console.error('Error resetting label:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Navigation Item</DialogTitle>
          <DialogDescription>
            Customize the display name for "{itemLabel}". Leave empty to use the default name.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              Label
            </Label>
            <Input
              id="label"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyPress={handleKeyPress}
              className="col-span-3"
              placeholder={itemLabel}
              disabled={isLoading}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </div>
        
        <DialogFooter className="flex gap-2">
          {customLabel && (
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset to Default'
              )}
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading || !newLabel.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RenameNavItemDialog;
