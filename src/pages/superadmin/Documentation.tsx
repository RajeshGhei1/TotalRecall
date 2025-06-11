import React, { useState } from 'react';
import { documentService, type DocumentContent } from '@/services/documentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Download, Search, FileText, Zap, Shield, Building, Code, Users } from 'lucide-react';
import { DocumentationSidebar } from '@/components/documentation/DocumentationSidebar';

interface DocumentCategory {
  id: string;
  label: string;
  count: number;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface PriorityLevel {
  id: string;
  label: string;
  count?: number;
}

const documentCategories = [
  { id: 'all', label: 'All Categories', count: 6 },
  { id: 'ai', label: 'AI & Intelligence', count: 1, icon: Zap },
  { id: 'architecture', label: 'Architecture', count: 1, icon: Code },
  { id: 'security', label: 'Security', count: 1, icon: Shield },
  { id: 'development', label: 'Development', count: 1, icon: FileText },
  { id: 'api', label: 'API Reference', count: 1, icon: Code },
  { id: 'enterprise', label: 'Enterprise', count: 1, icon: Building },
  { id: 'collaboration', label: 'Collaboration', count: 0, icon: Users },
  { id: 'operations', label: 'Operations', count: 0, icon: Building },
  { id: 'compliance', label: 'Compliance', count: 0, icon: Shield }
];

const priorityLevels = [
  { id: 'all', label: 'All Levels' },
  { id: 'critical', label: 'Critical', count: 4 },
  { id: 'high', label: 'High', count: 2 },
  { id: 'medium', label: 'Medium', count: 0 },
  { id: 'low', label: 'Low', count: 0 }
];

const availableDocuments = [
  {
    filePath: 'docs/AI_ROADMAP.md',
    title: 'AI Implementation Roadmap',
    description: 'Comprehensive AI strategy with current implementation status and planned enhancements',
    category: 'ai',
    priority: 'critical',
    tags: ['updated'],
    lastModified: '2024-01-15',
    estimatedReadTime: '8 min'
  },
  {
    filePath: 'docs/API_REFERENCE.md',
    title: 'Total Recall API Reference',
    description: 'Complete API documentation covering all endpoints, authentication, and real-time features',
    category: 'api',
    priority: 'critical',
    tags: ['essential'],
    lastModified: '2024-01-15',
    estimatedReadTime: '12 min'
  },
  {
    filePath: 'docs/ARCHITECTURE.md',
    title: 'System Architecture Overview',
    description: 'Detailed technical architecture including security, collaboration, and AI integration',
    category: 'architecture',
    priority: 'critical',
    tags: ['technical'],
    lastModified: '2024-01-15',
    estimatedReadTime: '10 min'
  },
  {
    filePath: 'docs/SECURITY.md',
    title: 'Security Framework',
    description: 'Enterprise security implementation with RLS policies, audit logging, and compliance',
    category: 'security',
    priority: 'critical',
    tags: ['compliance'],
    lastModified: '2024-01-15',
    estimatedReadTime: '15 min'
  },
  {
    filePath: 'docs/ENTERPRISE_FEATURES.md',
    title: 'Enterprise Features Guide',
    description: 'Comprehensive guide to enterprise capabilities including collaboration and version control',
    category: 'enterprise',
    priority: 'high',
    tags: ['features'],
    lastModified: '2024-01-15',
    estimatedReadTime: '12 min'
  },
  {
    filePath: 'docs/MODULE_SPECIFICATIONS.md',
    title: 'Module Specifications',
    description: 'Detailed specifications for all Total Recall modules and their integration patterns',
    category: 'development',
    priority: 'high',
    tags: ['technical'],
    lastModified: '2024-01-15',
    estimatedReadTime: '14 min'
  }
];

export default function Documentation() {
  const [selectedDocument, setSelectedDocument] = useState<DocumentContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const loadDocument = async (filePath: string) => {
    setLoading(true);
    try {
      const document = await documentService.loadDocument(filePath);
      setSelectedDocument(document);
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (filePath: string, title: string) => {
    try {
      const filename = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;
      await documentService.downloadDocument(filePath, filename);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const downloadAllDocuments = async () => {
    try {
      await documentService.downloadAllDocuments(availableDocuments);
    } catch (error) {
      console.error('Error downloading all documents:', error);
    }
  };

  const filteredDocuments = availableDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || doc.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

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
              <p className="text-gray-600">Comprehensive technical documentation for Total Recall's enterprise platform</p>
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
              {/* Search and Filter Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Search & Filter Documentation</CardTitle>
                  <CardDescription>
                    Browse Total Recall's comprehensive technical documentation and implementation guides
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search documentation by title, description, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Category Filters */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {documentCategories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category.id)}
                            className="flex items-center gap-2"
                          >
                            {Icon && <Icon className="h-4 w-4" />}
                            {category.label} ({category.count})
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Priority Filters */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700">Priority Level</h3>
                    <div className="flex flex-wrap gap-2">
                      {priorityLevels.map((priority) => (
                        <Button
                          key={priority.id}
                          variant={selectedPriority === priority.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedPriority(priority.id)}
                        >
                          {priority.label} {priority.count !== undefined && `(${priority.count})`}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Grid */}
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
                                  </div>
                                </div>
                                <CardDescription className="text-xs">
                                  {doc.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-wrap gap-1">
                                    {doc.tags.map((tag) => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => loadDocument(doc.filePath)}
                                    >
                                      View
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => downloadDocument(doc.filePath, doc.title)}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                  {doc.estimatedReadTime} • Updated {doc.lastModified}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </TabsContent>

            <TabsContent value="viewer">
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
                            onClick={() => downloadDocument('', selectedDocument.title)}
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
