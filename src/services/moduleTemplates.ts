
import { ModuleManifest } from '@/types/modules';

export interface ModuleTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  manifest: Partial<ModuleManifest>;
  files: ModuleFile[];
  tags: string[];
}

export interface ModuleFile {
  path: string;
  content: string;
  type: 'component' | 'service' | 'hook' | 'style' | 'config' | 'test';
}

export class ModuleTemplateService {
  private static instance: ModuleTemplateService;

  static getInstance(): ModuleTemplateService {
    if (!ModuleTemplateService.instance) {
      ModuleTemplateService.instance = new ModuleTemplateService();
    }
    return ModuleTemplateService.instance;
  }

  getTemplates(): ModuleTemplate[] {
    return [
      {
        id: 'dashboard-widget',
        name: 'Dashboard Widget',
        description: 'Create a custom dashboard widget with charts and metrics',
        category: 'analytics',
        icon: 'BarChart3',
        tags: ['dashboard', 'widget', 'analytics', 'charts'],
        manifest: {
          category: 'analytics',
          subscriptionTiers: ['professional', 'enterprise'],
          requiredPermissions: ['dashboard.read'],
          loadOrder: 50,
          autoLoad: true,
          canUnload: true
        },
        files: [
          {
            path: 'index.ts',
            type: 'component',
            content: `export { default as DashboardWidget } from './components/DashboardWidget';
export { useDashboardData } from './hooks/useDashboardData';`
          },
          {
            path: 'components/DashboardWidget.tsx',
            type: 'component',
            content: `import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface DashboardWidgetProps {
  title?: string;
  data?: any[];
  config?: Record<string, any>;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title = 'Custom Widget',
  data = [],
  config = {}
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Widget content goes here. Customize this component for your needs.
          </p>
          {data.length > 0 && (
            <div className="text-sm">
              Data items: {data.length}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardWidget;`
          },
          {
            path: 'hooks/useDashboardData.ts',
            type: 'hook',
            content: `import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export const useDashboardData = (config: Record<string, any> = {}) => {
  const [data, setData] = useState<any[]>([]);

  const { data: queryData, isLoading, error } = useQuery({
    queryKey: ['dashboard-data', config],
    queryFn: async () => {
      // Implement your data fetching logic here
      return [];
    },
    enabled: !!config
  });

  useEffect(() => {
    if (queryData) {
      setData(queryData);
    }
  }, [queryData]);

  return {
    data,
    isLoading,
    error,
    refetch: () => {
      // Implement refetch logic
    }
  };
};`
          }
        ]
      },
      {
        id: 'data-manager',
        name: 'Data Management Module',
        description: 'CRUD operations module with forms and tables',
        category: 'business',
        icon: 'Database',
        tags: ['crud', 'forms', 'tables', 'data'],
        manifest: {
          category: 'business',
          subscriptionTiers: ['basic', 'professional', 'enterprise'],
          requiredPermissions: ['data.read', 'data.write'],
          loadOrder: 75,
          autoLoad: true,
          canUnload: true
        },
        files: [
          {
            path: 'index.ts',
            type: 'component',
            content: `export { default as DataManager } from './components/DataManager';
export { useDataOperations } from './hooks/useDataOperations';
export type { DataItem } from './types';`
          },
          {
            path: 'types/index.ts',
            type: 'config',
            content: `export interface DataItem {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}`
          },
          {
            path: 'components/DataManager.tsx',
            type: 'component',
            content: `import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Database } from 'lucide-react';
import { DataItem } from '../types';

const DataManager: React.FC = () => {
  const [items, setItems] = useState<DataItem[]>([]);

  const handleCreate = () => {
    // Implement create logic
    console.log('Create new item');
  };

  const handleEdit = (item: DataItem) => {
    // Implement edit logic
    console.log('Edit item:', item);
  };

  const handleDelete = (id: string) => {
    // Implement delete logic
    console.log('Delete item:', id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Manager
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No data items found. Click "Add Item" to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataManager;`
          },
          {
            path: 'hooks/useDataOperations.ts',
            type: 'hook',
            content: `import { useState } from 'react';
import { DataItem } from '../types';

export const useDataOperations = () => {
  const [items, setItems] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createItem = async (data: Omit<DataItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      const newItem: DataItem = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setItems(prev => [...prev, newItem]);
      return newItem;
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (id: string, updates: Partial<DataItem>) => {
    setIsLoading(true);
    try {
      setItems(prev => prev.map(item => 
        item.id === id 
          ? { ...item, ...updates, updatedAt: new Date() }
          : item
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    setIsLoading(true);
    try {
      setItems(prev => prev.filter(item => item.id !== id));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    items,
    isLoading,
    createItem,
    updateItem,
    deleteItem
  };
};`
          }
        ]
      },
      {
        id: 'integration-connector',
        name: 'Integration Connector',
        description: 'Connect with external APIs and services',
        category: 'integration',
        icon: 'Plug',
        tags: ['api', 'integration', 'connector', 'external'],
        manifest: {
          category: 'integration',
          subscriptionTiers: ['professional', 'enterprise'],
          requiredPermissions: ['integration.read', 'integration.write'],
          loadOrder: 90,
          autoLoad: false,
          canUnload: true
        },
        files: [
          {
            path: 'index.ts',
            type: 'component',
            content: `export { default as IntegrationConnector } from './components/IntegrationConnector';
export { useApiConnection } from './hooks/useApiConnection';
export { ApiService } from './services/ApiService';`
          },
          {
            path: 'components/IntegrationConnector.tsx',
            type: 'component',
            content: `import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plug, CheckCircle, AlertCircle } from 'lucide-react';

const IntegrationConnector: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');

  const testConnection = async () => {
    setConnectionStatus('testing');
    // Simulate API test
    setTimeout(() => {
      setConnectionStatus(Math.random() > 0.5 ? 'connected' : 'error');
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plug className="h-5 w-5" />
          Integration Connector
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="api-url">API Base URL</Label>
          <Input
            id="api-url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://api.example.com"
          />
        </div>

        <div>
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
          />
        </div>

        <div className="flex items-center justify-between">
          <Button onClick={testConnection} disabled={connectionStatus === 'testing'}>
            {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
          </Button>
          
          {connectionStatus === 'connected' && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              Connected
            </div>
          )}
          
          {connectionStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              Connection Failed
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationConnector;`
          },
          {
            path: 'services/ApiService.ts',
            type: 'service',
            content: `export class ApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async get(endpoint: string) {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(\`API request failed: \${response.statusText}\`);
    }
    
    return response.json();
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(\`API request failed: \${response.statusText}\`);
    }
    
    return response.json();
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}`
          },
          {
            path: 'hooks/useApiConnection.ts',
            type: 'hook',
            content: `import { useState, useCallback } from 'react';
import { ApiService } from '../services/ApiService';

export const useApiConnection = () => {
  const [apiService, setApiService] = useState<ApiService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async (baseUrl: string, apiKey: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const service = new ApiService(baseUrl, apiKey);
      const connectionSuccessful = await service.testConnection();
      
      if (connectionSuccessful) {
        setApiService(service);
        setIsConnected(true);
      } else {
        throw new Error('Connection test failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setApiService(null);
    setIsConnected(false);
    setError(null);
  }, []);

  return {
    apiService,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect
  };
};`
          }
        ]
      }
    ];
  }

  getTemplateById(id: string): ModuleTemplate | null {
    return this.getTemplates().find(template => template.id === id) || null;
  }

  getTemplatesByCategory(category: string): ModuleTemplate[] {
    return this.getTemplates().filter(template => template.category === category);
  }

  generateModuleFromTemplate(template: ModuleTemplate, customizations: Partial<ModuleManifest>): {
    manifest: ModuleManifest;
    files: ModuleFile[];
  } {
    const manifest: ModuleManifest = {
      // Default values
      id: '',
      name: '',
      version: '1.0.0',
      description: '',
      category: 'custom',
      author: 'Developer',
      license: 'MIT',
      dependencies: [],
      entryPoint: 'index.ts',
      requiredPermissions: [],
      subscriptionTiers: ['professional'],
      loadOrder: 100,
      autoLoad: true,
      canUnload: true,
      minCoreVersion: '1.0.0',
      // Template defaults
      ...template.manifest,
      // User customizations
      ...customizations
    };

    // Process template files with customizations
    const files = template.files.map(file => ({
      ...file,
      content: this.processFileTemplate(file.content, manifest)
    }));

    return { manifest, files };
  }

  private processFileTemplate(content: string, manifest: ModuleManifest): string {
    // Replace template variables
    return content
      .replace(/\{\{MODULE_NAME\}\}/g, manifest.name)
      .replace(/\{\{MODULE_ID\}\}/g, manifest.id)
      .replace(/\{\{MODULE_DESCRIPTION\}\}/g, manifest.description || '')
      .replace(/\{\{AUTHOR\}\}/g, manifest.author);
  }

  scaffoldModuleStructure(manifest: ModuleManifest, files: ModuleFile[]): Record<string, string> {
    const structure: Record<string, string> = {};

    // Add manifest file
    structure['manifest.json'] = JSON.stringify(manifest, null, 2);

    // Add template files
    files.forEach(file => {
      structure[file.path] = file.content;
    });

    // Add package.json
    structure['package.json'] = JSON.stringify({
      name: manifest.id,
      version: manifest.version,
      description: manifest.description,
      main: manifest.entryPoint,
      author: manifest.author,
      license: manifest.license,
      dependencies: {
        'react': '^18.0.0',
        '@types/react': '^18.0.0'
      }
    }, null, 2);

    // Add README.md
    structure['README.md'] = `# ${manifest.name}

${manifest.description}

## Installation

This module is part of the Total Recall AI platform.

## Usage

\`\`\`typescript
import { ${manifest.name.replace(/\s+/g, '')} } from './${manifest.entryPoint}';
\`\`\`

## Author

${manifest.author}

## License

${manifest.license}
`;

    return structure;
  }
}

export const moduleTemplateService = ModuleTemplateService.getInstance();
