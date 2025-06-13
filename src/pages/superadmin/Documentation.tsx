
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentationSidebar } from '@/components/documentation/DocumentationSidebar';
import { DocumentationFilters } from '@/components/documentation/DocumentationFilters';
import { DocumentGrid } from '@/components/documentation/DocumentGrid';
import { DocumentViewer } from '@/components/documentation/DocumentViewer';
import { RealTimeDocumentationStatus } from '@/components/documentation/RealTimeDocumentationStatus';
import { LiveDocumentationPanel } from '@/components/documentation/LiveDocumentationPanel';
import { useDocumentation } from '@/hooks/documentation/useDocumentation';
import { availableDocuments } from '@/data/documentationData';

export default function Documentation() {
  const {
    selectedDocument,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    filteredDocuments,
    loadDocument,
    downloadDocument,
    downloadAllDocuments,
  } = useDocumentation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <DocumentationSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Total Recall Documentation Center</h1>
              <p className="text-gray-600">Live system documentation with real-time updates (Updated June 2025)</p>
            </div>
            <Button onClick={downloadAllDocuments} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export All ({availableDocuments.length})
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <Tabs defaultValue="browser" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="browser">Document Browser</TabsTrigger>
              <TabsTrigger value="viewer">Document Viewer</TabsTrigger>
              <TabsTrigger value="realtime">Real-Time System</TabsTrigger>
              <TabsTrigger value="live">Live Panel</TabsTrigger>
            </TabsList>

            <TabsContent value="browser" className="space-y-6">
              <DocumentationFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedPriority={selectedPriority}
                setSelectedPriority={setSelectedPriority}
              />

              <DocumentGrid
                filteredDocuments={filteredDocuments}
                onLoadDocument={loadDocument}
                onDownloadDocument={downloadDocument}
              />
            </TabsContent>

            <TabsContent value="viewer">
              <DocumentViewer
                selectedDocument={selectedDocument}
                loading={loading}
                onDownloadDocument={downloadDocument}
              />
            </TabsContent>

            <TabsContent value="realtime" className="space-y-6">
              <RealTimeDocumentationStatus />
              <div className="text-sm text-muted-foreground bg-blue-50 p-4 rounded-lg">
                <strong>Real-Time Documentation System:</strong> This system automatically monitors code changes 
                and updates documentation in real-time. It tracks components, hooks, services, and API changes 
                to ensure documentation stays current with the codebase.
              </div>
            </TabsContent>

            <TabsContent value="live">
              <LiveDocumentationPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
