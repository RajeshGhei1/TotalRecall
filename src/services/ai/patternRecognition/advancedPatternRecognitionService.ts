
import { supabase } from '@/integrations/supabase/client';
import { UserInteraction, BehavioralPattern } from '@/types/ai';

export interface PatternRecognitionResult {
  patternId: string;
  patternType: string;
  confidence: number;
  description: string;
  recommendations: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata: Record<string, any>;
}

export interface WorkflowInefficiency {
  id: string;
  type: 'bottleneck' | 'redundancy' | 'delay' | 'error_prone';
  description: string;
  impact: number;
  frequency: number;
  suggestedOptimizations: string[];
  affectedModules: string[];
}

export interface PredictiveInsight {
  id: string;
  insight: string;
  confidence: number;
  timeframe: string;
  category: 'performance' | 'behavior' | 'usage' | 'risk';
  actionable: boolean;
  recommendedActions: string[];
}

export class AdvancedPatternRecognitionService {
  private patternCache = new Map<string, PatternRecognitionResult[]>();
  private recognitionAlgorithms: Map<string, Function> = new Map();

  constructor() {
    this.initializeAlgorithms();
  }

  // Main pattern recognition engine
  async recognizePatterns(
    userId: string,
    tenantId?: string,
    timeRange: number = 30 // days
  ): Promise<PatternRecognitionResult[]> {
    const cacheKey = `${userId}_${tenantId}_${timeRange}`;
    
    if (this.patternCache.has(cacheKey)) {
      return this.patternCache.get(cacheKey)!;
    }

    try {
      const interactions = await this.getRecentInteractions(userId, tenantId, timeRange);
      const existingPatterns = await this.getExistingPatterns(userId, tenantId);
      
      const recognizedPatterns: PatternRecognitionResult[] = [];

      // Run all recognition algorithms
      for (const [algorithmName, algorithm] of this.recognitionAlgorithms) {
        try {
          const patterns = await algorithm(interactions, existingPatterns);
          recognizedPatterns.push(...patterns);
        } catch (error) {
          console.error(`Error in ${algorithmName} algorithm:`, error);
        }
      }

      // Cache results for 5 minutes
      this.patternCache.set(cacheKey, recognizedPatterns);
      setTimeout(() => this.patternCache.delete(cacheKey), 300000);

      return recognizedPatterns;
    } catch (error) {
      console.error('Error recognizing patterns:', error);
      return [];
    }
  }

  // Detect workflow inefficiencies
  async detectWorkflowInefficiencies(
    userId: string,
    tenantId?: string
  ): Promise<WorkflowInefficiency[]> {
    try {
      const interactions = await this.getRecentInteractions(userId, tenantId, 30);
      const inefficiencies: WorkflowInefficiency[] = [];

      // Detect bottlenecks
      const bottlenecks = await this.detectBottlenecks(interactions);
      inefficiencies.push(...bottlenecks);

      // Detect redundancies
      const redundancies = await this.detectRedundancies(interactions);
      inefficiencies.push(...redundancies);

      // Detect delays
      const delays = await this.detectDelays(interactions);
      inefficiencies.push(...delays);

      // Detect error-prone areas
      const errorProneAreas = await this.detectErrorProneAreas(interactions);
      inefficiencies.push(...errorProneAreas);

      return inefficiencies;
    } catch (error) {
      console.error('Error detecting workflow inefficiencies:', error);
      return [];
    }
  }

  // Generate predictive insights
  async generatePredictiveInsights(
    userId: string,
    tenantId?: string
  ): Promise<PredictiveInsight[]> {
    try {
      const patterns = await this.recognizePatterns(userId, tenantId);
      const interactions = await this.getRecentInteractions(userId, tenantId, 90);
      
      const insights: PredictiveInsight[] = [];

      // Performance predictions
      insights.push(...await this.predictPerformanceTrends(interactions, patterns));

      // Behavior predictions
      insights.push(...await this.predictBehaviorChanges(interactions, patterns));

      // Usage predictions
      insights.push(...await this.predictUsagePatterns(interactions, patterns));

      // Risk predictions
      insights.push(...await this.predictRisks(interactions, patterns));

      return insights.filter(insight => insight.confidence > 0.6);
    } catch (error) {
      console.error('Error generating predictive insights:', error);
      return [];
    }
  }

  private initializeAlgorithms(): void {
    // Navigation pattern recognition
    this.recognitionAlgorithms.set('navigation_patterns', this.recognizeNavigationPatterns.bind(this));
    
    // Time-based pattern recognition
    this.recognitionAlgorithms.set('temporal_patterns', this.recognizeTemporalPatterns.bind(this));
    
    // Error pattern recognition
    this.recognitionAlgorithms.set('error_patterns', this.recognizeErrorPatterns.bind(this));
    
    // Efficiency pattern recognition
    this.recognitionAlgorithms.set('efficiency_patterns', this.recognizeEfficiencyPatterns.bind(this));
    
    // Learning pattern recognition
    this.recognitionAlgorithms.set('learning_patterns', this.recognizeLearningPatterns.bind(this));
  }

  private async recognizeNavigationPatterns(
    interactions: UserInteraction[],
    existingPatterns: BehavioralPattern[]
  ): Promise<PatternRecognitionResult[]> {
    const patterns: PatternRecognitionResult[] = [];
    
    // Analyze navigation sequences
    const navigationSequences = this.extractNavigationSequences(interactions);
    
    for (const sequence of navigationSequences) {
      if (sequence.frequency > 3 && sequence.efficiency < 0.7) {
        patterns.push({
          patternId: `nav_${sequence.id}`,
          patternType: 'navigation_inefficiency',
          confidence: 0.8,
          description: `Inefficient navigation pattern detected: ${sequence.path}`,
          recommendations: [
            'Add quick navigation shortcuts',
            'Implement breadcrumb navigation',
            'Consider workflow optimization'
          ],
          severity: 'medium',
          metadata: {
            sequence: sequence.path,
            frequency: sequence.frequency,
            efficiency: sequence.efficiency
          }
        });
      }
    }

    return patterns;
  }

  private async recognizeTemporalPatterns(
    interactions: UserInteraction[],
    existingPatterns: BehavioralPattern[]
  ): Promise<PatternRecognitionResult[]> {
    const patterns: PatternRecognitionResult[] = [];
    
    // Analyze time-based usage patterns
    const timeDistribution = this.analyzeTimeDistribution(interactions);
    
    if (timeDistribution.peakHours.length > 0) {
      patterns.push({
        patternId: 'temporal_peak_usage',
        patternType: 'temporal_behavior',
        confidence: 0.9,
        description: `Peak usage detected during ${timeDistribution.peakHours.join(', ')}`,
        recommendations: [
          'Optimize performance for peak hours',
          'Consider load balancing',
          'Preload frequently accessed data'
        ],
        severity: 'low',
        metadata: {
          peakHours: timeDistribution.peakHours,
          usagePattern: timeDistribution.pattern
        }
      });
    }

    return patterns;
  }

  private async recognizeErrorPatterns(
    interactions: UserInteraction[],
    existingPatterns: BehavioralPattern[]
  ): Promise<PatternRecognitionResult[]> {
    const patterns: PatternRecognitionResult[] = [];
    
    const errorInteractions = interactions.filter(i => i.interaction_type === 'error');
    
    if (errorInteractions.length > 0) {
      const errorGroups = this.groupErrorsByContext(errorInteractions);
      
      for (const [context, errors] of Object.entries(errorGroups)) {
        if (errors.length > 2) {
          patterns.push({
            patternId: `error_${context}`,
            patternType: 'error_pattern',
            confidence: 0.85,
            description: `Recurring errors in ${context}`,
            recommendations: [
              'Investigate error root cause',
              'Improve user guidance',
              'Add validation checks'
            ],
            severity: 'high',
            metadata: {
              context,
              errorCount: errors.length,
              errorTypes: errors.map(e => e.metadata?.error_type).filter(Boolean)
            }
          });
        }
      }
    }

    return patterns;
  }

  private async recognizeEfficiencyPatterns(
    interactions: UserInteraction[],
    existingPatterns: BehavioralPattern[]
  ): Promise<PatternRecognitionResult[]> {
    const patterns: PatternRecognitionResult[] = [];
    
    // Analyze task completion efficiency
    const taskEfficiency = this.analyzeTaskEfficiency(interactions);
    
    if (taskEfficiency.averageCompletionTime > taskEfficiency.benchmark * 1.5) {
      patterns.push({
        patternId: 'efficiency_low',
        patternType: 'efficiency_concern',
        confidence: 0.75,
        description: 'Tasks taking longer than expected to complete',
        recommendations: [
          'Simplify complex workflows',
          'Provide better user guidance',
          'Implement automation where possible'
        ],
        severity: 'medium',
        metadata: {
          averageTime: taskEfficiency.averageCompletionTime,
          benchmark: taskEfficiency.benchmark,
          slowestTasks: taskEfficiency.slowestTasks
        }
      });
    }

    return patterns;
  }

  private async recognizeLearningPatterns(
    interactions: UserInteraction[],
    existingPatterns: BehavioralPattern[]
  ): Promise<PatternRecognitionResult[]> {
    const patterns: PatternRecognitionResult[] = [];
    
    // Analyze learning curve
    const learningProgress = this.analyzeLearningProgress(interactions);
    
    if (learningProgress.isImproving) {
      patterns.push({
        patternId: 'learning_positive',
        patternType: 'learning_behavior',
        confidence: 0.8,
        description: 'User showing positive learning progression',
        recommendations: [
          'Introduce advanced features gradually',
          'Provide challenging tasks',
          'Offer advanced training materials'
        ],
        severity: 'low',
        metadata: {
          improvementRate: learningProgress.improvementRate,
          skillAreas: learningProgress.improvingSkills
        }
      });
    }

    return patterns;
  }

  // Helper methods for data analysis
  private async getRecentInteractions(
    userId: string,
    tenantId?: string,
    days: number = 30
  ): Promise<UserInteraction[]> {
    try {
      let query = supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(interaction => ({
        ...interaction,
        context: interaction.context as Record<string, any>,
        metadata: interaction.metadata as Record<string, any>
      })) as UserInteraction[];
    } catch (error) {
      console.error('Error fetching interactions:', error);
      return [];
    }
  }

  private async getExistingPatterns(
    userId: string,
    tenantId?: string
  ): Promise<BehavioralPattern[]> {
    try {
      let query = supabase
        .from('behavioral_patterns')
        .select('*')
        .eq('user_id', userId);

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(pattern => ({
        ...pattern,
        pattern_data: pattern.pattern_data as Record<string, any>
      })) as BehavioralPattern[];
    } catch (error) {
      console.error('Error fetching existing patterns:', error);
      return [];
    }
  }

  private extractNavigationSequences(interactions: UserInteraction[]): unknown[] {
    // Implementation for extracting navigation sequences
    const sequences: unknown[] = [];
    // ... complex sequence analysis logic
    return sequences;
  }

  private analyzeTimeDistribution(interactions: UserInteraction[]): unknown {
    const hourCounts: Record<number, number> = {};
    
    interactions.forEach(interaction => {
      const hour = new Date(interaction.created_at).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const peakHours = Object.entries(hourCounts)
      .filter(([, count]) => count > 5)
      .map(([hour]) => parseInt(hour));

    return {
      peakHours,
      pattern: hourCounts
    };
  }

  private groupErrorsByContext(errorInteractions: UserInteraction[]): Record<string, UserInteraction[]> {
    const groups: Record<string, UserInteraction[]> = {};
    
    errorInteractions.forEach(interaction => {
      const context = interaction.context?.module || 'unknown';
      if (!groups[context]) {
        groups[context] = [];
      }
      groups[context].push(interaction);
    });

    return groups;
  }

  private analyzeTaskEfficiency(interactions: UserInteraction[]): unknown {
    // Simplified task efficiency analysis
    const taskCompletions = interactions.filter(i => i.interaction_type === 'task_completion');
    const averageTime = taskCompletions.length > 0 ? 
      taskCompletions.reduce((sum, task) => sum + (task.metadata?.duration || 0), 0) / taskCompletions.length : 0;

    return {
      averageCompletionTime: averageTime,
      benchmark: 30000, // 30 seconds benchmark
      slowestTasks: taskCompletions
        .filter(task => (task.metadata?.duration || 0) > 60000)
        .map(task => task.context?.action)
    };
  }

  private analyzeLearningProgress(interactions: UserInteraction[]): unknown {
    // Simplified learning progress analysis
    const recentInteractions = interactions.slice(0, 50);
    const olderInteractions = interactions.slice(50, 100);

    const recentSuccessRate = this.calculateSuccessRate(recentInteractions);
    const olderSuccessRate = this.calculateSuccessRate(olderInteractions);

    return {
      isImproving: recentSuccessRate > olderSuccessRate,
      improvementRate: recentSuccessRate - olderSuccessRate,
      improvingSkills: ['navigation', 'task_completion']
    };
  }

  private calculateSuccessRate(interactions: UserInteraction[]): number {
    const successfulInteractions = interactions.filter(i => 
      i.interaction_type !== 'error' && i.metadata?.success !== false
    );
    
    return interactions.length > 0 ? successfulInteractions.length / interactions.length : 0;
  }

  // Workflow inefficiency detection methods
  private async detectBottlenecks(interactions: UserInteraction[]): Promise<WorkflowInefficiency[]> {
    // Implementation for detecting workflow bottlenecks
    return [];
  }

  private async detectRedundancies(interactions: UserInteraction[]): Promise<WorkflowInefficiency[]> {
    // Implementation for detecting redundant actions
    return [];
  }

  private async detectDelays(interactions: UserInteraction[]): Promise<WorkflowInefficiency[]> {
    // Implementation for detecting delays
    return [];
  }

  private async detectErrorProneAreas(interactions: UserInteraction[]): Promise<WorkflowInefficiency[]> {
    // Implementation for detecting error-prone areas
    return [];
  }

  // Predictive insight generation methods
  private async predictPerformanceTrends(
    interactions: UserInteraction[],
    patterns: PatternRecognitionResult[]
  ): Promise<PredictiveInsight[]> {
    // Implementation for performance predictions
    return [];
  }

  private async predictBehaviorChanges(
    interactions: UserInteraction[],
    patterns: PatternRecognitionResult[]
  ): Promise<PredictiveInsight[]> {
    // Implementation for behavior predictions
    return [];
  }

  private async predictUsagePatterns(
    interactions: UserInteraction[],
    patterns: PatternRecognitionResult[]
  ): Promise<PredictiveInsight[]> {
    // Implementation for usage predictions
    return [];
  }

  private async predictRisks(
    interactions: UserInteraction[],
    patterns: PatternRecognitionResult[]
  ): Promise<PredictiveInsight[]> {
    // Implementation for risk predictions
    return [];
  }
}

export const advancedPatternRecognitionService = new AdvancedPatternRecognitionService();
