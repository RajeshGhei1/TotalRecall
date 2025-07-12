import { createClient } from '@supabase/supabase-js';

// Use the same Supabase configuration as the main application
const SUPABASE_URL = "https://mnebxichjszbuzffmesx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZWJ4aWNoanN6YnV6ZmZtZXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3OTIzOTMsImV4cCI6MjA2MjM2ODM5M30.43QB7gpBfT5I22iK-ma2Y4K8htCh5KUILkLHaigo2zs";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// All missing business modules with CORRECTED category assignments
const MISSING_BUSINESS_MODULES = [
  // 🎯 CRM & SALES (category: 'sales')
  {
    name: 'sales_pipeline',
    category: 'sales',
    type: 'business',
    description: 'Sales pipeline management with opportunities, deals, and forecasting',
    dependencies: ['companies', 'people'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },
  {
    name: 'lead_management',
    category: 'sales',
    type: 'business',
    description: 'Lead capture, scoring, nurturing, and qualification system',
    dependencies: ['companies', 'people'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },
  {
    name: 'customer_lifecycle',
    category: 'sales',
    type: 'business',
    description: 'Customer lifecycle management and retention tracking',
    dependencies: ['companies', 'people'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },

  // 📢 MARKETING (category: 'marketing')
  {
    name: 'marketing_automation',
    category: 'marketing',
    type: 'business',
    description: 'Marketing campaigns, email marketing, and automation workflows',
    dependencies: ['companies', 'people'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },
  {
    name: 'market_intelligence',
    category: 'marketing',
    type: 'business',
    description: 'Market research, competitive analysis, and industry insights',
    dependencies: ['companies'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },

  // 📦 OPERATIONS (category: 'operations')
  {
    name: 'inventory_management',
    category: 'operations',
    type: 'business',
    description: 'Product catalog, stock management, and inventory tracking',
    dependencies: ['companies'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },
  {
    name: 'supply_chain_management',
    category: 'operations',
    type: 'business',
    description: 'Supplier management, procurement, and supply chain optimization',
    dependencies: ['companies', 'inventory_management'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },

  // 💰 FINANCIAL (category: 'finance')
  {
    name: 'financial_operations',
    category: 'finance',
    type: 'business',
    description: 'Billing, invoicing, payment processing, and financial management',
    dependencies: ['companies', 'people'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },
  {
    name: 'purchase_order_processing',
    category: 'finance',
    type: 'business',
    description: 'Purchase order creation, approval workflows, and vendor management',
    dependencies: ['companies', 'financial_operations'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },

  // 🛒 COMMERCE (category: 'commerce')
  {
    name: 'order_management',
    category: 'commerce',
    type: 'business',
    description: 'Order processing, tracking, and management system',
    dependencies: ['companies', 'people', 'inventory_management'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },
  {
    name: 'fulfillment_logistics',
    category: 'commerce',
    type: 'business',
    description: 'Order fulfillment, shipping, and logistics management',
    dependencies: ['order_management', 'inventory_management'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },

  // 🏗️ PROJECT MANAGEMENT (category: 'project_management')
  {
    name: 'project_management',
    category: 'project_management',
    type: 'business',
    description: 'Project planning, task management, and collaboration tools',
    dependencies: ['people'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },
  {
    name: 'resource_planning',
    category: 'project_management',
    type: 'business',
    description: 'Resource allocation, capacity planning, and utilization tracking',
    dependencies: ['people', 'project_management'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },

  // 🔧 SUPPORT & SERVICE (category: 'support')
  {
    name: 'customer_support',
    category: 'support',
    type: 'business',
    description: 'Help desk, ticket management, and customer service tools',
    dependencies: ['companies', 'people'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },
  {
    name: 'service_management',
    category: 'support',
    type: 'business',
    description: 'Service delivery, maintenance, and field service management',
    dependencies: ['companies', 'people'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },

  // 📊 BUSINESS INTELLIGENCE (category: 'analytics')
  {
    name: 'business_intelligence',
    category: 'analytics',
    type: 'business',
    description: 'Advanced business analytics, reporting, and data visualization',
    dependencies: ['companies', 'people'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },
  {
    name: 'predictive_analytics',
    category: 'analytics',
    type: 'business',
    description: 'Predictive modeling, forecasting, and trend analysis',
    dependencies: ['business_intelligence'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },

  // 🔐 COMPLIANCE & GOVERNANCE (category: 'compliance')
  {
    name: 'compliance_management',
    category: 'compliance',
    type: 'business',
    description: 'Regulatory compliance, audit trails, and governance tools',
    dependencies: ['companies', 'people'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },
  {
    name: 'quality_management',
    category: 'compliance',
    type: 'business',
    description: 'Quality assurance, testing, and continuous improvement',
    dependencies: [],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },

  // 🔌 INTEGRATION & AUTOMATION (category: 'integration')
  {
    name: 'integration_hub',
    category: 'integration',
    type: 'business',
    description: 'Third-party integrations, API management, and data synchronization',
    dependencies: [],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },
  {
    name: 'workflow_engine',
    category: 'integration',
    type: 'business',
    description: 'Business process automation and workflow management',
    dependencies: [],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },

  // 📚 KNOWLEDGE & TRAINING (category: 'knowledge')
  {
    name: 'knowledge_management',
    category: 'knowledge',
    type: 'business',
    description: 'Document management, knowledge base, and information sharing',
    dependencies: ['people'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  },
  {
    name: 'training_management',
    category: 'knowledge',
    type: 'business',
    description: 'Employee training, certification tracking, and skill development',
    dependencies: ['people'],
    maturity_status: 'planning' as const,
    development_stage: {
      stage: 'planning',
      progress: 0,
      milestones: [],
      requirements: ['requirements_definition', 'ui_design', 'development', 'testing']
    }
  }
];

async function checkExistingModules() {
  const { data, error } = await supabase
    .from('system_modules')
    .select('name');
  
  if (error) {
    console.error('Error fetching existing modules:', error);
    return [];
  }
  
  return data.map((m: unknown) => m.name);
}

async function registerModule(moduleData: any) {
  const moduleToCreate = {
    name: moduleData.name,
    category: moduleData.category,
    type: moduleData.type,
    description: moduleData.description,
    is_active: true,
    version: '1.0.0',
    dependencies: moduleData.dependencies || [],
    maturity_status: moduleData.maturity_status,
    development_stage: moduleData.development_stage,
    default_limits: {},
    author: 'System',
    license: 'MIT',
    entry_point: 'index.tsx',
    required_permissions: ['read'],
    subscription_tiers: ['basic', 'pro', 'enterprise'],
    load_order: 100,
    auto_load: false,
    can_unload: true,
    hot_reload: true
  };

  const { error } = await supabase
    .from('system_modules')
    .insert(moduleToCreate);

  if (error) {
    console.error(`Error registering module ${moduleData.name}:`, error);
    return false;
  } else {
    console.log(`✅ Registered new module: ${moduleData.name} (${moduleData.category})`);
    return true;
  }
}

async function main() {
  console.log('🚀 Starting to register missing business modules with CORRECTED categories...');
  
  const existingModules = await checkExistingModules();
  console.log(`📊 Found ${existingModules.length} existing modules`);
  
  const modulesToAdd = MISSING_BUSINESS_MODULES.filter(
    module => !existingModules.includes(module.name)
  );
  
  console.log(`📦 Need to add ${modulesToAdd.length} new modules`);
  
  if (modulesToAdd.length === 0) {
    console.log('✨ All business modules are already registered!');
    return;
  }
  
  console.log('\n📋 Modules to be registered by category:');
  const modulesByCategory = modulesToAdd.reduce((acc, module) => {
    if (!acc[module.category]) acc[module.category] = [];
    acc[module.category].push(module.name);
    return acc;
  }, {} as Record<string, string[]>);
  
  Object.entries(modulesByCategory).forEach(([category, modules]) => {
    console.log(`  ${category}: ${modules.join(', ')}`);
  });
  
  let successCount = 0;
  let failCount = 0;
  
  for (const moduleData of modulesToAdd) {
    const success = await registerModule(moduleData);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Small delay to avoid overwhelming the database
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n🎉 Module registration complete!`);
  console.log(`✅ Successfully registered: ${successCount} modules`);
  console.log(`❌ Failed to register: ${failCount} modules`);
  
  if (successCount > 0) {
    console.log(`\n🔄 Please refresh your browser to see the new modules in the navigation!`);
    console.log(`📂 Modules are now properly categorized and will appear grouped by category.`);
  }
}

// Run the script
main().catch(console.error); 