
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
  BarChart3
} from 'lucide-react';

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  category: 'architecture' | 'security' | 'development' | 'api' | 'enterprise' | 'collaboration' | 'operations' | 'compliance';
  filePath: string;
  lastModified: string;
  size: string;
  tags: string[];
  status: 'published' | 'draft' | 'outdated';
  importance: 'critical' | 'high' | 'medium' | 'low';
}

const documentCategories = {
  architecture: { label: 'Architecture', icon: Code, color: 'bg-blue-100 text-blue-800' },
  security: { label: 'Security', icon: Shield, color: 'bg-red-100 text-red-800' },
  development: { label: 'Development', icon: FileText, color: 'bg-green-100 text-green-800' },
  api: { label: 'API Reference', icon: BookOpen, color: 'bg-purple-100 text-purple-800' },
  enterprise: { label: 'Enterprise', icon: Settings, color: 'bg-orange-100 text-orange-800' },
  collaboration: { label: 'Collaboration', icon: ExternalLink, color: 'bg-teal-100 text-teal-800' },
  operations: { label: 'Operations', icon: BarChart3, color: 'bg-indigo-100 text-indigo-800' },
  compliance: { label: 'Compliance', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-800' }
};

const mockDocuments: DocumentItem[] = [
  {
    id: '1',
    title: 'AI Roadmap - Enterprise Implementation',
    description: 'Comprehensive 18-month AI strategy with $2.3M investment plan and detailed implementation phases',
    category: 'architecture',
    filePath: 'docs/AI_ROADMAP.md',
    lastModified: '2024-12-11T10:30:00Z',
    size: '125.8 KB',
    tags: ['AI', 'strategy', 'roadmap', 'enterprise', 'investment'],
    status: 'published',
    importance: 'critical'
  },
  {
    id: '2',
    title: 'API Reference - Enterprise Edition',
    description: 'Complete enterprise API documentation with 500+ endpoints, authentication, and integration guides',
    category: 'api',
    filePath: 'docs/API_REFERENCE.md',
    lastModified: '2024-12-10T15:45:00Z',
    size: '187.3 KB',
    tags: ['API', 'endpoints', 'authentication', 'integration', 'enterprise'],
    status: 'published',
    importance: 'critical'
  },
  {
    id: '3',
    title: 'Enterprise System Architecture',
    description: 'Comprehensive system architecture supporting 100,000+ users with 99.99% availability',
    category: 'architecture',
    filePath: 'docs/ARCHITECTURE.md',
    lastModified: '2024-12-09T09:20:00Z',
    size: '156.7 KB',
    tags: ['architecture', 'scalability', 'microservices', 'kubernetes', 'AWS'],
    status: 'published',
    importance: 'critical'
  },
  {
    id: '4',
    title: 'Enterprise Security Framework',
    description: 'Comprehensive security framework with zero-trust architecture and SOC 2 Type II compliance',
    category: 'security',
    filePath: 'docs/SECURITY.md',
    lastModified: '2024-12-08T14:15:00Z',
    size: '143.2 KB',
    tags: ['security', 'zero-trust', 'compliance', 'SOC2', 'ISO27001'],
    status: 'published',
    importance: 'critical'
  },
  {
    id: '5',
    title: 'Development Guide & Standards',
    description: 'Comprehensive development standards with TypeScript, testing frameworks, and CI/CD pipelines',
    category: 'development',
    filePath: 'docs/DEVELOPMENT.md',
    lastModified: '2024-12-07T11:30:00Z',
    size: '98.4 KB',
    tags: ['development', 'typescript', 'testing', 'ci-cd', 'standards'],
    status: 'published',
    importance: 'high'
  },
  {
    id: '6',
    title: 'Enterprise Features Specification',
    description: 'Complete enterprise feature documentation with real-time collaboration and advanced analytics',
    category: 'enterprise',
    filePath: 'docs/ENTERPRISE_FEATURES.md',
    lastModified: '2024-12-06T16:45:00Z',
    size: '89.1 KB',
    tags: ['enterprise', 'features', 'collaboration', 'analytics', 'multi-tenant'],
    status: 'published',
    importance: 'high'
  },
  {
    id: '7',
    title: 'Collaboration Guidelines',
    description: 'Team collaboration practices with real-time editing and version control workflows',
    category: 'collaboration',
    filePath: 'docs/COLLABORATION.md',
    lastModified: '2024-12-05T13:20:00Z',
    size: '34.6 KB',
    tags: ['collaboration', 'workflow', 'version-control', 'team'],
    status: 'published',
    importance: 'medium'
  },
  {
    id: '8',
    title: 'Database Schema Documentation',
    description: 'Complete database schema with relationships, indexing strategies, and performance optimization',
    category: 'development',
    filePath: 'docs/DATABASE_SCHEMA.md',
    lastModified: '2024-12-04T10:15:00Z',
    size: '67.3 KB',
    tags: ['database', 'schema', 'postgresql', 'performance', 'optimization'],
    status: 'published',
    importance: 'high'
  },
  {
    id: '9',
    title: 'Disaster Recovery Plan',
    description: 'Comprehensive disaster recovery procedures with <1 hour RTO and <15 minutes RPO',
    category: 'operations',
    filePath: 'docs/DISASTER_RECOVERY.md',
    lastModified: '2024-12-03T16:30:00Z',
    size: '112.8 KB',
    tags: ['disaster-recovery', 'business-continuity', 'RTO', 'RPO', 'operations'],
    status: 'published',
    importance: 'critical'
  },
  {
    id: '10',
    title: 'Compliance & Audit Framework',
    description: 'Complete compliance program with SOC 2, ISO 27001, GDPR, and HIPAA readiness',
    category: 'compliance',
    filePath: 'docs/COMPLIANCE_AUDIT.md',
    lastModified: '2024-12-02T14:45:00Z',
    size: '134.5 KB',
    tags: ['compliance', 'audit', 'SOC2', 'GDPR', 'HIPAA', 'ISO27001'],
    status: 'published',
    importance: 'critical'
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
    return mockDocuments.filter(doc => {
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
      case 'draft': return 'secondary';
      case 'outdated': return 'destructive';
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
        description: "All documents are being downloaded as a single file."
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
          <h1 className="text-2xl font-bold">Enterprise Documentation Center</h1>
          <p className="text-muted-foreground">
            Comprehensive technical documentation and enterprise standards
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
              <CardTitle>Search & Filter Documents</CardTitle>
              <CardDescription>
                Filter by category, importance level, or search across all content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title, description, or tags..."
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
                      All Categories ({mockDocuments.length})
                    </Button>
                    {Object.entries(documentCategories).map(([key, category]) => {
                      const count = mockDocuments.filter(doc => doc.category === key).length;
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
                    const count = mockDocuments.filter(doc => doc.importance === level).length;
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
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading document...</span>
                  </div>
                ) : documentContent ? (
                  <MarkdownRenderer content={documentContent.content} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Failed to load document content.
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
