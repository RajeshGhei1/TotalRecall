import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  Eye, 
  CheckCircle, 
  Zap, 
  Filter,
  Brain,
  Settings,
  Users,
  Building
} from 'lucide-react';
import { 
  getAllStandardFeatures, 
  getAllAICapabilities, 
  getFeaturesByCategory, 
  getFeatureLibraryStats,
  STANDARD_FEATURE_CATEGORIES,
  AI_CAPABILITIES
} from '@/services/moduleFeatureLibrary';
import { useSystemModules } from '@/hooks/useSystemModules';

const FeatureManagementDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get all modules to show usage statistics
  const { data: modules = [] } = useSystemModules(false);
  
  // Get feature library data
  const standardFeatures = getAllStandardFeatures();
  const aiCapabilityNames = getAllAICapabilities();
  const libraryStats = getFeatureLibraryStats();
  
  // Filter features based on search and category
  const filteredStandardFeatures = useMemo(() => {
    let features = standardFeatures;
    
    if (searchQuery) {
      features = features.filter(feature =>
        feature.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      features = getFeaturesByCategory(selectedCategory);
      if (searchQuery) {
        features = features.filter(feature =>
          feature.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    }
    
    return features;
  }, [standardFeatures, searchQuery, selectedCategory]);
  
  // Filter AI capabilities
  const filteredAICapabilities = useMemo(() => {
    let capabilities = AI_CAPABILITIES;
    
    if (searchQuery) {
      capabilities = capabilities.filter(capability =>
        capability.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        capability.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return capabilities;
  }, [searchQuery]);
  
  // Calculate usage statistics
  const usageStats = useMemo(() => {
    const featureUsage = new Map();
    const aiUsage = new Map();
    
    modules.forEach(module => {
      // Count features from ai_capabilities field (which contains both types)
      if (module.ai_capabilities) {
        module.ai_capabilities.forEach(item => {
          if (standardFeatures.includes(item)) {
            featureUsage.set(item, (featureUsage.get(item) || 0) + 1);
          } else if (aiCapabilityNames.includes(item)) {
            aiUsage.set(item, (aiUsage.get(item) || 0) + 1);
          }
        });
      }
    });
    
    return { featureUsage, aiUsage };
  }, [modules, standardFeatures, aiCapabilityNames]);

  // Get unique AI capability categories
  const aiCapabilityCategories = useMemo(() => {
    const categories = [...new Set(AI_CAPABILITIES.map(cap => cap.category))];
    return categories.map(category => ({
      name: category,
      count: AI_CAPABILITIES.filter(cap => cap.category === category).length
    }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Library Explorer</CardTitle>
          <CardDescription>
            Browse, search, and manage all {libraryStats.totalFeatures + libraryStats.totalAICapabilities} features and AI capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search features, AI capabilities, descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                {STANDARD_FEATURE_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.features.length})
                  </option>
                ))}
              </select>
              
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Feature
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="standard">Standard Features ({standardFeatures.length})</TabsTrigger>
          <TabsTrigger value="ai">AI Capabilities ({AI_CAPABILITIES.length})</TabsTrigger>
          <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feature Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Categories</CardTitle>
                <CardDescription>Distribution of features across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {STANDARD_FEATURE_CATEGORIES.map((category) => {
                    const percentage = Math.round((category.features.length / standardFeatures.length) * 100);
                    
                    return (
                      <div key={category.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{category.features.length}</Badge>
                          <span className="text-xs text-muted-foreground">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            {/* AI Capability Categories */}
            <Card>
              <CardHeader>
                <CardTitle>AI Capability Categories</CardTitle>
                <CardDescription>AI-powered features by domain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiCapabilityCategories.map((category, index) => {
                    const percentage = Math.round((category.count / AI_CAPABILITIES.length) * 100);
                    
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{category.count}</Badge>
                          <span className="text-xs text-muted-foreground">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Standard Features Tab */}
        <TabsContent value="standard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStandardFeatures.map((feature, index) => {
              // Find which category this feature belongs to
              const featureCategory = STANDARD_FEATURE_CATEGORIES.find(cat => 
                cat.features.includes(feature)
              );
              
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{feature}</CardTitle>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {featureCategory?.name || 'Other'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {featureCategory?.description || 'Standard feature functionality'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Used by {usageStats.featureUsage.get(feature) || 0} modules
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {filteredStandardFeatures.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No features found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* AI Capabilities Tab */}
        <TabsContent value="ai" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAICapabilities.map((capability, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      {capability.name}
                    </CardTitle>
                    <Badge variant="outline" className="ml-2 text-xs bg-blue-50">
                      {capability.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{capability.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Used by {usageStats.aiUsage.get(capability.name) || 0} modules
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredAICapabilities.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No AI capabilities found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search criteria
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Usage Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Used Features</CardTitle>
                <CardDescription>Standard features with highest adoption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(usageStats.featureUsage.entries())
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 10)
                    .map(([feature, count]) => (
                      <div key={feature} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{feature}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${Math.min((count / Math.max(modules.length, 1)) * 100, 100)}%` }}
                            />
                          </div>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      </div>
                    ))}
                  {usageStats.featureUsage.size === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No feature usage data available yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top AI Capabilities</CardTitle>
                <CardDescription>Most popular AI capabilities across modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(usageStats.aiUsage.entries())
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 10)
                    .map(([capability, count]) => (
                      <div key={capability} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{capability}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${Math.min((count / Math.max(modules.length, 1)) * 100, 100)}%` }}
                            />
                          </div>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      </div>
                    ))}
                  {usageStats.aiUsage.size === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No AI capability usage data available yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Module Usage Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Module Feature Distribution</CardTitle>
              <CardDescription>How features are distributed across all modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules.slice(0, 10).map((module) => (
                  <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{module.name}</h4>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">{module.ai_capabilities?.length || 0}</div>
                        <div className="text-xs text-muted-foreground">Total Features</div>
                      </div>
                      <Badge variant={module.maturity_status === 'production' ? 'default' : 'secondary'}>
                        {module.maturity_status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {modules.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No modules found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeatureManagementDashboard; 