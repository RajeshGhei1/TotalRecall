
// Normalize module name to match mapping keys
export const normalizeModuleName = (moduleName: string): string => {
  return moduleName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

// Group modules by category
export const groupModulesByCategory = (modules: any[]) => {
  if (!modules) return {};
  
  const grouped: Record<string, any[]> = {};
  
  modules.forEach(module => {
    let category = 'core_system'; // default category
    
    // Categorize modules based on their names and functionality
    const moduleName = module.name.toLowerCase();
    
    if (moduleName.includes('ats') || moduleName.includes('candidate') || 
        moduleName.includes('job') || moduleName.includes('recruitment') ||
        moduleName.includes('interview') || moduleName.includes('talent')) {
      category = 'recruitment';
    } else if (moduleName.includes('company') || moduleName.includes('people') ||
               moduleName.includes('business')) {
      category = 'business';
    } else if (moduleName.includes('analytic') || moduleName.includes('report') ||
               moduleName.includes('insight') || moduleName.includes('metric')) {
      category = 'analytics';
    } else if (moduleName.includes('email') || moduleName.includes('notification') ||
               moduleName.includes('communication') || moduleName.includes('collaboration')) {
      category = 'communication';
    } else if (moduleName.startsWith('ai_analytics')) {
      category = 'ai_analytics';
    } else if (moduleName.startsWith('ai_automation')) {
      category = 'ai_automation';
    } else if (moduleName.startsWith('ai_cognitive')) {
      category = 'ai_cognitive';
    } else if (moduleName.startsWith('ai_core')) {
      category = 'ai_core';
    } else if (moduleName.startsWith('ai_knowledge')) {
      category = 'ai_knowledge';
    } else if (moduleName.includes('ai') || moduleName.includes('smart') ||
               moduleName.includes('predict')) {
      category = 'ai_tools';
    }
    
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(module);
  });
  
  return grouped;
};
