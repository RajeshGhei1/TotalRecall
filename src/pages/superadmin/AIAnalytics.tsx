
import React from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Users, Activity, Building2, Eye, Target } from 'lucide-react';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBehavioralAnalytics } from '@/hooks/ai/useBehavioralAnalytics';
import { useAdvancedPatterns } from '@/hooks/ai/useAdvancedPatterns';
import { useTenantContext } from '@/contexts/TenantContext';
import AdminLayout from '@/components/AdminLayout';
import GlobalTenantSelector from '@/components/superadmin/settings/shared/GlobalTenantSelector';
import { PatternRecognitionDashboard, PatternVisualization } from '@/components/ai/patterns';

const AIAnalytics: React.FC = () => {
  const { selectedTenantId, selectedTenantName } = useTenantContext();
  const { behaviorAnalysis, userPatterns, analysisLoading, isAIEnhanced } = useBehavioralAnalytics();
  
  // Get advanced pattern analysis for the selected tenant
  const {
    patterns,
    inefficiencies,
    insights,
    analysis,
    isLoading: patternsLoading,
    error: patternsError
  } = useAdvancedPatterns(selectedTenantId || 'demo-user', selectedTenantId);

  // Show tenant selection state when no tenant is selected
  if (!selectedTenantId) {
    return (
      <AdminLayout>
        <div className="p-4 md:p-6">
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/superadmin/dashboard">Super Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>AI Analytics</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">AI Analytics</h1>
              <p className="text-muted-foreground">
                Monitor behavioral patterns and AI insights across the platform
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Select Tenant for AI Analytics
                </CardTitle>
                <CardDescription>
                  Choose a tenant to view their AI behavioral analytics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GlobalTenantSelector />
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const isLoading = analysisLoading || patternsLoading;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-4 md:p-6">
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-4 md:p-6">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/superadmin/dashboard">Super Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>AI Analytics</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="space-y-6">
            {/* Header with Tenant Context */}
            <div className="flex flex-col space-y-4">
              <div>
                <h1 className="text-3xl font-bold">AI Analytics</h1>
                <p className="text-muted-foreground">
                  Comprehensive behavioral patterns and AI insights across the platform
                </p>
              </div>
              
              {/* Tenant Context Card */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">
                          Viewing analytics for: <span className="font-bold">{selectedTenantName}</span>
                        </p>
                        <p className="text-sm text-blue-600">
                          Tenant ID: {selectedTenantId.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAIEnhanced && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          AI Enhanced
                        </Badge>
                      )}
                      <GlobalTenantSelector />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Enhancement Status Alert */}
            {!isAIEnhanced && (
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  This tenant does not have AI models configured. Analytics are showing basic behavioral patterns only.
                  Advanced AI insights require tenant-specific AI model configuration.
                </AlertDescription>
              </Alert>
            )}

            {/* Pattern Analysis Error Alert */}
            {patternsError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Error loading pattern analysis: {patternsError}
                </AlertDescription>
              </Alert>
            )}

            {/* Enhanced Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{behaviorAnalysis?.totalInteractions || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    User interactions
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Behavior Patterns</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{patterns?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Detected patterns
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{insights?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Predictive insights
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inefficiencies</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inefficiencies?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Workflow issues
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analysis ? `${(analysis.riskScore * 100).toFixed(0)}%` : '0%'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    System risk level
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analysis?.recommendations?.length || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI recommendations
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="pattern-recognition" className="space-y-4">
              <TabsList>
                <TabsTrigger value="pattern-recognition">Pattern Recognition</TabsTrigger>
                <TabsTrigger value="visualizations">Pattern Visualizations</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                <TabsTrigger value="behavioral-patterns">Behavioral Patterns</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="pattern-recognition" className="space-y-4">
                <PatternRecognitionDashboard 
                  userId={selectedTenantId || 'demo-user'} 
                  tenantId={selectedTenantId}
                />
              </TabsContent>

              <TabsContent value="visualizations" className="space-y-4">
                <PatternVisualization 
                  patterns={patterns || []}
                  inefficiencies={inefficiencies || []}
                  insights={insights || []}
                />
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>AI-Generated Insights</CardTitle>
                    <CardDescription>
                      Intelligent observations about user behavior and system usage for {selectedTenantName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {behaviorAnalysis?.insights && behaviorAnalysis.insights.length > 0 ? (
                      <div className="space-y-3">
                        {behaviorAnalysis.insights.map((insight: string, index: number) => (
                          <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm">{insight}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Brain className="h-12 w-12 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Insights Available</h3>
                        <p>AI insights will appear as user interaction data is collected and analyzed for this tenant.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="behavioral-patterns" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Interaction Patterns</CardTitle>
                    <CardDescription>
                      Analysis of user interaction types and frequency for {selectedTenantName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {behaviorAnalysis?.patterns?.interactionTypes && 
                     Object.keys(behaviorAnalysis.patterns.interactionTypes).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(behaviorAnalysis.patterns.interactionTypes).map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline">{type}</Badge>
                              <span className="text-sm text-muted-foreground">interactions</span>
                            </div>
                            <span className="font-semibold">{count as number}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Patterns Detected</h3>
                        <p>Behavioral patterns will be identified as more user interaction data is collected for this tenant.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Recommendations</CardTitle>
                    <CardDescription>
                      Intelligent suggestions for improving user experience and system efficiency for {selectedTenantName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analysis?.recommendations && analysis.recommendations.length > 0 ? (
                      <div className="space-y-3">
                        {analysis.recommendations.map((recommendation: string, index: number) => (
                          <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    ) : behaviorAnalysis?.recommendations && behaviorAnalysis.recommendations.length > 0 ? (
                      <div className="space-y-3">
                        {behaviorAnalysis.recommendations.map((recommendation: string, index: number) => (
                          <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Recommendations Available</h3>
                        <p>AI recommendations will be generated based on behavioral analysis and usage patterns for this tenant.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AIAnalytics;
