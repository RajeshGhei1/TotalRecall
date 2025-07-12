import React from 'react';
import { FileText, Download, FileDown, Clock, Calendar, Star, TrendingUp, BookOpen, Users, Code, Zap, Database, Shield, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { documentCategories } from '@/data/documentationCategories';
import type { DocumentItem } from '@/data/documentationData';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';

interface DocumentGridProps {
  filteredDocuments: DocumentItem[];
  onLoadDocument: (filePath: string) => void;
  onDownloadDocument: (filePath: string, title: string) => void;
  onDownloadPDF?: (filePath: string, title: string) => void;
}

export function DocumentGrid({
  filteredDocuments,
  onLoadDocument,
  onDownloadDocument,
  onDownloadPDF,
}: DocumentGridProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'getting-started': return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'user-guides': return <Users className="h-4 w-4 text-green-500" />;
      case 'technical': return <Code className="h-4 w-4 text-purple-500" />;
      case 'api': return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'deployment': return <Database className="h-4 w-4 text-indigo-500" />;
      case 'security': return <Shield className="h-4 w-4 text-red-500" />;
      case 'troubleshooting': return <Settings className="h-4 w-4 text-gray-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <Star className="h-3 w-3" />;
      case 'high': return <TrendingUp className="h-3 w-3" />;
      case 'medium': return <Clock className="h-3 w-3" />;
      case 'low': return <BookOpen className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    if (!difficulty) return 'bg-gray-100 text-gray-800 border-gray-200';
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'intermediate': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'advanced': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  function openDocumentInNewWindow(doc: DocumentItem) {
    const win = window.open('', '_blank');
    if (!win) return;
    // Escape for JS string: backslashes, double quotes, dollar signs, backticks, and newlines
    const safeContent = doc.content
      .replace(/\\/g, '\\\\')
      .replace(/\$/g, '\\$')
      .replace(/`/g, '\\`')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n');
    const html = `
      <html>
        <head>
          <title>${doc.title}</title>
          <meta charset='utf-8' />
          <style>
            body { font-family: sans-serif; margin: 2rem; background: #f9f9fb; color: #222; }
            h1, h2, h3, h4 { color: #2a2a6c; }
            pre, code { background: #f3f3f6; padding: 2px 4px; border-radius: 4px; }
            .prose { max-width: 800px; margin: auto; }
          </style>
        </head>
        <body>
          <div class='prose'>
            <h1>${doc.title}</h1>
            <div id='markdown-content'></div>
          </div>
          <script src='https://cdn.jsdelivr.net/npm/marked/marked.min.js'></script>
          <script>
            document.getElementById('markdown-content').innerHTML = marked.parse("${safeContent}");
          </script>
        </body>
      </html>
    `;
    win.document.write(html);
    win.document.close();
  }

  return (
    <div className="space-y-8">
      {documentCategories
        .filter(cat => cat.id !== 'all' && filteredDocuments.some(doc => doc.category === cat.id))
        .map((category) => {
          const categoryDocs = filteredDocuments.filter(doc => doc.category === category.id);
          const Icon = category.icon;
          return (
            <div key={category.id} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  {Icon && <Icon className="h-4 w-4 text-white" />}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {category.label}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {categoryDocs.length} document{categoryDocs.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {categoryDocs.map((doc) => (
                  <Card
                    key={doc.filePath}
                    className="w-full min-w-[260px] min-h-[120px] cursor-pointer hover:shadow-md transition-all duration-200 border-gray-200 hover:border-blue-300 group bg-white flex flex-row items-stretch"
                  >
                    <CardHeader className="flex flex-col justify-between py-4 w-1/3 min-w-[180px]">
                      <div className="flex flex-col gap-2">
                        <Badge className={`text-xs border bg-blue-100 text-blue-800 border-blue-200 w-fit`}>{doc.category}</Badge>
                        <CardTitle className="text-sm font-semibold group-hover:text-blue-600 transition-colors line-clamp-2">{doc.title}</CardTitle>
                        <CardDescription className="text-xs text-gray-600 line-clamp-3">{doc.description}</CardDescription>
                      </div>
                      <div className="flex flex-col gap-1 mt-2">
                        <Badge className={`text-xs border bg-purple-100 text-purple-800 border-purple-200 w-fit`}>{doc.priority}</Badge>
                        {doc.difficulty && (
                          <Badge className={`text-xs border ${getDifficultyColor(doc.difficulty)} w-fit`}>{doc.difficulty}</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between py-4">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {doc.type && (
                          <Badge variant="secondary" className="text-xs">{getTypeIcon(doc.type)} {doc.type}</Badge>
                        )}
                        {doc.tags?.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-gray-300">{tag}</Badge>
                        ))}
                        {doc.tags && doc.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs border-gray-300">+{doc.tags.length - 2}</Badge>
                        )}
                      </div>
                      <div className="flex gap-2 items-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDocumentInNewWindow(doc)}
                          className="border-gray-300 hover:bg-gray-50"
                        >
                          View Document
                        </Button>
                        {onDownloadPDF && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDownloadPDF(doc.filePath, doc.title)}
                            title="Download as PDF"
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                          >
                            <FileDown className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDownloadDocument(doc.filePath, doc.title)}
                          title="Download as Markdown"
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{doc.estimatedReadTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{doc.lastModified}</span>
                        </div>
                        {doc.version && (
                          <Badge variant="outline" className="text-xs border-gray-300">v{doc.version}</Badge>
                        )}
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
