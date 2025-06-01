
import { supabase } from '@/integrations/supabase/client';
import { AIRequest, AIResponse } from '@/types/ai';

export class AICacheService {
  private cacheHits = 0;
  private totalRequests = 0;

  async checkCache(request: AIRequest): Promise<AIResponse | null> {
    try {
      const contextHash = this.generateContextHash(request.context, request.parameters);
      
      const { data, error } = await supabase
        .from('ai_context_cache')
        .select('cached_response, hit_count')
        .eq('context_hash', contextHash)
        .eq('agent_id', request.agent_id)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error || !data) return null;

      // Update hit count
      await supabase
        .from('ai_context_cache')
        .update({ 
          hit_count: data.hit_count + 1,
          last_accessed_at: new Date().toISOString()
        })
        .eq('context_hash', contextHash);

      this.cacheHits++;
      return data.cached_response as unknown as AIResponse;
    } catch (error) {
      console.error('Error checking cache:', error);
      return null;
    }
  }

  async cacheResponse(request: AIRequest, response: AIResponse): Promise<void> {
    try {
      const contextHash = this.generateContextHash(request.context, request.parameters);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // Cache for 1 hour

      await supabase
        .from('ai_context_cache')
        .upsert({
          cache_key: `${request.agent_id}_${contextHash}`,
          agent_id: request.agent_id,
          tenant_id: request.context.tenant_id,
          context_hash: contextHash,
          cached_response: response as any,
          expires_at: expiresAt.toISOString(),
          hit_count: 0
        });
    } catch (error) {
      console.error('Error caching response:', error);
    }
  }

  private generateContextHash(context: any, parameters: any): string {
    const content = JSON.stringify({ context, parameters });
    return btoa(content).slice(0, 32); // Simple hash for demo
  }

  getCacheMetrics() {
    return {
      cacheHits: this.cacheHits,
      totalRequests: this.totalRequests,
      cacheHitRate: this.totalRequests > 0 ? (this.cacheHits / this.totalRequests) * 100 : 0
    };
  }

  incrementTotalRequests() {
    this.totalRequests++;
  }
}

export const aiCacheService = new AICacheService();
