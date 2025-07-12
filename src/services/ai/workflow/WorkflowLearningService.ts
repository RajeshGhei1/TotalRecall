
export interface WorkflowLearningData {
  workflowId: string;
  userId: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  steps: WorkflowStepData[];
  outcome: 'completed' | 'abandoned' | 'error';
  userFeedback?: UserFeedback;
  context: Record<string, unknown>;
}

export interface WorkflowStepData {
  stepId: string;
  stepType: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  interactions: StepInteraction[];
  errors: StepError[];
  outcome: 'completed' | 'skipped' | 'error' | 'abandoned';
}

export interface StepInteraction {
  type: 'click' | 'input' | 'focus' | 'scroll' | 'hover';
  target: string;
  timestamp: Date;
  value?: any;
}

export interface StepError {
  type: string;
  message: string;
  timestamp: Date;
  context: Record<string, unknown>;
}

export interface UserFeedback {
  rating: number; // 1-5
  difficulty: number; // 1-5
  comments?: string;
  suggestions?: string;
}

export interface WorkflowPattern {
  id: string;
  name: string;
  description: string;
  pattern: PatternDefinition;
  confidence: number;
  occurrences: number;
  impact: 'positive' | 'negative' | 'neutral';
  lastSeen: Date;
}

export interface PatternDefinition {
  conditions: PatternCondition[];
  outcomes: PatternOutcome[];
}

export interface PatternCondition {
  field: string;
  operator: string;
  value: unknown;
  weight: number;
}

export interface PatternOutcome {
  metric: string;
  value: unknown;
  probability: number;
}

class WorkflowLearningService {
  private learningData: WorkflowLearningData[] = [];
  private patterns: WorkflowPattern[] = [];

  async recordWorkflowExecution(data: WorkflowLearningData): Promise<void> {
    // Store learning data
    this.learningData.push(data);
    
    // Trigger pattern analysis if we have enough data
    if (this.learningData.length % 10 === 0) {
      await this.analyzePatterns();
    }
    
    console.log('Recorded workflow execution:', data.workflowId);
  }

  async analyzePatterns(): Promise<WorkflowPattern[]> {
    const newPatterns: WorkflowPattern[] = [];
    
    // Analyze completion patterns
    const completionPatterns = this.analyzeCompletionPatterns();
    newPatterns.push(...completionPatterns);
    
    // Analyze time-based patterns
    const timePatterns = this.analyzeTimePatterns();
    newPatterns.push(...timePatterns);
    
    // Analyze user behavior patterns
    const behaviorPatterns = this.analyzeBehaviorPatterns();
    newPatterns.push(...behaviorPatterns);
    
    // Analyze error patterns
    const errorPatterns = this.analyzeErrorPatterns();
    newPatterns.push(...errorPatterns);
    
    // Update our patterns database
    this.updatePatterns(newPatterns);
    
    return this.patterns;
  }

  private analyzeCompletionPatterns(): WorkflowPattern[] {
    const patterns: WorkflowPattern[] = [];
    
    // Group by workflow completion status
    const completedWorkflows = this.learningData.filter(d => d.outcome === 'completed');
    const abandonedWorkflows = this.learningData.filter(d => d.outcome === 'abandoned');
    
    if (completedWorkflows.length > 5) {
      // Analyze what leads to successful completion
      const successFactors = this.identifySuccessFactors(completedWorkflows);
      
      patterns.push({
        id: `pattern_completion_${Date.now()}`,
        name: 'High Completion Rate Pattern',
        description: 'Conditions that lead to higher workflow completion rates',
        pattern: {
          conditions: successFactors.map(factor => ({
            field: factor.field,
            operator: 'greater_than',
            value: factor.threshold,
            weight: factor.importance
          })),
          outcomes: [{
            metric: 'completion_rate',
            value: 0.8,
            probability: 0.85
          }]
        },
        confidence: 0.8,
        occurrences: completedWorkflows.length,
        impact: 'positive',
        lastSeen: new Date()
      });
    }

    if (abandonedWorkflows.length > 3) {
      // Analyze abandonment patterns
      const abandonmentFactors = this.identifyAbandonmentFactors(abandonedWorkflows);
      
      patterns.push({
        id: `pattern_abandonment_${Date.now()}`,
        name: 'High Abandonment Risk Pattern',
        description: 'Conditions that lead to workflow abandonment',
        pattern: {
          conditions: abandonmentFactors.map(factor => ({
            field: factor.field,
            operator: 'greater_than',
            value: factor.threshold,
            weight: factor.importance
          })),
          outcomes: [{
            metric: 'abandonment_rate',
            value: 0.6,
            probability: 0.75
          }]
        },
        confidence: 0.75,
        occurrences: abandonedWorkflows.length,
        impact: 'negative',
        lastSeen: new Date()
      });
    }
    
    return patterns;
  }

  private analyzeTimePatterns(): WorkflowPattern[] {
    const patterns: WorkflowPattern[] = [];
    
    // Analyze execution times
    const executionTimes = this.learningData
      .filter(d => d.endTime)
      .map(d => ({
        duration: d.endTime!.getTime() - d.startTime.getTime(),
        outcome: d.outcome,
        stepCount: d.steps.length
      }));

    if (executionTimes.length > 10) {
      const avgDuration = executionTimes.reduce((sum, t) => sum + t.duration, 0) / executionTimes.length;
      const fastExecutions = executionTimes.filter(t => t.duration < avgDuration * 0.7);
      
      if (fastExecutions.length > 3) {
        patterns.push({
          id: `pattern_fast_execution_${Date.now()}`,
          name: 'Fast Execution Pattern',
          description: 'Conditions that lead to faster workflow execution',
          pattern: {
            conditions: [{
              field: 'step_count',
              operator: 'less_than',
              value: fastExecutions.reduce((sum, e) => sum + e.stepCount, 0) / fastExecutions.length,
              weight: 0.8
            }],
            outcomes: [{
              metric: 'execution_time',
              value: avgDuration * 0.7,
              probability: 0.8
            }]
          },
          confidence: 0.8,
          occurrences: fastExecutions.length,
          impact: 'positive',
          lastSeen: new Date()
        });
      }
    }
    
    return patterns;
  }

  private analyzeBehaviorPatterns(): WorkflowPattern[] {
    const patterns: WorkflowPattern[] = [];
    
    // Analyze user interaction patterns
    const allInteractions = this.learningData.flatMap(d => 
      d.steps.flatMap(s => s.interactions)
    );
    
    // Group interactions by type
    const interactionTypes = new Map<string, StepInteraction[]>();
    allInteractions.forEach(interaction => {
      if (!interactionTypes.has(interaction.type)) {
        interactionTypes.set(interaction.type, []);
      }
      interactionTypes.get(interaction.type)!.push(interaction);
    });
    
    // Analyze heavy clickers (potential confusion)
    const heavyClickers = this.learningData.filter(d => {
      const totalClicks = d.steps.reduce((sum, step) => 
        sum + step.interactions.filter(i => i.type === 'click').length, 0
      );
      return totalClicks > d.steps.length * 3; // More than 3 clicks per step on average
    });
    
    if (heavyClickers.length > 2) {
      patterns.push({
        id: `pattern_confusion_${Date.now()}`,
        name: 'User Confusion Pattern',
        description: 'High interaction count indicating user confusion',
        pattern: {
          conditions: [{
            field: 'clicks_per_step',
            operator: 'greater_than',
            value: 3,
            weight: 0.9
          }],
          outcomes: [{
            metric: 'confusion_level',
            value: 'high',
            probability: 0.8
          }]
        },
        confidence: 0.8,
        occurrences: heavyClickers.length,
        impact: 'negative',
        lastSeen: new Date()
      });
    }
    
    return patterns;
  }

  private analyzeErrorPatterns(): WorkflowPattern[] {
    const patterns: WorkflowPattern[] = [];
    
    // Collect all errors
    const allErrors = this.learningData.flatMap(d => 
      d.steps.flatMap(s => s.errors)
    );
    
    // Group errors by type
    const errorTypes = new Map<string, StepError[]>();
    allErrors.forEach(error => {
      if (!errorTypes.has(error.type)) {
        errorTypes.set(error.type, []);
      }
      errorTypes.get(error.type)!.push(error);
    });
    
    // Identify frequent error patterns
    errorTypes.forEach((errors, errorType) => {
      if (errors.length > 3) {
        patterns.push({
          id: `pattern_error_${errorType}_${Date.now()}`,
          name: `${errorType} Error Pattern`,
          description: `Recurring ${errorType} errors in workflow execution`,
          pattern: {
            conditions: [{
              field: 'error_context',
              operator: 'contains',
              value: errorType,
              weight: 1.0
            }],
            outcomes: [{
              metric: 'error_probability',
              value: errors.length / this.learningData.length,
              probability: 0.9
            }]
          },
          confidence: 0.85,
          occurrences: errors.length,
          impact: 'negative',
          lastSeen: new Date()
        });
      }
    });
    
    return patterns;
  }

  private identifySuccessFactors(completedWorkflows: WorkflowLearningData[]): Array<{
    field: string;
    threshold: number;
    importance: number;
  }> {
    // Analyze what completed workflows have in common
    return [
      {
        field: 'step_completion_rate',
        threshold: 0.9,
        importance: 0.9
      },
      {
        field: 'average_step_duration',
        threshold: 30000, // 30 seconds
        importance: 0.7
      },
      {
        field: 'user_feedback_rating',
        threshold: 3.5,
        importance: 0.8
      }
    ];
  }

  private identifyAbandonmentFactors(abandonedWorkflows: WorkflowLearningData[]): Array<{
    field: string;
    threshold: number;
    importance: number;
  }> {
    // Analyze what abandoned workflows have in common
    return [
      {
        field: 'step_error_count',
        threshold: 2,
        importance: 0.9
      },
      {
        field: 'total_duration',
        threshold: 300000, // 5 minutes
        importance: 0.8
      },
      {
        field: 'interaction_complexity',
        threshold: 20,
        importance: 0.7
      }
    ];
  }

  private updatePatterns(newPatterns: WorkflowPattern[]): void {
    // Merge new patterns with existing ones
    newPatterns.forEach(newPattern => {
      const existingIndex = this.patterns.findIndex(p => p.name === newPattern.name);
      if (existingIndex >= 0) {
        // Update existing pattern
        this.patterns[existingIndex] = {
          ...this.patterns[existingIndex],
          confidence: (this.patterns[existingIndex].confidence + newPattern.confidence) / 2,
          occurrences: this.patterns[existingIndex].occurrences + newPattern.occurrences,
          lastSeen: newPattern.lastSeen
        };
      } else {
        // Add new pattern
        this.patterns.push(newPattern);
      }
    });
  }

  async getPredictions(workflowContext: Record<string, unknown>): Promise<Array<{
    metric: string;
    prediction: any;
    confidence: number;
    basedOnPattern: string;
  }>> {
    const predictions: Array<{
      metric: string;
      prediction: any;
      confidence: number;
      basedOnPattern: string;
    }> = [];
    
    // Match context against patterns
    this.patterns.forEach(pattern => {
      const matchScore = this.calculatePatternMatch(pattern, workflowContext);
      
      if (matchScore > 0.6) {
        pattern.pattern.outcomes.forEach(outcome => {
          predictions.push({
            metric: outcome.metric,
            prediction: outcome.value,
            confidence: matchScore * outcome.probability,
            basedOnPattern: pattern.name
          });
        });
      }
    });
    
    return predictions.sort((a, b) => b.confidence - a.confidence);
  }

  private calculatePatternMatch(pattern: WorkflowPattern, context: Record<string, unknown>): number {
    let totalWeight = 0;
    let matchedWeight = 0;
    
    pattern.pattern.conditions.forEach(condition => {
      totalWeight += condition.weight;
      
      const contextValue = context[condition.field];
      if (this.evaluateCondition(condition, contextValue)) {
        matchedWeight += condition.weight;
      }
    });
    
    return totalWeight > 0 ? matchedWeight / totalWeight : 0;
  }

  private evaluateCondition(condition: PatternCondition, value: unknown): boolean {
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'greater_than':
        return value > condition.value;
      case 'less_than':
        return value < condition.value;
      case 'contains':
        return String(value).includes(condition.value);
      default:
        return false;
    }
  }

  async getInsights(workflowId?: string): Promise<Array<{
    type: 'optimization' | 'warning' | 'suggestion';
    title: string;
    description: string;
    confidence: number;
    impact: 'high' | 'medium' | 'low';
  }>> {
    const insights = [];
    
    // Generate insights based on learned patterns
    const negativePatterns = this.patterns.filter(p => p.impact === 'negative');
    const positivePatterns = this.patterns.filter(p => p.impact === 'positive');
    
    if (negativePatterns.length > 0) {
      insights.push({
        type: 'warning' as const,
        title: 'Potential Issues Detected',
        description: `${negativePatterns.length} negative patterns identified that may impact workflow performance`,
        confidence: 0.8,
        impact: 'high' as const
      });
    }
    
    if (positivePatterns.length > 0) {
      insights.push({
        type: 'optimization' as const,
        title: 'Optimization Opportunities',
        description: `${positivePatterns.length} positive patterns found that could be leveraged for improvement`,
        confidence: 0.85,
        impact: 'medium' as const
      });
    }
    
    return insights;
  }
}

export const workflowLearningService = new WorkflowLearningService();
