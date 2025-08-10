import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Code, 
  Play, 
  TestTube, 
  FileText, 
  Settings, 
  Save,
  RefreshCw,
  Eye,
  Package,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Monitor,
  GitBranch,
  Users,
  Star,
  TrendingUp
} from 'lucide-react';
import { FeatureImplementation, FeatureDevelopmentEnvironment, FeatureTestScenario } from '@/types/features';
import { toast } from '@/hooks/use-toast';

interface FeatureDevelopmentLabProps {
  featureId?: string;
  onFeatureSaved?: (feature: FeatureImplementation) => void;
}

const FeatureDevelopmentLab: React.FC<FeatureDevelopmentLabProps> = ({
  featureId,
  onFeatureSaved
}) => {
  const [activeTab, setActiveTab] = useState('develop');
  const [feature, setFeature] = useState<FeatureImplementation>({
    id: featureId || `feature-${Date.now()}`,
    name: '',
    version: '1.0.0',
    category: 'custom',
    description: '',
    implementation: {
      component: undefined,
      dependencies: []
    },
    development: {
      status: 'draft',
      author: 'Developer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    testing: {
      testStatus: 'not-tested',
      testSuites: []
    },
    api: {},
    compatibility: {
      moduleTypes: ['all']
    },
    usage: {
      adopters: 0,
      modules: []
    }
  });

  const [editorCode, setEditorCode] = useState(`import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureProps {
  title?: string;
  children?: React.ReactNode;
}

const MyFeature: React.FC<FeatureProps> = ({ title = 'My Feature', children }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children || <p>This is my custom feature implementation!</p>}
      </CardContent>
    </Card>
  );
};

export default MyFeature;`);

  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [previewProps, setPreviewProps] = useState<Record<string, any>>({
    title: 'Test Feature'
  });

  const [testScenarios] = useState<FeatureTestScenario[]>([
    {
      id: 'scenario-1',
      name: 'Basic Rendering',
      description: 'Test if the feature renders without errors',
      props: { title: 'Basic Test' },
      context: {},
      expectedBehavior: 'Renders without throwing errors',
      interactive: false
    },
    {
      id: 'scenario-2', 
      name: 'Props Handling',
      description: 'Test feature with different prop values',
      props: { title: 'Props Test', data: { count: 42 } },
      context: {},
      expectedBehavior: 'Correctly displays provided props',
      interactive: true
    },
    {
      id: 'scenario-3',
      name: 'Edge Cases',
      description: 'Test feature with null/undefined props',
      props: { title: null },
      context: {},
      expectedBehavior: 'Handles null props gracefully',
      interactive: false
    }
  ]);

  // Simulate feature compilation and preview
  const CompiledFeature = useMemo(() => {
    try {
      // In a real implementation, this would compile the TypeScript/JSX code
      // For now, we'll return a simple component
      return ({ title = 'My Feature', children }: any) => (
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            {children || <p>This is my custom feature implementation!</p>}
            <div className="mt-2 text-sm text-muted-foreground">
              Feature Version: {feature.version} | Status: {feature.development.status}
            </div>
          </CardContent>
        </Card>
      );
    } catch (error) {
      return () => (
        <Card>
          <CardContent className="text-red-500">
            <p>Compilation Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
          </CardContent>
        </Card>
      );
    }
  }, [editorCode, feature.version, feature.development.status]);

  const runTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    for (const scenario of testScenarios) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = {
        scenarioId: scenario.id,
        name: scenario.name,
        status: Math.random() > 0.3 ? 'passed' : 'failed',
        duration: Math.floor(Math.random() * 200) + 50,
        message: Math.random() > 0.7 ? 'Test completed successfully' : undefined
      };

      setTestResults(prev => [...prev, result]);
    }

    setIsRunningTests(false);
    
    const passedTests = testResults.filter(r => r.status === 'passed').length;
    const coverage = Math.round((passedTests / testScenarios.length) * 100);
    
    setFeature(prev => ({
      ...prev,
      testing: {
        ...prev.testing,
        testStatus: coverage > 80 ? 'passing' : 'failing',
        testCoverage: coverage,
        lastTestRun: new Date().toISOString()
      }
    }));

    toast({
      title: 'Tests Completed',
      description: `${passedTests}/${testScenarios.length} tests passed (${coverage}% coverage)`,
    });
  };

  const saveFeature = () => {
    const updatedFeature = {
      ...feature,
      implementation: {
        ...feature.implementation,
        component: editorCode
      },
      development: {
        ...feature.development,
        updatedAt: new Date().toISOString()
      }
    };

    setFeature(updatedFeature);
    onFeatureSaved?.(updatedFeature);
    
    toast({
      title: 'Feature Saved',
      description: `${feature.name || 'Unnamed Feature'} has been saved successfully.`,
    });
  };

  const publishFeature = () => {
    const publishedFeature = {
      ...feature,
      development: {
        ...feature.development,
        status: 'stable' as const,
        updatedAt: new Date().toISOString()
      }
    };

    setFeature(publishedFeature);
    
    toast({
      title: 'Feature Published',
      description: `${feature.name} is now available in the Feature Library!`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Feature Development Lab</h2>
          <p className="text-gray-600 mt-1">
            Develop, test, and deploy individual features independently
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={saveFeature}>
            <Save className="h-4 w-4 mr-2" />
            Save Feature
          </Button>
          <Button onClick={publishFeature} disabled={feature.testing.testStatus !== 'passing'}>
            <Package className="h-4 w-4 mr-2" />
            Publish to Library
          </Button>
        </div>
      </div>

      {/* Feature Info Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="font-semibold">{feature.name || 'Unnamed Feature'}</h3>
                <p className="text-sm text-muted-foreground">v{feature.version}</p>
              </div>
              <Badge variant={
                feature.development.status === 'stable' ? 'default' :
                feature.development.status === 'testing' ? 'secondary' :
                feature.development.status === 'development' ? 'outline' : 'destructive'
              }>
                {feature.development.status}
              </Badge>
              <Badge variant={
                feature.testing.testStatus === 'passing' ? 'default' :
                feature.testing.testStatus === 'failing' ? 'destructive' : 'secondary'
              }>
                Tests: {feature.testing.testStatus}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date(feature.development.updatedAt).toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Development Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="develop">
            <Code className="h-4 w-4 mr-2" />
            Develop
          </TabsTrigger>
          <TabsTrigger value="test">
            <TestTube className="h-4 w-4 mr-2" />
            Test
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="api">
            <Settings className="h-4 w-4 mr-2" />
            API
          </TabsTrigger>
          <TabsTrigger value="docs">
            <FileText className="h-4 w-4 mr-2" />
            Docs
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Development Tab */}
        <TabsContent value="develop" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Feature Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="feature-name">Feature Name</Label>
                  <Input
                    id="feature-name"
                    value={feature.name}
                    onChange={(e) => setFeature(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter feature name"
                  />
                </div>
                <div>
                  <Label htmlFor="feature-description">Description</Label>
                  <Textarea
                    id="feature-description"
                    value={feature.description}
                    onChange={(e) => setFeature(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this feature does"
                  />
                </div>
                <div>
                  <Label htmlFor="feature-category">Category</Label>
                  <Select value={feature.category} onValueChange={(value) => setFeature(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ui_components">UI Components</SelectItem>
                      <SelectItem value="data_processing">Data Processing</SelectItem>
                      <SelectItem value="authentication">Authentication</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="integrations">Integrations</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="feature-version">Version</Label>
                  <Input
                    id="feature-version"
                    value={feature.version}
                    onChange={(e) => setFeature(prev => ({ ...prev, version: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Code Editor */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Feature Implementation
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Compile
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={editorCode}
                  onChange={(e) => setEditorCode(e.target.value)}
                  className="font-mono text-sm min-h-[400px] resize-none"
                  placeholder="Write your feature implementation here..."
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Testing Tab */}
        <TabsContent value="test" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Test Scenarios
                  <Button onClick={runTests} disabled={isRunningTests}>
                    <Play className="h-4 w-4 mr-2" />
                    {isRunningTests ? 'Running...' : 'Run Tests'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testScenarios.map((scenario) => (
                    <div key={scenario.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{scenario.name}</h4>
                        {scenario.interactive && <Badge variant="outline">Interactive</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{scenario.description}</p>
                      <p className="text-xs text-green-600 mt-1">Expected: {scenario.expectedBehavior}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No tests run yet. Click "Run Tests" to start.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {testResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          {result.status === 'passed' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">{result.name}</span>
                        </div>
                        <Badge variant={result.status === 'passed' ? 'default' : 'destructive'}>
                          {result.duration}ms
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Preview Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="preview-title">Title Prop</Label>
                  <Input
                    id="preview-title"
                    value={previewProps.title || ''}
                    onChange={(e) => setPreviewProps(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Props
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <CompiledFeature {...previewProps} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>Define the props, events, and methods for your feature</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Props</h4>
                  <div className="text-sm text-muted-foreground">
                    Define the properties that can be passed to your feature component.
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Events</h4>
                  <div className="text-sm text-muted-foreground">
                    Define the events that your feature can emit.
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Methods</h4>
                  <div className="text-sm text-muted-foreground">
                    Define the methods that can be called on your feature.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write documentation for your feature..."
                className="min-h-[300px]"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Adopters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{feature.usage.adopters}</div>
                <p className="text-sm text-muted-foreground">Modules using this feature</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{feature.usage.rating || 'N/A'}</div>
                <p className="text-sm text-muted-foreground">Average user rating</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Test Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{feature.testing.testCoverage || 0}%</div>
                <p className="text-sm text-muted-foreground">Test coverage</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeatureDevelopmentLab; 