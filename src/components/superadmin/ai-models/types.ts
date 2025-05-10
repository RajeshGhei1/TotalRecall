
export type AIModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
  isDefault: boolean;
  requiresApiKey: boolean;
};

export type TenantAIModelAssignment = {
  tenantId: string;
  modelId: string;
  apiKey?: string;
};

export type AIModelCredential = {
  tenantId: string;
  modelId: string;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
};
