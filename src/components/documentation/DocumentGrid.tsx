import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { documentCategories } from '@/data/documentationCategories';
import type { DocumentItem } from '@/data/documentationData';

interface DocumentGridProps {
  filteredDocuments: DocumentItem[];
  onLoadDocument: (filePath: string) => void;
  onDownloadDocument: (filePath: string, title: string) => void;
}

export function DocumentGrid({
  filteredDocuments,
  onLoadDocument,
  onDownloadDocument,
}: DocumentGridProps) {
  const getCategoryIcon = (category: string) => {
    const categoryData = documentCategories.find(cat => cat.id === category);
    if (categoryData?.icon) {
      const Icon = categoryData.icon;
      return <Icon className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    if (!difficulty) return 'bg-gray-100 text-gray-800';
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type?: string) => {
    if (!type) return '📄';
    switch (type) {
      case 'guide': return '📖';
      case 'reference': return '📚';
      case 'tutorial': return '🎓';
      case 'api': return '⚡';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-4">
      {documentCategories
        .filter(cat => cat.id !== 'all' && filteredDocuments.some(doc => doc.category === cat.id))
        .map((category) => {
          const categoryDocs = filteredDocuments.filter(doc => doc.category === category.id);
          const Icon = category.icon;
          
          return (
            <div key={category.id} className="space-y-3">
              <div className="flex items-center gap-2">
                {Icon && <Icon className="h-5 w-5" />}
                <h2 className="text-lg font-semibold text-gray-900">
                  {category.label} <span className="text-gray-500">({categoryDocs.length})</span>
                </h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryDocs.map((doc) => (
                  <Card key={doc.filePath} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(doc.category)}
                          <CardTitle className="text-sm">{doc.title}</CardTitle>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge className={getPriorityColor(doc.priority)}>
                            {doc.priority}
                          </Badge>
                          {doc.difficulty && (
                            <Badge className={getDifficultyColor(doc.difficulty)}>
                              {doc.difficulty}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription className="text-xs">
                        {doc.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {doc.type && (
                              <Badge variant="secondary" className="text-xs">
                                {getTypeIcon(doc.type)} {doc.type}
                              </Badge>
                            )}
                            {doc.tags?.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {doc.tags && doc.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{doc.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onLoadDocument(doc.filePath)}
                            className="flex-1"
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDownloadDocument(doc.filePath, doc.title)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          {doc.estimatedReadTime} • Updated {doc.lastModified}
                          {doc.version && ` • v${doc.version}`}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}
