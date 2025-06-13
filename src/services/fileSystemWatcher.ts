
export interface FileChangeEvent {
  filePath: string;
  changeType: 'created' | 'modified' | 'deleted';
  timestamp: string;
  content?: string;
}

export type FileChangeCallback = (event: FileChangeEvent) => void;

class FileSystemWatcher {
  private callbacks: FileChangeCallback[] = [];
  private watchedPaths: Set<string> = new Set();
  private isWatching = false;

  // In a real implementation, we would use native file system APIs
  // For browser environment, we'll use a hybrid approach with periodic checking
  private checkInterval: number | null = null;
  private lastModifiedTimes: Map<string, number> = new Map();

  constructor() {
    // Initialize with common source directories
    this.addWatchPath('src/components');
    this.addWatchPath('src/hooks');
    this.addWatchPath('src/services');
    this.addWatchPath('src/pages');
    this.addWatchPath('src/types');
    this.addWatchPath('src/utils');
  }

  addWatchPath(path: string): void {
    this.watchedPaths.add(path);
    console.log(`Added watch path: ${path}`);
  }

  removeWatchPath(path: string): void {
    this.watchedPaths.delete(path);
    console.log(`Removed watch path: ${path}`);
  }

  onFileChange(callback: FileChangeCallback): void {
    this.callbacks.push(callback);
  }

  removeCallback(callback: FileChangeCallback): void {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  startWatching(): void {
    if (this.isWatching) return;

    this.isWatching = true;
    console.log('Starting file system watcher...');

    // Start periodic checking (every 5 seconds)
    this.checkInterval = window.setInterval(() => {
      this.checkForChanges();
    }, 5000);

    // Initial scan
    this.performInitialScan();
  }

  stopWatching(): void {
    if (!this.isWatching) return;

    this.isWatching = false;
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    console.log('Stopped file system watcher');
  }

  private async performInitialScan(): Promise<void> {
    console.log('Performing initial file scan...');
    
    // In a real implementation, we would scan the actual file system
    // For now, we'll simulate discovering files from known project structure
    const knownFiles = this.getKnownProjectFiles();
    
    for (const filePath of knownFiles) {
      await this.processFileChange(filePath, 'created');
    }
  }

  private async checkForChanges(): Promise<void> {
    // In a real implementation, this would check actual file modification times
    // For browser environment, we simulate by randomly triggering changes
    const knownFiles = this.getKnownProjectFiles();
    
    // Randomly select a file to simulate a change (10% chance per file)
    for (const filePath of knownFiles) {
      if (Math.random() < 0.1) {
        await this.processFileChange(filePath, 'modified');
        break; // Only trigger one change per check
      }
    }
  }

  private async processFileChange(filePath: string, changeType: 'created' | 'modified' | 'deleted'): Promise<void> {
    const timestamp = new Date().toISOString();
    
    // For deleted files, don't try to read content
    let content: string | undefined;
    if (changeType !== 'deleted') {
      content = await this.readFileContent(filePath);
    }

    const event: FileChangeEvent = {
      filePath,
      changeType,
      timestamp,
      content
    };

    // Notify all callbacks
    this.callbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in file change callback:', error);
      }
    });
  }

  private async readFileContent(filePath: string): Promise<string | undefined> {
    // In a real implementation, this would read the actual file
    // For browser environment, we simulate file content
    try {
      // This is a placeholder - in a real implementation you would:
      // 1. Use Node.js fs API for server-side
      // 2. Use File System Access API for modern browsers
      // 3. Use a build tool integration for development
      
      return `// Simulated content for ${filePath}\n// Last updated: ${new Date().toISOString()}`;
    } catch (error) {
      console.error(`Failed to read file ${filePath}:`, error);
      return undefined;
    }
  }

  private getKnownProjectFiles(): string[] {
    // Return list of known files from the project structure
    return [
      'src/components/documentation/DocumentationMetrics.tsx',
      'src/components/documentation/RealTimeDocumentationStatus.tsx',
      'src/components/documentation/LiveDocumentationPanel.tsx',
      'src/hooks/documentation/useRealTimeDocumentation.ts',
      'src/services/documentationService.ts',
      'src/services/codeAnalysisService.ts',
      'src/pages/superadmin/Documentation.tsx',
      'src/components/talent/TalentList.tsx',
      'src/components/talent/TalentMetricsCard.tsx',
      'src/components/talent/TalentSearch.tsx',
      'src/components/talent/TalentTable.tsx',
      'src/components/talent/TalentDeleteDialog.tsx',
      'src/components/talent/TalentSkillsSection.tsx',
      'src/components/talent/TalentListContainer.tsx',
      'src/components/talent/TalentMetricsDashboard.tsx',
      'src/components/talent/TalentLocationChart.tsx',
      'src/components/talent/TalentSalaryChart.tsx',
      'src/components/talent/TalentSkillsChart.tsx',
      'src/components/talent/TalentExperienceChart.tsx',
    ];
  }

  // Method to manually trigger a file change (useful for testing)
  public triggerFileChange(filePath: string, changeType: 'created' | 'modified' | 'deleted' = 'modified'): void {
    this.processFileChange(filePath, changeType);
  }

  // Get current watching status
  public getStatus(): { isWatching: boolean; watchedPaths: string[]; callbackCount: number } {
    return {
      isWatching: this.isWatching,
      watchedPaths: Array.from(this.watchedPaths),
      callbackCount: this.callbacks.length
    };
  }
}

export const fileSystemWatcher = new FileSystemWatcher();
