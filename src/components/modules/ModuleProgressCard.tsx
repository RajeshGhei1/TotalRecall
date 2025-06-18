
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Code, 
  TestTube, 
  CheckCircle, 
  FileText, 
  Plus,
  Settings,
  TrendingUp
} from 'lucide-react';
import { ModuleProgressMetrics, getProgressStatus } from '@/hooks/useModuleProgress';

interface ModuleProgressCardProps {
  module: ModuleProgressMetrics;
  onQuickUpdate: (moduleId: string, metricType: 'code' | 'test' | 'feature' | 'documentation', increment: number) => void;
  onDetailedUpdate: (moduleId: string) => void;
}

const ModuleProgressCard: React.FC<ModuleProgressCardProps> = ({
  module,
  onQuickUpdate,
  onDetailedUpdate
}) => {
  const { status, stage } = getProgressStatus(module.overall_progress);
  
  const getStatusColor = (stage: string) => {
    switch (stage) {
      case 'production': return 'bg-green-100 text-green-800 border-green-200';
      case 'beta': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'alpha': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'planning': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canPromoteToProduction = module.overall_progress >= 90;

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{module.module_id}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(stage)}>
                {stage.toUpperCase()}
              </Badge>
              <Badge variant="outline">{status.replace('-', ' ')}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-2xl font-bold">{module.overall_progress.toFixed(1)}%</div>
              <Progress value={module.overall_progress} className="w-24 h-2 mt-1" />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Code className="h-3 w-3 text-blue-500" />
              <span className="text-xs font-medium">Code</span>
            </div>
            <div className="text-sm font-semibold">{module.code_completion.toFixed(1)}%</div>
            <Progress value={module.code_completion} className="h-1" />
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <TestTube className="h-3 w-3 text-green-500" />
              <span className="text-xs font-medium">Tests</span>
            </div>
            <div className="text-sm font-semibold">{module.test_coverage.toFixed(1)}%</div>
            <Progress value={module.test_coverage} className="h-1" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-purple-500" />
              <span className="text-xs font-medium">Features</span>
            </div>
            <div className="text-sm font-semibold">{module.feature_completion.toFixed(1)}%</div>
            <Progress value={module.feature_completion} className="h-1" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3 text-orange-500" />
              <span className="text-xs font-medium">Docs</span>
            </div>
            <div className="text-sm font-semibold">{module.documentation_completion.toFixed(1)}%</div>
            <Progress value={module.documentation_completion} className="h-1" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onQuickUpdate(module.module_id, 'code', 5)}
              className="h-7 px-2 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Code +5%
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onQuickUpdate(module.module_id, 'test', 5)}
              className="h-7 px-2 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Test +5%
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onQuickUpdate(module.module_id, 'feature', 5)}
              className="h-7 px-2 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Feature +5%
            </Button>
          </div>
          
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDetailedUpdate(module.module_id)}
              className="h-7 px-2 text-xs"
            >
              <Settings className="h-3 w-3 mr-1" />
              Update
            </Button>
            {canPromoteToProduction && (
              <Button
                size="sm"
                className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Promote
              </Button>
            )}
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground">
          Last updated: {new Date(module.last_updated).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleProgressCard;
