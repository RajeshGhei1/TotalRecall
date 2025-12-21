import React, { useState } from 'react';
import { 
  Shield, Users, Database, Mail, BarChart3, Megaphone, 
  Kanban, FileText, Link, MessageSquare, Zap, ChevronDown, 
  ChevronRight, Brain
} from 'lucide-react';
import { CONSOLIDATED_FEATURE_CATEGORIES, ConsolidatedCategory } from '@/services/consolidatedFeatureLibrary';
import { Badge } from '@/components/ui/badge';

const FeaturesShowcase: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Category icons and descriptions
  const categoryInfo: Record<string, { 
    icon: React.ComponentType<{ className?: string }>; 
    description: string;
    useCase: string;
  }> = {
    'core_infrastructure': {
      icon: Shield,
      description: 'Essential system infrastructure and platform capabilities that form the foundation of all apps',
      useCase: 'Used by all apps to provide security, data synchronization, APIs, and system monitoring. These features ensure apps can securely communicate, scale, and maintain data integrity.'
    },
    'user_access_management': {
      icon: Users,
      description: 'User authentication, authorization, and account management features',
      useCase: 'Used by apps to manage who can access what. Apps use these features to authenticate users, control permissions, and manage teams and user profiles.'
    },
    'data_management': {
      icon: Database,
      description: 'Data handling, processing, and lifecycle management capabilities',
      useCase: 'Used by apps to import, export, validate, and manage data. Apps rely on these features to handle bulk operations, data quality, and storage management.'
    },
    'communication_engagement': {
      icon: Mail,
      description: 'Communication and engagement features for connecting with users and customers',
      useCase: 'Used by apps to send emails, notifications, and messages. Apps integrate these features to communicate with users, send alerts, and engage with customers.'
    },
    'analytics_intelligence': {
      icon: BarChart3,
      description: 'Analytics, reporting, and business intelligence capabilities',
      useCase: 'Used by apps to generate insights, create reports, and track performance. Apps use these features to provide dashboards, analytics, and data visualization.'
    },
    'sales_crm': {
      icon: Users,
      description: 'Sales and customer relationship management features',
      useCase: 'Used by sales and CRM apps to manage leads, track opportunities, and maintain customer relationships. These features power sales pipelines and customer management.'
    },
    'marketing_campaigns': {
      icon: Megaphone,
      description: 'Marketing automation and campaign management features',
      useCase: 'Used by marketing apps to create campaigns, automate workflows, and track marketing performance. Apps use these to manage email marketing, social media, and campaigns.'
    },
    'project_workflow': {
      icon: Kanban,
      description: 'Project management and workflow automation features',
      useCase: 'Used by project management apps to track tasks, manage workflows, and coordinate teams. Apps use these features to organize work, assign tasks, and track progress.'
    },
    'forms_templates': {
      icon: FileText,
      description: 'Form building, template management, and dynamic content creation',
      useCase: 'Used by apps to create forms, templates, and dynamic content. Apps integrate these features to build custom forms, manage templates, and create reusable content.'
    },
    'integration_api': {
      icon: Link,
      description: 'Integration and API capabilities for connecting with external systems',
      useCase: 'Used by apps to connect with third-party services, sync data, and build integrations. Apps use these features to integrate with LinkedIn, CRMs, and other platforms.'
    },
    'collaboration': {
      icon: MessageSquare,
      description: 'Real-time collaboration and team communication features',
      useCase: 'Used by apps to enable team collaboration, real-time updates, and communication. Apps use these features to allow teams to work together and share information.'
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'bg-green-500';
      case 'in_development': return 'bg-yellow-500';
      case 'planned': return 'bg-blue-500';
      case 'deprecated': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'implemented': return 'Live';
      case 'in_development': return 'In Development';
      case 'planned': return 'Planned';
      case 'deprecated': return 'Deprecated';
      default: return status;
    }
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Platform Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Features are reusable capabilities that power apps across the platform. 
            Each feature can be used by multiple apps to provide consistent functionality.
          </p>
          <p className="text-sm text-gray-500">
            Features are building blocks that apps use to deliver functionality to users
          </p>
        </div>

        {/* Feature Categories */}
        <div className="space-y-6">
          {CONSOLIDATED_FEATURE_CATEGORIES.map((category) => {
            const info = categoryInfo[category.id] || { 
              icon: Zap, 
              description: category.description,
              useCase: 'Used by apps to provide functionality'
            };
            const CategoryIcon = info.icon;
            const isExpanded = expandedCategories.has(category.id);
            const implementedCount = category.features.filter(f => f.status === 'implemented').length;
            const aiEnhancedCount = category.features.filter(f => f.hasAIEnhancement).length;

            return (
              <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <CategoryIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {info.description}
                        </p>
                        <p className="text-xs text-gray-500 italic">
                          {info.useCase}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <Badge variant="secondary" className="text-xs">
                            {category.features.length} features
                          </Badge>
                          {implementedCount > 0 && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              {implementedCount} live
                            </Badge>
                          )}
                          {aiEnhancedCount > 0 && (
                            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                              {aiEnhancedCount} AI enhanced
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Features List */}
                {isExpanded && (
                  <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.features.map((feature) => (
                        <div
                          key={feature.id}
                          className="bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm text-gray-900">
                              {feature.name}
                            </h4>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(feature.status)}`} 
                                 title={getStatusLabel(feature.status)} />
                          </div>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {feature.description}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                feature.status === 'implemented' ? 'border-green-300 text-green-700' :
                                feature.status === 'in_development' ? 'border-yellow-300 text-yellow-700' :
                                'border-blue-300 text-blue-700'
                              }`}
                            >
                              {getStatusLabel(feature.status)}
                            </Badge>
                            {feature.hasAIEnhancement && (
                              <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                                <Brain className="h-3 w-3 mr-1 inline" />
                                AI Enhanced
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {feature.complexity}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturesShowcase;

