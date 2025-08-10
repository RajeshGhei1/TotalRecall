/**
 * FEATURE EVENT BUS SERVICE
 * Implements Principle 5: Minimal Cross-Talk - Event-driven feature communication
 */

import { supabase } from '@/integrations/supabase/client';
import { 
  FeatureEventBus, 
  FeatureEventHandler, 
  FeatureEvent, 
  FeatureContext,
  FeatureAuditLog
} from '@/types/standardsCompliantFeatures';

// Event subscription management
interface EventSubscription {
  id: string;
  eventName: string;
  handler: FeatureEventHandler;
  featureId?: string;
  context?: Partial<FeatureContext>;
}

export class StandardsCompliantEventBus implements FeatureEventBus {
  private subscriptions = new Map<string, EventSubscription>();
  private eventHistory: Array<{ eventName: string; payload: unknown; timestamp: Date; context?: FeatureContext }> = [];
  private maxHistorySize = 1000;

  /**
   * Emit an event to all subscribers
   * Implements auditing and error handling
   */
  async emit(eventName: string, payload: unknown, context?: FeatureContext): Promise<void> {
    try {
      console.log(`📡 Emitting event: ${eventName}`, { payload, context });

      // Add to event history
      this.eventHistory.push({
        eventName,
        payload,
        timestamp: new Date(),
        context
      });

      // Trim history if too large
      if (this.eventHistory.length > this.maxHistorySize) {
        this.eventHistory.shift();
      }

      // Get matching subscriptions
      const matchingSubscriptions = Array.from(this.subscriptions.values())
        .filter(sub => this.matchesEventPattern(sub.eventName, eventName));

      if (matchingSubscriptions.length === 0) {
        console.log(`📡 No subscribers for event: ${eventName}`);
        return;
      }

      // Execute handlers in parallel with error isolation
      const handlerPromises = matchingSubscriptions.map(async (subscription) => {
        try {
          const startTime = Date.now();
          await subscription.handler(eventName, payload, context);
          const executionTime = Date.now() - startTime;
          
          console.log(`✅ Event handler executed: ${subscription.id} (${executionTime}ms)`);
          
          // Log successful execution
          await this.logEventExecution(eventName, subscription.id, payload, context, executionTime, true);
          
        } catch (error) {
          console.error(`❌ Event handler failed: ${subscription.id}`, error);
          
          // Log failed execution but don't throw (isolate errors)
          await this.logEventExecution(
            eventName, 
            subscription.id, 
            payload, 
            context, 
            0, 
            false, 
            error instanceof Error ? error.message : 'Unknown error'
          );
        }
      });

      // Wait for all handlers to complete
      await Promise.all(handlerPromises);
      
      console.log(`📡 Event emission completed: ${eventName} (${matchingSubscriptions.length} handlers)`);
      
    } catch (error) {
      console.error(`❌ Failed to emit event: ${eventName}`, error);
      throw error;
    }
  }

  /**
   * Subscribe to events with pattern matching support
   * Returns subscription ID for unsubscribing
   */
  subscribe(eventName: string, handler: FeatureEventHandler): string {
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const subscription: EventSubscription = {
      id: subscriptionId,
      eventName,
      handler,
    };

    this.subscriptions.set(subscriptionId, subscription);
    
    console.log(`📡 Subscribed to event: ${eventName} (ID: ${subscriptionId})`);
    
    return subscriptionId;
  }

  /**
   * Unsubscribe from events
   */
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      this.subscriptions.delete(subscriptionId);
      console.log(`📡 Unsubscribed from event: ${subscription.eventName} (ID: ${subscriptionId})`);
    } else {
      console.warn(`📡 Subscription not found: ${subscriptionId}`);
    }
  }

  /**
   * Subscribe to events for a specific feature
   * Useful for feature-specific event handling
   */
  subscribeForFeature(
    featureId: string, 
    eventName: string, 
    handler: FeatureEventHandler,
    context?: Partial<FeatureContext>
  ): string {
    const subscriptionId = `sub_${featureId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const subscription: EventSubscription = {
      id: subscriptionId,
      eventName,
      handler,
      featureId,
      context
    };

    this.subscriptions.set(subscriptionId, subscription);
    
    console.log(`📡 Feature ${featureId} subscribed to event: ${eventName} (ID: ${subscriptionId})`);
    
    return subscriptionId;
  }

  /**
   * Unsubscribe all event handlers for a feature
   */
  unsubscribeFeature(featureId: string): void {
    const featureSubscriptions = Array.from(this.subscriptions.entries())
      .filter(([_, sub]) => sub.featureId === featureId);

    featureSubscriptions.forEach(([id, sub]) => {
      this.subscriptions.delete(id);
      console.log(`📡 Feature ${featureId} unsubscribed from event: ${sub.eventName} (ID: ${id})`);
    });

    console.log(`📡 All subscriptions removed for feature: ${featureId} (${featureSubscriptions.length} subscriptions)`);
  }

  /**
   * List all available events from database
   */
  async listEvents(featureId?: string): Promise<FeatureEvent[]> {
    try {
      let query = supabase
        .from('feature_events')
        .select('*')
        .eq('is_active', true);

      if (featureId) {
        query = query.eq('feature_id', featureId);
      }

      const { data, error } = await query.order('event_name');

      if (error) {
        throw error;
      }

      return data || [];
      
    } catch (error) {
      console.error('❌ Failed to list events:', error);
      return [];
    }
  }

  /**
   * Register a new event type in the system
   */
  async registerEvent(event: Omit<FeatureEvent, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('feature_events')
        .upsert({
          ...event,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'feature_id,event_name'
        });

      if (error) {
        throw error;
      }

      console.log(`📡 Event registered: ${event.feature_id}.${event.event_name}`);
      
    } catch (error) {
      console.error(`❌ Failed to register event: ${event.feature_id}.${event.event_name}`, error);
      throw error;
    }
  }

  /**
   * Get event history for debugging and monitoring
   */
  getEventHistory(eventName?: string, limit = 100): Array<{ eventName: string; payload: unknown; timestamp: Date; context?: FeatureContext }> {
    let history = this.eventHistory;
    
    if (eventName) {
      history = history.filter(event => this.matchesEventPattern(eventName, event.eventName));
    }
    
    return history.slice(-limit);
  }

  /**
   * Get subscription statistics
   */
  getSubscriptionStats(): {
    totalSubscriptions: number;
    subscriptionsByEvent: Record<string, number>;
    subscriptionsByFeature: Record<string, number>;
  } {
    const subscriptionsByEvent: Record<string, number> = {};
    const subscriptionsByFeature: Record<string, number> = {};

    Array.from(this.subscriptions.values()).forEach(sub => {
      // Count by event name
      subscriptionsByEvent[sub.eventName] = (subscriptionsByEvent[sub.eventName] || 0) + 1;
      
      // Count by feature ID
      if (sub.featureId) {
        subscriptionsByFeature[sub.featureId] = (subscriptionsByFeature[sub.featureId] || 0) + 1;
      }
    });

    return {
      totalSubscriptions: this.subscriptions.size,
      subscriptionsByEvent,
      subscriptionsByFeature
    };
  }

  /**
   * Clear all subscriptions (useful for testing)
   */
  clearAllSubscriptions(): void {
    const count = this.subscriptions.size;
    this.subscriptions.clear();
    console.log(`📡 Cleared all subscriptions (${count} subscriptions removed)`);
  }

  /**
   * Clear event history
   */
  clearEventHistory(): void {
    const count = this.eventHistory.length;
    this.eventHistory = [];
    console.log(`📡 Cleared event history (${count} events removed)`);
  }

  /**
   * Check if event pattern matches event name
   * Supports wildcard patterns like "feature:*" or "*:created"
   */
  private matchesEventPattern(pattern: string, eventName: string): boolean {
    if (pattern === eventName) {
      return true;
    }

    // Convert pattern to regex
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(eventName);
  }

  /**
   * Log event execution for auditing
   */
  private async logEventExecution(
    eventName: string,
    handlerId: string,
    payload: unknown,
    context?: FeatureContext,
    executionTime?: number,
    success = true,
    errorMessage?: string
  ): Promise<void> {
    try {
      // Don't await this to avoid blocking event processing
      const auditLog: Omit<FeatureAuditLog, 'id'> = {
        feature_id: `event_handler_${handlerId}`,
        event_type: success ? 'executed' : 'error',
        user_id: context?.userId,
        tenant_id: context?.tenantId,
        module_name: context?.moduleName || 'event_bus',
        input_data: { eventName, payload },
        execution_time_ms: executionTime,
        error_details: errorMessage ? { code: 'HANDLER_ERROR', message: errorMessage } : undefined,
        timestamp: new Date().toISOString(),
        request_id: context?.requestId,
        session_id: context?.sessionId
      };

      // In a production system, you'd save this to a dedicated audit table
      console.log('📊 Event execution logged:', auditLog);
      
    } catch (error) {
      console.error('❌ Failed to log event execution:', error);
      // Don't throw - logging failures shouldn't break event processing
    }
  }
}

// Export singleton instance
export const featureEventBus = new StandardsCompliantEventBus();

// Export helper functions for common event patterns
export const FeatureEvents = {
  // Custom Fields events
  FIELD_CREATED: 'custom_fields:field:created',
  FIELD_UPDATED: 'custom_fields:field:updated',
  FIELD_DELETED: 'custom_fields:field:deleted',
  
  // Form Builder events
  FORM_CREATED: 'form_builder:form:created',
  FORM_UPDATED: 'form_builder:form:updated',
  FORM_SUBMITTED: 'form_builder:form:submitted',
  FORM_PUBLISHED: 'form_builder:form:published',
  
  // Dashboard Builder events
  DASHBOARD_CREATED: 'dashboard_builder:dashboard:created',
  DASHBOARD_UPDATED: 'dashboard_builder:dashboard:updated',
  WIDGET_ADDED: 'dashboard_builder:widget:added',
  WIDGET_REMOVED: 'dashboard_builder:widget:removed',
  
  // Bulk Operations events
  BULK_UPLOAD_STARTED: 'bulk_operations:upload:started',
  BULK_UPLOAD_COMPLETED: 'bulk_operations:upload:completed',
  BULK_DOWNLOAD_STARTED: 'bulk_operations:download:started',
  BULK_DOWNLOAD_COMPLETED: 'bulk_operations:download:completed',
  
  // LinkedIn Enrichment events
  LINKEDIN_PROFILE_ENRICHED: 'linkedin_enrichment:profile:enriched',
  LINKEDIN_CONTACT_FOUND: 'linkedin_enrichment:contact:found',
  
  // AI Email Response events
  AI_EMAIL_GENERATED: 'ai_email:response:generated',
  AI_EMAIL_SENT: 'ai_email:email:sent',
  
  // Report Builder events
  REPORT_CREATED: 'report_builder:report:created',
  REPORT_GENERATED: 'report_builder:report:generated',
  REPORT_EXPORTED: 'report_builder:report:exported',
  
  // Generic feature events
  FEATURE_LOADED: 'feature:loaded',
  FEATURE_EXECUTED: 'feature:executed',
  FEATURE_ERROR: 'feature:error'
};

// Export event type helpers for type safety
export type FeatureEventType = typeof FeatureEvents[keyof typeof FeatureEvents]; 