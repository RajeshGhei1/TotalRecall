const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://mnebxichjszbuzffmesx.supabase.co";
// Using service role key to bypass RLS for population
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZWJ4aWNoanN6YnV6ZmZtZXN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Njc5MjM5MywiZXhwIjoyMDYyMzY4MzkzfQ.xrn6nQrKnGsGN5KMhQFNTfBPKjNOoLCPmQsKGVVYZo0";

// Consolidated modules data
const CONSOLIDATED_MODULES = [
  {
    name: 'System Administration Suite',
    category: 'administration',
    description: 'Comprehensive system administration tools including tenant management, user administration, and system configuration.',
    maturity_status: 'planning',
    module_type: 'super_admin',
    features: [
      'Tenant Management',
      'User Administration',
      'System Configuration',
      'Security Management',
      'Audit Logging',
      'Backup Management',
      'Performance Monitoring',
      'System Health Checks'
    ],
    ai_capabilities: [
      'Intelligent System Monitoring',
      'Predictive Maintenance',
      'Anomaly Detection',
      'Automated Alerting',
      'Smart Resource Allocation'
    ],
    dependencies: [],
    required_permissions: ['super_admin'],
    subscription_tiers: ['enterprise']
  },
  {
    name: 'Module Registry & Deployment',
    category: 'development',
    description: 'Central registry for all modules with deployment pipeline, version control, and dependency management.',
    maturity_status: 'planning',
    module_type: 'super_admin',
    features: [
      'Module Registry',
      'Deployment Pipeline',
      'Version Control',
      'Dependency Management',
      'Code Quality Checks',
      'Automated Testing',
      'Rollback Capabilities',
      'Performance Tracking'
    ],
    ai_capabilities: [
      'Code Analysis',
      'Dependency Conflict Detection',
      'Automated Testing',
      'Performance Optimization',
      'Smart Deployment Scheduling'
    ],
    dependencies: [],
    required_permissions: ['super_admin'],
    subscription_tiers: ['enterprise']
  },
  {
    name: 'Enterprise Monitoring & Audit',
    category: 'monitoring',
    description: 'Enterprise-grade monitoring, logging, and audit capabilities for compliance and security.',
    maturity_status: 'planning',
    module_type: 'super_admin',
    features: [
      'Real-time Monitoring',
      'Audit Logging',
      'Compliance Reporting',
      'Security Analytics',
      'Performance Metrics',
      'Alert Management',
      'Incident Response',
      'Forensic Analysis'
    ],
    ai_capabilities: [
      'Threat Detection',
      'Anomaly Analysis',
      'Predictive Analytics',
      'Automated Incident Response',
      'Compliance Monitoring'
    ],
    dependencies: [],
    required_permissions: ['super_admin'],
    subscription_tiers: ['enterprise']
  },
  {
    name: 'AI Core Foundation',
    category: 'ai',
    description: 'Core AI infrastructure including model management, orchestration, and intelligent decision-making capabilities.',
    maturity_status: 'planning',
    module_type: 'foundation',
    features: [
      'AI Model Management',
      'Orchestration Engine',
      'Decision Intelligence',
      'Learning Systems',
      'Pattern Recognition',
      'Behavioral Analysis',
      'Predictive Analytics',
      'Automated Workflows'
    ],
    ai_capabilities: [
      'Multi-Model Orchestration',
      'Intelligent Decision Making',
      'Adaptive Learning',
      'Pattern Analysis',
      'Behavioral Insights',
      'Predictive Modeling',
      'Automated Optimization',
      'Context-Aware Processing'
    ],
    dependencies: [],
    required_permissions: ['admin', 'user'],
    subscription_tiers: ['professional', 'enterprise']
  },
  {
    name: 'Communication Foundation',
    category: 'communication',
    description: 'Unified communication platform with email management, real-time collaboration, and AI-powered responses.',
    maturity_status: 'planning',
    module_type: 'foundation',
    features: [
      'Email Management',
      'Real-time Collaboration',
      'Message Threading',
      'Notification System',
      'Communication Analytics',
      'Template Management',
      'Auto-responses',
      'Integration Hub'
    ],
    ai_capabilities: [
      'Smart Email Responses',
      'Content Generation',
      'Sentiment Analysis',
      'Language Processing',
      'Communication Optimization',
      'Automated Scheduling',
      'Response Prioritization'
    ],
    dependencies: [],
    required_permissions: ['admin', 'user'],
    subscription_tiers: ['basic', 'professional', 'enterprise']
  },
  {
    name: 'Integration Foundation',
    category: 'integration',
    description: 'Comprehensive integration platform with API management, webhook handling, and third-party connectors.',
    maturity_status: 'planning',
    module_type: 'foundation',
    features: [
      'API Management',
      'Webhook Processing',
      'Third-party Connectors',
      'Data Synchronization',
      'Integration Monitoring',
      'Error Handling',
      'Rate Limiting',
      'Security Controls'
    ],
    ai_capabilities: [
      'Smart Data Mapping',
      'Automated Error Recovery',
      'Integration Optimization',
      'Pattern Recognition',
      'Performance Monitoring',
      'Predictive Scaling'
    ],
    dependencies: [],
    required_permissions: ['admin', 'user'],
    subscription_tiers: ['professional', 'enterprise']
  },
  {
    name: 'Analytics Foundation',
    category: 'analytics',
    description: 'Advanced analytics platform with reporting, dashboards, and business intelligence capabilities.',
    maturity_status: 'planning',
    module_type: 'foundation',
    features: [
      'Advanced Reporting',
      'Interactive Dashboards',
      'Data Visualization',
      'Business Intelligence',
      'Custom Metrics',
      'Trend Analysis',
      'Predictive Analytics',
      'Real-time Insights'
    ],
    ai_capabilities: [
      'Automated Insights',
      'Trend Prediction',
      'Anomaly Detection',
      'Smart Recommendations',
      'Behavioral Analytics',
      'Predictive Modeling',
      'Performance Optimization'
    ],
    dependencies: [],
    required_permissions: ['admin', 'user'],
    subscription_tiers: ['professional', 'enterprise']
  },
  {
    name: 'Form & Template Foundation',
    category: 'forms',
    description: 'Dynamic form builder with smart templates, conditional logic, and automated processing.',
    maturity_status: 'planning',
    module_type: 'foundation',
    features: [
      'Dynamic Form Builder',
      'Smart Templates',
      'Conditional Logic',
      'Form Analytics',
      'Automated Processing',
      'Integration Capabilities',
      'Response Management',
      'Validation Rules'
    ],
    ai_capabilities: [
      'Smart Form Generation',
      'Automated Validation',
      'Response Analysis',
      'Form Optimization',
      'User Experience Enhancement',
      'Content Suggestions'
    ],
    dependencies: [],
    required_permissions: ['admin', 'user'],
    subscription_tiers: ['basic', 'professional', 'enterprise']
  },
  {
    name: 'Advanced Business Analytics',
    category: 'analytics',
    description: 'Enterprise business analytics with talent insights, performance metrics, and predictive modeling.',
    maturity_status: 'planning',
    module_type: 'business',
    features: [
      'Talent Analytics',
      'Performance Metrics',
      'Business Intelligence',
      'Predictive Modeling',
      'Custom Reports',
      'KPI Tracking',
      'Trend Analysis',
      'Benchmarking'
    ],
    ai_capabilities: [
      'Predictive Analytics',
      'Talent Insights',
      'Performance Optimization',
      'Behavioral Analysis',
      'Market Intelligence',
      'Competitive Analysis'
    ],
    dependencies: ['analytics-foundation'],
    required_permissions: ['admin', 'user'],
    subscription_tiers: ['professional', 'enterprise']
  },
  {
    name: 'Sales & CRM Suite',
    category: 'sales',
    description: 'Comprehensive CRM with pipeline management, lead tracking, and sales automation.',
    maturity_status: 'planning',
    module_type: 'business',
    features: [
      'Pipeline Management',
      'Lead Tracking',
      'Contact Management',
      'Sales Automation',
      'Opportunity Tracking',
      'Quote Management',
      'Deal Analytics',
      'Customer Insights'
    ],
    ai_capabilities: [
      'Lead Scoring',
      'Sales Forecasting',
      'Customer Insights',
      'Automated Follow-ups',
      'Deal Recommendations',
      'Pipeline Optimization'
    ],
    dependencies: ['communication-foundation', 'analytics-foundation'],
    required_permissions: ['admin', 'user'],
    subscription_tiers: ['professional', 'enterprise']
  },
  {
    name: 'Marketing Automation Suite',
    category: 'marketing',
    description: 'Marketing automation platform with campaign management, lead nurturing, and performance tracking.',
    maturity_status: 'planning',
    module_type: 'business',
    features: [
      'Campaign Management',
      'Lead Nurturing',
      'Email Marketing',
      'Social Media Integration',
      'Content Management',
      'Performance Tracking',
      'A/B Testing',
      'Marketing Analytics'
    ],
    ai_capabilities: [
      'Campaign Optimization',
      'Content Personalization',
      'Audience Segmentation',
      'Performance Prediction',
      'Automated Scheduling',
      'Sentiment Analysis'
    ],
    dependencies: ['communication-foundation', 'analytics-foundation'],
    required_permissions: ['admin', 'user'],
    subscription_tiers: ['professional', 'enterprise']
  },
  {
    name: 'Enterprise Integration Suite',
    category: 'integration',
    description: 'Enterprise integration platform with API management, data synchronization, and system connectors.',
    maturity_status: 'planning',
    module_type: 'business',
    features: [
      'API Management',
      'Data Synchronization',
      'System Connectors',
      'Workflow Automation',
      'Integration Monitoring',
      'Error Handling',
      'Security Controls',
      'Performance Optimization'
    ],
    ai_capabilities: [
      'Smart Data Mapping',
      'Automated Error Recovery',
      'Integration Optimization',
      'Pattern Recognition',
      'Performance Monitoring',
      'Predictive Scaling'
    ],
    dependencies: ['integration-foundation'],
    required_permissions: ['admin'],
    subscription_tiers: ['enterprise']
  },
  {
    name: 'Operations Management Suite',
    category: 'operations',
    description: 'Operations management platform with workflow automation, resource planning, and process optimization.',
    maturity_status: 'planning',
    module_type: 'business',
    features: [
      'Workflow Automation',
      'Resource Planning',
      'Process Optimization',
      'Task Management',
      'Performance Monitoring',
      'Quality Control',
      'Compliance Tracking',
      'Operational Analytics'
    ],
    ai_capabilities: [
      'Process Optimization',
      'Resource Allocation',
      'Performance Prediction',
      'Quality Insights',
      'Automated Scheduling',
      'Efficiency Analysis'
    ],
    dependencies: ['analytics-foundation'],
    required_permissions: ['admin', 'user'],
    subscription_tiers: ['professional', 'enterprise']
  },
  {
    name: 'Financial Operations Suite',
    category: 'finance',
    description: 'Financial management platform with billing, invoicing, payment processing, and financial analytics.',
    maturity_status: 'planning',
    module_type: 'business',
    features: [
      'Billing Management',
      'Invoice Processing',
      'Payment Processing',
      'Financial Analytics',
      'Budget Planning',
      'Expense Tracking',
      'Revenue Management',
      'Financial Reporting'
    ],
    ai_capabilities: [
      'Financial Forecasting',
      'Expense Optimization',
      'Revenue Predictions',
      'Fraud Detection',
      'Automated Reconciliation',
      'Budget Recommendations'
    ],
    dependencies: ['analytics-foundation'],
    required_permissions: ['admin'],
    subscription_tiers: ['professional', 'enterprise']
  },
  {
    name: 'Project & Resource Management',
    category: 'project',
    description: 'Project management platform with resource allocation, timeline tracking, and collaboration tools.',
    maturity_status: 'planning',
    module_type: 'business',
    features: [
      'Project Planning',
      'Resource Allocation',
      'Timeline Tracking',
      'Collaboration Tools',
      'Task Management',
      'Progress Monitoring',
      'Risk Management',
      'Project Analytics'
    ],
    ai_capabilities: [
      'Project Optimization',
      'Resource Recommendations',
      'Timeline Predictions',
      'Risk Assessment',
      'Performance Insights',
      'Automated Scheduling'
    ],
    dependencies: ['communication-foundation', 'analytics-foundation'],
    required_permissions: ['admin', 'user'],
    subscription_tiers: ['professional', 'enterprise']
  }
];

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testAndPopulate() {
  console.log('🔍 Testing database access and populating modules...');
  
  try {
    // Test read access
    console.log('📖 Testing read access...');
    const { data: existingModules, error: readError } = await supabase
      .from('system_modules')
      .select('*');
    
    if (readError) {
      console.error('❌ Read test failed:', readError);
      return;
    }
    
    console.log(`✅ Read test passed! Found ${existingModules?.length || 0} existing modules`);
    
    // Populate modules
    console.log('📝 Attempting to insert consolidated modules...');
    let successCount = 0;
    let skipCount = 0;
    let failCount = 0;
    
    for (const module of CONSOLIDATED_MODULES) {
      // Check if module already exists
      const exists = existingModules?.some(existing => existing.name === module.name);
      
      if (exists) {
        console.log(`⏭️ Skipping ${module.name} - already exists`);
        skipCount++;
        continue;
      }
      
      // Insert module
      const { error: insertError } = await supabase
        .from('system_modules')
        .insert([module]);
      
      if (insertError) {
        console.error(`❌ Failed to insert ${module.name}:`, insertError.message);
        failCount++;
      } else {
        console.log(`✅ Successfully inserted ${module.name}`);
        successCount++;
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`✅ Successfully inserted: ${successCount} modules`);
    console.log(`⏭️ Skipped (already existed): ${skipCount} modules`);
    console.log(`❌ Failed: ${failCount} modules`);
    console.log(`📦 Total consolidated modules: ${CONSOLIDATED_MODULES.length}`);
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

testAndPopulate(); 