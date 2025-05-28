
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  Settings, 
  Package,
  DollarSign,
  Users
} from 'lucide-react';

interface ModuleCardProps {
  module: {
    id: string;
    name: string;
    description?: string;
    category: string;
    is_active: boolean;
    version?: string;
    default_limits?: any;
    dependencies?: string[];
  };
  onEdit: (module: any) => void;
  onDelete: (module: any) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onEdit, onDelete }) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'core': 'bg-blue-100 text-blue-800',
      'analytics': 'bg-green-100 text-green-800',
      'communication': 'bg-purple-100 text-purple-800',
      'integrations': 'bg-orange-100 text-orange-800',
      'recruitment': 'bg-red-100 text-red-800',
      'talent': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'core': <Settings className="h-3 w-3" />,
      'analytics': <Package className="h-3 w-3" />,
      'communication': <Users className="h-3 w-3" />,
      'integrations': <Package className="h-3 w-3" />,
      'recruitment': <Users className="h-3 w-3" />,
      'talent': <Users className="h-3 w-3" />
    };
    return icons[category] || <Package className="h-3 w-3" />;
  };

  return (
    <Card className={`transition-all hover:shadow-md ${!module.is_active ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{module.name}</h3>
              {module.version && (
                <Badge variant="outline" className="text-xs">
                  v{module.version}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${getCategoryColor(module.category)} text-xs`}>
                {getCategoryIcon(module.category)}
                <span className="ml-1 capitalize">{module.category}</span>
              </Badge>
              <Badge variant={module.is_active ? 'default' : 'secondary'} className="text-xs">
                {module.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(module)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(module)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {module.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {module.description}
          </p>
        )}
        
        {module.dependencies && module.dependencies.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Dependencies:</p>
            <div className="flex flex-wrap gap-1">
              {module.dependencies.map((dep, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {dep}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {module.default_limits && Object.keys(module.default_limits).length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">Default Limits:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(module.default_limits).slice(0, 4).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}:
                  </span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
