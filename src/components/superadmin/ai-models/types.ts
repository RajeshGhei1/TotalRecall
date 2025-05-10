
export type AIModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
  isDefault: boolean;
};

export type TenantAIModelAssignment = {
  tenantId: string;
  modelId: string;
};
