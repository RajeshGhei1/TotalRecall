
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useSystemModules } from '@/hooks/useSystemModules';
import { getDisplayName } from '@/utils/moduleNameMapping';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Blocks, AlertCircle } from 'lucide-react';

const DynamicModulePage = () => {
  const location = useLocation();
  const { data: modules, isLoading } = useSystemModules(true, 'production');
  
  // Extract module name from path
  const pathSegments = location.pathname.split('/');
  const moduleSlug = pathSegments[pathSegments.length - 1];
  
  // Find the matching module
  const matchingModule = React.useMemo(() => {
    if (!modules) return null;
    
    return modules.find(module => {
      const moduleRoute = module.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      return moduleRoute === moduleSlug;
    });
  }, [modules, moduleSlug]);

  if (isLoading) {
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
    return <Navigate to="/superadmin/dashboard" replace />;
  }

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
