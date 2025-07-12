
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEnhancedVersionControl } from '@/hooks/versioning/useEnhancedVersionControl';
import { Clock, User, GitBranch, CheckCircle, XCircle, Eye, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface VersionHistoryPanelProps {
  entityType: 'form' | 'report';
  entityId: string;
  onVersionSelect?: (version: unknown) => void;
  onVersionRestore?: (version: unknown) => void;
}

const VersionHistoryPanel: React.FC<VersionHistoryPanelProps> = ({
  entityType,
  entityId,
  onVersionSelect,
  onVersionRestore,
}) => {
  const {
    useVersionHistory,
    usePublishedVersion,
    publishVersion,
    restoreFromVersion,
  } = useEnhancedVersionControl();

  const { data: versions, isLoading } = useVersionHistory(entityType, entityId);
  const { data: publishedVersion } = usePublishedVersion(entityType, entityId);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const getStatusColor = (status: string, isPublished: boolean) => {
    if (isPublished) return 'bg-green-500';
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'pending_approval': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string, isPublished: boolean) => {
    if (isPublished) return <CheckCircle className="h-4 w-4" />;
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleVersionClick = (version: unknown) => {
    setSelectedVersion(version.id);
    onVersionSelect?.(version);
  };

  const handlePublish = async (versionId: string) => {
    try {
      await publishVersion.mutateAsync(versionId);
    } catch (error) {
      console.error('Failed to publish version:', error);
    }
  };

  const handleRestore = async (version: unknown) => {
    try {
      await restoreFromVersion.mutateAsync({
        entityType,
        entityId,
        versionId: version.id,
      });
      onVersionRestore?.(version);
    } catch (error) {
      console.error('Failed to restore version:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Version History
        </CardTitle>
        <CardDescription>
          Track changes and manage versions for this {entityType}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {versions?.map((version, index) => (
              <div key={version.id}>
                <div
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedVersion === version.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleVersionClick(version)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="secondary"
                          className={`text-white ${getStatusColor(version.approval_status, version.is_published)}`}
                        >
                          <span className="flex items-center gap-1">
                            {getStatusIcon(version.approval_status, version.is_published)}
                            v{version.version_number}
                          </span>
                        </Badge>
                        {version.is_published && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Published
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {version.change_summary || `Version ${version.version_number}`}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {version.profiles?.full_name || version.profiles?.email || 'Unknown'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVersionClick(version);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {!version.is_published && version.approval_status === 'approved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePublish(version.id);
                          }}
                          disabled={publishVersion.isPending}
                        >
                          Publish
                        </Button>
                      )}
                      
                      {!version.is_published && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestore(version);
                          }}
                          disabled={restoreFromVersion.isPending}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {index < (versions?.length || 0) - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}
            
            {(!versions || versions.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No versions found</p>
                <p className="text-sm">Versions will appear here as you make changes</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default VersionHistoryPanel;
