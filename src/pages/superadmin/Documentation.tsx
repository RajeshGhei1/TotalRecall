
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Tag
} from 'lucide-react';

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  category: 'architecture' | 'security' | 'development' | 'api' | 'enterprise' | 'collaboration';
  filePath: string;
  lastModified: string;
  size: string;
  tags: string[];
  status: 'published' | 'draft' | 'outdated';
}

const documentCategories = {
  architecture: { label: 'Architecture', icon: Code, color: 'bg-blue-100 text-blue-800' },
  security: { label: 'Security', icon: Shield, color: 'bg-red-100 text-red-800' },
  development: { label: 'Development', icon: FileText, color: 'bg-green-100 text-green-800' },
  api: { label: 'API Reference', icon: BookOpen, color: 'bg-purple-100 text-purple-800' },
  enterprise: { label: 'Enterprise', icon: Settings, color: 'bg-orange-100 text-orange-800' },
  collaboration: { label: 'Collaboration', icon: ExternalLink, color: 'bg-teal-100 text-teal-800' }
};

const mockDocuments: DocumentItem[] = [
  {
    id: '1',
    title: 'AI Roadmap',
    description: 'Comprehensive roadmap for AI feature development and implementation',
    category: 'architecture',
    filePath: 'docs/AI_ROADMAP.md',
    lastModified: '2024-12-11T10:30:00Z',
    size: '45.2 KB',
    tags: ['AI', 'roadmap', 'planning'],
    status: 'published'
  },
  {
    id: '2',
    title: 'API Reference',
    description: 'Complete API documentation and endpoint reference',
    category: 'api',
    filePath: 'docs/API_REFERENCE.md',
    lastModified: '2024-12-10T15:45:00Z',
    size: '78.5 KB',
    tags: ['API', 'endpoints', 'reference'],
    status: 'published'
  },
  {
    id: '3',
    title: 'Architecture Overview',
    description: 'System architecture, design patterns, and technical decisions',
    category: 'architecture',
    filePath: 'docs/ARCHITECTURE.md',
    lastModified: '2024-12-09T09:20:00Z',
    size: '62.1 KB',
    tags: ['architecture', 'design', 'patterns'],
    status: 'published'
  },
  {
    id: '4',
    title: 'Security Guidelines',
    description: 'Security best practices, policies, and implementation guidelines',
    category: 'security',
    filePath: 'docs/SECURITY.md',
    lastModified: '2024-12-08T14:15:00Z',
    size: '34.7 KB',
    tags: ['security', 'guidelines', 'best-practices'],
    status: 'published'
  },
  {
    id: '5',
    title: 'Development Setup',
    description: 'Development environment setup and coding standards',
    category: 'development',
    filePath: 'docs/DEVELOPMENT.md',
    lastModified: '2024-12-07T11:30:00Z',
    size: '28.9 KB',
    tags: ['development', 'setup', 'standards'],
    status: 'published'
  },
  {
    id: '6',
    title: 'Enterprise Features',
    description: 'Enterprise-level features and configuration options',
    category: 'enterprise',
    filePath: 'docs/ENTERPRISE_FEATURES.md',
    lastModified: '2024-12-06T16:45:00Z',
    size: '52.3 KB',
    tags: ['enterprise', 'features', 'configuration'],
    status: 'published'
  },
  {
    id: '7',
    title: 'Collaboration Guidelines',
    description: 'Team collaboration practices and workflow guidelines',
    category: 'collaboration',
    filePath: 'docs/COLLABORATION.md',
    lastModified: '2024-12-05T13:20:00Z',
    size: '19.8 KB',
    tags: ['collaboration', 'workflow', 'team'],
    status: 'published'
  },
  {
    id: '8',
    title: 'Database Schema',
    description: 'Complete database schema documentation and relationships',
    category: 'development',
    filePath: 'docs/DATABASE_SCHEMA.md',
    lastModified: '2024-12-04T10:15:00Z',
    size: '41.6 KB',
    tags: ['database', 'schema', 'relationships'],
    status: 'published'
  }
];

const Documentation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);

  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Documentation Center</h1>
          <p className="text-muted-foreground">
            Comprehensive documentation and technical references
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export All
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
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
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
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                  >
                    All Categories
                  </Button>
                  {Object.entries(documentCategories).map(([key, category]) => (
                    <Button
                      key={key}
                      variant={selectedCategory === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(key)}
                    >
                      <category.icon className="h-4 w-4 mr-1" />
                      {category.label}
                    </Button>
                  ))}
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
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedDocument(doc)}
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{doc.title}</CardTitle>
                            <Badge variant={getStatusBadgeVariant(doc.status)}>
                              {doc.status}
                            </Badge>
                          </div>
                          <CardDescription className="text-sm">
                            {doc.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
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
                              {doc.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
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
                  Try adjusting your search terms or category filters
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
                  <div>
                    <CardTitle className="text-xl">{selectedDocument.title}</CardTitle>
                    <CardDescription>{selectedDocument.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDocument(null)}
                    >
                      Back to Browser
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Last modified: {formatDate(selectedDocument.lastModified)}</span>
                  <span>Size: {selectedDocument.size}</span>
                  <Badge variant={getStatusBadgeVariant(selectedDocument.status)}>
                    {selectedDocument.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>File Path:</strong> {selectedDocument.filePath}
                    </p>
                    <p className="text-sm">
                      This is a preview of the document. In a real implementation, 
                      this would render the actual markdown content from the file.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
