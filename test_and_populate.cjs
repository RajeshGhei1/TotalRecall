const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://mnebxichjszbuzffmesx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZWJ4aWNoanN6YnV6ZmZtZXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3OTIzOTMsImV4cCI6MjA2MjM2ODM5M30.43QB7gpBfT5I22iK-ma2Y4K8htCh5KUILkLHaigo2zs";

// Consolidated modules data
const CONSOLIDATED_MODULES = [
  {
    name: 'System Administration Suite',
    category: 'administration',
    type: 'super_admin',
    description: 'Comprehensive system administration including user management, security policies, and global configuration',
    dependencies: [],
    maturity_status: 'planning',
    ai_level: 'high',
    ai_capabilities: ['Behavioral authentication', 'Intelligent role suggestions', 'Anomaly detection', 'Adaptive permissions'],
    is_active: true,
    version: '1.0.0',
    author: 'System',
    license: 'MIT',
    entry_point: 'index.tsx',
    required_permissions: ['read'],
    subscription_tiers: ['basic', 'pro', 'enterprise'],
    load_order: 100,
    auto_load: false,
    can_unload: true,
    hot_reload: true
  },
  {
    name: 'Module Registry & Deployment',
    category: 'platform',
    type: 'super_admin',
    description: 'Module discovery, registration, deployment, and lifecycle management across the platform',
    dependencies: [],
    maturity_status: 'planning',
    ai_level: 'medium',
    ai_capabilities: ['Intelligent module recommendations', 'Automated dependency resolution', 'Predictive performance analysis'],
    is_active: true,
    version: '1.0.0',
    author: 'System',
    license: 'MIT',
    entry_point: 'index.tsx',
    required_permissions: ['read'],
    subscription_tiers: ['basic', 'pro', 'enterprise'],
    load_order: 100,
    auto_load: false,
    can_unload: true,
    hot_reload: true
  },
  {
    name: 'Enterprise Monitoring & Audit',
    category: 'monitoring',
    type: 'super_admin',
    description: 'System-wide monitoring, audit trails, compliance reporting, and security analytics',
    dependencies: [],
    maturity_status: 'planning',
    ai_level: 'high',
    ai_capabilities: ['Anomaly detection', 'Predictive failure analysis', 'Automated compliance checking', 'Security threat intelligence'],
    is_active: true,
    version: '1.0.0',
    author: 'System',
    license: 'MIT',
    entry_point: 'index.tsx',
    required_permissions: ['read'],
    subscription_tiers: ['basic', 'pro', 'enterprise'],
    load_order: 100,
    auto_load: false,
    can_unload: true,
    hot_reload: true
  },
  {
    name: 'AI Core Foundation',
    category: 'ai_infrastructure',
    type: 'foundation',
    description: 'Core AI infrastructure providing agent orchestration, cognitive services, and machine learning capabilities',
    dependencies: [],
    maturity_status: 'planning',
    ai_level: 'high',
    ai_capabilities: ['Agent orchestration', 'Cognitive processing', 'Knowledge synthesis', 'Decision support', 'Learning algorithms'],
    is_active: true,
    version: '1.0.0',
    author: 'System',
    license: 'MIT',
    entry_point: 'index.tsx',
    required_permissions: ['read'],
    subscription_tiers: ['basic', 'pro', 'enterprise'],
    load_order: 100,
    auto_load: false,
    can_unload: true,
    hot_reload: true
  },
  {
    name: 'Communication Foundation',
    category: 'communication',
    type: 'foundation',
    description: 'Core communication infrastructure for email, messaging, notifications, and multi-channel communication',
    dependencies: [],
    maturity_status: 'planning',
    ai_level: 'medium',
    ai_capabilities: ['Smart template suggestions', 'Communication optimization', 'Sentiment analysis', 'Automated response suggestions'],
    is_active: true,
    version: '1.0.0',
    author: 'System',
    license: 'MIT',
    entry_point: 'index.tsx',
    required_permissions: ['read'],
    subscription_tiers: ['basic', 'pro', 'enterprise'],
    load_order: 100,
    auto_load: false,
    can_unload: true,
    hot_reload: true
  },
  {
    name: 'Integration Foundation',
    category: 'integration_infrastructure',
    type: 'foundation',
    description: 'Core integration infrastructure providing API management, data synchronization, and third-party connectivity',
    dependencies: [],
    maturity_status: 'planning',
    ai_level: 'medium',
    ai_capabilities: ['Intelligent data mapping', 'Automated integration setup', 'Error prediction and resolution', 'Performance optimization'],
    is_active: true,
    version: '1.0.0',
    author: 'System',
    license: 'MIT',
    entry_point: 'index.tsx',
    required_permissions: ['read'],
    subscription_tiers: ['basic', 'pro', 'enterprise'],
    load_order: 100,
    auto_load: false,
    can_unload: true,
    hot_reload: true
  },
  {
    name: 'Analytics Foundation',
    category: 'analytics_infrastructure',
    type: 'foundation',
    description: 'Core analytics infrastructure providing dashboards, reporting, and data visualization capabilities',
    dependencies: [],
    maturity_status: 'planning',
    ai_level: 'high',
    ai_capabilities: ['Automated insights generation', 'Intelligent dashboard layouts', 'Predictive analytics', 'Anomaly detection in data'],
    is_active: true,
    version: '1.0.0',
    author: 'System',
    license: 'MIT',
    entry_point: 'index.tsx',
    required_permissions: ['read'],
    subscription_tiers: ['basic', 'pro', 'enterprise'],
    load_order: 100,
    auto_load: false,
    can_unload: true,
    hot_reload: true
  },
  {
    name: 'Form & Template Foundation',
    category: 'content_infrastructure',
    type: 'foundation',
    description: 'Core form building, template management, and dynamic content creation infrastructure for all business modules',
    dependencies: [],
    maturity_status: 'planning',
    ai_level: 'medium',
    ai_capabilities: ['Smart form field suggestions', 'Automated form layout optimization', 'Intelligent validation rules', 'Template recommendations'],
    is_active: true,
    version: '1.0.0',
    author: 'System',
    license: 'MIT',
    entry_point: 'index.tsx',
    required_permissions: ['read'],
    subscription_tiers: ['basic', 'pro', 'enterprise'],
    load_order: 100,
    auto_load: false,
    can_unload: true,
    hot_reload: true
  },
  {
    name: 'Advanced Business Analytics',
    category: 'analytics',
    type: 'business',
    description: 'Advanced business analytics with AI-powered insights, predictive modeling, and business intelligence',
    dependencies: ['AI Core Foundation', 'Analytics Foundation'],
    maturity_status: 'planning',
    ai_level: 'high',
    ai_capabilities: ['Predictive forecasting', 'Business insights generation', 'Trend analysis', 'Risk assessment', 'Opportunity identification'],
    is_active: true,
    version: '1.0.0',
    author: 'System',
    license: 'MIT',
    entry_point: 'index.tsx',
    required_permissions: ['read'],
    subscription_tiers: ['basic', 'pro', 'enterprise'],
    load_order: 100,
    auto_load: false,
    can_unload: true,
    hot_reload: true
  },
  {
    name: 'Sales & CRM Suite',
    category: 'sales',
    type: 'business',
    description: 'Comprehensive sales and customer relationship management with pipeline tracking and analytics',
    dependencies: ['AI Core Foundation', 'Communication Foundation', 'Analytics Foundation', 'Form & Template Foundation'],
    maturity_status: 'planning',
    ai_level: 'high',
    ai_capabilities: ['Lead scoring algorithms', 'Sales forecasting', 'Customer behavior analysis', 'Opportunity prioritization', 'Churn prediction'],
    is_active: true,
    version: '1.0.0',
    author: 'System',
    license: 'MIT',
    entry_point: 'index.tsx',
    required_permissions: ['read'],
    subscription_tiers: ['basic', 'pro', 'enterprise'],
    load_order: 100,
    auto_load: false,
    can_unload: true,
    hot_reload: true
  },
  {
    name: 'Marketing Automation Suite',
    category: 'marketing',
    type: 'business',
    description: 'Comprehensive marketing automation with campaigns, social media, and market intelligence',
    dependencies: ['Communication Foundation', 'Integration Foundation', 'AI Core Foundation', 'Form & Template Foundation'],
    maturity_status: 'planning',
    ai_level: 'high',
    ai_capabilities: ['Campaign optimization', 'Content personalization', 'Market trend analysis', 'Social media insights', 'Automated segmentation'],
    is_active: true,
    version: '1.0.0',
    author: 'System',
    license: 'MIT',
    entry_point: 'index.tsx',
    required_permissions: ['read'],
    subscription_tiers: ['basic', 'pro', 'enterprise'],
    load_order: 100,
    auto_load: false,
    can_unload: true,
    hot_reload: true
  },
  {
    name: 'Enterprise Integration Suite',
    category: 'integrations',
    type: 'business',
    description: 'Specialized business integrations including LinkedIn, CRM systems, and communication platforms',
    dependencies: ['Integration Foundation', 'Communication Foundation'],
    maturity_status: 'alpha',
    ai_level: 'medium',
    ai_capabilities: ['Intelligent data matching', 'Automated sync optimization', 'Integration health monitoring', 'Smart connector recommendations'],
    is_active: true,
    version: '1.0.0',
    author: 'System',
    license: 'MIT',
    entry_point: 'index.tsx',
    required_permissions: ['read'],
    subscription_tiers: ['basic', 'pro', 'enterprise'],
    load_order: 100,
    auto_load: false,
    can_unload: true,
    hot_reload: true
  },
  {
    name: 'Operations Management Suite',
    category: 'operations',
    type: 'business',
    description: 'Comprehensive operations management including inventory, supply chain, and operational analytics',
    dependencies: ['Analytics Foundation', 'Integration Foundation'],
    maturity_status: 'planning',
    ai_level: 'medium',
    ai_capabilities: ['Demand forecasting', 'Supply chain optimization', 'Operational efficiency analysis', 'Resource optimization'],
    is_active: true,
    version: '1.0.0',
    author: 'System',
    license: 'MIT',
    entry_point: 'index.tsx',
    required_permissions: ['read'],
    subscription_tiers: ['basic', 'pro', 'enterprise'],
    load_order: 100,
    auto_load: false,
    can_unload: true,
    hot_reload: true
  },
  {
    name: 'Financial Operations Suite',
    category: 'finance',
    type: 'business',
    description: 'Financial operations including billing, payments, and financial analytics',
    dependencies: ['Analytics Foundation', 'Integration Foundation'],
    maturity_status: 'planning',
    ai_level: 'medium',
    ai_capabilities: ['Financial forecasting', 'Risk assessment', 'Fraud detection', 'Cost optimization'],
    is_active: true,
    version: '1.0.0',
    author: 'System',
    license: 'MIT',
    entry_point: 'index.tsx',
    required_permissions: ['read'],
    subscription_tiers: ['basic', 'pro', 'enterprise'],
    load_order: 100,
    auto_load: false,
    can_unload: true,
    hot_reload: true
  },
  {
    name: 'Project & Resource Management',
    category: 'project_management',
    type: 'business',
    description: 'Comprehensive project management with resource planning, workflow design, and collaboration tools',
    dependencies: ['AI Core Foundation', 'Communication Foundation', 'Analytics Foundation', 'Form & Template Foundation'],
    maturity_status: 'planning',
    ai_level: 'high',
    ai_capabilities: ['Project timeline optimization', 'Resource allocation optimization', 'Risk prediction', 'Workload balancing', 'Performance insights'],
    is_active: true,
    version: '1.0.0',
    author: 'System',
    license: 'MIT',
    entry_point: 'index.tsx',
    required_permissions: ['read'],
    subscription_tiers: ['basic', 'pro', 'enterprise'],
    load_order: 100,
    auto_load: false,
    can_unload: true,
    hot_reload: true
  }
];

async function testAndPopulate() {
  console.log('🔍 Testing database access and populating modules...');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  try {
    // Test 1: Check if we can read
    console.log('📖 Testing read access...');
    const { data: existingModules, error: readError } = await supabase
      .from('system_modules')
      .select('id, name')
      .limit(5);
    
    if (readError) {
      console.error('❌ Read test failed:', readError.message);
      console.log('💡 Make sure you\'ve run the SQL script in Supabase dashboard!');
      return;
    }
    
    console.log('✅ Read test passed! Found', existingModules?.length || 0, 'existing modules');
    
    // Test 2: Check if modules already exist
    if (existingModules && existingModules.length > 0) {
      console.log('📋 Existing modules:', existingModules.map(m => m.name));
      console.log('⚠️ Modules already exist. Do you want to proceed? (This will skip duplicates)');
    }
    
    // Test 3: Try to insert modules
    console.log('📝 Attempting to insert consolidated modules...');
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (const module of CONSOLIDATED_MODULES) {
      try {
        // Check if module already exists
        const { data: existing } = await supabase
          .from('system_modules')
          .select('id')
          .eq('name', module.name)
          .single();
        
        if (existing) {
          console.log(`⏭️ Skipping ${module.name} (already exists)`);
          skipCount++;
          continue;
        }
        
        // Insert the module
        const { error: insertError } = await supabase
          .from('system_modules')
          .insert([module]);
        
        if (insertError) {
          console.error(`❌ Failed to insert ${module.name}:`, insertError.message);
          errorCount++;
        } else {
          console.log(`✅ Inserted ${module.name}`);
          successCount++;
        }
        
      } catch (moduleError) {
        console.error(`❌ Error with ${module.name}:`, moduleError.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`✅ Successfully inserted: ${successCount} modules`);
    console.log(`⏭️ Skipped (already existed): ${skipCount} modules`);
    console.log(`❌ Failed: ${errorCount} modules`);
    console.log(`📦 Total consolidated modules: ${CONSOLIDATED_MODULES.length}`);
    
    if (successCount > 0) {
      console.log('\n🎉 Database populated successfully!');
      console.log('🔄 Your app should now show real data from the database');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testAndPopulate().catch(console.error);
