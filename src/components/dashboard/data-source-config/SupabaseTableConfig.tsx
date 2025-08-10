
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Settings } from 'lucide-react';
import { DataSourceConfig, FilterConfig } from '@/types/common';
import { useCustomFieldsList } from '@/hooks/customFields/useCustomFieldsList';
import { useAuth } from '@/contexts/AuthContext';

interface SupabaseTableConfigProps {
  config: DataSourceConfig;
  setConfig: (config: DataSourceConfig | ((prev: DataSourceConfig) => DataSourceConfig)) => void;
  newFilter: FilterConfig;
  setNewFilter: (filter: FilterConfig | ((prev: FilterConfig) => FilterConfig)) => void;
  addFilter: () => void;
  removeFilter: (index: number) => void;
}

const SupabaseTableConfig: React.FC<SupabaseTableConfigProps> = ({
  config,
  setConfig,
  newFilter,
  setNewFilter,
  addFilter,
  removeFilter
}) => {
  const { user } = useAuth();
  
  // Get custom fields for enhanced data source options
  const { customFields: companyCustomFields } = useCustomFieldsList({ 
    entityType: 'company' 
  });
  const { customFields: peopleCustomFields } = useCustomFieldsList({ 
    entityType: 'people' 
  });
  const { customFields: talentCustomFields } = useCustomFieldsList({ 
    entityType: 'talent' 
  });

  // Get available columns based on selected table
  const getAvailableColumns = () => {
    const table = config.query_config.table;
    let columns: Array<{ value: string; label: string; category?: string }> = [];
    
    switch (table) {
      case 'companies':
        columns = [
          { value: 'id', label: 'ID' },
          { value: 'name', label: 'Company Name' },
          { value: 'website', label: 'Website' },
          { value: 'industry', label: 'Industry' },
          { value: 'size', label: 'Company Size' },
          { value: 'location', label: 'Location' },
          { value: 'created_at', label: 'Created Date' },
          { value: 'updated_at', label: 'Updated Date' },
        ];
        // Add custom fields
        companyCustomFields?.forEach(field => {
          columns.push({
            value: `custom_fields.${field.field_key}`,
            label: `${field.name} (Custom)`,
            category: 'custom'
          });
        });
        break;
        
      case 'people':
        columns = [
          { value: 'id', label: 'ID' },
          { value: 'full_name', label: 'Full Name' },
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone' },
          { value: 'location', label: 'Location' },
          { value: 'type', label: 'Contact Type' },
          { value: 'created_at', label: 'Created Date' },
        ];
        // Add custom fields
        peopleCustomFields?.forEach(field => {
          columns.push({
            value: `custom_fields.${field.field_key}`,
            label: `${field.name} (Custom)`,
            category: 'custom'
          });
        });
        break;
        
      case 'talents':
        columns = [
          { value: 'id', label: 'ID' },
          { value: 'first_name', label: 'First Name' },
          { value: 'last_name', label: 'Last Name' },
          { value: 'email', label: 'Email' },
          { value: 'skills', label: 'Skills' },
          { value: 'experience_years', label: 'Experience Years' },
          { value: 'location', label: 'Location' },
        ];
        // Add custom fields
        talentCustomFields?.forEach(field => {
          columns.push({
            value: `custom_fields.${field.field_key}`,
            label: `${field.name} (Custom)`,
            category: 'custom'
          });
        });
        break;
        
      case 'custom_fields':
        columns = [
          { value: 'id', label: 'Field ID' },
          { value: 'name', label: 'Field Name' },
          { value: 'field_type', label: 'Field Type' },
          { value: 'entity_type', label: 'Entity Type' },
          { value: 'created_at', label: 'Created Date' },
        ];
        break;
        
      case 'custom_field_values':
        columns = [
          { value: 'id', label: 'Value ID' },
          { value: 'entity_type', label: 'Entity Type' },
          { value: 'entity_id', label: 'Entity ID' },
          { value: 'field_key', label: 'Field Key' },
          { value: 'value', label: 'Field Value' },
          { value: 'created_at', label: 'Created Date' },
        ];
        break;
        
      default:
        columns = [
          { value: '*', label: 'All Columns' },
          { value: 'id', label: 'ID' },
          { value: 'created_at', label: 'Created Date' },
        ];
    }
    
    return columns;
  };

  const availableColumns = getAvailableColumns();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="table">Table Name</Label>
          <Select 
            value={config.query_config.table} 
            onValueChange={(value) => setConfig(prev => ({
              ...prev,
              query_config: { ...prev.query_config, table: value }
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select table" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="companies">Companies</SelectItem>
              <SelectItem value="people">People</SelectItem>
              <SelectItem value="talents">Talents</SelectItem>
              <SelectItem value="tenants">Tenants</SelectItem>
              <SelectItem value="profiles">Profiles</SelectItem>
              {/* Custom Fields Tables */}
              <SelectItem value="custom_fields">
                <div className="flex items-center gap-2">
                  <Settings className="h-3 w-3 text-purple-600" />
                  Custom Fields (Definitions)
                </div>
              </SelectItem>
              <SelectItem value="custom_field_values">
                <div className="flex items-center gap-2">
                  <Settings className="h-3 w-3 text-purple-600" />
                  Custom Field Values
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="operation">Operation</Label>
          <Select 
            value={config.query_config.operation} 
            onValueChange={(value) => setConfig(prev => ({
              ...prev,
              query_config: { ...prev.query_config, operation: value }
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select operation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="select">Select Records</SelectItem>
              <SelectItem value="count">Count Records</SelectItem>
              <SelectItem value="aggregate">Aggregate Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="columns">Columns to Select</Label>
        <Select 
          value={config.query_config.columns} 
          onValueChange={(value) => setConfig(prev => ({
            ...prev,
            query_config: { ...prev.query_config, columns: value }
          }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select columns" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="*">All Columns</SelectItem>
            {availableColumns.map((col) => (
              <SelectItem key={col.value} value={col.value}>
                <div className="flex items-center gap-2">
                  {col.category === 'custom' && (
                    <Settings className="h-3 w-3 text-purple-600" />
                  )}
                  <span>{col.label}</span>
                  {col.category === 'custom' && (
                    <Badge variant="outline" className="text-xs bg-purple-100">
                      Custom
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {config.query_config.table && availableColumns.some(col => col.category === 'custom') && (
          <p className="text-xs text-purple-600 mt-1">
            ✨ Custom fields are automatically included for this entity type
          </p>
        )}
      </div>

      {/* Filters Section */}
      <div>
        <Label>Filters</Label>
        <div className="space-y-2">
          {(config.query_config.filters || []).map((filter: FilterConfig, index: number) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded">
              <span className="text-sm">{filter.column}</span>
              <Badge variant="outline">{filter.operator}</Badge>
              <span className="text-sm">{filter.value}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter(index)}
                className="h-auto p-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Filter */}
      <div className="grid grid-cols-4 gap-2">
        <Select 
          value={newFilter.column} 
          onValueChange={(value) => setNewFilter(prev => ({ ...prev, column: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Column" />
          </SelectTrigger>
          <SelectContent>
            {availableColumns.map((col) => (
              <SelectItem key={col.value} value={col.value}>
                <div className="flex items-center gap-2">
                  {col.category === 'custom' && (
                    <Settings className="h-3 w-3 text-purple-600" />
                  )}
                  <span>{col.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={newFilter.operator} 
          onValueChange={(value) => setNewFilter(prev => ({ ...prev, operator: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Operator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eq">Equals</SelectItem>
            <SelectItem value="neq">Not Equals</SelectItem>
            <SelectItem value="gt">Greater Than</SelectItem>
            <SelectItem value="gte">Greater Than or Equal</SelectItem>
            <SelectItem value="lt">Less Than</SelectItem>
            <SelectItem value="lte">Less Than or Equal</SelectItem>
            <SelectItem value="like">Contains</SelectItem>
            <SelectItem value="ilike">Contains (Case Insensitive)</SelectItem>
            <SelectItem value="in">In List</SelectItem>
            <SelectItem value="is">Is Null</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Value"
          value={newFilter.value}
          onChange={(e) => setNewFilter(prev => ({ ...prev, value: e.target.value }))}
        />

        <Button onClick={addFilter} size="sm">
          Add Filter
        </Button>
      </div>
    </div>
  );
};

export default SupabaseTableConfig;
