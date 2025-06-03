
interface ModelPricing {
  inputTokenPrice: number;  // Price per 1k input tokens
  outputTokenPrice: number; // Price per 1k output tokens
}

interface CostCalculation {
  inputCost: number;
  outputCost: number;
  totalCost: number;
  inputTokens: number;
  outputTokens: number;
}

export class AICostTrackingService {
  private modelPricing: Map<string, ModelPricing> = new Map([
    ['gpt-4o-mini', { inputTokenPrice: 0.00015, outputTokenPrice: 0.0006 }],
    ['gpt-4o', { inputTokenPrice: 0.005, outputTokenPrice: 0.015 }],
    ['gpt-4.5-preview', { inputTokenPrice: 0.01, outputTokenPrice: 0.03 }],
    ['claude-opus-4-20250514', { inputTokenPrice: 0.015, outputTokenPrice: 0.075 }],
    ['claude-sonnet-4-20250514', { inputTokenPrice: 0.003, outputTokenPrice: 0.015 }],
    ['claude-3-5-haiku-20241022', { inputTokenPrice: 0.00025, outputTokenPrice: 0.00125 }]
  ]);

  calculateCost(modelId: string, inputTokens: number, outputTokens: number): CostCalculation {
    const pricing = this.modelPricing.get(modelId);
    
    if (!pricing) {
      console.warn(`No pricing data for model ${modelId}, using default rates`);
      // Default to gpt-4o-mini pricing
      const defaultPricing = this.modelPricing.get('gpt-4o-mini')!;
      return this.computeCost(defaultPricing, inputTokens, outputTokens);
    }

    return this.computeCost(pricing, inputTokens, outputTokens);
  }

  private computeCost(pricing: ModelPricing, inputTokens: number, outputTokens: number): CostCalculation {
    const inputCost = (inputTokens / 1000) * pricing.inputTokenPrice;
    const outputCost = (outputTokens / 1000) * pricing.outputTokenPrice;
    const totalCost = inputCost + outputCost;

    return {
      inputCost: Math.round(inputCost * 100000) / 100000, // Round to 5 decimal places
      outputCost: Math.round(outputCost * 100000) / 100000,
      totalCost: Math.round(totalCost * 100000) / 100000,
      inputTokens,
      outputTokens
    };
  }

  async trackRequestCost(
    requestId: string,
    tenantId: string,
    modelId: string,
    inputTokens: number,
    outputTokens: number,
    agentId: string
  ): Promise<void> {
    const cost = this.calculateCost(modelId, inputTokens, outputTokens);
    
    try {
      // In a real implementation, this would update the ai_request_logs table
      console.log(`Cost tracked for request ${requestId}:`, {
        tenantId,
        modelId,
        agentId,
        inputTokens,
        outputTokens,
        totalCost: cost.totalCost
      });
    } catch (error) {
      console.error('Error tracking request cost:', error);
    }
  }

  getAllModelPricing(): Record<string, ModelPricing> {
    return Object.fromEntries(this.modelPricing);
  }

  updateModelPricing(modelId: string, pricing: ModelPricing): void {
    this.modelPricing.set(modelId, pricing);
  }

  estimateRequestCost(modelId: string, promptText: string, expectedResponseLength = 200): CostCalculation {
    // Rough estimation: 1 token ≈ 4 characters for English text
    const inputTokens = Math.ceil(promptText.length / 4);
    const outputTokens = Math.ceil(expectedResponseLength / 4);
    
    return this.calculateCost(modelId, inputTokens, outputTokens);
  }
}

export const aiCostTrackingService = new AICostTrackingService();
