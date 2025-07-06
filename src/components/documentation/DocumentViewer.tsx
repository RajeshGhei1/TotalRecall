import React from 'react';
import { FileText, Download, Clock, Calendar, FileDown, Star, TrendingUp, BookOpen, Users, Code, Zap, Database, Shield, Settings, Eye, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import type { DocumentItem } from '@/data/documentationData';
import { availableDocuments } from '@/data/documentationData';
import { atsDocuments } from '@/data/atsDocumentation';

interface DocumentViewerProps {
  selectedDocument: DocumentItem | null;
  loading: boolean;
  onDownloadDocument: (filePath: string, title: string) => void;
  onDownloadPDF?: (filePath: string, title: string) => void;
}

export function DocumentViewer({
  selectedDocument,
  loading,
  onDownloadDocument,
  onDownloadPDF,
}: DocumentViewerProps) {
  const getDocumentMetadata = (title: string) => {
    const standardDoc = availableDocuments.find(d => d.title === title);
    const atsDoc = atsDocuments.find(d => d.title === title);
    return standardDoc || atsDoc;
  };

  const metadata = selectedDocument ? getDocumentMetadata(selectedDocument.title) : null;
  const wordCount = selectedDocument ? selectedDocument.content.split(/\s+/).length : 0;

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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <Star className="h-4 w-4 text-red-500" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <BookOpen className="h-4 w-4 text-green-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleDownload = () => {
    const originalDoc = availableDocuments.find(d => d.title === selectedDocument?.title);
    if (originalDoc) {
      onDownloadDocument(originalDoc.filePath, selectedDocument!.title);
    } else {
      const atsDoc = atsDocuments.find(d => d.title === selectedDocument?.title);
      if (atsDoc) {
        onDownloadDocument(`ats-${atsDoc.id}`, selectedDocument!.title);
      }
    }
  };

  const handleDownloadPDF = () => {
    if (!onDownloadPDF || !selectedDocument) return;
    
    const originalDoc = availableDocuments.find(d => d.title === selectedDocument.title);
    if (originalDoc) {
      onDownloadPDF(originalDoc.filePath, selectedDocument.title);
    } else {
      const atsDoc = atsDocuments.find(d => d.title === selectedDocument.title);
      if (atsDoc) {
        onDownloadPDF(`ats-${atsDoc.id}`, selectedDocument.title);
      }
    }
  };

  return (
    <Card className="h-full border-0 bg-transparent">
      <CardHeader className="border-b border-slate-200/50 bg-white/60 backdrop-blur-sm">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-white" />
          </div>
          Document Viewer
        </CardTitle>
        <CardDescription>
          {selectedDocument ? selectedDocument.title : 'Select a document from the browser to view its content'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="text-slate-500">Loading document...</div>
            </div>
          </div>
        ) : selectedDocument ? (
          <div className="h-full">
            {/* Enhanced Document Header */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-slate-200/50 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    {getCategoryIcon(selectedDocument.category)}
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(selectedDocument.priority)}
                      <Badge variant="outline" className="border-slate-300">
                        {selectedDocument.category}
                      </Badge>
                      <Badge variant="secondary">
                        {selectedDocument.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                    {selectedDocument.title}
                  </h1>
                  
                  <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                    {selectedDocument.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Updated {new Date(selectedDocument.lastModified).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{wordCount.toLocaleString()} words</span>
                    </div>
                    {metadata?.estimatedReadTime && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{metadata.estimatedReadTime}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Document metadata badges */}
                  {metadata && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {metadata.difficulty && (
                        <Badge variant="outline" className="text-xs border-slate-300">
                          {metadata.difficulty}
                        </Badge>
                      )}
                      {metadata.type && (
                        <Badge variant="secondary" className="text-xs">
                          {metadata.type}
                        </Badge>
                      )}
                      {metadata.version && (
                        <Badge variant="outline" className="text-xs border-slate-300">
                          v{metadata.version}
                        </Badge>
                      )}
                      {metadata.tags?.slice(0, 5).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-slate-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-300 hover:bg-slate-50"
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    Bookmark
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-300 hover:bg-slate-50"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  {onDownloadPDF && (
                    <Button
                      onClick={handleDownloadPDF}
                      variant="outline"
                      size="sm"
                      className="border-blue-300 hover:bg-blue-50 text-blue-700"
                      title="Download as PDF"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  )}
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    className="border-slate-300 hover:bg-slate-50"
                    title="Download as Markdown"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    MD
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Document Content */}
            <div className="p-8 max-w-4xl mx-auto bg-white/40 backdrop-blur-sm">
              <div className="prose prose-slate max-w-none">
                <MarkdownRenderer 
                  content={selectedDocument.content}
                  className="leading-relaxed"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white/40 backdrop-blur-sm">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">No Document Selected</h3>
              <p className="text-slate-600 leading-relaxed">
                Choose a document from the browser tab to view its content here. You can search, filter, and explore our comprehensive documentation library.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
