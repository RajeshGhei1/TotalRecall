
import { supabase } from '@/integrations/supabase/client';

export interface DocumentContent {
  title: string;
  content: string;
  lastModified: string;
  wordCount: number;
}

export interface CodeChange {
  filePath: string;
  changeType: 'created' | 'modified' | 'deleted';
  timestamp: string;
  affectedComponents?: string[];
  affectedAPIs?: string[];
}

export interface DocumentationUpdate {
  id: string;
  documentPath: string;
  updateType: 'auto' | 'manual';
  content: string;
  metadata: {
    sourceFiles: string[];
    generatedAt: string;
    version: string;
  };
}

// Browser-compatible watcher interface
interface FileWatcher {
  path: string;
  lastCheck: number;
  onChange: (changes: CodeChange[]) => void;
}

class DocumentationService {
  private watchers: Map<string, FileWatcher> = new Map();
  private updateQueue: DocumentationUpdate[] = [];
  private isInitialized = false;

  async initializeDocumentationSystem() {
    if (this.isInitialized) return;
    
    console.log('Initializing real-time documentation system...');
    
    // Set up simulated file watchers for key directories
    await this.setupFileWatchers();
    
    // Start processing queue
    this.startUpdateProcessor();
    
    this.isInitialized = true;
  }

  private async setupFileWatchers() {
    const watchPaths = [
      'src/components',
      'src/hooks',
      'src/services',
      'src/pages',
      'supabase/functions',
      'supabase/migrations'
    ];

    for (const path of watchPaths) {
      await this.createWatcher(path);
    }
  }

  private async createWatcher(path: string) {
    // Browser-compatible watcher simulation
    console.log(`Setting up watcher for: ${path}`);
    
    const watcher: FileWatcher = {
      path,
      lastCheck: Date.now(),
      onChange: (changes: CodeChange[]) => this.handleCodeChanges(changes)
    };
    
    this.watchers.set(path, watcher);
  }

  private async handleCodeChanges(changes: CodeChange[]) {
    console.log('Code changes detected:', changes);
    
    for (const change of changes) {
      await this.analyzeAndUpdateDocumentation(change);
    }
  }

  private async analyzeAndUpdateDocumentation(change: CodeChange) {
    try {
      // Extract documentation requirements from code
      const analysis = await this.analyzeCodeFile(change.filePath);
      
      // Generate documentation content
      const content = await this.generateDocumentationContent(analysis);
      
      // Queue update
      this.queueDocumentationUpdate({
        id: `doc-${Date.now()}`,
        documentPath: this.getDocumentationPath(change.filePath),
        updateType: 'auto',
        content,
        metadata: {
          sourceFiles: [change.filePath],
          generatedAt: new Date().toISOString(),
          version: '1.0.0'
        }
      });
    } catch (error) {
      console.error('Error updating documentation:', error);
    }
  }

  private async analyzeCodeFile(filePath: string): Promise<any> {
    // Simulate code analysis - in reality this would parse AST
    const analysis = {
      components: [],
      hooks: [],
      types: [],
      exports: [],
      imports: []
    };

    if (filePath.includes('components/')) {
      analysis.components = this.extractComponentInfo(filePath);
    } else if (filePath.includes('hooks/')) {
      analysis.hooks = this.extractHookInfo(filePath);
    } else if (filePath.includes('services/')) {
      analysis.exports = this.extractServiceInfo(filePath);
    }

    return analysis;
  }

  private extractComponentInfo(filePath: string) {
    // Extract component props, exports, etc.
    return [{
      name: this.getComponentNameFromPath(filePath),
      props: [],
      description: 'Auto-generated component documentation',
      examples: []
    }];
  }

  private extractHookInfo(filePath: string) {
    return [{
      name: this.getHookNameFromPath(filePath),
      parameters: [],
      returnType: 'unknown',
      description: 'Auto-generated hook documentation'
    }];
  }

  private extractServiceInfo(filePath: string) {
    return [{
      name: this.getServiceNameFromPath(filePath),
      methods: [],
      description: 'Auto-generated service documentation'
    }];
  }

  private async generateDocumentationContent(analysis: any): Promise<string> {
    let content = `# Auto-Generated Documentation\n\n`;
    content += `Generated at: ${new Date().toISOString()}\n\n`;

    if (analysis.components?.length > 0) {
      content += `## Components\n\n`;
      for (const component of analysis.components) {
        content += `### ${component.name}\n\n`;
        content += `${component.description}\n\n`;
      }
    }

    if (analysis.hooks?.length > 0) {
      content += `## Hooks\n\n`;
      for (const hook of analysis.hooks) {
        content += `### ${hook.name}\n\n`;
        content += `${hook.description}\n\n`;
      }
    }

    if (analysis.exports?.length > 0) {
      content += `## Services\n\n`;
      for (const service of analysis.exports) {
        content += `### ${service.name}\n\n`;
        content += `${service.description}\n\n`;
      }
    }

    return content;
  }

  private queueDocumentationUpdate(update: DocumentationUpdate) {
    this.updateQueue.push(update);
    console.log(`Queued documentation update for: ${update.documentPath}`);
  }

  private startUpdateProcessor() {
    setInterval(async () => {
      if (this.updateQueue.length > 0) {
        const update = this.updateQueue.shift();
        if (update) {
          await this.processDocumentationUpdate(update);
        }
      }
    }, 5000); // Process every 5 seconds
  }

  private async processDocumentationUpdate(update: DocumentationUpdate) {
    try {
      // Store in database
      await this.storeDocumentationUpdate(update);
      
      // Broadcast real-time update
      await this.broadcastDocumentationChange(update);
      
      console.log(`Processed documentation update: ${update.documentPath}`);
    } catch (error) {
      console.error('Error processing documentation update:', error);
    }
  }

  private async storeDocumentationUpdate(update: DocumentationUpdate) {
    const { error } = await supabase
      .from('documentation_updates')
      .insert({
        document_path: update.documentPath,
        content: update.content,
        update_type: update.updateType,
        metadata: update.metadata
      });

    if (error) {
      console.error('Error storing documentation update:', error);
    }
  }

  private async broadcastDocumentationChange(update: DocumentationUpdate) {
    // Use Supabase realtime to broadcast changes
    const channel = supabase.channel('documentation-updates');
    
    channel.send({
      type: 'broadcast',
      event: 'documentation_updated',
      payload: {
        documentPath: update.documentPath,
        updateType: update.updateType,
        timestamp: update.metadata.generatedAt
      }
    });
  }

  // Utility methods
  private getDocumentationPath(filePath: string): string {
    return filePath.replace('src/', 'docs/').replace('.tsx', '.md').replace('.ts', '.md');
  }

  private getComponentNameFromPath(filePath: string): string {
    return filePath.split('/').pop()?.replace('.tsx', '') || 'Unknown';
  }

  private getHookNameFromPath(filePath: string): string {
    return filePath.split('/').pop()?.replace('.ts', '') || 'Unknown';
  }

  private getServiceNameFromPath(filePath: string): string {
    return filePath.split('/').pop()?.replace('.ts', '') || 'Unknown';
  }

  // Public method to manually trigger documentation updates
  public async triggerDocumentationUpdate(filePath: string, changeType: 'created' | 'modified' | 'deleted' = 'modified') {
    const change: CodeChange = {
      filePath,
      changeType,
      timestamp: new Date().toISOString()
    };
    
    await this.handleCodeChanges([change]);
  }

  // Public method to get recent documentation updates
  public async getRecentUpdates(limit = 10) {
    const { data, error } = await supabase
      .from('documentation_updates')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching documentation updates:', error);
      return [];
    }

    return data || [];
  }
}

export const documentationService = new DocumentationService();
