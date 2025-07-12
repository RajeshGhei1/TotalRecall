import { supabase } from '@/integrations/supabase/client';

interface ModuleAuditResult {
  name: string;
  category: string;
  description: string;
  purpose: string;
  dependencies: string[];
  potentialDuplicates: string[];
  recommendations: string[];
}

// Define clear purpose categories to identify overlaps
const PURPOSE_CATEGORIES = {
  // Core Data Management
  'people_management': ['people', 'contacts', 'users', 'talent'],
  'company_management': ['company', 'companies', 'organization', 'business'],
  'user_admin': ['user', 'admin', 'tenant', 'access', 'permission'],
  'authentication': ['auth', 'login', 'security', 'credential'],
  
  // Business Functions
  'sales_crm': ['sales', 'lead', 'pipeline', 'customer', 'crm'],
  'marketing': ['marketing', 'campaign', 'automation', 'email'],
  'recruitment': ['ats', 'candidate', 'job', 'recruitment', 'hiring'],
  'talent_analytics': ['talent', 'analytics', 'insights', 'reporting'],
  'finance': ['financial', 'finance', 'accounting', 'billing'],
  'operations': ['inventory', 'supply', 'operations', 'logistics'],
  
  // AI & Intelligence
  'ai_core': ['ai', 'artificial', 'intelligence', 'machine', 'learning'],
  'ai_orchestration': ['orchestration', 'workflow', 'automation'],
  'ai_analytics': ['predictive', 'insights', 'analysis', 'intelligence'],
  
  // System & Infrastructure
  'dashboard': ['dashboard', 'overview', 'summary'],
  'forms': ['form', 'builder', 'custom', 'field'],
  'documents': ['document', 'file', 'content'],
  'integration': ['integration', 'api', 'connector', 'sync'],
  'communication': ['communication', 'email', 'notification', 'message']
};

async function auditModulePurposes() {
  console.log('🔍 Starting comprehensive module audit...\n');
  
  try {
    // Fetch all modules from database
    const { data: modules, error } = await supabase
      .from('system_modules')
      .select('name, category, description, dependencies, is_active')
      .order('name');

    if (error) {
      console.error('❌ Error fetching modules:', error);
      return;
    }

    if (!modules || modules.length === 0) {
      console.log('⚠️  No modules found in database');
      return;
    }

    console.log(`📊 Found ${modules.length} modules in database\n`);

    // Group modules by category for analysis (since type field may not be available in types)
    const modulesByCategory = modules.reduce((acc: Record<string, unknown[]>, module: unknown) => {
      const category = module.category || 'uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(module);
      return acc;
    }, {});

    console.log('📈 Module Distribution by Category:');
    Object.entries(modulesByCategory).forEach(([category, categoryModules]: [string, any]) => {
      console.log(`  📁 ${category}: ${categoryModules.length} modules`);
    });
    console.log();

    // Analyze each module for purpose and potential overlaps
    const auditResults: ModuleAuditResult[] = [];
    
    for (const module of modules) {
      const audit = analyzeModulePurpose(module, modules);
      auditResults.push(audit);
    }

    // Generate comprehensive report
    generateAuditReport(auditResults, modulesByCategory);

  } catch (error) {
    console.error('❌ Error during audit:', error);
  }
}

function analyzeModulePurpose(module: unknown, allModules: unknown[]): ModuleAuditResult {
  const name = module.name.toLowerCase();
  const description = (module.description || '').toLowerCase();
  const searchText = `${name} ${description}`;
  
  // Determine primary purpose
  let primaryPurpose = 'unknown';
  let purposeScore = 0;
  
  for (const [purpose, keywords] of Object.entries(PURPOSE_CATEGORIES)) {
    const score = keywords.reduce((count, keyword) => {
      return count + (searchText.includes(keyword) ? 1 : 0);
    }, 0);
    
    if (score > purposeScore) {
      purposeScore = score;
      primaryPurpose = purpose;
    }
  }
  
  // Find potential duplicates
  const potentialDuplicates = allModules
    .filter(m => m.name !== module.name)
    .filter(m => {
      const otherName = m.name.toLowerCase();
      const otherDesc = (m.description || '').toLowerCase();
      const otherText = `${otherName} ${otherDesc}`;
      
      // Check for overlapping keywords
      const moduleKeywords = PURPOSE_CATEGORIES[primaryPurpose as keyof typeof PURPOSE_CATEGORIES] || [];
      const overlap = moduleKeywords.some(keyword => 
        otherText.includes(keyword) && searchText.includes(keyword)
      );
      
      return overlap;
    })
    .map(m => m.name);

  // Generate recommendations
  const recommendations = generateRecommendations(module, potentialDuplicates, primaryPurpose);

  return {
    name: module.name,
    category: module.category,
    description: module.description || '',
    purpose: primaryPurpose,
    dependencies: module.dependencies || [],
    potentialDuplicates,
    recommendations
  };
}

function generateRecommendations(module: unknown, duplicates: string[], purpose: string): string[] {
  const recommendations: string[] = [];
  const name = module.name.toLowerCase();
  
  // Category classification recommendations
  if (!module.category) {
    recommendations.push('❗ Missing category classification - needs to be assigned to a proper category');
  }
  
  // Duplicate handling
  if (duplicates.length > 0) {
    recommendations.push(`⚠️  Potential duplicates found: ${duplicates.join(', ')} - Review for consolidation`);
  }
  
  // Purpose-based recommendations
  if (purpose === 'people_management' && name.includes('user')) {
    recommendations.push('🔄 Consider if this overlaps with User Management - may need consolidation');
  }
  
  if (purpose === 'ai_core' && (name.includes('analytics') || name.includes('orchestration'))) {
    recommendations.push('🤖 Check if this should be split into separate AI modules or consolidated');
  }
  
  if (purpose === 'unknown') {
    recommendations.push('❓ Purpose unclear - needs better description and categorization');
  }
  
  return recommendations;
}

function generateAuditReport(results: ModuleAuditResult[], modulesByCategory: unknown) {
  console.log('=' .repeat(80));
  console.log('📋 COMPREHENSIVE MODULE AUDIT REPORT');
  console.log('=' .repeat(80));
  
  // 1. Potential Duplicates Section
  console.log('\n🔍 POTENTIAL DUPLICATES & OVERLAPS:');
  console.log('-'.repeat(50));
  
  const duplicateGroups = new Map<string, string[]>();
  
  results.forEach(result => {
    if (result.potentialDuplicates.length > 0) {
      const key = [result.name, ...result.potentialDuplicates].sort().join('|');
      if (!duplicateGroups.has(key)) {
        duplicateGroups.set(key, [result.name, ...result.potentialDuplicates]);
      }
    }
  });
  
  if (duplicateGroups.size === 0) {
    console.log('✅ No obvious duplicates found');
  } else {
    Array.from(duplicateGroups.values()).forEach((group, index) => {
      console.log(`\n${index + 1}. Possible Overlap Group:`);
      group.forEach(moduleName => {
        const module = results.find(r => r.name === moduleName);
        console.log(`   • ${moduleName} (${module?.category}) - ${module?.purpose}`);
      });
    });
  }
  
  // 2. Category Classification Issues
  console.log('\n📊 CATEGORY CLASSIFICATION ANALYSIS:');
  console.log('-'.repeat(50));
  
  const uncategorizedModules = results.filter(r => !r.category || r.category === 'uncategorized');
  if (uncategorizedModules.length > 0) {
    console.log(`⚠️  ${uncategorizedModules.length} modules need better categorization:`);
    uncategorizedModules.forEach(module => {
      console.log(`   • ${module.name} - Suggested purpose: ${module.purpose}`);
    });
  } else {
    console.log('✅ All modules have proper categorization');
  }
  
  // 3. Purpose Distribution
  console.log('\n🎯 PURPOSE DISTRIBUTION:');
  console.log('-'.repeat(50));
  
  const purposeCount = new Map<string, number>();
  results.forEach(result => {
    const count = purposeCount.get(result.purpose) || 0;
    purposeCount.set(result.purpose, count + 1);
  });
  
  Array.from(purposeCount.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([purpose, count]) => {
      console.log(`   ${purpose}: ${count} modules`);
    });
  
  // 4. Recommendations Summary
  console.log('\n💡 KEY RECOMMENDATIONS:');
  console.log('-'.repeat(50));
  
  const allRecommendations = results.flatMap(r => r.recommendations);
  const uniqueRecommendations = [...new Set(allRecommendations)];
  
  if (uniqueRecommendations.length === 0) {
    console.log('✅ No major issues found - module architecture looks clean');
  } else {
    uniqueRecommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
  
  // 5. Detailed Module List
  console.log('\n📋 DETAILED MODULE LIST:');
  console.log('-'.repeat(50));
  
  Object.entries(modulesByCategory).forEach(([category, modules]: [string, any]) => {
    if (modules && modules.length > 0) {
      console.log(`\n📁 ${category.toUpperCase()} MODULES (${modules.length}):`);
      modules.forEach((module: unknown) => {
        const result = results.find(r => r.name === module.name);
        console.log(`   • ${module.name} - ${result?.purpose}`);
        if (result?.potentialDuplicates.length > 0) {
          console.log(`     ⚠️  Potential overlaps: ${result.potentialDuplicates.join(', ')}`);
        }
      });
    }
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ Audit complete! Review recommendations above.');
  console.log('='.repeat(80));
}

function getTypeIcon(type: string): string {
  switch (type) {
    case 'super_admin': return '🛡️';
    case 'foundation': return '🏗️';
    case 'business': return '💼';
    default: return '❓';
  }
}

// Run the audit
auditModulePurposes().catch(console.error); 