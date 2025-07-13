import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSystemModules, SystemModule } from '@/hooks/useSystemModules';
import { groupModulesByType } from './utils';

export const useModuleNavigation = () => {
  // Fetch ALL modules to show complete ecosystem visibility
  const { data: modules, isLoading } = useSystemModules(false); // false = get all modules
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

  // Smart navigation based on module status
  const handleModuleClick = (module: SystemModule) => {
    const moduleSlug = module.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Smart navigation logic
    if (module.maturity_status === 'production' && module.is_active) {
      // Navigate to live production module
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
    } else {
      // Navigate to development environment for non-production modules
      navigate(`/superadmin/module-development?module=${module.id}&focus=${moduleSlug}`);
    }
  };

  const handleSubComponentClick = (path: string) => {
    navigate(path);
  };

  // Get module status information
  const getModuleStatus = (module: SystemModule) => {
    if (!module.is_active) {
      return {
        status: 'inactive',
        color: 'bg-red-500',
        label: 'Inactive',
        description: 'Module is disabled'
      };
    }
    
    switch(module.maturity_status) {
      case 'production':
        return {
          status: 'production',
          color: 'bg-green-500',
          label: 'Live',
          description: 'Ready to use'
        };
      case 'beta':
        return {
          status: 'beta',
          color: 'bg-yellow-500',
          label: 'Testing',
          description: 'In beta testing'
        };
      case 'alpha':
        return {
          status: 'alpha',
          color: 'bg-orange-500',
          label: 'Development',
          description: 'In active development'
        };
      case 'planning':
        return {
          status: 'planning',
          color: 'bg-blue-500',
          label: 'Planning',
          description: 'In planning stage'
        };
      default:
        return {
          status: 'unknown',
          color: 'bg-gray-500',
          label: 'Unknown',
          description: 'Status unknown'
        };
    }
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
    getModuleStatus,
  };
};
