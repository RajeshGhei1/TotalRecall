
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { unifiedAIService, AIServiceRegistration, UnifiedAIResponse } from '@/services/ai/unifiedAIService';
import { useUnifiedAI } from '@/hooks/ai/useUnifiedAI';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Zap, 
  TestTube, 
  Activity,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const AIServiceRegistry: React.FC = () => {
  const { processRequest, isLoading, error } = useUnifiedAI();
  const [testRequest, setTestRequest] = useState({
    module: 'test',
    service: '',
    action: '',
    parameters: '{}'
  });
  const [testResponse, setTestResponse] = useState<UnifiedAIResponse | null>(null);

  const services = unifiedAIService.getRegisteredServices();

  const handleTestRequest = async () => {
    if (!testRequest.service || !testRequest.action) return;

    try {
      const parameters = JSON.parse(testRequest.parameters);
      const response = await processRequest({
        module: testRequest.module,
        service: testRequest.service,
        action: testRequest.action,
        context: {
          userId: 'test-user',
          tenantId: undefined,
          entityType: 'test'
        },
        parameters
      });
      setTestResponse(response);
    } catch (err) {
      console.error('Test request failed:', err);
    }
  };

  const renderServiceCard = (service: AIServiceRegistration) => (
    <Card key={service.serviceId} className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{service.name}</CardTitle>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Supported Actions</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {service.supportedActions.map((action: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {action}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-medium">Required Parameters</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {service.requiredParameters.map((param: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs border-red-200 text-red-700">
                {param}
              </Badge>
            ))}
          </div>
        </div>

        {service.optionalParameters.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Optional Parameters</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {service.optionalParameters.map((param: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700">
                  {param}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={() => {
            setTestRequest(prev => ({
              ...prev,
              service: service.serviceId,
              action: service.supportedActions[0] || ''
            }));
          }}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <TestTube className="h-4 w-4 mr-2" />
          Test Service
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Service Registry</h2>
          <p className="text-muted-foreground">
            Manage and test cross-module AI services
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          {services.length} Services
        </Badge>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">
            <Settings className="h-4 w-4 mr-2" />
            Services
          </TabsTrigger>
          <TabsTrigger value="testing">
            <TestTube className="h-4 w-4 mr-2" />
            Testing
          </TabsTrigger>
          <TabsTrigger value="monitoring">
            <Activity className="h-4 w-4 mr-2" />
            Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map(renderServiceCard)}
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test AI Service</CardTitle>
              <CardDescription>
                Test any registered AI service with custom parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="service">Service</Label>
                  <select
                    id="service"
                    className="w-full p-2 border rounded-md"
                    value={testRequest.service}
                    onChange={(e) => setTestRequest(prev => ({ ...prev, service: e.target.value }))}
                  >
                    <option value="">Select a service...</option>
                    {services.map(service => (
                      <option key={service.serviceId} value={service.serviceId}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="action">Action</Label>
                  <select
                    id="action"
                    className="w-full p-2 border rounded-md"
                    value={testRequest.action}
                    onChange={(e) => setTestRequest(prev => ({ ...prev, action: e.target.value }))}
                    disabled={!testRequest.service}
                  >
                    <option value="">Select an action...</option>
                    {testRequest.service && services
                      .find(s => s.serviceId === testRequest.service)
                      ?.supportedActions.map(action => (
                        <option key={action} value={action}>
                          {action}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="module">Module</Label>
                <Input
                  id="module"
                  value={testRequest.module}
                  onChange={(e) => setTestRequest(prev => ({ ...prev, module: e.target.value }))}
                  placeholder="Module name (e.g., 'recruitment', 'forms')"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parameters">Parameters (JSON)</Label>
                <Textarea
                  id="parameters"
                  value={testRequest.parameters}
                  onChange={(e) => setTestRequest(prev => ({ ...prev, parameters: e.target.value }))}
                  placeholder='{"param1": "value1", "param2": "value2"}'
                  rows={4}
                />
              </div>

              <Button
                onClick={handleTestRequest}
                disabled={isLoading || !testRequest.service || !testRequest.action}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Service
                  </>
                )}
              </Button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              {testResponse && (
                <div className="space-y-2">
                  <Label>Response</Label>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-64">
                      {JSON.stringify(testResponse, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>Service Monitoring</CardTitle>
              <CardDescription>
                Monitor AI service performance and usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Monitoring Dashboard</h3>
                <p>Service monitoring and analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
