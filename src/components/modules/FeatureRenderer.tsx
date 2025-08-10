import React, { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { FeatureModuleMappingService } from '@/services/featureModuleMappingService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader, AlertTriangle, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Dynamic imports for feature components - using existing components
const FeatureComponents = {
  'custom-fields': React.lazy(() => import('@/components/customFields/form/CustomFieldsForm')),
  'form-builder': React.lazy(() => import('@/components/forms/FormBuilder')),
  'dashboard-builder': React.lazy(() => import('@/components/dashboard/DashboardBuilder')),
  'report-builder': React.lazy(() => import('@/components/reporting/ReportBuilder')),
  'bulk-upload-download': React.lazy(() => import('@/components/common/BulkUploadDialog')),
  'linkedin-enrichment': React.lazy(() => import('@/components/linkedin/LinkedInCredentialsSetup')),
  'ai-email-response-generator': React.lazy(() => import('@/components/email/AIEmailResponseGenerator').then(module => ({ default: module.AIEmailResponseGenerator }))),
  'dropdown-options-management': React.lazy(() => import('@/components/customFields/CustomFieldList'))
};

interface FeatureRendererProps {
  moduleName: string;
  entityType?: string;
  entityId?: string;
  context?: Record<string, any>;
  renderMode?: 'embedded' | 'standalone' | 'modal';
  className?: string;
}

const FeatureRenderer: React.FC<FeatureRendererProps> = ({
  moduleName,
  entityType,
  entityId,
  context = {},
  renderMode = 'embedded',
  className
}) => {
  // Get all features assigned to this module
  const { data: moduleFeatures = [], isLoading, error } = useQuery({
    queryKey: ['moduleFeatures', moduleName],
    queryFn: () => FeatureModuleMappingService.getModuleFeatures(moduleName),
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader className="h-6 w-6 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading module features...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load module features: {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  if (moduleFeatures.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500">
            <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No features assigned to this module</p>
            <p className="text-sm">Assign features through Module Management</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {moduleFeatures.map((feature) => (
        <FeatureComponent
          key={feature.id}
          feature={feature}
          moduleName={moduleName}
          entityType={entityType}
          entityId={entityId}
          context={context}
          renderMode={renderMode}
        />
      ))}
    </div>
  );
};

interface FeatureComponentProps {
  feature: any;
  moduleName: string;
  entityType?: string;
  entityId?: string;
  context: Record<string, any>;
  renderMode: 'embedded' | 'standalone' | 'modal';
}

const FeatureComponent: React.FC<FeatureComponentProps> = ({
  feature,
  moduleName,
  entityType,
  entityId,
  context,
  renderMode
}) => {
  const { data: accessResult, isLoading: accessLoading } = useFeatureAccess(moduleName, feature.feature_id);

  if (accessLoading) {
    return (
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Loader className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-gray-500">Checking feature access...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!accessResult?.hasAccess) {
    return null; // Feature not enabled for this tenant
  }

  const FeatureComponent = FeatureComponents[feature.feature_id as keyof typeof FeatureComponents];

  if (!FeatureComponent) {
    // Feature doesn't have a registered component yet
    return (
      <Card className="mb-4 border-dashed border-gray-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>{feature.feature_name}</span>
            <Badge variant="outline" className="text-xs">
              {feature.feature_category}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">
            <Settings className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Feature component not yet implemented</p>
            <p className="text-xs text-gray-400">
              Feature: {feature.feature_id}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>{feature.feature_name}</span>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {feature.feature_category}
            </Badge>
            {feature.is_premium_feature && (
              <Badge variant="secondary" className="text-xs">
                Premium
              </Badge>
            )}
          </div>
        </CardTitle>
        {feature.feature_description && (
          <p className="text-xs text-gray-600">{feature.feature_description}</p>
        )}
      </CardHeader>
      <CardContent>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-4">
              <Loader className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-gray-500">Loading {feature.feature_name}...</span>
            </div>
          }
        >
          <FeatureComponent
            entityType={entityType || 'entity'}
            entityId={entityId}
            formContext={entityType}
            tenantId={context.tenantId || 'global'}
            form={context.form}
            title=""
            description=""
            {...context}
          />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default FeatureRenderer; 