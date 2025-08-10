
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Plus, X } from 'lucide-react';
import { WidgetConfig } from '@/types/common';
import { useCustomFieldsList } from '@/hooks/customFields/useCustomFieldsList';

interface BasicConfigProps {
  config: WidgetConfig;
  setConfig: (config: WidgetConfig) => void;
}

interface CustomFieldFilter {
  field_key: string;
  field_name: string;
  operator: string;
  value: string;
}

const BasicConfig: React.FC<BasicConfigProps> = ({ config, setConfig }) => {
  // Get custom fields for different entity types
  const { customFields: companyCustomFields } = useCustomFieldsList({ 
    entityType: 'company' 
  });
  const { customFields: peopleCustomFields } = useCustomFieldsList({ 
    entityType: 'people' 
  });

  // Initialize custom field filters if not present
  const customFieldFilters: CustomFieldFilter[] = config.customFieldFilters || [];

  const updateConfig = (updates: Partial<WidgetConfig>) => {
    setConfig({ ...config, ...updates });
  };

  const addCustomFieldFilter = () => {
    const newFilter: CustomFieldFilter = {
      field_key: '',
      field_name: '',
      operator: 'eq',
      value: ''
    };
    updateConfig({
      customFieldFilters: [...customFieldFilters, newFilter]
    });
  };

  const updateCustomFieldFilter = (index: number, updates: Partial<CustomFieldFilter>) => {
    const updatedFilters = [...customFieldFilters];
    updatedFilters[index] = { ...updatedFilters[index], ...updates };
    updateConfig({ customFieldFilters: updatedFilters });
  };

  const removeCustomFieldFilter = (index: number) => {
    const updatedFilters = customFieldFilters.filter((_, i) => i !== index);
    updateConfig({ customFieldFilters: updatedFilters });
  };

  // Get available custom fields based on selected entity type
  const getAvailableCustomFields = () => {
    const entityType = config.entityType || 'company';
    switch (entityType) {
      case 'company':
        return companyCustomFields || [];
      case 'people':
        return peopleCustomFields || [];
      default:
        return [];
    }
  };

  const availableCustomFields = getAvailableCustomFields();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Widget Title</Label>
        <Input
          id="title"
          value={config.title || ''}
          onChange={(e) => updateConfig({ title: e.target.value })}
          placeholder="Enter widget title"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={config.description || ''}
          onChange={(e) => updateConfig({ description: e.target.value })}
          placeholder="Widget description (optional)"
        />
      </div>

      <div>
        <Label htmlFor="entityType">Entity Type</Label>
        <Select 
          value={config.entityType || 'company'} 
          onValueChange={(value) => updateConfig({ entityType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select entity type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="company">Companies</SelectItem>
            <SelectItem value="people">People</SelectItem>
            <SelectItem value="talent">Talents</SelectItem>
            <SelectItem value="custom_fields">Custom Fields</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="show-legend"
          checked={config.showLegend || false}
          onCheckedChange={(checked) => updateConfig({ showLegend: checked })}
        />
        <Label htmlFor="show-legend">Show Legend</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="show-custom-fields"
          checked={config.includeCustomFields || false}
          onCheckedChange={(checked) => updateConfig({ includeCustomFields: checked })}
        />
        <Label htmlFor="show-custom-fields">Include Custom Fields Data</Label>
      </div>

      {/* Custom Fields Filters Section */}
      {(config.includeCustomFields || customFieldFilters.length > 0) && (
        <div className="space-y-3 p-4 border border-purple-200 rounded-lg bg-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-purple-600" />
              <Label className="text-purple-800 font-medium">Custom Fields Filters</Label>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addCustomFieldFilter}
              className="text-purple-600 border-purple-300 hover:bg-purple-100"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Filter
            </Button>
          </div>

          {availableCustomFields.length === 0 && (
            <div className="text-center py-4 text-purple-600 text-sm">
              No custom fields available for {config.entityType || 'selected'} entity type.
              <br />
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 text-purple-600"
                onClick={() => window.open('/tenant-admin/settings/custom-fields', '_blank')}
              >
                Create custom fields
              </Button>
            </div>
          )}

          {customFieldFilters.map((filter, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 p-3 bg-white rounded border">
              <Select
                value={filter.field_key}
                onValueChange={(value) => {
                  const selectedField = availableCustomFields.find(f => f.field_key === value);
                  updateCustomFieldFilter(index, {
                    field_key: value,
                    field_name: selectedField?.name || ''
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Custom Field" />
                </SelectTrigger>
                <SelectContent>
                  {availableCustomFields.map((field) => (
                    <SelectItem key={field.field_key} value={field.field_key}>
                      <div className="flex items-center gap-2">
                        <Settings className="h-3 w-3 text-purple-600" />
                        <span>{field.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {field.field_type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filter.operator}
                onValueChange={(value) => updateCustomFieldFilter(index, { operator: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eq">Equals</SelectItem>
                  <SelectItem value="neq">Not Equals</SelectItem>
                  <SelectItem value="like">Contains</SelectItem>
                  <SelectItem value="ilike">Contains (Case Insensitive)</SelectItem>
                  <SelectItem value="gt">Greater Than</SelectItem>
                  <SelectItem value="gte">Greater Than or Equal</SelectItem>
                  <SelectItem value="lt">Less Than</SelectItem>
                  <SelectItem value="lte">Less Than or Equal</SelectItem>
                  <SelectItem value="in">In List</SelectItem>
                  <SelectItem value="is">Is Null</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Filter value"
                value={filter.value}
                onChange={(e) => updateCustomFieldFilter(index, { value: e.target.value })}
              />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCustomFieldFilter(index)}
                className="h-auto p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}

          {customFieldFilters.length > 0 && (
            <div className="text-xs text-purple-600 mt-2">
              <p>💡 Filters will be applied to limit the data shown in this widget</p>
            </div>
          )}
        </div>
      )}

      {/* Widget Refresh Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
          <Input
            id="refresh-interval"
            type="number"
            value={config.refreshInterval || 300}
            onChange={(e) => updateConfig({ refreshInterval: parseInt(e.target.value) || 300 })}
            min="30"
            max="3600"
          />
        </div>

        <div>
          <Label htmlFor="cache-duration">Cache Duration (seconds)</Label>
          <Input
            id="cache-duration"
            type="number"
            value={config.cacheDuration || 300}
            onChange={(e) => updateConfig({ cacheDuration: parseInt(e.target.value) || 300 })}
            min="30"
            max="3600"
          />
        </div>
      </div>

      {/* Preview Information */}
      {config.includeCustomFields && availableCustomFields.length > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="flex items-start gap-2">
            <Settings className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">Custom Fields Integration Enabled</p>
              <p className="text-xs text-blue-600 mt-1">
                This widget will include data from {availableCustomFields.length} available custom fields 
                for {config.entityType || 'selected'} entities.
              </p>
              {customFieldFilters.length > 0 && (
                <p className="text-xs text-blue-600 mt-1">
                  {customFieldFilters.length} custom field filter(s) will be applied.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicConfig;
