
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Download, 
  Star, 
  Filter,
  Package,
  Verified,
  Trending
} from 'lucide-react';

interface MarketplaceModule {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: string;
  downloads: number;
  rating: number;
  price: number;
  isPremium: boolean;
  isVerified: boolean;
  isTrending: boolean;
  tags: string[];
  screenshots: string[];
}

const mockModules: MarketplaceModule[] = [
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics Suite',
    description: 'Comprehensive analytics dashboard with AI-powered insights and predictive modeling',
    version: '2.1.0',
    author: 'Analytics Pro',
    category: 'analytics',
    downloads: 15420,
    rating: 4.8,
    price: 0,
    isPremium: false,
    isVerified: true,
    isTrending: true,
    tags: ['analytics', 'ai', 'dashboard'],
    screenshots: []
  },
  {
    id: 'crm-integration',
    name: 'CRM Integration Hub',
    description: 'Connect with popular CRM systems including Salesforce, HubSpot, and Pipedrive',
    version: '1.5.2',
    author: 'Integration Solutions',
    category: 'integration',
    downloads: 8932,
    rating: 4.6,
    price: 29.99,
    isPremium: true,
    isVerified: true,
    isTrending: false,
    tags: ['crm', 'integration', 'sales'],
    screenshots: []
  },
  {
    id: 'social-media-manager',
    name: 'Social Media Manager',
    description: 'Schedule, publish, and analyze social media content across multiple platforms',
    version: '3.0.1',
    author: 'Social Tools Inc',
    category: 'marketing',
    downloads: 12876,
    rating: 4.4,
    price: 19.99,
    isPremium: true,
    isVerified: false,
    isTrending: true,
    tags: ['social', 'marketing', 'automation'],
    screenshots: []
  }
];

const ModuleMarketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('browse');

  const categories = ['all', 'analytics', 'integration', 'marketing', 'ai', 'workflow'];

  const filteredModules = mockModules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = (moduleId: string) => {
    console.log(`Installing module: ${moduleId}`);
    // TODO: Implement actual module installation
  };

  const renderModuleCard = (module: MarketplaceModule) => (
    <Card key={module.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{module.name}</CardTitle>
              {module.isVerified && (
                <Verified className="h-4 w-4 text-blue-500" />
              )}
              {module.isTrending && (
                <Badge variant="secondary" className="text-xs">
                  <Trending className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
            <CardDescription className="text-sm text-gray-600">
              by {module.author} • v{module.version}
            </CardDescription>
          </div>
          <div className="text-right">
            {module.isPremium ? (
              <div className="text-lg font-bold text-green-600">
                ${module.price}
              </div>
            ) : (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Free
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-4">{module.description}</p>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {module.rating}
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            {module.downloads.toLocaleString()}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {module.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => handleInstall(module.id)}
            className="flex-1"
          >
            <Package className="h-4 w-4 mr-2" />
            Install
          </Button>
          <Button variant="outline" size="sm">
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Module Marketplace</h2>
          <p className="text-gray-600 mt-1">
            Discover and install modules to extend your platform capabilities
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="installed">Installed</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Module Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map(renderModuleCard)}
          </div>

          {filteredModules.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or category filter
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="installed">
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No installed modules</h3>
            <p className="text-gray-600">
              Modules you install will appear here
            </p>
          </div>
        </TabsContent>

        <TabsContent value="updates">
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No updates available</h3>
            <p className="text-gray-600">
              All your modules are up to date
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModuleMarketplace;
