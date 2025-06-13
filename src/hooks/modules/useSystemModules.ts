
import { useState, useEffect } from 'react';

export interface SystemModule {
  id: string;
  name: string;
  description?: string;
  category: string;
  is_active: boolean;
  version?: string;
  dependencies?: string[];
  default_limits?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Mock data with 26+ modules as requested
const MOCK_MODULES: SystemModule[] = [
  // Core Business Modules (8 modules)
  {
    id: '1',
    name: 'Forms Management',
    description: 'Comprehensive form building and management system',
    category: 'core',
    is_active: true,
    version: '2.1.0',
    dependencies: [],
    default_limits: { max_forms: 100, max_responses: 10000 },
    created_at: '2020-01-15T00:00:00Z',
    updated_at: '2024-11-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Workflow Automation',
    description: 'Advanced workflow automation and process management',
    category: 'core',
    is_active: true,
    version: '1.8.0',
    dependencies: ['Forms Management'],
    default_limits: { max_workflows: 50, max_executions: 5000 },
    created_at: '2020-03-20T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Analytics Dashboard',
    description: 'Real-time analytics and business intelligence',
    category: 'analytics',
    is_active: true,
    version: '3.0.0',
    dependencies: [],
    default_limits: { max_reports: 25, max_data_points: 50000 },
    created_at: '2019-08-10T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'User Management',
    description: 'Complete user and access management system',
    category: 'core',
    is_active: true,
    version: '2.5.0',
    dependencies: [],
    default_limits: { max_users: 1000, max_roles: 20 },
    created_at: '2019-05-15T00:00:00Z',
    updated_at: '2024-09-20T00:00:00Z'
  },
  {
    id: '5',
    name: 'Document Management',
    description: 'Centralized document storage and versioning',
    category: 'productivity',
    is_active: true,
    version: '1.9.0',
    dependencies: ['User Management'],
    default_limits: { max_storage_gb: 100, max_versions: 10 },
    created_at: '2020-07-22T00:00:00Z',
    updated_at: '2024-08-15T00:00:00Z'
  },
  {
    id: '6',
    name: 'Project Management',
    description: 'Agile project management and collaboration',
    category: 'productivity',
    is_active: true,
    version: '2.2.0',
    dependencies: ['User Management', 'Document Management'],
    default_limits: { max_projects: 50, max_tasks: 5000 },
    created_at: '2020-02-10T00:00:00Z',
    updated_at: '2024-11-10T00:00:00Z'
  },
  {
    id: '7',
    name: 'Customer Support',
    description: 'Integrated helpdesk and ticket management',
    category: 'communication',
    is_active: true,
    version: '1.7.0',
    dependencies: ['User Management'],
    default_limits: { max_tickets: 1000, max_agents: 25 },
    created_at: '2020-09-05T00:00:00Z',
    updated_at: '2024-07-30T00:00:00Z'
  },
  {
    id: '8',
    name: 'Reporting Engine',
    description: 'Advanced reporting and data visualization',
    category: 'analytics',
    is_active: true,
    version: '2.8.0',
    dependencies: ['Analytics Dashboard'],
    default_limits: { max_custom_reports: 100, max_scheduled_reports: 20 },
    created_at: '2019-11-20T00:00:00Z',
    updated_at: '2024-12-05T00:00:00Z'
  },

  // Communication & Marketing Modules (6 modules)
  {
    id: '9',
    name: 'Email Marketing',
    description: 'Automated email campaigns and marketing',
    category: 'marketing',
    is_active: true,
    version: '2.3.0',
    dependencies: ['User Management'],
    default_limits: { max_contacts: 10000, max_campaigns: 50 },
    created_at: '2020-04-18T00:00:00Z',
    updated_at: '2024-10-20T00:00:00Z'
  },
  {
    id: '10',
    name: 'SMS Communications',
    description: 'SMS messaging and bulk communications',
    category: 'communication',
    is_active: true,
    version: '1.5.0',
    dependencies: ['User Management'],
    default_limits: { max_sms_monthly: 5000, max_templates: 20 },
    created_at: '2021-01-12T00:00:00Z',
    updated_at: '2024-06-15T00:00:00Z'
  },
  {
    id: '11',
    name: 'Social Media Integration',
    description: 'Multi-platform social media management',
    category: 'marketing',
    is_active: true,
    version: '1.4.0',
    dependencies: [],
    default_limits: { max_accounts: 10, max_posts_monthly: 200 },
    created_at: '2021-03-08T00:00:00Z',
    updated_at: '2024-09-10T00:00:00Z'
  },
  {
    id: '12',
    name: 'Push Notifications',
    description: 'Real-time push notification system',
    category: 'communication',
    is_active: true,
    version: '1.6.0',
    dependencies: ['User Management'],
    default_limits: { max_notifications_daily: 1000, max_devices: 5000 },
    created_at: '2020-12-01T00:00:00Z',
    updated_at: '2024-08-25T00:00:00Z'
  },
  {
    id: '13',
    name: 'Video Conferencing',
    description: 'Integrated video calls and meetings',
    category: 'communication',
    is_active: true,
    version: '1.2.0',
    dependencies: ['User Management'],
    default_limits: { max_participants: 100, max_meeting_hours: 500 },
    created_at: '2021-06-15T00:00:00Z',
    updated_at: '2024-05-20T00:00:00Z'
  },
  {
    id: '14',
    name: 'Live Chat Support',
    description: 'Real-time chat support for customers',
    category: 'communication',
    is_active: true,
    version: '2.0.0',
    dependencies: ['Customer Support'],
    default_limits: { max_concurrent_chats: 50, max_chat_history_days: 365 },
    created_at: '2020-08-30T00:00:00Z',
    updated_at: '2024-11-01T00:00:00Z'
  },

  // Finance & E-commerce Modules (4 modules)
  {
    id: '15',
    name: 'Payment Processing',
    description: 'Secure payment gateway integration',
    category: 'finance',
    is_active: true,
    version: '2.4.0',
    dependencies: [],
    default_limits: { max_transactions_monthly: 10000, max_gateways: 5 },
    created_at: '2019-12-20T00:00:00Z',
    updated_at: '2024-10-15T00:00:00Z'
  },
  {
    id: '16',
    name: 'Invoicing System',
    description: 'Automated invoicing and billing management',
    category: 'finance',
    is_active: true,
    version: '1.8.0',
    dependencies: ['Payment Processing'],
    default_limits: { max_invoices_monthly: 1000, max_clients: 500 },
    created_at: '2020-01-25T00:00:00Z',
    updated_at: '2024-07-10T00:00:00Z'
  },
  {
    id: '17',
    name: 'Expense Management',
    description: 'Employee expense tracking and approval',
    category: 'finance',
    is_active: true,
    version: '1.6.0',
    dependencies: ['User Management'],
    default_limits: { max_expense_reports: 500, max_categories: 20 },
    created_at: '2020-05-10T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z'
  },
  {
    id: '18',
    name: 'E-commerce Platform',
    description: 'Complete online store management',
    category: 'e-commerce',
    is_active: true,
    version: '2.1.0',
    dependencies: ['Payment Processing', 'Invoicing System'],
    default_limits: { max_products: 5000, max_orders_monthly: 2000 },
    created_at: '2020-10-15T00:00:00Z',
    updated_at: '2024-11-20T00:00:00Z'
  },

  // Integration & API Modules (5 modules)
  {
    id: '19',
    name: 'API Gateway',
    description: 'Centralized API management and security',
    category: 'integrations',
    is_active: true,
    version: '3.1.0',
    dependencies: [],
    default_limits: { max_api_calls_daily: 100000, max_endpoints: 50 },
    created_at: '2019-09-01T00:00:00Z',
    updated_at: '2024-12-10T00:00:00Z'
  },
  {
    id: '20',
    name: 'Webhook Manager',
    description: 'Real-time webhook delivery and management',
    category: 'integrations',
    is_active: true,
    version: '1.9.0',
    dependencies: ['API Gateway'],
    default_limits: { max_webhooks: 100, max_retries: 5 },
    created_at: '2020-03-15T00:00:00Z',
    updated_at: '2024-09-05T00:00:00Z'
  },
  {
    id: '21',
    name: 'CRM Integration',
    description: 'Connect with popular CRM platforms',
    category: 'integrations',
    is_active: true,
    version: '2.0.0',
    dependencies: ['API Gateway'],
    default_limits: { max_connections: 10, max_sync_records: 50000 },
    created_at: '2020-06-20T00:00:00Z',
    updated_at: '2024-08-12T00:00:00Z'
  },
  {
    id: '22',
    name: 'Database Connectors',
    description: 'Connect to external databases and data sources',
    category: 'integrations',
    is_active: true,
    version: '1.7.0',
    dependencies: ['API Gateway'],
    default_limits: { max_connections: 5, max_queries_hourly: 1000 },
    created_at: '2020-11-10T00:00:00Z',
    updated_at: '2024-07-22T00:00:00Z'
  },
  {
    id: '23',
    name: 'Cloud Storage Integration',
    description: 'Multi-cloud storage connectivity',
    category: 'integrations',
    is_active: true,
    version: '1.5.0',
    dependencies: ['Document Management'],
    default_limits: { max_providers: 3, max_storage_sync_gb: 500 },
    created_at: '2021-02-05T00:00:00Z',
    updated_at: '2024-06-30T00:00:00Z'
  },

  // Legacy & Specialized Modules (3 modules - some older)
  {
    id: '24',
    name: 'Legacy Data Importer',
    description: 'Import data from legacy systems',
    category: 'utilities',
    is_active: false,
    version: '0.9.0',
    dependencies: [],
    default_limits: { max_import_size_mb: 500, max_import_jobs: 10 },
    created_at: '2018-05-10T00:00:00Z',
    updated_at: '2021-03-15T00:00:00Z'
  },
  {
    id: '25',
    name: 'Audit & Compliance',
    description: 'Comprehensive audit trail and compliance reporting',
    category: 'security',
    is_active: true,
    version: '2.6.0',
    dependencies: ['User Management'],
    default_limits: { audit_retention_days: 2555, max_compliance_reports: 25 },
    created_at: '2019-02-20T00:00:00Z',
    updated_at: '2024-11-30T00:00:00Z'
  },
  {
    id: '26',
    name: 'Backup & Recovery',
    description: 'Automated backup and disaster recovery',
    category: 'security',
    is_active: true,
    version: '1.8.0',
    dependencies: [],
    default_limits: { max_backup_size_gb: 1000, retention_days: 90 },
    created_at: '2019-07-01T00:00:00Z',
    updated_at: '2024-10-05T00:00:00Z'
  },
  {
    id: '27',
    name: 'AI Assistant',
    description: 'Intelligent AI-powered assistant and automation',
    category: 'ai',
    is_active: true,
    version: '1.0.0',
    dependencies: ['Analytics Dashboard', 'Workflow Automation'],
    default_limits: { max_ai_requests_daily: 1000, max_custom_models: 3 },
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z'
  }
];

export const useSystemModules = (activeOnly: boolean = true) => {
  const [data, setData] = useState<SystemModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simulate loading from database
    setTimeout(() => {
      const filteredData = activeOnly 
        ? MOCK_MODULES.filter(module => module.is_active)
        : MOCK_MODULES;
      setData(filteredData);
      setIsLoading(false);
    }, 500);
  }, [activeOnly]);

  const createModule = {
    mutateAsync: async (moduleData: Partial<SystemModule>) => {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newModule: SystemModule = {
        id: Math.random().toString(36).substr(2, 9),
        name: moduleData.name || '',
        description: moduleData.description || '',
        category: moduleData.category || 'core',
        is_active: moduleData.is_active ?? true,
        version: moduleData.version || '1.0.0',
        dependencies: moduleData.dependencies || [],
        default_limits: moduleData.default_limits || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setData(prev => [...prev, newModule]);
      setIsSaving(false);
      return newModule;
    },
    isPending: isSaving
  };

  const updateModule = {
    mutateAsync: async ({ id, updates }: { id: string; updates: Partial<SystemModule> }) => {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(prev => prev.map(module => 
        module.id === id 
          ? { 
              ...module, 
              ...updates, 
              name: updates.name || module.name,
              category: updates.category || module.category,
              updated_at: new Date().toISOString() 
            }
          : module
      ));
      setIsSaving(false);
    },
    isPending: isSaving
  };

  const deleteModule = {
    mutateAsync: async (id: string) => {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(prev => prev.filter(module => module.id !== id));
      setIsSaving(false);
    },
    isPending: isSaving
  };

  return {
    data,
    isLoading,
    createModule,
    updateModule,
    deleteModule
  };
};

export const useSystemModuleById = (moduleId: string) => {
  const [data, setData] = useState<SystemModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (moduleId) {
      setTimeout(() => {
        const module = MOCK_MODULES.find(m => m.id === moduleId);
        setData(module || null);
        setIsLoading(false);
      }, 500);
    }
  }, [moduleId]);

  return { data, isLoading };
};
