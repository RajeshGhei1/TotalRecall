/**
 * UNIFIED FEATURE MANAGEMENT - CONSOLIDATED VERSION
 * Updated to use the new consolidated feature system without duplicates
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  Clock, 
  Zap, 
  TrendingUp, 
  Users, 
  Database,
  Mail,
  BarChart3,
  Megaphone,
  Kanban,
  FileText,
  Link,
  Filter,
  Search,
  Plus,
  Library,
  Code,
  Activity,
  Target
} from 'lucide-react';

// Updated imports for consolidated system
import { 
  CONSOLIDATED_FEATURE_CATEGORIES, 
  getConsolidatedFeatureStats, 
  getAllConsolidatedFeatures,
  getImplementedFeatures,
  getAIEnhancedFeatures,
  ConsolidatedFeature
} from '@/services/consolidatedFeatureLibrary';

import { toast } from '@/hooks/use-toast';
import { FeatureModuleAssignmentDialog } from './FeatureModuleAssignmentDialog';
import { StandardsCompliantFeature } from '@/types/standardsCompliantFeatures';
import FeatureDevelopmentLab from './FeatureDevelopmentLab';

const UnifiedFeatureManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedFeature, setSelectedFeature] = useState<ConsolidatedFeature | null>(null);
  const [developingFeatureId, setDevelopingFeatureId] = useState<string | null>(null);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [featureToAssign, setFeatureToAssign] = useState<StandardsCompliantFeature | null>(null);

  // Use consolidated feature system
  const stats = getConsolidatedFeatureStats();
  const allFeatures = getAllConsolidatedFeatures();
  const implementedFeatures = getImplementedFeatures();
  const aiEnhancedFeatures = getAIEnhancedFeatures();

  const filteredFeatures = allFeatures.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || feature.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || feature.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAssignToModule = (feature: ConsolidatedFeature) => {
    console.log('🔧 handleAssignToModule called for feature:', feature.name);
    const standardsFeature = convertToStandardsCompliantFeature(feature);
    console.log('📋 Converted feature:', standardsFeature);
    setFeatureToAssign(standardsFeature);
    setShowAssignmentDialog(true);
    console.log('🔲 Dialog state set to open');
  };

  const convertToStandardsCompliantFeature = (feature: ConsolidatedFeature): StandardsCompliantFeature => {
    return {
      feature_id: feature.id,
      name: feature.name,
      description: feature.description,
      version: '1.0.0',
      is_active: feature.status === 'implemented',
      input_schema: {
        type: 'object',
        properties: {
          entityType: { type: 'string' },
          context: { type: 'object' }
        }
      },
      output_schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          result: { type: 'object' }
        }
      },
      ui_component_path: `@/components/features/atomic/${feature.id.replace(/-/g, '')}Feature`,
      category: feature.category,
      tags: [feature.category, feature.complexity, feature.businessValue],
      created_by: 'system',
      updated_at: new Date().toISOString(),
      feature_config: {
        isolated: true,
        stateless: true,
        pluggable: true,
        hasAIEnhancement: feature.hasAIEnhancement
      },
      dependencies: [],
      requirements: []
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_development': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planned': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'core_infrastructure': <Zap className="h-4 w-4" />,
      'user_access_management': <Users className="h-4 w-4" />,
      'data_management': <Database className="h-4 w-4" />,
      'communication_engagement': <Mail className="h-4 w-4" />,
      'analytics_intelligence': <BarChart3 className="h-4 w-4" />,
      'sales_crm': <TrendingUp className="h-4 w-4" />,
      'marketing_campaigns': <Megaphone className="h-4 w-4" />,
      'project_workflow': <Kanban className="h-4 w-4" />,
      'forms_templates': <FileText className="h-4 w-4" />,
      'integration_api': <Link className="h-4 w-4" />,
      'collaboration': <Users className="h-4 w-4" />
    };
    return iconMap[categoryId] || <CheckCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header with consolidated stats */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feature Management</h1>
          <p className="text-gray-600 mt-1">
            Consolidated catalog: {stats.totalFeatures} unique features, {stats.aiEnhancedFeatures} AI-enhanced
          </p>
        </div>
        <div className="flex space-x-2">
          <Badge className="bg-green-100 text-green-800">
            {stats.implementedFeatures} Implemented
          </Badge>
          <Badge className="bg-blue-100 text-blue-800">
            {stats.plannedFeatures} Planned
          </Badge>
          <Badge className="bg-purple-100 text-purple-800">
            48% Reduction from Duplicates
          </Badge>
        </div>
      </div>

      {/* Success Alert for Consolidation */}
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Feature Catalog Optimized!</strong> Successfully reduced from 139 to {stats.totalFeatures} features by eliminating duplicates. 
          AI capabilities are now enhancements rather than separate features, providing a cleaner management experience.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Library className="h-4 w-4" />
            Library
          </TabsTrigger>
          <TabsTrigger value="develop" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Develop
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="ai-enhanced" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            AI-Enhanced
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Roadmap
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search consolidated features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="implemented">Implemented</option>
              <option value="in_development">In Development</option>
              <option value="planned">Planned</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {CONSOLIDATED_FEATURE_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFeatures.map((feature) => (
              <Card key={feature.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(feature.category)}
                      <CardTitle className="text-lg">{feature.name}</CardTitle>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Badge className={getStatusColor(feature.status)}>
                        {feature.status === 'implemented' ? 'Implemented' : 
                         feature.status === 'in_development' ? 'In Dev' : 'Planned'}
                      </Badge>
                      {feature.hasAIEnhancement && (
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                          <Zap className="h-3 w-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {/* AI Enhancement Details */}
                    {feature.hasAIEnhancement && feature.aiEnhancements && (
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Zap className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-800">
                            {feature.aiEnhancements.name}
                          </span>
                        </div>
                        <p className="text-xs text-purple-600 mb-2">
                          {feature.aiEnhancements.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {feature.aiEnhancements.capabilities.slice(0, 2).map(cap => (
                            <Badge key={cap} variant="outline" className="text-xs bg-purple-100 text-purple-700">
                              {cap.replace('_', ' ')}
                            </Badge>
                          ))}
                          {feature.aiEnhancements.capabilities.length > 2 && (
                            <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                              +{feature.aiEnhancements.capabilities.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Feature Metadata */}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>
                        <strong>{feature.complexity}</strong> complexity
                      </span>
                      <span>
                        <strong>{feature.businessValue}</strong> value
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{feature.estimatedDays} days</span>
                      <span className="capitalize">{feature.category.replace('_', ' ')}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      {feature.status === 'implemented' && (
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => handleAssignToModule(feature)}
                          className="flex-1"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add to Module
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedFeature(feature)}
                        className={feature.status === 'implemented' ? '' : 'flex-1'}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFeatures.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No features found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="develop" className="space-y-4">
          <FeatureDevelopmentLab
            onFeatureSaved={(featureId) => {
              setDevelopingFeatureId(null);
              toast({
                title: "Feature Saved",
                description: `Feature ${featureId} has been saved successfully.`,
              });
            }}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span>Implementation Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Implemented</span>
                    <span className="font-bold text-green-600">{stats.implementedFeatures}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Planned</span>
                    <span className="font-bold text-gray-600">{stats.plannedFeatures}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(stats.implementedFeatures / stats.totalFeatures) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {Math.round((stats.implementedFeatures / stats.totalFeatures) * 100)}% complete
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <span>AI Enhancement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>AI-Enhanced</span>
                    <span className="font-bold text-purple-600">{stats.aiEnhancedFeatures}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standard</span>
                    <span className="font-bold text-gray-600">{stats.totalFeatures - stats.aiEnhancedFeatures}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${(stats.aiEnhancedFeatures / stats.totalFeatures) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {Math.round((stats.aiEnhancedFeatures / stats.totalFeatures) * 100)}% AI-enhanced
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Optimization Impact</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Before</span>
                    <span className="font-bold text-red-600">139 features</span>
                  </div>
                  <div className="flex justify-between">
                    <span>After</span>
                    <span className="font-bold text-green-600">{stats.totalFeatures} features</span>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-800 font-medium">
                      48.2% Reduction
                    </p>
                    <p className="text-xs text-green-600">
                      Eliminated duplicates between standard and AI features
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Feature distribution across consolidated categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.categoryBreakdown.map((category) => (
                  <div key={category.name} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      {getCategoryIcon(category.name.toLowerCase().replace(/[^a-z0-9]/g, '_'))}
                      <h4 className="font-medium">{category.name}</h4>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">{category.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Implemented:</span>
                        <span className="font-medium text-green-600">{category.implemented}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AI-Enhanced:</span>
                        <span className="font-medium text-purple-600">{category.aiEnhanced}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-enhanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-purple-600" />
                <span>AI-Enhanced Features</span>
              </CardTitle>
              <CardDescription>
                {stats.aiEnhancedFeatures} features with AI capabilities as enhancements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiEnhancedFeatures.map((feature) => (
                  <div key={feature.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center space-x-2">
                        {getCategoryIcon(feature.category)}
                        <span>{feature.name}</span>
                      </h4>
                      <Badge className={getStatusColor(feature.status)}>
                        {feature.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                    
                    {feature.aiEnhancements && (
                      <div className="bg-purple-50 border border-purple-200 rounded p-3">
                        <h5 className="font-medium text-purple-800 mb-1 flex items-center space-x-1">
                          <Zap className="h-4 w-4" />
                          <span>{feature.aiEnhancements.name}</span>
                        </h5>
                        <p className="text-sm text-purple-600 mb-2">
                          {feature.aiEnhancements.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {feature.aiEnhancements.capabilities.map(cap => (
                            <Badge key={cap} variant="outline" className="text-xs bg-purple-100 text-purple-700">
                              {cap.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {feature.status === 'implemented' && (
                      <div className="mt-3 flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAssignToModule(feature)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add to Module
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedFeature(feature)}
                        >
                          Details
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Roadmap</CardTitle>
              <CardDescription>
                Development roadmap for {stats.plannedFeatures} planned features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {CONSOLIDATED_FEATURE_CATEGORIES.map((category) => {
                  const plannedInCategory = category.features.filter(f => f.status === 'planned');
                  if (plannedInCategory.length === 0) return null;
                  
                  return (
                    <div key={category.id} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-medium text-lg flex items-center space-x-2 mb-3">
                        {getCategoryIcon(category.id)}
                        <span>{category.name}</span>
                        <Badge variant="outline">{plannedInCategory.length} planned</Badge>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {plannedInCategory.map((feature) => (
                          <div key={feature.id} className="p-3 bg-gray-50 rounded border">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{feature.name}</h4>
                              <Badge className="bg-gray-100 text-gray-700">
                                {feature.estimatedDays}d
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{feature.complexity} complexity</span>
                              <span>{feature.businessValue} value</span>
                            </div>
                            {feature.hasAIEnhancement && (
                              <Badge className="mt-2 bg-purple-100 text-purple-700 text-xs">
                                <Zap className="h-3 w-3 mr-1" />
                                AI Enhancement Planned
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Feature Details Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    {getCategoryIcon(selectedFeature.category)}
                    <span>{selectedFeature.name}</span>
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {selectedFeature.description}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedFeature(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge className={getStatusColor(selectedFeature.status)}>
                      {selectedFeature.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <p className="capitalize">{selectedFeature.category.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Complexity</Label>
                    <p className="capitalize">{selectedFeature.complexity}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Business Value</Label>
                    <p className="capitalize">{selectedFeature.businessValue}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Estimated Days</Label>
                    <p>{selectedFeature.estimatedDays}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">AI Enhanced</Label>
                    <p>{selectedFeature.hasAIEnhancement ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                {selectedFeature.hasAIEnhancement && selectedFeature.aiEnhancements && (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2 flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>{selectedFeature.aiEnhancements.name}</span>
                    </h4>
                    <p className="text-sm text-purple-600 mb-3">
                      {selectedFeature.aiEnhancements.description}
                    </p>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-purple-800">AI Capabilities:</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedFeature.aiEnhancements.capabilities.map(cap => (
                          <Badge key={cap} variant="outline" className="bg-purple-100 text-purple-700">
                            {cap.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedFeature.status === 'implemented' && (
                  <div className="flex space-x-2 pt-4 border-t">
                    <Button 
                      onClick={() => {
                        handleAssignToModule(selectedFeature);
                        setSelectedFeature(null);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Module
                    </Button>
                    <Button variant="outline">
                      View Implementation
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Module Assignment Dialog */}
      <FeatureModuleAssignmentDialog
        open={showAssignmentDialog}
        onOpenChange={setShowAssignmentDialog}
        feature={featureToAssign}
      />
    </div>
  );
};

export default UnifiedFeatureManagement; 