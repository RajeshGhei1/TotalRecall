
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevModules } from '@/hooks/useDevModules';
import { LoadedModule } from '@/types/modules';
import { SystemModule } from '@/hooks/useSystemModules';
import ModuleSettingsDialog from '@/components/superadmin/settings/modules/ModuleSettingsDialog';
import DevelopmentModulesDashboardHeader from './dashboard/DevelopmentModulesDashboardHeader';
import ModuleCard from './dashboard/ModuleCard';
import ModulePreview from './dashboard/ModulePreview';
import ModuleLoadingState from './dashboard/ModuleLoadingState';
import { CATEGORY_CONFIG, TYPE_CONFIG } from '@/components/layout/moduleNavigation/constants';
import { ChevronDown, ChevronRight, Blocks, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ViewMode = 'grid' | 'list';

const DevelopmentModulesDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { loadedModules, isLoading, refreshModules } = useDevModules();
  const [previewingModule, setPreviewingModule] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [selectedModuleForSettings, setSelectedModuleForSettings] = useState<SystemModule | null>(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all'); // Add type filter
  
  // Filter modules by type first
  const filteredModules = useMemo(() => {
    if (!loadedModules) return [];
    if (selectedTypeFilter === 'all') return loadedModules;
    
    return loadedModules.filter(module => {
      // The type information is not in manifest, but we need to classify based on module properties
      // For now, use fallback classification logic
      const name = module.manifest.name.toLowerCase();
      
      if (selectedTypeFilter === 'super_admin') {
        return name.includes('admin') || name.includes('tenant') || name.includes('user') || 
               name.includes('global') || name.includes('security') || name.includes('audit') ||
               name.includes('setting');
      }
      
      if (selectedTypeFilter === 'foundation') {
        return name.includes('companies') || name.includes('people') || name.includes('ai') || 
               name.includes('core') || name.includes('talent_database') || name.includes('authentication') ||
               module.manifest.category?.includes('ai');
      }
      
      // Default to business type
      return selectedTypeFilter === 'business';
    });
  }, [loadedModules, selectedTypeFilter]);

  // Group filtered modules by category
  const groupedModules = useMemo(() => {
    if (!filteredModules) return {};
    
    const grouped: Record<string, LoadedModule[]> = {};
    
    filteredModules.forEach(module => {
      let category = 'core_system'; // default category
      
      // Use the database category if it exists
      if (module.manifest.category && module.manifest.category.trim() !== '') {
        category = module.manifest.category.toLowerCase().replace(/[^a-z0-9]/g, '_');
      }
      
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(module);
    });
    
    return grouped;
  }, [filteredModules]);

  // Initialize expanded categories with all categories collapsed by default
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryKey: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  const handlePreviewModule = (moduleId: string) => {
    setPreviewingModule(moduleId);
  };

  const handleClosePreview = () => {
    setPreviewingModule(null);
  };

  const handleEditModuleCode = (moduleId: string, moduleName: string) => {
    navigate('/superadmin/module-development', { 
      state: { action: 'edit', moduleId: moduleId, moduleName: moduleName } 
    });
  };

  const handleOpenSettings = (module: LoadedModule) => {
    // Convert LoadedModule to SystemModule format for the settings dialog
    const systemModule: SystemModule = {
      id: module.manifest.id,
      name: module.manifest.name,
      category: module.manifest.category as unknown,
      description: module.manifest.description,
      version: module.manifest.version,
      is_active: module.status === 'loaded',
      dependencies: module.manifest.dependencies,
      default_limits: {},
      created_at: module.loadedAt.toISOString(),
      updated_at: module.loadedAt.toISOString()
    };
    
    setSelectedModuleForSettings(systemModule);
    setSettingsDialogOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsDialogOpen(false);
    setSelectedModuleForSettings(null);
  };

  const handlePromotionSuccess = () => {
    // Refresh modules after successful promotion
    refreshModules();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <DevelopmentModulesDashboardHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefreshModules={refreshModules}
      />

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by Type:</span>
        </div>
        <Select value={selectedTypeFilter} onValueChange={setSelectedTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select module type..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(TYPE_CONFIG).map(([typeKey, typeConfig]) => (
              <SelectItem key={typeKey} value={typeKey}>
                {typeConfig.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setExpandedCategories(new Set(Object.keys(groupedModules)))}
        >
          Expand All
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setExpandedCategories(new Set())}
        >
          Collapse All
        </Button>
      </div>

      {/* Preview Section */}
      {previewingModule && (
        <ModulePreview
          moduleId={previewingModule}
          onClose={handleClosePreview}
        />
      )}

      {/* Loading State */}
      {isLoading && <ModuleLoadingState />}

      {/* Module List - Grouped by Category */}
      {!isLoading && !previewingModule && (
        <div className="space-y-6">
          {Object.entries(groupedModules).map(([categoryKey, categoryModules]) => {
            const categoryConfig = CATEGORY_CONFIG[categoryKey as keyof typeof CATEGORY_CONFIG];
            const CategoryIcon = categoryConfig?.icon || Blocks;
            const isCategoryExpanded = expandedCategories.has(categoryKey);
            
            return (
              <div key={categoryKey} className="space-y-4">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(categoryKey)}
                  className="flex items-center justify-between w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CategoryIcon className="h-5 w-5 text-gray-600" />
                    <span className="text-lg font-semibold text-gray-900">
                      {categoryConfig?.name || categoryKey}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium">
                      {categoryModules.length} modules
                    </span>
                    {isCategoryExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </button>

                {/* Category Modules */}
                {isCategoryExpanded && (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                    {categoryModules.map((module) => (
                      <ModuleCard
                        key={module.manifest.id}
                        module={module}
                        viewMode={viewMode}
                        onPreview={handlePreviewModule}
                        onEditCode={handleEditModuleCode}
                        onOpenSettings={handleOpenSettings}
                        onPromotionSuccess={handlePromotionSuccess}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Module Settings Dialog */}
      {selectedModuleForSettings && (
        <ModuleSettingsDialog
          open={settingsDialogOpen}
          onOpenChange={setSettingsDialogOpen}
          module={selectedModuleForSettings}
        />
      )}
    </div>
  );
};

export default DevelopmentModulesDashboard;
