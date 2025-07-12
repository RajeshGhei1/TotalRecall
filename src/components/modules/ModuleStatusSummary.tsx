
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertTriangle, Rocket } from 'lucide-react';
import { getModuleStatusSummary, getMaturityStatusVariant } from '@/utils/moduleUtils';

interface ModuleStatusSummaryProps {
  modules: unknown[];
  title?: string;
}

const ModuleStatusSummary: React.FC<ModuleStatusSummaryProps> = ({ 
  modules, 
  title = "Module Development Status" 
}) => {
  const statusCounts = modules.reduce((acc, module) => {
    const status = getModuleStatusSummary(module);
    if (status.isProduction) acc.production += 1;
    else if (status.isBeta) acc.beta += 1;
    else if (status.isAlpha) acc.alpha += 1;
    else acc.planning += 1;
    return acc;
  }, { production: 0, beta: 0, alpha: 0, planning: 0 });

  const avgProgress = modules.length > 0 
    ? modules.reduce((sum, module) => sum + getModuleStatusSummary(module).progress, 0) / modules.length 
    : 0;

  const productionReadyModules = modules.filter(module => 
    getModuleStatusSummary(module).isProductionReady
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>
            Overall system development progress and module status breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-emerald-600">{statusCounts.production}</div>
              <div className="text-sm text-muted-foreground">Production</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{statusCounts.beta}</div>
              <div className="text-sm text-muted-foreground">Beta</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.alpha}</div>
              <div className="text-sm text-muted-foreground">Alpha</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
              <div className="text-2xl font-bold text-gray-600">{statusCounts.planning}</div>
              <div className="text-sm text-muted-foreground">Planning</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{avgProgress.toFixed(1)}%</span>
            </div>
            <Progress value={avgProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {productionReadyModules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Production-Ready Modules</CardTitle>
            <CardDescription>
              Modules that are ready for production deployment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {productionReadyModules.map((module) => {
                const status = getModuleStatusSummary(module);
                const badgeVariant = getMaturityStatusVariant('production', status.progress);
                
                return (
                  <div key={module.id || module.name} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium">{module.name || module.module_id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={badgeVariant.className}>
                        {status.progress.toFixed(1)}%
                      </Badge>
                      <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                        Production Ready
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModuleStatusSummary;
