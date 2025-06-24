
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSystemModules } from '@/hooks/useSystemModules';
import { groupModulesByCategory } from './utils';

export const useModuleNavigation = () => {
  const { data: modules, isLoading } = useSystemModules(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Group modules by category
  const groupedModules = useMemo(() => groupModulesByCategory(modules), [modules]);

  const toggleCategory = (categoryKey: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleModuleClick = (module: any) => {
    const moduleSlug = module.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Check if module has dedicated page
    if (module.name === 'ats_core' || moduleSlug === 'ats-core' || module.name === 'ATS Core') {
      navigate('/superadmin/ats-core');
    } else if (module.name === 'companies') {
      navigate('/superadmin/companies');
    } else if (module.name === 'people') {
      navigate('/superadmin/people');
    } else {
      // Navigate to dynamic module page
      navigate(`/superadmin/${moduleSlug}`);
    }
  };

  const handleSubComponentClick = (path: string) => {
    navigate(path);
  };

  return {
    modules,
    isLoading,
    groupedModules,
    expandedCategories,
    expandedModules,
    toggleCategory,
    toggleModule,
    handleModuleClick,
    handleSubComponentClick,
  };
};
