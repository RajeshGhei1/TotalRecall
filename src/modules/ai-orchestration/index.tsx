import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AIServiceRegistry } from '@/components/ai/AIServiceRegistry';
import { useAIAgents } from '@/hooks/ai/useAIAgents';
import { useTenantContext } from '@/contexts/TenantContext';
import { useAIServices } from '@/hooks/ai/useAIServices';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Zap, 
  Settings, 
  Activity, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Cpu,
  Network,
  Database,
  MessageSquare,
  FileText,
  Users,
  Bot,
  Key,
  Loader2,
  Plus,
  Play,
  MoreHorizontal,
  XCircle,
  AlertTriangle,
  Circle,
  GitBranch
} from 'lucide-react';
import { useAIDecisionRules, useAIDecisionInstances, useAIDecisionWorkflows, useAIDecisionAnalytics } from '@/hooks/ai/useAIDecisions';
import { useUnifiedAIOrchestration } from '@/hooks/ai/useUnifiedAIOrchestration';

// Available AI models
const AVAILABLE_MODELS = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Latest multimodal GPT model with vision capabilities',
    isDefault: true,
    requiresApiKey: true,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: 'Smaller, faster version of GPT-4o',
    isDefault: false,
    requiresApiKey: true,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Most powerful Claude model for complex reasoning',
    isDefault: false,
    requiresApiKey: true,
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: 'Balanced Claude model for most use cases',
    isDefault: false,
    requiresApiKey: true,
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Google\'s Gemini Pro model for general purpose tasks',
    isDefault: false,
    requiresApiKey: true,
  },
];

interface AiOrchestrationProps {
  showAgents?: boolean;
  showMetrics?: boolean;
  showLogs?: boolean;
  showServices?: boolean;
  mode?: 'full' | 'dashboard' | 'monitoring' | 'services' | 'setup';
  isSetupMode?: boolean;
}

interface ServiceConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  selectedModel: string;
  apiKey: string;
  isApiKeyConfigured: boolean;
}

// Agent creation modal
const AGENT_TYPES = [
  { value: 'cognitive', label: 'Cognitive Assistant' },
  { value: 'predictive', label: 'Predictive Analytics Engine' },
  { value: 'automation', label: 'Workflow Automation Agent' },
  { value: 'analysis', label: 'Data Analysis Specialist' },
  { value: 'deep_research', label: 'Deep Research Agent' },
];
const AGENT_CAPABILITIES = [
  'conversation', 'support', 'guidance', 'problem_solving', 'analysis',
  'prediction', 'analytics', 'forecasting', 'trend_analysis', 'risk_assessment',
  'automation', 'process_optimization', 'workflow', 'task_routing', 'scheduling',
  'insights', 'reporting', 'data_mining', 'pattern_recognition',
  'deep_research', 'multi_source_analysis', 'comprehensive_reporting', 'market_intelligence', 'investigation'
];

const DEFAULT_MODEL = 'gpt-4o-mini';

function AgentCreationModal({ open, onClose, onCreate, availableModels }) {
  const [name, setName] = useState('');
  const [type, setType] = useState(AGENT_TYPES[0].value);
  const [capabilities, setCapabilities] = useState([]);
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [apiKey, setApiKey] = useState('');

  const isValid = name.trim() && type && model && temperature >= 0 && maxTokens > 0;

  const handleCapabilityToggle = (cap) => {
    setCapabilities((prev) => prev.includes(cap) ? prev.filter(c => c !== cap) : [...prev, cap]);
  };

  const handleCreate = () => {
    if (!isValid) return;
    onCreate({
      name: name.trim(),
      description: `AI agent for ${type} tasks`,
      agent_type: type,
      capabilities,
      model_config: {
        temperature,
        max_tokens: maxTokens,
        model_preference: model,
        apiKey: apiKey.trim() || undefined
      }
    });
    // Reset form
    setName('');
    setType(AGENT_TYPES[0].value);
    setCapabilities([]);
    setModel(DEFAULT_MODEL);
    setTemperature(0.7);
    setMaxTokens(1000);
    setApiKey('');
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Create New Agent</h2>
        <div className="space-y-4">
          <div>
            <Label>Agent Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Agent name" />
          </div>
          <div>
            <Label>Agent Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {AGENT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Capabilities</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {AGENT_CAPABILITIES.map(cap => (
                <button
                  key={cap}
                  type="button"
                  className={`px-2 py-1 rounded text-xs border ${capabilities.includes(cap) ? 'bg-blue-100 border-blue-400 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                  onClick={() => handleCapabilityToggle(cap)}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Default Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
              <SelectContent>
                {availableModels.map(m => <SelectItem key={m.id} value={m.id}>{m.name} ({m.provider})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Temperature</Label>
              <Input type="number" min={0} max={2} step={0.01} value={temperature} onChange={e => setTemperature(Number(e.target.value))} />
            </div>
            <div className="flex-1">
              <Label>Max Tokens</Label>
              <Input type="number" min={1} max={32000} value={maxTokens} onChange={e => setMaxTokens(Number(e.target.value))} />
            </div>
          </div>
          <div>
            <Label>API Key (optional, overrides global)</Label>
            <Input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-..." />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!isValid}>Create Agent</Button>
        </div>
      </div>
    </div>
  );
}

// Service creation modal
const SERVICE_TYPES = [
  { value: 'api', label: 'API Service' },
  { value: 'webhook', label: 'Webhook Service' },
  { value: 'scheduled', label: 'Scheduled Service' },
  { value: 'event_driven', label: 'Event-Driven Service' },
  { value: 'streaming', label: 'Streaming Service' },
];

const SERVICE_CATEGORIES = [
  'Communication',
  'Automation', 
  'Analysis',
  'Prediction',
  'Recruitment',
  'Integration',
  'Processing',
  'Monitoring'
];

const SERVICE_CAPABILITIES = [
  'text_generation', 'text_analysis', 'image_processing', 'data_extraction',
  'sentiment_analysis', 'classification', 'translation', 'summarization',
  'question_answering', 'code_generation', 'data_validation', 'format_conversion',
  'api_integration', 'webhook_handling', 'scheduling', 'monitoring',
  'alerting', 'logging', 'caching', 'rate_limiting'
];

function ServiceCreationModal({ open, onClose, onCreate, availableModels }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState(SERVICE_TYPES[0].value);
  const [category, setCategory] = useState(SERVICE_CATEGORIES[0]);
  const [capabilities, setCapabilities] = useState([]);
  const [modules, setModules] = useState([]);
  const [model, setModel] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [rateLimit, setRateLimit] = useState(100);
  const [timeout, setTimeout] = useState(30);

  const isValid = name.trim() && description.trim() && type && category;

  const handleCapabilityToggle = (cap) => {
    setCapabilities((prev) => prev.includes(cap) ? prev.filter(c => c !== cap) : [...prev, cap]);
  };

  const handleModuleToggle = (module) => {
    setModules((prev) => prev.includes(module) ? prev.filter(m => m !== module) : [...prev, module]);
  };

  const handleCreate = () => {
    if (!isValid) return;
    onCreate({
      name: name.trim(),
      description: description.trim(),
      service_type: type,
      category,
      capabilities,
      modules,
      configuration: {
        model_preference: model || undefined,
        api_key: apiKey.trim() || undefined,
        endpoint_url: endpointUrl.trim() || undefined,
        rate_limit: rateLimit,
        timeout,
        retry_attempts: 3
      }
    });
    // Reset form
    setName('');
    setDescription('');
    setType(SERVICE_TYPES[0].value);
    setCategory(SERVICE_CATEGORIES[0]);
    setCapabilities([]);
    setModules([]);
    setModel('');
    setEndpointUrl('');
    setApiKey('');
    setRateLimit(100);
    setTimeout(30);
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Create New AI Service</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Service Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Service name" />
            </div>
            <div>
              <Label>Service Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Service description" />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {SERVICE_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Capabilities</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {SERVICE_CAPABILITIES.map(cap => (
                <button
                  key={cap}
                  type="button"
                  className={`px-2 py-1 rounded text-xs border ${capabilities.includes(cap) ? 'bg-blue-100 border-blue-400 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                  onClick={() => handleCapabilityToggle(cap)}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Connected Modules</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {['Email Management', 'Contact Forms', 'ATS Core', 'Talent Database', 'Analytics', 'Dashboard', 'Reports', 'Recruitment', 'Customer Support', 'Content Management'].map(module => (
                <button
                  key={module}
                  type="button"
                  className={`px-2 py-1 rounded text-xs border ${modules.includes(module) ? 'bg-green-100 border-green-400 text-green-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                  onClick={() => handleModuleToggle(module)}
                >
                  {module}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Preferred Model (optional)</Label>
              <Select value={model} onValueChange={setModel} placeholder="Select model">
                <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
                <SelectContent>
                  {availableModels.map(m => <SelectItem key={m.id} value={m.id}>{m.name} ({m.provider})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Endpoint URL (optional)</Label>
              <Input value={endpointUrl} onChange={e => setEndpointUrl(e.target.value)} placeholder="https://api.example.com/service" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>API Key (optional)</Label>
              <Input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Enter API key" />
            </div>
            <div>
              <Label>Rate Limit (req/min)</Label>
              <Input type="number" min={1} value={rateLimit} onChange={e => setRateLimit(Number(e.target.value))} />
            </div>
            <div>
              <Label>Timeout (seconds)</Label>
              <Input type="number" min={1} value={timeout} onChange={e => setTimeout(Number(e.target.value))} />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleCreate} disabled={!isValid} className="flex-1">
              Create Service
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const AiOrchestration: React.FC<AiOrchestrationProps> = ({
  showAgents = true,
  showMetrics = true,
  showLogs = true,
  showServices = true,
  mode = 'full',
  isSetupMode = false
}) => {
  const [activeTab, setActiveTab] = useState(isSetupMode ? 'setup' : 'overview');
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  
  // Use the AI agents and services hooks for backend integration
  const { agents, isLoading: agentsLoading, createAgent } = useAIAgents();
  const { services, isLoading: servicesLoading, createService, saveServiceConfigs, fetchServiceConfigs } = useAIServices();
  const { selectedTenantId } = useTenantContext();
  const { toast } = useToast();
  
  // Service configurations with model selection
  const [serviceConfigs, setServiceConfigs] = useState<ServiceConfig[]>([
    {
      id: 'email-response-generator',
      name: 'Email Response Generator',
      description: 'Automatically generate professional email responses',
      icon: <MessageSquare className="h-5 w-5" />,
      enabled: true,
      selectedModel: 'gpt-4o-mini',
      apiKey: '',
      isApiKeyConfigured: false
    },
    {
      id: 'smart-form-suggestions',
      name: 'Smart Form Suggestions',
      description: 'Provide intelligent suggestions for form fields',
      icon: <FileText className="h-5 w-5" />,
      enabled: true,
      selectedModel: 'gpt-4o-mini',
      apiKey: '',
      isApiKeyConfigured: false
    },
    {
      id: 'talent-matching',
      name: 'Talent Matching',
      description: 'AI-powered candidate matching and recommendations',
      icon: <Users className="h-5 w-5" />,
      enabled: false,
      selectedModel: 'claude-3-sonnet',
      apiKey: '',
      isApiKeyConfigured: false
    },
    {
      id: 'data-analysis',
      name: 'Data Analysis',
      description: 'Advanced analytics and insights generation',
      icon: <TrendingUp className="h-5 w-5" />,
      enabled: false,
      selectedModel: 'gpt-4o',
      apiKey: '',
      isApiKeyConfigured: false
    },
    {
      id: 'workflow-automation',
      name: 'Workflow Automation',
      description: 'Automate complex business processes',
      icon: <Zap className="h-5 w-5" />,
      enabled: false,
      selectedModel: 'claude-3-sonnet',
      apiKey: '',
      isApiKeyConfigured: false
    },
    {
      id: 'content-generation',
      name: 'Content Generation',
      description: 'Generate marketing content and documentation',
      icon: <FileText className="h-5 w-5" />,
      enabled: false,
      selectedModel: 'gpt-4o',
      apiKey: '',
      isApiKeyConfigured: false
    }
  ]);

  // Load configs from backend on mount/tenant change
  useEffect(() => {
    if (selectedTenantId) {
      fetchServiceConfigs(selectedTenantId).then(data => {
        if (data && Array.isArray(data)) {
          setServiceConfigs(data.map(cfg => ({
            id: cfg.service_id,
            name: cfg.name || '',
            description: cfg.description || '',
            icon: null, // You may want to map icon if needed
            enabled: cfg.enabled,
            selectedModel: cfg.selected_model,
            apiKey: cfg.api_key_encrypted ? atob(cfg.api_key_encrypted) : '',
            isApiKeyConfigured: !!cfg.api_key_encrypted,
          })));
        }
      }).catch(() => {
        toast({ title: 'Error', description: 'Failed to load service configs', variant: 'destructive' });
      });
    }
  }, [selectedTenantId]);

  const handleServiceToggle = (serviceId: string, enabled: boolean) => {
    setServiceConfigs(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, enabled }
        : service
    ));
  };

  const handleModelSelection = (serviceId: string, modelId: string) => {
    setServiceConfigs(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, selectedModel: modelId, apiKey: '', isApiKeyConfigured: false }
        : service
    ));
  };

  const handleApiKeyUpdate = (serviceId: string, apiKey: string) => {
    setServiceConfigs(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, apiKey, isApiKeyConfigured: apiKey.length > 0 }
        : service
    ));
  };

  const validateApiKey = (apiKey: string, provider: string): boolean => {
    if (!apiKey) return false;
    
    // Basic validation based on provider
    switch (provider) {
      case 'OpenAI':
        return apiKey.startsWith('sk-') && apiKey.length > 20;
      case 'Anthropic':
        return apiKey.startsWith('sk-ant-') && apiKey.length > 20;
      case 'Google':
        return apiKey.length > 20; // Google API keys don't have a specific prefix
      default:
        return apiKey.length > 10;
    }
  };

  const handleSaveConfig = async () => {
    try {
      await saveServiceConfigs(serviceConfigs, selectedTenantId);
      toast({ title: 'Success', description: 'Configuration saved!' });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to save configuration', variant: 'destructive' });
    }
  };

  const renderSetup = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              AI Services Configuration
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose which AI services to enable and select the AI model for each service.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceConfigs.map((service) => (
                <div key={service.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-primary">
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={service.enabled}
                      onCheckedChange={(enabled) => handleServiceToggle(service.id, enabled)}
                    />
                  </div>
                  
                  {service.enabled && (
                    <div className="mt-4 space-y-3">
                      <Label htmlFor={`model-${service.id}`} className="text-sm font-medium">
                        Select AI Model
                      </Label>
                      <Select
                        value={service.selectedModel}
                        onValueChange={(modelId) => handleModelSelection(service.id, modelId)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose AI model" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_MODELS.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              <div className="flex items-center gap-2">
                                <Bot className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">{model.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {model.provider} • {model.description}
                                  </div>
                                </div>
                                {model.isDefault && (
                                  <Badge variant="secondary" className="ml-auto text-xs">
                                    Default
                                  </Badge>
                                )}
                                {model.requiresApiKey && (
                                  <Key className="h-3 w-3 text-amber-500 ml-1" />
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <div className="text-xs text-muted-foreground">
                        <p>• {AVAILABLE_MODELS.find(m => m.id === service.selectedModel)?.description}</p>
                        <p>• Requires API key configuration for {AVAILABLE_MODELS.find(m => m.id === service.selectedModel)?.provider}</p>
                      </div>

                      {/* API Key Configuration */}
                      {AVAILABLE_MODELS.find(m => m.id === service.selectedModel)?.requiresApiKey && (
                        <div className="mt-4 space-y-2">
                          <Label htmlFor={`apikey-${service.id}`} className="text-sm font-medium">
                            API Key
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id={`apikey-${service.id}`}
                              type="password"
                              placeholder={`Enter ${AVAILABLE_MODELS.find(m => m.id === service.selectedModel)?.provider} API key`}
                              value={service.apiKey}
                              onChange={(e) => handleApiKeyUpdate(service.id, e.target.value)}
                              className="flex-1"
                            />
                            {service.apiKey && (
                              <div className="flex items-center gap-1">
                                {validateApiKey(service.apiKey, AVAILABLE_MODELS.find(m => m.id === service.selectedModel)?.provider || '') ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            )}
                          </div>
                          
                          {service.apiKey && (
                            <div className="text-xs">
                              {validateApiKey(service.apiKey, AVAILABLE_MODELS.find(m => m.id === service.selectedModel)?.provider || '') ? (
                                <p className="text-green-600">✓ Valid API key format</p>
                              ) : (
                                <p className="text-red-600">⚠ Invalid API key format</p>
                              )}
                            </div>
                          )}
                          
                          <div className="text-xs text-muted-foreground">
                            <p>• Get your API key from {AVAILABLE_MODELS.find(m => m.id === service.selectedModel)?.provider}</p>
                            <p>• Your API key is encrypted and stored securely</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Enabled Services: {serviceConfigs.filter(s => s.enabled).length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total AI services available: {serviceConfigs.length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Services with API keys: {serviceConfigs.filter(s => s.enabled && s.isApiKeyConfigured).length} / {serviceConfigs.filter(s => s.enabled).length}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => toast({ title: 'Preview', description: JSON.stringify(serviceConfigs, null, 2) })}>
                    Preview Config
                  </Button>
                  <Button 
                    onClick={handleSaveConfig}
                    disabled={serviceConfigs.filter(s => s.enabled && !s.isApiKeyConfigured).length > 0}
                  >
                    Save Configuration
                  </Button>
                </div>
              </div>
              
              {serviceConfigs.filter(s => s.enabled && !s.isApiKeyConfigured).length > 0 && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <p className="text-sm text-amber-800">
                      {serviceConfigs.filter(s => s.enabled && !s.isApiKeyConfigured).length} service(s) need API key configuration
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const systemMetrics = [
    { label: 'Total Requests', value: '12.4K', change: '+23%', icon: Zap },
    { label: 'Active Agents', value: '8', change: '+2', icon: Brain },
    { label: 'Avg Response Time', value: '245ms', change: '-12%', icon: Clock },
    { label: 'Success Rate', value: '97.2%', change: '+1.2%', icon: CheckCircle },
    { label: 'Cross-Module Services', value: '4', change: '+4', icon: Network },
    { label: 'Cache Hit Rate', value: '85.2%', change: '+5.1%', icon: Database }
  ];

  const crossModuleServices = [
    {
      name: 'AI Email Response Generator',
      status: 'active',
      modules: ['Email Management', 'Recruitment', 'Customer Support'],
      requests: 847,
      lastUsed: '1 minute ago'
    },
    {
      name: 'Smart Form Suggestions',
      status: 'active',
      modules: ['Contact Forms', 'ATS Core', 'Talent Database'],
      requests: 523,
      lastUsed: '3 minutes ago'
    },
    {
      name: 'Content Analysis Service',
      status: 'active',
      modules: ['Analytics', 'Recruitment', 'Content Management'],
      requests: 392,
      lastUsed: '8 minutes ago'
    },
    {
      name: 'Predictive Insights',
      status: 'active',
      modules: ['Smart Talent Analytics', 'Dashboard', 'Reports'],
      requests: 156,
      lastUsed: '15 minutes ago'
    }
  ];

  const recentLogs = [
    {
      id: '1',
      timestamp: '14:23:45',
      agent: 'Recruitment AI',
      action: 'Candidate Analysis',
      status: 'success',
      duration: '1.2s'
    },
    {
      id: '2',
      timestamp: '14:22:10',
      agent: 'Content Analyzer',
      action: 'Document Processing',
      status: 'success',
      duration: '0.8s'
    },
    {
      id: '3',
      timestamp: '14:20:33',
      agent: 'Data Processor',
      action: 'Batch Update',
      status: 'error',
      duration: '5.2s'
    },
    {
      id: '4',
      timestamp: '14:19:15',
      agent: 'Workflow Assistant',
      action: 'Task Automation',
      status: 'success',
      duration: '2.1s'
    }
  ];

  const availableServices = [
    {
      id: 'email-response-generator',
      name: 'AI Email Response Generator',
      description: 'Automatically generate intelligent email responses',
      icon: MessageSquare,
      category: 'Communication',
      isEnabled: serviceConfigs.find(s => s.id === 'email-response-generator')?.enabled || false
    },
    {
      id: 'smart-form-suggestions',
      name: 'Smart Form Suggestions',
      description: 'Provide intelligent form field suggestions and validation',
      icon: FileText,
      category: 'Automation',
      isEnabled: serviceConfigs.find(s => s.id === 'smart-form-suggestions')?.enabled || false
    },
    {
      id: 'content-analysis',
      name: 'Content Analysis Service',
      description: 'Analyze content for insights and sentiment',
      icon: TrendingUp,
      category: 'Analysis',
      isEnabled: serviceConfigs.find(s => s.id === 'data-analysis')?.enabled || false
    },
    {
      id: 'predictive-insights',
      name: 'Predictive Insights',
      description: 'Generate predictive insights based on data patterns',
      icon: Brain,
      category: 'Prediction',
      isEnabled: serviceConfigs.find(s => s.id === 'data-analysis')?.enabled || false
    },
    {
      id: 'workflow-automation',
      name: 'Workflow Automation',
      description: 'Automate repetitive tasks and optimize workflows',
      icon: Zap,
      category: 'Automation',
      isEnabled: serviceConfigs.find(s => s.id === 'workflow-automation')?.enabled || false
    },
    {
      id: 'talent-matching',
      name: 'Smart Talent Matching',
      description: 'AI-powered candidate matching and recommendations',
      icon: Users,
      category: 'Recruitment',
      isEnabled: serviceConfigs.find(s => s.id === 'talent-matching')?.enabled || false
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'idle':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'idle':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {showMetrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {systemMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </CardTitle>
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{metric.change}</span> from last hour
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">AI Orchestration Online</h3>
                <p className="text-sm text-green-700">All core systems operational</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cross-Module Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {crossModuleServices.slice(0, 3).map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{service.name}</span>
                    <p className="text-xs text-muted-foreground">
                      {service.modules.length} modules • {service.requests} requests
                    </p>
                  </div>
                  <Badge className={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI Services</h3>
          <p className="text-sm text-muted-foreground">
            {selectedTenantId ? 
              `Showing services for tenant: ${selectedTenantId.slice(0, 8)}...` : 
              'Showing global services (no tenant selected)'
            }
          </p>
        </div>
        <Button size="sm" onClick={() => setServiceModalOpen(true)} disabled={createService.isPending}>
          {createService.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Network className="h-4 w-4 mr-2" />
          )}
          Create Service
        </Button>
      </div>

      {servicesLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading services...</span>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(service.is_active ? 'active' : 'idle')}
                    <Badge className={getStatusColor(service.is_active ? 'active' : 'idle')}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{service.service_type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{service.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Requests:</span>
                    <span className="font-medium">{service.performance_metrics?.total_requests || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Success Rate:</span>
                    <span className="font-medium">{service.performance_metrics?.success_rate ? `${(service.performance_metrics.success_rate * 100).toFixed(1)}%` : 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Connected Modules:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {service.modules.map((module, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {module}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!servicesLoading && services.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <Network className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No AI Services</h3>
            <p className="text-muted-foreground mb-4">
              Create your first AI service to get started with cross-module AI capabilities.
            </p>
            <div className="text-xs text-muted-foreground mb-4 p-2 bg-gray-50 rounded">
              <p>Debug Info:</p>
              <p>Tenant ID: {selectedTenantId || 'None'}</p>
              <p>Services Count: {services.length}</p>
              <p>Loading: {servicesLoading ? 'Yes' : 'No'}</p>
            </div>
            <Button onClick={() => setServiceModalOpen(true)}>
              <Network className="h-4 w-4 mr-2" />
              Create Your First Service
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAgents = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI Agents</h3>
          <p className="text-sm text-muted-foreground">
            {selectedTenantId ? 
              `Showing agents for tenant: ${selectedTenantId.slice(0, 8)}...` : 
              'Showing global agents (no tenant selected)'
            }
          </p>
        </div>
        <Button size="sm" onClick={() => setAgentModalOpen(true)} disabled={createAgent.isPending}>
          {createAgent.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Brain className="h-4 w-4 mr-2" />
          )}
          Create Agent
        </Button>
      </div>

      {agentsLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading agents...</span>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {agents.map((agent) => (
            <Card key={agent.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(agent.status)}
                    <Badge className={getStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{agent.agent_type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Model:</span>
                    <span className="font-medium">{agent.model_config?.model_preference || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Accuracy:</span>
                    <span className="font-medium">{agent.performance_metrics?.accuracy ? `${(agent.performance_metrics.accuracy * 100).toFixed(1)}%` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Active:</span>
                    <span className="font-medium">{new Date(agent.updated_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!agentsLoading && agents.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No AI Agents</h3>
            <p className="text-muted-foreground mb-4">
              Create your first AI agent to get started with intelligent automation.
            </p>
            <div className="text-xs text-muted-foreground mb-4 p-2 bg-gray-50 rounded">
              <p>Debug Info:</p>
              <p>Tenant ID: {selectedTenantId || 'None'}</p>
              <p>Agents Count: {agents.length}</p>
              <p>Loading: {agentsLoading ? 'Yes' : 'No'}</p>
            </div>
            <Button onClick={() => setAgentModalOpen(true)}>
              <Brain className="h-4 w-4 mr-2" />
              Create Your First Agent
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <Button size="sm" variant="outline">
          View All Logs
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {recentLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{log.agent}</span>
                      <Badge variant="outline" className="text-xs">
                        {log.action}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{log.timestamp}</span>
                      <span>Duration: {log.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {log.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <Badge className={log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {log.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDecisions = () => {
    const { rules, isLoading: rulesLoading, createRule, updateRule, deleteRule } = useAIDecisionRules();
    const { instances, isLoading: instancesLoading, createInstance, processDecision } = useAIDecisionInstances();
    const { workflows, isLoading: workflowsLoading } = useAIDecisionWorkflows();
    const { analytics } = useAIDecisionAnalytics();

    const [activeDecisionTab, setActiveDecisionTab] = useState('rules');
    const [createRuleModalOpen, setCreateRuleModalOpen] = useState(false);
    const [createInstanceModalOpen, setCreateInstanceModalOpen] = useState(false);

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'approved': return 'text-green-600 bg-green-50';
        case 'rejected': return 'text-red-600 bg-red-50';
        case 'pending': return 'text-yellow-600 bg-yellow-50';
        case 'escalated': return 'text-orange-600 bg-orange-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'approved': return <CheckCircle className="h-4 w-4" />;
        case 'rejected': return <XCircle className="h-4 w-4" />;
        case 'pending': return <Clock className="h-4 w-4" />;
        case 'escalated': return <AlertTriangle className="h-4 w-4" />;
        default: return <Circle className="h-4 w-4" />;
      }
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">AI Decision Management</h2>
            <p className="text-sm text-muted-foreground">
              Configure AI-powered decision rules and monitor decision outcomes
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setCreateRuleModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
            <Button onClick={() => setCreateInstanceModalOpen(true)} variant="outline">
              <Play className="h-4 w-4 mr-2" />
              Test Decision
            </Button>
          </div>
        </div>

        {/* Decision Tabs */}
        <Tabs value={activeDecisionTab} onValueChange={setActiveDecisionTab}>
          <TabsList>
            <TabsTrigger value="rules">Decision Rules</TabsTrigger>
            <TabsTrigger value="instances">Decision Instances</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Decision Rules Tab */}
          <TabsContent value="rules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Decision Rules</CardTitle>
                <CardDescription>
                  Configure AI-powered decision rules for automated approvals and routing
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rulesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : rules.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No decision rules configured</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first decision rule to start automating decisions
                    </p>
                    <Button onClick={() => setCreateRuleModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Rule
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rules.map((rule) => (
                      <div key={rule.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{rule.name}</h3>
                            <p className="text-sm text-muted-foreground">{rule.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={rule.is_active ? "default" : "secondary"}>
                              {rule.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">{rule.rule_type}</Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => updateRule.mutate({
                                  ruleId: rule.id,
                                  updates: { is_active: !rule.is_active }
                                })}>
                                  {rule.is_active ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => deleteRule.mutate(rule.id)}
                                  className="text-red-600"
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Module:</span> {rule.module_context}
                          </div>
                          <div>
                            <span className="font-medium">Priority:</span> {rule.priority}
                          </div>
                          <div>
                            <span className="font-medium">Approval Required:</span> {rule.requires_approval ? "Yes" : "No"}
                          </div>
                          <div>
                            <span className="font-medium">Threshold:</span> {rule.approval_threshold}
                          </div>
                        </div>

                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-2">Conditions:</h4>
                          <div className="space-y-1">
                            {rule.conditions.map((condition, index) => (
                              <div key={index} className="text-xs bg-muted px-2 py-1 rounded">
                                {condition.field} {condition.operator} {condition.value}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Decision Instances Tab */}
          <TabsContent value="instances" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Decision Instances</CardTitle>
                <CardDescription>
                  Monitor and manage AI decision outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {instancesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : instances.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No decision instances</h3>
                    <p className="text-muted-foreground mb-4">
                      Decision instances will appear here when rules are triggered
                    </p>
                    <Button onClick={() => setCreateInstanceModalOpen(true)} variant="outline">
                      <Play className="h-4 w-4 mr-2" />
                      Test a Decision
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {instances.map((instance) => (
                      <div key={instance.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{instance.decision_type}</h3>
                            <p className="text-sm text-muted-foreground">
                              Created {new Date(instance.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(instance.decision_result)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(instance.decision_result)}
                                {instance.decision_result}
                              </div>
                            </Badge>
                            {instance.confidence_score && (
                              <Badge variant="outline">
                                {Math.round(instance.confidence_score * 100)}% confidence
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {instance.decision_reason && (
                          <div className="mb-3">
                            <p className="text-sm text-muted-foreground">
                              <strong>Reason:</strong> {instance.decision_reason}
                            </p>
                          </div>
                        )}

                        {instance.decision_result === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => processDecision.mutate(instance.id)}
                            disabled={processDecision.isPending}
                          >
                            {processDecision.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Play className="h-4 w-4 mr-2" />
                            )}
                            Process Decision
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Decision Workflows</CardTitle>
                <CardDescription>
                  Configure multi-step decision workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                {workflowsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : workflows.length === 0 ? (
                  <div className="text-center py-8">
                    <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No workflows configured</h3>
                    <p className="text-muted-foreground">
                      Create decision workflows for complex multi-step processes
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workflows.map((workflow) => (
                      <div key={workflow.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{workflow.name}</h3>
                            <p className="text-sm text-muted-foreground">{workflow.description}</p>
                          </div>
                          <Badge variant="outline">{workflow.workflow_type}</Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {workflow.steps.length} steps
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Decision Analytics</CardTitle>
                <CardDescription>
                  Analyze decision outcomes and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No analytics data</h3>
                    <p className="text-muted-foreground">
                      Analytics data will appear here after decision instances are processed
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analytics.map((data) => (
                      <div key={data.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{data.rule_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {data.date}
                            </p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {data.total_decisions} total decisions
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {data.approved_decisions} approved decisions
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const renderInsights = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>
            AI-generated insights and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Insights Coming Soon</h3>
            <p className="text-muted-foreground">
              AI-powered insights and recommendations will be available here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLearning = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Learning</CardTitle>
          <CardDescription>
            Machine learning model training and optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Learning Features Coming Soon</h3>
            <p className="text-muted-foreground">
              Model training and optimization features will be available here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTesting = () => {
    const { requestPrediction, isRequesting } = useUnifiedAIOrchestration();
    const [testPrompt, setTestPrompt] = useState('');
    const [lastTestResponse, setLastTestResponse] = useState<unknown>(null);

    const handleTestRequest = async () => {
      if (!testPrompt.trim()) return;

      try {
        const response = await requestPrediction({
          context: {
            user_id: 'test-user',
            tenant_id: undefined,
            module: 'orchestration',
            action: 'test_ai_request'
          },
          parameters: { prompt: testPrompt },
          priority: 'high'
        });
        
        setLastTestResponse(response);
        console.log('Test response:', response);
      } catch (error) {
        console.error('Test request failed:', error);
      }
    };

    const handleProvideFeedback = async (feedback: 'positive' | 'negative') => {
      if (!lastTestResponse) return;

      try {
        const mockDecisionId = `test_${Date.now()}`;
        console.log(`Feedback provided: ${feedback} for decision ${mockDecisionId}`);
      } catch (error) {
        console.error('Failed to provide feedback:', error);
      }
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Test AI Request</CardTitle>
              <CardDescription>
                Test the AI orchestration system with a sample request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <textarea
                  className="w-full h-24 sm:h-32 p-3 border rounded-md text-sm"
                  placeholder="Enter a test prompt..."
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleTestRequest} 
                disabled={isRequesting || !testPrompt.trim()}
                className="w-full sm:w-auto"
              >
                {isRequesting ? 'Processing...' : 'Send Test Request'}
              </Button>
            </CardContent>
          </Card>

          {lastTestResponse && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Test Response</CardTitle>
                <CardDescription>
                  Provide feedback to improve AI learning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-32 w-full rounded border">
                  <div className="bg-gray-50 p-3 text-sm">
                    <p className="font-medium mb-1">Response:</p>
                    <p className="break-words">{JSON.stringify(lastTestResponse.result, null, 2)}</p>
                    <p className="text-xs text-gray-600 mt-2">
                      Confidence: {(lastTestResponse.confidence_score * 100).toFixed(1)}%
                    </p>
                  </div>
                </ScrollArea>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={() => handleProvideFeedback('positive')}
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    👍 Positive
                  </Button>
                  <Button 
                    onClick={() => handleProvideFeedback('negative')}
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    👎 Negative
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const renderMetrics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Metrics</CardTitle>
          <CardDescription>
            Performance metrics and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Metrics Coming Soon</h3>
            <p className="text-muted-foreground">
              Detailed performance metrics will be available here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (mode === 'dashboard') {
    return renderOverview();
  }

  if (mode === 'monitoring') {
    return renderLogs();
  }

  if (mode === 'services') {
    return <AIServiceRegistry />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI Orchestration</h1>
        <Button>
          <Cpu className="h-4 w-4 mr-2" />
          System Status
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="grid grid-cols-1 gap-2">
          <TabsList className="w-full grid grid-cols-6 gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">AI Agents</TabsTrigger>
            <TabsTrigger value="setup">AI Services</TabsTrigger>
            <TabsTrigger value="decisions">Decisions</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
          </TabsList>
          <TabsList className="w-full grid grid-cols-6 gap-1">
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            {showServices && <TabsTrigger value="services">Cross-Module Services</TabsTrigger>}
            {showLogs && <TabsTrigger value="logs">Activity</TabsTrigger>}
            <TabsTrigger value="registry">Service Registry</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>
        <TabsContent value="agents" className="mt-6">
          {renderAgents()}
        </TabsContent>
        <TabsContent value="setup" className="mt-6">
          {renderSetup()}
        </TabsContent>
        <TabsContent value="decisions" className="mt-6">
          {renderDecisions()}
        </TabsContent>
        <TabsContent value="insights" className="mt-6">
          {renderInsights()}
        </TabsContent>
        <TabsContent value="learning" className="mt-6">
          {renderLearning()}
        </TabsContent>
        <TabsContent value="testing" className="mt-6">
          {renderTesting()}
        </TabsContent>
        <TabsContent value="metrics" className="mt-6">
          {renderMetrics()}
        </TabsContent>
        {showServices && (
          <TabsContent value="services" className="mt-6">
            {renderServices()}
          </TabsContent>
        )}
        {showLogs && (
          <TabsContent value="logs" className="mt-6">
            {renderLogs()}
          </TabsContent>
        )}
        <TabsContent value="registry" className="mt-6">
          <AIServiceRegistry />
        </TabsContent>
      </Tabs>

      <AgentCreationModal
        open={agentModalOpen}
        onClose={() => setAgentModalOpen(false)}
        onCreate={createAgent}
        availableModels={AVAILABLE_MODELS}
      />
      
      <ServiceCreationModal
        open={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        onCreate={createService}
        availableModels={AVAILABLE_MODELS}
      />
    </div>
  );
};

// Module metadata for registration
(AiOrchestration as unknown).moduleMetadata = {
  id: 'ai-orchestration',
  name: 'AI Orchestration',
  category: 'ai',
  version: '2.0.0',
  description: 'Enhanced AI system management and cross-module orchestration platform',
  author: 'System',
  requiredPermissions: ['read', 'admin'],
  dependencies: [],
  props: {
    showAgents: { type: 'boolean', default: true },
    showMetrics: { type: 'boolean', default: true },
    showLogs: { type: 'boolean', default: true },
    showServices: { type: 'boolean', default: true },
    mode: { type: 'string', options: ['full', 'dashboard', 'monitoring', 'services', 'setup'], default: 'full' },
    isSetupMode: { type: 'boolean', default: false }
  }
};

export default AiOrchestration;
