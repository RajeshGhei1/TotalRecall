import React, { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionPlans } from '@/hooks/subscriptions/useSubscriptionPlans';
import { useModulePermissionsSummary } from '@/hooks/subscriptions/useModulePermissionsSummary';
import { useSystemModules } from '@/hooks/useSystemModules';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Zap, Building, Shield, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const AppSubscription: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appName = searchParams.get('app');
  const { data: modules = [], isLoading: modulesLoading } = useSystemModules(false);
  const { plans, isLoading: plansLoading } = useSubscriptionPlans();

  // Find the app/module by name (handle various formats)
  const selectedApp = useMemo(() => {
    if (!appName) return null;
    
    const normalizedAppName = appName.toLowerCase().trim();
    
    // Try exact match first
    let app = modules.find(m => 
      m.name.toLowerCase() === normalizedAppName
    );
    
    // Try normalized match (replace special chars with hyphens)
    if (!app) {
      app = modules.find(m => 
        m.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === normalizedAppName.replace(/[^a-z0-9]/g, '-')
      );
    }
    
    // Try partial match (app name contains the search term or vice versa)
    if (!app) {
      app = modules.find(m => {
        const moduleName = m.name.toLowerCase();
        return moduleName.includes(normalizedAppName) || normalizedAppName.includes(moduleName);
      });
    }
    
    return app || null;
  }, [appName, modules]);

  // Check if user has access to this app
  const { data: hasAccess, isLoading: checkingAccess } = useQuery({
    queryKey: ['app-access', user?.id, selectedApp?.name],
    queryFn: async () => {
      if (!user || !selectedApp) return false;
      
      // Get user's tenant
      const { data: tenantData } = await supabase
        .from('user_tenants')
        .select('tenant_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!tenantData?.tenant_id) return false;

      // Check if tenant has subscription with this module enabled
      const { data: subscription } = await supabase
        .from('tenant_subscriptions')
        .select(`
          *,
          subscription_plans!inner(
            id,
            name
          )
        `)
        .eq('tenant_id', tenantData.tenant_id)
        .eq('status', 'active')
        .maybeSingle();

      if (!subscription) return false;

      // Check module permissions
      const { data: permission } = await supabase
        .from('module_permissions')
        .select('*')
        .eq('plan_id', subscription.plan_id)
        .eq('module_name', selectedApp.name)
        .eq('is_enabled', true)
        .maybeSingle();

      return !!permission;
    },
    enabled: !!user && !!selectedApp
  });

  // Filter active plans
  const activePlans = useMemo(() => {
    return plans.filter(plan => plan.is_active);
  }, [plans]);

  // Filter plans that include this app
  const plansWithApp = useMemo(() => {
    if (!selectedApp) return [];
    
    return activePlans.filter(plan => {
      // This will be checked per plan in the PlanCard component
      return true; // Show all plans, highlight those with the app
    });
  }, [activePlans, selectedApp]);

  // Helper function to get route (same as in AppsShowcase) - moved before use
  const getModuleRoute = React.useCallback((module: any): string | undefined => {
    if (!module) return undefined;
    const moduleName = module.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const routeMap: Record<string, string> = {
      'ats-core': '/superadmin/ats',
      'companies': '/superadmin/companies',
      'people': '/superadmin/people',
      'ai-orchestration': '/superadmin/ai-orchestration',
      'ai-analytics': '/superadmin/ai-analytics',
      'system-administration-suite': '/superadmin/system-administration-suite',
      'module-registry-deployment': '/superadmin/module-registry-deployment',
      'enterprise-monitoring-audit': '/superadmin/enterprise-monitoring-audit',
      'app-development': '/superadmin/module-development',
      'feature-management': '/superadmin/feature-management',
      'documentation': '/superadmin/documentation',
      'security-dashboard': '/superadmin/security-dashboard',
      'audit-logs': '/superadmin/audit-logs',
      'global-settings': '/superadmin/global-settings',
      'subscription-plans': '/superadmin/subscription-plans',
      'tenants': '/superadmin/tenants',
      'users': '/superadmin/users'
    };
    return routeMap[moduleName] || `/superadmin/${moduleName}`;
  }, []);

  // Redirect to auth if not logged in (but only after loading is complete)
  // Don't redirect immediately - let the component render first
  const shouldRedirectToAuth = !authLoading && !user && appName;
  
  useEffect(() => {
    if (shouldRedirectToAuth) {
      // Delay redirect to allow component to render loading state first
      const timer = setTimeout(() => {
        navigate(`/auth?app=${encodeURIComponent(appName)}&next=subscribe`, { replace: true });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shouldRedirectToAuth, appName, navigate]);

  // If no app specified, show error message
  if (!appName) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>App Not Specified</CardTitle>
              <CardDescription>Please select an app from the homepage.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/">Go to Homepage</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Loading state or redirecting to auth
  if (authLoading || plansLoading || checkingAccess || modulesLoading || shouldRedirectToAuth) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {shouldRedirectToAuth ? 'Redirecting to sign in...' : 'Loading subscription options...'}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If user already has access
  if (hasAccess && selectedApp) {
    const appRoute = getModuleRoute(selectedApp);
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-full">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">You Already Have Access!</CardTitle>
                    <CardDescription className="text-base mt-2">
                      You have an active subscription that includes <strong>{selectedApp.name}</strong>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {appRoute ? (
                    <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                      <Link to={appRoute}>
                        Open {selectedApp.name}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                      <Link to="/tenant-admin/dashboard">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button asChild variant="outline" size="lg">
                    <Link to="/">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Homepage
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If app not found but appName exists, show error
  if (appName && !selectedApp && !modulesLoading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>App Not Found</CardTitle>
              <CardDescription>
                The app "{appName}" could not be found. Please select an app from the homepage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/">Go to Homepage</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <Button
              variant="ghost"
              asChild
              className="mb-6"
            >
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Homepage
              </Link>
            </Button>
            
            {selectedApp ? (
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Get Access to {selectedApp.name}
                </h1>
                {selectedApp.description && (
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    {selectedApp.description}
                  </p>
                )}
              </div>
            ) : (
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Get Access to {appName || 'This App'}
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Choose a subscription plan to access this app
                </p>
              </div>
            )}
            
            <p className="text-lg text-gray-600">
              Choose a subscription plan that includes this app
            </p>
          </div>

          {/* Plans Grid */}
          {plansWithApp.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {plansWithApp.map((plan) => (
                <PlanCard 
                  key={plan.id} 
                  plan={plan} 
                  selectedApp={selectedApp}
                />
              ))}
            </div>
          ) : activePlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {activePlans.map((plan) => (
                <PlanCard 
                  key={plan.id} 
                  plan={plan} 
                  selectedApp={selectedApp}
                />
              ))}
            </div>
          ) : (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>No Plans Available</CardTitle>
                <CardDescription>
                  There are currently no subscription plans available. Please check back later.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/">Go to Homepage</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          <div className="text-center mt-12">
            <p className="text-sm text-gray-600 mb-4">
              All plans include 24/7 support, regular updates, and access to our AI-powered features
            </p>
            <Link 
              to="/#pricing" 
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm inline-flex items-center gap-1"
            >
              View all subscription plans
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Plan Card Component
const PlanCard: React.FC<{ plan: any; selectedApp: any }> = ({ plan, selectedApp }) => {
  const { data: modulesSummary } = useModulePermissionsSummary(plan.id);
  
  const enabledModules = modulesSummary?.enabledModules || 0;
  const totalModules = modulesSummary?.totalModules || 0;
  const enabledModuleNames = modulesSummary?.moduleDetails
    ?.filter(m => m.isEnabled)
    .slice(0, 8)
    .map(m => m.label) || [];

  // Check if this plan includes the selected app
  const includesApp = selectedApp 
    ? modulesSummary?.moduleDetails?.some(m => 
        m.name === selectedApp.name && m.isEnabled
      ) || false
    : false;

  // Calculate annual savings
  const monthlyAnnualCost = plan.price_monthly * 12;
  const annualSavings = monthlyAnnualCost - plan.price_annually;
  const savingsPercentage = monthlyAnnualCost > 0 
    ? Math.round((annualSavings / monthlyAnnualCost) * 100) 
    : 0;

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'recruitment':
        return Zap;
      case 'employer':
        return Building;
      case 'talent':
        return Shield;
      default:
        return Building;
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'recruitment':
        return 'from-blue-500 to-blue-600';
      case 'employer':
        return 'from-green-500 to-green-600';
      case 'talent':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-indigo-500 to-indigo-600';
    }
  };

  const PlanIcon = getPlanIcon(plan.plan_type);
  const gradientColor = getPlanColor(plan.plan_type);

  return (
    <Card 
      className={`relative overflow-hidden border-2 transition-all hover:shadow-xl ${
        includesApp 
          ? 'border-green-400 bg-green-50/50' 
          : 'border-gray-200 hover:border-indigo-300'
      }`}
    >
      {/* Highlight badge if includes app */}
      {includesApp && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-green-500 text-white">
            <Check className="h-3 w-3 mr-1" />
            Includes {selectedApp?.name}
          </Badge>
        </div>
      )}

      {/* Gradient Header */}
      <div className={`bg-gradient-to-r ${gradientColor} text-white p-6`}>
        <div className="flex items-center gap-3 mb-2">
          <PlanIcon className="h-6 w-6" />
          <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
        </div>
        {plan.description && (
          <CardDescription className="text-white/90 mt-2">
            {plan.description}
          </CardDescription>
        )}
      </div>

      <CardHeader className="pb-4">
        {/* Pricing */}
        <div className="text-center mb-4">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-bold text-gray-900">
              ${plan.price_monthly}
            </span>
            <span className="text-gray-600">/month</span>
          </div>
          {plan.price_annually > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                ${plan.price_annually}/year
              </p>
              {savingsPercentage > 0 && (
                <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
                  Save {savingsPercentage}% annually
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Apps Count */}
        <div className={`rounded-lg p-4 text-center ${
          includesApp ? 'bg-green-100' : 'bg-indigo-50'
        }`}>
          <p className="text-sm text-gray-600 mb-1">Included Apps</p>
          <p className={`text-2xl font-bold ${
            includesApp ? 'text-green-700' : 'text-indigo-600'
          }`}>
            {enabledModules} {enabledModules === 1 ? 'App' : 'Apps'}
          </p>
          {totalModules > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              out of {totalModules} available
            </p>
          )}
        </div>

        {/* Included Apps List */}
        {enabledModuleNames.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">
              Key Apps Included:
            </p>
            <ul className="space-y-2">
              {enabledModuleNames.map((moduleName, idx) => {
                const isSelectedApp = selectedApp && moduleName.toLowerCase().includes(selectedApp.name.toLowerCase());
                return (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                      isSelectedApp ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm ${
                      isSelectedApp ? 'text-green-700 font-semibold' : 'text-gray-700'
                    }`}>
                      {moduleName}
                    </span>
                  </li>
                );
              })}
              {enabledModules > enabledModuleNames.length && (
                <li className="text-sm text-gray-500 italic pl-6">
                  +{enabledModules - enabledModuleNames.length} more apps
                </li>
              )}
            </ul>
          </div>
        )}

        {/* CTA Button */}
        <div className="pt-4 border-t">
          <Button 
            asChild 
            className={`w-full ${
              includesApp 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <Link to={`/tenant-admin/upgrade?plan=${plan.id}&app=${selectedApp?.name || ''}`}>
              {includesApp ? 'Subscribe Now' : 'View Plan Details'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppSubscription;

