/**
 * CONSOLIDATED FEATURE MANAGEMENT
 * Cleaned-up feature system without duplicates
 * Demonstrates the new approach where AI capabilities are enhancements
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Search
} from 'lucide-react';
import { 
  CONSOLIDATED_FEATURE_CATEGORIES, 
  getConsolidatedFeatureStats, 
  getAllConsolidatedFeatures,
  getImplementedFeatures,
  getAIEnhancedFeatures 
} from '@/services/consolidatedFeatureLibrary';

const ConsolidatedFeatureManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

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
      {/* Header with Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Features</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFeatures}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Implemented</p>
                <p className="text-2xl font-bold text-gray-900">{stats.implementedFeatures}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">AI-Enhanced</p>
                <p className="text-2xl font-bold text-gray-900">{stats.aiEnhancedFeatures}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Planned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.plannedFeatures}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Improvement Alert */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Feature Catalog Optimized!</strong> Reduced from 139 to {stats.totalFeatures} features by eliminating duplicates 
          and treating AI capabilities as enhancements rather than separate features. This provides a cleaner, 
          more manageable catalog for Super Admin management.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="catalog">Feature Catalog</TabsTrigger>
          <TabsTrigger value="ai-enhanced">AI-Enhanced</TabsTrigger>
          <TabsTrigger value="comparison">Before vs After</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Categories</CardTitle>
                <CardDescription>
                  Breakdown by category with implementation status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.categoryBreakdown.map((category) => (
                    <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getCategoryIcon(category.name.toLowerCase().replace(/[^a-z0-9]/g, '_'))}
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-gray-600">{category.count} features</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-green-700 bg-green-50">
                          {category.implemented} impl.
                        </Badge>
                        {category.aiEnhanced > 0 && (
                          <Badge variant="outline" className="text-purple-700 bg-purple-50">
                            {category.aiEnhanced} AI
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Improvements */}
            <Card>
              <CardHeader>
                <CardTitle>Key Improvements</CardTitle>
                <CardDescription>
                  How the consolidated approach improves feature management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Eliminated Duplicates</p>
                      <p className="text-sm text-gray-600">Removed 67 duplicate features between standard and AI categories</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Zap className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium">AI as Enhancements</p>
                      <p className="text-sm text-gray-600">AI capabilities are now feature enhancements, not separate features</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Cleaner Categories</p>
                      <p className="text-sm text-gray-600">11 logical categories vs 12+ mixed technical/functional</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium">More Accurate Count</p>
                      <p className="text-sm text-gray-600">Realistic feature count closer to your estimates</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="catalog" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <Card key={feature.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(feature.category)}
                      <CardTitle className="text-lg">{feature.name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(feature.status)}>
                      {feature.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* AI Enhancement Badge */}
                    {feature.hasAIEnhancement && (
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-800">
                            {feature.aiEnhancements?.name}
                          </span>
                        </div>
                        <p className="text-xs text-purple-600">
                          {feature.aiEnhancements?.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {feature.aiEnhancements?.capabilities.slice(0, 2).map(cap => (
                            <Badge key={cap} variant="outline" className="text-xs bg-purple-100 text-purple-700">
                              {cap.replace('_', ' ')}
                            </Badge>
                          ))}
                          {(feature.aiEnhancements?.capabilities.length || 0) > 2 && (
                            <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700">
                              +{(feature.aiEnhancements?.capabilities.length || 0) - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Feature Details */}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Complexity: <strong>{feature.complexity}</strong></span>
                      <span>Value: <strong>{feature.businessValue}</strong></span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {feature.estimatedDays} days
                      </span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-enhanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-purple-600" />
                <span>AI-Enhanced Features</span>
              </CardTitle>
              <CardDescription>
                Features that include AI capabilities as enhancements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiEnhancedFeatures.map((feature) => (
                  <div key={feature.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{feature.name}</h4>
                      <Badge className={getStatusColor(feature.status)}>
                        {feature.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                    
                    {feature.aiEnhancements && (
                      <div className="bg-purple-50 border border-purple-200 rounded p-3">
                        <h5 className="font-medium text-purple-800 mb-1">
                          {feature.aiEnhancements.name}
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Before */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-700">Before: Original System</CardTitle>
                <CardDescription>Multiple overlapping feature sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <p className="font-medium text-red-800">139 Total Features</p>
                    <p className="text-sm text-red-600">96 Standard + 43 AI = Duplicates</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Issues:</strong></p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• "Dashboard creation" + "Intelligent dashboards" = duplicate</li>
                      <li>• "Email templates" + "Smart template suggestions" = duplicate</li>
                      <li>• "Lead management" + "Lead scoring" = overlapping</li>
                      <li>• Mixed technical/functional categories</li>
                      <li>• Inflated feature count</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* After */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">After: Consolidated System</CardTitle>
                <CardDescription>Clean, unique features with AI enhancements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <p className="font-medium text-green-800">{stats.totalFeatures} Total Features</p>
                    <p className="text-sm text-green-600">Unique features + AI enhancements</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Improvements:</strong></p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• "Dashboard Builder" with AI enhancement option</li>
                      <li>• "Email Management" with smart AI features</li>
                      <li>• "Lead Management" with AI scoring capabilities</li>
                      <li>• Logical functional categories</li>
                      <li>• Realistic, accurate feature count</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>48.2% reduction</strong> in feature complexity while maintaining all functionality
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsolidatedFeatureManagement; 