/**
 * CONSOLIDATED FEATURE LIBRARY
 * Cleaned-up feature system without duplicates
 * AI capabilities are treated as enhancements, not separate features
 */

export interface ConsolidatedFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  
  // AI Enhancement flag
  hasAIEnhancement: boolean;
  aiEnhancements?: {
    name: string;
    description: string;
    capabilities: string[];
  };
  
  // Implementation status
  status: 'planned' | 'in_development' | 'implemented' | 'deprecated';
  complexity: 'simple' | 'moderate' | 'complex';
  businessValue: 'low' | 'medium' | 'high';
  estimatedDays: number;
}

export interface ConsolidatedCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: ConsolidatedFeature[];
}

// ==========================================
// CONSOLIDATED FEATURE CATEGORIES (95 Features)
// ==========================================

export const CONSOLIDATED_FEATURE_CATEGORIES: ConsolidatedCategory[] = [
  {
    id: 'core_infrastructure',
    name: 'Core Infrastructure',
    description: 'Essential system infrastructure and platform capabilities',
    icon: 'Shield',
    features: [
      {
        id: 'multi-tenant-isolation',
        name: 'Multi-tenant Isolation',
        description: 'Secure tenant data separation and isolation',
        category: 'core_infrastructure',
        icon: 'Shield',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Behavioral Authentication',
          description: 'AI-powered behavioral pattern authentication',
          capabilities: ['behavioral_auth', 'anomaly_detection', 'adaptive_permissions']
        },
        status: 'implemented',
        complexity: 'complex',
        businessValue: 'high',
        estimatedDays: 21
      },
      {
        id: 'real-time-sync',
        name: 'Real-time Synchronization',
        description: 'Live data synchronization across all clients',
        category: 'core_infrastructure',
        icon: 'RefreshCw',
        hasAIEnhancement: false,
        status: 'implemented',
        complexity: 'complex',
        businessValue: 'high',
        estimatedDays: 15
      },
      {
        id: 'data-security',
        name: 'Data Security & Encryption',
        description: 'Advanced data protection and encryption protocols',
        category: 'core_infrastructure',
        icon: 'Lock',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Intelligent Security',
          description: 'AI-driven security monitoring and threat detection',
          capabilities: ['anomaly_detection', 'intelligent_roles', 'adaptive_permissions']
        },
        status: 'implemented',
        complexity: 'complex',
        businessValue: 'high',
        estimatedDays: 18
      },
      {
        id: 'audit-logging',
        name: 'Audit Trail & Logging',
        description: 'Comprehensive system activity tracking and compliance',
        category: 'core_infrastructure',
        icon: 'FileText',
        hasAIEnhancement: false,
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 12
      },
      {
        id: 'api-webhooks',
        name: 'API Access & Webhooks',
        description: 'RESTful APIs and webhook integration capabilities',
        category: 'core_infrastructure',
        icon: 'Zap',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Intelligent Integration',
          description: 'Smart API mapping and automated integration setup',
          capabilities: ['intelligent_mapping', 'automated_integration', 'error_prediction']
        },
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 10
      },
      {
        id: 'performance-monitoring',
        name: 'Performance Monitoring',
        description: 'Real-time system performance tracking and optimization',
        category: 'core_infrastructure',
        icon: 'Activity',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'AI Performance Optimization',
          description: 'Automated performance tuning and resource optimization',
          capabilities: ['performance_optimization', 'bottleneck_detection', 'intelligent_routing']
        },
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 8
      },
      {
        id: 'backup-recovery',
        name: 'Backup & Recovery',
        description: 'Automated data backup and disaster recovery systems',
        category: 'core_infrastructure',
        icon: 'Archive',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 10
      },
      {
        id: 'scalability-management',
        name: 'Scalability Management',
        description: 'Auto-scaling infrastructure and load balancing',
        category: 'core_infrastructure',
        icon: 'TrendingUp',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'complex',
        businessValue: 'medium',
        estimatedDays: 15
      }
    ]
  },
  
  {
    id: 'user_access_management',
    name: 'User & Access Management',
    description: 'User authentication, authorization, and account management',
    icon: 'Users',
    features: [
      {
        id: 'user-authentication',
        name: 'User Authentication',
        description: 'Secure user login and authentication system',
        category: 'user_access_management',
        icon: 'LogIn',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Smart Authentication',
          description: 'AI-powered behavioral authentication and role suggestions',
          capabilities: ['behavioral_auth', 'intelligent_roles', 'anomaly_detection']
        },
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 12
      },
      {
        id: 'role-permissions',
        name: 'Role-based Access Control',
        description: 'Granular role and permission management system',
        category: 'user_access_management',
        icon: 'Shield',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Adaptive Permissions',
          description: 'Dynamic permission adjustment based on context and behavior',
          capabilities: ['adaptive_permissions', 'intelligent_roles']
        },
        status: 'implemented',
        complexity: 'complex',
        businessValue: 'high',
        estimatedDays: 15
      },
      {
        id: 'user-profiles',
        name: 'User Profile Management',
        description: 'Comprehensive user profile and preference management',
        category: 'user_access_management',
        icon: 'User',
        hasAIEnhancement: false,
        status: 'implemented',
        complexity: 'simple',
        businessValue: 'medium',
        estimatedDays: 6
      },
      {
        id: 'team-management',
        name: 'Team & Group Management',
        description: 'Organize users into teams and collaborative groups',
        category: 'user_access_management',
        icon: 'Users',
        hasAIEnhancement: false,
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 8
      },
      {
        id: 'sso-integration',
        name: 'Single Sign-On (SSO)',
        description: 'Enterprise SSO integration (SAML, OAuth, LDAP)',
        category: 'user_access_management',
        icon: 'Key',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'complex',
        businessValue: 'high',
        estimatedDays: 18
      },
      {
        id: 'multi-factor-auth',
        name: 'Multi-factor Authentication',
        description: 'Enhanced security with MFA support',
        category: 'user_access_management',
        icon: 'Smartphone',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 10
      },
      {
        id: 'session-management',
        name: 'Session Management',
        description: 'Advanced session handling and security controls',
        category: 'user_access_management',
        icon: 'Clock',
        hasAIEnhancement: false,
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 8
      }
    ]
  },

  {
    id: 'data_management',
    name: 'Data Management',
    description: 'Data handling, processing, and lifecycle management',
    icon: 'Database',
    features: [
      {
        id: 'data-import-export',
        name: 'Data Import & Export',
        description: 'Bulk data import/export with multiple format support',
        category: 'data_management',
        icon: 'Download',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Intelligent Data Mapping',
          description: 'Smart field mapping and automated data validation',
          capabilities: ['intelligent_mapping', 'automated_integration']
        },
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 10
      },
      {
        id: 'data-validation',
        name: 'Data Validation & Cleaning',
        description: 'Automated data quality control and cleaning processes',
        category: 'data_management',
        icon: 'CheckCircle',
        hasAIEnhancement: false,
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 12
      },
      {
        id: 'duplicate-detection',
        name: 'Duplicate Detection & Merging',
        description: 'Smart duplicate identification and merge capabilities',
        category: 'data_management',
        icon: 'Copy',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'complex',
        businessValue: 'medium',
        estimatedDays: 15
      },
      {
        id: 'data-archiving',
        name: 'Data Archiving & Retention',
        description: 'Automated data lifecycle and retention policies',
        category: 'data_management',
        icon: 'Archive',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 8
      },
      {
        id: 'custom-fields',
        name: 'Custom Field Management',
        description: 'Dynamic custom field creation and management',
        category: 'data_management',
        icon: 'Settings',
        hasAIEnhancement: false,
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 10
      },
      {
        id: 'data-relationships',
        name: 'Data Relationships & Linking',
        description: 'Establish and manage relationships between data entities',
        category: 'data_management',
        icon: 'Link',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 12
      },
      {
        id: 'search-filtering',
        name: 'Advanced Search & Filtering',
        description: 'Powerful search and filtering capabilities across all data',
        category: 'data_management',
        icon: 'Search',
        hasAIEnhancement: false,
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 8
      },
      {
        id: 'data-visualization',
        name: 'Data Visualization',
        description: 'Interactive charts and visual data representation',
        category: 'data_management',
        icon: 'BarChart',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Smart Visualizations',
          description: 'AI-recommended chart types and automated insights',
          capabilities: ['automated_insights', 'intelligent_dashboards']
        },
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 10
      }
    ]
  },

  {
    id: 'communication_engagement',
    name: 'Communication & Engagement',
    description: 'Email, messaging, and customer engagement tools',
    icon: 'Mail',
    features: [
      {
        id: 'email-management',
        name: 'Email Management System',
        description: 'Comprehensive email composition, sending, and tracking',
        category: 'communication_engagement',
        icon: 'Mail',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'AI Email Assistant',
          description: 'Smart email generation, templates, and response suggestions',
          capabilities: ['automated_responses', 'smart_templates', 'sentiment_analysis']
        },
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 12
      },
      {
        id: 'template-management',
        name: 'Template Management',
        description: 'Create and manage reusable content templates',
        category: 'communication_engagement',
        icon: 'FileText',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Smart Templates',
          description: 'AI-generated template suggestions and personalization',
          capabilities: ['smart_templates', 'content_personalization', 'template_recommendations']
        },
        status: 'implemented',
        complexity: 'simple',
        businessValue: 'medium',
        estimatedDays: 6
      },
      {
        id: 'email-automation',
        name: 'Email Automation & Sequences',
        description: 'Automated email workflows and drip campaigns',
        category: 'communication_engagement',
        icon: 'Zap',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Smart Automation',
          description: 'AI-optimized send times and content personalization',
          capabilities: ['communication_optimization', 'automated_responses']
        },
        status: 'planned',
        complexity: 'complex',
        businessValue: 'high',
        estimatedDays: 15
      },
      {
        id: 'email-analytics',
        name: 'Email Tracking & Analytics',
        description: 'Detailed email performance metrics and engagement tracking',
        category: 'communication_engagement',
        icon: 'TrendingUp',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Communication Insights',
          description: 'AI-powered communication effectiveness analysis',
          capabilities: ['sentiment_analysis', 'communication_optimization']
        },
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 8
      },
      {
        id: 'sms-messaging',
        name: 'SMS & Multi-channel Messaging',
        description: 'SMS, WhatsApp, and other messaging platform integration',
        category: 'communication_engagement',
        icon: 'MessageSquare',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 10
      },
      {
        id: 'notification-system',
        name: 'Notification Management',
        description: 'In-app, push, and email notification system',
        category: 'communication_engagement',
        icon: 'Bell',
        hasAIEnhancement: false,
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 8
      },
      {
        id: 'communication-history',
        name: 'Communication History',
        description: 'Complete interaction timeline and communication logs',
        category: 'communication_engagement',
        icon: 'History',
        hasAIEnhancement: false,
        status: 'implemented',
        complexity: 'simple',
        businessValue: 'medium',
        estimatedDays: 6
      }
    ]
  },

  {
    id: 'analytics_intelligence',
    name: 'Analytics & Business Intelligence',
    description: 'Dashboards, reporting, and business intelligence tools',
    icon: 'BarChart3',
    features: [
      {
        id: 'dashboard-builder',
        name: 'Dashboard Builder',
        description: 'Drag-and-drop dashboard creation with widgets',
        category: 'analytics_intelligence',
        icon: 'Layout',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Intelligent Dashboards',
          description: 'AI-optimized layouts and automated insight generation',
          capabilities: ['intelligent_dashboards', 'automated_insights', 'predictive_analytics']
        },
        status: 'implemented',
        complexity: 'complex',
        businessValue: 'high',
        estimatedDays: 18
      },
      {
        id: 'report-builder',
        name: 'Report Builder',
        description: 'Advanced report generation and scheduling system',
        category: 'analytics_intelligence',
        icon: 'FileText',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Smart Reporting',
          description: 'AI-generated insights and automated report optimization',
          capabilities: ['automated_insights', 'predictive_analytics']
        },
        status: 'implemented',
        complexity: 'complex',
        businessValue: 'high',
        estimatedDays: 15
      },
      {
        id: 'kpi-tracking',
        name: 'KPI Tracking & Alerts',
        description: 'Key performance indicator monitoring and alerting',
        category: 'analytics_intelligence',
        icon: 'Target',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 10
      },
      {
        id: 'data-export',
        name: 'Data Export & Sharing',
        description: 'Export data in multiple formats and share insights',
        category: 'analytics_intelligence',
        icon: 'Share',
        hasAIEnhancement: false,
        status: 'implemented',
        complexity: 'simple',
        businessValue: 'medium',
        estimatedDays: 6
      },
      {
        id: 'real-time-analytics',
        name: 'Real-time Analytics',
        description: 'Live data monitoring and real-time metrics',
        category: 'analytics_intelligence',
        icon: 'Activity',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'complex',
        businessValue: 'medium',
        estimatedDays: 12
      },
      {
        id: 'custom-metrics',
        name: 'Custom Metrics & Calculations',
        description: 'Create custom business metrics and calculated fields',
        category: 'analytics_intelligence',
        icon: 'Calculator',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 8
      }
    ]
  },

  {
    id: 'sales_crm',
    name: 'Sales & CRM',
    description: 'Customer relationship management and sales tools',
    icon: 'Users',
    features: [
      {
        id: 'lead-management',
        name: 'Lead Management',
        description: 'Comprehensive lead tracking and nurturing system',
        category: 'sales_crm',
        icon: 'UserPlus',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Smart Lead Intelligence',
          description: 'AI-powered lead scoring and opportunity prioritization',
          capabilities: ['lead_scoring', 'opportunity_prioritization', 'churn_prediction']
        },
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 12
      },
      {
        id: 'sales-pipeline',
        name: 'Sales Pipeline Management',
        description: 'Visual sales pipeline with stage management',
        category: 'sales_crm',
        icon: 'TrendingUp',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Sales Forecasting',
          description: 'AI-powered sales predictions and pipeline optimization',
          capabilities: ['sales_forecasting', 'opportunity_prioritization']
        },
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 10
      },
      {
        id: 'contact-management',
        name: 'Contact & Account Management',
        description: 'Comprehensive contact and company database',
        category: 'sales_crm',
        icon: 'Users',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Customer Intelligence',
          description: 'AI-driven customer behavior analysis and insights',
          capabilities: ['customer_behavior', 'churn_prediction']
        },
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 12
      },
      {
        id: 'opportunity-tracking',
        name: 'Opportunity Tracking',
        description: 'Deal tracking with probability and value estimation',
        category: 'sales_crm',
        icon: 'Target',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 8
      },
      {
        id: 'sales-activity',
        name: 'Sales Activity Tracking',
        description: 'Log and track all sales activities and interactions',
        category: 'sales_crm',
        icon: 'Activity',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'simple',
        businessValue: 'medium',
        estimatedDays: 6
      },
      {
        id: 'customer-support',
        name: 'Customer Support Integration',
        description: 'Integrated customer support ticketing and resolution',
        category: 'sales_crm',
        icon: 'Headphones',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 10
      }
    ]
  },

  {
    id: 'marketing_campaigns',
    name: 'Marketing & Campaigns',
    description: 'Marketing automation and campaign management',
    icon: 'Megaphone',
    features: [
      {
        id: 'campaign-management',
        name: 'Campaign Management',
        description: 'Create and manage multi-channel marketing campaigns',
        category: 'marketing_campaigns',
        icon: 'Megaphone',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Campaign Intelligence',
          description: 'AI-optimized campaigns with automated segmentation',
          capabilities: ['campaign_optimization', 'automated_segmentation', 'market_trend_analysis']
        },
        status: 'planned',
        complexity: 'complex',
        businessValue: 'high',
        estimatedDays: 15
      },
      {
        id: 'audience-segmentation',
        name: 'Audience Segmentation',
        description: 'Dynamic audience creation and targeting',
        category: 'marketing_campaigns',
        icon: 'Users',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Smart Segmentation',
          description: 'AI-powered audience discovery and automated segmentation',
          capabilities: ['automated_segmentation', 'customer_behavior']
        },
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 10
      },
      {
        id: 'content-management',
        name: 'Content Management',
        description: 'Centralized marketing content creation and management',
        category: 'marketing_campaigns',
        icon: 'FileText',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Content Intelligence',
          description: 'AI-powered content personalization and optimization',
          capabilities: ['content_personalization', 'market_trend_analysis']
        },
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 8
      },
      {
        id: 'landing-pages',
        name: 'Landing Page Builder',
        description: 'Drag-and-drop landing page creation and optimization',
        category: 'marketing_campaigns',
        icon: 'Layout',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 12
      },
      {
        id: 'social-media',
        name: 'Social Media Integration',
        description: 'Social media publishing and engagement tracking',
        category: 'marketing_campaigns',
        icon: 'Share2',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Social Intelligence',
          description: 'AI-powered social media insights and optimization',
          capabilities: ['social_media_insights', 'content_personalization']
        },
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 10
      },
      {
        id: 'marketing-analytics',
        name: 'Marketing Analytics',
        description: 'Comprehensive marketing performance tracking and ROI',
        category: 'marketing_campaigns',
        icon: 'BarChart',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 8
      }
    ]
  },

  {
    id: 'project_workflow',
    name: 'Project & Workflow Management',
    description: 'Project management and workflow automation tools',
    icon: 'Kanban',
    features: [
      {
        id: 'project-management',
        name: 'Project Management',
        description: 'Complete project planning, tracking, and delivery',
        category: 'project_workflow',
        icon: 'Kanban',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Project Intelligence',
          description: 'AI-optimized timelines, resource allocation, and risk prediction',
          capabilities: ['timeline_optimization', 'resource_optimization', 'risk_prediction']
        },
        status: 'planned',
        complexity: 'complex',
        businessValue: 'high',
        estimatedDays: 18
      },
      {
        id: 'task-management',
        name: 'Task Management',
        description: 'Individual and team task assignment and tracking',
        category: 'project_workflow',
        icon: 'CheckSquare',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Smart Task Management',
          description: 'AI-powered workload balancing and priority optimization',
          capabilities: ['workload_balancing', 'timeline_optimization']
        },
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 10
      },
      {
        id: 'workflow-automation',
        name: 'Workflow Automation',
        description: 'Automated business process workflows and triggers',
        category: 'project_workflow',
        icon: 'Zap',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Intelligent Workflows',
          description: 'AI-optimized process automation and bottleneck detection',
          capabilities: ['process_optimization', 'bottleneck_detection', 'workflow_recommendations']
        },
        status: 'planned',
        complexity: 'complex',
        businessValue: 'high',
        estimatedDays: 15
      },
      {
        id: 'time-tracking',
        name: 'Time Tracking',
        description: 'Comprehensive time logging and productivity tracking',
        category: 'project_workflow',
        icon: 'Clock',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 8
      },
      {
        id: 'resource-management',
        name: 'Resource Management',
        description: 'Team resource allocation and capacity planning',
        category: 'project_workflow',
        icon: 'Users',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 10
      },
      {
        id: 'gantt-charts',
        name: 'Gantt Charts & Timeline',
        description: 'Visual project timelines and dependency mapping',
        category: 'project_workflow',
        icon: 'BarChart3',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 8
      }
    ]
  },

  {
    id: 'forms_templates',
    name: 'Forms & Templates',
    description: 'Dynamic form creation and template management',
    icon: 'FileText',
    features: [
      {
        id: 'form-builder',
        name: 'Form Builder',
        description: 'Drag-and-drop form creation with advanced field types',
        category: 'forms_templates',
        icon: 'FileText',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Smart Form Builder',
          description: 'AI-suggested fields, layout optimization, and intelligent validation',
          capabilities: ['smart_form_fields', 'form_layout_optimization', 'intelligent_validation']
        },
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 12
      },
      {
        id: 'form-templates',
        name: 'Form Templates',
        description: 'Pre-built form templates for common use cases',
        category: 'forms_templates',
        icon: 'Copy',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Template Intelligence',
          description: 'AI-recommended templates based on context and industry',
          capabilities: ['template_recommendations', 'smart_form_fields']
        },
        status: 'implemented',
        complexity: 'simple',
        businessValue: 'medium',
        estimatedDays: 6
      },
      {
        id: 'form-validation',
        name: 'Advanced Form Validation',
        description: 'Complex validation rules and conditional logic',
        category: 'forms_templates',
        icon: 'CheckCircle',
        hasAIEnhancement: false,
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 8
      },
      {
        id: 'form-analytics',
        name: 'Form Analytics',
        description: 'Form performance tracking and conversion optimization',
        category: 'forms_templates',
        icon: 'TrendingUp',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 6
      },
      {
        id: 'conditional-logic',
        name: 'Conditional Logic',
        description: 'Dynamic form behavior based on user responses',
        category: 'forms_templates',
        icon: 'GitBranch',
        hasAIEnhancement: false,
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 8
      },
      {
        id: 'form-submissions',
        name: 'Form Submission Management',
        description: 'Collect, organize, and manage form submissions',
        category: 'forms_templates',
        icon: 'Inbox',
        hasAIEnhancement: false,
        status: 'implemented',
        complexity: 'simple',
        businessValue: 'high',
        estimatedDays: 6
      }
    ]
  },

  {
    id: 'integration_api',
    name: 'Integration & API',
    description: 'Third-party integrations and API management',
    icon: 'Zap',
    features: [
      {
        id: 'api-management',
        name: 'API Management',
        description: 'RESTful API creation, documentation, and versioning',
        category: 'integration_api',
        icon: 'Code',
        hasAIEnhancement: false,
        status: 'implemented',
        complexity: 'complex',
        businessValue: 'high',
        estimatedDays: 15
      },
      {
        id: 'webhook-system',
        name: 'Webhook System',
        description: 'Real-time webhook triggers and event notifications',
        category: 'integration_api',
        icon: 'Zap',
        hasAIEnhancement: false,
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 8
      },
      {
        id: 'third-party-integrations',
        name: 'Third-party Integrations',
        description: 'Pre-built integrations with popular business tools',
        category: 'integration_api',
        icon: 'Link',
        hasAIEnhancement: true,
        aiEnhancements: {
          name: 'Smart Integrations',
          description: 'Automated integration setup and intelligent data mapping',
          capabilities: ['automated_integration', 'intelligent_mapping', 'error_prediction']
        },
        status: 'planned',
        complexity: 'complex',
        businessValue: 'high',
        estimatedDays: 20
      },
      {
        id: 'data-sync',
        name: 'Data Synchronization',
        description: 'Bi-directional data sync with external systems',
        category: 'integration_api',
        icon: 'RefreshCw',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'complex',
        businessValue: 'medium',
        estimatedDays: 12
      },
      {
        id: 'api-security',
        name: 'API Security',
        description: 'Rate limiting, authentication, and access control for APIs',
        category: 'integration_api',
        icon: 'Shield',
        hasAIEnhancement: false,
        status: 'implemented',
        complexity: 'moderate',
        businessValue: 'high',
        estimatedDays: 10
      },
      {
        id: 'integration-marketplace',
        name: 'Integration Marketplace',
        description: 'Browse and install third-party integrations',
        category: 'integration_api',
        icon: 'Store',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 8
      }
    ]
  },

  {
    id: 'collaboration',
    name: 'Collaboration & Communication',
    description: 'Team collaboration and internal communication tools',
    icon: 'Users',
    features: [
      {
        id: 'team-collaboration',
        name: 'Team Collaboration',
        description: 'Shared workspaces and collaborative tools',
        category: 'collaboration',
        icon: 'Users',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 10
      },
      {
        id: 'real-time-chat',
        name: 'Real-time Chat',
        description: 'Internal team messaging and communication',
        category: 'collaboration',
        icon: 'MessageSquare',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 8
      },
      {
        id: 'file-sharing',
        name: 'File Sharing',
        description: 'Secure file upload, sharing, and version control',
        category: 'collaboration',
        icon: 'Upload',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 8
      },
      {
        id: 'comments-annotations',
        name: 'Comments & Annotations',
        description: 'Add comments and annotations to any record or document',
        category: 'collaboration',
        icon: 'MessageCircle',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'simple',
        businessValue: 'medium',
        estimatedDays: 6
      },
      {
        id: 'activity-feeds',
        name: 'Activity Feeds',
        description: 'Real-time activity streams and updates',
        category: 'collaboration',
        icon: 'Activity',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'simple',
        businessValue: 'low',
        estimatedDays: 4
      },
      {
        id: 'shared-calendars',
        name: 'Shared Calendars',
        description: 'Team calendars and meeting coordination',
        category: 'collaboration',
        icon: 'Calendar',
        hasAIEnhancement: false,
        status: 'planned',
        complexity: 'moderate',
        businessValue: 'medium',
        estimatedDays: 8
      }
    ]
  }
];

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export const getConsolidatedFeatureStats = () => {
  const totalFeatures = CONSOLIDATED_FEATURE_CATEGORIES.reduce((sum, cat) => sum + cat.features.length, 0);
  const implementedFeatures = CONSOLIDATED_FEATURE_CATEGORIES.reduce(
    (sum, cat) => sum + cat.features.filter(f => f.status === 'implemented').length, 
    0
  );
  const aiEnhancedFeatures = CONSOLIDATED_FEATURE_CATEGORIES.reduce(
    (sum, cat) => sum + cat.features.filter(f => f.hasAIEnhancement).length, 
    0
  );
  
  return {
    totalFeatures,
    implementedFeatures,
    plannedFeatures: totalFeatures - implementedFeatures,
    aiEnhancedFeatures,
    totalCategories: CONSOLIDATED_FEATURE_CATEGORIES.length,
    categoryBreakdown: CONSOLIDATED_FEATURE_CATEGORIES.map(cat => ({
      name: cat.name,
      count: cat.features.length,
      implemented: cat.features.filter(f => f.status === 'implemented').length,
      aiEnhanced: cat.features.filter(f => f.hasAIEnhancement).length
    }))
  };
};

export const getAllConsolidatedFeatures = (): ConsolidatedFeature[] => {
  return CONSOLIDATED_FEATURE_CATEGORIES.flatMap(category => category.features);
};

export const getFeaturesByCategory = (categoryId: string): ConsolidatedFeature[] => {
  const category = CONSOLIDATED_FEATURE_CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.features : [];
};

export const getImplementedFeatures = (): ConsolidatedFeature[] => {
  return getAllConsolidatedFeatures().filter(feature => feature.status === 'implemented');
};

export const getAIEnhancedFeatures = (): ConsolidatedFeature[] => {
  return getAllConsolidatedFeatures().filter(feature => feature.hasAIEnhancement);
}; 