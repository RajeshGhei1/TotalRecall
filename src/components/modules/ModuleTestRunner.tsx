
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Play, RefreshCw } from 'lucide-react';

interface ModuleTestRunnerProps {
  moduleId: string;
  onTestComplete?: () => void;
}

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'pending';
  duration: number;
  error?: string;
}

const ModuleTestRunner: React.FC<ModuleTestRunnerProps> = ({ 
  moduleId, 
  onTestComplete 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const mockTests: Omit<TestResult, 'status' | 'duration'>[] = [
    { id: '1', name: 'Module loads correctly' },
    { id: '2', name: 'Component renders without errors' },
    { id: '3', name: 'Props are handled correctly' },
    { id: '4', name: 'Module metadata is valid' },
    { id: '5', name: 'Dependencies are satisfied' }
  ];

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    for (const test of mockTests) {
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result: TestResult = {
        ...test,
        status: Math.random() > 0.2 ? 'passed' : 'failed',
        duration: Math.floor(Math.random() * 200) + 50,
        error: Math.random() > 0.8 ? 'Sample error message' : undefined
      };

      setTestResults(prev => [...prev, result]);
    }

    setIsRunning(false);
    onTestComplete?.();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <RefreshCw className="h-4 w-4 text-gray-400 animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-green-100 text-green-800">Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Running</Badge>;
    }
  };

  const passedTests = testResults.filter(t => t.status === 'passed').length;
  const totalTests = mockTests.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Module Test Runner</h3>
          <p className="text-sm text-muted-foreground">
            Testing module: {moduleId}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {testResults.length > 0 && (
            <div className="text-sm">
              <span className="font-medium">{passedTests}/{totalTests}</span> tests passed
            </div>
          )}
          <Button 
            onClick={runTests} 
            disabled={isRunning}
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTests.map((test) => {
              const result = testResults.find(r => r.id === test.id);
              const status = result?.status || (isRunning ? 'pending' : 'pending');
              
              return (
                <div key={test.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(status)}
                    <span className="font-medium">{test.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {result && (
                      <span className="text-xs text-muted-foreground">
                        {result.duration}ms
                      </span>
                    )}
                    {getStatusBadge(status)}
                  </div>
                </div>
              );
            })}
          </div>

          {testResults.some(t => t.error) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <h4 className="font-medium text-red-800 mb-2">Test Errors</h4>
              {testResults
                .filter(t => t.error)
                .map(t => (
                  <div key={t.id} className="text-sm text-red-700">
                    {t.name}: {t.error}
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleTestRunner;
