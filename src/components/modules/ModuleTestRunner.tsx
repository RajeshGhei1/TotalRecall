
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield, 
  Zap, 
  Code,
  TrendingUp,
  FileText
} from 'lucide-react';
import { moduleTestingService, ModuleTestReport, TestSuite } from '@/services/moduleTesting';

interface ModuleTestRunnerProps {
  moduleId: string;
  onTestComplete?: (report: ModuleTestReport) => void;
}

const ModuleTestRunner: React.FC<ModuleTestRunnerProps> = ({ 
  moduleId, 
  onTestComplete 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testReport, setTestReport] = useState<ModuleTestReport | null>(null);
  const [selectedTestTypes, setSelectedTestTypes] = useState<string[]>(['unit', 'integration', 'access']);

  const testTypeOptions = [
    { id: 'unit', label: 'Unit Tests', icon: Code, description: 'Test individual components and functions' },
    { id: 'integration', label: 'Integration Tests', icon: Zap, description: 'Test module interactions and dependencies' },
    { id: 'access', label: 'Access Control', icon: Shield, description: 'Test subscription and permission validation' },
    { id: 'performance', label: 'Performance', icon: TrendingUp, description: 'Test performance and resource usage' }
  ];

  const handleTestTypeToggle = (testType: string) => {
    setSelectedTestTypes(prev => 
      prev.includes(testType) 
        ? prev.filter(t => t !== testType)
        : [...prev, testType]
    );
  };

  const runTests = async () => {
    setIsRunning(true);
    try {
      const report = await moduleTestingService.runModuleTests(moduleId, selectedTestTypes);
      setTestReport(report);
      onTestComplete?.(report);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'skip') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'skip':
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'fail' | 'partial') => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const renderTestSuite = (suite: TestSuite) => (
    <Card key={suite.id} className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{suite.name}</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {suite.passedTests}/{suite.totalTests} passed
            </Badge>
            <Badge variant="outline">
              {suite.duration}ms
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suite.tests.map(test => (
            <div key={test.id} className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <div className="font-medium">{test.name}</div>
                  {test.details && (
                    <div className="text-sm text-muted-foreground">{test.details}</div>
                  )}
                  {test.error && (
                    <div className="text-sm text-red-600">{test.error}</div>
                  )}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {test.duration}ms
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const calculateProgress = () => {
    if (!testReport) return 0;
    const totalTests = testReport.testSuites.reduce((sum, suite) => sum + suite.totalTests, 0);
    const completedTests = testReport.testSuites.reduce((sum, suite) => sum + suite.passedTests + suite.failedTests, 0);
    return totalTests > 0 ? (completedTests / totalTests) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Test Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Test Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Select Test Types</h4>
              <div className="grid grid-cols-2 gap-3">
                {testTypeOptions.map(option => {
                  const Icon = option.icon;
                  const isSelected = selectedTestTypes.includes(option.id);
                  
                  return (
                    <div
                      key={option.id}
                      className={`
                        p-3 border rounded-lg cursor-pointer transition-colors
                        ${isSelected ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}
                      `}
                      onClick={() => handleTestTypeToggle(option.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div className="flex-1">
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Module: {moduleId}
              </div>
              <Button 
                onClick={runTests} 
                disabled={isRunning || selectedTestTypes.length === 0}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {isRunning ? 'Running Tests...' : 'Run Tests'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Progress */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Running tests...</span>
                <span>{Math.round(calculateProgress())}%</span>
              </div>
              <Progress value={calculateProgress()} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {testReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Test Results</span>
              <Badge className={getStatusColor(testReport.overallStatus)}>
                {testReport.overallStatus.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="details">Test Details</TabsTrigger>
                <TabsTrigger value="coverage">Coverage</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {testReport.testSuites.reduce((sum, suite) => sum + suite.passedTests, 0)}
                    </div>
                    <div className="text-sm text-green-700">Passed</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {testReport.testSuites.reduce((sum, suite) => sum + suite.failedTests, 0)}
                    </div>
                    <div className="text-sm text-red-700">Failed</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">
                      {testReport.totalDuration}ms
                    </div>
                    <div className="text-sm text-gray-700">Duration</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {testReport.testSuites.map(suite => (
                    <div key={suite.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{suite.name}</div>
                        <Badge variant="outline">
                          {suite.passedTests}/{suite.totalTests}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {suite.duration}ms
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="details" className="mt-6">
                <div className="space-y-4">
                  {testReport.testSuites.map(renderTestSuite)}
                </div>
              </TabsContent>

              <TabsContent value="coverage" className="mt-6">
                {testReport.coverage ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Code Coverage</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Lines</span>
                          <span>{testReport.coverage.lines.toFixed(1)}%</span>
                        </div>
                        <Progress value={testReport.coverage.lines} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Functions</span>
                          <span>{testReport.coverage.functions.toFixed(1)}%</span>
                        </div>
                        <Progress value={testReport.coverage.functions} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Branches</span>
                          <span>{testReport.coverage.branches.toFixed(1)}%</span>
                        </div>
                        <Progress value={testReport.coverage.branches} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Statements</span>
                          <span>{testReport.coverage.statements.toFixed(1)}%</span>
                        </div>
                        <Progress value={testReport.coverage.statements} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Coverage information not available
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModuleTestRunner;
