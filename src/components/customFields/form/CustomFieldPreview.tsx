import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface CustomFieldPreviewProps {
  form: {
    watch: () => any;
  };
}

const CustomFieldPreview: React.FC<CustomFieldPreviewProps> = ({ form }) => {
  const watchedValues = form.watch();
  
  if (!watchedValues.fieldType || !watchedValues.name) {
    return (
      <Card className="border-dashed border-gray-300">
        <CardContent className="pt-6">
          <div className="text-center text-gray-500 py-8">
            <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Field preview will appear here</p>
            <p className="text-sm">Fill in the field name and type to see a preview</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderPreviewField = () => {
    const { fieldType, name, placeholder, defaultValue, options, required } = watchedValues;

    switch (fieldType) {
      case 'text':
        return (
          <Input
            placeholder={placeholder || 'Enter text...'}
            defaultValue={defaultValue}
            disabled
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={placeholder || 'Enter description...'}
            defaultValue={defaultValue}
            rows={4}
            disabled
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={placeholder || '0'}
            defaultValue={defaultValue}
            disabled
          />
        );

      case 'date':
        return (
          <div className="relative">
            <Input
              placeholder="Select date..."
              defaultValue={defaultValue ? format(new Date(defaultValue), 'PPP') : ''}
              disabled
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        );

      case 'dropdown':
      case 'multiselect':
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {(options || []).map((option: any, index: number) => (
                <SelectItem key={index} value={option.value || `option-${index}`}>
                  {option.label || option.value || `Option ${index + 1}`}
                </SelectItem>
              ))}
              {(!options || options.length === 0) && (
                <SelectItem value="placeholder" disabled>
                  No options configured
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox disabled />
            <label className="text-sm text-gray-600">
              {placeholder || 'Yes/No option'}
            </label>
          </div>
        );

      default:
        return (
          <div className="text-gray-500 text-sm">
            Preview not available for this field type
          </div>
        );
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-blue-800 flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Field Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-gray-700">
              {watchedValues.name}
            </label>
            {watchedValues.required && (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {watchedValues.fieldType}
            </Badge>
          </div>
          
          {watchedValues.info && (
            <p className="text-xs text-gray-600 mb-2">
              {watchedValues.info}
            </p>
          )}
          
          <div className="preview-field">
            {renderPreviewField()}
          </div>
        </div>

        <div className="text-xs text-gray-500 border-t pt-2">
          <p>This is how your field will appear in forms</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomFieldPreview; 