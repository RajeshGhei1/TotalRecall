
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Package, Upload, Settings } from 'lucide-react';

const SimplifiedModuleDeployment: React.FC = () => {
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);

  const handleDeploy = async () => {
    setDeploymentStatus('deploying');
    setProgress(0);

    // Simulate deployment progress
    const intervals = [20, 40, 60, 80, 100];
    for (const target of intervals) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(target);
    }

    setDeploymentStatus('complete');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Module Deployment</h2>
        <p className="text-muted-foreground">
          Deploy and manage your modules across tenants
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Package Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Ready Modules</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="space-y-1">
                <div className="text-sm">ats-core v1.2.0</div>
                <div className="text-sm">talent-analytics v2.1.0</div>
                <div className="text-sm">custom-widget v1.0.0</div>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleDeploy}
              disabled={deploymentStatus === 'deploying'}
            >
              <Upload className="h-4 w-4 mr-2" />
              {deploymentStatus === 'deploying' ? 'Deploying...' : 'Deploy All'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Deployment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deploymentStatus === 'idle' && (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Ready to deploy</p>
              </div>
            )}
            
            {deploymentStatus === 'deploying' && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Deployment Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground">
                  Deploying modules to tenants...
                </p>
              </div>
            )}
            
            {deploymentStatus === 'complete' && (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="font-medium">Deployment Complete</p>
                <p className="text-sm text-muted-foreground">
                  All modules deployed successfully
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimplifiedModuleDeployment;
