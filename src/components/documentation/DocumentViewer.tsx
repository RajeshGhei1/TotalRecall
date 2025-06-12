
import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DocumentContent } from '@/services/documentService';
import { availableDocuments } from '@/data/documentationData';

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Viewer</CardTitle>
        <CardDescription>
          {selectedDocument ? selectedDocument.title : 'Select a document from the browser to view its content'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading document...</div>
          </div>
        ) : selectedDocument ? (
          <div className="prose prose-gray max-w-none">
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    {selectedDocument.title}
                  </h2>
                  <div className="text-sm text-gray-600">
                    Last modified: {new Date(selectedDocument.lastModified).toLocaleDateString()} • 
                    {selectedDocument.wordCount} words
                  </div>
                </div>
                <Button
                  onClick={() => {
                    const originalDoc = availableDocuments.find(d => d.title === selectedDocument.title);
                    if (originalDoc) {
                      onDownloadDocument(originalDoc.filePath, selectedDocument.title);
                    }
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {selectedDocument.content}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Selected</h3>
            <p className="text-gray-600">
              Choose a document from the browser tab to view its content here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
