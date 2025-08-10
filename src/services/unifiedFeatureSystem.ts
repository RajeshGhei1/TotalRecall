/**
 * UNIFIED FEATURE SYSTEM
 * Comprehensive architecture for managing both implemented and planned features
 */

import { FeatureImplementation } from '@/types/features';
import { 
  STANDARD_FEATURE_CATEGORIES, 
  AI_CAPABILITIES, 
  getAllStandardFeatures, 
  getAllAICapabilities 
} from './moduleFeatureLibrary';

export interface UnifiedFeature {
  id: string;
  name: string;
  category: string;
  description: string;
  
  // Implementation status
  status: 'planned' | 'in_development' | 'implemented' | 'deprecated';
  implementationLevel: 'metadata' | 'partial' | 'complete';
  
  // Metadata (always present)
  metadata: {
    version: string;
    author: string;
    tags: string[];
    businessValue: 'low' | 'medium' | 'high';
    complexity: 'simple' | 'moderate' | 'complex';
    estimatedDays: number;
    dependencies: string[];
  };
  
  // Implementation (optional - present when actually implemented)
  implementation?: FeatureImplementation;
  
  // Planning info (for unimplemented features)
  planning?: {
    roadmapPriority: number;
    requiredResources: string[];
    blockers: string[];
    specifications: string;
    mockups?: string[];
  };
  
  // Usage tracking
  usage: {
    moduleCount: number;
    lastUsed?: string;
    popularityScore: number;
    userFeedback: FeatureFeedback[];
  };
}

interface FeatureFeedback {
  userId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FeatureLibraryStatus {
  totalFeatures: number;
  implemented: number;
  inDevelopment: number;
  planned: number;
  deprecated: number;
  implementationRate: number;
}

export interface FeatureMigrationPlan {
  metadataFeature: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  estimatedEffort: string;
  suggestedTemplate: string;
  dependencies: string[];
  businessImpact: string;
}

class UnifiedFeatureSystem {
  private features: Map<string, UnifiedFeature> = new Map();
  
  constructor() {
    this.initializeSystem();
  }
  
  private initializeSystem() {
    console.log('🚀 Initializing Unified Feature System...');
    
    // Import actual implementations first
    this.importImplementedFeatures();
    
    // Import ALL metadata features (96 standard + 43 AI)
    this.importAllMetadataFeatures();
    
    // Generate migration plan
    this.generateMigrationPlan();
    
    const stats = this.getLibraryStatus();
    console.log(`✅ Feature System Initialized: ${stats.totalFeatures} total, ${stats.implemented} implemented, ${stats.planned} planned`);
  }
  
  // Import existing implemented features from services and components
  private async importImplementedFeatures(): Promise<void> {
    // AI Email Response Generator
    this.features.set('ai-email-response-generator', {
      id: 'ai-email-response-generator',
      name: 'AI Email Response Generator',
      description: 'Generate personalized email responses using AI capabilities',
      category: 'ai_communication',
      status: 'implemented',
      implementationLevel: 'complete',
      metadata: {
        version: '1.0.0',
        author: 'AI Team',
        tags: ['ai', 'email', 'automation', 'nlp'],
        businessValue: 'high',
        complexity: 'complex',
        estimatedDays: 14,
        dependencies: ['OpenAI API', 'Email Templates']
      },
      implementation: {
        id: 'ai-email-response-generator',
        name: 'AI Email Response Generator',
        version: '1.0.0',
        category: 'ai_communication',
        description: 'Generate personalized email responses using AI capabilities',
        implementation: {
          service: 'AIEmailResponseGenerator Component',
          dependencies: ['@/components/email/AIEmailResponseGenerator.tsx', '@/services/ai/emailService.ts']
        },
        development: {
          status: 'stable',
          author: 'AI Team',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString()
        },
        testing: {
          testCoverage: 85,
          testStatus: 'passing',
          testSuites: []
        },
        api: {
          methods: {
            generateResponse: {
              description: 'Generate AI email response',
              parameters: {
                context: { type: 'string', description: 'Email context', required: true },
                tone: { type: 'string', description: 'Response tone', required: false }
              },
              returns: { type: 'string', description: 'Generated email response', required: false }
            }
          }
        },
        compatibility: {
          moduleTypes: ['communication', 'ai', 'email']
        },
        usage: {
          adopters: 2,
          modules: ['email-management', 'ai-services']
        }
      },
      usage: {
        moduleCount: 2,
        popularityScore: 78,
        userFeedback: []
      }
    });

    // Smart Form Suggestions
    this.features.set('smart-form-suggestions', {
      id: 'smart-form-suggestions',
      name: 'Smart Form Suggestions',
      description: 'AI-powered form field suggestions and auto-completion',
      category: 'ai_forms',
      status: 'implemented',
      implementationLevel: 'complete',
      metadata: {
        version: '1.2.0',
        author: 'Forms Team',
        tags: ['ai', 'forms', 'suggestions', 'ux'],
        businessValue: 'medium',
        complexity: 'moderate',
        estimatedDays: 8,
        dependencies: ['Form Builder', 'AI Services']
      },
      implementation: {
        implementation: {
          service: 'Smart Form Components',
          dependencies: ['@/components/forms/smart/', '@/services/ai/formSuggestionService.ts']
        },
        testing: {
          testCoverage: 72,
          testStatus: 'passing',
          testSuites: []
        },
        api: {
          methods: {
            getSuggestions: {
              description: 'Get field suggestions',
              parameters: {
                fieldType: { type: 'string', description: 'Type of field', required: true },
                context: { type: 'string', description: 'Form context', required: false }
              },
              returns: { type: 'array', description: 'Suggested values', required: false }
            }
          }
        }
      },
      usage: {
        moduleCount: 5,
        popularityScore: 65,
        userFeedback: []
      }
    });

    // Content Analysis Service
    this.features.set('content-analysis-service', {
      id: 'content-analysis-service',
      name: 'Content Analysis Service',
      description: 'Analyze and extract insights from various content types',
      category: 'ai_analytics',
      status: 'implemented',
      implementationLevel: 'complete',
      metadata: {
        version: '1.1.0',
        author: 'Analytics Team',
        tags: ['ai', 'analysis', 'content', 'insights'],
        businessValue: 'high',
        complexity: 'complex',
        estimatedDays: 12,
        dependencies: ['AI Core', 'Document Processing']
      },
      implementation: {
        implementation: {
          service: 'Content Analysis Components',
          dependencies: ['@/services/ai/contentAnalysisService.ts', '@/components/analytics/']
        },
        testing: {
          testCoverage: 90,
          testStatus: 'passing',
          testSuites: []
        },
        api: {
          methods: [
            {
              name: 'analyzeContent',
              description: 'Analyze content for insights',
              parameters: [
                { name: 'content', type: 'string', description: 'Content to analyze', required: true },
                { name: 'analysisType', type: 'string', description: 'Type of analysis', required: false }
              ],
              returns: { type: 'object', description: 'Analysis results', required: false }
            }
          ]
        }
      },
      usage: {
        moduleCount: 3,
        popularityScore: 82,
        userFeedback: []
      }
    });

    // Bulk Upload/Download
    this.features.set('bulk-upload-download', {
      id: 'bulk-upload-download',
      name: 'Bulk Upload/Download',
      description: 'Upload and download data in bulk with CSV/Excel support, duplicate detection, and progress tracking',
      category: 'data_management',
      status: 'implemented',
      implementationLevel: 'complete',
      metadata: {
        version: '2.0.0',
        author: 'Data Team',
        tags: ['bulk-operations', 'import', 'export', 'csv', 'excel', 'data-processing'],
        businessValue: 'high',
        complexity: 'moderate',
        estimatedDays: 10,
        dependencies: ['File Processing', 'Data Validation']
      },
      implementation: {
        implementation: {
          service: 'Multiple Bulk Upload Components',
          dependencies: [
            '@/components/common/bulk-upload/BulkUploadDialog.tsx',
            '@/components/common/bulk-upload/BulkUploadProgress.tsx',
            '@/components/common/bulk-upload/BulkUploadValidation.tsx',
            '@/services/bulkUploadService.ts'
          ]
        },
        testing: {
          testCoverage: 88,
          testStatus: 'passing',
          testSuites: []
        },
        api: {
          methods: [
            {
              name: 'uploadFile',
              description: 'Upload file in bulk',
              parameters: {
                file: { type: 'object', description: 'File to upload', required: true },
                options: { type: 'object', description: 'Upload options', required: false }
              },
              returns: { type: 'object', description: 'Upload results', required: false }
            },
            {
              name: 'downloadTemplate',
              description: 'Download template file',
              parameters: {
                templateType: { type: 'string', description: 'Template type', required: true }
              },
              returns: { type: 'object', description: 'Template file', required: false }
            }
          ]
        }
      },
      usage: {
        moduleCount: 8,
        popularityScore: 92,
        userFeedback: []
      }
    });

    // LinkedIn Profile Enrichment
    this.features.set('linkedin-enrichment', {
      id: 'linkedin-enrichment',
      name: 'LinkedIn Profile Enrichment',
      description: 'Automated LinkedIn data enrichment for profiles and companies',
      category: 'integrations',
      status: 'implemented',
      implementationLevel: 'complete',
      metadata: {
        version: '1.5.0',
        author: 'Integration Team',
        tags: ['linkedin', 'enrichment', 'automation', 'integration', 'data-enhancement'],
        businessValue: 'high',
        complexity: 'complex',
        estimatedDays: 15,
        dependencies: ['LinkedIn API', 'OAuth Integration']
      },
      implementation: {
        implementation: {
          service: 'LinkedInApiService with Dashboard Components',
          dependencies: [
            '@/components/linkedin/enrichment/',
            '@/components/linkedin/LinkedInCredentialsSetup.tsx',
            '@/services/linkedinService.ts'
          ]
        },
        testing: {
          testCoverage: 75,
          testStatus: 'passing',
          testSuites: []
        },
        api: {
          methods: [
            {
              name: 'enrichProfile',
              description: 'Enrich profile with LinkedIn data',
              parameters: [
                { name: 'profileId', type: 'string', description: 'Profile ID', required: true },
                { name: 'linkedinUrl', type: 'string', description: 'LinkedIn URL', required: false }
              ],
              returns: { type: 'object', description: 'Enriched profile data', required: false }
            }
          ]
        }
      },
      usage: {
        moduleCount: 4,
        popularityScore: 87,
        userFeedback: []
      }
    });

    // Form Builder
    this.features.set('form-builder', {
      id: 'form-builder',
      name: 'Form Builder',
      description: 'Comprehensive drag-and-drop form builder with field palette, sections, preview, and settings',
      category: 'form_management',
      status: 'implemented',
      implementationLevel: 'complete',
      metadata: {
        version: '3.0.0',
        author: 'Forms Team',
        tags: ['forms', 'builder', 'drag-drop', 'ui-builder', 'field-palette'],
        businessValue: 'high',
        complexity: 'complex',
        estimatedDays: 20,
        dependencies: ['React Hook Form', 'DnD Kit', 'Form Validation']
      },
      implementation: {
        implementation: {
          service: 'Form Builder System',
          dependencies: [
            '@/components/forms/FormBuilder.tsx',
            '@/components/forms/builder/FormDesigner.tsx',
            '@/components/forms/builder/FormCanvas.tsx',
            '@/components/forms/builder/FieldPalette.tsx',
            '@/components/forms/builder/FormPreview.tsx',
            '@/components/forms/builder/FormSettings.tsx',
            '@/hooks/forms/useFormSections.ts',
            '@/hooks/forms/useFormFields.ts'
          ]
        },
        testing: {
          testCoverage: 82,
          testStatus: 'passing',
          testSuites: []
        },
        api: {
          methods: [
            {
              name: 'createForm',
              description: 'Create new form',
              parameters: [
                { name: 'formDefinition', type: 'object', description: 'Form configuration', required: true }
              ],
              returns: { type: 'object', description: 'Created form', required: false }
            },
            {
              name: 'addField',
              description: 'Add field to form',
              parameters: [
                { name: 'formId', type: 'string', description: 'Form ID', required: true },
                { name: 'fieldConfig', type: 'object', description: 'Field configuration', required: true }
              ],
              returns: { type: 'object', description: 'Added field', required: false }
            }
          ]
        }
      },
      usage: {
        moduleCount: 12,
        popularityScore: 95,
        userFeedback: []
      }
    });

    // Report Builder
    this.features.set('report-builder', {
      id: 'report-builder',
      name: 'Report Builder',
      description: 'Dynamic report creation with entity selection, column configuration, filters, and visualizations',
      category: 'analytics',
      status: 'implemented',
      implementationLevel: 'complete',
      metadata: {
        version: '2.5.0',
        author: 'Analytics Team',
        tags: ['reports', 'analytics', 'visualization', 'charts', 'data-analysis'],
        businessValue: 'high',
        complexity: 'complex',
        estimatedDays: 18,
        dependencies: ['Chart.js', 'Data Services', 'Query Builder']
      },
      implementation: {
        implementation: {
          service: 'Report Builder System',
          dependencies: [
            '@/components/reporting/ReportBuilder.tsx',
            '@/components/reporting/report-builder/ReportBuilderCard.tsx',
            '@/components/reporting/report-builder/creation/ReportCreationTab.tsx',
            '@/components/reporting/report-builder/creation/ReportForm.tsx',
            '@/components/reporting/report-builder/creation/ReportResults.tsx',
            '@/components/reporting/report-builder/creation/visualizations/ChartVisualization.tsx',
            '@/services/reportingService.ts'
          ]
        },
        testing: {
          testCoverage: 78,
          testStatus: 'passing',
          testSuites: []
        },
        api: {
          methods: [
            {
              name: 'runDynamicReport',
              description: 'Execute dynamic report',
              parameters: [
                { name: 'entity', type: 'string', description: 'Data entity', required: true },
                { name: 'columns', type: 'array', description: 'Selected columns', required: true },
                { name: 'filters', type: 'array', description: 'Report filters', required: false }
              ],
              returns: { type: 'array', description: 'Report results', required: false }
            },
            {
              name: 'saveReport',
              description: 'Save report configuration',
              parameters: [
                { name: 'reportConfig', type: 'object', description: 'Report configuration', required: true }
              ],
              returns: { type: 'object', description: 'Saved report', required: false }
            }
          ]
        }
      },
      usage: {
        moduleCount: 6,
        popularityScore: 89,
        userFeedback: []
      }
    });

    // Dashboard Builder
    this.features.set('dashboard-builder', {
      id: 'dashboard-builder',
      name: 'Dashboard Builder',
      description: 'Widget-based dashboard creation with data sources, layout configuration, and real-time updates',
      category: 'analytics',
      status: 'implemented',
      implementationLevel: 'complete',
      metadata: {
        version: '2.8.0',
        author: 'Dashboard Team',
        tags: ['dashboard', 'widgets', 'analytics', 'visualization', 'real-time'],
        businessValue: 'high',
        complexity: 'complex',
        estimatedDays: 22,
        dependencies: ['React Grid Layout', 'Chart Components', 'Data Sources']
      },
      implementation: {
        implementation: {
          service: 'Dashboard Builder System',
          dependencies: [
            '@/components/dashboard/DashboardBuilder.tsx',
            '@/components/dashboard/DynamicDashboard.tsx',
            '@/components/dashboard/DashboardWidget.tsx',
            '@/components/dashboard/builder/DashboardBuilderHeader.tsx',
            '@/components/dashboard/builder/WidgetPalette.tsx',
            '@/components/dashboard/builder/DashboardPreview.tsx',
            '@/hooks/dashboard/useDashboardConfig.ts',
            '@/hooks/dashboard/useWidgetData.ts'
          ]
        },
        testing: {
          testCoverage: 85,
          testStatus: 'passing',
          testSuites: []
        },
        api: {
          methods: [
            {
              name: 'createDashboard',
              description: 'Create new dashboard',
              parameters: [
                { name: 'dashboardConfig', type: 'object', description: 'Dashboard configuration', required: true }
              ],
              returns: { type: 'object', description: 'Created dashboard', required: false }
            },
            {
              name: 'addWidget',
              description: 'Add widget to dashboard',
              parameters: [
                { name: 'dashboardId', type: 'string', description: 'Dashboard ID', required: true },
                { name: 'widgetConfig', type: 'object', description: 'Widget configuration', required: true }
              ],
              returns: { type: 'object', description: 'Added widget', required: false }
            }
          ]
        }
      },
      usage: {
        moduleCount: 10,
        popularityScore: 93,
        userFeedback: []
      }
    });

    // Custom Field Dropdown Options Management
    this.features.set('dropdown-options-management', {
      id: 'dropdown-options-management',
      name: 'Dropdown Options Management',
      description: 'Comprehensive management of dropdown categories and options with drag-and-drop ordering and dynamic addition',
      category: 'data_management',
      status: 'implemented',
      implementationLevel: 'complete',
      metadata: {
        version: '2.2.0',
        author: 'Data Team',
        tags: ['dropdown', 'options', 'categories', 'data-management', 'configuration'],
        businessValue: 'medium',
        complexity: 'moderate',
        estimatedDays: 12,
        dependencies: ['DnD Kit', 'Form Validation', 'Database Relations']
      },
      implementation: {
        implementation: {
          service: 'Dropdown Options Management System',
          dependencies: [
            '@/components/superadmin/dropdown-manager/options-manager/OptionsManager.tsx',
            '@/components/superadmin/dropdown-manager/CategorySelector.tsx',
            '@/components/superadmin/dropdown-manager/OptionsTable.tsx',
            '@/components/superadmin/dropdown-manager/options-manager/OptionsList.tsx',
            '@/hooks/useDropdownOptions.ts',
            '@/hooks/dropdown/types.ts'
          ]
        },
        testing: {
          testCoverage: 80,
          testStatus: 'passing',
          testSuites: []
        },
        api: {
          methods: [
            {
              name: 'createCategory',
              description: 'Create dropdown category',
              parameters: [
                { name: 'categoryName', type: 'string', description: 'Category name', required: true },
                { name: 'description', type: 'string', description: 'Category description', required: false }
              ],
              returns: { type: 'object', description: 'Created category', required: false }
            },
            {
              name: 'addOption',
              description: 'Add option to category',
              parameters: [
                { name: 'categoryId', type: 'string', description: 'Category ID', required: true },
                { name: 'optionData', type: 'object', description: 'Option data', required: true }
              ],
              returns: { type: 'object', description: 'Added option', required: false }
            }
          ]
        }
      },
      usage: {
        moduleCount: 15,
        popularityScore: 85,
        userFeedback: []
      }
    });

    // Custom Fields Management
    this.features.set('custom-fields', {
      id: 'custom-fields',
      name: 'Custom Fields',
      description: 'Create and manage custom fields for any entity with validation, conditional logic, and multi-tenant support',
      category: 'data_management',
      status: 'implemented',
      implementationLevel: 'complete',
      metadata: {
        version: '2.1.0',
        author: 'Data Management Team',
        tags: ['custom-fields', 'data', 'management', 'validation', 'forms', 'entities'],
        businessValue: 'high',
        complexity: 'moderate',
        estimatedDays: 10,
        dependencies: ['Database Schema', 'Form Components', 'Validation Engine']
      },
      implementation: {
        id: 'custom-fields',
        name: 'Custom Fields Management',
        version: '2.1.0',
        category: 'data_management',
        description: 'Comprehensive custom fields system with global and tenant-specific support',
        implementation: {
          service: 'Custom Fields Management System',
          dependencies: [
            '@/components/features/atomic/CustomFieldsFeature.tsx',
            '@/components/customFields/form/CustomFieldForm.tsx',
            '@/components/customFields/form/CustomFieldsList.tsx',
            '@/components/customFields/form/CustomFieldPreview.tsx',
            '@/hooks/customFields/useCustomFieldsQuery.ts',
            '@/hooks/customFields/useCustomFieldsMutations.ts',
            '@/services/customFieldsService.ts'
          ]
        },
        development: {
          status: 'stable',
          author: 'Data Management Team',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString()
        },
        testing: {
          testCoverage: 88,
          testStatus: 'passing',
          testSuites: [
            'Custom Field Creation Tests',
            'Field Validation Tests',
            'Multi-tenant Tests',
            'Integration Tests'
          ]
        },
        api: {
          methods: {
            createCustomField: {
              description: 'Create new custom field',
              parameters: {
                fieldData: { type: 'object', description: 'Field configuration', required: true },
                fieldScope: { type: 'string', description: 'Global or tenant scope', required: true }
              },
              returns: { type: 'object', description: 'Created custom field', required: false }
            },
            getCustomFields: {
              description: 'Get custom fields for entity',
              parameters: {
                entityType: { type: 'string', description: 'Entity type', required: true },
                tenantId: { type: 'string', description: 'Tenant ID', required: false }
              },
              returns: { type: 'array', description: 'List of custom fields', required: false }
            },
            validateFieldValue: {
              description: 'Validate custom field value',
              parameters: {
                fieldId: { type: 'string', description: 'Field ID', required: true },
                value: { type: 'any', description: 'Value to validate', required: true }
              },
              returns: { type: 'object', description: 'Validation result', required: false }
            }
          }
        },
        compatibility: {
          moduleTypes: ['data_management', 'forms', 'entities', 'companies', 'people']
        },
        usage: {
          adopters: 5,
          modules: ['companies', 'people', 'forms', 'reports', 'dashboard']
        }
      },
      usage: {
        moduleCount: 5,
        popularityScore: 92,
        userFeedback: [
          {
            rating: 5,
            feedback: 'Essential for data flexibility',
            module: 'companies'
          },
          {
            rating: 4,
            feedback: 'Great validation features',
            module: 'forms'
          }
        ]
      }
    });

    console.log('✅ Imported all implemented features');
  }
  
  private importAllMetadataFeatures() {
    console.log('📋 Importing ALL metadata features...');
    
    // Get all 96 standard features
    const allStandardFeatures = getAllStandardFeatures();
    console.log(`📊 Processing ${allStandardFeatures.length} standard features across ${STANDARD_FEATURE_CATEGORIES.length} categories`);
    
    // Convert each standard feature to UnifiedFeature
    allStandardFeatures.forEach((featureName, index) => {
      const featureId = featureName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      // Skip if already implemented
      if (this.features.has(featureId)) {
        console.log(`⚡ Skipping ${featureName} - already implemented`);
        return;
      }
      
      const category = this.findFeatureCategory(featureName);
      
      const unifiedFeature: UnifiedFeature = {
        id: featureId,
        name: featureName,
        category: category || 'core_infrastructure',
        description: `${featureName} functionality for enterprise applications`,
        status: 'planned',
        implementationLevel: 'metadata',
        metadata: {
          version: '0.0.1',
          author: 'Planning',
          tags: this.generateTags(featureName),
          businessValue: this.assessBusinessValue(featureName),
          complexity: this.assessComplexity(featureName),
          estimatedDays: this.estimateEffort(featureName),
          dependencies: []
        },
        planning: {
          roadmapPriority: this.calculatePriority(featureName, index),
          requiredResources: ['Frontend Developer', 'Backend Developer'],
          blockers: [],
          specifications: `Specifications needed for ${featureName} implementation`
        },
        usage: {
          moduleCount: 0,
          popularityScore: 0,
          userFeedback: []
        }
      };
      
      this.features.set(featureId, unifiedFeature);
    });
    
    // Get all 43 AI capabilities
    const allAICapabilities = getAllAICapabilities();
    console.log(`🧠 Processing ${allAICapabilities.length} AI capabilities`);
    
    // Convert each AI capability to UnifiedFeature
    allAICapabilities.forEach((aiCapabilityName, index) => {
      const featureId = aiCapabilityName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      // Skip if already implemented
      if (this.features.has(featureId)) {
        console.log(`⚡ Skipping ${aiCapabilityName} - already implemented`);
        return;
      }
      
      const aiCapability = AI_CAPABILITIES.find(cap => cap.name === aiCapabilityName);
      
      const unifiedFeature: UnifiedFeature = {
        id: featureId,
        name: aiCapabilityName,
        category: 'ai_intelligence',
        description: aiCapability?.description || `${aiCapabilityName} AI capability for intelligent automation`,
        status: 'planned',
        implementationLevel: 'metadata',
        metadata: {
          version: '0.0.1',
          author: 'AI Planning',
          tags: ['ai', ...this.generateTags(aiCapabilityName)],
          businessValue: 'high', // AI capabilities are generally high value
          complexity: 'complex', // AI is generally complex
          estimatedDays: this.estimateEffort(aiCapabilityName) + 5, // AI needs extra time
          dependencies: ['ai-core', 'machine-learning']
        },
        planning: {
          roadmapPriority: this.calculatePriority(aiCapabilityName, index + 100), // Offset for AI
          requiredResources: ['AI Engineer', 'Data Scientist', 'Frontend Developer'],
          blockers: ['AI infrastructure', 'training data'],
          specifications: `AI implementation specs for ${aiCapabilityName}`
        },
        usage: {
          moduleCount: 0,
          popularityScore: 0,
          userFeedback: []
        }
      };
      
      this.features.set(featureId, unifiedFeature);
    });
    
    console.log(`✅ Imported ${allStandardFeatures.length} standard + ${allAICapabilities.length} AI = ${allStandardFeatures.length + allAICapabilities.length} metadata features`);
  }
  
  private findFeatureCategory(featureName: string): string | null {
    for (const category of STANDARD_FEATURE_CATEGORIES) {
      if (category.features.includes(featureName)) {
        return category.id;
      }
    }
    return null;
  }
  
  private categorizeFeature(featureName: string): string {
    const categoryMap: Record<string, string> = {
      'authentication': 'user_management',
      'user': 'user_management',
      'role': 'user_management',
      'permission': 'user_management',
      'email': 'communication',
      'messaging': 'communication',
      'notification': 'communication',
      'sales': 'sales_crm',
      'lead': 'sales_crm',
      'crm': 'sales_crm',
      'pipeline': 'sales_crm',
      'dashboard': 'analytics_reporting',
      'report': 'analytics_reporting',
      'analytics': 'analytics_reporting',
      'form': 'forms_templates',
      'template': 'forms_templates',
      'workflow': 'workflow_automation',
      'automation': 'workflow_automation',
      'process': 'workflow_automation',
      'data': 'data_management',
      'import': 'data_management',
      'export': 'data_management',
      'integration': 'integration',
      'api': 'integration',
      'webhook': 'integration',
      'ai': 'ai_intelligence',
      'machine': 'ai_intelligence',
      'intelligent': 'ai_intelligence'
    };
    
    const lowerFeature = featureName.toLowerCase();
    for (const [keyword, category] of Object.entries(categoryMap)) {
      if (lowerFeature.includes(keyword)) {
        return category;
      }
    }
    
    return 'core_infrastructure';
  }
  
  private generateTags(featureName: string): string[] {
    const tags: string[] = [];
    const lowerFeature = featureName.toLowerCase();
    
    if (lowerFeature.includes('ai') || lowerFeature.includes('intelligent') || lowerFeature.includes('smart')) {
      tags.push('ai');
    }
    if (lowerFeature.includes('user') || lowerFeature.includes('authentication')) {
      tags.push('user-management');
    }
    if (lowerFeature.includes('data')) {
      tags.push('data');
    }
    if (lowerFeature.includes('automation') || lowerFeature.includes('workflow')) {
      tags.push('automation');
    }
    if (lowerFeature.includes('bulk') || lowerFeature.includes('import') || lowerFeature.includes('export')) {
      tags.push('bulk-operations');
    }
    
    return tags.length > 0 ? tags : ['general'];
  }
  
  private assessBusinessValue(featureName: string): 'low' | 'medium' | 'high' {
    const highValueKeywords = ['authentication', 'security', 'sales', 'crm', 'analytics', 'dashboard', 'import', 'export', 'bulk'];
    const mediumValueKeywords = ['user', 'data', 'email', 'workflow', 'integration'];
    
    const lowerFeature = featureName.toLowerCase();
    
    if (highValueKeywords.some(keyword => lowerFeature.includes(keyword))) {
      return 'high';
    }
    if (mediumValueKeywords.some(keyword => lowerFeature.includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  }
  
  private assessComplexity(featureName: string): 'simple' | 'moderate' | 'complex' {
    const complexKeywords = ['ai', 'machine learning', 'predictive', 'orchestration', 'pipeline', 'analytics', 'intelligence'];
    const moderateKeywords = ['authentication', 'workflow', 'integration', 'automation', 'bulk', 'import'];
    
    const lowerFeature = featureName.toLowerCase();
    
    if (complexKeywords.some(keyword => lowerFeature.includes(keyword))) {
      return 'complex';
    }
    if (moderateKeywords.some(keyword => lowerFeature.includes(keyword))) {
      return 'moderate';
    }
    
    return 'simple';
  }
  
  private estimateEffort(featureName: string): number {
    const complexity = this.assessComplexity(featureName);
    const businessValue = this.assessBusinessValue(featureName);
    
    let baseDays = 5;
    
    switch (complexity) {
      case 'simple': baseDays = 3; break;
      case 'moderate': baseDays = 7; break;
      case 'complex': baseDays = 15; break;
    }
    
    // Adjust for business value (higher value = more thorough implementation)
    if (businessValue === 'high') baseDays *= 1.5;
    if (businessValue === 'low') baseDays *= 0.8;
    
    return Math.round(baseDays);
  }
  
  private calculatePriority(featureName: string, index: number): number {
    const businessValue = this.assessBusinessValue(featureName);
    const complexity = this.assessComplexity(featureName);
    
    let priority = 50; // Base priority
    
    // Business value impact
    if (businessValue === 'high') priority += 30;
    if (businessValue === 'medium') priority += 15;
    
    // Complexity impact (simpler = higher priority for quick wins)
    if (complexity === 'simple') priority += 20;
    if (complexity === 'moderate') priority += 10;
    if (complexity === 'complex') priority -= 10;
    
    // Add some randomness based on index to avoid ties
    priority += (index % 10) - 5;
    
    return Math.max(0, Math.min(100, priority));
  }
  
  private generateMigrationPlan() {
    const plannedFeatures = Array.from(this.features.values())
      .filter(f => f.status === 'planned')
      .sort((a, b) => (b.planning?.roadmapPriority || 0) - (a.planning?.roadmapPriority || 0))
      .slice(0, 20);
    
    console.log(`📋 Generated migration plan for top ${plannedFeatures.length} priority features:`, 
      plannedFeatures.map(f => f.name));
  }
  
  // Public API
  public getAllFeatures(): UnifiedFeature[] {
    return Array.from(this.features.values());
  }
  
  public getFeaturesByStatus(status: UnifiedFeature['status']): UnifiedFeature[] {
    return this.getAllFeatures().filter(f => f.status === status);
  }
  
  public getImplementedFeatures(): UnifiedFeature[] {
    return this.getFeaturesByStatus('implemented');
  }
  
  public getPlannedFeatures(): UnifiedFeature[] {
    return this.getFeaturesByStatus('planned');
  }
  
  public getLibraryStatus(): FeatureLibraryStatus {
    const features = this.getAllFeatures();
    const implemented = features.filter(f => f.status === 'implemented').length;
    const inDevelopment = features.filter(f => f.status === 'in_development').length;
    const planned = features.filter(f => f.status === 'planned').length;
    const deprecated = features.filter(f => f.status === 'deprecated').length;
    
    return {
      totalFeatures: features.length,
      implemented,
      inDevelopment,
      planned,
      deprecated,
      implementationRate: Math.round((implemented / features.length) * 100)
    };
  }
  
  public getMigrationCandidates(limit: number = 10): FeatureMigrationPlan[] {
    return this.getPlannedFeatures()
      .sort((a, b) => (b.planning?.roadmapPriority || 0) - (a.planning?.roadmapPriority || 0))
      .slice(0, limit)
      .map(feature => ({
        metadataFeature: feature.name,
        priority: this.mapPriorityLevel(feature.planning?.roadmapPriority || 0),
        estimatedEffort: `${feature.metadata.estimatedDays} days`,
        suggestedTemplate: this.suggestTemplate(feature),
        dependencies: feature.metadata.dependencies,
        businessImpact: `${feature.metadata.businessValue} business value`
      }));
  }
  
  private mapPriorityLevel(score: number): 'urgent' | 'high' | 'medium' | 'low' {
    if (score >= 80) return 'urgent';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }
  
  private suggestTemplate(feature: UnifiedFeature): string {
    const category = feature.category;
    const templateMap: Record<string, string> = {
      'user_management': 'Authentication Component Template',
      'communication': 'Messaging Service Template',
      'sales_crm': 'CRM Feature Template',
      'analytics_reporting': 'Analytics Widget Template',
      'forms_templates': 'Form Component Template',
      'workflow_automation': 'Workflow Service Template',
      'data_management': 'Data Service Template',
      'integration': 'Integration Service Template',
      'ai_intelligence': 'AI Service Template'
    };
    
    return templateMap[category] || 'Basic Component Template';
  }
  
  public promoteFeatureToImplemented(featureId: string, implementation: FeatureImplementation): boolean {
    const feature = this.features.get(featureId);
    if (!feature) return false;
    
    feature.status = 'implemented';
    feature.implementationLevel = 'complete';
    feature.implementation = implementation;
    feature.metadata.version = implementation.version;
    
    return true;
  }
  
  public startFeatureDevelopment(featureId: string): boolean {
    const feature = this.features.get(featureId);
    if (!feature || feature.status !== 'planned') return false;
    
    feature.status = 'in_development';
    
    return true;
  }
}

// Singleton instance
export const unifiedFeatureSystem = new UnifiedFeatureSystem();

// Export utilities
export const getFeatureLibraryStatus = () => unifiedFeatureSystem.getLibraryStatus();
export const getAllUnifiedFeatures = () => unifiedFeatureSystem.getAllFeatures();
export const getImplementedFeatures = () => unifiedFeatureSystem.getImplementedFeatures();
export const getPlannedFeatures = () => unifiedFeatureSystem.getPlannedFeatures();
export const getMigrationCandidates = (limit?: number) => unifiedFeatureSystem.getMigrationCandidates(limit); 