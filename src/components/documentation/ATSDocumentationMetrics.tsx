
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  Clock, 
  TrendingUp,
  FileText,
  Code,
  Target
} from 'lucide-react';
import { atsDocuments } from '@/data/atsDocumentation';

export function ATSDocumentationMetrics() {
  const totalDocuments = atsDocuments.length;
  const documentsByType = atsDocuments.reduce((acc, doc) => {
    acc[doc.type] = (acc[doc.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const documentsByDifficulty = atsDocuments.reduce((acc, doc) => {
    acc[doc.difficulty] = (acc[doc.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalReadTime = atsDocuments.reduce((acc, doc) => {
    const time = parseInt(doc.estimatedReadTime.split(' ')[0]);
    return acc + time;
  }, 0);

  const metrics = [
    {
      title: 'Total Documents',
      value: totalDocuments.toString(),
      description: 'Complete ATS documentation',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'User Guides',
      value: documentsByType.guide || 0,
      description: 'Step-by-step tutorials',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Technical Docs',
      value: (documentsByType.reference || 0) + (documentsByType.api || 0),
      description: 'API & integration guides',
      icon: Code,
      color: 'text-purple-600'
    },
    {
      title: 'Total Read Time',
      value: `${totalReadTime} min`,
      description: 'Complete reading time',
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Document Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Document Types
            </CardTitle>
            <CardDescription>
              Breakdown by document type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(documentsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {type === 'guide' && 'User guides & tutorials'}
                      {type === 'reference' && 'Quick reference materials'}
                      {type === 'tutorial' && 'Interactive tutorials'}
                      {type === 'api' && 'Technical documentation'}
                    </span>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Difficulty Levels
            </CardTitle>
            <CardDescription>
              Content by user experience level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(documentsByDifficulty).map(([difficulty, count]) => (
                <div key={difficulty} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={
                        difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {difficulty === 'beginner' && 'New users & basic tasks'}
                      {difficulty === 'intermediate' && 'Regular users & workflows'}
                      {difficulty === 'advanced' && 'Power users & integrations'}
                    </span>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recently Updated Documentation
          </CardTitle>
          <CardDescription>
            Latest documentation updates and additions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {atsDocuments
              .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
              .slice(0, 3)
              .map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{doc.title}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {doc.type}
                      </Badge>
                      <span>{doc.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">v{doc.version}</div>
                    <div className="text-xs text-muted-foreground">
                      {doc.lastUpdated}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
