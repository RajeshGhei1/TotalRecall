import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useModuleFeatures } from '@/hooks/useFeatureAccess';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModuleFeatureIntegrationProps {
  moduleName: string;
  entityType?: string;
  entityId?: string;
  className?: string;
}

const ModuleFeatureIntegration: React.FC<ModuleFeatureIntegrationProps> = ({
  moduleName,
  entityType,
  entityId,
  className
}) => {
  const navigate = useNavigate();
  const { data: features = [] } = useModuleFeatures(moduleName);

  if (features.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center py-6 text-gray-500">
            <Settings className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No features assigned to this module</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => navigate('/superadmin/feature-management')}
            >
              <Plus className="h-3 w-3 mr-1" />
              Assign Features
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Available Features</span>
            <Badge variant="outline" className="text-xs">
              {features.length} features
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {features.map((feature) => (
              <div 
                key={feature.id}
                className="flex items-center justify-between p-2 rounded-lg border bg-gray-50"
              >
                <div>
                  <div className="font-medium text-sm">{feature.feature_name}</div>
                  <div className="text-xs text-gray-600">{feature.feature_description}</div>
                </div>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">
                    {feature.feature_category}
                  </Badge>
                  {feature.is_premium_feature && (
                    <Badge variant="secondary" className="text-xs">
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t">
            <p className="text-xs text-gray-500 mb-2">
              These features are now available in this module based on your assignments.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/superadmin/feature-management')}
            >
              <Settings className="h-3 w-3 mr-1" />
              Manage Features
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleFeatureIntegration; 