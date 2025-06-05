
// Core AI system types with explicit interfaces to prevent infinite recursion
export interface AISystemConfig {
  maxConcurrentRequests: number;
  defaultTimeout: number;
  cacheEnabled: boolean;
  metricsEnabled: boolean;
}

export interface AIServiceMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  cacheHitRate: number;
  activeAgents: number;
  queueSize: number;
}

export interface AIInitializationResult {
  success: boolean;
  message: string;
  agentsLoaded: number;
  servicesInitialized: string[];
  errors?: string[];
}

export interface AIAgentConfig {
  id: string;
  name: string;
  type: string;
  capabilities: string[];
  isActive: boolean;
  modelConfig: Record<string, unknown>;
  performanceMetrics: Record<string, unknown>;
}

export interface AIRequestContext {
  userId: string;
  tenantId?: string;
  module: string;
  action: string;
  timestamp: number;
}

export interface AIRequestPayload {
  context: AIRequestContext;
  parameters: Record<string, unknown>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export interface AIResponseData {
  requestId: string;
  agentId: string;
  result: unknown;
  confidence: number;
  responseTime: number;
  success: boolean;
  error?: string;
}

export interface AIDecisionRecord {
  id: string;
  agentId: string;
  userId: string;
  tenantId?: string;
  decision: Record<string, unknown>;
  confidence: number;
  feedback?: 'positive' | 'negative';
  timestamp: number;
}
