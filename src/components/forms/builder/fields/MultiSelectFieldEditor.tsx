
import React, { useState } from 'react';
import { FormField, EnhancedFieldOptions } from '@/types/form-builder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, X, GripVertical } from 'lucide-react';

interface MultiSelectFieldEditorProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
}

interface OptionItem {
  value: string;
  label: string;
}

const MultiSelectFieldEditor: React.FC<MultiSelectFieldEditorProps> = ({
  field,
  onUpdate,
}) => {
  const [newOption, setNewOption] = useState('');
  
  // Type guard to check if options is enhanced format
  const isEnhancedOptions = (options: unknown): options is EnhancedFieldOptions => {
    return options && typeof options === 'object' && !Array.isArray(options);
  };

  // Parse options safely with type checking
  const getOptionsFromField = (): OptionItem[] => {
    if (!field.options) return [];
    
    // Handle different option formats
    if (Array.isArray(field.options)) {
      // Legacy string array format
      return field.options.map(opt => 
        typeof opt === 'string' 
          ? { value: opt, label: opt }
          : opt
      );
    }
    
    // Enhanced options format
    if (isEnhancedOptions(field.options) && field.options.options && Array.isArray(field.options.options)) {
      return field.options.options;
    }
    
    return [];
  };

  const options = getOptionsFromField();

  const getEnhancedOptions = (): EnhancedFieldOptions => {
    if (isEnhancedOptions(field.options)) {
      return field.options;
    }
    return { 
      options: [], 
      multiSelect: false, 
      maxSelections: 0 
    };
  };

  const addOption = () => {
    if (!newOption.trim()) return;
    
    const updatedOptions = [
      ...options,
      { value: newOption.trim(), label: newOption.trim() }
    ];
    
    const enhancedOptions: EnhancedFieldOptions = {
      ...getEnhancedOptions(),
      options: updatedOptions,
      multiSelect: true
    };
    
    onUpdate({
      ...field,
      options: enhancedOptions
    });
    
    setNewOption('');
  };

  const removeOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    const enhancedOptions: EnhancedFieldOptions = {
      ...getEnhancedOptions(),
      options: updatedOptions
    };
    
    onUpdate({
      ...field,
      options: enhancedOptions
    });
  };

  const updateOption = (index: number, value: string) => {
    const updatedOptions = options.map((option, i) => 
      i === index ? { ...option, value, label: value } : option
    );
    
    const enhancedOptions: EnhancedFieldOptions = {
      ...getEnhancedOptions(),
      options: updatedOptions
    };
    
    onUpdate({
      ...field,
      options: enhancedOptions
    });
  };

  const toggleMultiSelect = (enabled: boolean) => {
    const enhancedOptions: EnhancedFieldOptions = {
      ...getEnhancedOptions(),
      multiSelect: enabled
    };
    
    onUpdate({
      ...field,
      field_type: enabled ? 'multiselect' : 'dropdown',
      options: enhancedOptions
    });
  };

  const updateMaxSelections = (max: number) => {
    const enhancedOptions: EnhancedFieldOptions = {
      ...getEnhancedOptions(),
      maxSelections: max
    };
    
    onUpdate({
      ...field,
      options: enhancedOptions
    });
  };

  const currentOptions = getEnhancedOptions();
  const isMultiSelect = field.field_type === 'multiselect' || currentOptions.multiSelect === true;
  const maxSelections = currentOptions.maxSelections || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Multi-Select Field Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Multi-Select Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="multiselect">Enable Multi-Select</Label>
          <Switch
            id="multiselect"
            checked={isMultiSelect}
            onCheckedChange={toggleMultiSelect}
          />
        </div>

        {/* Max Selections */}
        {isMultiSelect && (
          <div className="space-y-2">
            <Label>Maximum Selections (0 = unlimited)</Label>
            <Input
              type="number"
              min="0"
              value={maxSelections}
              onChange={(e) => updateMaxSelections(parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
        )}

        {/* Options Management */}
        <div className="space-y-3">
          <Label>Options</Label>
          
          {/* Add New Option */}
          <div className="flex gap-2">
            <Input
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Add new option..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addOption();
                }
              }}
            />
            <Button onClick={addOption} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Existing Options */}
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                <Input
                  value={option.label}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeOption(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {options.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No options added yet. Add your first option above.
            </div>
          )}
        </div>

        {/* Preview */}
        {isMultiSelect && options.length > 0 && (
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="p-3 border rounded-md bg-muted/50">
              <div className="text-sm text-muted-foreground mb-2">
                Multi-select field with {options.length} options
                {maxSelections > 0 && ` (max ${maxSelections} selections)`}
              </div>
              <div className="flex flex-wrap gap-1">
                {options.slice(0, 3).map((option, index) => (
                  <Badge key={index} variant="secondary">
                    {option.label}
                  </Badge>
                ))}
                {options.length > 3 && (
                  <Badge variant="outline">
                    +{options.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultiSelectFieldEditor;
