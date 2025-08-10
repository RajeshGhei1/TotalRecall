/**
 * COMPREHENSIVE MODULE FEATURE LIBRARY
 * Centralized service providing 96+ standard features and 43 AI capabilities
 * for use across all module creation and editing interfaces
 */

export interface FeatureCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
}

export interface AICapability {
  id: string;
  name: string;
  category: string;
  description: string;
}

// ==========================================
// STANDARD FEATURE CATEGORIES (96 Features)
// ==========================================

export const STANDARD_FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'core_infrastructure',
    name: 'Core Infrastructure',
    description: 'Essential system infrastructure and platform capabilities',
    icon: 'Shield',
    features: [
      'Multi-tenant isolation',
      'Real-time synchronization',
      'Data security and encryption',
      'Audit trail and logging',
      'API access and webhooks',
      'Performance monitoring',
      'Backup and recovery',
      'Scalability management'
    ]
  },
  {
    id: 'user_management',
    name: 'User Management',
    description: 'User authentication, authorization, and account management',
    icon: 'Users',
    features: [
      'User registration and authentication',
      'Role-based access control',
      'Permission management',
      'User profile management',
      'Team and group management',
      'Single sign-on (SSO)',
      'Multi-factor authentication',
      'Session management'
    ]
  },
  {
    id: 'data_management',
    name: 'Data Management',
    description: 'Data handling, processing, and lifecycle management',
    icon: 'Database',
    features: [
      'Data import and export',
      'Data validation and cleaning',
      'Duplicate detection and merging',
      'Data archiving and retention',
      'Custom field management',
      'Data relationships and linking',
      'Search and filtering',
      'Data visualization'
    ]
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'Email, messaging, and notification systems',
    icon: 'Mail',
    features: [
      'Email composition and sending',
      'Template management and personalization',
      'Automated email sequences',
      'Email tracking and analytics',
      'SMS and messaging',
      'Notification management',
      'Communication history',
      'Multi-channel messaging'
    ]
  },
  {
    id: 'analytics_reporting',
    name: 'Analytics & Reporting',
    description: 'Business intelligence, dashboards, and reporting tools',
    icon: 'BarChart3',
    features: [
      'Dashboard creation and customization',
      'Report generation and scheduling',
      'Data visualization and charts',
      'KPI tracking and alerts',
      'Predictive analytics',
      'Trend analysis',
      'Performance metrics',
      'Executive reporting'
    ]
  },
  {
    id: 'workflow_automation',
    name: 'Workflow & Automation',
    description: 'Business process automation and workflow management',
    icon: 'Zap',
    features: [
      'Business process automation',
      'Custom workflow creation',
      'Rule-based automation',
      'Event-driven triggers',
      'Approval workflows',
      'Task management and assignment',
      'Process optimization',
      'Integration workflows'
    ]
  },
  {
    id: 'forms_templates',
    name: 'Forms & Templates',
    description: 'Dynamic form creation and template management',
    icon: 'FileText',
    features: [
      'Dynamic form builder',
      'Drag-and-drop interface',
      'Custom field creation',
      'Form template library',
      'Form deployment and embedding',
      'Form analytics and submissions',
      'Validation and conditional logic',
      'Multi-step forms'
    ]
  },
  {
    id: 'sales_crm',
    name: 'Sales & CRM',
    description: 'Customer relationship management and sales automation',
    icon: 'TrendingUp',
    features: [
      'Lead capture and management',
      'Sales pipeline management',
      'Opportunity tracking',
      'Contact and account management',
      'Deal tracking and forecasting',
      'Sales automation workflows',
      'Customer lifecycle tracking',
      'Sales performance analytics'
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Marketing automation, campaigns, and lead generation',
    icon: 'Megaphone',
    features: [
      'Campaign management and automation',
      'Lead nurturing workflows',
      'A/B testing capabilities',
      'Social media integration',
      'Content management',
      'SEO optimization',
      'Landing page creation',
      'Marketing analytics and ROI'
    ]
  },
  {
    id: 'project_management',
    name: 'Project Management',
    description: 'Project planning, tracking, and resource management',
    icon: 'Calendar',
    features: [
      'Project planning and tracking',
      'Resource allocation',
      'Task management and collaboration',
      'Milestone tracking',
      'Time tracking and billing',
      'Project analytics and reporting',
      'Team collaboration tools',
      'Resource utilization analysis'
    ]
  },
  {
    id: 'integration',
    name: 'Integration',
    description: 'API connectivity and third-party integrations',
    icon: 'Link',
    features: [
      'API connectivity and management',
      'Data synchronization',
      'Third-party integrations',
      'Webhook management',
      'Authentication handling',
      'Rate limiting and throttling',
      'Error handling and recovery',
      'Integration monitoring'
    ]
  },
  {
    id: 'ai_intelligence',
    name: 'AI & Intelligence',
    description: 'Machine learning, AI models, and intelligent automation',
    icon: 'Brain',
    features: [
      'Machine learning model management',
      'Natural language processing',
      'Predictive modeling',
      'Pattern recognition',
      'Automated insights generation',
      'Intelligent recommendations',
      'Anomaly detection',
      'Decision support systems'
    ]
  }
];

// ==========================================
// AI CAPABILITIES (43 Capabilities)
// ==========================================

export const AI_CAPABILITIES: AICapability[] = [
  // Core AI Infrastructure
  { id: 'behavioral_auth', name: 'Behavioral authentication', category: 'Security', description: 'AI-powered behavioral pattern authentication' },
  { id: 'intelligent_roles', name: 'Intelligent role suggestions', category: 'Security', description: 'Smart role assignment based on user behavior' },
  { id: 'anomaly_detection', name: 'Anomaly detection', category: 'Security', description: 'Automated detection of unusual patterns' },
  { id: 'adaptive_permissions', name: 'Adaptive permissions', category: 'Security', description: 'Dynamic permission adjustment based on context' },
  
  // AI Orchestration
  { id: 'agent_orchestration', name: 'Agent orchestration', category: 'Core', description: 'Coordinated AI agent management' },
  { id: 'cognitive_processing', name: 'Cognitive processing', category: 'Core', description: 'Advanced cognitive AI processing' },
  { id: 'knowledge_synthesis', name: 'Knowledge synthesis', category: 'Core', description: 'Intelligent knowledge combination and analysis' },
  { id: 'decision_support', name: 'Decision support', category: 'Core', description: 'AI-powered decision recommendations' },
  { id: 'learning_algorithms', name: 'Learning algorithms', category: 'Core', description: 'Self-improving AI algorithms' },
  
  // Communication AI
  { id: 'smart_templates', name: 'Smart template suggestions', category: 'Communication', description: 'AI-generated template recommendations' },
  { id: 'communication_optimization', name: 'Communication optimization', category: 'Communication', description: 'Optimize communication effectiveness' },
  { id: 'sentiment_analysis', name: 'Sentiment analysis', category: 'Communication', description: 'Analyze emotional tone in communications' },
  { id: 'automated_responses', name: 'Automated response suggestions', category: 'Communication', description: 'AI-suggested response generation' },
  
  // Integration AI
  { id: 'intelligent_mapping', name: 'Intelligent data mapping', category: 'Integration', description: 'Smart data field mapping' },
  { id: 'automated_integration', name: 'Automated integration setup', category: 'Integration', description: 'Self-configuring integrations' },
  { id: 'error_prediction', name: 'Error prediction and resolution', category: 'Integration', description: 'Predict and prevent integration errors' },
  
  // Performance AI
  { id: 'performance_optimization', name: 'Performance optimization', category: 'Performance', description: 'AI-driven performance improvements' },
  { id: 'automated_insights', name: 'Automated insights generation', category: 'Analytics', description: 'Generate insights from data automatically' },
  { id: 'intelligent_dashboards', name: 'Intelligent dashboard layouts', category: 'Analytics', description: 'Optimize dashboard layouts for users' },
  { id: 'predictive_analytics', name: 'Predictive analytics', category: 'Analytics', description: 'Predict future trends and outcomes' },
  
  // Forms AI
  { id: 'smart_form_fields', name: 'Smart form field suggestions', category: 'Forms', description: 'Suggest optimal form fields' },
  { id: 'form_layout_optimization', name: 'Automated form layout optimization', category: 'Forms', description: 'Optimize form layouts for conversion' },
  { id: 'intelligent_validation', name: 'Intelligent validation rules', category: 'Forms', description: 'Smart form validation rules' },
  { id: 'template_recommendations', name: 'Template recommendations', category: 'Forms', description: 'Recommend templates based on context' },
  
  // Sales & CRM AI
  { id: 'lead_scoring', name: 'Lead scoring algorithms', category: 'Sales', description: 'AI-powered lead quality scoring' },
  { id: 'sales_forecasting', name: 'Sales forecasting', category: 'Sales', description: 'Predict sales outcomes and revenue' },
  { id: 'customer_behavior', name: 'Customer behavior analysis', category: 'Sales', description: 'Analyze customer behavioral patterns' },
  { id: 'opportunity_prioritization', name: 'Opportunity prioritization', category: 'Sales', description: 'Rank opportunities by likelihood' },
  { id: 'churn_prediction', name: 'Churn prediction', category: 'Sales', description: 'Predict customer churn risk' },
  
  // Marketing AI
  { id: 'campaign_optimization', name: 'Campaign optimization', category: 'Marketing', description: 'Optimize marketing campaign performance' },
  { id: 'content_personalization', name: 'Content personalization', category: 'Marketing', description: 'Personalize content for users' },
  { id: 'market_trend_analysis', name: 'Market trend analysis', category: 'Marketing', description: 'Analyze market trends and opportunities' },
  { id: 'social_media_insights', name: 'Social media insights', category: 'Marketing', description: 'Extract insights from social media data' },
  { id: 'automated_segmentation', name: 'Automated segmentation', category: 'Marketing', description: 'Automatically segment audiences' },
  
  // Project Management AI
  { id: 'timeline_optimization', name: 'Project timeline optimization', category: 'Project', description: 'Optimize project timelines and schedules' },
  { id: 'resource_optimization', name: 'Resource allocation optimization', category: 'Project', description: 'Optimize resource allocation' },
  { id: 'risk_prediction', name: 'Risk prediction', category: 'Project', description: 'Predict project risks and issues' },
  { id: 'workload_balancing', name: 'Workload balancing', category: 'Project', description: 'Balance workload across team members' },
  
  // Process AI
  { id: 'performance_insights', name: 'Performance insights', category: 'Process', description: 'Generate performance improvement insights' },
  { id: 'process_optimization', name: 'Process optimization', category: 'Process', description: 'Optimize business processes automatically' },
  { id: 'bottleneck_detection', name: 'Bottleneck detection', category: 'Process', description: 'Identify process bottlenecks' },
  { id: 'intelligent_routing', name: 'Intelligent routing', category: 'Process', description: 'Smart routing based on context' },
  { id: 'workflow_recommendations', name: 'Workflow recommendations', category: 'Process', description: 'Recommend workflow improvements' }
];

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Get all available features as a flat array
 */
export const getAllStandardFeatures = (): string[] => {
  return STANDARD_FEATURE_CATEGORIES.flatMap(category => category.features);
};

/**
 * Get all AI capabilities as a flat array
 */
export const getAllAICapabilities = (): string[] => {
  return AI_CAPABILITIES.map(capability => capability.name);
};

/**
 * Get features by category
 */
export const getFeaturesByCategory = (categoryId: string): string[] => {
  const category = STANDARD_FEATURE_CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.features : [];
};

/**
 * Get AI capabilities by category
 */
export const getAICapabilitiesByCategory = (categoryName: string): AICapability[] => {
  return AI_CAPABILITIES.filter(capability => capability.category === categoryName);
};

/**
 * Search features by keyword
 */
export const searchFeatures = (keyword: string): string[] => {
  const lowerKeyword = keyword.toLowerCase();
  return getAllStandardFeatures().filter(feature => 
    feature.toLowerCase().includes(lowerKeyword)
  );
};

/**
 * Search AI capabilities by keyword
 */
export const searchAICapabilities = (keyword: string): AICapability[] => {
  const lowerKeyword = keyword.toLowerCase();
  return AI_CAPABILITIES.filter(capability => 
    capability.name.toLowerCase().includes(lowerKeyword) ||
    capability.description.toLowerCase().includes(lowerKeyword)
  );
};

/**
 * Get recommended features for a module type
 */
export const getRecommendedFeatures = (moduleType: string, moduleCategory: string): string[] => {
  const recommendations: Record<string, string[]> = {
    // CRM Module Recommendations
    'sales': [
      'Lead capture and management',
      'Sales pipeline management',
      'Contact and account management',
      'Email composition and sending',
      'Dashboard creation and customization',
      'Data import and export'
    ],
    'crm': [
      'Contact and account management',
      'Customer lifecycle tracking',
      'Sales automation workflows',
      'Communication history',
      'Data relationships and linking',
      'Custom field management'
    ],
    // Marketing Module Recommendations
    'marketing': [
      'Campaign management and automation',
      'Email tracking and analytics',
      'Lead nurturing workflows',
      'A/B testing capabilities',
      'Marketing analytics and ROI'
    ],
    // Analytics Module Recommendations
    'analytics': [
      'Dashboard creation and customization',
      'Report generation and scheduling',
      'Data visualization and charts',
      'KPI tracking and alerts',
      'Predictive analytics'
    ]
  };

  return recommendations[moduleCategory] || recommendations[moduleType] || [];
};

/**
 * Get recommended AI capabilities for a module type
 */
export const getRecommendedAICapabilities = (moduleType: string, moduleCategory: string): string[] => {
  const recommendations: Record<string, string[]> = {
    'sales': [
      'Lead scoring algorithms',
      'Sales forecasting',
      'Customer behavior analysis',
      'Opportunity prioritization'
    ],
    'crm': [
      'Customer behavior analysis',
      'Churn prediction',
      'Lead scoring algorithms',
      'Intelligent data mapping'
    ],
    'marketing': [
      'Campaign optimization',
      'Content personalization',
      'Automated segmentation',
      'Market trend analysis'
    ],
    'analytics': [
      'Predictive analytics',
      'Automated insights generation',
      'Intelligent dashboard layouts',
      'Performance insights'
    ]
  };

  return recommendations[moduleCategory] || recommendations[moduleType] || [];
};

/**
 * Validate feature selection
 */
export const validateFeatureSelection = (features: string[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const allFeatures = getAllStandardFeatures();
  
  // Check if all selected features exist
  const invalidFeatures = features.filter(feature => !allFeatures.includes(feature));
  if (invalidFeatures.length > 0) {
    errors.push(`Invalid features: ${invalidFeatures.join(', ')}`);
  }
  
  // Check minimum feature requirement
  if (features.length === 0) {
    errors.push('At least one feature must be selected');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Get feature statistics
 */
export const getFeatureLibraryStats = () => {
  return {
    totalFeatures: getAllStandardFeatures().length,
    totalAICapabilities: AI_CAPABILITIES.length,
    totalCategories: STANDARD_FEATURE_CATEGORIES.length,
    categoriesBreakdown: STANDARD_FEATURE_CATEGORIES.map(cat => ({
      name: cat.name,
      count: cat.features.length
    })),
    aiCategoriesBreakdown: AI_CAPABILITIES.reduce((acc, cap) => {
      acc[cap.category] = (acc[cap.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
}; 