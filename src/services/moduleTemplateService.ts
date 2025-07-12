
import { ModuleManifest } from '@/types/modules';

export interface ModuleTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  manifest: Partial<ModuleManifest>;
  files: Record<string, string>;
  dependencies: string[];
}

class ModuleTemplateService {
  private static instance: ModuleTemplateService;
  private templates: Map<string, ModuleTemplate> = new Map();

  static getInstance(): ModuleTemplateService {
    if (!ModuleTemplateService.instance) {
      ModuleTemplateService.instance = new ModuleTemplateService();
      ModuleTemplateService.instance.initialize();
    }
    return ModuleTemplateService.instance;
  }

  private initialize(): void {
    // Load built-in templates
    this.loadBuiltInTemplates();
  }

  private loadBuiltInTemplates(): void {
    const templates: ModuleTemplate[] = [
      {
        id: 'basic-widget',
        name: 'Basic Widget',
        description: 'A simple widget module template',
        category: 'widget',
        manifest: {
          category: 'custom',
          author: 'Developer',
          license: 'MIT',
          dependencies: [],
          requiredPermissions: ['read'],
          subscriptionTiers: ['basic', 'pro', 'enterprise']
        },
        files: {
          'index.tsx': `import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BasicWidgetProps {
  title?: string;
  content?: string;
}

const BasicWidget: React.FC<BasicWidgetProps> = ({ 
  title = 'Basic Widget', 
  content = 'This is a basic widget module.' 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
    </Card>
  );
};

// Module metadata for registration
(BasicWidget as unknown).moduleMetadata = {
  id: 'basic-widget',
  name: 'Basic Widget',
  category: 'widget',
  version: '1.0.0',
  description: 'A simple widget module',
  author: 'Developer',
  requiredPermissions: ['read'],
  dependencies: [],
  props: {
    title: { type: 'string', default: 'Basic Widget' },
    content: { type: 'string', default: 'This is a basic widget module.' }
  }
};

export default BasicWidget;`,
          'manifest.json': `{
  "id": "basic-widget",
  "name": "Basic Widget",
  "version": "1.0.0",
  "description": "A simple widget module",
  "category": "widget",
  "author": "Developer",
  "license": "MIT",
  "minCoreVersion": "1.0.0",
  "entryPoint": "index.tsx",
  "dependencies": [],
  "requiredPermissions": ["read"],
  "subscriptionTiers": ["basic", "pro", "enterprise"],
  "loadOrder": 100,
  "autoLoad": false,
  "canUnload": true
}`
        },
        dependencies: []
      },
      {
        id: 'analytics-dashboard',
        name: 'Analytics Dashboard',
        description: 'An analytics dashboard module template',
        category: 'analytics',
        manifest: {
          category: 'analytics',
          author: 'Developer',
          license: 'MIT',
          dependencies: ['core-dashboard'],
          requiredPermissions: ['read', 'analytics_access'],
          subscriptionTiers: ['pro', 'enterprise']
        },
        files: {
          'index.tsx': `import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-muted-foreground">+10% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12.5%</div>
          <p className="text-xs text-muted-foreground">+2.1% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3.2%</div>
          <p className="text-xs text-muted-foreground">+0.3% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Analytics Score</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">87</div>
          <p className="text-xs text-muted-foreground">+5 from last month</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;`
        },
        dependencies: ['core-dashboard']
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  getTemplate(templateId: string): ModuleTemplate | undefined {
    return this.templates.get(templateId);
  }

  getAllTemplates(): ModuleTemplate[] {
    return Array.from(this.templates.values());
  }

  getTemplatesByCategory(category: string): ModuleTemplate[] {
    return this.getAllTemplates().filter(template => 
      template.category === category
    );
  }

  createModuleFromTemplate(templateId: string, moduleConfig: {
    id: string;
    name: string;
    description?: string;
  }): { manifest: ModuleManifest; files: Record<string, string> } | null {
    const template = this.getTemplate(templateId);
    if (!template) {
      return null;
    }

    // Create manifest from template
    const manifest: ModuleManifest = {
      id: moduleConfig.id,
      name: moduleConfig.name,
      version: '1.0.0',
      description: moduleConfig.description || template.description,
      category: template.category as unknown,
      author: 'Developer',
      license: 'MIT',
      dependencies: template.dependencies,
      entryPoint: 'index.tsx',
      requiredPermissions: template.manifest.requiredPermissions || ['read'],
      subscriptionTiers: template.manifest.subscriptionTiers || ['basic', 'pro', 'enterprise'],
      loadOrder: 100,
      autoLoad: false,
      canUnload: true,
      minCoreVersion: '1.0.0',
      ...template.manifest
    };

    // Process template files with replacements
    const processedFiles: Record<string, string> = {};
    Object.entries(template.files).forEach(([filename, content]) => {
      processedFiles[filename] = content
        .replace(/{{MODULE_ID}}/g, moduleConfig.id)
        .replace(/{{MODULE_NAME}}/g, moduleConfig.name)
        .replace(/{{MODULE_DESCRIPTION}}/g, moduleConfig.description || template.description);
    });

    return {
      manifest,
      files: processedFiles
    };
  }

  registerTemplate(template: ModuleTemplate): void {
    this.templates.set(template.id, template);
  }

  unregisterTemplate(templateId: string): boolean {
    return this.templates.delete(templateId);
  }
}

export const moduleTemplateService = ModuleTemplateService.getInstance();
