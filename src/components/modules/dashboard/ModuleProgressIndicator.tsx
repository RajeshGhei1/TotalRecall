
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Clipboard, 
  Code, 
  TestTube, 
  Rocket,
  TrendingUp
} from 'lucide-react';

interface ModuleProgressIndicatorProps {
  stage: string;
  progress: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ModuleProgressIndicator: React.FC<ModuleProgressIndicatorProps> = ({
  stage,
  progress,
  showDetails = false,
  size = 'md'
}) => {
  const getStageConfig = (stage: string) => {
    const configs = {
      planning: {
        icon: <Clipboard className="h-4 w-4" />,
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        label: 'Planning',
        description: 'Initial planning and design phase'
      },
      alpha: {
        icon: <Code className="h-4 w-4" />,
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        label: 'Alpha',
        description: 'Core development in progress'
      },
      beta: {
        icon: <TestTube className="h-4 w-4" />,
        color: 'bg-orange-100 text-orange-700 border-orange-200',
        label: 'Beta',
        description: 'Testing and refinement phase'
      },
      production: {
        icon: <Rocket className="h-4 w-4" />,
        color: 'bg-green-100 text-green-700 border-green-200',
        label: 'Production',
        description: 'Ready for deployment'
      }
    };
    
    return configs[stage as keyof typeof configs] || configs.planning;
  };

  const config = getStageConfig(stage);
  const progressBarSize = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-3' : 'h-2.5';

  return (
    <div className="space-y-2">
      {/* Stage Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={`${config.color} font-medium`}>
          {config.icon}
          <span className="ml-1">{config.label}</span>
        </Badge>
        
        {showDetails && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <TrendingUp className="h-3 w-3" />
            <span>{progress}%</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <Progress value={progress} className={progressBarSize} />
        {showDetails && (
          <p className="text-xs text-gray-500">{config.description}</p>
        )}
      </div>
    </div>
  );
};

export default ModuleProgressIndicator;
