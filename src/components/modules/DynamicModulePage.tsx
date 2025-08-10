import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useSystemModules } from '@/hooks/useSystemModules';
import { getDisplayName } from '@/utils/moduleNameMapping';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Blocks, AlertCircle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define modules that have dedicated pages
const DEDICATED_MODULE_PAGES: Record<string, string> = {
  'ats_core': '/superadmin/ats-core',
  'ats-core': '/superadmin/ats-core',
};

const DynamicModulePage = () => {
  const location = useLocation();
  const { data: modules, isLoading } = useSystemModules(true); // Load all modules, not just production
  
  // Debug logging
  console.log('DynamicModulePage triggered for:', location.pathname);
  console.log('DynamicModulePage - modules loaded:', !!modules);
  console.log('DynamicModulePage - isLoading:', isLoading);
  
  // Extract module name from path
  const pathSegments = location.pathname.split('/');
  const moduleSlug = pathSegments[pathSegments.length - 1];
  
  console.log('DynamicModulePage - pathSegments:', pathSegments);
  console.log('DynamicModulePage - moduleSlug:', moduleSlug);
  
  // Check if this module has a dedicated page
  const dedicatedPageRoute = DEDICATED_MODULE_PAGES[moduleSlug];
  if (dedicatedPageRoute && location.pathname !== dedicatedPageRoute) {
    console.log('DynamicModulePage - Redirecting to dedicated page:', dedicatedPageRoute);
    return <Navigate to={dedicatedPageRoute} replace />;
  }
  
  // Find the matching module
  const matchingModule = React.useMemo(() => {
    if (!modules) return null;
    
    return modules.find(module => {
      const moduleRoute = module.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      return moduleRoute === moduleSlug;
    });
  }, [modules, moduleSlug]);

  console.log('DynamicModulePage - matchingModule found:', !!matchingModule);
  if (matchingModule) {
    console.log('DynamicModulePage - module name:', matchingModule.name);
  }

  if (isLoading) {
    console.log('DynamicModulePage - Still loading, showing skeleton');
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // If no matching module found, redirect to dashboard
  if (!matchingModule) {
    console.log('🚨 DynamicModulePage - No matching module found for:', moduleSlug);
    console.log('🚨 DynamicModulePage - Current path:', window.location.pathname);
    console.log('🚨 DynamicModulePage - Available modules:', modules?.map(m => m.name));
    
    // TEMP FIX: Don't redirect test-route or settings, show debug info instead
    if (moduleSlug === 'test-route' || moduleSlug === 'settings') {
      return (
        <div style={{padding: '20px', background: 'orange', margin: '20px'}}>
          <h1>🚨 CAUGHT BY DYNAMIC MODULE PAGE!</h1>
          <p><strong>Module Slug:</strong> {moduleSlug}</p>
          <p><strong>Current Path:</strong> {window.location.pathname}</p>
          <p><strong>This should NOT happen!</strong> {moduleSlug} should be caught by SuperAdminRoutes first.</p>
          <p>This means there's a routing issue in SuperAdminRoutes.</p>
          <hr />
          <p><strong>Expected behavior:</strong> {moduleSlug} should be handled by a specific route in SuperAdminRoutes.tsx</p>
        </div>
      );
    }
    
    console.log('🚨 DynamicModulePage - Redirecting to dashboard');
    return <Navigate to="/superadmin/dashboard" replace />;
  }

  // Check if this module has a dedicated page
  const hasDedicatedPage = DEDICATED_MODULE_PAGES[matchingModule.name] || DEDICATED_MODULE_PAGES[moduleSlug];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Blocks className="h-8 w-8 text-blue-600" />
            {getDisplayName(matchingModule.name)}
          </h1>
          <p className="text-gray-600 mt-2">
            {matchingModule.description || `${getDisplayName(matchingModule.name)} module management interface`}
          </p>
        </div>

        <div className="grid gap-6">
          {/* AI Contribution Card */}
          {matchingModule.ai_level && matchingModule.ai_level !== 'none' && (
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      matchingModule.ai_level === 'high' ? 'bg-red-500' : 
                      matchingModule.ai_level === 'medium' ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`} />
                    🤖 AI Contribution
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`ml-auto ${
                      matchingModule.ai_level === 'high' ? 'bg-red-100 text-red-800 border-red-300' : 
                      matchingModule.ai_level === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 
                      'bg-green-100 text-green-800 border-green-300'
                    }`}
                  >
                    {matchingModule.ai_level?.toUpperCase()} AI Integration
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {matchingModule.ai_description && (
                  <p className="text-gray-700 leading-relaxed">
                    {matchingModule.ai_description}
                  </p>
                )}
                
                {matchingModule.ai_capabilities && matchingModule.ai_capabilities.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">AI Capabilities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {matchingModule.ai_capabilities.map((capability, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="bg-blue-100 text-blue-800 border-blue-300"
                        >
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {matchingModule.ai_features && Object.keys(matchingModule.ai_features).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Key AI Features:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(matchingModule.ai_features).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="p-3 bg-white rounded-lg border border-blue-200">
                          <div className="font-medium text-blue-800 text-sm mb-1">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                          <div className="text-xs text-gray-600">
                            {value as string}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Module Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${matchingModule.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                Module Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-lg font-semibold">
                    {matchingModule.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-lg font-semibold capitalize">
                    {matchingModule.category.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Version</p>
                  <p className="text-lg font-semibold">
                    {matchingModule.version || '1.0.0'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Dependencies</p>
                  <p className="text-lg font-semibold">
                    {matchingModule.dependencies?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dedicated Page Notice */}
          {hasDedicatedPage && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                  Enhanced Interface Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-800">
                      Full Featured Interface Available
                    </p>
                    <p className="text-sm text-blue-700">
                      This module has a dedicated interface with enhanced functionality. 
                      Click on the module name in the navigation to access the full feature set.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Module Configuration Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Module Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">
                    Module Interface Under Development
                  </p>
                  <p className="text-sm text-yellow-700">
                    The specific interface for {getDisplayName(matchingModule.name)} is being developed. 
                    You can manage this module through the Module Development section.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Module Details */}
          {matchingModule.dependencies && matchingModule.dependencies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dependencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {matchingModule.dependencies.map((dep, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm">{getDisplayName(dep)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default DynamicModulePage;
