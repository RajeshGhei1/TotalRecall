import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Zap, Building, Shield, Database, Mail, BarChart3, Users, Megaphone, Kanban, FileText, Link, MessageSquare } from 'lucide-react';
import { getConsolidatedFeatureStats, getAllConsolidatedFeatures, CONSOLIDATED_FEATURE_CATEGORIES } from '@/services/consolidatedFeatureLibrary';

interface FeaturesOverviewProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const FeaturesOverview: React.FC<FeaturesOverviewProps> = ({
  isExpanded,
  onToggle,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Get feature statistics
  const stats = getConsolidatedFeatureStats();
  const allFeatures = getAllConsolidatedFeatures();

  // Calculate status counts
  const statusCounts = allFeatures.reduce((acc, feature) => {
    acc[feature.status] = (acc[feature.status] || 0) + 1;
    acc.total = (acc.total || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Category icons mapping
  const categoryIcons: Record<string, React.ComponentType<any>> = {
    'core_infrastructure': Shield,
    'user_access_management': Users,
    'data_management': Database,
    'communication_engagement': Mail,
    'analytics_intelligence': BarChart3,
    'sales_crm': Users,
    'marketing_campaigns': Megaphone,
    'project_workflow': Kanban,
    'forms_templates': FileText,
    'integration_api': Link,
    'collaboration': MessageSquare,
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
      case 'in_development': return 'Testing';
      case 'planned': return 'Planning';
      case 'deprecated': return 'Inactive';
      default: return status;
    }
  };

  return (
    <div className="w-full">
      {/* Main Features Header */}
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
      >
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-purple-600" />
          <span>Features</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
            {stats.totalFeatures}
          </span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      </button>

      {/* Status Legend (when expanded) */}
      {isExpanded && (
        <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100 mb-2">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor('implemented')}`}></div>
              <span>Live ({statusCounts.implemented || 0})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor('in_development')}`}></div>
              <span>Testing ({statusCounts.in_development || 0})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor('planned')}`}></div>
              <span>Planning ({statusCounts.planned || 0})</span>
            </div>
            {statusCounts.deprecated > 0 && (
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor('deprecated')}`}></div>
                <span>Inactive ({statusCounts.deprecated})</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Categories and Features */}
      {isExpanded && (
        <div className="ml-2 mt-1 space-y-1">
          {CONSOLIDATED_FEATURE_CATEGORIES.map((category) => {
            const CategoryIcon = categoryIcons[category.id] || Zap;
            const isCategoryExpanded = expandedCategories.has(category.id);
            const implementedCount = category.features.filter(f => f.status === 'implemented').length;
            const aiEnhancedCount = category.features.filter(f => f.hasAIEnhancement).length;

            return (
              <div key={category.id} className="space-y-1">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <CategoryIcon className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {category.features.length}
                    </span>
                    {isCategoryExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </div>
                </button>

                {/* Category Features */}
                {isCategoryExpanded && (
                  <div className="ml-4 space-y-1">
                    {/* Category Stats */}
                    <div className="px-3 py-1 text-xs text-gray-500 bg-gray-50 rounded">
                      <div className="flex items-center gap-4">
                        <span>✅ {implementedCount} implemented</span>
                        {aiEnhancedCount > 0 && (
                          <span>🤖 {aiEnhancedCount} AI enhanced</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Feature List */}
                    {category.features.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-center justify-between px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(feature.status)}`}></div>
                          <span className="truncate">{feature.name}</span>
                          {feature.hasAIEnhancement && (
                            <span className="text-purple-500" title="AI Enhanced">🤖</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">
                            {feature.complexity === 'complex' ? '🔴' : 
                             feature.complexity === 'moderate' ? '🟡' : '🟢'}
                          </span>
                          <span className="text-gray-400">
                            {feature.businessValue === 'high' ? '⭐' : 
                             feature.businessValue === 'medium' ? '⭐' : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FeaturesOverview;




