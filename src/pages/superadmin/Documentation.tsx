
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentationSidebar } from '@/components/documentation/DocumentationSidebar';
import { DocumentationFilters } from '@/components/documentation/DocumentationFilters';
import { DocumentGrid } from '@/components/documentation/DocumentGrid';
import { DocumentViewer } from '@/components/documentation/DocumentViewer';
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
              <p className="text-gray-600">Current system documentation and implementation guides (Updated June 2025)</p>
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browser">Document Browser</TabsTrigger>
              <TabsTrigger value="viewer">Document Viewer</TabsTrigger>
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
          </Tabs>
        </div>
      </div>
    </div>
  );
}
