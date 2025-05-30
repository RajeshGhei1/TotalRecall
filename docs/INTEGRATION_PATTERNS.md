
# Total Recall - Integration Patterns

## Overview

This document defines the integration patterns and communication protocols that enable Total Recall's modular architecture and future AI orchestration capabilities.

## Current Integration Patterns

### 1. React Query State Management

#### Pattern: Server State Synchronization
**Current Implementation**: All modules use React Query for server state management.

```typescript
// Standard query pattern across modules
export const useModuleData = (filters?: ModuleFilters) => {
  return useQuery({
    queryKey: ['module-data', filters],
    queryFn: () => moduleService.fetchData(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutation pattern with optimistic updates
export const useModuleMutations = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: moduleService.updateData,
    onMutate: async (variables) => {
      // Optimistic update
      await queryClient.cancelQueries(['module-data']);
      const previousData = queryClient.getQueryData(['module-data']);
      queryClient.setQueryData(['module-data'], variables);
      return { previousData };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['module-data'], context?.previousData);
    },
    onSettled: () => {
      // Refresh data
      queryClient.invalidateQueries(['module-data']);
    }
  });
};
```

### 2. Supabase Real-time Integration

#### Pattern: Live Data Synchronization
**Current Implementation**: Real-time updates for collaborative features.

```typescript
// Real-time subscription pattern
export const useRealtimeModuleData = (moduleId: string) => {
  const [data, setData] = useState<ModuleData[]>([]);
  
  useEffect(() => {
    const subscription = supabase
      .channel(`module-${moduleId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'module_data',
        filter: `module_id=eq.${moduleId}`
      }, (payload) => {
        setData(current => {
          // Update local state based on change type
          switch (payload.eventType) {
            case 'INSERT':
              return [...current, payload.new as ModuleData];
            case 'UPDATE':
              return current.map(item => 
                item.id === payload.new.id ? payload.new as ModuleData : item
              );
            case 'DELETE':
              return current.filter(item => item.id !== payload.old.id);
            default:
              return current;
          }
        });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [moduleId]);

  return data;
};
```

### 3. Cross-Module Communication

#### Pattern: Context-Based State Sharing
**Current Implementation**: React Context for global state and module communication.

```typescript
// Global context for cross-module state
interface GlobalContextValue {
  selectedTenant: Tenant | null;
  currentUser: User | null;
  modulePermissions: ModulePermissions;
  updateContext: (updates: Partial<GlobalContextValue>) => void;
}

export const GlobalContext = createContext<GlobalContextValue | null>(null);

// Module-specific context integration
export const useModuleWithGlobalContext = () => {
  const globalContext = useContext(GlobalContext);
  const moduleData = useModuleData(globalContext?.selectedTenant?.id);
  
  return {
    ...moduleData,
    globalContext,
    isAuthorized: globalContext?.modulePermissions.canAccess('module-name')
  };
};
```

## Planned Integration Patterns

### 1. Event-Driven Architecture

#### Pattern: Centralized Event Bus
**Target Implementation**: Replace direct module communication with event-driven patterns.

```typescript
// Event bus interface
interface EventBus {
  publish<T>(event: Event<T>): Promise<void>;
  subscribe<T>(eventType: string, handler: EventHandler<T>): Subscription;
  unsubscribe(subscription: Subscription): void;
}

// Standardized event format
interface Event<T = any> {
  id: string;
  type: string;
  source: string;
  timestamp: Date;
  data: T;
  metadata?: Record<string, any>;
  correlation_id?: string;
}

// Event handler interface
type EventHandler<T> = (event: Event<T>) => Promise<void> | void;

// Usage example
export const usePeopleEventIntegration = () => {
  const eventBus = useEventBus();
  
  // Publish person created event
  const publishPersonCreated = async (person: Person) => {
    await eventBus.publish({
      id: generateId(),
      type: 'person.created',
      source: 'people-module',
      timestamp: new Date(),
      data: person,
      correlation_id: generateCorrelationId()
    });
  };

  // Subscribe to company events
  useEffect(() => {
    const subscription = eventBus.subscribe('company.updated', async (event) => {
      // Update people associated with the company
      await refreshPeopleForCompany(event.data.company_id);
    });

    return () => eventBus.unsubscribe(subscription);
  }, [eventBus]);

  return { publishPersonCreated };
};
```

### 2. AI Agent Communication Protocol

#### Pattern: Standardized AI Integration
**Target Implementation**: Consistent AI agent communication across all modules.

```typescript
// AI agent interface
interface AIAgent {
  id: string;
  name: string;
  type: AgentType;
  capabilities: string[];
  status: AgentStatus;
}

type AgentType = 'cognitive' | 'predictive' | 'automation' | 'analysis';
type AgentStatus = 'active' | 'inactive' | 'training' | 'error';

// AI request/response protocol
interface AIRequest {
  request_id: string;
  agent_id: string;
  context: AIContext;
  parameters: Record<string, any>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

interface AIResponse {
  request_id: string;
  agent_id: string;
  result: any;
  confidence_score: number;
  reasoning?: string[];
  suggestions?: string[];
  error?: string;
}

// AI context for requests
interface AIContext {
  user_id: string;
  tenant_id: string;
  module: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  session_data?: Record<string, any>;
}

// AI integration hook
export const useAIIntegration = (agentType: AgentType) => {
  const { mutateAsync: requestAI } = useMutation({
    mutationFn: async (request: Omit<AIRequest, 'request_id'>) => {
      const response = await aiOrchestrationService.request({
        ...request,
        request_id: generateRequestId()
      });
      return response;
    }
  });

  const requestPrediction = async (context: AIContext, parameters: any) => {
    return requestAI({
      agent_id: `${agentType}-agent`,
      context,
      parameters,
      priority: 'normal'
    });
  };

  return { requestPrediction };
};
```

### 3. GraphQL API Gateway

#### Pattern: Unified Data Access Layer
**Target Implementation**: Replace direct database access with GraphQL queries.

```typescript
// GraphQL schema types
type Query = {
  people(filters: PeopleFilters): [Person]
  companies(filters: CompanyFilters): [Company]
  forms(filters: FormFilters): [Form]
  aiInsights(context: AIContext): [AIInsight]
}

type Mutation = {
  createPerson(input: CreatePersonInput): Person
  updateCompany(id: ID!, input: UpdateCompanyInput): Company
  submitForm(input: FormSubmissionInput): FormResponse
  requestAIAnalysis(input: AIAnalysisInput): AIAnalysisResult
}

type Subscription = {
  personUpdated(id: ID!): Person
  companyEventsStream(companyId: ID!): CompanyEvent
  formResponsesStream(formId: ID!): FormResponse
  aiInsightsStream(context: AIContext): AIInsight
}

// GraphQL client integration
export const usePeopleGraphQL = () => {
  const [getPeople] = useLazyQuery(GET_PEOPLE_QUERY);
  const [createPerson] = useMutation(CREATE_PERSON_MUTATION);
  
  const { data: peopleUpdates } = useSubscription(PERSON_UPDATED_SUBSCRIPTION);

  return {
    fetchPeople: getPeople,
    createPerson,
    peopleUpdates
  };
};
```

### 4. Webhook Integration Pattern

#### Pattern: External System Integration
**Target Implementation**: Standardized webhook system for external integrations.

```typescript
// Webhook registration interface
interface WebhookRegistration {
  id: string;
  tenant_id: string;
  name: string;
  url: string;
  events: string[];
  headers?: Record<string, string>;
  secret?: string;
  is_active: boolean;
  retry_config: RetryConfig;
}

interface RetryConfig {
  max_attempts: number;
  backoff_strategy: 'linear' | 'exponential';
  initial_delay: number;
  max_delay: number;
}

// Webhook delivery service
export class WebhookDeliveryService {
  async deliver(webhook: WebhookRegistration, event: Event): Promise<void> {
    const payload = {
      event_id: event.id,
      event_type: event.type,
      timestamp: event.timestamp,
      data: event.data,
      tenant_id: webhook.tenant_id
    };

    const signature = this.generateSignature(payload, webhook.secret);
    
    try {
      await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          ...webhook.headers
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      await this.scheduleRetry(webhook, event, error);
    }
  }

  private async scheduleRetry(
    webhook: WebhookRegistration,
    event: Event,
    error: Error
  ): Promise<void> {
    // Implement retry logic based on webhook.retry_config
  }
}
```

### 5. ETL Pipeline Pattern

#### Pattern: Data Transformation and Synchronization
**Target Implementation**: Standardized data processing pipelines.

```typescript
// ETL pipeline interface
interface ETLPipeline {
  id: string;
  name: string;
  source: DataSource;
  transformations: Transformation[];
  destination: DataDestination;
  schedule: CronExpression;
  is_active: boolean;
}

interface DataSource {
  type: 'database' | 'api' | 'file' | 'stream';
  config: Record<string, any>;
  auth?: AuthConfig;
}

interface Transformation {
  type: 'map' | 'filter' | 'aggregate' | 'enrich' | 'validate';
  config: Record<string, any>;
  ai_enhanced?: boolean; // AI-powered transformations
}

interface DataDestination {
  type: 'database' | 'api' | 'file' | 'stream' | 'ai_training';
  config: Record<string, any>;
}

// ETL execution service
export class ETLExecutionService {
  async executePipeline(pipeline: ETLPipeline): Promise<ETLResult> {
    const data = await this.extractData(pipeline.source);
    const transformedData = await this.transformData(data, pipeline.transformations);
    const result = await this.loadData(transformedData, pipeline.destination);
    
    return {
      pipeline_id: pipeline.id,
      execution_time: new Date(),
      records_processed: data.length,
      records_loaded: result.loaded_count,
      errors: result.errors,
      metrics: result.metrics
    };
  }

  private async transformData(data: any[], transformations: Transformation[]): Promise<any[]> {
    let result = data;
    
    for (const transformation of transformations) {
      if (transformation.ai_enhanced) {
        result = await this.applyAITransformation(result, transformation);
      } else {
        result = await this.applyStandardTransformation(result, transformation);
      }
    }
    
    return result;
  }
}
```

## Security Integration Patterns

### 1. Authentication Flow

#### Pattern: Multi-Tenant Authentication
**Current Implementation**: Supabase Auth with tenant context.

```typescript
// Authentication context with tenant awareness
export const useAuthWithTenant = () => {
  const { user } = useAuth();
  const { data: tenantAssociations } = useQuery({
    queryKey: ['user-tenants', user?.id],
    queryFn: () => fetchUserTenants(user!.id),
    enabled: !!user
  });

  const selectTenant = (tenantId: string) => {
    // Set tenant context for subsequent requests
    setGlobalTenantContext(tenantId);
  };

  return {
    user,
    tenantAssociations,
    selectTenant,
    currentTenant: getCurrentTenantContext()
  };
};
```

### 2. Authorization Pattern

#### Pattern: Role-Based Access Control with Module Permissions
**Current Implementation**: Granular permission checking.

```typescript
// Permission checking service
export class PermissionService {
  async checkModuleAccess(
    userId: string,
    tenantId: string,
    module: string,
    action: string
  ): Promise<boolean> {
    const userRole = await this.getUserRole(userId, tenantId);
    const modulePermissions = await this.getModulePermissions(tenantId, module);
    
    return this.evaluatePermission(userRole, modulePermissions, action);
  }

  async checkDataAccess(
    userId: string,
    tenantId: string,
    entityType: string,
    entityId: string,
    action: string
  ): Promise<boolean> {
    // Row-level security evaluation
    const dataPermissions = await this.getDataPermissions(
      userId, tenantId, entityType, entityId
    );
    
    return dataPermissions.includes(action);
  }
}

// React hook for permission checking
export const usePermissions = () => {
  const { user, currentTenant } = useAuthWithTenant();
  
  const canAccess = async (module: string, action: string) => {
    if (!user || !currentTenant) return false;
    
    return permissionService.checkModuleAccess(
      user.id, currentTenant.id, module, action
    );
  };

  return { canAccess };
};
```

## Performance Optimization Patterns

### 1. Caching Strategy

#### Pattern: Multi-Level Caching
**Target Implementation**: Efficient data caching across all integration points.

```typescript
// Cache configuration
interface CacheConfig {
  ttl: number; // Time to live in seconds
  maxSize: number; // Maximum cache size
  strategy: 'lru' | 'lfu' | 'fifo';
  distributed?: boolean; // Use Redis for distributed caching
}

// Cache service interface
export class CacheService {
  private localCache = new Map();
  private redisClient?: Redis;

  async get<T>(key: string): Promise<T | null> {
    // Try local cache first
    const localValue = this.localCache.get(key);
    if (localValue) return localValue;

    // Try distributed cache
    if (this.redisClient) {
      const distributedValue = await this.redisClient.get(key);
      if (distributedValue) {
        const parsed = JSON.parse(distributedValue);
        this.localCache.set(key, parsed);
        return parsed;
      }
    }

    return null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    this.localCache.set(key, value);
    
    if (this.redisClient) {
      await this.redisClient.setex(
        key,
        ttl || 300, // Default 5 minutes
        JSON.stringify(value)
      );
    }
  }
}
```

### 2. Data Loading Strategy

#### Pattern: Progressive Data Loading
**Current Enhancement**: Optimize data fetching patterns.

```typescript
// Progressive loading hook
export const useProgressiveData = <T>(
  dataFetcher: () => Promise<T[]>,
  options: {
    pageSize: number;
    preloadNext: boolean;
    virtualScroll: boolean;
  }
) => {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    const newData = await dataFetcher();
    setData(current => [...current, ...newData]);
    setHasMore(newData.length === options.pageSize);
    setPage(current => current + 1);
  }, [dataFetcher, options.pageSize]);

  useEffect(() => {
    loadMore();
  }, []);

  return { data, loadMore, hasMore, isLoading: false };
};
```

## Monitoring and Observability

### 1. Integration Monitoring

#### Pattern: Comprehensive Observability
**Target Implementation**: Monitor all integration points.

```typescript
// Telemetry service
export class TelemetryService {
  async trackEvent(event: TelemetryEvent): Promise<void> {
    const enrichedEvent = {
      ...event,
      timestamp: new Date(),
      session_id: this.getSessionId(),
      user_id: this.getCurrentUserId(),
      tenant_id: this.getCurrentTenantId()
    };

    // Send to multiple destinations
    await Promise.all([
      this.sendToAnalytics(enrichedEvent),
      this.sendToLogging(enrichedEvent),
      this.sendToMetrics(enrichedEvent)
    ]);
  }

  async trackIntegrationHealth(
    integration: string,
    status: 'healthy' | 'degraded' | 'unhealthy',
    metrics: Record<string, number>
  ): Promise<void> {
    await this.trackEvent({
      type: 'integration.health',
      data: {
        integration,
        status,
        metrics,
        timestamp: new Date()
      }
    });
  }
}

// Integration monitoring hook
export const useIntegrationMonitoring = (integrationName: string) => {
  const telemetry = useTelemetryService();

  const trackRequest = async (operation: string, duration: number, success: boolean) => {
    await telemetry.trackEvent({
      type: 'integration.request',
      data: {
        integration: integrationName,
        operation,
        duration,
        success,
        timestamp: new Date()
      }
    });
  };

  return { trackRequest };
};
```

## Conclusion

These integration patterns provide the foundation for Total Recall's evolution from a traditional enterprise platform to an AI-driven cognitive assistance system. The patterns ensure:

1. **Scalability**: Modular architecture that can grow with AI capabilities
2. **Reliability**: Robust error handling and retry mechanisms
3. **Security**: Multi-layered security with tenant isolation
4. **Performance**: Efficient data flow and caching strategies
5. **Observability**: Comprehensive monitoring and logging

As we implement the AI features outlined in the roadmap, these patterns will be extended to support:
- AI agent orchestration
- Real-time learning and adaptation
- Cross-domain knowledge synthesis
- Intelligent automation workflows

The next phase will focus on implementing the event-driven architecture and AI communication protocols to support the advanced cognitive assistance features that will make Total Recall the revolutionary platform envisioned in the project knowledge base.
