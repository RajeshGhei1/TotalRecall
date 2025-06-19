
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Package, 
  Settings, 
  Rocket,
  AlertCircle,
  CheckCircle,
  Clock,
  Code
} from 'lucide-react';
import { useSystemModules } from '@/hooks/useSystemModules';
import { useAllModulesProgress } from '@/hooks/useModuleProgress';
import { getDevelopmentModuleCount, getMaturityStatusVariant, getDevelopmentProgress, convertSystemModulesToModules } from '@/utils/moduleUtils';
import { getDisplayName, normalizeModuleName } from '@/utils/moduleNameMapping';

const DevelopmentModulesDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Fetch all system modules and progress data
  const { data: systemModules = [], isLoading: modulesLoading } = useSystemModules(true);
  const { data: modulesProgress = [], isLoading: progressLoading } = useAllModulesProgress();

  const isLoading = modulesLoading || progressLoading;

  // Convert SystemModules to Module format
  const modules = convertSystemModulesToModules(systemModules);

  // Create a map of module progress by normalized module name
  const progressMap = new Map();
  modulesProgress.forEach(progress => {
    progressMap.set(progress.module_id, progress);
  });

  // Combine system modules with their progress data
  const developmentModules = modules
    .filter(module => module.maturity_status !== 'production')
    .map(module => {
      const normalizedName = normalizeModuleName(module.name);
      const progress = progressMap.get(normalizedName);
      
      return {
        ...module,
        overall_progress: progress?.overall_progress || getDevelopmentProgress(module),
        display_name: getDisplayName(module.name),
        progress_data: progress
      };
    });

  console.log('Development modules with progress:', developmentModules.map(m => ({ 
    name: m.name, 
    display_name: m.display_name,
    normalized: normalizeModuleName(m.name),
    maturity_status: m.maturity_status, 
    overall_progress: m.overall_progress,
    has_progress_data: !!m.progress_data
  })));

  const filteredModules = developmentModules.filter(module => {
    const searchableText = `${module.display_name} ${module.description || ''}`.toLowerCase();
    const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || module.maturity_status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    planning: developmentModules.filter(m => m.maturity_status === 'planning').length,
    alpha: developmentModules.filter(m => m.maturity_status === 'alpha').length,
    beta: developmentModules.filter(m => m.maturity_status === 'beta').length,
  };

  const handlePromoteToProduction = async (moduleId: string) => {
    try {
      console.log('Would promote module to production:', moduleId);
      // Implementation would go here
    } catch (error) {
      console.error('Failed to promote module:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Development Modules</h3>
          <p className="text-muted-foreground">
            Modules currently in development that can be promoted to production
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{developmentModules.length}</p>
                <p className="text-sm text-muted-foreground">Total in Development</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-gray-500" />
              <div>
                <p className="text-2xl font-bold">{statusCounts.planning}</p>
                <p className="text-sm text-muted-foreground">Planning Stage</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{statusCounts.alpha}</p>
                <p className="text-sm text-muted-foreground">Alpha Stage</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{statusCounts.beta}</p>
                <p className="text-sm text-muted-foreground">Beta Stage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search development modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All Stages' },
            { value: 'planning', label: 'Planning' },
            { value: 'alpha', label: 'Alpha' },
            { value: 'beta', label: 'Beta' }
          ].map((status) => (
            <Button
              key={status.value}
              variant={selectedStatus === status.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(status.value)}
            >
              {status.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Development Modules List */}
      {filteredModules.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No Development Modules Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedStatus !== 'all' 
                ? "Try adjusting your search criteria or filters" 
                : "No modules are currently in development"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredModules.map((module) => {
            const statusVariant = getMaturityStatusVariant(module.maturity_status || 'planning');
            const progress = module.overall_progress;
            const canPromote = module.maturity_status === 'beta' && progress >= 80;
            
            return (
              <Card key={module.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{module.display_name}</h4>
                        <Badge variant={statusVariant.variant} className={statusVariant.className}>
                          {module.maturity_status?.toUpperCase() || 'PLANNING'}
                        </Badge>
                        <Badge variant="outline">{module.category}</Badge>
                        {module.progress_data && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Progress Tracked
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {module.description || 'No description available'}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Development Progress</span>
                          <span className="text-sm text-muted-foreground">{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              progress >= 80 ? 'bg-green-600' : 
                              progress >= 50 ? 'bg-blue-600' : 
                              progress >= 25 ? 'bg-yellow-600' : 'bg-gray-400'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>Technical Name: {normalizeModuleName(module.name)}</span>
                        <span>Version: {module.version || '1.0.0'}</span>
                        {module.dependencies && module.dependencies.length > 0 && (
                          <span>• Dependencies: {module.dependencies.length}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      {canPromote && (
                        <Button 
                          size="sm"
                          onClick={() => handlePromoteToProduction(module.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Rocket className="h-4 w-4 mr-2" />
                          Promote to Production
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DevelopmentModulesDashboard;
