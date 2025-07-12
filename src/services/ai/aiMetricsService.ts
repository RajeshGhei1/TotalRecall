
import { supabase } from '@/integrations/supabase/client';
import { AIRequest } from '@/types/ai';

export class AIMetricsService {
  async logRequest(
    request: AIRequest, 
    status: string, 
    startTime: number, 
    endTime?: number,
    responseTime?: number,
    error?: Error
  ): Promise<void> {
    try {
      await supabase
        .from('ai_request_logs')
        .insert({
          request_id: request.request_id,
          agent_id: request.agent_id,
          tenant_id: request.context.tenant_id,
          user_id: request.context.user_id,
          request_type: request.context.action,
          status,
          response_time_ms: responseTime || 0,
          error_message: error?.message,
          context: request.context as unknown
        });
    } catch (logError) {
      console.error('Error logging request:', logError);
    }
  }

  async updatePerformanceMetrics(
    agentId: string, 
    tenantId: string | undefined, 
    responseTime: number, 
    success: boolean
  ): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get current metrics or create new ones
      const { data: existing } = await supabase
        .from('ai_performance_metrics')
        .select('*')
        .eq('agent_id', agentId)
        .eq('tenant_id', tenantId || null)
        .eq('metric_date', today)
        .maybeSingle();

      if (existing) {
        // Update existing metrics
        const totalRequests = existing.total_requests + 1;
        const successfulRequests = existing.successful_requests + (success ? 1 : 0);
        const failedRequests = existing.failed_requests + (success ? 0 : 1);
        const avgResponseTime = success 
          ? ((existing.average_response_time_ms * existing.total_requests) + responseTime) / totalRequests
          : existing.average_response_time_ms;

        await supabase
          .from('ai_performance_metrics')
          .update({
            total_requests: totalRequests,
            successful_requests: successfulRequests,
            failed_requests: failedRequests,
            average_response_time_ms: Math.round(avgResponseTime)
          })
          .eq('id', existing.id);
      } else {
        // Create new metrics
        await supabase
          .from('ai_performance_metrics')
          .insert({
            agent_id: agentId,
            tenant_id: tenantId || null,
            metric_date: today,
            total_requests: 1,
            successful_requests: success ? 1 : 0,
            failed_requests: success ? 0 : 1,
            average_response_time_ms: success ? responseTime : 0
          });
      }
    } catch (error) {
      console.error('Error updating performance metrics:', error);
    }
  }
}

export const aiMetricsService = new AIMetricsService();
