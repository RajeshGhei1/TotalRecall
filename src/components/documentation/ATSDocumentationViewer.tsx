
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Tag, 
  Download,
  Filter,
  Star,
  Users,
  Code,
  Zap
} from 'lucide-react';
import { atsDocuments, ATSDocument } from '@/data/atsDocumentation';

interface ATSDocumentationViewerProps {
  className?: string;
}

export function ATSDocumentationViewer({ className }: ATSDocumentationViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<ATSDocument | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories = ['all', ...new Set(atsDocuments.map(doc => doc.category))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredDocuments = atsDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || doc.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <BookOpen className="h-4 w-4" />;
      case 'reference': return <Tag className="h-4 w-4" />;
      case 'tutorial': return <Users className="h-4 w-4" />;
      case 'api': return <Code className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const handleDownloadDocument = (documentItem: ATSDocument) => {
    const content = `# ${documentItem.title}\n\n${documentItem.content}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentItem.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    const allContent = atsDocuments.map(doc => 
      `# ${doc.title}\n\n${doc.content}\n\n---\n\n`
    ).join('');
    
    const blob = new Blob([allContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ats-complete-documentation.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ATS Documentation Center</h1>
          <p className="text-gray-600">Complete guide to using the Applicant Tracking System</p>
        </div>
        <Button onClick={handleDownloadAll} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download All ({atsDocuments.length} docs)
        </Button>
      </div>

      <Tabs defaultValue="browser" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browser">Browse Documentation</TabsTrigger>
          <TabsTrigger value="viewer">Document Viewer</TabsTrigger>
        </TabsList>

        <TabsContent value="browser" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filter Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search documentation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty === 'all' ? 'All Levels' : difficulty}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Showing {filteredDocuments.length} of {atsDocuments.length} documents
              </div>
            </CardContent>
          </Card>

          {/* Document Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((documentItem) => (
              <Card key={documentItem.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(documentItem.type)}
                      <CardTitle className="text-lg">{documentItem.title}</CardTitle>
                    </div>
                    <Badge className={getDifficultyColor(documentItem.difficulty)}>
                      {documentItem.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {documentItem.estimatedReadTime}
                      </span>
                      <span>v{documentItem.version}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {documentItem.content.substring(0, 150)}...
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {documentItem.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {documentItem.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{documentItem.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedDocument(documentItem)}
                        className="flex-1"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Read
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadDocument(documentItem)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No documents found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="viewer" className="space-y-6">
          {selectedDocument ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getTypeIcon(selectedDocument.type)}
                      {selectedDocument.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <Badge className={getDifficultyColor(selectedDocument.difficulty)}>
                        {selectedDocument.difficulty}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {selectedDocument.estimatedReadTime}
                      </span>
                      <span>Last updated: {selectedDocument.lastUpdated}</span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadDocument(selectedDocument)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-4">
                  {selectedDocument.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <MarkdownRenderer content={selectedDocument.content} />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a document to view</h3>
                  <p className="text-muted-foreground">
                    Choose a document from the browser tab to read its contents here.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
