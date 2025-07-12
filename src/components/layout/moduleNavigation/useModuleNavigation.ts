import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSystemModules } from '@/hooks/useSystemModules';
import { groupModulesByType } from './utils';

export const useModuleNavigation = () => {
  const { data: modules, isLoading } = useSystemModules(true);
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Group modules by type
  const groupedModules = useMemo(() => groupModulesByType(modules), [modules]);

  const toggleType = (typeKey: string) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(typeKey)) {
      newExpanded.delete(typeKey);
    } else {
      newExpanded.add(typeKey);
    }
    setExpandedTypes(newExpanded);
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
    } else if (module.name === 'ai_analytics' || moduleSlug === 'ai-analytics') {
      navigate('/superadmin/ai-analytics');
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
    expandedTypes,
    expandedModules,
    toggleType,
    toggleModule,
    handleModuleClick,
    handleSubComponentClick,
  };
};
