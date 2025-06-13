
import React from 'react';
import { FileText, Download, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import type { DocumentContent } from '@/services/documentService';
import { availableDocuments } from '@/data/documentationData';
import { atsDocuments } from '@/data/atsDocumentation';

interface DocumentViewerProps {
  selectedDocument: DocumentContent | null;
  loading: boolean;
  onDownloadDocument: (filePath: string, title: string) => void;
}

export function DocumentViewer({
  selectedDocument,
  loading,
  onDownloadDocument,
}: DocumentViewerProps) {
  const getDocumentMetadata = (title: string) => {
    // Check both standard and ATS documents for metadata
    const standardDoc = availableDocuments.find(d => d.title === title);
    const atsDoc = atsDocuments.find(d => d.title === title);
    return standardDoc || atsDoc;
  };

  const metadata = selectedDocument ? getDocumentMetadata(selectedDocument.title) : null;

  return (
    <Card className="h-full">
      <CardHeader className="border-b bg-gray-50">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
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
              <div className="text-gray-500">Loading document...</div>
            </div>
          </div>
        ) : selectedDocument ? (
          <div className="h-full">
            {/* Document Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                    {selectedDocument.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Updated {new Date(selectedDocument.lastModified).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{selectedDocument.wordCount.toLocaleString()} words</span>
                    </div>
                    {metadata?.estimatedReadTime && (
                      <div className="flex items-center gap-1">
                        <span>📖 {metadata.estimatedReadTime}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Document metadata badges */}
                  {metadata && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {metadata.difficulty && (
                        <Badge variant="outline" className="text-xs">
                          {metadata.difficulty}
                        </Badge>
                      )}
                      {metadata.type && (
                        <Badge variant="secondary" className="text-xs">
                          {metadata.type}
                        </Badge>
                      )}
                      {metadata.version && (
                        <Badge variant="outline" className="text-xs">
                          v{metadata.version}
                        </Badge>
                      )}
                      {metadata.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => {
                    const originalDoc = availableDocuments.find(d => d.title === selectedDocument.title);
                    if (originalDoc) {
                      onDownloadDocument(originalDoc.filePath, selectedDocument.title);
                    } else {
                      // Handle ATS documents
                      const atsDoc = atsDocuments.find(d => d.title === selectedDocument.title);
                      if (atsDoc) {
                        onDownloadDocument(`ats-${atsDoc.id}`, selectedDocument.title);
                      }
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            
            {/* Document Content */}
            <div className="p-8 max-w-4xl mx-auto">
              <MarkdownRenderer 
                content={selectedDocument.content}
                className="leading-relaxed"
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Document Selected</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose a document from the browser tab to view its content here. You can search, filter, and explore our comprehensive documentation library.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
