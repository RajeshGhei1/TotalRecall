import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  FileDown, 
  TestTube, 
  Search, 
  Filter, 
  Grid, 
  List, 
  BookOpen, 
  Clock, 
  Star, 
  TrendingUp,
  Zap,
  Shield,
  Users,
  Code,
  Database,
  Globe,
  Settings,
  BarChart3,
  Activity,
  RefreshCw,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DocumentationSidebar } from '@/components/documentation/DocumentationSidebar';
import { DocumentationFilters } from '@/components/documentation/DocumentationFilters';
import { DocumentGrid } from '@/components/documentation/DocumentGrid';
import { DocumentViewer } from '@/components/documentation/DocumentViewer';
import { RealTimeDocumentationStatus } from '@/components/documentation/RealTimeDocumentationStatus';
import { LiveDocumentationPanel } from '@/components/documentation/LiveDocumentationPanel';
import { useDocumentation } from '@/hooks/documentation/useDocumentation';
import { getAllIntegratedDocuments } from '@/utils/documentTransformer';
import { testPDFExport } from '@/utils/documentExport';

export default function Documentation() {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingMD, setIsExportingMD] = useState(false);
  const [isTestingPDF, setIsTestingPDF] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const {
    selectedDocument,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority,
    selectedType,
    setSelectedType,
    selectedDifficulty,
    setSelectedDifficulty,
    filteredDocuments,
    loadDocument,
    downloadDocument,
    downloadAllDocuments,
    downloadDocumentAsPDF,
    downloadAllDocumentsAsPDF,
  } = useDocumentation();

  const allDocuments = getAllIntegratedDocuments();

  // Check if any filters are active
  const hasActiveFilters = selectedCategory !== 'all' || 
    selectedPriority !== 'all' || 
    selectedType !== 'all' || 
    selectedDifficulty !== 'all';

  const handleExportAllPDF = async () => {
    setIsExportingPDF(true);
    try {
      await downloadAllDocumentsAsPDF();
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportAllMD = async () => {
    setIsExportingMD(true);
    try {
      await downloadAllDocuments();
    } finally {
      setIsExportingMD(false);
    }
  };

  const handleTestPDF = async () => {
    setIsTestingPDF(true);
    try {
      const success = await testPDFExport();
      if (success) {
        alert('Test PDF generated successfully! Check your downloads.');
      } else {
        alert('Test PDF generation failed. Check console for details.');
      }
    } finally {
      setIsTestingPDF(false);
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <DocumentationSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 xl:ml-72 2xl:ml-80">
        {/* Real-Time Documentation Status at the top */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <RealTimeDocumentationStatus />
        </div>
        {/* Enhanced Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Documentation Center</h1>
                <p className="text-gray-600">Total Recall Enterprise Knowledge Base</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleTestPDF}
                variant="outline" 
                size="sm"
                disabled={isTestingPDF}
                className="border-gray-300 hover:bg-gray-50"
              >
                <TestTube className="h-4 w-4 mr-2" />
                {isTestingPDF ? 'Testing...' : 'Test PDF'}
              </Button>
              <Button 
                onClick={handleExportAllPDF} 
                variant="outline" 
                className="border-blue-300 hover:bg-blue-50 text-blue-700"
                disabled={isExportingPDF}
              >
                <FileDown className="h-4 w-4 mr-2" />
                {isExportingPDF ? 'Generating PDF...' : 'Export All PDF'}
              </Button>
              <Button 
                onClick={handleExportAllMD} 
                className="bg-blue-600 hover:bg-blue-700 text-white shadow"
                disabled={isExportingMD}
              >
                <Download className="h-4 w-4 mr-2" />
                {isExportingMD ? 'Exporting...' : `Export All MD (${allDocuments.length})`}
              </Button>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documentation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-300 hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 text-xs">3</Badge>
                )}
              </Button>
              
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none border-0 h-9 px-3"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none border-0 h-9 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {filteredDocuments.length} of {allDocuments.length} documents
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Real-time updates enabled
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                AI-powered search
              </span>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <DocumentationFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPriority={selectedPriority}
              setSelectedPriority={setSelectedPriority}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
            />
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 bg-white p-6">
          {viewMode === 'grid' ? (
            <DocumentGrid
              filteredDocuments={filteredDocuments}
              onDownloadDocument={downloadDocument}
              onDownloadPDF={downloadDocumentAsPDF}
            />
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <Card 
                  key={doc.filePath} 
                  className="cursor-pointer hover:shadow-md transition-all duration-200 border-gray-200 hover:border-blue-300 group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <CardTitle className="text-base group-hover:text-blue-600 transition-colors">
                            {doc.title}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-sm text-gray-600 line-clamp-2">
                          {doc.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs border-gray-300">
                          {doc.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {doc.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{doc.estimatedReadTime}</span>
                        <span>•</span>
                        <span>Updated {doc.lastModified}</span>
                        {doc.version && (
                          <>
                            <span>•</span>
                            <span>v{doc.version}</span>
                          </>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadDocumentAsPDF(doc.filePath, doc.title);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadDocument(doc.filePath, doc.title);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
