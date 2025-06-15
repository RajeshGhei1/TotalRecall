
import { ModuleContext } from '@/types/modules';

// Module entry point
export class CompaniesModule {
  private context: ModuleContext | null = null;

  async initialize(context: ModuleContext): Promise<void> {
    console.log('Initializing Companies module for tenant:', context.tenantId);
    this.context = context;
    
    // Module-specific initialization logic
    await this.setupModuleServices();
    await this.registerModuleComponents();
  }

  async cleanup(): Promise<void> {
    console.log('Cleaning up Companies module');
    // Module cleanup logic
  }

  private async setupModuleServices(): Promise<void> {
    // Initialize module services
  }

  private async registerModuleComponents(): Promise<void> {
    // Register module components with the main application
  }

  getContext(): ModuleContext | null {
    return this.context;
  }
}

// Export module instance
export default new CompaniesModule();

// Re-export components for external use
export { default as CompaniesPage } from './pages/CompaniesPage';
export { default as CompanyForm } from './components/CompanyForm';
export * from './hooks/useCompanies';
export * from './services/CompanyService';
