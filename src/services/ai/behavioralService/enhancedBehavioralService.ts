
import { supabase } from '@/integrations/supabase/client';
import { UserInteraction, BehavioralPattern } from '@/types/ai';
import { tenantAIModelService } from '../tenantAIModelService';

export interface RealTimeInteractionEvent {
  userId: string;
  tenantId?: string;
  eventType: string;
  context: Record<string, any>;
  timestamp: number;
  sessionId: string;
}

export interface UserPreference {
  userId: string;
  category: string;
  preference: string;
  value: any;
  confidence: number;
  lastUpdated: number;
}

export interface SmartContext {
  currentModule: string;
  currentAction: string;
  workflowStage: string;
  userRole: string;
  timeContext: string;
  deviceContext: string;
  sessionContext: Record<string, any>;
}

export class EnhancedBehavioralService {
  private realTimeListeners: Map<string, Function[]> = new Map();
  private userPreferences: Map<string, UserPreference[]> = new Map();
  private contextDetectionRules: Map<string, Function> = new Map();
  private interactionQueue: RealTimeInteractionEvent[] = [];
  private patternRecognitionCache = new Map<string, any>();

  constructor() {
    this.initializeContextDetectionRules();
    this.startRealTimeProcessing();
  }

  // Real-time interaction tracking with immediate pattern recognition
  async trackRealTimeInteraction(event: RealTimeInteractionEvent): Promise<void> {
    // Add to queue for batch processing
    this.interactionQueue.push(event);

    // Immediate pattern recognition for high-priority events
    if (this.isHighPriorityEvent(event.eventType)) {
      await this.processImmediatePatternRecognition(event);
    }

    // Notify real-time listeners
    this.notifyRealTimeListeners(event);

    // Update user preferences in real-time
    await this.updateUserPreferences(event);
  }

  // Smart context detection
  detectSmartContext(userId: string, currentPath: string, userAgent: string): SmartContext {
    const contextRule = this.contextDetectionRules.get('default');
    
    return {
      currentModule: this.extractModuleFromPath(currentPath),
      currentAction: this.extractActionFromPath(currentPath),
      workflowStage: this.detectWorkflowStage(userId, currentPath),
      userRole: this.getUserRole(userId),
      timeContext: this.getTimeContext(),
      deviceContext: this.getDeviceContext(userAgent),
      sessionContext: this.getSessionContext(userId)
    };
  }

  // Predictive user intent detection
  async predictUserIntent(userId: string, context: SmartContext): Promise<string[]> {
    const userPatterns = await this.getUserPatterns(userId);
    const currentContext = context;
    
    // Use cached pattern recognition
    const cacheKey = `${userId}_${context.currentModule}_${context.currentAction}`;
    if (this.patternRecognitionCache.has(cacheKey)) {
      return this.patternRecognitionCache.get(cacheKey);
    }

    const intents = this.analyzeIntentFromPatterns(userPatterns, currentContext);
    
    // Cache for 5 minutes
    this.patternRecognitionCache.set(cacheKey, intents);
    setTimeout(() => this.patternRecognitionCache.delete(cacheKey), 300000);
    
    return intents;
  }

  // Real-time listeners for UI updates
  subscribeToRealTimeUpdates(eventType: string, callback: Function): void {
    if (!this.realTimeListeners.has(eventType)) {
      this.realTimeListeners.set(eventType, []);
    }
    this.realTimeListeners.get(eventType)!.push(callback);
  }

  unsubscribeFromRealTimeUpdates(eventType: string, callback: Function): void {
    const listeners = this.realTimeListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Get personalized recommendations
  async getPersonalizedRecommendations(userId: string, context: SmartContext): Promise<any[]> {
    const preferences = this.userPreferences.get(userId) || [];
    const patterns = await this.getUserPatterns(userId);
    
    return this.generateRecommendationsFromPreferences(preferences, patterns, context);
  }

  // User preference management
  async updateUserPreferences(event: RealTimeInteractionEvent): Promise<void> {
    const preferences = this.extractPreferencesFromEvent(event);
    
    if (preferences.length > 0) {
      const userPrefs = this.userPreferences.get(event.userId) || [];
      
      preferences.forEach(pref => {
        const existingIndex = userPrefs.findIndex(
          p => p.category === pref.category && p.preference === pref.preference
        );
        
        if (existingIndex > -1) {
          userPrefs[existingIndex] = { ...userPrefs[existingIndex], ...pref };
        } else {
          userPrefs.push(pref);
        }
      });
      
      this.userPreferences.set(event.userId, userPrefs);
    }
  }

  private initializeContextDetectionRules(): void {
    this.contextDetectionRules.set('default', (path: string, userAgent: string) => {
      // Default context detection logic
      return {
        module: this.extractModuleFromPath(path),
        action: this.extractActionFromPath(path),
        device: this.getDeviceContext(userAgent)
      };
    });
  }

  private startRealTimeProcessing(): void {
    // Process interaction queue every 1 second
    setInterval(() => {
      this.processInteractionQueue();
    }, 1000);
  }

  private async processInteractionQueue(): Promise<void> {
    if (this.interactionQueue.length === 0) return;

    const batch = this.interactionQueue.splice(0, 50); // Process in batches of 50
    
    try {
      // Convert to database format
      const interactions = batch.map(event => ({
        user_id: event.userId,
        tenant_id: event.tenantId,
        interaction_type: event.eventType,
        context: event.context,
        metadata: {
          timestamp: event.timestamp,
          processed_at: Date.now()
        },
        session_id: event.sessionId,
        user_agent: navigator.userAgent,
        created_at: new Date().toISOString()
      }));

      // Batch insert to database
      const { error } = await supabase
        .from('user_interactions')
        .insert(interactions);

      if (error) {
        console.error('Error saving interactions:', error);
        // Re-add to queue for retry
        this.interactionQueue.unshift(...batch);
      }
    } catch (error) {
      console.error('Error processing interaction queue:', error);
    }
  }

  private isHighPriorityEvent(eventType: string): boolean {
    const highPriorityEvents = [
      'form_submission', 'error', 'workflow_completion', 
      'navigation_pattern_change', 'performance_issue'
    ];
    return highPriorityEvents.includes(eventType);
  }

  private async processImmediatePatternRecognition(event: RealTimeInteractionEvent): Promise<void> {
    // Immediate pattern recognition for real-time personalization
    const patterns = await this.detectImmediatePatterns(event);
    
    if (patterns.length > 0) {
      // Update user preferences immediately
      await this.updateUserPreferences(event);
      
      // Trigger real-time UI updates
      this.notifyRealTimeListeners(event);
    }
  }

  private notifyRealTimeListeners(event: RealTimeInteractionEvent): void {
    const listeners = this.realTimeListeners.get(event.eventType) || [];
    const allListeners = this.realTimeListeners.get('*') || [];
    
    [...listeners, ...allListeners].forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in real-time listener:', error);
      }
    });
  }

  private extractModuleFromPath(path: string): string {
    const segments = path.split('/').filter(s => s);
    return segments[0] || 'home';
  }

  private extractActionFromPath(path: string): string {
    const segments = path.split('/').filter(s => s);
    return segments[1] || 'view';
  }

  private detectWorkflowStage(userId: string, path: string): string {
    // Simple workflow stage detection based on path
    if (path.includes('create')) return 'creation';
    if (path.includes('edit')) return 'editing';
    if (path.includes('view')) return 'viewing';
    if (path.includes('list')) return 'browsing';
    return 'navigation';
  }

  private getUserRole(userId: string): string {
    // This would typically come from user context or auth
    return 'user'; // Placeholder
  }

  private getTimeContext(): string {
    const hour = new Date().getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  private getDeviceContext(userAgent: string): string {
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) return 'mobile';
    if (/Tablet/.test(userAgent)) return 'tablet';
    return 'desktop';
  }

  private getSessionContext(userId: string): Record<string, any> {
    // Get session-specific context
    return {
      sessionStart: Date.now(),
      pageViews: 0,
      actions: 0
    };
  }

  private async getUserPatterns(userId: string): Promise<BehavioralPattern[]> {
    try {
      const { data, error } = await supabase
        .from('behavioral_patterns')
        .select('*')
        .eq('user_id', userId)
        .order('frequency_score', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(pattern => ({
        ...pattern,
        pattern_data: pattern.pattern_data as Record<string, any>
      })) as BehavioralPattern[];
    } catch (error) {
      console.error('Error fetching user patterns:', error);
      return [];
    }
  }

  private analyzeIntentFromPatterns(patterns: BehavioralPattern[], context: SmartContext): string[] {
    const intents: string[] = [];
    
    patterns.forEach(pattern => {
      if (pattern.pattern_type === 'navigation' && context.currentModule) {
        intents.push(`navigate_to_${pattern.pattern_data.target_module}`);
      }
      
      if (pattern.pattern_type === 'action' && context.currentAction) {
        intents.push(`perform_${pattern.pattern_data.action_type}`);
      }
    });
    
    return intents.slice(0, 5); // Return top 5 intents
  }

  private generateRecommendationsFromPreferences(
    preferences: UserPreference[], 
    patterns: BehavioralPattern[], 
    context: SmartContext
  ): any[] {
    const recommendations: any[] = [];
    
    // Generate recommendations based on preferences and patterns
    preferences.forEach(pref => {
      if (pref.confidence > 0.7) {
        recommendations.push({
          type: 'preference',
          category: pref.category,
          recommendation: `Consider ${pref.preference}`,
          confidence: pref.confidence
        });
      }
    });
    
    return recommendations.slice(0, 10);
  }

  private extractPreferencesFromEvent(event: RealTimeInteractionEvent): UserPreference[] {
    const preferences: UserPreference[] = [];
    
    // Extract preferences based on event type and context
    if (event.eventType === 'navigation') {
      preferences.push({
        userId: event.userId,
        category: 'navigation',
        preference: 'preferred_module',
        value: event.context.module,
        confidence: 0.6,
        lastUpdated: event.timestamp
      });
    }
    
    if (event.eventType === 'form_interaction') {
      preferences.push({
        userId: event.userId,
        category: 'form',
        preference: 'preferred_input_method',
        value: event.context.inputMethod,
        confidence: 0.5,
        lastUpdated: event.timestamp
      });
    }
    
    return preferences;
  }

  private async detectImmediatePatterns(event: RealTimeInteractionEvent): Promise<any[]> {
    // Simple immediate pattern detection
    const patterns: any[] = [];
    
    if (event.eventType === 'repeated_action') {
      patterns.push({
        type: 'repetition',
        action: event.context.action,
        frequency: event.context.frequency || 1
      });
    }
    
    return patterns;
  }
}

export const enhancedBehavioralService = new EnhancedBehavioralService();
