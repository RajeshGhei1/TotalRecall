import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { documentService, DocumentContent } from '@/services/documentService';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Search, 
  FileText, 
  Shield, 
  Code, 
  Settings, 
  Download,
  ExternalLink,
  Clock,
  Tag,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Zap
} from 'lucide-react';

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  category: 'architecture' | 'security' | 'development' | 'api' | 'enterprise' | 'collaboration' | 'operations' | 'compliance' | 'ai';
  filePath: string;
  lastModified: string;
  size: string;
  tags: string[];
  status: 'published' | 'draft' | 'updated';
  importance: 'critical' | 'high' | 'medium' | 'low';
}

const documentCategories = {
  ai: { label: 'AI & Intelligence', icon: Zap, color: 'bg-yellow-100 text-yellow-800' },
  architecture: { label: 'Architecture', icon: Code, color: 'bg-blue-100 text-blue-800' },
  security: { label: 'Security', icon: Shield, color: 'bg-red-100 text-red-800' },
  development: { label: 'Development', icon: FileText, color: 'bg-green-100 text-green-800' },
  api: { label: 'API Reference', icon: BookOpen, color: 'bg-purple-100 text-purple-800' },
  enterprise: { label: 'Enterprise', icon: Settings, color: 'bg-orange-100 text-orange-800' },
  collaboration: { label: 'Collaboration', icon: ExternalLink, color: 'bg-teal-100 text-teal-800' },
  operations: { label: 'Operations', icon: BarChart3, color: 'bg-indigo-100 text-indigo-800' },
  compliance: { label: 'Compliance', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-800' }
};

const totalRecallDocuments: DocumentItem[] = [
  {
    id: '1',
    title: 'AI Implementation Roadmap',
    description: 'Comprehensive AI strategy with current infrastructure status, implementation phases, and business impact projections',
    category: 'ai',
    filePath: 'docs/AI_ROADMAP.md',
    lastModified: new Date().toISOString(),
    size: '95.2 KB',
    tags: ['AI', 'strategy', 'roadmap', 'implementation', 'cognitive-assistance'],
    status: 'updated',
    importance: 'critical'
  },
  {
    id: '2',
    title: 'API Reference Guide',
    description: 'Complete API documentation for Total Recall\'s Supabase-based backend with real endpoints and authentication',
    category: 'api',
    filePath: 'docs/API_REFERENCE.md',
    lastModified: new Date().toISOString(),
    size: '142.7 KB',
    tags: ['API', 'endpoints', 'supabase', 'authentication', 'real-time'],
    status: 'updated',
    importance: 'critical'
  },
  {
    id: '3',
    title: 'System Architecture Overview',
    description: 'Total Recall\'s React + TypeScript + Supabase architecture with multi-tenant design and AI integration',
    category: 'architecture',
    filePath: 'docs/ARCHITECTURE.md',
    lastModified: new Date().toISOString(),
    size: '118.5 KB',
    tags: ['architecture', 'react', 'supabase', 'multi-tenant', 'real-time'],
    status: 'updated',
    importance: 'critical'
  },
  {
    id: '4',
    title: 'Enterprise Security Framework',
    description: 'Comprehensive security implementation with RLS policies, tenant isolation, and compliance features',
    category: 'security',
    filePath: 'docs/SECURITY.md',
    lastModified: new Date().toISOString(),
    size: '156.8 KB',
    tags: ['security', 'RLS', 'compliance', 'encryption', 'audit-logging'],
    status: 'updated',
    importance: 'critical'
  },
  {
    id: '5',
    title: 'Enterprise Features Specification',
    description: 'Complete enterprise feature documentation including real-time collaboration, version control, and advanced workflows',
    category: 'enterprise',
    filePath: 'docs/ENTERPRISE_FEATURES.md',
    lastModified: new Date().toISOString(),
    size: '134.3 KB',
    tags: ['enterprise', 'collaboration', 'version-control', 'workflows', 'multi-tenant'],
    status: 'updated',
    importance: 'high'
  },
  {
    id: '6',
    title: 'Module Specifications',
    description: 'Detailed specifications for all Total Recall modules including People Management, Forms, ATS, and AI components',
    category: 'development',
    filePath: 'docs/MODULE_SPECIFICATIONS.md',
    lastModified: new Date().toISOString(),
    size: '167.9 KB',
    tags: ['modules', 'specifications', 'people-management', 'forms', 'ATS'],
    status: 'updated',
    importance: 'high'
  }
];

const Documentation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImportance, setSelectedImportance] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [documentContent, setDocumentContent] = useState<DocumentContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const filteredDocuments = useMemo(() => {
    return totalRecallDocuments.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      const matchesImportance = selectedImportance === 'all' || doc.importance === selectedImportance;
      
      return matchesSearch && matchesCategory && matchesImportance;
    });
  }, [searchTerm, selectedCategory, selectedImportance]);

  const documentsByCategory = useMemo(() => {
    const grouped = filteredDocuments.reduce((acc, doc) => {
      if (!acc[doc.category]) {
        acc[doc.category] = [];
      }
      acc[doc.category].push(doc);
      return acc;
    }, {} as Record<string, DocumentItem[]>);
    
    return grouped;
  }, [filteredDocuments]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'updated': return 'secondary';
      case 'draft': return 'outline';
      default: return 'outline';
    }
  };

  const getImportanceBadgeVariant = (importance: string) => {
    switch (importance) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'critical': return <AlertTriangle className="h-3 w-3" />;
      case 'high': return <ExternalLink className="h-3 w-3" />;
      case 'medium': return <FileText className="h-3 w-3" />;
      case 'low': return <CheckCircle className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const handleDocumentSelect = async (doc: DocumentItem) => {
    setSelectedDocument(doc);
    setIsLoading(true);
    setDocumentContent(null);

    try {
      const content = await documentService.loadDocument(doc.filePath);
      setDocumentContent(content);
    } catch (error) {
      toast({
        title: "Error loading document",
        description: "Failed to load the document content. Please try again.",
        variant: "destructive"
      });
      console.error('Error loading document:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadDocument = async (doc: DocumentItem) => {
    setIsDownloading(true);
    try {
      await documentService.downloadDocument(doc.filePath, `${doc.title}.md`);
      toast({
        title: "Download started",
        description: `${doc.title} is being downloaded.`
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the document. Please try again.",
        variant: "destructive"
      });
      console.error('Error downloading document:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    try {
      await documentService.downloadAllDocuments(
        filteredDocuments.map(doc => ({
          filePath: doc.filePath,
          title: doc.title
        }))
      );
      toast({
        title: "Download started",
        description: "All Total Recall documentation is being downloaded as a single file."
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download all documents. Please try again.",
        variant: "destructive"
      });
      console.error('Error downloading all documents:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Total Recall Documentation Center</h1>
          <p className="text-muted-foreground">
            Comprehensive technical documentation for Total Recall's enterprise platform
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownloadAll}
            disabled={isDownloading || filteredDocuments.length === 0}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export All ({filteredDocuments.length})
          </Button>
        </div>
      </div>

      <Tabs value={selectedDocument ? 'viewer' : 'browser'} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browser" onClick={() => setSelectedDocument(null)}>
            Document Browser
          </TabsTrigger>
          <TabsTrigger value="viewer" disabled={!selectedDocument}>
            Document Viewer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browser" className="space-y-6">
          {/* Enhanced Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter Documentation</CardTitle>
              <CardDescription>
                Browse Total Recall's comprehensive technical documentation and implementation guides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documentation by title, description, or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory('all')}
                    >
                      All Categories ({totalRecallDocuments.length})
                    </Button>
                    {Object.entries(documentCategories).map(([key, category]) => {
                      const count = totalRecallDocuments.filter(doc => doc.category === key).length;
                      return (
                        <Button
                          key={key}
                          variant={selectedCategory === key ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedCategory(key)}
                        >
                          <category.icon className="h-4 w-4 mr-1" />
                          {category.label} ({count})
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedImportance === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedImportance('all')}
                  >
                    All Levels
                  </Button>
                  {['critical', 'high', 'medium', 'low'].map((level) => {
                    const count = totalRecallDocuments.filter(doc => doc.importance === level).length;
                    return (
                      <Button
                        key={level}
                        variant={selectedImportance === level ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedImportance(level)}
                      >
                        {getImportanceIcon(level)}
                        <span className="ml-1 capitalize">{level} ({count})</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Grid */}
          <div className="space-y-6">
            {Object.entries(documentsByCategory).map(([categoryKey, documents]) => {
              const category = documentCategories[categoryKey as keyof typeof documentCategories];
              if (!category || documents.length === 0) return null;

              return (
                <div key={categoryKey} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <category.icon className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">{category.label}</h2>
                    <Badge variant="outline">{documents.length}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc) => (
                      <Card 
                        key={doc.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col"
                      >
                        <CardHeader className="flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <CardTitle className="text-base line-clamp-2">{doc.title}</CardTitle>
                            <div className="flex gap-1 ml-2 flex-shrink-0">
                              <Badge variant={getImportanceBadgeVariant(doc.importance)} className="text-xs">
                                {getImportanceIcon(doc.importance)}
                                <span className="ml-1 capitalize">{doc.importance}</span>
                              </Badge>
                              <Badge variant={getStatusBadgeVariant(doc.status)} className="text-xs">
                                {doc.status}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription className="text-sm line-clamp-3">
                            {doc.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {formatDate(doc.lastModified)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              {doc.size}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {doc.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                              {doc.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{doc.tags.length - 3} more
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleDocumentSelect(doc)}
                              >
                                <BookOpen className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDownloadDocument(doc)}
                                disabled={isDownloading}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
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

          {filteredDocuments.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No documents found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms, category, or importance level filters
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="viewer" className="space-y-6">
          {selectedDocument && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedDocument(null)}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Browser
                      </Button>
                    </div>
                    <CardTitle className="text-xl">{selectedDocument.title}</CardTitle>
                    <CardDescription className="mt-2">{selectedDocument.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadDocument(selectedDocument)}
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Download
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <span>Last modified: {formatDate(selectedDocument.lastModified)}</span>
                  <span>Size: {selectedDocument.size}</span>
                  <Badge variant={getImportanceBadgeVariant(selectedDocument.importance)}>
                    {getImportanceIcon(selectedDocument.importance)}
                    <span className="ml-1 capitalize">{selectedDocument.importance}</span>
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(selectedDocument.status)}>
                    {selectedDocument.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mr-2" />
                    <span>Loading document...</span>
                  </div>
                ) : documentContent ? (
                  <div className="prose prose-sm max-w-none">
                    <MarkdownRenderer content={documentContent.content} />
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Select a document to view its content
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
