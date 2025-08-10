/**
 * CUSTOM FIELDS ATOMIC FEATURE
 * Standards-compliant, dependency-free, composable feature
 * Implements all 7 design principles
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { featureEventBus, FeatureEvents } from '@/services/features/featureEventBus';
import { useCustomFieldsQuery } from '@/hooks/customFields/useCustomFieldsQuery';
import { 
  FeatureContext, 
  FeatureExecutionResult,
  FeatureConfig 
} from '@/types/standardsCompliantFeatures';

// Standards-compliant feature interface
interface CustomFieldsFeatureProps {
  // Standards-compliant props (Principle 2: Interface-Driven)
  featureId: string;
  context: FeatureContext;
  config: FeatureConfig;
  
  // Legacy props for backward compatibility
  entityType?: string;
  entityId?: string;
  tenantId?: string;
  formContext?: string;
  form?: any;
  title?: string;
  description?: string;
}

// Input/Output schemas (Principle 2: Interface-Driven)
export const CustomFieldsFeatureSchema = {
  input: {
    type: "object",
    properties: {
      entityType: { type: "string" },
      entityId: { type: "string" },
      fieldScope: { enum: ["global", "tenant"] },
      context: { type: "object" }
    },
    required: ["entityType"]
  },
  output: {
    type: "object",
    properties: {
      customFields: { type: "array" },
      validationErrors: { type: "array" },
      success: { type: "boolean" }
    }
  }
};

const CustomFieldsFeature: React.FC<CustomFieldsFeatureProps> = ({
  featureId,
  context,
  config,
  entityType,
  entityId,
  tenantId,
  formContext,
  form,
  title = "Custom Fields",
  description = "Manage custom fields for this entity"
}) => {
  // State management (Principle 6: Statelessness - minimal state)
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [executionResult, setExecutionResult] = useState<FeatureExecutionResult | null>(null);

  // Determine scope from context
  const fieldScope = context.tenantId ? 'tenant' : 'global';
  const effectiveEntityType = entityType || context.entityType || 'unknown';
  const effectiveTenantId = tenantId || context.tenantId;

  // Fetch custom fields using existing hook
  const { 
    data: customFields = [], 
    isLoading, 
    error,
    refetch 
  } = useCustomFieldsQuery(fieldScope, effectiveTenantId);

  // Event subscription for reactive updates (Principle 5: Minimal Cross-Talk)
  useEffect(() => {
    const subscriptions = [
      // Listen for field creation events
      featureEventBus.subscribe(FeatureEvents.FIELD_CREATED, async (eventName, payload) => {
        console.log('📡 Custom Fields: Field created', payload);
        await refetch();
        
        // Emit execution result
        await featureEventBus.emit(FeatureEvents.FEATURE_EXECUTED, {
          featureId,
          result: {
            success: true,
            data: { action: 'field_created', field: payload }
          }
        }, context);
      }),

      // Listen for field updates
      featureEventBus.subscribe(FeatureEvents.FIELD_UPDATED, async (eventName, payload) => {
        console.log('📡 Custom Fields: Field updated', payload);
        await refetch();
      }),

      // Listen for field deletions
      featureEventBus.subscribe(FeatureEvents.FIELD_DELETED, async (eventName, payload) => {
        console.log('📡 Custom Fields: Field deleted', payload);
        await refetch();
      })
    ];

    return () => {
      subscriptions.forEach(id => featureEventBus.unsubscribe(id));
    };
  }, [featureId, context, refetch]);

  // Feature execution handler (Principle 2: Interface-Driven)
  const executeFeature = useCallback(async (action: string, data?: any): Promise<FeatureExecutionResult> => {
    try {
      const startTime = Date.now();
      let result: FeatureExecutionResult;

      switch (action) {
        case 'create_field':
          result = await handleCreateField(data);
          break;
        case 'update_field':
          result = await handleUpdateField(data);
          break;
        case 'delete_field':
          result = await handleDeleteField(data);
          break;
        case 'get_fields':
          result = {
            success: true,
            data: { customFields },
            executionTime: Date.now() - startTime
          };
          break;
        default:
          result = {
            success: false,
            errors: [{ code: 'INVALID_ACTION', message: `Unknown action: ${action}`, recoverable: false }],
            executionTime: Date.now() - startTime
          };
      }

      setExecutionResult(result);
      
      // Emit execution event (Principle 6: Auditability)
      await featureEventBus.emit(FeatureEvents.FEATURE_EXECUTED, {
        featureId,
        action,
        data,
        result
      }, context);

      return result;

    } catch (error) {
      const errorResult: FeatureExecutionResult = {
        success: false,
        errors: [{ 
          code: 'EXECUTION_ERROR', 
          message: error instanceof Error ? error.message : 'Unknown error',
          recoverable: false 
        }],
        executionTime: Date.now() - Date.now()
      };

      setExecutionResult(errorResult);
      
      await featureEventBus.emit(FeatureEvents.FEATURE_ERROR, {
        featureId,
        action,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, context);

      return errorResult;
    }
  }, [featureId, context, customFields]);

  // Action handlers
  const handleCreateField = async (fieldData: any): Promise<FeatureExecutionResult> => {
    // Emit field creation event
    await featureEventBus.emit(FeatureEvents.FIELD_CREATED, {
      fieldId: `field_${Date.now()}`,
      fieldData,
      entityType: effectiveEntityType,
      scope: fieldScope,
      createdBy: context.userId
    }, context);

    return {
      success: true,
      data: { action: 'field_created', fieldData }
    };
  };

  const handleUpdateField = async (fieldData: any): Promise<FeatureExecutionResult> => {
    await featureEventBus.emit(FeatureEvents.FIELD_UPDATED, {
      fieldId: fieldData.id,
      fieldData,
      changes: fieldData.changes,
      updatedBy: context.userId
    }, context);

    return {
      success: true,
      data: { action: 'field_updated', fieldData }
    };
  };

  const handleDeleteField = async (fieldId: string): Promise<FeatureExecutionResult> => {
    await featureEventBus.emit(FeatureEvents.FIELD_DELETED, {
      fieldId,
      entityType: effectiveEntityType,
      deletedBy: context.userId
    }, context);

    return {
      success: true,
      data: { action: 'field_deleted', fieldId }
    };
  };

  // UI event handlers
  const handleCreateNew = useCallback(() => {
    setIsCreating(true);
    executeFeature('create_field', {
      name: 'New Field',
      type: 'text',
      required: false,
      entityType: effectiveEntityType
    });
  }, [executeFeature, effectiveEntityType]);

  const handleEditField = useCallback((fieldId: string) => {
    const field = customFields.find(f => f.id === fieldId);
    if (field) {
      executeFeature('update_field', {
        id: fieldId,
        ...field,
        changes: { lastModified: new Date().toISOString() }
      });
    }
  }, [executeFeature, customFields]);

  const handleDeleteField = useCallback((fieldId: string) => {
    executeFeature('delete_field', fieldId);
  }, [executeFeature]);

  // Render mode handling (Standard 3.7: Isolated UI Elements)
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-500">Loading custom fields...</span>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load custom fields: {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-4">
        {/* Header with actions */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">{title}</h3>
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {fieldScope === 'global' ? 'Global' : 'Tenant'}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {customFields.length} fields
            </Badge>
            <Button
              onClick={handleCreateNew}
              size="sm"
              disabled={isCreating}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Field
            </Button>
          </div>
        </div>

        {/* Custom fields list */}
        {customFields.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No custom fields configured</p>
            <p className="text-sm">Create your first custom field to get started</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {customFields.map((field) => (
              <Card key={field.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{field.field_name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {field.field_type}
                        </Badge>
                        {field.is_required && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                        {field.is_global && (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                            Global
                          </Badge>
                        )}
                      </div>
                      {field.description && (
                        <p className="text-sm text-gray-600 mt-1">{field.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditField(field.id)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteField(field.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Execution result display (debug mode) */}
        {config.auditingEnabled && executionResult && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-yellow-800">Last Execution Result</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <pre className="text-xs text-yellow-700 overflow-auto">
                {JSON.stringify(executionResult, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Return based on render mode (Standard 3.7: Isolated UI Elements)
  if (config.renderMode === 'embedded' || !config.renderMode) {
    return <div className="custom-fields-feature">{renderContent()}</div>;
  }

  if (config.renderMode === 'modal') {
    return (
      <Card className="custom-fields-feature-modal">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="custom-fields-feature-standalone">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>{title}</span>
          <Badge variant="outline">v1.0.0</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

// Export feature metadata (Principle 2: Interface-Driven)
export const CustomFieldsFeatureMetadata = {
  name: 'Custom Fields',
  description: 'Manage custom fields for entities',
  version: '1.0.0',
  category: 'Data Management',
  tags: ['data', 'management', 'crud', 'fields'],
  author: 'TOTAL Platform',
  schema: CustomFieldsFeatureSchema
};

export default CustomFieldsFeature; 