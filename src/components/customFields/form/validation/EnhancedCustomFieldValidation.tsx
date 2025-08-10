import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface ValidationRule {
  field: string;
  rule: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  status: 'pass' | 'fail' | 'pending';
}

interface EnhancedCustomFieldValidationProps {
  form: UseFormReturn<any>;
  fieldType: string;
}

const EnhancedCustomFieldValidation: React.FC<EnhancedCustomFieldValidationProps> = ({ 
  form, 
  fieldType 
}) => {
  const watchedValues = form.watch();
  
  const getValidationRules = (): ValidationRule[] => {
    const rules: ValidationRule[] = [
      {
        field: 'name',
        rule: 'Field name is required',
        message: 'A descriptive name helps users understand the field purpose',
        severity: 'error',
        status: watchedValues.name ? 'pass' : 'fail'
      },
      {
        field: 'name',
        rule: 'Name should be descriptive',
        message: 'Use clear, meaningful names like "Department" instead of "Dept"',
        severity: 'info',
        status: watchedValues.name && watchedValues.name.length > 3 ? 'pass' : 'pending'
      }
    ];

    // Field type specific validations
    switch (fieldType) {
      case 'dropdown':
      case 'multiselect':
        rules.push({
          field: 'options',
          rule: 'At least 2 options required',
          message: 'Dropdown fields need multiple options to be useful',
          severity: 'error',
          status: watchedValues.options && watchedValues.options.length >= 2 ? 'pass' : 'fail'
        });
        
        if (watchedValues.options) {
          const hasEmptyOptions = watchedValues.options.some((opt: any) => 
            !opt.value || !opt.label || opt.value.trim() === '' || opt.label.trim() === ''
          );
          rules.push({
            field: 'options',
            rule: 'All options must have values and labels',
            message: 'Empty option values or labels can cause form submission issues',
            severity: 'warning',
            status: !hasEmptyOptions ? 'pass' : 'fail'
          });
        }
        break;

      case 'number':
        if (watchedValues.min !== undefined && watchedValues.max !== undefined) {
          rules.push({
            field: 'range',
            rule: 'Maximum should be greater than minimum',
            message: 'Ensure the min/max range makes logical sense',
            severity: 'error',
            status: Number(watchedValues.max) > Number(watchedValues.min) ? 'pass' : 'fail'
          });
        }
        break;

      case 'text':
      case 'textarea':
        if (watchedValues.maxLength && Number(watchedValues.maxLength) < 10) {
          rules.push({
            field: 'maxLength',
            rule: 'Consider longer maximum length',
            message: 'Very short max lengths may frustrate users',
            severity: 'warning',
            status: 'pending'
          });
        }
        break;
    }

    // General UX recommendations
    if (watchedValues.required && !watchedValues.info) {
      rules.push({
        field: 'info',
        rule: 'Add description for required fields',
        message: 'Required fields should explain what information is needed',
        severity: 'info',
        status: 'pending'
      });
    }

    return rules;
  };

  const validationRules = getValidationRules();
  const errorCount = validationRules.filter(r => r.status === 'fail' && r.severity === 'error').length;
  const warningCount = validationRules.filter(r => r.status === 'fail' && r.severity === 'warning').length;
  const passCount = validationRules.filter(r => r.status === 'pass').length;

  const getStatusIcon = (status: string, severity: string) => {
    if (status === 'pass') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'fail' && severity === 'error') return <XCircle className="h-4 w-4 text-red-500" />;
    if (status === 'fail' && severity === 'warning') return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <Info className="h-4 w-4 text-blue-500" />;
  };

  const getStatusColor = (status: string, severity: string) => {
    if (status === 'pass') return 'text-green-700';
    if (status === 'fail' && severity === 'error') return 'text-red-700';
    if (status === 'fail' && severity === 'warning') return 'text-yellow-700';
    return 'text-blue-700';
  };

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Field Validation</span>
          <div className="flex gap-1">
            {errorCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {errorCount} error{errorCount !== 1 ? 's' : ''}
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="outline" className="text-xs border-yellow-300 text-yellow-700">
                {warningCount} warning{warningCount !== 1 ? 's' : ''}
              </Badge>
            )}
            {passCount > 0 && (
              <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                {passCount} passing
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {validationRules.map((rule, index) => (
          <div key={index} className="flex items-start gap-3 text-sm">
            {getStatusIcon(rule.status, rule.severity)}
            <div className="flex-1">
              <div className={`font-medium ${getStatusColor(rule.status, rule.severity)}`}>
                {rule.rule}
              </div>
              <div className="text-gray-600 text-xs mt-1">
                {rule.message}
              </div>
            </div>
          </div>
        ))}

        {validationRules.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            <Info className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Fill in field details to see validation results</p>
          </div>
        )}

        {errorCount === 0 && warningCount === 0 && validationRules.length > 0 && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Field validation passed! Your field is ready to use.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedCustomFieldValidation; 