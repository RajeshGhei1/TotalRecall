
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Building, 
  Blocks, 
  Calendar,
  Settings,
  Trash2,
  Edit
} from 'lucide-react';
import { TenantModuleAssignment } from '@/hooks/modules/useTenantModules';
import { format } from 'date-fns';

interface TenantModuleListProps {
  assignments: TenantModuleAssignment[];
}

const TenantModuleList: React.FC<TenantModuleListProps> = ({ assignments }) => {
  const getStatusBadge = (assignment: TenantModuleAssignment) => {
    const now = new Date();
    const isExpired = assignment.expires_at && new Date(assignment.expires_at) <= now;
    
    if (isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    if (!assignment.is_enabled) {
      return <Badge variant="secondary">Disabled</Badge>;
    }
    
    return <Badge variant="default">Active</Badge>;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'core': 'bg-blue-100 text-blue-800',
      'analytics': 'bg-green-100 text-green-800',
      'communication': 'bg-purple-100 text-purple-800',
      'integrations': 'bg-orange-100 text-orange-800',
      'recruitment': 'bg-indigo-100 text-indigo-800',
      'talent': 'bg-pink-100 text-pink-800',
      'configuration': 'bg-gray-100 text-gray-800',
      'system-admin': 'bg-red-100 text-red-800',
      'tenant-admin': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (assignments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No module assignments found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {assignments.map((assignment) => (
        <Card key={assignment.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{assignment.tenant?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Blocks className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{assignment.module?.name}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getCategoryColor(assignment.module?.category || '')}`}
                    >
                      {assignment.module?.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Assigned: {format(new Date(assignment.assigned_at), 'MMM dd, yyyy')}</span>
                  </div>
                  {assignment.expires_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Expires: {format(new Date(assignment.expires_at), 'MMM dd, yyyy')}</span>
                    </div>
                  )}
                </div>
                
                {assignment.module?.description && (
                  <p className="text-xs text-muted-foreground">
                    {assignment.module.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(assignment)}
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TenantModuleList;
